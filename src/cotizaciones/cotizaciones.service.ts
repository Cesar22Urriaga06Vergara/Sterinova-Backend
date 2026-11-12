import { SelloSnapshotService } from '../sellos/sello-snapshot.service.js';
import { siguienteConsecutivo } from '../documentos/consecutivo.js';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import type { DataSource, Repository } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { Producto } from '../productos/entities/producto.entity.js';
import { buildCotizacionItem } from './cotizacion-item-builder.js';
import {
  CotizacionItemImageService,
  type UploadedQuoteItemImage,
} from './cotizacion-item-image.service.js';
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
  imageSources: ReadonlyMap<number, string> = new Map(),
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
        ({
          id,
          producto_id,
          tipo_item,
          categoria,
          codigo,
          referencia,
          metodo,
          presentacion,
          marca,
          descripcion,
          unidad,
          precision_cantidad,
          cantidad,
          valor_unitario,
          valor_total,
        }) => ({
          id,
          producto_id,
          tipo_item,
          categoria,
          codigo,
          referencia,
          metodo,
          presentacion,
          marca,
          descripcion,
          unidad,
          precision_cantidad,
          cantidad,
          valor_unitario,
          valor_total,
          imagen_src:
            quote.tipo_servicio === TipoServicioCotizacion.INSUMOS
              ? (imageSources.get(id) ?? null)
              : null,
        }),
      ),
      subtotal: quote.subtotal,
      iva: quote.iva,
      iva_tasa: quote.iva_tasa ?? null,
      iva_version_id: quote.iva_version_id ?? null,
      total: quote.total,
      condiciones_comerciales: quote.condiciones_comerciales,
      tiempo_despacho: quote.tiempo_despacho,
      transporte: quote.transporte,
      forma_pago: quote.forma_pago,
      validez_oferta: quote.validez_oferta,
      precio_incluye: quote.precio_incluye,
      precio_no_incluye: quote.precio_no_incluye,
    },
    reconstruido: false,
  };
}

@Injectable()
export class CotizacionesService {
  private readonly logger = new Logger(CotizacionesService.name);

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
    @Optional()
    private readonly cotizacionItemImages?: CotizacionItemImageService,
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
    await this.clientesService.findOne(dto.cliente_id, { ...access, policy: {...access.policy, scopeIds: [...new Set([...access.policy.scopeIds, ...access.policy.ownScopeIds])], ownScopeIds: []} });
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
      const itemsRepository = manager.getRepository(CotizacionItem);
      const productosRepository = manager.getRepository(Producto);
      const items: CotizacionItem[] = [];
      for (const item of dto.items) {
        items.push(
          await buildCotizacionItem(item, {
            tipo_servicio: dto.tipo_servicio,
            scope_id: scopeId,
            productos_repository: productosRepository,
            items_repository: itemsRepository,
          }),
        );
      }
      const subtotal = Number(
        items
          .reduce((sum, item) => sum + Number(item.valor_total), 0)
          .toFixed(2),
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
        tiempo_despacho: dto.tiempo_despacho ?? null,
        transporte: dto.transporte ?? null,
        forma_pago: dto.forma_pago ?? null,
        validez_oferta: dto.validez_oferta ?? null,
        precio_incluye: dto.precio_incluye ?? null,
        precio_no_incluye: dto.precio_no_incluye ?? null,
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
    cotizacion.items = [...(cotizacion.items ?? [])].sort((a, b) => a.id - b.id);
    return cotizacion;
  }

