import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ScopedPermissions,
  RequirePermission,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { GerenciaMetricasService } from './gerencia-metricas.service.js';
import {
  MetricasQueryDto,
  DetalleMetricasQueryDto,
} from './dto/metricas-query.dto.js';

@ApiTags('Gerencia')
@Controller('gerencia')
@ScopedPermissions()
export class GerenciaController {
  constructor(private readonly metrics: GerenciaMetricasService) {}

  @Get('resumen')
  @RequirePermission('gerencia.metricas.ver')
  @ApiOperation({
    summary:
      'Resumen y serie diaria gerencial; importes cotizados y emitidos, sin ingresos cobrados',
  })
  resumen(@Query() query: MetricasQueryDto, @Req() request: RbacRequest) {
    return this.metrics.resumen(query, request.rbac);
  }

  @Get('detalle')
  @RequirePermission('gerencia.metricas.ver')
  @ApiOperation({
    summary:
      'Detalle paginado de un indicador usando las mismas fechas y ámbitos del resumen',
  })
  detalle(
    @Query() query: DetalleMetricasQueryDto,
    @Req() request: RbacRequest,
  ) {
    return this.metrics.detalle(query, request.rbac);
  }
}
