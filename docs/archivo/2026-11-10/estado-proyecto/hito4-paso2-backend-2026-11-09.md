> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Hito 4: Paso 2, Backend

Actualización: Paso 3 terminado. Ver [entrega final](hito4-paso3-frontend-2026-11-09.md).
El texto siguiente conserva el estado de revisión original del Paso 2.

Estado: terminado para revisión, sin commit ni push. Paso 3 pendiente; no se modificó el frontend.

## Migración local aprobada

Antes de modificar código del Paso 2 se respaldó `sterinova` local con mysqldump,
incluyendo triggers, rutinas y eventos. Se rechazó continuar si había consultas activas
de otros clientes y se mantuvo bloqueo de lectura durante la captura del respaldo y baseline.

- Respaldo: `storage/backups/sterinova-pre-hito4-2026-11-09T13-42-55-068Z.sql`.
- SHA-256: `fa33324806dd2735edc17183fbad6a77a01ab7f26ce159e240d72d9c55fd960a`.
- Manifiesto: mismo nombre con extensión adicional `.json`.
- Solo se aplicó `AddOperationalDocumentData1794225602000`: 17 migraciones, ninguna pendiente.
- Comparación de todas las columnas anteriores en 21 tablas: datos idénticos.
  Se excluyeron del comparador el historial de migraciones y las secuencias, que son
  precisamente estado actualizado por la migración.
- Evidencia: `storage/backups/hito4-local-migration-verification-2026-11-09.json`.
- El mismo respaldo se restauró después en MariaDB desechable; se aplicó la migración
  y se volvió a comprobar la conservación de todas las columnas previas.

## Material recibido

- `POST /logistica/ordenes` admite `materiales[]` y `metodo_esterilizacion`.
  Cabecera, materiales y consecutivo se guardan en una transacción.
- `PATCH /logistica/ordenes/:id/materiales` recibe `version`, `materiales[]` completo y
  opcionalmente método. Reemplaza el detalle de forma atómica y registra auditoría.
- El método se deriva de servicios `_ETO`/`_VAPOR` y se rechazan contradicciones.
- Se valida pertenencia de cada `cotizacion_item_id` a la cotización de la orden.
- Cantidades: enteros positivos; muestras: enteros no negativos. Cero y NULL se conservan.
- Una edición de solo materiales también incrementa la versión de cabecera; una versión
  obsoleta devuelve 409. Desde que existe un ciclo, los materiales no se editan.
- La creación puede dejar una orden pendiente sin materiales para completar la recepción;
  registrar un ciclo requiere al menos una fila de material recibido.
- Las consultas de órdenes incluyen el detalle operativo.

Ejemplo de edición:

```json
{
  "version": 1,
  "materiales": [{
    "descripcion": "MATERIAL MEDICO QX",
    "referencia": null,
    "lote": "LOTE-CLIENTE-123",
    "cantidad": 39,
    "empaque": "BOLSA PGM X 1 UND",
    "muestras_retencion": 0,
    "muestras_cliente": null,
    "muestras_laboratorio": null
  }]
}
```

## Ciclo y evaluación técnica

- `POST /planta/ciclos` exige `fecha_esterilizacion` civil `YYYY-MM-DD`, válida y no futura
  en America/Bogota. El método debe coincidir con la orden.
- Se selecciona una versión compatible del protocolo: la indicada en `protocolo_version_id`
  o la última versión del método. Su ID queda fijado en el ciclo.
- `GET /planta/protocolos` devuelve la última versión inmutable de cada método.
- Humedad, presión y aireación son obligatorias para EtO; presión puede ser negativa.
  Para Vapor, pueden omitirse; se guarda NULL. Se exige `tiempo_secado` independiente.
  Presión negativa en Vapor se rechaza. La validación de número finito y rango del protocolo
  se vuelve a comprobar antes de emitir.
- Calidad consulta los materiales y la versión de protocolo junto con el ciclo pendiente.
- `POST /calidad/aprobar` recibe, además de ciclo y contraseña, `evaluaciones[]` con
  `parametro`, `criterio` y `opcion` (índice desde cero de las alternativas del protocolo).
- Para emitir, cada fila aplicable debe tener evaluación explícita CUMPLE, una alternativa
  válida y un resultado real dentro de su rango. No se aceptan duplicados, parámetros ajenos
  ni evaluaciones incompletas. NO_CUMPLE no produce certificado.
- Las cinco filas del método inactivo quedan N/A; también las filas activas declaradas
  no aplicables por el protocolo (actualmente Humedad/Presión y aireación de Vapor).
- Se conservan las alternativas y unidades sembradas; aireación EtO sigue con unidad NULL,
  sin atribuir minutos a una unidad no explícita en el ejemplo.

Para EtO, las cinco evaluaciones son temperatura, humedad, presion, tiempo_exposicion,
tiempo_aireacion. Para Vapor son temperatura, tiempo_exposicion y tiempo_secado; las otras
dos filas se obtienen como no aplicables del protocolo. El índice seleccionado no se
infiere automáticamente del resultado.

## Certificado y vencimiento

La emisión congela un snapshot `schema_version: 2` con:

