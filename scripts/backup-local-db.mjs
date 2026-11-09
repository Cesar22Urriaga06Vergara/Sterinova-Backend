import 'dotenv/config';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const host = process.env.DB_HOST ?? 'localhost';
if (!['localhost', '127.0.0.1', '::1'].includes(host)) {
  throw new Error(
    'El respaldo automático solo admite la base local configurada.',
  );
}
const database = process.env.DB_DATABASE;
if (!database || !/^[a-zA-Z0-9_]+$/.test(database))
  throw new Error('Nombre de base local inválido.');
const binary =
  process.env.MARIADB_DUMP_BINARY ?? 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
const directory = path.join(repositoryRoot, 'storage', 'backups');
await mkdir(directory, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = path.join(directory, `${database}-pre-rbac-${stamp}.sql`);
await new Promise((resolve, reject) => {
  const child = spawn(
    binary,
    [
      '--no-defaults',
      '--single-transaction',
      '--quick',
      '--routines',
      '--events',
      '--triggers',
      '--hex-blob',
      '--default-character-set=utf8mb4',
      `--host=${host}`,
      `--port=${process.env.DB_PORT ?? '3306'}`,
      `--user=${process.env.DB_USERNAME ?? ''}`,
      `--result-file=${output}`,
      database,
    ],
    {
      env: { ...process.env, MYSQL_PWD: process.env.DB_PASSWORD ?? '' },
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
    },
  );
  let error = '';
  child.stderr.on('data', (chunk) => {
    error += chunk.toString();
  });
  child.once('error', reject);
  child.once('exit', (code) =>
    code === 0
      ? resolve()
      : reject(new Error(`Falló mysqldump (${code}): ${error}`)),
  );
});
const hash = createHash('sha256');
for await (const chunk of createReadStream(output)) hash.update(chunk);
const info = {
  database,
  file: output,
  bytes: (await stat(output)).size,
  sha256: hash.digest('hex'),
  createdAt: new Date().toISOString(),
};
if (!info.bytes)
  throw new Error('El respaldo está vacío; no ejecutar migraciones.');
await writeFile(`${output}.json`, `${JSON.stringify(info, null, 2)}\n`, {
  flag: 'wx',
});
console.log(JSON.stringify(info, null, 2));
