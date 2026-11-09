import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createConnection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { DATABASE_MIGRATIONS } from '../dist/database/migration-registry.js';
import { STERINOVA_ENTITIES } from '../dist/database/entities.js';

const port = Number(process.env.RBAC_TEST_PORT);
if (
  process.env.RBAC_TEST_DISPOSABLE_SERVER !== '1' ||
  !Number.isInteger(port) ||
  port < 1024 ||
  port === 3306
)
  throw new Error('Solo se admiten servidores de pruebas desechables.');
const database = `sterinova_app_test_${randomBytes(8).toString('hex')}`;
const password = process.env.RBAC_TEST_PASSWORD ?? '';
const admin = await createConnection({
  host: '127.0.0.1',
  port,
  user: 'root',
  password,
});
let created = false;
let source;
try {
  await admin.query(
    `CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
  );
  created = true;
  source = await new DataSource({
    type: 'mariadb',
    host: '127.0.0.1',
    port,
    username: 'root',
    password,
    database,
    entities: STERINOVA_ENTITIES,
    migrations: DATABASE_MIGRATIONS,
    migrationsTableName: 'typeorm_migrations',
    migrationsTransactionMode: 'each',
    synchronize: false,
  }).initialize();
  await source.runMigrations();
  await source.destroy();
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        'node_modules/vitest/vitest.mjs',
        'run',
        '--config',
        'vitest.config.e2e.ts',
      ],
      {
        windowsHide: true,
        stdio: 'inherit',
        env: {
          ...process.env,
          DB_HOST: '127.0.0.1',
          DB_PORT: String(port),
          DB_USERNAME: 'root',
          DB_PASSWORD: password,
          DB_DATABASE: database,
          NODE_ENV: 'test',
          JWT_SECRET: 'isolated-application-e2e-jwt-secret-only',
          PDF_RENDER_SECRET: 'isolated-application-e2e-render-secret-only',
          RUN_E2E_FULL_FLOW: '1',
        },
      },
    );
    child.on('error', reject);
    child.on('exit', resolve);
  });
  process.exitCode = exitCode ?? 1;
} finally {
  if (source?.isInitialized) await source.destroy();
  try {
    if (created && /^sterinova_app_test_[a-f0-9]{16}$/.test(database))
      await admin.query(`DROP DATABASE \`${database}\``);
  } finally {
    await admin.end();
  }
}
