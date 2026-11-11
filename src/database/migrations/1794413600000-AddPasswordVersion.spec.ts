import type { QueryRunner } from 'typeorm';
import { AddPasswordVersion1794413600000 } from './1794413600000-AddPasswordVersion.js';
import { CreatePasswordResetTokens1794413660000 } from './1794413660000-CreatePasswordResetTokens.js';
import { DATABASE_MIGRATIONS } from '../migration-registry.js';

describe('password version and reset token migrations', () => {
  it('registers additive migrations in deployment order', () => {
    const versionIndex = DATABASE_MIGRATIONS.indexOf(AddPasswordVersion1794413600000);
    const tokenIndex = DATABASE_MIGRATIONS.indexOf(CreatePasswordResetTokens1794413660000);

    expect(versionIndex).toBeGreaterThanOrEqual(0);
    expect(tokenIndex).toBeGreaterThan(versionIndex);
  });

  it('initializes existing rows to version one without touching password hashes', async () => {
    const statements: string[] = [];
    const runner = {
      query: async (sql: string) => {
        statements.push(sql);
        return [];
      },
    } as unknown as QueryRunner;

    await new AddPasswordVersion1794413600000().up(runner);
    expect(statements).toEqual([
      'ALTER TABLE usuarios ADD COLUMN password_version INT NOT NULL DEFAULT 1',
      'UPDATE usuarios SET password_version = 1 WHERE password_version IS NULL',
    ]);
    expect(statements.join('\n')).not.toContain('password_hash');
  });

  it('can reverse the version column and reset-token schema independently', async () => {
    const versionStatements: string[] = [];
    const tokenStatements: string[] = [];
    const versionRunner = {
      query: async (sql: string) => { versionStatements.push(sql); return []; },
    } as unknown as QueryRunner;
    const tokenRunner = {
      query: async (sql: string) => { tokenStatements.push(sql); return []; },
    } as unknown as QueryRunner;

    await new AddPasswordVersion1794413600000().down(versionRunner);
    await new CreatePasswordResetTokens1794413660000().up(tokenRunner);
    await new CreatePasswordResetTokens1794413660000().down(tokenRunner);

    expect(versionStatements).toEqual(['ALTER TABLE usuarios DROP COLUMN password_version']);
    expect(tokenStatements[0]).toContain('CREATE TABLE password_reset_tokens');
    expect(tokenStatements[0]).toContain('UNIQUE KEY UQ_password_reset_tokens_hash');
    expect(tokenStatements[0]).toContain('ON DELETE CASCADE');
    expect(tokenStatements[1]).toBe('DROP TABLE password_reset_tokens');
    expect(tokenStatements.join('\n')).not.toMatch(/DROP TABLE usuarios|password_hash/);
  });
});
