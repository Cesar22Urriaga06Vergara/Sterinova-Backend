import { HealthController } from '../health/health.controller.js';
import { CertificadosController } from '../certificados/certificados.controller.js';
import { AppController } from '../app.controller.js';
import { AuthController } from '../auth/auth.controller.js';
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
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import type { RbacAuthorizationService } from './rbac-authorization.service.js';

@ScopedPermissions()
class Pilot {
  @RequirePermission('cotizaciones.ver')
  list() {}
  forgotten() {}
}
@Roles(UserRole.COMERCIAL)
class Legacy {
  list() {}
}
class Incomplete {
  @RequirePermission('cotizaciones.ver') list() {}
}

const context = (
  controller: { prototype: object },
  method = 'list',
  request: object = { user: { id: 1, rol: 'Admin' } },
) =>
  ({
    getClass: () => controller,
    getHandler: () => (controller.prototype as Record<string, unknown>)[method],
    switchToHttp: () => ({ getRequest: () => request }),
  }) as unknown as ExecutionContext;

describe('explicit legacy/RBAC routing without fallback', () => {
  it.each([-1, 1.5, '7', Number.MAX_SAFE_INTEGER + 1])(
    'rejects malformed persisted identity %s before loading grants',
    async (id) => {
      const service = { getContext: vi.fn(async () => ({})) };
      const guard = new PermissionGuard(
        new Reflector(),
        service as unknown as RbacAuthorizationService,
      );
      await expect(
        guard.canActivate(context(Pilot, 'list', { user: { id } })),
      ).rejects.toMatchObject({ status: 401 });
      expect(service.getContext).not.toHaveBeenCalled();
    },
  );
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

class Unprotected {
  list() {}
}
class PublicRoute {
  @Public() list() {}
}
class EmptyRoles {
  @Roles() list() {}
}
describe('fail-closed route policies', () => {
  const guard = () =>
    new AuthorizationGuard(
      new Reflector(),
      new RolesGuard(new Reflector()),
      {} as PermissionGuard,
    );
  it.each([Unprotected, EmptyRoles])(
    'denies missing or empty legacy policy even for Admin',
    async (controller) => {
      await expect(
        guard().canActivate(context(controller)),
      ).rejects.toMatchObject({ status: 403 });
    },
  );
  it('preserves legacy Admin and Comercial with explicit Roles', async () => {
    for (const rol of ['Admin', 'Comercial']) {
      expect(
        await guard().canActivate(
          context(Legacy, 'list', { user: { id: 1, rol } }),
        ),
      ).toBe(true);
    }
    expect(
      await guard().canActivate(
        context(Legacy, 'list', { user: { id: 1, rol: 'Planta' } }),
      ),
    ).toBe(false);
  });
  it('allows explicitly public routes without a user', async () => {
    expect(await guard().canActivate(context(PublicRoute, 'list', {}))).toBe(
      true,
    );
  });
});

describe('existing session and public routes', () => {
  const guard = () =>
    new AuthorizationGuard(
      new Reflector(),
      new RolesGuard(new Reflector()),
      {} as PermissionGuard,
    );
  it.each([
    [AppController, 'getHello'],
    [AuthController, 'me'],
  ] as const)('requires a session for %s %s', async (controller, method) => {
    await expect(
      guard().canActivate(context(controller, method, {})),
    ).rejects.toMatchObject({ status: 401 });
    expect(await guard().canActivate(context(controller, method))).toBe(true);
  });
});

describe('public endpoint inventory', () => {
  it.each([
    [AuthController, 'login'],
    [HealthController, 'live'],
    [HealthController, 'ready'],
    [CertificadosController, 'validar'],
  ] as const)('allows anonymous %s %s', async (controller, method) => {
    const guard = new AuthorizationGuard(
      new Reflector(),
      new RolesGuard(new Reflector()),
      {} as PermissionGuard,
    );
    expect(await guard.canActivate(context(controller, method, {}))).toBe(true);
  });
});
