import { BadRequestException, ConflictException } from '@nestjs/common';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import { LogisticaService } from './logistica.service.js';

function eventService() {
  const order = {
    id: 7,
    estado: EstadoOrdenServicio.EN_RUTA,
    version: 3,
    metodo_esterilizacion: null as string | null,
    acta_fase: 3,
    acta_cerrada_at: null as Date | null,
    recibido_por_cliente: 'Cliente',
  };
  const orderRepository = {
    findOne: vi.fn().mockResolvedValue(order),
    save: vi.fn(async (value) => value),
  };
  const materialsRepository = {
    find: vi.fn().mockResolvedValue([{ id: 21, cantidad: 12, cantidad_entregada: 12, cajas_entregadas: 2 }, { id: 22, cantidad: 8, cantidad_entregada: 8, cajas_entregadas: 1 }]),
  };
  const eventsRepository = {
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => value),
  };
  const cyclesRepository = {
    find: vi.fn(async () => [
      { id: 31, estado: 'APROBADO', certificado: { id: 71, estado: 'Aprobado' } },
    ]),
  };
  const cycleMaterialsRepository = {
    find: vi.fn(async () => [
      { orden_servicio_material_id: 21, cantidad_procesada: 12 },
      { orden_servicio_material_id: 22, cantidad_procesada: 8 },
    ]),
  };
  const repositories: Record<string, unknown> = {
    OrdenServicio: orderRepository,
    OrdenServicioMaterial: materialsRepository,
    OrdenServicioEvento: eventsRepository,
    CicloEsterilizacion: cyclesRepository,
    CicloMaterialProcesado: cycleMaterialsRepository,
  };
  const manager = {
    getRepository: (entity: { name: string }) => repositories[entity.name],
    query: vi.fn(async () => []),
  };
  const dataSource = {
    transaction: vi.fn(async (work) => work(manager)),
  };
  const audit = { create: vi.fn().mockResolvedValue(undefined) };
  const service = new LogisticaService(
    orderRepository as never,
    {} as never,
    dataSource as never,
    audit as never,
    {} as never,
  );
  return { service, order, orderRepository, eventsRepository, cyclesRepository, cycleMaterialsRepository, manager };
}

