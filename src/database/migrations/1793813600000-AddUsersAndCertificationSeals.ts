import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersAndCertificationSeals1793813600000 implements MigrationInterface {
  name = 'AddUsersAndCertificationSeals1793813600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuarios
        ADD apellido VARCHAR(255) NULL,
        ADD cargo VARCHAR(255) NULL,
        ADD celular VARCHAR(50) NULL,
        ADD email_contacto VARCHAR(255) NULL,
        ADD activo TINYINT(1) NOT NULL DEFAULT 1
    `);
    await queryRunner.query(`
      ALTER TABLE cotizaciones
        ADD creador_id INT NULL,
        ADD KEY IDX_cotizaciones_creador_id (creador_id),
        ADD CONSTRAINT FK_cotizaciones_creador
          FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE SET NULL
    `);
    await queryRunner.query(`
      CREATE TABLE sellos_certificacion (
        id INT NOT NULL AUTO_INCREMENT,
        nombre_norma VARCHAR(120) NOT NULL,
        numero_licencia VARCHAR(150) NOT NULL,
        imagen_key VARCHAR(1024) NOT NULL,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        orden INT NOT NULL DEFAULT 0,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_sellos_certificacion_activo_orden (activo, orden)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE sellos_certificacion');
    await queryRunner.query(`
      ALTER TABLE cotizaciones
        DROP FOREIGN KEY FK_cotizaciones_creador,
        DROP INDEX IDX_cotizaciones_creador_id,
        DROP COLUMN creador_id
    `);
    await queryRunner.query(`
      ALTER TABLE usuarios
        DROP COLUMN activo,
        DROP COLUMN email_contacto,
        DROP COLUMN celular,
        DROP COLUMN cargo,
        DROP COLUMN apellido
    `);
  }
}
