import { ForbiddenException } from '@nestjs/common';
import { In } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { CertificadosService } from './certificados.service.js';

function access(
  scopeIds: number[],
  ownScopeIds: number[] = [],
  userId = 42,
): PermissionContext {
  return {
    permission: 'certificados.ver',
    policy: { userId, scopeIds, ownScopeIds },
    resourceScopeIds: scopeIds,
  };
}

function serviceWith(repository: Record<string, unknown>, pdfGenerator = {}) {
  return new CertificadosService(
    repository as never,
    {} as never,
    {} as never,
    pdfGenerator as never,
  );
}

describe('CertificadosService scope isolation', () => {
  it('filters certificate detail by the scope of its cycle', async () => {
    const repository = {
      findOne: vi.fn(async () => ({ id: 8, ciclo_id: 3 })),
    };
    await serviceWith(repository).findOne(8, access([10]));

    expect(repository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: [{ id: 8, cicloEsterilizacion: { scope_id: In([10]) } }],
      }),
    );
  });

  it('filters the certificate list by the scope of its cycle', async () => {
    const repository = { find: vi.fn(async () => []) };
    await serviceWith(repository).findAll(access([10]));

    expect(repository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: [{ cicloEsterilizacion: { scope_id: In([10]) } }],
      }),
    );
  });

  it('never selects commercial quote amounts for certificate readers', async () => {
    const repository = { find: vi.fn(async () => []) };
    await serviceWith(repository).findAll(access([10]));

    const options = repository.find.mock.calls[0][0];
    const cotizacion =
      options.select.cicloEsterilizacion.orden.cotizacion;
    expect(cotizacion.total).toBeUndefined();
    expect(cotizacion.subtotal).toBeUndefined();
    expect(cotizacion.iva).toBeUndefined();
    expect(cotizacion.condiciones_comerciales).toBeUndefined();
    expect(cotizacion.items.valor_unitario).toBeUndefined();
    expect(cotizacion.items.valor_total).toBeUndefined();
    expect(options.loadEagerRelations).toBe(false);
    expect(cotizacion.consecutivo).toBe(true);
    expect(cotizacion.items.cantidad).toBe(true);
  });

  it('limits own-scope grants to cycles operated by that user', async () => {
    const repository = {
      findOne: vi.fn(async () => ({ id: 8, ciclo_id: 3 })),
    };
    await serviceWith(repository).findOne(8, access([], [10], 42));

    expect(repository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: [
          {
            id: 8,
            cicloEsterilizacion: { scope_id: In([10]), operador_id: 42 },
          },
        ],
      }),
    );
  });

  it('denies certificates without an authorized scope', async () => {
    const repository = { findOne: vi.fn(), find: vi.fn() };
    const service = serviceWith(repository);

    await expect(service.findOne(8, access([], []))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(() => service.findAll(access([], []))).toThrow(ForbiddenException);
    expect(repository.findOne).not.toHaveBeenCalled();
    expect(repository.find).not.toHaveBeenCalled();
  });

  it('applies the same cycle scope when regenerating a PDF', async () => {
    const certificate = {
      id: 8,
      consecutivo: '001',
      pdf_url: 'certificados/001.pdf',
      hash_pdf: 'a'.repeat(64),
      pdf_renderer_version: 'react-playwright-v3',
      snapshot_datos: { schema_version: 2 },
    };
    const repository = {
      findOne: vi.fn(async () => certificate),
      save: vi.fn(async (value: unknown) => value),
    };
    const dataSource = {
      transaction: vi.fn(async (work: (manager: unknown) => unknown) =>
        work({ getRepository: () => repository }),
      ),
    };
    const pdfGenerator = {
      getFile: vi.fn(async () => Buffer.from('pdf')),
      generate: vi.fn(),
      remove: vi.fn(),
    };
    const service = new CertificadosService(
      repository as never,
      dataSource as never,
      {} as never,
      pdfGenerator as never,
    );

    await service.ensurePdfCurrent(8, access([10]));

    expect(repository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: [{ id: 8, cicloEsterilizacion: { scope_id: In([10]) } }],
      }),
    );
  });
});
