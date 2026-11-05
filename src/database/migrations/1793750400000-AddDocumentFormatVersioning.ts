import type { MigrationInterface, QueryRunner } from 'typeorm';

export type SeedFormat = {
  clave: string;
  tipo_documento: 'COTIZACION' | 'CERTIFICADO';
  tipo_servicio: string | null;
  codigo: string;
  nombre: string;
  version: number;
  fecha_version: string;
  renderer_key: string;
  configuracion_json: Record<string, unknown>;
};

const FORMAT_CODE = 'R-AQ-09';
const CERTIFICATE_VERSION_DATE = '2024-11-25';
const CERTIFICATE_TRIGGER = 'trg_certificados_esterilizacion_inmutables';

const clientFields = [
  'CLIENTE',
  'NIT / C.C. / C.E. / OTRO',
  'CONTACTO',
  'CARGO',
  'TELÉFONO',
  'E-MAIL',
  'DIRECCIÓN',
  'CIUDAD',
];

const commercialTerms = [
  'TIEMPO DE DESPACHO',
  'TRANSPORTE',
  'FORMA DE PAGO',
  'VALIDEZ DE LA OFERTA',
  'EL PRECIO INCLUYE',
  'EL PRECIO NO INCLUYE',
];

const quoteSignatures = [
  {
    label: 'Realizó',
    name: 'Juan José Hernández',
    role: 'Analista Comercial',
    phone: '317 718 3115',
    email: 'comercial1@sterinova.co',
  },
  {
    label: 'Aprobó',
    name: 'Ing. Daniel Riveros',
    role: 'Subgerente Comercial',
    phone: '318 338 8210',
    email: 'daniel.riveros@sterinova.co',
  },
];

const quoteBranding = {
  font_family: 'Open Sans',
  watermark: true,
  logo_asset: 'Logo1.png',
  certification_asset: 'certificaciones-icontec-iqnet.jpeg',
};

