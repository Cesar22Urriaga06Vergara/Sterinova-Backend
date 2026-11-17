import { RevokeQuoteDeletion1795000000000 } from './1795000000000-RevokeQuoteDeletion.js';
import { DATABASE_MIGRATIONS } from '../migration-registry.js';

describe('quote deletion revocation migration', () => {
  it('removes every grant of the quote deletion permission and nothing else', async () => {
    const query = vi.fn(async () => []);
    await new RevokeQuoteDeletion1795000000000().up({ query } as never);
    expect(DATABASE_MIGRATIONS).toContain(RevokeQuoteDeletion1795000000000);
    const deletes = query.mock.calls.filter(([sql]) =>
      sql.startsWith('DELETE'),
    );
    expect(deletes).toHaveLength(1);
    expect(deletes[0][0]).toBe(
      "DELETE FROM rbac_role_permissions WHERE permission_code='cotizaciones.eliminar'",
    );
    expect(
      query.mock.calls.some(([sql]) => !sql.startsWith('DELETE')),
    ).toBe(false);
  });
  it('refuses to restore the revoked grants automatically', async () => {
    await expect(
      new RevokeQuoteDeletion1795000000000().down({ query: vi.fn() } as never),
    ).rejects.toThrow();
  });
});
