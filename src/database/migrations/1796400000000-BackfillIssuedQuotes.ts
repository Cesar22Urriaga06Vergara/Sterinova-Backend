import type { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillIssuedQuotes1796400000000 implements MigrationInterface {
  name = 'BackfillIssuedQuotes1796400000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("UPDATE cotizaciones SET estado = 'EMITIDA' WHERE estado = 'APROBADA' AND fecha_emision IS NOT NULL");
  }

  async down(_queryRunner: QueryRunner): Promise<void> {
    // The prior value cannot be distinguished from later legitimate transitions.
  }
}
