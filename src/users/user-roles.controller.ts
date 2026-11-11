import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import { UserRolesService } from './user-roles.service.js';
import { AssignUserRoleDto } from './dto/assign-user-role.dto.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';

@Controller('users')
@ScopedPermissions()
export class UserRolesController {
  constructor(private readonly roles: UserRolesService) {}

  @Get('role-catalog')
  @RequirePermission('asignaciones.gestionar')
  catalog(@Req() request: RbacRequest) { return this.roles.catalog(request.user.id, request.rbac); }

  @Get('role-assignments')
  @RequirePermission('asignaciones.gestionar')
  assignments(@Req() request: RbacRequest) { return this.roles.assignments(request.user.id, undefined, request.rbac); }

  @Post(':id/role-assignments')
  @RequirePermission('asignaciones.gestionar')
  assign(@Req() request: RbacRequest, @Param('id', ParseIntPipe) id: number, @Body() dto: AssignUserRoleDto) { return this.roles.assign(request.user.id, id, dto, request.rbac); }

  @Delete(':id/role-assignments/:assignmentId')
  @RequirePermission('asignaciones.gestionar')
  remove(@Req() request: RbacRequest, @Param('id', ParseIntPipe) id: number, @Param('assignmentId', ParseIntPipe) assignmentId: number) { return this.roles.remove(request.user.id, id, assignmentId, request.rbac); }
}
