import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppController } from '../app.controller.js';
import { AuthController } from './auth.controller.js';
import { IS_PUBLIC_KEY } from './decorators/public.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { UserRole } from '../users/entities/user-role.enum.js';

describe('JWT authentication guard', () => {
  it.each(['login'] as const)(
    'allows the public auth route %s',
    (route) => {
      const guard = new JwtAuthGuard(new Reflector());
      const handler = AuthController.prototype[route];
      const context = {
        getHandler: () => handler,
        getClass: () => AuthController,
      } as ExecutionContext;

      expect(guard.canActivate(context)).toBe(true);
    },
  );

  it('does not expose the former public bootstrap route', () => {
    expect('seed' in AuthController.prototype).toBe(false);
  });

  it('does not mark non-auth controllers as public', () => {
    const reflector = new Reflector();

    expect(
      reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        AuthController.prototype.login,
        AuthController,
      ]),
    ).toBe(true);
    expect(
      reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        AppController.prototype.getHello,
        AppController,
      ]),
    ).toBeUndefined();
  });

  it('rejects login for deactivated users', async () => {
    const usersService = { findByEmail: vi.fn(async () => ({ activo: false })) };
    const authService = new AuthService(usersService as never, {} as never);

    await expect(authService.validateUser('off@example.com', 'password')).resolves.toBeNull();
  });

  it('rejects JWTs for deactivated users and uses the current database role', async () => {
    const usersService = { findActiveById: vi.fn(async (id: number) => id === 7 ? {
      id, email: 'admin@example.com', rol: UserRole.ADMIN, activo: true,
    } : null) };
    const configService = { get: vi.fn(() => 'jwt-secret-for-test-at-least-32-chars') };
    const strategy = new JwtStrategy(configService as never, usersService as never);

    await expect(strategy.validate({ sub: 7, email: 'stale@example.com', rol: UserRole.COMERCIAL }))
      .resolves.toMatchObject({ id: 7, email: 'admin@example.com', rol: UserRole.ADMIN });
    await expect(strategy.validate({ sub: 8, email: 'off@example.com', rol: UserRole.ADMIN }))
      .rejects.toMatchObject({ status: 401 });
  });

  it('fails to initialize when JWT_SECRET is missing', () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    try {
      const configService = { get: vi.fn(() => undefined) };
      const usersService = { findActiveById: vi.fn() };

      expect(() => new JwtStrategy(configService as never, usersService as never))
        .toThrow('JWT_SECRET is not defined in environment variables');
    } finally {
      if (originalSecret === undefined) {
        delete process.env.JWT_SECRET;
      } else {
        process.env.JWT_SECRET = originalSecret;
      }
    }
  });
});
