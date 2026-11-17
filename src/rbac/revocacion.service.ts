import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { PermissionContext } from './rbac-authorization.service.js';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';

export type RevocacionResult = {
  usuarioId: number;
  versionAnterior: number;
  versionNueva: number;
  asignacionesRevocadas: number;
  motivo: string;
  fecha: Date;
};

@Injectable()
export class RevocacionService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async revocarAsignacionesUsuario(
    usuarioId: number,
    actorId: number,
    contexto: PermissionContext,
    motivo: string,
  ): Promise<RevocacionResult> {
    const tienePermiso =
      (contexto.permission === 'usuarios.identidad.gestionar' ||
        contexto.permission === 'asignaciones.gestionar') &&
      contexto.policy.scopeIds.includes(1);

    if (!tienePermiso) {
      throw new ForbiddenException(
        'Requiere permiso usuarios.identidad.gestionar o asignaciones.gestionar en ámbito GLOBAL',
      );
    }

    const [usuario] = await this.dataSource.query(
      'SELECT id, activo, rbac_version FROM usuarios WHERE id = ?',
      [usuarioId],
    );
    if (!usuario) {
      throw new NotFoundException(`Usuario #${usuarioId} no encontrado`);
    }

    if (!usuario.activo) {
      throw new BadRequestException(
        `El usuario #${usuarioId} ya está inactivo`,
      );
    }

    const versionAnterior = Number(usuario.rbac_version || 0);

    return this.dataSource.transaction(async (manager) => {
      const [resultado] = await manager.query(
        `UPDATE rbac_user_role_assignments SET active = 0 WHERE user_id = ? AND active = 1`,
        [usuarioId],
      );
      const asignacionesRevocadas = Number(resultado.affectedRows || 0);

      await manager.query(
        `UPDATE usuarios SET rbac_version = rbac_version + 1 WHERE id = ?`,
        [usuarioId],
      );

      const [resultadoVersion] = await manager.query(
        'SELECT rbac_version FROM usuarios WHERE id = ?',
        [usuarioId],
      );
      const versionNueva = Number(resultadoVersion.rbac_version);

      await this.auditoriaService.create(
        {
          usuario_id: actorId,
          entidad: 'rbac_user_role_assignments',
          entidad_id: usuarioId,
          accion: AccionAuditoria.ELIMINAR,
          detalle: {
            accion: 'revocar_asignaciones_usuario',
            asignaciones_revocadas: asignacionesRevocadas,
            version_anterior: versionAnterior,
            version_nueva: versionNueva,
            motivo,
          },
          scope_id: contexto.policy.scopeIds[0] ?? null,
        },
        manager,
      );

      return {
        usuarioId,
        versionAnterior,
        versionNueva,
        asignacionesRevocadas,
        motivo,
        fecha: new Date(),
      };
    });
  }

  async revocarAsignacionEspecifica(
    usuarioId: number,
    asignacionId: number,
    actorId: number,
    contexto: PermissionContext,
    motivo: string,
  ): Promise<RevocacionResult> {
    const tienePermiso =
      (contexto.permission === 'usuarios.identidad.gestionar' ||
        contexto.permission === 'asignaciones.gestionar') &&
      contexto.policy.scopeIds.includes(1);

    if (!tienePermiso) {
      throw new ForbiddenException(
        'Requiere permiso usuarios.identidad.gestionar o asignaciones.gestionar en ámbito GLOBAL',
      );
    }

    const [asignacion] = await this.dataSource.query(
      `SELECT a.id, a.user_id, a.role_id, a.scope_id, a.active
       FROM rbac_user_role_assignments a
       WHERE a.id = ? AND a.user_id = ?`,
      [asignacionId, usuarioId],
    );
    if (!asignacion) {
      throw new NotFoundException(
        `Asignación #${asignacionId} no encontrada para el usuario #${usuarioId}`,
      );
    }

    if (!asignacion.active) {
      throw new BadRequestException(
        `La asignación #${asignacionId} ya está inactiva`,
      );
    }

    const versionAnterior = 0;

    return this.dataSource.transaction(async (manager) => {
      await manager.query(
        `UPDATE rbac_user_role_assignments SET active = 0 WHERE id = ?`,
        [asignacionId],
      );

      await manager.query(
        `UPDATE usuarios SET rbac_version = rbac_version + 1 WHERE id = ?`,
        [usuarioId],
      );

      const [resultadoVersion] = await manager.query(
        'SELECT rbac_version FROM usuarios WHERE id = ?',
        [usuarioId],
      );
      const versionNueva = Number(resultadoVersion.rbac_version);

      await this.auditoriaService.create(
        {
          usuario_id: actorId,
          entidad: 'rbac_user_role_assignments',
          entidad_id: usuarioId,
          accion: AccionAuditoria.EDITAR,
          detalle: {
            accion: 'revocar_asignacion_especifica',
            asignacion_id: asignacionId,
            role_id: asignacion.role_id,
            scope_id: asignacion.scope_id,
            version_anterior: versionAnterior,
            version_nueva: versionNueva,
            motivo,
          },
          scope_id: contexto.policy.scopeIds[0] ?? null,
        },
        manager,
      );

      return {
        usuarioId,
        versionAnterior,
        versionNueva,
        asignacionesRevocadas: 1,
        motivo,
        fecha: new Date(),
      };
    });
  }

  async obtenerHistorialRevocaciones(
    usuarioId: number,
    contexto: PermissionContext,
  ): Promise<Array<{ fecha: Date; actor: number; motivo: string; version: number }>> {
    const tienePermiso =
      (contexto.permission === 'usuarios.identidad.gestionar' ||
        contexto.permission === 'asignaciones.gestionar') &&
      contexto.policy.scopeIds.includes(1);

    if (!tienePermiso) {
      throw new ForbiddenException(
        'Requiere permiso usuarios.identidad.gestionar o asignaciones.gestionar en ámbito GLOBAL',
      );
    }

    const filas = await this.dataSource.query(
      `SELECT a.created_at as fecha, a.usuario_id as actor, a.detalle as detalle
       FROM auditoria a
       WHERE a.entidad = 'rbac_user_role_assignments'
         AND a.entidad_id = ?
         AND JSON_EXTRACT(a.detalle, '$.accion') IN ('revocar_asignaciones_usuario', 'revocar_asignacion_especifica')
       ORDER BY a.created_at DESC`,
      [usuarioId],
    );

    return filas.map((f: any) => {
      const detalle = typeof f.detalle === 'string' ? JSON.parse(f.detalle) : f.detalle;
      return {
        fecha: f.fecha,
        actor: f.actor,
        motivo: detalle.motivo ?? '',
        version: detalle.version_nueva ?? 0,
      };
    });
  }
}
