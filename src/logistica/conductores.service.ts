import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conductor } from './entities/conductor.entity.js';
import { SaveConductorDto } from './dto/save-conductor.dto.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { creationScope } from '../rbac/resource-access.js';
@Injectable()
export class ConductoresService {
  constructor(@InjectRepository(Conductor) private readonly repo: Repository<Conductor>) {}
  list(access: PermissionContext) {
    const ids = [...access.policy.scopeIds, ...access.policy.ownScopeIds];
    if (!ids.length) throw new ForbiddenException('Sin ámbito autorizado');
    return this.repo.find({ where: { scope_id: In(ids) }, order: { nombre_completo: 'ASC' } });
  }
  create(dto: SaveConductorDto, access: PermissionContext) { return this.repo.save(this.repo.create({ ...dto, scope_id: creationScope(access) })); }
  async update(id: number, dto: SaveConductorDto, access: PermissionContext) {
    const row = (await this.list(access)).find((item) => item.id === id);
    if (!row) throw new NotFoundException('Conductor no encontrado');
    Object.assign(row, dto); return this.repo.save(row);
  }
  async setActive(id: number, activo: boolean, access: PermissionContext) {
    const row = (await this.list(access)).find((item) => item.id === id);
    if (!row) throw new NotFoundException('Conductor no encontrado');
    row.activo = activo;
    return this.repo.save(row);
  }
}
