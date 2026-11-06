import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { LocalStorageService } from './storage.service.js';

describe('LocalStorageService', () => {
  it('persists and retrieves the exact bytes under a safe relative key', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'sterinova-storage-'));
    const original = process.env.PDF_STORAGE_PATH;
    process.env.PDF_STORAGE_PATH = root;
    const storage = new LocalStorageService();
    const bytes = Buffer.from('%PDF-1.7 content');
    try {
      await storage.saveFile(bytes, 'certificados/001.pdf');
      expect(await storage.getFile('certificados/001.pdf')).toEqual(bytes);
      expect(await readFile(path.join(root, 'certificados', '001.pdf'))).toEqual(bytes);
      await storage.deleteFile('certificados/001.pdf');
      await expect(storage.getFile('certificados/001.pdf')).rejects.toMatchObject({ code: 'ENOENT' });
    } finally {
      if (original === undefined) delete process.env.PDF_STORAGE_PATH;
      else process.env.PDF_STORAGE_PATH = original;
      await rm(root, { recursive: true, force: true });
    }
  });

  it('rejects keys that escape the configured root', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'sterinova-storage-'));
    const original = process.env.PDF_STORAGE_PATH;
    process.env.PDF_STORAGE_PATH = root;
    const storage = new LocalStorageService();
    try {
      await expect(storage.saveFile(Buffer.from('x'), '../outside.pdf')).rejects.toThrow(/inválida/);
    } finally {
      if (original === undefined) delete process.env.PDF_STORAGE_PATH;
      else process.env.PDF_STORAGE_PATH = original;
      await rm(root, { recursive: true, force: true });
    }
  });

  it('checks that the configured storage can write, read, and remove a probe', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'sterinova-storage-'));
    const original = process.env.PDF_STORAGE_PATH;
    process.env.PDF_STORAGE_PATH = root;
    const storage = new LocalStorageService();
    try {
      await expect(storage.healthCheck()).resolves.toBeUndefined();
      expect(await (await import('node:fs/promises')).readdir(root)).toEqual([]);
    } finally {
      if (original === undefined) delete process.env.PDF_STORAGE_PATH;
      else process.env.PDF_STORAGE_PATH = original;
      await rm(root, { recursive: true, force: true });
    }
  });
});
