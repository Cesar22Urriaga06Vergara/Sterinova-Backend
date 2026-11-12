import type { DataSource } from 'typeorm';
import { FormatoVersiones, EstadoVersionFormato } from './entities/formato-versiones.entity.js';
import { FormatosDocumentales } from './entities/formatos-documentales.entity.js';
import { FormatosDocumentalesService } from './formatos-documentales.service.js';

function serviceFixture() {
  const format = {
    id: 3,
    codigo: 'R-CM-07-5',
    nombre: 'Lavandería farmacéutica',
  } as FormatosDocumentales;
  const version = {
    id: 9,
    formato_id: format.id,
    version: 5,
    estado: EstadoVersionFormato.BORRADOR,
    fecha_version: '2026-11-12',
    responsable: 'Calidad',
    configuracion_json: {
      document_code: format.codigo,
      title: format.nombre,
      version_label: '05',
      version_date: '2026-11-12',
    },
  } as FormatoVersiones;
  const formatRepository = {
    findOne: vi.fn(async () => format),
    save: vi.fn(),
  };
  const versionRepository = {
    find: vi.fn(async () => [version]),
    findOne: vi.fn(async () => version),
    save: vi.fn(async (value: FormatoVersiones) => value),
    create: vi.fn((value: Partial<FormatoVersiones>) => value),
  };
  const manager = {
    getRepository: vi.fn((entity: unknown) =>
      entity === FormatosDocumentales ? formatRepository : versionRepository,
    ),
  };
  const dataSource = {
    transaction: vi.fn(async (work: (manager: unknown) => unknown) =>
      work(manager),
    ),
  };
  const auditoria = { create: vi.fn(async () => ({})) };
  const service = new FormatosDocumentalesService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    dataSource as unknown as DataSource,
    auditoria as never,
  );
  return {
    service,
    format,
    version,
    formatRepository,
    versionRepository,
  };
}

describe('format version editing', () => {
  it('updates code and printed version only in the draft version configuration', async () => {
    const { service, format, version, formatRepository, versionRepository } =
      serviceFixture();

    await service.updateVersion(
      format.id,
      version.id,
      {
        codigo: 'R-CM-07-5A',
        nombre: 'Lavandería farmacéutica revisada',
        version_label: '05.1',
      },
      42,
    );

    expect(version.configuracion_json).toMatchObject({
      document_code: 'R-CM-07-5A',
      title: 'Lavandería farmacéutica revisada',
      version_label: '05.1',
    });
    expect(format).toMatchObject({
      codigo: 'R-CM-07-5',
      nombre: 'Lavandería farmacéutica',
    });
    expect(formatRepository.save).not.toHaveBeenCalled();
    expect(versionRepository.save).toHaveBeenCalledWith(version);
  });

  it('creates a new draft using the next internal version and inherited code', async () => {
    const { service, format, version, versionRepository } = serviceFixture();

    const created = await service.createVersion(
      format.id,
      { fecha_version: '2026-12-01', responsable: 'Calidad' },
      42,
    );

    expect(created).toMatchObject({
      formato_id: format.id,
      version: 6,
      estado: EstadoVersionFormato.BORRADOR,
      configuracion_json: {
        document_code: 'R-CM-07-5',
        version_label: '06',
      },
    });
    expect(version.configuracion_json.version_label).toBe('05');
    expect(versionRepository.save).toHaveBeenCalled();
  });
});
