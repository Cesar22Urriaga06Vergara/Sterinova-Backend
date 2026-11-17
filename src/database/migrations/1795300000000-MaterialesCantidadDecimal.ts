import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * La cantidad de material de orden admite decimales para servicios de
 * peso o volumen (p. ej. 15.5 kg en Lavandería), sin romper los enteros
 * existentes de los servicios EtO/Vapor.
 */
export class MaterialesCantidadDecimal1795300000000
  implements MigrationInterface
{
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(
      'ALTER TABLE ordenes_servicio_materiales MODIFY COLUMN cantidad DECIMAL(12,3) UNSIGNED NOT NULL',
    );
  }

  async down(): Promise<void> {
    throw new Error(
      'No revertir la columna de cantidad a entero; perdería los valores decimales ya registrados',
    );
  }
}
