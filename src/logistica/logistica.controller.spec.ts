import { BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { LogisticaController } from './logistica.controller.js';
import type { LogisticaService } from './logistica.service.js';
import type { PdfGeneratorService } from '../pdf/pdf-generator.service.js';

describe('LogisticaController PDF route', () => {
  it('renders the requested document without writing a stored PDF', async () => {
    const orden = { consecutivo: 'OS-2026-0012' };
    const snapshot = { documento: { tipo: 'ACTA_SERVICIO' } };
    const pdf = Buffer.from('%PDF-1.7 test');
    const logisticaService = {
      findOneForPdf: vi.fn().mockResolvedValue(orden),
      buildPdfSnapshot: vi.fn().mockReturnValue(snapshot),
    } as unknown as LogisticaService;
    const pdfGenerator = {
      render: vi.fn().mockResolvedValue(pdf),
    } as unknown as PdfGeneratorService;
    const controller = new LogisticaController(
      logisticaService,
      pdfGenerator,
    );
    const response = {
      setHeader: vi.fn(),
      send: vi.fn(),
    } as unknown as Response;
    const request = {
      user: { id: 8 },
      rbac: {
        permission: 'logistica.ordenes.ver',
        policy: { userId: 8, scopeIds: [3], ownScopeIds: [] },
        resourceScopeIds: [3],
      },
    } as RbacRequest;

    await controller.descargarPdf(12, 'acta', response, request);

    expect(logisticaService.findOneForPdf).toHaveBeenCalledWith(
      12,
      request.rbac,
    );
    expect(logisticaService.buildPdfSnapshot).toHaveBeenCalledWith(
      orden,
      'ACTA_SERVICIO',
    );
    expect(pdfGenerator.render).toHaveBeenCalledWith(snapshot);
    expect(response.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store',
    );
    expect(response.send).toHaveBeenCalledWith(pdf);
  });

  it.each(['invalid', 'ORDEN_SERVICIO', ''])(
    'rejects unsupported document type %j before looking up an order',
    async (tipo) => {
      const logisticaService = {
        findOne: vi.fn(),
      } as unknown as LogisticaService;
      const controller = new LogisticaController(
        logisticaService,
        {} as PdfGeneratorService,
      );

      await expect(
        controller.descargarPdf(
          12,
          tipo,
          {} as Response,
          {} as RbacRequest,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(logisticaService.findOne).not.toHaveBeenCalled();
    },
  );
});
