import { resourceWhere, creationScope } from '../rbac/resource-access.js';
import { CotizacionItem } from '../cotizaciones/entities/cotizacion-item.entity.js';
import { EstadoCotizacion } from '../cotizaciones/entities/estado-cotizacion.enum.js';
import {
  detectarDiscrepanciasCantidad,
  prepararMateriales,
  metodoOrden,
} from './materiales-orden.js';
import { UpdateMaterialesOrdenDto } from './dto/update-materiales-orden.dto.js';
import { OrdenServicioMaterial } from '../ordenes-servicio/entities/orden-servicio-material.entity.js';
import {
  EventoOrdenDatos,
  OrdenServicioEvento,
  TipoEventoOrden,
} from '../ordenes-servicio/entities/orden-servicio-evento.entity.js';
import { CicloEsterilizacion, EstadoCicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type EntityManager } from 'typeorm';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { CreateOrdenDto } from './dto/create-orden.dto.js';
import { UpdateEstadoOrdenDto } from './dto/update-estado-orden.dto.js';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { siguienteConsecutivo } from '../documentos/consecutivo.js';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { isDateString } from 'class-validator';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { canAccessResource } from '../rbac/authorization-policy.js';
import { FormatoResolverService } from '../formatos-documentales/formato-resolver.service.js';
import { FormatoVersiones } from '../formatos-documentales/entities/formato-versiones.entity.js';
import { DocumentoEmitido } from './entities/documento-emitido.entity.js';
import { DocumentoEvento } from './entities/documento-evento.entity.js';
import { CreateDocumentoEmitidoDto } from './dto/create-documento-emitido.dto.js';
import { CreateDocumentoEventoDto } from './dto/documento-evento.dto.js';

const EVENTO_POR_ESTADO: Partial<
  Record<EstadoOrdenServicio, TipoEventoOrden>
> = {
  [EstadoOrdenServicio.RECOGIDO]: 'RECOGIDA',
  [EstadoOrdenServicio.EN_PLANTA]: 'RECEPCION_PLANTA',
  [EstadoOrdenServicio.ENTREGADO]: 'ENTREGA_CLIENTE',
};

const TRANSICIONES_ESTADO: Record<
  EstadoOrdenServicio,
  EstadoOrdenServicio[]
> = {
  [EstadoOrdenServicio.PENDIENTE]: [
    EstadoOrdenServicio.EN_RUTA,
    EstadoOrdenServicio.EN_PLANTA,
    EstadoOrdenServicio.CANCELADO,
  ],
  [EstadoOrdenServicio.EN_RUTA]: [
    EstadoOrdenServicio.RECOGIDO,
    EstadoOrdenServicio.CANCELADO,
  ],
  [EstadoOrdenServicio.RECOGIDO]: [
    EstadoOrdenServicio.EN_PLANTA,
    EstadoOrdenServicio.CANCELADO,
  ],
  [EstadoOrdenServicio.EN_PLANTA]: [
    EstadoOrdenServicio.CANCELADO,
  ],
  [EstadoOrdenServicio.PROCESADO]: [EstadoOrdenServicio.ENTREGADO],
  [EstadoOrdenServicio.ENTREGADO]: [],
  [EstadoOrdenServicio.CANCELADO]: [],
};

function validarTransicionEstado(
  estadoActual: EstadoOrdenServicio,
  nuevoEstado: EstadoOrdenServicio,
) {
  if (estadoActual === nuevoEstado) return;

  const permitidos = TRANSICIONES_ESTADO[estadoActual] ?? [];
  if (!permitidos.includes(nuevoEstado)) {
    throw new BadRequestException(
      `Transición de estado no permitida: ${estadoActual} -> ${nuevoEstado}`,
    );
  }
}

@Injectable()
export class LogisticaService {
  constructor(
    @InjectRepository(OrdenServicio)
    private readonly ordenesRepository: Repository<OrdenServicio>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionesRepository: Repository<Cotizacion>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly auditoriaService: AuditoriaService,
    private readonly formatoResolver: FormatoResolverService,
    @InjectRepository(DocumentoEmitido)
    private readonly documentosEmitidosRepository: Repository<DocumentoEmitido>,
    @InjectRepository(DocumentoEvento)
    private readonly documentosEventosRepository: Repository<DocumentoEvento>,
  ) {}

