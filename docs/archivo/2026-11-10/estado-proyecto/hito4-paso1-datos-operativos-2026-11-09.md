> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Hito 4: Paso 1, datos operativos y consecutivos

Actualización: migración aprobada y aplicada localmente el 09/11/2026. Ver
[entrega del Paso 2](hito4-paso2-backend-2026-11-09.md) para respaldo y verificación.
El estado siguiente describe el punto de revisión original del Paso 1.

Estado: preparado para revisión; sin commit. No aplicar todavía en la base local.
Se preservaron los cambios previos de IVA y edición de borradores.

## Alcance

Migración `AddOperationalDocumentData1794225602000`, posterior a `AddQuoteEditVersion`:

- Nuevas entidades/tablas: `OrdenServicioMaterial`, `ProtocoloEsterilizacionVersion`,
  `CicloParametroEvaluacion`, `SelloCertificacionVersion`.
- Materiales: descripción, referencia, lote, empaque, cantidad y muestras enteras unsigned;
  FK a orden e ítem comercial opcional; posición única por orden y cantidad positiva.
  Cero muestras significa ninguna; NULL queda disponible para no aplica.
- Orden: método EtO/Vapor nullable y versión para futura edición con control de concurrencia.
- Ciclo: fecha civil de esterilización, tiempo de secado independiente y FK al protocolo.
  Humedad, presión y aireación admiten NULL para parámetros no aplicables.
- Certificado: fechas civiles de esterilización y vencimiento, protegidas contra cambios
  cuando ya está aprobado. Cotización: FK nullable a versión del sello, inmutable después
  de la emisión o fijación de su snapshot.
- Protocolos y versiones de sellos rechazan UPDATE/DELETE mediante triggers.
  No se inventaron hashes ni se crearon versiones de imágenes legadas.

Los datos históricos nuevos permanecen NULL: la migración no infiere fechas operativas,
materiales, aprobaciones ni versiones de sellos. No altera PDFs ni snapshots existentes.

## Protocolos de referencia

Se sembraron versiones 1 EtO/Vapor a partir del ejemplo R-AQ-09 V05:

- EtO: temperatura 50–60 / 34–40 / 17–23 °C; humedad 30–80 %;
  presión −10 a −4 inHg; exposición 180 / 360 / 720 min; aireación 9–20.
- Vapor: temperatura 134 ± 2 / 121 ± 2 °C; exposición 7–10 / 10–20 / 20–30 min;
  secado 10–20 / 21–40 min.
- La unidad de aireación EtO no está explícita: queda NULL y pendiente de Calidad.
  Humedad/Presión y aireación de Vapor quedan N/A, no aplicables, con unidad NULL.
- El JSON registra fuente, alternativas y pendientes. No selecciona automáticamente
  alternativas ni constituye aprobación técnica. El panel y la captura son pasos posteriores.

## Consecutivos

`siguienteConsecutivo` conserva crecimiento natural y limita el siguiente valor a 99999999.
Se utiliza en cotizaciones, certificados y órdenes. Agotamiento: HTTP 409, código
`CONSECUTIVO_AGOTADO`, antes de guardar el contador o generar el PDF.

Las órdenes usan secuencia anual `orden_servicio:AAAA`, año de America/Bogota, dentro
de la misma transacción que bloquea la cotización y crea la orden. La migración inicializa
cada año desde el máximo sufijo numérico, sin bajar un contador previo ni renumerar documentos.
Se conserva el formato OS histórico `OS-AAAA-0001` (mínimo cuatro dígitos); COT y certificados
mantienen mínimo tres. Un nuevo año se inicializa atómicamente.

La prueba de primeras solicitudes simultáneas detectó que `save()` podía intentar INSERT
desde una vista REPEATABLE READ anterior; el incremento OS usa UPDATE explícito después
del bloqueo. El rollback revierte contador y orden juntos.

## Verificación

- `npm run build`: aprobado.
- `npm test`: 178 aprobadas y 2 omisiones preexistentes.
- `npm run lint`: sin errores; dos advertencias preexistentes en certificados/PDF.
- `git diff --check`: aprobado.
- MariaDB desechable independiente, loopback puerto 33319; no se usó la base local.
- `test/hito4-operational.integration-spec.ts`: 10 pruebas aprobadas. Cadena previa y
  nueva migración; conservación de todos los campos anteriores de fixtures de cotizaciones,
  ítems, órdenes, ciclos y certificados; restricciones y triggers; valores NULL históricos;
  concurrencia OS normal y primer año, cotización duplicada, rollback y última asignación.
- `test/rbac-migration-chain.integration-spec.ts`: 2 pruebas aprobadas: cadena completa
  sobre base vacía y restauración del respaldo real con migraciones pendientes.
  Respaldo usado: `storage/backups/sterinova-pre-rbac-2026-11-09T12-11-43-682Z.sql`,
  validado contra el SHA-256 de su manifiesto por la prueba existente.

Comandos para repetir en un servidor expresamente desechable, nunca puerto 3306:

```powershell
$env:HITO4_DISPOSABLE_SERVER='1'
$env:HITO4_TEST_PORT='33319'
npx vitest run --config vitest.config.hito4.ts
```

Las pruebas crean bases con nombres aleatorios y eliminan únicamente sus propias bases.
El arnés no carga dotenv ni las credenciales DB_* de la aplicación.

## Aplicación y pausa

MariaDB confirma DDL implícitamente: aplicar requiere detener escrituras y respaldo
consistente, después de validar esta entrega. Si hay fallo parcial, inspeccionar el esquema
y preparar recuperación explícita; no reejecutar a ciegas. `down()` rechaza eliminar historia.

No se ejecutó `migration:run` sobre la base local. No hay commit ni push.
El código nuevo requiere el esquema migrado antes de arrancar contra una base existente.
No se iniciaron los pasos 2 y 3: formularios, DTO condicional, cálculo de vencimiento,
evaluación técnica, captura de materiales, congelación de archivos y renderizadores siguen pendientes.
Las entidades y restricciones preparan estos pasos; no los implementan por sí solas.
