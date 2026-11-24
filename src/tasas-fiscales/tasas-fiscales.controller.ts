import { Body, Controller, Get, Header, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  RequirePermission,
  ScopedPermissions,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { TasasFiscalesService } from './tasas-fiscales.service.js';
import { PublishIvaDto } from './dto/publish-iva.dto.js';

@Controller('tasas-fiscales/iva')
@ApiTags('Tasas fiscales')
@ScopedPermissions()
export class TasasFiscalesController {
  constructor(private readonly service: TasasFiscalesService) {}
  @Get()
  @Header('Cache-Control', 'private, no-store')
  @RequirePermission('tasas_fiscales.gestionar')
  history(@Req() request: RbacRequest) {
    return this.service.history(request.rbac);
  }

  @Post()
  @RequirePermission('tasas_fiscales.gestionar')
  publish(@Body() dto: PublishIvaDto, @Req() request: RbacRequest) {
    return this.service.publish(dto, request.rbac);
  }
}
