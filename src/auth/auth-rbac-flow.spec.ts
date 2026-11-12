import * as bcrypt from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { RbacAuthorizationService } from '../rbac/rbac-authorization.service.js';
import { UserRole } from '../../test/fixtures/legacy-user-role.js';
import { User } from '../users/entities/user.entity.js';

const scopes = [
  { id: 1, parent_id: null, kind: 'GLOBAL', active: true },
  { id: 2, parent_id: 1, kind: 'DEPARTMENT', active: true },
  { id: 3, parent_id: 1, kind: 'DEPARTMENT', active: true },
  { id: 4, parent_id: 1, kind: 'DEPARTMENT', active: true },
  { id: 5, parent_id: 1, kind: 'DEPARTMENT', active: true },
];

const profilePermissions: Record<number, { scopeId: number; permissions: string[] }> = {
  10: { scopeId: 1, permissions: ['usuarios.ver', 'usuarios.identidad.gestionar', 'asignaciones.gestionar', 'roles.gestionar', 'clientes.ver', 'cotizaciones.ver', 'logistica.ordenes.ver', 'planta.ordenes.ver', 'planta.ciclos.ver', 'calidad.ciclos.ver', 'calidad.aprobar'] },
  11: { scopeId: 2, permissions: ['clientes.ver', 'cotizaciones.ver'] },
  12: { scopeId: 3, permissions: ['logistica.ordenes.ver'] },
  13: { scopeId: 4, permissions: ['planta.ordenes.ver', 'planta.ciclos.ver'] },
  14: { scopeId: 5, permissions: ['calidad.ciclos.ver', 'calidad.aprobar'] },
};

function fixture() {
  const users = new Map<number, User>();
  const db = {
    getRepository: (entity: unknown) => entity === User
      ? {
          findOne: async ({ where }: { where: { id: number; activo: boolean } }) => {
            const user = users.get(where.id);
            return user?.activo === where.activo ? user : null;
          },
        }
      : { find: async () => scopes },
    query: async (_sql: string, [userId]: [number]) => {
      const profile = profilePermissions[userId];
      if (profile) {
        return profile.permissions.map((permission) => ({
          roleId: userId,
          scopeId: profile.scopeId,
          assignmentActive: 1,
          roleActive: 1,
          permission,
          permissionActive: 1,
          resourceAccess: 'SCOPE',
          includeDescendants: profile.scopeId === 1 ? 1 : 0,
        }));
      }
      if (userId === 15) {
        return [{
          roleId: 15, scopeId: 2, assignmentActive: 1, roleActive: 0,
          permission: 'clientes.ver', permissionActive: 1,
          resourceAccess: 'SCOPE', includeDescendants: 0,
        }];
      }
      if (userId === 16) {
        return [{
          roleId: 16, scopeId: 999, assignmentActive: 1, roleActive: 1,
          permission: 'planta.ciclos.ver', permissionActive: 1,
          resourceAccess: 'SCOPE', includeDescendants: 0,
        }];
      }
      return [];
    },
  };
  const authorization = new RbacAuthorizationService(db as never);
  const jwt = new JwtService({
    secret: 'isolated-test-secret-with-at-least-32-characters',
    signOptions: { expiresIn: '8h' },
  });
  const usersService = {
    findByEmail: async (email: string) =>
      [...users.values()].find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null,
    findActiveById: async (id: number) => {
      const user = users.get(id);
      return user?.activo ? user : null;
    },
  };
  const auth = new AuthService(usersService as never, jwt as never);
  const strategy = new JwtStrategy(
    { get: () => 'isolated-test-secret-with-at-least-32-characters' } as never,
    usersService as never,
  );
  return { users, authorization, auth, jwt, strategy };
}

