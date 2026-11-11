# STERINOVA — PLAN MAESTRO DE CIERRE DEL BACKEND Y PREPARACIÓN PARA PRUEBAS LOCALES

> **Destino:** agente de código que trabaja en VS Code.  
> **Proyecto:** `C:\Users\urria\Sterinova-Backend` (NestJS + TypeORM + MariaDB/MySQL).  
> **Frontend relacionado, solo para contratos y validación puntual:** `C:\Users\urria\SterinovaFrontend` (Next.js/React).  
> **Modo de trabajo:** inspección focalizada → diagnóstico con evidencia → corrección mínima → pruebas → informe de cierre.  
> **Objetivo:** dejar el **Backend preparado y comprobado para ejecutar Sterinova localmente con cuentas ficticias de todos los perfiles y cargos existentes**, sin afirmar que está listo para producción.

## 0. Contexto que ya se conoce (NO repetir auditorías generales)

La información siguiente proviene de reportes anteriores del agente y debe **comprobarse solo cuando sea relevante**, no asumirse como verdad definitiva:

- Autenticación y RBAC ya tienen implementaciones y pruebas focalizadas. En una ejecución anterior se informaron **49 pruebas focalizadas aprobadas**, **346 pruebas de `src` aprobadas y 2 omitidas**, **64 pruebas de frontend aprobadas**, y compilación/lint correctos. No equivale a una prueba de login real con MariaDB.
- Existen migraciones para `usuarios.password_version` y `password_reset_tokens`, registradas, pero **no se ha demostrado que se hayan aplicado exitosamente a MariaDB aislada**.
- El restablecimiento utiliza tokens aleatorios de un uso, hash SHA-256, expiración de 15 minutos, aumento de `password_version` y transacción; la exclusión del **usuario ID 1** debe permanecer. La concurrencia real en MariaDB no está verificada.
- Se generaron PDF reales de Orden de Servicio y Acta de Servicio a partir de datos ficticios, se compararon visualmente algunos escenarios y se trabajó con plantillas institucionales. **La Fase 2 de Logística no debe declararse cerrada por esa sola evidencia.**
- En la **Orden de Servicio de 10 materiales** observada, los valores por fila (10.000, 20.000, ..., 100.000) suman **550.000**, mientras el PDF muestra subtotal **100.000**, IVA **19.000** y total **119.000**. Esto podría ser una inconsistencia del *fixture* de prueba y no necesariamente un defecto del backend. Determinar la causa; prohibido «arreglar» cifras a ciegas.
- En PDF de prueba se vio el texto `log?stica`: distinguir corrupción del dato de entrada, codificación, fuentes y extracción de texto antes de corregir.
- Siguen sin fuente operativa confirmada algunos campos de recepción, entrega, número de cajas, responsables, observaciones, firmas y consecutivo propio del Acta. El historial auditable de emisiones también está pendiente.
- Hay pruebas estructurales con diferentes cantidades de materiales; la validación real de paginación para **50 y 101 materiales**, textos extensos y datos nulos debe documentarse explícitamente.
- Ya existen `AGENTS.md`, `docs/CONTEXTO_RAPIDO.md` y documentación de auditoría/arquitectura. Aplicar lectura progresiva y no volver a explorar el repositorio completo.

**Referencias iniciales:** `docs/CONTEXTO_RAPIDO.md`, `AGENTS.md`, `docs/auditorias/RESULTADO_CORRECCION_AUTENTICACION_RBAC.md`, `docs/auditorias/VALIDACION_FORMATOS_LOGISTICA.md`, `src/database/migration-registry.ts`, `src/pdf/pdf-generator.service.ts`, `src/logistica/` y los tests de esos módulos. Si un documento no existe o cambió, indicar el hecho y continuar con evidencia del código actual.

## 1. Reglas innegociables

