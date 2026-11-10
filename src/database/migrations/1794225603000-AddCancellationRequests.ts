import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCancellationRequests1794225603000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE rbac_permissions ADD COLUMN is_dynamic TINYINT NOT NULL DEFAULT 0',
    );
    await queryRunner.query(`CREATE TABLE solicitudes_anulacion (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      cotizacion_id INT NOT NULL,
      creador_id INT NOT NULL,
      aprobador_id INT NULL,
      motivo TEXT NOT NULL,
      estado ENUM('PENDIENTE','APROBADA','RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
      created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      fecha_resolucion DATETIME(6) NULL,
      observacion_resolucion TEXT NULL,
      INDEX IDX_solicitud_anulacion_cotizacion_estado (cotizacion_id, estado),
      CONSTRAINT FK_solicitud_anulacion_cotizacion FOREIGN KEY (cotizacion_id)
        REFERENCES cotizaciones(id) ON DELETE RESTRICT,
      CONSTRAINT FK_solicitud_anulacion_creador FOREIGN KEY (creador_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT,
      CONSTRAINT FK_solicitud_anulacion_aprobador FOREIGN KEY (aprobador_id)
        REFERENCES usuarios(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE solicitudes_anulacion');
    await queryRunner.query('ALTER TABLE rbac_permissions DROP COLUMN is_dynamic');
  }
}
