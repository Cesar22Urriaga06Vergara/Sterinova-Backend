# Requisitos Sterinova ERP

## Criterio de fuentes

`Sterinova-ERP.md` es la fuente contractual; documentación y código son contraste técnico. Las marcas de cierre de módulos backend se refieren a sus fichas, no a la cobertura del frontend. La [matriz de análisis frontend](frontend/README.md) conserva por separado evidencia UI y cobertura API; las diferencias se registran sin resolución silenciosa. Esta documentación no acredita una base desplegada.

## Criterio de cierre documental previo a implementación

El cierre documental global requiere: mapear cada requisito contractual a una ficha o exclusión justificada; conservar los 16 campos y evidencia de backend, persistencia y frontend cuando aplique; asignar cada brecha a un destino vigente; registrar por separado las decisiones confirmadas y las preguntas que bloquean diseño; y obtener validación explícita de las fichas que siguen pendientes. Una decisión de negocio no implica que el código esté cubierto ni autoriza cambios.

**Estado verificado al 2026-11-20:** 38 fichas base cuentan con análisis de 16 campos. Las 35 fichas de Comercial, Logística, Planta, Calidad, Certificados, Usuarios y Auditoría fueron validadas como análisis de cobertura; esto no aprueba políticas funcionales aún abiertas. `RNF-SEG-001`, `RNF-SEG-002` y `RF-TRA-001` fueron presentadas y siguen pendientes de validación explícita. Además, la instrucción de decisiones de Prioridad 1 declara que los bloques funcionales de Logística y Planta no están aprobados como requisitos operativos, aunque sus análisis técnicos estén validados; mantener esa distinción hasta la ronda funcional correspondiente. Hay 51 requisitos derivados activos en borrador más el antecedente `RF-SEG-001` consolidado en `RNF-SEG-002`. Las 52 fichas derivadas/antecedentes están normalizadas al formato de 16 campos preliminares. Hay 29 fichas RA y un documento general de decisiones prioritarias; varias RA quedaron parcialmente resueltas con D-CAL-001/002, D-PLA-001 y D-LOG-001, mientras sus detalles técnicos/evidencias siguen abiertos. La matriz frontend tiene evidencia estática de todos los módulos, pero solo el bloque Comercial consta como validado funcionalmente. Por tanto, el cierre documental global **sigue en curso** y no se inicia implementación hasta resolver/validar los elementos bloqueantes y cerrar la matriz de cobertura.

## Índice y trazabilidad inicial

> ✅ **Módulo Comercial / Cotizaciones: 100% analizado** (RF-COM-001 a RF-COM-008 revisados y validados). Esta marca indica cierre del análisis documental del bloque; no significa que todos los requisitos estén cubiertos por el código. Los estados parciales, borradores derivados y decisiones pendientes se mantienen reflejados en este índice.
> ✅ **Módulo Logística: 100% analizado documentalmente** (RN-LOG-001/002 y RF-LOG-001 a RF-LOG-005 revisados y validados). Esta marca indica cierre del análisis documental del módulo, no cobertura total del código; las brechas derivadas y decisiones pendientes siguen listadas abajo.
> ✅ **Módulo de Planta: 100% analizado documentalmente** (RF-PLA-001 a RF-PLA-005 y RN-PLA-001/002 revisados y validados). Esta marca indica cierre del análisis documental del bloque; no implica que todos los requisitos estén cubiertos por el código. Los borradores derivados y decisiones pendientes siguen listados abajo.
> ✅ **Módulo de Calidad: 100% analizado documentalmente** (RF-CAL-001 a RF-CAL-004 y RN-CAL-001 revisados y validados). La marca indica cierre documental del bloque; no cobertura completa del código. Las brechas, borradores y decisiones pendientes permanecen listados abajo.
> ✅ **Módulo de Certificados: 100% analizado documentalmente** (RF-CER-001 a RF-CER-003 y RN-CER-001 revisados y validados). Cierre documental, no cobertura total del código; las brechas y definiciones derivadas siguen en el índice.
> ✅ **Módulos de Usuarios y Auditoría: 100% analizados documentalmente** (RF-USR-001 a RF-USR-003 y RF-AUD-001 revisados y validados). Cierre del análisis documental, no cobertura total del código; los requisitos derivados y brechas permanecen en el índice.
> 🟡 **Seguridad y Trazabilidad: análisis técnico documentado; fichas pendientes de validación** (RNF-SEG-001, RNF-SEG-002 y RF-TRA-001). Las brechas de implementación siguen abiertas.

