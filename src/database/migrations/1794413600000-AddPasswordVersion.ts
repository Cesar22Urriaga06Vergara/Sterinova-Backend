import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds a per-user password version to support session invalidation after password resets.
 */
export class AddPasswordVersion1794413600000 implements MigrationInterface {
  name = 'AddPasswordVersion1794413600000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query('ALTER TABLE usuarios ADD COLUMN password_version INT NOT NULL DEFAULT 1');
    await runner.query('UPDATE usuarios SET password_version = 1 WHERE password_version IS NULL');
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query('ALTER TABLE usuarios DROP COLUMN password_version');
  }
}
