import 'reflect-metadata';
import { randomBytes } from 'node:crypto';
import { createConnection, type Connection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { DATABASE_MIGRATIONS } from '../src/database/migration-registry.js';
import { STERINOVA_ENTITIES } from '../src/database/entities.js';
import { LogisticaService } from '../src/logistica/logistica.service.js';
import { OrdenServicio } from '../src/ordenes-servicio/entities/orden-servicio.entity.js';
import { Cotizacion } from '../src/cotizaciones/entities/cotizacion.entity.js';
import { OrdenServicioMaterial } from '../src/ordenes-servicio/entities/orden-servicio-material.entity.js';

describe('Hito 4 on disposable MariaDB', () => {
  let admin: Connection;
  let source: DataSource;
  let name: string;
  let service: LogisticaService;
  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone: 'America/Bogota',
  }).format(new Date());

  beforeAll(async () => {
    const port = Number(process.env.HITO4_TEST_PORT);
    if (
      process.env.HITO4_DISPOSABLE_SERVER !== '1' ||
      !Number.isInteger(port) ||
      port < 1024 ||
      port > 65535 ||
      port === 3306
    ) {
      throw new Error(
        'Requires an explicitly disposable loopback server on a non-production port',
      );
    }
    admin = await createConnection({
      host: '127.0.0.1',
      port,
      user: 'root',
      password: '',
    });
    name = `sterinova_hito4_test_${randomBytes(8).toString('hex')}`;
    await admin.query(
      `CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
    );
    source = await new DataSource({
      type: 'mariadb',
      host: '127.0.0.1',
      port,
      username: 'root',
      password: '',
      database: name,
      entities: STERINOVA_ENTITIES,
      migrations: DATABASE_MIGRATIONS.slice(0, -1),
      migrationsTableName: 'typeorm_migrations',
      migrationsTransactionMode: 'each',
      synchronize: false,
    }).initialize();
    await source.runMigrations();
    await source.query(
      "INSERT INTO usuarios (id,nombre,email,password_hash,rol) VALUES (1,'Test','hito4@test.local','unused','Admin')",
    );
    await source.query(
      "INSERT INTO clientes (id,razon_social,nit,contacto,telefono,email,direccion) VALUES (1,'Test','H4','Test','1','test@test.local','Test')",
    );
    for (let id = 1; id <= 24; id++) {
      await source.query(
        "INSERT INTO cotizaciones (id,consecutivo,tipo_servicio,estado,cliente_id) VALUES (?,?,'INDUSTRIAL_ETO','APROBADA',1)",
        [id, `COT-IND-${String(id).padStart(3, '0')}`],
      );
    }
    // Out-of-order historical suffixes: maximum must win, not most recent id.
    await source.query(
      "INSERT INTO ordenes_servicio (id,consecutivo,cotizacion_id,fecha_programada) VALUES (1,?,1,'2026-11-09'),(2,?,2,'2026-11-09')",
      [`OS-${year}-0042`, `OS-${year}-0007`],
    );
    await source.query(
      "INSERT INTO cotizacion_items (id,descripcion,cantidad,cotizacion_id) VALUES (1,'Material',10,1)",
    );
    await source.query(
      "INSERT INTO ciclos_esterilizacion (id,orden_id,equipo,metodo,operador_id,temperatura,humedad,presion,tiempo_exposicion,tiempo_aireacion,control_biologico,control_quimico) VALUES (1,1,'E03','ETO',1,55,70,-5,180,10,'Negativo','Cambio')",
    );
    await source.query(
      "INSERT INTO certificados_esterilizacion (id,consecutivo,ciclo_id,estado,token_publico,snapshot_datos,hash_pdf) VALUES (1,'001',1,'Aprobado',?, ?, ?)",
      ['t'.repeat(43), JSON.stringify({ legacy: true }), 'a'.repeat(64)],
    );
    const tables = [
      'cotizaciones',
      'cotizacion_items',
      'ordenes_servicio',
      'ciclos_esterilizacion',
      'certificados_esterilizacion',
    ];
    const before = await Promise.all(
      tables.map((table) => source.query(`SELECT * FROM ${table} ORDER BY id`)),
    );
    await source.destroy();
    source = await new DataSource({
      type: 'mariadb',
      host: '127.0.0.1',
      port,
      username: 'root',
      password: '',
      database: name,
      entities: STERINOVA_ENTITIES,
      migrations: DATABASE_MIGRATIONS,
      migrationsTableName: 'typeorm_migrations',
      migrationsTransactionMode: 'each',
      synchronize: false,
    }).initialize();
    expect(await source.runMigrations()).toHaveLength(1);
    // Compare every old column, including PDFs, snapshots, money and dates.
    for (let i = 0; i < tables.length; i++) {
      const columns = Object.keys(before[i][0])
        .map((column) => `\`${column}\``)
        .join(',');
      expect(
        await source.query(`SELECT ${columns} FROM ${tables[i]} ORDER BY id`),
      ).toEqual(before[i]);
    }
    service = new LogisticaService(
      source.getRepository(OrdenServicio),
      source.getRepository(Cotizacion),
      source,
      {} as never,
    );
  }, 60_000);

  afterAll(async () => {
    if (source?.isInitialized) await source.destroy();
    if (admin) {
      if (name && /^sterinova_hito4_test_[a-f0-9]{16}$/.test(name))
        await admin.query(`DROP DATABASE \`${name}\``);
      await admin.end();
    }
  });

  it('has no pending migrations and retains unknown historical fields as NULL', async () => {
    expect(await source.showMigrations()).toBe(false);
    const [cycle] = await source.query(
      'SELECT fecha_esterilizacion, tiempo_secado, protocolo_version_id FROM ciclos_esterilizacion WHERE id=1',
    );
    expect(cycle).toEqual({
      fecha_esterilizacion: null,
      tiempo_secado: null,
      protocolo_version_id: null,
    });
    const [sequence] = await source.query(
      'SELECT ultimo_valor FROM secuencias_consecutivos WHERE nombre=?',
      [`orden_servicio:${year}`],
    );
    expect(String(sequence.ultimo_valor)).toBe('42');
  });

  it('seeds exact reference options without inventing unspecified units', async () => {
    const rows = await source.query(
      'SELECT metodo,especificaciones_json FROM protocolos_esterilizacion_versiones ORDER BY metodo',
    );
    const eto = JSON.parse(rows[0].especificaciones_json);
    const vapor = JSON.parse(rows[1].especificaciones_json);
    expect(eto.filas).toHaveLength(5);
    expect(eto.filas[0].opciones).toEqual([
      'Rango 50 - 60',
      'Rango 34 - 40',
      'Rango 17 - 23',
    ]);
    expect(eto.filas[2]).toMatchObject({
      unidad: 'inHg',
      opciones: ['Rango -10 a -4'],
    });
    expect(eto.filas[4].unidad).toBeNull();
    expect(vapor.filas).toHaveLength(5);
    expect(vapor.filas[3]).toMatchObject({
      opciones: ['N/A'],
      aplicable: false,
    });
  });

  it('prevents update/delete of protocol and seal versions', async () => {
    await source.query(
      "INSERT INTO sellos_certificacion (id,nombre_norma,numero_licencia,imagen_key) VALUES (1,'ICONTEC','TEST','legacy.png')",
    );
    await source.query(
      "INSERT INTO sellos_certificacion_versiones (id,sello_id,version,imagen_key,imagen_sha256,mime_type,tamano_bytes,nombre_norma,numero_licencia) VALUES (1,1,1,'sha256/test.png',?,'image/png',100,'ICONTEC','TEST')",
      ['b'.repeat(64)],
    );
    for (const table of [
      'protocolos_esterilizacion_versiones',
      'sellos_certificacion_versiones',
    ]) {
      await expect(
        source.query(`UPDATE ${table} SET version=2 WHERE id=1`),
      ).rejects.toThrow('inmutable');
      await expect(
        source.query(`DELETE FROM ${table} WHERE id=1`),
      ).rejects.toThrow('inmutable');
    }
    await expect(
      source.query(
        "INSERT INTO sellos_certificacion_versiones (sello_id,version,imagen_key,imagen_sha256,mime_type,tamano_bytes,nombre_norma,numero_licencia) VALUES (1,2,'bad','not-a-hash','image/png',10,'ICONTEC','TEST')",
      ),
    ).rejects.toThrow();
    await source.query(
      'UPDATE cotizaciones SET sello_icontec_version_id=1 WHERE id=24',
    );
    await source.query(
      'UPDATE cotizaciones SET fecha_emision=UTC_TIMESTAMP(6) WHERE id=24',
    );
    await expect(
      source.query(
        'UPDATE cotizaciones SET sello_icontec_version_id=NULL WHERE id=24',
      ),
    ).rejects.toThrow('inmutable');
  });

  it('round-trips integer material counts and enforces FK, position uniqueness and quantity', async () => {
    const repository = source.getRepository(OrdenServicioMaterial);
    const material = await repository.save(
      repository.create({
        orden_id: 1,
        cotizacion_item_id: 1,
        posicion: 1,
        descripcion: 'Material',
        referencia: 'REF',
        lote: 'L1',
        cantidad: 39,
        empaque: 'BOLSA PGM X 1 UND',
        muestras_retencion: 0,
        muestras_cliente: null,
        muestras_laboratorio: 2,
      }),
    );
    expect(await repository.findOneByOrFail({ id: material.id })).toMatchObject(
      { cantidad: 39, muestras_retencion: 0, muestras_cliente: null },
    );
    await expect(
      source.query(
        "INSERT INTO ordenes_servicio_materiales (orden_id,posicion,descripcion,cantidad) VALUES (1,2,'bad',0)",
      ),
    ).rejects.toThrow();
    await expect(
      source.query(
        "INSERT INTO ordenes_servicio_materiales (orden_id,posicion,descripcion,cantidad) VALUES (1,1,'duplicate',1)",
      ),
    ).rejects.toThrow();
    await expect(
      source.query(
        "INSERT INTO ordenes_servicio_materiales (orden_id,posicion,descripcion,cantidad) VALUES (99999,1,'bad FK',1)",
      ),
    ).rejects.toThrow();
    await expect(
      source.query(
        "INSERT INTO ordenes_servicio_materiales (orden_id,posicion,descripcion,cantidad,muestras_cliente) VALUES (1,2,'negative',1,-1)",
      ),
    ).rejects.toThrow();
  });

  it('enforces evaluation uniqueness and preserves separate drying/sterilization fields', async () => {
    await source.query(
      "INSERT INTO ciclos_parametros_evaluaciones (ciclo_id,parametro,criterio,evaluador_id,evaluado_at) VALUES (1,'temperatura','CUMPLE',1,UTC_TIMESTAMP(6))",
    );
    await expect(
      source.query(
        "INSERT INTO ciclos_parametros_evaluaciones (ciclo_id,parametro,criterio,evaluador_id,evaluado_at) VALUES (1,'temperatura','CUMPLE',1,UTC_TIMESTAMP(6))",
      ),
    ).rejects.toThrow();
    await source.query(
      "UPDATE ciclos_esterilizacion SET fecha_esterilizacion='2026-10-30',tiempo_secado=20 WHERE id=1",
    );
    const [row] = await source.query(
      'SELECT tiempo_aireacion,tiempo_secado FROM ciclos_esterilizacion WHERE id=1',
    );
    expect(Number(row.tiempo_aireacion)).toBe(10);
    expect(Number(row.tiempo_secado)).toBe(20);
    await source.query(
      'UPDATE ciclos_esterilizacion SET humedad=NULL,presion=NULL,tiempo_aireacion=NULL WHERE id=1',
    );
    await expect(
      source.query(
        "UPDATE certificados_esterilizacion SET fecha_vencimiento='2029-10-30' WHERE id=1",
      ),
    ).rejects.toThrow('inmutables');
  });

  it('assigns concurrent OS numbers uniquely starting after the historical maximum', async () => {
    const orders = await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        service.createOrden({
          cotizacion_id: i + 3,
          fecha_programada: '2026-11-09',
        }),
      ),
    );
    expect(orders.map((o) => o.consecutivo).sort()).toEqual(
      Array.from(
        { length: 8 },
        (_, i) => `OS-${year}-${String(43 + i).padStart(4, '0')}`,
      ),
    );
  });

  it('serializes first allocations when a new annual sequence has no row yet', async () => {
    await source.query(
      'DELETE FROM ordenes_servicio WHERE cotizacion_id BETWEEN 3 AND 10',
    );
    // Existing historical orders remain; exercise initialization under an unused year via a controlled clock.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2040-06-01T12:00:00Z'));
    try {
      const orders = await Promise.all(
        [11, 12, 13, 14].map((id) =>
          service.createOrden({
            cotizacion_id: id,
            fecha_programada: '2040-06-01',
          }),
        ),
      );
      expect(new Set(orders.map((o) => o.consecutivo)).size).toBe(4);
      expect(orders.map((o) => o.consecutivo).sort()).toEqual([
        'OS-2040-0001',
        'OS-2040-0002',
        'OS-2040-0003',
        'OS-2040-0004',
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not allocate twice for the same quote under concurrency', async () => {
    const results = await Promise.allSettled(
      [1, 2].map(() =>
        service.createOrden({
          cotizacion_id: 15,
          fecha_programada: '2026-11-09',
        }),
      ),
    );
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const failure = results.find(
      (r) => r.status === 'rejected',
    ) as PromiseRejectedResult;
    expect(failure.reason.getStatus()).toBe(409);
  });

  it('rolls back sequence if persisting the OS fails', async () => {
    const before = await source.query(
      'SELECT ultimo_valor FROM secuencias_consecutivos WHERE nombre=?',
      [`orden_servicio:${year}`],
    );
    await expect(
      service.createOrden({
        cotizacion_id: 16,
        fecha_programada: '2026-11-09',
        vehiculo_placa: 'x'.repeat(60),
      }),
    ).rejects.toThrow();
    expect(
      await source.query(
        'SELECT ultimo_valor FROM secuencias_consecutivos WHERE nombre=?',
        [`orden_servicio:${year}`],
      ),
    ).toEqual(before);
  });

  it('allows exactly one final allocation then rejects without advancing', async () => {
    await source.query(
      'UPDATE secuencias_consecutivos SET ultimo_valor=99999998 WHERE nombre=?',
      [`orden_servicio:${year}`],
    );
    const results = await Promise.allSettled(
      [17, 18].map((id) =>
        service.createOrden({
          cotizacion_id: id,
          fecha_programada: '2026-11-09',
        }),
      ),
    );
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const success = results.find(
      (r) => r.status === 'fulfilled',
    ) as PromiseFulfilledResult<OrdenServicio>;
    expect(success.value.consecutivo).toBe(`OS-${year}-99999999`);
    const failure = results.find(
      (r) => r.status === 'rejected',
    ) as PromiseRejectedResult;
    expect(failure.reason.getResponse()).toMatchObject({
      statusCode: 409,
      code: 'CONSECUTIVO_AGOTADO',
    });
    const [row] = await source.query(
      'SELECT ultimo_valor FROM secuencias_consecutivos WHERE nombre=?',
      [`orden_servicio:${year}`],
    );
    expect(String(row.ultimo_valor)).toBe('99999999');
  });
});
