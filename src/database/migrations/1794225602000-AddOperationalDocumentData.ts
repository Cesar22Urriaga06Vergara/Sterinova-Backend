import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Additive: unknown historical operational data stays NULL; no document is rewritten. */
export class AddOperationalDocumentData1794225602000 implements MigrationInterface {
  transaction = false;
  async up(r: QueryRunner): Promise<void> {
    await r.query(`CREATE TABLE protocolos_esterilizacion_versiones (
      id INT AUTO_INCREMENT PRIMARY KEY, metodo ENUM('ETO','VAPOR') NOT NULL,
      version INT UNSIGNED NOT NULL, especificaciones_json JSON NOT NULL,
      motivo VARCHAR(500) NOT NULL, creado_por_id INT NULL,
      created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      UNIQUE KEY UQ_protocolo_metodo_version (metodo, version),
      CONSTRAINT CHK_protocolo_version CHECK (version > 0),
      CONSTRAINT FK_protocolo_autor FOREIGN KEY (creado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
    await r.query(`CREATE TABLE sellos_certificacion_versiones (
      id INT AUTO_INCREMENT PRIMARY KEY, sello_id INT NOT NULL, version INT UNSIGNED NOT NULL,
      imagen_key VARCHAR(1024) NOT NULL, imagen_sha256 CHAR(64) NOT NULL,
      mime_type VARCHAR(100) NOT NULL, tamano_bytes BIGINT UNSIGNED NOT NULL,
      nombre_norma VARCHAR(120) NOT NULL, numero_licencia VARCHAR(150) NOT NULL,
      creado_por_id INT NULL, created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      UNIQUE KEY UQ_sello_version (sello_id, version),
      CONSTRAINT CHK_sello_version CHECK (version > 0 AND tamano_bytes > 0 AND imagen_sha256 REGEXP '^[0-9a-f]{64}$'),
      CONSTRAINT FK_sello_version_sello FOREIGN KEY (sello_id) REFERENCES sellos_certificacion(id) ON DELETE RESTRICT,
      CONSTRAINT FK_sello_version_autor FOREIGN KEY (creado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
    await r.query(`ALTER TABLE ordenes_servicio
      ADD metodo_esterilizacion ENUM('ETO','VAPOR') NULL,
      ADD version INT NOT NULL DEFAULT 1`);
    await r.query(`CREATE TABLE ordenes_servicio_materiales (
      id INT AUTO_INCREMENT PRIMARY KEY, orden_id INT NOT NULL, cotizacion_item_id INT NULL,
      posicion INT UNSIGNED NOT NULL, descripcion VARCHAR(500) NOT NULL,
      referencia VARCHAR(150) NULL, lote VARCHAR(150) NULL, cantidad INT UNSIGNED NOT NULL,
      empaque VARCHAR(255) NULL, muestras_retencion INT UNSIGNED NULL,
      muestras_cliente INT UNSIGNED NULL, muestras_laboratorio INT UNSIGNED NULL,
      created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      UNIQUE KEY UQ_material_orden_posicion (orden_id, posicion),
      CONSTRAINT CHK_material_cantidad CHECK (cantidad > 0 AND posicion > 0),
      CONSTRAINT FK_material_orden FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE RESTRICT,
      CONSTRAINT FK_material_item FOREIGN KEY (cotizacion_item_id) REFERENCES cotizacion_items(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
    await r.query(`ALTER TABLE ciclos_esterilizacion
      MODIFY humedad FLOAT NULL, MODIFY presion FLOAT NULL, MODIFY tiempo_aireacion FLOAT NULL,
      ADD fecha_esterilizacion DATE NULL, ADD tiempo_secado DECIMAL(10,3) NULL,
      ADD protocolo_version_id INT NULL,
      ADD CONSTRAINT CHK_ciclo_secado CHECK (tiempo_secado IS NULL OR tiempo_secado >= 0),
      ADD CONSTRAINT FK_ciclo_protocolo FOREIGN KEY (protocolo_version_id) REFERENCES protocolos_esterilizacion_versiones(id) ON DELETE RESTRICT`);
    await r.query(`CREATE TABLE ciclos_parametros_evaluaciones (
      id INT AUTO_INCREMENT PRIMARY KEY, ciclo_id INT NOT NULL, parametro VARCHAR(80) NOT NULL,
      criterio ENUM('CUMPLE','NO_CUMPLE','NO_APLICA') NOT NULL,
      evaluador_id INT NOT NULL, evaluado_at DATETIME(6) NOT NULL,
      UNIQUE KEY UQ_evaluacion_ciclo_parametro (ciclo_id, parametro),
      CONSTRAINT FK_evaluacion_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclos_esterilizacion(id) ON DELETE RESTRICT,
      CONSTRAINT FK_evaluacion_usuario FOREIGN KEY (evaluador_id) REFERENCES usuarios(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB`);
    await r.query(`ALTER TABLE cotizaciones ADD sello_icontec_version_id INT NULL,
      ADD CONSTRAINT FK_cotizacion_sello_version FOREIGN KEY (sello_icontec_version_id) REFERENCES sellos_certificacion_versiones(id) ON DELETE RESTRICT`);
    await r.query(
      `ALTER TABLE certificados_esterilizacion ADD fecha_esterilizacion DATE NULL, ADD fecha_vencimiento DATE NULL`,
    );
    await r.query(`CREATE TRIGGER trg_certificados_fechas_inmutables BEFORE UPDATE ON certificados_esterilizacion
      FOR EACH ROW BEGIN
        IF OLD.estado = 'Aprobado' AND (
          NOT (OLD.fecha_esterilizacion <=> NEW.fecha_esterilizacion) OR
          NOT (OLD.fecha_vencimiento <=> NEW.fecha_vencimiento)
        ) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Las fechas del certificado aprobado son inmutables'; END IF;
      END`);
    await r.query(`CREATE TRIGGER trg_cotizaciones_sello_inmutable BEFORE UPDATE ON cotizaciones
      FOR EACH ROW BEGIN
        IF (OLD.fecha_emision IS NOT NULL OR OLD.snapshot_datos IS NOT NULL) AND
          NOT (OLD.sello_icontec_version_id <=> NEW.sello_icontec_version_id)
        THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El sello de la cotizacion emitida es inmutable'; END IF;
      END`);

    // These are transcription references, not retrospective quality approvals.
    const row = (
      parametro: string,
      unidad: string | null,
      opciones: string[],
      aplicable = true,
    ) => ({ parametro, unidad, opciones, aplicable });
    const protocols = {
      ETO: [
        row('temperatura', '°C', [
          'Rango 50 - 60',
          'Rango 34 - 40',
          'Rango 17 - 23',
        ]),
        row('humedad', '%', ['Rango 30 - 80']),
        row('presion', 'inHg', ['Rango -10 a -4']),
        row('tiempo_exposicion', 'min', ['180 min', '360 min', '720 min']),
        row('tiempo_aireacion', null, ['Rango 9 -20']),
      ],
      VAPOR: [
        row('temperatura', '°C', ['134 +/- 2°C', '121 +/- 2°C']),
        row('tiempo_exposicion', 'min', [
          'Rango 7 a 10 min',
          'Rango 10 a 20 min',
          'Rango 20 a 30 min',
        ]),
        row('tiempo_secado', 'min', ['Rango 10 a 20 min', 'Rango 21 a 40 min']),
        row('humedad_presion', null, ['N/A'], false),
        row('tiempo_aireacion', null, ['N/A'], false),
      ],
    };
    for (const [metodo, filas] of Object.entries(protocols)) {
      await r.query(
        `INSERT INTO protocolos_esterilizacion_versiones
        (metodo, version, especificaciones_json, motivo) VALUES (?, 1, ?, ?)`,
        [
          metodo,
          JSON.stringify({
            schema_version: 1,
            fuente:
              'Ejemplo de Certificado de Esterilizacion.pdf / R-AQ-09 V05 25/11/2024',
            filas,
            pendientes_calidad:
              metodo === 'ETO'
                ? ['Unidad de aireación no explícita; no asumir minutos']
                : [
                    'Humedad/Presión y Aireación no figuran en el ejemplo; N/A hasta configuración de Calidad',
                  ],
            seleccion_automatica: false,
          }),
          'Transcripción del ejemplo; alternativas y unidades pendientes deben ser confirmadas por Calidad',
        ],
      );
    }
    // Version contents cannot change, even if no document references them yet.
    for (const table of [
      'protocolos_esterilizacion_versiones',
      'sellos_certificacion_versiones',
    ]) {
      for (const action of ['UPDATE', 'DELETE']) {
        await r.query(`CREATE TRIGGER ${table}_no_${action.toLowerCase()} BEFORE ${action} ON ${table}
          FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Version inmutable; publique una nueva'`);
      }
    }
    // Seed every existing OS year from its numeric maximum, never from row id.
    await r.query(`INSERT INTO secuencias_consecutivos (nombre, ultimo_valor)
      SELECT CONCAT('orden_servicio:', SUBSTRING(consecutivo, 4, 4)),
        MAX(CAST(SUBSTRING(consecutivo, 9) AS UNSIGNED))
      FROM ordenes_servicio WHERE consecutivo REGEXP '^OS-[0-9]{4}-[0-9]{1,20}$'
      GROUP BY SUBSTRING(consecutivo, 4, 4)
      ON DUPLICATE KEY UPDATE ultimo_valor = GREATEST(ultimo_valor, VALUES(ultimo_valor))`);
  }
  async down(): Promise<void> {
    throw new Error(
      'No se elimina evidencia operativa ni versiones documentales; preparar una migración correctiva.',
    );
  }
}
