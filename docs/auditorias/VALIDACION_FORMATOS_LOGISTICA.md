# Validación de formatos de Logística

**Fecha de revisión:** 11 de noviembre de 2026  
**Alcance:** comparación de `LOGISTICA.xlsm`, `Orden de Servicio.pdf`,
`Acta de Servicio.pdf` y los modelos/servicios actuales.  
**Modo:** inspección de solo lectura. No se ejecutaron macros, no se modificó
el libro y no se importaron registros.

## Evidencia y método

- Los dos PDF se abrieron página por página en el visor del navegador. Se
  inspeccionaron los encabezados, las tablas y las secciones inferiores de
  cada página. Ambos ejemplos contienen una página escaneada.
- El XLSM se leyó como contenedor OOXML y se decodificó estáticamente su
  proyecto VBA para inspeccionar nombres de procedimientos y operaciones. No
  se abrió en Excel ni se invocó código VBA.
- La revisión del libro se limitó a estructura, encabezados, fórmulas, rangos,
  nombres de hojas y conteos de claves. No se copiaron datos personales del
  historial a este informe.
- Huella SHA-256 observada: `ef8ee47ce136cc784d9394290e2cde3df2009cc9f656fe83597d7eb7a2370327`.

## Estructura observada en el XLSM

| Hoja | Estado | Estructura / función observable |
|---|---|---|
| `DATOS DE ENTRADA.` | Visible | Formulario de captura; el procedimiento `NREGISTRO` limpia grupos de celdas de entrada. |
| `ITEMS DETALLADOS` | Oculta | Hoja auxiliar de captura/detalle; no se debe tratar como fuente histórica canónica sin confirmar sus macros. |
| `INFORMACION ENTRADA` | Visible | Historial resumen con documento, cliente, tipo de servicio, descripción del proceso, recepción, responsables, cajas, estado y observaciones. |
| `INFORMACION DETALLADA` | Visible | Historial horizontal con hasta 15 líneas de producto. Cada grupo almacena artículo, lote, cantidad y número de cajas. |
| `ACTA DE SERVICIO` | Visible | Plantilla imprimible; 71 fórmulas `VLOOKUP` con búsqueda exacta por la clave seleccionada en `Q3`: 11 recuperan datos del resumen y 60 recuperan 15 grupos de cuatro datos del detalle. Los errores se convierten en texto vacío con `IFERROR`. |

El historial se guarda como valores: las hojas resumen y detalle no contienen
fórmulas de celda. La plantilla del acta consulta las tablas. La hoja
`INFORMACION DETALLADA` reserva 15 productos por registro, mientras que la
logística del backend ya permite materiales sin un tope fijo.

### VBA revisado estáticamente

El archivo contiene un proyecto VBA de 105,472 bytes, siete módulos estándar
(`Módulo1` a `Módulo7`) y módulos asociados al libro/hojas. Se observaron:

- `NREGISTRO`: limpia rangos del formulario para iniciar una captura.
- `agregar1`, `agregar2` y `agregar3`: insertan filas, pegan valores desde el
  formulario en las hojas resumen/detalle y ordenan las tablas. Usan posiciones
  de fila explícitas (entre ellas 5,002, 5,020, 5,028 y 5,051), no una
  conciliación por una clave calculada en el backend.
- `Actaserv`: copia la selección `Q3:R4` a una hoja usada por el libro.

No se ejecutaron estas acciones. Las distintas filas destino, la limpieza de
campos y la existencia de referencias fijas son riesgos que deben tenerse en
cuenta antes de automatizar una migración o replicar esas macros. En los
módulos estáticos revisados no se observaron llamadas evidentes a `Shell`,
creación de objetos externos ni APIs de red; esto no sustituye una auditoría
de seguridad del binario VBA.

## Matriz — Orden de Servicio

El formato escaneado muestra el logotipo Sterinova, los distintivos de
certificación, el título **ORDEN DE SERVICIO DE ESTERILIZACIÓN** y el control
documental **R-ES-02, versión 03, 15/10/2024**.

