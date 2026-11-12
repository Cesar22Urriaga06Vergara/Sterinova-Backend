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
    {
      resolveOrdenServicio: vi.fn().mockResolvedValue({ id: 1 }),
      resolveActaServicio: vi.fn().mockResolvedValue({ id: 2 }),
    } as never,
  );
  await expect(
    service.createOrden({ cotizacion_id: 1, fecha_programada: '2026-11-09' }),
  ).rejects.toMatchObject({ response: { code: 'CONSECUTIVO_AGOTADO' } });
  expect(source.transaction).toHaveBeenCalled();
  expect(orders.save).not.toHaveBeenCalled();
  expect(sequences.save).not.toHaveBeenCalled();
});

it('audits quantity discrepancies when creating a logistics order', async () => {
  let saved: Record<string, unknown>;
  const orders = {
    findOne: vi.fn(async ({ where }: { where: Record<string, number> }) =>
      where.cotizacion_id ? null : saved,
    ),
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => {
      saved = { id: 10, ...value };
      return saved;
    }),
  };
  const quotes = {
    findOne: vi.fn(async () => ({
      estado: 'APROBADA',
      tipo_servicio: 'INDUSTRIAL_ETO',
      scope_id: 2,
      creador_id: 3,
    })),
  };
  const cotizacionItems = {
    find: vi.fn(async () => [{ id: 5, descripcion: 'Bata', cantidad: 5 }]),
  };
  const sequences = { findOne: vi.fn(async () => ({ ultimo_valor: '0' })) };
  const materials = { insert: vi.fn() };
  const manager = {
    query: vi.fn(),
    getRepository: (entity: { name: string }) => {
      if (entity.name === 'OrdenServicio') return orders;
      if (entity.name === 'Cotizacion') return quotes;
      if (entity.name === 'CotizacionItem') return cotizacionItems;
      if (entity.name === 'OrdenServicioMaterial') return materials;
      return sequences;
    },
  };
  const source = { transaction: vi.fn(async (work) => work(manager)) };
  const auditoriaService = { create: vi.fn().mockResolvedValue(undefined) };
  const service = new LogisticaService(
    orders as never,
    quotes as never,
    source as never,
    auditoriaService as never,
    {
      resolveOrdenServicio: vi.fn().mockResolvedValue({ id: 1 }),
      resolveActaServicio: vi.fn().mockResolvedValue({ id: 2 }),
    } as never,
  );

  await service.createOrden(
    {
      cotizacion_id: 1,
      fecha_programada: '2026-11-09',
      materiales: [
        { cotizacion_item_id: 5, descripcion: 'Bata', cantidad: 7 },
      ],
    },
    42,
  );

  expect(auditoriaService.create).toHaveBeenCalledWith(
    {
      usuario_id: 42,
      entidad: 'orden_servicio',
      entidad_id: 10,
      accion: 'crear',
      detalle: {
        discrepancias_cantidad: [
          {
            cotizacion_item_id: 5,
            descripcion: 'Bata',
            cantidad_cotizada: 5,
            cantidad_operativa: 7,
            diferencia: 2,
            tipo: 'exceso',
          },
        ],
      },
    },
    manager,
  );
});
