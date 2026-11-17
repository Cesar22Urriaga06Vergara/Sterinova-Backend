import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega la Orden de Compra del cliente como requisito para crear una orden
 * de servicio (reglas-maestras M4 §2). La columna es nullable temporalmente
 * para no romper órdenes existentes; el servicio la exige en nuevas órdenes
 * desde cotizaciones ACEPTADA_CLIENTE.
 */
export class OrdenCompraCliente1795400000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(
      `ALTER TABLE ordenes_servicio
        ADD COLUMN orden_compra_cliente VARCHAR(255) NULL
        AFTER cotizacion_id`,
    );
  }

  async down(): Promise<void> {
    throw new Error(
      'No retirar la columna de Orden de Compra del cliente; rompería la trazabilidad comercial de órdenes existentes',
    );
  }
}
