import type { MigrationInterface, QueryRunner } from 'typeorm';

const APPLICABILITY = [
  'COTIZACION:INDUSTRIAL_ETO',
  'COTIZACION:INSTITUCIONAL_ETO',
  'COTIZACION:INSTITUCIONAL_VAPOR',
  'COTIZACION:INSUMOS',
  'COTIZACION:LAVANDERIA',
  'COTIZACION:FARMACEUTICO',
  'COTIZACION:FABRICANTE',
  'CERTIFICADO',
  'ORDEN_SERVICIO',
  'ACTA_SERVICIO',
];

type FormatRow = {
  id: number;
  codigo: string;
  nombre: string;
  version: number;
  scope_id: number | null;
  renderer_key: string;
  configuracion_json: Record<string, unknown> | string;
};

function asJson(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') return JSON.parse(value) as Record<string, unknown>;
  return (value ?? {}) as Record<string, unknown>;
}

export class DynamicQuoteDocuments1796000000000 implements MigrationInterface {
  name = 'DynamicQuoteDocuments1796000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('sellos_certificacion', 'aplica_a') === false) {
      await queryRunner.query('ALTER TABLE sellos_certificacion ADD COLUMN aplica_a JSON NULL');
    }
    if (await queryRunner.hasColumn('formatos_documentales', 'cliente_id') === false) {
      await queryRunner.query('ALTER TABLE formatos_documentales ADD COLUMN cliente_id INT NULL');
      await queryRunner.query('ALTER TABLE formatos_documentales ADD CONSTRAINT FK_formatos_documentales_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT');
      await queryRunner.query('CREATE UNIQUE INDEX UQ_formatos_documentales_cliente_tipo ON formatos_documentales (cliente_id, tipo_documento, tipo_servicio)');
    }
    const codeIndex = await queryRunner.query("SELECT COUNT(*) AS total FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'formatos_documentales' AND INDEX_NAME = 'UQ_formatos_documentales_codigo'") as Array<{ total: number }>;
    if (Number(codeIndex[0]?.total ?? 0)) await queryRunner.query('ALTER TABLE formatos_documentales DROP INDEX UQ_formatos_documentales_codigo');
    await queryRunner.query('UPDATE sellos_certificacion SET aplica_a = ? WHERE aplica_a IS NULL', [JSON.stringify(APPLICABILITY)]);

    const institutional = await queryRunner.query(`
      SELECT f.id, f.codigo, f.nombre, v.version, v.scope_id, v.renderer_key, v.configuracion_json
      FROM formatos_documentales f JOIN formato_versiones v ON v.formato_id = f.id
      WHERE f.clave = 'COTIZACION_INSTITUCIONAL_ETO' AND v.es_vigente = 1
      LIMIT 1
    `) as FormatRow[];
    if (institutional[0]) {
      const source = institutional[0];
      const nextVersion = Number(source.version) + 1;
      const config = asJson(source.configuracion_json);
      config.version_label = String(nextVersion).padStart(2, '0');
      config.version_date = '2026-11-20';
      config.paragraphs = [
        'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización institucional con Óxido de Etileno (EtO) de Sterinova, orientado a atender requerimientos de esterilización de productos compatibles con este método. Nuestro servicio brinda una solución oportuna y confiable de acuerdo con las necesidades y condiciones particulares de cada cliente.',
        'A continuación, presentamos el alcance del servicio y las condiciones comerciales correspondientes a su solicitud.',
      ];
      await queryRunner.query('UPDATE formato_versiones SET es_vigente = 0 WHERE formato_id = ? AND es_vigente = 1', [source.id]);
      await queryRunner.query(`
        INSERT INTO formato_versiones (formato_id, version, responsable, estado, renderer_key, configuracion_json, fecha_version, es_vigente, scope_id)
        VALUES (?, ?, 'Administración documental', 'PUBLICADA', ?, ?, '2026-11-20', 1, ?)
      `, [source.id, nextVersion, source.renderer_key, JSON.stringify(config), source.scope_id]);
    }

    const existing = await queryRunner.query("SELECT id FROM formatos_documentales WHERE clave = 'COTIZACION_FARMACEUTICO_FABRICANTE'") as Array<{ id: number }>;
    if (!existing.length) {
      const [industrial] = await queryRunner.query(`
        SELECT f.id, v.scope_id, v.renderer_key, v.configuracion_json
        FROM formatos_documentales f JOIN formato_versiones v ON v.formato_id = f.id
        WHERE f.clave = 'COTIZACION_INDUSTRIAL_ETO' AND v.es_vigente = 1 LIMIT 1
      `) as FormatRow[];
      const inserted = await queryRunner.query(`
        INSERT INTO formatos_documentales (clave, tipo_documento, tipo_servicio, codigo, nombre)
        VALUES ('COTIZACION_FARMACEUTICO_FABRICANTE', 'COTIZACION', 'FARMACEUTICO', 'R-CM-07-1', 'FARMACÉUTICO Y FABRICANTE')
      `) as { insertId: number };
      const config = asJson(industrial?.configuracion_json);
      config.document_code = 'R-CM-07-1';
      config.title = 'ESTERILIZACIÓN INDUSTRIAL';
      config.subtitle = 'Cotización de Servicios';
      config.version_label = '04';
      config.version_date = '2026-09-17';
      config.source_file = 'docs/ejemplos-formatos/FARMACEUTICO Y FABRICANTE.docx';
      config.paragraphs = [
        'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización industrial con Óxido de Etileno (EtO) de Sterinova, dirigido al procesamiento de productos que requieren este método de esterilización. Nuestro servicio está orientado a brindar soluciones confiables y adaptadas a las características y necesidades de cada producto y proceso.',
        'A continuación, presentamos el alcance del servicio y las condiciones comerciales correspondientes a su solicitud.',
      ];
      await queryRunner.query(`
        INSERT INTO formato_versiones (formato_id, version, responsable, estado, renderer_key, configuracion_json, fecha_version, es_vigente, scope_id)
        VALUES (?, 4, 'Administración documental', 'PUBLICADA', ?, ?, '2026-09-17', 1, ?)
      `, [inserted.insertId, industrial?.renderer_key ?? 'cotizacion_v1', JSON.stringify(config), industrial?.scope_id ?? null]);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const shared = await queryRunner.query("SELECT id FROM formatos_documentales WHERE clave = 'COTIZACION_FARMACEUTICO_FABRICANTE'") as Array<{ id: number }>;
    if (shared[0]) {
      await queryRunner.query('DELETE FROM formato_versiones WHERE formato_id = ?', [shared[0].id]);
      await queryRunner.query('DELETE FROM formatos_documentales WHERE id = ?', [shared[0].id]);
    }
    if (await queryRunner.hasColumn('formatos_documentales', 'cliente_id')) {
      await queryRunner.query('ALTER TABLE formatos_documentales DROP FOREIGN KEY FK_formatos_documentales_cliente');
      await queryRunner.query('DROP INDEX UQ_formatos_documentales_cliente_tipo ON formatos_documentales');
      await queryRunner.query('ALTER TABLE formatos_documentales DROP COLUMN cliente_id');
    }
    if (await queryRunner.hasColumn('sellos_certificacion', 'aplica_a')) await queryRunner.query('ALTER TABLE sellos_certificacion DROP COLUMN aplica_a');
  }
}
