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
    const source = {
      getRepository: (entity: unknown) =>
        entity === User
          ? { findOne: vi.fn(async () => user) }
          : { find: vi.fn(async () => scopes) },
      query: vi.fn(async () => rows),
    };
    return {
      service: new RbacAuthorizationService(source as never),
      rows,
      source,
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
});
