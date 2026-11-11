# PROMPT MAESTRO V2 — Logística Sterinova: auditoría, integración documental e IMPORTACIÓN HISTÓRICA desde Excel .xlsm

> **Documento de trabajo para un agente de programación con acceso local a Sterinova.** Actualización fundamentada en un examen estructural del archivo `LOGISTICA(2).xlsm` recibido el 11/11/2026, además de los PDF de orden y acta. **No es una orden de implementar inmediatamente.** Primero auditar y documentar en modo solo lectura; después presentar plan y esperar aprobación explícita para cambios.
>
> **Objetivo adicional crítico:** cuando el módulo digital entre en operación, permitir cargar el archivo de Excel heredado `.xlsm` desde la aplicación, analizarlo y convertir sus datos históricos en entidades del sistema, de forma segura, explicable, sin ejecutar macros y sin duplicaciones si se carga el mismo archivo varias veces.
>
> **Ruta del backend:** `C:\Users\urria\Sterinova-Backend`  
> **Ruta de evidencias:** `C:\Users\urria\Sterinova-Backend\docs\ejemplos-formatos`  
> **Archivos deseados en dicha carpeta:** `Orden de Servicio.pdf`, `Acta de Servicio.pdf`, `LOGISTICA.xlsm` (o el nombre `.xlsm` real). Si el Excel aún no está en la carpeta, indicar la ruta faltante; no inventar que fue localizado.

## LECTURA OBLIGATORIA: prioridad y alcance

1. Esta V2 **AMPLÍA** todas las instrucciones de la V1 reproducida en la PARTE A. **La importación histórica no es opcional**: se deberá analizar y especificar como parte del diseño integral, e implementar solo en fase autorizada.
2. **Separar dos mecanismos diferentes**: (a) importación extraordinaria de registros históricos desde Excel; (b) operación cotidiana nueva en formularios digitales. El `.xlsm` no será el almacén operativo del sistema ni se ejecutarán sus macros.
3. **Tratar el Excel como evidencia heterogénea, no como base limpia.** Las estadísticas iniciales de esta V2 son observaciones del ejemplar subido, que el agente deberá **recalcular y confirmar con su copia local** (hash, hojas, filas y reglas), sin tomarlas como supuestos permanentes para futuros Excel.
4. **Nada de escrituras en la auditoría**: ni importaciones reales, ni creación de usuarios/clientes, ni migraciones, ni cambios de código o datos, ni ejecución de VBA. Solo lectura local, reportes e identificación de brechas. El desarrollo del importador y la carga efectiva requieren autorización posterior.
5. **Preservar el original**: mantener un archivo fuente inmutable y su huella SHA-256, fila/columna/hoja, y evidencias de cada transformación; nunca reemplazar el XLSM original ni convertirlo destruyendo VBA.
6. **No inferir que toda fila en INFORMACION DETALLADA tiene cabecera en INFORMACION ENTRADA**. Hacer análisis de datos huérfanos, subtipos históricos, duplicados y otros orígenes antes de decidir cómo conservarlos.
7. **No confundir datos Excel con documentos digitales emitidos**: un registro importado no adquiere automáticamente condición de acta PDF formalmente emitida. Distinguir metadatos históricos, reconstrucción digital no certificada y PDF original conservado cuando exista.
8. **Skills y uso de tokens**: leer únicamente las skills necesarias (análisis de Excel/VBA sin ejecución, PDF visual, arquitectura del repo, SQL, seguridad de archivos o tests), en el momento oportuno; recolectar métricas masivas mediante scripts locales y presentar solo agregados, excepciones y muestras anonimizadas. No volcar las 3.651 filas ni 9.982 bloques al chat.

---

# PARTE A — Auditoría e integración documental (fundamento de la V1)

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


---

# PARTE B — Especificación obligatoria del importador histórico XLSM y estrategia de migración

## B1. Evidencia real observada en `LOGISTICA(2).xlsm`

**Origen de las cifras:** análisis estático de la estructura interna XLSM, hojas XML y valores de celda; no se ejecutaron macros. Las estadísticas describen el archivo adjuntado, **no** garantizan que otros archivos tengan los mismos contenidos.

