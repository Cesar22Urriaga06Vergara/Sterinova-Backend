import type { RbacRequest } from '../rbac/authorization.guard.js';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateCicloDto } from './dto/create-ciclo.dto.js';
import { AutorizarReprocesoDto } from './dto/autorizar-reproceso.dto.js';
import { PlantaService } from './planta.service.js';

type AuthenticatedRequest = RbacRequest;

@Controller('planta')
@ScopedPermissions()
export class PlantaController {
  constructor(private readonly plantaService: PlantaService) {}

  @Get('protocolos')
  @RequirePermission('planta.protocolos.ver')
  findProtocolos() { return this.plantaService.findProtocolos(); }

  @Get('ordenes')
  @RequirePermission('planta.ordenes.ver')
  findOrdenesEnPlanta(@Req() request: RbacRequest) {
    return this.plantaService.findOrdenesEnPlanta(request.rbac);
  }

  @Get('ciclos')
  @RequirePermission('planta.ciclos.ver')
  findCiclos(@Req() request: RbacRequest) {
    return this.plantaService.findCiclos(request.rbac);
  }

  @Post('ciclos')
  @RequirePermission('planta.ciclos.crear')
  createCiclo(
    @Body() createCicloDto: CreateCicloDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.plantaService.createCiclo(createCicloDto, request.user.id, request.rbac);
  }


  @Patch('ciclos/:id/autorizar-reproceso')
  @RequirePermission('planta.reprocesos.registrar')
  autorizarReproceso(@Param('id', ParseIntPipe) id: number, @Body() dto: AutorizarReprocesoDto, @Req() request: AuthenticatedRequest) {
    return this.plantaService.autorizarReproceso(id, dto, request.user.id, request.rbac);
  }
}
