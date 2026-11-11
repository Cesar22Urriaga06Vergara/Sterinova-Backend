import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogisticaService } from './logistica.service.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';
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
});
