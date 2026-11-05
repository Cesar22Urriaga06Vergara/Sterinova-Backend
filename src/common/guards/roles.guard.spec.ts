import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard.js';
import { UserRole } from '../../users/entities/user-role.enum.js';

describe('RolesGuard', () => {
  const createContext = (rol?: string) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ user: rol ? { rol } : undefined }) }),
    }) as unknown as ExecutionContext;

  it('allows endpoints without role metadata', () => {
    const reflector = { getAllAndOverride: vi.fn(() => undefined) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('allows a role declared for the endpoint', () => {
    const reflector = { getAllAndOverride: vi.fn(() => [UserRole.PLANTA]) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext(UserRole.PLANTA))).toBe(true);
  });

  it('allows Admin for every role-protected endpoint', () => {
    const reflector = { getAllAndOverride: vi.fn(() => [UserRole.PLANTA]) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext(UserRole.ADMIN))).toBe(true);
  });

  it('denies users whose role is not allowed', () => {
    const reflector = { getAllAndOverride: vi.fn(() => [UserRole.COMERCIAL]) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext(UserRole.PLANTA))).toBe(false);
  });
});