1. **No modificar ni utilizar la cuenta con ID 1 para estas pruebas.** No cambiar credenciales, hashes, roles, estados ni permisos de personas reales.
2. **Nunca usar producción, bases compartidas o una base de datos local que contenga información real sin aprobación explícita.** No asumir que la conexión presente en `.env` es de pruebas.
3. **Separar preparación y ejecución:** inspecciones, builds y pruebas sin DB pueden realizarse; solicitar autorización antes de crear/restaurar bases, ejecutar migraciones, seeders o escribir registros, incluso en local. Mostrar nombre, host, puerto, propósito, impacto y mecanismo de reversión, **sin mostrar contraseñas**.
4. No ejecutar despliegues, `git commit`, `git push`, operaciones destructivas, limpieza masiva o cambios de esquema fuera del entorno desechable autorizado.
5. No ejecutar macros de `LOGISTICA.xlsm` ni modificar plantillas institucionales originales. No incorporar documentos privados o datos de clientes al juego de pruebas.
6. No introducir roles, scopes, permisos, entidades o tablas por suposición. Si una decisión de negocio falta, documentarla y ofrecer una opción mínima **sin implementarla hasta autorización**.
7. No suprimir temporalmente autenticación, permisos, validación de ámbitos o controles de tokens para «hacer pasar» pruebas.
8. No introducir secretos en prompts, logs, scripts versionados, capturas o respuestas del agente. El `.gitignore` **no cifra ni restringe** archivos; aplicar además controles locales de acceso.
9. Utilizar **skills instaladas pertinentes** (p. ej. depuración sistemática, generación de pruebas, revisión de código, verificación antes de finalizar, PDF cuando sea necesario). Leer su guía y usar solo las relacionadas; evitar recorrer todo el catálogo o ejecutar skills redundantes.
10. **No cambiar el frontend general en esta fase**; únicamente comprobar contratos API relevantes o corregir una incompatibilidad bloqueante aprobada, indicando exactamente el archivo afectado.

## 2. Etapa A — Fotografiar el estado actual en modo solo lectura

Revisar los cambios sin confirmar (`git status --short`, `git diff --stat`) y **preservarlos**. No hacer reset, stash, checkout ni sobrescribir modificaciones ajenas.

Analizar selectivamente:

- Estado de autenticación (`auth`), usuarios (`users`), JWT, RBAC y sus controladores.
- Catálogo RBAC: áreas, cargos/roles reales, permisos, scopes, asignaciones, estados activos/inactivos y jerarquías que estén efectivamente modeladas.
- Registro y contenido de migraciones, configuración de conexión y comandos de migración, con especial atención a `password_version` y `password_reset_tokens`.
- Servicios y contratos de Logística, Orden de Servicio, Acta, cotizaciones, materiales y PDF.
- Tests disponibles, incluyendo los que realmente requieren una base de datos.

**Salida breve en chat:** tabla `módulo / estado / evidencia archivo:línea o test / bloqueo / acción mínima`. Distinguir **implementado**, **demostrado con test**, **validado con MariaDB**, **pendiente de decisión**. No afirmar que todas las cuentas están listas basándose solo en tests simulados.

## 3. Etapa B — Integridad de datos financieros en Orden y Acta

**Objetivo:** que cada cifra impresa tenga una fuente y una regla consistente.

1. Rastrear `cotización → ítems/valores → orden/materiales → snapshot PDF → render` y comprobar de dónde salen cantidad, precio unitario, subtotal, descuentos, transporte, impuestos y total. No asumir que `material.cantidad × valor_unitario` es la regla comercial si el modelo establece otra.
2. Reproducir **sin DB y con datos ficticios** el escenario problemático de 10 materiales y explicar por qué las filas sumaban 550.000 y el subtotal mostraba 100.000.
3. Determinar si el error está en el *fixture*, el mapeo de ítems, el cálculo, los redondeos o el render. Corregir **solo la causa demostrada**. Si son valores de distinta naturaleza (p. ej. cantidad vs unidad cotizada), reflejar esa regla en pruebas y documento, sin inventarla.
4. Comprobar escenarios de cantidades diferentes, precios repetidos, cantidades mayores que uno, material sin ítem asociado, importes nulos, valores cero, impuestos y redondeo según reglas existentes. No introducir cambios fiscales sin evidencia y autorización.
5. El documento nunca debe mostrar cifras presentadas como conciliadas cuando no lo estén: definir y probar si corresponde **impedir la emisión**, marcar el dato faltante o mostrar solo campos verificables.
6. Crear pruebas automáticas que garanticen consistencia entre datos de origen, detalle y totales; verificar tanto Orden como Acta si muestran precios.

**Criterio de aceptación:** fixtures coherentes producen importes reconciliados; fixtures incoherentes generan el comportamiento seguro definido y probado. No aprobar por apariencia del PDF.

## 4. Etapa C — Finalizar generación de PDF y fidelidad documental

Documentos originales de referencia (solo lectura):

