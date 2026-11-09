import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { DataSource } from 'typeorm';
import { SelloCertificacion } from './entities/sello-certificacion.entity.js';
import { SelloSnapshotService } from './sello-snapshot.service.js';

/** Imports the existing artwork once; never overwrites a configured catalog. */
export async function seedIcontec(
  source: DataSource,
  imagePath: string,
  root = path.resolve(process.env.CERTIFICATION_SEALS_PATH ?? 'storage/sellos'),
) {
  return source.transaction(async (manager) => {
    const [lock] = await manager.query(
      "SELECT GET_LOCK('sterinova_seed_icontec',10) AS acquired",
    );
    if (Number(lock.acquired) !== 1)
      throw new Error('No se pudo bloquear la inicialización ICONTEC');
    try {
      const repo = manager.getRepository(SelloCertificacion);
      let record = await repo.findOne({
        where: { nombre_norma: 'ICONTEC ISO 9001 / ISO 13485 e IQNET' },
        lock: { mode: 'pessimistic_write' },
      });
      if (!record) {
        const bytes = await readFile(imagePath);
        if (
          bytes.length < 3 ||
          bytes[0] !== 255 ||
          bytes[1] !== 216 ||
          bytes[2] !== 255
        )
          throw new Error('La fuente ICONTEC debe ser JPEG');
        const hash = createHash('sha256').update(bytes).digest('hex');
        const key = `inicial-${hash}.jpg`;
        await mkdir(root, { recursive: true });
        try {
          await writeFile(path.join(root, key), bytes, { flag: 'wx' });
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
          if (
            createHash('sha256')
              .update(await readFile(path.join(root, key)))
              .digest('hex') !== hash
          )
            throw new Error('La copia inicial no coincide con su hash');
        }
        record = await repo.save(
          repo.create({
            nombre_norma: 'ICONTEC ISO 9001 / ISO 13485 e IQNET',
            numero_licencia: 'SC-CER814321 / DM-CER814323',
            imagen_key: key,
            activo: true,
            orden: 0,
          }),
        );
      }
      if (!record.activo)
        throw new Error(
          'El sello inicial fue desactivado; no se reactiva automáticamente',
        );
      const service = new SelloSnapshotService(source, root);
      const frozen = await service.freeze(manager);
      await service.readFrozen(frozen, manager);
      return frozen;
    } finally {
      await manager.query("SELECT RELEASE_LOCK('sterinova_seed_icontec')");
    }
  });
}
