import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getTemplateSeeds } from './document-template-content.js';
import { readDocxTemplate } from './docx-template-reader.js';
import {
  loadTemplateFromDocx,
  shouldSyncDocxContent,
} from '../scripts/seed-document-templates.js';
import { EstadoVersionFormato } from './entities/formato-versiones.entity.js';

describe('readDocxTemplate', () => {
  it('extracts text and version metadata from the R-CM-07-5 source DOCX', async () => {
    const sourcePath = path.resolve(
      process.cwd(),
      'docs/ejemplos-formatos/R-CM-07-5 LAVANDERIA FARMACEUTICA V4 17-09-2026.docx',
    );
    const source = await readFile(sourcePath);

    const document = readDocxTemplate(source);

    expect(document.paragraphs.join(' ')).toContain(
      'servicio de lavandería de dotación farmacéutica',
    );
    expect(document.headersAndFooters).toContain('R-CM-07-5');
    expect(document.headersAndFooters).toContain('VERSIÓN: 04');
    expect(document.headersAndFooters).toContain('17-09-2026');
  });

  it('loads all five templates from DOCX and corrects the EtO introduction erratum', async () => {
    const seeds = getTemplateSeeds();
    const loaded = await Promise.all(
      seeds.map((seed) => loadTemplateFromDocx(seed)),
    );

    expect(loaded.map(({ codigo }) => codigo)).toEqual([
      'R-CM-07-1',
      'R-CM-07-2',
      'R-CM-07-3',
      'R-CM-07-4',
      'R-CM-07-5',
    ]);
    const etoParagraphs = loaded[1].configuracion_json.paragraphs;
    const etoText = Array.isArray(etoParagraphs)
      ? etoParagraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string').join(' ')
      : '';
    expect(etoText).toContain('Óxido de Etileno (EtO)');
    expect(etoText).not.toMatch(/institucional con vapor/i);
    expect(loaded[4].configuracion_json).toMatchObject({
      document_code: 'R-CM-07-5',
      version_label: '04',
      version_date: '2026-09-17',
    });
  });

  it('uses the DOCX introduction for the steam template', async () => {
    const seed = getTemplateSeeds()[2];
    const loaded = await loadTemplateFromDocx(seed);
    const paragraphs = loaded.configuracion_json.paragraphs;
    const text = Array.isArray(paragraphs)
      ? paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string').join(' ')
      : '';

    expect(text).toMatch(/institucional con vapor/i);
    expect(text).not.toMatch(/institucional con [ÓO]xido de etileno/i);
  });

  it('refreshes only untouched drafts or the two known source-copy errors', () => {
    const seeds = getTemplateSeeds();
    const vaporSeed = seeds[2].configuracion_json;
    const etoSeed = seeds[1].configuracion_json;

    expect(
      shouldSyncDocxContent(
        vaporSeed,
        vaporSeed,
        EstadoVersionFormato.BORRADOR,
      ),
    ).toBe(true);
    expect(
      shouldSyncDocxContent(
        {
          ...vaporSeed,
          paragraphs: ['Texto editado por el responsable'],
        },
        vaporSeed,
        EstadoVersionFormato.BORRADOR,
      ),
    ).toBe(false);
    expect(
      shouldSyncDocxContent(
        {
          paragraphs: ['servicio de esterilización institucional con vapor'],
        },
        etoSeed,
        EstadoVersionFormato.BORRADOR,
      ),
    ).toBe(true);
    expect(
      shouldSyncDocxContent(
        vaporSeed,
        vaporSeed,
        EstadoVersionFormato.PUBLICADA,
      ),
    ).toBe(false);
  });
});
