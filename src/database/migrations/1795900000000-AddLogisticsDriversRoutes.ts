import type { MigrationInterface, QueryRunner } from 'typeorm';
export class AddLogisticsDriversRoutes1795900000000 implements MigrationInterface {
  name = 'AddLogisticsDriversRoutes1795900000000';
  async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE logistica_conductores (id int NOT NULL AUTO_INCREMENT, scope_id int NOT NULL, nombre_completo varchar(180) NOT NULL, documento varchar(40) NOT NULL, telefono varchar(40) NULL, placa_vehiculo varchar(20) NULL, activo tinyint NOT NULL DEFAULT 1, INDEX IDX_logistica_conductores_scope (scope_id), PRIMARY KEY (id), CONSTRAINT FK_conductores_scope FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT) ENGINE=InnoDB`);
    await q.query(`ALTER TABLE ordenes_servicio ADD COLUMN conductor_recoleccion_id int NULL, ADD COLUMN conductor_entrega_id int NULL, ADD COLUMN fecha_hora_recoleccion datetime NULL, ADD COLUMN lote_recoleccion varchar(120) NULL, ADD COLUMN cajas_recibidas int NULL, ADD COLUMN cantidad_recibida decimal(12,2) NULL, ADD COLUMN entregado_por_cliente varchar(150) NULL, ADD COLUMN recibido_por_sterinova varchar(150) NULL, ADD COLUMN fecha_hora_entrega datetime NULL, ADD COLUMN cajas_entregadas int NULL, ADD COLUMN cantidad_entregada decimal(12,2) NULL, ADD COLUMN certificado_asociado varchar(100) NULL, ADD COLUMN entregado_por_sterinova varchar(150) NULL, ADD COLUMN recibido_por_cliente varchar(150) NULL, ADD COLUMN generar_acta tinyint NOT NULL DEFAULT 1, ADD COLUMN generar_orden tinyint NOT NULL DEFAULT 1`);
    await q.query(`ALTER TABLE ordenes_servicio ADD CONSTRAINT FK_orden_conductor_recoleccion FOREIGN KEY (conductor_recoleccion_id) REFERENCES logistica_conductores(id) ON DELETE RESTRICT, ADD CONSTRAINT FK_orden_conductor_entrega FOREIGN KEY (conductor_entrega_id) REFERENCES logistica_conductores(id) ON DELETE RESTRICT`);
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query('ALTER TABLE ordenes_servicio DROP FOREIGN KEY FK_orden_conductor_recoleccion, DROP FOREIGN KEY FK_orden_conductor_entrega');
    await q.query('ALTER TABLE ordenes_servicio DROP COLUMN conductor_recoleccion_id, DROP COLUMN conductor_entrega_id, DROP COLUMN fecha_hora_recoleccion, DROP COLUMN lote_recoleccion, DROP COLUMN cajas_recibidas, DROP COLUMN cantidad_recibida, DROP COLUMN entregado_por_cliente, DROP COLUMN recibido_por_sterinova, DROP COLUMN fecha_hora_entrega, DROP COLUMN cajas_entregadas, DROP COLUMN cantidad_entregada, DROP COLUMN certificado_asociado, DROP COLUMN entregado_por_sterinova, DROP COLUMN recibido_por_cliente, DROP COLUMN generar_acta, DROP COLUMN generar_orden');
    await q.query('DROP TABLE logistica_conductores');
  }
}
