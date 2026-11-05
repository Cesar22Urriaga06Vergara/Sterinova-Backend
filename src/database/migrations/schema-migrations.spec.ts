import { AddClienteDocumentFields1793813200000 } from './1793813200000-AddClienteDocumentFields.js';
import { CreateAuditoria1793813300000 } from './1793813300000-CreateAuditoria.js';
import { AddTemplateResponsible1793813400000 } from './1793813400000-AddTemplateResponsible.js';
import { AddPdfRendererVersion1793813500000 } from './1793813500000-AddPdfRendererVersion.js';
import { AddUsersAndCertificationSeals1793813600000 } from './1793813600000-AddUsersAndCertificationSeals.js';
import type { QueryRunner } from 'typeorm';

describe('document administration migrations', () => {
  it('adds optional Cliente document fields without connecting to a database', async () => {
    const query = vi.fn(async () => undefined);
    const migration = new AddClienteDocumentFields1793813200000();

    await migration.up({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenCalledWith(
      'ALTER TABLE clientes ADD cargo VARCHAR(255) NULL, ADD ciudad VARCHAR(120) NULL',
    );
  });

  it('creates the audit table with nullable actor and required event fields', async () => {
    const query = vi.fn(async () => undefined);
    const migration = new CreateAuditoria1793813300000();

    await migration.up({ query } as unknown as QueryRunner);

    const sql = query.mock.calls[0][0] as string;
    expect(sql).toContain('CREATE TABLE auditoria');
    expect(sql).toContain('usuario_id INT NULL');
    expect(sql).toContain('entidad VARCHAR(100) NOT NULL');
    expect(sql).toContain('entidad_id INT NOT NULL');
    expect(sql).toContain('detalle JSON NULL');
    expect(sql).toContain('REFERENCES usuarios(id) ON DELETE SET NULL');
  });

  it('backfills historical template owners before requiring the field', async () => {
    const query = vi.fn(async () => undefined);
    const migration = new AddTemplateResponsible1793813400000();

    await migration.up({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenCalledTimes(3);
    expect(query.mock.calls[1][0]).toContain(
      "SET responsable = 'Migración histórica'",
    );
    expect(query.mock.calls[2][0]).toContain('responsable VARCHAR(255) NOT NULL');
  });

  it('marks existing PDFs for one-time regeneration and permits only PDF metadata updates on certificates', async () => {
    const query = vi.fn(async () => undefined);
    const migration = new AddPdfRendererVersion1793813500000();

    await migration.up({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenCalledWith(
      'ALTER TABLE cotizaciones ADD pdf_renderer_version VARCHAR(50) NULL',
    );
    expect(query).toHaveBeenCalledWith(
      'ALTER TABLE certificados_esterilizacion ADD pdf_renderer_version VARCHAR(50) NULL',
    );
    expect(query).toHaveBeenCalledWith(
      'DROP TRIGGER IF EXISTS trg_certificados_esterilizacion_inmutables',
    );
    const trigger = query.mock.calls[3][0] as string;
    expect(trigger).toContain('OLD.estado = \'Aprobado\'');
    expect(trigger).toContain('OLD.snapshot_datos <=> NEW.snapshot_datos');
    expect(trigger).not.toContain('OLD.pdf_url <=> NEW.pdf_url');
    expect(trigger).not.toContain('OLD.hash_pdf <=> NEW.hash_pdf');
    expect(trigger).not.toContain('OLD.pdf_renderer_version');
  });

  it('adds the user profile, active flag, quote creator, and certification seal schema additively', async () => {
    const query = vi.fn(async () => undefined);
    const migration = new AddUsersAndCertificationSeals1793813600000();

    await migration.up({ query } as unknown as QueryRunner);

    const sql = query.mock.calls.map(([statement]) => statement).join('\n');
    expect(sql).toContain('ADD apellido VARCHAR(255) NULL');
    expect(sql).toContain('ADD activo TINYINT(1) NOT NULL DEFAULT 1');
    expect(sql).toContain('ADD creador_id INT NULL');
    expect(sql).toContain('CREATE TABLE sellos_certificacion');
    expect(sql).not.toMatch(/DROP TABLE|DELETE FROM usuarios|TRUNCATE/i);
  });
});
