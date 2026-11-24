import { ForbiddenException } from '@nestjs/common';
import { CotizacionesController } from './cotizaciones.controller.js';
import type { CotizacionesService } from './cotizaciones.service.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import type { Response } from 'express';
import * as XLSX from '@e965/xlsx';

describe('cotizaciones controller deletion', () => {
  it('denies quote deletion instead of removing data physically', async () => {
    const controller = new CotizacionesController({} as CotizacionesService);
    const request = { rbac: { userId: 7 } } as unknown as RbacRequest;
    await expect(controller.remove(7, request)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    await expect(controller.remove(7, request)).rejects.toThrow(
      /anulaci/i,
    );
  });
});

describe('cotizaciones controller export', () => {
  it('entrega un Excel tabular de cotizaciones en el ámbito autorizado', async () => {
    const quote = { id: 3, consecutivo: 'COT-003', estado: 'APROBADA', cliente: { razon_social: 'Cliente B' }, fecha: new Date('2026-11-20T12:00:00.000Z'), total: 119 };
    const service = { findAll: vi.fn(async () => [quote]) };
    const controller = new CotizacionesController(service as never);
    const response = { setHeader: vi.fn(), send: vi.fn((bytes) => bytes) };
    const request = { rbac: { permission: 'cotizaciones.exportar', resourceScopeIds: [4] } };
    await controller.exportar(request as unknown as RbacRequest, response as unknown as Response);
    const bytes = response.send.mock.calls[0][0];
    expect(Buffer.isBuffer(bytes)).toBe(true);
    const book = XLSX.read(bytes, { type: 'buffer' });
    expect(XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { header: 1 })).toEqual([
      ['ID', 'Consecutivo', 'Estado', 'Cliente', 'Fecha', 'Total'],
      [3, 'COT-003', 'APROBADA', 'Cliente B', '2026-11-20', 119],
    ]);
    expect(service.findAll).toHaveBeenCalledWith(request.rbac);
  });
});
