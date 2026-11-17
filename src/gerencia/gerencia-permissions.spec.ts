import 'reflect-metadata';
import { Reflector } from '@nestjs/core';
import {
  AuthorizationGuard,
  PermissionGuard,
} from '../rbac/authorization.guard.js';
import { RbacAuthorizationService } from '../rbac/rbac-authorization.service.js';
import { User } from '../users/entities/user.entity.js';
import { GerenciaController } from './gerencia.controller.js';
import { GerenciaAdministradoresController } from './gerencia-administradores.controller.js';

describe('managerial endpoint permissions', () => {
  function fixture(permission: string, scopeHeader?: string) {
    const source = {
      getRepository: (entity: unknown) =>
        entity === User
          ? { findOne: async () => ({ id: 7, activo: true }) }
          : {
              find: async () => [
                { id: 1, parent_id: null, kind: 'GLOBAL', active: true },
                { id: 2, parent_id: 1, kind: 'DEPARTMENT', active: true },
                { id: 3, parent_id: 1, kind: 'DEPARTMENT', active: true },
              ],
            },
      query: async () => [
        {
          roleId: 30,
          scopeId: 2,
          assignmentActive: 1,
          roleActive: 1,
          permission,
          permissionActive: 1,
          resourceAccess: 'SCOPE',
          includeDescendants: 0,
        },
      ],
    };
    const reflector = new Reflector();
    const guard = new AuthorizationGuard(
      reflector,
      new PermissionGuard(
        reflector,
        new RbacAuthorizationService(source as never),
      ),
    );
    const request = {
      user: { id: 7 },
      headers: scopeHeader ? { 'x-scope-id': scopeHeader } : {},
      rbac: undefined as unknown,
    };
    const context = (controller, method) =>
      ({
        getHandler: () => controller.prototype[method],
        getClass: () => controller,
        switchToHttp: () => ({ getRequest: () => request }),
      }) as never;
    return { guard, request, context };
  }
  it('attaches the metric grant and rejects a sibling scope', async () => {
    const f = fixture('gerencia.metricas.ver');
    await expect(
      f.guard.canActivate(f.context(GerenciaController, 'resumen')),
    ).resolves.toBe(true);
    expect(f.request.rbac).toMatchObject({
      permission: 'gerencia.metricas.ver',
      policy: { scopeIds: [2] },
    });
    const sibling = fixture('gerencia.metricas.ver', '3');
    await expect(
      sibling.guard.canActivate(sibling.context(GerenciaController, 'resumen')),
    ).rejects.toMatchObject({ status: 403 });
  });
  it.each(['crear', 'asignar', 'retirar', 'catalogo', 'listar'])(
    'a metrics reader cannot %s administrators',
    async (method) => {
      const f = fixture('gerencia.metricas.ver');
      await expect(
        f.guard.canActivate(
          f.context(GerenciaAdministradoresController, method),
        ),
      ).rejects.toMatchObject({ status: 403 });
    },
  );
  it('requires identity even with an explicit permission', async () => {
    const f = fixture('gerencia.metricas.ver');
    f.request.user.id = 0;
    await expect(
      f.guard.canActivate(f.context(GerenciaController, 'detalle')),
    ).rejects.toMatchObject({ status: 401 });
  });
});
