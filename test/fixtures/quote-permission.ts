import type { PermissionContext } from '../../src/rbac/rbac-authorization.service.js';

/** Business-service unit fixtures; HTTP and SQL isolation use real RBAC in integration tests. */
export function quotePermission(
  permission: PermissionContext['permission'],
  userId = 42,
): PermissionContext {
  return {
    permission,
    policy: { userId, scopeIds: [10], ownScopeIds: [] },
    resourceScopeIds: [10],
  };
}
