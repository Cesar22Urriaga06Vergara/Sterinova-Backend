import type { MigrationInterface, QueryRunner } from 'typeorm';

const tableColumns: Record<string, string[]> = {
  usuarios: ['id', 'nombre', 'email', 'password_hash', 'rol', 'created_at'],
  clientes: ['id', 'razon_social', 'nit', 'contacto', 'telefono', 'email', 'direccion', 'created_at'],
  cotizaciones: ['id', 'consecutivo', 'fecha', 'tipo_servicio', 'estado', 'subtotal', 'iva', 'total', 'condiciones_comerciales', 'cliente_id'],
  cotizacion_items: ['id', 'descripcion', 'cantidad', 'valor_unitario', 'valor_total', 'cotizacion_id'],
  ordenes_servicio: ['id', 'consecutivo', 'cotizacion_id', 'fecha_programada', 'estado', 'conductor_asignado', 'vehiculo_placa', 'observaciones', 'created_at'],
  ciclos_esterilizacion: ['id', 'orden_id', 'equipo', 'metodo', 'operador_id', 'temperatura', 'humedad', 'presion', 'tiempo_exposicion', 'tiempo_aireacion', 'control_biologico', 'control_quimico', 'fecha_proceso', 'estado'],
  certificados_esterilizacion: ['id', 'consecutivo', 'orden_id', 'equipo', 'ciclo', 'parametros_tecnicos', 'controles_biologicos', 'estado', 'created_at'],
};

export class InitialSchema1730750400000 implements MigrationInterface {
  name = 'InitialSchema1730750400000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await Promise.all(
      Object.keys(tableColumns).map((name) => queryRunner.getTable(name)),
    );
    const existingCount = existing.filter(Boolean).length;

    if (existingCount === Object.keys(tableColumns).length) {
      const missingColumns = Object.entries(tableColumns).flatMap(([name, columns], index) => {
        const actual = new Set(existing[index]?.columns.map((column) => column.name));
        return columns.filter((column) => !actual.has(column)).map((column) => `${name}.${column}`);
      });
      if (missingColumns.length) {
        throw new Error(
          `El esquema existente no coincide con el baseline. Faltan columnas: ${missingColumns.join(', ')}`,
        );
      }
      return;
    }
    if (existingCount !== 0) {
      throw new Error(
        'Baseline detenido: hay un esquema parcial. Respáldalo y reconcilia las tablas antes de migrar.',
      );
    }

    await queryRunner.query(`
      CREATE TABLE usuarios (
        id INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(255) NOT NULL DEFAULT 'Admin',
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id), UNIQUE KEY UQ_usuarios_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    await queryRunner.query(`
      CREATE TABLE clientes (
        id INT NOT NULL AUTO_INCREMENT,
        razon_social VARCHAR(255) NOT NULL,
        nit VARCHAR(255) NOT NULL,
        contacto VARCHAR(255) NOT NULL,
        telefono VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id), UNIQUE KEY UQ_clientes_nit (nit)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    await queryRunner.query(`
      CREATE TABLE cotizaciones (
        id INT NOT NULL AUTO_INCREMENT,
        consecutivo VARCHAR(255) NOT NULL,
        fecha DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        tipo_servicio ENUM('INDUSTRIAL_ETO','INSTITUCIONAL_ETO','INSTITUCIONAL_VAPOR','INSUMOS','LAVANDERIA','FARMACEUTICO','FABRICANTE') NOT NULL,
        estado VARCHAR(255) NOT NULL DEFAULT 'Borrador',
        subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
        iva DECIMAL(14,2) NOT NULL DEFAULT 0,
        total DECIMAL(14,2) NOT NULL DEFAULT 0,
        condiciones_comerciales TEXT NULL,
        cliente_id INT NOT NULL,
        PRIMARY KEY (id), UNIQUE KEY UQ_cotizaciones_consecutivo (consecutivo),
        KEY IDX_cotizaciones_cliente_id (cliente_id),
        CONSTRAINT FK_cotizaciones_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    await queryRunner.query(`
      CREATE TABLE cotizacion_items (
        id INT NOT NULL AUTO_INCREMENT,
        descripcion VARCHAR(500) NOT NULL,
        cantidad DECIMAL(12,2) NOT NULL DEFAULT 0,
        valor_unitario DECIMAL(12,2) NOT NULL DEFAULT 0,
        valor_total DECIMAL(12,2) NOT NULL DEFAULT 0,
        cotizacion_id INT NOT NULL,
        PRIMARY KEY (id), KEY IDX_cotizacion_items_cotizacion_id (cotizacion_id),
        CONSTRAINT FK_cotizacion_items_cotizacion FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    await queryRunner.query(`
      CREATE TABLE ordenes_servicio (
        id INT NOT NULL AUTO_INCREMENT,
        consecutivo VARCHAR(255) NOT NULL,
        cotizacion_id INT NOT NULL,
        fecha_programada DATE NOT NULL,
        estado ENUM('PENDIENTE','EN_RUTA','RECOGIDO','EN_PLANTA','PROCESADO','CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
        conductor_asignado VARCHAR(255) NULL,
        vehiculo_placa VARCHAR(50) NULL,
        observaciones TEXT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id), UNIQUE KEY UQ_ordenes_servicio_consecutivo (consecutivo),
        UNIQUE KEY UQ_ordenes_servicio_cotizacion (cotizacion_id),
        CONSTRAINT FK_ordenes_servicio_cotizacion FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    await queryRunner.query(`
      CREATE TABLE ciclos_esterilizacion (
        id INT NOT NULL AUTO_INCREMENT,
        orden_id INT NOT NULL,
        equipo VARCHAR(100) NOT NULL,
        metodo ENUM('ETO','VAPOR') NOT NULL,
        operador_id INT NOT NULL,
        temperatura FLOAT NOT NULL,
        humedad FLOAT NOT NULL,
        presion FLOAT NOT NULL,
        tiempo_exposicion FLOAT NOT NULL,
        tiempo_aireacion FLOAT NOT NULL,
        control_biologico VARCHAR(255) NOT NULL,
        control_quimico VARCHAR(255) NOT NULL,
        fecha_proceso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        estado ENUM('EN_PROCESO','PENDIENTE_CALIDAD') NOT NULL DEFAULT 'PENDIENTE_CALIDAD',
        PRIMARY KEY (id), KEY IDX_ciclos_orden_id (orden_id), KEY IDX_ciclos_operador_id (operador_id),
        CONSTRAINT FK_ciclos_orden FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE RESTRICT,
        CONSTRAINT FK_ciclos_operador FOREIGN KEY (operador_id) REFERENCES usuarios(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    await queryRunner.query(`
      CREATE TABLE certificados_esterilizacion (
        id INT NOT NULL AUTO_INCREMENT,
        consecutivo VARCHAR(255) NOT NULL,
        orden_id INT NULL,
        equipo VARCHAR(255) NULL,
        ciclo VARCHAR(255) NULL,
        parametros_tecnicos TEXT NULL,
        controles_biologicos TEXT NULL,
        estado VARCHAR(255) NOT NULL DEFAULT 'Borrador',
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id), UNIQUE KEY UQ_certificados_consecutivo (consecutivo),
        KEY IDX_certificados_orden_id (orden_id),
        CONSTRAINT FK_certificados_orden FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
  }

  async down(): Promise<void> {
    throw new Error(
      'El baseline inicial no se revierte automáticamente; restaura un respaldo si necesitas volver atrás.',
    );
  }
}
