import type { Response } from 'express';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { CotizacionesController } from './cotizaciones.controller.js';
import { UserRole } from '../users/entities/user-role.enum.js';

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

    await controller.descargar(7, response as unknown as Response);

    expect(cotizacionesService.ensurePdfCurrent).toHaveBeenCalledWith(7);
    expect(pdfGenerator.getFile).toHaveBeenCalledWith(quote.pdf_url, quote.hash_pdf);
    expect(response.send).toHaveBeenCalledWith(Buffer.from('%PDF downloaded bytes'));
    expect(response.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate',
    );
  });
});

describe('CotizacionesController.create', () => {
  it('assigns the authenticated user as quote creator', async () => {
    const cotizacionesService = { create: vi.fn(async () => ({ id: 7 })) };
    const controller = new CotizacionesController(
      cotizacionesService as never,
      {} as PdfGeneratorService,
    );
    const dto = { cliente_id: 3 } as never;

    await controller.create(dto, { user: { id: 42, rol: UserRole.COMERCIAL } });

    expect(cotizacionesService.create).toHaveBeenCalledWith(dto, 42);
  });

  it('limits official PDF emission to Admin', () => {
    const roles = Reflect.getMetadata('roles', CotizacionesController.prototype.emitir);
    expect(roles).toContain(UserRole.ADMIN);
    expect(roles).not.toContain(UserRole.COMERCIAL);
  });
});