| Apartado / campo original | Fuente en XLSM | Fuente en Sterinova | Implementación digital observada | Diferencia / corrección requerida |
|---|---|---|---|---|
| Logotipo, distintivos y título | No proviene del historial | Activos institucionales del frontend | Logo, distintivos y título se renderizan; jerarquía y columnas conservan la estructura del original | Verificados visualmente en PDF. La fuente original es escaneada y no se exige coincidencia píxel a píxel. |
| Código, versión y fecha | Formato impreso; no es dato de una orden | Metadato de formato | La plantilla fija `R-ES-02 / 03 / 15-10-2024` | Conservado; cualquier nueva versión requiere el flujo institucional de versionamiento. |
| Cliente | La hoja de acta contiene `CLIENTE`, pero el libro no muestra una hoja independiente de Orden | `OrdenServicio.cotizacion.cliente` | El snapshot incluye razón social, dirección, NIT, teléfono y email | Opcionales nulos se muestran vacíos; fidelidad visual pendiente. |
| Método (gas/ETO o vapor) | El libro registra tipo de servicio para el acta | `OrdenServicio.metodo_esterilizacion`; `Cotizacion.tipo_servicio` | El snapshot incluye el método | ETO debe presentarse como GAS solo donde el formato lo rotula así; confirmar que no se conviertan servicios no esterilizantes en esterilización. |
| Número de orden | No se identificó un historial de órdenes separado; el libro indexa actas/documentos | `OrdenServicio.consecutivo` | La ruta digital usa el consecutivo de la orden | Conservar el número OS sin confundirlo con el consecutivo histórico de un acta. |
| Servicio con empaque / esterilización / transporte; volumen | No se identificó una fuente inequívoca en el historial consultado | `metodo_esterilizacion` evidencia método, no empaque/transporte | Esterilización se marca si hay método; empaque, transporte y volumen quedan vacíos | Pendiente origen/regla explícita para los campos sin fuente. |
| Datos de cliente nuevo | No son campos propios de la captura del acta | `Cliente.direccion`, `nit`, `telefono`, `email` | Disponibles mediante la relación de cliente | Mostrar solo lo almacenado; mantener vacíos los opcionales ausentes. |
| Material, cantidad | En las hojas de entrada/detalle el acta registra producto, cantidad y cajas | `OrdenServicioMaterial.descripcion`, `cantidad` | La fila de material está conectada al snapshot de la orden | La cantidad del sistema corresponde al material registrado; no equivale automáticamente a cantidades verificadas de recepción y entrega. |
| Verificado — recepción / entrega | El detalle XLSM tiene cantidad y cajas, no dos cantidades verificadas por etapa | No existen columnas de cantidad verificada en `OrdenServicioMaterial` | El formato deja esas celdas vacías | No duplicar `cantidad` en recepción y entrega; mantener en blanco hasta existir evidencia por etapa. |
| Valor unitario / valor total por material | No se identificó precio por material en las hojas históricas del acta | `CotizacionItem.valor_unitario`; total se calcula con cantidad de la OS | Snapshot vincula por `cotizacion_item_id`; materiales manuales sin vínculo quedan sin valor | Disponible para líneas enlazadas; el valor de líneas manuales sigue vacío. |
| Subtotal / transporte / IVA / total | El XLSM del acta contiene espacios de totales; no es una fuente de importes de orden confirmada | `Cotizacion.subtotal`, `iva`, `total`; transporte sin campo monetario | La Orden imprime los importes de la cotización; transporte queda vacío | No representa un cobro final de Acta; no se copia al Acta ni se inventa el transporte. |
| Observaciones | El acta tiene observaciones de recepción y del cliente | Solo `OrdenServicio.observaciones` | El snapshot reutiliza una sola observación | La Orden solo tiene un campo; no presentarlo como observaciones separadas sin una regla de negocio. |
| Recepción de material, fecha/hora, entregado por, recibido por y firmas | El libro registra fecha/hora y personas para la recepción del acta | No hay fecha/hora real ni responsables de recepción en `OrdenServicio` | Los apartados y firmas se conservan; campos operativos vacíos | No copiar `fecha_programada` como fecha real; faltan fuentes de captura. |
| Pie institucional | No proviene del XLSM | Texto institucional fijo de plantilla | Se incluye en el pie y queda separado del contenido imprimible | Verificado visualmente; se amplió el margen inferior para evitar contacto con las filas. |

