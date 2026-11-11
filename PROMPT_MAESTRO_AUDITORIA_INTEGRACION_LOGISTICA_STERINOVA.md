# PROMPT MAESTRO — Auditoría e integración del módulo de Logística y documentación de servicio de Sterinova

> **Uso:** entregar este archivo a un agente de desarrollo que tenga acceso local al repositorio del sistema Sterinova.  
> **Modalidad inicial obligatoria:** **SOLO LECTURA / ANÁLISIS / PLANIFICACIÓN**. No implementar, modificar, migrar ni instalar dependencias antes de terminar el diagnóstico y recibir autorización explícita.  
> **Ruta de referencia del backend:** `C:\Users\urria\Sterinova-Backend`  
> **Carpeta de ejemplos documentales:** `C:\Users\urria\Sterinova-Backend\docs\ejemplos-formatos`  
> **Objetivo:** integrar en el **sistema existente** la operación digital de Logística, con generación de órdenes y actas de servicio mediante plantillas dinámicas, fieles a los formatos institucionales y con versionamiento controlado.

---

## 0. Rol, misión y reglas de operación del agente

Actúa como **arquitecto de software, analista funcional de logística/esterilización, especialista en documentos institucionales, auditor de código y diseñador de bases de datos**. El trabajo consiste en investigar **lo que ya existe** y proponer una integración compatible y mantenible.

### Reglas inviolables

1. **No crees otro sistema.** El objetivo es un módulo dentro del ecosistema Sterinova existente.
2. **No supongas el stack.** Detecta las tecnologías, versiones, estilo arquitectónico, convenciones, dependencias y patrones reales. NestJS, Nuxt, MySQL u otras tecnologías son posibilidades, no hechos verificados.
3. **No cambies el formato institucional por gusto.** Conserva logo, encabezados, códigos, rótulos, tablas, apartados, subtotales, observaciones, campos de entrega, firmas y pies según cada PDF; solo admite adaptaciones técnicas para datos variables, saltos de página y versiones futuras autorizadas.
4. **Los PDF adjuntos son ejemplos escaneados y diligenciados, no necesariamente plantillas maestras en blanco.** No trates los datos manuscritos o el contenido de ejemplo como valores fijos del sistema.
5. **No reemplaces evidencias por inferencias.** Diferencia siempre `[OBSERVADO]`, `[INFERIDO]`, `[PROPUESTO]`, `[PENDIENTE DE VALIDAR]`.
6. **No alteres información histórica.** Prohíbe silenciosamente reescribir actas emitidas, consecutivos, firmas, importes y versiones anteriores.
7. **No ejecutes macros de archivos heredados.** Si existen `.xlsm`, inspecciónalos de forma estática y segura; no actives macros ni contenido externo.
8. **No hagas cambios en la primera fase.** No commits, migraciones, seeds, `npm install`, refactors, cambios de esquema, archivos generados, limpieza ni renombrados.
9. **No imprimas datos sensibles innecesarios.** No expongas secretos `.env`, credenciales, datos personales completos ni documentación confidencial en el informe.
10. **Registra hallazgos verificables:** siempre que sea posible, `ruta:línea`, nombre de método, entidad, endpoint, tabla, prueba o captura del PDF con página/región.
11. **No afirmes conformidad sanitaria, legal, tributaria o de firma electrónica sin evaluación de requisitos reales.** El sistema debe permitir auditoría y trazabilidad, pero las normas específicas quedan por validar.
12. **No introduzcas nuevas dependencias si una solución existente cubre la necesidad.** Todo cambio tecnológico se justifica con una alternativa y sus trade-offs.

### Estrategia de eficiencia de tokens y uso de skills

- **Inventario antes de leer en profundidad:** usa listados limitados, nombres de archivos, manifiestos y búsquedas dirigidas. No vuelques árboles completos ni archivos enormes al contexto.
- **Ignora** `node_modules`, `.git`, `dist`, `.output`, `.nuxt`, `coverage`, logs, binarios y artefactos generados salvo que exista una razón precisa.
- **Empieza por** README, `docs/`, manifiestos del proyecto, rutas principales, módulos de logística, servicios, entidades, migraciones, controladores, repositorios y pruebas.
- **Usa búsquedas focalizadas** por términos `logistica`, `logística`, `orden`, `acta`, `servicio`, `esterilizacion`, `esterilización`, `recepcion`, `recepción`, `entrega`, `cliente`, `lote`, `pdf`, `plantilla`, `formato`, `version`, `versionamiento`, `consecutivo`, `firma`, `archivo`, `auditoria`; incluye variantes inglés si el repositorio las utiliza.
- Lee **fragmentos relevantes** alrededor de coincidencias; abre archivos enteros solo cuando haga falta para comprender el flujo.
- Reutiliza resúmenes de evidencias; **no vuelvas a explorar el mismo módulo** a menos que una pregunta nueva lo justifique.
- Si hay **skills disponibles** de repositorio/arquitectura, PDF/visión, SQL/ORM, seguridad, pruebas y frontend, **lee solo la skill pertinente en el momento que sea necesaria**. No hagas una lectura masiva de todas las skills instaladas.
- Usa el **análisis visual/renderizado de los PDF** al examinar tablas, márgenes, firmas y paginación. Evita OCR repetido sobre escaneos; recurre a OCR puntual solo si una etiqueta no es legible visualmente y marca su incertidumbre.
- No escanees todos los registros del Excel solo para entender su esquema. Inspecciona estructura, encabezados, tipos, fórmulas y **muestras pequeñas**. Haz análisis de la base completa únicamente si es necesario para evaluar calidad/migración.
- No navegues por internet para responder preguntas que deben resolverse leyendo el repositorio y los formatos locales. Investiga documentación externa solamente ante una incompatibilidad concreta y explica para qué.
- No desarrolles una interfaz ficticia ni un PDF demostrativo antes de entender modelos, flujo real y restricciones.
- Mantén un **registro conciso de decisiones y cuestiones abiertas** para no repetir análisis entre sesiones.
- Si el repositorio es grande, detén la exploración cuando tengas evidencia suficiente para responder cada dimensión; documenta incertidumbres pendientes en lugar de agotar el presupuesto.
- **Orden sugerido:** descubrimiento mínimo → lectura del área → inspección documental → mapa de brechas → arquitectura propuesta → pruebas/plan → informe. No escribas código durante esta etapa.

