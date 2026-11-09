export type ScopeKind = 'GLOBAL' | 'DEPARTMENT' | 'TEAM' | 'PLANT';
export type ResourceAccess = 'OWN' | 'SCOPE';

/** Trusted server-side projection, never a principal supplied by an HTTP client. */
export type AuthorizationScope = {
  id: number;
  parentId: number | null;
  kind: ScopeKind;
  active: boolean;
};

export type PermissionGrant = {
  permission: string;
  active: boolean;
  resourceAccess: ResourceAccess;
  includeDescendants: boolean;
};

export type RoleAssignment = {
  roleId: number;
  scopeId: number;
  active: boolean;
  roleActive: boolean;
  grants: readonly PermissionGrant[];
};

export type AuthorizationSubject = {
  userId: number;
  active: boolean;
  assignments: readonly RoleAssignment[];
};

/** SQL consumers must OR scopeIds with (ownScopeIds AND creator_id = userId). */
export type AuthorizationPolicy = {
  userId: number | null;
  scopeIds: readonly number[];
  ownScopeIds: readonly number[];
};

export type ScopedResource = {
  scopeId: number | null;
  creatorId?: number | null;
};
