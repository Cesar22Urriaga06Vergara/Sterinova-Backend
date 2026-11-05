import { AddUsersAndCertificationSeals1793813600000 } from './1793813600000-AddUsersAndCertificationSeals.js';
import type { QueryRunner } from 'typeorm';

describe('user and certification seal migration', () => {
  it('adds nullable profile data, active status, a nullable quote creator, and the seal catalog without deleting records', async () => {
    const query = vi.fn(async () => undefined);
    const migration = new AddUsersAndCertificationSeals1793813600000();

    await migration.up({ query } as unknown as QueryRunner);

    const sql = query.mock.calls.map(([statement]) => statement).join('\n');
    expect(sql).toContain('ALTER TABLE usuarios');
    expect(sql).toContain('ADD apellido VARCHAR(255) NULL');
    expect(sql).toContain('ADD activo TINYINT(1) NOT NULL DEFAULT 1');
    expect(sql).toContain('ADD creador_id INT NULL');
    expect(sql).toContain('ON DELETE SET NULL');
    expect(sql).toContain('CREATE TABLE sellos_certificacion');
    expect(sql).not.toMatch(/DROP TABLE|DELETE FROM usuarios|TRUNCATE/i);
  });

  it('reverses only the columns, constraints, and table introduced by the migration', async () => {
    const query = vi.fn(async () => undefined);
    const migration = new AddUsersAndCertificationSeals1793813600000();

    await migration.down({ query } as unknown as QueryRunner);

    const sql = query.mock.calls.map(([statement]) => statement).join('\n');
    expect(sql).toContain('DROP TABLE sellos_certificacion');
    expect(sql).toContain('DROP COLUMN creador_id');
    expect(sql).toContain('DROP COLUMN activo');
    expect(sql).not.toMatch(/DROP TABLE usuarios|DROP TABLE cotizaciones/i);
  });
});
