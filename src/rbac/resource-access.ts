import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { In, type FindOptionsWhere, type ObjectLiteral } from 'typeorm';
import type { PermissionContext } from './rbac-authorization.service.js';

/** SQL predicates: branches remain independent; empty grants always deny. */
export function resourceWhere<T extends ObjectLiteral>(context: PermissionContext, base: FindOptionsWhere<T> = {}, owner = 'creador_id'): FindOptionsWhere<T>[] {
  if (!context?.policy.userId) throw new ForbiddenException('Falta contexto de autorización');
  const { scopeIds, ownScopeIds, userId } = context.policy;
  const branches: FindOptionsWhere<T>[] = [];
  if (scopeIds.length) branches.push({ ...base, scope_id: In([...scopeIds]) } as FindOptionsWhere<T>);
  if (ownScopeIds.length) branches.push({ ...base, scope_id: In([...ownScopeIds]), [owner]: userId } as FindOptionsWhere<T>);
  if (!branches.length) throw new ForbiddenException('Sin ámbito autorizado');
  return branches;
}
/**
 * Ámbito de creación derivado del recurso, sin selector de área:
 * El recurso ancla (cliente/cotización/orden) conserva su ámbito; la cabecera
 * solo lo acota. Sin ancla: ámbito elegible único o DEPARTMENT único.
 */
export function creationScope(
  context: PermissionContext,
  anchorScopeId?: number | null,
): number {
  if (!context?.policy.userId) throw new ForbiddenException('Falta contexto de autorización');
  const permitted = [...context.policy.scopeIds, ...context.policy.ownScopeIds];
  const eligible = context.resourceScopeIds.filter((id) => permitted.includes(id));
  if (!eligible.length) throw new ForbiddenException('Sin ámbito autorizado');
  if (anchorScopeId != null) {
    if (
      !eligible.includes(anchorScopeId) ||
      (context.scopeId !== undefined && context.scopeId !== anchorScopeId)
    )
      throw new ForbiddenException(
        'El recurso pertenece a un ámbito donde no puedes crear',
      );
    return anchorScopeId;
  }
  if (context.scopeId !== undefined) {
    if (!eligible.includes(context.scopeId))
      throw new ForbiddenException('Ámbito de creación no autorizado');
    return context.scopeId;
  }
  if (eligible.length === 1) return eligible[0];
  const departments = (context.resourceScopes ?? []).filter(
    ({ id, kind }) => kind === 'DEPARTMENT' && eligible.includes(id),
  );
  if (departments.length === 1) return departments[0].id;
  throw new BadRequestException(
    'Varios ámbitos elegibles: el recurso no determina dónde crear',
  );
}
