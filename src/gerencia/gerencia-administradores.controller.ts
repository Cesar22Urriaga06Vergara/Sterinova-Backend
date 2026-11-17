import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ScopedPermissions,
  RequirePermission,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { GerenciaAdministradoresService } from './gerencia-administradores.service.js';
import {
  CrearAdministradorDto,
  AsignarAdministradorDto,
} from './dto/administrador.dto.js';

@ApiTags('Gerencia')
@Controller('gerencia/administradores')
@ScopedPermissions()
export class GerenciaAdministradoresController {
  constructor(
    private readonly administrators: GerenciaAdministradoresService,
  ) {}

  @Get('catalogo')
  @RequirePermission('gerencia.administradores.gestionar')
  catalogo(@Req() request: RbacRequest) {
    return this.administrators.catalogo(request.rbac);
  }

  @Get()
  @RequirePermission('gerencia.administradores.gestionar')
  listar(@Req() request: RbacRequest) {
    return this.administrators.listar(request.rbac);
  }

  @Post()
  @RequirePermission('gerencia.administradores.gestionar')
  @ApiOperation({
    summary:
      'Crear cuenta y asignación de administrador de área de forma atómica',
  })
  crear(@Body() dto: CrearAdministradorDto, @Req() request: RbacRequest) {
    return this.administrators.crear(dto, request.rbac);
  }

  @Post(':userId/asignaciones')
  @RequirePermission('gerencia.administradores.gestionar')
  asignar(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: AsignarAdministradorDto,
    @Req() request: RbacRequest,
  ) {
    return this.administrators.asignar(userId, dto, request.rbac);
  }

  @Delete(':userId/asignaciones/:assignmentId')
  @RequirePermission('gerencia.administradores.gestionar')
  @ApiOperation({
    summary:
      'Retirar solo esta pertenencia; conserva cuenta, otras áreas e historial',
  })
  retirar(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Req() request: RbacRequest,
  ) {
    return this.administrators.retirar(userId, assignmentId, request.rbac);
  }
}
