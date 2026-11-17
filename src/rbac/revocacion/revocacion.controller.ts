import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { RequirePermission, ScopedPermissions } from '../require-permission.decorator.js';
import type { RbacRequest } from '../authorization.guard.js';
import { RevocacionService } from '../revocacion.service.js';
import {
  RevocacionResponse,
  RevocarAsignacionesDto,
  RevocarAsignacionDto,
} from './dtos.js';

@Controller('revocacion')
@ScopedPermissions()
export class RevocacionController {
  constructor(private readonly revocacion: RevocacionService) {}

  @Post('usuario/:usuarioId')
  @RequirePermission('usuarios.identidad.gestionar')
  async revocarAsignacionesUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() dto: RevocarAsignacionesDto,
    @Req() request: RbacRequest,
  ): Promise<RevocacionResponse> {
    const resultado = await this.revocacion.revocarAsignacionesUsuario(
      usuarioId,
      request.user.id,
      request.rbac,
      dto.motivo,
    );
    return {
      usuarioId: resultado.usuarioId,
      versionAnterior: resultado.versionAnterior,
      versionNueva: resultado.versionNueva,
      asignacionesRevocadas: resultado.asignacionesRevocadas,
      motivo: resultado.motivo,
      fecha: resultado.fecha,
    };
  }

  @Post('asignacion')
  @RequirePermission('asignaciones.gestionar')
  async revocarAsignacionEspecifica(
    @Body() dto: RevocarAsignacionDto,
    @Req() request: RbacRequest,
  ): Promise<RevocacionResponse> {
    const resultado = await this.revocacion.revocarAsignacionEspecifica(
      dto.usuarioId,
      dto.asignacionId,
      request.user.id,
      request.rbac,
      dto.motivo,
    );
    return {
      usuarioId: resultado.usuarioId,
      versionAnterior: resultado.versionAnterior,
      versionNueva: resultado.versionNueva,
      asignacionesRevocadas: resultado.asignacionesRevocadas,
      motivo: resultado.motivo,
      fecha: resultado.fecha,
    };
  }

  @Get('historial/:usuarioId')
  @RequirePermission('usuarios.identidad.gestionar')
  async obtenerHistorial(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Req() request: RbacRequest,
  ) {
    return this.revocacion.obtenerHistorialRevocaciones(
      usuarioId,
      request.rbac,
    );
  }

}
