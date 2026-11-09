import { quotePermission } from '../../test/fixtures/quote-permission.js';
import { BadRequestException, ConflictException } from '@nestjs/common';
import type { DataSource, Repository } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { CotizacionesService } from './cotizaciones.service.js';

function serviceFor(quote: Partial<Cotizacion>) {
  const current = {
    id: 7,
    estado: 'Borrador',
    version: 1,
    fecha_emision: null,
    ...quote,
  } as Cotizacion;
  const repository = {
    findOne: vi.fn(async () => current),
    save: vi.fn(async (value: Cotizacion) => value),
    remove: vi.fn(async (value: Cotizacion) => value),
  };
  const manager = { getRepository: vi.fn(() => repository) };
  const dataSource = {
    transaction: vi.fn(async (work: (manager: unknown) => unknown) =>
      work(manager),
    ),
  };
  const service = new CotizacionesService(
    repository as unknown as Repository<Cotizacion>,
    {} as Repository<CotizacionItem>,
    { findOne: vi.fn(async () => ({ id: 3 })) } as never,
    dataSource as unknown as DataSource,
    {} as never,
    { getFile: vi.fn(async () => Buffer.from('%PDF')) } as never,
    {} as never,
  );
  return { service, current, repository, dataSource };
}

describe('CotizacionesService critical branch coverage', () => {
  it('rejects a quote without items before touching client or sequence data', async () => {
    const { service } = serviceFor({});

    await expect(
      service.create(
        {
          cliente_id: 3,
          tipo_servicio: 'LAVANDERIA',
          items: [],
        } as any,
        quotePermission('cotizaciones.crear'),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns an unissued quote without attempting PDF reconstruction', async () => {
    const { service } = serviceFor({
      fecha_emision: null,
      pdf_url: null,
      snapshot_datos: null,
    });

    await expect(
      service.ensurePdfCurrent(7, quotePermission('cotizaciones.descargar')),
    ).resolves.toMatchObject({ id: 7 });
  });

  it('returns an intact current PDF without saving or regenerating it', async () => {
    const pdfGenerator = { getFile: vi.fn(async () => Buffer.from('%PDF')) };
    const quote = {
      fecha_emision: new Date(),
      pdf_url: 'cotizaciones/COT-LAV-007.pdf',
      hash_pdf: 'a'.repeat(64),
      pdf_renderer_version: 'react-playwright-v1',
    } as Partial<Cotizacion>;
    const { service, repository } = serviceFor(quote);
    (service as any).pdfGenerator = pdfGenerator;

    await service.ensurePdfCurrent(
      7,
      quotePermission('cotizaciones.descargar'),
    );

    expect(pdfGenerator.getFile).toHaveBeenCalledWith(
      quote.pdf_url,
      quote.hash_pdf,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('keeps an emitted quote idempotent when emission is requested again', async () => {
    const { service, current } = serviceFor({
      fecha_emision: new Date(),
      pdf_url: 'cotizaciones/already.pdf',
    });

    await expect(
      service.emitir(7, quotePermission('cotizaciones.emitir')),
    ).resolves.toBe(current);
  });

  it('rejects all edits to emitted quotes', async () => {
    const { service, repository } = serviceFor({ fecha_emision: new Date() });
    await expect(
      service.update(
        7,
        { version: 1, condiciones_comerciales: 'Cambio' },
        quotePermission('cotizaciones.editar'),
      ),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('validates a replacement client before updating a draft quote', async () => {
    const { service, repository } = serviceFor({ fecha_emision: null });

    await service.update(
      7,
      { version: 1, cliente_id: 3 },
      quotePermission('cotizaciones.editar'),
    );

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ cliente_id: 3 }),
    );
  });

  it('blocks deletion of an emitted quote but removes a draft quote', async () => {
    const emitted = serviceFor({ fecha_emision: new Date() });
    await expect(
      emitted.service.remove(7, quotePermission('cotizaciones.eliminar')),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(emitted.repository.remove).not.toHaveBeenCalled();

    const draft = serviceFor({ fecha_emision: null });
    await expect(
      draft.service.remove(7, quotePermission('cotizaciones.eliminar')),
    ).resolves.toEqual({
      message: 'Cotización #7 eliminada',
    });
    expect(draft.repository.remove).toHaveBeenCalledWith(draft.current);
  });
});
