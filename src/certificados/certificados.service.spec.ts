import { operationalCycle, qualityEvaluations, materialFixture } from '../../test/fixtures/operational-cycle.js';
import { CicloParametroEvaluacion } from '../planta/entities/ciclo-parametro-evaluacion.entity.js';
import type { EntityManager } from 'typeorm';
import { CicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import { CertificadoEsterilizacion } from './entities/certificado-esterilizacion.entity.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { CertificadosService } from './certificados.service.js';
import { User } from '../users/entities/user.entity.js';

describe('CertificadosService', () => {
  const createService = (ultimoValor = '0') => {
    const sequence = {
      nombre: 'certificado_esterilizacion',
      ultimo_valor: ultimoValor,
    } as SecuenciaConsecutivos;
    const certificateRepository = {
      create: vi.fn((values: Partial<CertificadoEsterilizacion>) => values),
      save: vi.fn(async (values: Partial<CertificadoEsterilizacion>) => values),
    };
    const sequenceRepository = {
      findOne: vi.fn(async () => sequence),
      save: vi.fn(async (value: SecuenciaConsecutivos) => value),
    };
    const userRepository = {
      findOne: vi.fn(async () => ({ id: 7, nombre: 'María Aprobadora', rol: 'CALIDAD' })),
    };
    const formatoResolver = { resolveCertificado: vi.fn(async () => ({ id: 15, version: 5, fecha_version: '2024-11-25', renderer_key: 'certificado_v5', configuracion_json: { document_code: 'R-AQ-09' } })) };
    const generatedSnapshots: Record<string, any>[] = [];
    const pdfGenerator = {
      generate: vi.fn(async (snapshot: Record<string, any>) => {
        generatedSnapshots.push(snapshot);
        return { storageKey: 'certificados/001.pdf', hash: 'a'.repeat(64) };
      }),
      remove: vi.fn(),
    };
    const manager = {
      getRepository: vi.fn((entity: typeof SecuenciaConsecutivos | typeof CertificadoEsterilizacion | typeof User) =>
        entity === CicloParametroEvaluacion ? {insert:vi.fn(async()=>({}))} : entity === SecuenciaConsecutivos
          ? sequenceRepository
          : entity === User
            ? userRepository
            : certificateRepository,
      ),
    } as unknown as EntityManager;
    const dataSource = { transaction: vi.fn() };
    return {
      service: new CertificadosService(
        {} as never,
        dataSource as never,
        formatoResolver as never,
        pdfGenerator as never,
      ),
      manager,
      sequence,
      sequenceRepository,
      certificateRepository,
      userRepository,
      generatedSnapshots,
    };
  };

  it('starts the certificate sequence at 001 and persists it in the transaction', async () => {
    const { service, manager, sequence, sequenceRepository, certificateRepository } = createService();
    const cycle = {
      ...operationalCycle(),
      id: 12,
      orden_id: 90,
      equipo: 'E03',
      metodo: 'ETO',
      temperatura: 55,
      humedad: 70,
      presion: -5,
      tiempo_exposicion: 180,
      tiempo_aireacion: 10,
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
      orden: { id: 90, materiales:[materialFixture] },
    } as CicloEsterilizacion;

    const result = await service.emitirDesdeCiclo(manager, cycle, 7, new Date(), qualityEvaluations);

    expect(sequenceRepository.findOne).toHaveBeenCalledWith({
      where: { nombre: 'certificado_esterilizacion' },
      lock: { mode: 'pessimistic_write' },
    });
    expect(sequence.ultimo_valor).toBe('1');
    expect(result.fecha_vencimiento).toBe('2027-02-28');
    expect(result.snapshot_datos?.materiales).toMatchObject([{lote:'L1',cantidad:39}]);
    expect(result.snapshot_datos?.informacion_tecnica).toMatchObject({tablas:{VAPOR:expect.arrayContaining([expect.objectContaining({resultado:'N/A'})])}});
    expect(result).toEqual(expect.objectContaining({ consecutivo: '001', ciclo_id: 12 }));
    expect(result.pdf_renderer_version).toBe('react-playwright-v2');
    expect(certificateRepository.save).toHaveBeenCalled();
  });

  it('returns only non-sensitive certificate validation fields', async () => {
    const certificateRepository = {
      findOne: vi.fn(async () => ({
        equipo: 'E03', estado: 'Aprobado', aprobado_at: new Date('2026-11-01T12:00:00Z'),
        cliente: { razon_social: 'Confidencial S.A.', nit: '900123456' },
        cicloEsterilizacion: { metodo: 'ETO' },
      })),
    };
    const service = new CertificadosService(certificateRepository as never, {} as never, {} as never, {} as never);

    const result = await service.validarToken('public-token');

    expect(result).toEqual({
      valido: true,
      equipo: 'E03',
      fecha_emision: new Date('2026-11-01T12:00:00Z'),
      fecha_vencimiento: null,
      estado: 'Aprobado',
    });
    expect(JSON.stringify(result)).not.toMatch(/Confidencial|900123456|ETO/);
  });

  it('does not persist a certificate if PDF rendering times out', async () => {
    const { service, manager, certificateRepository } = createService();
    const pdfGenerator = (service as any).pdfGenerator;
    pdfGenerator.generate.mockRejectedValue(new Error('render timeout'));

    await expect(service.emitirDesdeCiclo(
      manager,
      operationalCycle(),
      7,
      new Date(),
      qualityEvaluations,
    )).rejects.toThrow('render timeout');
    expect(certificateRepository.save).not.toHaveBeenCalled();
  });

  it('regenerates a legacy certificate PDF and persists its new storage key and hash', async () => {
    const certificate = {
      id: 8,
      consecutivo: '001',
      estado: 'Aprobado',
      pdf_url: 'certificados/001.pdf',
      hash_pdf: 'old-hash',
      pdf_renderer_version: null,
      snapshot_datos: {
        documento: { tipo: 'CERTIFICADO', consecutivo: '001' },
        certificado: { consecutivo: '001', token_publico: 'test-token' },
      },
    } as unknown as CertificadoEsterilizacion;
    const certificateRepository = {
      findOne: vi.fn(async () => certificate),
      save: vi.fn(async (value: CertificadoEsterilizacion) => value),
    };
    const pdfGenerator = {
      generate: vi.fn(async (_snapshot: unknown, storageKey: string) => ({
        storageKey,
        hash: 'c'.repeat(64),
      })),
    };
    const dataSource = {
      transaction: vi.fn(async (work: (manager: unknown) => unknown) =>
        work({ getRepository: vi.fn(() => certificateRepository) }),
      ),
    };
    const service = new CertificadosService(
      certificateRepository as never,
      dataSource as never,
      {} as never,
      pdfGenerator as never,
    );

    const result = await service.ensurePdfCurrent(8);

    expect(pdfGenerator.generate).toHaveBeenCalledWith(
      certificate.snapshot_datos,
      'certificados/001-react-playwright-v1.pdf',
    );
    expect(result.pdf_url).toBe('certificados/001-react-playwright-v1.pdf');
    expect(result.hash_pdf).toBe('c'.repeat(64));
    expect(result.pdf_renderer_version).toBe('react-playwright-v1');
    expect(certificateRepository.save).toHaveBeenCalledWith(certificate);
  });

  it('keeps padding to a minimum of three digits after the sequence grows', async () => {
    const { service, manager } = createService('9');
    const result = await service.emitirDesdeCiclo(
      manager,
      operationalCycle({id:1,orden_id:2}),
      7,
      new Date(),
      qualityEvaluations,
    );

    expect(result.consecutivo).toBe('010');
  });

  it('continues beyond three digits without a business cap', async () => {
    const { service, manager, sequence } = createService('999');
    const result = await service.emitirDesdeCiclo(
      manager,
      operationalCycle({id:1,orden_id:2}),
      7,
      new Date(),
      qualityEvaluations,
    );

    expect(result.consecutivo).toBe('1000');
    expect(sequence.ultimo_valor).toBe('1000');
  });

  it('rejects exhausted numbers before changing the sequence or generating a PDF', async () => {
    const { service, manager, sequenceRepository, certificateRepository, generatedSnapshots } = createService('99999999');
    await expect(service.emitirDesdeCiclo(
      manager,
      operationalCycle({id:1,orden_id:2}),
      7,
      new Date(),
      qualityEvaluations,
    )).rejects.toMatchObject({ response: { code: 'CONSECUTIVO_AGOTADO' } });
    expect(sequenceRepository.save).not.toHaveBeenCalled();
    expect(certificateRepository.save).not.toHaveBeenCalled();
    expect(generatedSnapshots).toHaveLength(0);
  });

  it('persists all preview data and version metadata in the PDF snapshot', async () => {
    const { service, manager, userRepository, generatedSnapshots } = createService();
    const cycle = {
      ...operationalCycle(),
      id: 12,
      orden_id: 90,
      equipo: 'E03',
      metodo: 'ETO',
      temperatura: 55,
      humedad: 70,
      presion: -5,
      tiempo_exposicion: 180,
      tiempo_aireacion: 10,
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
      fecha_proceso: new Date('2026-11-04T12:00:00.000Z'),
      orden: {
        id: 90,
        materiales:[materialFixture],
        consecutivo: 'ORD-090',
        cotizacion: {
          cliente: { id: 3, razon_social: 'Cliente Demo', nit: '900123456' },
          items: [{ id: 4, descripcion: 'Bata', cantidad: 3 }],
        },
      },
    } as unknown as CicloEsterilizacion;

    await service.emitirDesdeCiclo(manager, cycle, 7, new Date('2026-11-04T15:00:00.000Z'), qualityEvaluations);

    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(generatedSnapshots[0]).toMatchObject({
      formato: {
        codigo: 'R-AQ-09',
        version: 5,
        fecha_version: '2024-11-25',
        configuracion_json: { document_code: 'R-AQ-09' },
      },
      aprobador: { id: 7, nombre: 'María Aprobadora', rol: 'CALIDAD' },
      ciclo_esterilizacion: {
        fecha_proceso: '2026-11-04T12:00:00.000Z',
        orden: {
          consecutivo: 'ORD-090',
          cotizacion: {
            cliente: { razon_social: 'Cliente Demo', nit: '900123456' },
            items: [{ id: 4, descripcion: 'Bata', cantidad: 3 }],
          },
        },
      },
    });
  });
});
