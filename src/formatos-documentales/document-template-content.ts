import {
  quoteTemplates,
  type SeedFormat,
} from '../database/migrations/1793750400000-AddDocumentFormatVersioning.js';

export function getTemplateSeeds(): SeedFormat[] {
  return structuredClone(quoteTemplates);
}
