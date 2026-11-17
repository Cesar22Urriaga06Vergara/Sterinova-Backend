import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Req,
} from '@nestjs/common';
import { RecepcionService } from './recepcion.service.js';
import { CreateRecepcionDto } from './dto/create-recepcion.dto.js';
import { UpdateRecepcionEstadoDto } from './dto/update-recepcion-estado.dto.js';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';

@Controller('logistica')
@ScopedPermissions()
export class RecepcionController {
  constructor(private readonly recepcionService: RecepcionService) {}

  @Post('ordenes/:id/recepcion')
  @RequirePermission('logistica.recepciones.registrar')
  createRecepcion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRecepcionDto,
    @Req() request: RbacRequest,
  ) {
    return this.recepcionService.createRecepcion(
      id,
      dto,
      request.user.id,
      request.rbac,
    );
  }

  @Get('recepciones')
  @RequirePermission('logistica.ordenes.ver')
  findAllRecepciones(@Req() request: RbacRequest) {
    return this.recepcionService.findAllRecepciones(request.rbac);
  }

  @Get('ordenes/:id/recepcion')
  @RequirePermission('logistica.ordenes.ver')
  findRecepcionByOrden(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacRequest,
  ) {
    return this.recepcionService.findRecepcionByOrden(id, request.rbac);
  }

  @Patch('ordenes/:id/recepcion/estado')
  @RequirePermission('logistica.recepciones.registrar')
  updateRecepcionEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecepcionEstadoDto,
    @Req() request: RbacRequest,
  ) {
    return this.recepcionService.updateRecepcionEstado(
      id,
      dto,
      request.user.id,
      request.rbac,
    );
  }
}