> ⚠️ **Alcance logístico pendiente:** `RF-LOG-002` y `RN-LOG-002` fueron validadas como análisis de cobertura parcial; esto no aprueba las reglas funcionales del Bloque 2 ni define saldos, rechazos y disposición. Mantener esas definiciones y su implementación bloqueadas hasta validar el alcance operativo.

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-COM-001](backend/comercial/RF-COM-001-clientes.md) | Registrar y consultar clientes | RF / Comercial | Validado; cubierto | `src/clientes/`; tabla `clientes` y migraciones versionadas |
| [RF-COM-002](backend/comercial/RF-COM-002-productos-servicios.md) | Gestionar productos y servicios | RF / Comercial | Validado; cubierto | `src/productos/`, `src/cotizaciones/`, `src/tasas-fiscales/`; tablas `productos`, `cotizacion_items`, `tasas_fiscales`, `cotizaciones` |
| [RF-COM-003](backend/comercial/RF-COM-003-cotizaciones-crud.md) | Crear y editar cotizaciones con varios ítems | RF / Comercial | Validado; cubierto | `src/cotizaciones/`; tablas `cotizaciones`, `cotizacion_items` |
| [RF-COM-004](backend/comercial/RF-COM-004-condiciones-vigencia.md) | Gestionar condiciones, precios y vigencia | RF / Comercial | Validado; parcial | `src/cotizaciones/`; tabla `cotizaciones` y detalle `cotizacion_items` |
| [RF-COM-005](backend/comercial/RF-COM-005-revision-aprobacion.md) | Revisar y aprobar cotizaciones | RF / Comercial | Validado; parcial | `src/cotizaciones/`, `src/rbac/`; aprobación y responsable persistidos en `cotizaciones` |
| [RF-COM-006](backend/comercial/RF-COM-006-envio-aceptacion.md) | Enviar y registrar aceptación del cliente | RF / Comercial | Validado; parcial | `src/cotizaciones/`; estados y metadatos de aceptación existen, flujo pendiente |
| [RF-COM-007](backend/comercial/RF-COM-007-emitir-documentos.md) | Emitir documentos comerciales y conservar sus datos | RF / Comercial | Validado; parcial | `src/cotizaciones/`, `src/pdf/`; snapshot, PDF, hash y versión documental |
| [RF-COM-008](backend/comercial/RF-COM-008-anulaciones.md) | Solicitar y gestionar anulaciones | RF / Comercial | Validado; parcial | `src/cotizaciones/`; solicitud, aprobación/rechazo y conservación del original |
| [RF-COM-012](backend/comercial/RF-COM-012-paso-revision.md) | Implementar el paso de Revisión (`EN_REVISION`) | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; transición a revisión pendiente |
| [RF-COM-013](backend/comercial/RF-COM-013-implementar-envio-aceptacion.md) | Implementar flujo de envío y aceptación | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; rutas, transiciones y bloqueo de emisión pendientes |
| [RF-COM-014](backend/comercial/RF-COM-014-bloqueo-emision-anulacion.md) | Bloqueo de emisión por anulación pendiente | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; compuerta transaccional pendiente |
| [RF-COM-009](backend/comercial/RF-COM-009-importacion-clientes.md) | Importación masiva de clientes | RF / Comercial | Borrador, pendiente de validación | `POST /clientes/bulk`; tabla `clientes` |
| [RF-COM-010](backend/comercial/RF-COM-010-descuentos-cotizaciones.md) | Cálculo de descuentos en cotizaciones | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; cálculo de descuentos no evidenciado en DTO/entidad revisados |
| [RF-COM-011](backend/comercial/RF-COM-011-vigencia-oferta.md) | Control de vigencia y expiración de ofertas | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; fecha de vencimiento y control pendientes |
| [RF-SEG-001](backend/seguridad/RF-SEG-001-password-aprobaciones.md) | Confirmación por contraseña en operaciones críticas | RF / Seguridad | Consolidado como antecedente en RNF-SEG-002; sin requisito independiente | Verificación de contraseña existe; el catálogo de operaciones críticas queda pendiente |
| [RNF-SEG-001](backend/seguridad/RNF-SEG-001-autorizacion-ambito.md) | Validación de autorización y ámbito en backend | RNF / Seguridad | Análisis presentado; ficha pendiente de validación; parcial | `src/auth/`, `src/rbac/`; guardia global; ruta de descarga logística pendiente de verificar el ámbito del recurso |
| [RNF-SEG-002](backend/seguridad/RNF-SEG-002-sesiones-operaciones-criticas.md) | Protección de sesiones y operaciones críticas | RNF / Seguridad | Análisis presentado; ficha pendiente de validación; parcial | JWT 8 horas, invalidación por versión, throttling; frontend conserva access token en `localStorage`; reautenticación no generalizada |
| [RA-SEG-001](por-aclarar/RA-SEG-001-evidencia-legal-firmas.md) | Alcance jurídico y evidencia de firmas y autorizaciones | RA / Seguridad / Documentos / Calidad | Pendiente de decisión | Evidencia jurídica de firmas declarada pendiente en §8; criterios por definir |
| [RA-COM-001](por-aclarar/RA-COM-001-ciclo-vida-cliente.md) | Alcance contractual del ciclo de vida del cliente | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-002](por-aclarar/RA-COM-002-categorizacion-dispositivos.md) | Categorización de dispositivos médicos | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-003](por-aclarar/RA-COM-003-flujo-reemplazo.md) | Flujo de reemplazo de cotizaciones emitidas | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-004](por-aclarar/RA-COM-004-transicion-estado-emitida.md) | Transición de estado a EMITIDA | RA / Comercial | Pendiente de decisión técnica/negocio | No aplica hasta decisión |
| [RA-COM-005](por-aclarar/RA-COM-005-precios-cliente.md) | Precios especiales reutilizables por cliente | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-006](por-aclarar/RA-COM-006-evidencia-aceptacion.md) | Evidencia de aceptación del cliente | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-007](por-aclarar/RA-COM-007-reconstruccion-pdf-historico.md) | Política de reconstrucción de PDFs históricos | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-008](por-aclarar/RA-COM-008-politicas-anulacion.md) | Políticas de resolución de anulaciones | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-FIS-001](por-aclarar/RA-FIS-001-fiscalidad-por-producto.md) | Fiscalidad por producto o servicio | RA / Fiscal | Pendiente de decisión | No aplica hasta decisión |
| [RN-LOG-001](backend/logistica/RN-LOG-001-creacion-ordenes.md) | Crear órdenes desde cotizaciones aceptadas | RN / Logística | Validado; parcial | `src/logistica/`, `src/ordenes-servicio/`; `ordenes_servicio`, `ordenes_servicio_materiales` |
| [RF-LOG-001](backend/logistica/RF-LOG-001-recogidas-rutas.md) | Registrar recogidas, rutas y llegadas directas | RF / Logística | Validado; parcial | `src/logistica/`; órdenes y eventos logísticos; ruta compartida pendiente |
| [RF-LOG-006](backend/logistica/RF-LOG-006-precarga-items.md) | Precarga automática de ítems cotizados en órdenes | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; precarga y vínculo de materiales pendientes |
| [RF-LOG-007](backend/logistica/RF-LOG-007-fix-relacion-orden.md) | Corrección de cardinalidad Cotización-Orden | RF / Logística / Persistencia | Borrador, pendiente de validación | Entidad `OrdenServicio` declara `OneToOne`; migración permite múltiples órdenes |
| [RF-LOG-008](backend/logistica/RF-LOG-008-entidad-rutas.md) | Implementar gestión de rutas compartidas | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; entidad y flujo de ruta pendientes |
| [RF-LOG-009](backend/logistica/RF-LOG-009-modalidad-ingreso.md) | Añadir modalidad de ingreso (Recogida vs. Llegada Directa) | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; distinción persistida pendiente |
| [RA-LOG-001](por-aclarar/RA-LOG-001-soportes-comerciales.md) | Soportes comerciales para creación de órdenes | RA / Logística / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RF-LOG-002](backend/logistica/RF-LOG-002-recepciones.md) | Registrar recepciones completas y parciales | RF / Logística | Validado; parcial | `src/logistica/`; cabecera de recepción, detalle y saldo pendientes |
| [RN-LOG-002](backend/logistica/RN-LOG-002-no-reasignacion.md) | Evitar reasignar dos veces un material recibido | RN / Logística / Planta | Validado; parcial | `src/planta/`; acumulado contra cantidad ordenada, puente a recepción pendiente |
| [RF-LOG-010](backend/logistica/RF-LOG-010-items-recepcion.md) | Implementar persistencia de ítems y saldos de recepción | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; líneas, saldo parcial y soporte requeridos |
| [RF-LOG-011](backend/logistica/RF-LOG-011-validacion-lotes.md) | Validaciones de trazabilidad en recepción (Lote/Empaque) | RF / Logística / Calidad | Borrador, pendiente de validación | `src/logistica/`; lote/empaque y vencimiento por definir |
| [RF-LOG-012](backend/logistica/RF-LOG-012-control-cantidades-planta.md) | Control de procesamiento contra cantidades realmente recibidas | RF / Logística / Planta | Borrador, pendiente de validación | `src/planta/` y `src/logistica/`; control por saldo físico pendiente |
| [RF-PLA-006](backend/planta/RF-PLA-006-ciclos-multiorden.md) | Soporte para ciclos con múltiples órdenes | RF / Planta | Borrador, pendiente de validación | `src/planta/`; asociación ciclo-orden múltiple pendiente |
| [RA-LOG-002](por-aclarar/RA-LOG-002-notificacion-parciales.md) | Políticas de evidencia y notificación en recepciones parciales | RA / Logística / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RF-LOG-003](backend/logistica/RF-LOG-003-novedades-custodia.md) | Registrar novedades, rechazos y custodia | RF / Logística | Validado; parcial | `src/logistica/`, `src/ordenes-servicio/`; eventos básicos presentes, rechazo/novedades/evidencias pendientes |
| [RF-LOG-013](backend/logistica/RF-LOG-013-rechazo-item.md) | Rechazar material por ítem y registrar su disposición | RF / Logística / Calidad | Borrador, pendiente de validación | Rechazo por línea y disposición pendiente |
| [RF-LOG-014](backend/logistica/RF-LOG-014-entidad-novedades.md) | Entidad y flujo de novedades logísticas | RF / Logística | Borrador, pendiente de validación | Novedad estructurada y repetición de eventos pendientes |
| [RF-LOG-015](backend/logistica/RF-LOG-015-evidencias-adjuntos.md) | Adjuntar evidencias a eventos logísticos | RF / Logística / Documentos | Borrador, pendiente de validación | Flujo de adjuntos/evidencias pendiente |
| [RF-LOG-016](backend/logistica/RF-LOG-016-cadena-custodia.md) | Registrar traspasos de cadena de custodia | RF / Logística / Planta | Borrador, pendiente de validación | Acuse bilateral e identificación por material pendientes |
| [RA-LOG-003](por-aclarar/RA-LOG-003-politicas-rechazo.md) | Políticas de disposición de materiales rechazados | RA / Logística / Calidad | Parcialmente resuelta; detalles pendientes | Calidad determina destino; evidencia mínima confirmada |
| [RF-LOG-004](backend/logistica/RF-LOG-004-transferencia-planta.md) | Transferir materiales entre Logística y Planta | RF / Logística / Planta | Validado; parcial | `src/logistica/` registra `EN_PLANTA`; inventario/acta/auth de receptor derivados |
| [RF-LOG-017](backend/logistica/RF-LOG-017-recepcion-usuario-planta.md) | Confirmación de recepción por usuario autenticado de Planta | RF / Logística / Planta / Seguridad | Borrador, pendiente de validación | Usuario receptor y permiso de Planta pendientes |
| [RF-LOG-018](backend/logistica/RF-LOG-018-acta-traspaso.md) | Acta de transferencia y cantidades físicas de traspaso | RF / Logística / Planta / Documentos | Borrador, pendiente de validación | Acta bilateral y cantidades físicas pendientes |
| [RA-PLA-003](por-aclarar/RA-PLA-003-inventario-planta.md) | Política de inventario y microbodega en Planta | RA / Planta / Logística | Pendiente de decisión | No aplica hasta decisión |
| [RF-LOG-005](backend/logistica/RF-LOG-005-entregas-parciales.md) | Registrar entregas parciales y finales | RF / Logística / Entregas | Validado; parcial | `src/logistica/`; evento único de entrega, sin acumulación ni saldo |
| [RF-LOG-019](backend/logistica/RF-LOG-019-entregas-acumulables.md) | Implementar lógica de entregas parciales y control de saldos | RF / Logística / Entregas | Borrador, pendiente de validación | Acumulación, estados y saldo pendiente por implementar |
| [RF-LOG-020](backend/logistica/RF-LOG-020-pod-firmas.md) | Registro de Prueba de Entrega (POD) y firmas | RF / Logística / Documentos | Borrador, pendiente de validación | Captura y conservación de evidencia pendiente |
| [RF-LOG-021](backend/logistica/RF-LOG-021-fix-entidad-entrega.md) | Integración o depuración técnica de la entidad Entrega | RF / Logística / Persistencia | Borrador, pendiente de validación | Entidad declarada sin servicio/controlador de entrega |
| [RF-LOG-022](backend/logistica/RF-LOG-022-inmutabilidad-documentos.md) | Emisión idempotente y conservación de PDFs logísticos | RF / Logística / Documentos | Borrador, pendiente de validación | Reintentos, recuperación por snapshot y protección del PDF emitido pendientes |
| [RF-LOG-023](backend/logistica/RF-LOG-023-acta-recepcion.md) | Generar y conservar actas de recepción de materiales | RF / Logística / Recepción / Documentos | Borrador, pendiente de validación | No se encontró documento generado para la recepción física |
| [RA-LOG-004](por-aclarar/RA-LOG-004-cierre-ordenes.md) | Criterios de cierre de órdenes y despachos parciales | RA / Logística / Calidad | Parcialmente resuelta; conciliación pendiente | Regla de cierre base confirmada; detalle por línea/lote pendiente |

