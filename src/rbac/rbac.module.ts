import { Module } from '@nestjs/common';
import { AuthorizationGuard, PermissionGuard } from './authorization.guard.js';
import { RbacAuthorizationService } from './rbac-authorization.service.js';

@Module({
  providers: [
    PermissionGuard,
    AuthorizationGuard,
    RbacAuthorizationService,
  ],
  exports: [AuthorizationGuard, RbacAuthorizationService],
})
export class RbacModule {}
