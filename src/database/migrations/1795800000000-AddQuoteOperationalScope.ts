import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuoteOperationalScope1795800000000 implements MigrationInterface {
  name = 'AddQuoteOperationalScope1795800000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE cotizaciones
      ADD metodo_esterilizacion ENUM('EtO','VAPOR','NO_APLICA') NOT NULL DEFAULT 'NO_APLICA',
      ADD aplica_esterilizacion TINYINT(1) NOT NULL DEFAULT 0,
      ADD aplica_empaque TINYINT(1) NOT NULL DEFAULT 0,
      ADD aplica_transporte TINYINT(1) NOT NULL DEFAULT 0,
      ADD valor_transporte DECIMAL(14,2) NOT NULL DEFAULT 0`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE cotizaciones
      DROP COLUMN valor_transporte, DROP COLUMN aplica_transporte,
      DROP COLUMN aplica_empaque, DROP COLUMN aplica_esterilizacion,
      DROP COLUMN metodo_esterilizacion`);
  }
}
