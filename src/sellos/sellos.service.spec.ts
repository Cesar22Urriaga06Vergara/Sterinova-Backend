import { BadRequestException } from '@nestjs/common';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { Repository } from 'typeorm';
import { SelloCertificacion } from './entities/sello-certificacion.entity.js';
import { SellosService } from './sellos.service.js';
import type { UploadedImage } from './sellos.service.js';

describe('SellosService', () => {
  const originalPath = process.env.CERTIFICATION_SEALS_PATH;
  let temporaryDirectory: string;

  beforeEach(async () => {
    temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'sterinova-sellos-'));
    process.env.CERTIFICATION_SEALS_PATH = temporaryDirectory;
  });

  afterEach(async () => {
    if (originalPath === undefined) delete process.env.CERTIFICATION_SEALS_PATH;
    else process.env.CERTIFICATION_SEALS_PATH = originalPath;
    await rm(temporaryDirectory, { recursive: true, force: true });
  });

  it('stores a validated PNG and creates an active seal in its configured order', async () => {
    const repository = {
      create: vi.fn((value: Partial<SelloCertificacion>) => value),
      save: vi.fn(async (value: Partial<SelloCertificacion>) => ({ id: 5, ...value })),
    };
    const service = new SellosService(repository as unknown as Repository<SelloCertificacion>);
    const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);

    const seal = await service.create(
      { nombre_norma: 'ISO 9001', numero_licencia: 'LIC-9001', orden: 2 },
      { buffer: png } as UploadedImage,
    );

    expect(seal).toMatchObject({ nombre_norma: 'ISO 9001', numero_licencia: 'LIC-9001', activo: true, orden: 2 });
    expect(seal.imagen_key).toMatch(/\.png$/);
    expect(await readFile(path.join(temporaryDirectory, seal.imagen_key))).toEqual(png);
  });

  it('rejects non-PNG/JPG bytes even when an upload claims an image mime type', async () => {
    const repository = { create: vi.fn(), save: vi.fn() };
    const service = new SellosService(repository as unknown as Repository<SelloCertificacion>);

    await expect(service.create(
      { nombre_norma: 'ISO 9001', numero_licencia: 'LIC-9001' },
      { buffer: Buffer.from('not an image'), mimetype: 'image/png' } as UploadedImage,
    )).rejects.toBeInstanceOf(BadRequestException);
  });

  it('requires an image on create', async () => {
    const repository = { create: vi.fn(), save: vi.fn() };
    const service = new SellosService(repository as unknown as Repository<SelloCertificacion>);

    await expect(service.create({ nombre_norma: 'ISO 9001', numero_licencia: 'LIC-9001' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });
});
