import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CertificateCancellation1796300000000 implements MigrationInterface {
  name = 'CertificateCancellation1796300000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE certificados_esterilizacion
      ADD COLUMN motivo_anulacion text NULL,
      ADD COLUMN anulado_por_id int NULL,
      ADD COLUMN anulado_at datetime(6) NULL,
      ADD CONSTRAINT FK_certificados_anulado_por FOREIGN KEY (anulado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE certificados_esterilizacion DROP FOREIGN KEY FK_certificados_anulado_por`);
    await queryRunner.query(`ALTER TABLE certificados_esterilizacion DROP COLUMN motivo_anulacion, DROP COLUMN anulado_por_id, DROP COLUMN anulado_at`);
  }
}