---

## 1. Contexto y resultado buscado

Hoy existe un flujo apoyado en un Excel de Logística y en documentos de Orden y Acta de Servicio. Se desea **eliminar la necesidad operativa de llenar Excel y ejecutar macros**, sustituyéndola por formularios y procesos integrados a un sistema que ya está avanzado.

### Resultado esperado del módulo

- Registrar y consultar **órdenes de servicio** desde la aplicación.
- Gestionar recepción de materiales/productos, cantidades, lotes, servicios solicitados, procesos, verificaciones, novedades y entrega según el procedimiento real.
- Generar **Orden de Servicio de Esterilización** en PDF con apariencia institucional equivalente al documento de referencia.
- Generar **Acta de Servicio** en PDF con apariencia institucional equivalente al documento de referencia.
- Reutilizar información ya capturada: **evitar doble digitación** de cliente, materiales, valores, cantidades y responsables, sin confundir campos de recepción con campos de entrega o resultado del proceso.
- Permitir **cualquier cantidad razonable de renglones** por documento: los datos no dependen del número fijo de filas impresas en el original.
- Distribuir contenido en varias páginas cuando sea necesario sin alterar las secciones oficiales ni perder datos.
- Conservar **versiones institucionales** y la copia original de cada documento emitido.
- Integrar roles, autenticación, permisos, auditoría y almacenamiento ya existentes.
- Gestionar errores, validaciones, anulaciones/correcciones, permisos, estados e historiales.
- Considerar importación histórica desde el Excel solo después de revisar calidad y correspondencia de datos.

**Prioridad funcional:** fidelidad al formato + trazabilidad + facilidad de operación + integridad de datos + reutilización del sistema existente.

---

## 2. Archivos que debes descubrir e inspeccionar

### 2.1 PDF institucionales

Buscar primero en:

`C:\Users\urria\Sterinova-Backend\docs\ejemplos-formatos`

Ejemplos previstos:

- `Orden de Servicio.pdf`
- `Acta de Servicio.pdf`

Los nombres podrían variar. **Enumera los archivos reales** y usa sus rutas exactas. No presupongas que son formularios vacíos o que contienen texto extraíble.

### 2.2 Archivo heredado de Logística

En el análisis anterior se mencionaron copias `LOGISTICA.xlsx` y `LOGISTICA.xlsm` / `LOGISTICA(1).xlsm`. **Comprueba si se encuentran en el repositorio o en la carpeta de ejemplos**. Si no existen, registra el faltante y **no inventes** el código de macros ni su comportamiento. Pide la ubicación exacta si su inspección resulta indispensable.

El Excel sirve como **fuente histórica y de reglas a verificar**, no como especificación de arquitectura que deba copiarse literalmente.

### 2.3 Aplicación existente

Descubre:

- Raíz del backend, README, documentación y convenciones.
- Raíz/ruta del frontend o frontends relacionados, si los hay. Si no está visible, marca `[PENDIENTE DE VALIDAR]`, no lo inventes.
- Módulos existentes de operaciones, recepción, órdenes, esterilización, producción, logística, inventario, facturación, clientes, catálogo, entrega, documentos y auditoría.
- Tablas y relaciones ya presentes (sin extraer credenciales ni cambiar datos).
- Servicios compartidos: PDF, almacenamiento de archivos, colas, numeración, plantillas, permisos, bitácora, validación, excepciones.
- Tests, migraciones, DTOs, guards, interceptores y documentación API.

---

## 3. Estudio exhaustivo de los PDF (el contenido es autoridad para el diseño)

> **Observación del material aportado:** ambos documentos mostrados son de **una página** y contienen información manuscrita o escaneada. Los nombres de apartados indicados abajo provienen de la lectura visual de dichos ejemplos; el agente debe confirmar cada rótulo, subdivisión, posición y comportamiento contra los PDF reales.

### 3.1 Orden de Servicio de Esterilización

En el ejemplo de referencia se observa:

- Encabezado institucional de **Sterinova**, título **ORDEN DE SERVICIO DE ESTERILIZACIÓN**.
- Identificación del formato: **R-ES-02**, **VERSIÓN: 03**, fecha de revisión visible **15/10/2024**.
- Identificador/consecutivo visible en el documento.
- Cliente; clasificación/selección de modalidades o servicios (p. ej., esterilización, empaque y esterilización, transporte según lo indicado en el papel); dirección, NIT, teléfono/fax y correo.
- Tabla central con **DESCRIPCIÓN DEL MATERIAL**, **CANTIDAD**, **VERIFICADO** (recepción y entrega), **VALOR UNITARIO** y **VALOR TOTAL**.
- Pie de tabla con campos asociados a hora de entrega, número de factura, número de certificado, totales y valores.
- Área de observaciones, subtotal, transporte, I.V.A. y total **tal como aparece en el formato**. No presupongas tratamiento tributario fuera de lo que exija la lógica vigente del sistema.
- Bloques de **RECEPCIÓN DE MATERIAL** y **ENTREGA DE MATERIAL ESTÉRIL**, fechas/horas, entregado por, recibido por y espacios de firma.
- Pie institucional con datos de contacto en el ejemplo.

**Tareas de análisis específicas:**

1. Construye un inventario completo de **campos, etiquetas, casillas, columnas, títulos, áreas de firma y textos estáticos**, con la página y región donde están.
2. Clasifica cada elemento como: texto fijo de plantilla / dato del cliente / dato de la orden / dato por renglón / dato de recepción / dato de proceso / dato de entrega / calculado / firma / reservado / por aclarar.
3. Determina qué opciones son mutuamente excluyentes, múltiples o meramente informativas **solo con respaldo en reglas de negocio o código existente**.
4. Identifica campos llenados en distintos momentos; no obligues a llenar en la creación los de entrega, facturación o certificado si aún no existen.
5. Estudia qué hacer cuando haya 1, 10, 30, 100 o más materiales, descripciones largas, varias líneas de observaciones y firmas.
6. Propón páginas de continuación con encabezado institucional y encabezados de tabla repetidos, conservando bloques finales en el último tramo y evitando cortes de fila.
7. Documenta cualquier texto o estructura ilegible como `[PENDIENTE DE VALIDAR]`.

