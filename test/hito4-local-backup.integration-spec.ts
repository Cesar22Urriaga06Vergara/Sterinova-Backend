import 'reflect-metadata';
import { randomBytes, createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createConnection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { DATABASE_MIGRATIONS } from '../src/database/migration-registry.js';
import { STERINOVA_ENTITIES } from '../src/database/entities.js';

it.skipIf(!process.env.HITO4_BACKUP_PATH)(
  'restores the exact pre-Hito4 local backup and preserves every old column through migration',
  async () => {
    const port = Number(process.env.HITO4_TEST_PORT);
    if (
      process.env.HITO4_DISPOSABLE_SERVER !== '1' ||
      !Number.isInteger(port) ||
      port < 1024 ||
      port > 65535 ||
      port === 3306
    )
      throw new Error('Disposable loopback server required');
    const backup = process.env.HITO4_BACKUP_PATH!;
    const manifest = JSON.parse(await readFile(backup + '.json', 'utf8'));
    expect(
      createHash('sha256')
        .update(await readFile(backup))
        .digest('hex'),
    ).toBe(manifest.sha256);
    const name = `sterinova_hito4_backup_test_${randomBytes(8).toString('hex')}`;
    const admin = await createConnection({
      host: '127.0.0.1',
      port,
      user: 'root',
      password: '',
    });
    let source: DataSource | undefined;
    try {
      await admin.query(
        `CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
      );
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          process.env.HITO4_MYSQL_BINARY!,
          [
            '--no-defaults',
            '--protocol=tcp',
            '--host=127.0.0.1',
            `--port=${port}`,
            '--user=root',
            `--database=${name}`,
          ],
          {
            windowsHide: true,
            env: { ...process.env, MYSQL_PWD: '' },
            stdio: ['pipe', 'ignore', 'pipe'],
          },
        );
        let error = '';
        child.stderr.on('data', (b) => (error += b));
        child.on('error', reject);
        child.stdin.on('error', reject);
        child.on('exit', (code) =>
          code === 0
            ? resolve()
            : reject(new Error('Backup restore failed: ' + error)),
        );
        const input = createReadStream(backup);
        input.on('error', reject);
        input.pipe(child.stdin);
      });
      source = await new DataSource({
        type: 'mariadb',
        host: '127.0.0.1',
        port,
        username: 'root',
        password: '',
        database: name,
        entities: STERINOVA_ENTITIES,
        migrations: DATABASE_MIGRATIONS,
        migrationsTableName: 'typeorm_migrations',
        migrationsTransactionMode: 'each',
        synchronize: false,
      }).initialize();
      const tables = await source.query(
        "SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE'",
      );
      const baseline = [];
      for (const table of tables) {
        if (
          ['typeorm_migrations', 'secuencias_consecutivos'].includes(table.name)
        )
          continue;
        const columns = await source.query(
          'SHOW COLUMNS FROM `' + table.name + '`',
        );
        const projection = columns
          .map((c: any) => '`' + c.Field + '`')
          .join(',');
        baseline.push({
          name: table.name,
          projection,
          rows: await source.query(
            'SELECT ' + projection + ' FROM `' + table.name + '` ORDER BY 1',
          ),
        });
      }
      const applied = await source.runMigrations();
      expect(applied.map((m) => m.name)).toEqual([
        'AddOperationalDocumentData1794225602000',
      ]);
      for (const table of baseline)
        expect(
          await source.query(
            'SELECT ' +
              table.projection +
              ' FROM `' +
              table.name +
              '` ORDER BY 1',
          ),
        ).toEqual(table.rows);
      expect(await source.showMigrations()).toBe(false);
    } finally {
      if (source?.isInitialized) await source.destroy();
      if (/^sterinova_hito4_backup_test_[a-f0-9]{16}$/.test(name))
        await admin.query(`DROP DATABASE \`${name}\``);
      await admin.end();
    }
  },
  30000,
);
