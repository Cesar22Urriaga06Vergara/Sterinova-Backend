import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClienteActivo1796700000000 implements MigrationInterface {
  name = 'AddClienteActivo1796700000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE clientes ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE clientes DROP COLUMN activo');
  }
}
