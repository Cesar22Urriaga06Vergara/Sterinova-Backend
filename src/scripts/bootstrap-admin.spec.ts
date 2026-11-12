import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import * as bcrypt from 'bcrypt';

const state = vi.hoisted(() => ({
  existing: null as Record<string, unknown> | null,
  id1: null as Record<string, unknown> | null,
  saved: [] as Record<string, unknown>[],
  updates: [] as { sql: string; parameters: unknown[] }[],
  assignments: [] as { role_id: number; scope_id: number }[],
  isGlobalAdmin: false,
  hasAssignments: false,
}));

vi.mock('../database/data-source.js', () => ({
  AppDataSource: {
    initialize: async () => {},
    destroy: async () => {},
    getRepository: () => ({
      findOneBy: async (criteria: Record<string, unknown>) =>
        'id' in criteria ? state.id1 : state.existing,
      create: (value: Record<string, unknown>) => value,
      save: async (value: Record<string, unknown>) => {
        value.id = 1;
        state.saved.push(value);
      },
      delete: async () => ({ affected: 1 }),
    }),
    query: async (sql: string, parameters: unknown[] = []) => {
      state.updates.push({ sql, parameters });
      if (sql.includes('admin_general')) {
        return [{ role_id: 4, scope_id: 1 }];
      }
      if (sql.includes('rbac_is_global_admin')) {
        return [{ is_admin: state.isGlobalAdmin ? 1 : 0 }];
      }
      if (sql.includes('WHERE user_id=? AND active=1')) {
        return state.assignments;
      }
      if (sql.includes('has_assignments')) {
        return [{ has_assignments: state.hasAssignments ? 1 : 0 }];
      }
      if (sql.includes('rbac_version')) return [{ rbac_version: 0 }];
      if (sql.startsWith('CALL rbac_set_user_roles')) {
        state.isGlobalAdmin = true;
        state.assignments = JSON.parse(String(parameters[1])) as {
          role_id: number;
          scope_id: number;
        }[];
      }
      if (sql.startsWith('UPDATE usuarios')) return { affectedRows: 1 };
      return [];
    },
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('ADMIN_NAME', 'Admin local');
  vi.stubEnv('ADMIN_EMAIL', ' ADMIN@example.com ');
  vi.stubEnv('ADMIN_PASSWORD', 'Local-password-1234');
  state.existing = null;
  state.id1 = null;
  state.saved = [];
  state.updates = [];
  state.assignments = [];
  state.isGlobalAdmin = false;
  state.hasAssignments = false;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it('creates a missing admin with a usable hashed password', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'bootstrap-admin', '--if-missing']);
  await import('./bootstrap-admin.js');
  expect(state.saved).toHaveLength(1);
  expect(state.saved[0]).toMatchObject({ nombre: 'Admin local', email: 'admin@example.com' });
  expect(state.saved[0]).not.toHaveProperty('rol');
  expect(state.updates.some(({ sql }) => sql.startsWith('CALL rbac_set_user_roles'))).toBe(true);
  expect(await bcrypt.compare('Local-password-1234', state.saved[0].password_hash as string)).toBe(true);
}, 15_000);

it('allows repeated development startup without modifying an existing account', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'bootstrap-admin', '--if-missing']);
  state.existing = { id: 7, email: 'admin@example.com', password_hash: 'original', rol: 'Admin' };
  await expect(import('./bootstrap-admin.js')).resolves.toBeDefined();
  expect(state.saved).toEqual([]);
  expect(state.existing.password_hash).toBe('original');
});

it('reconfigures ID 1 and bootstraps Admin General only when RBAC is empty', async () => {
  vi.stubEnv('ADMIN_NAME', '');
  vi.spyOn(process, 'argv', 'get').mockReturnValue([
    'node',
    'bootstrap-admin',
    '--reconfigure-id1',
  ]);
  state.id1 = {
    id: 1,
    nombre: 'Nombre existente',
    email: 'old@example.com',
    activo: 1,
  };
  await import('./bootstrap-admin.js');

  const assignment = state.updates.find(({ sql }) =>
    sql.startsWith('CALL rbac_set_user_roles'),
  );
  expect(assignment?.parameters).toEqual([
    1,
    JSON.stringify([{ role_id: 4, scope_id: 1 }]),
    null,
    0,
  ]);
  expect(state.updates.some(({ sql }) => sql.startsWith('UPDATE usuarios'))).toBe(
    true,
  );
  const identityUpdate = state.updates.find(({ sql }) =>
    sql.startsWith('UPDATE usuarios'),
  );
  expect(identityUpdate?.parameters.slice(0, 2)).toEqual([
    'Nombre existente',
    'admin@example.com',
  ]);
});

it('does not elevate ID 1 when existing RBAC assignments require an administrator', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue([
    'node',
    'bootstrap-admin',
    '--reconfigure-id1',
  ]);
  state.id1 = { id: 1, email: 'old@example.com', activo: 1 };
  state.hasAssignments = true;
  state.assignments = [{ role_id: 9, scope_id: 2 }];

  await expect(import('./bootstrap-admin.js')).rejects.toThrow(
    'No se puede asignar Admin General',
  );
  expect(state.updates.some(({ sql }) => sql.startsWith('CALL'))).toBe(false);
  expect(state.updates.some(({ sql }) => sql.startsWith('UPDATE usuarios'))).toBe(
    false,
  );
});

it('preserves ID 1 role assignments while adding the explicit Admin General profile', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue([
    'node',
    'bootstrap-admin',
    '--reconfigure-id1',
  ]);
  state.id1 = { id: 1, email: 'old@example.com', activo: 1 };
  state.isGlobalAdmin = true;
  state.assignments = [{ role_id: 9, scope_id: 2 }];

  await import('./bootstrap-admin.js');

  const assignment = state.updates.find(({ sql }) =>
    sql.startsWith('CALL rbac_set_user_roles'),
  );
  expect(JSON.parse(String(assignment?.parameters[1]))).toEqual([
    { role_id: 9, scope_id: 2 },
    { role_id: 4, scope_id: 1 },
  ]);
});

it('keeps explicit bootstrap strict when the email already exists', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'bootstrap-admin']);
  state.existing = { id: 7, email: 'admin@example.com' };
  await expect(import('./bootstrap-admin.js')).rejects.toThrow('Ya existe un usuario');
  expect(state.saved).toEqual([]);
});
