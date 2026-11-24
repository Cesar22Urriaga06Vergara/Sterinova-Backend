import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Multiple processing/reprocessing events belong to the same order. */
export class AllowRepeatedOrderEvents1796200000000 implements MigrationInterface {
  name = 'AllowRepeatedOrderEvents1796200000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE ordenes_servicio_eventos DROP INDEX UQ_ordenes_servicio_evento_tipo');
    await queryRunner.query('CREATE INDEX IDX_ordenes_servicio_evento_tipo ON ordenes_servicio_eventos (orden_id, tipo)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const duplicates = await queryRunner.query(`SELECT orden_id, tipo FROM ordenes_servicio_eventos GROUP BY orden_id, tipo HAVING COUNT(*) > 1 LIMIT 1`);
    if (duplicates.length) throw new Error('No se puede restaurar el índice único: existen varios eventos del mismo tipo por orden');
    await queryRunner.query('DROP INDEX IDX_ordenes_servicio_evento_tipo ON ordenes_servicio_eventos');
    await queryRunner.query('CREATE UNIQUE INDEX UQ_ordenes_servicio_evento_tipo ON ordenes_servicio_eventos (orden_id, tipo)');
  }
}
