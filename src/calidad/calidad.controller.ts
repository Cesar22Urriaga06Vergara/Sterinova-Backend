import type { RbacRequest } from '../rbac/authorization.guard.js';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApproveCycleDto } from './dto/approve-cycle.dto.js';
import { RejectCycleDto } from './dto/reject-cycle.dto.js';
import { CalidadService } from './calidad.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = RbacRequest;

@Controller('calidad')
@ApiTags('Calidad')
@ScopedPermissions()
export class CalidadController {
  constructor(private readonly calidadService: CalidadService) {}

  @Get('pendientes')
  @ApiOperation({ summary: 'Listar ciclos pendientes de revisión' })
  @ApiResponse({ status: 200, description: 'Ciclos pendientes' })
  @RequirePermission('calidad.ciclos.ver')
  findPendientes(@Req() request: RbacRequest) {
    return this.calidadService.findPendientes(request.rbac);
  }

  @Get('ciclos/:id')
  @ApiOperation({ summary: 'Consultar ciclo pendiente' })
  @ApiResponse({ status: 200, description: 'Ciclo encontrado' })
  @RequirePermission('calidad.ciclos.ver')
  findCicloPendiente(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.calidadService.findCicloPendiente(id, request.rbac);
  }

  @Post('aprobar')
  @ApiOperation({ summary: 'Aprobar ciclo' })
  @ApiResponse({ status: 201, description: 'Ciclo aprobado' })
  @ApiResponse({ status: 400, description: 'Datos o contraseña inválidos' })
  @RequirePermission('calidad.aprobar')
  aprobar(
    @Body() dto: ApproveCycleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.calidadService.aprobar(dto, request.user.id, request.rbac);
  }

  @Post('rechazar')
  @ApiOperation({ summary: 'Rechazar ciclo' })
  @ApiResponse({ status: 201, description: 'Ciclo rechazado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @RequirePermission('calidad.rechazar')
  rechazar(
    @Body() dto: RejectCycleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.calidadService.rechazar(dto, request.user.id, request.rbac);
  }
}
