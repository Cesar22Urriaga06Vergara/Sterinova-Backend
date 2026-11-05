import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplateResponsible1793813400000
  implements MigrationInterface
{
  name = 'AddTemplateResponsible1793813400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE formato_versiones ADD responsable VARCHAR(255) NULL",
    );
    await queryRunner.query(
      "UPDATE formato_versiones SET responsable = 'Migración histórica' WHERE responsable IS NULL",
    );
    await queryRunner.query(
      'ALTER TABLE formato_versiones MODIFY responsable VARCHAR(255) NOT NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE formato_versiones DROP COLUMN responsable',
    );
  }
}
