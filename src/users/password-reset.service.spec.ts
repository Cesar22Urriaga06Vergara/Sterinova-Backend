import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { PasswordResetToken } from './entities/password-reset-token.entity.js';
import { PasswordResetService } from './password-reset.service.js';

describe('PasswordResetService', () => {
  function fixture(userId = 42, active = true) {
    const user = {
      id: userId,
      email: `user-${userId}@example.com`,
      activo: active,
      password_hash: 'existing-hash',
      password_version: 3,
    } as User;
    const tokens: PasswordResetToken[] = [];
    const audits: Record<string, unknown>[] = [];
    const userRepository = {
      findOne: vi.fn(async ({ where }: { where: { id: number } }) =>
        where.id === user.id ? user : null,
      ),
      save: vi.fn(async (value: User) => value),
    };
    const tokenRepository = {
      create: vi.fn((value: Partial<PasswordResetToken>) => value),
      save: vi.fn(async (value: PasswordResetToken) => {
        const existing = tokens.find((entry) => entry.id === value.id);
        if (existing) Object.assign(existing, value);
        else {
          value.id = tokens.length + 1;
          tokens.push(value);
        }
        return value;
      }),
      findOne: vi.fn(async ({ where }: { where: { token_hash: string } }) =>
        tokens.find((entry) => entry.token_hash === where.token_hash && entry.used_at === null) ?? null,
      ),
      update: vi.fn(async (where: { user_id: number }, values: { used_at: Date }) => {
        for (const entry of tokens) {
          if (entry.user_id === where.user_id && entry.used_at === null) {
            entry.used_at = values.used_at;
          }
        }
      }),
    };
    const manager = {
      getRepository: (entity: unknown) =>
        entity === User ? userRepository : tokenRepository,
    };
    const dataSource = {
      transaction: vi.fn(async (work: (manager: unknown) => unknown) => work(manager)),
    };
    const auditoria = {
      create: vi.fn(async (entry: Record<string, unknown>) => {
        audits.push(entry);
      }),
    };
    return {
      service: new PasswordResetService(dataSource as never, auditoria as never),
      user,
      tokens,
      audits,
      userRepository,
      tokenRepository,
      dataSource,
    };
  }

  it('issues a short-lived opaque token and stores only its hash', async () => {
    const { service, tokens, audits } = fixture();

    const result = await service.requestReset(42, 9);

    expect(result.reset_token).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(result.expires_at.getTime()).toBeGreaterThan(Date.now());
    expect(result.expires_at.getTime()).toBeLessThanOrEqual(Date.now() + 15 * 60 * 1000);
    expect(tokens[0].token_hash).not.toBe(result.reset_token);
    expect(tokens[0].created_by).toBe(9);
    expect(audits[0].detalle).not.toHaveProperty('token');
  });

  it('changes the password and version once, then rejects token reuse', async () => {
    const { service, user, tokens, audits, userRepository } = fixture();
    const issued = await service.requestReset(42, 9);

    await expect(service.completeReset(issued.reset_token, 'NuevaClaveSegura2026!'))
      .resolves.toEqual({ actualizado: true });

    expect(await bcrypt.compare('NuevaClaveSegura2026!', user.password_hash)).toBe(true);
    expect(user.password_version).toBe(4);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(tokens[0].used_at).toBeInstanceOf(Date);
    expect(audits.map((entry) => (entry.detalle as { motivo: string }).motivo)).toEqual([
      'restablecimiento_solicitado',
      'restablecimiento_completado',
    ]);
    await expect(service.completeReset(issued.reset_token, 'OtraClaveSegura2026!'))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('allows only one concurrent reset to consume a token', async () => {
    const { service, tokens, tokenRepository, dataSource } = fixture();
    const issued = await service.requestReset(42, 9);
    let transactionTail = Promise.resolve();

    dataSource.transaction.mockImplementation(async (work) => {
      const previous = transactionTail;
      let release!: () => void;
      transactionTail = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      try {
        return await work({
          getRepository: (entity: unknown) =>
            entity === User
              ? {
                  findOne: vi.fn(async () => ({
                    id: 42,
                    activo: true,
                    password_version: 3,
                  })),
                  save: vi.fn(async (user: Partial<User>) => user),
                }
              : tokenRepository,
        });
      } finally {
        release();
      }
    });

    const results = await Promise.allSettled([
      service.completeReset(issued.reset_token, 'PrimeraClaveSegura2026!'),
      service.completeReset(issued.reset_token, 'SegundaClaveSegura2026!'),
    ]);

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    const rejected = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );
    expect(rejected?.reason).toBeInstanceOf(UnauthorizedException);
    expect(tokens[0].used_at).toBeInstanceOf(Date);
    expect(tokenRepository.findOne).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ lock: { mode: 'pessimistic_write' } }),
    );
    expect(tokenRepository.findOne).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ lock: { mode: 'pessimistic_write' } }),
    );
  });

  it('does not consume a reset token for protected user ID 1', async () => {
    const { service, user, tokens, userRepository } = fixture();
    const issued = await service.requestReset(42, 9);
    user.id = 1;
    tokens[0].user_id = 1;

    await expect(
      service.completeReset(issued.reset_token, 'IntentoClaveSegura2026!'),
    ).rejects.toMatchObject({ status: 401 });

    expect(userRepository.save).not.toHaveBeenCalled();
    expect(tokens[0].used_at).toBeNull();
  });

  it('invalidates an older active link when a new one is issued', async () => {
    const { service, tokens } = fixture();
    const first = await service.requestReset(42, 9);
    const second = await service.requestReset(42, 9);

    await expect(service.completeReset(first.reset_token, 'ClaveAntigua2026!'))
      .rejects.toBeInstanceOf(UnauthorizedException);
    await expect(service.completeReset(second.reset_token, 'ClaveNueva2026!'))
      .resolves.toEqual({ actualizado: true });
    expect(tokens.every((entry) => entry.used_at instanceof Date)).toBe(true);
  });

  it('rejects expired links with the same safe response as unknown or reused links', async () => {
    const { service, tokens } = fixture();
    const issued = await service.requestReset(42, 9);
    tokens[0].expires_at = new Date(Date.now() - 1);

    await expect(service.completeReset(issued.reset_token, 'ClaveSegura2026!'))
      .rejects.toMatchObject({
        status: 401,
        response: { message: 'Enlace inválido o expirado' },
      });
  });

  it('rejects reset initiation for the protected ID 1 and inactive accounts', async () => {
    const protectedAccount = fixture(1);
    await expect(protectedAccount.service.requestReset(1, 9))
      .rejects.toMatchObject({ status: 403 });
    expect(protectedAccount.dataSource.transaction).not.toHaveBeenCalled();

    const inactiveAccount = fixture(42, false);
    await expect(inactiveAccount.service.requestReset(42, 9))
      .rejects.toMatchObject({ status: 403 });
    expect(inactiveAccount.tokens).toHaveLength(0);
  });

  it('does not disclose whether an expired or malformed link exists', async () => {
    const { service } = fixture();

    await expect(service.completeReset('not-a-valid-reset-token', 'ClaveSegura2026!'))
      .rejects.toMatchObject({
        status: 401,
        response: { message: 'Enlace inválido o expirado' },
      });
  });
});
