import type { QueryRunner } from 'typeorm';
import {
  AddScopedRbac1794096000000,
  INITIAL_RBAC_PERMISSIONS,
  INITIAL_RBAC_ROLES,
} from './1794096000000-AddScopedRbac.js';
import { PERMISSION_CATALOG } from '../../rbac/permission-catalog.js';
import {
  compileAuthorizationPolicy,
  canAccessResource,
} from '../../rbac/authorization-policy.js';
import type { AuthorizationSubject } from '../../rbac/authorization.types.js';

describe('additive RBAC migration', () => {
  it('freezes a unique permission catalog and role matrix with known action identifiers', () => {
    const codes = INITIAL_RBAC_PERMISSIONS.map(({ code }) => code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toEqual(PERMISSION_CATALOG.map(({ code }) => code));
    expect(new Set(INITIAL_RBAC_ROLES.map(({ code }) => code)).size).toBe(
      INITIAL_RBAC_ROLES.length,
    );
    for (const role of INITIAL_RBAC_ROLES) {
      expect(
        new Set(role.grants.map(({ permission }) => permission)).size,
      ).toBe(role.grants.length);
      for (const grant of role.grants)
        expect(codes).toContain(grant.permission);
    }
    expect(
      INITIAL_RBAC_ROLES.filter(({ kind }) => kind === 'PLATFORM').map(
        ({ code }) => code,
      ),
    ).toEqual(['superadmin']);
  });

  it('seeds area administration without domain powers or global role management', () => {
    const admin = INITIAL_RBAC_ROLES.find(({ code }) => code === 'admin_area')!;
    expect(admin.grants.map(({ permission }) => permission).sort()).toEqual([
      'asignaciones.gestionar',
      'usuarios.ver',
    ]);
    expect(
      admin.grants.every(({ includeDescendants }) => includeDescendants),
    ).toBe(true);
  });

  it('gives operational roles no financial/commercial consultation capability', () => {
    for (const role of INITIAL_RBAC_ROLES.filter(({ code }) =>
      ['logistica', 'planta', 'calidad', 'auditor_calidad'].includes(code),
    )) {
      expect(
        role.grants.some(
          ({ permission }) =>
            permission.startsWith('cotizaciones.') ||
            permission.startsWith('clientes.'),
        ),
      ).toBe(false);
    }
  });

  it('limits commercial draft edits to their creator and evaluates the actual migration seeds', () => {
    const commercial = INITIAL_RBAC_ROLES.find(
      ({ code }) => code === 'comercial',
    )!;
    const subject: AuthorizationSubject = {
      userId: 7,
      active: true,
      assignments: [
        {
          roleId: 300,
          scopeId: 2,
          active: true,
          roleActive: true,
          grants: commercial.grants.map((grant) => ({
            ...grant,
            active: true,
          })),
        },
      ],
    };
    const scopes = [
      { id: 1, parentId: null, kind: 'GLOBAL' as const, active: true },
      { id: 2, parentId: 1, kind: 'TEAM' as const, active: true },
    ];
    const policy = compileAuthorizationPolicy(
      subject,
      'cotizaciones.editar',
      scopes,
    );
    expect(canAccessResource(policy, { scopeId: 2, creatorId: 7 })).toBe(true);
    expect(canAccessResource(policy, { scopeId: 2, creatorId: 8 })).toBe(false);
    expect(
      canAccessResource(
        compileAuthorizationPolicy(subject, 'cotizaciones.emitir', scopes),
        { scopeId: 2 },
      ),
    ).toBe(false);
  });

  it('creates only RBAC tables/catalogs, without altering business data or assigning privileges to users', async () => {
    const statements: Array<{ sql: string; parameters?: unknown[] }> = [];
    const runner = {
      hasTable: vi.fn(async () => false),
      query: vi.fn(async (sql: string, parameters?: unknown[]) => {
        statements.push({ sql, parameters });
      }),
    };
    const migration = new AddScopedRbac1794096000000();
    await migration.up(runner as unknown as QueryRunner);
    expect(migration.transaction).toBe(false);
    const sql = statements.map(({ sql }) => sql).join('\n');
    expect(sql.match(/CREATE TABLE /g)).toHaveLength(7);
    expect(sql).not.toMatch(
      /ALTER TABLE|DROP TABLE|TRUNCATE|DELETE FROM|UPDATE usuarios|INSERT INTO usuarios/i,
    );
    expect(sql).not.toMatch(
      /INSERT INTO rbac_user_role_assignments|INSERT INTO rbac_platform_owner/i,
    );
    expect(sql).toContain('INSERT INTO rbac_scope_closure');
    expect(
      statements.filter(({ sql }) =>
        sql.startsWith('INSERT INTO rbac_permissions'),
      ),
    ).toHaveLength(INITIAL_RBAC_PERMISSIONS.length);
    expect(
      statements.filter(({ sql }) => sql.startsWith('INSERT INTO rbac_roles')),
    ).toHaveLength(INITIAL_RBAC_ROLES.length);
  });

  it('refuses partial/existing RBAC schemas before executing any DDL', async () => {
    const runner = {
      hasTable: vi.fn(async (name: string) => name === 'rbac_roles'),
      query: vi.fn(),
    };
    await expect(
      new AddScopedRbac1794096000000().up(runner as unknown as QueryRunner),
    ).rejects.toThrow(/preexistente/i);
    expect(runner.query).not.toHaveBeenCalled();
  });

  it('refuses destructive rollback before issuing any query', async () => {
    const runner = { query: vi.fn() };
    await expect(
      new AddScopedRbac1794096000000().down(runner as unknown as QueryRunner),
    ).rejects.toThrow(/eliminar/i);
    expect(runner.query).not.toHaveBeenCalled();
  });
});
