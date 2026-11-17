import { ConflictException } from '@nestjs/common';
import { LogisticaService } from './logistica.service.js';
import { EstadoCotizacion } from '../cotizaciones/entities/estado-cotizacion.enum.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';

type RepositoryMock = Record<string, unknown>;

function serviceWith(
  manager: RepositoryMock,
  options: {
    quotes?: RepositoryMock;
    orders?: RepositoryMock;
    auditoria?: RepositoryMock;
  } = {},
) {
  const orders = options.orders ?? {
    findOne: vi.fn(async () => null),
    find: vi.fn(async () => []),
    save: vi.fn(async (value: unknown) => value),
    create: vi.fn((value: unknown) => value),
  };
  const quotes = options.quotes ?? {
    findOne: vi.fn(async () => ({
      id: 1,
      estado: EstadoCotizacion.ACEPTADA_CLIENTE,
      tipo_servicio: 'INDUSTRIAL_ETO',
      scope_id: 2,
      creador_id: 3,
    })),
    find: vi.fn(async () => []),
  };
  const auditoria = options.auditoria ?? {
    create: vi.fn().mockResolvedValue(undefined),
  };
  const source = {
    transaction: vi.fn(async (work: (m: unknown) => unknown) => work(manager)),
    query: vi.fn(async () => []),
    getRepository: vi.fn(() => manager),
  };
  const service = new LogisticaService(
    orders as never,
    quotes as never,
    source as never,
    auditoria as never,
    {
      resolveOrdenServicio: vi.fn().mockResolvedValue({ id: 1 }),
      resolveActaServicio: vi.fn().mockResolvedValue({ id: 2 }),
    } as never,
  );
  return { service, orders, quotes, auditoria, source };
}

function managerWith(assigned: Array<{ item_id: number; cantidad: number }>) {
  let savedOrder: Record<string, unknown> | null = null;
  const orders = {
    findOne: vi.fn(
      async (options?: { where?: { id?: number; cotizacion_id?: number } }) => {
        if (
          options?.where?.id !== undefined &&
          savedOrder &&
          savedOrder.id === options.where.id
        )
          return savedOrder;
        return null;
      },
    ),
    find: vi.fn(async () => []),
    save: vi.fn(async (value: Record<string, unknown>) => {
      savedOrder = { id: 10, ...value };
      return savedOrder;
    }),
    create: vi.fn((value: unknown) => value),
  };
  const quotes = {
    findOne: vi.fn(async () => ({
      id: 1,
      estado: EstadoCotizacion.ACEPTADA_CLIENTE,
      tipo_servicio: 'INDUSTRIAL_ETO',
      scope_id: 2,
      creador_id: 3,
    })),
  };
  const cotizacionItems = {
    find: vi.fn(async () => [{ id: 5, descripcion: 'Bata', cantidad: 100 }]),
  };
  const sequences = { findOne: vi.fn(async () => ({ ultimo_valor: '0' })) };
  const materials = { insert: vi.fn() };
  const manager = {
    query: vi.fn(async (sql: string) =>
      sql.includes('ordenes_servicio_materiales')
        ? assigned
        : [],
    ),
    getRepository: (entity: { name: string }) => {
      if (entity.name === 'OrdenServicio') return orders;
      if (entity.name === 'Cotizacion') return quotes;
      if (entity.name === 'CotizacionItem') return cotizacionItems;
      if (entity.name === 'OrdenServicioMaterial') return materials;
      return sequences;
    },
  };
  return { manager, orders };
}

describe('LogisticaService multiple orders per quote', () => {
  it('allows a second order for the same quote while quantity remains pending', async () => {
    const { manager, orders } = managerWith([
      { item_id: 5, cantidad: 40 },
    ]);
    const { service } = serviceWith(manager, { orders });

    await service.createOrden(
      {
        cotizacion_id: 1,
        fecha_programada: '2026-11-09',
        orden_compra_cliente: 'OC-2026-0001',
        materiales: [
          { cotizacion_item_id: 5, descripcion: 'Bata', cantidad: 30 },
        ],
      },
      42,
    );

    expect(orders.save).toHaveBeenCalled();
  });

  it('rejects an order that exceeds the pending quantity of the quote', async () => {
    const { manager, orders } = managerWith([
      { item_id: 5, cantidad: 80 },
    ]);
    const { service } = serviceWith(manager, { orders });

    await expect(
      service.createOrden(
        {
          cotizacion_id: 1,
          fecha_programada: '2026-11-09',
          orden_compra_cliente: 'OC-2026-0001',
          materiales: [
            { cotizacion_item_id: 5, descripcion: 'Bata', cantidad: 30 },
          ],
        },
        42,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(orders.save).not.toHaveBeenCalled();
  });

  it('lists approved quotes with pending quantity and hides fully allocated ones', async () => {
    const quotes = {
      find: vi.fn(async () => [
        {
          id: 1,
          estado: EstadoCotizacion.ACEPTADA_CLIENTE,
          items: [{ id: 5, descripcion: 'Bata', cantidad: 100 }],
        },
        {
          id: 2,
          estado: EstadoCotizacion.ACEPTADA_CLIENTE,
          items: [{ id: 6, descripcion: 'Guante', cantidad: 10 }],
        },
      ]),
    };
    const source = {
      transaction: vi.fn(),
      query: vi.fn(async () => [
        { cotizacion_id: 1, item_id: 5, cantidad: '40' },
        { cotizacion_id: 2, item_id: 6, cantidad: '10' },
      ]),
      getRepository: vi.fn(),
    };
    const service = new LogisticaService(
      {} as never,
      quotes as never,
      source as never,
      {} as never,
      {} as never,
    );
    const access: PermissionContext = {
      permission: 'logistica.cotizaciones_disponibles.ver',
      policy: { userId: 1, scopeIds: [7], ownScopeIds: [] },
      resourceScopeIds: [7],
    };

    const disponibles = await service.findCotizacionesAprobadasConSaldo(
      access,
    );

    expect(disponibles.map((quote) => quote.id)).toEqual([1]);
  });
});
