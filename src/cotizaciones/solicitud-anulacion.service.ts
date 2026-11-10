import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { RbacAuthorizationService } from '../rbac/rbac-authorization.service.js';
import {
  SolicitudAnulacion,
  EstadoSolicitudAnulacion,
} from './entities/solicitud-anulacion.entity.js';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { canAccessResource } from '../rbac/authorization-policy.js';

@Injectable()
export class SolicitudAnulacionService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly rbac: RbacAuthorizationService,
    @InjectRepository(SolicitudAnulacion)
    private readonly solicitudes: Repository<SolicitudAnulacion>,
  ) {}

  async crearSolicitud(
    cotizacionId: number,
    creadorId: number,
    motivo: string,
    scopeHeader?: string | string[],
  ): Promise<SolicitudAnulacion> {
    this.validateId(cotizacionId);
    this.validateId(creadorId);
    if (typeof motivo !== 'string' || !motivo.trim())
      throw new BadRequestException('El motivo es obligatorio');
    const context = await this.rbac.getContext(
      creadorId,
      'solicitudes_anulacion.crear',
      scopeHeader,
    );
    return this.dataSource.transaction(async (manager) => {
      const quote = await manager.getRepository(Cotizacion).findOne({
        where: { id: cotizacionId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!quote) throw new NotFoundException('Cotización no encontrada');
      if (
        !canAccessResource(context.policy, {
          scopeId: quote.scope_id,
          creatorId: quote.creador_id,
        })
      ) {
        throw new ForbiddenException('Sin acceso a la cotización');
      }
      this.assertAnulable(quote);
      const repo = manager.getRepository(SolicitudAnulacion);
      return repo.save(
        repo.create({
          cotizacion_id: cotizacionId,
          creador_id: creadorId,
          motivo: motivo.trim(),
          estado: EstadoSolicitudAnulacion.PENDIENTE,
          aprobador_id: null,
          fecha_resolucion: null,
          observacion_resolucion: null,
        }),
      );
    });
  }

  async resolverSolicitud(
    solicitudId: number,
    aprobadorId: number,
    estado:
      EstadoSolicitudAnulacion.APROBADA | EstadoSolicitudAnulacion.RECHAZADA,
    observacion: string,
    scopeHeader?: string | string[],
  ): Promise<SolicitudAnulacion> {
    this.validateId(solicitudId);
    this.validateId(aprobadorId);
    if (
      estado !== EstadoSolicitudAnulacion.APROBADA &&
      estado !== EstadoSolicitudAnulacion.RECHAZADA
    ) {
      throw new BadRequestException(
        'La decisión debe ser APROBADA o RECHAZADA',
      );
    }
    if (typeof observacion !== 'string')
      throw new BadRequestException('La observación debe ser texto');
    const scopeIds =
      await this.rbac.getCancellationApprovalScopeIds(aprobadorId);
    const context = await this.rbac.getContext(
      aprobadorId,
      'solicitudes_anulacion.aprobar',
      scopeHeader,
    );
    if (!scopeIds.length)
      throw new ForbiddenException('Se requiere administración del área');
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(SolicitudAnulacion);
      const request = await repo.findOne({
        where: { id: solicitudId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!request) throw new NotFoundException('Solicitud no encontrada');
      const quotes = manager.getRepository(Cotizacion);
      const quote = await quotes.findOne({
        where: { id: request.cotizacion_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!quote) throw new NotFoundException('Cotización no encontrada');
      if (
        quote.scope_id === null ||
        !scopeIds.includes(quote.scope_id) ||
        !context.policy.scopeIds.includes(quote.scope_id)
      ) {
        throw new ForbiddenException('La cotización pertenece a otro ámbito');
      }
      if (request.estado !== EstadoSolicitudAnulacion.PENDIENTE) {
        throw new ConflictException('La solicitud ya fue resuelta');
      }
      if (estado === EstadoSolicitudAnulacion.APROBADA) {
        this.assertAnulable(quote);
        quote.estado = 'ANULADA';
        await quotes.save(quote);
      }
      request.estado = estado;
      request.aprobador_id = aprobadorId;
      request.fecha_resolucion = new Date();
      request.observacion_resolucion = observacion.trim();
      return repo.save(request);
    });
  }

  async obtenerPendientes(
    aprobadorId: number,
    scopeHeader?: string | string[],
  ): Promise<SolicitudAnulacion[]> {
    this.validateId(aprobadorId);
    const roleScopeIds =
      await this.rbac.getCancellationApprovalScopeIds(aprobadorId);
    const context = await this.rbac.getContext(
      aprobadorId,
      'solicitudes_anulacion.ver',
      scopeHeader,
    );
    const scopeIds = roleScopeIds.filter((id) =>
      context.policy.scopeIds.includes(id),
    );
    if (!scopeIds.length)
      throw new ForbiddenException('Se requiere administración del área');
    return this.solicitudes.find({
      where: {
        estado: EstadoSolicitudAnulacion.PENDIENTE,
        cotizacion: { scope_id: In(scopeIds) },
      },
      relations: { cotizacion: true },
      order: { created_at: 'ASC', id: 'ASC' },
    });
  }

  private assertAnulable(quote: Cotizacion): void {
    if (!['APROBADA', 'EMITIDA'].includes(quote.estado)) {
      throw new ConflictException(
        'Solo se puede solicitar o aprobar la anulación de cotizaciones APROBADAS o EMITIDAS',
      );
    }
  }

  private validateId(id: number): void {
    if (!Number.isSafeInteger(id) || id < 1)
      throw new BadRequestException('Identificador inválido');
  }
}
