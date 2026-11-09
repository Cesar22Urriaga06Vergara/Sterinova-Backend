import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { In, type FindOptionsWhere } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
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

export function quoteCreationScope(access: PermissionContext): number {
  quoteWhere(access, 'cotizaciones.crear');
  const permitted = [...access.policy.scopeIds, ...access.policy.ownScopeIds];
  const eligible = access.resourceScopeIds.filter((id) =>
    permitted.includes(id),
  );
  const selected =
    access.scopeId ?? (eligible.length === 1 ? eligible[0] : undefined);
  if (selected === undefined)
    throw new BadRequestException(
      'Seleccione un ámbito con x-scope-id para crear la cotización',
    );
  if (!eligible.includes(selected))
    throw new ForbiddenException('Ámbito de creación no autorizado');
  return selected;
}