describe('Acta service events', () => {
  it('expone la reapertura solo cuando el ciclo rechazado tiene las dos aprobaciones', async () => {
    const order = { id: 7, estado: EstadoOrdenServicio.PROCESADO };
    const orders = { find: vi.fn(async () => [order]) };
    const cycles = { find: vi.fn(async () => [{
      id: 31,
      orden_id: 7,
      estado: 'RECHAZADO',
      reproceso_calidad_autorizado_por_id: 17,
      reproceso_planta_autorizado_por_id: null,
    }]) };
    const dataSource = { getRepository: vi.fn(() => cycles) };
    const service = new LogisticaService(orders as never, {} as never, dataSource as never, {} as never, {} as never);
    expect((await service.findAll())[0].reproceso_disponible).toBe(false);
    cycles.find.mockResolvedValueOnce([{
      id: 31, orden_id: 7, estado: 'RECHAZADO',
      reproceso_calidad_autorizado_por_id: 17,
      reproceso_planta_autorizado_por_id: 18,
    }]);
    expect((await service.findAll())[0].reproceso_disponible).toBe(true);
  });

  it('reabre una orden procesada con ciclo rechazado y registra el reproceso', async () => {
    const { service, order, cyclesRepository, eventsRepository } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    order.metodo_esterilizacion = 'ETO';
    cyclesRepository.find.mockResolvedValue([{ id: 31, estado: 'RECHAZADO', certificado: null, reproceso_calidad_autorizado_por_id: 17, reproceso_planta_autorizado_por_id: 18 }]);
    await service.updateEstado(7, {
      estado: EstadoOrdenServicio.EN_PLANTA,
      evento: {
        responsable: 'Jefe de planta',
        observaciones: 'Reproceso por rechazo de calidad',
        materiales: [
          { material_id: 21, cantidad: 12, cajas: 2 },
          { material_id: 22, cantidad: 8, cajas: 1 },
        ],
      },
    }, 42);
    expect(order.estado).toBe(EstadoOrdenServicio.EN_PLANTA);
    expect(eventsRepository.save).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'REPROCESO' }));
  });

  it('bloquea la reapertura sin las dos autorizaciones del reproceso', async () => {
    const { service, order, cyclesRepository } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    cyclesRepository.find.mockResolvedValue([{ id: 31, estado: 'RECHAZADO', reproceso_calidad_autorizado_por_id: 17, reproceso_planta_autorizado_por_id: null }]);
    await expect(service.updateEstado(7, {
      estado: EstadoOrdenServicio.EN_PLANTA,
      evento: { responsable: 'Jefe de planta', materiales: [
        { material_id: 21, cantidad: 12 },
        { material_id: 22, cantidad: 8 },
      ] },
    }, 42)).rejects.toBeInstanceOf(ConflictException);
    expect(order.estado).toBe(EstadoOrdenServicio.PROCESADO);
  });

  it('bloquea el reproceso mientras queda un ciclo pendiente de calidad', async () => {
    const { service, order, cyclesRepository } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    cyclesRepository.find.mockResolvedValue([
      { id: 31, estado: 'RECHAZADO' },
      { id: 32, estado: 'PENDIENTE_CALIDAD' },
    ]);
    await expect(service.updateEstado(7, {
      estado: EstadoOrdenServicio.EN_PLANTA,
      evento: { responsable: 'Jefe de planta', materiales: [
        { material_id: 21, cantidad: 12 },
        { material_id: 22, cantidad: 8 },
      ] },
    }, 42)).rejects.toBeInstanceOf(ConflictException);
    expect(order.estado).toBe(EstadoOrdenServicio.PROCESADO);
  });

  it('bloquea la entrega con acta todavía en Fase 1', async () => {
    const { service, order } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    order.metodo_esterilizacion = 'ETO';
    order.acta_fase = 1;
    await expect(service.updateEstado(7, {
      estado: EstadoOrdenServicio.ENTREGADO,
      evento: { responsable: 'Conductor', recibido_por: 'Cliente', materiales: [
        { material_id: 21, cantidad: 12 },
        { material_id: 22, cantidad: 8 },
      ] },
    }, 42)).rejects.toBeInstanceOf(ConflictException);
    expect(order.estado).toBe(EstadoOrdenServicio.PROCESADO);
  });

  it('rechaza un evento de entrega que difiere de las cantidades de Fase 2', async () => {
    const { service, order } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    await expect(service.updateEstado(7, {
      estado: EstadoOrdenServicio.ENTREGADO,
      evento: { responsable: 'Conductor', recibido_por: 'Cliente', materiales: [
        { material_id: 21, cantidad: 11 },
        { material_id: 22, cantidad: 8 },
      ] },
    }, 42)).rejects.toBeInstanceOf(ConflictException);
    expect(order.estado).toBe(EstadoOrdenServicio.PROCESADO);
  });

  it('permite entregar después de aprobar y certificar el reproceso de un ciclo rechazado', async () => {
    const { service, order, cyclesRepository } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    order.metodo_esterilizacion = 'ETO';
    cyclesRepository.find.mockResolvedValue([
      { id: 31, estado: 'RECHAZADO', certificado: null },
      { id: 32, estado: 'APROBADO', certificado: { id: 72, estado: 'Aprobado' } },
    ]);
    await service.updateEstado(7, {
      estado: EstadoOrdenServicio.ENTREGADO,
      evento: { responsable: 'Conductor', recibido_por: 'Cliente', materiales: [
        { material_id: 21, cantidad: 12 },
        { material_id: 22, cantidad: 8 },
      ] },
    }, 42);
    expect(order.estado).toBe(EstadoOrdenServicio.ENTREGADO);
  });

  it('bloquea cambios de Fase 2 después de la entrega', async () => {
    const { service, order } = eventService();
    order.estado = EstadoOrdenServicio.ENTREGADO;
    order.acta_fase = 2;
    await expect(service.guardarFase2Acta(7, { version: 3 } as never, 42)).rejects.toBeInstanceOf(ConflictException);
  });
  it('records actual quantities and responsible people with the status transition', async () => {
    const { service, order, orderRepository, eventsRepository } =
      eventService();

    await service.updateEstado(
      7,
      {
        estado: EstadoOrdenServicio.RECOGIDO,
        evento: {
          responsable: 'Conductor',
          entregado_por: 'Cliente',
          materiales: [
            { material_id: 21, cantidad: 12, cajas: 2 },
            { material_id: 22, cantidad: 8, cajas: 1 },
          ],
        },
      },
      42,
    );

    expect(order.estado).toBe(EstadoOrdenServicio.RECOGIDO);
    expect(orderRepository.save).toHaveBeenCalledWith(order);
    expect(eventsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        orden_id: 7,
        tipo: 'RECOGIDA',
        usuario_id: 42,
        ocurrido_at: expect.any(Date),
        datos_json: {
          responsable: 'Conductor',
          recibido_por: null,
          entregado_por: 'Cliente',
          transportista: null,
          observaciones: null,
          materiales: [
            { material_id: 21, cantidad: 12, cajas: 2 },
            { material_id: 22, cantidad: 8, cajas: 1 },
          ],
        },
      }),
    );
  });

  it('does not duplicate the event when a transition is retried', async () => {
    const { service, order, orderRepository, eventsRepository } =
      eventService();
    order.estado = EstadoOrdenServicio.RECOGIDO;

    await expect(
      service.updateEstado(
        7,
        {
          estado: EstadoOrdenServicio.RECOGIDO,
          evento: {
            responsable: 'Conductor',
            materiales: [
              { material_id: 21, cantidad: 12, cajas: 2 },
              { material_id: 22, cantidad: 8, cajas: 1 },
            ],
          },
        },
        42,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(eventsRepository.save).not.toHaveBeenCalled();
  });

  it('accepts direct arrival to the plant without simulating a pickup', async () => {
    const { service, order, eventsRepository } = eventService();
    order.estado = EstadoOrdenServicio.PENDIENTE;

    await service.updateEstado(
      7,
      {
        estado: EstadoOrdenServicio.EN_PLANTA,
        evento: {
          responsable: 'Recepción de planta',
          recibido_por: 'Supervisor de planta',
          materiales: [
            { material_id: 21, cantidad: 12, cajas: 2 },
            { material_id: 22, cantidad: 8, cajas: 1 },
          ],
        },
      },
      42,
    );

    expect(order.estado).toBe(EstadoOrdenServicio.EN_PLANTA);
    expect(eventsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'RECEPCION_PLANTA' }),
    );
    expect(eventsRepository.save).not.toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'RECOGIDA' }),
    );
  });

  it('blocks delivery while a sterilization cycle is still pending', async () => {
    const { service, order, cyclesRepository, orderRepository, eventsRepository } =
      eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    order.metodo_esterilizacion = 'ETO';
    cyclesRepository.find.mockResolvedValue([
      { id: 31, estado: 'PENDIENTE_CALIDAD', certificado: null },
    ]);

    await expect(
      service.updateEstado(
        7,
        {
          estado: EstadoOrdenServicio.ENTREGADO,
          evento: {
            responsable: 'Conductor',
            recibido_por: 'Cliente',
            materiales: [
              { material_id: 21, cantidad: 12, cajas: 2 },
              { material_id: 22, cantidad: 8, cajas: 1 },
            ],
          },
        },
        42,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(eventsRepository.save).not.toHaveBeenCalled();
  });

  it('blocks delivery when the sterilization order has no cycle', async () => {
    const { service, order, cyclesRepository } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    order.metodo_esterilizacion = 'VAPOR';
    cyclesRepository.find.mockResolvedValue([]);

    await expect(
      service.updateEstado(
        7,
        {
          estado: EstadoOrdenServicio.ENTREGADO,
          evento: {
            responsable: 'Conductor',
            recibido_por: 'Cliente',
            materiales: [
              { material_id: 21, cantidad: 12, cajas: 2 },
              { material_id: 22, cantidad: 8, cajas: 1 },
            ],
          },
        },
        42,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('allows delivery once every cycle is approved and certified', async () => {
    const { service, order, eventsRepository } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    order.metodo_esterilizacion = 'ETO';

    await service.updateEstado(
      7,
      {
        estado: EstadoOrdenServicio.ENTREGADO,
        evento: {
          responsable: 'Conductor',
          recibido_por: 'Cliente',
          materiales: [
            { material_id: 21, cantidad: 12, cajas: 2 },
            { material_id: 22, cantidad: 8, cajas: 1 },
          ],
        },
      },
      42,
    );

    expect(order.estado).toBe(EstadoOrdenServicio.ENTREGADO);
    expect(eventsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'ENTREGA_CLIENTE' }),
    );
  });

  it('rejects delivery quantities greater than the received material', async () => {
    const { service, order, orderRepository, eventsRepository } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;
    order.metodo_esterilizacion = 'ETO';

    await expect(service.updateEstado(7, {
      estado: EstadoOrdenServicio.ENTREGADO,
      evento: {
        responsable: 'Conductor',
        recibido_por: 'Cliente',
        materiales: [
          { material_id: 21, cantidad: 13, cajas: 2 },
          { material_id: 22, cantidad: 8, cajas: 1 },
        ],
      },
    }, 42)).rejects.toBeInstanceOf(BadRequestException);
    expect(order.estado).toBe(EstadoOrdenServicio.PROCESADO);
    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(eventsRepository.save).not.toHaveBeenCalled();
  });

  it('rejects event records that omit an order material', async () => {
    const { service, orderRepository, eventsRepository } = eventService();

    await expect(
      service.updateEstado(
        7,
        {
          estado: EstadoOrdenServicio.RECOGIDO,
          evento: {
            responsable: 'Conductor',
            materiales: [{ material_id: 21, cantidad: 12, cajas: 2 }],
          },
        },
        42,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(eventsRepository.save).not.toHaveBeenCalled();
  });

  it('requires an explicit customer recipient when the material is delivered', async () => {
    const { service, order } = eventService();
    order.estado = EstadoOrdenServicio.PROCESADO;

    await expect(
      service.updateEstado(
        7,
        {
          estado: EstadoOrdenServicio.ENTREGADO,
          evento: {
            responsable: 'Conductor',
            materiales: [
              { material_id: 21, cantidad: 12, cajas: 2 },
              { material_id: 22, cantidad: 8, cajas: 1 },
            ],
          },
        },
        42,
      ),
    ).rejects.toThrow('Indique quién recibió el material por parte del cliente');
  });

  it('does not allow logistics to mark an order processed without a sterilization cycle', async () => {
    const { service, order, orderRepository, eventsRepository } = eventService();
    order.estado = EstadoOrdenServicio.EN_PLANTA;

    await expect(
      service.updateEstado(
        7,
        {
          estado: EstadoOrdenServicio.PROCESADO,
          evento: {
            responsable: 'Operador',
            materiales: [
              { material_id: 21, cantidad: 12, cajas: 2 },
              { material_id: 22, cantidad: 8, cajas: 1 },
            ],
          },
        },
        42,
      ),
    ).rejects.toThrow(
      'El estado PROCESADO solo se registra al crear un ciclo de esterilización',
    );

    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(eventsRepository.save).not.toHaveBeenCalled();
  });
});
