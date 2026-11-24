import { CertificadosService } from './certificados.service.js';

const access = {
  permission: 'certificados.anular',
  policy: { userId: 7, scopeIds: [2], ownScopeIds: [] },
  resourceScopeIds: [2],
};

function setup() {
  const certificate = {
    id: 8,
    estado: 'Aprobado',
    aprobador_id: 4,
    token_publico: 'TOKEN-8',
    consecutivo: 'CE-008',
    cicloEsterilizacion: { orden: { cotizacion: { cliente: { razon_social: 'Cliente A' } } } },
  };
  const repo = {
    findOne: vi.fn(async () => certificate),
    save: vi.fn(async (value) => value),
  };
  const manager = { getRepository: vi.fn(() => repo) };
  const dataSource = { transaction: vi.fn(async (work) => work(manager)) };
  const auth = { verifyPassword: vi.fn(async () => true) };
  const audit = { create: vi.fn(async () => ({})) };
  const service = new CertificadosService(repo as never, dataSource as never, {} as never, {} as never, auth as never, audit as never);
  return { certificate, repo, manager, dataSource, auth, audit, service };
}

describe('CertificadosService.anular', () => {
  it('anula con motivo y reautenticación, conservando el token público y auditando en la transacción', async () => {
    const { certificate, repo, manager, auth, audit, service } = setup();
    await service.anular(8, { motivo: 'Error documental verificado', password: 'confirmacion' }, 7, access as never);
    expect(auth.verifyPassword).toHaveBeenCalledWith(7, 'confirmacion');
    expect(certificate.estado).toBe('Anulado');
    expect(certificate.token_publico).toBe('TOKEN-8');
    expect(certificate.motivo_anulacion).toBe('Error documental verificado');
    expect(certificate.anulado_por_id).toBe(7);
    expect(repo.save).toHaveBeenCalled();
    expect(audit.create).toHaveBeenCalledWith(expect.objectContaining({ accion: 'anular', entidad_id: 8 }), manager);
    expect((await service.validarToken('TOKEN-8')).estado).toBe('Anulado');
    expect((await service.validarToken('TOKEN-8')).valido).toBe(false);
  });

  it('rechaza la anulación por quien aprobó el ciclo', async () => {
    const { certificate, repo, service } = setup();
    certificate.aprobador_id = 7;
    await expect(service.anular(8, { motivo: 'Error documental', password: 'confirmacion' }, 7, access as never)).rejects.toMatchObject({ status: 403 });
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('rechaza una contraseña de confirmación inválida', async () => {
    const { repo, auth, service } = setup();
    auth.verifyPassword.mockResolvedValue(false);
    await expect(service.anular(8, { motivo: 'Error documental', password: 'incorrecta' }, 7, access as never)).rejects.toMatchObject({ status: 403 });
    expect(repo.save).not.toHaveBeenCalled();
  });
});
