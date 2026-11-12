import { DATABASE_MIGRATIONS } from '../migration-registry.js';
import { AddQuoteItemCatalogSnapshots1794800000000 } from './1794800000000-AddQuoteItemCatalogSnapshots.js';
import type { QueryRunner } from 'typeorm';

describe('quote item catalog snapshots migration', () => {
  it('is registered after the product catalog migration', () => {
    expect(
      DATABASE_MIGRATIONS.indexOf(
        AddQuoteItemCatalogSnapshots1794800000000,
      ),
    ).toBeGreaterThan(
      DATABASE_MIGRATIONS.findIndex(
        ({ name }) => name === 'AddProductCatalog1794700000000',
      ),
    );
  });

  it('adds nullable catalog snapshots for existing quote items', async () => {
    const query = vi.fn(async () => undefined);
    await new AddQuoteItemCatalogSnapshots1794800000000().up({
      query,
    } as unknown as QueryRunner);

    const statement = query.mock.calls[0]?.[0] ?? '';
    expect(statement).toContain('ADD COLUMN producto_id INT NULL');
    expect(statement).toContain("ENUM('PRODUCTO', 'SERVICIO') NULL");
    expect(statement).toContain('ADD COLUMN unidad VARCHAR(80) NULL');
    expect(statement).toContain('ADD COLUMN imagen_key VARCHAR(48) NULL');
    expect(statement).toContain('REFERENCES productos(id) ON DELETE RESTRICT');
  });
});
