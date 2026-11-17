import { UserRolesService } from './user-roles.service.js';
import { RbacRole } from '../rbac/entities/role.entity.js';

describe('technical appointment of the general manager', () => {
  it('exposes the managerial profile in the protected catalog without exposing platform ownership', async () => {
    const manager = { id: 30, code: 'gerente_general', name: 'Gerente General', kind: 'STANDARD', active: true };
    const db = {
      getRepository: (entity: unknown) => entity === RbacRole
        ? { find: async () => [manager, { id: 1, code: 'superadmin', kind: 'PLATFORM' }] }
        : { findOneBy: async () => ({ id: 1, kind: 'GLOBAL', active: true }), find: async () => [] },
      query: async () => [],
    };
    const access = { permission: 'asignaciones.gestionar', policy: { userId: 7, scopeIds: [1], ownScopeIds: [] } };
    const catalog = await new UserRolesService(db as never, {} as never).catalog(7, access as never);
    expect(catalog.roles).toEqual([expect.objectContaining({ code: 'gerente_general' })]);
  });
});
