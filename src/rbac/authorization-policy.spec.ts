import {
  compileAuthorizationPolicy,
  canAccessResource,
} from './authorization-policy.js';
import type {
  AuthorizationSubject,
  AuthorizationScope,
  PermissionGrant,
} from './authorization.types.js';

const scopes: AuthorizationScope[] = [
  { id: 1, parentId: null, kind: 'GLOBAL', active: true },
  { id: 10, parentId: 1, kind: 'DEPARTMENT', active: true },
  { id: 11, parentId: 10, kind: 'TEAM', active: true },
  { id: 12, parentId: 10, kind: 'TEAM', active: true },
  { id: 20, parentId: 1, kind: 'DEPARTMENT', active: true },
  { id: 21, parentId: 20, kind: 'PLANT', active: true },
];

const grant = (overrides: Partial<PermissionGrant> = {}): PermissionGrant => ({
  permission: 'cotizaciones.editar',
  active: true,
  resourceAccess: 'SCOPE',
  includeDescendants: false,
  ...overrides,
});

function subject(scopeId = 11, grants = [grant()]): AuthorizationSubject {
  return {
    userId: 7,
    active: true,
    assignments: [
      { roleId: 100, scopeId, active: true, roleActive: true, grants },
    ],
  };
}

const policy = (user: AuthorizationSubject | null, hierarchy = scopes) =>
  compileAuthorizationPolicy(user, 'cotizaciones.editar', hierarchy);