- Tamaño aproximado del archivo: **3,2 MB**.
- SHA-256 de esta copia: `ef8ee47ce136cc784d9394290e2cde3df2009cc9f656fe83597d7eb7a2370327`.
- Contiene proyecto VBA `xl/vbaProject.bin` (aprox. 105 KB) y controles/dibujos incrustados. La auditoría no valida la ejecución ni el código interno completo de las macros.
- Las copias analizadas `LOGISTICA.xlsm`, `LOGISTICA(1).xlsm` y `LOGISTICA(2).xlsm` resultaron **idénticas por SHA-256**: son el mismo contenido, no tres históricos distintos. Esto demuestra por qué es esencial la deduplicación por hash.
- Las hojas, **en orden y con su nombre literal**, son: `DATOS DE ENTRADA.`, `ITEMS DETALLADOS` (**oculta**), `INFORMACION ENTRADA`, `INFORMACION DETALLADA`, `ACTA DE SERVICIO`.
- La hoja `INFORMACION ENTRADA` tiene **1.617 filas de datos con número de acta**, **1.600 identificadores distintos**, **17 grupos de identificador repetido** (13 grupos idénticos y 4 con diferencias entre sus filas). Se detectó al menos una fila con información de cliente pero sin identificador de acta; requiere revisión.
- `INFORMACION DETALLADA` tiene **3.651 filas de datos con número de acta**, **3.610 identificadores distintos**, **40 grupos de identificador repetido** (31 grupos idénticos y 9 con diferencias entre sus filas). Algunos grupos contienen tres filas; no asumir multiplicidad máxima de dos.
- Intersección de identificadores únicos entre ambas hojas: **1.598**. Identificadores de entrada sin detalle: **2**; identificadores de detalle sin entrada: **2.012**. **No asumir que todos son errores**: puede tratarse de cobertura histórica desigual, exportaciones incompletas, sistemas anteriores o registros previos.
- En los 3.651 registros de detalle se localizaron **9.982 bloques de productos con algún valor diferente de vacío o cero**. Esto **no equivale** a 9.982 ítems válidos: hay datos incompletos, anotaciones textuales e inconsistencias.
- Distribución de bloques ocupados por fila: 0:4, 1:738, 2:1.703, 3:446, 4:238, 5:155, 6:140, 7:85, 8:56, 9:37, 10:19, 11:12, 12:7, 13:5, 14:4, 15:2.
- Entre esos bloques se observaron campos vacíos: **2.556 sin número de cajas, 1.430 sin lote, 1.430 sin cantidad, 5 sin descripción**. Estas son **incidencias de campos**, no conteos de filas rechazadas; un bloque puede acumular varias.
- Hay campos de cantidad/cajas con texto o formatos no numéricos (`10G`, `0,0502G`, anotaciones, etc.). No convertir con coerciones inseguras ni borrar unidades; debe distinguirse cantidad, unidad de medida y notas.
- `INFORMACION ENTRADA` tiene dimensión declarada hasta `XFD6710` debido a celdas y formatos extendidos; **no recorrer toda la cuadrícula hasta XFD por interpretación ingenua de `max_column`**, ya que produce millones de celdas ficticias. Usar iteración dispersa de celdas no vacías, columnas esperadas y filas efectivas.
- La hoja `ACTA DE SERVICIO` usa fórmulas `VLOOKUP`/`IFERROR` (`BUSCARV`/`SI.ERROR`) contra rangos fijos `INFORMACION ENTRADA!A5:R2460` e `INFORMACION DETALLADA!A5:BM4776`. No importar resultados de estas fórmulas como registros: son una **vista derivada de consulta**, no una fuente de verdad.
- En el libro aparecen nombres/rangos de impresión y filtros asociados a rangos distintos, lo que puede ocultar o excluir datos visualmente. Importar según filas reales validadas, no según el autofiltro, la selección visible o el área de impresión.
- Una columna puede representar fecha/hora mediante **números seriales de Excel** (p. ej. fechas alrededor de 46.000 y horas entre 0 y 1). No tratarlos como enteros de negocio.
- En el Excel se lee en el encabezado de acta `R-LG-04`, mientras que el escaneo de acta de referencia puede leerse de manera diferente debido a la calidad de imagen. **Registrar discrepancia y verificar el código institucional correcto contra el PDF maestro y con el responsable documental**; no autocorregir.

### B1.1 Qué NO demuestra este análisis

- No demuestra que el VBA realmente guarde, calcule, actualice o elimine los datos de cierta manera; las asociaciones de botones observadas previamente no equivalen a una auditoría completa del código VBA.
- No demuestra que todos los datos del Excel sean jurídicamente válidos, vigentes, íntegros o aprobados.
- No demuestra que los 2.012 identificadores sin cabecera sean pérdidas de información, ni que los duplicados sean siempre errores.
- No demuestra que los datos de Orden de Servicio estén completos en el Excel: el archivo heredado se organiza predominantemente por **ACTA DE SERVICIO**; la correspondencia con órdenes debe validarse.
- No demuestra que los precios, IVA, transporte, factura, certificado y firmas estén disponibles estructurados para todos los registros. No inventarlos.

## B2. Diccionario de origen EXACTO a verificar

### B2.1 Hoja `INFORMACION ENTRADA` (cabecera histórica)

**Fila 3:** rótulos superiores. **Fila 4:** subencabezados. **Datos observados:** desde fila 5. **Columna A:** número de ACTA DE SERVICIO, **clave de referencia provisional**, no necesariamente PK única.

| Columna Excel | Etiqueta observada / interpretación controlada | Propuesta de destino, pendiente de mapeo repo |
|---|---|---|
| A | ACTA DE SERVICIO | `legacy_acta_number` |
| B | DOCUMENTO / O.P | `order_or_op_reference` (texto) |
| C | REMISION | `remission_reference` (texto) |
| D | LOTE | `header_lot_reference` (texto) |
| E | CLIENTE | nombre histórico / posible vínculo cliente |
| F | TIPO DE SERVICIO | tipo histórico (`EtO`, `Vapor`, otros) |
| G | DESCRIPCIÓN DEL PROCESO / ESTERILIZACIÓN | aplicación de esterilización |
| H | ... / EMPAQUE | aplicación de empaque |
| I | ... / TRANSPORTE | aplicación de transporte |
| J | FECHA DE RECEPCIÓN DEL PRODUCTO | fecha original |
| K | HORA DE RECEPCIÓN | hora original |
| L | PERSONA QUE RECIBE AL CLIENTE | responsable textual, rol por confirmar |
| M | PERSONA QUE RECIBE STERINOVA | responsable textual, rol por confirmar |
| N | TOTAL DE CAJAS RECIBIDAS | cantidad original / valor raw |
| O | INGRESO AL SISTEMA: FECHA | fecha de captura histórica |
| P | INGRESO AL SISTEMA: HORA | hora de captura histórica |
| Q | ESTADO DEL ACTA | valor textual original, enum solo después de analizar |
| R en adelante | Observaciones y columnas auxiliares, algunas etiquetas en U:X; posible información fuera del área habitual | inspeccionar y definir explícitamente; **no desechar columnas con valor** |

