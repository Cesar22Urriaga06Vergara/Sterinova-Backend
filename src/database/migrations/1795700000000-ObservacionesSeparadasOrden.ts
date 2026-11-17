import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Observaciones separadas por contexto en Orden de Servicio.
 * `observaciones_recepcion` para recepción de material.
 * `observaciones_cliente` para observaciones del cliente en entrega.
 * Aditiva: la columna `observaciones` genérica se conserva por retrocompatibilidad.
 */
export class ObservacionesSeparadasOrden1795700000000 implements MigrationInterface {
  name = 'ObservacionesSeparadasOrden1795700000000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ordenes_servicio
        ADD observaciones_recepcion TEXT NULL,
        ADD observaciones_cliente TEXT NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ordenes_servicio
        DROP COLUMN observaciones_recepcion,
        DROP COLUMN observaciones_cliente`,
    );
  }
}
