import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiExtension } from '@nestjs/swagger';
import type { PermissionCode } from './permission-catalog.js';

export const SCOPED_PERMISSIONS_KEY = 'rbac:scoped-controller';
export const REQUIRED_PERMISSION_KEY = 'rbac:required-permission';
export const ScopedPermissions = () =>
  SetMetadata(SCOPED_PERMISSIONS_KEY, true);
export const RequirePermission = (permission: PermissionCode) =>
  applyDecorators(
    SetMetadata(REQUIRED_PERMISSION_KEY, permission),
    ApiBearerAuth(),
    ApiExtension('x-required-permission', permission),
  );
