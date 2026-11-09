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
import {
  PERMISSION_CATALOG,
  isPermissionCode,
  type PermissionCode,
} from './permission-catalog.js';

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

  private async loadSubject(userId: number) {
    if (!Number.isSafeInteger(userId) || userId < 1)
      throw new UnauthorizedException();
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId, activo: true } });
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
    return { user, subject, scopes };
  }

  private compile(
    subject: AuthorizationSubject,
    permission: string,
    scopes: RbacScope[],
  ) {
    return compileAuthorizationPolicy(
      subject,
      permission,
      scopes.map((scope) => ({
        id: scope.id,
        parentId: scope.parent_id,
        kind: scope.kind,
        active: scope.active,
      })),
    );
  }

  async getSession(userId: number, scopeHeader?: string | string[]) {
    const { user, subject, scopes } = await this.loadSubject(userId);
    const policies = PERMISSION_CATALOG.map(({ code }) => ({
      permission: code,
      policy: this.compile(subject, code, scopes),
    }));
    const allowedIds = new Set(
      policies.flatMap(({ policy }) => [
        ...policy.scopeIds,
        ...policy.ownScopeIds,
      ]),
    );
    const available_scopes = scopes
      .filter((scope) => allowedIds.has(scope.id))
      .map(({ id, code, name, kind }) => ({ id, code, name, kind }));
    const selectedId = this.parseScope(scopeHeader);
    if (selectedId !== undefined && !allowedIds.has(selectedId))
      throw new ForbiddenException('Ámbito solicitado no autorizado');
    const current_scope =
      selectedId !== undefined
        ? available_scopes.find((scope) => scope.id === selectedId)!
        : available_scopes.length === 1
          ? available_scopes[0]
          : null;
    const capabilities = policies
      .map(({ permission, policy }) => ({
        permission,
        scope_ids: policy.scopeIds.filter(
          (id) => !current_scope || id === current_scope.id,
        ),
        own_scope_ids: policy.ownScopeIds.filter(
          (id) => !current_scope || id === current_scope.id,
        ),
      }))
      .filter(
        (capability) =>
          capability.scope_ids.length || capability.own_scope_ids.length,
      );
    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        cargo: user.cargo,
        celular: user.celular,
        email_contacto: user.email_contacto,
      },
      permissions: capabilities.map(({ permission }) => permission),
      capabilities,
      current_scope,
      available_scopes,
    };
  }

  private parseScope(scopeHeader?: string | string[]) {
    if (scopeHeader === undefined) return undefined;
    if (
      typeof scopeHeader !== 'string' ||
      !/^[1-9]\d*$/.test(scopeHeader) ||
      !Number.isSafeInteger(Number(scopeHeader))
    )
      throw new BadRequestException('x-scope-id debe ser un entero positivo');
    return Number(scopeHeader);
  }

  async getContext(
    userId: number,
    permission: string,
    scopeHeader?: string | string[],
  ): Promise<PermissionContext> {
    if (!isPermissionCode(permission))
      throw new ForbiddenException('Permiso no reconocido');
    const { subject, scopes } = await this.loadSubject(userId);
    const policy = this.compile(subject, permission, scopes);
    if (!policy.scopeIds.length && !policy.ownScopeIds.length)
      throw new ForbiddenException('Sin permiso en un ámbito activo');
    const scopeId = this.parseScope(scopeHeader);
    if (scopeHeader !== undefined) {
      if (![...policy.scopeIds, ...policy.ownScopeIds].includes(scopeId!))
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
