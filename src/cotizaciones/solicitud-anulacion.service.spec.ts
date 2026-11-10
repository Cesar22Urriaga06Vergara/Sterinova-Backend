import { SolicitudAnulacionService } from './solicitud-anulacion.service.js';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { EstadoSolicitudAnulacion as Estado } from './entities/solicitud-anulacion.entity.js';
import { In } from 'typeorm';

function fixture() {
  const quote = { id: 1, estado: 'EMITIDA', scope_id: 2, creador_id: 7 };
  const request = {
    id: 10,
    cotizacion_id: 1,
    creador_id: 7,
    estado: Estado.PENDIENTE,
    aprobador_id: null,
    fecha_resolucion: null,
    observacion_resolucion: null,
  };
  const quotes = {
    findOne: vi.fn(async () => quote),
    save: vi.fn(async (value) => value),
  };
  const requests = {
    findOne: vi.fn(async () => request),
    find: vi.fn(async () => [request]),
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => value),
  };
  const rbac = {
    getContext: vi.fn(async (userId: number, permission: string) => ({
      policy: {
        userId,
        scopeIds: permission.endsWith('.crear') ? [] : [2],
        ownScopeIds: [2],
      },
    })),
    getCancellationApprovalScopeIds: vi.fn(async () => [2]),
  };
  const source = {
    transaction: vi.fn(async (work) =>
      work({
        getRepository: (entity) => (entity === Cotizacion ? quotes : requests),
      }),
    ),
  };
  const service = new SolicitudAnulacionService(
    source as never,
    rbac as never,
    requests as never,
  );
  return { service, quote, request, quotes, requests, rbac, source };
}

describe('SolicitudAnulacionService', () => {
  it('exige el permiso específico de creación', async () => {
    const { service, rbac } = fixture();
    await service.crearSolicitud(1, 7, 'Error');
    expect(rbac.getContext).toHaveBeenCalledWith(
      7,
      'solicitudes_anulacion.crear',
      undefined,
    );
  });

  it.each(['aprobar', 'ver'])(
    'respeta la revocación del permiso %s aunque conserve el rol',
    async (action) => {
      const { service, rbac, requests } = fixture();
      rbac.getContext.mockRejectedValue({ status: 403 });
      const result =
        action === 'aprobar'
          ? service.resolverSolicitud(10, 8, Estado.APROBADA, 'OK')
          : service.obtenerPendientes(8);
      await expect(result).rejects.toMatchObject({ status: 403 });
      expect(requests.save).not.toHaveBeenCalled();
      expect(requests.find).not.toHaveBeenCalled();
    },
  );
  it.each(['EMITIDA', 'APROBADA'])(
    'permite al asesor solicitar anulación de %s',
    async (estado) => {
      const { service, quote, requests } = fixture();
      quote.estado = estado;
      await expect(
        service.crearSolicitud(1, 7, ' Error comercial '),
      ).resolves.toMatchObject({
        cotizacion_id: 1,
        creador_id: 7,
        motivo: 'Error comercial',
        estado: Estado.PENDIENTE,
      });
      expect(requests.save).toHaveBeenCalledOnce();
    },
  );

  it('rechaza un borrador sin guardar', async () => {
    const { service, quote, requests } = fixture();
    quote.estado = 'Borrador';
    await expect(service.crearSolicitud(1, 7, 'Error')).rejects.toMatchObject({
      status: 409,
    });
    expect(requests.save).not.toHaveBeenCalled();
  });

  it('rechaza cotización inexistente', async () => {
    const { service, quotes } = fixture();
    quotes.findOne.mockResolvedValue(null as never);
    await expect(service.crearSolicitud(1, 7, 'Error')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('rechaza un motivo vacío', async () => {
    await expect(
      fixture().service.crearSolicitud(1, 7, '  '),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('impide crear solicitudes sobre cotizaciones sin acceso', async () => {
    const { service, quote, requests } = fixture();
    quote.creador_id = 99;
    await expect(service.crearSolicitud(1, 7, 'Error')).rejects.toMatchObject({
      status: 403,
    });
    expect(requests.save).not.toHaveBeenCalled();
  });

  it('el jefe del mismo ámbito aprueba y anula la cotización', async () => {
    const { service, quotes, requests } = fixture();
    await expect(
      service.resolverSolicitud(10, 8, Estado.APROBADA, 'Validado'),
    ).resolves.toMatchObject({
      estado: Estado.APROBADA,
      aprobador_id: 8,
      fecha_resolucion: expect.any(Date),
      observacion_resolucion: 'Validado',
    });
    expect(quotes.save).toHaveBeenCalledWith(
      expect.objectContaining({ estado: 'ANULADA' }),
    );
    expect(requests.save).toHaveBeenCalledOnce();
  });

  it.each([{ scopeIds: [3] }, { scopeIds: [] }])(
    'deniega otro ámbito o asesor sin rol: %j',
    async ({ scopeIds }) => {
      const { service, rbac, quotes, requests } = fixture();
      rbac.getCancellationApprovalScopeIds.mockResolvedValue(scopeIds);
      await expect(
        service.resolverSolicitud(10, 9, Estado.APROBADA, 'OK'),
      ).rejects.toMatchObject({ status: 403 });
      expect(quotes.save).not.toHaveBeenCalled();
      expect(requests.save).not.toHaveBeenCalled();
    },
  );

  it('rechazar registra la resolución sin anular la cotización', async () => {
    const { service, quotes } = fixture();
    await expect(
      service.resolverSolicitud(10, 8, Estado.RECHAZADA, 'No procede'),
    ).resolves.toMatchObject({
      estado: Estado.RECHAZADA,
      aprobador_id: 8,
    });
    expect(quotes.save).not.toHaveBeenCalled();
  });

  it('impide resolver nuevamente una solicitud', async () => {
    const { service, request } = fixture();
    request.estado = Estado.APROBADA;
    await expect(
      service.resolverSolicitud(10, 8, Estado.RECHAZADA, ''),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('rechaza decisiones inválidas incluso fuera de HTTP', async () => {
    await expect(
      fixture().service.resolverSolicitud(10, 8, Estado.PENDIENTE as never, ''),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('no aprueba si la cotización ya no es anulable', async () => {
    const { service, quote } = fixture();
    quote.estado = 'ANULADA';
    await expect(
      service.resolverSolicitud(10, 8, Estado.APROBADA, ''),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('filtra pendientes por los ámbitos autorizados del jefe', async () => {
    const { service, requests, rbac } = fixture();
    await service.obtenerPendientes(8);
    expect(rbac.getCancellationApprovalScopeIds).toHaveBeenCalledWith(8);
    expect(requests.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { estado: Estado.PENDIENTE, cotizacion: { scope_id: In([2]) } },
      }),
    );
  });

  it('no consulta pendientes sin ámbitos autorizados', async () => {
    const { service, requests, rbac } = fixture();
    rbac.getCancellationApprovalScopeIds.mockResolvedValue([]);
    await expect(service.obtenerPendientes(7)).rejects.toMatchObject({
      status: 403,
    });
    expect(requests.find).not.toHaveBeenCalled();
  });
});
