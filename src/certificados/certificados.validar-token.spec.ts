import { CertificadosService } from './certificados.service.js';

const vencido = new Date(Date.now() - 86400000 * 31).toISOString().slice(0, 10);
const vigente = new Date(Date.now() + 86400000 * 365).toISOString().slice(0, 10);

function repoWith(certificados: Record<string, any>) {
  return {
    findOne: vi.fn(async (opts: any) => {
      const token = opts.where?.token_publico;
      return certificados[token] ?? null;
    }),
  };
}

describe('CertificadosService.validarToken (QR público)', () => {
  it('mantiene vigente un certificado hasta la medianoche de Bogotá', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-24T04:30:00.000Z'));
    try {
      const repo = repoWith({
        'TOKEN-LIMITE': {
          token_publico: 'TOKEN-LIMITE',
          estado: 'Aprobado',
          fecha_vencimiento: '2026-11-23',
          consecutivo: 'CE-0000045',
        },
      });
      const service = new CertificadosService(repo as never, {} as never, {} as never, {} as never);
      expect((await service.validarToken('TOKEN-LIMITE')).estado).toBe('Vigente');
      vi.setSystemTime(new Date('2026-11-24T05:00:00.000Z'));
      expect((await service.validarToken('TOKEN-LIMITE')).estado).toBe('Vencido');
    } finally {
      vi.useRealTimers();
    }
  });
  it('devuelve Vigente para certificado aprobado sin vencer', async () => {
    const repo = repoWith({
      'TOKEN-VIGENTE': {
        token_publico: 'TOKEN-VIGENTE',
        estado: 'Aprobado',
        fecha_vencimiento: vigente,
        equipo: 'E01',
        consecutivo: 'CE-0000042',
        aprobado_at: '2026-01-15T10:00:00Z',
        cicloEsterilizacion: {
          orden: {
            cotizacion: { cliente: { razon_social: 'Cliente S.A.S.' } },
          },
        },
      },
    });
    const service = new CertificadosService(
      repo as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const resultado = await service.validarToken('TOKEN-VIGENTE');
    expect(resultado.valido).toBe(true);
    expect(resultado.estado).toBe('Vigente');
    expect(resultado.cliente.razon_social).toBe('Cliente S.A.S.');
    expect(resultado.consecutivo).toBe('CE-0000042');
    expect(resultado.equipo).toBe('E01');
    expect(resultado.fecha_emision).toBeDefined();
    expect(resultado.fecha_vencimiento).toBe(vigente);
  });

  it('devuelve Vencido sin 404 cuando la fecha de vencimiento pasó', async () => {
    const repo = repoWith({
      'TOKEN-VENCIDO': {
        token_publico: 'TOKEN-VENCIDO',
        estado: 'Aprobado',
        fecha_vencimiento: vencido,
        equipo: 'E02',
        consecutivo: 'CE-0000043',
        cicloEsterilizacion: {
          orden: {
            cotizacion: { cliente: { razon_social: 'Otro Cliente Ltda' } },
          },
        },
      },
    });
    const service = new CertificadosService(
      repo as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const resultado = await service.validarToken('TOKEN-VENCIDO');
    expect(resultado.valido).toBe(false);
    expect(resultado.estado).toBe('Vencido');
    expect(resultado.consecutivo).toBe('CE-0000043');
  });

  it('sigue respondiendo para un certificado Anulado (alertando)', async () => {
    const repo = repoWith({
      'TOKEN-ANULADO': {
        token_publico: 'TOKEN-ANULADO',
        estado: 'Anulado',
        fecha_vencimiento: vigente,
        equipo: 'E03',
        consecutivo: 'CE-0000044',
        cicloEsterilizacion: {
          orden: {
            cotizacion: { cliente: { razon_social: 'Cliente Anulado S.A.' } },
          },
        },
      },
    });
    const service = new CertificadosService(
      repo as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const resultado = await service.validarToken('TOKEN-ANULADO');
    expect(resultado.valido).toBe(false);
    expect(resultado.estado).toBe('Anulado');
    expect(resultado.consecutivo).toBe('CE-0000044');
  });

  it('rechaza un token inexistente con 404', async () => {
    const repo = repoWith({});
    const service = new CertificadosService(
      repo as never,
      {} as never,
      {} as never,
      {} as never,
    );
    await expect(service.validarToken('NO-EXISTE')).rejects.toMatchObject({
      status: 404,
    });
  });
});
