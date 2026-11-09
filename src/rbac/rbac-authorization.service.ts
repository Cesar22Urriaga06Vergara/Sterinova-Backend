import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { RbacScope } from './entities/scope.entity.js';
import { compileAuthorizationPolicy } from './authorization-policy.js';
import type {
  AuthorizationPolicy,
  AuthorizationSubject,
  ResourceAccess,
  RoleAssignment,
} from './authorization.types.js';
import { isPermissionCode, type PermissionCode } from './permission-catalog.js';

export type PermissionContext = {
  permission: PermissionCode;
  policy: AuthorizationPolicy;
  scopeId?: number;
  resourceScopeIds: readonly number[];
};

type GrantRow = {
  roleId: number;
  scopeId: number;
  assignmentActive: number;
  roleActive: number;
  permission: string | null;
  permissionActive: number | null;
  resourceAccess: ResourceAccess;
  includeDescendants: number;
};

@Injectable()
export class RbacAuthorizationService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getContext(
    userId: number,
    permission: string,
    scopeHeader?: string | string[],
  ): Promise<PermissionContext> {
    if (!Number.isSafeInteger(userId) || userId < 1)
      throw new UnauthorizedException();
    if (!isPermissionCode(permission))
      throw new ForbiddenException('Permiso no reconocido');
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId, activo: true }, select: { id: true } });
    if (!user)
      throw new UnauthorizedException('Usuario inactivo o inexistente');
    const [scopes, rows] = await Promise.all([
      this.dataSource.getRepository(RbacScope).find(),
      this.dataSource.query(
        `
        SELECT a.role_id AS roleId, a.scope_id AS scopeId, a.active AS assignmentActive,
          r.active AS roleActive, p.code AS permission, p.active AS permissionActive,
          g.resource_access AS resourceAccess, g.include_descendants AS includeDescendants
        FROM rbac_user_role_assignments a
        JOIN rbac_roles r ON r.id = a.role_id AND r.kind = a.role_kind
        LEFT JOIN rbac_role_permissions g ON g.role_id = r.id
        LEFT JOIN rbac_permissions p ON p.code = g.permission_code
        WHERE a.user_id = ?
        UNION ALL
        SELECT o.role_id, o.scope_id, 1, r.active, p.code, p.active, g.resource_access, g.include_descendants
        FROM rbac_platform_owner o
        JOIN rbac_roles r ON r.id = o.role_id AND r.kind = o.role_kind
        LEFT JOIN rbac_role_permissions g ON g.role_id = r.id
        LEFT JOIN rbac_permissions p ON p.code = g.permission_code
        WHERE o.user_id = ?`,
        [userId, userId],
      ) as Promise<GrantRow[]>,
    ]);
    const assignments = new Map<string, RoleAssignment>();
    for (const row of rows) {
      const key = `${row.roleId}:${row.scopeId}`;
      let assignment = assignments.get(key);
      if (!assignment) {
        assignment = {
          roleId: Number(row.roleId),
          scopeId: Number(row.scopeId),
          active: Number(row.assignmentActive) === 1,
          roleActive: Number(row.roleActive) === 1,
          grants: [],
        };
        assignments.set(key, assignment);
      }
      if (row.permission)
        assignment.grants = [
          ...assignment.grants,
          {
            permission: row.permission,
            active: Number(row.permissionActive) === 1,
            resourceAccess: row.resourceAccess,
            includeDescendants: Number(row.includeDescendants) === 1,
          },
        ];
    }
    const subject: AuthorizationSubject = {
      userId,
      active: true,
      assignments: [...assignments.values()],
    };
    const policy = compileAuthorizationPolicy(
      subject,
      permission,
      scopes.map((scope) => ({
        id: scope.id,
        parentId: scope.parent_id,
        kind: scope.kind,
        active: scope.active,
      })),
    );
    if (!policy.scopeIds.length && !policy.ownScopeIds.length)
      throw new ForbiddenException('Sin permiso en un ámbito activo');
    let scopeId: number | undefined;
    if (scopeHeader !== undefined) {
      if (
        typeof scopeHeader !== 'string' ||
        !/^[1-9]\d*$/.test(scopeHeader) ||
        !Number.isSafeInteger(Number(scopeHeader))
      )
        throw new BadRequestException('x-scope-id debe ser un entero positivo');
      scopeId = Number(scopeHeader);
      if (![...policy.scopeIds, ...policy.ownScopeIds].includes(scopeId))
        throw new ForbiddenException('Ámbito solicitado no autorizado');
    }
    const resourceScopeIds = scopes
      .filter(
        ({ id, kind }) =>
          kind !== 'GLOBAL' &&
          [...policy.scopeIds, ...policy.ownScopeIds].includes(id),
      )
      .map(({ id }) => id);
    // Selecting a context narrows access; it never adds scope to another assignment.
    if (scopeId !== undefined) {
      policy.scopeIds = policy.scopeIds.filter((id) => id === scopeId);
      policy.ownScopeIds = policy.ownScopeIds.filter((id) => id === scopeId);
    }
    return { permission, policy, scopeId, resourceScopeIds };
  }
}
