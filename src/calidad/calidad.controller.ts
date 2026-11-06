import { Body, Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { ApproveCycleDto } from './dto/approve-cycle.dto.js';
import { RejectCycleDto } from './dto/reject-cycle.dto.js';
import { CalidadService } from './calidad.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: number; rol: UserRole };
}

@Controller('calidad')
@ApiTags('Calidad')
@Roles(UserRole.ADMIN, UserRole.CALIDAD)
export class CalidadController {
  constructor(private readonly calidadService: CalidadService) {}

  @Get('pendientes')
  @ApiOperation({ summary: 'Listar ciclos pendientes de revisión' })
  @ApiResponse({ status: 200, description: 'Ciclos pendientes' })
  findPendientes() {
    return this.calidadService.findPendientes();
  }

  @Get('ciclos/:id')
  @ApiOperation({ summary: 'Consultar ciclo pendiente' })
  @ApiResponse({ status: 200, description: 'Ciclo encontrado' })
  findCicloPendiente(@Param('id', ParseIntPipe) id: number) {
    return this.calidadService.findCicloPendiente(id);
  }

  @Post('aprobar')
  @ApiOperation({ summary: 'Aprobar ciclo' })
  @ApiResponse({ status: 201, description: 'Ciclo aprobado' })
  @ApiResponse({ status: 400, description: 'Datos o contraseña inválidos' })
  aprobar(
    @Body() dto: ApproveCycleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.calidadService.aprobar(dto, request.user.id);
  }

  @Post('rechazar')
  @ApiOperation({ summary: 'Rechazar ciclo' })
  @ApiResponse({ status: 201, description: 'Ciclo rechazado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  rechazar(
    @Body() dto: RejectCycleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.calidadService.rechazar(dto, request.user.id);
  }
}
