import {
  ConflictException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DataSource, Like, type EntityManager } from 'typeorm';
import { SelloCertificacion } from './entities/sello-certificacion.entity.js';
import { SelloCertificacionVersion } from './entities/sello-certificacion-version.entity.js';

export type FrozenSeal = {
  sello_id: number;
  version_id: number;
  version: number;
  sha256: string;
  imagen_key: string;
  mime_type: string;
  nombre_norma: string;
  numero_licencia: string;
  imagen_src: string;
};
const MAX_BYTES = 5 * 1024 * 1024;
function imageType(bytes: Buffer) {
  if (bytes.length > MAX_BYTES)
    throw new ConflictException('El sello supera 5 MB');
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return { extension: 'png', mime: 'image/png' };
  if (
    bytes.length >= 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  )
    return { extension: 'jpg', mime: 'image/jpeg' };
  throw new ConflictException(
    'El sello no contiene una imagen PNG/JPEG válida',
  );
}

@Injectable()
export class SelloSnapshotService {
  private readonly root: string;
  constructor(
    @InjectDataSource() private readonly source: DataSource,
    @Optional() @Inject('CERTIFICATION_SEALS_ROOT') root?: string,
  ) {
    this.root = path.resolve(
      root ??
        process.env.CERTIFICATION_SEALS_PATH ??
        path.join(process.cwd(), 'storage', 'sellos'),
    );
  }

  async freeze(
    manager: EntityManager,
    creadoPorId: number | null = null,
  ): Promise<FrozenSeal> {
    const configured = process.env.ICONTEC_SELLO_ID;
    if (configured && !/^[1-9]\d*$/.test(configured))
      throw new ConflictException('ICONTEC_SELLO_ID inválido');
    const sello = await manager.getRepository(SelloCertificacion).findOne({
      where: configured
        ? { id: Number(configured), activo: true }
        : { activo: true, nombre_norma: Like('%ICONTEC%') },
      order: { orden: 'ASC', id: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
    if (!sello)
      throw new ConflictException({
        code: 'SELLO_ICONTEC_NO_DISPONIBLE',
        message: 'Configure un sello ICONTEC activo antes de emitir',
      });
    const file = path.resolve(this.root, sello.imagen_key);
    if (!file.startsWith(this.root + path.sep))
      throw new ConflictException('Ruta de sello inválida');
    const bytes = await readFile(file).catch(() => {
      throw new ConflictException(
        'No está disponible la imagen del sello ICONTEC',
      );
    });
    const type = imageType(bytes);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const key = `versiones/${sha256}.${type.extension}`;
    await mkdir(path.join(this.root, 'versiones'), { recursive: true });
    try {
      await writeFile(path.join(this.root, key), bytes, { flag: 'wx' });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      const existing = await readFile(path.join(this.root, key));
      if (createHash('sha256').update(existing).digest('hex') !== sha256)
        throw new ConflictException(
          'La imagen congelada no coincide con su hash',
        );
    }
    const repository = manager.getRepository(SelloCertificacionVersion);
    let version = await repository.findOne({
      where: { sello_id: sello.id },
      order: { version: 'DESC' },
      lock: { mode: 'pessimistic_write' },
    });
    if (
      !version ||
      version.imagen_sha256 !== sha256 ||
      version.nombre_norma !== sello.nombre_norma ||
      version.numero_licencia !== sello.numero_licencia
    ) {
      version = await repository.save(
        repository.create({
          sello_id: sello.id,
          version: (version?.version ?? 0) + 1,
          imagen_key: key,
          imagen_sha256: sha256,
          mime_type: type.mime,
          tamano_bytes: String(bytes.length),
          nombre_norma: sello.nombre_norma,
          numero_licencia: sello.numero_licencia,
          creado_por_id: creadoPorId,
        }),
      );
    }
    return {
      sello_id: sello.id,
      version_id: version.id,
      version: version.version,
      sha256,
      imagen_key: version.imagen_key,
      mime_type: version.mime_type,
      nombre_norma: version.nombre_norma,
      numero_licencia: version.numero_licencia,
      imagen_src: `/internal/pdf-assets/sellos/${sha256}.${type.extension}`,
    };
  }

  async readFrozen(
    seal: FrozenSeal,
    manager: EntityManager = this.source.manager,
  ): Promise<Buffer> {
    if (
      !seal ||
      !/^[0-9a-f]{64}$/.test(seal.sha256) ||
      !/^versiones\/[0-9a-f]{64}\.(png|jpg)$/.test(seal.imagen_key)
    )
      throw new ConflictException('Referencia de sello congelado inválida');
    const version = await manager
      .getRepository(SelloCertificacionVersion)
      .findOne({ where: { id: seal.version_id } });
    if (
      !version ||
      version.imagen_sha256 !== seal.sha256 ||
      version.imagen_key !== seal.imagen_key ||
      version.sello_id !== seal.sello_id ||
      version.version !== seal.version ||
      version.mime_type !== seal.mime_type
    )
      throw new ConflictException(
        'La versión del sello no coincide con el snapshot',
      );
    const bytes = await readFile(path.join(this.root, seal.imagen_key)).catch(
      () => {
        throw new ConflictException('Falta la imagen congelada del sello');
      },
    );
    if (
      createHash('sha256').update(bytes).digest('hex') !== seal.sha256 ||
      imageType(bytes).mime !== seal.mime_type
    )
      throw new ConflictException(
        'El sello congelado no supera la validación de integridad',
      );
    return bytes;
  }
}
