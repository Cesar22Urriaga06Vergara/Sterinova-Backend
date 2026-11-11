import { ForbiddenException } from '@nestjs/common';
import { UserRolesService } from './user-roles.service.js';

describe('UserRolesService privileged password resets', () => {
  const identityContext = {
    permission: 'usuarios.identidad.gestionar',
    policy: { userId: 7, scopeIds: [1], ownScopeIds: [] },
    resourceScopeIds: [],
  };

  function fixture(targetIsPrivileged: boolean, canManageRoles: boolean) {
    const db = {
      getRepository: () => ({ findOneBy: async () => ({ id: 1, kind: 'GLOBAL', active: true }) }),
      query: vi.fn(async () => targetIsPrivileged ? [{ privileged: 1 }] : []),
    };
    const authorization = {
      getContext: vi.fn(async (_id: number, permission: string) => ({
        permission,
        policy: {
          userId: 7,
          scopeIds: canManageRoles ? [1] : [],
          ownScopeIds: [],
        },
        resourceScopeIds: [],
      })),
    };
    return {
      service: new UserRolesService(db as never, authorization as never),
      authorization,
    };
  }

  it('allows a global identity manager to reset an ordinary user', async () => {
    const { service, authorization } = fixture(false, false);

    await expect(service.authorizePasswordReset(7, 42, identityContext as never))
      .resolves.toBeUndefined();
    expect(authorization.getContext).not.toHaveBeenCalled();
  });

  it('requires global role-management authority for a privileged account', async () => {
    const { service, authorization } = fixture(true, false);

    await expect(service.authorizePasswordReset(7, 42, identityContext as never))
      .rejects.toBeInstanceOf(ForbiddenException);
    expect(authorization.getContext).toHaveBeenCalledWith(7, 'roles.gestionar');
  });

  it('allows a global role manager to reset a privileged account', async () => {
    const { service } = fixture(true, true);

    await expect(service.authorizePasswordReset(7, 42, identityContext as never))
      .resolves.toBeUndefined();
  });
});
