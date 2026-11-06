import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { QueryAuditoriaDto } from './dto/query-auditoria.dto.js';
import { AuditoriaService } from './auditoria.service.js';

@Controller('auditoria')
@ApiTags('Auditoría')
@Roles(UserRole.ADMIN)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar auditoría paginada (solo Admin)' })
  findAll(@Query() query: QueryAuditoriaDto) {
    return this.auditoriaService.findAll({
      page: query.page,
      limit: query.limit,
      entidad: query.entidad,
      usuario_id: query.usuario_id,
      desde: query.desde ? new Date(query.desde) : undefined,
      hasta: query.hasta ? new Date(query.hasta) : undefined,
    });
  }
}