describe('isolated authentication and RBAC profile flows', () => {
  it.each([
    [10, UserRole.ADMIN, 'usuarios.identidad.gestionar'],
    [11, UserRole.COMERCIAL, 'cotizaciones.ver'],
    [12, UserRole.LOGISTICA, 'logistica.ordenes.ver'],
    [13, UserRole.PLANTA, 'planta.ciclos.ver'],
    [14, UserRole.CALIDAD, 'calidad.aprobar'],
  ] as const)('authenticates fictitious profile %s and loads only its RBAC grants', async (id, legacyRole, expected) => {
    const { users, auth, authorization, jwt, strategy } = fixture();
    const passwordHash = await bcrypt.hash('Fictional-Access-2026!', 4);
    users.set(id, {
      id,
      nombre: `Usuario ${id}`,
      apellido: null,
      email: `user-${id}@example.com`,
      password_hash: passwordHash,
      password_version: 2,
      rol: legacyRole,
      activo: true,
    } as User);

    const authenticated = await auth.validateUser(`USER-${id}@example.com`, 'Fictional-Access-2026!');
    expect(authenticated?.id).toBe(id);
    expect(authenticated).not.toHaveProperty('password_hash');
    const login = auth.login(authenticated!);
    const payload = jwt.verify<{
      sub: number;
      email: string;
      rol: string;
      password_version: number;
    }>(login.access_token);
    expect(payload).toMatchObject({ sub: id, password_version: 2 });
    await expect(strategy.validate(payload)).resolves.toMatchObject({ id });
    const expiredToken = jwt.sign(
      { sub: id, email: `user-${id}@example.com`, rol: legacyRole, password_version: 2 },
      { expiresIn: '-1s' },
    );
    expect(() => jwt.verify(expiredToken)).toThrow();
    expect(() => jwt.verify('not-a-jwt')).toThrow();
    users.get(id)!.password_version = 3;
    await expect(strategy.validate(payload)).rejects.toMatchObject({ status: 401 });

    const session = await authorization.getSession(id);
    expect(session.permissions).toContain(expected);
    expect(session.permissions).toEqual(profilePermissions[id].permissions);
    if (id !== 10) {
      const forbidden = id === 11 ? 'logistica.ordenes.ver' : 'cotizaciones.ver';
      await expect(authorization.getContext(id, forbidden)).rejects.toBeInstanceOf(ForbiddenException);
    }
  });

  it('allows login without RBAC but grants no module permissions', async () => {
    const { users, auth, authorization } = fixture();
    users.set(17, {
      id: 17,
      nombre: 'Sin perfil',
      email: 'no-profile@example.com',
      password_hash: await bcrypt.hash('Fictional-Access-2026!', 4),
      password_version: 1,
      rol: UserRole.COMERCIAL,
      activo: true,
    } as User);

    await expect(auth.validateUser('no-profile@example.com', 'Fictional-Access-2026!'))
      .resolves.toMatchObject({ id: 17 });
    const session = await authorization.getSession(17);
    expect(session.permissions).toEqual([]);
    await expect(authorization.getContext(17, 'clientes.ver')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects unknown email and an incorrect password without leaking user records', async () => {
    const { users, auth } = fixture();
    users.set(19, {
      id: 19,
      nombre: 'Comercial ficticio',
      email: 'known-user@example.com',
      password_hash: await bcrypt.hash('Fictional-Access-2026!', 4),
      password_version: 1,
      rol: UserRole.COMERCIAL,
      activo: true,
    } as User);

    await expect(auth.validateUser('missing-user@example.com', 'Fictional-Access-2026!'))
      .resolves.toBeNull();
    await expect(auth.validateUser('known-user@example.com', 'Wrong-Fictional-Password'))
      .resolves.toBeNull();
  });

  it('does not authenticate an inactive account and ignores inactive roles or invalid scopes', async () => {
    const { users, auth, authorization } = fixture();
    users.set(15, {
      id: 15, nombre: 'Perfil inactivo', email: 'role-off@example.com',
      password_hash: await bcrypt.hash('Fictional-Access-2026!', 4),
      password_version: 1, rol: UserRole.COMERCIAL, activo: true,
    } as User);
    users.set(16, {
      id: 16, nombre: 'Ámbito inválido', email: 'scope-invalid@example.com',
      password_hash: await bcrypt.hash('Fictional-Access-2026!', 4),
      password_version: 1, rol: UserRole.PLANTA, activo: true,
    } as User);
    users.set(18, {
      id: 18, nombre: 'Inactivo', email: 'inactive@example.com',
      password_hash: await bcrypt.hash('Fictional-Access-2026!', 4),
      password_version: 1, rol: UserRole.CALIDAD, activo: false,
    } as User);

    await expect(auth.validateUser('inactive@example.com', 'Fictional-Access-2026!')).resolves.toBeNull();
    await expect(authorization.getSession(15)).resolves.toMatchObject({ permissions: [] });
    await expect(authorization.getSession(16)).resolves.toMatchObject({ permissions: [] });
  });

  it('rejects a selected scope outside a valid profile', async () => {
    const { users, authorization } = fixture();
    users.set(11, {
      id: 11, nombre: 'Comercial', email: 'comercial@example.com',
      password_hash: 'unused', password_version: 1, rol: UserRole.COMERCIAL, activo: true,
    } as User);

    await expect(authorization.getSession(11, '3')).rejects.toMatchObject({ status: 403 });
  });
});
