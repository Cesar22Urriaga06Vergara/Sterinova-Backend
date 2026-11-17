import { EnableGeneralManager1794900000000 } from './1794900000000-EnableGeneralManager.js';
import { DATABASE_MIGRATIONS } from '../migration-registry.js';
describe('general manager activation migration', () => {
  it('registers an additive migration and grants read and area-admin management without global assignment powers', async () => {
    const query = vi.fn(async (sql: string, _params?: unknown[]) =>
      sql.startsWith('SELECT')
        ? [{ id: 30, kind: 'STANDARD', global_assignable: 1 }]
        : [],
    );
    await new EnableGeneralManager1794900000000().up({ query } as never);
    expect(DATABASE_MIGRATIONS).toContain(EnableGeneralManager1794900000000);
    const grants = query.mock.calls
      .filter(([sql]) => sql.startsWith('INSERT INTO rbac_role_permissions'))
      .map(([, params]) => params?.[1]);
    expect(grants).toContain('gerencia.metricas.ver');
    expect(grants).toContain('gerencia.administradores.gestionar');
    expect(grants).toContain('usuarios.identidad.gestionar');
    expect(grants).toContain('asignaciones.gestionar');
    for (const permission of [
      'roles.gestionar',
      'calidad.aprobar',
      'cotizaciones.aprobar_interna',
    ])
      expect(grants).not.toContain(permission);
    expect(
      query.mock.calls.some(([sql]) =>
        /INSERT INTO (usuarios|rbac_user_role_assignments|rbac_platform_owner)/.test(
          sql,
        ),
      ),
    ).toBe(false);
  });
  it('refuses an incompatible role before changing grants', async () => {
    const query = vi.fn(async () => [
      { id: 30, kind: 'PLATFORM', global_assignable: 1 },
    ]);
    await expect(
      new EnableGeneralManager1794900000000().up({ query } as never),
    ).rejects.toThrow();
    expect(query).toHaveBeenCalledTimes(1);
  });
});