### Mapa de trazabilidad — Logística (primer bloque)

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RN-LOG-001` | `B-LOG-001`: precarga y vínculo de ítems de cotización | [RF-LOG-006](backend/logistica/RF-LOG-006-precarga-items.md) | Derivada; borrador |
| `RN-LOG-001` | `B-LOG-002`: `OneToOne` contradice varias órdenes por cotización | [RF-LOG-007](backend/logistica/RF-LOG-007-fix-relacion-orden.md) | Derivada; borrador |
| `RN-LOG-001` | `B-LOG-003`: OC o autorización explícita alternativa | [RA-LOG-001](por-aclarar/RA-LOG-001-soportes-comerciales.md) | Derivada; pendiente de decisión |
| `RF-LOG-001` | `B-LOG-004`: gestión y agrupación de rutas | [RF-LOG-008](backend/logistica/RF-LOG-008-entidad-rutas.md) | Derivada; borrador |
| `RF-LOG-001` | `B-LOG-005`: UI sin transición de llegada directa | [RF-LOG-001](backend/logistica/RF-LOG-001-recogidas-rutas.md) | Pendiente para fase frontend |
| `RF-LOG-001` | `B-LOG-006`: modalidad de ingreso explícita | [RF-LOG-009](backend/logistica/RF-LOG-009-modalidad-ingreso.md) | Derivada; borrador |

### Mapa de trazabilidad — Recepción y asignación a Planta

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-002` | `B-LOG-007`, `B-LOG-008`, `B-LOG-011`: líneas, saldo parcial y soporte de recepción | [RF-LOG-010](backend/logistica/RF-LOG-010-items-recepcion.md) | Derivadas; borrador |
| `RF-LOG-002` | `B-LOG-009`: lote, empaque, unidad y aplicabilidad de vencimiento | [RF-LOG-011](backend/logistica/RF-LOG-011-validacion-lotes.md) | Derivada; borrador |
| `RF-LOG-002` / `RN-LOG-002` | `B-LOG-010`, `B-LOG-012`: cantidades de ciclo limitadas por recepción real y trazabilidad física | [RF-LOG-012](backend/logistica/RF-LOG-012-control-cantidades-planta.md) | Derivadas; borrador |
| `RN-LOG-002` | `B-LOG-013`: una carga de ciclo puede agrupar órdenes compatibles | [RF-PLA-006](backend/planta/RF-PLA-006-ciclos-multiorden.md) | Derivada; borrador |
| `RF-LOG-002` | Evidencia y notificación a Comercial ante diferencias/recepciones parciales | [RA-LOG-002](por-aclarar/RA-LOG-002-notificacion-parciales.md) | Preguntas de negocio; pendientes |

