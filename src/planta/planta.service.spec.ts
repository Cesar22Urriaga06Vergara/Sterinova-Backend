import type { DataSource, EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { CicloEsterilizacion } from './entities/ciclo-esterilizacion.entity.js';
import { CreateCicloDto } from './dto/create-ciclo.dto.js';
import { PlantaService } from './planta.service.js';

describe('PlantaService', () => {
  const createService = () => {
    const orden = {
      id: 21,
      estado: EstadoOrdenServicio.EN_PLANTA,
    } as OrdenServicio;
    const operador = { id: 8 } as User;
    let cicloGuardado: CicloEsterilizacion;
    const ordenesRepository = {
      findOne: vi.fn(async () => orden),
      find: vi.fn(async () => [orden]),
      save: vi.fn(async (value: OrdenServicio) => value),
    };
    const usersRepository = {
      findOneBy: vi.fn(async () => operador),
      findOne: vi.fn(async () => operador),
    };
    const ciclosRepository = {
      create: vi.fn((value: Partial<CicloEsterilizacion>) => value),
      save: vi.fn(async (value: CicloEsterilizacion) => {
        cicloGuardado = { ...value, id: 34 };
        return cicloGuardado;
      }),
      findOne: vi.fn(async () => cicloGuardado),
      find: vi.fn(async () => [cicloGuardado]),
    };
    const manager = {
      getRepository: vi.fn((entity: typeof OrdenServicio | typeof User | typeof CicloEsterilizacion) => {
        if (entity === OrdenServicio) return ordenesRepository;
        if (entity === User) return usersRepository;
        return ciclosRepository;
      }),
    };
    const dataSource = {
      getRepository: vi.fn((entity: typeof OrdenServicio | typeof CicloEsterilizacion) =>
        entity === OrdenServicio ? ordenesRepository : ciclosRepository,
      ),
      transaction: vi.fn(
        (work: (transactionManager: EntityManager) => Promise<unknown>) =>
          work(manager as unknown as EntityManager),
      ),
      manager,
    } as unknown as DataSource;

    return {
      service: new PlantaService(dataSource),
      orden,
      ordenesRepository,
      ciclosRepository,
    };
  };

  it('creates a cycle and changes the order to PROCESADO atomically', async () => {
    const { service, orden, ordenesRepository, ciclosRepository } =
      createService();
    const dto: CreateCicloDto = {
      orden_id: 21,
      equipo: 'CICLO 10M68',
      metodo: 'ETO',
      temperatura: 45,
      humedad: 60,
      presion: 1.2,
      tiempo_exposicion: 120,
      tiempo_aireacion: 30,
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
    };

    const result = await service.createCiclo(dto, 8);

    expect(result.id).toBe(34);
    expect(result.estado).toBe('PENDIENTE_CALIDAD');
    expect(ciclosRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ orden_id: 21, operador_id: 8 }),
    );
    expect(orden.estado).toBe(EstadoOrdenServicio.PROCESADO);
    expect(ordenesRepository.save).toHaveBeenCalledWith(orden);
  });

  it('returns only orders currently in EN_PLANTA', async () => {
    const { service, ordenesRepository } = createService();

    await service.findOrdenesEnPlanta();

    expect(ordenesRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { estado: EstadoOrdenServicio.EN_PLANTA },
      }),
    );
  });

  it('lists cycles with their associated order and operator', async () => {
    const { service, ciclosRepository } = createService();

    await service.findCiclos();

    expect(ciclosRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        relations: expect.arrayContaining(['orden', 'operador']),
      }),
    );
  });

  it('rejects cycle registration when the order is not in EN_PLANTA', async () => {
    const { service, orden, ciclosRepository } = createService();
    orden.estado = EstadoOrdenServicio.PROCESADO;

    await expect(
      service.createCiclo(
        {
          orden_id: orden.id,
          equipo: 'CICLO 10M68',
          metodo: 'ETO',
          temperatura: 45,
          humedad: 60,
          presion: 1.2,
          tiempo_exposicion: 120,
          tiempo_aireacion: 30,
          control_biologico: 'Negativo',
          control_quimico: 'Cambio de color',
        },
        8,
      ),
    ).rejects.toThrow('Solo se pueden registrar ciclos para órdenes EN_PLANTA');

    expect(ciclosRepository.save).not.toHaveBeenCalled();
  });
});
