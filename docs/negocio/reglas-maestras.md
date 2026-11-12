# Reglas maestras de negocio — ocho módulos

> Actualización posterior: consultar la [hoja de ruta integral del 12 de noviembre de 2026](hoja-ruta-integral-2026-11-12.md). Consolida decisiones adicionales y correcciones del usuario sobre emisión comercial, documentos, parciales, ciclos mixtos, recetas, inventario y Calidad. En caso de conflicto, prevalecen esas decisiones confirmadas; sus propuestas técnicas no equivalen a reglas aprobadas ni a implementación.

Consolidación: 10 de noviembre de 2026. Requisitos al 9 de noviembre; no acredita implementación.

Se reúnen íntegramente las ocho reglas del frontend, preservando decisiones, propuestas y pendientes. Las reglas oficiales se mantienen en este documento desde el 11 de noviembre de 2026. Los cuestionarios originales se conservan en cuestionarios-origen.md. Una propuesta no se convierte en decisión confirmada por consolidarla. Diseño objetivo: [roles y permisos](../arquitectura/roles-y-permisos.md).


<a id="modulo-1"></a>

---

# Módulo 1 — Autenticación y usuarios: reglas de negocio

Fecha de actualización: 9 de noviembre de 2026.

Estado: respuestas del Módulo 1 incorporadas; no requiere repetir el interrogatorio. Este documento describe requisitos del negocio, no certifica su implementación.

Fuente principal: respuestas entregadas por el usuario en `Módulo 1 — Autenticación y usuarios.md`, adjunto desde `C:\Users\urria\Downloads`, y su instrucción de organizar el interrogatorio. Las respuestas más recientes prevalecen sobre propuestas y matrices anteriores cuando difieran.

