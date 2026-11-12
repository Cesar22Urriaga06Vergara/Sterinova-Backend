import type { MigrationInterface, QueryRunner } from 'typeorm';

const ORDER_FORMAT = {
  key: 'ORDEN_SERVICIO',
  code: 'R-ES-02',
  title: 'ORDEN DE SERVICIO DE ESTERILIZACIÓN',
  date: '2024-10-15',
};
const ACTA_FORMAT = {
  key: 'ACTA_SERVICIO',
  code: 'R-LG-04',
  title: 'ACTA DE SERVICIO',
  date: '2024-11-18',
};

async function seedFormat(
  queryRunner: QueryRunner,
  format: typeof ORDER_FORMAT,
): Promise<number> {
  const found: Array<{ id: number }> = await queryRunner.query(
    'SELECT id FROM formatos_documentales WHERE clave = ?',
    [format.key],
  );
  let formatId = Number(found[0]?.id ?? 0);
  if (!formatId) {
    const result = (await queryRunner.query(
      `INSERT INTO formatos_documentales
        (clave, tipo_documento, tipo_servicio, codigo, nombre)
       VALUES (?, ?, NULL, ?, ?)`,
      [format.key, format.key, format.code, format.title],
    )) as { insertId: number };
    formatId = Number(result.insertId);
  }

  const versions: Array<{ id: number }> = await queryRunner.query(
    'SELECT id FROM formato_versiones WHERE formato_id = ? AND version = 3',
    [formatId],
  );
  let versionId = Number(versions[0]?.id ?? 0);
  if (!versionId) {
    const result = (await queryRunner.query(
      `INSERT INTO formato_versiones
        (formato_id, version, responsable, estado, renderer_key,
         configuracion_json, fecha_version, es_vigente)
       VALUES (?, 3, 'Migración histórica', 'PUBLICADA', 'logistica_v1', ?, ?, 1)`,
      [
        formatId,
        JSON.stringify({
          document_code: format.code,
          title: format.title,
          version_label: '03',
          version_date: format.date,
        }),
        format.date,
      ],
    )) as { insertId: number };
    versionId = Number(result.insertId);
  }
  return versionId;
}

export class AddActaEventsAndLogisticsFormats1794600000000
  implements MigrationInterface
{
  name = 'AddActaEventsAndLogisticsFormats1794600000000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ordenes_servicio
      MODIFY estado ENUM('PENDIENTE','EN_RUTA','RECOGIDO','EN_PLANTA','PROCESADO','ENTREGADO','CANCELADO')
        NOT NULL DEFAULT 'PENDIENTE',
      ADD acta_consecutivo VARCHAR(40) NULL,
      ADD formato_orden_version_id INT NULL,
      ADD formato_acta_version_id INT NULL,
      ADD UNIQUE KEY UQ_ordenes_servicio_acta_consecutivo (acta_consecutivo),
      ADD KEY IDX_ordenes_servicio_formato_orden (formato_orden_version_id),
      ADD KEY IDX_ordenes_servicio_formato_acta (formato_acta_version_id),
      ADD CONSTRAINT FK_orden_servicio_formato_orden
        FOREIGN KEY (formato_orden_version_id) REFERENCES formato_versiones(id) ON DELETE RESTRICT,
      ADD CONSTRAINT FK_orden_servicio_formato_acta
        FOREIGN KEY (formato_acta_version_id) REFERENCES formato_versiones(id) ON DELETE RESTRICT`);
    await queryRunner.query(`CREATE TABLE ordenes_servicio_eventos (
      id INT NOT NULL AUTO_INCREMENT,
      orden_id INT NOT NULL,
      tipo VARCHAR(32) NOT NULL,
      ocurrido_at DATETIME(6) NOT NULL,
      usuario_id INT NOT NULL,
      datos_json JSON NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY UQ_ordenes_servicio_evento_tipo (orden_id, tipo),
      KEY IDX_ordenes_servicio_eventos_ocurrido (orden_id, ocurrido_at),
      CONSTRAINT FK_ordenes_servicio_eventos_orden
        FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE RESTRICT,
      CONSTRAINT FK_ordenes_servicio_eventos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`);

    const orderVersionId = await seedFormat(queryRunner, ORDER_FORMAT);
    const actaVersionId = await seedFormat(queryRunner, ACTA_FORMAT);
    await queryRunner.query(
      `UPDATE ordenes_servicio
       SET formato_orden_version_id = ?, formato_acta_version_id = ?
       WHERE formato_orden_version_id IS NULL OR formato_acta_version_id IS NULL`,
      [orderVersionId, actaVersionId],
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const events: Array<{ total: number }> = await queryRunner.query(
      'SELECT COUNT(*) AS total FROM ordenes_servicio_eventos',
    );
    const actas: Array<{ total: number }> = await queryRunner.query(
      'SELECT COUNT(*) AS total FROM ordenes_servicio WHERE acta_consecutivo IS NOT NULL',
    );
    const delivered: Array<{ total: number }> = await queryRunner.query(
      "SELECT COUNT(*) AS total FROM ordenes_servicio WHERE estado = 'ENTREGADO'",
    );
    if (
      Number(events[0]?.total ?? 0) > 0 ||
      Number(actas[0]?.total ?? 0) > 0 ||
      Number(delivered[0]?.total ?? 0) > 0
    ) {
      throw new Error(
        'No se puede revertir mientras existan eventos logísticos, actas emitidas u órdenes entregadas',
      );
    }

    await queryRunner.query('DROP TABLE ordenes_servicio_eventos');
    await queryRunner.query(`ALTER TABLE ordenes_servicio
      DROP FOREIGN KEY FK_orden_servicio_formato_orden,
      DROP FOREIGN KEY FK_orden_servicio_formato_acta,
      DROP INDEX UQ_ordenes_servicio_acta_consecutivo,
      DROP INDEX IDX_ordenes_servicio_formato_orden,
      DROP INDEX IDX_ordenes_servicio_formato_acta,
      DROP COLUMN formato_orden_version_id,
      DROP COLUMN formato_acta_version_id,
      DROP COLUMN acta_consecutivo,
      MODIFY estado ENUM('PENDIENTE','EN_RUTA','RECOGIDO','EN_PLANTA','PROCESADO','CANCELADO')
        NOT NULL DEFAULT 'PENDIENTE'`);
  }
}
