import { CotizacionesService } from './cotizaciones.service.js';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { quotePermission } from '../../test/fixtures/quote-permission.js';

function fixture(overrides = {}) {
  const quote = {
    id: 1,
    estado: 'Borrador',
    fecha_emision: null,
    version: 1,
    scope_id: 10,
    iva_tasa: '0.050000',
    tiempo_despacho: 'Cinco días hábiles',
    transporte: 'Por cuenta del cliente',
    forma_pago: '50% al aceptar y 50% al entregar',
    validez_oferta: '30 días desde su emisión',
    precio_incluye: 'Servicio descrito',
    precio_no_incluye: 'Impuestos no incluidos',
    items: [],
    ...overrides,
  };
  const repo = {
    findOne: vi.fn(async () => quote),
    save: vi.fn(async (value) => value),
  };
  const items = { delete: vi.fn(), create: vi.fn((value) => value) };
  const manager = {
    getRepository: (entity) => (entity === Cotizacion ? repo : items),
  };
  const service = new CotizacionesService(
    repo as never,
    items as never,
    { findOne: vi.fn() } as never,
    { transaction: async (work) => work(manager) } as never,
    {} as never,
    {} as never,
    {} as never,
  );
  return { service, quote, repo, items };
}
const access = () => quotePermission('cotizaciones.editar');
describe('internal approval authorization', () => {
  it('rejects editing permission without querying or saving the quote', async () => {
    const { service, repo } = fixture({ creador_id: 7 });
    await expect(service.aprobar(1, 1, access())).rejects.toMatchObject({ status: 403 });
    expect(repo.findOne).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });
  it('rejects approval by the creator even with approval permission', async () => {
    const { service, repo } = fixture({ creador_id: 42 });
    await expect(service.aprobar(1, 1, quotePermission('cotizaciones.aprobar_interna')))
      .rejects.toMatchObject({ status: 403 });
    expect(repo.save).not.toHaveBeenCalled();
  });
  it('records the authorized approver for another creator', async () => {
    const { service } = fixture({ creador_id: 7 });
    await expect(service.aprobar(1, 1, quotePermission('cotizaciones.aprobar_interna')))
      .resolves.toMatchObject({ estado: 'APROBADA', version: 2, aprobador_interno_id: 42, aprobado_internamente_at: expect.any(Date) });
  });
  it('rejects approval when the draft has no creator recorded', async () => {
    const { service, repo } = fixture({ creador_id: null });
    await expect(service.aprobar(1, 1, quotePermission('cotizaciones.aprobar_interna')))
      .rejects.toMatchObject({ status: 403 });
    expect(repo.save).not.toHaveBeenCalled();
  });
  it('rejects approval outside the quote scope', async () => {
    const { service, repo } = fixture({ creador_id: 7, scope_id: 2 });
    const request = {
      ...quotePermission('cotizaciones.aprobar_interna'),
      resourceScopeIds: [99],
    };
    await expect(service.aprobar(1, 1, request)).rejects.toMatchObject({
      status: 403,
    });
    expect(repo.save).not.toHaveBeenCalled();
  });
  it('requires all six separate commercial conditions before approval', async () => {
    const { service, repo } = fixture({
      creador_id: 7,
      tiempo_despacho: '  ',
    });
    await expect(
      service.aprobar(
        1,
        1,
        quotePermission('cotizaciones.aprobar_interna'),
      ),
    ).rejects.toMatchObject({ status: 400 });
    expect(repo.save).not.toHaveBeenCalled();
  });
});
describe('draft editing', () => {
  it.each([
    { estado: 'EMITIDA' },
    { estado: 'APROBADA' },
    { fecha_emision: new Date() },
  ])('rejects non drafts %j', async (value) => {
    const { service, repo } = fixture(value);
    await expect(
      service.update(
        1,
        { version: 1, condiciones_comerciales: 'Cambio' },
        access(),
      ),
    ).rejects.toMatchObject({ status: 409 });
    expect(repo.save).not.toHaveBeenCalled();
  });
  it('rejects a stale version before changing items', async () => {
    const { service, items } = fixture({ version: 2 });
    await expect(
      service.update(
        1,
        {
          version: 1,
          items: [{ descripcion: 'Nuevo', tipo_item: 'SERVICIO', cantidad: 2, valor_unitario: 100, unidad: 'servicio', precision_cantidad: 0 }],
        },
        access(),
      ),
    ).rejects.toMatchObject({ status: 409 });
    expect(items.delete).not.toHaveBeenCalled();
  });
  it('replaces items and calculates using the stored rate', async () => {
    const { service, quote } = fixture();
    await service.update(
      1,
      {
        version: 1,
        items: [{ descripcion: 'Nuevo', tipo_item: 'SERVICIO', cantidad: 2, valor_unitario: 100, unidad: 'servicio', precision_cantidad: 0 }],
      },
      access(),
    );
    expect(quote).toMatchObject({
      version: 2,
      subtotal: 200,
      iva: 10,
      total: 210,
      items: [
        {
          descripcion: 'Nuevo',
          tipo_item: 'SERVICIO',
          cantidad: 2,
          valor_unitario: 100,
          unidad: 'servicio',
          precision_cantidad: 0,
          valor_total: 200,
        },
      ],
    });
  });
  it('updates independent commercial conditions on the draft', async () => {
    const { service, quote } = fixture();

    await service.update(
      1,
      {
        version: 1,
        tiempo_despacho: 'Diez días hábiles',
        precio_incluye: 'Empaque y procesamiento',
      },
      access(),
    );

    expect(quote).toMatchObject({
      tiempo_despacho: 'Diez días hábiles',
      precio_incluye: 'Empaque y procesamiento',
    });
  });
  it('does not invent a fiscal rate for legacy drafts', async () => {
    const { service } = fixture({ iva_tasa: null });
    await expect(
      service.update(
        1,
        {
          version: 1,
          items: [{ descripcion: 'Nuevo', tipo_item: 'SERVICIO', cantidad: 1, valor_unitario: 100, unidad: 'servicio', precision_cantidad: 0 }],
        },
        access(),
      ),
    ).rejects.toMatchObject({ status: 409 });
  });
});
