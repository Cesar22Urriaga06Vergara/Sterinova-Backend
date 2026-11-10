import type { MigrationInterface, QueryRunner } from 'typeorm';

// Frozen migration data; future catalog edits must not change historical grants.
const permissions = [
  [
    'solicitudes_anulacion.crear',
    'Crear solicitudes de anulación de cotizaciones',
  ],
  [
    'solicitudes_anulacion.aprobar',
    'Resolver solicitudes de anulación de cotizaciones',
  ],
  [
    'solicitudes_anulacion.ver',
    'Consultar solicitudes de anulación pendientes',
  ],
] as const;

export class AddCancellationPermissions1794225604000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    for (const [code, label] of permissions) {
      await runner.query(
        `INSERT INTO rbac_permissions (code, module, label, active, is_dynamic) VALUES (?, 'comercial', ?, 1, 1)`,
        [code, label],
      );
      await runner.query(
        `INSERT INTO rbac_role_permissions (role_id, permission_code, resource_access, include_descendants)
         SELECT id, ?, 'SCOPE', CASE WHEN kind = 'PLATFORM' THEN 1 ELSE 0 END
         FROM rbac_roles WHERE (code = 'superadmin' AND kind = 'PLATFORM')
           OR (code = 'admin_area' AND kind = 'STANDARD')`,
        [code],
      );
    }
    await runner.query(
      `INSERT INTO rbac_role_permissions (role_id, permission_code, resource_access, include_descendants)
       SELECT id, 'solicitudes_anulacion.crear', 'OWN', 0 FROM rbac_roles
       WHERE code = 'comercial' AND kind = 'STANDARD'`,
    );
  }

  async down(runner: QueryRunner): Promise<void> {
    for (const [code] of permissions) {
      await runner.query(
        'DELETE FROM rbac_role_permissions WHERE permission_code = ?',
        [code],
      );
      await runner.query('DELETE FROM rbac_permissions WHERE code = ?', [code]);
    }
  }
}
