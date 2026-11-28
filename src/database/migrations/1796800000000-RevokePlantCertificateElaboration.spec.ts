import { describe, expect, it, vi } from 'vitest';
import { DATABASE_MIGRATIONS } from '../migration-registry.js';
import { RevokePlantCertificateElaboration1796800000000 } from './1796800000000-RevokePlantCertificateElaboration.js';

describe('revoke plant certificate elaboration migration', () => {
  it('removes only certificados.elaborar from operario_planta', async () => {
    const query = vi.fn(async () => []);
    await new RevokePlantCertificateElaboration1796800000000().up({ query } as never);

    expect(DATABASE_MIGRATIONS).toContain(
      RevokePlantCertificateElaboration1796800000000,
    );
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain("r.code = 'operario_planta'");
    expect(query.mock.calls[0][0]).toContain(
      "rp.permission_code = 'certificados.elaborar'",
    );
    expect(query.mock.calls[0][0]).toMatch(/^DELETE rp FROM rbac_role_permissions rp/);
  });

  it('does not restore the grant automatically', async () => {
    await expect(
      new RevokePlantCertificateElaboration1796800000000().down({ query: vi.fn() } as never),
    ).rejects.toThrow();
  });
});
