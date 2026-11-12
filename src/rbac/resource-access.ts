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
export function creationScope(context: PermissionContext): number {
  if (!context?.policy.userId) throw new ForbiddenException('Falta contexto de autorización');
  const ids = context.resourceScopeIds;
  if (ids.length !== 1) throw new BadRequestException('Selecciona un ámbito operativo autorizado');
  return ids[0];
}
