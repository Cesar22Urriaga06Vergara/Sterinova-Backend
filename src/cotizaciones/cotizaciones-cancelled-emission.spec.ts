import { CotizacionesService } from './cotizaciones.service.js';
import { quotePermission } from '../../test/fixtures/quote-permission.js';

describe('emisión después de anulación', () => {
  it.each([false, true])('rechaza una cotización anulada incluso si cambió durante la espera del bloqueo: %s', async (changedWhileLocking) => {
    const quote = { id: 1, estado: changedWhileLocking ? 'APROBADA' : 'ANULADA', creador_id: 7, aprobador_interno_id: 42, aprobado_internamente_at: new Date(), fecha_emision: null, consecutivo: 'COT-1' };
    const current = { ...quote, estado: 'ANULADA' };
    const formats = { resolveCotizacion: vi.fn() };
    const pdf = { generate: vi.fn(), remove: vi.fn() };
    const service = new CotizacionesService(
      { findOne: async () => quote } as never, {} as never, {} as never,
      { transaction: async (work) => work({ getRepository: () => ({ findOne: async () => current }) }) } as never,
      formats as never, pdf as never, {} as never,
    );
    await expect(service.emitir(1, quotePermission('cotizaciones.emitir'))).rejects.toMatchObject({ status: 409 });
    expect(formats.resolveCotizacion).not.toHaveBeenCalled();
    expect(pdf.generate).not.toHaveBeenCalled();
  });
});