### Mapa de trazabilidad — Novedades, rechazos y custodia

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-003` | `B-LOG-014`: rechazo por línea, motivo y disposición | [RF-LOG-013](backend/logistica/RF-LOG-013-rechazo-item.md) | Derivada; borrador |
| `RF-LOG-003` | `B-LOG-015`: novedades estructuradas y eventos repetibles | [RF-LOG-014](backend/logistica/RF-LOG-014-entidad-novedades.md) | Derivada; borrador |
| `RF-LOG-003` | `B-LOG-016`: evidencias y adjuntos en eventos | [RF-LOG-015](backend/logistica/RF-LOG-015-evidencias-adjuntos.md) | Derivada; borrador |
| `RF-LOG-003` | `B-LOG-017`: traspaso bilateral de custodia | [RF-LOG-016](backend/logistica/RF-LOG-016-cadena-custodia.md) | Derivada; borrador |
| `RF-LOG-003` | Destino, responsables y políticas para material rechazado | [RA-LOG-003](por-aclarar/RA-LOG-003-politicas-rechazo.md) | Pregunta de negocio; pendiente |

### Mapa de trazabilidad — Transferencia Logística a Planta

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-004` | `B-LOG-018`: receptor de Planta no autenticado ni autorizado por rol destino | [RF-LOG-017](backend/logistica/RF-LOG-017-recepcion-usuario-planta.md) | Derivada; borrador |
| `RF-LOG-004` | `B-LOG-019`: falta acta bilateral con cantidades y evidencia | [RF-LOG-018](backend/logistica/RF-LOG-018-acta-traspaso.md) | Derivada; borrador |
| `RF-LOG-004` | `B-LOG-020`: alcance del inventario/microbodega no definido | [RA-PLA-003](por-aclarar/RA-PLA-003-inventario-planta.md) | Derivada; pendiente de decisión |

