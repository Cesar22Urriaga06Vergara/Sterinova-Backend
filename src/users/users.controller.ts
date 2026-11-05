import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from './entities/user-role.enum.js';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { SetUserStatusDto } from './dto/set-user-status.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

type AuthenticatedRequest = { user: { id: number } };

@Controller('users')
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/password')
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeUserPasswordDto,
  ) {
    return this.usersService.changePassword(id, dto.password);
  }

  @Patch(':id/status')
  setActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetUserStatusDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.setActive(id, dto.activo, request.user.id);
  }

  @Delete(':id')
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.setActive(id, false, request.user.id);
  }
}
