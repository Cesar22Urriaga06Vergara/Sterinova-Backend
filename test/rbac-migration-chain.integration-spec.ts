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

  async function database() {
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
      migrations: DATABASE_MIGRATIONS,
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
      expect(Number(count[0].total)).toBe(46);
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