## Matriz — Acta de Servicio

El escaneo muestra el logotipo, el título **ACTA DE SERVICIO** y
**R-LG-04, versión 03, 18/11/2024**. Su estructura es distinta a la Orden:
incluye datos de recepción/entrega, cajas, validación y cierre del servicio.

| Apartado / campo original | Fuente en XLSM | Fuente en Sterinova | Implementación digital observada | Diferencia / corrección requerida |
|---|---|---|---|---|
| Logo, título, código, versión y fecha | Metadatos de la plantilla del libro | Metadato de formato | Logo, título, `R-LG-04 / 03 / 18-11-2024` visibles en el encabezado | Verificado visualmente. El original escaneado y el digital conservan identidad y jerarquía, no una réplica píxel a píxel. |
| Número/clave del acta | Clave de acta/documento en `INFORMACION ENTRADA` y selector `Q3` | No existe entidad/consecutivo de Acta; `OrdenServicio.consecutivo` es una OS | Se conserva el rótulo `No.` con el espacio vacío | `Q3` es clave de búsqueda histórica; no presentarla como consecutivo nuevo. Definir origen/consecutivo institucional. |
| Cliente y tipo de servicio | `INFORMACION ENTRADA`: cliente y tipo | `OrdenServicio.cotizacion.cliente`; `Cotizacion.tipo_servicio` | Snapshot obtiene cliente y tipo desde las relaciones existentes | Tipo de cotización se muestra en forma legible; equivalencia institucional pendiente para casos no esterilizantes. |
| Descripción del servicio/proceso | `INFORMACION ENTRADA`: descripción del proceso | No hay campo específico de proceso ejecutado en Orden; la descripción de cotización no prueba ejecución | El snapshot actual no tiene descripción de proceso | No sustituir “proceso realizado” por texto de cotización ni por una etiqueta genérica; falta evidencia operativa. |
| Aplicación de esterilización, empaque y transporte | Campos de servicio del formulario/acta; algunos se recuperan desde columnas H/I del resumen | El método permite evidenciar método, no empaque/transporte | La plantilla local solo conoce método | Esterilización puede corresponder al método; empaque/transporte requieren campos o regla de origen. Dejar lo desconocido sin seleccionar. |
| Recepción: fecha, hora y personas | `INFORMACION ENTRADA`: fecha/hora de recepción, persona que recibe del cliente y persona que recibe en Sterinova | No hay esos campos en `OrdenServicio` | Fecha, hora y personas quedan vacías | La fecha programada no se reutiliza como fecha efectiva; falta captura operativa. |
| Producto, lote, cantidad recibida y cajas recibidas | `INFORMACION DETALLADA`: hasta 15 grupos Item/Lote/Cantidad/# cajas; resumen también contiene total de cajas | `OrdenServicioMaterial.descripcion`, `lote`, `cantidad`; no hay cajas | La plantilla conecta descripciones/lotes/cantidades; sin cajas | Mapear `cantidad` una sola vez; cajas recibidas no tienen equivalente y deben quedar vacías. Backend no debe heredar el límite histórico de 15. |
| Cantidad/cajas entregadas y V.B. | No hay campos equivalentes en los grupos históricos (solo Item/Lote/Cantidad/# cajas) | No existen campos en `OrdenServicioMaterial` | Vacío | Pendiente de evidencia de salida/validación; no copiar valores de recepción a entrega. |
| Valores por línea y totales | No se encontraron importes como columnas de las tablas históricas del acta | `CotizacionItem` y `Cotizacion` guardan valores comerciales, no necesariamente cobro final del acta | Los campos del Acta quedan vacíos; los importes de cotización se limitan a la Orden | Definir origen y semántica del valor final del Acta antes de poblarlos. |
| Transporte, personas y cajas totales | La hoja resumen registra responsables/cajas recibidas; no identifica un valor de transporte por separado en la estructura observada | Sin campos específicos en Orden | Celdas disponibles pero sin fuente | Completar solo recepción si se agrega origen explícito; transporte monetario, cajas entregadas y persona de entrega siguen faltando. |
| Observaciones recepción / observaciones cliente | `INFORMACION ENTRADA` tiene un campo de observaciones; el PDF presenta dos bloques separados | Solo existe `OrdenServicio.observaciones` | Ambos bloques quedan vacíos | No duplicar ni clasificar `OrdenServicio.observaciones` sin confirmar su significado. |
| Entrega de producto estéril: fecha/hora, certificado, factura | No hay evidencia de estos campos en los encabezados de las tablas históricas revisadas | Podría requerir ciclo/certificado/factura relacionados; no se cargan en el flujo actual de logística | Vacío | Conectar entidades solo tras definir si el certificado del ciclo y la factura comercial son los datos institucionalmente requeridos. |

## Diferencias y riesgos de conciliación

1. **Rangos Excel incompletos:** la hoja resumen tiene 1,617 filas con clave; 37
   quedan fuera del autofiltro y 2 fuera del rango `VLOOKUP` del acta
   (`A5:R2460`). La hoja detalle tiene 3,651 filas con clave; 24 quedan fuera
   del autofiltro, aunque caben en el rango de búsqueda (`A5:BM4776`).
2. **Claves no conciliadas:** en comparación exacta de la primera columna, se
   observaron 1,600 claves únicas resumen y 3,610 detalle; 1,598 coinciden, 2
   solo existen en resumen y 2,012 solo en detalle. También aparecen claves
   repetidas (17 en resumen y 40 en detalle) y 15 filas resumen con contenido
   pero clave vacía. Estas cifras son diagnósticos estructurales, no una regla
   para eliminar o fusionar datos.
3. **Formulario con límite histórico:** la plantilla de acta tiene 15 líneas
   de producto; la aplicación debe conservar su capacidad dinámica.
4. **Datos de operación ausentes:** el sistema no tiene una entidad de Acta ni
   varios campos de recepción, entrega, cajas, proceso ejecutado y referencias
   a factura/certificado. No deben rellenarse por aproximación.
5. **Documento no versionado como emisión:** la orden no almacena `pdf_url`,
   hash o versión de formato y no hay consulta de emisiones históricas de
   logística.
6. **Autorización previa insuficiente:** la ruta heredaba roles globales aunque
   el modelo de Orden y el catálogo RBAC ya contienen ámbitos y permisos de
   Logística.
7. **Validación del tipo de documento:** el query param no se validaba en
   tiempo de ejecución; valores distintos de `orden`/`acta` podían caer al tipo
   Orden.
8. **Vista previa frontend:** `window.open` directo no enviaba el bearer token
   adjuntado por el cliente HTTP del frontend.

## Correcciones realizadas y estado

La inspección del XLSM fue de solo lectura. **No se modificó el libro, no se
ejecutaron macros y no se importó historial.** Después del análisis se
implementaron estos cambios:

- La plantilla del Acta usa `R-LG-04`; la Orden conserva `R-ES-02` y ambos
  mantienen la versión y fecha impresas en sus originales.
- La fecha programada ya no se imprime como fecha real de recepción.
- El snapshot de la Orden obtiene cliente, servicio, cotización e importes
  desde sus relaciones existentes. Los valores comerciales solo se imprimen
  en la Orden; no se presume que sean el valor final del Acta.
- Los campos de recepción, entrega, cajas, proceso y observaciones del Acta
  quedan vacíos cuando no existe una fuente comprobable. No se presentan
  placeholders como datos del proceso.
- El espacio para el número independiente del Acta queda rotulado y vacío;
  no se reutiliza el consecutivo de la Orden.
- El pie se mantiene dentro del área de margen; el margen inferior de impresión
  se amplió a 24 mm para separar el pie de las tablas en documentos extensos.
- El bloque de cierre ya permite que una observación larga continúe sin perder
  las tablas de recepción y firmas; totales, secciones y firmas se mantienen
  juntos cuando caben. Los lotes extensos del Acta se ajustan dentro de su
  columna.
- La generación logística en línea ya no envía el snapshot completo como
  encabezado de render a las solicitudes de logos. Cotizaciones y certificados
  conservan el token de render que requiere su ruta interna.
- El PDF logístico se renderiza en memoria para previsualizar/descargar y no
  sobrescribe una ruta de almacenamiento estable. El generador compartido
  conserva `generate()` con almacenamiento para los otros flujos.
- El query `tipo` se valida en runtime; IDs usan `ParseIntPipe`; respuestas
  llevan `Cache-Control: private, no-store`.
- El PDF requiere el permiso RBAC existente `logistica.ordenes.ver` y verifica
  el ámbito del registro; órdenes antiguas sin ámbito propio usan el ámbito de
  su cotización enlazada. Si ambos ámbitos existen y difieren, se deniega el
  acceso sin revelar si el registro existe.
- La creación de nuevas órdenes copia el ámbito y creador de la cotización.
- La previsualización frontend ahora obtiene el blob mediante Axios y muestra
  un visor modal autenticado; la descarga también usa Axios.

La ausencia de un registro/entidad de emisión permanece pendiente: la descarga
produce un PDF temporal y no crea un documento histórico auditable.
Las órdenes antiguas sin ámbito en la orden y sin ámbito en la cotización
enlazada quedan denegadas por diseño (fail-closed); requieren una asignación
explícita antes de habilitar sus PDFs. El rol heredado `ADMIN` por sí solo no
sustituye el permiso y ámbito RBAC requeridos por esta ruta.

## Evidencia visual y pruebas

- **PDFs originales y generados:** se visualizaron ambos originales escaneados
  y los ocho PDFs de prueba producidos por `PdfGeneratorService.render()` en
  Chromium local. Los ocho usaron únicamente datos ficticios. El logo y, para
  la Orden, los distintivos cargaron correctamente; se revisaron títulos,
  códigos/versiones/fechas, etiquetas, columnas, valores, observaciones,
  paginación, cierre y pie.
- **Orden:** 1, 10 y 20 materiales quedaron en una página; 30 materiales con
  descripción y observación extensas ocuparon dos páginas. Las 30 filas y los
  valores/totales se conservaron; el bloque de observaciones, recepción y
  firmas quedó junto en la segunda página. La tabla no necesitó continuar en
  ese caso.
- **Acta:** 1, 10 y 20 materiales quedaron en una página; 30 materiales
  ocuparon dos páginas. Se usaron descripciones extensas y se verificó la
  repetición del encabezado de columnas al continuar la tabla. Los campos de
  observación del Acta se mantuvieron vacíos porque no hay una fuente válida
  en el modelo; por tanto, no se simuló texto de observación para ese formato.
- **Pie y saltos:** las páginas no terminan en una hoja adicional vacía; el
  pie queda visible y separado del contenido tras ampliar el margen inferior.
  La distribución dinámica puede dejar espacio en blanco cuando el cierre se
  mueve íntegro a la página siguiente.
- **Límite visual:** la comparación confirma identidad institucional y
  estructura, no equivalencia píxel a píxel frente a escaneos. No se guardaron
  capturas de pantalla en el repositorio.
- **XLSM:** lectura estructural, fórmulas y VBA estático completados. Hash
  observado sin escribir el libro; no se usó Excel/LibreOffice para abrirlo ni
  ejecutar código.
- **Salida estructural:** las pruebas construyen el HTML de ambos formatos con
  1, 15, 50 y 101 materiales, descripciones/observaciones extensas, importes y
  opcionales nulos. Además, se generaron PDFs reales de ambos formatos con
  1, 10, 20 y 30 materiales, descripciones y observaciones extensas, valores y
  campos opcionales vacíos.
- **Estrés PDF adicional:** después de los cambios se generaron nuevamente con
  `PdfGeneratorService` ocho PDFs ficticios de 1, 15, 50 y 101 materiales. En
  el visor local se observaron: 1 material en una página; 15 materiales en
  dos páginas; 50 materiales en dos páginas para la Orden y tres para el Acta;
  101 materiales en cuatro páginas para la Orden y seis para el Acta. Se
  comprobaron encabezados repetidos de tabla, continuidad de filas, importes
  coherentes en las fixtures, acentos/ñ, lote de 90 caracteres, campos nulos,
  observación extensa y cierre. La última página del Acta conserva las filas
  97–101, totales y secciones finales; la última de la Orden conserva totales,
  observaciones, recepción y firmas.
- **Hallazgos corregidos durante la prueba real:** 50+ filas hacían que el
  encabezado firmado del snapshot excediera el límite del servidor local de
  imágenes (431), aunque Logística renderiza HTML en memoria. Ese encabezado
  solo se usa ahora para las rutas internas de Cotizaciones/Certificados. La
  observación extensa también podía empujar el cierre fuera de página; se
  permite el flujo del cierre y se preservan juntos sus bloques finales.
  Finalmente, el lote largo del Acta ahora se envuelve dentro de su columna.
- **Integridad de importes pendiente:** el detalle de la Orden calcula cada
  línea como precio unitario cotizado × cantidad operativa, mientras subtotal,
  IVA y total se leen de la cotización. Una fixture incoherente con 10 ítems,
  precio unitario de 10.000 y cantidades operativas de 1 a 10 muestra líneas
  por 550.000 frente al subtotal cotizado de 100.000. Esto demuestra una
  diferencia entre cantidades de distinta fuente, no un fallo del renderer.
  No se cambió la regla comercial; falta decidir si la emisión debe bloquear
  el caso, ocultar los importes por línea o mostrar explícitamente ambos
  conceptos. Las fixtures de estrés ahora concilian sus cantidades y totales.
- **Backend:** `npm.cmd test -- src/pdf/pdf-generator.service.spec.ts
  src/logistica/logistica.service.spec.ts src/logistica/logistica.controller.spec.ts
  src/logistica/logistica-sequence.spec.ts` — 17 pruebas pasaron.
  `npm.cmd run build` — pasó. Se probaron tipo inválido, permiso contextual,
  ámbito autorizado/no autorizado, conflicto de ámbitos y que el endpoint usa
  render en memoria.
- **Cierre backend sin base de datos:** `npm.cmd run build` y
  `npm.cmd run lint` pasaron. Suite focalizada de Logística, cotizaciones, PDF,
  auth/RBAC, reset y migraciones — 25 archivos, 209 pruebas pasaron, 0 fallaron.
  Los tests son unitarios/simulados; no prueban asignaciones ni migraciones
  contra MariaDB.
- **Lint backend:** `npx.cmd oxlint src/pdf/pdf-generator.service.ts
  src/pdf/pdf-generator.service.spec.ts src/logistica/logistica.service.ts
  src/logistica/logistica.controller.ts src/logistica/logistica.service.spec.ts
  src/logistica/logistica.controller.spec.ts` — pasó.
- **Frontend:** `npx.cmd tsc --noEmit` y
  `npx.cmd eslint 'src/app/(erp)/logistica/page.tsx'` — pasaron desde la raíz
  real del frontend. Las acciones de preview/descarga usan el cliente Axios
  autenticado. La verificación de TypeScript del backend completo no se usa
  como resultado frontend.

## Resultado y siguientes decisiones

- La identidad y estructura visual de ambos formatos está verificada en PDFs
  reales, incluidos los casos de paginación dinámica indicados. La fidelidad
  institucional se considera aceptable para esta plantilla digital, sin
  afirmar coincidencia píxel a píxel.
- La salida visual no resuelve los campos operativos que carecen de fuente ni
  valida una generación vinculada a órdenes de una base real; esa integración
  extremo a extremo no se ejecutó porque se excluyeron las bases de datos.
- La correspondencia de los campos faltantes del Acta (fecha/hora real,
  responsables, cajas entregadas, proceso ejecutado, V.B., transporte,
  certificado/factura y separación de observaciones) requiere definir el origen
  y el momento de captura antes de añadir columnas o migraciones.
- La emisión de un consecutivo propio de Acta y el significado de los importes
  del Acta frente a los valores de cotización requieren confirmación
  institucional.
- La importación histórica queda expresamente fuera de este trabajo; el
  diagnóstico de claves prueba que no es seguro importar por correspondencia
  automática sin revisión y conciliación explícitas.
- Los PDFs de estrés adicionales se conservaron fuera del repositorio, en el
  directorio privado de artefactos de la sesión; no se modificaron los
  originales institucionales.
- No se avanzó a la Fase 3.
- Estado: **FASE 2 PENDIENTE** hasta que se decidan y modelen las fuentes de
  recepción, proceso, responsables, cantidades/cajas de entrega, observaciones
  separadas, firmas, numeración independiente del Acta e historial auditable
  de emisiones, y se verifique el flujo con órdenes autorizadas sin usar datos
  de producción.