  private async itemImageSources(
    quote: Cotizacion,
  ): Promise<Map<number, string>> {
    const sources = new Map<number, string>();
    if (quote.tipo_servicio !== TipoServicioCotizacion.INSUMOS) return sources;
    for (const item of quote.items ?? []) {
      if (!item.imagen_key) continue;
      if (!this.cotizacionItemImages)
        throw new ConflictException(
          'El almacenamiento de imágenes de cotización no está disponible',
        );
      const source = await this.cotizacionItemImages.toDataUri(item);
      if (source && item.id) sources.set(item.id, source);
    }
    return sources;
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
    const snapshot = buildPdfSnapshot(
      quote,
      version,
      quote.fecha,
      await this.itemImageSources(quote),
    );
    const seal = await this.selloSnapshot.preview(this.dataSource.manager);
    return seal ? { ...snapshot, sellos: { icontec: seal } } : snapshot;
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
    this.assertInternallyApproved(quote);
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
        this.assertInternallyApproved(current);
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
          ...buildPdfSnapshot(
            current,
            version,
            emittedAt,
            await this.itemImageSources(current),
          ),
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

  private assertInternallyApproved(quote: Cotizacion): void {
    if (
      (quote.estado ?? '').toString().toUpperCase() !== 'APROBADA' ||
      quote.creador_id == null ||
      quote.aprobador_interno_id == null ||
      quote.aprobado_internamente_at == null ||
      quote.aprobador_interno_id === quote.creador_id
    )
      throw new ConflictException(
        'La cotización debe contar con aprobación interna vigente antes de emitirse',
      );
  }

  private assertApprovalCandidate(
    quote: Cotizacion,
    version: number,
    approverId: number,
  ) {
    if (quote.creador_id == null)
      throw new ForbiddenException(
        'La cotización no tiene creador asociado para aprobarla',
      );
    if (quote.creador_id === approverId)
      throw new ForbiddenException('No puede aprobar su propia cotización');
    if (!Number.isInteger(version) || version < 1)
      throw new BadRequestException('La versión indicada es inválida');
    if (
      quote.fecha_emision ||
      (quote.estado ?? '').toString().toUpperCase() !== 'BORRADOR' ||
      quote.version !== version
    )
      throw new ConflictException(
        'El borrador cambió o ya no se puede aprobar',
      );
  }

  private assertCommercialConditions(quote: Cotizacion): void {
    const requiredConditions = [
      ['TIEMPO DE DESPACHO', quote.tiempo_despacho],
      ['TRANSPORTE', quote.transporte],
      ['FORMA DE PAGO', quote.forma_pago],
      ['VALIDEZ DE LA OFERTA', quote.validez_oferta],
      ['EL PRECIO INCLUYE', quote.precio_incluye],
      ['EL PRECIO NO INCLUYE', quote.precio_no_incluye],
    ] as const;
    const missing = requiredConditions
      .filter(([, value]) => typeof value !== 'string' || !value.trim())
      .map(([label]) => label);
    if (missing.length)
      throw new BadRequestException(
        `Completa las condiciones comerciales antes de aprobar: ${missing.join(', ')}`,
      );
  }

  async aprobar(
    id: number,
    version: number,
    access: PermissionContext,
  ): Promise<Cotizacion> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Cotizacion);
      const quote = await repository.findOne({
        where: quoteWhere(access, 'cotizaciones.aprobar_interna', id),
        lock: { mode: 'pessimistic_write' },
      });
      if (!quote)
        throw new NotFoundException(`Cotización #${id} no encontrada`);
      if (
        quote.scope_id !== null &&
        quote.scope_id !== undefined &&
        !access.resourceScopeIds.includes(quote.scope_id)
      )
        throw new ForbiddenException(
          'No tiene permiso para aprobar cotizaciones de este ámbito',
        );

      this.assertApprovalCandidate(
        quote,
        version,
        access.policy.userId ?? NaN,
      );
      this.assertCommercialConditions(quote);

