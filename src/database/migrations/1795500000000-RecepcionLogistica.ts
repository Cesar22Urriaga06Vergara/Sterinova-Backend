import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Recepción física inicial de materiales en Logística.
 * Aditiva: no reescribe documentos existentes.
 */
export class RecepcionLogistica1795500000000 implements MigrationInterface {
  name = 'RecepcionLogistica1795500000000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE recepciones_logistica (
        id INT NOT NULL AUTO_INCREMENT,
        orden_id INT NOT NULL,
        numero_remision_factura VARCHAR(100) NULL,
        fecha_hora_recepcion DATETIME(6) NOT NULL,
        usuario_id INT NOT NULL,
        sede_origen VARCHAR(200) NULL,
        evidencias JSON NULL,
        estado ENUM('RECIBIDO_PARCIAL','RECIBIDO_COMPLETO','RECHAZADO') NOT NULL DEFAULT 'RECIBIDO_PARCIAL',
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_recepciones_logistica_orden (orden_id),
        CONSTRAINT FK_recepcion_logistica_orden
          FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE RESTRICT,
        CONSTRAINT FK_recepcion_logistica_usuario
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_recepciones_logistica_estado
        ON recepciones_logistica (estado)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IDX_recepciones_logistica_estado ON recepciones_logistica');
    await queryRunner.query('DROP TABLE recepciones_logistica');
  }
}
