import type { MigrationInterface, QueryRunner } from 'typeorm';

const CERTIFICATE_TRIGGER = 'trg_certificados_esterilizacion_inmutables';

async function createCertificateImmutabilityTrigger(queryRunner: QueryRunner) {
  await queryRunner.query(`
    CREATE TRIGGER ${CERTIFICATE_TRIGGER}
    BEFORE UPDATE ON certificados_esterilizacion
    FOR EACH ROW
    BEGIN
      IF OLD.estado = 'Aprobado' AND (
        NOT (OLD.id <=> NEW.id) OR
        NOT (OLD.consecutivo <=> NEW.consecutivo) OR
        NOT (OLD.token_publico <=> NEW.token_publico) OR
        NOT (OLD.ciclo_id <=> NEW.ciclo_id) OR
        NOT (OLD.orden_id <=> NEW.orden_id) OR
        NOT (OLD.equipo <=> NEW.equipo) OR
        NOT (OLD.ciclo <=> NEW.ciclo) OR
        NOT (OLD.parametros_tecnicos <=> NEW.parametros_tecnicos) OR
        NOT (OLD.controles_biologicos <=> NEW.controles_biologicos) OR
        NOT (OLD.estado <=> NEW.estado) OR
        NOT (OLD.aprobador_id <=> NEW.aprobador_id) OR
        NOT (OLD.aprobado_at <=> NEW.aprobado_at) OR
        NOT (OLD.version_formato_id <=> NEW.version_formato_id) OR
        NOT (OLD.snapshot_datos <=> NEW.snapshot_datos) OR
        NOT (OLD.fecha_emision <=> NEW.fecha_emision) OR
        NOT (OLD.created_at <=> NEW.created_at)
      ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Los certificados aprobados son inmutables';
      END IF;
    END
  `);
}

async function createOriginalCertificateImmutabilityTrigger(queryRunner: QueryRunner) {
  await queryRunner.query(`
    CREATE TRIGGER ${CERTIFICATE_TRIGGER}
    BEFORE UPDATE ON certificados_esterilizacion
    FOR EACH ROW
    BEGIN
      IF OLD.estado = 'Aprobado' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Los certificados aprobados son inmutables';
      END IF;
    END
  `);
}

export class AddPdfRendererVersion1793813500000 implements MigrationInterface {
  name = 'AddPdfRendererVersion1793813500000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE cotizaciones ADD pdf_renderer_version VARCHAR(50) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE certificados_esterilizacion ADD pdf_renderer_version VARCHAR(50) NULL',
    );
    await queryRunner.query(`DROP TRIGGER IF EXISTS ${CERTIFICATE_TRIGGER}`);
    await createCertificateImmutabilityTrigger(queryRunner);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS ${CERTIFICATE_TRIGGER}`);
    await queryRunner.query(
      'ALTER TABLE cotizaciones DROP COLUMN pdf_renderer_version',
    );
    await queryRunner.query(
      'ALTER TABLE certificados_esterilizacion DROP COLUMN pdf_renderer_version',
    );
    await createOriginalCertificateImmutabilityTrigger(queryRunner);
  }
}
