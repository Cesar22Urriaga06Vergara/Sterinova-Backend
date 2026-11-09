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
import { UserRole } from '../src/users/entities/user-role.enum.js';
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
  const database = `sterinova_pilot_test_${randomBytes(8).toString('hex')}`;
  const files = new Map<string, Buffer>();
  const pdf = {
    generate: vi.fn(async (_snapshot: unknown, key: string) => {
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
      migrations: DATABASE_MIGRATIONS,
      migrationsTableName: 'typeorm_migrations',
      migrationsTransactionMode: 'each' as const,
      synchronize: false,
      migrationsRun: false,
    };
    source = await new DataSource(options).initialize();
    await source.runMigrations();
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
  it('keeps other modules under legacy protection while denying their access to the pilot', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', tokens.legacyAdmin)
      .expect(200);
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

});
