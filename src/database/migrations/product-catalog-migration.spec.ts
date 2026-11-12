import { DATABASE_MIGRATIONS } from '../migration-registry.js';
import { AddProductCatalog1794700000000 } from './1794700000000-AddProductCatalog.js';
import type { QueryRunner } from 'typeorm';

describe('product catalog migration', () => {
  it('is registered after logistics document migrations', () => {
    expect(
      DATABASE_MIGRATIONS.indexOf(AddProductCatalog1794700000000),
    ).toBeGreaterThan(
      DATABASE_MIGRATIONS.findIndex(
        ({ name }) => name === 'AddActaEventsAndLogisticsFormats1794600000000',
      ),
    );
  });

  it('creates a scoped catalog and grants management only to administrators', async () => {
    const query = vi.fn(async () => undefined);
    await new AddProductCatalog1794700000000().up({
      query,
    } as unknown as QueryRunner);

    const statements = query.mock.calls.map(([statement]) => statement);
    const createTable = statements.find((sql) =>
      sql.includes('CREATE TABLE productos'),
    );
    expect(createTable).toContain('scope_id INT NOT NULL');
    expect(createTable).toContain('tipo_servicio');
    expect(createTable).toContain('precision_cantidad');
    expect(createTable).toContain('REFERENCES rbac_scopes(id)');
    expect(statements).toContain(
      "INSERT INTO rbac_permissions (code, module, label, active, is_dynamic) VALUES ('productos.gestionar', 'comercial', 'Administrar el catálogo de productos y servicios', 1, 0)",
    );
    expect(statements.some((sql) =>
      sql.includes("code = 'admin_area'") && sql.includes("code = 'superadmin'"),
    )).toBe(true);
  });

  it('refuses to drop catalog data during rollback', async () => {
    const query = vi.fn(async (sql: string) =>
      sql.includes('SELECT COUNT') ? [{ total: 1 }] : undefined,
    );

    await expect(
      new AddProductCatalog1794700000000().down({
        query,
      } as unknown as QueryRunner),
    ).rejects.toThrow('No se puede revertir el catálogo mientras existan productos');
    expect(query).toHaveBeenCalledTimes(1);
  });
});
