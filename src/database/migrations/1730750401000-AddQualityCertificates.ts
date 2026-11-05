import type { MigrationInterface, QueryRunner } from 'typeorm';

const roles = ['Admin', 'Comercial', 'Logistica', 'Planta', 'Calidad'];

export class AddQualityCertificates1730750401000 implements MigrationInterface {
  name = 'AddQualityCertificates1730750401000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    const unknownRoles: Array<{ rol: string }> = await queryRunner.query(
      `SELECT DISTINCT rol FROM usuarios WHERE rol NOT IN (${roles.map(() => '?').join(', ')})`,
      roles,
    );
    if (unknownRoles.length) {
      throw new Error(
        `Roles no reconocidos; corrígelos antes de migrar: ${unknownRoles.map(({ rol }) => rol).join(', ')}`,
      );
    }

    const certificateCount: Array<{ total: number }> = await queryRunner.query(
      'SELECT COUNT(*) AS total FROM certificados_esterilizacion',
    );
    if (Number(certificateCount[0]?.total ?? 0) > 0) {
      const invalidNumbers: Array<{ consecutivo: string }> = await queryRunner.query(
        `SELECT consecutivo FROM certificados_esterilizacion WHERE consecutivo NOT REGEXP '^[0-9]{5}$' LIMIT 1`,
      );
      if (invalidNumbers.length) {
        throw new Error(
          `El certificado existente ${invalidNumbers[0].consecutivo} no tiene consecutivo de cinco dígitos; requiere conciliación manual.`,
        );
      }
      const unmapped: Array<{ id: number }> = await queryRunner.query(`
        SELECT cert.id
        FROM certificados_esterilizacion cert
        LEFT JOIN (
          SELECT orden_id, MIN(id) AS ciclo_id, COUNT(*) AS total
          FROM ciclos_esterilizacion GROUP BY orden_id
        ) ciclo ON ciclo.orden_id = cert.orden_id AND ciclo.total = 1
        WHERE ciclo.ciclo_id IS NULL
        LIMIT 1
      `);
      if (unmapped.length) {
        throw new Error(
          `El certificado legado #${unmapped[0].id} no puede asociarse inequívocamente a un ciclo; requiere conciliación manual.`,
        );
      }
    }

    await queryRunner.query(
      `ALTER TABLE usuarios MODIFY rol ENUM('Admin','Comercial','Logistica','Planta','Calidad') NOT NULL DEFAULT 'Admin'`,
    );
    await queryRunner.query(`
      ALTER TABLE ciclos_esterilizacion
        MODIFY estado ENUM('EN_PROCESO','PENDIENTE_CALIDAD','APROBADO','RECHAZADO') NOT NULL DEFAULT 'PENDIENTE_CALIDAD',
        ADD revisado_por INT NULL,
        ADD revisado_en TIMESTAMP NULL,
        ADD motivo_rechazo TEXT NULL,
        ADD ciclo_correccion_de_id INT NULL,
        ADD KEY IDX_ciclos_revisado_por (revisado_por),
        ADD KEY IDX_ciclos_ciclo_correccion_de_id (ciclo_correccion_de_id),
        ADD CONSTRAINT FK_ciclos_revisor FOREIGN KEY (revisado_por) REFERENCES usuarios(id) ON DELETE RESTRICT,
        ADD CONSTRAINT FK_ciclos_correccion FOREIGN KEY (ciclo_correccion_de_id) REFERENCES ciclos_esterilizacion(id) ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      ALTER TABLE certificados_esterilizacion
        ADD ciclo_id INT NULL,
        ADD aprobador_id INT NULL,
        ADD aprobado_at TIMESTAMP NULL,
        ADD KEY IDX_certificados_aprobador_id (aprobador_id),
        ADD CONSTRAINT FK_certificados_aprobador FOREIGN KEY (aprobador_id) REFERENCES usuarios(id) ON DELETE RESTRICT
    `);
    if (Number(certificateCount[0]?.total ?? 0) > 0) {
      await queryRunner.query(`
        UPDATE certificados_esterilizacion cert
        JOIN (
          SELECT orden_id, MIN(id) AS ciclo_id
          FROM ciclos_esterilizacion GROUP BY orden_id HAVING COUNT(*) = 1
        ) ciclo ON ciclo.orden_id = cert.orden_id
        SET cert.ciclo_id = ciclo.ciclo_id
      `);
    }
    await queryRunner.query(
      `ALTER TABLE certificados_esterilizacion MODIFY consecutivo CHAR(5) NOT NULL, MODIFY estado VARCHAR(255) NOT NULL DEFAULT 'Aprobado', MODIFY ciclo_id INT NOT NULL, ADD UNIQUE KEY UQ_certificados_ciclo_id (ciclo_id), ADD CONSTRAINT FK_certificados_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclos_esterilizacion(id) ON DELETE RESTRICT`,
    );
    await queryRunner.query(`
      CREATE TABLE secuencias_consecutivos (
        nombre VARCHAR(80) NOT NULL,
        ultimo_valor INT NOT NULL,
        PRIMARY KEY (nombre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    await queryRunner.query(
      `INSERT INTO secuencias_consecutivos (nombre, ultimo_valor) VALUES ('certificado_esterilizacion', 55387)`,
    );
    await queryRunner.query(`
      UPDATE secuencias_consecutivos
      SET ultimo_valor = GREATEST(
        55387,
        COALESCE((
          SELECT MAX(CAST(consecutivo AS UNSIGNED))
          FROM certificados_esterilizacion
          WHERE CAST(consecutivo AS UNSIGNED) BETWEEN 55388 AND 99999
        ), 55387)
      )
      WHERE nombre = 'certificado_esterilizacion'
    `);
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

  async down(queryRunner: QueryRunner): Promise<void> {
    const issued: Array<{ total: number }> = await queryRunner.query(
      `SELECT COUNT(*) AS total FROM certificados_esterilizacion WHERE estado = 'Aprobado'`,
    );
    const reviewed: Array<{ total: number }> = await queryRunner.query(
      `SELECT COUNT(*) AS total FROM ciclos_esterilizacion WHERE estado IN ('APROBADO','RECHAZADO')`,
    );
    if (Number(issued[0]?.total ?? 0) > 0 || Number(reviewed[0]?.total ?? 0) > 0) {
      throw new Error('No se revierte Calidad si ya hay decisiones o certificados emitidos.');
    }
    await queryRunner.query('DROP TRIGGER IF EXISTS trg_certificados_esterilizacion_inmutables');
    await queryRunner.query('DROP TABLE secuencias_consecutivos');
    await queryRunner.query(`
      ALTER TABLE certificados_esterilizacion
        DROP FOREIGN KEY FK_certificados_ciclo,
        DROP FOREIGN KEY FK_certificados_aprobador,
        DROP INDEX UQ_certificados_ciclo_id,
        DROP INDEX IDX_certificados_aprobador_id,
        DROP COLUMN ciclo_id,
        DROP COLUMN aprobador_id,
        DROP COLUMN aprobado_at,
        MODIFY consecutivo VARCHAR(255) NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE ciclos_esterilizacion
        DROP FOREIGN KEY FK_ciclos_revisor,
        DROP FOREIGN KEY FK_ciclos_correccion,
        DROP INDEX IDX_ciclos_revisado_por,
        DROP INDEX IDX_ciclos_ciclo_correccion_de_id,
        DROP COLUMN revisado_por,
        DROP COLUMN revisado_en,
        DROP COLUMN motivo_rechazo,
        DROP COLUMN ciclo_correccion_de_id,
        MODIFY estado ENUM('EN_PROCESO','PENDIENTE_CALIDAD') NOT NULL DEFAULT 'PENDIENTE_CALIDAD'
    `);
    await queryRunner.query(
      `ALTER TABLE usuarios MODIFY rol VARCHAR(255) NOT NULL DEFAULT 'Admin'`,
    );
  }
}