- `docs/ejemplos-formatos/Orden de Servicio.pdf`
- `docs/ejemplos-formatos/Acta de Servicio.pdf`
- `docs/ejemplos-formatos/LOGISTICA.xlsm` (**no ejecutar macros**)

Procedimiento:

1. Generar PDF mediante **el servicio real del backend**, con snapshots enteramente ficticios, para **1, 15, 50 y 101 materiales** de **ambos documentos**; agregar casos de textos largos, caracteres `áéíóúñ`, lote extenso y campos opcionales vacíos.
2. Comprobar de forma automática al menos: `%PDF`, número de páginas, cantidad de ítems preservados, sumas, presencia de encabezados, tabla, totales y secciones finales. **El conteo de páginas no demuestra por sí solo que no existan recortes.**
3. Renderizar todas las páginas a imágenes con una herramienta local disponible y revisar **primera, intermedias y última** cuando haya varias. Comparar con los originales: estructura, código `R-ES-02` y `R-LG-04` según plantilla, títulos, márgenes, columnas, saltos, continuidad de tablas, cabeceras, pie, firmas y ausencia de superposiciones o filas perdidas.
4. Investigar si `log?stica` ya aparece en el dato generado o surge en PDF/fuente/extracción; demostrarlo con una prueba Unicode y corregir únicamente la capa culpable.
5. Conservar el renderizado de **previsualización en memoria**, sin sobrescribir PDF histórico. Comprobar descarga autenticada, permiso `logistica.ordenes.ver` y control de ámbito del recurso, con denegación conservadora ante ámbito desconocido.
6. Guardar **solo artefactos ficticios** en un directorio temporal ignorado, sin mezclarlos con formatos originales ni documentos reales. No iniciar servidor accesible externamente: enlazarlo a `127.0.0.1` si se requiere para pruebas.
7. Si una herramienta de render falla, registrar el error y emplear una alternativa disponible; **no declarar validación visual completa** sin evidencia.

**Criterio de aceptación:** ambos tipos de PDF pasan escenarios de 1/15/50/101 ítems, texto extenso y Unicode, sin pérdida de filas ni recortes; la comparación visual queda documentada con hallazgos y límites reales.

## 5. Etapa D — Cerrar flujo operacional de Logística SIN inventar reglas

Inspeccionar si existe origen verificable, momento del proceso, actor autorizado y persistencia para:

- Fecha/hora de recepción real y responsable que recibe.
- Persona que entrega y persona que recibe material.
- Cantidad y estado de cajas recibidas/entregadas; cantidades de material recibidas/entregadas.
- Proceso realizado, transporte, empaque, observaciones de recepción y del cliente, eventos de entrega.
- Campos de firmas, certificado, factura, número propio de Acta y registro de emisión/versión.

**Para cada campo:** clasificar como `ya persistido y utilizable`, `derivable con regla confirmada`, `sin fuente`, `requiere decisión de negocio`. No usar fecha programada como fecha de recepción ni trasladar observaciones de una etapa a otra sin evidencia.

- Si la fuente ya existe y el mapeo está roto: corregirlo con cambios mínimos y tests.
- Si faltan decisiones funcionales o entidades persistentes: **presentar el diseño mínimo, contrato/API y posible migración, pero no implementarlos ni ejecutarlos automáticamente**. Preguntar únicamente por las decisiones bloqueantes, agrupadas en una sola solicitud breve.
- Definir explícitamente si el Acta se emite antes/después de recepción, esterilización o entrega; el agente no debe inventar el flujo.
- Si la falta impide cerrar la Fase 2, reportar **FASE 2 PENDIENTE POR DECISIÓN OPERATIVA** en vez de marcarla terminada artificialmente.

**Criterio de aceptación:** no hay campos poblados con datos de otra etapa; cada campo visible tiene fuente documentada o queda vacío de forma deliberada; los bloqueos de negocio están delimitados.

## 6. Etapa E — Cierre técnico de autenticación/RBAC para pruebas locales

### E1. Matriz real de cargos

Extraer del **catálogo RBAC implementado**, no de ejemplos genéricos, una matriz `área → rol/cargo → ámbito → permisos efectivos → acciones permitidas/prohibidas`. Incluir **todos los cargos**, no solo jefes:

- Comercial: responsable y asesores, **si existen en el catálogo**.
- Logística: responsable y asesores logísticos, **si existen**.
- Planta: responsable y operarios, **si existen**.
- Calidad: responsable y personal operativo, **si existen**.
- Administración y cualquier otra área o rol realmente existente.

