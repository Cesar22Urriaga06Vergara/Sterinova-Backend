import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ActaServicePhases1796100000000 implements MigrationInterface {
  name = 'ActaServicePhases1796100000000';
  async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE ordenes_servicio ADD COLUMN acta_fase tinyint unsigned NOT NULL DEFAULT 1, ADD COLUMN acta_cerrada_at datetime NULL, ADD COLUMN certificado_no varchar(100) NULL, ADD COLUMN factura_no varchar(100) NULL, ADD COLUMN novedad_tipo varchar(40) NULL, ADD COLUMN novedad_motivo text NULL`);
    await q.query(`ALTER TABLE ordenes_servicio_materiales ADD COLUMN cantidad_recibida decimal(12,3) unsigned NULL, ADD COLUMN cajas_recibidas int unsigned NULL, ADD COLUMN cantidad_entregada decimal(12,3) unsigned NULL, ADD COLUMN cajas_entregadas int unsigned NULL, ADD COLUMN visto_bueno tinyint NULL, ADD COLUMN devolucion_registrada tinyint NOT NULL DEFAULT 0, ADD COLUMN cantidad_devuelta decimal(12,3) unsigned NOT NULL DEFAULT 0`);
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE ordenes_servicio_materiales DROP COLUMN cantidad_recibida, DROP COLUMN cajas_recibidas, DROP COLUMN cantidad_entregada, DROP COLUMN cajas_entregadas, DROP COLUMN visto_bueno, DROP COLUMN devolucion_registrada, DROP COLUMN cantidad_devuelta`);
    await q.query(`ALTER TABLE ordenes_servicio DROP COLUMN acta_fase, DROP COLUMN acta_cerrada_at, DROP COLUMN certificado_no, DROP COLUMN factura_no, DROP COLUMN novedad_tipo, DROP COLUMN novedad_motivo`);
  }
}
