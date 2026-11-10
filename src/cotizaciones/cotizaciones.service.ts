import { SelloSnapshotService } from '../sellos/sello-snapshot.service.js';
import { siguienteConsecutivo } from '../documentos/consecutivo.js';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import type { DataSource, Repository } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto.js';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto.js';
import { ClientesService } from '../clientes/clientes.service.js';
import { TipoServicioCotizacion } from './entities/tipo-servicio.enum.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { FormatoResolverService } from '../formatos-documentales/formato-resolver.service.js';
import {
  PDF_RENDERER_VERSION,
  rendererVersionFor,
  PdfGeneratorService,
} from '../pdf/pdf-generator.service.js';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { FormatoVersiones } from '../formatos-documentales/entities/formato-versiones.entity.js';
import { User } from '../users/entities/user.entity.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { quoteWhere, quoteCreationScope } from './quote-access.js';
import { resolveCurrentIva } from '../tasas-fiscales/tasas-fiscales.service.js';
import { ivaAmount } from '../tasas-fiscales/iva-amount.js';

const PREFIXES: Partial<Record<TipoServicioCotizacion, string>> = {
  [TipoServicioCotizacion.INSUMOS]: 'COT-CMI',
  [TipoServicioCotizacion.LAVANDERIA]: 'COT-LAV',
  [TipoServicioCotizacion.FARMACEUTICO]: 'COT-CEMFA',
  [TipoServicioCotizacion.FABRICANTE]: 'COT-CMED',
  [TipoServicioCotizacion.INSTITUCIONAL_ETO]: 'COT-CME',
  [TipoServicioCotizacion.INSTITUCIONAL_VAPOR]: 'COT-CME',
  [TipoServicioCotizacion.INDUSTRIAL_ETO]: 'COT-IND',
};

type CotizacionCreatorSummary = Pick<
  User,
  'id' | 'nombre' | 'apellido' | 'cargo' | 'celular' | 'email_contacto'
>;

type CotizacionListItem = Omit<Cotizacion, 'creador'> & {
  creador: CotizacionCreatorSummary | null;
};

