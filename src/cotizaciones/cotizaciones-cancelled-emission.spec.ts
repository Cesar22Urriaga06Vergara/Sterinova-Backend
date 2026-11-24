import { CotizacionesService } from './cotizaciones.service.js';
import {
  EstadoSolicitudAnulacion,
  SolicitudAnulacion,
} from './entities/solicitud-anulacion.entity.js';
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

  it('bloquea la emisión cuando existe una solicitud de anulación pendiente', async () => {
    const quote = { id: 2, estado: 'APROBADA', creador_id: 7, aprobador_interno_id: 42, aprobado_internamente_at: new Date(), fecha_emision: null, consecutivo: 'COT-2' };
    const formats = { resolveCotizacion: vi.fn() };
    const pdf = { generate: vi.fn(), remove: vi.fn() };
    const solicitudesRepo = {
      findOneBy: vi.fn(async () => ({ id: 9, cotizacion_id: 2, estado: EstadoSolicitudAnulacion.PENDIENTE })),
    };
    const service = new CotizacionesService(
      { findOne: async () => quote } as never, {} as never, {} as never,
      {
        transaction: async (work) => work({
          getRepository: (entity: unknown) =>
            entity === SolicitudAnulacion ? solicitudesRepo : { findOne: async () => quote },
        }),
      } as never,
      formats as never, pdf as never, {} as never,
    );
    await expect(service.emitir(2, quotePermission('cotizaciones.emitir'))).rejects.toThrow(
      'La cotización tiene una solicitud de anulación pendiente',
    );
    expect(formats.resolveCotizacion).not.toHaveBeenCalled();
    expect(pdf.generate).not.toHaveBeenCalled();
  });

  it('bloquea registrar aceptación cuando existe una solicitud de anulación pendiente', async () => {
    const quote = { id: 3, estado: 'EMITIDA', fecha_emision: new Date(), version: 2 };
    const save = vi.fn();
    const solicitudesRepo = {
      findOneBy: vi.fn(async () => ({ id: 10, cotizacion_id: 3, estado: EstadoSolicitudAnulacion.PENDIENTE })),
    };
    const service = new CotizacionesService(
      {} as never, {} as never, {} as never,
      {
        transaction: async (work) => work({
          getRepository: (entity: unknown) =>
            entity === SolicitudAnulacion ? solicitudesRepo : { findOne: async () => quote, save },
        }),
      } as never,
      {} as never, {} as never, {} as never,
    );
    await expect(service.aceptar(3, quotePermission('cotizaciones.aceptar'))).rejects.toThrow(
      'La cotización tiene una solicitud de anulación pendiente',
    );
    expect(save).not.toHaveBeenCalled();
  });
});