Distinguir nombre visible del cargo, rol RBAC y scope: **no son equivalentes**. Si faltan roles esperados, listarlos como decisión, **no crearlos por intuición**.

### E2. Validaciones de seguridad

Comprobar con pruebas focalizadas:

- Login correcto/incorrecto, usuario inactivo y sin asignaciones.
- Usuario con ámbito distinto, permiso denegado 403, sesión inválida 401 y JWT anterior sin `password_version`.
- Restablecimiento: token hash, 15 minutos, uso único, invalidación de JWT anterior, controles de cuentas privilegiadas, transacciones y **ID 1 intocable**.
- Intentos simultáneos de consumir el mismo token: simulación unitaria y posteriormente **integración contra MariaDB desechable** para demostrar el lock y el resultado de un solo ganador.
- Permisos en backend independientes de controles visuales del frontend.

### E3. Migraciones y compatibilidad

- Verificar que el registro, el `up/down` y el orden de las dos migraciones correspondan al esquema TypeORM. Analizar dependencias y situación de esquemas anteriores.
- Definir orden seguro para activar backend nuevo **después** de aplicar ambas migraciones en base de prueba y verificar columna/tabla y `password_version` inicial; no probar despliegue sobre esquema antiguo.
- Probar respaldo y restauración de la **base desechable** antes de cambios. Registrar conteos agregados y huellas internas pre/post sin publicar hashes, tokens ni datos personales.
- No asumir que una prueba de `QueryRunner` simulado prueba compatibilidad real con MariaDB.

## 7. Etapa F — Base local desechable, datos ficticios y credenciales privadas (REQUIERE APROBACIÓN)

**Detenerse antes de escribir en una base.** Presentar una ficha de autorización que indique host, puerto, nombre de DB, carácter desechable, variables de entorno dedicadas, migraciones por ejecutar, creación de roles/usuarios y procedimiento de limpieza o restauración. **Nunca mostrar la contraseña de conexión.** Proponer puerto de pruebas distinto del puerto estándar si facilita demostrar aislamiento, pero verificarlo realmente.

**Tras aprobación expresa del usuario para ese destino concreto:**

1. Utilizar MariaDB local aislada y base exclusiva para pruebas, con cuenta DB de privilegios mínimos. No importar datos reales ni usar `.env` de producción.
2. Comprobar respaldo/restore de esa base de pruebas y aplicar migraciones necesarias en orden. No alterar el ID 1.
3. Preparar un **seeder local idempotente** para identidades ficticias con al menos un usuario por cada combinación de rol/cargo y scope relevante. Cuando se necesite probar aislamiento entre trabajadores, crear dos o más cuentas diferenciadas. No duplicar ni sobrescribir contraseñas al repetir el seeder sin consentimiento.
4. Contraseñas aleatorias **distintas y seguras** generadas localmente. Persistir solo hashes en la DB, nunca texto plano.
5. Guardar usuario, contraseña, perfil exacto, área, scope, estado y objetivo de prueba en **un documento privado únicamente local**, por ejemplo:

   `docs/local/CREDENCIALES_PRUEBAS_LOCAL.md`

6. Antes de escribir ese documento, incluir en `.gitignore` del backend:

   ```gitignore
   # Solo pruebas locales: credenciales privadas
   /docs/local/CREDENCIALES_PRUEBAS_LOCAL.md
   ```

   Verificar con `git check-ignore -v docs/local/CREDENCIALES_PRUEBAS_LOCAL.md` y `git ls-files -- docs/local/CREDENCIALES_PRUEBAS_LOCAL.md`. Si el archivo ya está rastreado o se expuso antes, **detenerse y avisar**: ignorarlo después no borra el historial.
7. Restringir permisos del archivo a la cuenta local cuando sea posible; no sincronizarlo en nubes, no poner contraseñas en mensajes ni logs. Señalar al usuario que es **texto claro local**, y ofrecer almacenamiento más seguro si lo desea. `.gitignore` no impide acceso por herramientas o sincronización externa.
8. Incluir pruebas de perfiles activos, inactivos, sin rol, ámbitos cruzados y niveles de responsabilidad (responsable vs. asesor/operario) existentes.
9. Comprobar inicio de sesión real mediante HTTP contra el Backend local y, si está autorizado levantar el Frontend, un recorrido E2E básico por perfil. Las peticiones de prueba deben dirigirse solo a `127.0.0.1`/servicios de prueba claramente identificados.
10. Entregar la **ruta** del documento, no su contenido secreto.