function buildPdfSnapshot(
  quote: Cotizacion,
  version: FormatoVersiones,
  emittedAt: Date,
) {
  const config = version.configuracion_json;
  return {
    documento: {
      tipo: 'COTIZACION',
      consecutivo: quote.consecutivo,
      fecha_emision: emittedAt.toISOString(),
    },
    formato: {
      id: version.id,
      codigo: config.document_code,
      version: version.version,
      fecha_version: version.fecha_version ?? config.version_date ?? null,
      renderer_key: version.renderer_key,
      configuracion_json: config,
    },
    cliente: {
      id: quote.cliente.id,
      razon_social: quote.cliente.razon_social,
      nit: quote.cliente.nit,
      direccion: quote.cliente.direccion,
      contacto: quote.cliente.contacto,
      cargo: quote.cliente.cargo,
      telefono: quote.cliente.telefono,
      email: quote.cliente.email,
      ciudad: quote.cliente.ciudad,
    },
    cotizacion: {
      fecha: quote.fecha,
      tipo_servicio: quote.tipo_servicio,
      items: quote.items.map(
        ({ id, descripcion, cantidad, valor_unitario, valor_total }) => ({
          id,
          descripcion,
          cantidad,
          valor_unitario,
          valor_total,
        }),
      ),
      subtotal: quote.subtotal,
      iva: quote.iva,
      iva_tasa: quote.iva_tasa ?? null,
      iva_version_id: quote.iva_version_id ?? null,
      total: quote.total,
      condiciones_comerciales: quote.condiciones_comerciales,
    },
    reconstruido: false,
  };
}

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionesRepository: Repository<Cotizacion>,
    @InjectRepository(CotizacionItem)
    private readonly itemsRepository: Repository<CotizacionItem>,
    private readonly clientesService: ClientesService,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly formatoResolver: FormatoResolverService,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly auditoriaService: AuditoriaService,
    private readonly selloSnapshot: SelloSnapshotService,
  ) {}

  private prefix(tipo: TipoServicioCotizacion): string {
    return `${PREFIXES[tipo] ?? `COT-${new Date().getFullYear()}`}-`;
  }

  async create(
    dto: CreateCotizacionDto,
    access: PermissionContext,
  ): Promise<Cotizacion> {
    const scopeId = quoteCreationScope(access);
    if (!dto.items?.length)
      throw new BadRequestException(
        'La cotización debe incluir al menos un ítem',
      );
    await this.clientesService.findOne(dto.cliente_id);
    const items = dto.items.map((item) => {
      const cantidad = Number(item.cantidad);
      const valor_unitario = Number(item.valor_unitario);
      const valor_total = Number((cantidad * valor_unitario).toFixed(2));
      return this.itemsRepository.create({
        descripcion: item.descripcion,
        cantidad,
        valor_unitario,
        valor_total,
      });
    });
    const subtotal = Number(
      items.reduce((sum, item) => sum + Number(item.valor_total), 0).toFixed(2),
    );
    const prefix = this.prefix(dto.tipo_servicio);
    const saved = await this.dataSource.transaction(async (manager) => {
      const tax = await resolveCurrentIva(manager);
      if (
        dto.iva_version_esperada_id !== undefined &&
        dto.iva_version_esperada_id !== tax.id
      )
        throw new ConflictException(
          'La tasa de IVA cambió. Revise la previsualización antes de guardar.',
        );
      const iva = ivaAmount(subtotal, tax.tasa);
      const total = Number((subtotal + iva).toFixed(2));
      const sequences = manager.getRepository(SecuenciaConsecutivos);
      const name = `cotizacion:${prefix.slice(0, -1)}`;
      let sequence = await sequences.findOne({
        where: { nombre: name },
        lock: { mode: 'pessimistic_write' },
      });
      if (!sequence) {
        sequence = sequences.create({ nombre: name, ultimo_valor: '0' });
        await sequences.save(sequence);
        sequence =
          (await sequences.findOne({
            where: { nombre: name },
            lock: { mode: 'pessimistic_write' },
          })) ?? sequence;
      }
      const { valor: next, numero } = siguienteConsecutivo(
        sequence.ultimo_valor,
      );
      const consecutivo = `${prefix}${numero}`;
      sequence.ultimo_valor = next.toString();
      await sequences.save(sequence);
      const repository = manager.getRepository(Cotizacion);
      const cotizacion = repository.create({
        consecutivo,
        cliente_id: dto.cliente_id,
        creador_id: access.policy.userId,
        scope_id: scopeId,
        tipo_servicio: dto.tipo_servicio,
        condiciones_comerciales: dto.condiciones_comerciales ?? null,
        estado: dto.estado ?? 'Borrador',
        subtotal,
        iva,
        iva_tasa: tax.tasa,
        iva_version_id: tax.id,
        total,
        items,
      });
      return repository.save(cotizacion);
    });
    return this.loadAuthorized(
      this.cotizacionesRepository,
      saved.id,
      access,
      'cotizaciones.crear',
    );
  }

  currentIva() {
    return resolveCurrentIva(this.dataSource.manager);
  }

  async findAll(access: PermissionContext): Promise<CotizacionListItem[]> {
    const cotizaciones = await this.cotizacionesRepository.find({
      where: quoteWhere(access, 'cotizaciones.ver'),
      relations: ['cliente', 'items', 'creador'],
      order: { id: 'DESC' },
    });
    return cotizaciones.map((cotizacion) => ({
      ...cotizacion,
      creador: cotizacion.creador
        ? {
            id: cotizacion.creador.id,
            nombre: cotizacion.creador.nombre,
            apellido: cotizacion.creador.apellido,
            cargo: cotizacion.creador.cargo,
            celular: cotizacion.creador.celular,
            email_contacto: cotizacion.creador.email_contacto,
          }
        : null,
    }));
  }

  private async loadAuthorized(
    repository: Repository<Cotizacion>,
    id: number,
    access: PermissionContext,
    permission: PermissionContext['permission'],
  ): Promise<Cotizacion> {
    const cotizacion = await repository.findOne({
      where: quoteWhere(access, permission, id),
      relations: ['cliente', 'items'],
    });
    if (!cotizacion)
      throw new NotFoundException(`Cotización #${id} no encontrada`);
    return cotizacion;
  }

  findOne(id: number, access: PermissionContext): Promise<Cotizacion> {
    return this.loadAuthorized(
      this.cotizacionesRepository,
      id,
      access,
      'cotizaciones.ver',
    );
  }

  async previsualizar(id: number, access: PermissionContext) {
    const quote = await this.loadAuthorized(
      this.cotizacionesRepository,
      id,
      access,
      'cotizaciones.previsualizar',
    );
    const version = await this.formatoResolver.resolveCotizacion(
      quote.tipo_servicio,
      quote.cliente_id,
      this.dataSource.manager,
    );
    return buildPdfSnapshot(quote, version, quote.fecha);
  }

  async ensurePdfCurrent(
    id: number,
    access: PermissionContext,
  ): Promise<Cotizacion> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Cotizacion);
      const current = await repository.findOne({
        where: quoteWhere(access, 'cotizaciones.descargar', id),
        relations: ['cliente', 'items'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!current)
        throw new NotFoundException(`Cotización #${id} no encontrada`);
      if (!current.fecha_emision) return current;
      const rendererVersion = rendererVersionFor(current.snapshot_datos);
      if (
        current.pdf_url &&
        current.hash_pdf &&
        current.pdf_renderer_version === rendererVersion
      ) {
        try {
          await this.pdfGenerator.getFile(current.pdf_url, current.hash_pdf);
          return current;
        } catch {
          // A missing or altered object is rebuilt from the persisted snapshot below.
        }
      }
      if (!current.pdf_url && !current.snapshot_datos) {
        return current;
      }

      const snapshot =
        current.snapshot_datos ??
        buildPdfSnapshot(
          current,
          await this.formatoResolver.resolveCotizacion(
            current.tipo_servicio,
            current.cliente_id,
            manager,
          ),
          current.fecha_emision ?? current.fecha,
        );
      const previousKey =
        current.pdf_url ?? `cotizaciones/${current.consecutivo}.pdf`;
      const storageKey =
        current.pdf_renderer_version === rendererVersion
          ? previousKey
          : previousKey.replace(/\.pdf$/, `-${rendererVersion}.pdf`);
      const result = await this.pdfGenerator.generate(snapshot, storageKey);
      current.pdf_url = result.storageKey;
      current.hash_pdf = result.hash;
      current.pdf_renderer_version = rendererVersion;
      try {
        return await repository.save(current);
      } catch (error) {
        await this.pdfGenerator.remove(result.storageKey);
        throw error;
      }
    });
  }

  async emitir(id: number, access: PermissionContext): Promise<Cotizacion> {
    const quote = await this.loadAuthorized(
      this.cotizacionesRepository,
      id,
      access,
      'cotizaciones.emitir',
    );
    if (quote.estado === 'ANULADA')
      throw new ConflictException('No se puede emitir una cotización anulada');
    if (quote.fecha_emision) return quote;
    const storageKey = `cotizaciones/${quote.consecutivo.replace(/[^\w.-]/g, '_')}.pdf`;
    let generated = false;
    try {
      await this.dataSource.transaction(async (manager) => {
        const repo = manager.getRepository(Cotizacion);
        const current = await repo.findOne({
          where: quoteWhere(access, 'cotizaciones.emitir', id),
          relations: ['cliente', 'items'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!current)
          throw new NotFoundException(`Cotización #${id} no encontrada`);
        if (current.estado === 'ANULADA')
          throw new ConflictException('No se puede emitir una cotización anulada');
        if (current.fecha_emision) return;
        const emittedAt = new Date();
        const version = await this.formatoResolver.resolveCotizacion(
          current.tipo_servicio,
          current.cliente_id,
          manager,
        );
        const seal = await this.selloSnapshot.freeze(
          manager,
          access.policy.userId,
        );
        const snapshot = {
          ...buildPdfSnapshot(current, version, emittedAt),
          schema_version: 2,
          sellos: { icontec: seal },
        };
        const result = await this.pdfGenerator.generate(
          snapshot,
          storageKey,
          manager,
        );
        current.sello_icontec_version_id = seal.version_id;
        generated = true;
        current.version_formato_id = version.id;
        current.snapshot_datos = snapshot;
        current.fecha_emision = emittedAt;
        current.pdf_url = result.storageKey;
        current.hash_pdf = result.hash;
        current.pdf_renderer_version = PDF_RENDERER_VERSION;
        await repo.save(current);
        await this.auditoriaService.create(
          {
            usuario_id: access.policy.userId,
            entidad: 'cotizaciones',
            entidad_id: current.id,
            accion: AccionAuditoria.EMITIR,
            detalle: {
              consecutivo: current.consecutivo,
              version_formato_id: version.id,
              hash_pdf: result.hash,
            },
          },
          manager,
        );
      });
    } catch (error) {
      if (generated) await this.pdfGenerator.remove(storageKey);
      throw error;
    }
    const emitted = await this.loadAuthorized(
      this.cotizacionesRepository,
      id,
      access,
      'cotizaciones.emitir',
    );
    if (!emitted.fecha_emision)
      throw new ConflictException('La cotización no pudo emitirse');
    return emitted;
  }

  async aprobar(
    id: number,
    version: number,
    access: PermissionContext,
  ): Promise<Cotizacion> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Cotizacion);
      const quote = await repository.findOne({
        where: quoteWhere(access, 'cotizaciones.editar', id),
        lock: { mode: 'pessimistic_write' },
      });
      if (!quote)
        throw new NotFoundException(`Cotización #${id} no encontrada`);
      if (
        quote.fecha_emision ||
        quote.estado.toUpperCase() !== 'BORRADOR' ||
        quote.version !== version
      )
        throw new ConflictException(
          'El borrador cambió o ya no se puede aprobar',
        );
      quote.estado = 'APROBADA';
      quote.version += 1;
      return repository.save(quote);
    });
  }

  async update(
    id: number,
    dto: UpdateCotizacionDto,
    access: PermissionContext,
  ): Promise<Cotizacion> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Cotizacion);
      const cotizacion = await repository.findOne({
        where: quoteWhere(access, 'cotizaciones.editar', id),
        relations: ['cliente', 'items'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!cotizacion)
        throw new NotFoundException(`Cotización #${id} no encontrada`);
      if (
        cotizacion.fecha_emision ||
        cotizacion.estado.toUpperCase() !== 'BORRADOR'
      )
        throw new ConflictException(
          'Solo se pueden editar cotizaciones en BORRADOR sin fecha de emisión',
        );
      if (dto.version !== cotizacion.version)
        throw new ConflictException(
          'La cotización cambió. Recargue el borrador antes de guardar.',
        );
      if (dto.cliente_id !== undefined) {
        await this.clientesService.findOne(dto.cliente_id);
        cotizacion.cliente_id = dto.cliente_id;
        // Avoid persisting the previous relation over the new foreign key.
        cotizacion.cliente = undefined as never;
      }
      if (dto.tipo_servicio !== undefined)
        cotizacion.tipo_servicio = dto.tipo_servicio;
      if (dto.condiciones_comerciales !== undefined)
        cotizacion.condiciones_comerciales = dto.condiciones_comerciales;
      if (dto.items !== undefined) {
        if (!dto.items.length)
          throw new BadRequestException('Se requiere al menos un ítem');
        if (cotizacion.iva_tasa == null)
          throw new ConflictException(
            'El borrador histórico no tiene tasa fiscal conciliada',
          );
        const itemsRepository = manager.getRepository(CotizacionItem);
        const items = dto.items.map((item) =>
          itemsRepository.create({
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            valor_unitario: item.valor_unitario,
            valor_total: Number(
              (item.cantidad * item.valor_unitario).toFixed(2),
            ),
          }),
        );
        cotizacion.subtotal = Number(
          items
            .reduce((sum, item) => sum + Number(item.valor_total), 0)
            .toFixed(2),
        );
        cotizacion.iva = ivaAmount(cotizacion.subtotal, cotizacion.iva_tasa);
        cotizacion.total = Number(
          (cotizacion.subtotal + cotizacion.iva).toFixed(2),
        );
        if (!Number.isFinite(cotizacion.total) || cotizacion.total >= 1e12)
          throw new BadRequestException('El total supera el importe permitido');
        await itemsRepository.delete({ cotizacion_id: id });
        cotizacion.items = items;
      }
      cotizacion.version += 1;
      await repository.save(cotizacion);
      return this.loadAuthorized(repository, id, access, 'cotizaciones.editar');
    });
  }

  async remove(
    id: number,
    access: PermissionContext,
  ): Promise<{ message: string }> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Cotizacion);
      const cotizacion = await repository.findOne({
        where: quoteWhere(access, 'cotizaciones.eliminar', id),
        lock: { mode: 'pessimistic_write' },
      });
      if (!cotizacion)
        throw new NotFoundException(`Cotización #${id} no encontrada`);
      if (cotizacion.fecha_emision)
        throw new ConflictException(
          'No se puede eliminar una cotización emitida',
        );
      await repository.remove(cotizacion);
      return { message: `Cotización #${id} eliminada` };
    });
  }
}