### 3.2 Acta de Servicio

En el ejemplo de referencia se observa:

- Encabezado Sterinova y título **ACTA DE SERVICIO**.
- Identificación del formato: **R-G-04**, **VERSIÓN 03**, fecha visible **18/11/2024**.
- Número de acta y cliente.
- Apartados de **tipo de servicio**, **descripción del servicio**, referencias a **esterilización**, **empaque**, **transporte** y su aplicabilidad.
- **RECEPCIÓN DE PRODUCTO**, fecha, hora y recibido por.
- Tabla de materiales/productos, lote, cantidades con varias subcolumnas y valores unitarios/totales. **Verifica visualmente los nombres exactos de cada subcolumna**; no los sustituyas por abreviaturas inventadas.
- Apartados sobre **TRANSPORTE**, entregado por/recibido por, **TOTAL CAJAS RECIBIDAS**, **TOTAL CAJAS ENTREGADAS**, subtotal, transporte y total según el ejemplo.
- **OBSERVACIONES (RECEPCIÓN)**.
- **ENTREGA PRODUCTO ESTÉRIL**, fecha, hora, número de certificado, factura y **OBSERVACIONES CLIENTE**.
- Bloque final de responsables/firma de entregado y recibido (cliente/Sterinova según rótulos).

**Tareas de análisis específicas:**

1. Levanta un **diccionario exacto de campos y subcolumnas**, sin copiar información manuscrita de ejemplo como valores predeterminados.
2. Separa variables de recepción, proceso y entrega: cantidades iniciales, procesadas, verificadas, entregadas, diferencia y observaciones, **solo si la semántica exacta se confirma**.
3. Revisa relación con la Orden de Servicio: datos heredables, datos calculables, datos exclusivos y condiciones de emisión.
4. Estudia observaciones extensas y múltiples productos sin truncamiento.
5. Prevé tablas de extensión variable y páginas continuadas, manteniendo secciones finales completas.
6. Conserva espacios para responsables y firmas; decide con el negocio si son manuscritas, digitalizadas o electrónicas.
7. No alteres los apartados visibles aunque propongas una interfaz web distinta para capturarlos.

### 3.3 Entregable documental obligatorio

Genera una **matriz comparativa de formatos** con columnas:

`Documento | Código | Versión de ejemplo | Sección | Campo/columna exacta | Tipo de dato | Origen del dato | Obligatorio/cuándo | Regla de validación | Fórmula si aplica | Variable/fijo | Se repite | Posición/página | Referencia de evidencia | Preguntas abiertas`.

Añade:

- Plano lógico de cada documento (orden de secciones en página).
- Catálogo de campos compartidos y exclusivos.
- Reglas de paginación y de impresión.
- Diferencias entre documento de ejemplo y una hipotética plantilla en blanco.
- Lista de decisiones del negocio que no pueden inferirse desde un escaneo.

**Criterio de fidelidad:** no basta con mostrar los mismos datos: se deben conservar la **identidad institucional, organización, rótulos y bloques**. Cualquier cambio visual necesario para multipágina o actualización de versión debe quedar documentado.

---

## 4. Auditoría del sistema actual (antes de diseñar cambios)

### 4.1 Mapa de arquitectura real

Identifica y documenta:

- Arquitectura de backend: carpetas, módulos, inyección de dependencias, servicios, endpoints y convenciones.
- Arquitectura del frontend: rutas, páginas, componentes compartidos, estados y navegación.
- Configuración ORM/base de datos, nombres de entidades, relaciones, migraciones y transacciones.
- Roles, perfiles, permisos, multi-sede/multiempresa si aplica, y políticas de acceso por estado del documento.
- Procesos existentes de recepción, esterilización, empaque, transporte, certificación, entrega y facturación.
- Entidades/servicios de clientes, catálogos, tarifas, materiales, unidades, lotes y trazabilidad.
- Sistema de emisión de PDF, almacenamiento, descarga, generación de consecutivos y registro de actividad.
- Gestión de errores, validaciones, logs, tests y despliegue.

Para cada pieza relevante, marca: **EXISTE / PARCIAL / FALTA / DUPLICADO / DESCONOCIDO**, con evidencia de código.

### 4.2 Flujos de negocio reales

Rastrea desde el frontend hasta la base de datos **qué sucede hoy** al:

1. Crear una orden o solicitud de servicio.
2. Elegir un cliente y uno o varios servicios.
3. Agregar materiales/productos y cantidades.
4. Confirmar recepción.
5. Ejecutar o registrar procesos (sin asumir que el módulo de Logística ejecuta técnicamente toda la esterilización).
6. Registrar verificación y entrega.
7. Calcular importes o asociar facturación.
8. Emitir o consultar órdenes, certificados y actas.
9. Corregir, anular o reemitir documentos.

Construye un **diagrama textual AS-IS** sustentado en código y un **TO-BE** propuesto que utilice las piezas existentes.

### 4.3 Alcance de Logística y límites con otras áreas

No conviertas Logística en una copia de Producción, Calidad, Facturación o Inventario. Identifica **el dueño de cada dato y transición**:

| Dominio | Pregunta a investigar |
|---|---|
| Logística | ¿Recibe, registra, identifica, custodia y entrega materiales? ¿Emite órdenes y actas? |
| Operaciones/Producción | ¿Quién registra el proceso aplicado y sus resultados? |
| Calidad | ¿Quién valida liberación, certificados, no conformidades y autorizaciones? |
| Inventario | ¿Quién controla existencias, consumibles o trazabilidad de materiales? |
| Facturación | ¿De dónde salen precios, impuestos, recargos, factura y estado de cobro? |
| Clientes | ¿Dónde están razón social, NIT, contactos y condiciones de servicio? |
| Administración documental | ¿Quién aprueba formatos y sus versiones? |

Las respuestas deben proceder del repositorio y/o del responsable del negocio. Si no existen, plantear interfaces entre módulos sin asignar funciones arbitrariamente.

---

## 5. Excel heredado y migración (si está disponible)

**No ejecutar macros.** Inspecciona de forma estática hojas, nombres, tablas, rangos, validaciones, fórmulas, referencias, vínculos, formularios y proyecto VBA si es posible; utiliza herramientas seguras de lectura.

