import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { AppDataSource } from '../database/data-source.js';
import {
  migrateLocalRbacPilot,
  type LocalRbacPilotPlan,
} from '../rbac/local-pilot-data-migration.js';

const configPath = process.argv[2];
if (!configPath)
  throw new Error(
    'Indique el JSON local autorizado; no hay IDs predeterminados.',
  );
const plan = JSON.parse(
  await readFile(path.resolve(configPath), 'utf8'),
) as LocalRbacPilotPlan;
await AppDataSource.initialize();
try {
  if (await AppDataSource.showMigrations())
    throw new Error(
      'Aplique y verifique las migraciones de esquema antes de conciliar los datos locales.',
    );
  process.stdout.write(
    `${JSON.stringify(await migrateLocalRbacPilot(AppDataSource, plan), null, 2)}\n`,
  );
} finally {
  await AppDataSource.destroy();
}