**Criterio de aceptación:** migraciones y tests de integración pasan en MariaDB aislada; todas las identidades sintéticas previstas pueden autenticarse según estado y solo acceder a recursos autorizados; el documento privado existe y no figura en Git.

## 8. Etapa G — Pruebas finales y regresiones

Ejecutar, según scripts realmente presentes en `package.json` y configuración local:

- Build y lint de backend.
- Pruebas de auth/RBAC/reset/migraciones/usuarios.
- Pruebas de Logística, cotizaciones y generador de PDF.
- Suite de `src` y pruebas de integración que **no dependan de un servidor real**.
- Pruebas con MariaDB **solo después de la autorización explícita** de la etapa F.
- Comprobaciones de contratos con el frontend; no llamar «E2E» a pruebas de servicios aislados.

Para cada ejecución: comando exacto, número de pruebas aprobadas/fallidas/omitidas, fecha, alcance, causa de fallo y cambios aplicados. Evitar repetir suites completas tras cambios solo documentales. No aumentar timeouts para ocultar fallos de lógica; si se amplía uno por trabajo criptográfico costoso, justificarlo con evidencia de ejecución aislada y bajo carga.

Aplicar `git diff --check` y revisar `git status --short`. No afirmar que no hubo cambios si la comparación indica lo contrario; distinguir cambios propios y preexistentes.

## 9. Criterios de cierre y definición de «terminado»

Usar **tres estados separados**:

### A. Backend listo para **pruebas locales**

Solo si:

- Build y lint completados.
- Tests focalizados y de regresión relevantes aprobados o fallos justificados.
- Documentos generan correctamente y sus números están reconciliados.
- Integración real con MariaDB desechable y migraciones verificada.
- Usuarios ficticios de todos los perfiles/cargos y scopes existentes creados tras autorización; credenciales privadas y excluidas de Git.
- Inicios de sesión, autorizaciones y restablecimiento validados contra el entorno local.

### B. Fase 2 de Logística completada

Solo si, además de PDF visualmente correcto, los campos operativos y el historial documental requeridos por el alcance aprobado están modelados y validados. Si existen decisiones pendientes, **no declarar completada la fase**.

### C. Listo para producción

**No es el objetivo de esta tarea** y no debe afirmarse por pasar pruebas locales. Requiere decisiones independientes de seguridad, backups, despliegue y datos reales.

## 10. Entrega del agente — directamente en el chat, sin credenciales

Al finalizar cada etapa, mostrar un informe breve y verificable:

| Campo | Contenido exigido |
|---|---|
| Etapa | A, B, C, D, E, F o G |
| Diagnóstico | Problema real, alcance y evidencia `archivo:línea` o prueba |
| Modificaciones | Ruta de cada archivo y finalidad |
| Pruebas | Comandos, cifras de aprobadas/fallidas/omitidas |
| Base de datos | **No usada / pendiente de aprobación / usada exclusivamente en base autorizada** |
| Seguridad | Estado de ID 1, RBAC, credenciales privadas y Git |
| Pendientes | Bloqueos concretos y decisiones de negocio |
| Estado | `LISTO PARA PRUEBAS LOCALES` o `PENDIENTE`, explicando por qué |

**No crear otro gran documento de auditoría salvo que se solicite**; el entregable principal de esta instrucción es el backend verificable y un reporte conciso en chat. Conservar documentación histórica ya existente. Nunca copiar contraseñas, tokens, claves API ni hashes al chat o a un artefacto público.

## 11. Orden de ejecución inmediato

1. Ejecutar **A** (diagnóstico mínimo) sin modificar nada; enumerar riesgos, decisiones y archivos específicos.
2. Continuar con **B** y **C** cuando haya evidencia, usando datos sintéticos y pruebas sin DB.
3. Para **D**, resolver solo mapeos con fuente comprobada; **detener cambios de negocio no autorizados**.
4. Completar verificación estática y pruebas aisladas de **E**.
5. Presentar **solicitud de aprobación explícita** de **F**, con datos no sensibles y alcance exacto.
6. Tras la aprobación, ejecutar **F** y **G**, y entregar el estado final.

**Regla final:** prioriza resultados medibles y código correcto sobre refactorizaciones grandes, nuevas dependencias o exploración innecesaria. Si un bloqueo depende de negocio o autorización, no lo eludas: repórtalo de forma precisa para que el usuario pueda decidir.
