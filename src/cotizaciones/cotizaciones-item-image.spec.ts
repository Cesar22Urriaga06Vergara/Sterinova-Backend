import type { DataSource } from 'typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service.js';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { TipoServicioCotizacion } from './entities/tipo-servicio.enum.js';
import { quotePermission } from '../../test/fixtures/quote-permission.js';

function fixture(quoteOverrides: Record<string, unknown> = {}) {
  const item = {
    id: 3,
    imagen_key: null,
    imagen_sha256: null,
    imagen_mime_type: null,
    imagen_tamano_bytes: null,
  } as CotizacionItem;
  const quote = {
    id: 7,
    tipo_servicio: TipoServicioCotizacion.INSUMOS,
    estado: 'Borrador',
    fecha_emision: null,
    version: 2,
    aprobador_interno_id: 11,
    aprobado_internamente_at: new Date(),
    items: [item],
    ...quoteOverrides,
  } as Cotizacion;
  const quoteRepository = {
    findOne: vi.fn(async () => quote),
    save: vi.fn(async (value) => value),
  };
  const itemsRepository = {
    save: vi.fn(async (value) => value),
  };
  const manager = {
    getRepository: (entity: unknown) =>
      entity === Cotizacion ? quoteRepository : itemsRepository,
  };
  const imageStorage = {
    save: vi.fn(async () => ({
      imagen_key: '9d2227dd-9548-4890-aefd-016a478b7d2f.png',
      imagen_sha256: 'a'.repeat(64),
      imagen_mime_type: 'image/png',
      imagen_tamano_bytes: 256,
    })),
    delete: vi.fn(async () => undefined),
    toDataUri: vi.fn(),
  };
  const service = new CotizacionesService(
    {} as never,
    {} as never,
    {} as never,
    {
      transaction: async (work) => work(manager),
    } as unknown as DataSource,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    imageStorage as never,
  );
  return { service, item, quote, quoteRepository, itemsRepository, imageStorage };
}

describe('Cotización item images', () => {
  it('attaches a private image to an Insumos draft and invalidates prior approval', async () => {
    const { service, item, quote, quoteRepository, itemsRepository, imageStorage } =
      fixture();

    await expect(
      service.uploadItemImage(7, 3, { buffer: Buffer.from('image') }, quotePermission('cotizaciones.editar')),
    ).resolves.toEqual({ item_id: 3, imagen_disponible: true, version: 3 });

    expect(imageStorage.save).toHaveBeenCalledWith(Buffer.from('image'));
    expect(itemsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        imagen_key: '9d2227dd-9548-4890-aefd-016a478b7d2f.png',
        imagen_sha256: 'a'.repeat(64),
      }),
    );
    expect(quoteRepository.save).toHaveBeenCalled();
    expect(quote).toMatchObject({
      version: 3,
      aprobador_interno_id: null,
      aprobado_internamente_at: null,
    });
    expect(item.imagen_mime_type).toBe('image/png');
  });

  it('rejects images outside Insumos and for emitted quotes', async () => {
    const outsideInsumos = fixture({
      tipo_servicio: TipoServicioCotizacion.LAVANDERIA,
    });
    await expect(
      outsideInsumos.service.uploadItemImage(
        7,
        3,
        { buffer: Buffer.from('image') },
        quotePermission('cotizaciones.editar'),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(outsideInsumos.imageStorage.save).not.toHaveBeenCalled();

    const emitted = fixture({ fecha_emision: new Date() });
    await expect(
      emitted.service.uploadItemImage(
        7,
        3,
        { buffer: Buffer.from('image') },
        quotePermission('cotizaciones.editar'),
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('removes a draft image and clears its stored metadata', async () => {
    const { service, item, imageStorage } = fixture();
    item.imagen_key = '9d2227dd-9548-4890-aefd-016a478b7d2f.png';
    item.imagen_sha256 = 'a'.repeat(64);
    item.imagen_mime_type = 'image/png';
    item.imagen_tamano_bytes = 256;

    await expect(
      service.removeItemImage(7, 3, quotePermission('cotizaciones.editar')),
    ).resolves.toEqual({ item_id: 3, imagen_disponible: false, version: 3 });

    expect(item).toMatchObject({
      imagen_key: null,
      imagen_sha256: null,
      imagen_mime_type: null,
      imagen_tamano_bytes: null,
    });
    expect(imageStorage.delete).toHaveBeenCalledWith(
      '9d2227dd-9548-4890-aefd-016a478b7d2f.png',
    );
  });
});
