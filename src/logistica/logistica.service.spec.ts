import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogisticaService } from './logistica.service.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import type { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';

describe('LogisticaService PDF snapshot', () => {
  const service = new LogisticaService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  );

  it('uses the linked customer, quote values and order materials without inventing fields', () => {
    const orden = {
      consecutivo: 'OS-2026-0001',
      fecha_programada: '2026-11-10',
      metodo_esterilizacion: 'ETO',
      observaciones: null,
      cotizacion: {
        tipo_servicio: TipoServicioCotizacion.INDUSTRIAL_ETO,
        subtotal: 1000,
        iva: 190,
        total: 1190,
        cliente: {
          razon_social: 'Cliente de prueba',
          direccion: null,
          nit: null,
          telefono: null,
          email: null,
        },
        items: [{ id: 8, valor_unitario: 1000 }],
      },
      materiales: [
        {
          descripcion: 'Bata',
          referencia: null,
          lote: null,
          cantidad: 1,
          cotizacion_item_id: 8,
          posicion: 0,
        },
      ],
    } as OrdenServicio;

    const snapshot = service.buildPdfSnapshot(orden, 'ORDEN_SERVICIO');

    expect(snapshot.cliente).toEqual({
      razon_social: 'Cliente de prueba',
      direccion: null,
      nit: null,
      telefono: null,
      email: null,
    });
    expect(snapshot.cotizacion).toMatchObject({
      tipo_servicio: TipoServicioCotizacion.INDUSTRIAL_ETO,
      subtotal: 1000,
      iva: 190,
      total: 1190,
      items: [{ id: 8, valor_unitario: 1000 }],
    });
    expect(snapshot.materiales[0]).toMatchObject({
      descripcion: 'Bata',
      lote: null,
      cantidad: 1,
      cotizacion_item_id: 8,
    });
    expect(snapshot.documento).not.toHaveProperty('fecha_emision');
    expect(snapshot.orden).not.toHaveProperty('fecha_recepcion');
  });

  it('rejects a PDF snapshot when the order has no linked customer', () => {
    const orden = {
      consecutivo: 'OS-2026-0001',
      cotizacion: null,
      materiales: [],
    } as unknown as OrdenServicio;

    expect(() =>
      service.buildPdfSnapshot(orden, 'ACTA_SERVICIO'),
    ).toThrow(InternalServerErrorException);
  });

  it('limits PDF lookup to the order or linked quote scope', async () => {
    const orden = {
      id: 12,
      scope_id: null,
      creador_id: null,
      cotizacion: {
        scope_id: 7,
        creador_id: 2,
      },
    } as unknown as OrdenServicio;
    const repository = {
      findOne: vi.fn().mockResolvedValue(orden),
    };
    const scopedService = new LogisticaService(
      repository as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const access: PermissionContext = {
      permission: 'logistica.ordenes.ver',
      policy: { userId: 1, scopeIds: [7], ownScopeIds: [] },
      resourceScopeIds: [7],
    };

    await expect(scopedService.findOneForPdf(12, access)).resolves.toBe(orden);
    await expect(
      scopedService.findOneForPdf(12, {
        ...access,
        policy: { userId: 1, scopeIds: [8], ownScopeIds: [] },
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('denies access when order and quote scopes conflict', async () => {
    const repository = {
      findOne: vi.fn().mockResolvedValue({
        id: 12,
        scope_id: 7,
        creador_id: 1,
        cotizacion: { scope_id: 8, creador_id: 1 },
      }),
    };
    const scopedService = new LogisticaService(
      repository as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const access: PermissionContext = {
      permission: 'logistica.ordenes.ver',
      policy: { userId: 1, scopeIds: [7, 8], ownScopeIds: [] },
      resourceScopeIds: [7, 8],
    };

    await expect(
      scopedService.findOneForPdf(12, access),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('denies PDF access when a linked quote has no authorized scope', async () => {
    const repository = {
      findOne: vi.fn().mockResolvedValue({
        id: 12,
        scope_id: 7,
        creador_id: 1,
        cotizacion: { scope_id: null, creador_id: 1 },
      }),
    };
    const scopedService = new LogisticaService(
      repository as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const access: PermissionContext = {
      permission: 'logistica.ordenes.ver',
      policy: { userId: 1, scopeIds: [7], ownScopeIds: [] },
      resourceScopeIds: [7],
    };

    await expect(
      scopedService.findOneForPdf(12, access),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('LogisticaService approved quotes', () => {
  it('limits quotes without an order to the authorized scope', async () => {
    const quotesRepository = {
      find: vi.fn().mockResolvedValue([{ id: 5, scope_id: 7 }]),
    };
    const ordersRepository = {
      find: vi.fn().mockResolvedValue([]),
    };
    const scopedService = new LogisticaService(
      ordersRepository as never,
      quotesRepository as never,
      {} as never,
      {} as never,
    );
    const access: PermissionContext = {
      permission: 'logistica.cotizaciones_disponibles.ver',
      policy: { userId: 1, scopeIds: [7], ownScopeIds: [] },
      resourceScopeIds: [7],
    };

    await scopedService.findCotizacionesAprobadasSinOrden(access);

    const options = quotesRepository.find.mock.calls[0][0];
    expect(options.where).toHaveLength(1);
    expect(options.where[0]).toMatchObject({ estado: 'APROBADA' });
    expect(options.where[0].scope_id).toBeDefined();
  });
});

describe('LogisticaService operational quantity audit', () => {
  it('records quantity discrepancies without changing the commercial quote', async () => {
    const order = {
      id: 12,
      version: 4,
      estado: EstadoOrdenServicio.PENDIENTE,
      cotizacion_id: 7,
      metodo_esterilizacion: 'ETO',
    };
    const ordersRepository = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce({ ...order, version: 5 }),
      save: vi.fn(async (value) => value),
    };
    const quote = { tipo_servicio: 'INDUSTRIAL_ETO' };
    const cotizacionesRepository = {
      findOneByOrFail: vi.fn().mockResolvedValue(quote),
    };
    const items = [{ id: 8, descripcion: 'Bata', cantidad: 5 }];
    const itemsRepository = { find: vi.fn().mockResolvedValue(items) };
    const materialsRepository = {
      delete: vi.fn(),
      insert: vi.fn(),
    };
    const cyclesRepository = { existsBy: vi.fn().mockResolvedValue(false) };
    const repositories: Record<string, unknown> = {
      OrdenServicio: ordersRepository,
      Cotizacion: cotizacionesRepository,
      CotizacionItem: itemsRepository,
      OrdenServicioMaterial: materialsRepository,
      CicloEsterilizacion: cyclesRepository,
    };
    const manager = {
      getRepository: (entity: { name: string }) => repositories[entity.name],
    };
    const dataSource = {
      transaction: vi.fn(async (callback) => callback(manager)),
    };
    const auditoriaService = { create: vi.fn().mockResolvedValue(undefined) };
    const service = new LogisticaService(
      ordersRepository as never,
      {} as never,
      dataSource as never,
      auditoriaService as never,
    );

    await service.updateMateriales(
      12,
      {
        version: 4,
        materiales: [
          { cotizacion_item_id: 8, descripcion: 'Bata', cantidad: 7 },
        ],
      },
      19,
    );

    expect(auditoriaService.create).toHaveBeenCalledWith(
      {
        usuario_id: 19,
        entidad: 'orden_servicio',
        entidad_id: 12,
        accion: 'editar',
        detalle: {
          version_anterior: 4,
          materiales: 1,
          discrepancias_cantidad: [
            {
              cotizacion_item_id: 8,
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
    expect(quote).toEqual({ tipo_servicio: 'INDUSTRIAL_ETO' });
    expect(items).toEqual([
      { id: 8, descripcion: 'Bata', cantidad: 5 },
    ]);
  });
});
