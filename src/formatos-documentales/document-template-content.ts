import {
  quoteTemplates,
  type SeedFormat,
} from '../database/migrations/1793750400000-AddDocumentFormatVersioning.js';

export function getTemplateSeeds(): SeedFormat[] {
  const sourceByType: Record<string, string> = {
    INDUSTRIAL_ETO: 'ejemplos-formatos/FARMACEUTICO Y FABRICANTE.docx',
    INSTITUCIONAL_ETO: 'ejemplos-formatos/INSTITUCIONAL ETO.docx',
    INSTITUCIONAL_VAPOR: 'ejemplos-formatos/INSTITUCIONAL VAPOR.docx',
    INSUMOS: 'ejemplos-formatos/INSUMOS.docx',
    LAVANDERIA: 'ejemplos-formatos/LAVANDERIA FARMACEUTICA.docx',
  };
  return structuredClone(quoteTemplates).map((seed) => ({
    ...seed,
    configuracion_json: {
      ...seed.configuracion_json,
      source_file: sourceByType[seed.tipo_servicio ?? ''] ?? seed.configuracion_json.source_file,
    },
  }));
}