export const quoteTemplates: SeedFormat[] = [
  {
    clave: 'COTIZACION_INDUSTRIAL_ETO',
    tipo_documento: 'COTIZACION',
    tipo_servicio: 'INDUSTRIAL_ETO',
    codigo: 'R-CM-07-1',
    nombre: 'ESTERILIZACIÓN INDUSTRIAL',
    version: 4,
    fecha_version: '2026-09-17',
    renderer_key: 'cotizacion_v1',
    configuracion_json: {
      source_file:
        'docs/ejemplos-formatos/R-CM-07-1 COTIZACION ESTERILIZACION INDUSTRIAL V4 17-09-2026.docx',
      document_code: 'R-CM-07-1',
      title: 'ESTERILIZACIÓN INDUSTRIAL',
      subtitle: 'Cotización de Servicios',
      version_label: '04',
      version_date: '2026-09-17',
      branding: {
        ...quoteBranding,
        accent: '#008000',
        watermark_source:
          'docs/ejemplos-formatos/R-CM-07-1 COTIZACION ESTERILIZACION INDUSTRIAL V4 17-09-2026.docx#word/media/image10.png',
      },
      nit_label: 'NIT / C.C. / C.E. / OTRO',
      client_fields: clientFields,
      paragraphs: [
        'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización industrial con Óxido de Etileno (EtO) de Sterinova, dirigido al procesamiento de productos que requieren este método de esterilización. Nuestro servicio está orientado a brindar soluciones confiables y adaptadas a las características y necesidades de cada producto y proceso.',
        'A continuación, presentamos el alcance del servicio y las condiciones comerciales correspondientes a su solicitud.',
      ],
      detail: {
        title: 'DETALLE DE COTIZACIÓN:',
        columns: ['DESCRIPCIÓN', 'CANTIDAD', 'VALOR UNITARIO', 'VALOR TOTAL'],
        pricing_note: 'Precios antes de IVA (19%).',
      },
      commercial_terms: commercialTerms,
      signatures: quoteSignatures,
    },
  },
  {
    clave: 'COTIZACION_INSTITUCIONAL_ETO',
    tipo_documento: 'COTIZACION',
    tipo_servicio: 'INSTITUCIONAL_ETO',
    codigo: 'R-CM-07-2',
    nombre: 'ESTERILIZACIÓN INSTITUCIONAL EtO',
    version: 4,
    fecha_version: '2026-09-17',
    renderer_key: 'cotizacion_v1',
    configuracion_json: {
      source_file:
        'docs/ejemplos-formatos/R-CM-07-2 COTIZACION ESTERILIZACION INSTITUCIONAL ETO V4 17-09-2026.docx',
      document_code: 'R-CM-07-2',
      title: 'ESTERILIZACIÓN INSTITUCIONAL EtO',
      subtitle: 'Cotización de Servicios',
      version_label: '04',
      version_date: '2026-09-17',
      branding: {
        ...quoteBranding,
        accent: '#365F91',
        watermark_source:
          'docs/ejemplos-formatos/R-CM-07-2 COTIZACION ESTERILIZACION INSTITUCIONAL ETO V4 17-09-2026.docx#word/media/image10.png',
      },
      nit_label: 'NIT / C.C. / C.E. / OTRO:',
      client_fields: clientFields,
      paragraphs: [
        'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización institucional con Óxido de Etileno (EtO) de Sterinova, orientado a atender requerimientos de esterilización de productos compatibles con este método, especialmente en situaciones de contingencia. Nuestro servicio busca brindar una solución oportuna y confiable, de acuerdo con las necesidades y condiciones particulares de cada cliente.',
        'A continuación, presentamos el alcance del servicio y las condiciones comerciales correspondientes a su solicitud.',
      ],
      detail: {
        title: 'DETALLE DE COTIZACIÓN:',
        columns: ['DESCRIPCIÓN', 'CANTIDAD', 'VALOR UNITARIO', 'VALOR TOTAL'],
        pricing_note: 'Precios antes de IVA (19%).',
      },
      commercial_terms: commercialTerms,
      signatures: quoteSignatures,
    },
  },
  {
    clave: 'COTIZACION_INSTITUCIONAL_VAPOR',
    tipo_documento: 'COTIZACION',
    tipo_servicio: 'INSTITUCIONAL_VAPOR',
    codigo: 'R-CM-07-3',
    nombre: 'ESTERILIZACIÓN INSTITUCIONAL VAPOR',
    version: 4,
    fecha_version: '2026-09-17',
    renderer_key: 'cotizacion_v1',
    configuracion_json: {
      source_file:
        'docs/ejemplos-formatos/R-CM-07-3 COTIZACION ESTERILIZACION INSTITUCIONAL VAPOR V4 17-09-2026.docx',
      document_code: 'R-CM-07-3',
      title: 'ESTERILIZACIÓN INSTITUCIONAL VAPOR',
      subtitle: 'Cotización de Servicios',
      version_label: '04',
      version_date: '2026-09-17',
      branding: {
        ...quoteBranding,
        accent: '#00B0F0',
        watermark_source:
          'docs/ejemplos-formatos/R-CM-07-3 COTIZACION ESTERILIZACION INSTITUCIONAL VAPOR V4 17-09-2026.docx#word/media/image10.png',
      },
      nit_label: 'NIT / C.C. / C.E. / OTRO:',
      client_fields: clientFields,
      paragraphs: [
        'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización institucional con vapor de Sterinova, orientado a atender requerimientos de esterilización de productos compatibles con este método, especialmente en situaciones de contingencia. Nuestro servicio busca brindar una solución oportuna y confiable, de acuerdo con las necesidades y condiciones particulares de cada cliente.',
        'A continuación, presentamos el alcance del servicio y las condiciones comerciales correspondientes a su solicitud.',
      ],
      detail: {
        title: 'DETALLE DE COTIZACIÓN:',
        columns: ['DESCRIPCIÓN', 'CANTIDAD', 'VALOR UNITARIO', 'VALOR TOTAL'],
        pricing_note: 'Precios antes de IVA (19%).',
      },
      commercial_terms: commercialTerms,
      signatures: quoteSignatures,
    },
  },
  {
    clave: 'COTIZACION_INSUMOS',
    tipo_documento: 'COTIZACION',
    tipo_servicio: 'INSUMOS',
    codigo: 'R-CM-07-4',
    nombre: 'VENTA DE INSUMOS',
    version: 4,
    fecha_version: '2026-09-17',
    renderer_key: 'cotizacion_v1',
    configuracion_json: {
      source_file:
        'docs/ejemplos-formatos/R-CM-07-4 COTIZACION INSUMOS V4 17-09-2026.docx',
      document_code: 'R-CM-07-4',
      title: 'VENTA DE INSUMOS',
      subtitle: 'Cotización de insumos',
      version_label: '04',
      version_date: '2026-09-17',
      branding: {
        ...quoteBranding,
        accent: '#4472C4',
        watermark_source:
          'docs/ejemplos-formatos/R-CM-07-4 COTIZACION INSUMOS V4 17-09-2026.docx#word/media/image18.png',
      },
      nit_label: 'NIT / C.C. / C.E. / OTRO:',
      client_fields: clientFields,
      paragraphs: [
        'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente a la línea de venta de insumos de Sterinova, especializada en soluciones para procesos de esterilización y monitoreo.',
        'A continuación, presentamos los productos y condiciones comerciales correspondientes a su solicitud.',
      ],
      product_sections: [
        'EMPAQUES PARA ESTERILIZACIÓN',
        'MONITOREO ESTERILIZACIÓN',
        'EQUIPOS APOYO TECNOLÓGICO',
      ],
      detail: {
        columns: ['CÓDIGO', 'REFERENCIA / DESCRIPCIÓN', 'PRESENTACIÓN', 'PRECIO'],
        pricing_note: 'Adicionar el valor del IVA (19%).',
      },
      commercial_terms: commercialTerms,
      signatures: quoteSignatures,
    },
  },
  {
    clave: 'COTIZACION_LAVANDERIA',
    tipo_documento: 'COTIZACION',
    tipo_servicio: 'LAVANDERIA',
    codigo: 'R-CM-07-5',
    nombre: 'LAVANDERÍA DOTACIÓN FARMACÉUTICA',
    version: 4,
    fecha_version: '2026-09-17',
    renderer_key: 'cotizacion_v1',
    configuracion_json: {
      source_file:
        'docs/ejemplos-formatos/R-CM-07-5 LAVANDERIA FARMACEUTICA V4 17-09-2026.docx',
      document_code: 'R-CM-07-5',
      title: 'LAVANDERÍA DOTACIÓN FARMACÉUTICA',
      subtitle: 'Cotización de Servicios',
      version_label: '04',
      version_date: '2026-09-17',
      branding: {
        ...quoteBranding,
        accent: '#990099',
        watermark_source:
          'docs/ejemplos-formatos/R-CM-07-5 LAVANDERIA FARMACEUTICA V4 17-09-2026.docx#word/media/image10.png',
      },
      nit_label: 'NIT / C.C. / C.E. / OTRO:',
      client_fields: clientFields,
      paragraphs: [
        'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de lavandería de dotación farmacéutica de Sterinova, orientado al lavado y acondicionamiento de prendas y elementos utilizados en ambientes farmacéuticos y áreas que requieren condiciones especiales de procesamiento.',
        'A continuación, presentamos el alcance del servicio y las condiciones comerciales correspondientes a su solicitud.',
      ],
      detail: {
        title: 'DETALLE DE COTIZACIÓN:',
        columns: ['DESCRIPCIÓN', 'CANTIDAD', 'VALOR UNITARIO', 'VALOR TOTAL'],
        pricing_note: 'Precios antes de IVA (19%).',
      },
      commercial_terms: commercialTerms,
      signatures: quoteSignatures,
    },
  },
];

