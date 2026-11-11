import { Inject, Injectable, Optional } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Storage boundary for private document bytes. Implementations may use a cloud object store. */
export abstract class StorageService {
  abstract saveFile(buffer: Buffer, key: string): Promise<void>;
  abstract getFile(key: string): Promise<Buffer>;
  abstract deleteFile(key: string): Promise<void>;
  abstract healthCheck(): Promise<void>;
}

@Injectable()
export class LocalStorageService extends StorageService {
  private readonly root: string;

  constructor(@Optional() @Inject('PDF_STORAGE_ROOT') root?: string) {
    super();
    this.root = path.resolve(root ?? process.env.PDF_STORAGE_PATH ??
      path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../storage/pdfs'));
  }

  private resolveKey(key: string): string {
    if (!/^(cotizaciones|certificados|logistica)\/[\w.-]+\.pdf$/.test(key)) {
      throw new Error('Clave de almacenamiento PDF inválida');
    }
    const result = path.resolve(this.root, key);
    if (!result.startsWith(`${this.root}${path.sep}`)) {
      throw new Error('Ruta PDF fuera del almacenamiento configurado');
    }
    return result;
  }

  async saveFile(buffer: Buffer, key: string): Promise<void> {
    const finalPath = this.resolveKey(key);
    const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
    await mkdir(path.dirname(finalPath), { recursive: true });
    try {
      await writeFile(temporaryPath, buffer, { flag: 'wx' });
      await rename(temporaryPath, finalPath);
    } catch (error) {
      await rm(temporaryPath, { force: true });
      throw error;
    }
  }

  getFile(key: string): Promise<Buffer> {
    return readFile(this.resolveKey(key));
  }

  async deleteFile(key: string): Promise<void> {
    await rm(this.resolveKey(key), { force: true });
  }

  async healthCheck(): Promise<void> {
    const probePath = path.join(this.root, `.health-${randomUUID()}.tmp`);
    await mkdir(this.root, { recursive: true });
    try {
      await writeFile(probePath, 'ok', { flag: 'wx' });
      const probe = await readFile(probePath, 'utf8');
      if (probe !== 'ok') throw new Error('Storage probe returned unexpected content');
    } finally {
      await rm(probePath, { force: true });
    }
  }
}
