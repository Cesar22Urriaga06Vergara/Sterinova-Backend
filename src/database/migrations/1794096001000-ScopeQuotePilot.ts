import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ScopeQuotePilot1794096001000 implements MigrationInterface {
  name = 'ScopeQuotePilot1794096001000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE cotizaciones
      ADD scope_id INT NULL,
      ADD INDEX IDX_cotizaciones_scope_creator (scope_id, creador_id, id),
      ADD CONSTRAINT FK_cotizaciones_scope FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT`);
    await queryRunner.query(`UPDATE rbac_role_permissions g
      JOIN rbac_roles r ON r.id = g.role_id
      SET g.resource_access = 'OWN'
      WHERE r.code = 'comercial' AND g.permission_code IN (
        'cotizaciones.ver', 'cotizaciones.previsualizar', 'cotizaciones.descargar', 'cotizaciones.aceptar'
      )`);
  }

  async down(): Promise<void> {
    throw new Error(
      'No se elimina el ámbito de cotizaciones ni se amplían permisos mediante rollback automático.',
    );
  }
}
