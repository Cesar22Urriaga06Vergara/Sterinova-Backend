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
import { RequirePermission, ScopedPermissions } from '../require-permission.decorator.js';
import type { RbacRequest } from '../authorization.guard.js';
import { AmbitoService } from './ambito.service.js';
import {
  AmbitoResponse,
  CerrarAmbitoDto,
  CreateAmbitoDto,
  UpdateAmbitoDto,
} from './dtos.js';

@Controller('ambitos')
@ScopedPermissions()
export class AmbitoController {
  constructor(private readonly ambitos: AmbitoService) {}

  @Get()
  @RequirePermission('ambitos.gestionar')
  async listar(@Req() request: RbacRequest): Promise<AmbitoResponse[]> {
    return this.ambitos.listar(request.rbac);
  }

  @Get(':id')
  @RequirePermission('ambitos.gestionar')
  async obtener(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacRequest,
  ): Promise<AmbitoResponse> {
    return this.ambitos.obtener(id, request.rbac);
  }

  @Post()
  @RequirePermission('ambitos.gestionar')
  async crear(
    @Body() dto: CreateAmbitoDto,
    @Req() request: RbacRequest,
  ): Promise<AmbitoResponse> {
    return this.ambitos.crear(dto, request.user.id, request.rbac);
  }

  @Patch(':id')
  @RequirePermission('ambitos.gestionar')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmbitoDto,
    @Req() request: RbacRequest,
  ): Promise<AmbitoResponse> {
    return this.ambitos.actualizar(id, dto, request.user.id, request.rbac);
  }

  @Patch(':id/cerrar')
  @RequirePermission('ambitos.gestionar')
  async cerrar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CerrarAmbitoDto,
    @Req() request: RbacRequest,
  ): Promise<AmbitoResponse> {
    return this.ambitos.cerrar(id, dto, request.user.id, request.rbac);
  }

}
