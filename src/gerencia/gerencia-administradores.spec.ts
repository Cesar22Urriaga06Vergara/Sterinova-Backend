import { GerenciaAdministradoresService } from './gerencia-administradores.service.js';
import { User } from '../users/entities/user.entity.js';
import { RbacRole } from '../rbac/entities/role.entity.js';
import { RbacScope } from '../rbac/entities/scope.entity.js';
import { RbacUserRoleAssignment } from '../rbac/entities/user-role-assignment.entity.js';
const access = {
  permission: 'gerencia.administradores.gestionar',
  policy: { userId: 7, scopeIds: [1, 2], ownScopeIds: [] },
  resourceScopeIds: [2],
};
function fixture() {
  const user = {
    id: 20,
    activo: true,
    nombre: 'Admin',
    email: 'admin@example.test',
  };
  const role = {
    id: 10,
    code: 'admin_comercial',
    active: true,
    kind: 'STANDARD',
    global_assignable: false,
  };
  const scope = { id: 2, kind: 'DEPARTMENT', active: true };
  const assignments: Record<string, unknown>[] = [];
  const users = {
    findOne: vi.fn(async () => user),
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => ({ ...value, id: 20 })),
  };
  const roles = { findOneBy: vi.fn(async () => role) };
  const scopes = {
    findOneBy: vi.fn(async (where) =>
      where.kind === 'GLOBAL' ? { id: 1 } : scope,
    ),
  };
  const assignmentRepo = {
    findOneBy: vi.fn(async () => null),
    create: vi.fn((v) => v),
    save: vi.fn(async (v) => {
      assignments.push(v);
      return { ...v, id: 1 };
    }),
    update: vi.fn(),
  };
  const query = vi.fn(async (sql: string) => {
    if (sql.includes('AS previous')) return [{ previous: null }];
    if (sql.includes('AS protected')) return [];
    return [];
  });
  const manager = {
    query,
    getRepository: (entity: unknown) =>
      entity === User
        ? users
        : entity === RbacRole
          ? roles
          : entity === RbacScope
            ? scopes
            : entity === RbacUserRoleAssignment
              ? assignmentRepo
              : undefined,
  };
  const db = { transaction: vi.fn(async (work) => work(manager)) };
  const rbac = { getContext: vi.fn(async () => access) };
  const audit = { create: vi.fn(async () => undefined) };
  return {
    service: new GerenciaAdministradoresService(
      db as never,
      rbac as never,
      audit as never,
    ),
    role,
    scope,
    user,
    users,
    assignments,
    assignmentRepo,
    db,
    rbac,
    audit,
    query,
  };
}
describe('general manager administration', () => {
  it('creates the identity and its area membership in the same transaction without exposing the password', async () => {
    const f = fixture();
    const result = await f.service.crear(
      {
        nombre: 'Admin',
        email: 'ADMIN@example.test',
        password: 'Testing-only-2026!',
        role_id: 10,
        scope_id: 2,
      },
      access as never,
    );
    expect(result).not.toHaveProperty('password_hash');
    expect(result.email).toBe('admin@example.test');
    expect(f.assignments).toEqual([
      expect.objectContaining({
        user_id: 20,
        role_id: 10,
        scope_id: 2,
        active: true,
      }),
    ]);
    expect(f.db.transaction).toHaveBeenCalledTimes(1);
    expect(f.audit.create).toHaveBeenCalledWith(
      expect.objectContaining({ usuario_id: 7, scope_id: 2 }),
      expect.anything(),
    );
    expect(f.query.mock.calls.at(-1)).toEqual([
      'SET @rbac_write_user = ?',
      [null],
    ]);
  });
  it('does not create an identity when the selected role is not delegable', async () => {
    const f = fixture();
    f.role.code = 'superadmin';
    await expect(
      f.service.crear(
        {
          nombre: 'Admin',
          email: 'a@example.test',
          password: 'Testing-only-2026!',
          role_id: 10,
          scope_id: 2,
        },
        access as never,
      ),
    ).rejects.toMatchObject({ status: 403 });
    expect(f.users.save).not.toHaveBeenCalled();
  });
  it('rechecks revocation inside the transaction before writing', async () => {
    const f = fixture();
    f.rbac.getContext.mockRejectedValue({ status: 403 });
    await expect(
      f.service.asignar(20, { role_id: 10, scope_id: 2 }, access as never),
    ).rejects.toMatchObject({ status: 403 });
    expect(f.assignmentRepo.save).not.toHaveBeenCalled();
  });
  it('restores the connection authorization marker when assignment fails', async () => {
    const f = fixture();
    f.assignmentRepo.save.mockRejectedValue(new Error('write failed'));
    await expect(
      f.service.asignar(20, { role_id: 10, scope_id: 2 }, access as never),
    ).rejects.toThrow('write failed');
    expect(f.query.mock.calls.at(-1)).toEqual([
      'SET @rbac_write_user = ?',
      [null],
    ]);
  });
  it('does not allow self-assignment', async () => {
    const f = fixture();
    await expect(
      f.service.asignar(7, { role_id: 10, scope_id: 2 }, access as never),
    ).rejects.toMatchObject({ status: 403 });
    expect(f.assignmentRepo.save).not.toHaveBeenCalled();
  });
  it('retires only the selected membership even after its area role was disabled', async () => {
    const f = fixture();
    f.role.active = false;
    f.assignmentRepo.findOneBy.mockResolvedValue({
      id: 11,
      user_id: 20,
      role_id: 10,
      scope_id: 2,
      active: true,
    } as never);
    await expect(f.service.retirar(20, 11, access as never)).resolves.toEqual({
      assignment_id: 11,
      active: false,
    });
    expect(f.assignmentRepo.update).toHaveBeenCalledWith(
      { id: 11, user_id: 20 },
      { active: false },
    );
    expect(f.users.save).not.toHaveBeenCalled();
    expect(f.user.activo).toBe(true);
  });
  it('denies changing memberships of a protected global account', async () => {
    const f = fixture();
    f.query.mockImplementation(async (sql) =>
      sql.includes('AS previous')
        ? [{ previous: null }]
        : sql.includes('AS protected')
          ? [{ protected: 1 }]
          : [],
    );
    await expect(
      f.service.asignar(20, { role_id: 10, scope_id: 2 }, access as never),
    ).rejects.toMatchObject({ status: 403 });
    expect(f.assignmentRepo.save).not.toHaveBeenCalled();
  });
});
