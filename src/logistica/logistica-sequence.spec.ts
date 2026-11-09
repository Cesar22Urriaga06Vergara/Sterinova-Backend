import { LogisticaService } from './logistica.service.js';

it('rechaza una OS agotada antes de guardar, dentro de la transacción', async () => {
  const orders = {
    findOne: vi.fn(async () => null),
    save: vi.fn(),
    create: vi.fn(),
  };
  const sequences = {
    findOne: vi.fn(async () => ({ ultimo_valor: '99999999' })),
    save: vi.fn(),
  };
  const quotes = {
    findOne: vi.fn(async () => ({ id: 1, estado: 'APROBADA' })),
  };
  const manager = {
    query: vi.fn(),
    getRepository: (entity: { name: string }) =>
      entity.name === 'OrdenServicio'
        ? orders
        : entity.name === 'Cotizacion'
          ? quotes
          : sequences,
  };
  const source = { transaction: vi.fn(async (work) => work(manager)) };
  const service = new LogisticaService(
    orders as never,
    quotes as never,
    source as never,
    {} as never,
  );
  await expect(
    service.createOrden({ cotizacion_id: 1, fecha_programada: '2026-11-09' }),
  ).rejects.toMatchObject({ response: { code: 'CONSECUTIVO_AGOTADO' } });
  expect(source.transaction).toHaveBeenCalled();
  expect(orders.save).not.toHaveBeenCalled();
  expect(sequences.save).not.toHaveBeenCalled();
});
