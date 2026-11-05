import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClienteDocumentFields1793813200000
  implements MigrationInterface
{
  name = 'AddClienteDocumentFields1793813200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE clientes ADD cargo VARCHAR(255) NULL, ADD ciudad VARCHAR(120) NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE clientes DROP COLUMN ciudad, DROP COLUMN cargo',
    );
  }
}
