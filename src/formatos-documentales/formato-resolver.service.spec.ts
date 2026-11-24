import type { DataSource, EntityManager } from 'typeorm';
import { FormatoAsignacionesCliente } from './entities/formato-asignaciones-cliente.entity.js';
import { FormatoVersiones } from './entities/formato-versiones.entity.js';
import { FormatosDocumentales } from './entities/formatos-documentales.entity.js';
import { FormatoResolverService } from './formato-resolver.service.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';

describe('FormatoResolverService', () => {
  const createResolver = (options?: {
    assignment?: FormatoAsignacionesCliente | null;
    assignmentVersion?: FormatoVersiones | null;
    globalVersion?: FormatoVersiones | null;
  }) => {
    const format = {
      id: 10,
      clave: 'COTIZACION_LAVANDERIA',
    } as FormatosDocumentales;
    const formatsRepository = {
      findOne: vi.fn(async () => format),
    };
    const assignmentsRepository = {
      findOne: vi.fn(async () => options?.assignment ?? null),
    };
    const versionsRepository = {
      findOne: vi.fn(async (query: { where: { id?: number } }) =>
        query.where.id
          ? (options?.assignmentVersion ?? null)
          : (options?.globalVersion ?? null),
      ),
    };
    const manager = {
      getRepository: vi.fn((entity: unknown) => {
        if (entity === FormatosDocumentales) return formatsRepository;
        if (entity === FormatoAsignacionesCliente) return assignmentsRepository;
        return versionsRepository;
      }),
    } as unknown as EntityManager;
    const resolver = new FormatoResolverService({
      manager,
    } as unknown as DataSource);
    return {
      resolver,
      manager,
      formatsRepository,
      assignmentsRepository,
      versionsRepository,
    };
  };

  it('uses a published client-specific version before the global version', async () => {
    const specificVersion = {
      id: 22,
      formato_id: 10,
      estado: 'PUBLICADA',
      es_vigente: false,
    } as FormatoVersiones;
    const { resolver } = createResolver({
      assignment: {
        version_formato_id: 22,
        formato_id: 10,
      } as FormatoAsignacionesCliente,
      assignmentVersion: specificVersion,
      globalVersion: { id: 11 } as FormatoVersiones,
    });

    await expect(resolver.resolve('COTIZACION_LAVANDERIA', 45)).resolves.toBe(
      specificVersion,
    );
  });

  it('uses the vigente published global version when there is no client override', async () => {
    const globalVersion = {
      id: 11,
      formato_id: 10,
      estado: 'PUBLICADA',
      es_vigente: true,
    } as FormatoVersiones;
    const { resolver, versionsRepository } = createResolver({ globalVersion });

    await expect(resolver.resolve('COTIZACION_LAVANDERIA', 45)).resolves.toBe(
      globalVersion,
    );
    expect(versionsRepository.findOne).toHaveBeenCalledWith({
      where: {
        formato_id: 10,
        estado: 'PUBLICADA',
        es_vigente: true,
      },
    });
  });

  it('checks canonical client format types while retaining the legacy type lookup', async () => {
    const clientFormat = {
      id: 12,
      clave: 'CLIENTE_ETO',
    } as FormatosDocumentales;
    const formatsRepository = {
      findOne: vi.fn(
        async (query: { where: { tipo_servicio?: string; clave?: string } }) =>
          query.where.tipo_servicio === 'SERV_ETO_FARMA' ||
          query.where.clave === 'CLIENTE_ETO'
            ? clientFormat
            : null,
      ),
    };
    const assignmentsRepository = { findOne: vi.fn(async () => null) };
    const versionsRepository = { findOne: vi.fn(async () => ({ id: 45 })) };
    const manager = {
      getRepository: vi.fn((entity: unknown) =>
        entity === FormatosDocumentales
          ? formatsRepository
          : entity === FormatoAsignacionesCliente
            ? assignmentsRepository
            : versionsRepository,
      ),
    } as unknown as EntityManager;
    const resolver = new FormatoResolverService({
      manager,
    } as unknown as DataSource);

    await expect(
      resolver.resolveCotizacion(
        TipoServicioCotizacion.FARMACEUTICO,
        45,
        manager,
      ),
    ).resolves.toEqual({ id: 45 });
    expect(formatsRepository.findOne).toHaveBeenCalledWith({
      where: {
        tipo_documento: 'COTIZACION',
        tipo_servicio: 'FARMACEUTICO',
        cliente_id: 45,
      },
    });
    expect(formatsRepository.findOne).toHaveBeenCalledWith({
      where: {
        tipo_documento: 'COTIZACION',
        tipo_servicio: 'SERV_ETO_FARMA',
        cliente_id: 45,
      },
    });
  });

  it('falls back from canonical global key to the historical key', async () => {
    const legacyFormat = {
      id: 10,
      clave: 'COTIZACION_LAVANDERIA',
    } as FormatosDocumentales;
    const formatsRepository = {
      findOne: vi.fn(async (query: { where: { clave?: string } }) =>
        query.where.clave === 'COTIZACION_LAVANDERIA' ? legacyFormat : null,
      ),
    };
    const assignmentsRepository = { findOne: vi.fn(async () => null) };
    const versionsRepository = { findOne: vi.fn(async () => ({ id: 45 })) };
    const manager = {
      getRepository: vi.fn((entity: unknown) =>
        entity === FormatosDocumentales
          ? formatsRepository
          : entity === FormatoAsignacionesCliente
            ? assignmentsRepository
            : versionsRepository,
      ),
    } as unknown as EntityManager;
    const resolver = new FormatoResolverService({
      manager,
    } as unknown as DataSource);
    await expect(
      resolver.resolveCotizacion(
        TipoServicioCotizacion.LAVANDERIA,
        45,
        manager,
      ),
    ).resolves.toEqual({ id: 45 });
    expect(
      formatsRepository.findOne.mock.calls
        .map(([query]) => query.where.clave)
        .filter(Boolean),
    ).toEqual(['COTIZACION_SERV_LAV_FARMA', 'COTIZACION_LAVANDERIA']);
  });
});
