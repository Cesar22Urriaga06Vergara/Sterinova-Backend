import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PdfGeneratorService } from '../src/pdf/pdf-generator.service.js';
import { User } from '../src/users/entities/user.entity.js';
import { UserRole } from './fixtures/legacy-user-role.js';
import { MetodoEsterilizacion } from '../src/planta/entities/ciclo-esterilizacion.entity.js';
import { EstadoOrdenServicio } from '../src/ordenes-servicio/entities/estado-orden.enum.js';
import { withRbacFixtureWrite } from './fixtures/rbac-fixture-write.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const pdfFiles = new Map<string, Buffer>();
    const pdfGenerator = {
      generate: vi.fn(async (_snapshot: unknown, storageKey: string) => {
        const pdf = Buffer.from('%PDF-1.7 test certificate');
        pdfFiles.set(storageKey, pdf);
        return { storageKey, hash: 'a'.repeat(64) };
      }),
      getFile: vi.fn(
        async (storageKey: string) =>
          pdfFiles.get(storageKey) ?? Buffer.from('%PDF-1.7 test certificate'),
      ),
      remove: vi.fn(async (storageKey: string) => {
        pdfFiles.delete(storageKey);
      }),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PdfGeneratorService)
      .useValue(pdfGenerator)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET) requires authentication', () => {
    return request(app.getHttpServer()).get('/').expect(401);
  });

  it.skipIf(process.env.RUN_E2E_FULL_FLOW !== '1')(
    'completes quote, plant, quality, certificate PDF and public validation over HTTP',
    async () => {
      const dataSource = app.get(DataSource);
      const databaseName = String(dataSource.options.database ?? '');
      if (!/(^|[_-])test([_-]|$)/i.test(databaseName)) {
        throw new Error(
          'RUN_E2E_FULL_FLOW requires an isolated database whose name includes test.',
        );
      }
      const users = dataSource.getRepository(User);
      const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const email = `phase5-${suffix}@example.test`;
      const password = 'Phase5-Integration-Password!';
      const admin = await users.save(
        users.create({
          nombre: 'Fase Cinco',
          apellido: null,
          cargo: 'Administrador',
          celular: null,
          email_contacto: null,
          email,
          password_hash: await bcrypt.hash(password, 4),
          rol: UserRole.ADMIN,
          activo: true,
        }),
      );
      const pilotScopeCode = `e2e-commercial-${suffix}`;
      await dataSource.query(
        "INSERT INTO rbac_scopes (code,name,kind,parent_id) SELECT ?,?,'DEPARTMENT',id FROM rbac_scopes WHERE kind='GLOBAL'",
        [pilotScopeCode, 'Comercial de prueba'],
      );
      const [pilotScope] = (await dataSource.query(
        'SELECT id FROM rbac_scopes WHERE code=?',
        [pilotScopeCode],
      )) as Array<{ id: number }>;
      await withRbacFixtureWrite(dataSource, admin.id, runner => runner.query(
        "INSERT INTO rbac_user_role_assignments (user_id,role_id,scope_id,scope_kind) SELECT ?,id,?,'DEPARTMENT' FROM rbac_roles WHERE code IN ('comercial','emisor_comercial')",
        [admin.id, pilotScope.id],
      ));
      let clienteId: number | undefined;
      let cotizacionId: number | undefined;
      let ordenId: number | undefined;
      let cicloId: number | undefined;
      let certificadoId: number | undefined;

      try {
        const http = request(app.getHttpServer());
        const login = await http
          .post('/auth/login')
          .send({ email, password })
          .expect(201);
        const authorization = `Bearer ${login.body.access_token}`;
        const cliente = await http
          .post('/clientes')
          .set('Authorization', authorization)
          .send({
            razon_social: `Cliente Fase 5 ${suffix}`,
            nit: `900${Date.now()}`,
            contacto: 'QA Sterinova',
            telefono: '3001234567',
            email: `cliente-${suffix}@example.test`,
            direccion: 'Calle 1 # 2-3',
            ciudad: 'Bogota',
          })
          .expect(201);
        clienteId = cliente.body.id;

        const quote = await http
          .post('/cotizaciones')
          .set('Authorization', authorization)
          .send({
            cliente_id: clienteId,
            tipo_servicio: 'INSTITUCIONAL_VAPOR',
            items: [
              {
                descripcion: 'Instrumental de prueba',
                cantidad: 2,
                valor_unitario: 10000,
              },
            ],
          })
          .expect(201);
        cotizacionId = quote.body.id;
        expect(Number(quote.body.subtotal)).toBe(20000);
        expect(Number(quote.body.iva)).toBe(3800);
        await http
          .post(`/cotizaciones/${cotizacionId}/aprobar`)
          .set('Authorization', authorization)
          .send({ version: quote.body.version })
          .expect(201);

        const order = await http
          .post('/logistica/ordenes')
          .set('Authorization', authorization)
          .send({
            cotizacion_id: cotizacionId,
            materiales: Array.from({ length: 5 }, (_, i) => ({
              descripcion: `Material ${i + 1}`,
              referencia: `REF-${i + 1}`,
              lote: `LOTE-${i + 1}`,
              cantidad: i + 1,
              empaque: `BOLSA-${i + 1}`,
              muestras_retencion: 0,
              muestras_cliente: null,
              muestras_laboratorio: null,
            })),
            fecha_programada: new Date(Date.now() + 86_400_000)
              .toISOString()
              .slice(0, 10),
          })
          .expect(201);
        ordenId = order.body.id;
        await http
          .put(`/logistica/ordenes/${ordenId}/estado`)
          .set('Authorization', authorization)
          .send({ estado: EstadoOrdenServicio.EN_PLANTA })
          .expect(200);

        const cycle = await http
          .post('/planta/ciclos')
          .set('Authorization', authorization)
          .send({
            orden_id: ordenId,
            equipo: 'EQUIPO-E2E-01',
            metodo: MetodoEsterilizacion.VAPOR,
            fecha_esterilizacion: '2026-11-09',
            temperatura: 134,
            tiempo_exposicion: 10,
            tiempo_secado: 15,
            control_biologico: 'Negativo',
            control_quimico: 'Conforme',
          })
          .expect(201);
        cicloId = cycle.body.id;
        const approved = await http
          .post('/calidad/aprobar')
          .set('Authorization', authorization)
          .send({
            ciclo_id: cicloId,
            password,
            evaluaciones: [
              'temperatura',
              'tiempo_exposicion',
              'tiempo_secado',
            ].map((parametro) => ({
              parametro,
              criterio: 'CUMPLE',
              opcion: 0,
            })),
          })
          .expect(201);
        certificadoId = approved.body.id;
        expect(approved.body.snapshot_datos.materiales).toHaveLength(5);
        expect(
          approved.body.snapshot_datos.materiales.map(
            (m: { lote: string }) => m.lote,
          ),
        ).toEqual(['LOTE-1', 'LOTE-2', 'LOTE-3', 'LOTE-4', 'LOTE-5']);

        const pdf = await http
          .get(`/certificados/${certificadoId}/descargar`)
          .set('Authorization', authorization)
          .expect(200);
        expect(pdf.headers['content-type']).toMatch(/^application\/pdf/);
        expect(pdf.body.subarray(0, 5).toString()).toBe('%PDF-');

        const validation = await http
          .get(`/certificados/validar/${approved.body.token_publico}`)
          .expect(200);
        expect(validation.body).toMatchObject({
          valido: true,
          estado: 'Aprobado',
          equipo: 'EQUIPO-E2E-01',
        });
      } finally {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
          if (certificadoId)
            await queryRunner.query(
              'DELETE FROM certificados_esterilizacion WHERE id = ?',
              [certificadoId],
            );
          if (cicloId) {
            await queryRunner.query(
              'DELETE FROM ciclos_parametros_evaluaciones WHERE ciclo_id = ?',
              [cicloId],
            );
            await queryRunner.query(
              'DELETE FROM ciclos_esterilizacion WHERE id = ?',
              [cicloId],
            );
          }
          if (ordenId) {
            await queryRunner.query(
              'DELETE FROM ordenes_servicio_materiales WHERE orden_id = ?',
              [ordenId],
            );
            await queryRunner.query(
              'DELETE FROM ordenes_servicio WHERE id = ?',
              [ordenId],
            );
          }
          if (cotizacionId) {
            await queryRunner.query(
              'DELETE FROM cotizacion_items WHERE cotizacion_id = ?',
              [cotizacionId],
            );
            await queryRunner.query('DELETE FROM cotizaciones WHERE id = ?', [
              cotizacionId,
            ]);
          }
          if (clienteId)
            await queryRunner.query('DELETE FROM clientes WHERE id = ?', [
              clienteId,
            ]);
          await withRbacFixtureWrite(dataSource, admin.id, runner => runner.query(
            'DELETE FROM rbac_user_role_assignments WHERE user_id = ?',
            [admin.id],
          ));
          await queryRunner.query('DELETE FROM rbac_scopes WHERE id = ?', [
            pilotScope.id,
          ]);
          await queryRunner.query(
            'DELETE FROM auditoria WHERE usuario_id = ?',
            [admin.id],
          );
          await users.delete(admin.id);
        } finally {
          await queryRunner.release();
        }
      }
    },
  );

  afterEach(async () => {
    await app.close();
  });
});
