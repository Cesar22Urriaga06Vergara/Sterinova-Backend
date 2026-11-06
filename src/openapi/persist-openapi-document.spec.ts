import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { persistOpenApiDocument } from './persist-openapi-document.js';

describe('persistOpenApiDocument', () => {
  let directory: string | undefined;

  afterEach(() => {
    if (directory) rmSync(directory, { recursive: true, force: true });
    directory = undefined;
  });

  it('creates parent directories and writes formatted JSON', () => {
    directory = mkdtempSync(join(tmpdir(), 'sterinova-openapi-'));
    const outputPath = join(directory, 'docs', 'arquitectura', 'openapi.json');
    const document = { openapi: '3.0.0', paths: { '/health/live': {} } };

    persistOpenApiDocument(document, outputPath);

    expect(JSON.parse(readFileSync(outputPath, 'utf8'))).toEqual(document);
    expect(readFileSync(outputPath, 'utf8')).toContain('\n  "openapi"');
  });
});
