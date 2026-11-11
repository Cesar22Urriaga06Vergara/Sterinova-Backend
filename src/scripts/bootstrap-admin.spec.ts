import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import * as bcrypt from 'bcrypt';

const state = vi.hoisted(() => ({
  existing: null as Record<string, unknown> | null,
  saved: [] as Record<string, unknown>[],
}));

vi.mock('../database/data-source.js', () => ({
  AppDataSource: {
    initialize: async () => {},
    destroy: async () => {},
    getRepository: () => ({
      findOneBy: async () => state.existing,
      create: (value: Record<string, unknown>) => value,
      save: async (value: Record<string, unknown>) => {
        value.id = 1;
        state.saved.push(value);
      },
    }),
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('ADMIN_NAME', 'Admin local');
  vi.stubEnv('ADMIN_EMAIL', ' ADMIN@example.com ');
  vi.stubEnv('ADMIN_PASSWORD', 'Local-password-1234');
  state.existing = null;
  state.saved = [];
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it('creates a missing admin with a usable hashed password', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'bootstrap-admin', '--if-missing']);
  await import('./bootstrap-admin.js');
  expect(state.saved).toHaveLength(1);
  expect(state.saved[0]).toMatchObject({ nombre: 'Admin local', email: 'admin@example.com', rol: 'Admin' });
  expect(await bcrypt.compare('Local-password-1234', state.saved[0].password_hash as string)).toBe(true);
}, 15_000);

it('allows repeated development startup without modifying an existing account', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'bootstrap-admin', '--if-missing']);
  state.existing = { id: 7, email: 'admin@example.com', password_hash: 'original', rol: 'Admin' };
  await expect(import('./bootstrap-admin.js')).resolves.toBeDefined();
  expect(state.saved).toEqual([]);
  expect(state.existing.password_hash).toBe('original');
});

it('keeps explicit bootstrap strict when the email already exists', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'bootstrap-admin']);
  state.existing = { id: 7, email: 'admin@example.com' };
  await expect(import('./bootstrap-admin.js')).rejects.toThrow('Ya existe un usuario');
  expect(state.saved).toEqual([]);
});
