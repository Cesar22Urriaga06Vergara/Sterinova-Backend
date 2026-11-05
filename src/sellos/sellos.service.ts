import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Repository } from 'typeorm';
import { SelloCertificacion } from './entities/sello-certificacion.entity.js';
import { CreateSelloCertificacionDto } from './dto/create-sello-certificacion.dto.js';
import { UpdateSelloCertificacionDto } from './dto/update-sello-certificacion.dto.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export type UploadedImage = { buffer: Buffer };

function detectImage(buffer: Buffer): { extension: 'png' | 'jpg'; mimeType: string } {
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return { extension: 'png', mimeType: 'image/png' };
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { extension: 'jpg', mimeType: 'image/jpeg' };
  }
  throw new BadRequestException('La imagen debe ser un archivo PNG o JPG válido');
}

@Injectable()
export class SellosService {
  private readonly storagePath = path.resolve(
    process.env.CERTIFICATION_SEALS_PATH ?? path.join(process.cwd(), 'storage', 'sellos'),
  );

  constructor(
    @InjectRepository(SelloCertificacion)
    private readonly sellosRepository: Repository<SelloCertificacion>,
  ) {}

  findAll(): Promise<SelloCertificacion[]> {
    return this.sellosRepository.find({ order: { orden: 'ASC', id: 'ASC' } });
  }

  async create(dto: CreateSelloCertificacionDto, file?: UploadedImage): Promise<SelloCertificacion> {
    if (!file?.buffer?.length) throw new BadRequestException('La imagen del sello es obligatoria');
    const imagen_key = await this.saveImage(file.buffer);
    try {
      return await this.sellosRepository.save(this.sellosRepository.create({
        nombre_norma: dto.nombre_norma.trim(),
        numero_licencia: dto.numero_licencia.trim(),
        orden: dto.orden ?? 0,
        activo: true,
        imagen_key,
      }));
    } catch (error) {
      await rm(path.join(this.storagePath, imagen_key), { force: true });
      throw error;
    }
  }

  async update(id: number, dto: UpdateSelloCertificacionDto, file?: UploadedImage): Promise<SelloCertificacion> {
    const sello = await this.findOne(id);
    if (dto.nombre_norma !== undefined) sello.nombre_norma = dto.nombre_norma.trim();
    if (dto.numero_licencia !== undefined) sello.numero_licencia = dto.numero_licencia.trim();
    if (dto.activo !== undefined) sello.activo = dto.activo;
    if (dto.orden !== undefined) sello.orden = dto.orden;
    const previousImage = sello.imagen_key;
    if (file) sello.imagen_key = await this.saveImage(file.buffer);
    try {
      return await this.sellosRepository.save(sello);
    } catch (error) {
      if (file) await rm(path.join(this.storagePath, sello.imagen_key), { force: true });
      sello.imagen_key = previousImage;
      throw error;
    }
  }

  async deactivate(id: number): Promise<SelloCertificacion> {
    const sello = await this.findOne(id);
    sello.activo = false;
    return this.sellosRepository.save(sello);
  }

  async getImage(id: number): Promise<{ buffer: Buffer; mimeType: string }> {
    const sello = await this.findOne(id);
    const resolvedPath = path.resolve(this.storagePath, sello.imagen_key);
    if (!resolvedPath.startsWith(`${this.storagePath}${path.sep}`)) {
      throw new NotFoundException('Imagen del sello no encontrada');
    }
    const buffer = await readFile(resolvedPath).catch(() => {
      throw new NotFoundException('Imagen del sello no encontrada');
    });
    const { mimeType } = detectImage(buffer);
    return { buffer, mimeType };
  }

  private async findOne(id: number): Promise<SelloCertificacion> {
    const sello = await this.sellosRepository.findOne({ where: { id } });
    if (!sello) throw new NotFoundException(`Sello de certificación #${id} no encontrado`);
    return sello;
  }

  private async saveImage(buffer: Buffer): Promise<string> {
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new BadRequestException('La imagen no puede superar 5 MB');
    }
    const { extension } = detectImage(buffer);
    const key = `${randomUUID()}.${extension}`;
    await mkdir(this.storagePath, { recursive: true });
    await writeFile(path.join(this.storagePath, key), buffer, { flag: 'wx' });
    return key;
  }
}
