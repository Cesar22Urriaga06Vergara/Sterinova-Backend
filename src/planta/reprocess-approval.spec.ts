import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CalidadService } from '../calidad/calidad.service.js';
import { PlantaService } from './planta.service.js';
import { EstadoCicloEsterilizacion } from './entities/ciclo-esterilizacion.entity.js';

function fixture() {
  const cycle = {
    id: 31,
    estado: EstadoCicloEsterilizacion.RECHAZADO,
    reproceso_calidad_autorizado_por_id: null as number | null,
    reproceso_planta_autorizado_por_id: null as number | null,
  };
  const repository = {
    findOne: vi.fn(async () => cycle),
    save: vi.fn(async () => cycle),
  };
  const manager = { getRepository: vi.fn(() => repository) };
  const dataSource = { transaction: vi.fn(async (work) => work(manager)) };
  const audit = { create: vi.fn(async () => ({})) };
  const quality = new CalidadService(dataSource as never, {} as never, {} as never, {} as never, audit as never);
  const plant = new PlantaService(dataSource as never, audit as never);
  return { cycle, repository, dataSource, audit, quality, plant };
}

describe('Aprobaciones previas al reproceso', () => {
  it('Calidad documenta la primera autorización solo en ciclos rechazados', async () => {
    const { cycle, quality, audit, repository } = fixture();
    await expect(quality.autorizarReproceso(31, { motivo: '  ' }, 17)).rejects.toBeInstanceOf(BadRequestException);
    cycle.estado = EstadoCicloEsterilizacion.PENDIENTE_CALIDAD;
    await expect(quality.autorizarReproceso(31, { motivo: 'Reprocesar' }, 17)).rejects.toBeInstanceOf(ConflictException);
    cycle.estado = EstadoCicloEsterilizacion.RECHAZADO;
    await quality.autorizarReproceso(31, { motivo: '  Desviación controlada ' }, 17);
    expect(cycle.reproceso_calidad_autorizado_por_id).toBe(17);
    expect(repository.save).toHaveBeenCalledOnce();
    expect(audit.create).toHaveBeenCalledWith(expect.objectContaining({ detalle: { tipo: 'reproceso_calidad', motivo: 'Desviación controlada' } }), expect.anything());
    await expect(quality.autorizarReproceso(31, { motivo: 'Otra vez' }, 19)).rejects.toBeInstanceOf(ConflictException);
  });

  it('Planta exige autorización previa de Calidad y una persona distinta', async () => {
    const { cycle, plant, audit, repository } = fixture();
    await expect(plant.autorizarReproceso(31, { motivo: 'Equipo disponible' }, 18)).rejects.toBeInstanceOf(ConflictException);
    cycle.reproceso_calidad_autorizado_por_id = 17;
    await expect(plant.autorizarReproceso(31, { motivo: 'Equipo disponible' }, 17)).rejects.toBeInstanceOf(ForbiddenException);
    await plant.autorizarReproceso(31, { motivo: 'Equipo disponible' }, 18);
    expect(cycle.reproceso_planta_autorizado_por_id).toBe(18);
    expect(repository.save).toHaveBeenCalledOnce();
    expect(audit.create).toHaveBeenCalledWith(expect.objectContaining({ detalle: { tipo: 'reproceso_planta', motivo: 'Equipo disponible' } }), expect.anything());
    await expect(plant.autorizarReproceso(31, { motivo: 'Otra vez' }, 20)).rejects.toBeInstanceOf(ConflictException);
  });
});
