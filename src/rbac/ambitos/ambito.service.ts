import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RbacScope } from '../entities/scope.entity.js';
import type { PermissionContext } from '../rbac-authorization.service.js';
import {
  AmbitoResponse,
  CerrarAmbitoDto,
  CreateAmbitoDto,
  UpdateAmbitoDto,
} from './dtos.js';
import { AuditoriaService } from '../../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../../auditoria/entities/auditoria.entity.js';

@Injectable()
export class AmbitoService {
  constructor(
    @InjectRepository(RbacScope)
    private readonly ambitosRepository: Repository<RbacScope>,
    private readonly dataSource: DataSource,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async listar(context: PermissionContext): Promise<AmbitoResponse[]> {
    if (!context.policy.scopeIds.includes(1)) {
      throw new ForbiddenException('No tiene permiso para listar ámbitos');
    }

    const ambitos = await this.ambitosRepository.find({
      where: { active: true },
      order: { id: 'ASC' },
    });

    return ambitos.map((a) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      kind: a.kind,
      parentId: a.parent_id,
      active: a.active,
      createdAt: a.created_at,
    }));
  }

  async crear(
    dto: CreateAmbitoDto,
    actorId: number,
    context: PermissionContext,
  ): Promise<AmbitoResponse> {
    if (!context.permission || context.permission !== 'ambitos.gestionar') {
      throw new ForbiddenException('Requiere permiso ambitos.gestionar');
    }

    const existente = await this.ambitosRepository.findOne({
      where: { code: dto.code },
    });
    if (existente) {
      throw new BadRequestException(
        `Ya existe un ámbito con el código '${dto.code}'`,
      );
    }

    let parentScope: RbacScope | null = null;
    if (dto.parentId) {
      parentScope = await this.ambitosRepository.findOne({
        where: { id: Number(dto.parentId), active: true },
      });
      if (!parentScope) {
        throw new NotFoundException(
          `El ámbito padre '${dto.parentId}' no existe o está inactivo`,
        );
      }
      if (dto.kind === 'GLOBAL' && parentScope.kind === 'GLOBAL') {
        throw new BadRequestException(
          'Solo puede existir un ámbito GLOBAL raíz',
        );
      }
    }

    if (dto.kind === 'GLOBAL' && dto.parentId) {
      throw new BadRequestException('El ámbito GLOBAL no puede tener padre');
    }

    if (dto.kind !== 'GLOBAL' && !dto.parentId) {
      throw new BadRequestException(
        `El ámbito ${dto.kind} requiere un ámbito padre`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const ambito = manager.getRepository(RbacScope).create({
        code: dto.code,
        name: dto.name,
        kind: dto.kind,
        parent_id: parentScope?.id ?? null,
        active: true,
      });
      const saved = await manager.getRepository(RbacScope).save(ambito);

      await this.auditoriaService.create(
        {
          usuario_id: actorId,
          entidad: 'rbac_scopes',
          entidad_id: saved.id,
          accion: AccionAuditoria.CREAR,
          detalle: {
            code: dto.code,
            name: dto.name,
            kind: dto.kind,
            parent_id: parentScope?.id ?? null,
          },
        },
        manager,
      );

      return {
        id: saved.id,
        code: saved.code,
        name: saved.name,
        kind: saved.kind,
        parentId: saved.parent_id,
        active: saved.active,
        createdAt: saved.created_at,
      };
    });
  }

  async actualizar(
    id: number,
    dto: UpdateAmbitoDto,
    actorId: number,
    context: PermissionContext,
  ): Promise<AmbitoResponse> {
    if (!context.permission || context.permission !== 'ambitos.gestionar') {
      throw new ForbiddenException('Requiere permiso ambitos.gestionar');
    }

    const ambito = await this.ambitosRepository.findOne({ where: { id } });
    if (!ambito) {
      throw new NotFoundException(`Ámbito #${id} no encontrado`);
    }

    if (!ambito.active) {
      throw new BadRequestException(
        `El ámbito #${id} está inactivo y no se puede modificar`,
      );
    }

    if (ambito.kind === 'GLOBAL' && dto.kind !== 'GLOBAL') {
      throw new BadRequestException(
        'No se puede cambiar el tipo de un ámbito GLOBAL',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      Object.assign(ambito, {
        name: dto.name,
        kind: dto.kind,
      });
      const saved = await manager.getRepository(RbacScope).save(ambito);

      await this.auditoriaService.create(
        {
          usuario_id: actorId,
          entidad: 'rbac_scopes',
          entidad_id: saved.id,
          accion: AccionAuditoria.EDITAR,
          detalle: {
            name: dto.name,
            kind: dto.kind,
          },
        },
        manager,
      );

      return {
        id: saved.id,
        code: saved.code,
        name: saved.name,
        kind: saved.kind,
        parentId: saved.parent_id,
        active: saved.active,
        createdAt: saved.created_at,
      };
    });
  }

  async cerrar(
    id: number,
    dto: CerrarAmbitoDto,
    actorId: number,
    context: PermissionContext,
  ): Promise<AmbitoResponse> {
    if (!context.permission || context.permission !== 'ambitos.gestionar') {
      throw new ForbiddenException('Requiere permiso ambitos.gestionar');
    }

    const ambito = await this.ambitosRepository.findOne({ where: { id } });
    if (!ambito) {
      throw new NotFoundException(`Ámbito #${id} no encontrado`);
    }

    if (!ambito.active) {
      throw new BadRequestException(
        `El ámbito #${id} ya está inactivo`,
      );
    }

    if (ambito.kind === 'GLOBAL' && ambito.parent_id === null) {
      throw new BadRequestException(
        'No se puede cerrar el ámbito GLOBAL raíz',
      );
    }

    const { RbacUserRoleAssignment } = await import(
      '../entities/user-role-assignment.entity.js'
    );
    const asignacionesActivas = await this.dataSource
      .getRepository(RbacUserRoleAssignment)
      .count({ where: { scope_id: id, active: true } });
    if (asignacionesActivas > 0) {
      throw new BadRequestException(
        `No se puede cerrar el ámbito #${id}: tiene ${asignacionesActivas} asignación(es) de usuario activa(s). Desactive las asignaciones primero.`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      ambito.active = false;
      const saved = await manager.getRepository(RbacScope).save(ambito);

      await this.auditoriaService.create(
        {
          usuario_id: actorId,
          entidad: 'rbac_scopes',
          entidad_id: saved.id,
          accion: AccionAuditoria.ELIMINAR,
          detalle: {
            motivo: dto.motivo,
            code: saved.code,
            name: saved.name,
            kind: saved.kind,
          },
        },
        manager,
      );

      return {
        id: saved.id,
        code: saved.code,
        name: saved.name,
        kind: saved.kind,
        parentId: saved.parent_id,
        active: saved.active,
        createdAt: saved.created_at,
      };
    });
  }

  async obtener(id: number, context: PermissionContext): Promise<AmbitoResponse> {
    if (!context.policy.scopeIds.includes(1)) {
      throw new ForbiddenException('No tiene permiso para ver ámbitos');
    }

    const ambito = await this.ambitosRepository.findOne({ where: { id } });
    if (!ambito) {
      throw new NotFoundException(`Ámbito #${id} no encontrado`);
    }

    return {
      id: ambito.id,
      code: ambito.code,
      name: ambito.name,
      kind: ambito.kind,
      parentId: ambito.parent_id,
      active: ambito.active,
      createdAt: ambito.created_at,
    };
  }
}
