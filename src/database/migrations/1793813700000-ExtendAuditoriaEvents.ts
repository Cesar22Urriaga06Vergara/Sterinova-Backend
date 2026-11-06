import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendAuditoriaEvents1793813700000 implements MigrationInterface {
  name = 'ExtendAuditoriaEvents1793813700000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE auditoria
        MODIFY accion VARCHAR(30) NOT NULL,
        MODIFY entidad_id INT NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const nullEntityIds = await queryRunner.query(
      'SELECT COUNT(*) AS total FROM auditoria WHERE entidad_id IS NULL',
    ) as Array<{ total: number }>;
    if (Number(nullEntityIds[0]?.total ?? 0) > 0) {
      throw new Error('No se puede revertir: auditoria contiene eventos sin entidad_id.');
    }
    const extendedActions = await queryRunner.query(
      "SELECT COUNT(*) AS total FROM auditoria WHERE accion NOT IN ('crear','editar','emitir','publicar','eliminar')",
    ) as Array<{ total: number }>;
    if (Number(extendedActions[0]?.total ?? 0) > 0) {
      throw new Error('No se puede revertir: auditoria contiene acciones nuevas.');
    }
    await queryRunner.query(`
      ALTER TABLE auditoria
        MODIFY accion ENUM('crear','editar','emitir','publicar','eliminar') NOT NULL,
        MODIFY entidad_id INT NOT NULL
    `);
  }
}
