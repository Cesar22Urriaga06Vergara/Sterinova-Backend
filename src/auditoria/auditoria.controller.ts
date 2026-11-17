import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import { Controller, Get, Query, Req } from '@nestjs/common';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryAuditoriaDto } from './dto/query-auditoria.dto.js';
import { AuditoriaService } from './auditoria.service.js';

@Controller('auditoria')
@ApiTags('Auditoría')
@ScopedPermissions()
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar auditoría paginada (solo Admin)' })
  @RequirePermission('auditoria.ver')
  findAll(@Query() query: QueryAuditoriaDto, @Req() request: RbacRequest) {
    return this.auditoriaService.findAll({
      page: query.page,
      limit: query.limit,
      entidad: query.entidad,
      usuario_id: query.usuario_id,
      desde: query.desde ? new Date(query.desde) : undefined,
      hasta: query.hasta ? new Date(query.hasta) : undefined,
      scopeIds: request.rbac?.policy?.scopeIds,
    });
  }
}
