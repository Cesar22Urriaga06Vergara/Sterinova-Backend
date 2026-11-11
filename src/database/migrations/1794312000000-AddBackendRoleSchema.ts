import type { MigrationInterface, QueryRunner } from 'typeorm';
/** Additive phase 1: historical actors and scopes remain unknown (NULL). */
export class AddBackendRoleSchema1794312000000 implements MigrationInterface {
  transaction = false;
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE rbac_roles
      ADD COLUMN global_assignable TINYINT(1) NOT NULL DEFAULT 0,
      ADD UNIQUE KEY UQ_rbac_roles_global_eligibility (id, global_assignable)`);
    await runner.query(`ALTER TABLE rbac_user_role_assignments
      DROP CONSTRAINT CHK_rbac_assignment_scope,
      ADD COLUMN role_global_assignable TINYINT(1) NOT NULL DEFAULT 0,
      ADD CONSTRAINT CHK_rbac_assignment_scope CHECK (scope_kind <> 'GLOBAL' OR role_global_assignable = 1),
      ADD CONSTRAINT FK_rbac_assignment_global_eligibility FOREIGN KEY (role_id, role_global_assignable)
        REFERENCES rbac_roles(id, global_assignable) ON DELETE RESTRICT`);
    await runner.query(`ALTER TABLE clientes
      ADD COLUMN scope_id INT NULL,
      ADD COLUMN creador_id INT NULL,
      ADD INDEX IDX_clientes_scope_id (scope_id),
      ADD CONSTRAINT FK_clientes_scope_id FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT,
      ADD INDEX IDX_clientes_creador_id (creador_id),
      ADD CONSTRAINT FK_clientes_creador_id FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE RESTRICT`);
    await runner.query(`ALTER TABLE ordenes_servicio
      ADD COLUMN scope_id INT NULL,
      ADD COLUMN creador_id INT NULL,
      ADD INDEX IDX_ordenes_servicio_scope_id (scope_id),
      ADD CONSTRAINT FK_ordenes_servicio_scope_id FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT,
      ADD INDEX IDX_ordenes_servicio_creador_id (creador_id),
      ADD CONSTRAINT FK_ordenes_servicio_creador_id FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE RESTRICT`);
    await runner.query(`ALTER TABLE ciclos_esterilizacion
      ADD COLUMN scope_id INT NULL,
      ADD INDEX IDX_ciclos_esterilizacion_scope_id (scope_id),
      ADD CONSTRAINT FK_ciclos_esterilizacion_scope_id FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT`);
    await runner.query(`ALTER TABLE cotizaciones
      ADD COLUMN aprobador_interno_id INT NULL,
      ADD COLUMN aceptacion_registrada_por_id INT NULL,
      ADD COLUMN aprobado_internamente_at DATETIME(6) NULL,
      ADD COLUMN aceptacion_registrada_at DATETIME(6) NULL,
      ADD INDEX IDX_cotizaciones_aprobador_interno_id (aprobador_interno_id),
      ADD CONSTRAINT FK_cotizaciones_aprobador_interno_id FOREIGN KEY (aprobador_interno_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
      ADD INDEX IDX_cotizaciones_aceptacion_registrada_por_id (aceptacion_registrada_por_id),
      ADD CONSTRAINT FK_cotizaciones_aceptacion_registrada_por_id FOREIGN KEY (aceptacion_registrada_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT`);
    await runner.query(`ALTER TABLE certificados_esterilizacion
      ADD COLUMN elaborado_por_id INT NULL,
      ADD COLUMN verificado_por_id INT NULL,
      ADD COLUMN elaborado_at DATETIME(6) NULL,
      ADD COLUMN verificado_at DATETIME(6) NULL,
      ADD INDEX IDX_certificados_esterilizacion_elaborado_por_id (elaborado_por_id),
      ADD CONSTRAINT FK_certificados_esterilizacion_elaborado_por_id FOREIGN KEY (elaborado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
      ADD INDEX IDX_certificados_esterilizacion_verificado_por_id (verificado_por_id),
      ADD CONSTRAINT FK_certificados_esterilizacion_verificado_por_id FOREIGN KEY (verificado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT`);
    await runner.query(`ALTER TABLE formato_versiones
      ADD COLUMN scope_id INT NULL,
      ADD COLUMN creador_id INT NULL,
      ADD COLUMN aprobador_id INT NULL,
      ADD COLUMN publicado_por_id INT NULL,
      ADD COLUMN aprobado_at DATETIME(6) NULL,
      ADD COLUMN publicado_at DATETIME(6) NULL,
      ADD INDEX IDX_formato_versiones_scope_id (scope_id),
      ADD CONSTRAINT FK_formato_versiones_scope_id FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT,
      ADD INDEX IDX_formato_versiones_creador_id (creador_id),
      ADD CONSTRAINT FK_formato_versiones_creador_id FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
      ADD INDEX IDX_formato_versiones_aprobador_id (aprobador_id),
      ADD CONSTRAINT FK_formato_versiones_aprobador_id FOREIGN KEY (aprobador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
      ADD INDEX IDX_formato_versiones_publicado_por_id (publicado_por_id),
      ADD CONSTRAINT FK_formato_versiones_publicado_por_id FOREIGN KEY (publicado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT`);
    await runner.query(`ALTER TABLE auditoria
      ADD COLUMN scope_id INT NULL,
      ADD INDEX IDX_auditoria_scope_id (scope_id),
      ADD CONSTRAINT FK_auditoria_scope_id FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT`);
  }
  async down(_runner: QueryRunner): Promise<void> {
    throw new Error(
      'Rollback destructivo deshabilitado: conservar evidencia; usar migracion correctiva.',
    );
  }
}