const certificateTemplate: SeedFormat = {
  clave: 'CERTIFICADO_ESTERILIZACION',
  tipo_documento: 'CERTIFICADO',
  tipo_servicio: null,
  codigo: FORMAT_CODE,
  nombre: 'CERTIFICADO DE ESTERILIZACIÓN',
  version: 5,
  fecha_version: CERTIFICATE_VERSION_DATE,
  renderer_key: 'certificado_v5',
  configuracion_json: {
    source: 'frontend_sterinova/src/components/pdf/CertificadoPDF.tsx',
    document_code: FORMAT_CODE,
    title: 'CERTIFICADO DE ESTERILIZACIÓN',
    version_label: '05',
    version_date: CERTIFICATE_VERSION_DATE,
    page: { size: 'LETTER', orientation: 'portrait' },
    branding: {
      font_family: 'Arial',
      logo_asset: 'Logo1.png',
      certification_asset: 'certificaciones-icontec-iqnet.jpeg',
    },
    sections: [
      'FECHA DE EMISIÓN',
      'CLIENTE / NIT',
      'CONSECUTIVO',
      'MÉTODO DE ESTERILIZACIÓN',
      'EQUIPO',
      'CICLO',
      'PARÁMETROS DEL PROCESO',
      'RESULTADOS',
      'VALIDACIÓN',
      'FIRMAS',
    ],
    signatures: {
      elaborated_by: 'N. FUENTES',
      elaborated_by_role: 'AUXILIAR DE DOCUMENTACIÓN',
      verified_by: 'Y. MELO',
      verified_by_role: 'COORDINADOR ASEGURAMIENTO DE CALIDAD',
      approved_by_fallback: 'J. BARRERO',
      approved_by_role: 'DIRECTOR TÉCNICO',
    },
  },
};

