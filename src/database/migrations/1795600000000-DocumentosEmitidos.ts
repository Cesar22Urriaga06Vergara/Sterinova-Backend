import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Historial auditable de emisiones de documentos logísticos (Orden y Acta).
 * Cada emisión guarda snapshot inmutable, versión de formato, hash del PDF y ruta de almacenamiento.
 * Aditiva: no reescribe documentos existentes.
 */
export class DocumentosEmitidos1795600000000 implements MigrationInterface {
  name = 'DocumentosEmitidos1795600000000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE documentos_emitidos (
        id INT NOT NULL AUTO_INCREMENT,
        tipo ENUM('ORDEN','ACTA') NOT NULL,
        consecutivo VARCHAR(40) NOT NULL,
        formato_version_id INT NOT NULL,
        snapshot_json JSON NOT NULL,
        pdf_storage_key VARCHAR(512) NULL,
        pdf_hash CHAR(64) NULL,
        fecha_emision DATETIME(6) NOT NULL,
        usuario_id INT NOT NULL,
        estado ENUM('EMITIDO','ANULADO','CORREGIDO') NOT NULL DEFAULT 'EMITIDO',
        orden_id INT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_documentos_emitidos_tipo_consecutivo (tipo, consecutivo),
        CONSTRAINT FK_documento_emitido_formato_version
          FOREIGN KEY (formato_version_id) REFERENCES formato_versiones(id) ON DELETE RESTRICT,
        CONSTRAINT FK_documento_emitido_usuario
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
        CONSTRAINT FK_documento_emitido_orden
          FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_documentos_emitidos_orden_id
        ON documentos_emitidos (orden_id)`,
    );
    await queryRunner.query(
      `CREATE TABLE documentos_eventos (
        id INT NOT NULL AUTO_INCREMENT,
        documento_emitido_id INT NOT NULL,
        tipo_evento ENUM('EMISION','ANULACION','CORRECCION') NOT NULL,
        usuario_id INT NOT NULL,
        fecha DATETIME(6) NOT NULL,
        motivo VARCHAR(1000) NULL,
        datos_json JSON NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        CONSTRAINT FK_documento_evento_documento
          FOREIGN KEY (documento_emitido_id) REFERENCES documentos_emitidos(id) ON DELETE RESTRICT,
        CONSTRAINT FK_documento_evento_usuario
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_documentos_eventos_documento_id
        ON documentos_eventos (documento_emitido_id)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IDX_documentos_eventos_documento_id ON documentos_eventos');
    await queryRunner.query('DROP TABLE documentos_eventos');
    await queryRunner.query('DROP INDEX IDX_documentos_emitidos_orden_id ON documentos_emitidos');
    await queryRunner.query('DROP TABLE documentos_emitidos');
  }
}
