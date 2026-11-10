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
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  RequirePermission,
  ScopedPermissions,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { SolicitudAnulacionService } from './solicitud-anulacion.service.js';
import {
  CrearSolicitudAnulacionDto,
  ResolverSolicitudAnulacionDto,
} from './dto/solicitud-anulacion.dto.js';

// Authentication and authorization are enforced by AppModule's global guards.
@Controller()
@ApiTags('Solicitudes de anulación')
@ApiHeader({
  name: 'x-scope-id',
  required: false,
  description: 'Restringe la operación al ámbito autorizado seleccionado',
  schema: { type: 'integer', minimum: 1 },
})
@ScopedPermissions()
export class SolicitudAnulacionController {
  constructor(private readonly service: SolicitudAnulacionService) {}

  @Post('cotizaciones/:id/solicitud-anulacion')
  @RequirePermission('solicitudes_anulacion.crear')
  @ApiOperation({
    summary: 'Solicitar anulación de una cotización aprobada o emitida',
  })
  crear(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CrearSolicitudAnulacionDto,
    @Req() request: RbacRequest,
  ) {
    return this.service.crearSolicitud(
      id,
      request.user.id,
      dto.motivo,
      request.headers?.['x-scope-id'],
    );
  }

  @Get('solicitudes-anulacion/pendientes')
  @RequirePermission('solicitudes_anulacion.ver')
  @ApiOperation({
    summary: 'Consultar solicitudes pendientes de los ámbitos administrados',
  })
  pendientes(@Req() request: RbacRequest) {
    return this.service.obtenerPendientes(
      request.user.id,
      request.headers?.['x-scope-id'],
    );
  }

  @Patch('solicitudes-anulacion/:id/resolver')
  @RequirePermission('solicitudes_anulacion.aprobar')
  @ApiOperation({ summary: 'Aprobar o rechazar una solicitud de anulación' })
  resolver(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResolverSolicitudAnulacionDto,
    @Req() request: RbacRequest,
  ) {
    return this.service.resolverSolicitud(
      id,
      request.user.id,
      dto.estado,
      dto.observacion,
      request.headers?.['x-scope-id'],
    );
  }
}
