import type { DataSource, QueryRunner } from 'typeorm';

/** Historical workflow fixtures retain their explicit legacy role while loading RBAC grants.
 * User-administration tests exercise rbac_set_user_roles itself instead of this fixture helper.
 */
export async function withRbacFixtureWrite(
  source: DataSource,
  userId: number,
  write: (runner: QueryRunner) => Promise<unknown>,
): Promise<void> {
  if (process.env.RBAC_TEST_DISPOSABLE_SERVER !== '1' ||
      !/^sterinova_app_test_[a-f0-9]{16}$/.test(String(source.options.database)))
    throw new Error('Las asignaciones de fixture requieren la base desechable del runner aislado');
  const runner = source.createQueryRunner();
  try {
    await runner.query('SET @rbac_write_user=?', [userId]);
    await write(runner);
  } finally {
    try { await runner.query('SET @rbac_write_user=NULL'); }
    finally { await runner.release(); }
  }
}
