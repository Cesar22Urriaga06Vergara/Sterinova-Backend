import { quotePermission } from '../../test/fixtures/quote-permission.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { TipoServicioCotizacion } from './entities/tipo-servicio.enum.js';
import { CotizacionesService } from './cotizaciones.service.js';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import type { DataSource, Repository } from 'typeorm';

describe('CotizacionesService.emitir', () => {
  it('includes Insumos item images in the emitted PDF snapshot', async () => {
    const quote = {
      id: 7,
      consecutivo: 'COT-CMI-007',
      cliente_id: 3,
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      estado: 'APROBADA',
      creador_id: 7,
      aprobador_interno_id: 42,
      aprobado_internamente_at: new Date('2026-11-04T11:00:00.000Z'),
      fecha: new Date('2026-11-04T12:00:00.000Z'),
      fecha_emision: null,
      cliente: {
        id: 3,
        razon_social: 'Cliente de prueba',
        nit: '900123456',
        direccion: 'Calle 1',
        contacto: 'Ana',
        cargo: 'Compras',
        telefono: '3001234567',
        email: 'ana@example.com',
        ciudad: 'Bogotá',
      },
      items: [
        {
          id: 11,
          imagen_key: 'cotizacion-items/11/producto.png',
          tipo_item: 'PRODUCTO',
          categoria: 'EMPAQUES',
          descripcion: 'Lavandería farmacéutica',
          cantidad: 1,
          valor_unitario: 100,
          valor_total: 100,
        },
      ],
      subtotal: 100,
      iva: 19,
      iva_tasa: '0.190000',
      iva_version_id: 1,
      total: 119,
      condiciones_comerciales: 'Oferta de prueba',
      tiempo_despacho: 'Cinco días hábiles',
      transporte: 'Por cuenta del cliente',
      forma_pago: '50% al aceptar y 50% al entregar',
      validez_oferta: '30 días desde su emisión',
      precio_incluye: 'Servicio descrito',
      precio_no_incluye: 'Impuestos no incluidos',
    } as unknown as Cotizacion;
    const version = {
      id: 14,
      version: 4,
      fecha_version: '2026-09-17',
      renderer_key: 'cotizacion_v1',
      configuracion_json: {
        document_code: 'R-CM-07-5',
        version_label: '04',
        version_date: '2026-09-17',
      },
    };
    const quoteRepository = {
      findOne: vi.fn(async () => quote),
      save: vi.fn(async (value: Cotizacion) => value),
    };
    const manager = {
      getRepository: vi.fn(() => quoteRepository),
    };
    const dataSource = {
      manager: {},
      transaction: vi.fn(async (work: (manager: unknown) => unknown) =>
        work(manager),
      ),
    };
    const formatResolver = {
      resolveCotizacion: vi.fn(async () => version),
    };
    const pdfGenerator = {
      generate: vi.fn(async (_snapshot: unknown, storageKey: string) => ({
        storageKey,
        hash: 'a'.repeat(64),
      })),
      remove: vi.fn(),
    };
    const auditoriaService = { create: vi.fn(async () => ({})) };
    const service = new CotizacionesService(
      quoteRepository as unknown as Repository<Cotizacion>,
      {} as Repository<CotizacionItem>,
      {} as never,
      dataSource as unknown as DataSource,
      formatResolver as never,
      pdfGenerator as never,
      auditoriaService as never,
      { freeze:vi.fn(async()=>({version_id:10,sha256:"b".repeat(64),imagen_key:"versiones/frozen.png"})) } as never,
      {
        toDataUri: vi.fn(async () => 'data:image/png;base64,cHJvZHVjdA=='),
      } as never,
    );

    const emitted = await service.emitir(
      7,
      quotePermission('cotizaciones.emitir'),
    );

    expect(emitted.fecha_emision).toBeInstanceOf(Date);
    expect(emitted.version_formato_id).toBe(14);
    expect(emitted.sello_icontec_version_id).toBe(10);
    expect(quote.snapshot_datos?.sellos).toMatchObject({icontec:{version_id:10,sha256:'b'.repeat(64)}});
    expect(emitted.pdf_url).toBe('cotizaciones/COT-CMI-007.pdf');
    expect(emitted.pdf_renderer_version).toBe('react-playwright-v3');
    expect(quote.snapshot_datos?.cliente).toMatchObject({
      cargo: 'Compras',
      ciudad: 'Bogotá',
    });
    expect(quote.snapshot_datos?.cotizacion).toMatchObject({
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      items: [
        {
          id: 11,
          imagen_src: 'data:image/png;base64,cHJvZHVjdA==',
        },
      ],
      iva_tasa: '0.190000',
      iva_version_id: 1,
      tiempo_despacho: 'Cinco días hábiles',
      transporte: 'Por cuenta del cliente',
      forma_pago: '50% al aceptar y 50% al entregar',
      validez_oferta: '30 días desde su emisión',
      precio_incluye: 'Servicio descrito',
      precio_no_incluye: 'Impuestos no incluidos',
    });
    expect(pdfGenerator.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        formato: expect.objectContaining({
          codigo: 'R-CM-07-5',
          version: 4,
          fecha_version: '2026-09-17',
          configuracion_json: expect.objectContaining({
            document_code: 'R-CM-07-5',
          }),
        }),
        cliente: expect.objectContaining({ ciudad: 'Bogotá' }),
      }),
      'cotizaciones/COT-CMI-007.pdf',
      manager,
    );
    expect(auditoriaService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        usuario_id: 42,
        entidad: 'cotizaciones',
        accion: AccionAuditoria.EMITIR,
        detalle: expect.objectContaining({ version_formato_id: 14 }),
      }),
      manager,
    );
  });

  it('rejects a draft before resolving the format or generating a PDF', async () => {
    const quote = {
      id: 7,
      consecutivo: 'COT-LAV-007',
      estado: 'Borrador',
      fecha_emision: null,
    } as Cotizacion;
    const quoteRepository = { findOne: vi.fn(async () => quote) };
    const formatResolver = { resolveCotizacion: vi.fn() };
    const pdfGenerator = { generate: vi.fn() };
    const service = new CotizacionesService(
      quoteRepository as unknown as Repository<Cotizacion>,
      {} as Repository<CotizacionItem>,
      {} as never,
      {} as never,
      formatResolver as never,
      pdfGenerator as never,
      {} as never,
      {} as never,
    );

    await expect(
      service.emitir(7, quotePermission('cotizaciones.emitir')),
    ).rejects.toMatchObject({ status: 409 });
    expect(formatResolver.resolveCotizacion).not.toHaveBeenCalled();
    expect(pdfGenerator.generate).not.toHaveBeenCalled();
  });

  it('rejects an approved state without valid approval metadata', async () => {
    const quote = {
      id: 7,
      consecutivo: 'COT-LAV-007',
      estado: 'APROBADA',
      creador_id: 7,
      aprobador_interno_id: 7,
      aprobado_internamente_at: new Date(),
      fecha_emision: null,
    } as Cotizacion;
    const quoteRepository = { findOne: vi.fn(async () => quote) };
    const formatResolver = { resolveCotizacion: vi.fn() };
    const pdfGenerator = { generate: vi.fn() };
    const service = new CotizacionesService(
      quoteRepository as unknown as Repository<Cotizacion>,
      {} as Repository<CotizacionItem>,
      {} as never,
      {} as never,
      formatResolver as never,
      pdfGenerator as never,
      {} as never,
      {} as never,
    );

    await expect(
      service.emitir(7, quotePermission('cotizaciones.emitir')),
    ).rejects.toMatchObject({ status: 409 });
    expect(formatResolver.resolveCotizacion).not.toHaveBeenCalled();
    expect(pdfGenerator.generate).not.toHaveBeenCalled();
  });

  it('rechecks approval under the emission lock before generating a PDF', async () => {
    const approvedQuote = {
      id: 7,
      consecutivo: 'COT-LAV-007',
      estado: 'APROBADA',
      creador_id: 7,
      aprobador_interno_id: 42,
      aprobado_internamente_at: new Date(),
      fecha_emision: null,
    } as Cotizacion;
    const changedQuote = { ...approvedQuote, estado: 'Borrador' };
    const quoteRepository = { findOne: vi.fn(async () => approvedQuote) };
    const manager = {
      getRepository: vi.fn(() => ({
        findOne: vi.fn(async () => changedQuote),
      })),
    };
    const formatResolver = { resolveCotizacion: vi.fn() };
    const pdfGenerator = { generate: vi.fn() };
    const service = new CotizacionesService(
      quoteRepository as unknown as Repository<Cotizacion>,
      {} as Repository<CotizacionItem>,
      {} as never,
      {
        transaction: vi.fn(async (work: (manager: unknown) => unknown) =>
          work(manager),
        ),
      } as unknown as DataSource,
      formatResolver as never,
      pdfGenerator as never,
      {} as never,
      {} as never,
    );

    await expect(
      service.emitir(7, quotePermission('cotizaciones.emitir')),
    ).rejects.toMatchObject({ status: 409 });
    expect(formatResolver.resolveCotizacion).not.toHaveBeenCalled();
    expect(pdfGenerator.generate).not.toHaveBeenCalled();
  });

  it('regenerates a previously emitted PDF with the React renderer before downloading', async () => {
    const quote = {
      id: 7,
      consecutivo: 'COT-LAV-007',
      fecha: new Date('2026-11-04T12:00:00.000Z'),
      fecha_emision: new Date('2026-11-04T15:00:00.000Z'),
      pdf_url: 'cotizaciones/COT-LAV-007.pdf',
      hash_pdf: 'old-hash',
      pdf_renderer_version: null,
      snapshot_datos: {
        documento: { tipo: 'COTIZACION', consecutivo: 'COT-LAV-007' },
        formato: { codigo: 'R-CM-07-5', version: 4 },
      },
    } as unknown as Cotizacion;
    const quoteRepository = {
      findOne: vi.fn(async () => quote),
      save: vi.fn(async (value: Cotizacion) => value),
    };
    const manager = { getRepository: vi.fn(() => quoteRepository) };
    const dataSource = {
      manager: {},
      transaction: vi.fn(async (work: (manager: unknown) => unknown) =>
        work(manager),
      ),
    };
    const pdfGenerator = {
      generate: vi.fn(async (_snapshot: unknown, storageKey: string) => ({
        storageKey,
        hash: 'b'.repeat(64),
      })),
    };
    const service = new CotizacionesService(
      quoteRepository as unknown as Repository<Cotizacion>,
      {} as Repository<CotizacionItem>,
      {} as never,
      dataSource as unknown as DataSource,
      {} as never,
      pdfGenerator as never,
      {} as never,
      {} as never,
    );

    const result = await service.ensurePdfCurrent(
      7,
      quotePermission('cotizaciones.descargar'),
    );

    expect(pdfGenerator.generate).toHaveBeenCalledWith(
      quote.snapshot_datos,
      'cotizaciones/COT-LAV-007-react-playwright-v1.pdf',
    );
    expect(result.pdf_url).toBe(
      'cotizaciones/COT-LAV-007-react-playwright-v1.pdf',
    );
    expect(result.hash_pdf).toBe('b'.repeat(64));
    expect(result.pdf_renderer_version).toBe('react-playwright-v1');
    expect(result.fecha_emision).toEqual(new Date('2026-11-04T15:00:00.000Z'));
    expect(quoteRepository.save).toHaveBeenCalledWith(quote);
  });

  it('returns a read-only preview snapshot with the currently assigned format metadata', async () => {
    const quote = {
      id: 7,
      consecutivo: 'COT-LAV-007',
      cliente_id: 3,
      tipo_servicio: TipoServicioCotizacion.LAVANDERIA,
      fecha: new Date('2026-11-04T12:00:00.000Z'),
      cliente: { id: 3, razon_social: 'Cliente Demo', nit: '900' },
      items: [
        {
          descripcion: 'Lavado',
          cantidad: 1,
          valor_unitario: 10,
          valor_total: 10,
        },
      ],
      subtotal: 10,
      iva: 1.9,
      total: 11.9,
      condiciones_comerciales: null,
    } as unknown as Cotizacion;
    const version = {
      id: 14,
      version: 4,
      fecha_version: '2026-09-17',
      renderer_key: 'cotizacion_v1',
      configuracion_json: {
        document_code: 'R-CM-07-5',
        version_label: '04',
        version_date: '2026-09-17',
      },
    };
    const service = new CotizacionesService(
      {
        findOne: vi.fn(async () => quote),
      } as unknown as Repository<Cotizacion>,
      {} as Repository<CotizacionItem>,
      {} as never,
      { manager: {} } as unknown as DataSource,
      { resolveCotizacion: vi.fn(async () => version) } as never,
      {} as never,
      {} as never,
      {
        preview: vi.fn(async () => ({
          imagen_src: 'data:image/png;base64,iVBORw0KGgo=',
        })),
      } as never,
    );

    const preview = await service.previsualizar(
      7,
      quotePermission('cotizaciones.previsualizar'),
    );

    expect(preview).toMatchObject({
      documento: { tipo: 'COTIZACION', consecutivo: 'COT-LAV-007' },
      formato: {
        codigo: 'R-CM-07-5',
        version: 4,
        fecha_version: '2026-09-17',
      },
      cotizacion: { items: [{ descripcion: 'Lavado', cantidad: 1 }] },
      sellos: {
        icontec: { imagen_src: 'data:image/png;base64,iVBORw0KGgo=' },
      },
    });
  });
});
