import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tabla de acumulado de cantidades procesadas por material de orden y ciclo.
 * Soporta ciclos parciales: una orden puede distribuirse en varios ciclos
 * mientras quede cantidad pendiente por material (M5 resp. 62/69).
 */
export class CicloMaterialesProcesados1795200000000
  implements MigrationInterface
{
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(
      `CREATE TABLE ciclos_materiales_procesados (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        ciclo_id INT NOT NULL,
        orden_servicio_material_id INT NOT NULL,
        cantidad_procesada INT UNSIGNED NOT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        CONSTRAINT FK_ciclos_materiales_procesados_ciclo
          FOREIGN KEY (ciclo_id) REFERENCES ciclos_esterilizacion(id)
          ON DELETE RESTRICT,
        CONSTRAINT FK_ciclos_materiales_procesados_material
          FOREIGN KEY (orden_servicio_material_id)
          REFERENCES ordenes_servicio_materiales(id)
          ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    );
    await runner.query(
      `CREATE INDEX IDX_ciclos_materiales_procesados_ciclo
        ON ciclos_materiales_procesados (ciclo_id)`,
    );
    await runner.query(
      `CREATE INDEX IDX_ciclos_materiales_procesados_material
        ON ciclos_materiales_procesados (orden_servicio_material_id)`,
    );
  }

  async down(): Promise<void> {
    throw new Error(
      'No retirar el acumulado de ciclos parciales; rompería el historial de cantidades procesadas',
    );
  }
}