**Advertencias:** no asumir que la palabra `DOCUMENTO` sea un tipo de identidad; en fila 4 se subdivide en `O.P`, `REMISION`, `LOTE`. Revisar todos los valores de cabecera que queden fuera de A:Q, en particular observaciones. Mantener mayúsculas, variantes, espacios y texto original en `raw_source` mientras se normaliza una copia para búsquedas.

### B2.2 Hoja `INFORMACION DETALLADA` (materiales históricos)

**Fila 3:** `ACTA DE SERVICIO`, `DOCUMENTO`, `Cliente`, títulos `LINEA DE PRODUCTO 1` ... `LINEA DE PRODUCTO 15`. **Fila 4:** subencabezados. **Datos observados:** desde fila 5.

| Columnas | Origen | Interpretación |
|---|---|---|
| A | ACTA DE SERVICIO | número de acta referenciado |
| B | O.P | documento/orden O.P histórica |
| C | REMISION | referencia remisión |
| D | LOTE | lote cabecera |
| E | Cliente | cliente textual repetido en detalle |
| F:I | Ítem 1 / lote / cantidad / número de cajas | bloque 1 |
| J:M | Ítem 2 / lote / cantidad / número de cajas | bloque 2 |
| N:Q | Ítem 3 / lote / cantidad / número de cajas | bloque 3 |
| R:U | Ítem 4 / lote / cantidad / número de cajas | bloque 4 |
| V:Y | Ítem 5 / lote / cantidad / número de cajas | bloque 5 |
| Z:AC | Ítem 6 / lote / cantidad / número de cajas | bloque 6 |
| AD:AG | Ítem 7 / lote / cantidad / número de cajas | bloque 7 |
| AH:AK | Ítem 8 / lote / cantidad / número de cajas | bloque 8 |
| AL:AO | Ítem 9 / lote / cantidad / número de cajas | bloque 9 |
| AP:AS | Ítem 10 / lote / cantidad / número de cajas | bloque 10 |
| AT:AW | Ítem 11 / lote / cantidad / número de cajas | bloque 11 |
| AX:BA | Ítem 12 / lote / cantidad / número de cajas | bloque 12 |
| BB:BE | Ítem 13 / lote / cantidad / número de cajas | bloque 13 |
| BF:BI | Ítem 14 / lote / cantidad / número de cajas | bloque 14 |
| BJ:BM | Ítem 15 / lote / cantidad / número de cajas | bloque 15 |

**Algoritmo conceptual (NO ejecutar todavía):** por cada fila de detalle con identificador de acta, leer la clave y cabecera A:E; iterar `block_index = 1..15`, con base de columna 6 + 4 × (índice − 1); extraer en orden `[descripcion, lote, cantidad, cajas]`. Si las cuatro están realmente vacías o son ceros considerados marcadores según regla validada, omitir; si existe cualquier contenido real, crear **línea en staging** conservando índice de bloque, nombre y valor original de cada celda. Valorar separadamente los ceros genuinos antes de tratarlos como marcadores vacíos.

**Advertencia crucial de negocio:** `PEDIDO:xxxx`, cantidades escritas con unidades como `10G`, cajas fraccionarias (`0.5`) y otros textos pueden aparecer en bloques. No dar por hecho que cada bloque es una mercancía válida, ni que cero siempre significa vacío: clasificar anotación/cabecera auxiliar/unidad/ítem y solicitar reglas al responsable.

### B2.3 Hojas que NO se importan como transacciones adicionales

- `DATOS DE ENTRADA.`: formulario interactivo de captura; estudiar para identificar reglas, etiquetas, validaciones, macros asociadas, valores por defecto y nomenclatura; **no** importar sus celdas como otra acta histórica sin evidencia explícita.
- `ITEMS DETALLADOS` (oculta): formulario auxiliar de hasta 15 posiciones; estudiar su uso; no interpretar automáticamente como otra tabla independiente de hechos.
- `ACTA DE SERVICIO`: vista de presentación derivada de `VLOOKUP`, no un tercer almacén de actas; estudiar formato/semántica y fórmulas, no importar su vista actual como registro histórico adicional.

## B3. Modelo de destino: normalización y procedencia

Adaptar a las entidades que ya existan en Sterinova; **no crear nombres de tablas duplicados** si el backend ya cubre las funciones. Entidades lógicas necesarias:

1. **ImportBatch**: ID de lote; hash SHA-256; nombre original; tamaño; tipo; fecha recepción; usuario; tenant/instalación; versión del mapeo; nombre de plantilla Excel reconocida; estado; conteos; ruta segura del binario; resultado; auditoría de aprobaciones.
2. **ImportSourceRow**: batch; nombre de hoja; número de fila; clave Excel original; `raw_json` tipado o serializado sin pérdida; firma/hash de registro; etapa de importación; problemas detectados; fila destino; identidad de transformador; fecha de resolución.
3. **ImportSourceItem**: source row; número de bloque 1..15; direcciones originales (F:I etc.); descripción/lote/cantidad/cajas **en bruto**; propuesta normalizada; estado de validación; marca de clasificación (producto/anotación/desconocido).
4. **LegacyActa / registro histórico**: acta histórica o vínculo a módulo de documentos existente; número original; cliente histórico; tipo de servicio; estados; fechas; responsables; origen y control de certeza; evitar atribuir “emitida digitalmente” si solo hay dato Excel.
5. **ActaItem / material de acta**: una fila por producto o anotación tipificada, orden original de aparición, lote, cantidad, unidad de medida, cajas, procedencia; sin límite de 15.
6. **ImportIssue**: error, advertencia, conflicto, omisión o ambigüedad; código estándar; severidad; hoja/fila/celda; valor protegido; sugerencia; resolución humana y actor.
7. **ImportLink/LegacyMap**: mapa `(source_namespace, workbook_hash, sheet, row, block) -> target_entity, target_id`; y relación de clave histórica de acta a la entidad; permite reintentos idempotentes y auditoría.
8. **ImportAuditEvent**: historial de carga, análisis, aprobación, ejecución, saltos, reconciliación, reversión, actor, fecha y resultado.

**Unicidad:** la identidad de un ítem importado nunca depende solo de `acta_numero`, porque este se repite. Definir identificador de origen compuesto (`source_system`, `hash`, `sheet`, `row_number`, `block_index`), y estrategia adicional de reconciliación por claves de negocio y huellas de contenido **para recargas de versiones editadas del mismo Excel**. Importar el mismo archivo exacto no debe duplicar datos; un archivo distinto con filas similares tampoco debe sobrescribir silenciosamente.

**Relación de entidades:** muchas líneas para un registro histórico; posibles muchas filas Excel por número de acta; posible que un solo número represente varias versiones/correcciones o duplicados. Prohibido imponer llave única por número de acta hasta clasificar los casos. Al importarse una fila sin cabecera, conservar como `legacy_unmatched` / `staging_unlinked` o tipo equivalente, no descartarla.

**Procedencia:** almacenar siempre dato original, parseo, normalización y valor confirmado cuando exista; distinguir “información suministrada por archivo histórico” vs “validado por operador” vs “documento emitido por sistema”. Nunca mezclar importación histórica con operativa actual sin etiqueta.

## B4. Arquitectura del flujo de importación dentro de la aplicación

No construir un script irrepetible como única solución. Diseñar un **módulo administrativo de importación** reutilizable, seguro y observable, integrándolo con permisos y almacenamiento existentes.

### Paso 0 — Descubrimiento de arquitectura y políticas

Leer módulos, endpoints, servicios y bases existentes para determinar autenticación, autorizaciones, tenencia, archivos, tareas en segundo plano, auditoría, transacciones y soporte `.xlsm` de biblioteca elegida. No escoger la librería de Excel sin comprobar su compatibilidad, consumo de memoria, lectura `data_only` y protección frente a archivos hostiles.

### Paso 1 — Carga segura

- UI restringida a roles autorizados; HTTPS, límite de tamaño configurable, cuotas, autenticación, comprobación de extensión **y firma/contenido** (OOXML ZIP), control de descompresión excesiva, entradas ZIP peligrosas, hojas masivas, enlaces externos y contenido no esperado.
- Preservar bytes originales inmutables en almacenamiento privado con hash SHA-256, ID del lote, usuario y fecha; nunca dar acceso directo a rutas locales.
- Archivo `.xlsm`: **NO ejecutar VBA**, NO abrir mediante automatización de Excel con macros activas, NO resolver vínculos externos y NO recalcular celdas mediante apertura en Office. Solo lectura de datos estáticos OOXML. Macro binaria puede conservarse archivada si política interna lo permite; nunca ejecutarla.
- Comprobar hash contra archivos y lotes previos; informar `archivo idéntico ya cargado`, permitiendo consultar resultado previo sin duplicar registros.

### Paso 2 — Reconocimiento de plantilla

- Inventariar hojas, visibilidad, número real de filas con datos y encabezados. Validar **nombres exactos y aliases documentados** (acentos, puntos, espacio, mayúsculas) de forma controlada; no adivinar si faltan hojas críticas.
- Reconocer filas 3/4 de cabeceras y esquema de 15 grupos F:BM; detectar esquemas futuros con diferentes números de grupos y versionar importador (`excel_schema_version`).
- Analizar `sharedStrings`, `inlineStr`, celdas numéricas/texto, formatos `date` y `time`, vacíos, fórmulas y caches, celdas combinadas, filas ocultas y datos fuera de rangos nominales.
- Evitar dependencia de `max_row/max_column` en libros con formatos extendidos; limitar extracción efectiva a celdas usadas y columnas pertinentes, registrar contenido inesperado para revisión.
- Detectar referencias/celdas con fórmulas y valores cacheados: rechazar o etiquetar si los datos transaccionales del origen son fórmulas sin cache fiable. Jamás usar vistas derivadas como segunda fuente.

### Paso 3 — Extracción controlada a *staging*