Las preguntas originales se conservan, sin respuestas ni modificaciones, en [el cuestionario del Módulo 1](cuestionarios-origen.md#modulo-1). Este documento contiene su resolución y las implicaciones para los demás módulos.

## 1. Organización y jerarquías

- La empresa se organiza por áreas.
- El gerente general puede consultar todo el sistema.
- El gerente comercial tiene alcance sobre el área Comercial; cada área tiene su responsable, por ejemplo el jefe de Calidad.
- En Comercial existen varios trabajadores o asesores que gestionan cotizaciones.
- El SuperAdmin tiene facultades superiores a las del gerente general. Son responsabilidades diferenciadas: visibilidad global del negocio no equivale automáticamente a administración técnica de la plataforma.
- La respuesta no enumera todas las áreas ni detalla cada facultad adicional del SuperAdmin. No se inventan sedes, plantas, niveles jerárquicos ni excepciones.

## 2. Roles y asignaciones

- Los cinco roles legados no constituyen un catálogo definitivo.
- Debe ser posible crear roles y configurar sus funciones conforme evolucione la organización.
- Una persona puede desempeñar varios roles en distintos equipos o plantas.
- Las funciones y permisos son dinámicos; no se deben fijar por nombre de persona ni por un listado cerrado de cargos.
- La respuesta confirma la multiplicidad de roles; no fija duración, vencimiento automático ni mecanismo de suplencias temporales.

## 3. Facultades comerciales y aprobación

- Los asesores comerciales pueden crear, editar y descargar cotizaciones conforme a sus permisos configurados.
- El jefe aprueba la cotización y el asesor la emite al área correspondiente.
- La aprobación del jefe y la emisión por el asesor son actuaciones diferentes y deben conservar sus responsables.
- No se considera que el permiso de editar otorgue por sí solo la aprobación del jefe.
- Actualización con las respuestas del Módulo 3: quien crea no aprueba; el gerente comercial o administrador autorizado aprueba para enviar al cliente. Después de la aceptación del cliente, el asesor emite y pasa al siguiente ciclo. La propuesta de estados y sus límites se desarrolla en [Cotizaciones](reglas-maestras.md#modulo-3).

### Anulación con aprobación

1. El asesor solicita la anulación.
2. La solicitud debe incluir una observación antes de la aprobación.
3. El administrador de su área aprueba la solicitud.
4. La solicitud del asesor no equivale por sí sola a una anulación aprobada.

La anulación debe distinguirse de la eliminación física. Los estados afectados, las consecuencias sobre órdenes o certificados y el tratamiento de solicitudes rechazadas se desarrollarán en sus módulos; no quedan decididos por esta respuesta.

## 4. Visibilidad de clientes, cotizaciones y responsabilidad

- Ante la pregunta sobre ver registros propios, del equipo o todos, el usuario respondió: «Todos, esto le permite seleccionar el cliente para esa cotización».
- Se registra la decisión de visibilidad compartida en Comercial y, expresamente, la posibilidad de seleccionar clientes existentes aunque no los haya creado el asesor.
- No se debe mantener la restricción anterior de acceso exclusivamente propio como si fuera la decisión definitiva del negocio.
- La respuesta no distingue explícitamente si «todos» comprende todas las cotizaciones de la empresa o las del área, ni concede acceso a otras áreas. Esa delimitación no se presume.
- El asesor que toma un cliente lleva todo el proceso; la reasignación es excepcional.
- No se ha definido un procedimiento de reasignación ni un autorizador específico para ese caso excepcional.

## 5. Administración de usuarios

- El gerente comercial y cada administrador de área pueden crear usuarios, asignar permisos y desactivarlos dentro de la responsabilidad de su área.
- Los casos sensibles requieren análisis específico; no se consideran autorizados de manera general por esta regla.
- La administración de área no se documenta como permiso para conceder SuperAdmin o facultades globales.
- La respuesta no define el tratamiento de una desactivación cuando la persona conserva funciones en otras áreas; no se asume una desactivación global automática.

## 6. Recuperación de contraseña

El usuario delega la elección de la solución y admite recuperación desde el login o renovación por el jefe de área.

Propuesta documental para concretar esa delegación, todavía no implementada:

- Ofrecer recuperación desde el login mediante un enlace de restablecimiento de un solo uso al correo registrado.
- Permitir al administrador autorizado del área iniciar un restablecimiento para el usuario.
- El restablecimiento permite establecer una contraseña nueva; no revela ni comparte la contraseña actual.
- Si se utiliza una credencial temporal, exigir su sustitución en el siguiente ingreso.

Estos mecanismos son una propuesta de diseño derivada de la delegación, no respuestas textuales del usuario. La vigencia del enlace, el canal disponible y los controles de sesión se definirán al diseñar la implementación.

## 7. Sesión y continuidad del trabajo

- Duración de sesión solicitada: 10 horas, conforme a la respuesta «Diría que 10 horas» y su reiteración posterior.
- El trabajo en curso debe conservarse hasta terminarlo o cerrarlo.
- Si se interrumpe la red, al restablecerse la conexión debe recuperarse el avance que llevaba el usuario.
- La duración de la sesión y la conservación del trabajo son requisitos distintos. Recuperar un avance no debe confundirse con haber confirmado una operación en el servidor.
- No se ha fijado si las 10 horas son absolutas o renovables, ni un plazo de inactividad, número de sesiones simultáneas o segundo factor.
- La respuesta tampoco precisa el significado de cerrar un proceso respecto de conservar o descartar su borrador, ni la política de invalidación inmediata por cambio de permisos. Estos detalles no se presentan como decisiones ya tomadas.

## 8. Auditor y exportación

- Debe existir un acceso o rol de auditor.
- Entre sus funcionalidades se contempla exportar a Excel información de cotizaciones y certificados.
- El usuario anticipa más funcionalidades de auditoría; esta lista no es exhaustiva.
- La respuesta no otorga facultades de edición, aprobación, emisión o anulación al auditor.
- La visibilidad exacta, columnas exportables, plazo de conservación de auditoría y tratamiento de los registros de usuarios retirados no se especifican en las respuestas recibidas.
- El nuevo acceso de auditor no se equipara automáticamente al rol previo `auditor_calidad`: su alcance solicitado incluye también información comercial.

## 9. Regla transversal: múltiples servicios por cotización

El usuario indica que un mismo cliente puede solicitar más de un servicio dentro de una misma cotización.

- Esta necesidad queda registrada como requisito de negocio para el Módulo 3.
- No debe descartarse por la existencia actual de un único tipo de servicio por cotización.
- Debe considerarse al definir aprobaciones por área, emisión al área correspondiente, desglose de servicios y generación de órdenes.
- La observación no determina todavía cómo se agrupan los servicios, sus impuestos, sus formatos o sus órdenes.

Referencia de continuidad: pregunta 23 del [cuestionario de Cotizaciones](cuestionarios-origen.md#modulo-3). La necesidad de múltiples servicios ya fue expresada; la pregunta original se conserva por trazabilidad, no para desconocer esta respuesta.

## 10. Alcance de esta actualización

- Las diez respuestas del Módulo 1 quedan incorporadas sin solicitar una nueva ronda de preguntas.
- Los puntos no especificados se distinguen de los requisitos confirmados para evitar convertir supuestos en reglas aprobadas.
- El contrato RBAC existente es un antecedente técnico; deberá reconciliarse con estas respuestas antes de una futura implementación, especialmente respecto de visibilidad comercial, aprobación del jefe, emisión y rol de auditor.
- No se modifican permisos efectivos, sesiones, datos, contratos API ni código de producción en esta fase.
- El siguiente bloque de respuestas corresponde al [Módulo 2 — Clientes](cuestionarios-origen.md#modulo-2).


<a id="modulo-2"></a>

---

# Módulo 2 — Clientes: reglas de negocio

Fecha de actualización: 9 de noviembre de 2026.

Estado: respuestas 11 a 20 incorporadas. Documento de análisis de negocio; no certifica implementación ni modifica datos de clientes.

Fuente principal: archivo entregado por el usuario `Módulo 2 -Clientes.md`, ubicado en `C:\Users\urria\Downloads`. Se distinguen las decisiones expresas de las propuestas solicitadas al analista y de los detalles aún no especificados.

Las preguntas originales se conservan en el [cuestionario del Módulo 2](cuestionarios-origen.md#modulo-2). La organización y los permisos generales se complementan con las [reglas del Módulo 1](reglas-maestras.md#modulo-1).

## 1. Identificación y tipos de cliente — respuestas 11 y 12

### Decisiones recibidas

- Admitir distintos tipos de identificación: CC, NIT, CE, PET y otros que correspondan.
- Se conserva literalmente la denominación «PET» del usuario; no se sustituye por otra sigla por suposición.
- La identificación puede llegar con distintas presentaciones desde Excel. Los ejemplos dados son `100300654` para cédula y `789.987.675-1` para NIT.
- Los ejemplos describen presentación, no acreditan que un número sea válido.

### Propuesta de análisis

- Separar el tipo de documento de su número; no presentar todas las identificaciones como NIT.
- Tratar los identificadores como texto para conservar ceros iniciales y evitar conversiones numéricas de Excel.
- Normalizar la identificación según su tipo para comparar duplicados, conservando el valor original importado como evidencia de origen.
- Para NIT, distinguir número y dígito de verificación; las diferencias de puntos, espacios o guiones no deberían crear clientes distintos.
- No inferir automáticamente el tipo de documento solo por su longitud o apariencia. Una identificación ambigua debe quedar para revisión.

No se ha confirmado una regla obligatoria de validación del dígito de verificación, el catálogo completo de identificaciones ni la correspondencia de cada tipo con personas naturales, entidades públicas o clientes extranjeros. No se declaran requisitos legales a partir de estos ejemplos.

## 2. Unicidad del cliente — respuesta 13

### Decisiones recibidas

- El NIT identifica de forma única al cliente en este sistema.
- Un cambio de razón social no implica crear un segundo cliente con el mismo NIT.
- No se deben registrar clientes duplicados bajo un mismo NIT.

### Propuesta de análisis

- Ante un NIT ya registrado, reutilizar el registro existente o presentar su actualización para revisión; no crear otra ficha.
- Para identificaciones distintas de NIT, utilizar tipo y número normalizado como criterio de comparación, sujeto a la definición del catálogo.
- No usar únicamente la razón social como identificador: puede cambiar y también puede coincidir entre registros distintos.
- Si una identificación viene incompleta o contradictoria, no fusionar registros automáticamente.

La afirmación del usuario se documenta como regla de unicidad del sistema, no como una conclusión jurídica sobre estructuras empresariales.

## 3. Direcciones, sedes y verificación — respuesta 14

### Decisiones recibidas

- La información utilizada dependerá de los datos efectivamente registrados para cada cliente.
- La importación debe agilizar la captura, pero exige validar cliente por cliente que la información sea verídica.
- Importar una fila no equivale a validar automáticamente su contenido.

### Propuesta de análisis

- Distinguir el origen importado del estado de revisión del cliente; conservar quién revisó los datos y cuándo.
- Presentar la información consolidada al asesor para su revisión antes de considerarla validada.
- Mantener una dirección principal y permitir direcciones adicionales identificadas por uso cuando los datos reales lo requieran.
- Seleccionar de manera explícita la dirección pertinente para cada documento u operación; no inventar direcciones de recogida, entrega o facturación.

La respuesta no confirma múltiples sedes ni determina qué dirección debe imprimirse en cada documento. Esa capacidad queda como propuesta condicionada a los datos y flujos reales.

## 4. Contactos — respuesta 15

El usuario solicita una definición basada en el análisis. La siguiente es una propuesta, no una decisión previamente expresada:

- Usar un contacto principal por cliente como opción predeterminada para cotizaciones.
- Permitir contactos adicionales opcionales cuando una empresa tenga interlocutores distintos para compras, pagos, recepción o Calidad. No exigir crear uno por cada función.
- Cada contacto tendría nombre, cargo o función, teléfono y correo según la información disponible.
- Permitir seleccionar el destinatario de una cotización; inicialmente se propone el contacto principal.
- Conservar los datos del destinatario dentro del documento al congelarlo, de modo que cambiar un contacto no reescriba documentos históricos.

Ejemplo: la cotización puede dirigirse a Compras y la recogida coordinarse con Recepción. Si una misma persona realiza ambas funciones, basta con un solo contacto.

## 5. Datos mínimos y uso de Excel — respuesta 16

### Decisiones recibidas

- La base Excel es la referencia de partida para capturar clientes.
- El usuario solicita analizar esos datos para definir el conjunto de campos y su obligatoriedad.

### Propuesta inicial, pendiente de contrastar con el Excel real

| Momento | Criterio propuesto |
| --- | --- |
| Previsualizar una importación | Mostrar también las filas incompletas, sus valores originales y observaciones, sin inventar datos. |
| Crear una ficha utilizable | Contar con nombre o razón social, tipo y número de identificación revisados, y resolver duplicados. |
| Preparar una cotización | Seleccionar el cliente y destinatario; señalar datos incompletos necesarios para el formato concreto. |
| Aprobar o emitir | Validar los campos exigidos por el formato y el proceso acordado; conservar los datos utilizados en el documento. |
| Programar recogida o entrega | Disponer de dirección y contacto operativos adecuados, definidos junto con Logística. |

No se adjuntó el Excel en esta entrega y no se encontraron archivos Excel o CSV en las carpetas documentales revisadas. Por ello, esta actualización no presenta como verificados sus encabezados, tipos, calidad ni campos obligatorios definitivos.

El importador y el modelo actuales usan razón social, identificación, contacto, teléfono, correo y dirección, además de cargo y ciudad. Ese esquema técnico es un antecedente, no una sustitución del análisis solicitado del Excel.

## 6. Edición, activación y conservación — respuesta 17

### Decisiones recibidas

- Los asesores comerciales crean clientes, consultan sus datos y deben disponer de acciones para editarlos, activarlos e inactivarlos conforme a los permisos del área.
- Los clientes no se eliminan, para conservar la trazabilidad necesaria en auditorías.
- La inactivación no debe borrar el registro ni romper sus relaciones históricas.

### Propuesta de análisis

- Registrar autor, fecha y valores anteriores y nuevos de las modificaciones.
- Solicitar motivo para inactivación, reactivación y correcciones de identificación.
- Ante una corrección de identificación, comprobar duplicados y revisar el impacto; no fusionar clientes ni reasignar documentos silenciosamente.

La respuesta no exige una aprobación adicional para toda edición ni detalla soportes obligatorios. No se incorpora ese requisito como decisión confirmada.

## 7. Cambios en datos y documentos — respuesta 18

### Decisiones recibidas

- Los documentos aprobados y emitidos conservan sus datos: no deben cambiar por modificaciones posteriores del cliente.
- En borrador se pueden corregir datos del cliente mal redactados.
- La actualización de la ficha del cliente no autoriza a reescribir documentos históricos.

### Propuesta de análisis

- Conservar una copia de los datos utilizados en el documento cuando alcance el estado que impide modificaciones.
- Si la ficha cambia mientras hay borradores, mostrar la diferencia y permitir al asesor incorporar la corrección de forma explícita.
- Diferenciar una corrección de la ficha maestra de un cambio específico del destinatario o dirección de un borrador.

La respuesta no determina si el congelamiento empieza con la aprobación o únicamente después de emitir, ni cómo se corrige un documento aprobado que todavía no se ha emitido. El límite exacto se alineará con los estados del Módulo 3, sin debilitar la conservación de los documentos históricos.

## 8. Importación, duplicados y complementación — respuesta 19

### Decisiones recibidas

- Los duplicados se omiten como nuevas altas.
- Se permite cruzar información complementaria: por ejemplo, una fila sin teléfono y otra con el teléfono del mismo cliente.
- La información resultante sigue requiriendo la validación cliente por cliente indicada en la respuesta 14.

### Propuesta de conciliación

1. Leer y conservar los datos de origen y la referencia a la fila.
2. Comparar identificaciones normalizadas para detectar que las filas pertenecen al mismo cliente.
3. Consolidar valores complementarios cuando un campo está vacío y existe un valor no contradictorio en otra fila del mismo cliente.
4. Mostrar los campos completados y sus fuentes para revisión del asesor.
5. Si hay valores diferentes no vacíos, presentar el conflicto y conservar la información existente hasta resolverlo; no sobrescribirla automáticamente.
6. Si solo coincide la razón social y falta una identificación consistente, señalar una posible coincidencia para revisión, sin fusionar automáticamente.
7. Informar por separado altas, duplicados omitidos, complementaciones propuestas y filas con errores o conflictos.

Ejemplo de complementación: dos filas con el mismo NIT normalizado, una sin teléfono y otra con teléfono. Ejemplo de conflicto: el mismo NIT con dos teléfonos diferentes; la selección del valor no se decide por el orden de las filas.

El usuario no definió si la importación debe confirmarse de forma parcial o atómica ni si este cruce puede actualizar automáticamente clientes ya persistidos. La propuesta mantiene revisión explícita antes de aplicar cambios sobre fichas existentes.

## 9. Inactividad y bloqueos — respuesta 20

### Decisiones recibidas

- Deben contemplarse clientes inactivos y bloqueos cuando el proceso correspondiente aplique.
- La respuesta admite estas capacidades, pero no define todavía sus efectos por motivo.

### Propuesta de análisis

- Distinguir la inactividad general de un bloqueo operativo específico, por ejemplo de cartera, documentación o Calidad.
- Conservar motivo, responsable, fecha y levantamiento del bloqueo.
- Mantener accesibles los registros históricos según los permisos, aunque el cliente esté inactivo o bloqueado.
- Definir para cada motivo qué acciones se impiden y quién puede levantarlo o autorizar una excepción, junto con el módulo responsable.

No se asume que cualquier bloqueo impida automáticamente todas las operaciones ni se inventan umbrales de cartera o autoridades de excepción.

## 10. Brechas visibles y continuidad

La revisión estática del modelo actual muestra un campo único `nit`, un contacto y una dirección por cliente; la entidad revisada no contiene estado de activación, tipos de identificación ni bloqueos. El DTO exige varios campos de contacto, pero no valida el dígito de verificación del NIT. Estos son aspectos a reconciliar en una futura implementación, no cambios realizados en esta fase.

Se preservan las 100 preguntas originales y las reglas del Módulo 1. No se modifican código de producción, base de datos, importaciones ni documentos emitidos.

El siguiente bloque corresponde al [Módulo 3 — Cotizaciones](cuestionarios-origen.md#modulo-3). Al analizarlo deben respetarse las decisiones ya recibidas: múltiples servicios en una cotización, aprobación del jefe, emisión por el asesor, solicitud de anulación con observación y conservación de los datos históricos del cliente.


<a id="modulo-3"></a>

---

# Módulo 3 — Cotizaciones: reglas de negocio

Fecha de actualización: 9 de noviembre de 2026.

Estado: incorporadas las respuestas recibidas a las preguntas 21 a 45. La pregunta 29 no contiene respuesta. Las propuestas solicitadas al analista y los detalles pendientes se identifican expresamente; no constituyen funcionalidad implementada ni decisiones ya aprobadas.

Fuente principal: `Módulo 3 - Cotizaciones.md`, entregado por el usuario desde `C:\Users\urria\Downloads`.

Referencias: [cuestionario original](cuestionarios-origen.md#modulo-3), [Autenticación y usuarios](reglas-maestras.md#modulo-1) y [Clientes](reglas-maestras.md#modulo-2). Las respuestas recientes precisan el flujo comercial y prevalecen sobre propuestas anteriores cuando difieran.

## 1. Alcance y servicios — respuestas 21 a 24

### Decisiones recibidas

- El análisis comprende todos los productos y servicios. Se levanta la exclusión temporal de Insumos para esta fase de análisis.
- Se incorpora al alcance funcional un módulo de Productos, con carga del catálogo mediante Excel.
- Cada servicio corresponde a un proceso diferente. Industrial EtO, Farmacéutico y Fabricante no deben tratarse como simples etiquetas intercambiables del cliente.
- Una cotización puede combinar varios servicios diferentes.
- Debe admitir productos o servicios del catálogo y otros conceptos añadidos manualmente como ítems, aunque no estén en el Excel.

### Propuesta de organización

- Mantener una cabecera comercial por cotización y un detalle de ítems con su producto o servicio, proceso, descripción, unidad, cantidad, precio y descuento.
- Ofrecer búsqueda de productos y servicios del catálogo y una acción explícita para agregar un ítem manual.
- Un ítem manual pertenece inicialmente a la cotización; su creación no debe publicar automáticamente una nueva referencia en el catálogo general.
- Conservar la referencia al catálogo y una copia de los datos cotizados. Los cambios posteriores de catálogo no deben alterar una cotización emitida.
- Identificar el proceso correspondiente a cada ítem para permitir posteriormente su distribución a las áreas operativas.

La respuesta 24 confirma la combinación de conceptos del catálogo y adicionales, pero no resuelve si existen cotizaciones como listas de tarifas sin cantidades comprometidas. No se equipara «servicio fijo» con una modalidad de tarifa determinada.

### Dependencia del nuevo módulo de Productos

El catálogo requiere definir estructura, unidades, identificación de referencias, precios, estados y conciliación de importaciones. El Excel de productos no se adjuntó en esta entrega: no se presumen sus columnas ni sus datos. Esta ampliación de alcance no autoriza implementación ni añade preguntas a los ocho cuestionarios originales.

## 2. Unidades y cantidades — respuesta 25

El usuario solicita una propuesta dependiente del proceso y servicio. Se propone:

| Tipo de unidad | Regla inicial propuesta |
| --- | --- |
| Prenda, unidad, caja y ciclo completo | Cantidad entera positiva, cuando el concepto se facture por unidades indivisibles. |
| Kilogramo, litro y otras magnitudes medibles | Cantidad decimal positiva con precisión configurada por concepto. |
| Servicio global o paquete | Unidad explícita de servicio; cantidad 1 cuando se contrate el paquete completo. |
| Capacidad de equipo | Dato separado de la cantidad facturable, salvo que la tarifa se defina expresamente por capacidad. |

- El catálogo debe indicar qué unidad y precisión corresponden a cada producto o servicio.
- Los ítems manuales deben elegir una unidad válida y respetar su precisión.
- La ausencia de centavos en importes monetarios no obliga a eliminar decimales de peso, volumen u otras cantidades.
- Conversiones como prendas por caja o precio por litro deben estar identificadas; no se deducen únicamente de la descripción.

Esta tabla es una propuesta para validar con los procesos reales. No establece parámetros técnicos de esterilización ni tarifas operativas.

## 3. Precios, descuentos e IVA — respuestas 26 a 29

### Decisiones recibidas

- Los precios pueden variar según el cliente; no existe un único precio obligatorio para todos.
- El asesor debe poder seleccionar productos o servicios mediante búsqueda y preparar precios específicos para la cotización.
- El descuento se aplica por ítem, porque algunos servicios pueden tenerlo y otros no.
- Los descuentos aplicados deben detallarse en la cotización.
- El IVA no debe alterarse como parte de la negociación comercial.
- Los importes mostrados deben expresarse sin centavos, por ejemplo `1.540.550`, no `1.540.550,03`.

No se han definido precios mínimos, márgenes ni umbrales de descuento. La revisión del jefe es obligatoria según el flujo general, pero no se inventan límites adicionales.

### Propuesta de cálculo y presentación

1. Seleccionar el precio correspondiente al cliente o capturar el precio propuesto para el ítem.
2. Calcular el importe bruto del ítem a partir de cantidad y precio unitario.
3. Aplicar un único descuento por ítem: porcentaje o importe, identificando su modalidad. Evitar aplicar simultáneamente ambos por error.
4. Mostrar importe bruto, descuento e importe neto de cada ítem.
5. Incluir transporte cobrado como un concepto separado, cuando corresponda, para evitar cargos invisibles o dobles.
6. Aplicar el tratamiento fiscal autorizado a la base que corresponda y calcular el total. La secuencia fiscal definitiva depende de resolver la pregunta 29; este documento no determina tratamientos tributarios.

Como validaciones de diseño se proponen porcentajes de descuento entre 0 y 100 y un importe de descuento que no supere el bruto del ítem. No son topes de política comercial aprobados.

### Redondeo propuesto

- Conservar precisión decimal durante el cálculo y evitar truncar cantidades o porcentajes.
- Como criterio inicial, redondear los importes netos visibles de cada ítem a la unidad monetaria más cercana y sumar esos importes para obtener un subtotal conciliable con las filas impresas.
- Presentar impuestos y total sin centavos, con una política fiscal y de redondeo única que haga coincidir formulario, servidor y PDF.
- Identificar el importe de descuento visible de forma que bruto, descuento y neto cuadren; no limitarse a ocultar decimales de importes que luego no suman.
- Definir los casos de empate de redondeo y las reglas por moneda antes de implementar. La respuesta confirma la presentación sin centavos, no este algoritmo propuesto.

### IVA: punto sin respuesta

La pregunta 29 sobre tratamientos distintos de IVA y excepciones tributarias quedó sin respuesta. No se concluye que todos los ítems tengan la misma tasa ni se presupone exención por cliente extranjero o moneda.

«El IVA no se puede tocar» se registra como una restricción de la negociación comercial, no como prohibición de administrar una configuración fiscal autorizada. Las facultades de administración fiscal y las excepciones requieren definición expresa; no se concede al asesor modificar tasas o importes fiscales libremente.

## 4. Moneda e idioma — respuesta 30

### Decisión recibida

La moneda con la que paga el cliente se define en su catálogo o ficha y depende del cliente.

### Propuesta de análisis

- Usar la moneda configurada del cliente como valor inicial de una nueva cotización.
- Identificar expresamente la moneda del documento; no mezclar importes de monedas distintas en un total.
- Si hay conversión, conservar moneda de origen, moneda de destino, tasa, fecha y responsable de la tasa aplicada.
- Congelar moneda y conversión en la versión comercial aprobada y emitida; no recalcular históricos al modificar la ficha del cliente.

No se ha definido la fuente de la tasa de cambio, quién la autoriza ni cuándo se fija inicialmente. La respuesta tampoco confirma un selector de idioma: el ejemplo en inglés constituye una necesidad por analizar, no una decisión de traducción automática o soporte bilingüe.

## 5. Alternativas excluyentes — respuesta 31

El usuario confirma que una cotización puede ofrecer alternativas y solicita detallarlas.

Se propone organizar alternativas identificadas —por ejemplo A y B— con sus propios ítems, descuentos, totales y condiciones cuando difieran. La aceptación debe indicar cuál se seleccionó y sobre qué versión se tomó la decisión.

Las alternativas excluyentes no se suman como si el cliente hubiera contratado todas. Las operaciones posteriores deben recibir únicamente la alternativa aceptada. Los conceptos opcionales o combinables deben diferenciarse de alternativas excluyentes; sus combinaciones permitidas aún no están definidas.

## 6. Aprobación, envío, aceptación y emisión — respuestas 32 a 35

### Decisiones recibidas

- El gerente comercial o administrador del área correspondiente aprueba la cotización para enviarla al cliente.
- Quien crea la cotización no la aprueba. Tener varios roles no elimina esta separación de personas.
- La cotización se envía al cliente después de la aprobación interna.
- Si el cliente acepta, se emite y pasa al siguiente ciclo operativo.
- Si el cliente no acepta, la respuesta indica anularla.
- Según el Módulo 1, el asesor realiza la emisión al área correspondiente y solicita las anulaciones con observación para aprobación del administrador del área.

Se conserva la precisión del usuario «si no estoy mal es así» de la respuesta 32. La respuesta 35 reitera aceptación antes de emisión; por tanto esa secuencia es la base de este análisis, sin dar por definidos todos los estados de excepción.

### Flujo propuesto a partir de las respuestas

| Etapa propuesta | Responsable o condición | Resultado |
| --- | --- | --- |
| BORRADOR | Asesor comercial | Captura y ajuste de datos, ítems y condiciones. |
| EN_REVISION | Asesor solicita revisión al jefe | Versión identificable lista para revisión. |
| APROBADA_INTERNA | Gerente comercial o administrador autorizado, distinto del creador | Autorización de la propuesta para enviarla al cliente. |
| ENVIADA | Registro del envío de la versión aprobada | Cliente recibe una propuesta identificable. |
| ACEPTADA_CLIENTE | Registro de aceptación y alternativa elegida, si aplica | Se habilita la emisión operativa. |
| EMITIDA | Asesor autorizado, después de la aceptación | Documento inmutable y paso al proceso siguiente. |
| ANULACION_SOLICITADA | Asesor registra observación | Pendiente de decisión del administrador del área. |
| ANULADA | Administrador autorizado aprueba la solicitud | Original conservado con trazabilidad. |

Los nombres de estados son una propuesta documental, no una migración del sistema actual. La respuesta 33 delega su organización al analista.

- El rechazo expreso del cliente puede iniciar la solicitud de anulación; no debe saltarse la aprobación exigida en el Módulo 1.
- La falta de respuesta no se equipara automáticamente a rechazo ni a anulación.
- Devoluciones internas a corrección, vencimientos, denegación de anulación y tratamiento de operaciones ya iniciadas requieren completar las transiciones con los módulos afectados.
- La cotización con varios servicios no implica por sí sola varias aprobaciones de área. La regla para ese caso aún no fue especificada.

### Documento enviado frente a emisión operativa

El cliente necesita recibir una propuesta antes de aceptarla. Por tanto, el envío o generación de esa propuesta y la emisión posterior que activa el proceso son eventos distintos en el flujo solicitado.

Se propone conservar una versión aprobada identificable para envío y registrar después su aceptación y emisión operativa. No debe marcarse automáticamente como emitida al descargar o enviar el PDF. La relación exacta entre ese PDF de propuesta, el documento emitido y sus fechas queda por concretar, especialmente por la vigencia descrita en la sección 10.

### Evidencia de aceptación

La respuesta 35 confirma el orden del flujo, pero no indica si la evidencia será correo, orden de compra, firma o registro manual. Se propone registrar como mínimo fecha, responsable, medio, referencia a la versión y alternativa aceptada. No se declara obligatorio un adjunto, una firma o un canal que el usuario no haya definido.

## 7. Correcciones posteriores a emisión — respuesta 36

### Decisiones recibidas

- Una cotización emitida no admite cambios de datos ni valores.
- Si necesita corrección, se anula y se reemplaza.

### Propuesta de trazabilidad

- Conservar documento original, datos congelados, motivo, solicitante y aprobación de anulación.
- Vincular la nueva cotización con la que reemplaza, sin sobrescribirla ni reutilizar su archivo.
- Aplicar a la sustituta el flujo de revisión y aceptación correspondiente.
- Reconciliar órdenes ya creadas antes de continuar con la sustituta. No cancelar, transferir ni recrear automáticamente operaciones de otros módulos.

Cambiar precios del catálogo, moneda o datos del cliente tampoco debe modificar una emisión anterior. Para cambios de la propuesta aprobada pero no emitida se propone nueva revisión interna; su mecanismo definitivo aún no está establecido.

## 8. Consecutivos, prefijos y revisiones — respuesta 37

La numeración depende del proceso. El usuario aporta `COT-MED-001-1` como ejemplo, sin definir el significado de cada segmento.

Se propone una política configurable por proceso que documente prefijo, secuencia y, si aplica, revisión. No se interpreta el último `-1` automáticamente como versión, sede o alternativa.

Permanecen sin definir el momento de asignación, reinicios, relación entre reemplazo y revisión, y el prefijo de una cotización con varios servicios. No se debe adoptar silenciosamente el prefijo del primer ítem ni renumerar históricos.

## 9. Condiciones comerciales obligatorias — respuestas 38 y 44

### Decisiones recibidas

- Los seis campos deben diligenciarse; el formulario debe permitir capturarlos por separado.
- Los asesores redactan las condiciones y el jefe del área Comercial las valida.
- El PDF debe imprimir cada valor junto a su rótulo exacto, en este orden:

1. TIEMPO DE DESPACHO
2. TRANSPORTE
3. FORMA DE PAGO
4. VALIDEZ DE LA OFERTA
5. EL PRECIO INCLUYE
6. EL PRECIO NO INCLUYE

Se propone impedir el envío a revisión y las etapas posteriores con condiciones vacías. Para conciliar esta obligación con la recuperación del trabajo solicitada en el Módulo 1, un avance incompleto podría guardarse como borrador señalado como incompleto; esto es una propuesta, no una autorización expresa del usuario para omitir campos al guardar.

El uso de `N/A` fue indicado para Observaciones en la respuesta 45. No se extiende automáticamente a los seis campos obligatorios.

Para textos extensos se propone respetar saltos de línea, permitir varias páginas y conservar rótulo y contenido legibles, sin recortar ni reducir el texto hasta hacerlo ilegible. Las sugerencias de texto por servicio pueden ayudar al asesor, pero no sustituyen su revisión ni la validación del jefe.

## 10. Propuesta de captura de cada condición — respuestas 39 a 43

### TIEMPO DE DESPACHO

Decisión: se redacta como texto por Comercial.

Propuesta: editor multilínea con una guía para indicar servicio, plazo, días hábiles o calendario, evento inicial y dependencias. Admitir apartados distintos para producto, laboratorio e informe cuando tengan plazos diferentes. La guía no debe imponer un plazo único a todos los servicios.

### TRANSPORTE

El usuario considera pertinente registrar y controlar las condiciones del transporte.

Propuesta: registrar quién presta y paga, origen y destino, cobertura, recogida o entrega, condiciones de monto y posibles exclusiones. El texto acordado se imprime en la tabla comercial.

Si se cobra transporte, debe existir un ítem explícito asociado; el importe no se calcula interpretando texto libre. Si está incluido en otros precios, indicarlo y evitar un segundo cargo. El control operativo se desarrollará en Logística.

### FORMA DE PAGO

Decisión: admitir acuerdos variables, por ejemplo 50 % y 50 %, o 30 % y 70 %.

Propuesta: definir etapas con porcentaje y evento de exigibilidad —anticipo, entrega u otro acordado— y generar un resumen revisable por el asesor. Si las etapas distribuyen todo el precio, comprobar que sumen 100 %. La captura de plazos debe indicar desde qué evento se cuentan.

No se ha autorizado bloquear operaciones por falta de pago ni se ha definido un módulo de recaudo. El acuerdo contractual y la comprobación real del pago deben mantenerse como conceptos distintos.

### VALIDEZ DE LA OFERTA

Decisión expresada: inicio relacionado con la emisión y plazo de hasta 30 días. El ejemplo es del 25 de noviembre al 25 de diciembre; no debe limitarse al mes de creación.

Propuesta: almacenar fecha inicial, duración y fecha final explícitas y mostrar el intervalo en el PDF. Usar 30 días calendario como valor inicial es una propuesta; no sustituirlo por «el mismo día del mes siguiente», porque no siempre equivale a 30 días.

Punto de coherencia pendiente: la propuesta se envía antes de que el cliente acepte, y la emisión operativa ocurre después de aceptar. Si la vigencia empieza únicamente al emitir, no define hasta cuándo puede aceptarse la propuesta enviada. Debe precisarse si «emisión» en esta respuesta alude a la expedición de la propuesta aprobada o a la emisión operativa posterior. No se cambia silenciosamente la fecha inicial a creación o envío.

Tampoco se ha definido la hora límite, inclusión del último día ni autorización de prórrogas. El ejemplo por sí solo no resuelve esos detalles.

### EL PRECIO INCLUYE / EL PRECIO NO INCLUYE

Decisión: dos textos libres separados, redactados por Comercial y revisados por su jefe.

Propuesta: permitir párrafos o listas legibles, con ejemplos de servicios, materiales, empaques, análisis y entregables. Señalar al revisor la necesidad de comprobar correspondencia con los ítems y condiciones de transporte. No modificar precios, impuestos o alcance automáticamente a partir del texto ni prometer detección automática de contradicciones.

## 11. Observaciones e históricos — respuesta 45

### Decisión recibida

Cuando corresponda, diligenciar Observaciones; cuando no aplique, colocar `N/A`.

### Propuesta

- Mantener Observaciones como apartado adicional a las seis condiciones, sin usarlo para sustituirlas.
- Representar «no aplica» explícitamente con `N/A`; no confundirlo con un campo olvidado.
- No repartir automáticamente el antiguo texto general entre los seis campos. Los borradores existentes podrían requerir clasificación manual al retomarlos.
- Conservar intactos los textos, datos y PDF históricos emitidos.

La respuesta define el uso futuro de Observaciones, pero no aprueba una migración de los textos generales ya almacenados. Esa clasificación sigue siendo una propuesta para borradores.

## 12. Resumen de decisiones pendientes y alcance

| Tema | Estado de definición |
| --- | --- |
| Productos e importación de catálogo | Incluidos en el análisis; falta contrastar el Excel y definir su estructura. |
| Unidades, precisión y descuentos | Propuestas en este documento; falta validación de reglas por proceso. |
| IVA por ítem y excepciones | Pregunta 29 sin respuesta; no se presume un tratamiento. |
| Moneda, cambio e idioma | Moneda vinculada al cliente; fuente de cambio, autorizaciones e idioma no definidos. |
| Alternativas | Admitidas; propuesta de selección y totales separados. |
| Evidencia de aceptación | Secuencia confirmada; medio y soporte no definidos. |
| Estados excepcionales y efectos operativos | Propuestos para completar con las áreas afectadas. |
| Numeración de cotizaciones mixtas y reemplazos | Sin regla definitiva. |
| Vigencia | Hasta 30 días; debe conciliarse el evento inicial con envío, aceptación y emisión. |
| Recuperación de borradores incompletos | Propuesta para conciliar continuidad de trabajo y obligatoriedad de condiciones. |

Solo se actualiza documentación. No se modifica código de producción, permisos efectivos, precios, impuestos, bases de datos ni documentos emitidos. Los cuestionarios mantienen sus 100 preguntas originales.

La siguiente etapa de respuestas corresponde al [Módulo 4 — Logística](cuestionarios-origen.md#modulo-4). Debe considerar las cotizaciones con múltiples servicios, la alternativa aceptada, la emisión posterior a aceptación y la coordinación del transporte.


<a id="modulo-4"></a>

---

# Módulo 4 — Logística: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas 46 a 57 incorporadas como definiciones del negocio. No implica implementación ni validación operativa.

Fuente: `Módulo 4.md`, entregado por el usuario desde `C:\Users\urria\Downloads`. Se conservan las [preguntas originales](cuestionarios-origen.md#modulo-4). Las precisiones pendientes al final distinguen conflictos entre módulos de reglas expresamente respondidas.

## 1. Órdenes y cotizaciones — respuesta 46

- Una cotización aceptada puede generar múltiples órdenes por sedes o entregas parciales.
- Cada orden pertenece a una sola cotización.
- Una orden puede agrupar varios ítems de esa misma cotización; no mezcla ítems de cotizaciones distintas.

## 2. Condiciones de creación — respuesta 47

- La cotización debe estar en estado `ACEPTADA` para crear la orden.
- Se requiere registrar la Orden de Compra (OC) del cliente o una autorización explícita del Jefe de Área.
- Si el acuerdo exige anticipo, el sistema debe alertar. No se establece un bloqueo obligatorio antes de la confirmación de Finanzas.
- No se infiere de esta respuesta cómo confirma Finanzas el pago ni qué bloqueo se aplicaría después: ese procedimiento no está definido.

## 3. Recepción física — respuesta 48

Registrar ID de orden, número de remisión/factura, fecha y hora, usuario autenticado que recibe, sede de origen y evidencias: fotos o firma digital de quien entrega.

La expresión «firma digital» se conserva como requisito recibido; su mecanismo técnico, identidad y requisitos de conservación todavía no se especifican. Una fotografía no se declara equivalente a una firma digital.

## 4. Diferencias y rechazos — respuesta 49

- Si se recibe menos de lo cotizado, registrar `RECIBIDO_PARCIAL` y notificar a Comercial.
- Logística puede rechazar material dañado y debe registrar el motivo.
- No se altera la cantidad cotizada sin autorización de una Desviación por Calidad.
- Deben distinguirse cantidad cotizada y recibida; una diferencia física no autoriza una reescritura silenciosa del documento comercial.

## 5. Materiales, lotes y unidades — respuestas 50 y 51

- Cada combinación de Producto + Lote + Empaque ocupa una fila independiente para conservar trazabilidad hasta el certificado.
- Admitir cantidades enteras y decimales según el servicio y su unidad.
- Esterilización por cajas o unidades suele usar enteros; Lavandería e insumos por peso o volumen requieren decimales, por ejemplo 15.5 kg.
- La precisión exacta por unidad no fue fijada; no debe aplicarse un redondeo monetario a cantidades físicas.

## 6. Muestras — respuesta 52

- Retención, cliente y laboratorio representan unidades físicas apartadas para pruebas.
- No se descuentan de la cantidad total procesada; son un dato adicional.
- Cero se conserva como `0`.
- Cuando no aplica, almacenar `NULL` y mostrar `N/A`.
- Esta definición no identifica `NULL` con un dato desconocido: una captura pendiente no debe presentarse como «no aplica» por defecto.

## 7. Empaque y reempaque — respuesta 53

- Inspeccionar integridad, tipo de empaque —por ejemplo Tyvek o PGM— y sellado.
- Logística puede rechazar material con empaque inadecuado.
- El reempaque requiere autorización del Jefe de Logística o Calidad.
- Puede generar un costo adicional al cliente. La respuesta no define su tarifa ni cómo se acepta el cargo; no se incorpora automáticamente a una cotización emitida.

## 8. Transporte — respuesta 54

Es obligatorio registrar transportista propio o externo, nombre del conductor, placa, ruta y prueba de entrega (POD) firmada o fotografiada.

La evidencia de recepción y la prueba de entrega final corresponden a eventos diferentes. El momento preciso en que se exige cada dato debe acompañar a su evento operativo; no se exige una POD final para crear una orden todavía no entregada.

## 9. Estados operativos — respuesta 55

Secuencia principal definida por el negocio:

```text
PENDIENTE_RECOGIDA → EN_TRANSITO → RECIBIDO_PLANTA → EN_PROCESO
→ PROCESADO → EN_DESPACHO → ENTREGADO
```

- Planta maneja `EN_PROCESO`.
- La cuarentena corresponde a Planta/Calidad mientras el material espera su liberación y certificado.
- `PROCESADO` no equivale a autorización de despacho.
- `RECIBIDO_PARCIAL`, establecido en la respuesta 49, requiere una transición complementaria a esta secuencia. No se inventa si regresa a recepción, permite proceso parcial o espera completar la entrega.
- Rechazo, devolución, cancelación y acumulación de recepciones parciales tampoco tienen todavía una secuencia completa definida.

## 10. Control de despacho — respuesta 56

- Bloquear el paso a `EN_DESPACHO` si Calidad no ha emitido y liberado el certificado.
- Única excepción expresamente descrita: urgencia médica con Liberación por Excepción documentada y autorizada directamente por el Gerente de Calidad.
- La excepción debe quedar en auditoría; no equivale a una facultad general para omitir controles.
- La existencia de un PDF por sí sola no acredita liberación.
- El alcance de la liberación para despachos parciales y la regularización posterior de la excepción deben completarse con Calidad.

## 11. Bloqueo y corrección de materiales — respuesta 57

- Una vez que Planta registra un ciclo y el material entra a la máquina, lotes y cantidades quedan bloqueados.
- Un error de digitación posterior requiere Corrección de Desviación.
- Conservar la evidencia original y exigir aprobación del Jefe de Calidad.
- La corrección no autoriza sobrescribir silenciosamente ciclos, materiales o certificados históricos.

La respuesta relaciona registro de ciclo y entrada física a máquina. Si son eventos separados, debe fijarse cuál activa el bloqueo; no se asume que exista una ventana de edición entre ambos.

## 12. Coherencia con otros módulos

Referencias: [Cotizaciones](reglas-maestras.md#modulo-3), [Clientes](reglas-maestras.md#modulo-2) y [Autenticación y usuarios](reglas-maestras.md#modulo-1).

| Punto | Definiciones recibidas y precisión pendiente |
| --- | --- |
| Creación de órdenes | Este módulo exige `ACEPTADA`; Cotizaciones sitúa la emisión después de aceptar y antes del siguiente ciclo. Falta definir si la orden nace antes o después de emitir y si ACEPTADA es un estado actual o una condición histórica. No se elimina ninguna de las dos definiciones. |
| Cantidad cotizada | Logística exige Desviación de Calidad para alterarla; Cotizaciones prohíbe cambiar datos o valores emitidos y exige anular/reemplazar. La autorización de desviación no debe interpretarse como permiso para sobrescribir una emisión. Debe concretarse su enlace con el reemplazo comercial. |
| Recepciones parciales | Comparar recibido con lo esperado para cada orden y entrega evitaría marcar como faltante una división planificada. Es una propuesta: la respuesta original compara con lo cotizado y debe precisarse el denominador operativo. |
| Servicios sin esterilización | Cotizaciones incluye Insumos y Lavandería. La regla de certificado para despacho no establece su tratamiento cuando no corresponde un certificado de esterilización. No se inventa una exención ni se exige un ciclo de esterilización a esos servicios. |
| Autorizadores | Se conservan Jefe de Área, Jefe de Logística, Jefe de Calidad y Gerente de Calidad según cada respuesta. No se consideran cargos equivalentes automáticamente. |
| Notificaciones y evidencias | Se requieren funcionalmente; canal, conservación, acceso y formatos admitidos no se han definido. No se envían notificaciones reales durante esta fase. |

## 13. Alcance de la entrega

Solo se documentan las respuestas y sus dependencias. No se modifica código, base de datos, estados efectivos, órdenes, archivos emitidos ni permisos. Los ocho cuestionarios y sus 100 preguntas se conservan.

Continúa el [Módulo 5 — Planta](cuestionarios-origen.md#modulo-5), donde deben precisarse asignación de materiales a ciclos, ingreso físico, cantidades parciales y separación entre procesamiento y liberación.


<a id="modulo-5"></a>

---

# Módulo 5 — Planta: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 58 a 69 incorporadas desde el mensaje del usuario. Son requisitos del negocio; no certifican implementación ni validación técnica de protocolos.

Referencias: [cuestionario original](cuestionarios-origen.md#modulo-5), [Logística](reglas-maestras.md#modulo-4) y [Cotizaciones](reglas-maestras.md#modulo-3).

## 1. Procesos — respuesta 58

- Planta gestiona esterilización EtO, Vapor y Lavandería Farmacéutica.
- Lavandería tiene un flujo propio: Recepción → Lavado → Secado → Doblado/Empaque → Liberación.
- Lavandería no debe forzarse a pasar por un ciclo tradicional de esterilización ni a registrar sus parámetros de presión.
- Los criterios, responsable y documento de liberación de Lavandería deben precisarse con Calidad; no se presume que correspondan a un certificado de esterilización.

## 2. Catálogo de equipos — respuesta 59

- El catálogo es obligatorio.
- Cada equipo tiene código único, método EtO/Vapor, capacidad, ubicación y estado: Operativo, Mantenimiento o Fuera de Servicio.
- Solo el Jefe de Planta o Calidad pueden administrarlo.
- Los equipos utilizados deben seleccionarse del catálogo; no se sustituyen por nombres libres sin trazabilidad.

La respuesta describe el catálogo de esterilización. La clasificación de equipos de Lavandería y las unidades de capacidad no están definidas; no se les asigna EtO o Vapor por defecto.

## 3. Disponibilidad y calibración — respuesta 60

- Un equipo con calibración vencida o en mantenimiento no puede programarse ni utilizarse para registrar un ciclo.
- Solo Calidad o el Jefe de Planta pueden reactivarlo tras cargar el certificado de calibración.
- La carga del archivo y la reactivación autorizada son hechos distintos: subir un documento no implica automáticamente cambiar el estado del equipo.
- Como consecuencia de su estado, un equipo Fuera de Servicio tampoco debe habilitarse para operar.

No se definieron reglas de calificación, periodicidad de calibración ni validación del certificado. Tampoco se resolvió cómo documentar un ciclo que ocurrió antes de detectar una indisponibilidad: no se descarta evidencia real ni se inventa una excepción al bloqueo.

## 4. Identificación de ciclos — respuesta 61

- El sistema genera un consecutivo interno para trazabilidad; `CIC-2026-001` es el ejemplo recibido.
- Existe además un campo para el número físico de ciclo de la máquina.
- El número físico puede repetirse en el tiempo, pero debe ser único por equipo y año.
- Los dos identificadores se conservan; uno no reemplaza al otro.

El formato exacto del consecutivo interno, sus reinicios y el año aplicable a registros retroactivos deben definirse antes de implementar. El ejemplo no constituye por sí solo una política completa de numeración.

## 5. Órdenes, materiales y cantidades — respuestas 62 y 63

- Un ciclo puede contener varias órdenes y clientes, siempre que la carga quepa en la cámara.
- Una orden puede distribuirse entre varios ciclos, por ejemplo 100 cajas en dos cargas de 50.
- El operario selecciona las órdenes que entran al ciclo; los materiales proceden de sus registros y no se digitan como filas independientes sin origen.
- El sistema descuenta automáticamente los materiales asignados.
- El reproceso crea un ciclo nuevo vinculado al original y conserva el historial del material.

### Propuesta para concretar la asignación parcial

Seleccionar órdenes y luego las cantidades de cada fila de material que participarán en la carga. Mantener vínculos entre ciclo, orden y material, con cantidades asignadas, procesadas y pendientes, para evitar asignaciones duplicadas.

Interpretar el descuento como consumo o reserva del saldo disponible para asignar, sin borrar la cantidad recibida ni el historial. El momento exacto —reserva, inicio o finalización— y la devolución del saldo ante un aborto aún no están definidos. Un reproceso no debe contarse automáticamente como una segunda entrega del cliente ni como nuevas unidades cumplidas.

Estas son propuestas de trazabilidad, no reglas adicionales ya aprobadas. La compatibilidad entre cargas de distintos clientes, empaques o protocolos debe concretarse con Calidad; disponer de capacidad física no demuestra por sí solo compatibilidad técnica.

## 6. Método contratado — respuesta 64

- Comercial define el método en la cotización según el requerimiento del cliente y compatibilidad del producto.
- Planta no puede cambiar el método contratado.
- Si el material no es compatible, se rechaza o devuelve a Logística.
- Una cotización con varios servicios requiere conservar el método de cada concepto operativo; no se deriva un método único para todos sus materiales por suposición.

La evidencia de compatibilidad y el procedimiento comercial para corregir el servicio contratado aún no se han especificado.

## 7. Parámetros y evidencia — respuesta 65

| Método | Parámetros solicitados |
| --- | --- |
| EtO | Temperatura (°C), humedad (%), presión negativa (inHg), exposición (min) y aireación (min). |
| Vapor | Temperatura (°C), exposición (min), secado (min), humedad/presión. |

- Registrar valores exactos y validarlos contra el rango del protocolo aplicable.
- Permitir archivos PDF y CSV exportados directamente de la máquina como evidencia del ciclo.
- La respuesta no solicita ni autoriza que importar un archivo sustituya automáticamente la captura o aprobación de datos.
- No se fijan aquí rangos técnicos numéricos, tolerancias o precisiones que el usuario no haya proporcionado.

Para Vapor no se especificaron unidades de presión ni si humedad y presión son ambas obligatorias. No se hereda automáticamente la presión negativa en inHg de EtO.

Debe distinguirse detectar una medición fuera de rango de impedir conservarla: se propone registrar el dato real y señalar el incumplimiento para Calidad. No se debe alterar una medición para hacerla coincidir con un protocolo. El tratamiento final del incumplimiento pertenece al Módulo 6.

## 8. Protocolos — respuesta 66

- El protocolo depende del método, equipo y tipo de empaque.
- Calidad selecciona y aprueba la versión aplicable; Planta no ejerce esa aprobación.
- Como propuesta de trazabilidad, fijar la referencia a esa versión en el ciclo y conservarla aunque se publique una nueva posteriormente.
- No se debe sustituir silenciosamente el protocolo por la versión más reciente durante una evaluación histórica.

La selección de protocolos para cargas con varios empaques requiere definir compatibilidades o dividir la carga; no se elige arbitrariamente el protocolo del primer material.

## 9. Registros retroactivos — respuesta 67

- No se permiten por defecto.
- Ante una interrupción de red o falta de conexión de la máquina, solo SuperAdmin o Calidad pueden autorizarlos.
- La autorización requiere justificación obligatoria y auditoría.
- Se propone conservar por separado fecha real de ejecución, fecha de captura, responsable del registro y autorizador.

No se ha definido una antigüedad máxima. La autorización retroactiva no se considera automáticamente permiso para operar un equipo no habilitado o eludir el protocolo.

## 10. Fallos, abortos y reprocesos — respuesta 68

- Registrar estados `FALLIDO` o `ABORTADO` y exigir motivo.
- El reproceso genera un ciclo nuevo vinculado al anterior.
- `CIC-2026-001-R1` es el ejemplo de identificación recibido; la política para sucesivos reprocesos queda por concretar junto con los consecutivos.
- Nunca borrar ni sobrescribir el ciclo original fallido.
- Conservar materiales, cantidades, datos y evidencias del intento original, además de los del nuevo intento.

El resultado de un ciclo fallido o abortado no debe confundirse con una liberación conforme. La recuperación de saldos, aprobación de reproceso y destino de material rechazado deben acordarse con Calidad y Logística.

## 11. Procesamiento y liberación — respuesta 69

- La orden se declara `PROCESADA` cuando termina el ciclo y se registran sus parámetros.
- No puede despacharse hasta que Calidad apruebe las evaluaciones y emita el certificado.
- Procesamiento terminado y liberación de Calidad son hitos diferentes.

Para órdenes divididas en varios ciclos, la respuesta no define si el primer ciclo terminado puede cerrar toda la orden. Se propone declarar procesamiento parcial mientras queden cantidades pendientes y `PROCESADA` solo cuando todas las cantidades aplicables hayan completado su procesamiento; esto requiere validación y no se presenta como una respuesta ya recibida.

## 12. Puntos de coordinación con Calidad y Logística

| Punto | Definiciones que deben conciliarse |
| --- | --- |
| Estado de orden | Planta usa `PROCESADA`; Logística usa `PROCESADO`. Representan aquí el hito de procesamiento; el nombre técnico común se definirá al diseñar el flujo. |
| Liberación excepcional | Logística contempla urgencia médica con autorización documentada del Gerente de Calidad. Planta exige aprobación y certificado antes del despacho. Se mantiene la regla ordinaria y se señala que Calidad debe precisar si subsiste aquella excepción y su alcance; no se elimina ni amplía silenciosamente. |
| Lavandería | Tiene liberación propia; falta definir el documento de salida y cómo se relaciona con el control de despacho. |
| Bloqueo de materiales | Logística relaciona el bloqueo con registro del ciclo y entrada a máquina. Debe fijarse el evento exacto junto con las reservas y asignaciones de Planta. |
| Carga multicliente | Debe conservar trazabilidad y límites de visibilidad; un ciclo compartido no autoriza mostrar a un cliente datos de otros. El alcance del certificado se definirá con Calidad. |
| Calibración y retroactividad | Debe distinguirse la habilitación del equipo en la fecha real del proceso de su estado en la fecha de captura, sin inventar un bypass de controles. |

## 13. Alcance documental y continuidad

Solo se registran requisitos y propuestas identificadas. No se modifica código de producción, datos, equipos, protocolos, permisos ni ciclos. Los cuestionarios originales se conservan.

Continúa el [Módulo 6 — Calidad](cuestionarios-origen.md#modulo-6), especialmente liberación parcial, evaluación de parámetros, evidencias, reprocesos y posibles excepciones.


<a id="modulo-6"></a>

---

# Módulo 6 — Calidad: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 70 a 81 incorporadas desde el mensaje del usuario. Documento de requisitos; no acredita implementación, validación técnica ni cumplimiento legal.

Referencias: [cuestionario original](cuestionarios-origen.md#modulo-6), [Planta](reglas-maestras.md#modulo-5) y [Logística](reglas-maestras.md#modulo-4).

## 1. Unidad de liberación y excepciones materiales — respuestas 70 y 78

- Calidad evalúa y libera el ciclo completo, que puede contener varias órdenes y lotes.
- Puede aprobar el ciclo general y rechazar materiales o lotes específicos, por ejemplo por empaque roto.
- Deben identificarse los ítems rechazados y conservar trazabilidad de la excepción.
- Una aprobación general no implica liberar los materiales rechazados: su estado y destino deben permanecer distinguibles.

Se propone relacionar cada decisión con las filas de material y cantidades del ciclo. El tratamiento de un rechazo parcial dentro de una misma fila aún no está definido. La agrupación de materiales en certificados se resolverá en el Módulo 7; aprobar un ciclo multicliente no supone emitir un único documento compartido entre clientes.

## 2. Independencia y doble aprobación — respuesta 71

- El operario de Planta que registró el ciclo no puede aprobarlo, aunque tenga también un rol de Calidad.
- La aprobación corresponde a un usuario autorizado con rol de Calidad.
- Las desviaciones críticas y los reprocesos requieren doble aprobación: Analista de Calidad y Jefe/Director de Calidad.
- Ambas aprobaciones deben conservar sus responsables; una persona con varios roles no representa dos aprobadores independientes.

La definición de desviación crítica y el momento de la doble aprobación respecto de la ejecución del reproceso requieren precisión. Las firmas adicionales del Director Técnico descritas más adelante no se consideran satisfechas automáticamente por otro cargo de nombre similar.

## 3. Protocolos y criterios — respuesta 72

- El Jefe de Calidad o Director Técnico define protocolos y criterios de aceptación.
- Dependen del método EtO/Vapor y del tipo de producto/empaque.
- Se almacenan en versiones inmutables.
- La evaluación debe conservar la versión aplicada; publicar otra versión no debe recalificar silenciosamente ciclos históricos.

Planta también define dependencia del equipo en su respuesta 66. Ambos requisitos se conservan: método, equipo y producto/empaque deben considerarse al resolver el protocolo. No se elimina la dimensión equipo por no estar repetida en esta respuesta. No se inventan rangos o criterios numéricos.

## 4. Evaluación híbrida — respuesta 73

- El sistema compara los valores registrados por Planta contra los rangos del protocolo y sugiere el resultado.
- Calidad revisa, valida y firma explícitamente la evaluación.
- Una sugerencia automática de cumplimiento no libera material ni sustituye la aprobación humana.
- El ejemplo de 55 °C dentro de 50–60 °C es ilustrativo; no se adopta como rango universal.

Como propuesta de trazabilidad, conservar por separado medición original, resultado calculado, decisión de Calidad, protocolo y responsables. No modificar la medición real para obtener un resultado favorable.

## 5. No aplica y cambios de resultado — respuesta 74

- Se permite `NO_APLICA` cuando el parámetro no corresponde al método o producto.
- Exige justificación obligatoria; no debe utilizarse para ocultar un resultado pendiente o fallido.
- Modificar un resultado que el sistema marcó como `NO_CUMPLE` exige registrar una Desviación y aprobación del Jefe de Calidad.
- Deben conservarse el resultado calculado y la decisión posterior, sin sobrescribir la evidencia original.

Esta aprobación no sustituye los controles adicionales de liberación cuando el parámetro sea crítico, descritos en la sección 8.

## 6. Evidencias — respuesta 75

Permitir adjuntar resultados de Indicadores Biológicos (BI), Indicadores Químicos (CI), gráficos y CSV exportados de la máquina, y fotografías del material cargado. Planta también contempla PDF exportado de máquina; se mantiene ese requisito.

Se propone vincular cada evidencia al ciclo y, cuando corresponda, al material evaluado, conservando autor y fecha de incorporación. La respuesta exige admitir estas evidencias, pero no establece que todos sus tipos sean obligatorios en todos los métodos. Tamaños, formatos adicionales, conservación y requisitos por protocolo quedan por definir.

## 7. Cuarentena y resultados pendientes — respuesta 76

- El material permanece en `CUARENTENA` mientras espera los resultados aplicables, especialmente el BI.
- Para el BI, Calidad debe registrar resultado negativo antes de la liberación ordinaria.
- El usuario indica 24–48 horas de incubación como contexto operativo; no se convierte ese intervalo en un temporizador universal ni en aprobación automática.
- La liberación condicionada exige autorización formal y documentada del Director Técnico.
- Un resultado no registrado no equivale a negativo. El transcurso del tiempo por sí solo no libera material.

El protocolo debe determinar qué indicadores aplican a cada proceso. La documentación no impone BI a Lavandería por analogía con esterilización. El seguimiento posterior de una liberación condicionada y su documentación de salida aún deben precisarse.

## 8. Fallo crítico y liberación por desviación — respuesta 77

- Si falla un parámetro crítico, bloquear automáticamente la emisión del certificado ordinario.
- La Liberación por Desviación requiere análisis de riesgo y firma del Director Técnico.
- El certificado resultante debe mostrar visiblemente: **Liberado por Desviación**.
- La excepción no transforma la medición fallida en una medición conforme ni elimina el historial de la desviación.
- Si la desviación es crítica, se mantiene además la doble aprobación exigida en la respuesta 71. No se asume que la firma del Director Técnico sustituya cualquiera de esas aprobaciones sin una equivalencia explícitamente definida.

Esta regla no concede a todos los usuarios de Calidad una facultad general de excepción. El catálogo de parámetros críticos pertenece a los protocolos controlados.

## 9. Rechazo, investigación y destino — respuesta 79

Todo rechazo debe generar:

- Motivo.
- Evidencia.
- Apertura de investigación CAPA (Acciones Correctivas y Preventivas).
- Destino del material: devolución al cliente, reproceso o destrucción.

Se propone enlazar la investigación, los materiales afectados y las actuaciones posteriores. Reproceso debe conservar el vínculo con el ciclo original conforme al Módulo 5. Seleccionar destrucción como destino no equivale a ejecutar ni acreditar su realización; responsables, autorizaciones y evidencia de cierre deben definirse. Tampoco se ha fijado si cerrar CAPA es condición previa para liberar otros materiales del ciclo.

## 10. Firma de aprobación — respuesta 80

- Para esta fase se acepta reingresar la contraseña como mecanismo de confirmación.
- Registrar usuario, cargo, fecha y hora exactas e IP de la actuación.
- Aplicar el mecanismo a cada aprobador requerido, preservando su identidad y decisión.
- No almacenar la contraseña dentro del registro de auditoría.

La finalidad expresada es contar con una firma electrónica auditable. Se documenta el mecanismo solicitado sin afirmar que estos datos, por sí solos, acrediten validez jurídica. La validación de requisitos legales y referencias aplicables queda en la pregunta 87 del Módulo 7; esta entrega no realiza un dictamen legal.

## 11. Inmutabilidad y correcciones — respuesta 81

- Una aprobación completada es inmutable.
- Ante un error, anular el certificado, registrar una desviación y emitir uno nuevo con revisión.
- Conservar el original, su aprobación y el vínculo con el sustituto; la anulación no implica borrarlos.
- No sobrescribir valores, evaluaciones o PDF de una aprobación anterior.

Los responsables de anular, numeración de revisiones, notificación al cliente y tratamiento del material ya entregado se precisarán en Certificados. La regla de aprobación de anulaciones comerciales no se traslada automáticamente a certificados.

## 12. Fallo de generación de PDF — respuesta 81

- Si falla la generación del PDF, hacer rollback: la aprobación final no se guarda.
- El usuario debe reintentar.
- No puede quedar material aprobado/liberado sin certificado como consecuencia de una generación fallida.
- El fallo no autoriza a eliminar los datos originales de Planta, evidencias o evaluaciones previamente guardadas.

Para el diseño posterior se propone que el reintento evite duplicar certificados y que cualquier archivo parcial no sea publicado como oficial. El alcance de la reversión sobre firmas preliminares de una doble aprobación y sobre varios certificados de un ciclo debe concretarse; no se da por implementada atomicidad entre almacenamiento de archivos y base de datos.

## 13. Coordinación de excepciones y pendientes

| Tema | Regla recibida y límite pendiente |
| --- | --- |
| Urgencia médica | Logística contempla liberación excepcional por el Gerente de Calidad; este módulo exige Director Técnico para liberación condicionada o por desviación. No se equiparan cargos ni se usa una autorización para eludir la otra. Debe definirse si son vías distintas o si una reemplaza a la anterior. |
| Pendientes frente a fallos críticos | Resultado pendiente admite solo la liberación condicionada formal descrita; fallo crítico exige análisis de riesgo, firma y marca documental. No son la misma excepción. |
| Certificado en liberación condicionada | Debe precisarse qué documento permite la salida y cómo se conserva la obligación de no liberar sin certificado. No se presume un despacho automático sin documento. |
| Material rechazado dentro de ciclo aprobado | Debe excluirse de la autorización de despacho. El Módulo 7 definirá cómo se representa en los documentos sin certificarlo como liberado. |
| Lavandería | Su flujo propio requiere criterios, autoridad y documento de liberación específicos, aún no definidos por estas respuestas centradas en EtO/Vapor. |
| Cargos de aprobación | Jefe, Director, Gerente de Calidad y Director Técnico no se tratan como sinónimos por defecto. |
| Evaluación histórica | Se conserva la versión de protocolo y la decisión original; una corrección formal no recalcula retrospectivamente todos los certificados. |

## 14. Alcance documental y continuidad

Solo se actualiza documentación. No se modifica código, datos, permisos efectivos, protocolos, firmas, evaluaciones ni certificados. Se conservan los ocho cuestionarios y sus 100 preguntas.

Continúa el [Módulo 7 — Certificados](cuestionarios-origen.md#modulo-7), con especial atención a certificados por cliente/ciclo, exclusiones de materiales, marcas de desviación, revisiones e inmutabilidad.


<a id="modulo-7"></a>

---

# Módulo 7 — Certificados: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 82 a 91 incorporadas desde el mensaje del usuario. Documento de requisitos; no acredita implementación ni constituye validación jurídica o normativa.

Referencias: [cuestionario original](cuestionarios-origen.md#modulo-7), [Calidad](reglas-maestras.md#modulo-6), [Planta](reglas-maestras.md#modulo-5) y [Logística](reglas-maestras.md#modulo-4).

## 1. Unidad de emisión — respuesta 82

- Se emite un certificado por Orden de Servicio.
- Puede reunir materiales de varios ciclos cuando la orden se haya distribuido entre ellos, siempre que todos los ciclos incluidos hayan sido aprobados por Calidad.
- El certificado detalla los materiales e identifica el ciclo al que pertenece cada uno.
- Un ciclo compartido entre clientes no implica un certificado compartido: cada orden conserva su documento.
- Las sustituciones por corrección se vinculan al original conforme a la respuesta 90; no son una autorización para sobrescribirlo.

Calidad permite rechazar materiales específicos dentro de un ciclo aprobado. Estos materiales no deben certificarse como liberados. Debe precisarse si la orden espera su resolución, si el documento los identifica como excluidos o si existe otra salida formal; no se presume autorización para emitir varios certificados parciales de una misma orden.

## 2. Formato oficial — respuesta 83

- Utilizar R-AQ-09 para EtO y Vapor, con las tablas técnicas correspondientes a cada método.
- Respetar campos, textos legales y estructura de los archivos de referencia aprobados.
- Conservar código y versión del formato utilizado en cada emisión.
- La referencia aprobada y el procedimiento para aceptar cambios se definirán en el Módulo 8.

Una orden puede incluir varios servicios según Comercial. La respuesta no establece cómo presentar en un mismo certificado ciclos de métodos distintos ni si se permiten esas combinaciones. Tampoco asigna R-AQ-09 a Lavandería o Insumos por defecto.

## 3. Vigencia y conservación de esterilidad — respuestas 84 y 85

- Tres años como vigencia global predeterminada.
- El sistema debe permitir parametrizar vigencias por familia de producto si en el futuro se requieren excepciones por degradación del empaque.
- El Jefe de Calidad autoriza esas excepciones.
- La fecha de vencimiento representa conservación de esterilidad bajo condiciones específicas de almacenamiento; no se presenta simplemente como fecha de caducidad del archivo PDF.
- Incluir literalmente en el pie de página: «Mantener en lugar seco, a temperatura ambiente y protegido de la luz solar directa».

Se propone conservar en el snapshot la regla de vigencia, su autorización y las fechas aplicadas, evitando que un cambio posterior modifique certificados emitidos.

No se ha definido cómo resumir una sola fecha de esterilización y vencimiento cuando el certificado reúne ciclos de distintas fechas o familias con plazos diferentes. No se toma automáticamente la fecha mayor ni se extiende la vigencia de materiales anteriores. Esta decisión afecta también la consulta pública por QR.

## 4. Consecutivos — respuesta 86

- Numeración global y secuencial, compartida por EtO y Vapor.
- La nueva secuencia inicia en `001` y puede crecer hasta `99999999`.
- Los históricos conservan su número original, incluido el ejemplo `55388`.
- Los nuevos certificados siguen el nuevo formato; no se renumeran históricos.

La interpretación de presentación propuesta es un mínimo de tres cifras, ampliándose al crecer la secuencia; no se impone un relleno de ocho cifras que el usuario no solicitó.

Debe definirse cómo evitar o distinguir colisiones cuando la nueva secuencia alcance números históricos. Tampoco se ha fijado qué ocurre al agotar el máximo ni si se permiten saltos por emisiones fallidas. Esta fase no reinicia contadores ni consulta o modifica la base de datos.

## 5. Responsables y firmas — respuesta 87

El certificado requiere tres actuaciones identificadas:

| Bloque | Responsable solicitado | Datos de firma |
| --- | --- | --- |
| Elaborado | Operador de Planta | Nombre, cargo, fecha y hora. |
| Verificado | Analista/Coordinador de Calidad | Nombre, cargo, fecha y hora. |
| Aprobado | Director Técnico | Nombre, cargo, fecha y hora. |

- Incluir código y versión de formato, por ejemplo R-AQ-09 V05; el ejemplo no sustituye la selección de una versión oficialmente vigente.
- Conservar identidad y datos de cada firmante como eran en la actuación, sin reemplazarlos por nombres fijos ni por su perfil actualizado.
- Mantener la independencia entre el operario y quien aprueba, definida en Calidad.

El usuario denomina estas actuaciones «firma digital». Calidad había aceptado reingreso de contraseña y registro de identidad, cargo, fecha/hora e IP para esta fase. Se conservan ambos requisitos sin afirmar que texto impreso, firma electrónica auditable y firma digital criptográfica sean equivalentes. El mecanismo que satisface los tres bloques debe precisarse antes de implementarlo; este documento no certifica validez legal.

También debe definirse quién figura como Elaborado cuando varios operarios procesaron distintos ciclos de una misma orden. No se elige arbitrariamente al último operario.

## 6. Cuadro de estampado y QR — respuesta 88

- El cuadro inferior derecho queda completamente en blanco para el sello físico: sin imagen, QR, texto ni marcador en su interior.
- Ubicar el QR de validación en la cabecera, esquina superior derecha, junto al consecutivo.
- Mantener el cuadro y su posición según la referencia oficial. No se han proporcionado dimensiones numéricas.
- Las firmas y la marca de desviación no deben ocupar el interior reservado para estampado.

## 7. Consulta pública — respuesta 89

El QR abre una página web segura con únicamente la información pública autorizada:

- Estado: Vigente, Vencido o Anulado.
- Cliente.
- Consecutivo.
- Fecha de esterilización.
- Fecha de vencimiento.

No mostrar precios, detalle de materiales ni datos internos de Planta. La restricción debe aplicarse también a los datos entregados a la página, no solo a los campos visibles.

Como propuesta técnica, conservar una referencia pública no predecible para validar el documento. No se define aquí un nuevo mecanismo de autenticación del cliente ni se permite descargar expedientes internos mediante el QR.

El estado Anulado debe mostrarse aunque además haya vencido. El significado de Cliente —por ejemplo razón social visible— y la presentación de fechas de certificados multiciclo deben concretarse sin ampliar silenciosamente los datos públicos.

## 8. Anulación y reemplazo — respuesta 90

- Nunca borrar el certificado.
- Cambiar su estado a `ANULADO`, registrando motivo.
- Para corregirlo, emitir uno nuevo y vincularlo con el original.
- El QR del anulado debe mostrar una alerta roja: «DOCUMENTO ANULADO - Ver nuevo certificado».
- Mantener el QR del original operativo para que comunique la anulación; no redirigirlo silenciosamente como si siempre hubiera identificado al sustituto.

La anulación modifica el estado de validación y su auditoría, no los bytes ni datos firmados del documento histórico. Si aún no existe sustituto, se propone mostrar la anulación sin un enlace inexistente; al emitirse, habilitar el vínculo correspondiente. El acceso al sustituto debe respetar los límites de información pública.

Calidad exige además registrar una desviación para corregir una aprobación. Se mantiene ese requisito. El autorizador de anulación y la política de notificación a clientes no quedaron definidos en esta respuesta.

## 9. Conservación y reconstrucción — respuesta 91

- Conservar PDF, datos, evidencias y versiones durante un mínimo de cinco años.
- El usuario atribuye este plazo a normativa de dispositivos médicos. Se registra como requisito de conservación solicitado; su fundamento normativo específico no fue aportado ni verificado en esta entrega.
- No se interpreta el mínimo como una orden de eliminación automática al cumplirse cinco años. Debe fijarse desde qué evento se cuenta y cómo se manejan obligaciones adicionales de conservación.
- Si se pierde el PDF y se reconstruye desde el snapshot, el nuevo archivo debe llevar una marca visible: **COPIA RESTAURADA**.
- Registrar la restauración en auditoría.

Se propone conservar la referencia y hash del original, asignar una identidad de archivo y hash propios a la copia restaurada y registrar autor, fecha, motivo y fuente de reconstrucción. La marca cambia los bytes: no se debe afirmar que la copia conserva el hash del PDF perdido.

La reconstrucción no debe usar datos actuales de cliente, protocolo, firmas o sellos para reemplazar los del snapshot. Si faltan recursos históricos o evidencia suficiente, no se inventa una reproducción exacta. Restaurar una copia tampoco debe reactivar un certificado anulado.

## 10. Coherencia con Calidad y Planta

| Tema | Definiciones y precisión pendiente |
| --- | --- |
| Aprobación por ciclo frente a certificado por orden | Calidad libera ciclos y exige rollback de aprobación si falla el PDF; aquí el certificado reúne ciclos de una orden. Debe separarse o coordinarse evaluación de ciclos y aprobación final de emisión para evitar exigir un certificado completo cuando aún faltan ciclos de la orden. No se elimina silenciosamente la regla de rollback. |
| Tres actuaciones | El certificado exige Elaborado, Verificado y Aprobado; Calidad contemplaba doble aprobación para desviaciones críticas/reprocesos. Estas actuaciones documentales no sustituyen por defecto las autorizaciones especiales. |
| Liberación por desviación | Se conserva la marca visible «Liberado por Desviación» requerida por Calidad, ubicada fuera del cuadro blanco. Su encaje en R-AQ-09 debe aprobarse dentro del control de formatos. |
| PDF fallido | No publicar un certificado incompleto ni liberar material por una emisión fallida. El alcance transaccional para órdenes con varios ciclos necesita definición conjunta. |
| Métodos y familias mezclados | Tablas técnicas, fechas, vigencias y firmantes deben representar todas las contribuciones sin atribuciones inventadas. |
| Referencia exacta y cambios de presentación | QR en cabecera, marcas de restauración/desviación y filas por ciclo pueden requerir una versión documental controlada; el Módulo 8 resolverá su aprobación. |

## 11. Alcance y siguiente módulo

Solo se documentan requisitos y propuestas identificadas. No se modifica código, datos, consecutivos, PDF, estados, firmas ni permisos. Se conservan los cuestionarios originales.

Continúa el [Módulo 8 — Formatos y Sellos](cuestionarios-origen.md#modulo-8), último bloque del interrogatorio.


<a id="modulo-8"></a>

---

# Módulo 8 — Formatos y Sellos: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 92 a 100 incorporadas desde el mensaje del usuario. Cierra la recopilación por módulos. No acredita implementación, conformidad normativa ni resolución de todas las dependencias entre módulos.

Referencias: [cuestionario original](cuestionarios-origen.md#modulo-8), [Certificados](reglas-maestras.md#modulo-7), [Calidad](reglas-maestras.md#modulo-6) y [Cotizaciones](reglas-maestras.md#modulo-3).

## 1. Responsabilidades documentales — respuesta 92

| Actuación | Responsable |
| --- | --- |
| Propiedad del formato | Jefe de Calidad. |
| Redacción y revisión | Analista de Calidad; ambas pueden recaer en esa función. |
| Aprobación final documental | Director Técnico o Gerente General. |
| Publicación y retiro en el sistema | Calidad. |
| Aceptación final de pruebas | Jefe de Calidad, según respuesta 100. |

La aprobación documental y la aceptación de pruebas son hitos distintos, no autorizaciones contradictorias. No se presume que cualquier usuario de Calidad pueda ejercer todos los permisos. La acumulación de funciones en una misma persona y los permisos concretos deben reflejar la separación acordada al diseñar la matriz.

## 2. Fuente oficial — respuesta 93

- El sistema, mediante sus versiones y hashes congelados en base de datos, es la fuente oficial.
- El Word/PDF controlado tiene función de respaldo físico documental.
- Ante discrepancias, prevalece la versión controlada del sistema.
- Esto no convierte cualquier configuración mutable o archivo recién importado en una versión aprobada: se mantiene el circuito de aprobación y publicación.

Los archivos de referencia siguen siendo evidencia de entrada y de comparación. Las diferencias deben registrarse y resolverse mediante control de cambios; no se borran ni alteran respaldos para ocultarlas. La política no sustituye la necesidad de respaldar y recuperar la base de datos y los recursos documentales.

## 3. Versionado estricto — respuesta 94

- Cualquier cambio exige una nueva versión: textos, campos, cálculos, diseño, logotipos y correcciones tipográficas.
- Se admite una identificación como V4.1 para un ajuste menor; el ejemplo no define todavía toda la gramática de versiones.
- No editar una versión utilizada para cambiar documentos emitidos.
- Conservar la historia y el vínculo entre versiones, con sus aprobaciones y recursos.

Si el cambio afecta al renderizador o al cálculo, versionar solo el texto de la plantilla no basta para reproducir la emisión: la implementación deberá conservar las dependencias efectivamente utilizadas. Es una consecuencia de diseño, no una implementación realizada en esta fase.

## 4. Aprobación y entrada en vigor — respuesta 95

- Registrar por separado fecha de aprobación y fecha de entrada en vigor.
- Permitir publicación programada a futuro.
- Una versión aprobada para el futuro no afecta a las emisiones actuales antes de su vigencia.
- Conservar la versión válida para el instante de emisión y fijarla en el documento.

La zona horaria de activación, tratamiento de emisiones concurrentes y manejo de borradores preparados con una versión anterior deben precisarse al diseñar el flujo. No se presume que aprobar una versión equivalga a activarla inmediatamente.

## 5. Resolución y excepciones — respuesta 96

Prioridad de selección: **Cliente específico > Servicio específico > General**.

- Calidad puede autorizar una Excepción de Versión para un cliente cuyo contrato exige usar una versión anterior.
- Conservar el vínculo con el cliente, versión y autorización; se propone registrar también contrato, motivo, responsable y período aplicable.
- La excepción no modifica la versión histórica ni autoriza reutilizar una licencia de sello suspendida.

Debe concretarse cómo se representa una versión anterior autorizada frente a la exigencia de vigencia de la respuesta 97. No se equipara «anterior» a «retirada utilizable» ni se permite una excepción sin registro.

No se definieron prioridades adicionales por idioma o sede. Para cotizaciones con varios servicios debe resolverse el formato aplicable sin seleccionar arbitrariamente el primer servicio ni aplicar una plantilla incompatible.

## 6. Bloqueo de emisión — respuesta 97

- Bloquear la emisión si falta un formato o sello vigente requerido.
- Mostrar un error crítico comprensible y no permitir continuar con una emisión incompleta.
- No usar una versión alternativa, un sello estático o una imagen predeterminada como sustitución silenciosa.
- Un fallo no debe producir un documento oficial parcialmente generado ni una liberación operativa sin el certificado requerido.

El usuario justifica el bloqueo como exigencia legal y señala que el sistema ya lo realiza. Aquí se registra la política de negocio; no se ha verificado su fundamento normativo ni la cobertura efectiva del bloqueo en el código. No se presenta esa afirmación como dictamen jurídico o resultado de pruebas.

La Excepción de Versión de la sección 5 requiere una resolución explícita compatible con este bloqueo; no se interpreta como autorización general para omitirlo.

## 7. Normas, licencias y sellos — respuesta 98

- Calidad administra normas y licencias de sellos, por ejemplo ICONTEC.
- Generar alertas 30 días antes del vencimiento de la licencia.
- Si una licencia se suspende, bloquear automáticamente su uso en nuevas emisiones.
- Una licencia vencida no satisface la vigencia exigida para emitir.
- El cambio de estado de una licencia no reescribe imágenes ni bytes de documentos ya emitidos.

La alerta forma parte del requisito futuro del producto; no se crea una automatización externa durante esta fase. Destinatarios, canal, repetición y conducta para licencias cargadas cuando faltan menos de 30 días deben concretarse. Los cambios de alcance de licencia tampoco quedaron desarrollados en la respuesta.

La política sobre notificación o eventual anulación de documentos afectados por una suspensión posterior debe definirse por separado; inmutabilidad del archivo no equivale a afirmar que su estado público de validez nunca cambia.

## 8. Inmutabilidad y condiciones comerciales — respuesta 99

- Cambiar un formato o sello nunca altera documentos emitidos.
- El snapshot debe conservar las referencias y los datos documentales de la emisión.
- Los seis campos de condiciones comerciales se incorporan mediante una nueva versión del formato.
- Mantener los rótulos exactos acordados en Cotizaciones y sus valores independientes.
- No distribuir automáticamente textos históricos entre campos nuevos ni regenerar PDFs anteriores con la nueva presentación.

La protección debe incluir recursos utilizados, versión del formato, sellos e identidades congeladas. No se supone que guardar únicamente un ID a un recurso mutable garantice la inmutabilidad.

## 9. Aceptación y pruebas — respuesta 100

La aceptación final corresponde al Jefe de Calidad. Las pruebas solicitadas incluyen:

- Textos largos sin cortes ni pérdida de contenido.
- Saltos de página automáticos.
- Cotizaciones en COP y USD.
- Verificación de históricos intactos después de cambiar formatos o sellos.

Se propone conservar el resultado y la versión evaluada, casos utilizados, responsable, fecha y hallazgos. Comparar datos y hashes de históricos antes y después permite comprobar conservación; no basta una inspección visual superficial.

La respuesta no confirma pruebas de impresión física o de otros idiomas. Permanecen como posibles ampliaciones, no como aceptación ya realizada. Ninguna de las pruebas funcionales aquí descritas se ejecutó durante esta actualización documental.

## 10. Cierre documental y dependencias

Las respuestas de los ocho módulos están incorporadas. La recopilación queda cerrada; continúan identificadas las decisiones no respondidas, propuestas del analista y conflictos entre módulos.

Antes de implementar el control documental deben conciliarse especialmente:

- Excepción de versión anterior frente a bloqueo por falta de vigencia.
- Plantilla para cotizaciones con varios servicios.
- Aprobación documental por Director Técnico/Gerente General frente a aceptación de pruebas por Jefe de Calidad.
- Formato oficial controlado frente a las nuevas tablas multiciclo, marcas de desviación/restauración y QR en cabecera exigidos en Certificados.
- Mecanismo de firma solicitado y permisos específicos de cada responsable.

No se modifica código de producción, datos, plantillas operativas, licencias, permisos ni PDFs. No se publican versiones ni se activa la refactorización con esta entrega.
