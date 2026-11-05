import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditoria1793813300000 implements MigrationInterface {
  name = 'CreateAuditoria1793813300000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE auditoria (
        id INT NOT NULL AUTO_INCREMENT,
        usuario_id INT NULL,
        entidad VARCHAR(100) NOT NULL,
        entidad_id INT NOT NULL,
        accion ENUM('crear','editar','emitir','publicar','eliminar') NOT NULL,
        detalle JSON NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_auditoria_entidad_registro (entidad, entidad_id),
        KEY IDX_auditoria_created_at (created_at),
        KEY IDX_auditoria_usuario_id (usuario_id),
        CONSTRAINT FK_auditoria_usuario FOREIGN KEY (usuario_id)
          REFERENCES usuarios(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE auditoria');
  }
}
