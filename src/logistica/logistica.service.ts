import { resourceWhere, creationScope } from '../rbac/resource-access.js';
import { CotizacionItem } from '../cotizaciones/entities/cotizacion-item.entity.js';
import {
  detectarDiscrepanciasCantidad,
  prepararMateriales,
  metodoOrden,
} from './materiales-orden.js';
import { UpdateMaterialesOrdenDto } from './dto/update-materiales-orden.dto.js';
import { OrdenServicioMaterial } from '../ordenes-servicio/entities/orden-servicio-material.entity.js';
import { CicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

const TRANSICIONES_ESTADO: Record<
  EstadoOrdenServicio,
  EstadoOrdenServicio[]
> = {
  [EstadoOrdenServicio.PENDIENTE]: [
    EstadoOrdenServicio.EN_RUTA,
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
    EstadoOrdenServicio.PROCESADO,
    EstadoOrdenServicio.CANCELADO,
  ],
  [EstadoOrdenServicio.PROCESADO]: [],
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
        where: { id: dto.cotizacion_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!cotizacion) throw new NotFoundException('Cotización no encontrada');
      if (cotizacion.estado !== 'APROBADA') {
        throw new BadRequestException(
          'Solo se pueden generar órdenes desde cotizaciones APROBADAS',
        );
      }
      if (
        await orders.findOne({ where: { cotizacion_id: dto.cotizacion_id } })
      ) {
        throw new ConflictException(
          'La cotización ya tiene una orden de servicio',
        );
      }
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
      const items = await manager
        .getRepository(CotizacionItem)
        .find({ where: { cotizacion_id: dto.cotizacion_id } });
      const materiales = prepararMateriales(dto.materiales ?? [], items);
      const discrepancias = detectarDiscrepanciasCantidad(items, materiales);
      const savedOrder = await orders.save(
        orders.create({
          metodo_esterilizacion: metodoOrden(
            cotizacion.tipo_servicio,
            dto.metodo_esterilizacion,
          ),
          consecutivo: `OS-${year}-${numero}`,
          cotizacion_id: dto.cotizacion_id,
          scope_id: access ? creationScope(access) : cotizacion.scope_id,
          creador_id: usuarioId,
          fecha_programada: dto.fecha_programada,
          estado: EstadoOrdenServicio.PENDIENTE,
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
      validarTransicionEstado(estadoAnterior, dto.estado);
      orden.estado = dto.estado;
      const saved = await repository.save(orden);
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'orden_servicio',
          entidad_id: id,
          accion: AccionAuditoria.CAMBIAR_ESTADO,
          detalle: {
            estado_anterior: estadoAnterior,
            estado_nuevo: dto.estado,
          },
        },
        manager,
      );
      return saved;
    });
  }

  buildPdfSnapshot(
    orden: OrdenServicio,
    tipo: 'ORDEN_SERVICIO' | 'ACTA_SERVICIO',
  ): Record<string, any> {
    const cliente = orden.cotizacion?.cliente;
    if (!cliente) {
      throw new InternalServerErrorException(
        'La orden no tiene un cliente asociado para generar el documento',
      );
    }

    return {
      documento: {
        tipo,
        consecutivo: orden.consecutivo,
        fecha_programada: orden.fecha_programada,
        observaciones: orden.observaciones ?? null,
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
        subtotal: orden.cotizacion?.subtotal,
        iva: orden.cotizacion?.iva,
        total: orden.cotizacion?.total,
        items: (orden.cotizacion?.items ?? []).map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
        })),
      },
      orden: {
        consecutivo: orden.consecutivo,
        fecha_programada: orden.fecha_programada,
        metodo_esterilizacion: orden.metodo_esterilizacion,
        observaciones: orden.observaciones ?? null,
      },
      materiales: (orden.materiales ?? []).map((material) => ({
        descripcion: material.descripcion,
        referencia: material.referencia ?? null,
        lote: material.lote ?? null,
        cantidad: material.cantidad,
        cotizacion_item_id: material.cotizacion_item_id,
        posicion: material.posicion,
      })),
    };
  }

  async findCotizacionesAprobadasSinOrden(access: PermissionContext): Promise<Cotizacion[]> {
    const aprobadas = await this.cotizacionesRepository.find({
      where: resourceWhere<Cotizacion>(access, { estado: 'APROBADA' }),
      select: {id:true,consecutivo:true,tipo_servicio:true,estado:true,cliente_id:true},
      relations: ['cliente'],
      order: { id: 'DESC' },
    });

    const ordenes = await this.ordenesRepository.find({
      select: ['cotizacion_id'],
    });
    const usados = new Set(ordenes.map((o) => o.cotizacion_id));

    return aprobadas.filter((c) => !usados.has(c.id));
  }
}