Las cinco hojas **mencionadas en el análisis preliminar**, a verificar contra el archivo real, son:

- `DATOS DE ENTRADA.`
- `ITEMS DETALLADOS` (posiblemente oculta)
- `INFORMACION ENTRADA`
- `INFORMACION DETALLADA`
- `ACTA DE SERVICIO`

También se mencionaron macros/botones con nombres como `Actaserv`, `NREGISTRO`, `agregar3`, `GUARDAR` y `VOLVER`. **No aceptes el supuesto funcionamiento de esos nombres como un hecho hasta leer el código VBA o encontrar evidencias verificables.**

### Investigar

- Origen y destino de datos, reglas de generación de consecutivo y de validación.
- Llaves únicas reales, relación entre encabezado y líneas, y criterios de deduplicación.
- Campos múltiples dispuestos horizontalmente que deberían migrarse a una tabla hija de detalle.
- Fórmulas `BUSCARV`/`SI.ERROR` y límites de rangos, si existen en esa versión.
- Identificadores repetidos, registros huérfanos, fechas, valores, unidades y estados inconsistentes.
- Correspondencia entre Excel y cada PDF: campos que faltan, sobran o tienen otra semántica.
- Si la importación exige historiales completos, saldos, versiones previas o solo consulta de respaldo.

### Plan de migración exigido

Crear **propuesta** de `ETL` con mapeo origen-destino, normalización, limpieza, reglas de conflictos, dry run, conteos de reconciliación, logs, idempotencia y rollback. **No importar datos** durante la auditoría.

---

## 6. Diseño funcional objetivo: módulo digital integrado

### 6.1 Operación prevista

1. Usuario autorizado ingresa al área de Logística desde la navegación existente.
2. Crea Orden de Servicio o continúa un borrador; busca/selecciona cliente y registra servicio(s) y materiales.
3. Agrega filas con botón «Agregar material» sin límite artificial impuesto por el PDF; puede eliminar/reordenar antes de confirmar, con reglas de permisos.
4. Valida campos requeridos y guarda de forma transaccional orden + renglones, sin macros.
5. Registra recepción de materiales con fecha/hora/responsable y cantidades; persiste movimientos verificables.
6. Consulta resultados de proceso desde los módulos responsables o registra datos autorizados según su alcance.
7. Registra entrega, diferencias y observaciones, incluyendo entrega parcial **si el negocio la permite**.
8. Selecciona «Vista previa» de Orden/Acta, ve el **PDF real** paginado y confirma emisión.
9. El sistema asigna número/documento según regla vigente, versión de plantilla, fecha, emisor y estado; almacena una copia de la emisión.
10. Usuarios autorizados consultan, descargan o imprimen históricos; correcciones siguen un flujo trazable.

### 6.2 Capacidades de interfaz

- Listado de órdenes con filtros por cliente, número, fecha, estado y referencias relacionadas.
- Formulario dividido en etapas o secciones **para facilidad de captura**; el formulario web **no tiene que verse idéntico al documento**, pero el PDF emitido sí debe respetarlo.
- Selector de cliente con autocompletado y datos vigentes; preservar snapshot del cliente en el documento emitido.
- Tabla editable de materiales con renglones dinámicos, validación contextual y resumen.
- Captura y consulta de recepción, proceso, entrega y observaciones sin sobrecargar una sola pantalla.
- Cálculos automáticos cuando las fórmulas estén confirmadas; mostrar procedencia de valores.
- Guardado de borradores, control de edición concurrente y alertas antes de perder cambios.
- Previsualizador PDF, descarga y eventual impresión.
- Historial de eventos, correcciones y versiones del documento.
- Manejo accesible de errores, estados vacíos y permisos; diseño responsive si el sistema existente lo admite.

### 6.3 Estados y transiciones

**No impongas los siguientes estados sin confrontarlos con los existentes**. Úsalos como opciones de modelado:

`BORRADOR → REGISTRADA/CONFIRMADA → RECEPCIONADA → EN_PROCESO → LISTA_PARA_ENTREGA → ENTREGADA → CERRADA`

Estados alternos/relacionados: `ANULADA`, `CON_NOVEDAD`, `PARCIAL`, `DOCUMENTO_EMITIDO`.

Distingue **estado operativo de la orden**, **estado de cada entrega**, **estado del proceso**, **estado del documento** y **estado de plantilla**. No los mezcles en una sola columna si su ciclo de vida es diferente.

### 6.4 Relaciones y cardinalidades que se deben validar

- Cliente 1:N órdenes.
- Orden 1:N ítems/materiales.
- Orden 1:N recepciones o entregas **solo si hay operación parcial**.
- Ítem 1:N verificaciones/lotes/movimientos **si se confirma en el proceso**.
- Orden 0:N actas **solo si se confirma emisión múltiple por proceso/entrega**.
- Documento emitido N:1 plantilla/version concreta.
- Documento emitido 1:N revisiones/correcciones **como eventos, sin sobrescribir original**.
- Orden N:1 sede/empresa **si el sistema soporta segmentación**.

**Pregunta de negocio fundamental:** ¿la relación real entre una Orden y un Acta es 1:1, 1:N, N:1 o depende de entrega/proceso? Debes inferir lo mínimo y proponer una decisión explícita.

---

## 7. Modelo de datos propuesto (adaptar, no duplicar entidades)

Entrega un **modelo lógico y mapeo con las tablas existentes**. Los nombres siguientes son conceptuales; reutiliza las entidades actuales cuando correspondan.

| Entidad conceptual | Contenido / responsabilidad |
|---|---|
| `service_order` | ID, consecutivo, cliente, sede, fechas, responsable, tipo(s) de servicio, estado, observaciones, moneda y referencias existentes. |
| `service_order_item` | ID, orden, posición, descripción/material, cantidades, unidad, lote(s) cuando aplique, valores, observaciones. |
| `receipt_event` / `receipt_item` | Recepción, fecha/hora, usuario, verificación y cantidades reales por material. |
| `process_reference` | Referencia a resultado de proceso en el módulo dueño; **no duplicar toda la ejecución**. |
| `delivery_event` / `delivery_item` | Entrega, responsable, receptor, fecha/hora, cantidades verificadas, diferencias, observaciones. |
| `service_act` | Registro funcional del acta: relación con orden/entrega/proceso, consecutivo, estado y datos de emisión. |
| `document_template` | Tipo de formato, código institucional, nombre y reglas generales. |
| `document_template_version` | Número de revisión, vigencia, contenido/versionado, estado, aprobación, hash y cambios. |
| `issued_document` | Tipo, consecutivo, referencia al objeto de negocio, versión congelada, snapshot de datos, archivo PDF, hash, fecha, autor y estado. |
| `document_event` | Emisión, anulación, corrección, reemplazo/sustitución, descarga significativa si aplica, actor y motivo. |
| `signature_or_approval` | Autorizaciones y evidencias de firmas según el flujo aprobado y permisos. |