### Mapa de trazabilidad — Entregas al cliente

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-005` | `B-LOG-021`: falta acumulación de entregas parciales y saldo | [RF-LOG-019](backend/logistica/RF-LOG-019-entregas-acumulables.md) | Derivada; borrador |
| `RF-LOG-005` | `B-LOG-022`: falta POD firmada/fotografiada | [RF-LOG-020](backend/logistica/RF-LOG-020-pod-firmas.md) | Derivada; borrador |
| `RF-LOG-005` | `B-LOG-023`: entidad `Entrega` huérfana | [RF-LOG-021](backend/logistica/RF-LOG-021-fix-entidad-entrega.md) | Derivada; borrador |
| `RF-LOG-005` | Criterios de cierre y Calidad para despachos parciales | [RA-LOG-004](por-aclarar/RA-LOG-004-cierre-ordenes.md) | Pregunta de negocio; pendiente |

Registro acumulado: [brechas/registro-brechas.md](brechas/registro-brechas.md). Decisiones validadas: [decisiones/decisiones-negocio.md](decisiones/decisiones-negocio.md). Las reglas de Prioridad 1 ya están incorporadas; sus precisiones aún abiertas y la validación funcional del Bloque 2 Logístico se mantienen señaladas en las RA y en la nota de reconciliación superior.

## Organización

- `backend/`: fichas de requisitos backend, una por archivo.
- [`frontend/`](frontend/README.md): matriz central de cobertura frontend, con evidencia del repositorio SterinovaFrontend y enlaces a requisitos/brechas backend.
- `brechas/`: tabla acumulada; no se cierran brechas sin decisión explícita.
- `decisiones/`: decisiones confirmadas por el usuario.
- `por-aclarar/`: preguntas de negocio, con opciones e impacto.

No se crea una ficha cerrada antes de su validación. Toda revisión posterior conserva la versión anterior y agrega historial.

### Planta

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-PLA-001](backend/planta/RF-PLA-001-equipos-disponibilidad.md) | Registrar equipos y disponibilidad | RF / Planta | Validado; parcial | `src/planta/`; equipo libre en ciclo, sin catálogo, disponibilidad ni capacidad |
| [RF-PLA-007](backend/planta/RF-PLA-007-catalogo-equipos.md) | Crear catálogo de equipos (EtO, Vapor, Lavandería) | RF / Planta | Borrador, pendiente de validación | Catálogo y vínculo trazable pendientes |
| [RF-PLA-008](backend/planta/RF-PLA-008-control-mantenimiento.md) | Control de disponibilidad, mantenimiento y calibración de equipos | RF / Planta / Calidad | Borrador, pendiente de validación | Bloqueo operativo y calibración pendientes |
| [RF-PLA-009](backend/planta/RF-PLA-009-validacion-capacidad.md) | Validación de capacidad de carga por equipo | RF / Planta | Borrador, pendiente de validación | Unidades y validación de carga pendientes |
| [RA-PLA-004](por-aclarar/RA-PLA-004-politicas-equipos.md) | Políticas de equipos, calibración y capacidad | RA / Planta / Calidad | Pendiente de decisión | Definiciones de lavandería, calibración y capacidad |
| [RF-PLA-002](backend/planta/RF-PLA-002-creacion-ciclos.md) | Crear ciclos y asociar órdenes | RF / Planta | Validado; parcial | `src/planta/`; una orden por ciclo; método contratado validado |
| [RF-PLA-010](backend/planta/RF-PLA-010-consecutivos-ciclos.md) | Implementar consecutivo de negocio y número físico de ciclo | RF / Planta | Borrador, pendiente de validación | Identificadores operativos del ciclo pendientes |
| [RA-PLA-005](por-aclarar/RA-PLA-005-numeracion-ciclos.md) | Formatos de consecutivos y numeración física | RA / Planta / Calidad | Pendiente de decisión | Formato, reinicio anual y reglas retroactivas |
| [RF-PLA-003](backend/planta/RF-PLA-003-distribucion-cantidades.md) | Distribuir cantidades entre ciclos | RF / Planta | Validado; parcial | `src/planta/`; saldo y lock presentes, reprocesos requieren exclusión de rechazos |
| [RF-PLA-011](backend/planta/RF-PLA-011-flujo-reprocesos.md) | Flujo de reprocesos y exclusión de saldos rechazados | RF / Planta / Calidad | Borrador, pendiente de validación | Saldo rechazado y vínculo al ciclo original pendientes |
| [RA-PLA-006](por-aclarar/RA-PLA-006-politicas-reproceso.md) | Políticas de reprocesos y material rechazado | RA / Planta / Calidad / Logística | Parcialmente resuelta; saldos pendientes | Aprobación previa y ciclo vinculado confirmados |
| [RF-PLA-004](backend/planta/RF-PLA-004-parametros-protocolos.md) | Registrar parámetros, evidencias y protocolos | RF / Planta / Calidad | Validado; parcial | `src/planta/`, `src/calidad/`, `src/certificados/`; mediciones y evaluación disponibles, adjuntos pendientes |
| [RF-PLA-012](backend/planta/RF-PLA-012-evidencias-adjuntas.md) | Implementar gestión de archivos adjuntos (Evidencias de ciclo) | RF / Planta / Calidad / Documentos | Borrador, pendiente de validación | Carga y vínculo de archivos pendientes |
| [RF-PLA-013](backend/planta/RF-PLA-013-justificacion-no-aplica.md) | Añadir campo de justificación en evaluación de parámetros | RF / Planta / Calidad | Borrador, pendiente de validación | Justificación de `NO_APLICA` pendiente |
| [RA-PLA-007](por-aclarar/RA-PLA-007-politicas-evidencias.md) | Políticas de evidencias documentales y formatos | RA / Planta / Calidad / Documentos | Pendiente de decisión | Tipos, formatos, obligatoriedad y retención |
| [RF-PLA-005](backend/planta/RF-PLA-005-tandas-recetas.md) | Registrar tandas, reprocesos, recetas e insumos | RF / Planta | Validado; parcial | `src/planta/`; ciclos existentes, tandas/recetas/consumos pendientes |
| [RF-PLA-014](backend/planta/RF-PLA-014-entidad-tandas.md) | Implementar agrupación de ciclos por Tanda | RF / Planta | Borrador, pendiente de validación | Entidad y relación Tanda-Ciclo pendientes |
| [RA-PLA-008](por-aclarar/RA-PLA-008-politicas-recetas.md) | Políticas de recetas, insumos y microbodega | RA / Planta / Calidad / Abastecimiento | Pendiente de decisión | Definir recetas, consumos y alcance de microbodega |
| [RA-PLA-009](por-aclarar/RA-PLA-009-validacion-normativa-procesos.md) | Alcance de validación normativa de los procesos de esterilización | RA / Planta / Calidad / Cumplimiento | Pendiente de decisión | Normativa aplicable, evidencia y responsables por definir; no se presume cumplimiento |
| [RN-PLA-001](backend/planta/RN-PLA-001-metodo-contratado.md) | No cambiar en Planta el método contratado | RN / Planta / Comercial / Logística | Validado; parcial | Comparación con método de orden; anclaje al concepto pendiente |
| [RF-PLA-015](backend/planta/RF-PLA-015-bloqueo-metodo.md) | Bloqueo estricto del método contratado (Comercial-Logística-Planta) | RF / Comercial / Logística / Planta | Borrador, pendiente de validación | Bloqueo contra método contractual por concepto pendiente |
| [RN-PLA-002](backend/planta/RN-PLA-002-no-sobrescribir.md) | No sobrescribir ciclos aprobados; vincular reprocesos con el original | RN / Planta / Calidad | Validado; parcial | API sin edición; hardening BD y reproceso derivados |
| [RF-PLA-016](backend/planta/RF-PLA-016-trigger-inmutabilidad.md) | Inmutabilidad de ciclos aprobados a nivel de base de datos | RF / Planta / Calidad / Base de Datos | Borrador, pendiente de validación | Protección BD de ciclos aprobados pendiente |
| [RF-PLA-017](backend/planta/RF-PLA-017-orden-esterilizacion-documento.md) | Generar y conservar la orden de esterilización | RF / Planta / Documentos | Borrador, pendiente de validación | Registro de ciclo disponible; generación/conservación documental no identificada |
| [RA-PLA-010](por-aclarar/RA-PLA-010-alcance-orden-esterilizacion.md) | Alcance documental de la orden de esterilización | RA / Planta / Calidad / Documentos | Pendiente de decisión | Contenido, momento, destinatario y aprobación por definir |

### Calidad

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-CAL-001](backend/calidad/RF-CAL-001-evaluacion-ciclos.md) | Evaluar ciclos según parámetros y protocolos | RF / Calidad | Validado; parcial | Validación de rango durante aprobación; sugerencia visible derivada |
| [RF-CAL-002](backend/calidad/RF-CAL-002-aprobacion-materiales.md) | Aprobar, rechazar o retener materiales | RF / Calidad / Logística | Validado; parcial | Rechazo de ciclo y guardia de entrega; cuarentena/disposición derivadas |
| [RF-CAL-005](backend/calidad/RF-CAL-005-sugerencia-ui-calidad.md) | Mostrar sugerencia automática de cumplimiento en UI de Calidad | RF / Calidad / Frontend | Borrador, pendiente de validación | Sugerencia previa por parámetro pendiente |
| [RF-CAL-006](backend/calidad/RF-CAL-006-cuarentena-materiales.md) | Implementar estado de Cuarentena y rechazo por material/lote | RF / Calidad / Planta / Logística | Borrador, pendiente de validación | Cuarentena y disposición individual pendientes |
| [RA-CAL-001](por-aclarar/RA-CAL-001-politicas-cuarentena.md) | Políticas de cuarentena y destino de materiales rechazados | RA / Calidad / Planta / Logística | Parcialmente resuelta; precisiones pendientes | Retención por lote, liberación parcial documentada y autoridad de Calidad confirmadas |
| [RF-CAL-007](backend/calidad/RF-CAL-007-bypass-ordenes-sin-metodo.md) | Blindar validación de Calidad para órdenes sin método de esterilización | RF / Calidad / Logística | Borrador, pendiente de validación | Validación obligatoria de liberación/certificado pendiente |
| [RF-CAL-003](backend/calidad/RF-CAL-003-desviaciones-capa.md) | Registrar desviaciones e investigaciones CAPA | RF / Calidad | Validado; faltante | Permisos RBAC declarados; sin entidades, endpoints ni flujo CAPA |
| [RF-CAL-008](backend/calidad/RF-CAL-008-modulo-capa.md) | Implementar entidades y endpoints para Desviaciones y CAPA | RF / Calidad | Borrador, pendiente de validación | Persistencia y API de investigación pendientes |
| [RF-CAL-009](backend/calidad/RF-CAL-009-flujo-capa.md) | Flujo de estados, acciones y verificación de eficacia de CAPA | RF / Calidad | Borrador, pendiente de validación | Ciclo de vida y verificaciones pendientes |
| [RA-CAL-002](por-aclarar/RA-CAL-002-politicas-capa.md) | Políticas de gestión de desviaciones y cierre de CAPA | RA / Calidad | Pendiente de decisión | Severidad, responsables y cierre por definir |
| [RF-CAL-004](backend/calidad/RF-CAL-004-liberacion-excepcion.md) | Autorizar liberaciones por excepción con evidencia | RF / Calidad | Validado; faltante | Sin endpoint/entidad de liberación excepcional |
| [RN-CAL-001](backend/calidad/RN-CAL-001-bloqueo-despacho.md) | Exigir aprobación de Calidad antes del despacho | RN / Calidad / Logística | Validado; parcial | Bloqueo condicionado a método; caso nulo derivado |
| [RF-CAL-010](backend/calidad/RF-CAL-010-flujo-excepcion.md) | Implementar flujo de liberación por excepción | RF / Calidad / Certificados | Borrador, pendiente de validación | Autorización, evidencia y firmas pendientes |
| [RA-CAL-003](por-aclarar/RA-CAL-003-politicas-excepcion.md) | Políticas de liberación por excepción y firmas | RA / Calidad / Certificados / Logística | Pendiente de decisión | Criterios de elegibilidad y cargos por definir |

### Certificados

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-CER-001](backend/certificados/RF-CER-001-emision-certificados.md) | Emitir certificados por orden y cliente | RF / Certificados / Calidad | Validado; parcial | Un certificado por ciclo y cliente único; unicidad impide compartir |
| [RF-CER-002](backend/certificados/RF-CER-002-identificacion-materiales.md) | Identificar en el certificado los materiales y ciclos asociados | RF / Certificados / Planta | Validado; parcial | Snapshot/PDF presentes; cantidad procesada por ciclo derivada |
| [RF-CER-004](backend/certificados/RF-CER-004-certificados-ciclos-compartidos.md) | Soporte de certificados múltiples para ciclos compartidos | RF / Certificados / Planta | Borrador, pendiente de validación | Cardinalidad y certificados múltiples pendientes |
| [RF-CER-005](backend/certificados/RF-CER-005-cantidades-procesadas.md) | Corrección de cantidades procesadas en snapshot de certificado | RF / Certificados / Planta | Borrador, pendiente de validación | Snapshot desde cantidades efectivas del ciclo pendiente |
| [RA-CER-001](por-aclarar/RA-CER-001-politicas-certificacion.md) | Políticas de certificación para ciclos compartidos y cantidades | RA / Certificados / Calidad / Planta | Pendiente de decisión | Partición, cantidad certificada y agrupación por definir |
| [RF-CER-003](backend/certificados/RF-CER-003-versionado-anulacion.md) | Conservar versiones y anular certificados sin borrar el original | RF / Certificados | Validado; parcial | Snapshot/formato/PDF actuales; anulación y versionado derivadas |
| [RN-CER-001](backend/certificados/RN-CER-001-ciclos-compartidos.md) | Emitir certificados separados para clientes de un ciclo compartido | RN / Certificados / Planta / Calidad | Validado; parcial | Emisión limitada a cliente único; multi-cliente derivado |
| [RF-CER-006](backend/certificados/RF-CER-006-flujo-anulacion.md) | Implementar flujo de anulación y reemplazo de certificados | RF / Certificados | Borrador, pendiente de validación | Anulación y vínculo de reemplazo pendientes |
| [RF-CER-007](backend/certificados/RF-CER-007-historial-versiones.md) | Historial de versiones de PDF y protección contra sobrescritura | RF / Certificados / Documentos | Borrador, pendiente de validación | Versiones inmutables y cadena de evidencia pendientes |
| [RA-CER-002](por-aclarar/RA-CER-002-politicas-reemplazo.md) | Políticas de anulación, reemplazo y conservación de certificados | RA / Certificados / Calidad | Pendiente de decisión | Autorizaciones, enlaces y retención por definir |

### Usuarios y Administración

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-USR-001](backend/usuarios/RF-USR-001-administracion-usuarios.md) | Administrar usuarios y su estado | RF / Usuarios | Validado; parcial | Activación/desactivación implementada; auditoría explícita derivada |
| [RF-USR-002](backend/usuarios/RF-USR-002-roles-ambitos.md) | Asignar varios roles, permisos y ámbitos a usuarios | RF / Usuarios / RBAC | Validado; cubierto | Asignaciones múltiples y permisos por ámbito implementados |
| [RF-AUD-003](backend/auditoria/RF-AUD-003-auditoria-usuarios.md) | Implementar auditoría explícita en cambios de estado de usuarios y RBAC | RNF / Auditoría / Usuarios / RBAC | Borrador, pendiente de validación | Bitácora de activación/cambios de usuario pendiente |
| [RA-USR-001](por-aclarar/RA-USR-001-roles-por-planta.md) | Políticas de asignación de roles por planta | RA / Usuarios / RBAC / Planta | Pendiente de decisión | Combinaciones válidas de rol/plantas por definir |
| [RF-USR-003](backend/usuarios/RF-USR-003-administracion-areas.md) | Administrar áreas y permisos | RF / Usuarios / RBAC | Validado; parcial | Scopes administrables; áreas autónomas y CRUD de permisos pendientes |
| [RF-USR-004](backend/usuarios/RF-USR-004-crud-roles.md) | Implementar CRUD para gestión dinámica de Roles y Permisos | RF / Usuarios / RBAC | Borrador, pendiente de validación | Roles/permisos configurables por API pendientes |
| [RA-USR-002](por-aclarar/RA-USR-002-areas-scopes.md) | Definición de Áreas Operativas vs. Scopes | RA / Usuarios / RBAC | Pendiente de decisión | Equivalencia entre áreas y scopes por definir |

### Auditoría

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-AUD-002](backend/auditoria/RF-AUD-002-atomicidad-auditoria.md) | Atomicidad en registros de auditoría | RNF / Auditoría | Borrador, pendiente de validación | Propagación transaccional pendiente |
| [RF-AUD-001](backend/auditoria/RF-AUD-001-consulta-auditoria.md) | Consultar operaciones, responsables y cambios registrados | RF / Auditoría | Validado; parcial | API devuelve sobre paginado; UI lo consume como arreglo (`B-AUD-002`); payload before/after no uniforme |
| [RF-AUD-004](backend/auditoria/RF-AUD-004-payload-auditoria.md) | Estandarización de payload before/after en auditoría | RF / Auditoría | Borrador, pendiente de validación | Esquema uniforme de cambios pendiente |

### Trazabilidad

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-TRA-001](backend/trazabilidad/RF-TRA-001-cadena-servicio.md) | Reconstruir cadena cliente–cotización–operación–certificado–entrega | RF / Transversal | Análisis presentado; ficha pendiente de validación; parcial | Relaciones existen por módulo; vista integral frontend/backend pendiente |

### Pendientes transversales declarados en el anexo §8

| Pendiente contractual | Ficha activa | Estado documental |
|---|---|---|
| Inventario completo y microbodega/consumos finales | [RA-PLA-003](por-aclarar/RA-PLA-003-inventario-planta.md), [RA-PLA-008](por-aclarar/RA-PLA-008-politicas-recetas.md) | Decisiones pendientes |
| Recetas por proceso | [RA-PLA-008](por-aclarar/RA-PLA-008-politicas-recetas.md) | Decisión pendiente |
| Retenciones e investigaciones integrales | [RA-CAL-001](por-aclarar/RA-CAL-001-politicas-cuarentena.md), [RF-CAL-008](backend/calidad/RF-CAL-008-modulo-capa.md), [RF-CAL-009](backend/calidad/RF-CAL-009-flujo-capa.md) | Política parcialmente resuelta; requisitos derivados en borrador |
| Matriz definitiva de permisos productivos | [RNF-SEG-001](backend/seguridad/RNF-SEG-001-autorizacion-ambito.md), [RA-USR-001](por-aclarar/RA-USR-001-roles-por-planta.md), [RA-USR-002](por-aclarar/RA-USR-002-areas-scopes.md) | Análisis presentado; ficha de seguridad pendiente de validación y políticas de roles/áreas pendientes |
| Evidencia jurídica completa de firmas | [RA-SEG-001](por-aclarar/RA-SEG-001-evidencia-legal-firmas.md) | Decisión pendiente; alcance nuevo derivado de §8 |
| Integración fiscal real | [RA-FIS-001](por-aclarar/RA-FIS-001-fiscalidad-por-producto.md) | Decisión pendiente |
| Validación normativa de procesos de esterilización | [RA-PLA-009](por-aclarar/RA-PLA-009-validacion-normativa-procesos.md) | Decisión pendiente; normas y criterios no inferidos |
| Despliegue y operación completa en producción | [RNF-OPS-001](operacion/RNF-OPS-001-operacion-produccion.md) | Borrador; inventario operativo y criterios de salida pendientes |

Decisiones del §8 que afectan cuarentena, reproceso, disposición y cierre de órdenes se registran en [decisiones de negocio](decisiones/decisiones-negocio.md). Los pendientes explícitos de §8 quedan así trazados; esta correspondencia no certifica cumplimiento técnico, normativo o productivo.

### Cruce de reglas operativas — anexo §6

| Regla contractual | Requisitos y decisiones trazados | Estado documental y hallazgo resumido |
|---|---|---|
| Una cotización emitida no se modifica; la corrección requiere revisión nueva o reemplazo. | [RF-COM-003](backend/comercial/RF-COM-003-cotizaciones-crud.md), [RF-COM-012](backend/comercial/RF-COM-012-paso-revision.md), [RA-COM-003](por-aclarar/RA-COM-003-flujo-reemplazo.md) | El bloqueo de edición directa está validado; la etapa de revisión y el mecanismo de reemplazo siguen derivados y pendientes. |
| Un material recibido no puede reasignarse dos veces. | [RN-LOG-002](backend/logistica/RN-LOG-002-no-reasignacion.md), [RF-LOG-010](backend/logistica/RF-LOG-010-items-recepcion.md), [RF-PLA-006](backend/planta/RF-PLA-006-ciclos-multiorden.md) | La regla está analizada como parcial; recepción persistida, saldo real y vínculo multiorden siguen en borrador. |
| Las cantidades pueden ser parciales o distribuirse entre varios ciclos. | [RF-LOG-002](backend/logistica/RF-LOG-002-recepciones.md), [RF-LOG-005](backend/logistica/RF-LOG-005-entregas-parciales.md), [RF-PLA-003](backend/planta/RF-PLA-003-distribucion-cantidades.md), [RF-PLA-006](backend/planta/RF-PLA-006-ciclos-multiorden.md), [RA-LOG-004](por-aclarar/RA-LOG-004-cierre-ordenes.md) | Análisis validado; recepción/entrega acumulable y ciclo multiorden no están completos. La política base de cierre tiene decisión confirmada y su conciliación sigue abierta. |
| Las recepciones parciales conservan saldo pendiente. | [RF-LOG-002](backend/logistica/RF-LOG-002-recepciones.md), [RF-LOG-010](backend/logistica/RF-LOG-010-items-recepcion.md), [RF-LOG-012](backend/logistica/RF-LOG-012-control-cantidades-planta.md) | La cabecera existe, pero las líneas y el saldo no quedan implementados en el flujo revisado; requisitos derivados pendientes. |
| Una retención impide el avance no autorizado. | [RF-CAL-002](backend/calidad/RF-CAL-002-aprobacion-materiales.md), [RF-CAL-006](backend/calidad/RF-CAL-006-cuarentena-materiales.md), [RA-CAL-001](por-aclarar/RA-CAL-001-politicas-cuarentena.md), [D-CAL-001](decisiones/decisiones-negocio.md) | La política confirma retención por lote y liberación parcial autorizada; el estado/disposición por material aún requiere implementación y precisiones. |
| Planta no puede cambiar el método contratado. | [RN-PLA-001](backend/planta/RN-PLA-001-metodo-contratado.md), [RF-PLA-015](backend/planta/RF-PLA-015-bloqueo-metodo.md) | El método se valida contra la orden operativa, pero esta puede modificarse antes del ciclo; anclaje al contrato pendiente. |
| Un equipo no disponible no puede utilizarse. | [RF-PLA-001](backend/planta/RF-PLA-001-equipos-disponibilidad.md), [RF-PLA-007](backend/planta/RF-PLA-007-catalogo-equipos.md), [RF-PLA-008](backend/planta/RF-PLA-008-control-mantenimiento.md), [RA-PLA-004](por-aclarar/RA-PLA-004-politicas-equipos.md) | No se encontró catálogo ni disponibilidad de equipos; catálogo, mantenimiento/calibración y bloqueo están en borradores/decisión. |
| Un ciclo aprobado no puede sobrescribirse. | [RN-PLA-002](backend/planta/RN-PLA-002-no-sobrescribir.md), [RF-PLA-016](backend/planta/RF-PLA-016-trigger-inmutabilidad.md) | No se encontró candado de base de datos para proteger un ciclo aprobado frente a escrituras directas; hardening derivado. |
| El reproceso crea una nueva ejecución vinculada al original. | [RN-PLA-002](backend/planta/RN-PLA-002-no-sobrescribir.md), [RF-PLA-011](backend/planta/RF-PLA-011-flujo-reprocesos.md), [RA-PLA-006](por-aclarar/RA-PLA-006-politicas-reproceso.md), [D-PLA-001](decisiones/decisiones-negocio.md) | Autorización previa de Calidad y Planta y vínculo nuevo están confirmados; saldo reprocesable y conciliación continúan pendientes. |
| Calidad debe aprobar antes del despacho. | [RF-CAL-001](backend/calidad/RF-CAL-001-evaluacion-ciclos.md), [RF-CAL-002](backend/calidad/RF-CAL-002-aprobacion-materiales.md), [RN-CAL-001](backend/calidad/RN-CAL-001-bloqueo-despacho.md), [RF-CAL-007](backend/calidad/RF-CAL-007-bypass-ordenes-sin-metodo.md) | Hay bloqueo para órdenes con método y certificado; la condición de método nulo sigue como brecha derivada. |
| El certificado se genera por cliente dentro del ciclo. | [RF-CER-001](backend/certificados/RF-CER-001-emision-certificados.md), [RN-CER-001](backend/certificados/RN-CER-001-ciclos-compartidos.md), [RF-CER-004](backend/certificados/RF-CER-004-certificados-ciclos-compartidos.md), [RF-CER-005](backend/certificados/RF-CER-005-cantidades-procesadas.md), [RA-CER-001](por-aclarar/RA-CER-001-politicas-certificacion.md) | El modelo permite un certificado por ciclo y usa el total de la orden; separar clientes y reflejar cantidades procesadas requiere cambios y decisión de partición. |
| Un fallo de PDF no debe dejar el material aprobado sin documento. | [RF-CAL-001](backend/calidad/RF-CAL-001-evaluacion-ciclos.md), [RF-CER-001](backend/certificados/RF-CER-001-emision-certificados.md) | El flujo revisado agrupa aprobación y emisión en una transacción; la atomicidad ante fallo de PDF se documentó estáticamente, sin prueba de fallo ejecutada. No se registró una brecha funcional separada para este control; los problemas de contenido del snapshot se trazan aparte. |

### Cruce de hitos de trazabilidad — anexo §5

| Hito contractual | Requisitos trazados | Estado de evidencia documentado |
|---|---|---|
| 1. Cliente que solicitó el servicio | [RF-COM-001](backend/comercial/RF-COM-001-clientes.md), [RF-TRA-001](backend/trazabilidad/RF-TRA-001-cadena-servicio.md) | Cliente y relación comercial existen; el alcance de historial integral está en `B-TRA-001`. |
| 2. Cotización emitida que originó el trabajo | [RF-COM-003](backend/comercial/RF-COM-003-cotizaciones-crud.md), [RF-COM-006](backend/comercial/RF-COM-006-envio-aceptacion.md), [RF-COM-007](backend/comercial/RF-COM-007-emitir-documentos.md), [RF-TRA-001](backend/trazabilidad/RF-TRA-001-cadena-servicio.md) | Existe vínculo entre orden y cotización; flujo de aceptación, emisión y consulta unificada tiene requisitos derivados/políticas abiertas. |
| 3. Materiales recibidos | [RF-LOG-002](backend/logistica/RF-LOG-002-recepciones.md), [RF-LOG-010](backend/logistica/RF-LOG-010-items-recepcion.md), [RF-LOG-023](backend/logistica/RF-LOG-023-acta-recepcion.md) | Se persiste la cabecera, pero el servicio revisado no persiste líneas de recepción ni genera acta específica. |
| 4. Cantidades y lotes que llegaron a Planta | [RF-LOG-010](backend/logistica/RF-LOG-010-items-recepcion.md), [RF-LOG-011](backend/logistica/RF-LOG-011-validacion-lotes.md), [RF-LOG-012](backend/logistica/RF-LOG-012-control-cantidades-planta.md), [RF-LOG-018](backend/logistica/RF-LOG-018-acta-traspaso.md) | La recepción por línea/saldo, validación de trazabilidad y constancia de traspaso siguen en requisitos derivados. |
| 5. Tanda o ciclo que procesó el material | [RF-PLA-002](backend/planta/RF-PLA-002-creacion-ciclos.md), [RF-PLA-003](backend/planta/RF-PLA-003-distribucion-cantidades.md), [RF-PLA-006](backend/planta/RF-PLA-006-ciclos-multiorden.md), [RF-PLA-014](backend/planta/RF-PLA-014-entidad-tandas.md) | Se persisten ciclos y asignaciones por material; no se encontró Tanda independiente ni soporte multiorden operativo. |
| 6. Parámetros registrados | [RF-PLA-004](backend/planta/RF-PLA-004-parametros-protocolos.md), [RF-PLA-012](backend/planta/RF-PLA-012-evidencias-adjuntas.md), [RF-PLA-013](backend/planta/RF-PLA-013-justificacion-no-aplica.md) | Mediciones y evaluaciones estructuradas existen; adjuntos y justificación `NO_APLICA` están derivados. |
| 7. Protocolo utilizado | [RF-PLA-004](backend/planta/RF-PLA-004-parametros-protocolos.md), [RF-TRA-001](backend/trazabilidad/RF-TRA-001-cadena-servicio.md) | El ciclo referencia una versión de protocolo; su presentación en una consulta integral queda en `B-TRA-001`. |
| 8. Decisiones de Calidad | [RF-CAL-001](backend/calidad/RF-CAL-001-evaluacion-ciclos.md), [RF-CAL-002](backend/calidad/RF-CAL-002-aprobacion-materiales.md), [RF-CAL-008](backend/calidad/RF-CAL-008-modulo-capa.md) | Decisiones de aprobación/rechazo de ciclo se registran; CAPA y evidencia por lote/material no están completas. |
| 9. Materiales aprobados o rechazados | [RF-CAL-002](backend/calidad/RF-CAL-002-aprobacion-materiales.md), [RF-CAL-006](backend/calidad/RF-CAL-006-cuarentena-materiales.md), [RA-CAL-001](por-aclarar/RA-CAL-001-politicas-cuarentena.md) | El estado actual es principalmente de ciclo; cuarentena, disposición y liberación por lote/cantidad siguen derivadas. |
| 10. Certificado emitido | [RF-CER-001](backend/certificados/RF-CER-001-emision-certificados.md), [RF-CER-002](backend/certificados/RF-CER-002-identificacion-materiales.md), [RF-CER-004](backend/certificados/RF-CER-004-certificados-ciclos-compartidos.md), [RF-CER-005](backend/certificados/RF-CER-005-cantidades-procesadas.md) | PDF y snapshot existen; certificado multi-cliente y cantidades exactas por ciclo no están resueltos. |
| 11. Materiales entregados o devueltos | [RF-LOG-005](backend/logistica/RF-LOG-005-entregas-parciales.md), [RF-LOG-019](backend/logistica/RF-LOG-019-entregas-acumulables.md), [RF-LOG-020](backend/logistica/RF-LOG-020-pod-firmas.md), [RA-LOG-004](por-aclarar/RA-LOG-004-cierre-ordenes.md) | Hay eventos de entrega; entregas acumulables, POD, devolución y conciliación de saldos requieren completar requisitos y decisiones. |
| 12. Quién realizó cada operación | [RF-AUD-001](backend/auditoria/RF-AUD-001-consulta-auditoria.md), [RF-AUD-004](backend/auditoria/RF-AUD-004-payload-auditoria.md), [RF-LOG-016](backend/logistica/RF-LOG-016-cadena-custodia.md), [RF-TRA-001](backend/trazabilidad/RF-TRA-001-cadena-servicio.md) | Hay auditoría y eventos con responsables en distintos módulos; esquema before/after, custodia y consulta transversal siguen parciales. |

### Cruce documental — Documentos generados del anexo §7

| Documento del anexo | Requisitos asociados | Hallazgo documental actual |
|---|---|---|
| Cotizaciones | [RF-COM-007](backend/comercial/RF-COM-007-emitir-documentos.md), [RA-COM-007](por-aclarar/RA-COM-007-reconstruccion-pdf-historico.md) | PDF/snapshot/hash implementados; política para reconstruir históricos sin snapshot pendiente. |
| Órdenes de servicio | [RF-LOG-022](backend/logistica/RF-LOG-022-inmutabilidad-documentos.md) | Se genera orden PDF y se persiste snapshot/hash; idempotencia y recuperación histórica pendientes. |
| Actas de recepción | [RF-LOG-002](backend/logistica/RF-LOG-002-recepciones.md), [RF-LOG-010](backend/logistica/RF-LOG-010-items-recepcion.md), [RF-LOG-023](backend/logistica/RF-LOG-023-acta-recepcion.md), [RA-LOG-002](por-aclarar/RA-LOG-002-notificacion-parciales.md) | Se registra una cabecera de recepción; no se identificó un acta generada específica ni detalle persistido por el servicio. El Acta de Servicio actual es otro documento. |
| Órdenes de esterilización | [RF-PLA-002](backend/planta/RF-PLA-002-creacion-ciclos.md), [RF-PLA-017](backend/planta/RF-PLA-017-orden-esterilizacion-documento.md), [RA-PLA-010](por-aclarar/RA-PLA-010-alcance-orden-esterilizacion.md) | Se registra el ciclo operativo; no se identificó generación/conservación de la orden documental. Su contenido y momento de emisión están pendientes. |
| Certificados de esterilización | [RF-CER-001](backend/certificados/RF-CER-001-emision-certificados.md), [RF-CER-002](backend/certificados/RF-CER-002-identificacion-materiales.md), [RF-CER-003](backend/certificados/RF-CER-003-versionado-anulacion.md), [RF-CER-004](backend/certificados/RF-CER-004-certificados-ciclos-compartidos.md), [RF-CER-005](backend/certificados/RF-CER-005-cantidades-procesadas.md), [RF-CER-006](backend/certificados/RF-CER-006-flujo-anulacion.md), [RF-CER-007](backend/certificados/RF-CER-007-historial-versiones.md), [RA-CER-002](por-aclarar/RA-CER-002-politicas-reemplazo.md) | Emisión PDF/snapshot documentada; ciclos compartidos, cantidades, anulaciones y versiones siguen en requisitos derivados. |
| Documentos de revisión y aprobación | [RF-COM-005](backend/comercial/RF-COM-005-revision-aprobacion.md), [RF-CAL-001](backend/calidad/RF-CAL-001-evaluacion-ciclos.md), [RF-CAL-002](backend/calidad/RF-CAL-002-aprobacion-materiales.md), [RNF-SEG-002](backend/seguridad/RNF-SEG-002-sesiones-operaciones-criticas.md) | Acciones/decisiones se registran en los módulos; el anexo no define si requiere un artefacto independiente firmado. La evidencia jurídica queda en [RA-SEG-001](por-aclarar/RA-SEG-001-evidencia-legal-firmas.md). |
| Solicitudes de anulación | [RF-COM-008](backend/comercial/RF-COM-008-anulaciones.md), [RA-COM-008](por-aclarar/RA-COM-008-politicas-anulacion.md) | Solicitud y resolución tienen flujo; política de observaciones y conservación se mantiene abierta. |
| PDFs con datos congelados y evidencias de firmas/autorizaciones | [RF-COM-007](backend/comercial/RF-COM-007-emitir-documentos.md), [RF-LOG-022](backend/logistica/RF-LOG-022-inmutabilidad-documentos.md), [RF-CER-003](backend/certificados/RF-CER-003-versionado-anulacion.md), [RA-SEG-001](por-aclarar/RA-SEG-001-evidencia-legal-firmas.md) | Se documentan capacidades actuales y brechas por dominio; alcance jurídico, evidencia y conservación no se presumen definidos.
