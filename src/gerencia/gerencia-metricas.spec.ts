import {
  metricWindow,
  metricScopeIds,
  sumMoney,
  verifyMetricTimezone,
} from './metricas-policy.js';
import { GerenciaMetricasService } from './gerencia-metricas.service.js';

const access = {
  permission: 'gerencia.metricas.ver',
  policy: { userId: 7, scopeIds: [1, 2, 3], ownScopeIds: [] },
  resourceScopeIds: [2, 3],
} as const;
const timezoneRow = (params: Date[]) => [
  Object.fromEntries(params.map((date, i) => [`t${i}`, date.getTime() / 1000])),
];
describe('gerencia metrics', () => {
  it('uses the civil day in Bogota and inclusive end dates', () => {
    expect(metricWindow({}, new Date('2026-11-14T03:00:00Z'))).toEqual({
      desde: '2026-11-13',
      hasta: '2026-11-13',
      fin: '2026-11-14',
      dias: ['2026-11-13'],
    });
    expect(
      metricWindow({ desde: '2026-11-12', hasta: '2026-11-13' }).dias,
    ).toEqual(['2026-11-12', '2026-11-13']);
  });
  it.each([
    { desde: '2026-02-30' },
    { desde: '2026-11-14', hasta: '2026-11-13' },
    { desde: '2024-01-01', hasta: '2026-01-01' },
  ])('rejects invalid periods: %j', (query) => {
    expect(() => metricWindow(query)).toThrow();
  });
  it('never expands scopes or treats OWN as managerial access', () => {
    expect(metricScopeIds(access as never, 2)).toEqual([2]);
    expect(() => metricScopeIds(access as never, 4)).toThrow();
    expect(() =>
      metricScopeIds({
        ...access,
        policy: { userId: 7, scopeIds: [], ownScopeIds: [2] },
      } as never),
    ).toThrow();
    expect(() =>
      metricScopeIds({ ...access, permission: 'cotizaciones.ver' } as never),
    ).toThrow();
  });
  it('sums money exactly beyond JavaScript integer precision', () => {
    expect(sumMoney(['999999999999.99', '0.01', '10.10'])).toBe(
      '1000000000010.10',
    );
  });
  it('returns a zero-filled trend and separates quoted and issued amounts', async () => {
    const manager = {
      query: vi.fn(async (sql, params) =>
        sql.startsWith('SELECT UNIX_TIMESTAMP')
          ? timezoneRow(params)
          : [
              {
                dia: '2026-11-12',
                indicador: 'cotizaciones_creadas',
                cantidad: '2',
                importe: '0.30',
              },
              {
                dia: '2026-11-12',
                indicador: 'cotizaciones_emitidas',
                cantidad: '1',
                importe: '0.10',
              },
              {
                dia: '2026-11-13',
                indicador: 'cotizaciones_creadas',
                cantidad: '1',
                importe: '0.10',
              },
            ],
      ),
    };
    const source = {
      transaction: vi.fn(async (_level, work) => work(manager)),
    };
    const service = new GerenciaMetricasService(source as never);
    const result = await service.resumen(
      { desde: '2026-11-12', hasta: '2026-11-13' },
      access as never,
    );
    expect(result.totales.cotizaciones_creadas).toEqual({
      cantidad: 3,
      importe: '0.40',
    });
    expect(result.totales.cotizaciones_emitidas).toEqual({
      cantidad: 1,
      importe: '0.10',
    });
    expect(result.serie[1].cotizaciones_emitidas).toEqual({
      cantidad: 0,
      importe: '0.00',
    });
    expect(result).not.toHaveProperty('ingresos');
    expect(manager.query.mock.calls).toHaveLength(2);
  });
  it('denies an unauthorized scope before querying data', async () => {
    const source = { transaction: vi.fn() };
    await expect(
      new GerenciaMetricasService(source as never).resumen(
        { scope_id: 99 },
        access as never,
      ),
    ).rejects.toMatchObject({ status: 403 });
    expect(source.transaction).not.toHaveBeenCalled();
  });
  it('adds multiple states within a day and keeps current pending work separate from period activity', async () => {
    const manager = {
      query: vi.fn(async (sql, params) =>
        sql.startsWith('SELECT UNIX_TIMESTAMP')
          ? timezoneRow(params)
          : [
              {
                dia: '2026-11-13',
                indicador: 'cotizaciones_creadas',
                estado: 'Borrador',
                cantidad: 2,
                importe: '0.20',
              },
              {
                dia: '2026-11-13',
                indicador: 'cotizaciones_creadas',
                estado: 'APROBADA',
                cantidad: 1,
                importe: '0.10',
              },
              {
                dia: null,
                indicador: 'calidad_por_revisar',
                cantidad: 5,
                importe: '0.00',
              },
            ],
      ),
    };
    const service = new GerenciaMetricasService({
      transaction: async (_level, work) => work(manager),
    } as never);
    const result = await service.resumen(
      { desde: '2026-11-13', hasta: '2026-11-13' },
      access as never,
    );
    expect(result.totales.cotizaciones_creadas).toEqual({
      cantidad: 3,
      importe: '0.30',
    });
    expect(result.pendientes_actuales.calidad_por_revisar).toBe(5);
    expect(result.por_estado.cotizaciones_creadas).toEqual({
      Borrador: 2,
      APROBADA: 1,
    });
  });
  it('uses the same scope and inclusive period in detail count and page queries', async () => {
    const query = vi
      .fn()
      .mockImplementationOnce(async (_sql, params) => timezoneRow(params))
      .mockResolvedValueOnce([{ total: 1 }])
      .mockResolvedValueOnce([{ id: 4, importe: '20.10' }]);
    const source = {
      transaction: vi.fn(async (_level, work) => work({ query })),
    };
    const result = await new GerenciaMetricasService(source as never).detalle(
      {
        desde: '2026-11-13',
        hasta: '2026-11-13',
        scope_id: 2,
        indicador: 'cotizaciones_emitidas',
        page: 2,
        limit: 10,
      },
      access as never,
    );
    expect(result).toEqual({
      data: [{ id: 4, importe: '20.10' }],
      total: 1,
      page: 2,
      limit: 10,
    });
    expect(query.mock.calls[1][1]).toEqual([
      2,
      new Date('2026-11-13T05:00:00Z'),
      new Date('2026-11-14T05:00:00Z'),
    ]);
    expect(query.mock.calls[2][1]).toEqual([...query.mock.calls[1][1], 10, 10]);
    expect(query.mock.calls[2][0]).not.toContain('password');
  });
  it('provides a current pending detail without silently applying the activity period', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce([{ total: 1 }])
      .mockResolvedValueOnce([{ id: 8 }]);
    const service = new GerenciaMetricasService({
      transaction: async (_level, work) => work({ query }),
    } as never);
    const result = await service.detalle(
      { indicador: 'calidad_por_revisar', scope_id: 2 } as never,
      access as never,
    );
    expect(result.total).toBe(1);
    expect(query.mock.calls[0][1]).toEqual([2]);
  });
  it('rejects mismatched application and SQL timezones instead of returning a misleading day', async () => {
    const manager = {
      query: vi.fn(async () => [
        { t0: Date.parse('2026-11-13T00:00:00Z') / 1000 },
      ]),
    };
    await expect(
      verifyMetricTimezone(manager as never, [
        new Date('2026-11-13T05:00:00Z'),
      ]),
    ).rejects.toMatchObject({ status: 409 });
  });
  it('accepts matching timezone serialization, including fractional epoch strings', async () => {
    const instant = new Date('2026-11-13T05:00:00Z');
    await expect(
      verifyMetricTimezone(
        {
          query: async () => [{ t0: `${instant.getTime() / 1000}.000000` }],
        } as never,
        [instant],
      ),
    ).resolves.toBeUndefined();
  });
});
