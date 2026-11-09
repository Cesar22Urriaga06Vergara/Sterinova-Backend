import { isPermissionCode } from './permission-catalog.js';
import type {
  AuthorizationPolicy,
  AuthorizationScope,
  AuthorizationSubject,
  ScopedResource,
} from './authorization.types.js';

const isId = (id: number): boolean => Number.isSafeInteger(id) && id > 0;

/** Reject malformed hierarchies rather than interpreting disconnected nodes as global. */
function buildScopePaths(
  scopes: readonly AuthorizationScope[],
): Map<number, AuthorizationScope[]> | null {
  const nodes = new Map(scopes.map((scope) => [scope.id, scope]));
  if (
    nodes.size !== scopes.length ||
    scopes.filter(({ kind }) => kind === 'GLOBAL').length !== 1
  )
    return null;
  const paths = new Map<number, AuthorizationScope[]>();
  for (const scope of scopes) {
    const path: AuthorizationScope[] = [];
    const visited = new Set<number>();
    let current: AuthorizationScope | undefined = scope;
    while (current) {
      if (!isId(current.id) || visited.has(current.id)) return null;
      visited.add(current.id);
      path.push(current);
      if (current.parentId === null) {
        if (current.kind !== 'GLOBAL') return null;
        break;
      }
      if (current.kind === 'GLOBAL') return null;
      current = nodes.get(current.parentId);
      if (!current) return null;
    }
    paths.set(scope.id, path);
  }
  return paths;
}

export function compileAuthorizationPolicy(
  subject: AuthorizationSubject | null,
  permission: string,
  scopes: readonly AuthorizationScope[],
): AuthorizationPolicy {
  const userId =
    subject?.active === true && isId(subject.userId) ? subject.userId : null;
  const denied: AuthorizationPolicy = { userId, scopeIds: [], ownScopeIds: [] };
  if (userId === null || !subject || !isPermissionCode(permission))
    return denied;
  const paths = buildScopePaths(scopes);
  if (!paths) return denied;

  const scopeIds = new Set<number>();
  const ownScopeIds = new Set<number>();
  for (const assignment of subject.assignments) {
    if (
      assignment.active !== true ||
      assignment.roleActive !== true ||
      !isId(assignment.roleId)
    )
      continue;
    const assignmentPath = paths.get(assignment.scopeId);
    if (!assignmentPath?.every((scope) => scope.active === true)) continue;
    for (const grant of assignment.grants) {
      if (grant.permission !== permission || grant.active !== true) continue;
      if (grant.resourceAccess !== 'OWN' && grant.resourceAccess !== 'SCOPE')
        continue;
      const target = grant.resourceAccess === 'OWN' ? ownScopeIds : scopeIds;
      for (const [scopeId, path] of paths) {
        if (!path.every((scope) => scope.active === true)) continue;
        if (
          scopeId === assignment.scopeId ||
          (grant.includeDescendants === true &&
            path.some((scope) => scope.id === assignment.scopeId))
        ) {
          target.add(scopeId);
        }
      }
    }
  }
  return {
    userId,
    scopeIds: [...scopeIds].sort((a, b) => a - b),
    ownScopeIds: [...ownScopeIds]
      .filter((id) => !scopeIds.has(id))
      .sort((a, b) => a - b),
  };
}

export function canAccessResource(
  policy: AuthorizationPolicy,
  resource: ScopedResource,
): boolean {
  if (
    policy.userId === null ||
    !isId(policy.userId) ||
    resource.scopeId === null ||
    !isId(resource.scopeId)
  )
    return false;
  return (
    policy.scopeIds.includes(resource.scopeId) ||
    (resource.creatorId === policy.userId &&
      policy.ownScopeIds.includes(resource.scopeId))
  );
}
