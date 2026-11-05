import type { DataSource, Repository } from 'typeorm';
import { CotizacionesService } from './cotizaciones.service.js';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { TipoServicioCotizacion } from './entities/tipo-servicio.enum.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';

describe('CotizacionesService consecutivos', () => {
  const createService = (existingConsecutivos: string[] = []) => {
    let savedCotizacion: Cotizacion;
    let sequence: SecuenciaConsecutivos | null = null;
    const cotizacionesRepository = {
      create: vi.fn((value: Partial<Cotizacion>) => value as Cotizacion),
      save: vi.fn(async (value: Cotizacion) => {
        savedCotizacion = { ...value, id: 1 };
        return savedCotizacion;
      }),
      findOne: vi.fn(async () => savedCotizacion),
    };
    const itemsRepository = {
      create: vi.fn((value: Partial<CotizacionItem>) => value as CotizacionItem),
    };
    const clientesService = { findOne: vi.fn(async () => ({})) };
    const sequenceRepository = {
      findOne: vi.fn(async ({ where }: { where: { nombre: string } }) => {
        if (!sequence) {
          const prefix = where.nombre.slice('cotizacion:'.length);
          const maximum = existingConsecutivos
            .filter((value) => value.startsWith(`${prefix}-`))
            .map((value) => Number(value.split('-').at(-1)))
            .reduce((max, value) => Math.max(max, Number.isFinite(value) ? value : 0), 0);
          sequence = { nombre: where.nombre, ultimo_valor: String(maximum) } as SecuenciaConsecutivos;
        }
        return sequence;
      }),
      create: vi.fn((value: Partial<SecuenciaConsecutivos>) => value as SecuenciaConsecutivos),
      save: vi.fn(async (value: SecuenciaConsecutivos) => { sequence = value; return value; }),
    };
    const manager = {
      getRepository: vi.fn((entity: unknown) => entity === SecuenciaConsecutivos ? sequenceRepository : cotizacionesRepository),
    };
    const dataSource = { transaction: vi.fn(async (work: (manager: unknown) => unknown) => work(manager)) };
    const service = new CotizacionesService(
      cotizacionesRepository as unknown as Repository<Cotizacion>,
      itemsRepository as unknown as Repository<CotizacionItem>,
      clientesService as never,
      dataSource as unknown as DataSource,
      {} as never,
      {} as never,
      {} as never,
    );

    return { service, cotizacionesRepository, sequenceRepository };
  };

  it.each([
    [TipoServicioCotizacion.INSUMOS, 'COT-CMI-001'],
    [TipoServicioCotizacion.LAVANDERIA, 'COT-LAV-001'],
    [TipoServicioCotizacion.FARMACEUTICO, 'COT-CEMFA-001'],
    [TipoServicioCotizacion.FABRICANTE, 'COT-CMED-001'],
    [TipoServicioCotizacion.INSTITUCIONAL_ETO, 'COT-CME-001'],
    [TipoServicioCotizacion.INSTITUCIONAL_VAPOR, 'COT-CME-001'],
  ])('genera %s con consecutivo %s', async (tipo_servicio, expected) => {
    const { service, cotizacionesRepository } = createService();

    await service.create({
      cliente_id: 1,
      tipo_servicio,
      items: [{ descripcion: 'Servicio', cantidad: 1, valor_unitario: 100 }],
    }, 42);

    expect(cotizacionesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ consecutivo: expected, creador_id: 42 }),
    );
  });

  it('incrementa el último consecutivo del mismo tipo', async () => {
    const { service, cotizacionesRepository } = createService([
      'COT-CMI-009',
      'COT-LAV-018',
    ]);

    await service.create({
      cliente_id: 1,
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      items: [{ descripcion: 'Servicio', cantidad: 1, valor_unitario: 100 }],
    });

    expect(cotizacionesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ consecutivo: 'COT-CMI-010' }),
    );
  });

  it('genera consecutivos INDUSTRIAL_ETO con el prefijo COT-IND', async () => {
    const { service, cotizacionesRepository } = createService();

    await service.create({
      cliente_id: 1,
      tipo_servicio: TipoServicioCotizacion.INDUSTRIAL_ETO,
      items: [{ descripcion: 'Servicio', cantidad: 1, valor_unitario: 100 }],
    });

    expect(cotizacionesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ consecutivo: 'COT-IND-001' }),
    );
  });

  it('continúa más allá de 999 sin truncar el consecutivo', async () => {
    const { service, cotizacionesRepository } = createService(['COT-LAV-999']);

    await service.create({
      cliente_id: 1,
      tipo_servicio: TipoServicioCotizacion.LAVANDERIA,
      items: [{ descripcion: 'Servicio', cantidad: 1, valor_unitario: 100 }],
    });

    expect(cotizacionesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ consecutivo: 'COT-LAV-1000' }),
    );
  });

  it('mantiene números de cotización de mil millones', async () => {
    const { service, cotizacionesRepository } = createService(['COT-CMI-999999999']);

    await service.create({
      cliente_id: 1,
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      items: [{ descripcion: 'Servicio', cantidad: 1, valor_unitario: 100 }],
    });

    expect(cotizacionesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ consecutivo: 'COT-CMI-1000000000' }),
    );
  });
});
