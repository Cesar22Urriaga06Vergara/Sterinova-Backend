import { randomUUID } from 'node:crypto';
import { In, type DataSource } from 'typeorm';
import { AppDataSource } from '../database/data-source.js';
import { Cliente } from '../clientes/entities/cliente.entity.js';
import { CertificadoEsterilizacion } from './entities/certificado-esterilizacion.entity.js';
import { CertificadosService } from './certificados.service.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { PDF_RENDERER_VERSION } from '../pdf/pdf-generator.service.js';
import { FormatoResolverService } from '../formatos-documentales/formato-resolver.service.js';
import { CicloEsterilizacion, MetodoEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import { User } from '../users/entities/user.entity.js';
import { UserRole } from '../users/entities/user-role.enum.js';

const runDatabaseIntegration = process.env.RUN_DB_INTEGRATION === '1';
const databaseIntegration = runDatabaseIntegration ? describe : describe.skip;
const certificateCount = 12;
const certificateSequenceName = 'certificado_esterilizacion';

databaseIntegration('integridad de certificados en MariaDB', () => {
  let dataSource: DataSource;
  let userId: number | undefined;
  let clientId: number | undefined;
  let quoteId: number | undefined;
  let orderId: number | undefined;
  let cycleIds: number[] = [];
  let originalSequenceValue: string | undefined;
  let emittedCertificates: CertificadoEsterilizacion[] = [];

  beforeAll(async () => {
    const databaseName = String(AppDataSource.options.database ?? '');
    if (!/(^|[_-])test([_-]|$)/i.test(databaseName)) {
      throw new Error('RUN_DB_INTEGRATION=1 requiere una base aislada cuyo nombre incluya test.');
    }

    dataSource = await AppDataSource.initialize();
    const existingCertificates = await dataSource
      .getRepository(CertificadoEsterilizacion)
      .count();
    if (existingCertificates !== 0) {
      throw new Error('La base de integración debe estar vacía de certificados.');
    }

    const sequenceRepository = dataSource.getRepository(SecuenciaConsecutivos);
    const sequence = await sequenceRepository.findOneByOrFail({ nombre: certificateSequenceName });
    originalSequenceValue = sequence.ultimo_valor;

    const suffix = randomUUID();
    const user = await dataSource.getRepository(User).save({
      nombre: 'Usuario de integración Fase 2',
      email: `phase2-${suffix}@example.test`,
      password_hash: 'integration-only',
      rol: UserRole.CALIDAD,
      activo: true,
    });
    userId = user.id;

    const client = await dataSource.getRepository(Cliente).save({
      razon_social: 'Cliente de integración Fase 2',
      nit: `P2-${suffix}`,
      contacto: 'Prueba de integración',
      telefono: '0000000000',
      email: `client-${suffix}@example.test`,
      direccion: 'Entorno de pruebas',
    });
    clientId = client.id;

    const quote = await dataSource.getRepository(Cotizacion).save({
      consecutivo: `P2-${suffix}`,
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      estado: 'Borrador',
      cliente_id: client.id,
      subtotal: 0,
      iva: 0,
      total: 0,
      items: [],
    });
    quoteId = quote.id;

    const order = await dataSource.getRepository(OrdenServicio).save({
      consecutivo: `P2-ORD-${suffix}`,
      cotizacion_id: quote.id,
      fecha_programada: '2026-11-06',
    });
    orderId = order.id;

    const cycleRepository = dataSource.getRepository(CicloEsterilizacion);
    const cycles = await cycleRepository.save(
      Array.from({ length: certificateCount }, (_, index) => cycleRepository.create({
        orden_id: order.id,
        equipo: `P2-TEST-${index + 1}`,
        metodo: MetodoEsterilizacion.ETO,
        operador_id: user.id,
        temperatura: 55,
        humedad: 70,
        presion: -5,
        tiempo_exposicion: 30,
        tiempo_aireacion: 60,
        control_biologico: 'Negativo',
        control_quimico: 'Correcto',
      })),
    );
    cycleIds = cycles.map(({ id }) => id);
  }, 30_000);

  afterAll(async () => {
    if (!dataSource?.isInitialized) return;

    try {
      if (cycleIds.length) {
        await dataSource.getRepository(CertificadoEsterilizacion).delete({ ciclo_id: In(cycleIds) });
        await dataSource.getRepository(CicloEsterilizacion).delete(cycleIds);
      }
      if (orderId) await dataSource.getRepository(OrdenServicio).delete(orderId);
      if (quoteId) await dataSource.getRepository(Cotizacion).delete(quoteId);
      if (clientId) await dataSource.getRepository(Cliente).delete(clientId);
      if (userId) await dataSource.getRepository(User).delete(userId);
      if (originalSequenceValue !== undefined) {
        await dataSource.getRepository(SecuenciaConsecutivos).update(
          { nombre: certificateSequenceName },
          { ultimo_valor: originalSequenceValue },
        );
      }
    } finally {
      await dataSource.destroy();
    }
  }, 30_000);

  it('emite N certificados concurrentes con consecutivos únicos y sin saltos', async () => {
    const resolver = {
      resolveCertificado: vi.fn(async () => ({
        id: null,
        version: 1,
        fecha_version: '2026-11-06',
        renderer_key: 'phase2-integration',
        configuracion_json: { document_code: 'P2-TEST' },
      })),
    };
    const pdfGenerator = {
      generate: vi.fn(async (_snapshot: unknown, storageKey: string) => ({
        storageKey,
        hash: 'a'.repeat(64),
      })),
      remove: vi.fn(),
    };
    const service = new CertificadosService(
      dataSource.getRepository(CertificadoEsterilizacion),
      dataSource,
      resolver as unknown as FormatoResolverService,
      pdfGenerator as never,
    );
    const cycleRepository = dataSource.getRepository(CicloEsterilizacion);
    const cycles = await Promise.all(cycleIds.map((id) => cycleRepository.findOneByOrFail({ id })));
    const sequenceBefore = BigInt(originalSequenceValue!);

    const outcomes = await Promise.allSettled(
      cycles.map((cycle) => dataSource.transaction((manager) =>
        service.emitirDesdeCiclo(manager, cycle, userId!, new Date('2026-11-06T12:00:00.000Z')),
      )),
    );
    const failures = outcomes.filter((outcome) => outcome.status === 'rejected');
    expect(failures).toEqual([]);

    emittedCertificates = outcomes.map((outcome) => {
      if (outcome.status !== 'fulfilled') throw outcome.reason;
      return outcome.value;
    });
    const numbers = emittedCertificates
      .map(({ consecutivo }) => BigInt(consecutivo))
      .sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
    expect(numbers).toEqual(
      Array.from({ length: certificateCount }, (_, index) => sequenceBefore + BigInt(index + 1)),
    );
    expect(new Set(emittedCertificates.map(({ consecutivo }) => consecutivo)).size)
      .toBe(certificateCount);

    const sequenceAfter = await dataSource.getRepository(SecuenciaConsecutivos)
      .findOneByOrFail({ nombre: certificateSequenceName });
    expect(BigInt(sequenceAfter.ultimo_valor)).toBe(sequenceBefore + BigInt(certificateCount));
  }, 60_000);

  it('bloquea cambios de negocio y permite actualizar los metadatos técnicos del PDF', async () => {
    expect(emittedCertificates.length).toBe(certificateCount);
    const certificate = emittedCertificates[0];

    await expect(dataSource.query(
      'UPDATE certificados_esterilizacion SET equipo = ? WHERE id = ?',
      ['MODIFICADO POR PRUEBA', certificate.id],
    )).rejects.toThrow(/certificados aprobados son inmutables/i);

    const pdfUrl = `certificados/phase2-${certificate.id}.pdf`;
    const hash = 'b'.repeat(64);
    await expect(dataSource.query(
      'UPDATE certificados_esterilizacion SET pdf_url = ?, hash_pdf = ?, pdf_renderer_version = ? WHERE id = ?',
      [pdfUrl, hash, PDF_RENDERER_VERSION, certificate.id],
    )).resolves.toBeDefined();

    const updatedCertificate = await dataSource.getRepository(CertificadoEsterilizacion)
      .findOneByOrFail({ id: certificate.id });
    expect(updatedCertificate.equipo).toBe('P2-TEST-1');
    expect(updatedCertificate.pdf_url).toBe(pdfUrl);
    expect(updatedCertificate.hash_pdf).toBe(hash);
    expect(updatedCertificate.pdf_renderer_version).toBe(PDF_RENDERER_VERSION);
  }, 30_000);
});
