import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { AppModule } from '../src/app.module.js';
import { User } from '../src/users/entities/user.entity.js';
import { UserRole } from '../src/users/entities/user-role.enum.js';
import { withRbacFixtureWrite } from './fixtures/rbac-fixture-write.js';
import { Cliente } from '../src/clientes/entities/cliente.entity.js';
import { Cotizacion } from '../src/cotizaciones/entities/cotizacion.entity.js';
import { TipoServicioCotizacion } from '../src/cotizaciones/entities/tipo-servicio.enum.js';
import {
  SolicitudAnulacion,
  EstadoSolicitudAnulacion as Estado,
} from '../src/cotizaciones/entities/solicitud-anulacion.entity.js';

// The standard isolated runner creates and later drops the entire test database.
describe.skipIf(process.env.RUN_E2E_FULL_FLOW !== '1')(
  'anulaciones HTTP con JWT, RBAC y MariaDB reales',
  () => {
    let app: INestApplication;
    let db: DataSource;
    let advisor: User;
    let admin: User;
    let otherAdmin: User;
    let token: string;
    let adminToken: string;
    let otherToken: string;
    let scopeId: number;
    let otherScopeId: number;
    let clientId: number;
    const suffix = randomUUID();

    beforeAll(async () => {
      if (!/(^|[_-])test([_-]|$)/i.test(process.env.DB_DATABASE ?? '')) {
        throw new Error(
          'Las pruebas de anulación requieren una base de datos de pruebas aislada',
        );
      }
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = module.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      await app.init();
      db = app.get(DataSource);
      const users = db.getRepository(User);
      const makeUser = (name: string) =>
        users.save(
          users.create({
            nombre: name,
            email: `${name}-${suffix}@example.test`,
            password_hash: 'unused-signed-jwt-fixture',
            rol: UserRole.COMERCIAL,
            activo: true,
          }),
        );
      advisor = await makeUser('asesor');
      admin = await makeUser('jefe');
      otherAdmin = await makeUser('otro-jefe');
      for (const code of ['comercial', 'logistica']) {
        await db.query(
          `INSERT INTO rbac_scopes (code, name, kind, parent_id)
        SELECT ?, ?, 'DEPARTMENT', id FROM rbac_scopes WHERE kind = 'GLOBAL'`,
          [`cancel-${code}-${suffix}`, code],
        );
      }
      const scopes = await db.query(
        'SELECT id, code FROM rbac_scopes WHERE code IN (?, ?)',
        [`cancel-comercial-${suffix}`, `cancel-logistica-${suffix}`],
      );
      scopeId = scopes.find((s) => s.code === `cancel-comercial-${suffix}`).id;
      otherScopeId = scopes.find(
        (s) => s.code === `cancel-logistica-${suffix}`,
      ).id;
      for (const [user, role, scope] of [
        [advisor, 'comercial', scopeId],
        [advisor, 'emisor_comercial', scopeId],
        [admin, 'admin_area', scopeId],
        [otherAdmin, 'admin_area', otherScopeId],
      ] as const) {
        await withRbacFixtureWrite(db, user.id, runner => runner.query(
          `INSERT INTO rbac_user_role_assignments (user_id, role_id, scope_id, scope_kind)
        SELECT ?, id, ?, 'DEPARTMENT' FROM rbac_roles WHERE code = ?`,
          [user.id, scope, role],
        ));
      }
      const client = await db.getRepository(Cliente).save({
        razon_social: 'Cliente anulación',
        nit: suffix,
        contacto: 'Prueba',
        telefono: '123',
        email: 'client@example.test',
        direccion: 'Prueba',
      });
      clientId = client.id;
      const jwt = app.get(JwtService);
      token = jwt.sign({ sub: advisor.id, email: advisor.email });
      adminToken = jwt.sign({ sub: admin.id, email: admin.email });
      otherToken = jwt.sign({ sub: otherAdmin.id, email: otherAdmin.email });
    }, 30_000);

    afterAll(async () => {
      await app?.close();
    });

    async function quote(estado = 'EMITIDA', scope = scopeId) {
      return db.getRepository(Cotizacion).save({
        consecutivo: `C-${randomUUID()}`,
        tipo_servicio: TipoServicioCotizacion.INDUSTRIAL_ETO,
        cliente_id: clientId,
        creador_id: advisor.id,
        scope_id: scope,
        estado,
      });
    }

    async function create(quoteId: number) {
      return request(app.getHttpServer())
        .post(`/cotizaciones/${quoteId}/solicitud-anulacion`)
        .auth(token, { type: 'bearer' })
        .send({ motivo: 'Corrección comercial' })
        .expect(201);
    }

    it('registra los permisos dinámicos y los otorga a superadmin y admin_area', async () => {
      const permissions = await db.query(
        "SELECT code, is_dynamic FROM rbac_permissions WHERE code LIKE 'solicitudes_anulacion.%'",
      );
      expect(permissions).toHaveLength(3);
      expect(permissions.every((p) => p.is_dynamic === 1)).toBe(true);
      const grants =
        await db.query(`SELECT r.code, COUNT(*) AS total FROM rbac_roles r
      JOIN rbac_role_permissions g ON g.role_id = r.id WHERE r.code IN ('superadmin','admin_area')
      AND g.permission_code LIKE 'solicitudes_anulacion.%' GROUP BY r.code`);
      expect(grants).toHaveLength(2);
      expect(grants.every((g) => Number(g.total) === 3)).toBe(true);
    });

    it('asesor crea, jefe lista y aprueba, cotización queda ANULADA; otra área recibe 403', async () => {
      const first = await quote();
      const created = await create(first.id);
      expect(created.body).toMatchObject({
        creador_id: advisor.id,
        cotizacion_id: first.id,
        estado: 'PENDIENTE',
      });
      const foreignQuote = await quote('EMITIDA', otherScopeId);
      const foreignRequest = await db.getRepository(SolicitudAnulacion).save({
        cotizacion_id: foreignQuote.id,
        creador_id: advisor.id,
        motivo: 'Otra área',
        estado: Estado.PENDIENTE,
      });
      const list = await request(app.getHttpServer())
        .get('/solicitudes-anulacion/pendientes')
        .auth(adminToken, { type: 'bearer' })
        .expect(200);
      expect(list.body.map((s) => s.id)).toContain(created.body.id);
      const listed = list.body.find((s) => s.id === created.body.id);
      expect(listed).toMatchObject({
        creador: { nombre: 'asesor' },
        cotizacion: { cliente: { razon_social: 'Cliente anulación' } },
      });
      expect(Object.keys(listed.creador).sort()).toEqual(['apellido', 'id', 'nombre']);
      expect(Object.keys(listed.cotizacion.cliente).sort()).toEqual(['id', 'razon_social']);
      expect(listed.cotizacion).not.toHaveProperty('items');
      expect(list.body.map((s) => s.id)).not.toContain(foreignRequest.id);
      const approved = await request(app.getHttpServer())
        .patch(`/solicitudes-anulacion/${created.body.id}/resolver`)
        .auth(adminToken, { type: 'bearer' })
        .send({ estado: 'APROBADA', observacion: 'Validado' })
        .expect(200);
      expect(approved.body).toMatchObject({
        estado: 'APROBADA',
        aprobador_id: admin.id,
        observacion_resolucion: 'Validado',
      });
      expect(approved.body.fecha_resolucion).toEqual(expect.any(String));
      expect(
        (await db.getRepository(Cotizacion).findOneByOrFail({ id: first.id }))
          .estado,
      ).toBe('ANULADA');
      await request(app.getHttpServer())
        .post(`/cotizaciones/${first.id}/emitir`)
        .auth(token, { type: 'bearer' })
        .expect(409);
      const second = await quote();
      const secondRequest = await create(second.id);
      await request(app.getHttpServer())
        .patch(`/solicitudes-anulacion/${secondRequest.body.id}/resolver`)
        .auth(otherToken, { type: 'bearer' })
        .send({ estado: 'APROBADA', observacion: 'No autorizado' })
        .expect(403);
      expect(
        (await db.getRepository(Cotizacion).findOneByOrFail({ id: second.id }))
          .estado,
      ).toBe('EMITIDA');
      expect(
        (
          await db
            .getRepository(SolicitudAnulacion)
            .findOneByOrFail({ id: secondRequest.body.id })
        ).estado,
      ).toBe('PENDIENTE');
    });

    it('rechaza sin anular y evita resolver dos veces', async () => {
      const q = await quote();
      const result = await create(q.id);
      const endpoint = `/solicitudes-anulacion/${result.body.id}/resolver`;
      await request(app.getHttpServer())
        .patch(endpoint)
        .auth(adminToken, { type: 'bearer' })
        .send({ estado: 'RECHAZADA', observacion: 'No procede' })
        .expect(200);
      expect(
        (await db.getRepository(Cotizacion).findOneByOrFail({ id: q.id }))
          .estado,
      ).toBe('EMITIDA');
      await request(app.getHttpServer())
        .patch(endpoint)
        .auth(adminToken, { type: 'bearer' })
        .send({ estado: 'APROBADA', observacion: '' })
        .expect(409);
    });

    it('valida JWT, identidad del creador, DTOs y estado de cotización', async () => {
      const q = await quote();
      const endpoint = `/cotizaciones/${q.id}/solicitud-anulacion`;
      await request(app.getHttpServer())
        .post(endpoint)
        .send({ motivo: 'Error' })
        .expect(401);
      for (const body of [
        { motivo: '  ' },
        { motivo: 12 },
        { motivo: 'Error', creadorId: admin.id },
      ]) {
        await request(app.getHttpServer())
          .post(endpoint)
          .auth(token, { type: 'bearer' })
          .send(body)
          .expect(400);
      }
      const draft = await quote('Borrador');
      await request(app.getHttpServer())
        .post(`/cotizaciones/${draft.id}/solicitud-anulacion`)
        .auth(token, { type: 'bearer' })
        .send({ motivo: 'Error' })
        .expect(409);
      const created = await create(q.id);
      await request(app.getHttpServer())
        .patch(`/solicitudes-anulacion/${created.body.id}/resolver`)
        .auth(adminToken, { type: 'bearer' })
        .send({ estado: 'PENDIENTE', observacion: '' })
        .expect(400);
      await request(app.getHttpServer())
        .patch(`/solicitudes-anulacion/${created.body.id}/resolver`)
        .auth(token, { type: 'bearer' })
        .send({ estado: 'APROBADA', observacion: '' })
        .expect(403);
    });

    it('x-scope-id nunca amplía el ámbito autorizado', async () => {
      await request(app.getHttpServer())
        .get('/solicitudes-anulacion/pendientes')
        .auth(adminToken, { type: 'bearer' })
        .set('x-scope-id', String(otherScopeId))
        .expect(403);
    });
  },
);
