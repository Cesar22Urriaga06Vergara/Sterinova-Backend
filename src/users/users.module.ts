import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { PasswordResetToken } from './entities/password-reset-token.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { RbacModule } from '../rbac/rbac.module.js';
import { UserRolesController } from './user-roles.controller.js';
import { UserRolesService } from './user-roles.service.js';
import { AuditoriaModule } from '../auditoria/auditoria.module.js';
import { PasswordResetService } from './password-reset.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordResetToken]), RbacModule, AuditoriaModule],
  controllers: [UsersController, UserRolesController],
  providers: [UsersService, UserRolesService, PasswordResetService],
  exports: [UsersService, PasswordResetService],
})
export class UsersModule {}