describe('scoped permission authorization', () => {
  it('denies missing authentication and inactive users', () => {
    expect(canAccessResource(policy(null), { scopeId: 11, creatorId: 7 })).toBe(
      false,
    );
    expect(
      canAccessResource(policy({ ...subject(), active: false }), {
        scopeId: 11,
      }),
    ).toBe(false);
  });

  it('denies an authenticated user without an explicit permission', () => {
    expect(canAccessResource(policy(subject(11, [])), { scopeId: 11 })).toBe(
      false,
    );
  });

  it('grants access in the assigned scope without depending on a role name', () => {
    const customRoleUser = subject();
    customRoleUser.assignments[0].roleId = 98765;
    expect(canAccessResource(policy(customRoleUser), { scopeId: 11 })).toBe(
      true,
    );
  });

  it('denies unknown permission codes even if an assignment attempts to grant them', () => {
    const user = subject(11, [grant({ permission: '*' })]);
    expect(
      canAccessResource(compileAuthorizationPolicy(user, '*', scopes), {
        scopeId: 11,
      }),
    ).toBe(false);
  });

  it('does not elevate a legacy Admin claim', () => {
    const user = { ...subject(11, []), rol: 'Admin' };
    expect(canAccessResource(policy(user), { scopeId: 20 })).toBe(false);
  });

  it.each(['active', 'roleActive'] as const)(
    'denies an assignment whose %s flag is false',
    (flag) => {
      const user = subject();
      user.assignments[0][flag] = false;
      expect(canAccessResource(policy(user), { scopeId: 11 })).toBe(false);
    },
  );

  it('denies disabled permissions', () => {
    expect(
      canAccessResource(policy(subject(11, [grant({ active: false })])), {
        scopeId: 11,
      }),
    ).toBe(false);
  });

  it('does not grant access to a sibling team or another department', () => {
    const access = policy(subject());
    expect(canAccessResource(access, { scopeId: 12 })).toBe(false);
    expect(canAccessResource(access, { scopeId: 20 })).toBe(false);
    expect(canAccessResource(access, { scopeId: 10 })).toBe(false);
  });

  it('allows a department head to access descendants only when explicitly granted', () => {
    expect(canAccessResource(policy(subject(10)), { scopeId: 11 })).toBe(false);
    const access = policy(subject(10, [grant({ includeDescendants: true })]));
    expect(canAccessResource(access, { scopeId: 11 })).toBe(true);
    expect(canAccessResource(access, { scopeId: 12 })).toBe(true);
    expect(canAccessResource(access, { scopeId: 21 })).toBe(false);
  });

  it('requires creator and scope together for OWN access', () => {
    const access = policy(subject(11, [grant({ resourceAccess: 'OWN' })]));
    expect(canAccessResource(access, { scopeId: 11, creatorId: 7 })).toBe(true);
    expect(canAccessResource(access, { scopeId: 11, creatorId: 8 })).toBe(
      false,
    );
    expect(canAccessResource(access, { scopeId: 12, creatorId: 7 })).toBe(
      false,
    );
    expect(canAccessResource(access, { scopeId: 11 })).toBe(false);
  });

  it('keeps permissions bound to their assignment when a user has several roles', () => {
    const user = subject();
    user.assignments = [
      ...user.assignments,
      {
        roleId: 200,
        scopeId: 20,
        active: true,
        roleActive: true,
        grants: [
          grant({ permission: 'calidad.ciclos.ver', includeDescendants: true }),
        ],
      },
    ];
    const commercialAccess = policy(user);
    expect(canAccessResource(commercialAccess, { scopeId: 11 })).toBe(true);
    expect(canAccessResource(commercialAccess, { scopeId: 20 })).toBe(false);
    expect(canAccessResource(commercialAccess, { scopeId: 21 })).toBe(false);
    const qualityAccess = compileAuthorizationPolicy(
      user,
      'calidad.ciclos.ver',
      scopes,
    );
    expect(canAccessResource(qualityAccess, { scopeId: 21 })).toBe(true);
    expect(canAccessResource(qualityAccess, { scopeId: 11 })).toBe(false);
  });

  it('combines separate grants of the same permission without widening ownership', () => {
    const user = subject(11, [grant({ resourceAccess: 'OWN' })]);
    user.assignments = [
      ...user.assignments,
      {
        roleId: 300,
        scopeId: 12,
        active: true,
        roleActive: true,
        grants: [grant()],
      },
    ];
    const access = policy(user);
    expect(canAccessResource(access, { scopeId: 11, creatorId: 8 })).toBe(
      false,
    );
    expect(canAccessResource(access, { scopeId: 12, creatorId: 8 })).toBe(true);
    expect(canAccessResource(access, { scopeId: 20, creatorId: 7 })).toBe(
      false,
    );
  });

  it('evaluates platform access through explicit global grants, without a superuser bypass', () => {
    expect(canAccessResource(policy(subject(1)), { scopeId: 21 })).toBe(false);
    const access = policy(subject(1, [grant({ includeDescendants: true })]));
    expect(canAccessResource(access, { scopeId: 21 })).toBe(true);
    expect(
      canAccessResource(
        compileAuthorizationPolicy(subject(1), 'roles.gestionar', scopes),
        { scopeId: 1 },
      ),
    ).toBe(false);
  });

  it('invalidates access beneath an inactive ancestor', () => {
    const hierarchy = scopes.map((scope) =>
      scope.id === 10 ? { ...scope, active: false } : scope,
    );
    expect(
      canAccessResource(policy(subject(), hierarchy), { scopeId: 11 }),
    ).toBe(false);
  });

  it('rejects missing, duplicate, cyclic or disconnected scope hierarchies', () => {
    const cases = [
      scopes.filter((scope) => scope.id !== 10),
      [...scopes, scopes[2]],
      scopes.map((scope) =>
        scope.id === 10 ? { ...scope, parentId: 11 } : scope,
      ),
      scopes.map((scope) =>
        scope.id === 10 ? { ...scope, parentId: null } : scope,
      ),
      [
        ...scopes,
        { id: 30, parentId: null, kind: 'GLOBAL' as const, active: true },
      ],
    ];
    for (const hierarchy of cases) {
      expect(
        canAccessResource(policy(subject(), hierarchy), { scopeId: 11 }),
      ).toBe(false);
    }
  });

  it('denies resources without a reconciled scope and invalid subject ids', () => {
    const access = policy(subject());
    expect(canAccessResource(access, { scopeId: null })).toBe(false);
    expect(canAccessResource(access, { scopeId: 999 })).toBe(false);
    expect(
      canAccessResource(policy({ ...subject(), userId: 0 }), { scopeId: 11 }),
    ).toBe(false);
  });

  it('reflects revocation on the next compilation instead of caching permissions across requests', () => {
    const user = subject();
    expect(canAccessResource(policy(user), { scopeId: 11 })).toBe(true);
    user.assignments[0].active = false;
    expect(canAccessResource(policy(user), { scopeId: 11 })).toBe(false);
  });

  it('returns separate deterministic constraints for SQL filtering before counting/pagination', () => {
    const access = policy(
      subject(10, [grant({ resourceAccess: 'OWN', includeDescendants: true })]),
    );
    expect(access).toEqual({
      userId: 7,
      scopeIds: [],
      ownScopeIds: [10, 11, 12],
    });
  });
});
