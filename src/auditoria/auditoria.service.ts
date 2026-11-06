import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, type EntityManager, type Repository } from 'typeorm';
import { Auditoria, AccionAuditoria } from './entities/auditoria.entity.js';

export type CreateAuditoriaEntry = {
  usuario_id: number | null;
  entidad: string;
  entidad_id: number | null;
  accion: AccionAuditoria;
  detalle?: Record<string, unknown> | null;
};

export type AuditoriaFilters = {
  page: number;
  limit: number;
  entidad?: string;
  usuario_id?: number;
  desde?: Date;
  hasta?: Date;
};

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  create(
    entry: CreateAuditoriaEntry,
    manager?: EntityManager,
  ): Promise<Auditoria> {
    const repository = manager
      ? manager.getRepository(Auditoria)
      : this.auditoriaRepository;
    return repository.save(repository.create({
      ...entry,
      detalle: entry.detalle ?? null,
    }));
  }

  async findAll(filters: AuditoriaFilters) {
    const where: Record<string, unknown> = {};
    if (filters.entidad) where.entidad = filters.entidad;
    if (filters.usuario_id !== undefined) where.usuario_id = filters.usuario_id;
    if (filters.desde && filters.hasta) {
      where.created_at = Between(filters.desde, filters.hasta);
    } else if (filters.desde) {
      where.created_at = MoreThanOrEqual(filters.desde);
    } else if (filters.hasta) {
      where.created_at = LessThanOrEqual(filters.hasta);
    }
    const [data, total] = await this.auditoriaRepository.findAndCount({
      where,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      order: { created_at: 'DESC' },
    });
    return {
      data,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }
}
