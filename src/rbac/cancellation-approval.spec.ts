import { RbacAuthorizationService } from './rbac-authorization.service.js';
import { User } from '../users/entities/user.entity.js';
import { RbacRole } from './entities/role.entity.js';

function fixture(code = 'admin_area', scopeId = 2) {
  const scopes = [
    { id: 1, kind: 'GLOBAL', parent_id: null, active: true },
    { id: 2, kind: 'DEPARTMENT', parent_id: 1, active: true },
    { id: 3, kind: 'DEPARTMENT', parent_id: 1, active: true },
    { id: 4, kind: 'TEAM', parent_id: 2, active: true },
  ];
  const rows = [
    {
      roleId: 5,
      scopeId,
      assignmentActive: 1,
      roleActive: 1,
      permission: null,
    },
  ];
  const roles = [
    {
      id: 5,
      code,
      active: true,
      kind: code === 'superadmin' ? 'PLATFORM' : 'STANDARD',
    },
  ];
  const user = { id: 8, activo: true, rol: 'Admin' };
  const source = {
    query: vi.fn(async () => rows),
    getRepository: (entity) =>
      entity === User
        ? { findOne: vi.fn(async () => user) }
        : { find: vi.fn(async () => (entity === RbacRole ? roles : scopes)) },
  };
  return {
    service: new RbacAuthorizationService(source as never),
    scopes,
    rows,
    roles,
    source,
  };
}

describe('ámbitos de aprobación de anulaciones RBAC', () => {
  it('admin_area obtiene solo el ámbito exacto, sin descendientes', async () => {
    await expect(
      fixture().service.getCancellationApprovalScopeIds(8),
    ).resolves.toEqual([2]);
  });
  it('un asesor o un Admin legacy no obtiene ámbitos de aprobación', async () => {
    await expect(
      fixture('asesor').service.getCancellationApprovalScopeIds(8),
    ).resolves.toEqual([]);
  });
  it('SuperAdmin de plataforma obtiene todos los ámbitos activos', async () => {
    await expect(
      fixture('superadmin', 1).service.getCancellationApprovalScopeIds(8),
    ).resolves.toEqual([2, 3, 4]);
  });
  it('rechaza asignaciones revocadas', async () => {
    const { service, rows } = fixture();
    rows[0].assignmentActive = 0;
    await expect(service.getCancellationApprovalScopeIds(8)).resolves.toEqual(
      [],
    );
  });
  it('rechaza roles inactivos', async () => {
    const { service, roles } = fixture();
    roles[0].active = false;
    await expect(service.getCancellationApprovalScopeIds(8)).resolves.toEqual(
      [],
    );
  });
  it('rechaza ámbitos con ancestros inactivos', async () => {
    const { service, scopes } = fixture();
    scopes[0].active = false;
    await expect(service.getCancellationApprovalScopeIds(8)).resolves.toEqual(
      [],
    );
  });
  it('no acepta un rol superadmin estándar como propietario de plataforma', async () => {
    const { service, roles } = fixture('superadmin', 1);
    roles[0].kind = 'STANDARD';
    await expect(service.getCancellationApprovalScopeIds(8)).resolves.toEqual(
      [],
    );
  });
});
