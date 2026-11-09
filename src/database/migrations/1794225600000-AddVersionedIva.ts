import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersionedIva1794225600000 implements MigrationInterface {
  name = 'AddVersionedIva1794225600000';
  transaction = false;
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TABLE tasas_fiscales (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      impuesto VARCHAR(30) NOT NULL,
      version INT UNSIGNED NOT NULL,
      tasa DECIMAL(7,6) NOT NULL,
      vigente_desde DATETIME(6) NOT NULL,
      creado_por INT NULL,
      motivo VARCHAR(500) NOT NULL,
      creado_at DATETIME(6) NOT NULL,
      UNIQUE KEY UQ_tasa_fiscal_version (impuesto, version),
      UNIQUE KEY UQ_tasa_fiscal_vigencia (impuesto, vigente_desde),
      CONSTRAINT CHK_tasa_fiscal_valor CHECK (tasa >= 0 AND tasa <= 1 AND version > 0),
      CONSTRAINT FK_tasa_fiscal_creador FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
    // Bootstrap value only: runtime calculations never fall back to this constant.
    await runner.query(`INSERT INTO tasas_fiscales (impuesto, version, tasa, vigente_desde, creado_por, motivo, creado_at)
      VALUES ('IVA', 1, 0.190000, UTC_TIMESTAMP(6), NULL, 'Configuración inicial; no atribuye tasas a documentos históricos', UTC_TIMESTAMP(6))`);
    await runner.query(`CREATE TRIGGER tasas_fiscales_no_update BEFORE UPDATE ON tasas_fiscales
      FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Las versiones fiscales son inmutables; publique una nueva'`);
    await runner.query(`CREATE TRIGGER tasas_fiscales_no_delete BEFORE DELETE ON tasas_fiscales
      FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se eliminan versiones fiscales'`);
    await runner.query(`ALTER TABLE cotizaciones
      ADD iva_tasa DECIMAL(7,6) NULL,
      ADD iva_version_id INT NULL,
      ADD CONSTRAINT FK_cotizacion_iva_version FOREIGN KEY (iva_version_id) REFERENCES tasas_fiscales(id) ON DELETE RESTRICT,
      ADD CONSTRAINT CHK_cotizacion_iva_version CHECK (
        (iva_tasa IS NULL AND iva_version_id IS NULL) OR
        (iva_tasa IS NOT NULL AND iva_version_id IS NOT NULL AND iva_tasa >= 0 AND iva_tasa <= 1))`);
    await runner.query(`INSERT INTO rbac_permissions (code, module, label, active)
      VALUES ('tasas_fiscales.gestionar', 'configuracion', 'Publicar versiones de tasas fiscales', 1)`);
    await runner.query(`INSERT INTO rbac_role_permissions (role_id, permission_code, resource_access, include_descendants)
      SELECT id, 'tasas_fiscales.gestionar', 'SCOPE', 1 FROM rbac_roles WHERE code = 'superadmin'`);
  }
  async down(): Promise<void> {
    throw new Error(
      'No se elimina la historia fiscal ni sus referencias mediante rollback automático.',
    );
  }
}
