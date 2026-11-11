import { AppDataSource } from '../database/data-source.js';
import { BACKEND_ROLES } from '../database/migrations/1794312001000-SeedBackendRoles.js';

// Use TypeORM's migration ledger: repeated invocations never reset configured roles.
await AppDataSource.initialize();
try {
  const applied = (await AppDataSource.query(
    'SELECT name FROM typeorm_migrations',
  )) as { name: string }[];
  const names = new Set(applied.map((row) => row.name));
  const pending = AppDataSource.migrations.filter(
    (migration) => !names.has(migration.name ?? migration.constructor.name),
  );
  if (
    pending.some(
      (migration) =>
        migration.constructor.name !== 'SeedBackendRoles1794312001000',
    )
  )
    throw new Error(
      'Aplique primero las migraciones de esquema con migration:run.',
    );
  if (pending.length) await AppDataSource.runMigrations();
  const roles = await AppDataSource.query(
    'SELECT code, active, global_assignable FROM rbac_roles WHERE code IN (?) ORDER BY code',
    [BACKEND_ROLES.map((role) => role.code)],
  );
  console.log(JSON.stringify({ roles, usuarios_asignados_por_script: 0 }));
} finally {
  await AppDataSource.destroy();
}
