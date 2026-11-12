import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type UploadedQuoteItemImage = { buffer: Buffer };
export type StoredQuoteItemImage = {
  imagen_key: string;
  imagen_sha256: string;
  imagen_mime_type: string;
  imagen_tamano_bytes: number;
};

function detectImage(buffer: Buffer): { extension: 'png' | 'jpg'; mime: string } {
  if (
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return { extension: 'png', mime: 'image/png' };
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  )
    return { extension: 'jpg', mime: 'image/jpeg' };
  throw new BadRequestException(
    'La imagen debe ser un archivo PNG o JPG válido',
  );
}

@Injectable()
export class CotizacionItemImageService {
  private readonly root = path.resolve(
    process.env.COTIZACION_ITEM_IMAGES_PATH ??
      path.join(process.cwd(), 'storage', 'cotizacion-items'),
  );

  async save(buffer: Buffer): Promise<StoredQuoteItemImage> {
    if (!buffer?.length)
      throw new BadRequestException('Seleccione una imagen');
    if (buffer.length > MAX_IMAGE_BYTES)
      throw new BadRequestException('La imagen no puede superar 5 MB');
    const type = detectImage(buffer);
    const imagen_key = `${randomUUID()}.${type.extension}`;
    await mkdir(this.root, { recursive: true });
    await writeFile(path.join(this.root, imagen_key), buffer, { flag: 'wx' });
    return {
      imagen_key,
      imagen_sha256: createHash('sha256').update(buffer).digest('hex'),
      imagen_mime_type: type.mime,
      imagen_tamano_bytes: buffer.length,
    };
  }

  async read(item: CotizacionItem): Promise<Buffer | null> {
    if (!item.imagen_key) return null;
    if (
      !/^[0-9a-f-]{36}\.(png|jpg)$/.test(item.imagen_key) ||
      !/^[0-9a-f]{64}$/.test(item.imagen_sha256 ?? '')
    )
      throw new NotFoundException('Referencia de imagen inválida');
    const file = path.resolve(this.root, item.imagen_key);
    if (!file.startsWith(`${this.root}${path.sep}`))
      throw new NotFoundException('Imagen de cotización no encontrada');
    let buffer: Buffer;
    try {
      buffer = await readFile(file);
    } catch {
      throw new NotFoundException('Imagen de cotización no encontrada');
    }
    const type = detectImage(buffer);
    if (
      createHash('sha256').update(buffer).digest('hex') !== item.imagen_sha256 ||
      type.mime !== item.imagen_mime_type
    )
      throw new NotFoundException(
        'La imagen de cotización no supera la validación de integridad',
      );
    return buffer;
  }

  async toDataUri(item: CotizacionItem): Promise<string | null> {
    const buffer = await this.read(item);
    if (!buffer) return null;
    return `data:${item.imagen_mime_type};base64,${buffer.toString('base64')}`;
  }

  async delete(key: string): Promise<void> {
    if (!/^[0-9a-f-]{36}\.(png|jpg)$/.test(key))
      throw new BadRequestException('Referencia de imagen inválida');
    const file = path.resolve(this.root, key);
    if (!file.startsWith(`${this.root}${path.sep}`))
      throw new BadRequestException('Referencia de imagen inválida');
    await rm(file, { force: true });
  }
}
