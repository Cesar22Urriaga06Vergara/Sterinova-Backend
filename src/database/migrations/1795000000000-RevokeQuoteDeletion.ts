import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Removes every grant of the quote deletion permission. Quote conservation is
 * mandatory: corrections go through cancellation requests, never physical
 * deletion (reglas-maestras M1/M3; roles-y-permisos §9 DELETE /cotizaciones/:id).
 */
export class RevokeQuoteDeletion1795000000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(
      "DELETE FROM rbac_role_permissions WHERE permission_code='cotizaciones.eliminar'",
    );
  }
  async down(): Promise<void> {
    throw new Error(
      'No restaurar la concesión de eliminación de cotizaciones; usar una migración correctiva',
    );
  }
}
