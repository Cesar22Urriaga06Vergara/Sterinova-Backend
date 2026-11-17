import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, type EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { RbacRole } from '../rbac/entities/role.entity.js';
import { RbacScope } from '../rbac/entities/scope.entity.js';
import { RbacUserRoleAssignment } from '../rbac/entities/user-role-assignment.entity.js';
import {
  RbacAuthorizationService,
  type PermissionContext,
} from '../rbac/rbac-authorization.service.js';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import {
  AREA_ADMIN_CODES,
  assertAreaAdministrator,
  assertManagementContext,
} from './administradores-policy.js';
import type {
  CrearAdministradorDto,
  AsignarAdministradorDto,
} from './dto/administrador.dto.js';

@Injectable()
export class GerenciaAdministradoresService {
  constructor(
    @InjectDataSource() private readonly db: DataSource,
    private readonly authorization: RbacAuthorizationService,
    private readonly audit: AuditoriaService,
  ) {}

  private async fresh(manager: EntityManager, supplied: PermissionContext) {
    assertManagementContext(supplied, Number(supplied?.policy.userId));
    const current = await this.authorization.getContext(
      Number(supplied.policy.userId),
      'gerencia.administradores.gestionar',
      undefined,
      manager,
    );
    const root = await manager
      .getRepository(RbacScope)
      .findOneBy({ kind: 'GLOBAL', active: true });
    if (!root || !current.policy.scopeIds.includes(root.id))
      throw new ForbiddenException(
        'La gestión de administradores exige autorización global',
      );
    // Keep a selected header scope narrow even after reloading grants.
    return {
      ...current,
      policy: {
        ...current.policy,
        scopeIds: current.policy.scopeIds.filter((id) =>
          supplied.policy.scopeIds.includes(id),
        ),
        ownScopeIds: [],
      },
    };
  }

  async catalogo(access: PermissionContext) {
    return this.db.transaction(async (manager) => {
      const current = await this.fresh(manager, access);
      const [roles, scopes] = await Promise.all([
        manager.getRepository(RbacRole).find({
          where: {
            code: In([...AREA_ADMIN_CODES]),
            kind: 'STANDARD',
            active: true,
          },
          select: { id: true, code: true, name: true },
          order: { name: 'ASC' },
        }),
        manager.getRepository(RbacScope).find({
          where: {
            id: In(
              current.resourceScopeIds.filter((id) =>
                current.policy.scopeIds.includes(id),
              ),
            ),
            active: true,
          },
          select: { id: true, name: true, kind: true, parent_id: true },
          order: { id: 'ASC' },
        }),
      ]);
      return {
        roles,
        scopes: scopes.filter((s) => ['DEPARTMENT', 'PLANT'].includes(s.kind)),
      };
    });
  }

  async listar(access: PermissionContext) {
    return this.db.transaction(async (manager) => {
      const current = await this.fresh(manager, access);
      const ids = current.resourceScopeIds.filter((id) =>
        current.policy.scopeIds.includes(id),
      );
      if (!ids.length) return [];
      return manager.query(
        `SELECT a.id AS assignment_id,a.user_id,a.role_id,a.scope_id,a.active,u.nombre,u.apellido,u.email,u.activo AS usuario_activo,r.code AS perfil,s.name AS area
        FROM rbac_user_role_assignments a JOIN usuarios u ON u.id=a.user_id JOIN rbac_roles r ON r.id=a.role_id AND r.kind='STANDARD'
        JOIN rbac_scopes s ON s.id=a.scope_id WHERE r.code IN (${AREA_ADMIN_CODES.map(() => '?').join(',')}) AND a.scope_id IN (${ids.map(() => '?').join(',')}) ORDER BY u.nombre,a.id`,
        [...AREA_ADMIN_CODES, ...ids],
      );
    });
  }

  private async write<T>(
    access: PermissionContext,
    work: (manager: EntityManager, current: PermissionContext) => Promise<T>,
  ): Promise<T> {
    assertManagementContext(access, Number(access?.policy.userId));
    try {
      return await this.db.transaction(async (manager) => {
        // Same lock order as rbac_set_user_roles; concurrent role changes cannot interleave.
        await manager.query(
          'UPDATE rbac_user_sync_lock SET version=version+1 WHERE id=1',
        );
        const current = await this.fresh(manager, access);
        const [context] = await manager.query(
          'SELECT @rbac_write_user AS previous',
        );
        try {
          return await work(manager, current);
        } finally {
          await manager.query('SET @rbac_write_user = ?', [
            context.previous ?? null,
          ]);
        }
      });
    } catch (error) {
      const e = error as { code?: string; driverError?: { code?: string } };
      if ((e.driverError?.code ?? e.code) === 'ER_DUP_ENTRY')
        throw new ConflictException('El correo o la asignación ya existe');
      throw error;
    }
  }

  private async selection(
    manager: EntityManager,
    dto: AsignarAdministradorDto,
    access: PermissionContext,
    retiring = false,
  ) {
    if (
      ![dto.role_id, dto.scope_id].every(
        (id) => Number.isSafeInteger(id) && id > 0,
      )
    )
      throw new BadRequestException('Perfil y área deben ser IDs positivos');
    const role = await manager
      .getRepository(RbacRole)
      .findOneBy({ id: dto.role_id });
    const scope = await manager
      .getRepository(RbacScope)
      .findOneBy({ id: dto.scope_id });
    if (!role || !scope)
      throw new NotFoundException('Perfil o área inexistente');
    // Disabling a role must prevent grants, while still allowing its revocation.
    assertAreaAdministrator(
      retiring ? { ...role, active: true } : role,
      scope,
      access,
    );
    return { role, scope };
  }

