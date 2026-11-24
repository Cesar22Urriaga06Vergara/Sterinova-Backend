import { BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { LogisticaController } from './logistica.controller.js';
import type { LogisticaService } from './logistica.service.js';
import type { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import type { StorageService } from '../common/services/storage.service.js';

describe('LogisticaController PDF route', () => {
  it('passes the authenticated creator to order creation for discrepancy auditing', async () => {
    const dto = { cotizacion_id: 1, fecha_programada: '2026-11-10' };
    const request = {
      user: { id: 8 },
      rbac: {
        permission: 'logistica.ordenes.crear',
        policy: { userId: 8, scopeIds: [3], ownScopeIds: [] },
        resourceScopeIds: [3],
      },
    };
    const logisticaService = {
      createOrden: vi.fn().mockResolvedValue({ id: 12 }),
    } as unknown as LogisticaService;
    const storage = {
      saveFile: vi.fn().mockResolvedValue(undefined),
    } as unknown as StorageService;
    const controller = new LogisticaController(
      logisticaService,
      {} as PdfGeneratorService,
      storage,
    );

    await controller.createOrden(dto, request as never);

    expect(logisticaService.createOrden).toHaveBeenCalledWith(
      dto,
      8,
      request.rbac,
    );
  });

  it('renders the requested document without writing a stored PDF', async () => {
    const orden = { id: 12, consecutivo: 'OS-2026-0012' };
    const snapshot = { documento: { tipo: 'ACTA_SERVICIO' }, formato: { id: 1 } };
    const pdf = Buffer.from('%PDF-1.7 test');
    const logisticaService = {
      findOneForPdf: vi.fn().mockResolvedValue(orden),
      buildPdfSnapshot: vi.fn().mockReturnValue(snapshot),
      crearDocumentoEmitido: vi.fn().mockResolvedValue({ id: 1 }),
    } as unknown as LogisticaService;
    const pdfGenerator = {
      render: vi.fn().mockResolvedValue(pdf),
    } as unknown as PdfGeneratorService;
    const storage = {
      saveFile: vi.fn().mockResolvedValue(undefined),
    } as unknown as StorageService;
    const controller = new LogisticaController(
      logisticaService,
      pdfGenerator,
      storage,
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

  it('reuses the stored PDF when the document snapshot has not changed', async () => {
    const { createHash } = await import('node:crypto');
    const orden = { id: 12, consecutivo: 'OS-2026-0012', acta_consecutivo: 'AS-2026-0012' };
    const snapshot = { documento: { tipo: 'ACTA_SERVICIO' }, formato: { id: 1 } };
    const cachedPdf = Buffer.from('%PDF-1.7 cached');
    const cachedHash = createHash('sha256').update(cachedPdf).digest('hex');
    const logisticaService = {
      findOneForPdf: vi.fn().mockResolvedValue(orden),
      buildPdfSnapshot: vi.fn().mockResolvedValue(snapshot),
      findDocumentoEmitido: vi.fn().mockResolvedValue({
        id: 1,
        tipo: 'ACTA',
        consecutivo: 'AS-2026-0012',
        snapshot_json: snapshot,
        pdf_storage_key: 'logistica/AS-2026-0012-acta.pdf',
        pdf_hash: cachedHash,
      }),
      upsertDocumentoEmitido: vi.fn(),
    } as unknown as LogisticaService;
    const pdfGenerator = { render: vi.fn() } as unknown as PdfGeneratorService;
    const storage = {
      getFile: vi.fn().mockResolvedValue(cachedPdf),
      saveFile: vi.fn(),
    } as unknown as StorageService;
    const controller = new LogisticaController(
      logisticaService,
      pdfGenerator,
      storage,
    );
    const response = { setHeader: vi.fn(), send: vi.fn() } as unknown as Response;
    const request = {
      user: { id: 8 },
      rbac: {
        permission: 'logistica.ordenes.ver',
        policy: { userId: 8, scopeIds: [3], ownScopeIds: [] },
        resourceScopeIds: [3],
      },
    } as RbacRequest;

    await controller.descargarPdf(12, 'acta', response, request);

    expect(logisticaService.findDocumentoEmitido).toHaveBeenCalledWith(
      'ACTA',
      'AS-2026-0012',
    );
    expect(pdfGenerator.render).not.toHaveBeenCalled();
    expect(storage.saveFile).not.toHaveBeenCalled();
    expect(logisticaService.upsertDocumentoEmitido).not.toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith(cachedPdf);
  });

  it.each(['invalid', 'ORDEN_SERVICIO', ''])(
    'rejects unsupported document type %j before looking up an order',
    async (tipo) => {
      const logisticaService = {
        findOne: vi.fn(),
      } as unknown as LogisticaService;
      const storage = {
        saveFile: vi.fn().mockResolvedValue(undefined),
      } as unknown as StorageService;
      const controller = new LogisticaController(
        logisticaService,
        {} as PdfGeneratorService,
        storage,
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
