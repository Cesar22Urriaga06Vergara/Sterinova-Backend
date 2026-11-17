import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecepcionLogistica } from './entities/recepcion-logistica.entity.js';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { CreateRecepcionDto } from './dto/create-recepcion.dto.js';
import { UpdateRecepcionEstadoDto } from './dto/update-recepcion-estado.dto.js';
import { resourceWhere } from '../rbac/resource-access.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';

@Injectable()
export class RecepcionService {
  constructor(
    @InjectRepository(RecepcionLogistica)
    private readonly recepcionesRepository: Repository<RecepcionLogistica>,
    @InjectRepository(OrdenServicio)
    private readonly ordenesRepository: Repository<OrdenServicio>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async createRecepcion(
    ordenId: number,
    dto: CreateRecepcionDto,
    usuarioId: number,
    access?: PermissionContext,
  ): Promise<RecepcionLogistica> {
    return this.ordenesRepository.manager.transaction(
      async (manager) => {
        const ordenesRepo = manager.getRepository(OrdenServicio);
        const orden = await ordenesRepo.findOne({
          where: access
            ? resourceWhere<OrdenServicio>(access, { id: ordenId })
            : { id: ordenId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!orden)
          throw new NotFoundException(`Orden de servicio #${ordenId} no encontrada`);

        const existing = await manager.getRepository(RecepcionLogistica).findOne({
          where: { orden_id: ordenId },
        });
        if (existing)
          throw new BadRequestException(
            'La orden ya tiene una recepción registrada',
          );

        const recepcion = manager.getRepository(RecepcionLogistica).create({
          orden_id: ordenId,
          numero_remision_factura: dto.numero_remision_factura ?? null,
          fecha_hora_recepcion: new Date(dto.fecha_hora_recepcion),
          usuario_id: usuarioId,
          sede_origen: dto.sede_origen,
          evidencias: dto.evidencias ?? null,
          estado: dto.estado,
        });
        const saved = await manager
          .getRepository(RecepcionLogistica)
          .save(recepcion);

        await this.auditoriaService.create(
          {
            usuario_id: usuarioId,
            entidad: 'recepcion_logistica',
            entidad_id: saved.id,
            accion: AccionAuditoria.CREAR,
            detalle: {
              orden_id: ordenId,
              estado: dto.estado,
              numero_remision_factura: dto.numero_remision_factura,
            },
          },
          manager,
        );
        return saved;
      },
    );
  }

  async findAllRecepciones(access?: PermissionContext): Promise<RecepcionLogistica[]> {
    return this.recepcionesRepository.find({
      ...(access ? { where: resourceWhere<RecepcionLogistica>(access) } : {}),
      relations: ['orden', 'usuario'],
      order: { created_at: 'DESC' },
    });
  }

  async findRecepcionByOrden(
    ordenId: number,
    access?: PermissionContext,
  ): Promise<RecepcionLogistica> {
    const recepcion = await this.recepcionesRepository.findOne({
      where: access
        ? resourceWhere<RecepcionLogistica>(access, { orden_id: ordenId })
        : { orden_id: ordenId },
      relations: ['orden', 'usuario'],
    });
    if (!recepcion)
      throw new NotFoundException(
        `Recepción de orden #${ordenId} no encontrada`,
      );
    return recepcion;
  }

  async updateRecepcionEstado(
    ordenId: number,
    dto: UpdateRecepcionEstadoDto,
    usuarioId: number,
    access?: PermissionContext,
  ): Promise<RecepcionLogistica> {
    return this.recepcionesRepository.manager.transaction(
      async (manager) => {
        const recepcion = await manager.getRepository(RecepcionLogistica).findOne({
          where: access
            ? resourceWhere<RecepcionLogistica>(access, { orden_id: ordenId })
            : { orden_id: ordenId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!recepcion)
          throw new NotFoundException(
            `Recepción de orden #${ordenId} no encontrada`,
          );
        const estadoAnterior = recepcion.estado;
        recepcion.estado = dto.estado;
        if (dto.motivo) {
          const previas = recepcion.evidencias ?? {};
          recepcion.evidencias = { ...previas, motivo_cambio_estado: dto.motivo };
        }
        const saved = await manager
          .getRepository(RecepcionLogistica)
          .save(recepcion);

        await this.auditoriaService.create(
          {
            usuario_id: usuarioId,
            entidad: 'recepcion_logistica',
            entidad_id: saved.id,
            accion: AccionAuditoria.CAMBIAR_ESTADO,
            detalle: {
              orden_id: ordenId,
              estado_anterior: estadoAnterior,
              estado_nuevo: dto.estado,
            },
          },
          manager,
        );
        return saved;
      },
    );
  }
}
