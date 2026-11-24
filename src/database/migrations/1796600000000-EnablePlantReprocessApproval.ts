import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnablePlantReprocessApproval1796600000000 implements MigrationInterface {
  name = 'EnablePlantReprocessApproval1796600000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO rbac_permissions (code, module, label, active, is_dynamic)
      VALUES ('planta.reprocesos.registrar', 'planta', 'Autorizar reprocesos desde Planta', 1, 0)
      ON DUPLICATE KEY UPDATE active=1, label='Autorizar reprocesos desde Planta'`);
    await queryRunner.query(`INSERT INTO rbac_role_permissions (role_id, permission_code, resource_access, include_descendants)
      SELECT id, 'planta.reprocesos.registrar', 'SCOPE', 1
      FROM rbac_roles WHERE code='admin_planta' AND kind='STANDARD'
      ON DUPLICATE KEY UPDATE resource_access='SCOPE', include_descendants=1`);
  }

  async down(): Promise<void> {
    // Existing grants may have been modified after deployment; do not revoke them automatically.
  }
}
