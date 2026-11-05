import { Body, Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { ApproveCycleDto } from './dto/approve-cycle.dto.js';
import { RejectCycleDto } from './dto/reject-cycle.dto.js';
import { CalidadService } from './calidad.service.js';

interface AuthenticatedRequest extends Request {
  user: { id: number; rol: UserRole };
}

@Controller('calidad')
@Roles(UserRole.ADMIN, UserRole.CALIDAD)
export class CalidadController {
  constructor(private readonly calidadService: CalidadService) {}

  @Get('pendientes')
  findPendientes() {
    return this.calidadService.findPendientes();
  }

  @Get('ciclos/:id')
  findCicloPendiente(@Param('id', ParseIntPipe) id: number) {
    return this.calidadService.findCicloPendiente(id);
  }

  @Post('aprobar')
  aprobar(
    @Body() dto: ApproveCycleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.calidadService.aprobar(dto, request.user.id);
  }

  @Post('rechazar')
  rechazar(
    @Body() dto: RejectCycleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.calidadService.rechazar(dto, request.user.id);
  }
}
