# Runbook: respaldos, restauración y migraciones

## Alcance y condiciones

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

## Respaldo antes de una migración

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

## Estado de migraciones y despliegue

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

## Verificar consecutivos

Consulta las filas vigentes en la misma base y compara `ultimo_valor` con el consecutivo máximo emitido por cada prefijo antes de continuar operaciones regulatorias:

```powershell
mariadb --host="$env:DB_HOST" --port="$env:DB_PORT" --user="$env:DB_USERNAME" --password --database="$env:DB_DATABASE" --execute="SELECT * FROM secuencias_consecutivos ORDER BY nombre;"
```

La consulta solicitada, sin ordenar, es:

```sql
SELECT * FROM secuencias_consecutivos;
```

## Restauración desde un respaldo

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

## Pruebas de integridad con MariaDB

La integración de consecutivos y triggers está en `src/certificados/certificados.concurrency.spec.ts`. Solo se ejecuta cuando `RUN_DB_INTEGRATION=1` y `DB_DATABASE` contiene el segmento `test`; exige que no existan certificados previos y elimina sus filas de prueba y restaura la secuencia original en `afterAll`.

Usa un esquema desechable dedicado. Consulta `migration:show` antes de aplicarle migraciones y nunca habilites `RUN_DB_INTEGRATION` contra una base de negocio.

## PDFs

El directorio local `storage/pdfs` (o `PDF_STORAGE_PATH`) debe incluirse en el procedimiento de respaldo si no usa almacenamiento externo persistente. El hash almacenado en la base no reemplaza una copia del archivo PDF.
