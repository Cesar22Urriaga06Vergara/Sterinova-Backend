import type { Response } from 'express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { CertificadosController } from './certificados.controller.js';
import { CertificadosService } from './certificados.service.js';
import * as XLSX from '@e965/xlsx';

describe('CertificadosController route order', () => {
  it('serves exportar before treating it as a certificate ID', async () => {
    const certificadosService = {
      findAll: vi.fn(async () => []),
      findOne: vi.fn(),
    };
    const module = await Test.createTestingModule({
      controllers: [CertificadosController],
      providers: [
        { provide: CertificadosService, useValue: certificadosService },
        { provide: PdfGeneratorService, useValue: {} },
        { provide: AuditoriaService, useValue: {} },
      ],
    }).compile();
    const app = module.createNestApplication();
    await app.init();

    try {
      await request(app.getHttpServer()).get('/certificados/exportar').expect(200);
      expect(certificadosService.findAll).toHaveBeenCalledOnce();
      expect(certificadosService.findOne).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });
});

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

    const request = {
      user: { id: 3 },
      rbac: {
        permission: 'certificados.descargar',
        policy: { userId: 3, scopeIds: [2], ownScopeIds: [] },
        resourceScopeIds: [2],
      },
    };
    await controller.descargar(8, response as unknown as Response, request as never);

    expect(certificadosService.ensurePdfCurrent).toHaveBeenCalledWith(
      8,
      request.rbac,
    );
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

describe('CertificadosController.exportar', () => {
  it('entrega un libro Excel con columnas explícitas y el ámbito recibido', async () => {
    const certificate = {
      id: 8,
      consecutivo: 'CE-008',
      estado: 'Aprobado',
      fecha_esterilizacion: '2026-11-20',
      fecha_vencimiento: '2029-11-20',
      cicloEsterilizacion: { orden: { cotizacion: { cliente: { razon_social: 'Cliente A' } } } },
    };
    const service = { findAll: vi.fn(async () => [certificate]) };
    const controller = new CertificadosController(service as never, {} as never, {} as never);
    const response = { setHeader: vi.fn(), send: vi.fn((bytes) => bytes) };
    const request = { rbac: { permission: 'certificados.exportar', resourceScopeIds: [2] } };
    await controller.exportar(request as never, response as unknown as Response);
    const bytes = response.send.mock.calls[0][0];
    expect(Buffer.isBuffer(bytes)).toBe(true);
    const book = XLSX.read(bytes, { type: 'buffer' });
    expect(XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { header: 1 })).toEqual([
      ['ID', 'Consecutivo', 'Estado', 'Cliente', 'Fecha de esterilización', 'Fecha de vencimiento'],
      [8, 'CE-008', 'Aprobado', 'Cliente A', '2026-11-20', '2029-11-20'],
    ]);
    expect(service.findAll).toHaveBeenCalledWith(request.rbac);
  });
});
