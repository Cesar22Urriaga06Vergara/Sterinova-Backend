import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../common/guards/roles.guard.js';
import {
  RbacAuthorizationService,
  type PermissionContext,
} from './rbac-authorization.service.js';
import {
  REQUIRED_PERMISSION_KEY,
  SCOPED_PERMISSIONS_KEY,
} from './require-permission.decorator.js';

export type RbacRequest = {
  user: { id: number };
  headers?: Record<string, string | string[] | undefined>;
  rbac: PermissionContext;
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorization: RbacAuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string>(
      REQUIRED_PERMISSION_KEY,
      context.getHandler(),
    );
    if (!permission)
      throw new ForbiddenException('Ruta RBAC sin permiso explícito');
    const request = context.switchToHttp().getRequest<RbacRequest>();
    if (!request.user?.id) throw new UnauthorizedException();
    request.rbac = await this.authorization.getContext(
      request.user.id,
      permission,
      request.headers?.['x-scope-id'],
    );
    return true;
  }
}

/** Temporary explicit dispatch: an RBAC denial is never retried against RolesGuard. */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly legacy: RolesGuard,
    private readonly permissions: PermissionGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scoped = this.reflector.getAllAndOverride<boolean>(
      SCOPED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (scoped === true) return this.permissions.canActivate(context);
    if (
      this.reflector.get(REQUIRED_PERMISSION_KEY, context.getHandler()) !==
      undefined
    )
      throw new ForbiddenException('Ruta RBAC sin controlador migrado');
    return this.legacy.canActivate(context);
  }
}