- Procesar en streaming/bloques para proteger RAM y límites de request; no devolver todas las filas al frontend.
- Leer `INFORMACION ENTRADA` y `INFORMACION DETALLADA` en dos flujos independientes.
- Guardar cada fila relevante y sus campos brutos **antes de limpiar**; hash por fila y fuente; rastreo exacto `sheet`, `row`, `cell`.
- Despivotar los quince grupos de detalle a ítems individuales, incluyendo número de bloque y posiciones originales.
- En valores numéricos, preservar el **texto original** y la interpretación numérica en campos distintos; soportar coma decimal, puntos de miles y unidades **solo según reglas verificadas**.
- Convertir fechas seriales respetando el sistema base 1900/1904 indicado en el libro; contemplar la anomalía histórica de 1900 en Excel, zona horaria local, fechas inválidas y horas fraccionarias. No transformar fecha sin su formato/metadatos y evidencias.
- Manejar sentinelas `NA`, `N/A`, `NO APLICA`, `0`, cadenas vacías de modo por campo, no con una limpieza global.
- Conservar tildes, símbolos, saltos de línea, nombres y códigos con ceros iniciales.
- No hacer matching automático irreversible de clientes por parecido de nombre. Si hay tabla de clientes, emparejar por identificador confiable o presentar candidatos y confirmación.

### Paso 4 — Validación, conciliación y clasificación

Construir reporte y revisión humana de, como mínimo:

- `HEADER_DUPLICATE_EXACT` y `HEADER_DUPLICATE_CONFLICT`: mismo número de acta, filas exactamente iguales o distintas.
- `DETAIL_DUPLICATE_EXACT` y `DETAIL_DUPLICATE_CONFLICT`: mismo número, filas iguales o diferentes.
- `HEADER_WITHOUT_DETAIL` y `DETAIL_WITHOUT_HEADER`.
- `MISSING_ACTA_ID`, `MISSING_CLIENT`, `MISSING_ITEM_DESC`, `MISSING_LOT`, `MISSING_QUANTITY`, `MISSING_BOXES` cuando su obligatoriedad esté validada.
- `NON_NUMERIC_QTY`, `NON_NUMERIC_BOXES`, `NEGATIVE_VALUE`, `FRACTIONAL_BOXES` (este último puede ser permitido), `UNEXPECTED_UNIT`, `ZERO_MARKER_AMBIGUOUS`.
- `DATE_TIME_INVALID`, `FORMULA_UNTRUSTED`, `UNKNOWN_SERVICE`, `STATUS_NOT_MAPPED`, `CLIENT_AMBIGUOUS`, `OUT_OF_SCHEMA_DATA`.
- Conflicto de nombre de cliente y datos de documento entre cabecera y detalle para un mismo número de acta.
- Anotaciones como `PEDIDO:` y otros textos usados en campos de producto; conservarlas como observación candidata, no eliminarlas por defecto.

**Distinguir:** 

1. **Importable automáticamente**: fila que satisface reglas validadas y no tiene colisión ni ambigüedad.
2. **Importable con advertencia**: anomalía no bloqueante que se conserva y comunica (p. ej. campo opcional ausente).
3. **Pendiente de conciliación**: duplicado conflictivo, cabecera faltante, cliente dudoso, valor ambiguo, relación con orden no comprobada.
4. **Rechazado**: archivo inválido, filas no interpretables bajo esquema, incumplimientos de seguridad o integridad no tolerables.

**Prohibido** descartar automáticamente los 2.012 números solo presentes en detalle o fusionar todo bajo un número de acta. Puede conservarse información útil sin declarar esa acta completa.

### Paso 5 — Vista previa / *dry-run*

La aplicación debe mostrar **antes de confirmar**:

- Archivo, hash abreviado, fecha y usuario, plantilla detectada, hojas y rangos.
- Cabeceras encontradas, detalles encontrados, ítems brutos, ítems reconocidos, ítems por revisar, duplicados idénticos, conflictos, huérfanos, fechas inválidas y errores.
- Ejemplos anonimizados y drill-down por hoja/fila/celda para los permisos correspondientes.
- Tabla de correspondencia *campo Excel → campo destino*, transformaciones planeadas, campos no mapeados, política para documentos no reconstruibles.
- Cuántos registros se **crearían**, **vincularían**, **omitirían**, **bloquearían**, **quedarían pendientes** y **actualizarían** (si se autoriza un modo explícito de actualización).
- Exportación del informe de anomalías de forma restringida, sin exponer datos sensibles en logs.
- Confirmación separada de políticas para huérfanos, duplicados y clientes; no usar una casilla genérica que silenciosamente acepte resolver conflictos arbitrariamente.

### Paso 6 — Confirmación y ejecución real (solo cuando se autorice)

- Revisión/permiso de operador autorizado y, si procede, segundo aprobador para cargas masivas.
- Congelar la versión del mapeo y los datos validados de staging; confirmar que el hash, la versión y el estado del lote no cambiaron desde el dry-run.
- Procesar en **jobs** por lotes con límites; transacciones pequeñas por unidad de negocio y reintentos idempotentes. No una sola transacción gigante que bloquee la base.
- Insertar o vincular entidades existentes sin duplicar clientes, órdenes, actas ni detalles; respetar las claves únicas compuestas y los controles de concurrencia.
- Gestionar fallos parciales con política definida `all-or-nothing` por acta o unidad, no dejar cabeceras confirmadas con items parciales sin estado detectable.
- Persistir relación de cada registro destino con origen y lote; métricas de ejecución y resumen final, contabilización de filas/ítems y errores.
- Importaciones iguales sucesivas devuelven resultados anteriores o hacen *skip* idempotente. No generar PDF institucional definitivo automáticamente para datos insuficientes.

