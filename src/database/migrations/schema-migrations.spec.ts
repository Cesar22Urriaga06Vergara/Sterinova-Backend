import { AddClienteDocumentFields1793813200000 } from './1793813200000-AddClienteDocumentFields.js';
import { CreateAuditoria1793813300000 } from './1793813300000-CreateAuditoria.js';
import { AddTemplateResponsible1793813400000 } from './1793813400000-AddTemplateResponsible.js';
import { AddPdfRendererVersion1793813500000 } from './1793813500000-AddPdfRendererVersion.js';
import { AddQuoteCommercialConditions1794500000000 } from './1794500000000-AddQuoteCommercialConditions.js';
import { AddActaEventsAndLogisticsFormats1794600000000 } from './1794600000000-AddActaEventsAndLogisticsFormats.js';
import { DATABASE_MIGRATIONS } from '../migration-registry.js';
import { AddUsersAndCertificationSeals1793813600000 } from './1793813600000-AddUsersAndCertificationSeals.js';
import { ExtendAuditoriaEvents1793813700000 } from './1793813700000-ExtendAuditoriaEvents.js';
import type { QueryRunner } from 'typeorm';

describe('document administration migrations', () => {
  it('registers the quote and logistics migrations in deployment order', () => {
    expect(
      DATABASE_MIGRATIONS.indexOf(AddQuoteCommercialConditions1794500000000),
    ).toBeGreaterThanOrEqual(0);
    expect(
      DATABASE_MIGRATIONS.indexOf(
        AddActaEventsAndLogisticsFormats1794600000000,
      ),
    ).toBeGreaterThan(
      DATABASE_MIGRATIONS.indexOf(AddQuoteCommercialConditions1794500000000),
    );
  });

  it('adds Acta event capture, a new delivery milestone, and pinned logistics formats without filling events from old orders', async () => {
    const query = vi.fn(async (sql: string) => {
      if (sql.startsWith('SELECT id FROM formatos_documentales')) return [];
      if (sql.startsWith('SELECT id FROM formato_versiones')) return [];
      if (sql.startsWith('INSERT INTO formatos_documentales')) return { insertId: 1 };
      if (sql.startsWith('INSERT INTO formato_versiones')) return { insertId: 1 };
      return undefined;
    });

    await new AddActaEventsAndLogisticsFormats1794600000000().up({
      query,
    } as unknown as QueryRunner);

    const statements = query.mock.calls.map(([statement]) => statement);
    expect(statements[0]).toContain("'ENTREGADO'");
    expect(
      statements.some((statement) =>
        statement.includes('CREATE TABLE ordenes_servicio_eventos'),
      ),
    ).toBe(true);
    expect(
      statements.some((statement) =>
        statement.includes('UQ_ordenes_servicio_evento_tipo'),
      ),
    ).toBe(true);
    expect(statements.filter((statement) =>
      statement.startsWith('INSERT INTO formatos_documentales'),
    )).toHaveLength(2);
    expect(statements.filter((statement) =>
      statement.startsWith('INSERT INTO formato_versiones'),
    )).toHaveLength(2);
    expect(statements.at(-1)).toContain(
      'SET formato_orden_version_id = ?, formato_acta_version_id = ?',
    );
    expect(statements.join('\n')).not.toContain('INSERT INTO ordenes_servicio_eventos');
  });

  it('refuses to roll back logistics history after events or Actas exist', async () => {
    const query = vi.fn(async (sql: string) => {
      if (sql.includes('ordenes_servicio_eventos')) return [{ total: 1 }];
      return [{ total: 0 }];
    });

    await expect(
      new AddActaEventsAndLogisticsFormats1794600000000().down({
        query,
      } as unknown as QueryRunner),
    ).rejects.toThrow(
      'No se puede revertir mientras existan eventos logísticos, actas emitidas u órdenes entregadas',
    );

    expect(
      query.mock.calls.some(([sql]) => String(sql).startsWith('DROP TABLE')),
    ).toBe(false);
    expect(
      query.mock.calls.some(([sql]) => String(sql).startsWith('ALTER TABLE')),
    ).toBe(false);
  });

  it('adds the six quote conditions independently and without backfilling legacy text', async () => {
    const query = vi.fn(async () => undefined);
    await new AddQuoteCommercialConditions1794500000000().up({
      query,
    } as unknown as QueryRunner);

    expect(query).toHaveBeenCalledWith(
      `ALTER TABLE cotizaciones
      ADD tiempo_despacho TEXT NULL,
      ADD transporte TEXT NULL,
      ADD forma_pago TEXT NULL,
      ADD validez_oferta TEXT NULL,
      ADD precio_incluye TEXT NULL,
      ADD precio_no_incluye TEXT NULL`,
    );
  });

  it('allows nullable entity ids and flexible audit action names', async () => {
    const query = vi.fn(async (sql: string) => {
      if (sql.includes('SELECT COUNT')) return [{ total: 0 }];
      return undefined;
    });
    const migration = new ExtendAuditoriaEvents1793813700000();

    await migration.up({ query } as unknown as QueryRunner);

    expect(query.mock.calls[0][0]).toContain('MODIFY accion VARCHAR(30) NOT NULL');
    expect(query.mock.calls[0][0]).toContain('MODIFY entidad_id INT NULL');
  });

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
