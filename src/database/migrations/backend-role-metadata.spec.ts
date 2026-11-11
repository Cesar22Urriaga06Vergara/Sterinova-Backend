import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { STERINOVA_ENTITIES } from '../entities.js';
class MetadataSource extends DataSource {
  prepare() {
    return this.buildMetadatas();
  }
}
describe('phase 1 entity metadata', () => {
  it('maps indexed restrictive references for each new operational actor and scope', async () => {
    const source = new MetadataSource({
      type: 'mariadb',
      database: 'metadata_only',
      entities: STERINOVA_ENTITIES,
    });
    await source.prepare();
    const fields: Record<string, string[]> = {
      clientes: ['scope_id', 'creador_id'],
      ordenes_servicio: ['scope_id', 'creador_id'],
      ciclos_esterilizacion: ['scope_id'],
      cotizaciones: ['aprobador_interno_id', 'aceptacion_registrada_por_id'],
      certificados_esterilizacion: ['elaborado_por_id', 'verificado_por_id'],
      formato_versiones: [
        'scope_id',
        'creador_id',
        'aprobador_id',
        'publicado_por_id',
      ],
      auditoria: ['scope_id'],
    };
    for (const [table, columns] of Object.entries(fields)) {
      const metadata = source.entityMetadatas.find(
        (entity) => entity.tableName === table,
      )!;
      for (const field of columns) {
        expect(
          metadata.columns.find((column) => column.propertyName === field)
            ?.isNullable,
        ).toBe(true);
        expect(
          metadata.foreignKeys.find((key) =>
            key.columns.some((column) => column.propertyName === field),
          )?.onDelete,
        ).toBe('RESTRICT');
        expect(
          metadata.indices.some(
            (index) => index.name === `IDX_${table}_${field}`,
          ),
        ).toBe(true);
      }
    }
  });
});