- `documento.fecha_esterilizacion` y `documento.fecha_vencimiento`.
- `materiales[]` operativos ordenados por posición; ya no se usan los ítems comerciales
  como sustitutos de lote, empaque o muestras.
- `informacion_tecnica`: versión de protocolo, especificaciones y tablas EtO/Vapor.
- `evaluaciones[]`: decisiones explícitas, evaluador y fecha.

Vencimiento = fecha de esterilización + tres años calendario. El 29/02/2024 vence
el 28/02/2027. Se calcula en servidor sin conversión de zona horaria y se guarda tanto
en columnas DATE como en el snapshot. No se modifican certificados históricos.

La validación pública también usa la fecha persistida o la evidencia de su snapshot;
si no existe evidencia histórica, devuelve NULL y no vuelve a calcular desde la emisión.
Una aprobación fallida revierte evaluaciones, contador y certificado.

## ICONTEC congelado

`SelloSnapshotService` resuelve un catálogo activo dentro de la transacción de emisión:

- Si existe `ICONTEC_SELLO_ID`, usa ese registro activo explícito.
- En ausencia de esa configuración, usa un registro activo cuyo `nombre_norma` contenga
  ICONTEC, con prioridad `orden ASC, id ASC`. No toma arbitrariamente otra certificación.
- Sin registro o imagen válida, devuelve 409; código de ausencia `SELLO_ICONTEC_NO_DISPONIBLE`.

Se calcula SHA-256 de los bytes PNG/JPEG, se copia el archivo sin sobrescritura a
`storage/sellos/versiones/<sha256>.<ext>` (o bajo `CERTIFICATION_SEALS_PATH`) y se crea/reutiliza
una versión inmutable bajo bloqueo del catálogo. Se conserva autor de la nueva versión.
Si cambia la imagen, norma o licencia, una emisión posterior crea otra versión.

La cotización guarda `sello_icontec_version_id` y su snapshot incluye `sellos.icontec`:
ID de sello, ID/número de versión, SHA-256, clave de archivo, MIME, norma, licencia e
`imagen_src`. Los bytes se conservan fuera del JSON, en el archivo inmutable.

Al generar/regenerar, se comprueban versión, referencia y hash de la imagen congelada.
No se sustituye por el sello vigente. Para nuevas versiones aún no confirmadas se usa
el mismo EntityManager transaccional, evitando consultas que no vean la versión recién creada.
La imagen se entrega a Chromium mediante una ruta interceptada de esa página:
`/internal/pdf-assets/sellos/<sha256>.<ext>`. No es un endpoint público ni depende de una
URL mutable; tampoco aumenta el token cifrado con varios MB de base64.

Restaurar documentos congelados requiere conservar también el directorio de versiones
de imágenes; el respaldo SQL por sí solo no contiene estos archivos.

## Frontera con el Paso 3

Los snapshots nuevos exigen que el elemento del PDF declare `data-pdf-schema-version="2"`.
El backend rechaza generar estos documentos con el renderizador anterior; el fallo revierte
la emisión. Así no se emiten datos nuevos usando el vencimiento o los materiales antiguos.
Los snapshots históricos conservan su contrato anterior.

El Paso 3 debe consumir los campos congelados, declarar el contrato 2, imprimir las dos
tablas técnicas, usar el IVA persistido en las notas, retirar ICONTEC/QR del certificado
y dejar el cuadro de estampado vacío. Ninguno de esos cambios visuales se adelantó aquí.

El catálogo local de sellos está vacío. No se creó una licencia ni una versión ficticia.
Antes de emitir cotizaciones reales habrá que cargar/configurar el sello autorizado.
Los ciclos históricos pendientes sin fecha/materiales/protocolo no se completan por inferencia;
su conciliación requiere evidencia antes de emitir.

## Pruebas y revisión

- Build aprobado.
- Suite general: 197 pruebas aprobadas, 2 omisiones preexistentes.
- MariaDB desechable: 18 pruebas HTTP con JWT/RBAC reales, incluidas las nuevas rutas,
  flujo completo EtO/Vapor, edición obsoleta, bloqueo por ciclo, rollback y sellos congelados.
- Suite Hito 4: 12 pruebas aprobadas (10 de migración/concurrencia, 1 de restauración del
  respaldo local nuevo y 1 de Chromium real con entrega de imagen congelada).
- Contrato OpenAPI: 1 prueba aprobada y documento actualizado.
- Lint sin errores; queda una advertencia preexistente del catch de generación PDF.
- `git diff --check` aprobado.

Las pruebas HTTP usan almacenamiento PDF simulado para aislar las reglas de negocio.
La prueba adicional de Chromium real valida generación, imagen y hash con una página de
contrato de pruebas; no es validación visual de los componentes React, reservada al Paso 3.

Se revisaron transacciones, pertenencia de ítems, versiones obsoletas, datos históricos,
integridad de archivos y compatibilidad del renderizador. Las pruebas detectaron y corrigieron
la falta de incremento de versión cuando solo cambiaban los materiales.

El servidor MariaDB desechable se apaga al cerrar esta entrega. No se hizo commit ni push.
