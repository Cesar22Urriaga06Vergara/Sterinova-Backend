import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuoteCommercialConditions1794500000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE cotizaciones
      ADD tiempo_despacho TEXT NULL,
      ADD transporte TEXT NULL,
      ADD forma_pago TEXT NULL,
      ADD validez_oferta TEXT NULL,
      ADD precio_incluye TEXT NULL,
      ADD precio_no_incluye TEXT NULL`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE cotizaciones
      DROP COLUMN tiempo_despacho,
      DROP COLUMN transporte,
      DROP COLUMN forma_pago,
      DROP COLUMN validez_oferta,
      DROP COLUMN precio_incluye,
      DROP COLUMN precio_no_incluye`);
  }
}
