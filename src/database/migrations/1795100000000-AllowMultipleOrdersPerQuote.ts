import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * A quote can serve several orders (sedes or partial deliveries), so the
 * uniqueness of ordenes_servicio.cotizacion_id is removed. The contracted
 * quantity is protected in the service: the pending balance per quote item
 * cannot be allocated twice (reglas-maestras M4 §1; hoja de ruta D09/D11/D15).
 */
export class AllowMultipleOrdersPerQuote1795100000000
  implements MigrationInterface
{
  async up(runner: QueryRunner): Promise<void> {
    // The FK FK_ordenes_servicio_cotizacion on ordenes_servicio(cotizacion_id)
    // references cotizaciones(id). MySQL needs an index on the local FK column,
    // so the unique index UQ_ordenes_servicio_cotizacion cannot be dropped
    // while the FK exists. Drop the FK first, then the index, then recreate.
    await runner.query(
      `ALTER TABLE ordenes_servicio
        DROP FOREIGN KEY FK_ordenes_servicio_cotizacion`,
    );
    const indexes = (await runner.query(
      `SELECT DISTINCT INDEX_NAME AS name
         FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'ordenes_servicio'
          AND COLUMN_NAME = 'cotizacion_id'
          AND NON_UNIQUE = 0`,
    )) as Array<{ name: string }>;
    for (const index of indexes) {
      await runner.query(
        `ALTER TABLE ordenes_servicio DROP INDEX \`${index.name}\``,
      );
    }
    await runner.query(
      'CREATE INDEX IDX_ordenes_servicio_cotizacion_id ON ordenes_servicio (cotizacion_id)',
    );
    await runner.query(
      `ALTER TABLE ordenes_servicio
        ADD CONSTRAINT FK_ordenes_servicio_cotizacion
        FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE RESTRICT`,
    );
  }

  async down(): Promise<void> {
    throw new Error(
      'No restaurar la unicidad de ordenes_servicio.cotizacion_id; una cotización puede atender varias órdenes',
    );
  }
}
