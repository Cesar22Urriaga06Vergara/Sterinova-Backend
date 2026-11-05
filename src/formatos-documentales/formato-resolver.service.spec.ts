import type { DataSource, EntityManager } from 'typeorm';
import { FormatoAsignacionesCliente } from './entities/formato-asignaciones-cliente.entity.js';
import { FormatoVersiones } from './entities/formato-versiones.entity.js';
import { FormatosDocumentales } from './entities/formatos-documentales.entity.js';
import { FormatoResolverService } from './formato-resolver.service.js';

describe('FormatoResolverService', () => {
  const createResolver = (options?: {
    assignment?: FormatoAsignacionesCliente | null;
    assignmentVersion?: FormatoVersiones | null;
    globalVersion?: FormatoVersiones | null;
  }) => {
    const format = { id: 10, clave: 'COTIZACION_LAVANDERIA' } as FormatosDocumentales;
    const formatsRepository = {
      findOne: vi.fn(async () => format),
    };
    const assignmentsRepository = {
      findOne: vi.fn(async () => options?.assignment ?? null),
    };
    const versionsRepository = {
      findOne: vi.fn(async (query: { where: { id?: number } }) =>
        query.where.id
          ? options?.assignmentVersion ?? null
          : options?.globalVersion ?? null,
      ),
    };
    const manager = {
      getRepository: vi.fn((entity: unknown) => {
        if (entity === FormatosDocumentales) return formatsRepository;
        if (entity === FormatoAsignacionesCliente) return assignmentsRepository;
        return versionsRepository;
      }),
    } as unknown as EntityManager;
    const resolver = new FormatoResolverService({ manager } as unknown as DataSource);
    return { resolver, manager, formatsRepository, assignmentsRepository, versionsRepository };
  };

  it('uses a published client-specific version before the global version', async () => {
    const specificVersion = {
      id: 22,
      formato_id: 10,
      estado: 'PUBLICADA',
      es_vigente: false,
    } as FormatoVersiones;
    const { resolver } = createResolver({
      assignment: { version_formato_id: 22, formato_id: 10 } as FormatoAsignacionesCliente,
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
});
