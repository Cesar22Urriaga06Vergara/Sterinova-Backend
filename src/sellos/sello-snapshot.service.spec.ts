import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { SelloSnapshotService } from './sello-snapshot.service.js';
import { SelloCertificacion } from './entities/sello-certificacion.entity.js';

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
