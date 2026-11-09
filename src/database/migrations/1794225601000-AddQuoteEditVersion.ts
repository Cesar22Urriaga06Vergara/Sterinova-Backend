import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuoteEditVersion1794225601000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE cotizaciones ADD COLUMN version INT NOT NULL DEFAULT 1',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE cotizaciones DROP COLUMN version');
  }
}
