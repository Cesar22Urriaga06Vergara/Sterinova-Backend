import type { Response } from 'express';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { CotizacionesController } from './cotizaciones.controller.js';
import { quotePermission } from '../../test/fixtures/quote-permission.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import {
  REQUIRED_PERMISSION_KEY,
  SCOPED_PERMISSIONS_KEY,
} from '../rbac/require-permission.decorator.js';

describe('CotizacionesController.descargar', () => {
  it('serves the PDF path returned after ensuring the official render is current', async () => {
    const quote = {
      consecutivo: 'COT-LAV-007',
      pdf_url: 'cotizaciones/COT-LAV-007-react-playwright-v1.pdf',
      hash_pdf: 'a'.repeat(64),
    };
    const cotizacionesService = {
      ensurePdfCurrent: vi.fn(async () => quote),
    };
    const pdfGenerator = {
      getFile: vi.fn(async (_key, hash) => {
        expect(hash).toBe(quote.hash_pdf);
        return Buffer.from('%PDF downloaded bytes');
      }),
    };
    const response = {
      setHeader: vi.fn(),
      send: vi.fn(),
    };
    const controller = new CotizacionesController(
      cotizacionesService as never,
      pdfGenerator as unknown as PdfGeneratorService,
    );

    const access = quotePermission('cotizaciones.descargar');
    await controller.descargar(
      7,
      response as unknown as Response,
      { rbac: access } as RbacRequest,
    );

    expect(cotizacionesService.ensurePdfCurrent).toHaveBeenCalledWith(
      7,
      access,
    );
    expect(pdfGenerator.getFile).toHaveBeenCalledWith(
      quote.pdf_url,
      quote.hash_pdf,
    );
    expect(response.send).toHaveBeenCalledWith(
      Buffer.from('%PDF downloaded bytes'),
    );
    expect(response.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate',
    );
  });
});

describe('CotizacionesController.create', () => {
  it('requires internal approval permission instead of edit permission', () => {
    expect(Reflect.getMetadata(REQUIRED_PERMISSION_KEY, CotizacionesController.prototype.aprobar))
      .toBe('cotizaciones.aprobar_interna');
  });
  it('assigns the authenticated user as quote creator', async () => {
    const cotizacionesService = { create: vi.fn(async () => ({ id: 7 })) };
    const controller = new CotizacionesController(
      cotizacionesService as never,
      {} as PdfGeneratorService,
    );
    const dto = { cliente_id: 3 } as never;

    const access = quotePermission('cotizaciones.crear');
    await controller.create(dto, { user: { id: 42 }, rbac: access });

    expect(cotizacionesService.create).toHaveBeenCalledWith(dto, access);
  });

  it('requires explicit permissions for every pilot endpoint and no legacy roles', () => {
    expect(
      Reflect.getMetadata(SCOPED_PERMISSIONS_KEY, CotizacionesController),
    ).toBe(true);
    expect(
      Reflect.getMetadata('roles', CotizacionesController),
    ).toBeUndefined();
    for (const name of [
      'create',
      'findAll',
      'findOne',
      'previsualizar',
      'emitir',
      'descargar',
      'update',
      'remove',
    ] as const) {
      expect(
        Reflect.getMetadata(
          REQUIRED_PERMISSION_KEY,
          CotizacionesController.prototype[name],
        ),
      ).toMatch(/^cotizaciones\./);
    }
    expect(
      Reflect.getMetadata(
        REQUIRED_PERMISSION_KEY,
        CotizacionesController.prototype.emitir,
      ),
    ).toBe('cotizaciones.emitir');
  });
});
