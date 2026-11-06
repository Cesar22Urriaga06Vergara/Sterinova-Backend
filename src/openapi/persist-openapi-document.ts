import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function persistOpenApiDocument(document: unknown, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
}
