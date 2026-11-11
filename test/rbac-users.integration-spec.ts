import 'reflect-metadata';
import { randomBytes } from 'node:crypto';
import { createConnection, type Connection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { DATABASE_MIGRATIONS } from '../src/database/migration-registry.js';
import { STERINOVA_ENTITIES } from '../src/database/entities.js';
import { UsersService } from '../src/users/users.service.js';
import { UserRolesService } from '../src/users/user-roles.service.js';
import { UsersController } from '../src/users/users.controller.js';
import { RbacAuthorizationService, type PermissionContext } from '../src/rbac/rbac-authorization.service.js';
import { User } from '../src/users/entities/user.entity.js';
import { UserRole } from '../src/users/entities/user-role.enum.js';

describe('users RBAC against isolated MariaDB', () => {
  let admin: Connection;
  let source: DataSource;
  let users: UsersService;
  let roles: UserRolesService;
  let authorization: RbacAuthorizationService;
  const ids: Record<string, number> = {};
  const roleIds: Record<string, number> = {};
  const database = `sterinova_users_test_${randomBytes(8).toString('hex')}`;

  beforeAll(async () => {
    const port = Number(process.env.RBAC_TEST_PORT);
    const allowXamppPort =
      port === 3306 && process.env.RBAC_TEST_ALLOW_LOCAL_3306 === '1';
    if (
      process.env.RBAC_TEST_DISPOSABLE_SERVER !== '1' ||
      !Number.isInteger(port) ||
      port < 1024 ||
      port > 65535 ||
      (port === 3306 && !allowXamppPort)
    )
      throw new Error('Solo servidor desechable de pruebas.');
    const connection = { host: '127.0.0.1', port, user: 'root', password: process.env.RBAC_TEST_PASSWORD ?? '' };
    admin = await createConnection(connection);
    await admin.query(`CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
    const options = { type: 'mariadb' as const, host: connection.host, port, username: connection.user,
      password: connection.password, database, entities: STERINOVA_ENTITIES,
      migrations: DATABASE_MIGRATIONS.filter(m => m.name !== 'BridgeLegacyUserAdministration1794398400000'),
      migrationsTableName: 'typeorm_migrations', migrationsTransactionMode: 'each' as const, synchronize: false };
    source = await new DataSource(options).initialize();
    await source.runMigrations();
    await source.query('ALTER TABLE usuarios AUTO_INCREMENT=2');
    await source.query("INSERT INTO rbac_scopes(id,code,name,kind,parent_id) VALUES(10,'commercial-test','Commercial','DEPARTMENT',1),(20,'other-test','Other','DEPARTMENT',1)");
    await source.query("UPDATE rbac_roles SET active=1 WHERE code IN ('admin_comercial','gerente_general','auditor','asesor_comercial')");
    for (const row of await source.query('SELECT id,code FROM rbac_roles')) roleIds[row.code] = Number(row.id);
    for (const name of ['root', 'commercial', 'other', 'globalReader', 'legacy', 'revoked', 'inactiveLegacy', 'unassigned', 'advisor']) {
      const result = await source.query('INSERT INTO usuarios(nombre,email,password_hash,rol,activo) VALUES(?,?,?,?,?)',
        [name, `${name}@users.test`, 'never-expose-this', ['legacy', 'revoked', 'inactiveLegacy', 'root'].includes(name) ? 'Admin' : 'Comercial', name !== 'inactiveLegacy']);
      ids[name] = Number(result.insertId);
    }
    if (ids.root === 1) throw new Error('Las cuentas ficticias de prueba no deben usar ID 1.');
    await source.query('CALL rbac_set_user_roles(?,?,NULL,0)', [ids.root, JSON.stringify([{ role_id: roleIds.superadmin, scope_id: 1 }])]);
    for (const [name, role, scope] of [['commercial', 'admin_comercial', 10], ['other', 'comercial', 20], ['globalReader', 'gerente_general', 1], ['advisor', 'asesor_comercial', 20]] as const)
      await source.query('CALL rbac_set_user_roles(?,?,?,0)', [ids[name], JSON.stringify([{ role_id: roleIds[role], scope_id: scope }]), ids.root]);
    const runner = source.createQueryRunner();
    try {
      await runner.query('SET @rbac_write_user=?', [ids.revoked]);
      await runner.query("INSERT INTO rbac_user_role_assignments(user_id,role_id,role_kind,scope_id,scope_kind,role_global_assignable,active) VALUES(?,?,'STANDARD',10,'DEPARTMENT',0,0)", [ids.revoked, roleIds.admin_comercial]);
    } finally { await runner.query('SET @rbac_write_user=NULL'); await runner.release(); }
    await source.destroy();
    source = await new DataSource({ ...options, migrations: DATABASE_MIGRATIONS }).initialize();
    await source.runMigrations();
    users = new UsersService(source.getRepository(User));
    authorization = new RbacAuthorizationService(source);
    roles = new UserRolesService(source, authorization);
  }, 30_000);
  afterAll(async () => {
    if (source?.isInitialized) await source.destroy();
    try {
      if (admin && /^sterinova_users_test_[a-f0-9]{16}$/.test(database)) await admin.query(`DROP DATABASE \`${database}\``);
    } finally { await admin?.end(); }
  });

  it('filters area members in SQL without exposing hashes or unrelated identities', async () => {
    const context = await authorization.getContext(ids.commercial, 'usuarios.ver');
    const result = await users.findAll(context);
    expect(result.map(user => user.id)).toEqual([ids.commercial]);
    expect(result[0]).not.toHaveProperty('password_hash');
  });
  it('allows explicit GLOBAL readers to see unassigned identities', async () => {
    const context = await authorization.getContext(ids.globalReader, 'usuarios.ver');
    expect((await users.findAll(context)).map(user => user.id)).toContain(ids.unassigned);
  });
  it('narrows GLOBAL readers when they select an area', async () => {
    const context = await authorization.getContext(ids.globalReader, 'usuarios.ver', '20');
    expect((await users.findAll(context)).map(user => user.id)).toEqual([ids.other, ids.advisor]);
  });
  it('denies missing policy and OWN-only membership listing', async () => {
    await expect(users.findAll(undefined as never)).rejects.toMatchObject({ status: 403 });
    await expect(users.findAll({ permission: 'usuarios.ver', policy: { userId: ids.commercial, scopeIds: [], ownScopeIds: [10] }, resourceScopeIds: [10] })).rejects.toMatchObject({ status: 403 });
  });
  it('denies identity mutation for an area grant even if accidentally configured', async () => {
    const context: PermissionContext = { permission: 'usuarios.identidad.gestionar', policy: { userId: ids.commercial, scopeIds: [10], ownScopeIds: [] }, resourceScopeIds: [10] };
    await expect(roles.authorizeIdentity(ids.commercial, context)).rejects.toMatchObject({ status: 403 });
  });
  it('denies local assignment administration without altering the target', async () => {
    const before = await source.query('SELECT rbac_version FROM usuarios WHERE id=?', [ids.other]);
    await expect(roles.assign(ids.commercial, ids.other, { role_id: roleIds.admin_comercial, scope_id: 10 })).rejects.toMatchObject({ status: 403 });
    expect(await source.query('SELECT rbac_version FROM usuarios WHERE id=?', [ids.other])).toEqual(before);
  });
  it('denies users listing to an advisor and identity changes to a global reader', async () => {
    await expect(authorization.getContext(ids.advisor, 'usuarios.ver')).rejects.toMatchObject({ status: 403 });
    await expect(authorization.getContext(ids.globalReader, 'usuarios.identidad.gestionar')).rejects.toMatchObject({ status: 403 });
  });
  it('bridges only active legacy Admin without any RBAC history', async () => {
    expect((await authorization.getContext(ids.legacy, 'usuarios.identidad.gestionar')).policy.scopeIds).toContain(1);
    for (const name of ['revoked', 'inactiveLegacy', 'unassigned'])
      expect(await source.query("SELECT a.id FROM rbac_user_role_assignments a JOIN rbac_roles r ON r.id=a.role_id WHERE a.user_id=? AND r.code='legacy_admin_transition'", [ids[name]])).toEqual([]);
    expect(await source.query('SELECT user_id FROM rbac_platform_owner')).toEqual([{ user_id: ids.root }]);
    expect((await source.query("SELECT active FROM rbac_roles WHERE code='admin_planta'"))[0].active).toBe(0);
  });
  it('lets the bridged legacy Admin create and assign through the real protected procedure', async () => {
    const context = await authorization.getContext(ids.legacy, 'usuarios.identidad.gestionar');
    const controller = new UsersController(users, roles, {} as never);
    const created = await controller.create({ nombre: 'Created', email: 'created@users.test', password: 'LongTestPassword!', rol: UserRole.COMERCIAL,
      role_id: roleIds.comercial, scope_id: 10 }, { user: { id: ids.legacy }, rbac: context });
    expect(created.activo).toBe(true);
    expect(created).not.toHaveProperty('password_hash');
    expect((await roles.assignments(ids.legacy, created.id)).map(row => row.scope_id)).toEqual([10]);
  });
  it('lets superadmin list all and create, update and disable an identity', async () => {
    const list = await authorization.getContext(ids.root, 'usuarios.ver');
    expect((await users.findAll(list)).map(user => user.id)).toContain(ids.unassigned);
    const context = await authorization.getContext(ids.root, 'usuarios.identidad.gestionar');
    const controller = new UsersController(users, roles, {} as never);
    const request = { user: { id: ids.root }, rbac: context };
    const created = await controller.create({ nombre: 'Root-created', email: 'root-created@users.test', password: 'LongTestPassword!', rol: UserRole.COMERCIAL,
      role_id: roleIds.comercial, scope_id: 20 }, request);
    expect((await controller.update(created.id, { nombre: 'Updated' }, request)).nombre).toBe('Updated');
    expect((await controller.setActive(created.id, { activo: false }, request)).activo).toBe(false);
    expect((await source.query('SELECT activo FROM usuarios WHERE id=?', [created.id]))[0].activo).toBe(0);
  });
});