function toIsoDate(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function parseJson(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function insertFormat(queryRunner: QueryRunner, seed: SeedFormat) {
  const existingFormats: Array<{ id: number }> = await queryRunner.query(
    'SELECT id FROM formatos_documentales WHERE clave = ?',
    [seed.clave],
  );
  let formatId = Number(existingFormats[0]?.id ?? 0);
  if (!formatId) {
    const insertedFormat = (await queryRunner.query(
      `INSERT INTO formatos_documentales
        (clave, tipo_documento, tipo_servicio, codigo, nombre)
       VALUES (?, ?, ?, ?, ?)`,
      [seed.clave, seed.tipo_documento, seed.tipo_servicio, seed.codigo, seed.nombre],
    )) as { insertId: number };
    formatId = Number(insertedFormat.insertId);
  }

  const existingVersions: Array<{ id: number }> = await queryRunner.query(
    'SELECT id FROM formato_versiones WHERE formato_id = ? AND version = ?',
    [formatId, seed.version],
  );
  let versionId = Number(existingVersions[0]?.id ?? 0);
  if (!versionId) {
    const insertedVersion = (await queryRunner.query(
      `INSERT INTO formato_versiones
        (formato_id, version, estado, renderer_key, configuracion_json, fecha_version, es_vigente)
       VALUES (?, ?, 'PUBLICADA', ?, ?, ?, 1)`,
      [
        formatId,
        seed.version,
        seed.renderer_key,
        JSON.stringify(seed.configuracion_json),
        seed.fecha_version,
      ],
    )) as { insertId: number };
    versionId = Number(insertedVersion.insertId);
  }

  return { formatId, versionId };
}

async function ensureColumn(
  queryRunner: QueryRunner,
  table: string,
  column: string,
  definition: string,
) {
  if (!(await queryRunner.hasColumn(table, column))) {
    await queryRunner.query(`ALTER TABLE ${table} ADD ${column} ${definition}`);
  }
}

async function ensureIndex(
  queryRunner: QueryRunner,
  table: string,
  indexName: string,
  definition: string,
) {
  const indexes: Array<{ total: number }> = await queryRunner.query(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, indexName],
  );
  if (Number(indexes[0]?.total ?? 0) === 0) {
    await queryRunner.query(`ALTER TABLE ${table} ADD ${definition}`);
  }
}

async function ensureForeignKey(
  queryRunner: QueryRunner,
  table: string,
  foreignKeyName: string,
  definition: string,
) {
  const constraints: Array<{ total: number }> = await queryRunner.query(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
     WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = ?
       AND CONSTRAINT_NAME = ? AND CONSTRAINT_TYPE = 'FOREIGN KEY'`,
    [table, foreignKeyName],
  );
  if (Number(constraints[0]?.total ?? 0) === 0) {
    await queryRunner.query(`ALTER TABLE ${table} ADD ${definition}`);
  }
}

async function restoreCertificateImmutabilityTrigger(queryRunner: QueryRunner) {
  await queryRunner.query(`
    CREATE TRIGGER ${CERTIFICATE_TRIGGER}
    BEFORE UPDATE ON certificados_esterilizacion
    FOR EACH ROW
    BEGIN
      IF OLD.estado = 'Aprobado' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Los certificados aprobados son inmutables';
      END IF;
    END
  `);
}

export class AddDocumentFormatVersioning1793750400000 implements MigrationInterface {
  name = 'AddDocumentFormatVersioning1793750400000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS ${CERTIFICATE_TRIGGER}`);
    try {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS formatos_documentales (
          id INT NOT NULL AUTO_INCREMENT,
          clave VARCHAR(100) NOT NULL,
          tipo_documento VARCHAR(32) NOT NULL,
          tipo_servicio VARCHAR(80) NULL,
          codigo VARCHAR(80) NOT NULL,
          nombre VARCHAR(255) NOT NULL,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          UNIQUE KEY UQ_formatos_documentales_clave (clave),
          UNIQUE KEY UQ_formatos_documentales_codigo (codigo)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS formato_versiones (
          id INT NOT NULL AUTO_INCREMENT,
          formato_id INT NOT NULL,
          version INT NOT NULL,
          estado VARCHAR(24) NOT NULL,
          renderer_key VARCHAR(100) NOT NULL,
          configuracion_json JSON NOT NULL,
          fecha_version DATE NULL,
          es_vigente TINYINT(1) NOT NULL DEFAULT 0,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          UNIQUE KEY UQ_formato_versiones_formato_version (formato_id, version),
          UNIQUE KEY UQ_formato_versiones_id_formato (id, formato_id),
          KEY IDX_formato_versiones_vigencia (formato_id, estado, es_vigente),
          CONSTRAINT FK_formato_versiones_formato FOREIGN KEY (formato_id)
            REFERENCES formatos_documentales(id) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS formato_asignaciones_cliente (
          id INT NOT NULL AUTO_INCREMENT,
          cliente_id INT NOT NULL,
          formato_id INT NOT NULL,
          version_formato_id INT NOT NULL,
          activa TINYINT(1) NOT NULL DEFAULT 1,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          UNIQUE KEY UQ_formato_asignaciones_cliente_formato (cliente_id, formato_id),
          KEY IDX_formato_asignaciones_formato_version (version_formato_id, formato_id),
          CONSTRAINT FK_formato_asignaciones_cliente_cliente FOREIGN KEY (cliente_id)
            REFERENCES clientes(id) ON DELETE RESTRICT,
          CONSTRAINT FK_formato_asignaciones_cliente_formato FOREIGN KEY (formato_id)
            REFERENCES formatos_documentales(id) ON DELETE RESTRICT,
          CONSTRAINT FK_formato_asignaciones_cliente_version FOREIGN KEY (version_formato_id, formato_id)
            REFERENCES formato_versiones(id, formato_id) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);

      for (const table of ['cotizaciones', 'certificados_esterilizacion']) {
        await ensureColumn(queryRunner, table, 'version_formato_id', 'INT NULL');
        await ensureColumn(queryRunner, table, 'snapshot_datos', 'JSON NULL');
        await ensureColumn(queryRunner, table, 'pdf_url', 'VARCHAR(1024) NULL');
        await ensureColumn(queryRunner, table, 'hash_pdf', 'CHAR(64) NULL');
        await ensureColumn(queryRunner, table, 'fecha_emision', 'DATETIME NULL');
      }
      await ensureIndex(
        queryRunner,
        'cotizaciones',
        'IDX_cotizaciones_version_formato',
        'KEY IDX_cotizaciones_version_formato (version_formato_id)',
      );
      await ensureForeignKey(
        queryRunner,
        'cotizaciones',
        'FK_cotizaciones_version_formato',
        `CONSTRAINT FK_cotizaciones_version_formato FOREIGN KEY (version_formato_id)
         REFERENCES formato_versiones(id) ON DELETE RESTRICT`,
      );
      await ensureIndex(
        queryRunner,
        'certificados_esterilizacion',
        'IDX_certificados_version_formato',
        'KEY IDX_certificados_version_formato (version_formato_id)',
      );
      await ensureForeignKey(
        queryRunner,
        'certificados_esterilizacion',
        'FK_certificados_version_formato',
        `CONSTRAINT FK_certificados_version_formato FOREIGN KEY (version_formato_id)
         REFERENCES formato_versiones(id) ON DELETE RESTRICT`,
      );

      for (const seed of quoteTemplates) {
        await insertFormat(queryRunner, seed);
      }
      const { versionId: certificateVersionId } = await insertFormat(
        queryRunner,
        certificateTemplate,
      );

      const legacyCertificateRows: Array<Record<string, unknown>> =
        await queryRunner.query(`
          SELECT
            cert.id AS certificate_id,
            cert.consecutivo AS certificate_number,
            cert.token_publico AS certificate_token,
            cert.equipo AS certificate_equipment,
            cert.ciclo AS certificate_cycle,
            cert.parametros_tecnicos AS certificate_parameters,
            cert.controles_biologicos AS certificate_biological_controls,
            cert.aprobado_at AS certificate_approved_at,
            cert.created_at AS certificate_created_at,
            approved_user.nombre AS approver_name,
            cycle.id AS cycle_id,
            cycle.metodo AS cycle_method,
            cycle.equipo AS cycle_equipment,
            cycle.temperatura AS cycle_temperature,
            cycle.humedad AS cycle_humidity,
            cycle.presion AS cycle_pressure,
            cycle.tiempo_exposicion AS cycle_exposure_time,
            cycle.tiempo_aireacion AS cycle_aeration_time,
            cycle.control_biologico AS cycle_biological_control,
            cycle.control_quimico AS cycle_chemical_control,
            cycle.fecha_proceso AS cycle_processed_at,
            service_order.consecutivo AS service_order_number,
            quote.consecutivo AS quote_number,
            quote.subtotal AS quote_subtotal,
            quote.iva AS quote_iva,
            quote.total AS quote_total,
            quote.condiciones_comerciales AS quote_conditions,
            client.razon_social AS client_name,
            client.nit AS client_tax_id,
            client.contacto AS client_contact,
            client.telefono AS client_phone,
            client.email AS client_email,
            client.direccion AS client_address,
            quote_item.id AS quote_item_id,
            quote_item.descripcion AS quote_item_description,
            quote_item.cantidad AS quote_item_quantity,
            quote_item.valor_unitario AS quote_item_unit_price,
            quote_item.valor_total AS quote_item_total
          FROM certificados_esterilizacion cert
          INNER JOIN ciclos_esterilizacion cycle ON cycle.id = cert.ciclo_id
          LEFT JOIN ordenes_servicio service_order ON service_order.id = cycle.orden_id
          LEFT JOIN cotizaciones quote ON quote.id = service_order.cotizacion_id
          LEFT JOIN clientes client ON client.id = quote.cliente_id
          LEFT JOIN usuarios approved_user ON approved_user.id = cert.aprobador_id
          LEFT JOIN cotizacion_items quote_item ON quote_item.cotizacion_id = quote.id
        `);

      const legacyCertificates = new Map<
        number,
        { row: Record<string, unknown>; quoteItems: Record<string, unknown>[] }
      >();
      for (const row of legacyCertificateRows) {
        const certificateId = Number(row.certificate_id);
        let certificate = legacyCertificates.get(certificateId);
        if (!certificate) {
          certificate = { row, quoteItems: [] };
          legacyCertificates.set(certificateId, certificate);
        }
        if (row.quote_item_id !== null && row.quote_item_id !== undefined) {
          certificate.quoteItems.push({
            id: row.quote_item_id,
            descripcion: row.quote_item_description,
            cantidad: row.quote_item_quantity,
            valor_unitario: row.quote_item_unit_price,
            valor_total: row.quote_item_total,
          });
        }
      }

      for (const { row, quoteItems } of legacyCertificates.values()) {
        const issuedAt = row.certificate_approved_at ?? row.certificate_created_at;
        const snapshot = {
          origen_snapshot: 'RECONSTRUIDO_MIGRACION',
          documento: {
            tipo: 'CERTIFICADO',
            consecutivo: row.certificate_number,
            codigo_formato: FORMAT_CODE,
            version_formato: 5,
            fecha_version: CERTIFICATE_VERSION_DATE,
            fecha_emision: toIsoDate(issuedAt),
            token_publico: row.certificate_token,
            aprobador: row.approver_name ?? null,
          },
          cliente: {
            razon_social: row.client_name ?? null,
            nit: row.client_tax_id ?? null,
            contacto: row.client_contact ?? null,
            cargo: null,
            telefono: row.client_phone ?? null,
            email: row.client_email ?? null,
            direccion: row.client_address ?? null,
            ciudad: null,
          },
          certificado: {
            equipo: row.certificate_equipment ?? null,
            ciclo: row.certificate_cycle ?? null,
            controles_biologicos: row.certificate_biological_controls ?? null,
            parametros_tecnicos: parseJson(row.certificate_parameters) ?? null,
          },
          orden_servicio: {
            consecutivo: row.service_order_number ?? null,
          },
          cotizacion: {
            consecutivo: row.quote_number ?? null,
            subtotal: row.quote_subtotal ?? null,
            iva: row.quote_iva ?? null,
            total: row.quote_total ?? null,
            condiciones_comerciales: row.quote_conditions ?? null,
            items: quoteItems,
          },
          ciclo_esterilizacion: {
            id: row.cycle_id,
            metodo: row.cycle_method,
            equipo: row.cycle_equipment,
            temperatura: row.cycle_temperature,
            humedad: row.cycle_humidity,
            presion: row.cycle_pressure,
            tiempo_exposicion: row.cycle_exposure_time,
            tiempo_aireacion: row.cycle_aeration_time,
            control_biologico: row.cycle_biological_control,
            control_quimico: row.cycle_chemical_control,
            fecha_proceso: toIsoDate(row.cycle_processed_at),
          },
        };

        await queryRunner.query(
          `UPDATE certificados_esterilizacion
           SET version_formato_id = ?, snapshot_datos = ?, fecha_emision = ?
           WHERE id = ?`,
          [certificateVersionId, JSON.stringify(snapshot), issuedAt, row.certificate_id],
        );
      }

      // The templates are seeded as published versions; client overrides start empty.
    } finally {
      await restoreCertificateImmutabilityTrigger(queryRunner);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const references: Array<{ total: number }> = await queryRunner.query(`
      SELECT (
        (SELECT COUNT(*) FROM formato_asignaciones_cliente) +
        (SELECT COUNT(*) FROM cotizaciones WHERE version_formato_id IS NOT NULL) +
        (SELECT COUNT(*) FROM certificados_esterilizacion WHERE version_formato_id IS NOT NULL)
      ) AS total
    `);
    if (Number(references[0]?.total ?? 0) > 0) {
      throw new Error(
        'No se revierte el versionado de formatos mientras existan asignaciones o documentos vinculados.',
      );
    }

    await queryRunner.query(`
      ALTER TABLE cotizaciones
        DROP FOREIGN KEY FK_cotizaciones_version_formato,
        DROP INDEX IDX_cotizaciones_version_formato,
        DROP COLUMN version_formato_id,
        DROP COLUMN snapshot_datos,
        DROP COLUMN pdf_url,
        DROP COLUMN hash_pdf,
        DROP COLUMN fecha_emision
    `);
    await queryRunner.query(`
      ALTER TABLE certificados_esterilizacion
        DROP FOREIGN KEY FK_certificados_version_formato,
        DROP INDEX IDX_certificados_version_formato,
        DROP COLUMN version_formato_id,
        DROP COLUMN snapshot_datos,
        DROP COLUMN pdf_url,
        DROP COLUMN hash_pdf,
        DROP COLUMN fecha_emision
    `);
    await queryRunner.query('DROP TABLE formato_asignaciones_cliente');
    await queryRunner.query('DROP TABLE formato_versiones');
    await queryRunner.query('DROP TABLE formatos_documentales');
  }
}
