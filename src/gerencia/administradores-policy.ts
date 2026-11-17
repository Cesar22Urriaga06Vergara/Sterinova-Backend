import { ForbiddenException } from '@nestjs/common';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';

export const AREA_ADMIN_CODES = [
  'admin_comercial',
  'admin_logistica',
  'admin_planta',
  'admin_calidad',
  'admin_lavanderia',
] as const;

export function assertManagementContext(
  access: PermissionContext,
  actorId: number,
) {
  if (
    access?.permission !== 'gerencia.administradores.gestionar' ||
    !Number.isSafeInteger(actorId) ||
    actorId < 1 ||
    access.policy.userId !== actorId ||
    !access.policy.scopeIds.length
  )
    throw new ForbiddenException(
      'Se requiere gestión gerencial de administradores',
    );
}

export function assertAreaAdministrator(
  role: { code: string; kind: string; active: boolean },
  scope: { id: number; kind: string; active: boolean },
  access: PermissionContext,
) {
  assertManagementContext(access, Number(access.policy.userId));
  if (
    !role.active ||
    role.kind !== 'STANDARD' ||
    !AREA_ADMIN_CODES.some((code) => code === role.code)
  )
    throw new ForbiddenException(
      'Solo se pueden delegar perfiles administradores de área',
    );
  const validKind =
    scope.kind === 'DEPARTMENT' ||
    (scope.kind === 'PLANT' &&
      ['admin_planta', 'admin_lavanderia'].includes(role.code));
  if (
    !scope.active ||
    !validKind ||
    !access.resourceScopeIds.includes(scope.id) ||
    !access.policy.scopeIds.includes(scope.id)
  )
    throw new ForbiddenException('Área no autorizada para este administrador');
}
