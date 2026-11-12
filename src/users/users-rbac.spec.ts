import 'reflect-metadata';
import { Reflector } from '@nestjs/core';
import type { ExecutionContext } from '@nestjs/common';
import { AuthorizationGuard, PermissionGuard } from '../rbac/authorization.guard.js';
import { RbacAuthorizationService } from '../rbac/rbac-authorization.service.js';
import { User } from './entities/user.entity.js';
import { UsersController } from './users.controller.js';
import { UserRolesController } from './user-roles.controller.js';

describe('users route permissions', () => {
  function fixture(permission: string, scopeId = 2) {
    const source = {
      getRepository: (entity: unknown) => entity === User
        ? { findOne: async () => ({ id: 7, activo: true, rol: 'Admin' }) }
        : { find: async () => [
          { id: 1, parent_id: null, kind: 'GLOBAL', active: true },
          { id: 2, parent_id: 1, kind: 'DEPARTMENT', active: true },
          { id: 3, parent_id: 1, kind: 'DEPARTMENT', active: true },
        ] },
      query: async () => [{ roleId: 20, scopeId, assignmentActive: 1, roleActive: 1,
        permission, permissionActive: 1, resourceAccess: 'SCOPE', includeDescendants: 0 }],
    };
    const reflector = new Reflector();
    const guard = new AuthorizationGuard(reflector,
      new PermissionGuard(reflector, new RbacAuthorizationService(source as never)));
    const request = { user: { id: 7, rol: 'Admin' }, headers: {} as Record<string, string>, rbac: undefined as unknown };
    const context = (controller: typeof UsersController | typeof UserRolesController, method: string) => ({
      getClass: () => controller,
      getHandler: () => (controller.prototype as unknown as Record<string, unknown>)[method],
      switchToHttp: () => ({ getRequest: () => request }),
    }) as unknown as ExecutionContext;
    return { guard, request, context };
  }

  it('attaches scoped users.ver context to the list', async () => {
    const { guard, request, context } = fixture('usuarios.ver');
    expect(await guard.canActivate(context(UsersController, 'findAll'))).toBe(true);
    expect(request.rbac).toMatchObject({ permission: 'usuarios.ver', policy: { scopeIds: [2] } });
  });
  it.each(['create', 'update', 'changePassword', 'resetPassword', 'setActive'])(
    'denies %s to an area reader even when its legacy role is Admin', async (method) => {
      const { guard, context } = fixture('usuarios.ver');
      await expect(guard.canActivate(context(UsersController, method))).rejects.toMatchObject({ status: 403 });
    },
  );
  it('rejects a requested sibling scope', async () => {
    const { guard, request, context } = fixture('usuarios.ver');
    request.headers['x-scope-id'] = '3';
    await expect(guard.canActivate(context(UsersController, 'findAll'))).rejects.toMatchObject({ status: 403 });
  });
  it('does not give a global reader identity management', async () => {
    const { guard, context } = fixture('usuarios.ver', 1);
    await expect(guard.canActivate(context(UsersController, 'update'))).rejects.toMatchObject({ status: 403 });
  });
  it.each(['catalog', 'assignments', 'assign', 'remove'])(
    'requires assignment capability for %s', async (method) => {
      const { guard, context } = fixture('usuarios.ver');
      await expect(guard.canActivate(context(UserRolesController, method))).rejects.toMatchObject({ status: 403 });
    },
  );
  it('denies DELETE identity even to a global identity manager', async () => {
    const { guard, context } = fixture('usuarios.identidad.gestionar', 1);
    await expect(guard.canActivate(context(UsersController, 'deactivate'))).rejects.toMatchObject({ status: 403 });
  });
});
