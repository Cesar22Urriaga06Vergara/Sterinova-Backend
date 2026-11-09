import type { QueryRunner } from 'typeorm';
import { ScopeQuotePilot1794096001000 } from './1794096001000-ScopeQuotePilot.js';

describe('quote pilot scope migration', () => {
  it('adds scope without inventing ownership, and limits the commercial template to OWN reads', async () => {
    const sql: string[] = [];
    const runner = {
      query: vi.fn(async (statement: string) => {
        sql.push(statement);
      }),
    };
    await new ScopeQuotePilot1794096001000().up(
      runner as unknown as QueryRunner,
    );
    const combined = sql.join('\n');
    expect(combined).toContain('ADD scope_id INT NULL');
    expect(combined).toContain(
      'FOREIGN KEY (scope_id) REFERENCES rbac_scopes(id)',
    );
    expect(combined).toContain("resource_access = 'OWN'");
    expect(combined).not.toMatch(
      /UPDATE cotizaciones|INSERT INTO usuarios|DROP TABLE|TRUNCATE/i,
    );
  });
});