### Reglas del esquema

- Evita columnas repetitivas como `producto_1...producto_15`; usa detalle 1:N.
- Usa tipos decimales exactos para dinero/cantidades fraccionarias si se requieren; muestra formato regional sin sacrificar precisión.
- La cantidad física y el valor monetario no son el mismo concepto; define unidad, conversiones y reglas de redondeo.
- Impón integridad referencial, unicidad de consecutivos con el alcance adecuado y transacciones para altas/emisiones.
- No confíes exclusivamente en cálculos de frontend; backend valida y persiste reglas de negocio.
- Define concurrencia para evitar dos documentos con un mismo consecutivo.
- Congela snapshots de datos importantes al emitir (cliente, descripción, precio, impuestos aplicables, responsables, versión) para mantener fidelidad histórica.
- Registra autor, fechas, estado, cambios y motivación de correcciones.
- Diseña permisos para que los históricos no puedan borrarse sin una política explícita de retención y auditoría.
- Compara con entidades actuales y presenta por cada concepto: `REUTILIZAR`, `EXTENDER`, `CREAR`, `NO NECESARIO`, justificando con evidencia.

---

## 8. Motor de plantillas PDF fieles y dinámicas

Esta sección es **central**. No propongas capturas de pantalla ni un PDF genérico que solo ponga textos en una hoja blanca.

### 8.1 Separación de responsabilidades

**A. Datos de negocio:** orden, cliente, materiales, recepción, proceso, entrega y cálculos.  
**B. Plantilla institucional:** código, revisión, encabezados, tablas, secciones, textos, dimensiones, estilos y reglas de impresión.  
**C. Renderizador:** interpreta datos + versión concreta y genera PDF.  
**D. Archivo de emisión:** copia inmutable, metadatos, snapshot, hash y historial.

### 8.2 Fidelidad del diseño

- Reconstruye la estructura institucional a partir de los PDF, preferentemente con plantilla original editable si existe; si solo hay escaneo, documenta que se trata de una **reconstrucción visual** y compara resultados.
- Conserva proporciones principales, bordes, encabezados, logos, rótulos, apartados, anchos relativos y zonas de firma.
- **No incluyas las anotaciones manuscritas de los escaneos como parte del fondo fijo.**
- Evita usar el escaneo completo como imagen de fondo para generar documentos dinámicos: haría imposible expandir filas, controlar texto, mantener accesibilidad y versionar campos correctamente.
- Valida tamaño de página, orientación, márgenes, área imprimible y resolución de logotipo.
- Permite valores largos sin superposición; define cómo envolver texto y tratar renglones altos.
- No cambies etiquetas institucionales sin registrar una versión autorizada.

### 8.3 Expansión y paginación automática

El diseño debe funcionar con **0, 1, 5, 15, 30, 60, 100+** ítems como escenarios de prueba (el límite de negocio debe ser validado).

- Crecimiento dinámico de tabla según número de ítems.
- No truncar registros ni superponer secciones.
- Crear páginas adicionales y repetir encabezado institucional y encabezados de columna según las reglas aprobadas.
- Repetir o mostrar el consecutivo, código/versión y la identificación del documento en páginas continuadas.
- Evitar dividir una fila crítica entre páginas o hacerlo de forma controlada si el contenido es excepcionalmente largo.
- **Totales, observaciones finales y bloques de firmas** aparecen en la sección que corresponde, normalmente al final, sin fragmentarse indebidamente.
- Si una sección final no cabe, pasarla completa a la página siguiente; no encoger tipografía por debajo de un mínimo legible para forzar todo a una página.
- Considerar numeración `Página X de Y` solo si es compatible con el formato vigente o se aprueba como cambio de versión.
- Evitar páginas vacías, cortes de bordes, líneas sueltas y tablas desalineadas.
- Probar márgenes de impresión A4/Carta según formato real; **no asumir el tamaño**.
- Evitar recálculos inconsistentes entre vista previa y emisión definitiva.

### 8.4 Tecnología de renderizado

Inspecciona primero la infraestructura y librerías disponibles. Evalúa al menos:

- HTML/CSS de impresión y navegador sin interfaz (Chromium/Playwright/Puppeteer, **si encaja con lo existente**).
- Motor de PDF existente en backend, si ya hay uno.
- Alternativa de composición PDF si HTML/CSS no logra fidelidad o control de paginación requerido.

Entregar una **comparación razonada** de fidelidad visual, tablas multipágina, soporte de encabezados/pies, rendimiento, deploy, fuentes, mantenimiento, seguridad y dependencias. Seleccionar la opción **más compatible**, no la más novedosa.

### 8.5 Pruebas documentales obligatorias

Crea una matriz de aceptación para ambos formatos:

| Caso | Comprobación |
|---|---|
| 1 ítem | Secciones y espacios consistentes. |
| Tabla al límite de una página | Sin cortes ni solapamientos. |
| Tabla de varias páginas | Encabezados repetidos y continuidad correcta. |
| Descripciones muy largas | Texto legible, sin invasión de columnas. |
| Observaciones extensas | Zona se expande o pagina sin perder texto. |
| Valores grandes/decimales | Totales correctos y legibles. |
| Lotes y subcolumnas | Significado y alineación preservados. |
| Firmas y entrega | Bloques íntegros y asociados al documento correcto. |
| Dos versiones del formato | Cada documento reproduce la que le corresponde. |
| Impresión | Sin recortes en márgenes y con escala adecuada. |
| Generación repetida | PDF consistente para el mismo snapshot y versión, salvo metadatos justificables. |

Verificar mediante renderización y **comparación visual página a página**, no solo validación de existencia del PDF.

---

