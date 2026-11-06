import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('returns a live status without checking dependencies', async () => {
    const controller = new HealthController({} as never, {} as never, {} as never, {} as never, {} as never);

    expect(controller.live()).toEqual({ status: 'ok' });
  });

  it('registers database, storage, and PDF renderer checks for readiness', async () => {
    const checks: Array<() => Promise<unknown>> = [];
    const health = { check: vi.fn(async (indicators: Array<() => Promise<unknown>>) => {
      checks.push(...indicators);
      return { status: 'ok' };
    }) };
    const database = { pingCheck: vi.fn(() => ({ withTimeout: () => Promise.resolve({ database: { status: 'up' } }) })) };
    const indicator = { check: vi.fn((key: string) => ({
      attempt: (fn: () => Promise<unknown>) => ({ withTimeout: () => fn().then(() => ({ [key]: { status: 'up' } })) }),
    })) };
    const storage = { healthCheck: vi.fn().mockResolvedValue(undefined) };
    const renderer = { healthCheck: vi.fn().mockResolvedValue(undefined) };
    const controller = new HealthController(health as never, database as never, indicator as never, storage as never, renderer as never);

    await controller.ready();
    await Promise.all(checks.map((check) => check()));

    expect(database.pingCheck).toHaveBeenCalledWith('database');
    expect(storage.healthCheck).toHaveBeenCalledOnce();
    expect(renderer.healthCheck).toHaveBeenCalledOnce();
  });
});
