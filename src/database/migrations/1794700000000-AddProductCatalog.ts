import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductCatalog1794700000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE productos (
        id INT NOT NULL AUTO_INCREMENT,
        scope_id INT NOT NULL,
        tipo_servicio ENUM(
          'INDUSTRIAL_ETO',
          'INSTITUCIONAL_ETO',
          'INSTITUCIONAL_VAPOR',
          'INSUMOS',
          'LAVANDERIA',
          'FARMACEUTICO',
          'FABRICANTE'
        ) NOT NULL,
        tipo_item ENUM('PRODUCTO', 'SERVICIO') NOT NULL,
        categoria ENUM('EMPAQUES', 'MONITOREO', 'EQUIPOS', 'GENERAL') NULL,
        codigo VARCHAR(80) NULL,
        referencia VARCHAR(160) NULL,
        metodo VARCHAR(120) NULL,
        presentacion VARCHAR(160) NULL,
        marca VARCHAR(120) NULL,
        descripcion VARCHAR(500) NOT NULL,
        unidad VARCHAR(80) NOT NULL,
        precision_cantidad TINYINT UNSIGNED NOT NULL DEFAULT 0,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY IDX_productos_scope_id (scope_id),
        KEY IDX_productos_scope_tipo_activo (scope_id, tipo_servicio, activo),
        CONSTRAINT FK_productos_scope_id FOREIGN KEY (scope_id)
          REFERENCES rbac_scopes(id) ON DELETE RESTRICT,
        CONSTRAINT CHK_productos_precision_cantidad CHECK (precision_cantidad <= 2)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await runner.query(
      `INSERT INTO rbac_permissions (code, module, label, active, is_dynamic) VALUES ('productos.gestionar', 'comercial', 'Administrar el catálogo de productos y servicios', 1, 0)`,
    );
    await runner.query(
      `INSERT INTO rbac_role_permissions (role_id, permission_code, resource_access, include_descendants)
       SELECT id, 'productos.gestionar', 'SCOPE', 1 FROM rbac_roles
       WHERE (code = 'admin_area' AND kind = 'STANDARD')
          OR (code = 'superadmin' AND kind = 'PLATFORM')`,
    );
  }

  async down(runner: QueryRunner): Promise<void> {
    const rows = (await runner.query(
      'SELECT COUNT(*) AS total FROM productos',
    )) as { total: number | string }[];
    if (Number(rows[0]?.total ?? 0) > 0) {
      throw new Error(
        'No se puede revertir el catálogo mientras existan productos',
      );
    }
    await runner.query(
      `DELETE FROM rbac_role_permissions WHERE permission_code = 'productos.gestionar'`,
    );
    await runner.query(
      `DELETE FROM rbac_permissions WHERE code = 'productos.gestionar'`,
    );
    await runner.query('DROP TABLE productos');
  }
}
