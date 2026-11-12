import { readFile,mkdir } from 'node:fs/promises';
import { seedIcontec } from '../src/sellos/seed-icontec.js';
import { mkdtemp,writeFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import * as bcrypt from 'bcrypt';
import { SelloSnapshotService } from '../src/sellos/sello-snapshot.service.js';
import { PlantaModule } from '../src/planta/planta.module.js';
import { qualityEvaluations } from './fixtures/operational-cycle.js';
import 'reflect-metadata';
import { randomBytes, createHash } from 'node:crypto';
import { createConnection, type Connection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { STERINOVA_ENTITIES } from '../src/database/entities.js';
import { DATABASE_MIGRATIONS } from '../src/database/migration-registry.js';
import { User } from '../src/users/entities/user.entity.js';
import { UserRole } from './fixtures/legacy-user-role.js';
import { Cliente } from '../src/clientes/entities/cliente.entity.js';
import { Cotizacion } from '../src/cotizaciones/entities/cotizacion.entity.js';
import { TipoServicioCotizacion } from '../src/cotizaciones/entities/tipo-servicio.enum.js';
import { CotizacionesModule } from '../src/cotizaciones/cotizaciones.module.js';
import { AuthModule } from '../src/auth/auth.module.js';
import { TasasFiscalesModule } from '../src/tasas-fiscales/tasas-fiscales.module.js';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard.js';
import { RbacModule } from '../src/rbac/rbac.module.js';
import { AuthorizationGuard } from '../src/rbac/authorization.guard.js';
import { PdfGeneratorService } from '../src/pdf/pdf-generator.service.js';
import { PdfModule } from '../src/pdf/pdf.module.js';
import { LogisticaModule } from '../src/logistica/logistica.module.js';
import { CalidadModule } from '../src/calidad/calidad.module.js';
import {
  migrateLocalRbacPilot,
  type LocalRbacPilotPlan,
} from '../src/rbac/local-pilot-data-migration.js';

describe('Cotizaciones pilot with real JWT, RBAC, repositories and MariaDB', () => {
  let admin: Connection;
  let source: DataSource;
  let app: INestApplication;
  let tokens: Record<string, string>;
  let quoteA: Cotizacion;
  let quoteB: Cotizacion;
  let quoteOther: Cotizacion;
  let clientId: number;
  let localPlan: LocalRbacPilotPlan;
  let sealRoot:string;
  const database = `sterinova_pilot_test_${randomBytes(8).toString('hex')}`;
  const files = new Map<string, Buffer>();
  let realPdf:PdfGeneratorService|undefined;
  const pdf = {
    generate: vi.fn(async (_snapshot: unknown, key: string, manager?:import('typeorm').EntityManager) => {
      if(realPdf)return realPdf.generate(_snapshot as Record<string,unknown>,key,manager);
      const bytes = Buffer.from('%PDF-1.7 pilot fixture');
      files.set(key, bytes);
      return {
        storageKey: key,
        hash: createHash('sha256').update(bytes).digest('hex'),
      };
    }),
    getFile: vi.fn(
      async (key: string) => files.get(key) ?? Buffer.from('%PDF fixture'),
    ),
    remove: vi.fn(async (key: string) => {
      files.delete(key);
    }),
  };

  beforeAll(async () => {
    const port = Number(process.env.RBAC_TEST_PORT);
    if (
      process.env.RBAC_TEST_DISPOSABLE_SERVER !== '1' ||
      !Number.isInteger(port) ||
      port < 1024 ||
      port === 3306
    )
      throw new Error('Solo servidor desechable de pruebas.');
    admin = await createConnection({
      host: '127.0.0.1',
      port,
      user: 'root',
      password: process.env.RBAC_TEST_PASSWORD ?? '',
    });
    await admin.query(
      `CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
    );
    const options = {
      type: 'mariadb' as const,
      host: '127.0.0.1',
      port,
      username: 'root',
      password: process.env.RBAC_TEST_PASSWORD ?? '',
      database,
      entities: STERINOVA_ENTITIES,
      // Historical quote pilot fixtures deliberately exercise pre-unification direct provisioning.
      // Current procedure/guards are covered by scripts/verify-rbac-unification.mjs.
      migrations: DATABASE_MIGRATIONS.filter(migration => !['UnifyUserRoleAssignments1794312002000', 'BridgeLegacyUserAdministration1794398400000'].includes(migration.name)),
      migrationsTableName: 'typeorm_migrations',
      migrationsTransactionMode: 'each' as const,
      synchronize: false,
      migrationsRun: false,
    };
    source = await new DataSource(options).initialize();
    await source.runMigrations();
    await source.query('ALTER TABLE usuarios ADD COLUMN rbac_version INT NOT NULL DEFAULT 0');
    await source.query(
      "INSERT INTO rbac_scopes (id,code,name,kind,parent_id) VALUES (10,'ventas','Ventas','DEPARTMENT',1),(20,'otra-area','Otra área','DEPARTMENT',1)",
    );
    const users = source.getRepository(User);
    const records: Record<string, User> = {};
    for (const [key, role] of Object.entries({
      advisorA: UserRole.COMERCIAL,
      advisorB: UserRole.COMERCIAL,
      root: UserRole.ADMIN,
      legacyAdmin: UserRole.ADMIN,
      logistica: UserRole.LOGISTICA,
      calidad: UserRole.CALIDAD,
    })) {
      records[key] = await users.save(
        users.create({
          nombre: key,
          email: `${key}@example.test`,
          password_hash: 'not-used-for-login',
          rol: role,
          activo: true,
        }),
      );
    }
    localPlan = {
      targetDatabase: database,
      owner: { userId: records.root.id, expectedEmail: records.root.email },
      departments: [
        {
          code: 'ventas',
          name: 'Ventas',
          assignments: [
            {
              userId: records.advisorA.id,
              roles: ['comercial', 'emisor_comercial'],
            },
            { userId: records.advisorB.id, roles: ['comercial'] },
          ],
        },
        {
          code: 'otra-area',
          name: 'Otra área',
          assignments: [
            { userId: records.logistica.id, roles: ['logistica'] },
            { userId: records.calidad.id, roles: ['calidad'] },
          ],
        },
      ],
      quotes: {
        ids: [],
        creatorUserId: records.advisorA.id,
        scopeCode: 'ventas',
      },
    };
    await migrateLocalRbacPilot(source, localPlan);
    const client = await source.getRepository(Cliente).save({
      razon_social: 'Cliente piloto',
      nit: 'PILOT-001',
      contacto: 'Contacto operativo',
      telefono: '000',
      email: '',
      direccion: 'Dirección de prueba',
    });
    clientId = client.id;
    const quotes = source.getRepository(Cotizacion);
    for (const [name, creator, scope] of [
      ['A', records.advisorA.id, 10],
      ['B', records.advisorB.id, 10],
      ['OTHER', records.advisorA.id, 20],
    ] as const) {
      const quote = await quotes.save(
        quotes.create({
          consecutivo: `PILOT-${name}`,
          cliente_id: client.id,
          creador_id: creator,
          scope_id: scope,
          tipo_servicio: TipoServicioCotizacion.LAVANDERIA,
          items: [
            {
              descripcion: 'Lavado',
              cantidad: 1,
              valor_unitario: 100,
              valor_total: 100,
            },
          ],
          subtotal: 100,
          iva: 19,
          total: 119,
        }),
      );
      if (name === 'A') quoteA = quote;
      else if (name === 'B') quoteB = quote;
      else quoteOther = quote;
    }
    sealRoot=await mkdtemp(path.join(tmpdir(),'sterinova-hito4-pilot-seal-'));
    await writeFile(path.join(sealRoot,'icontec.png'),Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=','base64'));
    await source.query("INSERT INTO sellos_certificacion (nombre_norma,numero_licencia,imagen_key,activo,orden) VALUES ('ICONTEC','TEST','icontec.png',1,0)");
    await users.update(records.calidad.id,{password_hash:await bcrypt.hash('quality-test-pass',4)});
    const secret = 'isolated-rbac-pilot-secret-at-least-32-characters';
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(options),
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        AuthModule,
        TasasFiscalesModule,
        CotizacionesModule,
        RbacModule,
        LogisticaModule,
        PlantaModule,
        CalidadModule,
        PdfModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => (key === 'JWT_SECRET' ? secret : undefined),
        getOrThrow: (key: string) => {
          if (key === 'JWT_SECRET') return secret;
          throw new Error('Unexpected test configuration');
        },
      })
      .overrideProvider(SelloSnapshotService)
      .useValue(new SelloSnapshotService(source,sealRoot))
      .overrideProvider(PdfGeneratorService)
      .useValue(pdf)
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalGuards(
      new JwtAuthGuard(app.get(Reflector)),
      app.get(AuthorizationGuard),
    );
    await app.init();
    tokens = Object.fromEntries(
      Object.entries(records).map(([key, user]) => [
        key,
        `Bearer ${app.get(JwtService).sign({ sub: user.id, rol: user.rol, email: user.email })}`,
      ]),
    );
  }, 40_000);

  afterAll(async () => {
    try {
      await app?.close();
      if(sealRoot) await rm(sealRoot,{recursive:true,force:true});
      if (source?.isInitialized) await source.destroy();
    } finally {
      try {
        if (admin && /^sterinova_pilot_test_[a-f0-9]{16}$/.test(database))
          await admin.query(`DROP DATABASE \`${database}\``);
      } finally {
        await admin?.end();
      }
    }
  });

  it('requires authentication and does not honor the legacy Admin bypass in the pilot', async () => {
    await request(app.getHttpServer()).get('/cotizaciones').expect(401);
    await request(app.getHttpServer())
      .get('/cotizaciones')
      .set('Authorization', tokens.legacyAdmin)
      .expect(403);
  });
  it('returns only the commercial creator records within their assigned department', async () => {
    const a = await request(app.getHttpServer())
      .get('/cotizaciones')
      .set('Authorization', tokens.advisorA)
      .expect(200);
    expect(a.body.map((q: { id: number }) => q.id)).toEqual([quoteA.id]);
    const b = await request(app.getHttpServer())
      .get('/cotizaciones')
      .set('Authorization', tokens.advisorB)
      .expect(200);
    expect(b.body.map((q: { id: number }) => q.id)).toEqual([quoteB.id]);
  });
  it('protects detail, preview, edits, deletion and downloads against direct ID access', async () => {
    for (const id of [quoteB.id, quoteOther.id]) {
      await request(app.getHttpServer())
        .get(`/cotizaciones/${id}`)
        .set('Authorization', tokens.advisorA)
        .expect(404);
      await request(app.getHttpServer())
        .get(`/cotizaciones/${id}/previsualizar`)
        .set('Authorization', tokens.advisorA)
        .expect(404);
      await request(app.getHttpServer())
        .get(`/cotizaciones/${id}/descargar`)
        .set('Authorization', tokens.advisorA)
        .expect(404);
      await request(app.getHttpServer())
        .put(`/cotizaciones/${id}`)
        .set('Authorization', tokens.advisorA)
        .send({ version: 1, condiciones_comerciales: 'No permitido' })
        .expect(404);
      await request(app.getHttpServer())
        .delete(`/cotizaciones/${id}`)
        .set('Authorization', tokens.advisorA)
        .expect(404);
    }
  });
  it('requires global RBAC for users while keeping other unmigrated modules under legacy protection', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', tokens.legacyAdmin)
      .expect(403);
    await request(app.getHttpServer())
      .get('/logistica/ordenes')
      .set('Authorization', tokens.logistica)
      .expect(200);
    await request(app.getHttpServer())
      .get('/calidad/pendientes')
      .set('Authorization', tokens.calidad)
      .expect(200);
    for (const key of ['logistica', 'calidad'])
      await request(app.getHttpServer())
        .get('/cotizaciones')
        .set('Authorization', tokens[key])
        .expect(403);
  });
  it('allows the platform owner explicit global read and rejects scope spoofing', async () => {
    const response = await request(app.getHttpServer())
      .get('/cotizaciones')
      .set('Authorization', tokens.root)
      .expect(200);
    expect(response.body).toHaveLength(3);
    await request(app.getHttpServer())
      .get('/cotizaciones')
      .set('Authorization', tokens.advisorA)
      .set('x-scope-id', '20')
      .expect(403);
  });
  it('persists creator and scope from trusted context and rejects spoofed ownership fields', async () => {
    const body = {
      cliente_id: clientId,
      tipo_servicio: 'LAVANDERIA',
      items: [{ descripcion: 'Nuevo', cantidad: 1, valor_unitario: 100 }],
    };
    const created = await request(app.getHttpServer())
      .post('/cotizaciones')
      .set('Authorization', tokens.advisorA)
      .send(body)
      .expect(201);
    expect(created.body.scope_id).toBe(10);
    expect(created.body.creador_id).toBe(quoteA.creador_id);
    await request(app.getHttpServer())
      .post('/cotizaciones')
      .set('Authorization', tokens.advisorA)
      .send({ ...body, creador_id: quoteB.creador_id })
      .expect(400);
  });
  it('separates emission permission and enforces scope before PDF work', async () => {
    await request(app.getHttpServer())
      .post(`/cotizaciones/${quoteB.id}/emitir`)
      .set('Authorization', tokens.advisorB)
      .expect(403);
    await request(app.getHttpServer())
      .post(`/cotizaciones/${quoteOther.id}/emitir`)
      .set('Authorization', tokens.advisorA)
      .expect(404);
    expect(pdf.generate).not.toHaveBeenCalled();
    await request(app.getHttpServer())
      .post(`/cotizaciones/${quoteA.id}/emitir`)
      .set('Authorization', tokens.advisorA)
      .expect(201);
    const downloaded = await request(app.getHttpServer())
      .get(`/cotizaciones/${quoteA.id}/descargar`)
      .set('Authorization', tokens.advisorA)
      .expect(200);
    expect(downloaded.headers['content-type']).toMatch(/^application\/pdf/);
  });
  it('versions IVA by validity, freezes the quote rate, rejects injection and protects configuration by capability', async () => {
    const payload = {
      cliente_id: clientId,
      tipo_servicio: 'LAVANDERIA',
      items: [{ descripcion: 'Fiscal', cantidad: 1, valor_unitario: 100 }],
    };
    const before = await request(app.getHttpServer())
      .post('/cotizaciones')
      .set('Authorization', tokens.advisorA)
      .send(payload)
      .expect(201);
    expect(before.body).toMatchObject({ iva_tasa: '0.190000', iva: '19.00' });
    const next = {
      tasa: '0.050000',
      vigente_desde: new Date(Date.now() + 2000).toISOString(),
      motivo: 'Prueba aislada de cambio de tasa',
    };
    for (const token of [
      tokens.advisorA,
      tokens.advisorB,
      tokens.legacyAdmin,
    ]) {
      await request(app.getHttpServer())
        .post('/tasas-fiscales/iva')
        .set('Authorization', token)
        .send(next)
        .expect(403);
    }
    const published = await request(app.getHttpServer())
      .post('/tasas-fiscales/iva')
      .set('Authorization', tokens.root)
      .send(next)
      .expect(201);
    const current = await request(app.getHttpServer())
      .get('/cotizaciones/iva-vigente')
      .set('Authorization', tokens.advisorB)
      .expect(200);
    expect(current.body.tasa).toBe('0.190000');
    await vi.waitFor(
      async () => {
        const res = await request(app.getHttpServer())
          .get('/cotizaciones/iva-vigente')
          .set('Authorization', tokens.advisorB)
          .expect(200);
        expect(res.body.id).toBe(published.body.id);
      },
      { timeout: 6000, interval: 100 },
    );
    const after = await request(app.getHttpServer())
      .post('/cotizaciones')
      .set('Authorization', tokens.advisorB)
      .send(payload)
      .expect(201);
    expect(after.body).toMatchObject({
      iva_tasa: '0.050000',
      iva_version_id: published.body.id,
      iva: '5.00',
      total: '105.00',
    });
    await request(app.getHttpServer())
      .post('/cotizaciones')
      .set('Authorization', tokens.advisorB)
      .send({ ...payload, iva_version_esperada_id: before.body.iva_version_id })
      .expect(409);
    for (const field of [
      'iva',
      'total',
      'subtotal',
      'iva_tasa',
      'iva_version_id',
    ]) {
      await request(app.getHttpServer())
        .post('/cotizaciones')
        .set('Authorization', tokens.advisorB)
        .send({ ...payload, [field]: 0 })
        .expect(400);
      await request(app.getHttpServer())
        .put(`/cotizaciones/${after.body.id}`)
        .set('Authorization', tokens.advisorB)
        .send({ [field]: 0 })
        .expect(400);
    }
    const emitted = await request(app.getHttpServer())
      .post(`/cotizaciones/${before.body.id}/emitir`)
      .set('Authorization', tokens.advisorA)
      .expect(201);
    expect(emitted.body.snapshot_datos.cotizacion).toMatchObject({
      iva_tasa: '0.190000',
      iva_version_id: before.body.iva_version_id,
      iva: '19.00',
    });
    await expect(
      source.query('UPDATE tasas_fiscales SET tasa=0 WHERE id=?', [
        published.body.id,
      ]),
    ).rejects.toMatchObject({ driverError: { errno: 1644 } });
    await expect(
      source.query('DELETE FROM tasas_fiscales WHERE id=?', [
        published.body.id,
      ]),
    ).rejects.toMatchObject({ driverError: { errno: 1644 } });
    const historical = await source
      .getRepository(Cotizacion)
      .findOneByOrFail({ id: quoteB.id });
    expect(historical.iva_tasa).toBeNull();
    expect(historical.iva_version_id).toBeNull();
  }, 15000);

  it('edits complete drafts atomically, rejects stale writers, IDOR and invalid payloads', async () => {
    const http = app.getHttpServer();
    const created = await request(http)
      .post('/cotizaciones')
      .set('Authorization', tokens.advisorB)
      .send({
        cliente_id: clientId,
        tipo_servicio: 'LAVANDERIA',
        items: [{ descripcion: 'Original', cantidad: 1, valor_unitario: 100 }],
      })
      .expect(201);
    const id = created.body.id;
    const oldItem = created.body.items[0].id;
    const newClient = await source.getRepository(Cliente).save({
      razon_social: 'Cliente reemplazo',
      nit: 'EDIT-002',
      contacto: 'Contacto',
      telefono: '000',
      email: '',
      direccion: 'Nueva direccion',
    });
    const replacement = {
      version: 1,
      cliente_id: newClient.id,
      tipo_servicio: 'INSUMOS',
      condiciones_comerciales: 'Contado',
      items: [
        { descripcion: 'Reemplazo', cantidad: 2, valor_unitario: 100 },
        { descripcion: 'Extra', cantidad: 1, valor_unitario: 20 },
      ],
    };
    await request(http)
      .put(`/cotizaciones/${id}`)
      .set('Authorization', tokens.advisorA)
      .send(replacement)
      .expect(404);
    await request(http)
      .put(`/cotizaciones/${id}`)
      .set('Authorization', tokens.legacyAdmin)
      .send(replacement)
      .expect(403);
    for (const payload of [
      { ...replacement, version: undefined },
      { ...replacement, items: [] },
      { ...replacement, items: null },
      {
        ...replacement,
        items: [{ descripcion: 'Negativo', cantidad: -1, valor_unitario: 1 }],
      },
      { ...replacement, estado: 'BORRADOR' },
      { ...replacement, subtotal: 1 },
      {
        ...replacement,
        items: [
          { id: oldItem, descripcion: 'Hack', cantidad: 1, valor_unitario: 1 },
        ],
      },
    ])
      await request(http)
        .put(`/cotizaciones/${id}`)
        .set('Authorization', tokens.advisorB)
        .send(payload)
        .expect(400);
    const responses = await Promise.all(
      [replacement, { ...replacement, condiciones_comerciales: 'Cr?dito' }].map(
        (payload) =>
          request(http)
            .put(`/cotizaciones/${id}`)
            .set('Authorization', tokens.advisorB)
            .send(payload),
      ),
    );
    expect(responses.map((response) => response.status).sort()).toEqual([
      200, 409,
    ]);
    const saved = await source
      .getRepository(Cotizacion)
      .findOneByOrFail({ id });
    expect(saved).toMatchObject({
      version: 2,
      subtotal: '220.00',
      iva: '11.00',
      total: '231.00',
      iva_tasa: '0.050000',
      tipo_servicio: 'INSUMOS',
    });
    expect(saved.cliente_id).toBe(newClient.id);
    const fetched = await request(http)
      .get(`/cotizaciones/${id}`)
      .set('Authorization', tokens.advisorB)
      .expect(200);
    expect(fetched.body.cliente.id).toBe(newClient.id);
    expect(saved.items).toHaveLength(2);
    expect(saved.items.map((item) => item.id)).not.toContain(oldItem);
    expect(
      await source.query('SELECT id FROM cotizacion_items WHERE id=?', [
        oldItem,
      ]),
    ).toEqual([]);
    await request(http)
      .put(`/cotizaciones/${id}`)
      .set('Authorization', tokens.advisorB)
      .send({ ...replacement, version: 2, cliente_id: 2147483647 })
      .expect(404);
    expect(
      (await source.getRepository(Cotizacion).findOneByOrFail({ id })).version,
    ).toBe(2);
    for (const value of [
      { estado: 'EMITIDA' },
      { estado: 'APROBADA' },
      { estado: 'Borrador', fecha_emision: new Date() },
    ]) {
      await source.getRepository(Cotizacion).update(id, value);
      await request(http)
        .put(`/cotizaciones/${id}`)
        .set('Authorization', tokens.advisorB)
        .send({ version: 2, condiciones_comerciales: 'No' })
        .expect(409);
      await request(http)
        .post(`/cotizaciones/${id}/aprobar`)
        .set('Authorization', tokens.advisorB)
        .send({ version: 2 })
        .expect(409);
    }
  });

  it('uses the original IVA after a newer rate becomes active and rolls back failed item writes', async () => {
    const http = app.getHttpServer();
    await source
      .getRepository(Cotizacion)
      .update(quoteB.id, { iva_tasa: '0.190000', iva_version_id: 1 });
    const updated = await request(http)
      .put(`/cotizaciones/${quoteB.id}`)
      .set('Authorization', tokens.advisorB)
      .send({
        version: 1,
        items: [{ descripcion: 'Anterior', cantidad: 2, valor_unitario: 100 }],
      })
      .expect(200);
    expect(updated.body).toMatchObject({
      iva_tasa: '0.190000',
      subtotal: '200.00',
      iva: '38.00',
      total: '238.00',
    });
    const before = await source
      .getRepository(Cotizacion)
      .findOneByOrFail({ id: quoteB.id });
    await source.query(
      `CREATE TRIGGER test_reject_item BEFORE INSERT ON cotizacion_items FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Simulated item failure'`,
    );
    try {
      await request(http)
        .put(`/cotizaciones/${quoteB.id}`)
        .set('Authorization', tokens.advisorB)
        .send({
          version: 2,
          items: [{ descripcion: 'Rollback', cantidad: 1, valor_unitario: 1 }],
        })
        .expect(500);
    } finally {
      await source.query('DROP TRIGGER test_reject_item');
    }
    const after = await source
      .getRepository(Cotizacion)
      .findOneByOrFail({ id: quoteB.id });
    expect(after).toEqual(before);
  });

  it('approves only authorized current drafts without reopening generic state mutation', async () => {
    const http = app.getHttpServer();
    await request(http)
      .post(`/cotizaciones/${quoteOther.id}/aprobar`)
      .set('Authorization', tokens.advisorA)
      .send({ version: 1 })
      .expect(404);
    await request(http)
      .post(`/cotizaciones/${quoteB.id}/aprobar`)
      .set('Authorization', tokens.legacyAdmin)
      .send({ version: 2 })
      .expect(403);
    await request(http)
      .post(`/cotizaciones/${quoteB.id}/aprobar`)
      .set('Authorization', tokens.advisorB)
      .send({ version: 1 })
      .expect(409);
    await request(http)
      .post(`/cotizaciones/${quoteB.id}/aprobar`)
      .set('Authorization', tokens.advisorB)
      .send({ version: 2 })
      .expect(201);
    await request(http)
      .put(`/cotizaciones/${quoteB.id}`)
      .set('Authorization', tokens.advisorB)
      .send({ version: 3, condiciones_comerciales: 'No' })
      .expect(409);
  });

  it('serializes emission against item editing and keeps the issued snapshot consistent', async () => {
    const http = app.getHttpServer();
    const created = await request(http)
      .post('/cotizaciones')
      .set('Authorization', tokens.advisorA)
      .send({
        cliente_id: clientId,
        tipo_servicio: 'INSUMOS',
        items: [{ descripcion: 'Antes', cantidad: 1, valor_unitario: 100 }],
      })
      .expect(201);
    const id = created.body.id;
    const [edit, emission] = await Promise.all([
      request(http)
        .put(`/cotizaciones/${id}`)
        .set('Authorization', tokens.advisorA)
        .send({
          version: 1,
          items: [{ descripcion: 'Despues', cantidad: 2, valor_unitario: 100 }],
        }),
      request(http)
        .post(`/cotizaciones/${id}/emitir`)
        .set('Authorization', tokens.advisorA),
    ]);
    expect([200, 409]).toContain(edit.status);
    expect(emission.status).toBe(201);
    const saved = await source
      .getRepository(Cotizacion)
      .findOneByOrFail({ id });
    expect(saved.fecha_emision).not.toBeNull();
    const snapshot = saved.snapshot_datos!.cotizacion as Record<
      string,
      unknown
    >;
    expect(Number(snapshot.total)).toBe(Number(saved.total));
    expect((snapshot.items as { descripcion: string }[])[0].descripcion).toBe(
      saved.items[0].descripcion,
    );
    await request(http)
      .put(`/cotizaciones/${id}`)
      .set('Authorization', tokens.advisorA)
      .send({ version: saved.version, condiciones_comerciales: 'No' })
      .expect(409);
  });

  it('applies permission revocation to the next request without legacy fallback', async () => {
    await source.query(
      'UPDATE rbac_user_role_assignments SET active=0 WHERE user_id=?',
      [quoteA.creador_id],
    );
    await request(app.getHttpServer())
      .get('/cotizaciones')
      .set('Authorization', tokens.advisorA)
      .expect(403);
  });

  it('migrates explicitly selected orphan documents idempotently without changing their PDF snapshot', async () => {
    const quotes = source.getRepository(Cotizacion);
    const orphan = await quotes.save(
      quotes.create({
        consecutivo: 'HISTORICAL-ORPHAN',
        cliente_id: clientId,
        creador_id: null,
        scope_id: null,
        tipo_servicio: TipoServicioCotizacion.LAVANDERIA,
        snapshot_datos: {
          documento: { consecutivo: 'HISTORICAL-ORPHAN' },
          frozen: true,
        },
        hash_pdf: 'a'.repeat(64),
        items: [],
      }),
    );
    const plan = {
      ...localPlan,
      quotes: { ...localPlan.quotes, ids: [orphan.id] },
    };
    await expect(
      migrateLocalRbacPilot(source, {
        ...plan,
        owner: { ...plan.owner, expectedEmail: 'wrong@example.test' },
      }),
    ).rejects.toThrow();
    expect(
      (await quotes.findOneByOrFail({ id: orphan.id })).creador_id,
    ).toBeNull();
    await migrateLocalRbacPilot(source, plan);
    const migrated = await quotes.findOneByOrFail({ id: orphan.id });
    expect(migrated.creador_id).toBe(quoteA.creador_id);
    expect(migrated.scope_id).toBe(10);
    expect(migrated.snapshot_datos).toEqual(orphan.snapshot_datos);
    expect(migrated.hash_pdf).toBe(orphan.hash_pdf);
    await migrateLocalRbacPilot(source, plan);
    expect(
      await source.query('SELECT COUNT(*) AS total FROM rbac_platform_owner'),
    ).toEqual([{ total: '1' }]);
  });
  async function operationalOrder(tipo:'INDUSTRIAL_ETO'|'INSTITUCIONAL_VAPOR') {
    const creator=app.get(JwtService).decode(tokens.advisorA.slice(7)).sub;
    const quote=await source.getRepository(Cotizacion).save({consecutivo:`H4-${randomBytes(8).toString('hex')}`,
      cliente_id:clientId,tipo_servicio:tipo,estado:'APROBADA',scope_id:10,creador_id:creator});
    return request(app.getHttpServer()).post('/logistica/ordenes').set('Authorization',tokens.logistica)
      .send({cotizacion_id:quote.id,fecha_programada:'2026-11-09',materiales:[{descripcion:'Material',referencia:'R1',lote:'L1',empaque:'BOLSA',cantidad:39,muestras_retencion:0,muestras_cliente:null,muestras_laboratorio:1}]}).expect(201);
  }

  it('captures, edits and locks materials, then emits EtO with leap-day expiry and frozen quality evidence', async()=>{
    const http=app.getHttpServer();
    const created=await operationalOrder('INDUSTRIAL_ETO');
    expect(created.body.materiales[0]).toMatchObject({lote:'L1',cantidad:39,muestras_retencion:0,muestras_cliente:null});
    expect(created.body.metodo_esterilizacion).toBe('ETO');
    await request(http).patch(`/logistica/ordenes/${created.body.id}/materiales`).set('Authorization',tokens.advisorA)
      .send({version:created.body.version,materiales:[{descripcion:'No permitido',cantidad:1}]}).expect(403);
    const edited=await request(http).patch(`/logistica/ordenes/${created.body.id}/materiales`).set('Authorization',tokens.logistica)
      .send({version:created.body.version,materiales:[{descripcion:'Material recibido',cantidad:39,lote:'L2',muestras_retencion:0}]}).expect(200);
    await request(http).patch(`/logistica/ordenes/${created.body.id}/materiales`).set('Authorization',tokens.logistica)
      .send({version:created.body.version,materiales:[{descripcion:'Obsoleto',cantidad:1}]}).expect(409);
    await request(http).put(`/logistica/ordenes/${created.body.id}/estado`).set('Authorization',tokens.logistica).send({estado:'EN_PLANTA'}).expect(200);
    const cycle=await request(http).post('/planta/ciclos').set('Authorization',tokens.root).send({
      orden_id:created.body.id,equipo:'E03',metodo:'ETO',temperatura:55,humedad:70,presion:-5,
      tiempo_exposicion:180,tiempo_aireacion:10,fecha_esterilizacion:'2024-02-29',control_biologico:'Negativo',control_quimico:'Cambio de color'}).expect(201);
    await request(http).patch(`/logistica/ordenes/${created.body.id}/materiales`).set('Authorization',tokens.logistica)
      .send({version:edited.body.version,materiales:[{descripcion:'Cambio posterior',cantidad:1}]}).expect(409);
    const cert=await request(http).post('/calidad/aprobar').set('Authorization',tokens.calidad)
      .send({ciclo_id:cycle.body.id,password:'quality-test-pass',evaluaciones:qualityEvaluations}).expect(201);
    expect(cert.body.fecha_vencimiento).toBe('2027-02-28');
    expect(cert.body.snapshot_datos.documento).toMatchObject({fecha_esterilizacion:'2024-02-29',fecha_vencimiento:'2027-02-28'});
    expect(cert.body.snapshot_datos.materiales[0]).toMatchObject({lote:'L2',cantidad:39});
    expect(cert.body.snapshot_datos.informacion_tecnica.tablas.VAPOR).toHaveLength(5);
    expect(cert.body.snapshot_datos.informacion_tecnica.tablas.VAPOR.every((r:any)=>r.resultado==='N/A')).toBe(true);
    expect(cert.body.snapshot_datos.sellos).toBeUndefined();
    const evaluations=await source.query('SELECT * FROM ciclos_parametros_evaluaciones WHERE ciclo_id=?',[cycle.body.id]);
    expect(evaluations).toHaveLength(5);
  });

  it('uses independent vapor drying data and N/A for EtO, with rollback for rejected quality', async()=>{
    const http=app.getHttpServer();
    const created=await operationalOrder('INSTITUCIONAL_VAPOR');
    await request(http).put(`/logistica/ordenes/${created.body.id}/estado`).set('Authorization',tokens.logistica).send({estado:'EN_PLANTA'}).expect(200);
    const payload={orden_id:created.body.id,equipo:'V01',metodo:'VAPOR',temperatura:134,tiempo_exposicion:10,tiempo_secado:15,
      fecha_esterilizacion:'2026-10-30',control_biologico:'Negativo',control_quimico:'Cambio de color'};
    await request(http).post('/planta/ciclos').set('Authorization',tokens.root).send({...payload,presion:-5}).expect(400);
    const cycle=await request(http).post('/planta/ciclos').set('Authorization',tokens.root).send(payload).expect(201);
    const evaluation=['temperatura','tiempo_exposicion','tiempo_secado'].map(parametro=>({parametro,criterio:'CUMPLE',opcion:0}));
    const before=await source.query("SELECT ultimo_valor FROM secuencias_consecutivos WHERE nombre='certificado_esterilizacion'");
    await request(http).post('/calidad/aprobar').set('Authorization',tokens.calidad)
      .send({ciclo_id:cycle.body.id,password:'quality-test-pass',evaluaciones:evaluation.slice(0,1)}).expect(400);
    expect(await source.query("SELECT ultimo_valor FROM secuencias_consecutivos WHERE nombre='certificado_esterilizacion'")).toEqual(before);
    const cert=await request(http).post('/calidad/aprobar').set('Authorization',tokens.calidad)
      .send({ciclo_id:cycle.body.id,password:'quality-test-pass',evaluaciones:evaluation}).expect(201);
    expect(cert.body.fecha_vencimiento).toBe('2029-10-30');
    const technical=cert.body.snapshot_datos.informacion_tecnica;
    expect(technical.tablas.ETO.every((r:any)=>r.resultado==='N/A')).toBe(true);
    expect(technical.tablas.VAPOR.find((r:any)=>r.parametro==='tiempo_secado')).toMatchObject({resultado:15,criterio:'CUMPLE'});
    expect(technical.tablas.VAPOR.find((r:any)=>r.parametro==='humedad_presion')).toMatchObject({resultado:'N/A'});
    expect(cycle.body.tiempo_aireacion).toBeNull();
  });

  it('rejects fractional material counts through the HTTP DTO',async()=>{
    const quote=await source.getRepository(Cotizacion).save({consecutivo:`H4-${randomBytes(8).toString('hex')}`,
      cliente_id:clientId,tipo_servicio:'INDUSTRIAL_ETO',estado:'APROBADA'});
    await request(app.getHttpServer()).post('/logistica/ordenes').set('Authorization',tokens.logistica)
      .send({cotizacion_id:quote.id,fecha_programada:'2026-11-09',materiales:[{descripcion:'Fraccion',cantidad:1.5}]}).expect(400);
    expect(await source.query('SELECT id FROM ordenes_servicio WHERE cotizacion_id=?',[quote.id])).toHaveLength(0);
  });


  it('persists explicit noncompliance and its selected alternative when rejecting a cycle',async()=>{
    const http=app.getHttpServer();const order=await operationalOrder('INDUSTRIAL_ETO');
    await request(http).put(`/logistica/ordenes/${order.body.id}/estado`).set('Authorization',tokens.logistica).send({estado:'EN_PLANTA'}).expect(200);
    const cycle=await request(http).post('/planta/ciclos').set('Authorization',tokens.root).send({
      orden_id:order.body.id,equipo:'E03',metodo:'ETO',temperatura:55,humedad:70,presion:-5,tiempo_exposicion:180,tiempo_aireacion:10,
      fecha_esterilizacion:'2026-10-30',control_biologico:'Requiere revision',control_quimico:'Cambio'}).expect(201);
    const evaluations=[{parametro:'temperatura',criterio:'NO_CUMPLE',opcion:0}];
    await request(http).post('/calidad/rechazar').set('Authorization',tokens.calidad)
      .send({ciclo_id:cycle.body.id,motivo:'No conforme por revision de Calidad',evaluaciones:evaluations}).expect(201);
    const saved=await source.query('SELECT criterio FROM ciclos_parametros_evaluaciones WHERE ciclo_id=?',[cycle.body.id]);
    expect(saved).toEqual([{criterio:'NO_CUMPLE'}]);
    const [audit]=await source.query("SELECT detalle FROM auditoria WHERE entidad='ciclo' AND entidad_id=? AND accion='rechazar'",[cycle.body.id]);
    const detail = typeof audit.detalle === 'string' ? JSON.parse(audit.detalle) : audit.detalle;
    expect(detail.evaluaciones).toEqual(evaluations);
  });

  it('keeps the original ICONTEC image after catalog changes and rejects tampering',async()=>{
    const emitted=await source.getRepository(Cotizacion).findOneByOrFail({id:quoteA.id});
    const first=(emitted.snapshot_datos as any).sellos.icontec;
    const seals=new SelloSnapshotService(source,sealRoot);
    const original=await seals.readFrozen(first);
    await writeFile(path.join(sealRoot,'next.png'),Buffer.concat([original,Buffer.from('next-version')]));
    await source.query("UPDATE sellos_certificacion SET imagen_key='next.png',numero_licencia='TEST-2' WHERE id=?",[first.sello_id]);
    const next=await source.transaction(async manager=>{
      const frozen=await seals.freeze(manager);
      expect(await seals.readFrozen(frozen,manager)).toEqual(Buffer.concat([original,Buffer.from('next-version')]));
      return frozen;
    });
    expect(next.version_id).not.toBe(first.version_id);
    expect(await seals.readFrozen(first)).toEqual(original);
    expect((await source.getRepository(Cotizacion).findOneByOrFail({id:quoteA.id})).snapshot_datos).toEqual(emitted.snapshot_datos);
    await writeFile(path.join(sealRoot,next.imagen_key),Buffer.from('tampered'));
    await expect(seals.readFrozen(next)).rejects.toMatchObject({status:409});
  });

  it.skipIf(!process.env.HITO4_RENDER_BASE_URL||!process.env.HITO4_ICONTEC_SOURCE)('emits real quotation and EtO/Vapor PDFs using React, Chromium and MariaDB',async()=>{
    const http=app.getHttpServer();
    const bytes=await readFile(process.env.HITO4_ICONTEC_SOURCE!);
    await writeFile(path.join(sealRoot,'actual-icontec.jpg'),bytes);
    await source.query("UPDATE sellos_certificacion SET nombre_norma='ICONTEC ISO 9001 / ISO 13485 e IQNET',numero_licencia='SC-CER814321 / DM-CER814323',imagen_key='actual-icontec.jpg' WHERE id=1");
    const seeded=await seedIcontec(source,process.env.HITO4_ICONTEC_SOURCE!,sealRoot);
    expect((await seedIcontec(source,process.env.HITO4_ICONTEC_SOURCE!,sealRoot)).version_id).toBe(seeded.version_id);
    const previous=process.env.PDF_RENDER_BASE_URL;
    process.env.PDF_RENDER_BASE_URL=process.env.HITO4_RENDER_BASE_URL;
    const rootId=app.get(JwtService).decode(tokens.root.slice(7)).sub;
    const qualityId=app.get(JwtService).decode(tokens.calidad.slice(7)).sub;
    await source.getRepository(User).update(rootId,{cargo:'Operador de Planta'});
    await source.getRepository(User).update(qualityId,{cargo:'Coordinador de Calidad'});
    realPdf=new PdfGeneratorService({saveFile:async(buffer:Buffer,key:string)=>{files.set(key,buffer);}} as never,new SelloSnapshotService(source,sealRoot));
    const artifacts=path.resolve('storage/backups/hito4-pdfs-smoke');await mkdir(artifacts,{recursive:true});
    try {
      const quote=await request(http).post('/cotizaciones').set('Authorization',tokens.advisorA)
        .send({cliente_id:clientId,tipo_servicio:'INDUSTRIAL_ETO',items:[{descripcion:'Servicio real de prueba',cantidad:1,valor_unitario:100}]}).expect(201);
      const issued=await request(http).post(`/cotizaciones/${quote.body.id}/emitir`).set('Authorization',tokens.advisorA).expect(201);
      expect(issued.body.pdf_renderer_version).toBe('react-playwright-v2');
      expect(issued.body.snapshot_datos.sellos.icontec.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
      await writeFile(path.join(artifacts,'cotizacion.pdf'),files.get(issued.body.pdf_url)!);
      for(const tipo of ['INDUSTRIAL_ETO','INSTITUCIONAL_VAPOR'] as const){
        const order=await operationalOrder(tipo);
        await request(http).put(`/logistica/ordenes/${order.body.id}/estado`).set('Authorization',tokens.logistica).send({estado:'EN_PLANTA'}).expect(200);
        const eto=tipo==='INDUSTRIAL_ETO';
        const payload={orden_id:order.body.id,equipo:eto?'E03':'V01',metodo:eto?'ETO':'VAPOR',temperatura:eto?55:134,
          fecha_esterilizacion:'2024-02-29',humedad:eto?70:null,presion:eto?-5:null,tiempo_aireacion:eto?10:null,
          tiempo_secado:eto?null:15,tiempo_exposicion:eto?180:10,control_biologico:'No se observa crecimiento',control_quimico:'Cambio de color'};
        const cycle=await request(http).post('/planta/ciclos').set('Authorization',tokens.root).send(payload).expect(201);
        const evaluations=eto?qualityEvaluations:['temperatura','tiempo_exposicion','tiempo_secado'].map(parametro=>({parametro,criterio:'CUMPLE',opcion:0}));
        const cert=await request(http).post('/calidad/aprobar').set('Authorization',tokens.calidad)
          .send({ciclo_id:cycle.body.id,password:'quality-test-pass',evaluaciones:evaluations}).expect(201);
        expect(cert.body.snapshot_datos.elaborado_por.cargo).toBe('Operador de Planta');
        expect(cert.body.snapshot_datos.aprobador.cargo).toBe('Coordinador de Calidad');
        expect(cert.body.fecha_vencimiento).toBe('2027-02-28');
        expect(createHash('sha256').update(files.get(cert.body.pdf_url)!).digest('hex')).toBe(cert.body.hash_pdf);
        await writeFile(path.join(artifacts,eto?'certificado-eto.pdf':'certificado-vapor.pdf'),files.get(cert.body.pdf_url)!);
      }
    } finally {
      await realPdf.onModuleDestroy();realPdf=undefined;
      if(previous===undefined)delete process.env.PDF_RENDER_BASE_URL;else process.env.PDF_RENDER_BASE_URL=previous;
    }
  },120000);

});
