import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Official certificate preparation remains a Quality responsibility. The
 * permission is kept in the catalog for the later certificate workflow, but
 * must not be granted to plant operators before that workflow exists.
 */
export class RevokePlantCertificateElaboration1796800000000
  implements MigrationInterface
{
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(
      `DELETE rp FROM rbac_role_permissions rp
       INNER JOIN rbac_roles r ON r.id = rp.role_id
       WHERE r.code = 'operario_planta'
         AND rp.permission_code = 'certificados.elaborar'`,
    );
  }

  async down(): Promise<void> {
    throw new Error(
      'No restaurar certificados.elaborar en operario_planta; activar el flujo de Calidad mediante una migración correctiva',
    );
  }
}
