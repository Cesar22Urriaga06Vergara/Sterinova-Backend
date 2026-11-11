import {
  BACKEND_ROLES,
  FUTURE_PERMISSIONS,
} from '../database/migrations/1794312001000-SeedBackendRoles.js';
import { RbacAuthorizationService } from './rbac-authorization.service.js';
import { User } from '../users/entities/user.entity.js';

describe('RBAC session identity', () => {
  const scopes = [
    { id: 1, parent_id: null, kind: 'GLOBAL', active: true, name: 'Global' },
    {
      id: 2,
      parent_id: 1,
      kind: 'DEPARTMENT',
      active: true,
      name: 'Comercial',
    },
    { id: 3, parent_id: 1, kind: 'DEPARTMENT', active: true, name: 'Planta' },
  ];
  function fixture() {
    const rows = [
      'cotizaciones.ver',
      'cotizaciones.crear',
      'cotizaciones.previsualizar',
    ].map((permission) => ({
      roleId: 2,
      scopeId: 2,
      assignmentActive: 1,
      roleActive: 1,
      permission,
      permissionActive: 1,
      resourceAccess: 'OWN',
      includeDescendants: 0,
    }));
    const user = {
      id: 7,
      nombre: 'JUAN',
      email: 'juan@example.test',
      rol: 'Comercial',
      password_hash: 'secret',
    };
    const userRepository = { findOne: vi.fn(async () => user) };
    const scopeRepository = { find: vi.fn(async () => scopes) };
    const source = {
      getRepository: (entity: unknown) =>
        entity === User
          ? userRepository
          : scopeRepository,
      query: vi.fn(async () => rows),
    };
    return {
      service: new RbacAuthorizationService(source as never),
      rows,
      source,
      userRepository,
      scopeRepository,
    };
  }
  it('returns current grants and the sole scope without exposing password data', async () => {
    const { service } = fixture();
    const session = await service.getSession(7);
    expect(session.permissions).toContain('cotizaciones.crear');
    expect(session.permissions).not.toContain('cotizaciones.emitir');
    expect(session.current_scope).toMatchObject({ id: 2, name: 'Comercial' });
    expect(session.capabilities).toContainEqual({
      permission: 'cotizaciones.ver',
      scope_ids: [],
      own_scope_ids: [2],
    });
    expect(session.user).not.toHaveProperty('password_hash');
  });
  it('refreshes revoked grants and rejects unauthorized or malformed scope selection', async () => {
    const { service, rows } = fixture();
    await expect(service.getSession(7, '3')).rejects.toMatchObject({
      status: 403,
    });
    await expect(service.getSession(7, '2x')).rejects.toMatchObject({
      status: 400,
    });
    rows.splice(0);
    expect((await service.getSession(7)).permissions).toEqual([]);
    expect((await service.getSession(7)).current_scope).toBeNull();
  });
  it('requires selection for multiple scopes and narrows capabilities to the selected scope', async () => {
    const { service, rows } = fixture();
    rows.push({ ...rows[0], scopeId: 3, permission: 'cotizaciones.emitir' });
    expect((await service.getSession(7)).current_scope).toBeNull();
    const session = await service.getSession(7, '2');
    expect(session.permissions).not.toContain('cotizaciones.emitir');
    expect(session.available_scopes).toHaveLength(2);
  });
  it('rejects inactive or missing users', async () => {
    const source = { getRepository: () => ({ findOne: async () => null }) };
    await expect(
      new RbacAuthorizationService(source as never).getSession(7),
    ).rejects.toMatchObject({ status: 401 });
  });
  it('narrows creation candidates as well as reads to x-scope-id', async () => {
    const { service, rows } = fixture();
    rows.push({ ...rows[1], scopeId: 3 });
    const context = await service.getContext(7, 'cotizaciones.crear', '2');
    expect(context.policy.ownScopeIds).toEqual([2]);
    expect(context.resourceScopeIds).toEqual([2]);
  });
  it('recognizes seeded future permissions only with an active grant', async () => {
    const { service, rows } = fixture();
    rows.push({
      ...rows[0],
      permission: 'cotizaciones.aprobar_interna',
      resourceAccess: 'SCOPE',
    });
    expect(
      (await service.getContext(7, 'cotizaciones.aprobar_interna')).policy
        .scopeIds,
    ).toEqual([2]);
    await expect(
      service.getContext(7, 'cotizaciones.aprobar_interna', '3'),
    ).rejects.toMatchObject({ status: 403 });
    rows[rows.length - 1].permissionActive = 0;
    await expect(
      service.getContext(7, 'cotizaciones.aprobar_interna'),
    ).rejects.toMatchObject({ status: 403 });
  });

  it.each(FUTURE_PERMISSIONS)(
    'evaluates active seeded capability %s without enabling inactive grants',
    async (permission) => {
      const { service, rows } = fixture();
      rows.splice(0, rows.length, {
        ...rows[0],
        permission,
        resourceAccess: 'SCOPE',
      });
      expect((await service.getContext(7, permission)).policy.scopeIds).toEqual(
        [2],
      );
      rows[0].permissionActive = 0;
      await expect(service.getContext(7, permission)).rejects.toMatchObject({
        status: 403,
      });
    },
  );

  it('limits admin_comercial to its assignment and never borrows another role scope', async () => {
    const { service, rows } = fixture();
    const role = BACKEND_ROLES.find(({ code }) => code === 'admin_comercial')!;
    rows.splice(
      0,
      rows.length,
      ...role.grants.map((grant) => ({
        roleId: 20,
        scopeId: 2,
        assignmentActive: 1,
        roleActive: 1,
        permission: grant.permission,
        permissionActive: 1,
        resourceAccess: grant.access,
        includeDescendants: Number(grant.descendants),
      })),
    );
    rows.push({
      ...rows[0],
      roleId: 21,
      scopeId: 3,
      permission: 'planta.ciclos.ver',
    });
    expect(
      (await service.getContext(7, 'cotizaciones.aprobar_interna')).policy
        .scopeIds,
    ).toEqual([2]);
    await expect(
      service.getContext(7, 'cotizaciones.aprobar_interna', '3'),
    ).rejects.toMatchObject({ status: 403 });
    rows
      .filter((row) => row.roleId === 20)
      .forEach((row) => {
        row.roleActive = 0;
      });
    await expect(
      service.getContext(7, 'cotizaciones.aprobar_interna'),
    ).rejects.toMatchObject({ status: 403 });
  });
  it('keeps three database operations per context or session as the catalog grows', async () => {
    const { service, source, userRepository, scopeRepository } = fixture();
    await service.getContext(7, 'cotizaciones.ver');
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(scopeRepository.find).toHaveBeenCalledTimes(1);
    expect(source.query).toHaveBeenCalledTimes(1);
    expect(source.query.mock.calls[0]).toEqual([
      expect.stringContaining('UNION ALL'),
      [7, 7],
    ]);
    await service.getSession(7);
    expect(userRepository.findOne).toHaveBeenCalledTimes(2);
    expect(scopeRepository.find).toHaveBeenCalledTimes(2);
    expect(source.query).toHaveBeenCalledTimes(2);
  });
});
