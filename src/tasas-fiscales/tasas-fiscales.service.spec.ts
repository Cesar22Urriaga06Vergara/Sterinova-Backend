import { TasasFiscalesService } from './tasas-fiscales.service.js';
import { PublishIvaDto } from './tasas-fiscales.controller.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('Versioned IVA', () => {
  it.each(['-0.01', '1.01', '19', '0.1234567', 0.19, true, 'NaN'])(
    'rejects invalid administrator rate %s', async tasa => {
      const errors = await validate(plainToInstance(PublishIvaDto, { tasa, vigente_desde: '2070-01-01T00:00:00Z', motivo: 'Cambio controlado' }));
      expect(errors.some(error => error.property === 'tasa')).toBe(true);
    },
  );
  it('requires an explicit timezone and accepts zero tax', async () => {
    expect(await validate(plainToInstance(PublishIvaDto, { tasa: '0', vigente_desde: '2070-01-01T00:00:00-05:00', motivo: 'Cambio controlado' }))).toEqual([]);
    const errors = await validate(plainToInstance(PublishIvaDto, { tasa: '0', vigente_desde: '2070-01-01T00:00:00', motivo: 'Cambio controlado' }));
    expect(errors.some(error => error.property === 'vigente_desde')).toBe(true);
  });
  it('uses the current database rate and fails closed if no rate is configured', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce([{ id: 9, version: 2, tasa: '0.050000' }])
      .mockResolvedValueOnce([]);
    const service = new TasasFiscalesService({ manager: { query } } as never);
    await expect(service.current()).resolves.toMatchObject({
      id: 9,
      tasa: '0.050000',
    });
    await expect(service.current()).rejects.toMatchObject({ status: 503 });
    expect(query.mock.calls[0][0]).toContain('UTC_TIMESTAMP');
  });
  it('does not allow a department-level grant to modify global fiscal configuration', async () => {
    const service = new TasasFiscalesService({
      query: async () => [{ id: 1 }],
    } as never);
    await expect(
      service.history({
        permission: 'tasas_fiscales.gestionar',
        policy: { userId: 7, scopeIds: [2], ownScopeIds: [] },
      } as never),
    ).rejects.toMatchObject({ status: 403 });
  });
});
