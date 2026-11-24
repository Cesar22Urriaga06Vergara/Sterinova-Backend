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
import { CicloMaterialProcesado } from './entities/ciclo-material-procesado.entity.js';

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
    const cicloMaterialesRepository = {
      find: vi.fn(async () => []),
      insert: vi.fn(async () => undefined),
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
      find: vi.fn(async () => []),
    };
    const eventosRepository = {
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => value),
    };
    const manager = {
      getRepository: vi.fn((entity: typeof OrdenServicio | typeof User | typeof CicloEsterilizacion | typeof OrdenServicioEvento | typeof CicloMaterialProcesado) => {
        if (entity === OrdenServicio) return ordenesRepository;
        if (entity === User) return usersRepository;
        if (entity === Cotizacion) return { findOneByOrFail:async()=>({tipo_servicio:'INDUSTRIAL_ETO'}) };
        if (entity === OrdenServicioMaterial) return {find:async()=>[{id:1,cantidad:5}]};
        if (entity === ProtocoloEsterilizacionVersion) return {findOne:async()=>({id:1,metodo:'ETO',especificaciones_json:{filas:[]}})};
        if (entity === OrdenServicioEvento) return eventosRepository;
        if (entity === CicloMaterialProcesado) return cicloMaterialesRepository;
        return ciclosRepository;
      }),
      query: vi.fn(async () => []),
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
      service: new PlantaService(dataSource, { create: vi.fn(async () => ({})) } as never),
      orden,
      ordenesRepository,
      ciclosRepository,
      eventosRepository,
      cicloMaterialesRepository,
      manager,
    };
  };

  it('creates a cycle and keeps the order EN_PLANTA while quantity remains pending', async () => {
    const { service, orden, ordenesRepository, ciclosRepository, eventosRepository, cicloMaterialesRepository } =
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
    // 4 de 5 recibidos: queda pendiente, la orden no se cierra
    expect(orden.estado).toBe(EstadoOrdenServicio.EN_PLANTA);
    expect(ordenesRepository.save).toHaveBeenCalledWith(orden);
    // Se registra el acumulado por material de orden
    expect(cicloMaterialesRepository.insert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ ciclo_id: 34, orden_servicio_material_id: 1, cantidad_procesada: 4 }),
      ]),
    );
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

  it('completes the order to PROCESADO when a second cycle consumes the pending quantity', async () => {
    const { service, orden, ordenesRepository, ciclosRepository, manager, cicloMaterialesRepository } =
      createService();
    // El ciclo previo ya procesó 4 de 5 recibidos
    manager.query = vi.fn(async () => [
      { material_id: 1, cantidad_procesada: '4' },
    ]);
    ciclosRepository.find = vi.fn(async (options) => options?.where?.estado === 'RECHAZADO' ? [] : [{ id: 34 }]);

    const dto: CreateCicloDto = {
      orden_id: 21,
      materiales_procesados: [{ material_id: 1, cantidad: 1 }],
      equipo: 'CICLO 10M68-B',
      fecha_esterilizacion:'2026-10-31',
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
    expect(orden.estado).toBe(EstadoOrdenServicio.PROCESADO);
    expect(ordenesRepository.save).toHaveBeenCalledWith(orden);
    expect(cicloMaterialesRepository.insert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ cantidad_procesada: 1 }),
      ]),
    );
  });

  it('permite procesar de nuevo las unidades de un ciclo rechazado', async () => {
    const { service, orden, ciclosRepository, manager } = createService();
    ciclosRepository.find = vi.fn(async (options) =>
      options?.where?.estado ? [] : [{ id: 33 }],
    );
    manager.query = vi.fn(async () => [{ material_id: 1, cantidad_procesada: '5' }]);
    await service.createCiclo({
      orden_id: 21,
      materiales_procesados: [{ material_id: 1, cantidad: 5 }],
      equipo: 'CICLO-REPROCESO',
      fecha_esterilizacion: '2026-11-20',
      metodo: 'ETO',
      temperatura: 45,
      humedad: 60,
      presion: 1.2,
      tiempo_exposicion: 120,
      tiempo_aireacion: 30,
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
    }, 8);
    expect(orden.estado).toBe(EstadoOrdenServicio.PROCESADO);
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('enlaza el nuevo ciclo con el único ciclo rechazado de la orden', async () => {
    const { service, ciclosRepository } = createService();
    ciclosRepository.find = vi.fn(async (options) =>
      options?.where?.estado === 'RECHAZADO' ? [{ id: 33, estado: 'RECHAZADO', reproceso_calidad_autorizado_por_id: 17, reproceso_planta_autorizado_por_id: 18 }] : [],
    );
    await service.createCiclo({
      orden_id: 21,
      materiales_procesados: [{ material_id: 1, cantidad: 5 }],
      equipo: 'CICLO-REPROCESO',
      fecha_esterilizacion: '2026-11-20',
      metodo: 'ETO',
      temperatura: 45,
      humedad: 60,
      presion: 1.2,
      tiempo_exposicion: 120,
      tiempo_aireacion: 30,
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
    }, 8);
    expect(ciclosRepository.save).toHaveBeenCalledWith(expect.objectContaining({ ciclo_correccion_de_id: 33 }));
  });

  it('bloquea la creación del nuevo ciclo hasta que Calidad y Planta lo autoricen', async () => {
    const { service, ciclosRepository } = createService();
    ciclosRepository.find = vi.fn(async (options) =>
      options?.where?.estado === 'RECHAZADO' ? [{ id: 33, estado: 'RECHAZADO', reproceso_calidad_autorizado_por_id: 17, reproceso_planta_autorizado_por_id: null }] : [],
    );
    await expect(service.createCiclo({
      orden_id: 21,
      materiales_procesados: [{ material_id: 1, cantidad: 5 }],
      equipo: 'CICLO-REPROCESO',
      fecha_esterilizacion: '2026-11-20',
      metodo: 'ETO',
      temperatura: 45,
      tiempo_exposicion: 120,
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
    }, 8)).rejects.toThrow(/Calidad y Planta/);
    expect(ciclosRepository.save).not.toHaveBeenCalled();
  });

  it('rejects a cycle when no quantity remains pending for any material', async () => {
    const { service, manager, ciclosRepository } = createService();
    // Ya se procesaron las 5 unidades recibidas (ciclo previo existe)
    ciclosRepository.find = vi.fn(async (options) => options?.where?.estado === 'RECHAZADO' ? [] : [{ id: 34 }]);
    manager.query = vi.fn(async () => [
      { material_id: 1, cantidad_procesada: '5' },
    ]);

    await expect(
      service.createCiclo(
        {
          orden_id: 21,
          materiales_procesados: [{ material_id: 1, cantidad: 1 }],
          equipo: 'CICLO 10M68-C',
          fecha_esterilizacion:'2026-11-01',
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
    ).rejects.toThrow(/no queda cantidad pendiente/i);

    expect(ciclosRepository.save).not.toHaveBeenCalled();
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
        relations: expect.objectContaining({
          orden: expect.anything(),
          operador: expect.anything(),
        }),
      }),
    );
  });

  it('never selects commercial quote amounts for Planta operators', async () => {
    const { service, ordenesRepository } = createService();

    await service.findOrdenesEnPlanta();

    const options = ordenesRepository.find.mock.calls[0][0];
    const cotizacion = options.select.cotizacion;
    expect(cotizacion.total).toBeUndefined();
    expect(cotizacion.subtotal).toBeUndefined();
    expect(cotizacion.iva).toBeUndefined();
    expect(cotizacion.condiciones_comerciales).toBeUndefined();
    expect(cotizacion.precio_incluye).toBeUndefined();
    expect(cotizacion.precio_no_incluye).toBeUndefined();
    expect(cotizacion.forma_pago).toBeUndefined();
    expect(cotizacion.validez_oferta).toBeUndefined();
    expect(cotizacion.snapshot_datos).toBeUndefined();
    // Eager quote items carry unit prices; they must not be loaded.
    expect(options.loadEagerRelations).toBe(false);
    expect(cotizacion.id).toBe(true);
    expect(cotizacion.consecutivo).toBe(true);
    expect(cotizacion.cliente.razon_social).toBe(true);
  });

  it('never selects commercial quote amounts when listing cycles', async () => {
    const { service, ciclosRepository } = createService();

    await service.findCiclos();

    const options = ciclosRepository.find.mock.calls[0][0];
    const cotizacion = options.select.orden.cotizacion;
    expect(cotizacion.total).toBeUndefined();
    expect(cotizacion.subtotal).toBeUndefined();
    expect(cotizacion.iva).toBeUndefined();
    expect(cotizacion.condiciones_comerciales).toBeUndefined();
    expect(options.loadEagerRelations).toBe(false);
    expect(cotizacion.consecutivo).toBe(true);
    expect(options.select.orden.materiales.cantidad).toBe(true);
    expect(options.select.operador.nombre).toBe(true);
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