## 9. Versionamiento institucional de formatos

El sistema debe distinguir **versión de software**, **versión de plantilla/formato** y **revisión de documento emitido**; son cosas distintas.

### 9.1 Datos mínimos por plantilla

- Tipo de documento: Orden / Acta.
- Código institucional (`R-ES-02`, `R-G-04`, salvo confirmación o revisión posterior).
- Número de versión, fecha de aprobación, fecha de inicio de vigencia y opcional fecha de fin.
- Estado: `BORRADOR`, `EN_REVISION`, `APROBADA/PUBLICADA`, `RETIRADA` (adaptar al negocio).
- Autor de cambio, aprobador, fecha y observaciones del cambio.
- Definición/render de la versión y hash/identificador de integridad.
- Reglas de campos, diseño y compatibilidad con el esquema de datos.

### 9.2 Ciclo de vida

1. Crear borrador **a partir de una versión vigente**.
2. Permitir cambios solo dentro de un editor/configuración segura y controlada.
3. Ver cambios y previsualizar con datos ficticios en escenarios de una o varias páginas.
4. Validar esquema, campos obligatorios y fidelidad visual.
5. Revisar y aprobar según permisos.
6. Publicar nueva versión sin alterar la anterior.
7. Emisiones nuevas toman la versión vigente para el tipo de documento y fecha correspondiente.
8. Emisiones antiguas siguen vinculadas a su versión y guardan **PDF inmutable + snapshot**.
9. Una versión retirada permanece disponible para consultar históricos y trazabilidad.

**No permitir edición libre y arbitraria del HTML en producción** sin validación de seguridad, control de cambios y aprobación. Evaluar un editor de campos/propiedades autorizado y plantillas almacenadas/versionadas de manera segura.

### 9.3 Ejemplo conceptual (no datos de producción)

- Orden `R-ES-02` v03: referencia escaneada de 2024.
- Borrador v04: ajustes aprobables a etiquetas o campos.
- Cuando v04 entra en vigor, las órdenes nuevas usan v04.
- Órdenes emitidas con v03 siguen mostrando v03, con su PDF y contenido originales.

### 9.4 Rectificaciones y auditoría

- Definir cuándo se puede modificar un **borrador operativo**.
- Emitido: no sobrescribir PDF ni alterar la versión histórica.
- Corrección: registrar motivo, responsable, fecha, vínculo con emisión anterior y nueva versión/revisión documental según norma interna.
- Anulación: preservar el documento y marcarlo anulado, con justificación y control de acceso.
- Definir si las descargas y vistas requieren registro o solo emisiones/alteraciones.

---

## 10. Permisos, seguridad y trazabilidad

Analiza roles existentes y propone una matriz efectiva, **sin crear nombres de rol incompatibles**:

- Consultar órdenes, crear borradores, editar borradores.
- Confirmar recepción.
- Consultar estado del proceso y sus resultados.
- Confirmar entrega.
- Ver costos/valores y emitir documentos con importes.
- Emitir Orden y Acta.
- Descargar PDFs históricos.
- Anular/corregir emisiones con motivo.
- Crear, revisar, aprobar, publicar o retirar versiones de plantilla.
- Acceder al historial y auditoría.

Validaciones adicionales:

- Aislamiento entre empresas/sedes/clientes si el sistema es multi-tenant.
- Control de acceso al archivo PDF, no solo al endpoint de metadatos.
- Protección contra inyección en plantillas HTML y contenido de usuario.
- Sanitización, límites razonables de entradas, tamaño de archivos y defensas contra abuso de renderización.
- Consecutivos transaccionales y protección contra duplicaciones por doble clic o reintentos.
- Permisos en backend aunque frontend esconda botones.
- Archivos PDF almacenados de manera privada con políticas de retención, backups y recuperación.
- Registro de quién creó, aprobó, emitió, anuló o corrigió.

---

## 11. Integración técnica: puntos que debes localizar

Para backend:

- Rutas y patrones de controladores/servicios, DTOs, entidades y excepciones.
- Módulo origen de clientes y de servicios/tarifas.
- Subsistema de procesos y seguimiento de lotes.
- Gestión de consecutivos, transacciones e idempotencia.
- Servicio de generación de PDF/archivos y estrategia de almacenamiento.
- Autenticación, guards, roles, permisos y auditoría.
- Migraciones y política de cambios de esquema.

Para frontend:

- Ruta de navegación de Logística y pantallas existentes.
- Componentes reutilizables de formularios, tablas dinámicas, buscadores y vistas de detalle.
- Cliente HTTP, validación, manejo de errores y estados globales.
- Modal de vista previa, visor PDF y descarga.
- Diseño de permisos, layouts y consistencia visual.

**Entregar un mapa por archivo** (existente a reutilizar / ajustar / crear) y cambios de interfaces contratadas. No escribir implementación en esta fase.

### Contratos API candidatos (solo después de revisar los actuales)

Ejemplos conceptuales, **no rutas obligatorias**:

- Listar y crear órdenes; obtener detalle; editar borrador y confirmar.
- Agregar/editar/quitar renglones mientras la orden sea editable.
- Registrar recepción y entrega con eventos auditables.
- Consultar estado del proceso y referencias de certificado.
- Previsualizar Orden o Acta sin emitir.
- Emitir Orden/Acta de forma idempotente y transaccional.
- Descargar/ver documento emitido por ID seguro.
- Listar versiones de plantilla, crear borrador, comparar, validar, aprobar y publicar.
- Consultar eventos y revisiones.

Define idempotencia, permisos, respuesta de errores y modelos de datos usando el estilo del proyecto. No dupliques endpoints que ya existen.

---

## 12. Reglas de negocio que necesitan confirmación

Marca estas cuestiones como **preguntas a negocio** cuando el repositorio/formato no las resuelva:

1. ¿La orden de servicio se genera **al recibir**, **antes de recibir**, o en otro punto?
2. ¿Un acta corresponde a una sola orden o puede agrupar órdenes/entregas/procesos?
3. ¿Se permiten entregas parciales, varios lotes por material y varios procesos por orden?
4. ¿Qué significan exactamente todas las **subcolumnas de cantidad** del Acta?
5. ¿Qué representa cada campo de **VERIFICADO** de la Orden?
6. ¿Quién autoriza la emisión de Orden y Acta, y con qué estado mínimo?
7. ¿Los campos de certificado/factura se diligencian antes o después del acta?
8. ¿Cuál es el origen oficial de precios, transporte, impuestos, redondeos y totales?
9. ¿Los valores pueden variar por cliente, producto, tipo de servicio o contrato?
10. ¿Cómo se asignan los consecutivos y en qué alcance (global, sede, año, tipo)?
11. ¿Qué datos de firmas, responsables y fechas deben ser obligatorios?
12. ¿Qué información se registra si hay rechazo, faltantes, daño, devolución o no conformidad?
13. ¿Quién administra y aprueba las revisiones de formatos institucionales?
14. ¿Cuál es el tamaño de hoja, márgenes y fuente institucional oficial?
15. ¿Los documentos emitidos requieren firma en pantalla, impresa o digital/electrónica?
16. ¿Qué datos históricos de Excel deben migrarse con valor legal/operativo y qué archivos originales se conservarán como respaldo?
17. ¿Qué módulo es dueño de datos de esterilización, empaque, calidad, transporte, inventario y facturación?
18. ¿Existen distintos formatos por cliente, sede, modalidad o vigencia?
19. ¿El PDF debe imprimirse en blanco para firma manual o generarse completamente diligenciado?
20. ¿Se requiere compatibilidad exacta con una versión anterior del formato, o basta equivalencia visual oficial aprobada?

Distingue preguntas **bloqueantes** y **no bloqueantes** para planificar sin paralizar todo el proyecto.

---

## 13. Plan por fases y prioridades

### Fase 0 — Descubrimiento seguro (solo lectura)

- Identificar repositorios, ramas, versiones, documentación, arquitectura y rutas exactas.
- Validar presencia y legibilidad de PDF y Excel.
- Detectar módulos de Logística, procesos y documentos.
- Salida: inventario y límites de alcance.

### Fase 1 — Auditoría funcional y técnica (solo lectura)

- Mapear procesos AS-IS y estados.
- Inventariar entidades, endpoints, servicios, UI, roles, PDFs, tablas y auditoría.
- Clasificar capacidades existentes/parciales/ausentes.
- Salida: matriz con evidencia `ruta:línea` y riesgos priorizados.

### Fase 2 — Especificación de documentos (solo lectura)

- Inventariar **cada campo** en ambos PDF.
- Diseñar reglas de datos, tablas dinámicas, paginación y versiones.
- Salida: matriz de campos y especificación de plantillas.

### Fase 3 — Diseño de integración (sin modificar código)

- Modelar datos, estados, permisos, interfaces, contratos y reglas de emisión.
- Proponer reutilización vs extensiones vs componentes nuevos.
- Salida: arquitectura TO-BE, ADRs y plan de cambios por archivo.

### Fase 4 — Implementación incremental (**solo con autorización posterior**)

Orden sugerido: persistencia/DTOs y validaciones → operaciones Logística → vistas y formularios → motor PDF → versionamiento y auditoría → históricos → pruebas y migración. Adaptar según dependencias existentes.

### Fase 5 — Pruebas, validación funcional y despliegue (**solo con autorización posterior**)

- Pruebas unitarias, integrales, seguridad, performance, documentos y regresión.
- Comparación visual de PDFs con las referencias.
- Pruebas con usuarios de Logística y responsables de formatos.
- Migración histórica validada y plan de rollback.

### Prioridades

**P0:** integridad de datos, permisos, conservación de documentos emitidos, fidelidad institucional, numeración sin duplicados.  
**P1:** proceso funcional de Orden/Acta, tabla dinámica, paginación, integración con módulos existentes.  
**P2:** editor de versiones, aprobaciones, migración histórica, herramientas administrativas.  
**P3:** métricas avanzadas, indicadores y mejoras opcionales de UX.

> El versionamiento debe estar **previsto desde el modelo inicial**, aunque el editor administrativo pueda implementarse en una fase posterior; no generar PDFs sin guardar su versión de plantilla.

---

## 14. Casos de prueba y criterios de aceptación

### Funcionales

- Crear orden con múltiples materiales sin usar Excel/macros.
- Autoguardar o persistir borrador según UX definida; reabrir sin pérdida.
- Validación de campos y cantidades; impedir valores imposibles y transiciones no permitidas.
- Reutilizar datos compartidos para Acta y evitar digitación duplicada.
- Registrar recepción, proceso referenciado, entrega y diferencias según permisos.
- Consultar historial de órdenes, actas, estados, emisiones y correcciones.
- Detectar y manejar doble clic/reintento en emisión sin duplicar consecutivos.
- Bloquear modificaciones indebidas tras emitir documento.

### Visuales/documentales

- Orden y Acta reproducen bloques y rótulos del PDF institucional aplicable.
- Más ítems significa más filas y páginas, nunca recorte de datos.
- Encabezados de tabla repetidos, filas legibles, márgenes correctos.
- Totales, firmas y observaciones ubicados de forma comprensible y sin superposición.
- Versión/código correctos en cada documento y sus páginas.
- Documentos emitidos bajo la versión anterior mantienen su apariencia histórica.

### Datos, seguridad y calidad

- Integridad relacional y concurrencia de consecutivos.
- Permisos aplicados en API y UI; acceso a PDF protegido.
- Importación histórica con reconciliación y sin sobrescribir datos existentes.
- Auditoría de acciones críticas y trazabilidad de cambios.
- Tests automatizados para cálculos confirmados, estados, transacciones, documentos y versiones.
- Revisión manual final de PDFs representativos por un responsable de Logística/calidad documental.

### Prueba de regresión de documentos

Propón **fixtures anonimizados** con: 1, 10, 30 y 100 materiales, textos extensos, valores grandes, faltantes, varias páginas, entregas parciales si se permiten y al menos dos versiones de plantilla. Renderiza PDFs y compara con snapshots visuales. No uses datos personales reales en snapshots compartidos.

---

## 15. Riesgos y medidas de mitigación

