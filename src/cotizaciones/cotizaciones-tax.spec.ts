import { CotizacionesService } from './cotizaciones.service.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { quotePermission } from '../../test/fixtures/quote-permission.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto.js';

describe('Authoritative IVA at quote creation', () => {
  const dto = {
    cliente_id: 1,
    tipo_servicio: 'INSUMOS',
    items: [
      {
        descripcion: 'A',
        tipo_item: 'PRODUCTO',
        categoria: 'EMPAQUES',
        cantidad: 3,
        valor_unitario: 10.55,
        unidad: 'unidad',
        precision_cantidad: 0,
      },
    ],
  };
  function fixture(rate = '0.050000') {
    let saved: unknown;
    const repo = {
      create: (value: unknown) => value,
      save: async (value: unknown) => {
        saved = { ...(value as object), id: 1 };
        return saved;
      },
      findOne: async () => saved,
    };
    const manager = {
      query: vi.fn(async () => [{ id: 9, version: 2, tasa: rate }]),
      getRepository: (entity: unknown) =>
        entity === SecuenciaConsecutivos
          ? {
              findOne: async () => ({ ultimo_valor: '0' }),
              save: async () => undefined,
            }
          : repo,
    };
    const service = new CotizacionesService(
      repo as never,
      { create: (v: unknown) => v } as never,
      { findOne: async () => ({}) } as never,
      {
        transaction: async (fn: (m: unknown) => unknown) => fn(manager),
      } as never,
      {} as never,
      {} as never,
      {} as never,
    );
    return { service };
  }
  it('calculates amounts using the database version and ignores injected service-level totals', async () => {
    const { service } = fixture();
    const quote = await service.create(
      { ...dto, iva: 999, iva_tasa: '0.99' } as never,
      quotePermission('cotizaciones.crear'),
    );
    expect(quote).toMatchObject({
      subtotal: 31.65,
      iva: 1.58,
      total: 33.23,
      iva_tasa: '0.050000',
      iva_version_id: 9,
    });
  });
  it('rejects an outdated preview version instead of silently changing the price', async () => {
    const { service } = fixture();
    await expect(
      service.create(
        { ...dto, iva_version_esperada_id: 1 } as never,
        quotePermission('cotizaciones.crear'),
      ),
    ).rejects.toMatchObject({ status: 409 });
  });
  it('rounds an exact half cent upwards without binary floating-point drift', async () => {
    const { service } = fixture('0.145000');
    const quote = await service.create(
      {
        ...dto,
        items: [{ ...dto.items[0], cantidad: 1, valor_unitario: 1 }],
      } as never,
      quotePermission('cotizaciones.crear'),
    );
    expect(quote.iva).toBe(0.15);
    expect(quote.total).toBe(1.15);
  });
  it('HTTP DTO rejects attempts to inject rate, version, tax and totals', async () => {
    const errors = await validate(
      plainToInstance(CreateCotizacionDto, {
        ...dto,
        iva_tasa: '0',
        iva_version_id: 1,
        iva: 0,
        subtotal: 0,
        total: 0,
        items: [{ ...dto.items[0] }],
      }),
      { whitelist: true, forbidNonWhitelisted: true },
    );
    expect(errors.map((error) => error.property).sort()).toEqual([
      'iva',
      'iva_tasa',
      'iva_version_id',
      'subtotal',
      'total',
    ]);
  });
});
