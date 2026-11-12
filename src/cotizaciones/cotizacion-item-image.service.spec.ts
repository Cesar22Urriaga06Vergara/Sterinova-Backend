import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CotizacionItemImageService } from './cotizacion-item-image.service.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';

describe('CotizacionItemImageService', () => {
  const originalPath = process.env.COTIZACION_ITEM_IMAGES_PATH;

  afterEach(() => {
    if (originalPath === undefined)
      delete process.env.COTIZACION_ITEM_IMAGES_PATH;
    else process.env.COTIZACION_ITEM_IMAGES_PATH = originalPath;
  });

  it('stores, validates and reads private PNG bytes by generated key', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'quote-item-images-'));
    process.env.COTIZACION_ITEM_IMAGES_PATH = root;
    const service = new CotizacionItemImageService();
    const bytes = Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      Buffer.from('image bytes'),
    ]);

    try {
      const stored = await service.save(bytes);
      const item = {
        ...stored,
      } as CotizacionItem;

      expect(stored.imagen_key).toMatch(/^[0-9a-f-]{36}\.png$/);
      expect(stored.imagen_sha256).toMatch(/^[0-9a-f]{64}$/);
      await expect(service.read(item)).resolves.toEqual(bytes);
      await expect(service.toDataUri(item)).resolves.toBe(
        `data:image/png;base64,${bytes.toString('base64')}`,
      );
      await service.delete(stored.imagen_key);
      await expect(service.read(item)).rejects.toThrow(
        'Imagen de cotización no encontrada',
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('rejects empty or non-image uploads', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'quote-item-images-'));
    process.env.COTIZACION_ITEM_IMAGES_PATH = root;
    const service = new CotizacionItemImageService();

    try {
      await expect(service.save(Buffer.alloc(0))).rejects.toThrow(
        'Seleccione una imagen',
      );
      await expect(service.save(Buffer.from('not an image'))).rejects.toThrow(
        'La imagen debe ser un archivo PNG o JPG válido',
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
