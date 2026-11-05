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
import { PDF_RENDERER_VERSION, PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { FormatoVersiones } from '../formatos-documentales/entities/formato-versiones.entity.js';
import { User } from '../users/entities/user.entity.js';

const IVA_RATE = 0.19;
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

function buildPdfSnapshot(quote: Cotizacion, version: FormatoVersiones, emittedAt: Date) {
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
      items: quote.items.map(({ id, descripcion, cantidad, valor_unitario, valor_total }) => ({
        id,
        descripcion,
        cantidad,
        valor_unitario,
        valor_total,
      })),
      subtotal: quote.subtotal,
      iva: quote.iva,
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
  ) {}

  private prefix(tipo: TipoServicioCotizacion): string {
    return `${PREFIXES[tipo] ?? `COT-${new Date().getFullYear()}`}-`;
  }

  async create(dto: CreateCotizacionDto, creatorId: number | null = null): Promise<Cotizacion> {
    if (!dto.items?.length) throw new BadRequestException('La cotización debe incluir al menos un ítem');
    await this.clientesService.findOne(dto.cliente_id);
    const items = dto.items.map((item) => {
      const cantidad = Number(item.cantidad);
      const valor_unitario = Number(item.valor_unitario);
      const valor_total = Number((cantidad * valor_unitario).toFixed(2));
      return this.itemsRepository.create({ descripcion: item.descripcion, cantidad, valor_unitario, valor_total });
    });
    const subtotal = Number(items.reduce((sum, item) => sum + Number(item.valor_total), 0).toFixed(2));
    const iva = Number((subtotal * IVA_RATE).toFixed(2));
    const total = Number((subtotal + iva).toFixed(2));
    const prefix = this.prefix(dto.tipo_servicio);
    const saved = await this.dataSource.transaction(async (manager) => {
      const sequences = manager.getRepository(SecuenciaConsecutivos);
      const name = `cotizacion:${prefix.slice(0, -1)}`;
      let sequence = await sequences.findOne({ where: { nombre: name }, lock: { mode: 'pessimistic_write' } });
      if (!sequence) {
        sequence = sequences.create({ nombre: name, ultimo_valor: '0' });
        await sequences.save(sequence);
        sequence = await sequences.findOne({ where: { nombre: name }, lock: { mode: 'pessimistic_write' } }) ?? sequence;
      }
      const next = BigInt(sequence.ultimo_valor) + 1n;
      const consecutivo = `${prefix}${next.toString().padStart(3, '0')}`;
      sequence.ultimo_valor = next.toString();
      await sequences.save(sequence);
      const repository = manager.getRepository(Cotizacion);
      const cotizacion = repository.create({
        consecutivo,
        cliente_id: dto.cliente_id,
        creador_id: creatorId,
        tipo_servicio: dto.tipo_servicio,
        condiciones_comerciales: dto.condiciones_comerciales ?? null,
        estado: dto.estado ?? 'Borrador',
        subtotal,
        iva,
        total,
        items,
      });
      return repository.save(cotizacion);
    });
    return this.findOne(saved.id);
  }

  async findAll(): Promise<CotizacionListItem[]> {
    const cotizaciones = await this.cotizacionesRepository.find({
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

  async findOne(id: number): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionesRepository.findOne({ where: { id }, relations: ['cliente', 'items'] });
    if (!cotizacion) throw new NotFoundException(`Cotización #${id} no encontrada`);
    return cotizacion;
  }

  async previsualizar(id: number) {
    const quote = await this.findOne(id);
    const version = await this.formatoResolver.resolveCotizacion(
      quote.tipo_servicio,
      quote.cliente_id,
      this.dataSource.manager,
    );
    return buildPdfSnapshot(quote, version, quote.fecha);
  }

  async ensurePdfCurrent(id: number): Promise<Cotizacion> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Cotizacion);
      const current = await repository.findOne({
        where: { id },
        relations: ['cliente', 'items'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!current) throw new NotFoundException(`Cotización #${id} no encontrada`);
      if (
        !current.pdf_url ||
        current.pdf_renderer_version === PDF_RENDERER_VERSION
      ) {
        return current;
      }

      const snapshot = current.snapshot_datos ?? buildPdfSnapshot(
        current,
        await this.formatoResolver.resolveCotizacion(current.tipo_servicio, current.cliente_id, manager),
        current.fecha_emision ?? current.fecha,
      );
      const storageKey = current.pdf_url.replace(
        /\.pdf$/,
        `-${PDF_RENDERER_VERSION}.pdf`,
      );
      const result = await this.pdfGenerator.generate(snapshot, storageKey);
      current.pdf_url = result.storageKey;
      current.hash_pdf = result.hash;
      current.pdf_renderer_version = PDF_RENDERER_VERSION;
      try {
        return await repository.save(current);
      } catch (error) {
        await this.pdfGenerator.remove(result.storageKey);
        throw error;
      }
    });
  }

  async emitir(id: number, usuarioId: number | null): Promise<Cotizacion> {
    const quote = await this.findOne(id);
    if (quote.fecha_emision) return quote;
    const storageKey = `cotizaciones/${quote.consecutivo.replace(/[^\w.-]/g, '_')}.pdf`;
    let generated = false;
    try {
      await this.dataSource.transaction(async (manager) => {
        const repo = manager.getRepository(Cotizacion);
        const current = await repo.findOne({
          where: { id },
          relations: ['cliente', 'items'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!current) throw new NotFoundException(`Cotización #${id} no encontrada`);
        if (current.fecha_emision) return;
        const emittedAt = new Date();
        const version = await this.formatoResolver.resolveCotizacion(current.tipo_servicio, current.cliente_id, manager);
        const snapshot = buildPdfSnapshot(current, version, emittedAt);
        const result = await this.pdfGenerator.generate(snapshot, storageKey);
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
            usuario_id: usuarioId,
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
    const emitted = await this.findOne(id);
    if (!emitted.fecha_emision) throw new ConflictException('La cotización no pudo emitirse');
    return emitted;
  }

  async update(id: number, dto: UpdateCotizacionDto): Promise<Cotizacion> {
    const cotizacion = await this.findOne(id);
    if (cotizacion.fecha_emision) {
      const keys = Object.keys(dto);
      if (keys.some((key) => key !== 'estado')) throw new ConflictException('Una cotización emitida es inmutable');
    }
    if (dto.cliente_id) await this.clientesService.findOne(dto.cliente_id);
    Object.assign(cotizacion, dto);
    await this.cotizacionesRepository.save(cotizacion);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const cotizacion = await this.findOne(id);
    if (cotizacion.fecha_emision) throw new ConflictException('No se puede eliminar una cotización emitida');
    await this.cotizacionesRepository.remove(cotizacion);
    return { message: `Cotización #${id} eliminada` };
  }
}
