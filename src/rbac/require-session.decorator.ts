import { SetMetadata } from '@nestjs/common';
/** Session-only endpoints still pass through the global JWT guard. */
export const SESSION_REQUIRED_KEY = 'rbac:session-required';
export const RequireSession = () => SetMetadata(SESSION_REQUIRED_KEY, true);
