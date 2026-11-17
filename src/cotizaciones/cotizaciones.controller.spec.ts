import { ForbiddenException } from '@nestjs/common';
import { CotizacionesController } from './cotizaciones.controller.js';
import type { CotizacionesService } from './cotizaciones.service.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';

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
