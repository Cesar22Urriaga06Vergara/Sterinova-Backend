import { BadRequestException, ForbiddenException } from '@nestjs/common';
import type { DataSource, EntityManager } from 'typeorm';
import { CertificadosService } from '../certificados/certificados.service.js';
import { CicloEsterilizacion, EstadoCicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import { AuthService } from '../auth/auth.service.js';
import { CalidadService } from './calidad.service.js';

describe('CalidadService', () => {
  const createService = (overrides?: {
    passwordValid?: boolean;
    estado?: EstadoCicloEsterilizacion;
    cycleSaveFails?: boolean;
  }) => {
    const cycle = {
      id: 12,
      orden_id: 90,
      equipo: 'E03',
      metodo: 'ETO',
      estado: overrides?.estado ?? EstadoCicloEsterilizacion.PENDIENTE_CALIDAD,
    } as CicloEsterilizacion;
    const certificate = { id: 5, consecutivo: '001', ciclo_id: cycle.id, pdf_url: 'certificados/001.pdf' };
    const cycleRepository = {
      find: vi.fn(async () => [cycle]),
      findOne: vi.fn(async () => cycle),
      save: vi.fn(async (value: CicloEsterilizacion) => {
        if (overrides?.cycleSaveFails) throw new Error('commit path failure');
        return value;
      }),
    };
    const manager = {
      getRepository: vi.fn(() => cycleRepository),
    };
    const dataSource = {
      getRepository: vi.fn(() => cycleRepository),
      transaction: vi.fn(async (work: (manager: EntityManager) => Promise<unknown>) =>
        work(manager as unknown as EntityManager),
      ),
    } as unknown as DataSource;
    const authService = {
      verifyPassword: vi.fn(async () => overrides?.passwordValid ?? true),
    } as unknown as AuthService;
    const certificadosService = {
      emitirDesdeCiclo: vi.fn(async () => certificate),
    } as unknown as CertificadosService;
    const pdfGenerator = { remove: vi.fn(async () => undefined) };

    return {
      service: new CalidadService(dataSource, authService, certificadosService, pdfGenerator as never),
      cycle,
      cycleRepository,
      dataSource,
      authService,
      certificadosService,
      certificate,
      pdfGenerator,
    };
  };

  it('issues a certificate and approves the cycle after password confirmation', async () => {
    const { service, cycle, cycleRepository, certificadosService, certificate } = createService();

    const result = await service.aprobar({ ciclo_id: 12, password: 'calidad-pass' }, 7);

    expect(result).toBe(certificate);
    expect(certificadosService.emitirDesdeCiclo).toHaveBeenCalledWith(
      expect.anything(),
      cycle,
      7,
      expect.any(Date),
    );
    expect(cycle.estado).toBe(EstadoCicloEsterilizacion.APROBADO);
    expect(cycle.revisado_por).toBe(7);
    expect(cycleRepository.save).toHaveBeenCalledWith(cycle);
  });

  it('rejects approval when the password confirmation is invalid', async () => {
    const { service, dataSource } = createService({ passwordValid: false });

    await expect(
      service.aprobar({ ciclo_id: 12, password: 'wrong' }, 7),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('does not issue a certificate for a cycle that was already reviewed', async () => {
    const { service, certificadosService } = createService({
      estado: EstadoCicloEsterilizacion.APROBADO,
    });

    await expect(
      service.aprobar({ ciclo_id: 12, password: 'calidad-pass' }, 7),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(certificadosService.emitirDesdeCiclo).not.toHaveBeenCalled();
  });

  it('stores a trimmed rejection reason and reviewer identity', async () => {
    const { service, cycle, cycleRepository } = createService();

    await service.rechazar({ ciclo_id: 12, motivo: '  Revisar parámetro  ' }, 7);

    expect(cycle.estado).toBe(EstadoCicloEsterilizacion.RECHAZADO);
    expect(cycle.motivo_rechazo).toBe('Revisar parámetro');
    expect(cycle.revisado_por).toBe(7);
    expect(cycleRepository.save).toHaveBeenCalledWith(cycle);
  });

  it('removes the generated PDF when the quality transaction fails after PDF creation', async () => {
    const { service, pdfGenerator } = createService({ cycleSaveFails: true });

    await expect(
      service.aprobar({ ciclo_id: 12, password: 'calidad-pass' }, 7),
    ).rejects.toThrow('commit path failure');
    expect(pdfGenerator.remove).toHaveBeenCalledWith('certificados/001.pdf');
  });
});
