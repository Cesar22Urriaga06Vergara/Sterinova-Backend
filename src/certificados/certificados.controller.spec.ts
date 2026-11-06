import type { Response } from 'express';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { CertificadosController } from './certificados.controller.js';

describe('CertificadosController.validar', () => {
  it('limits public token validation to five attempts per minute', () => {
    const handler = CertificadosController.prototype.validar;
    expect(Reflect.getMetadata('THROTTLER:LIMITdefault', handler)).toBe(5);
    expect(Reflect.getMetadata('THROTTLER:TTLdefault', handler)).toBe(60_000);
  });
});

describe('CertificadosController.descargar', () => {
  it('serves the PDF path returned after ensuring the official render is current', async () => {
    const certificate = {
      id: 8,
      consecutivo: '001',
      pdf_url: 'certificados/001-react-playwright-v1.pdf',
      hash_pdf: 'b'.repeat(64),
    };
    const certificadosService = {
      ensurePdfCurrent: vi.fn(async () => certificate),
    };
    const pdfGenerator = {
      getFile: vi.fn(async (_key, hash) => {
        expect(hash).toBe(certificate.hash_pdf);
        return Buffer.from('%PDF downloaded bytes');
      }),
    };
    const response = {
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    const auditoriaService = { create: vi.fn(async (entry) => entry) };
    const controller = new CertificadosController(
      certificadosService as never,
      pdfGenerator as unknown as PdfGeneratorService,
      auditoriaService as never,
    );

    await controller.descargar(8, response as unknown as Response, { user: { id: 3 } } as never);

    expect(certificadosService.ensurePdfCurrent).toHaveBeenCalledWith(8);
    expect(pdfGenerator.getFile).toHaveBeenCalledWith(certificate.pdf_url, certificate.hash_pdf);
    expect(response.end).toHaveBeenCalledWith(Buffer.from('%PDF downloaded bytes'), expect.any(Function));
    response.end.mock.calls[0][1]();
    expect(auditoriaService.create).toHaveBeenCalledWith(expect.objectContaining({
      usuario_id: 3, entidad: 'certificado', entidad_id: 8, accion: 'descargar',
    }));
    expect(response.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate',
    );
  });
});
