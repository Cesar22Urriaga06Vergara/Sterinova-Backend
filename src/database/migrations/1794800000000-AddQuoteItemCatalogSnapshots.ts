import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuoteItemCatalogSnapshots1794800000000
  implements MigrationInterface
{
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      ALTER TABLE cotizacion_items
        ADD COLUMN producto_id INT NULL,
        ADD COLUMN tipo_item ENUM('PRODUCTO', 'SERVICIO') NULL,
        ADD COLUMN categoria ENUM('EMPAQUES', 'MONITOREO', 'EQUIPOS', 'GENERAL') NULL,
        ADD COLUMN codigo VARCHAR(80) NULL,
        ADD COLUMN referencia VARCHAR(160) NULL,
        ADD COLUMN metodo VARCHAR(120) NULL,
        ADD COLUMN presentacion VARCHAR(160) NULL,
        ADD COLUMN marca VARCHAR(120) NULL,
        ADD COLUMN unidad VARCHAR(80) NULL,
        ADD COLUMN precision_cantidad TINYINT UNSIGNED NULL,
        ADD COLUMN imagen_key VARCHAR(48) NULL,
        ADD COLUMN imagen_sha256 CHAR(64) NULL,
        ADD COLUMN imagen_mime_type VARCHAR(32) NULL,
        ADD COLUMN imagen_tamano_bytes INT UNSIGNED NULL,
        ADD KEY IDX_cotizacion_items_producto_id (producto_id),
        ADD CONSTRAINT FK_cotizacion_items_producto_id
          FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
        ADD CONSTRAINT CHK_cotizacion_items_precision_cantidad
          CHECK (precision_cantidad IS NULL OR precision_cantidad <= 2)
    `);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`
      ALTER TABLE cotizacion_items
        DROP FOREIGN KEY FK_cotizacion_items_producto_id,
        DROP CHECK CHK_cotizacion_items_precision_cantidad,
        DROP INDEX IDX_cotizacion_items_producto_id,
        DROP COLUMN producto_id,
        DROP COLUMN tipo_item,
        DROP COLUMN categoria,
        DROP COLUMN codigo,
        DROP COLUMN referencia,
        DROP COLUMN metodo,
        DROP COLUMN presentacion,
        DROP COLUMN marca,
        DROP COLUMN unidad,
        DROP COLUMN precision_cantidad,
        DROP COLUMN imagen_key,
        DROP COLUMN imagen_sha256,
        DROP COLUMN imagen_mime_type,
        DROP COLUMN imagen_tamano_bytes
    `);
  }
}
