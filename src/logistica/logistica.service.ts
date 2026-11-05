import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { CreateOrdenDto } from './dto/create-orden.dto.js';
import { UpdateEstadoOrdenDto } from './dto/update-estado-orden.dto.js';

@Injectable()
export class LogisticaService {
  constructor(
    @InjectRepository(OrdenServicio)
    private readonly ordenesRepository: Repository<OrdenServicio>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionesRepository: Repository<Cotizacion>,
  ) {}

  private async generateConsecutivo(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `OS-${year}-`;

    const last = await this.ordenesRepository
      .createQueryBuilder('orden')
      .where('orden.consecutivo LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('orden.id', 'DESC')
      .getOne();

    let next = 1;
    if (last?.consecutivo) {
      const parts = last.consecutivo.split('-');
      const parsed = Number.parseInt(parts[parts.length - 1] ?? '0', 10);
      if (!Number.isNaN(parsed)) {
        next = parsed + 1;
      }
    }

    return `${prefix}${String(next).padStart(4, '0')}`;
  }

  async createOrden(dto: CreateOrdenDto): Promise<OrdenServicio> {
    const cotizacion = await this.cotizacionesRepository.findOne({
      where: { id: dto.cotizacion_id },
      relations: ['cliente', 'items'],
    });

    if (!cotizacion) {
      throw new NotFoundException(
        `Cotización #${dto.cotizacion_id} no encontrada`,
      );
    }

    if (cotizacion.estado !== 'APROBADA') {
      throw new BadRequestException(
        'Solo se pueden generar órdenes desde cotizaciones APROBADAS',
      );
    }

    const existing = await this.ordenesRepository.findOne({
      where: { cotizacion_id: dto.cotizacion_id },
    });
    if (existing) {
      throw new ConflictException(
        `La cotización ${cotizacion.consecutivo} ya tiene la orden ${existing.consecutivo}`,
      );
    }

    if (!dto.fecha_programada) {
      throw new BadRequestException('La fecha programada es obligatoria');
    }

    const consecutivo = await this.generateConsecutivo();
    const orden = this.ordenesRepository.create({
      consecutivo,
      cotizacion_id: dto.cotizacion_id,
      fecha_programada: dto.fecha_programada,
      estado: EstadoOrdenServicio.PENDIENTE,
      conductor_asignado: dto.conductor_asignado ?? null,
      vehiculo_placa: dto.vehiculo_placa ?? null,
      observaciones: dto.observaciones ?? null,
    });

    const saved = await this.ordenesRepository.save(orden);
    return this.findOne(saved.id);
  }

  findAll(): Promise<OrdenServicio[]> {
    return this.ordenesRepository.find({
      relations: ['cotizacion', 'cotizacion.cliente', 'cotizacion.items'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<OrdenServicio> {
    const orden = await this.ordenesRepository.findOne({
      where: { id },
      relations: ['cotizacion', 'cotizacion.cliente', 'cotizacion.items'],
    });
    if (!orden) {
      throw new NotFoundException(`Orden de servicio #${id} no encontrada`);
    }
    return orden;
  }

  async updateEstado(
    id: number,
    dto: UpdateEstadoOrdenDto,
  ): Promise<OrdenServicio> {
    if (!Object.values(EstadoOrdenServicio).includes(dto.estado)) {
      throw new BadRequestException('Estado de orden inválido');
    }

    const orden = await this.findOne(id);
    orden.estado = dto.estado;
    await this.ordenesRepository.save(orden);
    return this.findOne(id);
  }

  async findCotizacionesAprobadasSinOrden(): Promise<Cotizacion[]> {
    const aprobadas = await this.cotizacionesRepository.find({
      where: { estado: 'APROBADA' },
      relations: ['cliente'],
      order: { id: 'DESC' },
    });

    const ordenes = await this.ordenesRepository.find({
      select: ['cotizacion_id'],
    });
    const usados = new Set(ordenes.map((o) => o.cotizacion_id));

    return aprobadas.filter((c) => !usados.has(c.id));
  }
}
