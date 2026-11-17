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

Consulta [arquitectura y seguridad](../arquitectura/arquitectura-y-stack.md).

## Runbook: respaldos, restauración y migraciones

### Alcance y condiciones

Este procedimiento aplica a MariaDB y al `DataSource` del backend Sterinova. Requiere los clientes `mariadb` y `mariadb-dump` en `PATH`, acceso a la instancia y una ventana coordinada para operaciones de escritura. Las migraciones deben ejecutarse como paso explícito de despliegue; `start:dev` las aplica automáticamente y no debe usarse para arrancar producción.

Los comandos PowerShell siguientes leen `.env` sin imprimir sus valores. Ejecútelos desde la raíz del backend en una sesión controlada:

```powershell
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*([^#=]+?)\s*=\s*(.*)\s*$') {
    $key = $Matches[1].Trim()
    $value = $Matches[2].Trim().Trim('"').Trim("'")
    [Environment]::SetEnvironmentVariable($key, $value, 'Process')
  }
}
```

### Respaldo antes de una migración

1. Detén temporalmente las escrituras de la aplicación o acuerda una ventana de mantenimiento.
2. Crea un dump consistente de tablas y triggers. `--password` solicita la clave de forma interactiva y evita incluirla en el historial o en la lista de procesos.

```powershell
$backupDir = Join-Path $env:TEMP 'sterinova-db-backups'
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backupFile = Join-Path $backupDir "sterinova_$stamp.sql"
mariadb-dump --host="$env:DB_HOST" --port="$env:DB_PORT" --user="$env:DB_USERNAME" --password --single-transaction --routines --triggers --events --result-file="$backupFile" "$env:DB_DATABASE"
if ($LASTEXITCODE -ne 0) { throw 'Falló mariadb-dump; no continúe con la migración.' }
Get-FileHash -Algorithm SHA256 $backupFile
```

3. Protege el archivo según la clasificación de la información y cópialo al repositorio de respaldos aprobado. El directorio temporal local no sustituye la copia externa ni la política de retención.
4. Comprueba la lectura del archivo y registra su hash. Para probar la restauración, usa primero un esquema aislado, nunca el esquema de producción.

### Estado de migraciones y despliegue

Antes de aplicar cambios, inspecciona el estado del mismo entorno al que apunta la sesión:

```powershell
npm run migration:show
```

Revisa las migraciones pendientes y sus métodos `up()`; verifica si contienen cambios de datos, operaciones irreversibles o triggers. Si el destino y la ventana fueron aprobados, aplica las migraciones de forma explícita:

```powershell
npm run migration:run
npm run migration:show
```

La segunda consulta debe mostrar las migraciones aplicadas. No uses `npm run start:dev` como mecanismo de despliegue: ese script combina migración y arranque.

### Verificar consecutivos

Consulta las filas vigentes en la misma base y compara `ultimo_valor` con el consecutivo máximo emitido por cada prefijo antes de continuar operaciones regulatorias:

```powershell
mariadb --host="$env:DB_HOST" --port="$env:DB_PORT" --user="$env:DB_USERNAME" --password --database="$env:DB_DATABASE" --execute="SELECT * FROM secuencias_consecutivos ORDER BY nombre;"
```

La consulta solicitada, sin ordenar, es:

```sql
SELECT * FROM secuencias_consecutivos;
```

### Restauración desde un respaldo

1. Detén la aplicación y confirma el nombre exacto del destino. Conserva una copia del estado actual antes de reemplazar datos.
2. Restaura primero en un esquema aislado para validar que el dump puede leerse. Crea el esquema vacío y abre el cliente MariaDB:

```powershell
$restoreDatabase = 'sterinova_restore_check'
mariadb --host="$env:DB_HOST" --port="$env:DB_PORT" --user="$env:DB_USERNAME" --password --execute="CREATE DATABASE $restoreDatabase CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
mariadb --host="$env:DB_HOST" --port="$env:DB_PORT" --user="$env:DB_USERNAME" --password --database="$restoreDatabase"
```

En el prompt de MariaDB ejecuta `source` con la ruta completa al dump:

```sql
source C:/Users/usuario/AppData/Local/Temp/sterinova-db-backups/sterinova_YYYYMMDD_HHMMSS.sql;
SHOW TABLES;
SELECT * FROM secuencias_consecutivos;
```

3. Valida tablas, triggers, conteos y consecutivos en ese esquema. Si necesitas recuperar el entorno operativo, acuerda el destino y la pérdida de escrituras posteriores al respaldo; detén la aplicación y repite `source` en el esquema confirmado. No cambies ni elimines un esquema hasta verificar explícitamente su nombre.
4. Tras una restauración en el entorno operativo, ejecuta `npm run migration:show` y revisa los consecutivos antes de reabrir escrituras.

### Pruebas de integridad con MariaDB

La integración de consecutivos y triggers está en `src/certificados/certificados.concurrency.spec.ts`. Solo se ejecuta cuando `RUN_DB_INTEGRATION=1` y `DB_DATABASE` contiene el segmento `test`; exige que no existan certificados previos y elimina sus filas de prueba y restaura la secuencia original en `afterAll`.

Usa un esquema desechable dedicado. Consulta `migration:show` antes de aplicarle migraciones y nunca habilites `RUN_DB_INTEGRATION` contra una base de negocio.

### PDFs

El directorio local `storage/pdfs` (o `PDF_STORAGE_PATH`) debe incluirse en el procedimiento de respaldo si no usa almacenamiento externo persistente. El hash almacenado en la base no reemplaza una copia del archivo PDF.
