# Esquema y migraciones de base de datos

> **Estado:** vigente.
> **Verificado contra:** entidades, DataSource y migraciones del repositorio el 6 de noviembre de 2026.
> **Alcance:** esquema declarado en código, entidades registradas y migraciones.
> **No cubre:** estado aplicado, integridad ni datos de una instancia MariaDB.

## Configuración

TypeORM usa MariaDB, registra las entidades de `src/database/entities.ts`, mantiene `synchronize: false` y `migrationsRun: false`. El DataSource del CLI está en `src/database/data-source.ts`, registra las migraciones en orden y usa la tabla `typeorm_migrations`. Por tanto, la existencia de una migración en el código no demuestra que haya sido aplicada a una base concreta.

```powershell
npm run migration:show
npm run migration:run
```

`InitialSchema` crea el esquema en una base vacía y contempla reconocer/registrar un baseline de tablas compatibles. Las migraciones posteriores tienen validaciones de compatibilidad y pueden detenerse si detectan datos que requieren conciliación. Antes de aplicar DDL a datos existentes: hacer respaldo, revisar `migration:show` y analizar cada migración.

## Entidades registradas

Las tablas siguientes corresponden a `@Entity` en `src/`. Los nombres de campos y restricciones declarados en entidades/migraciones son la referencia del repositorio.

| Tabla | Uso y campos relevantes | Relaciones / reglas observadas |
|---|---|---|
| `usuarios` | Cuenta, email, hash, rol y estado/datos de contacto definidos por migraciones recientes. | Roles `Admin`, `Comercial`, `Logistica`, `Planta`, `Calidad`. No documentar como esquema exacto solo desde la entidad: migraciones recientes amplían/cambian columnas. |
| `clientes` | Datos comerciales, NIT único; campos `cargo` y `ciudad` añadidos por migración. | Cotizaciones referencian clientes con `RESTRICT`; asignaciones de formatos también restringen borrado. |
| `cotizaciones` | Consecutivo único, tipo de servicio, estado, importes, condiciones, snapshot y metadatos PDF. | Cliente `RESTRICT`; creador `SET NULL`; versión de formato `RESTRICT`; relación con ítems. |
| `cotizacion_items` | Descripción, cantidad, precio y total de línea. | Ítems se eliminan en cascada junto con cotización según entidad. |
| `ordenes_servicio` | Consecutivo, fecha, estado, conductor, vehículo y observaciones. | `cotizacion_id` único; cotización `RESTRICT`. |
| `ciclos_esterilizacion` | Orden, equipo, método, operador, parámetros, resultado y estado de revisión. | Orden y operador con restricciones de borrado; revisión registra revisor, fecha y motivo de rechazo. |
| `certificados_esterilizacion` | Consecutivo, token público, ciclo, aprobador, snapshot, versión de formato y metadatos PDF. | Ciclo único y `RESTRICT`; aprobador `RESTRICT`; orden nullable con `SET NULL`; trigger protege los datos aprobados. |
| `secuencias_consecutivos` | Contador por nombre para certificados y prefijos de cotización. | Actualización transaccional y bloqueo pesimista desde los servicios que emiten consecutivos. |
| `auditoria` | Usuario opcional, entidad/registro, acción, detalle JSON y fecha. | Usuario `SET NULL`. La entidad existe y el servicio se usa en emisión de cotización y operaciones de formatos; no equivale a historial integral de todas las operaciones. |
| `formatos_documentales` | Catálogo de formatos por clave, código y tipo de documento. | Tiene versiones y asignaciones por cliente. |
| `formato_versiones` | Versionado, fecha, responsable, renderer y configuración JSON. | Referenciada por documentos emitidos y asignaciones; borrado restringido. |
| `formato_asignaciones_cliente` | Asociación de cliente con formato y versión activa. | Cliente, formato y versión con `RESTRICT`; índice único por cliente/formato. |
| `sellos_certificacion` | Sello de certificación, ruta/archivo, activo y orden. | La API permite administrar y servir imágenes; no representa una firma manuscrita o firma digital del cliente. |

