import { describe, it, expect } from 'vitest';
import type { QueryRunner } from 'typeorm';
import {
  SeedBackendRoles1794312001000,
  BACKEND_ROLES,
  FUTURE_PERMISSIONS,
} from './1794312001000-SeedBackendRoles.js';
import { AddBackendRoleSchema1794312000000 } from './1794312000000-AddBackendRoleSchema.js';

describe('backend role phase 1', () => {
  it('seeds inactive profiles without assigning users or altering legacy grants', async () => {
    const statements: string[] = [];
    const runner = {
      query: async (sql: string) => {
        statements.push(sql);
        return [];
      },
    } as unknown as QueryRunner;
    await new SeedBackendRoles1794312001000().up(runner);
    expect(BACKEND_ROLES.map((r) => r.code)).toEqual(
      expect.arrayContaining([
        'gerente_general',
        'director_tecnico',
        'admin_comercial',
        'analista_calidad',
      ]),
    );
    expect(new Set(BACKEND_ROLES.map((r) => r.code)).size).toBe(
      BACKEND_ROLES.length,
    );
    expect(
      statements.some(
        (sql) => /INSERT INTO rbac_roles/.test(sql) && /0/.test(sql),
      ),
    ).toBe(true);
    expect(statements.join('\n')).not.toMatch(
      /(?:INSERT INTO|UPDATE|DELETE FROM) (?:usuarios|rbac_user_role_assignments|rbac_platform_owner)/,
    );
    expect(statements.join('\n')).not.toMatch(
      /UPDATE rbac_roles|DELETE FROM rbac_role_permissions/,
    );
    expect(FUTURE_PERMISSIONS).toContain('cotizaciones.aprobar_interna');
    for (const role of BACKEND_ROLES)
      expect(new Set(role.grants.map((g) => g.permission)).size).toBe(
        role.grants.length,
      );
  });
  it('adds nullable operational fields and restricts global standard assignments without triggers', async () => {
    const statements: string[] = [];
    const runner = {
      query: async (sql: string) => {
        statements.push(sql);
        return [];
      },
    } as unknown as QueryRunner;
    await new AddBackendRoleSchema1794312000000().up(runner);
    const sql = statements.join('\n');
    expect(sql).toContain('FK_rbac_assignment_global_eligibility');
    expect(sql).toContain(
      "scope_kind <> 'GLOBAL' OR role_global_assignable = 1",
    );
    expect(sql).toContain('aprobador_interno_id');
    expect(sql).toContain('NULL');
    expect(sql).not.toMatch(
      /CREATE TRIGGER|UPDATE cotizaciones|UPDATE ciclos_esterilizacion/,
    );
  });
});