### Paso 7 — Post-importación, correcciones y reversibilidad

- Comparar conteos origen vs staging vs creados/vinculados/pendientes/rechazados con ecuaciones de conciliación verificables.
- Consultar registros importados desde interfaz con badge o estado **ORIGEN: EXCEL HISTÓRICO**, datos de importación, fecha, fila, usuario y eventos.
- Poder reabrir y resolver incidencias; aplicar correcciones auditadas sin borrar el valor Excel original.
- Reversión controlada por lote cuando no haya dependencias posteriores: análisis previo de efectos, permisos especiales, audit trail y políticas de borrado lógico o desasociación. Nunca borrar operaciones posteriores legítimas que ya utilicen un registro importado.
- Backups, simulación en entorno de pruebas con datos anonimizados y recuperación validada antes de cargar producción.

## B5. Cómo relacionar el histórico Excel con Orden y Acta de Servicio

El Excel no contiene de manera evidente una tabla completa de órdenes `R-ES-02`. No se puede convertir automáticamente cada acta en una orden real. Diseñar tres escenarios:

- **Acta histórica con orden vinculable:** existe identificador O.P/remisión u otra clave comprobable y la orden ya existe (o puede ser reconstruida de forma suficientemente confiable). Vincular con evidencia y reglas aprobadas.
- **Acta histórica sin orden comprobable:** conservar como acta/registro histórico independiente, con `legacy_order_unverified`; no fabricar una orden ni afirmar trazabilidad falsa.
- **Detalle histórico sin cabecera:** conservar materiales/ítems en staging o registro histórico parcial y permitir vincular o completar manualmente tras revisión. No perder ni mezclar con otra acta homónima.

Los PDFs `Orden de Servicio.pdf` y `Acta de Servicio.pdf` son **referencias visuales y semánticas**, no valores de datos a importar. La impresión de documentos importados exige política: (a) conservar solo historial, (b) generar reproducción marcada `RECONSTRUCCIÓN A PARTIR DE DATOS HISTÓRICOS` o similar, y/o (c) recuperar el PDF original si existe. No emitir retroactivamente como original un documento con campos desconocidos o firmas no verificadas.

## B6. Reglas de seguridad para XLSM y riesgos de hoja de cálculo

- Tratar cada archivo cargado como no confiable: validar tipo ZIP/OOXML, entradas, relaciones externas, descompresión, entidades XML, tamaño, tiempo de parseo, hojas y celdas máximas. Rechazar ZIP bombs y rutas maliciosas.
- **Nunca ejecutar macros**; no usar `Excel.Application.Run`, abrir Excel con contenido habilitado, ni usar acceso externo durante parseo.
- Si se generan reportes CSV/XLSX de errores, escapar celdas que comiencen por `=`, `+`, `-`, `@` u otros patrones de inyección de fórmula; no propagar fórmulas de Excel heredadas a reportes sin neutralización.
- HTML/PDF: escapar texto y sanitizar valores para prevenir inyección HTML, script o rutas. Proteger archivos con política de retención y acceso por rol.
- Evitar guardar todo el contenido en logs de producción, dashboards, mensajes de error o trazas de agente; anonimizar ejemplos de clientes y responsables.
- Permisos: subir, previsualizar, resolver conflictos, aprobar, ejecutar importación y revertir pueden ser privilegios diferentes.
- Documentar retención de XLSM original, staging, errores, copias de seguridad y archivo final; tener plan de eliminación bajo política de datos, nunca silenciosa.

## B7. Contratos de API tentativos — SOLO si encajan con el backend real

No crear estos endpoints automáticamente; buscarlos primero y proponer adaptación:

```text
POST /logistica/importaciones/archivos        // carga, hash y análisis seguro
GET  /logistica/importaciones                 // lotes y estados
GET  /logistica/importaciones/:id             // resumen del lote
GET  /logistica/importaciones/:id/preview     // dry-run paginado
GET  /logistica/importaciones/:id/incidencias // paginado y filtros
PATCH /logistica/importaciones/:id/incidencias/:issueId // resolución auditada
POST /logistica/importaciones/:id/aprobar     // aprobación, roles
POST /logistica/importaciones/:id/ejecutar    // job idempotente
GET  /logistica/importaciones/:id/resultado   // conteos, links y fallas
POST /logistica/importaciones/:id/revertir    // solo si seguro y autorizado
```

Posibles estados de lote: `SUBIDO`, `ANALIZANDO`, `ANALIZADO`, `CON_INCIDENCIAS`, `LISTO_PARA_APROBAR`, `APROBADO`, `IMPORTANDO`, `IMPORTADO_PARCIAL`, `COMPLETADO`, `FALLIDO`, `REVERTIDO` y `CANCELADO`. Ajustar nomenclatura a las convenciones del proyecto, documentando transiciones y permisos.

## B8. Pantallas recomendadas en el módulo Logística