No se encontraron entidades dedicadas a archivos de evidencia de ciclos ni firmas digitales. Sí existen auditoría selectiva, versiones de formato, snapshots de documentos y el token público de validación.

## Migraciones registradas en el código

El DataSource lista estas once clases, en este orden:

| Migración | Cambio principal que declara |
|---|---|
| `1730750400000-InitialSchema` | Esquema inicial de usuarios, clientes, cotizaciones, órdenes, ciclos y certificados; maneja creación/baseline. |
| `1730750401000-AddQualityCertificates` | Amplía rol y datos de Calidad; asocia certificados a ciclos, crea `secuencias_consecutivos` con base histórica `55387` e instala trigger de inmutabilidad. |
| `1730750402000-AddCertificateValidationToken` | Agrega token público único y migra certificados existentes; recrea el trigger de inmutabilidad. |
| `1793750400000-AddDocumentFormatVersioning` | Crea formatos, versiones y asignaciones; adapta documentos/snapshots y trigger. |
| `1793754000000-ResetCertificateSequenceToThreeDigits` | Rechaza reiniciar si hay certificados; establece consecutivo de tres caracteres y reinicia la secuencia a cero. `down()` no revierte el cambio. |
| `1793757600000-ExtendDocumentSequences` | Amplía el consecutivo de certificado, recalcula mínimos desde certificados existentes y crea/actualiza contadores de prefijos de cotización. |
| `1793813200000-AddClienteDocumentFields` | Agrega `cargo` y `ciudad` a clientes. |
| `1793813300000-CreateAuditoria` | Crea la tabla `auditoria`. |
| `1793813400000-AddTemplateResponsible` | Agrega responsable requerido a versiones de formato y rellena registros existentes. |
| `1793813500000-AddPdfRendererVersion` | Agrega `pdf_renderer_version` a cotizaciones y certificados; actualiza trigger para permitir cambio de metadatos del PDF preservando campos de negocio aprobados. |
| `1793813600000-AddUsersAndCertificationSeals` | Actualiza datos de usuarios/cotizaciones y crea la tabla `sellos_certificacion`. |

Los archivos `*.spec.ts` dentro de `src/database/migrations` son pruebas de migraciones, no migraciones que TypeORM deba ejecutar.

## Consecutivo de certificados y 55388

La propuesta inicial de `55387 → 55388` está superada por la cadena posterior. `ResetCertificateSequenceToThreeDigits` fija el contador en cero y `ExtendDocumentSequences` vuelve a calcularlo según los certificados que ya existan; `CertificadosService` suma uno y aplica `padStart(3, '0')`. En una base vacía que complete esa cadena, el primer consecutivo generado es `001`, no `55388`. Si existen certificados, la migración de reset se detiene y exige conciliación. El valor/estado de una base concreta no se verificó.

Referencias principales: `src/database/migrations/1730750401000-AddQualityCertificates.ts`, `src/database/migrations/1793754000000-ResetCertificateSequenceToThreeDigits.ts`, `src/database/migrations/1793757600000-ExtendDocumentSequences.ts`, `src/certificados/certificados.service.ts`.

## Inmutabilidad y documentos

El trigger `trg_certificados_esterilizacion_inmutables` bloquea cambios a los datos de negocio de certificados aprobados. La migración `AddPdfRendererVersion` preserva esa regla permitiendo únicamente actualizar campos técnicos del PDF, como ruta/hash/versión según la definición vigente del trigger. La entidad de cotización y la de certificado incluyen `pdf_url`, `hash_pdf` y `pdf_renderer_version`; las dos primeras columnas aparecen en entidades/migraciones de versionado y la versión del renderizador la agrega la migración `1793813500000-AddPdfRendererVersion`.

Consulta [arquitectura y seguridad](../arquitectura/arquitectura-y-stack.md) y [estado funcional](../archivo/2026-11-10/estado-proyecto/modulos.md).
