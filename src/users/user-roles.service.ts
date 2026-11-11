import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RbacRole } from '../rbac/entities/role.entity.js';
import { RbacScope } from '../rbac/entities/scope.entity.js';
import { RbacAuthorizationService, type PermissionContext } from '../rbac/rbac-authorization.service.js';
import type { AssignUserRoleDto } from './dto/assign-user-role.dto.js';

type Assignment = { id: number; user_id: number; role_id: number; scope_id: number; active: number; code: string; name: string; kind: string; role_active: number; scope_name: string };

@Injectable()
export class UserRolesService {
  constructor(@InjectDataSource() private readonly db: DataSource, private readonly authorization: RbacAuthorizationService) {}

  async authorizeIdentity(actorId: number, context: PermissionContext) {
    if (context?.permission !== 'usuarios.identidad.gestionar' || context.policy.userId !== actorId)
      throw new ForbiddenException('La gestión de identidad requiere permiso explícito');
    await this.requireGlobal(context);
  }

  async authorizePasswordReset(
    actorId: number,
    targetUserId: number,
    context: PermissionContext,
  ) {
    await this.authorizeIdentity(actorId, context);
    if (!(await this.isPrivilegedUser(targetUserId))) return;
    const roleContext = await this.authorization.getContext(
      actorId,
      'roles.gestionar',
    );
    await this.requireGlobal(roleContext);
  }

  private async isPrivilegedUser(userId: number): Promise<boolean> {
    const rows = await this.db.query(
      `SELECT 1 AS privileged FROM rbac_platform_owner WHERE user_id=?
      UNION ALL
      SELECT 1 AS privileged FROM rbac_user_role_assignments a
        JOIN rbac_roles r ON r.id=a.role_id AND r.kind=a.role_kind
        JOIN rbac_role_permissions g ON g.role_id=r.id
        JOIN rbac_permissions p ON p.code=g.permission_code
      WHERE a.user_id=? AND p.code IN ('asignaciones.gestionar','roles.gestionar','ambitos.gestionar')
      LIMIT 1`,
      [userId, userId],
    );
    return rows.length > 0;
  }

  async authorize(actorId: number, suppliedContext?: PermissionContext) {
    const context = suppliedContext ?? await this.authorization.getContext(actorId, 'asignaciones.gestionar');
    if (context.permission !== 'asignaciones.gestionar' || context.policy.userId !== actorId)
      throw new ForbiddenException('La gestión de asignaciones requiere permiso explícito');
    await this.requireGlobal(context);
  }

  private async requireGlobal(context: PermissionContext) {
    const root = await this.db.getRepository(RbacScope).findOneBy({ kind: 'GLOBAL', active: true });
    if (!root || !context.policy.scopeIds.includes(root.id)) throw new ForbiddenException('La gestión global de perfiles requiere autorización global');
  }

  async catalog(actorId: number, context?: PermissionContext) {
    await this.authorize(actorId, context);
    const [roles, scopes] = await Promise.all([
      this.db.getRepository(RbacRole).find({ order: { name: 'ASC' } }),
      this.db.getRepository(RbacScope).find({ where: { active: true }, order: { id: 'ASC' } }),
    ]);
    return { roles, scopes };
  }

  async assignments(actorId: number, userId?: number, context?: PermissionContext): Promise<Assignment[]> {
    await this.authorize(actorId, context);
    return this.readAssignments(userId);
  }

  private readAssignments(userId?: number): Promise<Assignment[]> {
    return this.db.query(`SELECT a.id,a.user_id,a.role_id,a.scope_id,a.active,r.code,r.name,r.kind,r.active AS role_active,s.name AS scope_name
      FROM rbac_user_role_assignments a JOIN rbac_roles r ON r.id=a.role_id JOIN rbac_scopes s ON s.id=a.scope_id
      ${userId === undefined ? '' : 'WHERE a.user_id=?'}
      UNION ALL SELECT 0,o.user_id,o.role_id,o.scope_id,1,r.code,r.name,r.kind,r.active,s.name
      FROM rbac_platform_owner o JOIN rbac_roles r ON r.id=o.role_id JOIN rbac_scopes s ON s.id=o.scope_id
      ${userId === undefined ? '' : 'WHERE o.user_id=?'} ORDER BY user_id,role_id,scope_id`, userId === undefined ? [] : [userId,userId]);
  }

  private async snapshot(userId: number) {
    // One SQL statement yields a consistent snapshot and revision for optimistic concurrency.
    const rows = await this.db.query(`SELECT u.rbac_version,a.role_id,a.scope_id,a.assignment_id FROM usuarios u LEFT JOIN (
      SELECT user_id,role_id,scope_id,id AS assignment_id FROM rbac_user_role_assignments WHERE active=1
      UNION ALL SELECT user_id,role_id,scope_id,0 FROM rbac_platform_owner
    ) a ON a.user_id=u.id WHERE u.id=?`, [userId]);
    if (!rows.length) throw new NotFoundException('Usuario inexistente');
    return { version: Number(rows[0].rbac_version), roles: rows.filter((row: { role_id: number | null }) => row.role_id !== null) as { role_id: number; scope_id: number; assignment_id: number }[] };
  }

  async assign(actorId: number, userId: number, dto: AssignUserRoleDto, context?: PermissionContext) {
    await this.authorize(actorId, context);
    const snapshot = await this.snapshot(userId);
    const roles = snapshot.roles.map(({ role_id,scope_id }) => ({role_id,scope_id}));
    if (!roles.some(role => role.role_id === dto.role_id && role.scope_id === dto.scope_id)) roles.push(dto);
    await this.replace(actorId,userId,roles,snapshot.version);
    return this.readAssignments(userId);
  }

  async remove(actorId: number, userId: number, assignmentId: number, context?: PermissionContext) {
    await this.authorize(actorId, context);
    if (assignmentId === 0) throw new ConflictException('La titularidad técnica requiere una transferencia explícita');
    const snapshot = await this.snapshot(userId);
    if (!snapshot.roles.some(role => role.assignment_id === assignmentId)) throw new NotFoundException('Asignación inexistente');
    const roles = snapshot.roles.filter(role => role.assignment_id !== assignmentId).map(({role_id,scope_id}) => ({role_id,scope_id}));
    await this.replace(actorId,userId,roles,snapshot.version);
    return this.readAssignments(userId);
  }

  private async replace(actorId: number, userId: number, roles: AssignUserRoleDto[], version: number) {
    try {
      // The procedure owns the transaction; never call it inside a TypeORM transaction.
      await this.db.query('CALL rbac_set_user_roles(?, ?, ?, ?)', [userId,JSON.stringify(roles),actorId,version]);
    } catch (error) {
      const e = error as { driverError?: { errno?: number; sqlMessage?: string } };
      if (e.driverError?.errno === 1644) {
        const message = e.driverError.sqlMessage ?? 'No se pudo actualizar el perfil';
        if (message.includes('Version') || message.includes('administradora') || message.includes('titular')) throw new ConflictException(message);
        if (message.includes('Actor sin')) throw new ForbiddenException(message);
        throw new BadRequestException(message);
      }
      throw error;
    }
  }
}