- **Importaciones históricas:** tabla de cargas con archivo, fecha, hash parcial, usuario, estado, conteos y acciones permitidas.
- **Cargar archivo XLSM:** selector seguro, requisitos, tipo detectado, reglas de privacidad, opción de solo analizar, progreso sin congelar interfaz.
- **Vista previa:** resumen, diferencias, diagramas de conteo, distribución, mapeo origen-destino y muestras en lectura.
- **Conciliación de incidencias:** filtros por severidad, hoja, acta, fila; propuestas de resolución explícitas; historial de decisión.
- **Confirmar importación:** preflight, impacto calculado, aprobación según permisos y registro de decisión.
- **Historial de acta importada:** etiqueta de procedencia, original Excel, relaciones confirmadas, ítems, observaciones, documentos vinculados y auditoría.
- **No mezclar** registros históricos incompletos con órdenes operativas activas ni incluirlos automáticamente en indicadores de producción actual; definir filtros por fecha, estado y origen.

## B9. Casos de prueba obligatorios del importador

1. El mismo XLSM se sube dos o más veces (hash igual): **no duplica registros**.
2. Excel nuevo con parte de los mismos registros y algunos modificados: identificaciones diferenciadas, colisiones reportadas, sin sobrescritura automática.
3. Una acta duplicada de manera idéntica: se deduplica o se marca conforme a política, conservando evidencia de las filas de origen.
4. Un número de acta duplicado con contenido distinto: conflicto, no `first match wins`.
5. Detalle con acta sin cabecera: permanece en staging/registro parcial, nunca se pierde.
6. Cabecera sin detalle: se conserva y marca como incompleta según obligatoriedad.
7. 15 ítems ocupados: se importan todos en el orden correcto.
8. Bloque 3 poblado y bloques 1/2 vacíos: no se desplazan datos erróneamente, conservar `source_block_index`.
9. Descripción textual `PEDIDO:...` sin lote/cantidad: se preserva y clasifica, no se convierte en mercancía inventada.
10. Cantidad `10G` y `0,0502G`: preservar bruto; clasificación de unidad/decimal según reglas; no convertir a `10` sin evidencia.
11. Cajas fraccionarias (`0.5`): no redondear ni rechazar sin criterio de negocio.
12. Fechas Excel seriales y horas fraccionarias: resultados correctos, con prueba de sistema 1900/1904.
13. Celdas con blancos, `0`, `NA`, `NO APLICA`: transformación por campo sin borrar datos valiosos.
14. Campos con ceros a la izquierda y acentos: preservar semántica.
15. Hoja oculta y celdas fuera de impresión: comportamiento documentado y sin omisiones.
16. XLSM con macro maliciosa, vínculos externos o ZIP bomb: no ejecución ni efectos externos, rechazo seguro.
17. Excel con encabezados alterados: se detecta cambio de esquema, no se importan columnas corridas silenciosamente.
18. Excel de tamaño grande con filas/celdas extendidas por formato: consumos de memoria/tiempo acotados, progreso y timeout controlados.
19. Falla de base de datos a mitad de importación: reintento sin cabecera a medias ni duplicaciones.
20. Usuario sin permisos: no puede cargar, aprobar, ejecutar, ver datos de otros ámbitos ni revertir.
21. Exportar incidencias CSV: no permite ejecución de fórmulas por inyección.
22. No se generan órdenes artificiales ni PDFs “originales” basados en campos inexistentes.
23. Conteos de origen / staging / importación / excepciones concilian exactamente.
24. Un registro ya vinculado a operaciones activas no se borra mediante rollback destructivo.
25. El importador **no modifica el XLSM** y permite recuperar su hash y referencia de archivo.
26. La importación reconoce que filas de detalle pueden preceder cronológicamente a la cobertura de la hoja de entradas; no fuerza fecha de ingreso inventada.

**Prueba de aceptación sobre la copia conocida:** el descubrimiento inicial debe reproducir, o explicar las diferencias, de 1.617 filas de entrada, 3.651 de detalle, 9.982 bloques no vacíos según definición descrita, 1.598 claves coincidentes, 2 solo en entrada y 2.012 solo en detalle. Los 9.982 no son un número objetivo de ítems válidos: los conteos finales se desglosan en productos, anotaciones, incompletos y descartes explicados.

## B10. Análisis solicitado al agente: entregables adicionales y evidencia

Agregar a los entregables de la PARTE A los siguientes archivos `.md` bajo la ubicación de documentación ya usada por el repositorio (si existe otra convención, adaptarse). Durante la auditoría el agente debe **proponer** estas salidas o escribirlas solo si está autorizado a crear documentación; ningún cambio de código/datos:

1. `AUDITORIA_EXCEL_LOGISTICA.md`: estructura real XLSM, hojas, tipo de celdas, fórmula/macro detectada (sin ejecución), dimensiones, ejemplos anonimizados, anomalías, fechas, columnas, riesgos.
2. `DICCIONARIO_MAPEO_EXCEL_A_BD.md`: matriz hoja/celda/rango → significado validado → entidad/campo existente → transformación → validación → manejo de nulos/unidades → estado de certeza.
3. `REPORTE_CALIDAD_MIGRACION.md`: conteos, duplicados idénticos/conflictivos, huérfanos, registros incompletos, valores no numéricos, cliente/fecha/estado, riesgos priorizados y decisiones pendientes.
4. `DISENO_IMPORTADOR_XLSM.md`: módulos y ubicación exacta en arquitectura existente, archivos reutilizables, estrategia de jobs/transacciones, almacenamiento, hash, idempotencia, staging, conciliación, endpoints, UI, permisos y costos.
5. `PLAN_MIGRACION_HISTORICA.md`: fases, dependencias, prueba en staging, backup, plan de reversión, criterios de go/no-go, reconciliación y controles post-producción.
6. `MATRIZ_TRAZABILIDAD_ORDEN_ACTA_HISTORICO.md`: qué campos provienen del XLSM, cuáles del PDF, cuáles del sistema, cuáles no se pueden reconstruir, reglas para vincular actas históricas con órdenes existentes y restricciones para emitir reproducciones.
7. `PRUEBAS_IMPORTADOR_Y_DOCUMENTOS.md`: casos automatizados y pruebas de aceptación, incluyendo fidelidad visual de ambos formatos, filas dinámicas y paginación.
8. Actualización del **plan maestro del módulo de Logística** para priorizar importador histórico antes del corte operativo, sin detener el desarrollo normal de formularios y documentos.

### Formato requerido para cada afirmación del agente

`[OBSERVADO]` con evidencia exacta `archivo / hoja / celda / fila` para Excel, `PDF página y región` para formatos y `ruta:línea` para repositorio.  
`[INFERIDO]` cuando la deducción tenga justificación, pero no certeza.  
`[PROPUESTO]` para nueva arquitectura y decisiones de diseño.  
`[PENDIENTE DE CONFIRMAR]` para datos o reglas de negocio no verificables.

**No publicar valores personales sensibles ni los archivos en servicios externos.** En el chat presentar agregados, no filas completas con información de clientes.

## B11. Plan global integrado y orden de ejecución requerido

**Auditoría previa (sin tocar código ni datos):**

1. Localizar backend y frontend reales; inventariar módulos relacionados con Logística, clientes, órdenes, producción/esterilización, entrega, facturación, documentos, usuario, auditoría, archivos, importaciones y permisos.
2. Leer ambos PDF con inspección visual; mapear apartados y campos; registrar inconsistencias de código/versión e identificar secciones que exigen paginación dinámica.
3. Leer XLSM estáticamente; verificar hash, hojas, encabezados y bloques, estadísticas y calidad completa; inspeccionar VBA de manera segura **solo si herramientas confiables lo permiten y hay motivo funcional**, sin ejecutarlo; documentar cualquier comportamiento no comprobado.
4. Comparar el modelo de Excel con entidades reales; distinguir campos reutilizables, faltantes, ambiguos y origen histórico.
5. Proponer arquitectura unificada del módulo, motor de plantillas y importador histórico, con diferencias respecto al proyecto actual y reutilizaciones concretas.
6. Elaborar mapa de riesgos, decisiones, criterios de aceptación y cronograma lógico por fases, sin estimaciones inventadas.
7. Emitir informes, con **primero un resumen ejecutivo de brechas**, luego los detalles y anexos de evidencia. **DETENERSE** y pedir aprobación para la implementación.

**Solo después de autorización:**

8. Implementar o ajustar esquema (migraciones reversibles), autorizaciones, y servicio de importación segura con `dry-run`.
9. Construir UI de carga, análisis, incidencias y aprobación. Probar con copia local en entorno no productivo, reconciliar conteos y conflictos.
10. Implementar carga confirmada, seguimiento, idempotencia, recuperación y auditoría. Importar historial según reglas de negocio aceptadas.
11. Integrar formularios actuales de órdenes y actas, enlazarlos con la operación, generar PDFs dinámicos visualmente fieles y versiones de plantilla, evitando doble digitación.
12. Ejecutar pruebas end-to-end, visuales, de seguridad, performance, migración y no-regresión; llevar a producción solo con respaldo verificado y aprobación.

### Preguntas críticas que deben quedar explícitas en el informe, sin detener exploración

- ¿El número del acta tiene unicidad global, por año, por cliente o por otro ámbito?
- ¿Los múltiples renglones con igual acta representan corrección, duplicación, servicios distintos o reimportación?
- ¿Las 2.012 actas presentes solo en detalle son históricas válidas fuera de cobertura de entrada?
- ¿Una línea `PEDIDO` es producto, observación u otra referencia?
- ¿Qué significan los decimales en cajas y las cantidades con unidad (G, etc.)?
- ¿Qué campos de orden original NO pueden extraerse del Excel?
- ¿Qué condiciones habilitan generar un PDF reconstruido y qué campos requieren captura humana?
- ¿Qué políticas de versión de plantilla y edición histórica se aplican?
- ¿La importación inicial deberá ser una sola carga o se permitirán nuevas exportaciones periódicas?
- ¿Qué campos y estados actuales del backend hay que reutilizar para evitar entidades paralelas?
- ¿Cuáles roles pueden importar, aprobar, rectificar y revisar históricos?

## B12. Instrucción de cierre al agente

No responder con “solo hay que crear un importador” ni con una migración SQL genérica. Entregar **auditoría verificable del sistema y del XLSM**, diccionario exacto de columnas y bloques, calidad de datos con errores cuantificados, arquitectura integrada, compatibilidad con órdenes/actas PDF y un plan de implementación segura con pruebas. **Detenerse tras la auditoría hasta aprobación de cambios**. Usar skills de forma puntual, scripts de resumen local, y preservar contexto en documentación breve para minimizar tokens en sesiones posteriores.
