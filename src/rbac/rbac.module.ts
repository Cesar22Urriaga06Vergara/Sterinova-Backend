import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { AuthorizationGuard, PermissionGuard } from './authorization.guard.js';
import { RbacAuthorizationService } from './rbac-authorization.service.js';

@Module({
  providers: [
    RolesGuard,
    PermissionGuard,
    AuthorizationGuard,
    RbacAuthorizationService,
  ],
  exports: [AuthorizationGuard, RbacAuthorizationService],
})
export class RbacModule {}
