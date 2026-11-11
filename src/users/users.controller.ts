import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  GoneException,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto.js';
import { SetUserStatusDto } from './dto/set-user-status.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';
import { UserRolesService } from './user-roles.service.js';
import { PasswordResetService } from './password-reset.service.js';

type AuthenticatedRequest = RbacRequest;

@Controller('users')
@ScopedPermissions()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRoles: UserRolesService,
    private readonly passwordReset: PasswordResetService,
  ) {}

  @Get()
  @RequirePermission('usuarios.ver')
  async findAll(@Req() request: AuthenticatedRequest) {
    return this.usersService.findAll(request.rbac);
  }

  @Post()
  @RequirePermission('usuarios.identidad.gestionar')
  async create(@Body() dto: CreateUserDto, @Req() request: AuthenticatedRequest) {
    await this.userRoles.authorizeIdentity(request.user.id, request.rbac);
    await this.userRoles.authorize(request.user.id);
    if (!dto.role_id || !dto.scope_id) throw new BadRequestException('Selecciona un perfil RBAC y su ámbito');
    // An incomplete creation stays disabled and cannot grant legacy access.
    const user = await this.usersService.create(dto, false);
    await this.userRoles.assign(request.user.id, user.id, { role_id: dto.role_id, scope_id: dto.scope_id });
    return this.usersService.setActive(user.id, true, request.user.id);
  }

  @Patch(':id')
  @RequirePermission('usuarios.identidad.gestionar')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Req() request: AuthenticatedRequest) {
    await this.userRoles.authorizeIdentity(request.user.id, request.rbac);
    if (dto.rol !== undefined) throw new BadRequestException('El rol de compatibilidad se deriva de las asignaciones RBAC. Usa la gestión de Roles.');
    return this.usersService.update(id, dto);
  }

  @Patch(':id/password')
  @RequirePermission('usuarios.identidad.gestionar')
  changePassword(): never {
    throw new GoneException(
      'El cambio administrativo directo fue retirado; usa el restablecimiento de un solo uso',
    );
  }

  @Patch(':id/password/reset')
  @RequirePermission('usuarios.identidad.gestionar')
  @Header('Cache-Control', 'no-store')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.userRoles.authorizePasswordReset(
      request.user.id,
      id,
      request.rbac,
    );
    return this.passwordReset.requestReset(id, request.user.id);
  }

  @Patch(':id/status')
  @RequirePermission('usuarios.identidad.gestionar')
  async setActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetUserStatusDto,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.userRoles.authorizeIdentity(request.user.id, request.rbac);
    return this.usersService.setActive(id, dto.activo, request.user.id);
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Eliminación de identidades denegada. Usar PATCH /users/:id/status para desactivar.' })
  // No permission is granted for identity deletion. The scoped guard denies this route.
  async deactivate(
    @Param('id', ParseIntPipe) _id: number,
    @Req() _request: AuthenticatedRequest,
  ) {
    throw new ForbiddenException('La eliminación de identidades no está autorizada; usa el cambio de estado');
  }
}
