import { BadRequestException, ConflictException } from '@nestjs/common';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import { LogisticaService } from './logistica.service.js';

function eventService() {
  const order = {
    id: 7,
    estado: EstadoOrdenServicio.EN_RUTA,
    version: 3,
    metodo_esterilizacion: null as string | null,
  };
  const orderRepository = {
    findOne: vi.fn().mockResolvedValue(order),
    save: vi.fn(async (value) => value),
  };
  const materialsRepository = {
    find: vi.fn().mockResolvedValue([{ id: 21, cantidad: 12 }, { id: 22, cantidad: 8 }]),
  };
  const eventsRepository = {
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => value),
  };
  const cyclesRepository = {
    find: vi.fn(async () => [
      { id: 31, estado: 'APROBADO', certificado: { id: 71 } },
    ]),
  };
  const repositories: Record<string, unknown> = {
    OrdenServicio: orderRepository,
    OrdenServicioMaterial: materialsRepository,
    OrdenServicioEvento: eventsRepository,
    CicloEsterilizacion: cyclesRepository,
  };
  const manager = {
    getRepository: (entity: { name: string }) => repositories[entity.name],
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
  return { service, order, orderRepository, eventsRepository, cyclesRepository };
}

describe('Acta service events', () => {
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
