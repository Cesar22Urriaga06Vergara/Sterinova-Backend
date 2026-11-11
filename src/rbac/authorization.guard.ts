import { IS_PUBLIC_KEY } from '../auth/decorators/public.decorator.js';
import { ROLES_KEY } from '../common/decorators/roles.decorator.js';
import { SESSION_REQUIRED_KEY } from './require-session.decorator.js';
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
    if (!Number.isSafeInteger(request.user?.id) || request.user.id < 1)
      throw new UnauthorizedException();
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
    const targets = [context.getHandler(), context.getClass()];
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets) === true
    )
      return true;
    if (
      this.reflector.getAllAndOverride<boolean>(
        SESSION_REQUIRED_KEY,
        targets,
      ) === true
    ) {
      const { user } = context.switchToHttp().getRequest<RbacRequest>();
      if (!Number.isSafeInteger(user?.id) || user.id < 1)
        throw new UnauthorizedException();
      return true;
    }
    const roles = this.reflector.getAllAndOverride<unknown[]>(
      ROLES_KEY,
      targets,
    );
    if (!roles?.length)
      throw new ForbiddenException('Ruta sin política explícita');
    return this.legacy.canActivate(context);
  }
}
