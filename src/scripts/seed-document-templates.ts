import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DataSource } from 'typeorm';
import { AppDataSource } from '../database/data-source.js';
import { getTemplateSeeds } from '../formatos-documentales/document-template-content.js';
import { readDocxTemplate } from '../formatos-documentales/docx-template-reader.js';
import {
  EstadoVersionFormato,
  FormatoVersiones,
} from '../formatos-documentales/entities/formato-versiones.entity.js';
import {
  FormatosDocumentales,
  TipoDocumentoFormato,
} from '../formatos-documentales/entities/formatos-documentales.entity.js';
import type { SeedFormat } from '../database/migrations/1793750400000-AddDocumentFormatVersioning.js';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

function documentDateFromHeader(header: string, fallback: string): string {
  const date = header.match(/\b(\d{2})-(\d{2})-(\d{4})\b/);
  return date ? `${date[3]}-${date[2]}-${date[1]}` : fallback;
}

function templateTextFromDocx(seed: SeedFormat, paragraphs: string[]): string[] {
  const introduction = paragraphs.filter((paragraph) =>
    /^(En atenci[oó]n a su solicitud|A continuaci[oó]n, presentamos)/i.test(
      paragraph,
    ),
  );
  if (introduction.length < 2) {
    throw new Error(
      `El DOCX ${seed.configuracion_json.source_file} no contiene la introducción esperada`,
    );
  }

  if (seed.codigo === 'R-CM-07-2') {
    introduction[0] = introduction[0].replace(
      'servicio de esterilización institucional con vapor de Sterinova',
      'servicio de esterilización institucional con Óxido de Etileno (EtO) de Sterinova',
    );
  }
  return introduction;
}

export async function loadTemplateFromDocx(
  seed: SeedFormat,
  root = projectRoot,
): Promise<SeedFormat> {
  const sourceFile = seed.configuracion_json.source_file;
  if (typeof sourceFile !== 'string') {
    throw new Error(`El formato ${seed.codigo} no declara un DOCX de origen`);
  }
  const sourcePath = path.resolve(root, sourceFile);
  if (!sourcePath.startsWith(`${path.resolve(root)}${path.sep}`)) {
    throw new Error(`Ruta DOCX fuera del directorio de formatos: ${sourceFile}`);
  }

  const source = readDocxTemplate(await readFile(sourcePath));
  const fullText = [...source.paragraphs, source.headersAndFooters].join('\n');
  if (!fullText.includes(seed.codigo)) {
    throw new Error(`El DOCX fuente no contiene el código ${seed.codigo}`);
  }
  const versionLabel = source.headersAndFooters.match(
    /VERSI[ÓO]N:\s*0*(\d+)/i,
  )?.[1];
  if (versionLabel && Number(versionLabel) !== seed.version) {
    throw new Error(
      `La versión del DOCX ${seed.codigo} (${versionLabel}) no coincide con la versión declarada (${seed.version})`,
    );
  }

  const config = structuredClone(seed.configuracion_json);
  config.paragraphs = templateTextFromDocx(seed, source.paragraphs);
  config.version_date = documentDateFromHeader(
    source.headersAndFooters,
    seed.fecha_version,
  );
  const terms = Array.isArray(config.commercial_terms)
    ? config.commercial_terms.filter(
        (term): term is string =>
          typeof term === 'string' &&
          source.paragraphs.some((paragraph) =>
            paragraph.toLocaleUpperCase('es-CO').includes(term.toLocaleUpperCase('es-CO')),
          ),
      )
    : [];
  config.commercial_terms = terms;

  return { ...seed, configuracion_json: config };
}

export function shouldSyncDocxContent(
  existingConfiguration: Record<string, unknown>,
  seedConfiguration: Record<string, unknown>,
  state: EstadoVersionFormato,
): boolean {
  if (state !== EstadoVersionFormato.BORRADOR) return false;
  const existingParagraphs = existingConfiguration.paragraphs;
  const seedParagraphs = seedConfiguration.paragraphs;
  if (!Array.isArray(existingParagraphs) || !Array.isArray(seedParagraphs)) {
    return false;
  }
  if (JSON.stringify(existingParagraphs) === JSON.stringify(seedParagraphs)) {
    return true;
  }

  const text = existingParagraphs
    .filter((paragraph): paragraph is string => typeof paragraph === 'string')
    .join(' ');
  const documentCode = seedConfiguration.document_code;
  return (
    (documentCode === 'R-CM-07-2' && /institucional con vapor/i.test(text)) ||
    (documentCode === 'R-CM-07-3' &&
      /institucional con [ÓO]xido de etileno/i.test(text))
  );
}

export async function seedDocumentTemplates(
  dataSource: DataSource,
): Promise<{ created: number; updated: number; unchanged: number }> {
  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const seed of getTemplateSeeds()) {
    const prepared = await loadTemplateFromDocx(seed);
    await dataSource.transaction(async (manager) => {
      const formats = manager.getRepository(FormatosDocumentales);
      const versions = manager.getRepository(FormatoVersiones);
      let format = await formats.findOne({ where: { clave: prepared.clave } });
      if (!format) {
        const documentType = Object.values(TipoDocumentoFormato).find(
          (type) => type === prepared.tipo_documento,
        );
        if (!documentType) {
          throw new Error(`Tipo de documento inválido: ${prepared.tipo_documento}`);
        }
        format = await formats.save(
          formats.create({
            clave: prepared.clave,
            tipo_documento: documentType,
            tipo_servicio: prepared.tipo_servicio,
            codigo: prepared.codigo,
            nombre: prepared.nombre,
          }),
        );
      }

      const version = await versions.findOne({
        where: { formato_id: format.id, version: prepared.version },
      });
      if (!version) {
        await versions.save(
          versions.create({
            formato_id: format.id,
            version: prepared.version,
            estado: EstadoVersionFormato.BORRADOR,
            renderer_key: prepared.renderer_key,
            configuracion_json: prepared.configuracion_json,
            fecha_version: prepared.fecha_version,
            responsable: 'Área Comercial',
            es_vigente: false,
          }),
        );
        created += 1;
        return;
      }

      if (
        shouldSyncDocxContent(
          version.configuracion_json,
          seed.configuracion_json,
          version.estado,
        )
      ) {
        version.configuracion_json = {
          ...version.configuracion_json,
          paragraphs: prepared.configuracion_json.paragraphs,
          commercial_terms: prepared.configuracion_json.commercial_terms,
          version_date: prepared.configuracion_json.version_date,
        };
        await versions.save(version);
        updated += 1;
      } else {
        unchanged += 1;
      }
    });
  }

  return { created, updated, unchanged };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await AppDataSource.initialize();
    const result = await seedDocumentTemplates(AppDataSource);
    console.info('Carga de plantillas desde DOCX completada', result);
  } catch (error) {
    console.error('Falló la carga de plantillas desde DOCX', error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}
