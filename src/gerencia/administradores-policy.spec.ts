import {
  assertAreaAdministrator,
  assertManagementContext,
} from './administradores-policy.js';
const access = {
  permission: 'gerencia.administradores.gestionar',
  policy: { userId: 7, scopeIds: [1, 2], ownScopeIds: [] },
  resourceScopeIds: [2],
} as const;
describe('delegation to area administrators', () => {
  it('allows the general manager to appoint an ordinary area administrator', () => {
    expect(() =>
      assertAreaAdministrator(
        { code: 'admin_comercial', kind: 'STANDARD', active: true },
        { id: 2, kind: 'DEPARTMENT', active: true },
        access as never,
      ),
    ).not.toThrow();
  });
  it.each([
    'superadmin',
    'admin_general',
    'gerente_general',
    'asesor_comercial',
    'director_tecnico',
  ])('denies a non-delegable role %s', (code) => {
    expect(() =>
      assertAreaAdministrator(
        { code, kind: 'STANDARD', active: true },
        { id: 2, kind: 'DEPARTMENT', active: true },
        access as never,
      ),
    ).toThrow();
  });
  it('denies global, inactive and unrelated scopes and platform roles', () => {
    const role = { code: 'admin_planta', kind: 'STANDARD', active: true };
    for (const scope of [
      { id: 1, kind: 'GLOBAL', active: true },
      { id: 3, kind: 'DEPARTMENT', active: true },
      { id: 2, kind: 'DEPARTMENT', active: false },
    ])
      expect(() =>
        assertAreaAdministrator(role, scope, access as never),
      ).toThrow();
    expect(() =>
      assertAreaAdministrator(
        { ...role, kind: 'PLATFORM' },
        { id: 2, kind: 'DEPARTMENT', active: true },
        access as never,
      ),
    ).toThrow();
    expect(() =>
      assertAreaAdministrator(
        { ...role, active: false },
        { id: 2, kind: 'DEPARTMENT', active: true },
        access as never,
      ),
    ).toThrow();
  });
  it('never uses OWN or a different permission to manage administrators', () => {
    expect(() =>
      assertManagementContext(
        { ...access, permission: 'usuarios.ver' } as never,
        7,
      ),
    ).toThrow();
    expect(() => assertManagementContext(access as never, 8)).toThrow();
    expect(() =>
      assertManagementContext(
        {
          ...access,
          policy: { userId: 7, scopeIds: [], ownScopeIds: [2] },
        } as never,
        7,
      ),
    ).toThrow();
  });
});
