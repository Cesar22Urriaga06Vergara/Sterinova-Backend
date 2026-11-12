import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { ProtocoloEsterilizacionVersion } from './entities/protocolo-esterilizacion-version.entity.js';
import { OrdenServicioMaterial } from '../ordenes-servicio/entities/orden-servicio-material.entity.js';
import type { DataSource, EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { OrdenServicioEvento } from '../ordenes-servicio/entities/orden-servicio-evento.entity.js';
import { CicloEsterilizacion } from './entities/ciclo-esterilizacion.entity.js';
import { CreateCicloDto } from './dto/create-ciclo.dto.js';
import { PlantaService } from './planta.service.js';

describe('PlantaService', () => {
  const createService = () => {
    const orden = {
      id: 21,
      cotizacion_id:1,
      metodo_esterilizacion:'ETO',
      estado: EstadoOrdenServicio.EN_PLANTA,
    } as OrdenServicio;
    const operador = { id: 8, nombre: 'Ana', apellido: 'Operadora' } as User;
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
    const eventosRepository = {
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => value),
    };
    const manager = {
      getRepository: vi.fn((entity: typeof OrdenServicio | typeof User | typeof CicloEsterilizacion | typeof OrdenServicioEvento) => {
        if (entity === OrdenServicio) return ordenesRepository;
        if (entity === User) return usersRepository;
        if (entity === Cotizacion) return { findOneByOrFail:async()=>({tipo_servicio:'INDUSTRIAL_ETO'}) };
        if (entity === OrdenServicioMaterial) return {find:async()=>[{id:1,cantidad:5}]};
        if (entity === ProtocoloEsterilizacionVersion) return {findOne:async()=>({id:1,metodo:'ETO',especificaciones_json:{filas:[]}})};
        if (entity === OrdenServicioEvento) return eventosRepository;
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
      eventosRepository,
    };
  };

  it('creates a cycle and changes the order to PROCESADO atomically', async () => {
    const { service, orden, ordenesRepository, ciclosRepository, eventosRepository } =
      createService();
    const dto: CreateCicloDto = {
      orden_id: 21,
      materiales_procesados: [{ material_id: 1, cantidad: 4 }],
      equipo: 'CICLO 10M68',
      fecha_esterilizacion:'2026-10-30',
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
    expect(eventosRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        orden_id: 21,
        tipo: 'PROCESAMIENTO',
        usuario_id: 8,
        datos_json: {
          responsable: 'Ana Operadora',
          ciclo_id: 34,
          fecha_esterilizacion: '2026-10-30',
          materiales: [{ material_id: 1, cantidad: 4 }],
        },
      }),
    );
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
          materiales_procesados: [{ material_id: 1, cantidad: 4 }],
          equipo: 'CICLO 10M68',
      fecha_esterilizacion:'2026-10-30',
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

  it('rejects processed quantities greater than the received quantities', async () => {
    const { service, ciclosRepository } = createService();

    await expect(
      service.createCiclo(
        {
          orden_id: 21,
          materiales_procesados: [{ material_id: 1, cantidad: 6 }],
          equipo: 'CICLO 10M68',
          fecha_esterilizacion: '2026-10-30',
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
    ).rejects.toThrow('La cantidad procesada no puede superar la cantidad recibida');

    expect(ciclosRepository.save).not.toHaveBeenCalled();
  });
});
