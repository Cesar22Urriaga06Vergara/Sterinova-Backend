import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { SelloSnapshotService } from './sello-snapshot.service.js';
import { SelloCertificacion } from './entities/sello-certificacion.entity.js';

async function createHarness(lookupResults: (SelloCertificacion | null)[]) {
  const root = await mkdtemp(path.join(tmpdir(), 'seal-selection-'));
  await writeFile(
    path.join(root, 'current.png'),
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 1]),
  );
  const sealRepository = {
    findOne: vi.fn(async () => lookupResults.shift() ?? null),
  };
  const versions = {
    findOne: vi.fn(async () => null),
    create: (value: object) => value,
    save: vi.fn(async (value: object) => ({ ...value, id: 20 })),
  };
  const manager = {
    getRepository: (entity: unknown) =>
      entity === SelloCertificacion ? sealRepository : versions,
  };
  return {
    manager,
    sealRepository,
    service: new SelloSnapshotService({ manager } as never, root),
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

function seal(id: number, nombre_norma: string): SelloCertificacion {
  return {
    id,
    nombre_norma,
    numero_licencia: `L${id}`,
    imagen_key: 'current.png',
    activo: true,
    orden: id,
  } as SelloCertificacion;
}

it('congela bytes y versión, conserva la imagen anterior y detecta corrupción', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'seal-hito4-'));
  const buffer = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 1]);
  const catalog = {
    id: 1,
    activo: true,
    nombre_norma: 'ICONTEC',
    numero_licencia: 'L1',
    imagen_key: 'current.png',
  };
  let last: any = null;
  const versions = {
    findOne: vi.fn(async () => last),
    create: (v: any) => v,
    save: vi.fn(async (v: any) => (last = { ...v, id: (last?.id ?? 0) + 1 })),
  };
  const manager = {
    getRepository: (entity: any) =>
      entity === SelloCertificacion
        ? { findOne: vi.fn(async () => catalog) }
        : versions,
  };
  try {
    await writeFile(path.join(root, 'current.png'), buffer);
    const service = new SelloSnapshotService({ manager } as never, root);
    const first = await service.freeze(manager as never);
    expect(first.sha256).toBe(
      createHash('sha256').update(buffer).digest('hex'),
    );
    expect((await service.freeze(manager as never)).version_id).toBe(
      first.version_id,
    );
    await writeFile(
      path.join(root, 'current.png'),
      Buffer.concat([buffer, Buffer.from('new')]),
    );
    const next = await service.freeze(manager as never);
    expect(next.version_id).not.toBe(first.version_id);
    expect(await readFile(path.join(root, first.imagen_key))).toEqual(buffer);
    await writeFile(path.join(root, next.imagen_key), Buffer.from('corrupt'));
    await expect(service.readFrozen(next)).rejects.toThrow();
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
it('rechaza emisión sin sello ICONTEC activo', async () => {
  const manager = { getRepository: () => ({ findOne: async () => null }) };
  await expect(
    new SelloSnapshotService({ manager } as never).freeze(manager as never),
  ).rejects.toMatchObject({ status: 409 });
});

it('uses an active ICONTEC seal before the combined SELLOS seal', async () => {
  const icontec = seal(1, 'ICONTEC');
  const harness = await createHarness([icontec]);
  const previous = process.env.ICONTEC_SELLO_ID;
  delete process.env.ICONTEC_SELLO_ID;
  try {
    const frozen = await harness.service.freeze(harness.manager as never);

    expect(frozen.sello_id).toBe(1);
    expect(harness.sealRepository.findOne).toHaveBeenCalledTimes(1);
    expect(harness.sealRepository.findOne.mock.calls[0][0]).toMatchObject({
      where: { activo: true },
      order: { orden: 'ASC', id: 'ASC' },
    });
  } finally {
    if (previous === undefined) delete process.env.ICONTEC_SELLO_ID;
    else process.env.ICONTEC_SELLO_ID = previous;
    await harness.cleanup();
  }
});

it('falls back to the active combined SELLOS seal when ICONTEC is unavailable', async () => {
  const combined = seal(2, 'SELLOS');
  const harness = await createHarness([null, combined]);
  const previous = process.env.ICONTEC_SELLO_ID;
  delete process.env.ICONTEC_SELLO_ID;
  try {
    const frozen = await harness.service.freeze(harness.manager as never);

    expect(frozen.sello_id).toBe(2);
    expect(harness.sealRepository.findOne).toHaveBeenCalledTimes(2);
    expect(harness.sealRepository.findOne.mock.calls[0][0]).toMatchObject({
      where: { activo: true },
      order: { orden: 'ASC', id: 'ASC' },
    });
    expect(harness.sealRepository.findOne.mock.calls[1][0]).toMatchObject({
      where: { activo: true, nombre_norma: 'SELLOS' },
      order: { orden: 'ASC', id: 'ASC' },
    });
  } finally {
    if (previous === undefined) delete process.env.ICONTEC_SELLO_ID;
    else process.env.ICONTEC_SELLO_ID = previous;
    await harness.cleanup();
  }
});

it('provides the active combined seal for preview without freezing a version', async () => {
  const harness = await createHarness([null, seal(2, 'SELLOS')]);
  const previous = process.env.ICONTEC_SELLO_ID;
  delete process.env.ICONTEC_SELLO_ID;
  try {
    const preview = await harness.service.preview(harness.manager as never);

    expect(preview.imagen_src).toBe('data:image/png;base64,iVBORw0KGgoB');
    expect(harness.sealRepository.findOne).toHaveBeenCalledTimes(2);
  } finally {
    if (previous === undefined) delete process.env.ICONTEC_SELLO_ID;
    else process.env.ICONTEC_SELLO_ID = previous;
    await harness.cleanup();
  }
});

it('does not fall back when an explicitly selected seal is unavailable', async () => {
  const harness = await createHarness([null]);
  const previous = process.env.ICONTEC_SELLO_ID;
  process.env.ICONTEC_SELLO_ID = '99';
  try {
    await expect(
      harness.service.freeze(harness.manager as never),
    ).rejects.toMatchObject({ status: 409 });

    expect(harness.sealRepository.findOne).toHaveBeenCalledTimes(1);
    expect(harness.sealRepository.findOne.mock.calls[0][0]).toMatchObject({
      where: { id: 99, activo: true },
    });
  } finally {
    if (previous === undefined) delete process.env.ICONTEC_SELLO_ID;
    else process.env.ICONTEC_SELLO_ID = previous;
    await harness.cleanup();
  }
});

it('rejects when neither active ICONTEC nor combined SELLOS is available', async () => {
  const harness = await createHarness([null, null]);
  const previous = process.env.ICONTEC_SELLO_ID;
  delete process.env.ICONTEC_SELLO_ID;
  try {
    await expect(
      harness.service.freeze(harness.manager as never),
    ).rejects.toMatchObject({ status: 409 });

    expect(harness.sealRepository.findOne).toHaveBeenCalledTimes(2);
    expect(harness.sealRepository.findOne.mock.calls[1][0]).toMatchObject({
      where: { activo: true, nombre_norma: 'SELLOS' },
      order: { orden: 'ASC', id: 'ASC' },
    });
  } finally {
    if (previous === undefined) delete process.env.ICONTEC_SELLO_ID;
    else process.env.ICONTEC_SELLO_ID = previous;
    await harness.cleanup();
  }
});