| Riesgo | Mitigación esperada |
|---|---|
| Copiar el Excel de forma literal | Modelar proceso, entidades normalizadas y relaciones reales. |
| Crear módulo independiente o duplicado | Inspeccionar y extender servicios existentes. |
| Confundir Orden con Acta | Diccionario de campos y flujos diferenciados. |
| Escaneo tratado como plantilla editable | Reconstrucción de estructura, no fondo manuscrito fijo. |
| PDF con filas cortadas | Motor de paginación probado con casos de estrés. |
| Formatos antiguos alterados por cambio nuevo | PDF/snapshot inmutables y vínculo a versión congelada. |
| Consecutivos duplicados | Restricciones únicas, transacciones, idempotencia. |
| Cálculos de valores incorrectos | Reutilizar reglas de negocio verificadas, tests y redondeo formal. |
| Cambios no aprobados de plantilla | Permisos, revisión, aprobación, publicación y auditoría. |
| Reglas sanitarias inventadas | Registrar requisitos normativos pendientes y responsable de validación. |
| Exposición de información | Acceso autorizado a datos y PDFs; secretos fuera de informes. |
| Migración con datos corruptos | Dry run, trazabilidad, limpieza documentada y conciliación. |

---

## 16. Entregables obligatorios del agente

Produce un **paquete de diagnóstico** sin alterar el código existente (si necesitas guardar `.md` de resultados dentro del repositorio, pide permiso primero; en ausencia de permiso, entrega el contenido en la conversación o en una ubicación explícitamente autorizada):

1. **`00_RESUMEN_EJECUTIVO_LOGISTICA.md`** — objetivo, estado actual, principales hallazgos, riesgos y recomendación.
2. **`01_INVENTARIO_SISTEMA_EXISTENTE.md`** — stack real, repositorios, carpetas, módulos, entidades, endpoints, servicios compartidos y permisos, con evidencia.
3. **`02_ANALISIS_FORMATOS_ORDEN_Y_ACTA.md`** — secciones exactas, matriz de campos, diferencias, reglas visuales, paginación y elementos pendientes.
4. **`03_FLUJOS_AS_IS_TO_BE_LOGISTICA.md`** — procesos actuales/futuros, responsables, transiciones y conexiones con otras áreas.
5. **`04_MODELO_DATOS_E_INTEGRACION.md`** — entidades reales, reuso, extensiones, cardinalidades, transacciones, snapshots y documentos.
6. **`05_ARQUITECTURA_PDF_Y_VERSIONAMIENTO.md`** — alternativas de render, diseño dinámico, historial, aprobación, preservación y seguridad.
7. **`06_PLAN_IMPLEMENTACION_POR_FASES.md`** — tareas dependientes, archivos previstos, riesgos, esfuerzo relativo, criterios de salida y rollback.
8. **`07_MATRIZ_PRUEBAS_Y_ACEPTACION.md`** — escenarios funcionales, visuales, permisos, datos y regresión.
9. **`08_PREGUNTAS_ABIERTAS_Y_DECISIONES.md`** — preguntas clasificadas, decisiones tomadas, supuestos y bloqueantes.
10. **`09_MAPA_EXCEL_Y_MIGRACION.md`** — solo si está disponible el Excel; de lo contrario, documentar los insumos faltantes.

### Formato exigido de cada hallazgo

```text
ID: LOG-###
Ámbito: Backend / Frontend / BD / PDF / Operación / Seguridad
Estado: EXISTE / PARCIAL / FALTA / RIESGO / PENDIENTE
Severidad: Alta / Media / Baja
Evidencia: ruta:línea o PDF + página + sección
Descripción: hecho observado, sin adivinar
Impacto: qué ocurriría en el flujo real
Propuesta: reutilizar / extender / crear / verificar
Dependencias: otras áreas, decisiones o archivos
```

### Estructura del resumen para el usuario

Al finalizar la auditoría, entrega **en este orden**:

1. Qué existe hoy y qué se puede reutilizar.
2. Qué falta para digitalizar Orden y Acta.
3. Qué debe decidir el área de Logística y los responsables documentales.
4. Arquitectura recomendada **con evidencia**.
5. Plan por fases y prioridades.
6. Riesgos, bloqueos y preguntas.
7. Siguiente **paso concreto** sugerido, sin ejecutar modificaciones automáticamente.

No llenes los documentos de generalidades: cada sección debe decir qué archivos o formatos estudiaste y qué conclusiones verificaste.

---

## 17. Protocolo de inicio (primera ejecución del agente)

**Ejecuta solo estos pasos iniciales, en orden:**

1. Confirma la ruta del proyecto y la rama activa en **solo lectura**.
2. Comprueba los contenidos de `docs/ejemplos-formatos` y registra rutas exactas, tipo y número de páginas de cada PDF.
3. Localiza documentación, stack y entrada del módulo Logística existente.
4. Descubre si el frontend está en la misma raíz u otro repositorio accesible; si falta, reporta el alcance parcial.
5. Genera un pequeño mapa de dependencias con archivos relevantes **sin abrir todo el repositorio**.
6. Examina visualmente ambos PDF, inventaría sus secciones y campos y señala dudas de lectura.
7. Inspecciona las entidades, controladores, servicios y componentes que realmente resuelven órdenes, recepción, procesos, entrega y documentos.
8. Compara la capacidad existente con los requisitos de este documento y clasifica brechas.
9. Formula como máximo las preguntas realmente **bloqueantes** para definir el modelo; conserva las demás en la matriz de preguntas.
10. Entrega el diagnóstico y la propuesta de cambios **antes de escribir código**.

**No empieces por construir un CRUD, redibujar toda la interfaz, instalar un generador PDF o crear migraciones.** Primero evidencia, luego diseño, después autorización y finalmente implementación incremental.

---

## 18. Instrucción final y definición de éxito

Tu éxito no se mide por la cantidad de archivos modificados ni por la longitud del informe. Se mide por la capacidad de responder con pruebas:

- **Dónde vive Logística hoy** y cómo se relaciona con las demás áreas.
- **Qué información captura cada formato**, de dónde proviene y cuándo está disponible.
- **Cómo generar documentos institucionales fieles** con un número variable de renglones y páginas.
- **Cómo versionar plantillas** sin reescribir históricos.
- **Qué funciones actuales se pueden reutilizar** en lugar de duplicarlas.
- **Qué pasos concretos** permiten implementar y probar la integración sin interrumpir el sistema existente.

Comienza en modo auditoría de solo lectura. Cuando termines, presenta la propuesta para revisión. **Espera autorización explícita antes de modificar el proyecto.**