  async createOrden(
    dto: CreateOrdenDto,
    usuarioId: number | null = null, access?: PermissionContext): Promise<OrdenServicio> {
    // DATE stores a civil day: never truncate timestamps or shift time zones.
    if (
      typeof dto.fecha_programada !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dto.fecha_programada) ||
      !isDateString(dto.fecha_programada, { strict: true })
    ) {
      throw new BadRequestException(
        'La fecha programada debe ser una fecha válida en formato YYYY-MM-DD, sin hora ni zona horaria',
      );
    }
    const saved = await this.dataSource.transaction(async (manager) => {
      const quotes = manager.getRepository(Cotizacion);
      const orders = manager.getRepository(OrdenServicio);
      const cotizacion = await quotes.findOne({
        where: access
          ? resourceWhere<Cotizacion>(access, { id: dto.cotizacion_id })
          : { id: dto.cotizacion_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!cotizacion) throw new NotFoundException('Cotización no encontrada');
      if (cotizacion.estado !== EstadoCotizacion.ACEPTADA_CLIENTE) {
        throw new BadRequestException(
          'Solo se pueden generar órdenes desde cotizaciones ACEPTADA_CLIENTE (aceptadas por el cliente)',
        );
      }
      if (!dto.orden_compra_cliente?.trim()) {
        throw new BadRequestException(
          'La Orden de Compra del cliente es obligatoria para crear la orden',
        );
      }
      const [orderFormat, actaFormat] = await Promise.all([
        this.formatoResolver.resolveOrdenServicio(manager),
        this.formatoResolver.resolveActaServicio(manager),
      ]);
      const year = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        timeZone: 'America/Bogota',
      }).format(new Date());
      const name = `orden_servicio:${year}`;
      // Atomic initialization also serializes the first requests of a new year.
      await manager.query(
        'INSERT INTO secuencias_consecutivos (nombre, ultimo_valor) VALUES (?, 0) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)',
        [name],
      );
      const sequences = manager.getRepository(SecuenciaConsecutivos);
      const sequence = await sequences.findOne({
        where: { nombre: name },
        lock: { mode: 'pessimistic_write' },
      });
      if (!sequence)
        throw new Error('No se pudo inicializar la secuencia de órdenes');
      // Preserve the existing four-digit minimum for OS. COT/CER retain three.
      const { valor, numero } = siguienteConsecutivo(sequence.ultimo_valor, 4);
      // Explicit UPDATE avoids save() deciding to INSERT from an older
      // REPEATABLE READ snapshot during the first concurrent allocations.
      await manager.query(
        'UPDATE secuencias_consecutivos SET ultimo_valor = ? WHERE nombre = ?',
        [valor.toString(), name],
      );
      const actaSequenceName = `acta_servicio:${year}`;
      await manager.query(
        'INSERT INTO secuencias_consecutivos (nombre, ultimo_valor) VALUES (?, 0) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)',
        [actaSequenceName],
      );
      const actaSequence = await sequences.findOne({
        where: { nombre: actaSequenceName },
        lock: { mode: 'pessimistic_write' },
      });
      if (!actaSequence)
        throw new Error('No se pudo inicializar la secuencia de actas');
      const actaConsecutivo = siguienteConsecutivo(
        actaSequence.ultimo_valor,
        4,
      );
      await manager.query(
        'UPDATE secuencias_consecutivos SET ultimo_valor = ? WHERE nombre = ?',
        [actaConsecutivo.valor.toString(), actaSequenceName],
      );
      const items = await manager
        .getRepository(CotizacionItem)
        .find({ where: { cotizacion_id: dto.cotizacion_id } });
      const materiales = prepararMateriales(dto.materiales ?? [], items);
      // One quote may serve several orders (sedes or partial deliveries), but
      // the contracted quantity is never allocated twice (hoja de ruta D15).
      await this.assertSaldoDisponible(
        manager,
        dto.cotizacion_id,
        items,
        materiales,
      );
      const discrepancias = detectarDiscrepanciasCantidad(items, materiales);
      const savedOrder = await orders.save(
        orders.create({
          metodo_esterilizacion: metodoOrden(
            cotizacion.tipo_servicio,
            dto.metodo_esterilizacion,
          ),
          consecutivo: `OS-${year}-${numero}`,
          cotizacion_id: dto.cotizacion_id,
          scope_id: access ? creationScope(access, cotizacion.scope_id) : cotizacion.scope_id,
          creador_id: usuarioId,
          fecha_programada: dto.fecha_programada,
          estado: EstadoOrdenServicio.PENDIENTE,
          acta_consecutivo: `AS-${year}-${actaConsecutivo.numero}`,
          formato_orden_version_id: orderFormat.id,
          formato_acta_version_id: actaFormat.id,
          orden_compra_cliente: dto.orden_compra_cliente.trim(),
          conductor_asignado: dto.conductor_asignado ?? null,
          vehiculo_placa: dto.vehiculo_placa ?? null,
          observaciones: dto.observaciones ?? null,
        }),
      );
      if (materiales.length)
        await manager.getRepository(OrdenServicioMaterial).insert(
          materiales.map((material) => ({
            ...material,
            orden_id: savedOrder.id,
          })),
        );
      if (discrepancias.length) {
        await this.auditoriaService.create(
          {
            usuario_id: usuarioId,
            entidad: 'orden_servicio',
            entidad_id: savedOrder.id,
            accion: AccionAuditoria.CREAR,
            detalle: { discrepancias_cantidad: discrepancias },
          },
          manager,
        );
      }
      return savedOrder;
    });
    return this.findOne(saved.id);
  }

  /**
   * Quantities already assigned to other orders of the same quote. Cancelled
   * orders release their quantities because they never entered the operation.
   */
  private async cantidadesAsignadas(
    manager: EntityManager,
    cotizacionId: number,
  ): Promise<Map<number, number>> {
    const rows = (await manager.query(
      `SELECT m.cotizacion_item_id AS item_id, SUM(m.cantidad) AS cantidad
         FROM ordenes_servicio_materiales m
         INNER JOIN ordenes_servicio o ON o.id = m.orden_id
        WHERE o.cotizacion_id = ? AND o.estado <> ?
        GROUP BY m.cotizacion_item_id`,
      [cotizacionId, EstadoOrdenServicio.CANCELADO],
    )) as Array<{ item_id: number | string; cantidad: number | string }>;
    return new Map(
      (rows ?? []).map((row) => [Number(row.item_id), Number(row.cantidad)]),
    );
  }

  /** The new order cannot allocate more than the pending contracted quantity. */
  private async assertSaldoDisponible(
    manager: EntityManager,
    cotizacionId: number,
    items: Array<{ id: number; cantidad: number; descripcion: string }>,
    materiales: Array<{
      cotizacion_item_id: number | null;
      cantidad: number;
      descripcion: string;
    }>,
  ): Promise<void> {
    const asignadas = await this.cantidadesAsignadas(manager, cotizacionId);
    for (const material of materiales) {
      if (material.cotizacion_item_id == null) continue;
      const item = items.find(
        (candidate) => candidate.id === material.cotizacion_item_id,
      );
      if (!item) continue;
      const cotizada = Number(item.cantidad);
      const pendiente =
        cotizada - (asignadas.get(material.cotizacion_item_id) ?? 0);
      if (material.cantidad > pendiente)
        throw new ConflictException(
          `La cantidad de «${material.descripcion}» excede el saldo pendiente de la cotización`,
        );
    }
  }

  async updateMateriales(
    id: number,
    dto: UpdateMaterialesOrdenDto,
    usuarioId: number, access?: PermissionContext) {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(OrdenServicio);
      const orden = await repository.findOne({
        where: access ? resourceWhere<OrdenServicio>(access, { id }) : { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!orden) throw new NotFoundException('Orden no encontrada');
      if (orden.version !== dto.version)
        throw new ConflictException(
          'La orden cambió; recargue antes de guardar',
        );
      if (
        [EstadoOrdenServicio.PROCESADO, EstadoOrdenServicio.CANCELADO].includes(
          orden.estado,
        ) ||
        (await manager
          .getRepository(OrdenServicioEvento)
          .existsBy({ orden_id: id })) ||
        (await manager
          .getRepository(CicloEsterilizacion)
          .existsBy({ orden_id: id }))
      ) {
        throw new ConflictException(
          'Los materiales están bloqueados después del registro del ciclo',
        );
      }
      const quote = await manager
        .getRepository(Cotizacion)
        .findOneByOrFail({ id: orden.cotizacion_id });
      const items = await manager
        .getRepository(CotizacionItem)
        .find({ where: { cotizacion_id: orden.cotizacion_id } });
      const materiales = prepararMateriales(dto.materiales, items);
      const discrepancias = detectarDiscrepanciasCantidad(items, materiales);
      orden.metodo_esterilizacion = metodoOrden(
        quote.tipo_servicio,
        dto.metodo_esterilizacion ?? orden.metodo_esterilizacion ?? undefined,
      );
      await manager
        .getRepository(OrdenServicioMaterial)
        .delete({ orden_id: id });
      await manager
        .getRepository(OrdenServicioMaterial)
        .insert(materiales.map((m) => ({ ...m, orden_id: id })));
      // Child-only edits must also invalidate optimistic versions of the header.
      orden.version = dto.version + 1;
      await repository.save(orden);
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'orden_servicio',
          entidad_id: id,
          accion: AccionAuditoria.EDITAR,
          detalle: {
            version_anterior: dto.version,
            materiales: materiales.length,
            discrepancias_cantidad: discrepancias,
          },
        },
        manager,
      );
    });
    return this.findOne(id);
  }

  findAll(access?: PermissionContext): Promise<OrdenServicio[]> {
    return this.ordenesRepository.find({
      ...(access ? {where: resourceWhere<OrdenServicio>(access)} : {}),
      relations: [
        'cotizacion',
        'cotizacion.cliente',
        'cotizacion.items',
        'materiales',
        'eventos',
      ],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, access?: PermissionContext): Promise<OrdenServicio> {
    const orden = await this.ordenesRepository.findOne({
      where: access ? resourceWhere<OrdenServicio>(access, { id }) : { id },
      relations: [
        'cotizacion',
        'cotizacion.cliente',
        'cotizacion.items',
        'materiales',
        'eventos',
      ],
    });
    if (!orden) {
      throw new NotFoundException(`Orden de servicio #${id} no encontrada`);
    }
    return orden;
  }

  async findOneForPdf(
    id: number,
    access: PermissionContext,
  ): Promise<OrdenServicio> {
    if (access?.permission !== 'logistica.ordenes.ver') {
      throw new ForbiddenException(
        'Falta contexto autorizado para consultar órdenes logísticas',
      );
    }

    const orden = await this.findOne(id);
    const quoteScope = orden.cotizacion?.scope_id ?? null;
    if (orden.cotizacion && quoteScope === null) {
      throw new NotFoundException(`Orden de servicio #${id} no encontrada`);
    }
    if (
      orden.scope_id !== null &&
      orden.scope_id !== undefined &&
      quoteScope !== null &&
      orden.scope_id !== quoteScope
    ) {
      throw new NotFoundException(`Orden de servicio #${id} no encontrada`);
    }

    const orderScope = orden.scope_id ?? quoteScope;
    const orderCreator =
      orden.creador_id ?? orden.cotizacion?.creador_id ?? null;
    if (
      !canAccessResource(access.policy, {
        scopeId: orderScope ?? null,
        creatorId: orderCreator,
      }) ||
      (quoteScope !== null &&
        !canAccessResource(access.policy, {
          scopeId: quoteScope,
          creatorId: orden.cotizacion?.creador_id ?? null,
        }))
    ) {
      throw new NotFoundException(`Orden de servicio #${id} no encontrada`);
    }
    return orden;
  }

  async updateEstado(
    id: number,
    dto: UpdateEstadoOrdenDto,
    usuarioId: number, access?: PermissionContext): Promise<OrdenServicio> {
    if (!Object.values(EstadoOrdenServicio).includes(dto.estado)) {
      throw new BadRequestException('Estado de orden inválido');
    }

    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(OrdenServicio);
      const orden = await repository.findOne({
        where: access ? resourceWhere<OrdenServicio>(access, { id }) : { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!orden)
        throw new NotFoundException(`Orden de servicio #${id} no encontrada`);
      const estadoAnterior = orden.estado;
      if (dto.estado === EstadoOrdenServicio.PROCESADO) {
        throw new BadRequestException(
          'El estado PROCESADO solo se registra al crear un ciclo de esterilización',
        );
      }
      validarTransicionEstado(estadoAnterior, dto.estado);
      if (estadoAnterior === dto.estado) {
        throw new ConflictException(
          `La orden ya se encuentra en estado ${dto.estado}`,
        );
      }
      if (
        dto.estado === EstadoOrdenServicio.ENTREGADO &&
        orden.metodo_esterilizacion
      ) {
        const cycles = await manager.getRepository(CicloEsterilizacion).find({
          where: { orden_id: id },
          relations: ['certificado'],
        });
        if (
          !cycles.length ||
          cycles.some(
            (cycle) =>
              cycle.estado !== EstadoCicloEsterilizacion.APROBADO ||
              !cycle.certificado,
          )
        ) {
          throw new ConflictException(
            'No se puede entregar la orden: todos sus ciclos deben estar aprobados y certificados',
          );
        }
      }
      const eventoTipo = EVENTO_POR_ESTADO[dto.estado];
      let eventoDatos: EventoOrdenDatos | undefined;
      if (eventoTipo) {
        const evento = dto.evento;
        if (!evento || !evento.responsable.trim()) {
          throw new BadRequestException(
            'El hito requiere registrar el responsable y los datos reales del evento',
          );
        }
        const orderMaterials = await manager
          .getRepository(OrdenServicioMaterial)
          .find({ where: { orden_id: id } });
        const submittedIds = evento.materiales.map(
          ({ material_id }) => material_id,
        );
        const expectedIds = new Set(orderMaterials.map(({ id: materialId }) => materialId));
        if (
          !orderMaterials.length ||
          submittedIds.length !== expectedIds.size ||
          new Set(submittedIds).size !== submittedIds.length ||
          submittedIds.some((materialId) => !expectedIds.has(materialId))
        ) {
          throw new BadRequestException(
            'Registre una cantidad para cada material de la orden, sin repetir materiales',
          );
        }
        if (eventoTipo === 'ENTREGA_CLIENTE') {
          const received = new Map(orderMaterials.map(({ id, cantidad }) => [id, cantidad]));
          if (evento.materiales.some(({ material_id, cantidad }) =>
            cantidad > received.get(material_id)!,
          ))
            throw new BadRequestException(
              'La cantidad entregada no puede superar la cantidad recibida',
            );
        }
        eventoDatos = {
          responsable: evento.responsable.trim(),
          recibido_por: evento.recibido_por?.trim() || null,
          entregado_por: evento.entregado_por?.trim() || null,
          transportista: evento.transportista?.trim() || null,
          observaciones: evento.observaciones?.trim() || null,
          materiales: evento.materiales.map((material) => ({
            material_id: material.material_id,
            cantidad: material.cantidad,
            cajas: material.cajas,
          })),
        };
        if (
          eventoTipo === 'RECEPCION_PLANTA' &&
          !eventoDatos.recibido_por
        ) {
          throw new BadRequestException(
            'Indique quién recibió el material en planta',
          );
        }
        if (
          eventoTipo === 'ENTREGA_CLIENTE' &&
          !eventoDatos.recibido_por
        ) {
          throw new BadRequestException(
            'Indique quién recibió el material por parte del cliente',
          );
        }
      }
      orden.estado = dto.estado;
      const saved = await repository.save(orden);
      if (eventoTipo && eventoDatos) {
        await manager.getRepository(OrdenServicioEvento).save(
          manager.getRepository(OrdenServicioEvento).create({
            orden_id: orden.id,
            tipo: eventoTipo,
            ocurrido_at: new Date(),
            usuario_id: usuarioId,
            datos_json: eventoDatos,
          }),
        );
      }
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'orden_servicio',
          entidad_id: id,
          accion: AccionAuditoria.CAMBIAR_ESTADO,
          detalle: {
            estado_anterior: estadoAnterior,
            estado_nuevo: dto.estado,
            evento: eventoTipo ?? null,
          },
        },
        manager,
      );
      return saved;
    });
  }

  async buildPdfSnapshot(
    orden: OrdenServicio,
    tipo: 'ORDEN_SERVICIO' | 'ACTA_SERVICIO',
  ): Promise<Record<string, any>> {
    const cliente = orden.cotizacion?.cliente;
    if (!cliente) {
      throw new InternalServerErrorException(
        'La orden no tiene un cliente asociado para generar el documento',
      );
    }

    const pinnedFormatId =
      tipo === 'ORDEN_SERVICIO'
        ? orden.formato_orden_version_id
        : orden.formato_acta_version_id;
    const formatVersion: FormatoVersiones = pinnedFormatId
      ? await this.formatoResolver.resolvePinnedVersion(pinnedFormatId)
      : tipo === 'ORDEN_SERVICIO'
        ? await this.formatoResolver.resolveOrdenServicio()
        : await this.formatoResolver.resolveActaServicio();
    const configuration = formatVersion.configuracion_json;

    return {
      documento: {
        tipo,
        consecutivo:
          tipo === 'ACTA_SERVICIO'
            ? orden.acta_consecutivo ?? null
            : orden.consecutivo,
        fecha_programada: orden.fecha_programada,
        observaciones: orden.observaciones ?? null,
      },
      formato: {
        id: formatVersion.id,
        codigo: configuration.document_code,
        version: formatVersion.version,
        fecha_version:
          formatVersion.fecha_version ?? configuration.version_date ?? null,
        renderer_key: formatVersion.renderer_key,
        configuracion_json: configuration,
      },
      cliente: {
        razon_social: cliente.razon_social,
        direccion: cliente.direccion,
        nit: cliente.nit,
        telefono: cliente.telefono,
        email: cliente.email,
      },
      cotizacion: {
        tipo_servicio: orden.cotizacion?.tipo_servicio,
        items: (orden.cotizacion?.items ?? []).map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
        })),
      },
      orden: {
        consecutivo: orden.consecutivo,
        fecha_programada: orden.fecha_programada,
        metodo_esterilizacion: orden.metodo_esterilizacion,
        conductor_asignado: orden.conductor_asignado ?? null,
        vehiculo_placa: orden.vehiculo_placa ?? null,
        observaciones: orden.observaciones ?? null,
        observaciones_recepcion: orden.observaciones_recepcion ?? null,
        observaciones_cliente: orden.observaciones_cliente ?? null,
      },
      materiales: (orden.materiales ?? []).map((material) => ({
        id: material.id,
        descripcion: material.descripcion,
        referencia: material.referencia ?? null,
        lote: material.lote ?? null,
        cantidad: material.cantidad,
        cotizacion_item_id: material.cotizacion_item_id,
        posicion: material.posicion,
      })),
      eventos: (orden.eventos ?? [])
        .slice()
        .sort(
          (left, right) =>
            left.ocurrido_at.getTime() - right.ocurrido_at.getTime(),
        )
        .map((evento) => ({
          tipo: evento.tipo,
          ocurrido_at: evento.ocurrido_at.toISOString(),
          ...evento.datos_json,
        })),
    };
  }

  /**
   * Approved quotes that still have pending quantity to deliver. A quote can
   * serve several orders (sedes or partial deliveries), so availability is
   * derived from the pending balance, not from the existence of an order.
   */
  async findCotizacionesAprobadasConSaldo(
    access: PermissionContext,
  ): Promise<Cotizacion[]> {
    const aprobadas = await this.cotizacionesRepository.find({
      where: resourceWhere<Cotizacion>(access, { estado: EstadoCotizacion.ACEPTADA_CLIENTE }),
      select: {id:true,consecutivo:true,tipo_servicio:true,estado:true,cliente_id:true},
      relations: ['cliente'],
      order: { id: 'DESC' },
    });

    const asignadas = await this.cantidadesAsignadasPorCotizacion();

    return aprobadas.filter((cotizacion) =>
      (cotizacion.items ?? []).some((item) => {
        const pendiente =
          Number(item.cantidad) - (asignadas.get(`${cotizacion.id}:${item.id}`) ?? 0);
        return pendiente > 0;
      }),
    );
  }

  private async cantidadesAsignadasPorCotizacion(): Promise<Map<string, number>> {
    const rows = (await this.dataSource.query(
      `SELECT o.cotizacion_id AS cotizacion_id, m.cotizacion_item_id AS item_id, SUM(m.cantidad) AS cantidad
         FROM ordenes_servicio_materiales m
         INNER JOIN ordenes_servicio o ON o.id = m.orden_id
        WHERE o.estado <> ?
        GROUP BY o.cotizacion_id, m.cotizacion_item_id`,
      [EstadoOrdenServicio.CANCELADO],
    )) as Array<{
      cotizacion_id: number | string;
      item_id: number | string;
      cantidad: number | string;
    }>;
    return new Map(
      (rows ?? []).map((row) => [
        `${row.cotizacion_id}:${row.item_id}`,
        Number(row.cantidad),
      ]),
    );
  }

  async crearDocumentoEmitido(
    dto: CreateDocumentoEmitidoDto,
    usuarioId: number,
    pdfHash?: string | null,
  ): Promise<DocumentoEmitido> {
    return this.dataSource.transaction(async (manager) => {
      const documentosRepo = manager.getRepository(DocumentoEmitido);
      const eventosRepo = manager.getRepository(DocumentoEvento);

      const existente = await documentosRepo.findOne({
        where: { tipo: dto.tipo, consecutivo: dto.consecutivo },
      });
      if (existente)
        throw new ConflictException(
          `Ya existe un documento emitido ${dto.tipo} con consecutivo ${dto.consecutivo}`,
        );

      const emitido = documentosRepo.create({
        tipo: dto.tipo,
        consecutivo: dto.consecutivo,
        formato_version_id: dto.formato_version_id,
        snapshot_json: dto.snapshot_json,
        pdf_storage_key: dto.pdf_storage_key ?? null,
        pdf_hash: pdfHash ?? null,
        fecha_emision: new Date(dto.fecha_emision),
        usuario_id: dto.usuario_id,
        estado: dto.estado ?? 'EMITIDO',
        orden_id: dto.orden_id ?? null,
      });
      const saved = await documentosRepo.save(emitido);

      await eventosRepo.save(
        eventosRepo.create({
          documento_emitido_id: saved.id,
          tipo_evento: 'EMISION',
          usuario_id: dto.usuario_id,
          fecha: new Date(dto.fecha_emision),
          motivo: 'Emisión inicial del documento',
          datos_json: { consecutivo: dto.consecutivo, tipo: dto.tipo },
        }),
      );

      await this.auditoriaService.create(
        {
          usuario_id: dto.usuario_id,
          entidad: 'documento_emitido',
          entidad_id: saved.id,
          accion: AccionAuditoria.CREAR,
          detalle: {
            tipo: dto.tipo,
            consecutivo: dto.consecutivo,
            estado: saved.estado,
          },
        },
        manager,
      );

      return saved;
    });
  }

  async findDocumentosEmitidosPorOrden(
    ordenId: number,
    access?: PermissionContext,
  ): Promise<DocumentoEmitido[]> {
    return this.documentosEmitidosRepository.find({
      where: access
        ? resourceWhere<DocumentoEmitido>(access, { orden_id: ordenId })
        : { orden_id: ordenId },
      order: { fecha_emision: 'DESC' },
    });
  }

  async findDocumentoEmitidoByConsecutivo(
    tipo: 'ORDEN' | 'ACTA',
    consecutivo: string,
  ): Promise<DocumentoEmitido | null> {
    return this.documentosEmitidosRepository.findOne({
      where: { tipo, consecutivo },
    });
  }

  async registrarEventoDocumento(
    documentoEmitidoId: number,
    dto: CreateDocumentoEventoDto,
  ): Promise<DocumentoEvento> {
    const documento = await this.documentosEmitidosRepository.findOne({
      where: { id: documentoEmitidoId },
    });
    if (!documento)
      throw new NotFoundException(
        `Documento emitido #${documentoEmitidoId} no encontrado`,
      );

    return this.dataSource.transaction(async (manager) => {
      const eventosRepo = manager.getRepository(DocumentoEvento);

      // Anulación o corrección invalida el documento anterior
      if (dto.tipo_evento === 'ANULACION') {
        documento.estado = 'ANULADO';
      } else if (dto.tipo_evento === 'CORRECCION') {
        documento.estado = 'CORREGIDO';
      }
      await manager.getRepository(DocumentoEmitido).save(documento);

      const evento = eventosRepo.create({
        documento_emitido_id: documentoEmitidoId,
        tipo_evento: dto.tipo_evento,
        usuario_id: dto.usuario_id,
        fecha: new Date(dto.fecha),
        motivo: dto.motivo ?? null,
        datos_json: dto.datos_json ?? null,
      });
      const saved = await eventosRepo.save(evento);

      await this.auditoriaService.create(
        {
          usuario_id: dto.usuario_id,
          entidad: 'documento_evento',
          entidad_id: saved.id,
          accion: AccionAuditoria.CREAR,
          detalle: {
            documentoEmitidoId: documentoEmitidoId,
            tipo_evento: dto.tipo_evento,
            estado_nuevo: documento.estado,
          },
        },
        manager,
      );

      return saved;
    });
  }
}
