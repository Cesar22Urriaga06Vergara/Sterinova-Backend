import { AddBackendRoleSchema1794312000000 } from '../src/database/migrations/1794312000000-AddBackendRoleSchema.js';
import { SeedBackendRoles1794312001000 } from '../src/database/migrations/1794312001000-SeedBackendRoles.js';
import {
  BACKEND_ROLES,
  FUTURE_PERMISSIONS,
} from '../src/database/migrations/1794312001000-SeedBackendRoles.js';
import 'reflect-metadata';
import { randomBytes, createHash } from 'node:crypto';
import { createConnection, type Connection } from 'mysql2/promise';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { DataSource } from 'typeorm';
import { DATABASE_MIGRATIONS } from '../src/database/migration-registry.js';
import { STERINOVA_ENTITIES } from '../src/database/entities.js';

describe('complete migration chain and backup restoration', () => {
  let admin: Connection;
  const databases: string[] = [];
  const connection = {
    host: '127.0.0.1',
    port: Number(process.env.RBAC_TEST_PORT),
    user: 'root',
    password: process.env.RBAC_TEST_PASSWORD ?? '',
  };
  beforeAll(async () => {
    if (
      process.env.RBAC_TEST_DISPOSABLE_SERVER !== '1' ||
      !Number.isInteger(connection.port) ||
      connection.port < 1024 ||
      connection.port === 3306
    ) {
      throw new Error(
        'El ensayo exige un servidor desechable y puerto exclusivo.',
      );
    }
    admin = await createConnection(connection);
  });
  afterAll(async () => {
    try {
      for (const database of databases) {
        if (!/^sterinova_chain_test_[a-f0-9]{16}$/.test(database))
          throw new Error('Se rechaza limpiar una base ajena al ensayo.');
        await admin.query(`DROP DATABASE \`${database}\``);
      }
    } finally {
      await admin?.end();
    }
  });

  async function database(migrations = DATABASE_MIGRATIONS) {
    const name = `sterinova_chain_test_${randomBytes(8).toString('hex')}`;
    await admin.query(
      `CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
    );
    databases.push(name);
    return new DataSource({
      type: 'mariadb',
      host: connection.host,
      port: connection.port,
      username: connection.user,
      password: connection.password,
      database: name,
      entities: STERINOVA_ENTITIES,
      migrations,
      migrationsTableName: 'typeorm_migrations',
      migrationsTransactionMode: 'each',
      synchronize: false,
      migrationsRun: false,
    });
  }

  it('runs the whole registered chain on an empty database', async () => {
    const source = await (await database()).initialize();
    try {
      expect(await source.runMigrations()).toHaveLength(
        DATABASE_MIGRATIONS.length,
      );
      expect(await source.showMigrations()).toBe(false);
      const count = await source.query(
        'SELECT COUNT(*) AS total FROM rbac_permissions',
      );
      expect(Number(count[0].total)).toBe(46 + FUTURE_PERMISSIONS.length);
    } finally {
      await source.destroy();
    }
  }, 30_000);

  it('upgrades a populated phase-0 database without assigning profiles or changing legacy access', async () => {
    const source = await (
      await database(DATABASE_MIGRATIONS.filter(migration => ![
        'AddBackendRoleSchema1794312000000',
        'SeedBackendRoles1794312001000',
        'UnifyUserRoleAssignments1794312002000',
        'BridgeLegacyUserAdministration1794398400000',
      ].includes(migration.name)))
    ).initialize();
    try {
      await source.runMigrations();
      await source.query(
        "INSERT INTO usuarios (nombre, email, password_hash) VALUES ('Test', 'phase1@example.test', 'not-a-real-hash')",
      );
      await source.query(
        "INSERT INTO rbac_scopes (code, name, kind, parent_id) VALUES ('test-area', 'Area', 'DEPARTMENT', 1)",
      );
      await source.query(
        "INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind) SELECT u.id, r.id, s.id, 'DEPARTMENT' FROM usuarios u JOIN rbac_roles r ON r.code='admin_area' JOIN rbac_scopes s ON s.code='test-area' WHERE u.email='phase1@example.test'",
      );
      const grantsBefore = await source.query(
        'SELECT * FROM rbac_role_permissions ORDER BY role_id, permission_code',
      );
      const usersBefore = await source.query('SELECT * FROM usuarios');
      const assignmentsBefore = await source.query(
        'SELECT id, user_id, role_id, role_kind, scope_id, scope_kind, active, created_at FROM rbac_user_role_assignments',
      );
      source.migrations.push(
        new AddBackendRoleSchema1794312000000(),
        new SeedBackendRoles1794312001000(),
      );
      await source.runMigrations();
      expect(await source.query('SELECT * FROM usuarios')).toEqual(usersBefore);
      expect(
        await source.query(
          'SELECT id, user_id, role_id, role_kind, scope_id, scope_kind, active, created_at FROM rbac_user_role_assignments',
        ),
      ).toEqual(assignmentsBefore);
      expect(
        await source.query(
          'SELECT g.* FROM rbac_role_permissions g JOIN rbac_roles r ON r.id=g.role_id WHERE r.active=1 ORDER BY g.role_id, g.permission_code',
        ),
      ).toEqual(grantsBefore);
      const profiles = await source.query(
        'SELECT code, active, global_assignable FROM rbac_roles WHERE active=0',
      );
      expect(profiles).toHaveLength(BACKEND_ROLES.length);
      expect(
        await source.query('SELECT * FROM rbac_permissions WHERE active=0'),
      ).toHaveLength(FUTURE_PERMISSIONS.length);
      await expect(
        source.query(
          "INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind) SELECT u.id, r.id, 1, 'GLOBAL' FROM usuarios u JOIN rbac_roles r ON r.code='admin_comercial' WHERE u.email='phase1@example.test'",
        ),
      ).rejects.toThrow();
      await expect(
        source.query(
          "INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind, role_global_assignable) SELECT u.id, r.id, 1, 'GLOBAL', 1 FROM usuarios u JOIN rbac_roles r ON r.code='admin_comercial' WHERE u.email='phase1@example.test'",
        ),
      ).rejects.toThrow();
      await source.query(
        "INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind, role_global_assignable) SELECT u.id, r.id, 1, 'GLOBAL', 1 FROM usuarios u JOIN rbac_roles r ON r.code='gerente_general' WHERE u.email='phase1@example.test'",
      );
      expect(
        await source.query('SELECT * FROM rbac_platform_owner'),
      ).toHaveLength(0);
      // Missing author/scope stays NULL on legacy writes; foreign keys reject fabricated IDs.
      await source.query(
        "INSERT INTO clientes (razon_social,nit,contacto,telefono,email,direccion) VALUES ('Legacy','phase1','x','x','x','x')",
      );
      const clients = await source.query(
        "SELECT scope_id, creador_id FROM clientes WHERE nit='phase1'",
      );
      expect(clients[0]).toEqual({ scope_id: null, creador_id: null });
      await expect(
        source.query(
          "UPDATE clientes SET creador_id=999999 WHERE nit='phase1'",
        ),
      ).rejects.toThrow();
    } finally {
      await source.destroy();
    }
  }, 30_000);

  it.skipIf(!process.env.RBAC_TEST_BACKUP_PATH)(
    'restores the actual local backup and applies only pending migrations without changing document data',
    async () => {
      const backup = process.env.RBAC_TEST_BACKUP_PATH!;
      const manifest = JSON.parse(await readFile(`${backup}.json`, 'utf8')) as {
        sha256: string;
      };
      const hash = createHash('sha256');
      for await (const chunk of createReadStream(backup)) hash.update(chunk);
      expect(hash.digest('hex')).toBe(manifest.sha256);
      const source = await database();
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          process.env.RBAC_TEST_MYSQL_BINARY!,
          [
            '--no-defaults',
            '--protocol=tcp',
            '--host=127.0.0.1',
            `--port=${connection.port}`,
            '--user=root',
            `--database=${String(source.options.database)}`,
          ],
          {
            env: { ...process.env, MYSQL_PWD: connection.password },
            windowsHide: true,
            stdio: ['pipe', 'ignore', 'pipe'],
          },
        );
        child.stderr.resume();
        const input = createReadStream(backup);
        input.on('error', reject);
        child.stdin.on('error', reject);
        child.on('error', reject);
        child.on('exit', (code) =>
          code === 0
            ? resolve()
            : reject(new Error(`La restauración aislada falló (${code}).`)),
        );
        input.pipe(child.stdin);
      });
      await source.initialize();
      try {
        const before = await source.query(
          'SELECT id, consecutivo, creador_id, total, hash_pdf, snapshot_datos FROM cotizaciones ORDER BY id',
        );
        const applied = await source.runMigrations();
        expect(
          applied.some(({ name }) => name === 'AddVersionedIva1794225600000'),
        ).toBe(true);
        expect(await source.showMigrations()).toBe(false);
        const after = await source.query(
          'SELECT id, consecutivo, creador_id, total, hash_pdf, snapshot_datos FROM cotizaciones ORDER BY id',
        );
        expect(after).toEqual(before);
      } finally {
        await source.destroy();
      }
    },
    30_000,
  );
});
