import { ForbiddenException } from '@nestjs/common';
import { In, type FindOptionsWhere } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { creationScope } from '../rbac/resource-access.js';
import type { PermissionCode } from '../rbac/permission-catalog.js';
import type { Cotizacion } from './entities/cotizacion.entity.js';

export function quoteWhere(
  access: PermissionContext,
  permission: PermissionCode,
  id?: number,
): FindOptionsWhere<Cotizacion>[] {
  if (
    !access ||
    access.permission !== permission ||
    !Number.isSafeInteger(access.policy.userId) ||
    Number(access.policy.userId) < 1
  )
    throw new ForbiddenException('Falta contexto autorizado de cotizaciones');
  const where: FindOptionsWhere<Cotizacion>[] = [];
  if (access.policy.scopeIds.length)
    where.push({
      ...(id === undefined ? {} : { id }),
      scope_id: In([...access.policy.scopeIds]),
    });
  if (access.policy.ownScopeIds.length)
    where.push({
      ...(id === undefined ? {} : { id }),
      scope_id: In([...access.policy.ownScopeIds]),
      creador_id: access.policy.userId!,
    });
  // An empty TypeORM where array could mean an unrestricted query: fail closed.
  if (!where.length) throw new ForbiddenException('Sin ámbitos autorizados');
  return where;
}

export function quoteCreationScope(
  access: PermissionContext,
  clienteScopeId?: number | null,
): number {
  quoteWhere(access, 'cotizaciones.crear');
  return creationScope(access, clienteScopeId);
}
