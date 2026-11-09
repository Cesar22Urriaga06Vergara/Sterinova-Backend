import 'reflect-metadata';
import {
  ForbiddenException,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ScopedPermissions,
  RequirePermission,
} from './require-permission.decorator.js';
import { AuthorizationGuard, PermissionGuard } from './authorization.guard.js';
import type { RolesGuard } from '../common/guards/roles.guard.js';
import type { RbacAuthorizationService } from './rbac-authorization.service.js';

@ScopedPermissions()
class Pilot {
  @RequirePermission('cotizaciones.ver')
  list() {}
  forgotten() {}
}
class Legacy {
  list() {}
}
class Incomplete {
  @RequirePermission('cotizaciones.ver') list() {}
}

const context = (
  controller: typeof Pilot | typeof Legacy | typeof Incomplete,
  method = 'list',
  request: object = { user: { id: 1, rol: 'Admin' } },
) =>
  ({
    getClass: () => controller,
    getHandler: () => controller.prototype[method as 'list'],
    switchToHttp: () => ({ getRequest: () => request }),
  }) as unknown as ExecutionContext;

describe('explicit legacy/RBAC routing without fallback', () => {
  it('does not consult legacy Admin bypass after a pilot permission denial', async () => {
    const legacy = { canActivate: vi.fn(() => true) };
    const rbac = {
      canActivate: vi.fn(async () => {
        throw new ForbiddenException();
      }),
    };
    const guard = new AuthorizationGuard(
      new Reflector(),
      legacy as unknown as RolesGuard,
      rbac as unknown as PermissionGuard,
    );
    await expect(guard.canActivate(context(Pilot))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(legacy.canActivate).not.toHaveBeenCalled();
  });
  it('keeps the legacy guard in charge of an unmigrated controller', async () => {
    const legacy = { canActivate: vi.fn(() => false) };
    const rbac = { canActivate: vi.fn() };
    const guard = new AuthorizationGuard(
      new Reflector(),
      legacy as unknown as RolesGuard,
      rbac as unknown as PermissionGuard,
    );
    expect(await guard.canActivate(context(Legacy))).toBe(false);
    expect(rbac.canActivate).not.toHaveBeenCalled();
  });
  it('denies a permission decorator outside an explicitly migrated controller', async () => {
    const legacy = { canActivate: vi.fn(() => true) };
    const guard = new AuthorizationGuard(
      new Reflector(),
      legacy as unknown as RolesGuard,
      {} as PermissionGuard,
    );
    await expect(guard.canActivate(context(Incomplete))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(legacy.canActivate).not.toHaveBeenCalled();
  });
  it('denies missing permission metadata in a pilot controller', async () => {
    const service = { getContext: vi.fn() };
    const guard = new PermissionGuard(
      new Reflector(),
      service as unknown as RbacAuthorizationService,
    );
    await expect(
      guard.canActivate(context(Pilot, 'forgotten')),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(service.getContext).not.toHaveBeenCalled();
  });
  it('requires authenticated identity and replaces any preexisting request context', async () => {
    const trusted = {
      permission: 'cotizaciones.ver',
      policy: { userId: 7, scopeIds: [], ownScopeIds: [2] },
      scopeId: undefined,
    };
    const service = { getContext: vi.fn(async () => trusted) };
    const guard = new PermissionGuard(
      new Reflector(),
      service as unknown as RbacAuthorizationService,
    );
    await expect(
      guard.canActivate(context(Pilot, 'list', {})),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    const request = { user: { id: 7 }, rbac: { forged: true }, headers: {} };
    expect(await guard.canActivate(context(Pilot, 'list', request))).toBe(true);
    expect(request.rbac).toBe(trusted);
  });
});
