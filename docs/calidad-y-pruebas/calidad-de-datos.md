# Calidad e invariantes de datos observadas

> **Estado:** vigente como descripción estática, verificado el 6 de noviembre de 2026.
> **Verificado contra:** entidades, servicios y migraciones backend el 6 de noviembre de 2026.
> **Alcance:** restricciones implementadas en entidades, servicios y migraciones.
> **No cubre:** integridad de una base desplegada, cumplimiento regulatorio ni auditoría completa.
> **Fuente canónica de:** invariantes de datos visibles en el código.

## Invariantes visibles

> **Fuente canónica:** la definición de entidades y columnas está en [esquema y migraciones](../base-de-datos/esquema-y-migraciones.md). Este documento resume solo invariantes de negocio observadas.

- Clientes: `nit` único; una cotización y ciertas asignaciones restringen el borrado relacionado.
- Cotización: consecutivo único; una orden de servicio por cotización; el servicio impide eliminar cotizaciones emitidas.
- Secuencias: actualizadas dentro de transacción y con bloqueo pesimista en generación de cotizaciones y certificados.
- Calidad: revisión registra revisor, fecha y motivo de rechazo; aprobar requiere contraseña y actualiza ciclo/crea certificado en transacción.
- Certificado: ciclo único, token público opaco, snapshot y metadatos PDF; trigger en migraciones bloquea cambios de negocio después de aprobado.
- Formatos: versiones y asignaciones tienen restricciones referenciales; operaciones de formato registran eventos de auditoría selectivos.
- Auditoría: existe tabla y servicio, pero no instrumenta todas las mutaciones del sistema.

## Retención y alcance de auditoría

- **Política propuesta:** conservar los eventos de auditoría durante cinco años desde su creación y luego eliminarlos mediante un proceso controlado y trazable. Este plazo es una política operativa propuesta; debe validarse con el responsable regulatorio y el negocio antes de declararlo como cumplimiento normativo.
- Los registros deben permanecer append-only desde la aplicación, con acceso de consulta restringido a Admin. La retención debe incluir copias de respaldo y definir qué sucede ante una orden de conservación legal.
- Se registran autenticaciones exitosas/fallidas (IP y User-Agent), decisiones de Calidad, cambios de estado de órdenes, emisión y descargas de certificados. No guardar contraseñas, tokens, ni motivos o datos personales innecesarios en `detalle`.
- Los éxitos de Calidad y cambios de estado se escriben en la transacción de dominio. Los fallos se registran fuera de esa transacción, de forma que el error original se conserve. La auditoría de login y descarga es best effort para no cambiar el resultado de autenticación o entrega.
- Esta instrumentación cubre las operaciones críticas enumeradas en el reporte de Fase 3. No debe describirse como historial integral de cada lectura o mutación del sistema.

No se encontraron entidades para evidencias adjuntas de ciclo ni firma digital de usuarios/clientes. Un sello gráfico no prueba autoría o firma. La auditoría y snapshots no deben describirse como historial integral ni como respaldo.

Evidencia: entidades bajo `src/**/entities/`, servicios de `src/calidad/`, `src/certificados/`, `src/cotizaciones/` y `src/formatos-documentales/`, migraciones de `src/database/migrations/`. La base efectiva queda **NO VERIFICABLE EN CÓDIGO**.
