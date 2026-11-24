import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ReprocessApprovals1796500000000 implements MigrationInterface {
  name = 'ReprocessApprovals1796500000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ciclos_esterilizacion
      ADD COLUMN reproceso_calidad_autorizado_por_id int NULL,
      ADD COLUMN reproceso_calidad_autorizado_at datetime(6) NULL,
      ADD COLUMN reproceso_calidad_motivo text NULL,
      ADD COLUMN reproceso_planta_autorizado_por_id int NULL,
      ADD COLUMN reproceso_planta_autorizado_at datetime(6) NULL,
      ADD COLUMN reproceso_planta_motivo text NULL,
      ADD CONSTRAINT FK_ciclo_reproceso_calidad_usuario FOREIGN KEY (reproceso_calidad_autorizado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
      ADD CONSTRAINT FK_ciclo_reproceso_planta_usuario FOREIGN KEY (reproceso_planta_autorizado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE ciclos_esterilizacion DROP FOREIGN KEY FK_ciclo_reproceso_calidad_usuario, DROP FOREIGN KEY FK_ciclo_reproceso_planta_usuario');
    await queryRunner.query(`ALTER TABLE ciclos_esterilizacion
      DROP COLUMN reproceso_calidad_autorizado_por_id,
      DROP COLUMN reproceso_calidad_autorizado_at,
      DROP COLUMN reproceso_calidad_motivo,
      DROP COLUMN reproceso_planta_autorizado_por_id,
      DROP COLUMN reproceso_planta_autorizado_at,
      DROP COLUMN reproceso_planta_motivo`);
  }
}
