import 'reflect-metadata';
import { randomBytes } from 'node:crypto';
import { createConnection, type Connection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { AddScopedRbac1794096000000 } from '../src/database/migrations/1794096000000-AddScopedRbac.js';
import { STERINOVA_ENTITIES } from '../src/database/entities.js';
import { RbacUserRoleAssignment } from '../src/rbac/entities/user-role-assignment.entity.js';
import { RbacRole } from '../src/rbac/entities/role.entity.js';

// Never imports the application's DataSource, dotenv or DB_* credentials.
const databaseName = `sterinova_rbac_test_${randomBytes(8).toString('hex')}`;

describe('RBAC schema on an isolated disposable MariaDB server', () => {
  let admin: Connection | undefined;
  let dataSource: DataSource | undefined;
  let databaseCreated = false;

  beforeAll(async () => {
    const port = Number(process.env.RBAC_TEST_PORT);
    if (
      process.env.RBAC_TEST_DISPOSABLE_SERVER !== '1' ||
      !Number.isInteger(port) ||
      port < 1024 ||
      port > 65535 ||
      port === 3306
    ) {
      throw new Error(
        'Use a disposable loopback server: RBAC_TEST_DISPOSABLE_SERVER=1 and a dedicated RBAC_TEST_PORT other than 3306.',
      );
    }
    const connection = {
      host: '127.0.0.1',
      port,
      user: 'root',
      password: process.env.RBAC_TEST_PASSWORD ?? '',
    };
    admin = await createConnection(connection);
    await admin.query(
      `CREATE DATABASE \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
    );
    databaseCreated = true;
    dataSource = await new DataSource({
      type: 'mariadb',
      host: connection.host,
      port,
      username: connection.user,
      password: connection.password,
      database: databaseName,
      entities: STERINOVA_ENTITIES,
      synchronize: false,
      migrationsRun: false,
    }).initialize();
    await dataSource.query(
      'CREATE TABLE usuarios (id INT NOT NULL PRIMARY KEY) ENGINE=InnoDB',
    );
    await dataSource.query('INSERT INTO usuarios (id) VALUES (1), (2)');
    await dataSource.query(
      'CREATE TABLE cotizaciones (id INT NOT NULL PRIMARY KEY, consecutivo VARCHAR(50), total DECIMAL(14,2)) ENGINE=InnoDB',
    );
    await dataSource.query(
      "INSERT INTO cotizaciones VALUES (73, 'PREEXISTENTE-073', 119.25)",
    );
    const runner = dataSource.createQueryRunner();
    try {
      await new AddScopedRbac1794096000000().up(runner);
      // Historical constraint tests retain their original DDL; current ORM defaults need these additive columns.
      await runner.query(
        'ALTER TABLE rbac_roles ADD COLUMN global_assignable TINYINT(1) NOT NULL DEFAULT 0',
      );
      await runner.query(
        'ALTER TABLE rbac_user_role_assignments ADD COLUMN role_global_assignable TINYINT(1) NOT NULL DEFAULT 0',
      );
    } finally {
      await runner.release();
    }
    await dataSource.query(
      "INSERT INTO rbac_scopes (id, code, name, kind, parent_id) VALUES (10, 'comercial', 'Comercial', 'DEPARTMENT', 1), (11, 'equipo-a', 'Equipo A', 'TEAM', 10), (20, 'calidad', 'Calidad', 'DEPARTMENT', 1)",
    );
  }, 30_000);

  afterAll(async () => {
    try {
      if (dataSource?.isInitialized) await dataSource.destroy();
    } finally {
      try {
        if (
          databaseCreated &&
          admin &&
          /^sterinova_rbac_test_[a-f0-9]{16}$/.test(databaseName)
        ) {
          await admin.query(`DROP DATABASE \`${databaseName}\``);
        }
      } finally {
        await admin?.end();
      }
    }
  });

  it('preserves preexisting business records and assigns no privileges automatically', async () => {
    expect(await dataSource!.query('SELECT * FROM cotizaciones')).toEqual([
      { id: 73, consecutivo: 'PREEXISTENTE-073', total: '119.25' },
    ]);
    expect(
      await dataSource!.query('SELECT * FROM rbac_user_role_assignments'),
    ).toEqual([]);
    expect(
      await dataSource!.query('SELECT * FROM rbac_platform_owner'),
    ).toEqual([]);
  });

  it('supports several roles/scopes and a newly configured role using TypeORM repositories', async () => {
    const roles = dataSource!.getRepository(RbacRole);
    const customRole = await roles.save(
      roles.create({
        code: 'analista_regional',
        name: 'Analista regional',
        kind: 'STANDARD',
      }),
    );
    const assignments = dataSource!.getRepository(RbacUserRoleAssignment);
    await assignments.save([
      assignments.create({
        user_id: 1,
        role_id: customRole.id,
        role_kind: 'STANDARD',
        scope_id: 11,
        scope_kind: 'TEAM',
      }),
      assignments.create({
        user_id: 1,
        role_id: 8,
        role_kind: 'STANDARD',
        scope_id: 20,
        scope_kind: 'DEPARTMENT',
      }),
    ]);
    const records = await assignments.find({
      where: { user_id: 1 },
      relations: { role: true, scope: true },
    });
    expect(
      records.map(({ scope_id }) => scope_id).sort((a, b) => a - b),
    ).toEqual([11, 20]);
    expect(records.find(({ scope_id }) => scope_id === 11)?.role.code).toBe(
      'analista_regional',
    );
    await expect(
      dataSource!.query(
        "INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind) VALUES (1, ?, 11, 'TEAM')",
        [customRole.id],
      ),
    ).rejects.toMatchObject({ driverError: { errno: 1062 } });
  });

  it('rejects escalation to a platform role through the ordinary assignment table', async () => {
    await expect(
      dataSource!.query(
        "INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind) VALUES (2, 1, 11, 'TEAM')",
      ),
    ).rejects.toMatchObject({ driverError: { errno: 1452 } });
    await expect(
      dataSource!.query(
        "INSERT INTO rbac_user_role_assignments (user_id, role_id, role_kind, scope_id, scope_kind) VALUES (2, 1, 'PLATFORM', 11, 'TEAM')",
      ),
    ).rejects.toMatchObject({ driverError: { errno: 4025 } });
    await expect(
      dataSource!.query(
        "INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind) VALUES (2, 2, 1, 'GLOBAL')",
      ),
    ).rejects.toMatchObject({ driverError: { errno: 4025 } });
  });

  it('enforces a single global scope and platform owner in the database', async () => {
    await expect(
      dataSource!.query(
        "INSERT INTO rbac_scopes (code, name, kind) VALUES ('otro-global', 'Otro global', 'GLOBAL')",
      ),
    ).rejects.toMatchObject({ driverError: { errno: 1062 } });
    await dataSource!.query(
      'INSERT INTO rbac_platform_owner (id, user_id, role_id, scope_id) VALUES (1, 1, 1, 1)',
    );
    await expect(
      dataSource!.query(
        'INSERT INTO rbac_platform_owner (id, user_id, role_id, scope_id) VALUES (2, 2, 1, 1)',
      ),
    ).rejects.toMatchObject({ driverError: { errno: 4025 } });
    await expect(
      dataSource!.query(
        'INSERT INTO rbac_platform_owner (id, user_id, role_id, scope_id) VALUES (1, 2, 1, 1)',
      ),
    ).rejects.toMatchObject({ driverError: { errno: 1062 } });
    await expect(
      dataSource!.query('DELETE FROM usuarios WHERE id = 1'),
    ).rejects.toMatchObject({ driverError: { errno: 1451 } });
  });

  it('refuses a second migration attempt without changing the installed catalog', async () => {
    const runner = dataSource!.createQueryRunner();
    try {
      await expect(new AddScopedRbac1794096000000().up(runner)).rejects.toThrow(
        /preexistente/i,
      );
    } finally {
      await runner.release();
    }
    const counts = (await dataSource!.query(
      'SELECT COUNT(*) AS total FROM rbac_permissions',
    )) as Array<{ total: string | number }>;
    expect(Number(counts[0].total)).toBe(42);
  });
});