  private async grant(
    manager: EntityManager,
    userId: number,
    role: RbacRole,
    scope: RbacScope,
    actor: number,
  ) {
    await manager.query('SET @rbac_write_user = ?', [userId]);
    const repository = manager.getRepository(RbacUserRoleAssignment);
    const existing = await repository.findOneBy({
      user_id: userId,
      role_id: role.id,
      scope_id: scope.id,
    });
    if (existing?.active)
      throw new ConflictException('El administrador ya tiene esta asignación');
    const assignment = await repository.save(
      repository.create({
        ...existing,
        user_id: userId,
        role_id: role.id,
        role_kind: 'STANDARD',
        scope_id: scope.id,
        scope_kind: scope.kind,
        role_global_assignable: role.global_assignable,
        active: true,
      }),
    );
    await manager.query(
      'UPDATE usuarios SET rbac_version=rbac_version+1 WHERE id=?',
      [userId],
    );
    await this.audit.create(
      {
        usuario_id: actor,
        scope_id: scope.id,
        entidad: 'rbac_user_role_assignments',
        entidad_id: assignment.id,
        accion: AccionAuditoria.CREAR,
        detalle: { user_id: userId, role_id: role.id, scope_id: scope.id },
      },
      manager,
    );
    return {
      assignment_id: assignment.id,
      user_id: userId,
      role_id: role.id,
      scope_id: scope.id,
    };
  }

  async crear(dto: CrearAdministradorDto, access: PermissionContext) {
    const password_hash = await bcrypt.hash(dto.password, 10);
    return this.write(access, async (manager, current) => {
      const { role, scope } = await this.selection(manager, dto, current);
      const repository = manager.getRepository(User);
      const user = await repository.save(
        repository.create({
          nombre: dto.nombre.trim(),
          apellido: dto.apellido?.trim() || null,
          email: dto.email.trim().toLowerCase(),
          cargo: dto.cargo?.trim() || null,
          celular: dto.celular?.trim() || null,
          email_contacto: dto.email_contacto?.trim().toLowerCase() || null,
          password_hash,
          password_version: 1,
          activo: true,
        }),
      );
      const assignment = await this.grant(
        manager,
        user.id,
        role,
        scope,
        Number(current.policy.userId),
      );
      await this.audit.create(
        {
          usuario_id: Number(current.policy.userId),
          scope_id: scope.id,
          entidad: 'usuarios',
          entidad_id: user.id,
          accion: AccionAuditoria.CREAR,
          detalle: { role_id: role.id, scope_id: scope.id },
        },
        manager,
      );
      return {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        activo: user.activo,
        asignacion: assignment,
      };
    });
  }

  private async target(manager: EntityManager, userId: number, actor: number) {
    if (!Number.isSafeInteger(userId) || userId < 1)
      throw new BadRequestException('Usuario inválido');
    if (userId === actor)
      throw new ForbiddenException(
        'No puedes modificar tus propias asignaciones',
      );
    const user = await manager
      .getRepository(User)
      .findOne({ where: { id: userId }, lock: { mode: 'pessimistic_write' } });
    if (!user) throw new NotFoundException('Usuario inexistente');
    const protectedRows = await manager.query(
      `SELECT 1 AS protected FROM rbac_platform_owner WHERE user_id=? UNION ALL SELECT 1 AS protected FROM rbac_user_role_assignments a JOIN rbac_scopes s ON s.id=a.scope_id WHERE a.user_id=? AND a.active=1 AND s.kind='GLOBAL' LIMIT 1`,
      [userId, userId],
    );
    if (protectedRows.length)
      throw new ForbiddenException(
        'La cuenta global requiere administración técnica',
      );
    return user;
  }

  async asignar(
    userId: number,
    dto: AsignarAdministradorDto,
    access: PermissionContext,
  ) {
    return this.write(access, async (manager, current) => {
      const { role, scope } = await this.selection(manager, dto, current);
      const actor = Number(current.policy.userId);
      const user = await this.target(manager, userId, actor);
      if (!user.activo) throw new ConflictException('La cuenta está inactiva');
      return this.grant(manager, userId, role, scope, actor);
    });
  }

  async retirar(
    userId: number,
    assignmentId: number,
    access: PermissionContext,
  ) {
    return this.write(access, async (manager, current) => {
      if (!Number.isSafeInteger(assignmentId) || assignmentId < 1)
        throw new BadRequestException('Asignación inválida');
      const actor = Number(current.policy.userId);
      await this.target(manager, userId, actor);
      const repo = manager.getRepository(RbacUserRoleAssignment);
      const assignment = await repo.findOneBy({
        id: assignmentId,
        user_id: userId,
      });
      if (!assignment) throw new NotFoundException('Asignación inexistente');
      await this.selection(manager, assignment, current, true);
      if (!assignment.active)
        throw new ConflictException('La asignación ya está retirada');
      await manager.query('SET @rbac_write_user = ?', [userId]);
      await repo.update(
        { id: assignmentId, user_id: userId },
        { active: false },
      );
      await manager.query(
        'UPDATE usuarios SET rbac_version=rbac_version+1 WHERE id=?',
        [userId],
      );
      await this.audit.create(
        {
          usuario_id: actor,
          scope_id: assignment.scope_id,
          entidad: 'rbac_user_role_assignments',
          entidad_id: assignmentId,
          accion: AccionAuditoria.EDITAR,
          detalle: { user_id: userId, active: false },
        },
        manager,
      );
      return { assignment_id: assignmentId, active: false };
    });
  }
}