      quote.estado = 'APROBADA';
      quote.aprobador_interno_id = access.policy.userId!;
      quote.aprobado_internamente_at = new Date();
      quote.version += 1;
      return repository.save(quote);
    });
  }

  private assertImageEditable(quote: Cotizacion): void {
    if (
      quote.fecha_emision ||
      quote.estado.toUpperCase() !== 'BORRADOR'
    )
      throw new ConflictException(
        'Solo se pueden modificar imágenes de cotizaciones en borrador',
      );
    if (quote.tipo_servicio !== TipoServicioCotizacion.INSUMOS)
      throw new BadRequestException(
        'Las imágenes solo aplican a cotizaciones de Insumos',
      );
  }

  private async deleteImageBestEffort(key: string): Promise<void> {
    if (!this.cotizacionItemImages) return;
    try {
      await this.cotizacionItemImages.delete(key);
    } catch (error) {
      this.logger.error(
        `No se pudo limpiar la imagen de cotización ${key}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async uploadItemImage(
    quoteId: number,
    itemId: number,
    file: UploadedQuoteItemImage | undefined,
    access: PermissionContext,
  ): Promise<{ item_id: number; imagen_disponible: true; version: number }> {
    const imageStorage = this.cotizacionItemImages;
    if (!imageStorage)
      throw new ConflictException(
        'El almacenamiento de imágenes de cotización no está disponible',
      );
    if (!file?.buffer?.length)
      throw new BadRequestException('Seleccione una imagen');
    const storageState: {
      uploaded: Awaited<ReturnType<CotizacionItemImageService['save']>> | null;
      previousKey: string | null;
    } = { uploaded: null, previousKey: null };
    try {
      const result = await this.dataSource.transaction(async (manager) => {
        const quoteRepository = manager.getRepository(Cotizacion);
        const quote = await quoteRepository.findOne({
          where: quoteWhere(access, 'cotizaciones.editar', quoteId),
          relations: ['items'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!quote)
          throw new NotFoundException(`Cotización #${quoteId} no encontrada`);
        this.assertImageEditable(quote);
        const item = quote.items.find((candidate) => candidate.id === itemId);
        if (!item)
          throw new NotFoundException(
            `Ítem #${itemId} no pertenece a la cotización`,
          );
        storageState.uploaded = await imageStorage.save(file.buffer);
        storageState.previousKey = item.imagen_key;
        Object.assign(item, storageState.uploaded);
        await manager.getRepository(CotizacionItem).save(item);
        quote.version += 1;
        quote.aprobador_interno_id = null;
        quote.aprobado_internamente_at = null;
        await quoteRepository.save(quote);
        return {
          item_id: item.id,
          imagen_disponible: true as const,
          version: quote.version,
        };
      });
      const { uploaded, previousKey } = storageState;
      if (previousKey && uploaded && previousKey !== uploaded.imagen_key)
        await this.deleteImageBestEffort(previousKey);
      return result;
    } catch (error) {
      const uploaded = storageState.uploaded;
      if (uploaded) await this.deleteImageBestEffort(uploaded.imagen_key);
      throw error;
    }
  }

  async removeItemImage(
    quoteId: number,
    itemId: number,
    access: PermissionContext,
  ): Promise<{ item_id: number; imagen_disponible: false; version: number }> {
    if (!this.cotizacionItemImages)
      throw new ConflictException(
        'El almacenamiento de imágenes de cotización no está disponible',
      );
    let previousKey: string | null = null;
    const result = await this.dataSource.transaction(async (manager) => {
      const quoteRepository = manager.getRepository(Cotizacion);
      const quote = await quoteRepository.findOne({
        where: quoteWhere(access, 'cotizaciones.editar', quoteId),
        relations: ['items'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!quote)
        throw new NotFoundException(`Cotización #${quoteId} no encontrada`);
      this.assertImageEditable(quote);
      const item = quote.items.find((candidate) => candidate.id === itemId);
      if (!item)
        throw new NotFoundException(
          `Ítem #${itemId} no pertenece a la cotización`,
        );
      if (item.imagen_key) {
        previousKey = item.imagen_key;
        item.imagen_key = null;
        item.imagen_sha256 = null;
        item.imagen_mime_type = null;
        item.imagen_tamano_bytes = null;
        await manager.getRepository(CotizacionItem).save(item);
        quote.version += 1;
        quote.aprobador_interno_id = null;
        quote.aprobado_internamente_at = null;
        await quoteRepository.save(quote);
      }
      return {
        item_id: item.id,
        imagen_disponible: false as const,
        version: quote.version,
      };
    });
    if (previousKey) await this.deleteImageBestEffort(previousKey);
    return result;
  }

  async update(
    id: number,
    dto: UpdateCotizacionDto,
    access: PermissionContext,
  ): Promise<Cotizacion> {
    const obsoleteImageKeys: string[] = [];
    const updated = await this.dataSource.transaction(async (manager) => {
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
      const previousTipoServicio = cotizacion.tipo_servicio;
      const previousItems = cotizacion.items ?? [];
      if (
        dto.tipo_servicio !== undefined &&
        dto.tipo_servicio !== previousTipoServicio &&
        dto.items === undefined
      )
        throw new BadRequestException(
          'Incluya nuevamente los ítems al cambiar el tipo de cotización',
        );
      if (dto.cliente_id !== undefined) {
        await this.clientesService.findOne(dto.cliente_id, { ...access, policy: {...access.policy, scopeIds: [...new Set([...access.policy.scopeIds, ...access.policy.ownScopeIds])], ownScopeIds: []} });
        cotizacion.cliente_id = dto.cliente_id;
        // Avoid persisting the previous relation over the new foreign key.
        cotizacion.cliente = undefined as never;
      }
      if (dto.tipo_servicio !== undefined)
        cotizacion.tipo_servicio = dto.tipo_servicio;
      if (dto.condiciones_comerciales !== undefined)
        cotizacion.condiciones_comerciales = dto.condiciones_comerciales;
      if (dto.tiempo_despacho !== undefined)
        cotizacion.tiempo_despacho = dto.tiempo_despacho;
      if (dto.transporte !== undefined)
        cotizacion.transporte = dto.transporte;
      if (dto.forma_pago !== undefined)
        cotizacion.forma_pago = dto.forma_pago;
      if (dto.validez_oferta !== undefined)
        cotizacion.validez_oferta = dto.validez_oferta;
      if (dto.precio_incluye !== undefined)
        cotizacion.precio_incluye = dto.precio_incluye;
      if (dto.precio_no_incluye !== undefined)
        cotizacion.precio_no_incluye = dto.precio_no_incluye;
      if (dto.items !== undefined) {
        if (!dto.items.length)
          throw new BadRequestException('Se requiere al menos un ítem');
        if (cotizacion.iva_tasa == null)
          throw new ConflictException(
            'El borrador histórico no tiene tasa fiscal conciliada',
          );
        const itemsRepository = manager.getRepository(CotizacionItem);
        const productosRepository = manager.getRepository(Producto);
        const items: CotizacionItem[] = [];
        for (const item of dto.items) {
          items.push(
            await buildCotizacionItem(item, {
              tipo_servicio: cotizacion.tipo_servicio,
              scope_id: cotizacion.scope_id,
              productos_repository: productosRepository,
              items_repository: itemsRepository,
              previous_items: previousItems,
              previous_tipo_servicio: previousTipoServicio,
            }),
          );
        }
        const retainedImageKeys = new Set(
          items
            .map((item) => item.imagen_key)
            .filter((key): key is string => Boolean(key)),
        );
        obsoleteImageKeys.push(
          ...previousItems
            .map((item) => item.imagen_key)
            .filter(
              (key): key is string =>
                key !== null && key !== '' && !retainedImageKeys.has(key),
            ),
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
    for (const key of obsoleteImageKeys)
      await this.deleteImageBestEffort(key);
    return updated;
  }

  async remove(
    id: number,
    access: PermissionContext,
  ): Promise<{ message: string }> {
    const imageKeys: string[] = [];
    const result = await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Cotizacion);
      const cotizacion = await repository.findOne({
        where: quoteWhere(access, 'cotizaciones.eliminar', id),
        relations: ['items'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!cotizacion)
        throw new NotFoundException(`Cotización #${id} no encontrada`);
      if (cotizacion.fecha_emision)
        throw new ConflictException(
          'No se puede eliminar una cotización emitida',
        );
      imageKeys.push(
        ...(cotizacion.items ?? [])
          .map((item) => item.imagen_key)
          .filter((key): key is string => Boolean(key)),
      );
      await repository.remove(cotizacion);
      return { message: `Cotización #${id} eliminada` };
    });
    for (const key of imageKeys) await this.deleteImageBestEffort(key);
    return result;
  }
}
