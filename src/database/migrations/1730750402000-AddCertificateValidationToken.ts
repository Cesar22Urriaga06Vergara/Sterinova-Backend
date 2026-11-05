import { randomBytes } from 'node:crypto';
import type { MigrationInterface, QueryRunner } from 'typeorm';

async function createImmutabilityTrigger(queryRunner: QueryRunner) {
  await queryRunner.query(`
    CREATE TRIGGER trg_certificados_esterilizacion_inmutables
    BEFORE UPDATE ON certificados_esterilizacion
    FOR EACH ROW
    BEGIN
      IF OLD.estado = 'Aprobado' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Los certificados aprobados son inmutables';
      END IF;
    END
  `);
}

export class AddCertificateValidationToken1730750402000 implements MigrationInterface {
  name = 'AddCertificateValidationToken1730750402000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_certificados_esterilizacion_inmutables');
    try {
      await queryRunner.query(
        'ALTER TABLE certificados_esterilizacion ADD token_publico CHAR(43) NULL',
      );
      const certificates: Array<{ id: number }> = await queryRunner.query(
        'SELECT id FROM certificados_esterilizacion WHERE token_publico IS NULL',
      );
      for (const certificate of certificates) {
        await queryRunner.query(
          'UPDATE certificados_esterilizacion SET token_publico = ? WHERE id = ?',
          [randomBytes(32).toString('base64url'), certificate.id],
        );
      }
      await queryRunner.query(`
        ALTER TABLE certificados_esterilizacion
          MODIFY token_publico CHAR(43) NOT NULL,
          ADD UNIQUE KEY UQ_certificados_token_publico (token_publico)
      `);
    } finally {
      await queryRunner.query('DROP TRIGGER IF EXISTS trg_certificados_esterilizacion_inmutables');
      await createImmutabilityTrigger(queryRunner);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_certificados_esterilizacion_inmutables');
    await queryRunner.query(`
      ALTER TABLE certificados_esterilizacion
        DROP INDEX UQ_certificados_token_publico,
        DROP COLUMN token_publico
    `);
    await createImmutabilityTrigger(queryRunner);
  }
}
