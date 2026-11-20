import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Req } from '@nestjs/common';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import { ConductoresService } from './conductores.service.js';
import { SaveConductorDto } from './dto/save-conductor.dto.js';
@Controller('logistica/conductores') @ScopedPermissions()
export class ConductoresController {
  constructor(private readonly service: ConductoresService) {}
  @Get() @RequirePermission('logistica.ordenes.ver') list(@Req() r: RbacRequest) { return this.service.list(r.rbac); }
  @Post() @RequirePermission('logistica.ordenes.crear') create(@Body() d: SaveConductorDto, @Req() r: RbacRequest) { return this.service.create(d, r.rbac); }
  @Put(':id') @RequirePermission('logistica.ordenes.crear') update(@Param('id', ParseIntPipe) id: number, @Body() d: SaveConductorDto, @Req() r: RbacRequest) { return this.service.update(id, d, r.rbac); }
  @Patch(':id/estado') @RequirePermission('logistica.ordenes.cambiar_estado') state(@Param('id', ParseIntPipe) id: number, @Body('activo') activo: boolean, @Req() r: RbacRequest) { return this.service.setActive(id, activo, r.rbac); }
}
