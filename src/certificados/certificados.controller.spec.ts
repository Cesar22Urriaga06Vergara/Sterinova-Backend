import type { Response } from 'express';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { CertificadosController } from './certificados.controller.js';

describe('CertificadosController.descargar', () => {
  it('serves the PDF path returned after ensuring the official render is current', async () => {
    const certificate = {
      consecutivo: '001',
      pdf_url: 'certificados/001-react-playwright-v1.pdf',
    };
    const certificadosService = {
      ensurePdfCurrent: vi.fn(async () => certificate),
    };
    const pdfGenerator = {
      getAbsolutePath: vi.fn(async () => 'C:\\pdfs\\001-react-playwright-v1.pdf'),
    };
    const response = {
      setHeader: vi.fn(),
      download: vi.fn(),
    };
    const controller = new CertificadosController(
      certificadosService as never,
      pdfGenerator as unknown as PdfGeneratorService,
    );

    await controller.descargar(8, response as unknown as Response);

    expect(certificadosService.ensurePdfCurrent).toHaveBeenCalledWith(8);
    expect(pdfGenerator.getAbsolutePath).toHaveBeenCalledWith(certificate.pdf_url);
    expect(response.download).toHaveBeenCalledWith(
      'C:\\pdfs\\001-react-playwright-v1.pdf',
      'certificado-001.pdf',
    );
    expect(response.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate',
    );
  });
});
