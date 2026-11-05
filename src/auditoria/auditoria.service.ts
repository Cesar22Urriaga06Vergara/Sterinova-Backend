import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';
import { Auditoria, AccionAuditoria } from './entities/auditoria.entity.js';

export type CreateAuditoriaEntry = {
  usuario_id: number | null;
  entidad: string;
  entidad_id: number;
  accion: AccionAuditoria;
  detalle?: Record<string, unknown> | null;
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
}
