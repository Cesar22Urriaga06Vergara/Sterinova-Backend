# Requisitos, reglas y decisiones

> Consolidado el 23 de noviembre de 2026. Se conserva la ruta de origen y el estado original. Las afirmaciones fechadas deben contrastarse con el código o la decisión vigente.

## Índice

- [Estándar canónico de formatos de cotización]( #doc-estandar-cotizaciones-estandar_formatos)
- [Análisis del flujo Comercial → Logística → Planta → Calidad]( #doc-negocio-analisis-flujo-operativo-2026-11-11)
- [Contexto del producto]( #doc-negocio-contexto-producto)
- [Cuestionarios originales de negocio]( #doc-negocio-cuestionarios-origen)
- [Reglas maestras de negocio — ocho módulos]( #doc-negocio-reglas-maestras)
- [RF-AUD-001 — Consultar operaciones, responsables y cambios registrados]( #doc-requisitos-backend-auditoria-rf-aud-001-consulta-auditoria)
- [RF-AUD-002 — Atomicidad en registros de auditoría]( #doc-requisitos-backend-auditoria-rf-aud-002-atomicidad-auditoria)
- [RF-AUD-003 — Implementar auditoría explícita en cambios de estado de usuarios y RBAC]( #doc-requisitos-backend-auditoria-rf-aud-003-auditoria-usuarios)
- [RF-AUD-004 — Estandarización de payload before/after en auditoría]( #doc-requisitos-backend-auditoria-rf-aud-004-payload-auditoria)
- [RF-CAL-001 — Evaluar ciclos según parámetros y protocolos]( #doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos)
- [RF-CAL-002 — Aprobar, rechazar o retener materiales]( #doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales)
- [RF-CAL-003 — Registrar desviaciones e investigaciones CAPA]( #doc-requisitos-backend-calidad-rf-cal-003-desviaciones-capa)
- [RF-CAL-004 — Autorizar liberaciones por excepción con evidencia]( #doc-requisitos-backend-calidad-rf-cal-004-liberacion-excepcion)
- [RF-CAL-005 — Mostrar sugerencia automática de cumplimiento en UI de Calidad]( #doc-requisitos-backend-calidad-rf-cal-005-sugerencia-ui-calidad)
- [RF-CAL-006 — Implementar estado de Cuarentena y rechazo por material/lote]( #doc-requisitos-backend-calidad-rf-cal-006-cuarentena-materiales)
- [RF-CAL-007 — Blindar validación de Calidad para órdenes sin método de esterilización]( #doc-requisitos-backend-calidad-rf-cal-007-bypass-ordenes-sin-metodo)
- [RF-CAL-008 — Implementar entidades y endpoints para Desviaciones y CAPA]( #doc-requisitos-backend-calidad-rf-cal-008-modulo-capa)
- [RF-CAL-009 — Flujo de estados, acciones y verificación de eficacia de CAPA]( #doc-requisitos-backend-calidad-rf-cal-009-flujo-capa)
- [RF-CAL-010 — Implementar flujo de liberación por excepción]( #doc-requisitos-backend-calidad-rf-cal-010-flujo-excepcion)
- [RN-CAL-001 — Exigir aprobación de Calidad antes del despacho]( #doc-requisitos-backend-calidad-rn-cal-001-bloqueo-despacho)
- [RF-CER-001 — Emitir certificados por orden y cliente]( #doc-requisitos-backend-certificados-rf-cer-001-emision-certificados)
- [RF-CER-002 — Identificar en el certificado los materiales y ciclos asociados]( #doc-requisitos-backend-certificados-rf-cer-002-identificacion-materiales)
- [RF-CER-003 — Conservar versiones y anular certificados sin borrar el original]( #doc-requisitos-backend-certificados-rf-cer-003-versionado-anulacion)
- [RF-CER-004 — Soporte de certificados múltiples para ciclos compartidos]( #doc-requisitos-backend-certificados-rf-cer-004-certificados-ciclos-compartidos)
- [RF-CER-005 — Corrección de cantidades procesadas en snapshot de certificado]( #doc-requisitos-backend-certificados-rf-cer-005-cantidades-procesadas)
- [RF-CER-006 — Implementar flujo de anulación y reemplazo de certificados]( #doc-requisitos-backend-certificados-rf-cer-006-flujo-anulacion)
- [RF-CER-007 — Historial de versiones de PDF y protección contra sobrescritura]( #doc-requisitos-backend-certificados-rf-cer-007-historial-versiones)
- [RN-CER-001 — Emitir certificados separados para clientes de un ciclo compartido]( #doc-requisitos-backend-certificados-rn-cer-001-ciclos-compartidos)
- [RF-COM-001 — Registrar y consultar clientes]( #doc-requisitos-backend-comercial-rf-com-001-clientes)
- [RF-COM-002 — Gestionar productos y servicios]( #doc-requisitos-backend-comercial-rf-com-002-productos-servicios)
- [RF-COM-003 — Crear y editar cotizaciones con varios ítems]( #doc-requisitos-backend-comercial-rf-com-003-cotizaciones-crud)
- [RF-COM-004 — Gestionar condiciones, precios y vigencia]( #doc-requisitos-backend-comercial-rf-com-004-condiciones-vigencia)
- [RF-COM-005 — Revisar y aprobar cotizaciones]( #doc-requisitos-backend-comercial-rf-com-005-revision-aprobacion)
- [RF-COM-006 — Enviar y registrar aceptación del cliente]( #doc-requisitos-backend-comercial-rf-com-006-envio-aceptacion)
- [RF-COM-007 — Emitir documentos comerciales y conservar sus datos]( #doc-requisitos-backend-comercial-rf-com-007-emitir-documentos)
- [RF-COM-008 — Solicitar y gestionar anulaciones]( #doc-requisitos-backend-comercial-rf-com-008-anulaciones)
- [RF-COM-009 — Importación masiva de clientes]( #doc-requisitos-backend-comercial-rf-com-009-importacion-clientes)
- [RF-COM-010 — Cálculo de descuentos en cotizaciones]( #doc-requisitos-backend-comercial-rf-com-010-descuentos-cotizaciones)
- [RF-COM-011 — Control de vigencia y expiración de ofertas]( #doc-requisitos-backend-comercial-rf-com-011-vigencia-oferta)
- [RF-COM-012 — Implementar el paso de Revisión (EN_REVISION)]( #doc-requisitos-backend-comercial-rf-com-012-paso-revision)
- [RF-COM-013 — Implementar flujo de envío y aceptación]( #doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion)
- [RF-COM-014 — Bloqueo de emisión por anulación pendiente]( #doc-requisitos-backend-comercial-rf-com-014-bloqueo-emision-anulacion)
- [RF-LOG-001 — Registrar recogidas, rutas y llegadas directas]( #doc-requisitos-backend-logistica-rf-log-001-recogidas-rutas)
- [RF-LOG-002 — Registrar recepciones completas y parciales]( #doc-requisitos-backend-logistica-rf-log-002-recepciones)
- [RF-LOG-003 — Registrar novedades, rechazos y custodia]( #doc-requisitos-backend-logistica-rf-log-003-novedades-custodia)
- [RF-LOG-004 — Transferir materiales entre Logística y Planta]( #doc-requisitos-backend-logistica-rf-log-004-transferencia-planta)
- [RF-LOG-005 — Registrar entregas parciales y finales]( #doc-requisitos-backend-logistica-rf-log-005-entregas-parciales)
- [RF-LOG-006 — Precarga automática de ítems cotizados en órdenes]( #doc-requisitos-backend-logistica-rf-log-006-precarga-items)
- [RF-LOG-007 — Corrección de cardinalidad Cotización-Orden]( #doc-requisitos-backend-logistica-rf-log-007-fix-relacion-orden)
- [RF-LOG-008 — Implementar gestión de rutas compartidas]( #doc-requisitos-backend-logistica-rf-log-008-entidad-rutas)
- [RF-LOG-009 — Añadir modalidad de ingreso (Recogida vs. Llegada Directa)]( #doc-requisitos-backend-logistica-rf-log-009-modalidad-ingreso)
- [RF-LOG-010 — Implementar persistencia de ítems y saldos de recepción]( #doc-requisitos-backend-logistica-rf-log-010-items-recepcion)
- [RF-LOG-011 — Validaciones de trazabilidad en recepción (Lote/Empaque)]( #doc-requisitos-backend-logistica-rf-log-011-validacion-lotes)
- [RF-LOG-012 — Control de procesamiento contra cantidades realmente recibidas]( #doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta)
- [RF-LOG-013 — Rechazar material por ítem y registrar su disposición]( #doc-requisitos-backend-logistica-rf-log-013-rechazo-item)
- [RF-LOG-014 — Entidad y flujo de novedades logísticas]( #doc-requisitos-backend-logistica-rf-log-014-entidad-novedades)
- [RF-LOG-015 — Adjuntar evidencias a eventos logísticos]( #doc-requisitos-backend-logistica-rf-log-015-evidencias-adjuntos)
- [RF-LOG-016 — Registrar traspasos de cadena de custodia]( #doc-requisitos-backend-logistica-rf-log-016-cadena-custodia)
- [RF-LOG-017 — Confirmación de recepción por usuario autenticado de Planta]( #doc-requisitos-backend-logistica-rf-log-017-recepcion-usuario-planta)
- [RF-LOG-018 — Acta de transferencia y cantidades físicas de traspaso]( #doc-requisitos-backend-logistica-rf-log-018-acta-traspaso)
- [RF-LOG-019 — Implementar lógica de entregas parciales y control de saldos]( #doc-requisitos-backend-logistica-rf-log-019-entregas-acumulables)
- [RF-LOG-020 — Registro de Prueba de Entrega (POD) y firmas]( #doc-requisitos-backend-logistica-rf-log-020-pod-firmas)
- [RF-LOG-021 — Integración o depuración técnica de la entidad Entrega]( #doc-requisitos-backend-logistica-rf-log-021-fix-entidad-entrega)
- [RF-LOG-022 — Emisión idempotente y conservación de PDFs logísticos]( #doc-requisitos-backend-logistica-rf-log-022-inmutabilidad-documentos)
- [RF-LOG-023 — Generar y conservar actas de recepción de materiales]( #doc-requisitos-backend-logistica-rf-log-023-acta-recepcion)
- [RN-LOG-001 — Crear órdenes desde cotizaciones aceptadas]( #doc-requisitos-backend-logistica-rn-log-001-creacion-ordenes)
- [RN-LOG-002 — Evitar reasignar dos veces un material recibido]( #doc-requisitos-backend-logistica-rn-log-002-no-reasignacion)
- [RF-PLA-001 — Registrar equipos y disponibilidad]( #doc-requisitos-backend-planta-rf-pla-001-equipos-disponibilidad)
- [RF-PLA-002 — Crear ciclos y asociar órdenes]( #doc-requisitos-backend-planta-rf-pla-002-creacion-ciclos)
- [RF-PLA-003 — Distribuir cantidades entre ciclos]( #doc-requisitos-backend-planta-rf-pla-003-distribucion-cantidades)
- [RF-PLA-004 — Registrar parámetros, evidencias y protocolos]( #doc-requisitos-backend-planta-rf-pla-004-parametros-protocolos)
- [RF-PLA-005 — Registrar tandas, reprocesos, recetas e insumos]( #doc-requisitos-backend-planta-rf-pla-005-tandas-recetas)
- [RF-PLA-006 — Soporte para ciclos con múltiples órdenes]( #doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden)
- [RF-PLA-007 — Crear catálogo de equipos (EtO, Vapor, Lavandería)]( #doc-requisitos-backend-planta-rf-pla-007-catalogo-equipos)
- [RF-PLA-008 — Control de disponibilidad, mantenimiento y calibración de equipos]( #doc-requisitos-backend-planta-rf-pla-008-control-mantenimiento)
- [RF-PLA-009 — Validación de capacidad de carga por equipo]( #doc-requisitos-backend-planta-rf-pla-009-validacion-capacidad)
- [RF-PLA-010 — Implementar consecutivo de negocio y número físico de ciclo]( #doc-requisitos-backend-planta-rf-pla-010-consecutivos-ciclos)
- [RF-PLA-011 — Flujo de reprocesos y exclusión de saldos rechazados]( #doc-requisitos-backend-planta-rf-pla-011-flujo-reprocesos)
- [RF-PLA-012 — Implementar gestión de archivos adjuntos (Evidencias de ciclo)]( #doc-requisitos-backend-planta-rf-pla-012-evidencias-adjuntas)
- [RF-PLA-013 — Añadir campo de justificación en evaluación de parámetros]( #doc-requisitos-backend-planta-rf-pla-013-justificacion-no-aplica)
- [RF-PLA-014 — Implementar agrupación de ciclos por Tanda]( #doc-requisitos-backend-planta-rf-pla-014-entidad-tandas)
- [RF-PLA-015 — Bloqueo estricto del método contratado (Comercial-Logística-Planta)]( #doc-requisitos-backend-planta-rf-pla-015-bloqueo-metodo)
- [RF-PLA-016 — Inmutabilidad de ciclos aprobados a nivel de base de datos]( #doc-requisitos-backend-planta-rf-pla-016-trigger-inmutabilidad)
- [RF-PLA-017 — Generar y conservar la orden de esterilización]( #doc-requisitos-backend-planta-rf-pla-017-orden-esterilizacion-documento)
- [RN-PLA-001 — No cambiar en Planta el método contratado]( #doc-requisitos-backend-planta-rn-pla-001-metodo-contratado)
- [RN-PLA-002 — No sobrescribir ciclos aprobados; vincular reprocesos con el original]( #doc-requisitos-backend-planta-rn-pla-002-no-sobrescribir)
- [RF-SEG-001 — Confirmación por contraseña en operaciones críticas]( #doc-requisitos-backend-seguridad-rf-seg-001-password-aprobaciones)
- [RNF-SEG-001 — Validación de autorización y ámbito en backend]( #doc-requisitos-backend-seguridad-rnf-seg-001-autorizacion-ambito)
- [RNF-SEG-002 — Protección de sesiones y operaciones críticas]( #doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas)
- [RF-TRA-001 — Reconstrucción de la cadena cliente–cotización–operación–certificado–entrega]( #doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio)
- [RF-USR-001 — Administrar usuarios y su estado]( #doc-requisitos-backend-usuarios-rf-usr-001-administracion-usuarios)
- [RF-USR-002 — Asignar varios roles, permisos y ámbitos a usuarios]( #doc-requisitos-backend-usuarios-rf-usr-002-roles-ambitos)
- [RF-USR-003 — Administrar áreas y permisos]( #doc-requisitos-backend-usuarios-rf-usr-003-administracion-areas)
- [RF-USR-004 — Implementar CRUD para gestión dinámica de Roles y Permisos]( #doc-requisitos-backend-usuarios-rf-usr-004-crud-roles)
- [Registro acumulado de brechas]( #doc-requisitos-brechas-registro-brechas)
- [Decisiones de negocio]( #doc-requisitos-decisiones-decisiones-negocio)
- [Análisis de requisitos frontend]( #doc-requisitos-frontend-readme)
- [RNF-OPS-001 — Preparación y operación del ERP en producción]( #doc-requisitos-operacion-rnf-ops-001-operacion-produccion)
- [Instrucción de incorporación — Decisiones de Prioridad 1]( #doc-requisitos-por-aclarar-decisiones-prioridad-1-calidad-planta-logistica)
- [RA-CAL-001 — Políticas de cuarentena y destino de materiales rechazados]( #doc-requisitos-por-aclarar-ra-cal-001-politicas-cuarentena)
- [RA-CAL-002 — Políticas de gestión de desviaciones y cierre de CAPA]( #doc-requisitos-por-aclarar-ra-cal-002-politicas-capa)
- [RA-CAL-003 — Políticas de liberación por excepción y firmas]( #doc-requisitos-por-aclarar-ra-cal-003-politicas-excepcion)
- [RA-CER-001 — Políticas de certificación para ciclos compartidos y cantidades]( #doc-requisitos-por-aclarar-ra-cer-001-politicas-certificacion)
- [RA-CER-002 — Políticas de anulación, reemplazo y conservación de certificados]( #doc-requisitos-por-aclarar-ra-cer-002-politicas-reemplazo)
- [RA-COM-001 — Alcance contractual del ciclo de vida del cliente]( #doc-requisitos-por-aclarar-ra-com-001-ciclo-vida-cliente)
- [RA-COM-002 — Categorización de dispositivos médicos]( #doc-requisitos-por-aclarar-ra-com-002-categorizacion-dispositivos)
- [RA-COM-003 — Flujo de reemplazo de cotizaciones emitidas]( #doc-requisitos-por-aclarar-ra-com-003-flujo-reemplazo)
- [RA-COM-004 — Transición de estado a EMITIDA]( #doc-requisitos-por-aclarar-ra-com-004-transicion-estado-emitida)
- [RA-COM-005 — Precios especiales reutilizables por cliente]( #doc-requisitos-por-aclarar-ra-com-005-precios-cliente)
- [RA-COM-006 — Evidencia de aceptación del cliente]( #doc-requisitos-por-aclarar-ra-com-006-evidencia-aceptacion)
- [RA-COM-007 — Política de reconstrucción de PDFs históricos]( #doc-requisitos-por-aclarar-ra-com-007-reconstruccion-pdf-historico)
- [RA-COM-008 — Políticas de resolución de anulaciones]( #doc-requisitos-por-aclarar-ra-com-008-politicas-anulacion)
- [RA-FIS-001 — Fiscalidad por producto o servicio]( #doc-requisitos-por-aclarar-ra-fis-001-fiscalidad-por-producto)
- [RA-LOG-001 — Soportes comerciales para creación de órdenes]( #doc-requisitos-por-aclarar-ra-log-001-soportes-comerciales)
- [RA-LOG-002 — Políticas de evidencia y notificación en recepciones parciales]( #doc-requisitos-por-aclarar-ra-log-002-notificacion-parciales)
- [RA-LOG-003 — Políticas de disposición de materiales rechazados]( #doc-requisitos-por-aclarar-ra-log-003-politicas-rechazo)
- [RA-LOG-004 — Criterios de cierre de órdenes y despachos parciales]( #doc-requisitos-por-aclarar-ra-log-004-cierre-ordenes)
- [RA-PLA-003 — Política de inventario y microbodega en Planta]( #doc-requisitos-por-aclarar-ra-pla-003-inventario-planta)
- [RA-PLA-004 — Políticas de equipos, calibración y capacidad]( #doc-requisitos-por-aclarar-ra-pla-004-politicas-equipos)
- [RA-PLA-005 — Formatos de consecutivos y numeración física]( #doc-requisitos-por-aclarar-ra-pla-005-numeracion-ciclos)
- [RA-PLA-006 — Políticas de reprocesos y material rechazado]( #doc-requisitos-por-aclarar-ra-pla-006-politicas-reproceso)
- [RA-PLA-007 — Políticas de evidencias documentales y formatos]( #doc-requisitos-por-aclarar-ra-pla-007-politicas-evidencias)
- [RA-PLA-008 — Políticas de recetas, insumos y microbodega]( #doc-requisitos-por-aclarar-ra-pla-008-politicas-recetas)
- [RA-PLA-009 — Alcance de validación normativa de los procesos de esterilización]( #doc-requisitos-por-aclarar-ra-pla-009-validacion-normativa-procesos)
- [RA-PLA-010 — Alcance documental de la orden de esterilización]( #doc-requisitos-por-aclarar-ra-pla-010-alcance-orden-esterilizacion)
- [RA-SEG-001 — Alcance jurídico y evidencia de firmas y autorizaciones]( #doc-requisitos-por-aclarar-ra-seg-001-evidencia-legal-firmas)
- [RA-USR-001 — Políticas de asignación de roles por planta]( #doc-requisitos-por-aclarar-ra-usr-001-roles-por-planta)
- [RA-USR-002 — Definición de Áreas Operativas vs. Scopes]( #doc-requisitos-por-aclarar-ra-usr-002-areas-scopes)
- [Requisitos Sterinova ERP]( #doc-requisitos-readme)

## Fuentes

<a id="doc-estandar-cotizaciones-estandar_formatos"></a>

**Origen:** docs/estandar-cotizaciones/ESTANDAR_FORMATOS.md

## Estándar canónico de formatos de cotización

Este documento define la taxonomía y presentación objetivo de las cotizaciones Sterinova. Los valores heredados almacenados en `cotizaciones.tipo_servicio`, `productos.tipo_servicio` y `formatos_documentales.tipo_servicio` se conservan; el código los traduce a un tipo canónico al resolver prefijos y renderizadores.

### Tipos, prefijos y textos

| Código canónico | Prefijo | Título superior | Subtítulo |
|---|---|---|---|
| `SERV_ETO_FARMA` | `COT-CEMFA` | ESTERILIZACIÓN INDUSTRIAL | Cotización de Servicios |
| `SERV_ETO_FAB` | `COT-CMED` | ESTERILIZACIÓN INDUSTRIAL | Cotización de Servicios |
| `SERV_ETO_INST` | `COT-CME` | ESTERILIZACIÓN INSTITUCIONAL EtO | Cotización de Servicios |
| `SERV_VAPOR_INST` | `COT-CME` | ESTERILIZACIÓN INSTITUCIONAL VAPOR | Cotización de Servicios |
| `SERV_LAV_FARMA` | `COT-LAV` | LAVANDERIA DOTACIÓN FARMACÉUTICA | Cotización de Servicios |
| `VENTA_INSUMOS` | `COT-CMI` | VENTA DE INSUMOS | Cotización de insumos |

Los dos primeros tipos usan esta introducción: “En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización industrial con Óxido de Etileno (EtO) de Sterinova, dirigido al procesamiento de productos que requieren este método de esterilización. Nuestro servicio está orientado a brindar soluciones confiables y adaptadas a las características y necesidades de cada producto y proceso.”

`SERV_ETO_INST`: “En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización institucional con Óxido de Etileno (EtO) de Sterinova, orientado a atender requerimientos de esterilización de productos compatibles con este método, especialmente en situaciones de contingencia. Nuestro servicio busca brindar una solución oportuna y confiable, de acuerdo con las necesidades y condiciones particulares de cada cliente.”

`SERV_VAPOR_INST`: “En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización institucional con vapor de Sterinova, orientado a atender requerimientos de esterilización de productos compatibles con este método, especialmente en situaciones de contingencia. Nuestro servicio busca brindar una solución oportuna y confiable, de acuerdo con las necesidades y condiciones particulares de cada cliente.”

`SERV_LAV_FARMA`: “En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de lavandería de dotación farmacéutica de Sterinova, orientado al lavado y acondicionamiento de prendas y elementos utilizados en ambientes farmacéuticos y áreas que requieren condiciones especiales de procesamiento.”

`VENTA_INSUMOS`: “En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente a la línea de venta de insumos de Sterinova, especializada en soluciones para procesos de esterilización y monitoreo.”

### Cuerpo y datos

Los seis formatos comparten una cabecera con logo, número de cotización, fecha `DD/MM/YYYY`, título y subtítulo; una grilla de cliente (`CLIENTE`, `NIT / C.C. / C.E. / OTRO`, `CONTACTO`, `CARGO`, `TELÉFONO`, `E-MAIL`, `DIRECCIÓN`, `CIUDAD`); condiciones comerciales; y bloque de firmas.

#### Control documental y de calidad

La cabecera conserva el bloque de control documental de la versión publicada del formato: código de formato, `VERSIÓN: NN` y fecha de versión en `DD-MM-YYYY` (por ejemplo, `R-CM-07-2` · `VERSIÓN: 05` · `20-11-2026`). Se obtiene dinámicamente desde `formato.configuracion_json.document_code`, `version_label` y `version_date`, con respaldo en `formato.codigo`, `formato.version` y `formato.fecha_version`. No se fija el código, la versión ni la fecha en el renderer, ya que estos datos se administran por versión documental.

Los cinco formatos `SERV_*` muestran una tabla única: `DESCRIPCIÓN`, `CANTIDAD`, `VALOR UNITARIO`, `VALOR TOTAL`.

`VENTA_INSUMOS` agrupa solo las categorías con líneas cotizadas:

| Categoría maestra | Encabezado | Columnas |
|---|---|---|
| `EMPAQUES` | EMPAQUES PARA ESTERILIZACIÓN | REFERENCIA · CANTIDAD · PRECIO UNITARIO · VALOR TOTAL · MARCA |
| `MONITOREO` | MONITOREO ESTERILIZACIÓN | CÓDIGO · REFERENCIA · MÉTODO DE ESTERILIZACIÓN · PRESENTACIÓN · CANTIDAD · PRECIO PRESENTACIÓN · VALOR TOTAL |
| `EQUIPOS` | EQUIPOS APOYO TECNOLÓGICO | CÓDIGO · IMAGEN · DESCRIPCIÓN DEL EQUIPO · CANTIDAD · PRECIO DE VENTA · VALOR TOTAL |

La categoría de catálogo `GENERAL` no tiene bloque canónico definido y debe resolverse antes de incluir esas líneas en el cuerpo de insumos.

### Condiciones comerciales y firmas

La tabla comercial usa estas etiquetas: `TIEMPO DE DESPACHO`, `TRANSPORTE`, `FORMA DE PAGO`, `VALIDEZ DE LA OFERTA`, `EL PRECIO INCLUYE`, `EL PRECIO NO INCLUYE`.

- **Realizó:** Juan José Hernández — Analista Comercial; Cel: 317 718 3115; Email: comercial1@sterinova.co.
- **Aprobó:** Ing. Daniel Riveros — Subgerente Comercial; Cel: 318 338 8210; Email: daniel.riveros@sterinova.co.

### Regla fiscal

El backend registra el IVA y el total calculado. El documento cotizado no debe incluir notas como “Precios antes de IVA (19%)” ni “Adicionar el valor del IVA (19%)”. El tratamiento y presentación de los importes debe mostrar los valores finales con IVA integrado, coordinado con el contrato del renderer.

### Compatibilidad heredada implementada

| Tipo heredado | Tipo canónico | Prefijo |
|---|---|---|
| `INDUSTRIAL_ETO` | `SERV_ETO_FARMA` (tipo EtO industrial genérico) | `COT-CEMFA` |
| `FARMACEUTICO` | `SERV_ETO_FARMA` | `COT-CEMFA` |
| `FABRICANTE` | `SERV_ETO_FAB` | `COT-CMED` |
| `INSTITUCIONAL_ETO` | `SERV_ETO_INST` | `COT-CME` |
| `INSTITUCIONAL_VAPOR` | `SERV_VAPOR_INST` | `COT-CME` |
| `LAVANDERIA` | `SERV_LAV_FARMA` | `COT-LAV` |
| `INSUMOS` | `VENTA_INSUMOS` | `COT-CMI` |

El resolver conserva la búsqueda de formatos asignados a cliente por tipo heredado, admite `tipo_servicio` canónico para nuevos formatos y conserva las claves globales históricas `COTIZACION_<TIPO_HEREDADO>` y `COTIZACION_FARMACEUTICO_FABRICANTE`.

<a id="doc-negocio-analisis-flujo-operativo-2026-11-11"></a>

**Origen:** docs/negocio/analisis-flujo-operativo-2026-11-11.md

## Análisis del flujo Comercial → Logística → Planta → Calidad

> **Estado:** análisis histórico para discusión. Consultar [requisitos](./REQUISITOS_Y_REGLAS.md#doc-requisitos-readme) y [reglas maestras](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) para decisiones posteriores.

Fecha: 11 de noviembre de 2026. Estado: análisis para discusión; no es una especificación aprobada ni acredita implementación.

### 1. Lo confirmado en esta conversación

- Comercial valida las características del servicio: esterilización cuando aplique, empaque como PGM y necesidad de recogida. Cotizaciones pertenece a Comercial.
- Logística puede recoger el producto o recibirlo directamente. Registra cantidades y datos que alimentan el acta de servicio.
- Planta ejecuta procesos según recetas por cliente. Existen etapas intermedias adicionales que aún deben identificarse.
- Planta tendrá una bodega propia: registra lo recibido cuando Logística le entrega los insumos solicitados.
- El usuario aclaró que el documento final mencionado para Calidad es el **certificado de esterilización**.
- Se requiere avanzar por partes conectadas, sin implementar todas las entidades simultáneamente.

Las reglas previas de aprobación técnica de protocolos por Calidad permanecen vigentes: validar el alcance con Comercial no equivale a que Comercial apruebe parámetros técnicos.

### 2. Evidencia de los formatos

| Fuente revisada | Qué muestra | Consecuencia para el diseño |
| --- | --- | --- |
| LOGISTICA.xlsm, encabezados de INFORMACION ENTRADA | Esterilización, empaque y transporte separados; recepción con fecha, hora, responsables y cajas | Registrar dimensiones independientes y eventos reales de recepción. |
| LOGISTICA.xlsm, INFORMACION DETALLADA | Producto, lote, cantidad y cajas por línea; grupos repetidos hasta 15 líneas | Conservar detalle por material; no heredar el límite de 15 líneas del formulario. |
| Acta de Servicio.pdf, R-LG-04, v03 | Cantidades y cajas recibidas/entregadas, observaciones de recepción y cliente, referencias a certificado/factura | El acta reúne varios momentos; no puede completarse íntegramente al recibir ni copiar recibido en entregado. |
| Orden de Servicio.pdf, R-ES-02, v03 | Orden de servicio de esterilización; método, empaque, transporte, cantidades y verificación de recepción/entrega | La orden orienta el trabajo y acumula verificaciones; no es el certificado. |
| COT-CEMFA192-1, ejemplo de cotización, pp. 2–3 | Servicio de empaque en doble PGM, esterilización, análisis e informe; condiciones diferentes por concepto | Un solo tipo en la cabecera no describe todo el alcance; cada concepto necesita su proceso, unidad e inclusiones. |
| Ejemplo de Certificado de Esterilizacion.pdf, R-AQ-09, v05 | Cliente, materiales/lotes/empaque, equipo/ciclo, parámetros, controles y responsables | Calidad debe utilizar evidencia de ejecución y trazabilidad del material. |

Se revisaron visualmente los dos PDF escaneados de Orden y Acta; se extrajo texto de cotización y certificado. El XLSM se leyó sin guardarlo ni ejecutar macros. No se importó su historial. Los formatos no enumeran por sí solos todas las etapas de Planta ni acreditan una receta técnica vigente.

### 3. Recorrido propuesto

```text
COMERCIAL: alcance del servicio y cotización aceptada
    → orden / instrucción operativa identificable
    → si hay recogida: programación → recogida → recepción
    → si llega directamente: recepción
LOGÍSTICA: recepción comprobada y apertura del acta
    → entrega identificada a Planta
PLANTA: receta aplicable y etapas registradas
    → revisión de evidencias por Calidad
CALIDAD: liberación y certificado cuando corresponde esterilización
    → Logística: despacho / entrega real y cierre del acta
```

El regreso a Logística para entregar está respaldado por los apartados de salida de los formatos. Su detalle operativo debe concretarse. Un servicio sin esterilización necesita su proceso y documento de cierre aplicables; no se propone generar un certificado de esterilización ficticio. La venta de insumos puede requerir una ruta de despacho sin proceso en Planta, pendiente de definir por servicio.

La orden debe conservar referencia a la versión comercial que la originó. Las cantidades contratadas, esperadas para una entrega, recibidas, procesadas, liberadas y entregadas son hechos distintos. Las diferencias deben tener motivo y responsable, sin sobrescribir el acuerdo comercial.

La recepción directa elimina la recogida, pero no la identificación del cliente, el alcance autorizado ni la revisión de recepción. Si llega producto sin orden previa, hace falta definir una recepción pendiente de conciliación comercial; no se presume autorización para procesarlo.

### 4. Información que debe viajar entre áreas

| Entrega | Información mínima propuesta |
| --- | --- |
| Comercial → Logística | Cliente/sede/contacto; servicio y materiales esperados; esterilización sí/no y método cuando aplique; empaque acordado; quién aporta el empaque; recogida o llegada directa; dirección/ventana cuando corresponda; referencia comercial y responsable. |
| Logística → Planta | Recepción y orden de origen; producto, lote, unidad, cantidades y cajas reales; condición/empaque recibido; diferencias, rechazos y evidencias; entrega/recepción interna con responsables. |
| Planta → Calidad | Receta y versión aplicadas; etapas realizadas, responsables y fechas; materiales/cantidades asignados; consumos; equipos, parámetros y controles aplicables; incidencias y reprocesos. |
| Calidad → Logística | Materiales y cantidades liberados, retenidos o rechazados; certificado aplicable; restricciones para despacho. |

PGM debe distinguirse como requisito comercial, empaque observado en recepción e insumo realmente utilizado. Un indicador «con PGM» no explica tipo, presentación, cantidad, proveedor del empaque ni su consumo.

### 5. Recetas y etapas intermedias

Se propone una receta identificada por cliente/producto/servicio y versión, con aplicabilidad técnica. No basta el nombre del cliente si ese cliente entrega productos distintos.

Cada etapa deberá indicar: entrada requerida, responsable, operación, datos/evidencias, insumos, salida y condición para continuar. Posibles etapas a contrastar con la operación son inspección, preparación, acondicionamiento, empaque/sellado, procesamiento, secado/aireación y controles. **Son ejemplos para levantar el proceso, no una secuencia confirmada ni instrucciones técnicas.**

Separar receta prevista de ejecución real. Conservar versiones históricas y las incidencias; un reproceso debe enlazarse al intento anterior. Calidad interviene también en la aprobación de protocolos y tratamiento de desviaciones, aunque la revisión final esté al final del recorrido.

### 6. Bodega de Planta e inventario

Se propone separar dos controles:

- **Producto del cliente en custodia:** dueño, material, lote, ubicación, cantidad y estado del proceso; no es inventario propio disponible para vender o consumir.
- **Insumos de Sterinova:** referencia, unidad, lote/vencimiento cuando corresponda, bodega, disponibilidad, transferencias y consumos.

Flujo propuesto: solicitud de Planta → preparación/entrega de Logística → confirmación de recepción en Planta → disponibilidad en bodega de Planta → consumo asociado al proceso.

La solicitud no aumenta existencias. La entrega de Logística y recepción de Planta deben referirse a una sola transferencia para evitar duplicados. Si ocurren en momentos distintos, conservar cantidad en tránsito; registrar entregas parciales y diferencias. El consumo reduce existencias de Planta; el traslado entre bodegas conserva el total de la empresa. Devoluciones, mermas y ajustes requieren movimientos con motivo, no edición directa de saldos.

Ejemplo ilustrativo: Logística envía 100 bolsas PGM y Planta confirma 98. Deben quedar 98 recibidas y 2 pendientes de conciliación, sin crear 100 disponibles en ambas bodegas. Si consume 20 de las 98, quedan 78 disponibles antes de otros movimientos.

### 7. Brechas verificadas en el código actual

| Hallazgo | Evidencia local | Efecto |
| --- | --- | --- |
| Cotizaciones ya tiene ruta en Comercial | Frontend: src/lib/navigation.ts, /comercial/cotizaciones | El cambio principal es de alcance y traspaso operativo, además de cualquier ajuste visual necesario. |
| La orden se crea desde Logística y exige estado APROBADA | src/logistica/logistica.service.ts, createOrden | Debe conciliarse con la aceptación/emisión comercial documentada; no confundir aprobación interna con aceptación del cliente. |
| Una orden por cotización | src/ordenes-servicio/entities/orden-servicio.entity.ts, cotizacion_id único y OneToOne; validación en createOrden | Contradice el requisito previo de varias órdenes por sede o entregas parciales. |
| Secuencia obligatoria PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA | src/logistica/logistica.service.ts, TRANSICIONES_ESTADO | Falta la ruta de recepción directa. |
| Un tipo de servicio en cabecera; ítems sin proceso/unidad estructurados | src/cotizaciones/entities/cotizacion.entity.ts y cotizacion-item.entity.ts | Insuficiente para expresar todos los conceptos del ejemplo de doble PGM y análisis. |
| Materiales tienen una cantidad entera y empaque como texto | src/ordenes-servicio/entities/orden-servicio-material.entity.ts | No separa recepción/entrega/cajas; requiere unidades y decimales cuando aplique. |
| Planta registra ciclos EtO/Vapor; protocolo por método/versión | src/planta/planta.service.ts y entities/protocolo-esterilizacion-version.entity.ts | No representa todavía una receta completa por cliente con todas sus etapas. |
| Cada ciclo referencia una orden y su registro marca toda la orden PROCESADO | src/planta/entities/ciclo-esterilizacion.entity.ts y planta.service.ts | Falta asignación por cantidades para varias órdenes/cargas y procesamiento parcial. |
| Calidad aprueba y llama la emisión del certificado | src/calidad/calidad.service.ts, aprobar | Coincide con la aclaración del usuario, pero no demuestra que todas las etapas previas ya existan. |
| No aparece módulo de inventario/bodegas en la composición revisada | src/app.module.ts y mapa del backend | Se necesita diseñar movimientos, transferencias y consumos. |

La inspección fue estática sobre el checkout existente, que contiene cambios previos. No se ejecutaron pruebas de operación ni se consultó la base de datos; estos hallazgos no son una auditoría exhaustiva.

### 8. Camino de trabajo recomendado

Recomendación: avanzar por un caso de servicio completo, concretando primero cada traspaso. Terminar módulos aislados dejaría sus conexiones sin comprobar; abordar todas las tablas simultáneamente ampliaría demasiado el alcance.

1. **Comercial: ficha del servicio.** Elegir un caso real; definir qué se contrata, esterilización, PGM, unidades, recogida y origen de la orden. Salida: ejemplo de información que Logística recibe sin reinterpretar texto libre.
2. **Logística: recepción y acta.** Probar el mismo caso con recogida y con llegada directa; diferenciar cantidades previstas/reales, recepción parcial y rechazo. Salida: recepción trazable y entrega a Planta.
3. **Bodega de Planta, alcance mínimo.** Usar los insumos que ese caso requiere; solicitud, transferencia, recepción, saldo y consumo. Salida: reconciliar qué entregó Logística y qué recibió/usó Planta.
4. **Planta: receta de ese caso.** Levantar una a una las etapas reales, registros y responsables; vincular consumos y cantidades procesadas. Salida: expediente de ejecución completo, incluidos procesos intermedios.
5. **Calidad y entrega.** Revisar el expediente, liberar cantidades, emitir certificado aplicable y cerrar entrega/acta. Salida: rastrear el certificado hasta materiales recibidos y procesos ejecutados.
6. **Ampliar variantes.** Sin esterilización, sin PGM, lavandería, insumos, servicios combinados, parciales, múltiples cargas y reprocesos. Sus relaciones deben preverse desde el primer paso, aunque su ejecución se incorpore después.

Por cada paso: datos y responsable → estados/eventos → conexión con el anterior → ejemplo de aceptación → implementación focalizada cuando corresponda. No es necesario construir un catálogo corporativo completo para validar el primer caso.

### 9. Próxima definición

Empezar con una ficha Comercial de un servicio real que use PGM y esterilización, indicando si se recoge o llega directamente. Después levantar sus etapas intermedias con los formatos correspondientes, sin asumir que el certificado contiene toda la receta.

Quedan pendientes el significado y cardinalidad institucional de Orden/Acta, quién aporta el PGM, las etapas reales por servicio y el documento de cierre para servicios sin esterilización. La aclaración de Calidad como emisor del certificado ya quedó resuelta y no requiere repetirse.

### 10. Referencia externa

Como referencia técnica general, las [recomendaciones de CDC, apartados 13, 16 y 17](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/summary-recommendations.html) relacionan compatibilidad del empaque, registros de ciclo/operador/controles y trazabilidad de cargas. Apoyan conservar esa evidencia separada del documento comercial. No determinan las recetas de Sterinova ni se presentan como normativa colombiana aplicable.

No se modificaron código, formatos originales, datos, macros ni migraciones. Este documento conserva hallazgos y propuestas sin sustituir las reglas maestras aprobadas.

<a id="doc-negocio-contexto-producto"></a>

**Origen:** docs/negocio/contexto-producto.md

## Contexto del producto

> **Estado:** vigente como contexto, revisado el 6 de noviembre de 2026.
> **Verificado contra:** documentación de producto del repositorio el 6 de noviembre de 2026; no certifica reglas de negocio.
> **Alcance:** propósito y áreas de producto expresadas en el repositorio.
> **No cubre:** especificación de capacidades, reglas verificadas ni despliegue.
> **Fuente canónica de:** contexto general del producto backend.

Sterinova ERP busca apoyar los procesos internos de una empresa colombiana de esterilización industrial, servicios EtO y vapor, lavandería farmacéutica y comercialización de dispositivos médicos.

Las áreas contempladas son Comercial, Logística, Planta y Calidad. Entre los objetivos están reducir la doble digitación, dar trazabilidad a las operaciones y centralizar la información.

Las reglas de negocio, controles de calidad e invariantes regulatorias descritas en materiales de diseño son objetivos que deben verificarse en el código y en la operación antes de considerarlos garantizados.

<a id="doc-negocio-cuestionarios-origen"></a>

**Origen:** docs/negocio/cuestionarios-origen.md

## Cuestionarios originales de negocio

> **Estado:** fuente histórica de respuestas. Las reglas activas y cuestiones abiertas se consultan en [reglas maestras](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) y [requisitos](./REQUISITOS_Y_REGLAS.md#doc-requisitos-readme).

Conservados el 11 de noviembre de 2026 desde el frontend. Las respuestas oficiales se mantienen en [reglas maestras](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

<a id="modulo-1"></a>

### Módulo 1

1. ¿Cuál es la estructura real de la empresa que debe representar el sistema: departamentos, equipos comerciales, sedes, plantas y responsables?

2. ¿Cuáles son los perfiles reales y sus funciones? ¿Los cinco roles legados —Admin, Comercial, Logística, Planta y Calidad— representan suficientemente esa estructura?

3. ¿Una persona puede desempeñar varios roles en distintos equipos o plantas? ¿Cómo deben manejarse suplencias y permisos temporales?

4. Para cada módulo, ¿quién puede consultar, crear, editar, aprobar, emitir, descargar, anular y administrar? ¿Qué información debe quedar oculta incluso para usuarios del mismo departamento?

5. ¿Un comercial ve únicamente sus clientes y cotizaciones, los de su equipo o todos? ¿Quién puede reasignarlos cuando cambia el responsable?

6. ¿El superior jerárquico hereda acceso a todo lo de sus subordinados o necesita permisos explícitos? ¿Hay excepciones por sede o cliente?

7. ¿Quién puede crear usuarios, asignar permisos y desactivarlos? ¿Se necesita aprobación de otra persona para conceder facultades sensibles?

8. ¿La recuperación de contraseña debe hacerse por correo, mediante un administrador o por ambos medios? ¿El restablecimiento debe obligar a cambiar la contraseña al ingresar?

9. ¿Qué duración de sesión, cierre por inactividad, sesiones simultáneas y segundo factor necesitan? ¿Al desactivar una cuenta o cambiar permisos deben invalidarse inmediatamente sus sesiones?

10. ¿Qué actuaciones deben auditarse, quién puede consultar esa auditoría y cuánto tiempo debe conservarse? ¿Qué ocurre con registros y responsabilidades de un usuario que se retira?



<a id="modulo-2"></a>

### Módulo 2

11. ¿Los clientes pueden ser personas naturales, empresas colombianas, entidades públicas y empresas extranjeras? ¿Qué identificación corresponde a cada caso?

12. Para NIT colombiano, ¿se exige dígito de verificación válido? ¿Debe almacenarse separado y normalizar puntos, espacios y guiones?

13. ¿Qué debe pasar cuando se intenta registrar el mismo NIT: bloquear, reutilizar el cliente o permitir una sede adicional vinculada a la misma razón social?

14. ¿Una empresa puede tener varias sedes y direcciones distintas para facturación, recogida y entrega? ¿Cuál debe imprimirse en cada documento?

15. ¿Necesitan varios contactos por cliente, con funciones como compras, pagos, recepción y calidad? ¿Se selecciona un destinatario diferente por cotización?

16. ¿Qué campos son obligatorios para guardar un prospecto y cuáles solo para emitir una cotización u ordenar un servicio?

17. ¿Quién puede corregir razón social, identificación y dirección? ¿Qué cambios requieren motivo, soporte o aprobación?

18. Si cambian los datos del cliente, ¿los borradores deben actualizarse automáticamente o pedir confirmación? ¿Se confirma que los documentos ya emitidos conservan los datos originales?

19. En importaciones Excel, ¿los duplicados se omiten, se actualizan o se presentan para conciliación? ¿Se permite importar parcialmente las filas correctas y entregar un informe de errores?

20. ¿Necesitan clientes inactivos o bloqueados por cartera, documentación o calidad? ¿Qué operaciones bloquea cada motivo y quién puede autorizar una excepción?



<a id="modulo-3"></a>

### Módulo 3

21. ¿Qué servicios entran en esta fase? El último cierre excluía temporalmente Insumos: ¿se mantiene esa exclusión o ahora debemos analizarlo funcionalmente también?

22. ¿Qué diferencia comercial y operativa existe entre Industrial EtO, Farmacéutico y Fabricante? ¿Son servicios distintos o clasificaciones del cliente que podrían usar el mismo servicio?

23. ¿Una cotización puede combinar esterilización, laboratorio, empaque, transporte, lavandería e insumos, o debe pertenecer obligatoriamente a un solo servicio?

24. ¿La cotización es un presupuesto de cantidades concretas, una lista de tarifas o puede ser cualquiera de los dos? ¿Cómo se distingue cada modalidad?

25. ¿Las unidades incluyen prendas, kilogramos, litros, cajas, ciclos y unidades? ¿Cuáles admiten decimales y cómo se relacionan capacidad, cantidad y precio?

26. ¿Los productos y servicios deben seleccionarse de un catálogo con tarifas o pueden escribirse libremente? ¿Quién puede modificar precios y con qué límites?

27. ¿Necesitan descuentos por ítem o por documento, precios mínimos y aprobación por margen? ¿En qué orden se aplican descuentos, transporte e impuestos?

28. ¿Qué reglas de redondeo deben aplicarse por ítem, subtotal, impuesto y total? ¿El PDF debe mostrar centavos cuando existan?

29. ¿Puede haber tratamientos de IVA distintos dentro de una misma cotización? ¿Quién determina y acredita las excepciones tributarias, incluidas las operaciones internacionales?

30. El ejemplo CMED139 está en inglés y convierte COP a USD: ¿debe soportarse moneda e idioma por cotización? ¿Quién fija la tasa de cambio y en qué momento queda congelada?

31. ¿Una cotización puede presentar alternativas excluyentes, como las dos opciones del ejemplo CMED139? ¿Cómo registra el cliente cuál acepta?

32. ¿Qué significa exactamente “aprobar”: revisión interna, autorización para emitir, aceptación del cliente o autorización para iniciar el servicio? ¿Debemos separar esos eventos?

33. ¿Cuál es la secuencia completa de estados y quién puede ejecutar cada transición? ¿Debe distinguir borrador, revisión, aprobada internamente, emitida, enviada, aceptada, rechazada, vencida y anulada?

34. ¿El creador puede aprobar y emitir su propia cotización? ¿Hay umbrales de valor, descuento o condiciones especiales que exijan otra persona?

35. ¿Qué acredita la aceptación del cliente: orden de compra, correo, firma, portal o registro manual? ¿Debe adjuntarse evidencia antes de crear una orden de servicio?

36. ¿Qué sucede si una cotización emitida necesita corrección: nueva revisión del mismo consecutivo, nueva cotización vinculada o anulación y reemplazo?

37. ¿Cuándo se asigna el consecutivo y cómo funcionan prefijos, revisiones y reinicios de numeración? Si cambia el tipo de servicio durante el borrador, ¿debe conservarse el prefijo original?

38. **Obligatoriedad:** ¿los seis campos comerciales pueden quedar incompletos en borrador pero deben estar diligenciados al emitir? ¿En cuáles se permite “No aplica”?

39. **TIEMPO DE DESPACHO:** ¿se redacta libremente o se estructura en plazo, unidad y evento inicial? ¿Debe admitir plazos separados para producto, laboratorio e informe, como muestran los ejemplos?

40. **TRANSPORTE:** ¿debe registrar quién lo presta y paga, cobertura, recogida/entrega y condiciones por monto? ¿Una tarifa de transporte debe aparecer también como ítem calculable?

41. **FORMA DE PAGO:** ¿debe admitir anticipos y cuotas con porcentajes y eventos de vencimiento? ¿Es solo texto contractual o debe bloquear operaciones hasta registrar el pago?

42. **VALIDEZ DE LA OFERTA:** ¿se expresa como fecha límite, días desde emisión o texto? Si se escribe “diciembre de 2026”, ¿qué fecha exacta debe usar el sistema para determinar el vencimiento?

43. **EL PRECIO INCLUYE / EL PRECIO NO INCLUYE:** ¿serán textos libres, listas seleccionables o ambos? ¿Necesitan advertencias cuando contradigan los ítems cotizados?

44. ¿Debe haber condiciones sugeridas por servicio o cliente? ¿Quién las administra y quién puede modificarlas? ¿Los textos largos deben continuar en otra página sin recortarse?

45. ¿Qué hacemos con el texto general de cotizaciones existentes: conservarlo como observación, pedir clasificación manual o mantenerlo solo en históricos? ¿Se necesitan “OBSERVACIONES” adicionales, como en algunos ejemplos, además de los seis campos?



<a id="modulo-4"></a>

### Módulo 4

46. ¿Una cotización aceptada puede generar varias órdenes por recogidas, sedes o entregas parciales? ¿Puede una orden reunir ítems de varias cotizaciones?

47. ¿Qué condiciones deben cumplirse para crear y programar una orden: aceptación, orden de compra, anticipo, documentación y disponibilidad?

48. ¿Qué identifica cada recepción física: orden, remisión, fecha, responsable, sede de origen y evidencia? ¿Se necesita firma o fotografía?

49. ¿Cómo se manejan diferencias entre cantidades cotizadas, recogidas y recibidas: aceptación parcial, devolución, ajuste comercial o bloqueo?

50. ¿Un mismo producto puede llegar en varios lotes, referencias o empaques? ¿Cada combinación debe conservar trazabilidad independiente?

51. ¿Las cantidades operativas siempre son enteras o lavandería y otros servicios necesitan peso o volumen decimal?

52. ¿Qué significa cada cantidad de muestras —retención, cliente y laboratorio— y si se descuenta del material recibido? ¿Cómo se diferencian cero, desconocido y “No aplica”?

53. ¿Qué condiciones de empaque se inspeccionan al recibir? ¿Quién puede autorizar reempaque, rechazar material o registrar un costo adicional?

54. ¿Se necesita controlar transportistas propios y externos, conductores, vehículos, rutas y prueba de entrega? ¿Qué datos deben quedar obligatoriamente registrados?

55. ¿Cuál es la secuencia real desde recogida hasta entrega final? ¿Se necesitan estados separados de recepción, cuarentena, liberación por Calidad, despacho y entrega?

56. ¿Puede despacharse material sin certificado o antes de la liberación de Calidad? ¿Existen excepciones autorizadas y cómo quedan documentadas?

57. ¿Hasta cuándo se pueden corregir materiales y lotes? Si ya existe un ciclo, ¿cómo se corrige un error sin perder lo originalmente procesado?



<a id="modulo-5"></a>

### Módulo 5

58. ¿Qué procesos debe gestionar Planta además de EtO y Vapor? ¿Lavandería necesita un flujo propio y cuáles son sus etapas?

59. ¿Los equipos deben salir de un catálogo controlado con código, método, capacidad, ubicación y estado? ¿Quién administra ese catálogo?

60. ¿Mantenimiento, calibración o calificación vencida deben impedir programar o registrar ciclos? ¿Quién puede liberar nuevamente un equipo?

61. ¿Qué identifica el número de ciclo: consecutivo del sistema o número registrado por la máquina? ¿Debe ser único por equipo, año o toda la empresa?

62. ¿Un ciclo puede procesar varias órdenes y clientes? ¿Una orden puede distribuirse entre varios ciclos?

63. ¿Cómo se registra exactamente qué materiales y cantidades entraron en cada ciclo, incluidos reprocesos y remanentes?

64. ¿Quién decide el método de esterilización y con qué evidencia de compatibilidad del producto? ¿Puede Planta cambiar el método contratado?

65. ¿Cuáles son los parámetros, unidades y precisiones obligatorias por método? ¿Se capturan valores únicos, mínimos/máximos, series temporales o archivos del equipo?

66. ¿El protocolo depende únicamente del método o también del equipo, producto, empaque y cliente? ¿Quién selecciona y aprueba la versión aplicable?

67. ¿Se puede registrar posteriormente un ciclo ya ejecutado? ¿Qué límites, motivos y autorizaciones requieren las fechas retroactivas o correcciones?

68. ¿Cómo se registran ciclos abortados, incompletos o fallidos? ¿El reproceso crea otro ciclo vinculado y conserva todos los resultados anteriores?

69. ¿Qué debe ocurrir para declarar una orden procesada: registrar un ciclo, completar todas sus cantidades o recibir aprobación de Calidad?



<a id="modulo-6"></a>

### Módulo 6

70. ¿Qué revisa y libera Calidad: un ciclo completo, una carga, una orden, un lote o cada material individualmente?

71. ¿La persona que ejecutó el ciclo puede aprobarlo? ¿Se requiere revisión independiente o doble aprobación en determinados casos?

72. ¿Quién define los criterios de aceptación y dónde está su fuente controlada? ¿Cambian por método, equipo, producto, empaque o cliente?

73. ¿El sistema debe calcular automáticamente “Cumple” comparando mediciones y límites, permitir evaluación manual o combinar ambos mecanismos?

74. ¿En qué parámetros se permite “No aplica” y qué justificación exige? ¿Puede modificarse el resultado calculado y quién lo autoriza?

75. ¿Qué evidencia debe adjuntarse: resultados biológicos, químicos, gráficos del equipo, análisis externos, fotografías o informes?

76. ¿Existen resultados pendientes que obliguen a mantener el producto en cuarentena? ¿Se permite liberación condicionada y con qué restricciones?

77. ¿Un parámetro “No cumple” bloquea siempre la aprobación o existe liberación por desviación formal? ¿Quién asume y registra esa decisión?

78. ¿Puede aprobarse parte de los materiales de un ciclo y rechazarse otra? ¿Cómo se identifican los subconjuntos y su destino?

79. ¿Qué procedimiento sigue un rechazo: motivo, evidencia, investigación, acciones correctivas, devolución o reproceso?

80. ¿Confirmar la contraseña satisface la aprobación interna requerida o necesitan otra modalidad de firma, identidad, cargo y marca de tiempo? ¿Quién define los requisitos aplicables?

81. ¿Cómo se corrige una evaluación ya aprobada y qué pasa con el certificado y material entregado? Si falla la generación del PDF, ¿la aprobación debe quedar pendiente o completada con emisión por reintentar?



<a id="modulo-7"></a>

### Módulo 7

82. ¿Se emite un certificado por ciclo, cliente, orden, lote o entrega? ¿Puede incluir materiales de varios ciclos?

83. ¿Qué formatos oficiales aplican a EtO, Vapor y otros servicios? ¿Qué campos y textos deben coincidir literalmente con cada referencia?

84. ¿Los tres años de vigencia aplican a todos los productos y empaques? Si existen excepciones, ¿quién determina el plazo y qué evidencia debe conservarse?

85. ¿Qué se está declarando con la fecha de vencimiento: vigencia del certificado, conservación de esterilidad o vida útil del producto? ¿Qué condiciones de almacenamiento deben acompañarla?

86. ¿Cuál es la regla de numeración y cómo debe convivir con certificados anteriores? ¿Se comparte consecutivo entre plantas y métodos?

87. ¿Qué datos y firmas hacen que un certificado esté autorizado para entregarse? ¿Quién valida sus requisitos legales y de calidad, y cuáles son las referencias controladas aplicables?

88. ¿El cuadro de estampado debe permanecer completamente blanco en todos los formatos? ¿Qué dimensiones físicas debe tener y dónde deben quedar QR, firma y sellos de cabecera?

89. ¿Qué información puede consultar públicamente quien escanee el QR? ¿Debe mostrar estado vigente, vencido, anulado o reemplazado sin exponer información comercial?

90. ¿Cómo se anula o reemplaza un certificado incorrecto? ¿Se conserva el original, se enlaza el sustituto y se identifica a los clientes que deban ser notificados?

91. ¿Durante cuánto tiempo deben conservarse PDF, datos, evidencias y versiones? Si se pierde el PDF original, ¿se permite reconstruirlo y cómo se distinguiría esa reconstrucción?



<a id="modulo-8"></a>

### Módulo 8

92. ¿Quién es dueño de cada formato y quién puede redactar, revisar, aprobar, publicar y retirar una versión? ¿Deben ser personas distintas?

93. ¿Cuál es la fuente aprobada: Word controlado, PDF firmado, repositorio documental externo o configuración del sistema? ¿Cómo se resuelve una discrepancia entre esas fuentes?

94. ¿Qué cambios obligan a crear una versión nueva: textos, campos, cálculos, diseño, firmas, logotipo o correcciones tipográficas?

95. ¿La fecha de aprobación y la fecha de entrada en vigor pueden ser diferentes? ¿Se necesita programar publicaciones futuras y controlar documentos en preparación durante el cambio?

96. ¿Qué tiene prioridad: versión general, versión por cliente, servicio, idioma o sede? ¿Puede un cliente seguir usando una versión anterior y quién autoriza esa excepción?

97. ¿Qué debe ocurrir si no existe un formato publicado o un sello vigente para emitir: bloquear, emitir sin sello o aplicar una alternativa expresamente aprobada?

98. ¿Cómo se administran normas, licencias, imágenes y vigencias de los sellos? ¿Quién recibe alertas y qué ocurre cuando una licencia se suspende, vence o cambia de alcance?

99. ¿Confirmamos que cambiar un formato o sello no altera documentos emitidos anteriormente? ¿Las nuevas condiciones comerciales deben introducirse mediante una versión documental identificable?

100. ¿Quién dará la aceptación final de cada formato y con qué casos representativos? ¿Debe incluir revisión impresa, textos extensos, varias páginas, diferentes monedas/idiomas y conservación de históricos?

<a id="doc-negocio-reglas-maestras"></a>

**Origen:** docs/negocio/reglas-maestras.md

## Reglas maestras de negocio — ocho módulos

> Actualización posterior: consultar la [hoja de ruta integral del 12 de noviembre de 2026]. Consolida decisiones adicionales y correcciones del usuario sobre emisión comercial, documentos, parciales, ciclos mixtos, recetas, inventario y Calidad. En caso de conflicto, prevalecen esas decisiones confirmadas; sus propuestas técnicas no equivalen a reglas aprobadas ni a implementación.

Consolidación: 10 de noviembre de 2026. Requisitos al 9 de noviembre; no acredita implementación.

Se reúnen íntegramente las ocho reglas del frontend, preservando decisiones, propuestas y pendientes. Las reglas oficiales se mantienen en este documento desde el 11 de noviembre de 2026. Los cuestionarios originales se conservan en cuestionarios-origen.md. Una propuesta no se convierte en decisión confirmada por consolidarla. Diseño objetivo: [roles y permisos](./ARQUITECTURA_Y_CONTRATOS.md#doc-arquitectura-roles-y-permisos).


<a id="modulo-1"></a>

---

## Módulo 1 — Autenticación y usuarios: reglas de negocio

Fecha de actualización: 9 de noviembre de 2026.

Estado: respuestas del Módulo 1 incorporadas; no requiere repetir el interrogatorio. Este documento describe requisitos del negocio, no certifica su implementación.

Fuente principal: respuestas entregadas por el usuario en `Módulo 1 — Autenticación y usuarios.md`, adjunto desde `C:\Users\urria\Downloads`, y su instrucción de organizar el interrogatorio. Las respuestas más recientes prevalecen sobre propuestas y matrices anteriores cuando difieran.

Las preguntas originales se conservan, sin respuestas ni modificaciones, en [el cuestionario del Módulo 1](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen). Este documento contiene su resolución y las implicaciones para los demás módulos.

### 1. Organización y jerarquías

- La empresa se organiza por áreas.
- El gerente general puede consultar todo el sistema.
- El gerente comercial tiene alcance sobre el área Comercial; cada área tiene su responsable, por ejemplo el jefe de Calidad.
- En Comercial existen varios trabajadores o asesores que gestionan cotizaciones.
- El SuperAdmin tiene facultades superiores a las del gerente general. Son responsabilidades diferenciadas: visibilidad global del negocio no equivale automáticamente a administración técnica de la plataforma.
- La respuesta no enumera todas las áreas ni detalla cada facultad adicional del SuperAdmin. No se inventan sedes, plantas, niveles jerárquicos ni excepciones.

### 2. Roles y asignaciones

- Los cinco roles legados no constituyen un catálogo definitivo.
- Debe ser posible crear roles y configurar sus funciones conforme evolucione la organización.
- Una persona puede desempeñar varios roles en distintos equipos o plantas.
- Las funciones y permisos son dinámicos; no se deben fijar por nombre de persona ni por un listado cerrado de cargos.
- La respuesta confirma la multiplicidad de roles; no fija duración, vencimiento automático ni mecanismo de suplencias temporales.

### 3. Facultades comerciales y aprobación

- Los asesores comerciales pueden crear, editar y descargar cotizaciones conforme a sus permisos configurados.
- El jefe aprueba la cotización y el asesor la emite al área correspondiente.
- La aprobación del jefe y la emisión por el asesor son actuaciones diferentes y deben conservar sus responsables.
- No se considera que el permiso de editar otorgue por sí solo la aprobación del jefe.
- Actualización con las respuestas del Módulo 3: quien crea no aprueba; el gerente comercial o administrador autorizado aprueba para enviar al cliente. Después de la aceptación del cliente, el asesor emite y pasa al siguiente ciclo. La propuesta de estados y sus límites se desarrolla en [Cotizaciones](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

#### Anulación con aprobación

1. El asesor solicita la anulación.
2. La solicitud debe incluir una observación antes de la aprobación.
3. El administrador de su área aprueba la solicitud.
4. La solicitud del asesor no equivale por sí sola a una anulación aprobada.

La anulación debe distinguirse de la eliminación física. Los estados afectados, las consecuencias sobre órdenes o certificados y el tratamiento de solicitudes rechazadas se desarrollarán en sus módulos; no quedan decididos por esta respuesta.

### 4. Visibilidad de clientes, cotizaciones y responsabilidad

- Ante la pregunta sobre ver registros propios, del equipo o todos, el usuario respondió: «Todos, esto le permite seleccionar el cliente para esa cotización».
- Se registra la decisión de visibilidad compartida en Comercial y, expresamente, la posibilidad de seleccionar clientes existentes aunque no los haya creado el asesor.
- No se debe mantener la restricción anterior de acceso exclusivamente propio como si fuera la decisión definitiva del negocio.
- La respuesta no distingue explícitamente si «todos» comprende todas las cotizaciones de la empresa o las del área, ni concede acceso a otras áreas. Esa delimitación no se presume.
- El asesor que toma un cliente lleva todo el proceso; la reasignación es excepcional.
- No se ha definido un procedimiento de reasignación ni un autorizador específico para ese caso excepcional.

### 5. Administración de usuarios

- El gerente comercial y cada administrador de área pueden crear usuarios, asignar permisos y desactivarlos dentro de la responsabilidad de su área.
- Los casos sensibles requieren análisis específico; no se consideran autorizados de manera general por esta regla.
- La administración de área no se documenta como permiso para conceder SuperAdmin o facultades globales.
- La respuesta no define el tratamiento de una desactivación cuando la persona conserva funciones en otras áreas; no se asume una desactivación global automática.

### 6. Recuperación de contraseña

El usuario delega la elección de la solución y admite recuperación desde el login o renovación por el jefe de área.

Propuesta documental para concretar esa delegación, todavía no implementada:

- Ofrecer recuperación desde el login mediante un enlace de restablecimiento de un solo uso al correo registrado.
- Permitir al administrador autorizado del área iniciar un restablecimiento para el usuario.
- El restablecimiento permite establecer una contraseña nueva; no revela ni comparte la contraseña actual.
- Si se utiliza una credencial temporal, exigir su sustitución en el siguiente ingreso.

Estos mecanismos son una propuesta de diseño derivada de la delegación, no respuestas textuales del usuario. La vigencia del enlace, el canal disponible y los controles de sesión se definirán al diseñar la implementación.

### 7. Sesión y continuidad del trabajo

- Duración de sesión solicitada: 10 horas, conforme a la respuesta «Diría que 10 horas» y su reiteración posterior.
- El trabajo en curso debe conservarse hasta terminarlo o cerrarlo.
- Si se interrumpe la red, al restablecerse la conexión debe recuperarse el avance que llevaba el usuario.
- La duración de la sesión y la conservación del trabajo son requisitos distintos. Recuperar un avance no debe confundirse con haber confirmado una operación en el servidor.
- No se ha fijado si las 10 horas son absolutas o renovables, ni un plazo de inactividad, número de sesiones simultáneas o segundo factor.
- La respuesta tampoco precisa el significado de cerrar un proceso respecto de conservar o descartar su borrador, ni la política de invalidación inmediata por cambio de permisos. Estos detalles no se presentan como decisiones ya tomadas.

### 8. Auditor y exportación

- Debe existir un acceso o rol de auditor.
- Entre sus funcionalidades se contempla exportar a Excel información de cotizaciones y certificados.
- El usuario anticipa más funcionalidades de auditoría; esta lista no es exhaustiva.
- La respuesta no otorga facultades de edición, aprobación, emisión o anulación al auditor.
- La visibilidad exacta, columnas exportables, plazo de conservación de auditoría y tratamiento de los registros de usuarios retirados no se especifican en las respuestas recibidas.
- El nuevo acceso de auditor no se equipara automáticamente al rol previo `auditor_calidad`: su alcance solicitado incluye también información comercial.

### 9. Regla transversal: múltiples servicios por cotización

El usuario indica que un mismo cliente puede solicitar más de un servicio dentro de una misma cotización.

- Esta necesidad queda registrada como requisito de negocio para el Módulo 3.
- No debe descartarse por la existencia actual de un único tipo de servicio por cotización.
- Debe considerarse al definir aprobaciones por área, emisión al área correspondiente, desglose de servicios y generación de órdenes.
- La observación no determina todavía cómo se agrupan los servicios, sus impuestos, sus formatos o sus órdenes.

Referencia de continuidad: pregunta 23 del [cuestionario de Cotizaciones](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen). La necesidad de múltiples servicios ya fue expresada; la pregunta original se conserva por trazabilidad, no para desconocer esta respuesta.

### 10. Alcance de esta actualización

- Las diez respuestas del Módulo 1 quedan incorporadas sin solicitar una nueva ronda de preguntas.
- Los puntos no especificados se distinguen de los requisitos confirmados para evitar convertir supuestos en reglas aprobadas.
- El contrato RBAC existente es un antecedente técnico; deberá reconciliarse con estas respuestas antes de una futura implementación, especialmente respecto de visibilidad comercial, aprobación del jefe, emisión y rol de auditor.
- No se modifican permisos efectivos, sesiones, datos, contratos API ni código de producción en esta fase.
- El siguiente bloque de respuestas corresponde al [Módulo 2 — Clientes](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen).


<a id="modulo-2"></a>

---

## Módulo 2 — Clientes: reglas de negocio

Fecha de actualización: 9 de noviembre de 2026.

Estado: respuestas 11 a 20 incorporadas. Documento de análisis de negocio; no certifica implementación ni modifica datos de clientes.

Fuente principal: archivo entregado por el usuario `Módulo 2 -Clientes.md`, ubicado en `C:\Users\urria\Downloads`. Se distinguen las decisiones expresas de las propuestas solicitadas al analista y de los detalles aún no especificados.

Las preguntas originales se conservan en el [cuestionario del Módulo 2](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen). La organización y los permisos generales se complementan con las [reglas del Módulo 1](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

### 1. Identificación y tipos de cliente — respuestas 11 y 12

#### Decisiones recibidas

- Admitir distintos tipos de identificación: CC, NIT, CE, PET y otros que correspondan.
- Se conserva literalmente la denominación «PET» del usuario; no se sustituye por otra sigla por suposición.
- La identificación puede llegar con distintas presentaciones desde Excel. Los ejemplos dados son `100300654` para cédula y `789.987.675-1` para NIT.
- Los ejemplos describen presentación, no acreditan que un número sea válido.

#### Propuesta de análisis

- Separar el tipo de documento de su número; no presentar todas las identificaciones como NIT.
- Tratar los identificadores como texto para conservar ceros iniciales y evitar conversiones numéricas de Excel.
- Normalizar la identificación según su tipo para comparar duplicados, conservando el valor original importado como evidencia de origen.
- Para NIT, distinguir número y dígito de verificación; las diferencias de puntos, espacios o guiones no deberían crear clientes distintos.
- No inferir automáticamente el tipo de documento solo por su longitud o apariencia. Una identificación ambigua debe quedar para revisión.

No se ha confirmado una regla obligatoria de validación del dígito de verificación, el catálogo completo de identificaciones ni la correspondencia de cada tipo con personas naturales, entidades públicas o clientes extranjeros. No se declaran requisitos legales a partir de estos ejemplos.

### 2. Unicidad del cliente — respuesta 13

#### Decisiones recibidas

- El NIT identifica de forma única al cliente en este sistema.
- Un cambio de razón social no implica crear un segundo cliente con el mismo NIT.
- No se deben registrar clientes duplicados bajo un mismo NIT.

#### Propuesta de análisis

- Ante un NIT ya registrado, reutilizar el registro existente o presentar su actualización para revisión; no crear otra ficha.
- Para identificaciones distintas de NIT, utilizar tipo y número normalizado como criterio de comparación, sujeto a la definición del catálogo.
- No usar únicamente la razón social como identificador: puede cambiar y también puede coincidir entre registros distintos.
- Si una identificación viene incompleta o contradictoria, no fusionar registros automáticamente.

La afirmación del usuario se documenta como regla de unicidad del sistema, no como una conclusión jurídica sobre estructuras empresariales.

### 3. Direcciones, sedes y verificación — respuesta 14

#### Decisiones recibidas

- La información utilizada dependerá de los datos efectivamente registrados para cada cliente.
- La importación debe agilizar la captura, pero exige validar cliente por cliente que la información sea verídica.
- Importar una fila no equivale a validar automáticamente su contenido.

#### Propuesta de análisis

- Distinguir el origen importado del estado de revisión del cliente; conservar quién revisó los datos y cuándo.
- Presentar la información consolidada al asesor para su revisión antes de considerarla validada.
- Mantener una dirección principal y permitir direcciones adicionales identificadas por uso cuando los datos reales lo requieran.
- Seleccionar de manera explícita la dirección pertinente para cada documento u operación; no inventar direcciones de recogida, entrega o facturación.

La respuesta no confirma múltiples sedes ni determina qué dirección debe imprimirse en cada documento. Esa capacidad queda como propuesta condicionada a los datos y flujos reales.

### 4. Contactos — respuesta 15

El usuario solicita una definición basada en el análisis. La siguiente es una propuesta, no una decisión previamente expresada:

- Usar un contacto principal por cliente como opción predeterminada para cotizaciones.
- Permitir contactos adicionales opcionales cuando una empresa tenga interlocutores distintos para compras, pagos, recepción o Calidad. No exigir crear uno por cada función.
- Cada contacto tendría nombre, cargo o función, teléfono y correo según la información disponible.
- Permitir seleccionar el destinatario de una cotización; inicialmente se propone el contacto principal.
- Conservar los datos del destinatario dentro del documento al congelarlo, de modo que cambiar un contacto no reescriba documentos históricos.

Ejemplo: la cotización puede dirigirse a Compras y la recogida coordinarse con Recepción. Si una misma persona realiza ambas funciones, basta con un solo contacto.

### 5. Datos mínimos y uso de Excel — respuesta 16

#### Decisiones recibidas

- La base Excel es la referencia de partida para capturar clientes.
- El usuario solicita analizar esos datos para definir el conjunto de campos y su obligatoriedad.

#### Propuesta inicial, pendiente de contrastar con el Excel real

| Momento | Criterio propuesto |
| --- | --- |
| Previsualizar una importación | Mostrar también las filas incompletas, sus valores originales y observaciones, sin inventar datos. |
| Crear una ficha utilizable | Contar con nombre o razón social, tipo y número de identificación revisados, y resolver duplicados. |
| Preparar una cotización | Seleccionar el cliente y destinatario; señalar datos incompletos necesarios para el formato concreto. |
| Aprobar o emitir | Validar los campos exigidos por el formato y el proceso acordado; conservar los datos utilizados en el documento. |
| Programar recogida o entrega | Disponer de dirección y contacto operativos adecuados, definidos junto con Logística. |

No se adjuntó el Excel en esta entrega y no se encontraron archivos Excel o CSV en las carpetas documentales revisadas. Por ello, esta actualización no presenta como verificados sus encabezados, tipos, calidad ni campos obligatorios definitivos.

El importador y el modelo actuales usan razón social, identificación, contacto, teléfono, correo y dirección, además de cargo y ciudad. Ese esquema técnico es un antecedente, no una sustitución del análisis solicitado del Excel.

### 6. Edición, activación y conservación — respuesta 17

#### Decisiones recibidas

- Los asesores comerciales crean clientes, consultan sus datos y deben disponer de acciones para editarlos, activarlos e inactivarlos conforme a los permisos del área.
- Los clientes no se eliminan, para conservar la trazabilidad necesaria en auditorías.
- La inactivación no debe borrar el registro ni romper sus relaciones históricas.

#### Propuesta de análisis

- Registrar autor, fecha y valores anteriores y nuevos de las modificaciones.
- Solicitar motivo para inactivación, reactivación y correcciones de identificación.
- Ante una corrección de identificación, comprobar duplicados y revisar el impacto; no fusionar clientes ni reasignar documentos silenciosamente.

La respuesta no exige una aprobación adicional para toda edición ni detalla soportes obligatorios. No se incorpora ese requisito como decisión confirmada.

### 7. Cambios en datos y documentos — respuesta 18

#### Decisiones recibidas

- Los documentos aprobados y emitidos conservan sus datos: no deben cambiar por modificaciones posteriores del cliente.
- En borrador se pueden corregir datos del cliente mal redactados.
- La actualización de la ficha del cliente no autoriza a reescribir documentos históricos.

#### Propuesta de análisis

- Conservar una copia de los datos utilizados en el documento cuando alcance el estado que impide modificaciones.
- Si la ficha cambia mientras hay borradores, mostrar la diferencia y permitir al asesor incorporar la corrección de forma explícita.
- Diferenciar una corrección de la ficha maestra de un cambio específico del destinatario o dirección de un borrador.

La respuesta no determina si el congelamiento empieza con la aprobación o únicamente después de emitir, ni cómo se corrige un documento aprobado que todavía no se ha emitido. El límite exacto se alineará con los estados del Módulo 3, sin debilitar la conservación de los documentos históricos.

### 8. Importación, duplicados y complementación — respuesta 19

#### Decisiones recibidas

- Los duplicados se omiten como nuevas altas.
- Se permite cruzar información complementaria: por ejemplo, una fila sin teléfono y otra con el teléfono del mismo cliente.
- La información resultante sigue requiriendo la validación cliente por cliente indicada en la respuesta 14.

#### Propuesta de conciliación

1. Leer y conservar los datos de origen y la referencia a la fila.
2. Comparar identificaciones normalizadas para detectar que las filas pertenecen al mismo cliente.
3. Consolidar valores complementarios cuando un campo está vacío y existe un valor no contradictorio en otra fila del mismo cliente.
4. Mostrar los campos completados y sus fuentes para revisión del asesor.
5. Si hay valores diferentes no vacíos, presentar el conflicto y conservar la información existente hasta resolverlo; no sobrescribirla automáticamente.
6. Si solo coincide la razón social y falta una identificación consistente, señalar una posible coincidencia para revisión, sin fusionar automáticamente.
7. Informar por separado altas, duplicados omitidos, complementaciones propuestas y filas con errores o conflictos.

Ejemplo de complementación: dos filas con el mismo NIT normalizado, una sin teléfono y otra con teléfono. Ejemplo de conflicto: el mismo NIT con dos teléfonos diferentes; la selección del valor no se decide por el orden de las filas.

El usuario no definió si la importación debe confirmarse de forma parcial o atómica ni si este cruce puede actualizar automáticamente clientes ya persistidos. La propuesta mantiene revisión explícita antes de aplicar cambios sobre fichas existentes.

### 9. Inactividad y bloqueos — respuesta 20

#### Decisiones recibidas

- Deben contemplarse clientes inactivos y bloqueos cuando el proceso correspondiente aplique.
- La respuesta admite estas capacidades, pero no define todavía sus efectos por motivo.

#### Propuesta de análisis

- Distinguir la inactividad general de un bloqueo operativo específico, por ejemplo de cartera, documentación o Calidad.
- Conservar motivo, responsable, fecha y levantamiento del bloqueo.
- Mantener accesibles los registros históricos según los permisos, aunque el cliente esté inactivo o bloqueado.
- Definir para cada motivo qué acciones se impiden y quién puede levantarlo o autorizar una excepción, junto con el módulo responsable.

No se asume que cualquier bloqueo impida automáticamente todas las operaciones ni se inventan umbrales de cartera o autoridades de excepción.

### 10. Brechas visibles y continuidad

La revisión estática del modelo actual muestra un campo único `nit`, un contacto y una dirección por cliente; la entidad revisada no contiene estado de activación, tipos de identificación ni bloqueos. El DTO exige varios campos de contacto, pero no valida el dígito de verificación del NIT. Estos son aspectos a reconciliar en una futura implementación, no cambios realizados en esta fase.

Se preservan las 100 preguntas originales y las reglas del Módulo 1. No se modifican código de producción, base de datos, importaciones ni documentos emitidos.

El siguiente bloque corresponde al [Módulo 3 — Cotizaciones](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen). Al analizarlo deben respetarse las decisiones ya recibidas: múltiples servicios en una cotización, aprobación del jefe, emisión por el asesor, solicitud de anulación con observación y conservación de los datos históricos del cliente.


<a id="modulo-3"></a>

---

## Módulo 3 — Cotizaciones: reglas de negocio

Fecha de actualización: 9 de noviembre de 2026.

Estado: incorporadas las respuestas recibidas a las preguntas 21 a 45. La pregunta 29 no contiene respuesta. Las propuestas solicitadas al analista y los detalles pendientes se identifican expresamente; no constituyen funcionalidad implementada ni decisiones ya aprobadas.

Fuente principal: `Módulo 3 - Cotizaciones.md`, entregado por el usuario desde `C:\Users\urria\Downloads`.

Referencias: [cuestionario original](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), [Autenticación y usuarios](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) y [Clientes](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras). Las respuestas recientes precisan el flujo comercial y prevalecen sobre propuestas anteriores cuando difieran.

### 1. Alcance y servicios — respuestas 21 a 24

#### Decisiones recibidas

- El análisis comprende todos los productos y servicios. Se levanta la exclusión temporal de Insumos para esta fase de análisis.
- Se incorpora al alcance funcional un módulo de Productos, con carga del catálogo mediante Excel.
- Cada servicio corresponde a un proceso diferente. Industrial EtO, Farmacéutico y Fabricante no deben tratarse como simples etiquetas intercambiables del cliente.
- Una cotización puede combinar varios servicios diferentes.
- Debe admitir productos o servicios del catálogo y otros conceptos añadidos manualmente como ítems, aunque no estén en el Excel.

#### Propuesta de organización

- Mantener una cabecera comercial por cotización y un detalle de ítems con su producto o servicio, proceso, descripción, unidad, cantidad, precio y descuento.
- Ofrecer búsqueda de productos y servicios del catálogo y una acción explícita para agregar un ítem manual.
- Un ítem manual pertenece inicialmente a la cotización; su creación no debe publicar automáticamente una nueva referencia en el catálogo general.
- Conservar la referencia al catálogo y una copia de los datos cotizados. Los cambios posteriores de catálogo no deben alterar una cotización emitida.
- Identificar el proceso correspondiente a cada ítem para permitir posteriormente su distribución a las áreas operativas.

La respuesta 24 confirma la combinación de conceptos del catálogo y adicionales, pero no resuelve si existen cotizaciones como listas de tarifas sin cantidades comprometidas. No se equipara «servicio fijo» con una modalidad de tarifa determinada.

#### Dependencia del nuevo módulo de Productos

El catálogo requiere definir estructura, unidades, identificación de referencias, precios, estados y conciliación de importaciones. El Excel de productos no se adjuntó en esta entrega: no se presumen sus columnas ni sus datos. Esta ampliación de alcance no autoriza implementación ni añade preguntas a los ocho cuestionarios originales.

### 2. Unidades y cantidades — respuesta 25

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

### 3. Precios, descuentos e IVA — respuestas 26 a 29

#### Decisiones recibidas

- Los precios pueden variar según el cliente; no existe un único precio obligatorio para todos.
- El asesor debe poder seleccionar productos o servicios mediante búsqueda y preparar precios específicos para la cotización.
- El descuento se aplica por ítem, porque algunos servicios pueden tenerlo y otros no.
- Los descuentos aplicados deben detallarse en la cotización.
- El IVA no debe alterarse como parte de la negociación comercial.
- Los importes mostrados deben expresarse sin centavos, por ejemplo `1.540.550`, no `1.540.550,03`.

No se han definido precios mínimos, márgenes ni umbrales de descuento. La revisión del jefe es obligatoria según el flujo general, pero no se inventan límites adicionales.

#### Propuesta de cálculo y presentación

1. Seleccionar el precio correspondiente al cliente o capturar el precio propuesto para el ítem.
2. Calcular el importe bruto del ítem a partir de cantidad y precio unitario.
3. Aplicar un único descuento por ítem: porcentaje o importe, identificando su modalidad. Evitar aplicar simultáneamente ambos por error.
4. Mostrar importe bruto, descuento e importe neto de cada ítem.
5. Incluir transporte cobrado como un concepto separado, cuando corresponda, para evitar cargos invisibles o dobles.
6. Aplicar el tratamiento fiscal autorizado a la base que corresponda y calcular el total. La secuencia fiscal definitiva depende de resolver la pregunta 29; este documento no determina tratamientos tributarios.

Como validaciones de diseño se proponen porcentajes de descuento entre 0 y 100 y un importe de descuento que no supere el bruto del ítem. No son topes de política comercial aprobados.

#### Redondeo propuesto

- Conservar precisión decimal durante el cálculo y evitar truncar cantidades o porcentajes.
- Como criterio inicial, redondear los importes netos visibles de cada ítem a la unidad monetaria más cercana y sumar esos importes para obtener un subtotal conciliable con las filas impresas.
- Presentar impuestos y total sin centavos, con una política fiscal y de redondeo única que haga coincidir formulario, servidor y PDF.
- Identificar el importe de descuento visible de forma que bruto, descuento y neto cuadren; no limitarse a ocultar decimales de importes que luego no suman.
- Definir los casos de empate de redondeo y las reglas por moneda antes de implementar. La respuesta confirma la presentación sin centavos, no este algoritmo propuesto.

#### IVA: punto sin respuesta

La pregunta 29 sobre tratamientos distintos de IVA y excepciones tributarias quedó sin respuesta. No se concluye que todos los ítems tengan la misma tasa ni se presupone exención por cliente extranjero o moneda.

«El IVA no se puede tocar» se registra como una restricción de la negociación comercial, no como prohibición de administrar una configuración fiscal autorizada. Las facultades de administración fiscal y las excepciones requieren definición expresa; no se concede al asesor modificar tasas o importes fiscales libremente.

### 4. Moneda e idioma — respuesta 30

#### Decisión recibida

La moneda con la que paga el cliente se define en su catálogo o ficha y depende del cliente.

#### Propuesta de análisis

- Usar la moneda configurada del cliente como valor inicial de una nueva cotización.
- Identificar expresamente la moneda del documento; no mezclar importes de monedas distintas en un total.
- Si hay conversión, conservar moneda de origen, moneda de destino, tasa, fecha y responsable de la tasa aplicada.
- Congelar moneda y conversión en la versión comercial aprobada y emitida; no recalcular históricos al modificar la ficha del cliente.

No se ha definido la fuente de la tasa de cambio, quién la autoriza ni cuándo se fija inicialmente. La respuesta tampoco confirma un selector de idioma: el ejemplo en inglés constituye una necesidad por analizar, no una decisión de traducción automática o soporte bilingüe.

### 5. Alternativas excluyentes — respuesta 31

El usuario confirma que una cotización puede ofrecer alternativas y solicita detallarlas.

Se propone organizar alternativas identificadas —por ejemplo A y B— con sus propios ítems, descuentos, totales y condiciones cuando difieran. La aceptación debe indicar cuál se seleccionó y sobre qué versión se tomó la decisión.

Las alternativas excluyentes no se suman como si el cliente hubiera contratado todas. Las operaciones posteriores deben recibir únicamente la alternativa aceptada. Los conceptos opcionales o combinables deben diferenciarse de alternativas excluyentes; sus combinaciones permitidas aún no están definidas.

### 6. Aprobación, envío, aceptación y emisión — respuestas 32 a 35

#### Decisiones recibidas

- El gerente comercial o administrador del área correspondiente aprueba la cotización para enviarla al cliente.
- Quien crea la cotización no la aprueba. Tener varios roles no elimina esta separación de personas.
- La cotización se envía al cliente después de la aprobación interna.
- Si el cliente acepta, se emite y pasa al siguiente ciclo operativo.
- Si el cliente no acepta, la respuesta indica anularla.
- Según el Módulo 1, el asesor realiza la emisión al área correspondiente y solicita las anulaciones con observación para aprobación del administrador del área.

Se conserva la precisión del usuario «si no estoy mal es así» de la respuesta 32. La respuesta 35 reitera aceptación antes de emisión; por tanto esa secuencia es la base de este análisis, sin dar por definidos todos los estados de excepción.

#### Flujo propuesto a partir de las respuestas

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

#### Documento enviado frente a emisión operativa

El cliente necesita recibir una propuesta antes de aceptarla. Por tanto, el envío o generación de esa propuesta y la emisión posterior que activa el proceso son eventos distintos en el flujo solicitado.

Se propone conservar una versión aprobada identificable para envío y registrar después su aceptación y emisión operativa. No debe marcarse automáticamente como emitida al descargar o enviar el PDF. La relación exacta entre ese PDF de propuesta, el documento emitido y sus fechas queda por concretar, especialmente por la vigencia descrita en la sección 10.

#### Evidencia de aceptación

La respuesta 35 confirma el orden del flujo, pero no indica si la evidencia será correo, orden de compra, firma o registro manual. Se propone registrar como mínimo fecha, responsable, medio, referencia a la versión y alternativa aceptada. No se declara obligatorio un adjunto, una firma o un canal que el usuario no haya definido.

### 7. Correcciones posteriores a emisión — respuesta 36

#### Decisiones recibidas

- Una cotización emitida no admite cambios de datos ni valores.
- Si necesita corrección, se anula y se reemplaza.

#### Propuesta de trazabilidad

- Conservar documento original, datos congelados, motivo, solicitante y aprobación de anulación.
- Vincular la nueva cotización con la que reemplaza, sin sobrescribirla ni reutilizar su archivo.
- Aplicar a la sustituta el flujo de revisión y aceptación correspondiente.
- Reconciliar órdenes ya creadas antes de continuar con la sustituta. No cancelar, transferir ni recrear automáticamente operaciones de otros módulos.

Cambiar precios del catálogo, moneda o datos del cliente tampoco debe modificar una emisión anterior. Para cambios de la propuesta aprobada pero no emitida se propone nueva revisión interna; su mecanismo definitivo aún no está establecido.

### 8. Consecutivos, prefijos y revisiones — respuesta 37

La numeración depende del proceso. El usuario aporta `COT-MED-001-1` como ejemplo, sin definir el significado de cada segmento.

Se propone una política configurable por proceso que documente prefijo, secuencia y, si aplica, revisión. No se interpreta el último `-1` automáticamente como versión, sede o alternativa.

Permanecen sin definir el momento de asignación, reinicios, relación entre reemplazo y revisión, y el prefijo de una cotización con varios servicios. No se debe adoptar silenciosamente el prefijo del primer ítem ni renumerar históricos.

### 9. Condiciones comerciales obligatorias — respuestas 38 y 44

#### Decisiones recibidas

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

### 10. Propuesta de captura de cada condición — respuestas 39 a 43

#### TIEMPO DE DESPACHO

Decisión: se redacta como texto por Comercial.

Propuesta: editor multilínea con una guía para indicar servicio, plazo, días hábiles o calendario, evento inicial y dependencias. Admitir apartados distintos para producto, laboratorio e informe cuando tengan plazos diferentes. La guía no debe imponer un plazo único a todos los servicios.

#### TRANSPORTE

El usuario considera pertinente registrar y controlar las condiciones del transporte.

Propuesta: registrar quién presta y paga, origen y destino, cobertura, recogida o entrega, condiciones de monto y posibles exclusiones. El texto acordado se imprime en la tabla comercial.

Si se cobra transporte, debe existir un ítem explícito asociado; el importe no se calcula interpretando texto libre. Si está incluido en otros precios, indicarlo y evitar un segundo cargo. El control operativo se desarrollará en Logística.

#### FORMA DE PAGO

Decisión: admitir acuerdos variables, por ejemplo 50 % y 50 %, o 30 % y 70 %.

Propuesta: definir etapas con porcentaje y evento de exigibilidad —anticipo, entrega u otro acordado— y generar un resumen revisable por el asesor. Si las etapas distribuyen todo el precio, comprobar que sumen 100 %. La captura de plazos debe indicar desde qué evento se cuentan.

No se ha autorizado bloquear operaciones por falta de pago ni se ha definido un módulo de recaudo. El acuerdo contractual y la comprobación real del pago deben mantenerse como conceptos distintos.

#### VALIDEZ DE LA OFERTA

Decisión expresada: inicio relacionado con la emisión y plazo de hasta 30 días. El ejemplo es del 25 de noviembre al 25 de diciembre; no debe limitarse al mes de creación.

Propuesta: almacenar fecha inicial, duración y fecha final explícitas y mostrar el intervalo en el PDF. Usar 30 días calendario como valor inicial es una propuesta; no sustituirlo por «el mismo día del mes siguiente», porque no siempre equivale a 30 días.

Punto de coherencia pendiente: la propuesta se envía antes de que el cliente acepte, y la emisión operativa ocurre después de aceptar. Si la vigencia empieza únicamente al emitir, no define hasta cuándo puede aceptarse la propuesta enviada. Debe precisarse si «emisión» en esta respuesta alude a la expedición de la propuesta aprobada o a la emisión operativa posterior. No se cambia silenciosamente la fecha inicial a creación o envío.

Tampoco se ha definido la hora límite, inclusión del último día ni autorización de prórrogas. El ejemplo por sí solo no resuelve esos detalles.

#### EL PRECIO INCLUYE / EL PRECIO NO INCLUYE

Decisión: dos textos libres separados, redactados por Comercial y revisados por su jefe.

Propuesta: permitir párrafos o listas legibles, con ejemplos de servicios, materiales, empaques, análisis y entregables. Señalar al revisor la necesidad de comprobar correspondencia con los ítems y condiciones de transporte. No modificar precios, impuestos o alcance automáticamente a partir del texto ni prometer detección automática de contradicciones.

### 11. Observaciones e históricos — respuesta 45

#### Decisión recibida

Cuando corresponda, diligenciar Observaciones; cuando no aplique, colocar `N/A`.

#### Propuesta

- Mantener Observaciones como apartado adicional a las seis condiciones, sin usarlo para sustituirlas.
- Representar «no aplica» explícitamente con `N/A`; no confundirlo con un campo olvidado.
- No repartir automáticamente el antiguo texto general entre los seis campos. Los borradores existentes podrían requerir clasificación manual al retomarlos.
- Conservar intactos los textos, datos y PDF históricos emitidos.

La respuesta define el uso futuro de Observaciones, pero no aprueba una migración de los textos generales ya almacenados. Esa clasificación sigue siendo una propuesta para borradores.

### 12. Resumen de decisiones pendientes y alcance

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

La siguiente etapa de respuestas corresponde al [Módulo 4 — Logística](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen). Debe considerar las cotizaciones con múltiples servicios, la alternativa aceptada, la emisión posterior a aceptación y la coordinación del transporte.


<a id="modulo-4"></a>

---

## Módulo 4 — Logística: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas 46 a 57 incorporadas como definiciones del negocio. No implica implementación ni validación operativa.

Fuente: `Módulo 4.md`, entregado por el usuario desde `C:\Users\urria\Downloads`. Se conservan las [preguntas originales](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen). Las precisiones pendientes al final distinguen conflictos entre módulos de reglas expresamente respondidas.

### 1. Órdenes y cotizaciones — respuesta 46

- Una cotización aceptada puede generar múltiples órdenes por sedes o entregas parciales.
- Cada orden pertenece a una sola cotización.
- Una orden puede agrupar varios ítems de esa misma cotización; no mezcla ítems de cotizaciones distintas.

### 2. Condiciones de creación — respuesta 47

- La cotización debe estar en estado `ACEPTADA` para crear la orden.
- Se requiere registrar la Orden de Compra (OC) del cliente o una autorización explícita del Jefe de Área.
- Si el acuerdo exige anticipo, el sistema debe alertar. No se establece un bloqueo obligatorio antes de la confirmación de Finanzas.
- No se infiere de esta respuesta cómo confirma Finanzas el pago ni qué bloqueo se aplicaría después: ese procedimiento no está definido.

### 3. Recepción física — respuesta 48

Registrar ID de orden, número de remisión/factura, fecha y hora, usuario autenticado que recibe, sede de origen y evidencias: fotos o firma digital de quien entrega.

La expresión «firma digital» se conserva como requisito recibido; su mecanismo técnico, identidad y requisitos de conservación todavía no se especifican. Una fotografía no se declara equivalente a una firma digital.

### 4. Diferencias y rechazos — respuesta 49

- Si se recibe menos de lo cotizado, registrar `RECIBIDO_PARCIAL` y notificar a Comercial.
- Logística puede rechazar material dañado y debe registrar el motivo.
- No se altera la cantidad cotizada sin autorización de una Desviación por Calidad.
- Deben distinguirse cantidad cotizada y recibida; una diferencia física no autoriza una reescritura silenciosa del documento comercial.

### 5. Materiales, lotes y unidades — respuestas 50 y 51

- Cada combinación de Producto + Lote + Empaque ocupa una fila independiente para conservar trazabilidad hasta el certificado.
- Admitir cantidades enteras y decimales según el servicio y su unidad.
- Esterilización por cajas o unidades suele usar enteros; Lavandería e insumos por peso o volumen requieren decimales, por ejemplo 15.5 kg.
- La precisión exacta por unidad no fue fijada; no debe aplicarse un redondeo monetario a cantidades físicas.

### 6. Muestras — respuesta 52

- Retención, cliente y laboratorio representan unidades físicas apartadas para pruebas.
- No se descuentan de la cantidad total procesada; son un dato adicional.
- Cero se conserva como `0`.
- Cuando no aplica, almacenar `NULL` y mostrar `N/A`.
- Esta definición no identifica `NULL` con un dato desconocido: una captura pendiente no debe presentarse como «no aplica» por defecto.

### 7. Empaque y reempaque — respuesta 53

- Inspeccionar integridad, tipo de empaque —por ejemplo Tyvek o PGM— y sellado.
- Logística puede rechazar material con empaque inadecuado.
- El reempaque requiere autorización del Jefe de Logística o Calidad.
- Puede generar un costo adicional al cliente. La respuesta no define su tarifa ni cómo se acepta el cargo; no se incorpora automáticamente a una cotización emitida.

### 8. Transporte — respuesta 54

Es obligatorio registrar transportista propio o externo, nombre del conductor, placa, ruta y prueba de entrega (POD) firmada o fotografiada.

La evidencia de recepción y la prueba de entrega final corresponden a eventos diferentes. El momento preciso en que se exige cada dato debe acompañar a su evento operativo; no se exige una POD final para crear una orden todavía no entregada.

### 9. Estados operativos — respuesta 55

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

### 10. Control de despacho — respuesta 56

- Bloquear el paso a `EN_DESPACHO` si Calidad no ha emitido y liberado el certificado.
- Única excepción expresamente descrita: urgencia médica con Liberación por Excepción documentada y autorizada directamente por el Gerente de Calidad.
- La excepción debe quedar en auditoría; no equivale a una facultad general para omitir controles.
- La existencia de un PDF por sí sola no acredita liberación.
- El alcance de la liberación para despachos parciales y la regularización posterior de la excepción deben completarse con Calidad.

### 11. Bloqueo y corrección de materiales — respuesta 57

- Una vez que Planta registra un ciclo y el material entra a la máquina, lotes y cantidades quedan bloqueados.
- Un error de digitación posterior requiere Corrección de Desviación.
- Conservar la evidencia original y exigir aprobación del Jefe de Calidad.
- La corrección no autoriza sobrescribir silenciosamente ciclos, materiales o certificados históricos.

La respuesta relaciona registro de ciclo y entrada física a máquina. Si son eventos separados, debe fijarse cuál activa el bloqueo; no se asume que exista una ventana de edición entre ambos.

### 12. Coherencia con otros módulos

Referencias: [Cotizaciones](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras), [Clientes](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) y [Autenticación y usuarios](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

| Punto | Definiciones recibidas y precisión pendiente |
| --- | --- |
| Creación de órdenes | Este módulo exige `ACEPTADA`; Cotizaciones sitúa la emisión después de aceptar y antes del siguiente ciclo. Falta definir si la orden nace antes o después de emitir y si ACEPTADA es un estado actual o una condición histórica. No se elimina ninguna de las dos definiciones. |
| Cantidad cotizada | Logística exige Desviación de Calidad para alterarla; Cotizaciones prohíbe cambiar datos o valores emitidos y exige anular/reemplazar. La autorización de desviación no debe interpretarse como permiso para sobrescribir una emisión. Debe concretarse su enlace con el reemplazo comercial. |
| Recepciones parciales | Comparar recibido con lo esperado para cada orden y entrega evitaría marcar como faltante una división planificada. Es una propuesta: la respuesta original compara con lo cotizado y debe precisarse el denominador operativo. |
| Servicios sin esterilización | Cotizaciones incluye Insumos y Lavandería. La regla de certificado para despacho no establece su tratamiento cuando no corresponde un certificado de esterilización. No se inventa una exención ni se exige un ciclo de esterilización a esos servicios. |
| Autorizadores | Se conservan Jefe de Área, Jefe de Logística, Jefe de Calidad y Gerente de Calidad según cada respuesta. No se consideran cargos equivalentes automáticamente. |
| Notificaciones y evidencias | Se requieren funcionalmente; canal, conservación, acceso y formatos admitidos no se han definido. No se envían notificaciones reales durante esta fase. |

### 13. Alcance de la entrega

Solo se documentan las respuestas y sus dependencias. No se modifica código, base de datos, estados efectivos, órdenes, archivos emitidos ni permisos. Los ocho cuestionarios y sus 100 preguntas se conservan.

Continúa el [Módulo 5 — Planta](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), donde deben precisarse asignación de materiales a ciclos, ingreso físico, cantidades parciales y separación entre procesamiento y liberación.


<a id="modulo-5"></a>

---

## Módulo 5 — Planta: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 58 a 69 incorporadas desde el mensaje del usuario. Son requisitos del negocio; no certifican implementación ni validación técnica de protocolos.

Referencias: [cuestionario original](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), [Logística](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) y [Cotizaciones](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

### 1. Procesos — respuesta 58

- Planta gestiona esterilización EtO, Vapor y Lavandería Farmacéutica.
- Lavandería tiene un flujo propio: Recepción → Lavado → Secado → Doblado/Empaque → Liberación.
- Lavandería no debe forzarse a pasar por un ciclo tradicional de esterilización ni a registrar sus parámetros de presión.
- Los criterios, responsable y documento de liberación de Lavandería deben precisarse con Calidad; no se presume que correspondan a un certificado de esterilización.

### 2. Catálogo de equipos — respuesta 59

- El catálogo es obligatorio.
- Cada equipo tiene código único, método EtO/Vapor, capacidad, ubicación y estado: Operativo, Mantenimiento o Fuera de Servicio.
- Solo el Jefe de Planta o Calidad pueden administrarlo.
- Los equipos utilizados deben seleccionarse del catálogo; no se sustituyen por nombres libres sin trazabilidad.

La respuesta describe el catálogo de esterilización. La clasificación de equipos de Lavandería y las unidades de capacidad no están definidas; no se les asigna EtO o Vapor por defecto.

### 3. Disponibilidad y calibración — respuesta 60

- Un equipo con calibración vencida o en mantenimiento no puede programarse ni utilizarse para registrar un ciclo.
- Solo Calidad o el Jefe de Planta pueden reactivarlo tras cargar el certificado de calibración.
- La carga del archivo y la reactivación autorizada son hechos distintos: subir un documento no implica automáticamente cambiar el estado del equipo.
- Como consecuencia de su estado, un equipo Fuera de Servicio tampoco debe habilitarse para operar.

No se definieron reglas de calificación, periodicidad de calibración ni validación del certificado. Tampoco se resolvió cómo documentar un ciclo que ocurrió antes de detectar una indisponibilidad: no se descarta evidencia real ni se inventa una excepción al bloqueo.

### 4. Identificación de ciclos — respuesta 61

- El sistema genera un consecutivo interno para trazabilidad; `CIC-2026-001` es el ejemplo recibido.
- Existe además un campo para el número físico de ciclo de la máquina.
- El número físico puede repetirse en el tiempo, pero debe ser único por equipo y año.
- Los dos identificadores se conservan; uno no reemplaza al otro.

El formato exacto del consecutivo interno, sus reinicios y el año aplicable a registros retroactivos deben definirse antes de implementar. El ejemplo no constituye por sí solo una política completa de numeración.

### 5. Órdenes, materiales y cantidades — respuestas 62 y 63

- Un ciclo puede contener varias órdenes y clientes, siempre que la carga quepa en la cámara.
- Una orden puede distribuirse entre varios ciclos, por ejemplo 100 cajas en dos cargas de 50.
- El operario selecciona las órdenes que entran al ciclo; los materiales proceden de sus registros y no se digitan como filas independientes sin origen.
- El sistema descuenta automáticamente los materiales asignados.
- El reproceso crea un ciclo nuevo vinculado al original y conserva el historial del material.

#### Propuesta para concretar la asignación parcial

Seleccionar órdenes y luego las cantidades de cada fila de material que participarán en la carga. Mantener vínculos entre ciclo, orden y material, con cantidades asignadas, procesadas y pendientes, para evitar asignaciones duplicadas.

Interpretar el descuento como consumo o reserva del saldo disponible para asignar, sin borrar la cantidad recibida ni el historial. El momento exacto —reserva, inicio o finalización— y la devolución del saldo ante un aborto aún no están definidos. Un reproceso no debe contarse automáticamente como una segunda entrega del cliente ni como nuevas unidades cumplidas.

Estas son propuestas de trazabilidad, no reglas adicionales ya aprobadas. La compatibilidad entre cargas de distintos clientes, empaques o protocolos debe concretarse con Calidad; disponer de capacidad física no demuestra por sí solo compatibilidad técnica.

### 6. Método contratado — respuesta 64

- Comercial define el método en la cotización según el requerimiento del cliente y compatibilidad del producto.
- Planta no puede cambiar el método contratado.
- Si el material no es compatible, se rechaza o devuelve a Logística.
- Una cotización con varios servicios requiere conservar el método de cada concepto operativo; no se deriva un método único para todos sus materiales por suposición.

La evidencia de compatibilidad y el procedimiento comercial para corregir el servicio contratado aún no se han especificado.

### 7. Parámetros y evidencia — respuesta 65

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

### 8. Protocolos — respuesta 66

- El protocolo depende del método, equipo y tipo de empaque.
- Calidad selecciona y aprueba la versión aplicable; Planta no ejerce esa aprobación.
- Como propuesta de trazabilidad, fijar la referencia a esa versión en el ciclo y conservarla aunque se publique una nueva posteriormente.
- No se debe sustituir silenciosamente el protocolo por la versión más reciente durante una evaluación histórica.

La selección de protocolos para cargas con varios empaques requiere definir compatibilidades o dividir la carga; no se elige arbitrariamente el protocolo del primer material.

### 9. Registros retroactivos — respuesta 67

- No se permiten por defecto.
- Ante una interrupción de red o falta de conexión de la máquina, solo SuperAdmin o Calidad pueden autorizarlos.
- La autorización requiere justificación obligatoria y auditoría.
- Se propone conservar por separado fecha real de ejecución, fecha de captura, responsable del registro y autorizador.

No se ha definido una antigüedad máxima. La autorización retroactiva no se considera automáticamente permiso para operar un equipo no habilitado o eludir el protocolo.

### 10. Fallos, abortos y reprocesos — respuesta 68

- Registrar estados `FALLIDO` o `ABORTADO` y exigir motivo.
- El reproceso genera un ciclo nuevo vinculado al anterior.
- `CIC-2026-001-R1` es el ejemplo de identificación recibido; la política para sucesivos reprocesos queda por concretar junto con los consecutivos.
- Nunca borrar ni sobrescribir el ciclo original fallido.
- Conservar materiales, cantidades, datos y evidencias del intento original, además de los del nuevo intento.

El resultado de un ciclo fallido o abortado no debe confundirse con una liberación conforme. La recuperación de saldos, aprobación de reproceso y destino de material rechazado deben acordarse con Calidad y Logística.

### 11. Procesamiento y liberación — respuesta 69

- La orden se declara `PROCESADA` cuando termina el ciclo y se registran sus parámetros.
- No puede despacharse hasta que Calidad apruebe las evaluaciones y emita el certificado.
- Procesamiento terminado y liberación de Calidad son hitos diferentes.

Para órdenes divididas en varios ciclos, la respuesta no define si el primer ciclo terminado puede cerrar toda la orden. Se propone declarar procesamiento parcial mientras queden cantidades pendientes y `PROCESADA` solo cuando todas las cantidades aplicables hayan completado su procesamiento; esto requiere validación y no se presenta como una respuesta ya recibida.

### 12. Puntos de coordinación con Calidad y Logística

| Punto | Definiciones que deben conciliarse |
| --- | --- |
| Estado de orden | Planta usa `PROCESADA`; Logística usa `PROCESADO`. Representan aquí el hito de procesamiento; el nombre técnico común se definirá al diseñar el flujo. |
| Liberación excepcional | Logística contempla urgencia médica con autorización documentada del Gerente de Calidad. Planta exige aprobación y certificado antes del despacho. Se mantiene la regla ordinaria y se señala que Calidad debe precisar si subsiste aquella excepción y su alcance; no se elimina ni amplía silenciosamente. |
| Lavandería | Tiene liberación propia; falta definir el documento de salida y cómo se relaciona con el control de despacho. |
| Bloqueo de materiales | Logística relaciona el bloqueo con registro del ciclo y entrada a máquina. Debe fijarse el evento exacto junto con las reservas y asignaciones de Planta. |
| Carga multicliente | Debe conservar trazabilidad y límites de visibilidad; un ciclo compartido no autoriza mostrar a un cliente datos de otros. El alcance del certificado se definirá con Calidad. |
| Calibración y retroactividad | Debe distinguirse la habilitación del equipo en la fecha real del proceso de su estado en la fecha de captura, sin inventar un bypass de controles. |

### 13. Alcance documental y continuidad

Solo se registran requisitos y propuestas identificadas. No se modifica código de producción, datos, equipos, protocolos, permisos ni ciclos. Los cuestionarios originales se conservan.

Continúa el [Módulo 6 — Calidad](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), especialmente liberación parcial, evaluación de parámetros, evidencias, reprocesos y posibles excepciones.


<a id="modulo-6"></a>

---

## Módulo 6 — Calidad: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 70 a 81 incorporadas desde el mensaje del usuario. Documento de requisitos; no acredita implementación, validación técnica ni cumplimiento legal.

Referencias: [cuestionario original](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), [Planta](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) y [Logística](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

### 1. Unidad de liberación y excepciones materiales — respuestas 70 y 78

- Calidad evalúa y libera el ciclo completo, que puede contener varias órdenes y lotes.
- Puede aprobar el ciclo general y rechazar materiales o lotes específicos, por ejemplo por empaque roto.
- Deben identificarse los ítems rechazados y conservar trazabilidad de la excepción.
- Una aprobación general no implica liberar los materiales rechazados: su estado y destino deben permanecer distinguibles.

Se propone relacionar cada decisión con las filas de material y cantidades del ciclo. El tratamiento de un rechazo parcial dentro de una misma fila aún no está definido. La agrupación de materiales en certificados se resolverá en el Módulo 7; aprobar un ciclo multicliente no supone emitir un único documento compartido entre clientes.

### 2. Independencia y doble aprobación — respuesta 71

- El operario de Planta que registró el ciclo no puede aprobarlo, aunque tenga también un rol de Calidad.
- La aprobación corresponde a un usuario autorizado con rol de Calidad.
- Las desviaciones críticas y los reprocesos requieren doble aprobación: Analista de Calidad y Jefe/Director de Calidad.
- Ambas aprobaciones deben conservar sus responsables; una persona con varios roles no representa dos aprobadores independientes.

La definición de desviación crítica y el momento de la doble aprobación respecto de la ejecución del reproceso requieren precisión. Las firmas adicionales del Director Técnico descritas más adelante no se consideran satisfechas automáticamente por otro cargo de nombre similar.

### 3. Protocolos y criterios — respuesta 72

- El Jefe de Calidad o Director Técnico define protocolos y criterios de aceptación.
- Dependen del método EtO/Vapor y del tipo de producto/empaque.
- Se almacenan en versiones inmutables.
- La evaluación debe conservar la versión aplicada; publicar otra versión no debe recalificar silenciosamente ciclos históricos.

Planta también define dependencia del equipo en su respuesta 66. Ambos requisitos se conservan: método, equipo y producto/empaque deben considerarse al resolver el protocolo. No se elimina la dimensión equipo por no estar repetida en esta respuesta. No se inventan rangos o criterios numéricos.

### 4. Evaluación híbrida — respuesta 73

- El sistema compara los valores registrados por Planta contra los rangos del protocolo y sugiere el resultado.
- Calidad revisa, valida y firma explícitamente la evaluación.
- Una sugerencia automática de cumplimiento no libera material ni sustituye la aprobación humana.
- El ejemplo de 55 °C dentro de 50–60 °C es ilustrativo; no se adopta como rango universal.

Como propuesta de trazabilidad, conservar por separado medición original, resultado calculado, decisión de Calidad, protocolo y responsables. No modificar la medición real para obtener un resultado favorable.

### 5. No aplica y cambios de resultado — respuesta 74

- Se permite `NO_APLICA` cuando el parámetro no corresponde al método o producto.
- Exige justificación obligatoria; no debe utilizarse para ocultar un resultado pendiente o fallido.
- Modificar un resultado que el sistema marcó como `NO_CUMPLE` exige registrar una Desviación y aprobación del Jefe de Calidad.
- Deben conservarse el resultado calculado y la decisión posterior, sin sobrescribir la evidencia original.

Esta aprobación no sustituye los controles adicionales de liberación cuando el parámetro sea crítico, descritos en la sección 8.

### 6. Evidencias — respuesta 75

Permitir adjuntar resultados de Indicadores Biológicos (BI), Indicadores Químicos (CI), gráficos y CSV exportados de la máquina, y fotografías del material cargado. Planta también contempla PDF exportado de máquina; se mantiene ese requisito.

Se propone vincular cada evidencia al ciclo y, cuando corresponda, al material evaluado, conservando autor y fecha de incorporación. La respuesta exige admitir estas evidencias, pero no establece que todos sus tipos sean obligatorios en todos los métodos. Tamaños, formatos adicionales, conservación y requisitos por protocolo quedan por definir.

### 7. Cuarentena y resultados pendientes — respuesta 76

- El material permanece en `CUARENTENA` mientras espera los resultados aplicables, especialmente el BI.
- Para el BI, Calidad debe registrar resultado negativo antes de la liberación ordinaria.
- El usuario indica 24–48 horas de incubación como contexto operativo; no se convierte ese intervalo en un temporizador universal ni en aprobación automática.
- La liberación condicionada exige autorización formal y documentada del Director Técnico.
- Un resultado no registrado no equivale a negativo. El transcurso del tiempo por sí solo no libera material.

El protocolo debe determinar qué indicadores aplican a cada proceso. La documentación no impone BI a Lavandería por analogía con esterilización. El seguimiento posterior de una liberación condicionada y su documentación de salida aún deben precisarse.

### 8. Fallo crítico y liberación por desviación — respuesta 77

- Si falla un parámetro crítico, bloquear automáticamente la emisión del certificado ordinario.
- La Liberación por Desviación requiere análisis de riesgo y firma del Director Técnico.
- El certificado resultante debe mostrar visiblemente: **Liberado por Desviación**.
- La excepción no transforma la medición fallida en una medición conforme ni elimina el historial de la desviación.
- Si la desviación es crítica, se mantiene además la doble aprobación exigida en la respuesta 71. No se asume que la firma del Director Técnico sustituya cualquiera de esas aprobaciones sin una equivalencia explícitamente definida.

Esta regla no concede a todos los usuarios de Calidad una facultad general de excepción. El catálogo de parámetros críticos pertenece a los protocolos controlados.

### 9. Rechazo, investigación y destino — respuesta 79

Todo rechazo debe generar:

- Motivo.
- Evidencia.
- Apertura de investigación CAPA (Acciones Correctivas y Preventivas).
- Destino del material: devolución al cliente, reproceso o destrucción.

Se propone enlazar la investigación, los materiales afectados y las actuaciones posteriores. Reproceso debe conservar el vínculo con el ciclo original conforme al Módulo 5. Seleccionar destrucción como destino no equivale a ejecutar ni acreditar su realización; responsables, autorizaciones y evidencia de cierre deben definirse. Tampoco se ha fijado si cerrar CAPA es condición previa para liberar otros materiales del ciclo.

### 10. Firma de aprobación — respuesta 80

- Para esta fase se acepta reingresar la contraseña como mecanismo de confirmación.
- Registrar usuario, cargo, fecha y hora exactas e IP de la actuación.
- Aplicar el mecanismo a cada aprobador requerido, preservando su identidad y decisión.
- No almacenar la contraseña dentro del registro de auditoría.

La finalidad expresada es contar con una firma electrónica auditable. Se documenta el mecanismo solicitado sin afirmar que estos datos, por sí solos, acrediten validez jurídica. La validación de requisitos legales y referencias aplicables queda en la pregunta 87 del Módulo 7; esta entrega no realiza un dictamen legal.

### 11. Inmutabilidad y correcciones — respuesta 81

- Una aprobación completada es inmutable.
- Ante un error, anular el certificado, registrar una desviación y emitir uno nuevo con revisión.
- Conservar el original, su aprobación y el vínculo con el sustituto; la anulación no implica borrarlos.
- No sobrescribir valores, evaluaciones o PDF de una aprobación anterior.

Los responsables de anular, numeración de revisiones, notificación al cliente y tratamiento del material ya entregado se precisarán en Certificados. La regla de aprobación de anulaciones comerciales no se traslada automáticamente a certificados.

### 12. Fallo de generación de PDF — respuesta 81

- Si falla la generación del PDF, hacer rollback: la aprobación final no se guarda.
- El usuario debe reintentar.
- No puede quedar material aprobado/liberado sin certificado como consecuencia de una generación fallida.
- El fallo no autoriza a eliminar los datos originales de Planta, evidencias o evaluaciones previamente guardadas.

Para el diseño posterior se propone que el reintento evite duplicar certificados y que cualquier archivo parcial no sea publicado como oficial. El alcance de la reversión sobre firmas preliminares de una doble aprobación y sobre varios certificados de un ciclo debe concretarse; no se da por implementada atomicidad entre almacenamiento de archivos y base de datos.

### 13. Coordinación de excepciones y pendientes

| Tema | Regla recibida y límite pendiente |
| --- | --- |
| Urgencia médica | Logística contempla liberación excepcional por el Gerente de Calidad; este módulo exige Director Técnico para liberación condicionada o por desviación. No se equiparan cargos ni se usa una autorización para eludir la otra. Debe definirse si son vías distintas o si una reemplaza a la anterior. |
| Pendientes frente a fallos críticos | Resultado pendiente admite solo la liberación condicionada formal descrita; fallo crítico exige análisis de riesgo, firma y marca documental. No son la misma excepción. |
| Certificado en liberación condicionada | Debe precisarse qué documento permite la salida y cómo se conserva la obligación de no liberar sin certificado. No se presume un despacho automático sin documento. |
| Material rechazado dentro de ciclo aprobado | Debe excluirse de la autorización de despacho. El Módulo 7 definirá cómo se representa en los documentos sin certificarlo como liberado. |
| Lavandería | Su flujo propio requiere criterios, autoridad y documento de liberación específicos, aún no definidos por estas respuestas centradas en EtO/Vapor. |
| Cargos de aprobación | Jefe, Director, Gerente de Calidad y Director Técnico no se tratan como sinónimos por defecto. |
| Evaluación histórica | Se conserva la versión de protocolo y la decisión original; una corrección formal no recalcula retrospectivamente todos los certificados. |

### 14. Alcance documental y continuidad

Solo se actualiza documentación. No se modifica código, datos, permisos efectivos, protocolos, firmas, evaluaciones ni certificados. Se conservan los ocho cuestionarios y sus 100 preguntas.

Continúa el [Módulo 7 — Certificados](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), con especial atención a certificados por cliente/ciclo, exclusiones de materiales, marcas de desviación, revisiones e inmutabilidad.


<a id="modulo-7"></a>

---

## Módulo 7 — Certificados: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 82 a 91 incorporadas desde el mensaje del usuario. Documento de requisitos; no acredita implementación ni constituye validación jurídica o normativa.

Referencias: [cuestionario original](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), [Calidad](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras), [Planta](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) y [Logística](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

### 1. Unidad de emisión — respuesta 82

- Se emite un certificado por Orden de Servicio.
- Puede reunir materiales de varios ciclos cuando la orden se haya distribuido entre ellos, siempre que todos los ciclos incluidos hayan sido aprobados por Calidad.
- El certificado detalla los materiales e identifica el ciclo al que pertenece cada uno.
- Un ciclo compartido entre clientes no implica un certificado compartido: cada orden conserva su documento.
- Las sustituciones por corrección se vinculan al original conforme a la respuesta 90; no son una autorización para sobrescribirlo.

Calidad permite rechazar materiales específicos dentro de un ciclo aprobado. Estos materiales no deben certificarse como liberados. Debe precisarse si la orden espera su resolución, si el documento los identifica como excluidos o si existe otra salida formal; no se presume autorización para emitir varios certificados parciales de una misma orden.

### 2. Formato oficial — respuesta 83

- Utilizar R-AQ-09 para EtO y Vapor, con las tablas técnicas correspondientes a cada método.
- Respetar campos, textos legales y estructura de los archivos de referencia aprobados.
- Conservar código y versión del formato utilizado en cada emisión.
- La referencia aprobada y el procedimiento para aceptar cambios se definirán en el Módulo 8.

Una orden puede incluir varios servicios según Comercial. La respuesta no establece cómo presentar en un mismo certificado ciclos de métodos distintos ni si se permiten esas combinaciones. Tampoco asigna R-AQ-09 a Lavandería o Insumos por defecto.

### 3. Vigencia y conservación de esterilidad — respuestas 84 y 85

- Tres años como vigencia global predeterminada.
- El sistema debe permitir parametrizar vigencias por familia de producto si en el futuro se requieren excepciones por degradación del empaque.
- El Jefe de Calidad autoriza esas excepciones.
- La fecha de vencimiento representa conservación de esterilidad bajo condiciones específicas de almacenamiento; no se presenta simplemente como fecha de caducidad del archivo PDF.
- Incluir literalmente en el pie de página: «Mantener en lugar seco, a temperatura ambiente y protegido de la luz solar directa».

Se propone conservar en el snapshot la regla de vigencia, su autorización y las fechas aplicadas, evitando que un cambio posterior modifique certificados emitidos.

No se ha definido cómo resumir una sola fecha de esterilización y vencimiento cuando el certificado reúne ciclos de distintas fechas o familias con plazos diferentes. No se toma automáticamente la fecha mayor ni se extiende la vigencia de materiales anteriores. Esta decisión afecta también la consulta pública por QR.

### 4. Consecutivos — respuesta 86

- Numeración global y secuencial, compartida por EtO y Vapor.
- La nueva secuencia inicia en `001` y puede crecer hasta `99999999`.
- Los históricos conservan su número original, incluido el ejemplo `55388`.
- Los nuevos certificados siguen el nuevo formato; no se renumeran históricos.

La interpretación de presentación propuesta es un mínimo de tres cifras, ampliándose al crecer la secuencia; no se impone un relleno de ocho cifras que el usuario no solicitó.

Debe definirse cómo evitar o distinguir colisiones cuando la nueva secuencia alcance números históricos. Tampoco se ha fijado qué ocurre al agotar el máximo ni si se permiten saltos por emisiones fallidas. Esta fase no reinicia contadores ni consulta o modifica la base de datos.

### 5. Responsables y firmas — respuesta 87

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

### 6. Cuadro de estampado y QR — respuesta 88

- El cuadro inferior derecho queda completamente en blanco para el sello físico: sin imagen, QR, texto ni marcador en su interior.
- Ubicar el QR de validación en la cabecera, esquina superior derecha, junto al consecutivo.
- Mantener el cuadro y su posición según la referencia oficial. No se han proporcionado dimensiones numéricas.
- Las firmas y la marca de desviación no deben ocupar el interior reservado para estampado.

### 7. Consulta pública — respuesta 89

El QR abre una página web segura con únicamente la información pública autorizada:

- Estado: Vigente, Vencido o Anulado.
- Cliente.
- Consecutivo.
- Fecha de esterilización.
- Fecha de vencimiento.

No mostrar precios, detalle de materiales ni datos internos de Planta. La restricción debe aplicarse también a los datos entregados a la página, no solo a los campos visibles.

Como propuesta técnica, conservar una referencia pública no predecible para validar el documento. No se define aquí un nuevo mecanismo de autenticación del cliente ni se permite descargar expedientes internos mediante el QR.

El estado Anulado debe mostrarse aunque además haya vencido. El significado de Cliente —por ejemplo razón social visible— y la presentación de fechas de certificados multiciclo deben concretarse sin ampliar silenciosamente los datos públicos.

### 8. Anulación y reemplazo — respuesta 90

- Nunca borrar el certificado.
- Cambiar su estado a `ANULADO`, registrando motivo.
- Para corregirlo, emitir uno nuevo y vincularlo con el original.
- El QR del anulado debe mostrar una alerta roja: «DOCUMENTO ANULADO - Ver nuevo certificado».
- Mantener el QR del original operativo para que comunique la anulación; no redirigirlo silenciosamente como si siempre hubiera identificado al sustituto.

La anulación modifica el estado de validación y su auditoría, no los bytes ni datos firmados del documento histórico. Si aún no existe sustituto, se propone mostrar la anulación sin un enlace inexistente; al emitirse, habilitar el vínculo correspondiente. El acceso al sustituto debe respetar los límites de información pública.

Calidad exige además registrar una desviación para corregir una aprobación. Se mantiene ese requisito. El autorizador de anulación y la política de notificación a clientes no quedaron definidos en esta respuesta.

### 9. Conservación y reconstrucción — respuesta 91

- Conservar PDF, datos, evidencias y versiones durante un mínimo de cinco años.
- El usuario atribuye este plazo a normativa de dispositivos médicos. Se registra como requisito de conservación solicitado; su fundamento normativo específico no fue aportado ni verificado en esta entrega.
- No se interpreta el mínimo como una orden de eliminación automática al cumplirse cinco años. Debe fijarse desde qué evento se cuenta y cómo se manejan obligaciones adicionales de conservación.
- Si se pierde el PDF y se reconstruye desde el snapshot, el nuevo archivo debe llevar una marca visible: **COPIA RESTAURADA**.
- Registrar la restauración en auditoría.

Se propone conservar la referencia y hash del original, asignar una identidad de archivo y hash propios a la copia restaurada y registrar autor, fecha, motivo y fuente de reconstrucción. La marca cambia los bytes: no se debe afirmar que la copia conserva el hash del PDF perdido.

La reconstrucción no debe usar datos actuales de cliente, protocolo, firmas o sellos para reemplazar los del snapshot. Si faltan recursos históricos o evidencia suficiente, no se inventa una reproducción exacta. Restaurar una copia tampoco debe reactivar un certificado anulado.

### 10. Coherencia con Calidad y Planta

| Tema | Definiciones y precisión pendiente |
| --- | --- |
| Aprobación por ciclo frente a certificado por orden | Calidad libera ciclos y exige rollback de aprobación si falla el PDF; aquí el certificado reúne ciclos de una orden. Debe separarse o coordinarse evaluación de ciclos y aprobación final de emisión para evitar exigir un certificado completo cuando aún faltan ciclos de la orden. No se elimina silenciosamente la regla de rollback. |
| Tres actuaciones | El certificado exige Elaborado, Verificado y Aprobado; Calidad contemplaba doble aprobación para desviaciones críticas/reprocesos. Estas actuaciones documentales no sustituyen por defecto las autorizaciones especiales. |
| Liberación por desviación | Se conserva la marca visible «Liberado por Desviación» requerida por Calidad, ubicada fuera del cuadro blanco. Su encaje en R-AQ-09 debe aprobarse dentro del control de formatos. |
| PDF fallido | No publicar un certificado incompleto ni liberar material por una emisión fallida. El alcance transaccional para órdenes con varios ciclos necesita definición conjunta. |
| Métodos y familias mezclados | Tablas técnicas, fechas, vigencias y firmantes deben representar todas las contribuciones sin atribuciones inventadas. |
| Referencia exacta y cambios de presentación | QR en cabecera, marcas de restauración/desviación y filas por ciclo pueden requerir una versión documental controlada; el Módulo 8 resolverá su aprobación. |

### 11. Alcance y siguiente módulo

Solo se documentan requisitos y propuestas identificadas. No se modifica código, datos, consecutivos, PDF, estados, firmas ni permisos. Se conservan los cuestionarios originales.

Continúa el [Módulo 8 — Formatos y Sellos](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), último bloque del interrogatorio.


<a id="modulo-8"></a>

---

## Módulo 8 — Formatos y Sellos: reglas de negocio

Actualización: 9 de noviembre de 2026.

Estado: respuestas oficiales 92 a 100 incorporadas desde el mensaje del usuario. Cierra la recopilación por módulos. No acredita implementación, conformidad normativa ni resolución de todas las dependencias entre módulos.

Referencias: [cuestionario original](./REQUISITOS_Y_REGLAS.md#doc-negocio-cuestionarios-origen), [Certificados](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras), [Calidad](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras) y [Cotizaciones](./REQUISITOS_Y_REGLAS.md#doc-negocio-reglas-maestras).

### 1. Responsabilidades documentales — respuesta 92

| Actuación | Responsable |
| --- | --- |
| Propiedad del formato | Jefe de Calidad. |
| Redacción y revisión | Analista de Calidad; ambas pueden recaer en esa función. |
| Aprobación final documental | Director Técnico o Gerente General. |
| Publicación y retiro en el sistema | Calidad. |
| Aceptación final de pruebas | Jefe de Calidad, según respuesta 100. |

La aprobación documental y la aceptación de pruebas son hitos distintos, no autorizaciones contradictorias. No se presume que cualquier usuario de Calidad pueda ejercer todos los permisos. La acumulación de funciones en una misma persona y los permisos concretos deben reflejar la separación acordada al diseñar la matriz.

### 2. Fuente oficial — respuesta 93

- El sistema, mediante sus versiones y hashes congelados en base de datos, es la fuente oficial.
- El Word/PDF controlado tiene función de respaldo físico documental.
- Ante discrepancias, prevalece la versión controlada del sistema.
- Esto no convierte cualquier configuración mutable o archivo recién importado en una versión aprobada: se mantiene el circuito de aprobación y publicación.

Los archivos de referencia siguen siendo evidencia de entrada y de comparación. Las diferencias deben registrarse y resolverse mediante control de cambios; no se borran ni alteran respaldos para ocultarlas. La política no sustituye la necesidad de respaldar y recuperar la base de datos y los recursos documentales.

### 3. Versionado estricto — respuesta 94

- Cualquier cambio exige una nueva versión: textos, campos, cálculos, diseño, logotipos y correcciones tipográficas.
- Se admite una identificación como V4.1 para un ajuste menor; el ejemplo no define todavía toda la gramática de versiones.
- No editar una versión utilizada para cambiar documentos emitidos.
- Conservar la historia y el vínculo entre versiones, con sus aprobaciones y recursos.

Si el cambio afecta al renderizador o al cálculo, versionar solo el texto de la plantilla no basta para reproducir la emisión: la implementación deberá conservar las dependencias efectivamente utilizadas. Es una consecuencia de diseño, no una implementación realizada en esta fase.

### 4. Aprobación y entrada en vigor — respuesta 95

- Registrar por separado fecha de aprobación y fecha de entrada en vigor.
- Permitir publicación programada a futuro.
- Una versión aprobada para el futuro no afecta a las emisiones actuales antes de su vigencia.
- Conservar la versión válida para el instante de emisión y fijarla en el documento.

La zona horaria de activación, tratamiento de emisiones concurrentes y manejo de borradores preparados con una versión anterior deben precisarse al diseñar el flujo. No se presume que aprobar una versión equivalga a activarla inmediatamente.

### 5. Resolución y excepciones — respuesta 96

Prioridad de selección: **Cliente específico > Servicio específico > General**.

- Calidad puede autorizar una Excepción de Versión para un cliente cuyo contrato exige usar una versión anterior.
- Conservar el vínculo con el cliente, versión y autorización; se propone registrar también contrato, motivo, responsable y período aplicable.
- La excepción no modifica la versión histórica ni autoriza reutilizar una licencia de sello suspendida.

Debe concretarse cómo se representa una versión anterior autorizada frente a la exigencia de vigencia de la respuesta 97. No se equipara «anterior» a «retirada utilizable» ni se permite una excepción sin registro.

No se definieron prioridades adicionales por idioma o sede. Para cotizaciones con varios servicios debe resolverse el formato aplicable sin seleccionar arbitrariamente el primer servicio ni aplicar una plantilla incompatible.

### 6. Bloqueo de emisión — respuesta 97

- Bloquear la emisión si falta un formato o sello vigente requerido.
- Mostrar un error crítico comprensible y no permitir continuar con una emisión incompleta.
- No usar una versión alternativa, un sello estático o una imagen predeterminada como sustitución silenciosa.
- Un fallo no debe producir un documento oficial parcialmente generado ni una liberación operativa sin el certificado requerido.

El usuario justifica el bloqueo como exigencia legal y señala que el sistema ya lo realiza. Aquí se registra la política de negocio; no se ha verificado su fundamento normativo ni la cobertura efectiva del bloqueo en el código. No se presenta esa afirmación como dictamen jurídico o resultado de pruebas.

La Excepción de Versión de la sección 5 requiere una resolución explícita compatible con este bloqueo; no se interpreta como autorización general para omitirlo.

### 7. Normas, licencias y sellos — respuesta 98

- Calidad administra normas y licencias de sellos, por ejemplo ICONTEC.
- Generar alertas 30 días antes del vencimiento de la licencia.
- Si una licencia se suspende, bloquear automáticamente su uso en nuevas emisiones.
- Una licencia vencida no satisface la vigencia exigida para emitir.
- El cambio de estado de una licencia no reescribe imágenes ni bytes de documentos ya emitidos.

La alerta forma parte del requisito futuro del producto; no se crea una automatización externa durante esta fase. Destinatarios, canal, repetición y conducta para licencias cargadas cuando faltan menos de 30 días deben concretarse. Los cambios de alcance de licencia tampoco quedaron desarrollados en la respuesta.

La política sobre notificación o eventual anulación de documentos afectados por una suspensión posterior debe definirse por separado; inmutabilidad del archivo no equivale a afirmar que su estado público de validez nunca cambia.

### 8. Inmutabilidad y condiciones comerciales — respuesta 99

- Cambiar un formato o sello nunca altera documentos emitidos.
- El snapshot debe conservar las referencias y los datos documentales de la emisión.
- Los seis campos de condiciones comerciales se incorporan mediante una nueva versión del formato.
- Mantener los rótulos exactos acordados en Cotizaciones y sus valores independientes.
- No distribuir automáticamente textos históricos entre campos nuevos ni regenerar PDFs anteriores con la nueva presentación.

La protección debe incluir recursos utilizados, versión del formato, sellos e identidades congeladas. No se supone que guardar únicamente un ID a un recurso mutable garantice la inmutabilidad.

### 9. Aceptación y pruebas — respuesta 100

La aceptación final corresponde al Jefe de Calidad. Las pruebas solicitadas incluyen:

- Textos largos sin cortes ni pérdida de contenido.
- Saltos de página automáticos.
- Cotizaciones en COP y USD.
- Verificación de históricos intactos después de cambiar formatos o sellos.

Se propone conservar el resultado y la versión evaluada, casos utilizados, responsable, fecha y hallazgos. Comparar datos y hashes de históricos antes y después permite comprobar conservación; no basta una inspección visual superficial.

La respuesta no confirma pruebas de impresión física o de otros idiomas. Permanecen como posibles ampliaciones, no como aceptación ya realizada. Ninguna de las pruebas funcionales aquí descritas se ejecutó durante esta actualización documental.

### 10. Cierre documental y dependencias

Las respuestas de los ocho módulos están incorporadas. La recopilación queda cerrada; continúan identificadas las decisiones no respondidas, propuestas del analista y conflictos entre módulos.

Antes de implementar el control documental deben conciliarse especialmente:

- Excepción de versión anterior frente a bloqueo por falta de vigencia.
- Plantilla para cotizaciones con varios servicios.
- Aprobación documental por Director Técnico/Gerente General frente a aceptación de pruebas por Jefe de Calidad.
- Formato oficial controlado frente a las nuevas tablas multiciclo, marcas de desviación/restauración y QR en cabecera exigidos en Certificados.
- Mecanismo de firma solicitado y permisos específicos de cada responsable.

No se modifica código de producción, datos, plantillas operativas, licencias, permisos ni PDFs. No se publican versiones ni se activa la refactorización con esta entrega.

<a id="doc-requisitos-backend-auditoria-rf-aud-001-consulta-auditoria"></a>

**Origen:** docs/requisitos/backend/auditoria/RF-AUD-001-consulta-auditoria.md

---
id: RF-AUD-001
titulo: Consultar operaciones, responsables y cambios registrados
tipo: RF
modulo: Auditoría
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/auditoria/; src/rbac/; src/users/; src/rbac/ambitos/"
depende_de: [RF-AUD-003]
bloquea: [RF-AUD-004]
brechas: [B-AUD-002]
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-AUD-001 se deriva a RF-AUD-004; el contraste frontend posterior identificó B-AUD-002 por incompatibilidad entre la respuesta paginada y el consumidor UI."
---

## RF-AUD-001 — Consultar operaciones, responsables y cambios registrados

**Fuente principal:** `Sterinova-ERP.md` §3, Auditoría: consultar responsable, registro, valores anteriores/nuevos, motivos y operaciones.

**Fuentes de contraste:** entidad, controlador, DTO y servicio de auditoría; página `SterinovaFrontend/src/app/(erp)/auditoria/page.tsx` y tipo frontend de eventos.

1. **ID:** `RF-AUD-001`.
2. **Título:** Consultar operaciones, responsables y cambios registrados.
3. **Tipo:** RF.
4. **Módulo:** Auditoría.
5. **Descripción funcional:** Consultar registros con responsable, entidad afectada, acción, fecha, motivo y cambios anteriores/nuevos.
6. **Reglas asociadas:** Respetar permiso/ámbito del consultante; preservar trazabilidad y no registrar secretos; proveer filtros y paginación.
7. **Actores y permisos:** `auditoria.ver`, sujeto a contexto de ámbito RBAC.
8. **Datos y entidades:** Auditoria persiste usuario, entidad, ID afectado, acción, detalle JSON, scope y fecha.
9. **Flujo:** `GET /auditoria` recibe filtros, consulta paginada y devuelve data/total/página.
10. **Criterios de aceptación:** Filtrar por usuario, fechas y entidad; limitar por scope; exponer responsable, operación y before/after cuando aplique.
11. **Evidencia backend/frontend:** `AuditoriaController`/`QueryAuditoriaDto` soportan filtros y paginación; `AuditoriaService.findAll` devuelve `{ data, total, page, limit, totalPages }`. La página frontend tipa la respuesta como arreglo, guarda el objeto completo en el estado y luego invoca `filter`, por lo que el contrato actual no coincide y la vista puede fallar al renderizar. La UI no envía filtros de usuario/fecha ni página.
12. **Persistencia y alcance:** `detalle` permite payload flexible; algunos flujos guardan `before`/`after`, otros solo nuevos datos o no registran evento, por lo que la comparación no es uniforme.
13. **Brechas:** `B-AUD-001` se deriva a `RF-AUD-004` para estandarizar payload anterior/nuevo. `B-AUD-002` registra la incompatibilidad entre el sobre paginado del API y el tipo/uso de respuesta en UI, además de la falta de controles de paginación y filtros disponibles en la pantalla.
14. **Preguntas abiertas:** Acordar schema estándar y campos que deben excluirse/enmascararse; RF-AUD-004.
15. **Estado de cobertura:** Parcial. La API implementa consulta filtrada y paginada, pero la UI no consume el contrato paginado como está definido; before/after tampoco es consistente entre operaciones.
16. **Certeza y límites:** Confirmado en controlador, DTO, servicio y página frontend inspeccionados. La incompatibilidad se determinó estáticamente; no se ejecutó la pantalla ni una prueba de integración en esta revisión.

<a id="doc-requisitos-backend-auditoria-rf-aud-002-atomicidad-auditoria"></a>

**Origen:** docs/requisitos/backend/auditoria/RF-AUD-002-atomicidad-auditoria.md

---
id: RF-AUD-002
titulo: Atomicidad en registros de auditoría
tipo: RNF / Auditoría
modulo: Auditoría transversal
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §5"
fuente_contraste: "src/auditoria/auditoria.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/cotizaciones.service.ts"
depende_de: []
bloquea: []
brechas: [B-008-02]
historial:
  - version: 0.1
    nota: "Borrador transversal derivado de la resolución de anulaciones; debe analizarse si la atomicidad aplica de forma uniforme a todos los dominios."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-AUD-002 — Atomicidad en registros de auditoría

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-AUD-002`.
2. **Título:** Atomicidad en registros de auditoría.
3. **Tipo:** RNF / Auditoría.
4. **Módulo:** Auditoría transversal.
5. **Descripción funcional:** Cuando una operación de negocio y su evento de auditoría deban representar una misma decisión, el sistema debe persistir ambos dentro de la misma transacción de base de datos, de modo que el commit o rollback deje sus estados coherentes.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Alcance de atomicidad por tipo de evento; propagación obligatoria del `EntityManager`; operaciones que cruzan almacenamiento externo; estrategia ante fallo del canal de auditoría; correlación e idempotencia; conservación de auditoría cuando se requiere rollback del negocio; impacto y reconciliación de eventos históricos.
7. **Actores / permisos:** Usuarios autorizados del dominio Auditoría transversal; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una operación transaccional auditada, cuando negocio y auditoría se guardan, entonces ambos se confirman juntos.<br>- Dada una falla antes del commit, cuando la transacción revierte, entonces no queda un evento que afirme que la acción se completó.<br>- Dado un evento de auditoría requerido, cuando no se puede persistir de forma consistente, entonces la operación sigue la política de fallo definida, sin producir un estado engañoso.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §5. Contraste: src/auditoria/auditoria.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/cotizaciones.service.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 y §5 contempla auditoría y trazabilidad de operaciones.
- `AuditoriaService.create` acepta un `EntityManager` opcional; si no se pasa, usa el repositorio inyectado directamente.
- `SolicitudAnulacionService.resolverSolicitud` transacciona el cambio de estado de cotización y la resolución, pero crea el evento `ANULAR` sin pasar el `EntityManager` de la transacción.
- Si posteriormente falla el guardado de la solicitud, la cotización puede revertirse mientras el evento de auditoría ya quedó persistido por separado.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-008-02]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Alcance de atomicidad por tipo de evento; propagación obligatoria del `EntityManager`; operaciones que cruzan almacenamiento externo; estrategia ante fallo del canal de auditoría; correlación e idempotencia; conservación de auditoría cuando se requiere rollback del negocio; impacto y reconciliación de eventos históricos.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-auditoria-rf-aud-003-auditoria-usuarios"></a>

**Origen:** docs/requisitos/backend/auditoria/RF-AUD-003-auditoria-usuarios.md

---
id: RF-AUD-003
titulo: Implementar auditoría explícita en cambios de estado de usuarios y RBAC
tipo: RNF
modulo: Auditoría / Usuarios / RBAC
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/users/users.service.ts; src/users/user-roles.service.ts; src/rbac/ambitos/ambito.service.ts; src/auditoria/"
depende_de: [RF-USR-001, RF-USR-002]
bloquea: []
brechas: [B-USR-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-USR-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos. La evidencia distingue la falta de auditoría explícita en cambio de estado de usuario de los registros existentes, pero no uniformes, en RBAC."
---

## RF-AUD-003 — Implementar auditoría explícita en cambios de estado de usuarios y RBAC

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-AUD-003`.
2. **Título:** Implementar auditoría explícita en cambios de estado de usuarios y RBAC.
3. **Tipo:** RNF.
4. **Módulo:** Usuarios, RBAC y Auditoría.
5. **Descripción funcional:** Registrar de forma atómica el actor, usuario afectado, operación, fecha/hora, ámbito y valores anteriores/nuevos al activar o desactivar usuarios y al modificar asignaciones y ámbitos RBAC. El alcance de cambios en el catálogo de roles/permisos debe coordinarse con `RF-USR-004`.
6. **Reglas asociadas:** El evento debe persistir en la misma transacción que el cambio; preservar el dato previo y posterior; no guardar contraseñas, tokens ni secretos; la auditoría complementa y no sustituye el historial de asignaciones.
7. **Actores / permisos:** Cambios de identidad bajo `usuarios.identidad.gestionar`; asignaciones bajo `asignaciones.gestionar`; cambios de ámbitos bajo `ambitos.gestionar`. El evento debe identificar al usuario autenticado que ejecutó la operación.
8. **Datos y entidades:** `auditoria` (`usuario_id`, `entidad`, `entidad_id`, `accion`, `detalle` JSON, `scope_id`, `created_at`), `usuarios.activo`, asignaciones usuario–rol–ámbito y ámbitos RBAC.
9. **Flujo:** Capturar estado previo → autorizar el cambio → persistir cambio y evento de auditoría con estado posterior en una misma transacción → devolver resultado sin exponer secretos.
10. **Criterios de aceptación preliminares:** Todo cambio de estado de usuario genera evento con actor y before/after; los cambios RBAC relevantes conservan contexto equivalente; fallo al guardar auditoría revierte también la modificación; eventos no contienen credenciales.
11. **Evidencia en backend:** `UsersService.setActive` actualiza `activo` dentro de transacción, pero no invoca `AuditoriaService`. La asignación de roles usa `rbac_set_user_roles`, cuya migración escribe `before` y `after`; `AmbitoService` crea/actualiza ámbitos y registra eventos en la misma transacción. Por tanto, la cobertura de RBAC es mixta y el faltante `B-USR-001` se refiere específicamente al cambio de estado de usuario.
12. **Persistencia e interfaz:** La tabla de auditoría admite detalle JSON y ámbito; las operaciones administrativas se exponen en `UsersController`, `UserRolesController` y `AmbitoService`. No se confirmó una pantalla específica para inspeccionar cada before/after de estas mutaciones.
13. **Brecha asociada:** `B-USR-001` permanece abierta para auditoría explícita del cambio `usuarios.activo`; la uniformidad del payload se mantiene en `B-AUD-001`/`RF-AUD-004` y la atomicidad transversal en `RF-AUD-002`.
14. **Preguntas abiertas:** Definir si cambios de permisos/catálogo dinámico forman parte de este alcance o de `RF-USR-004`; precisar los campos de motivo y la representación estable de los snapshots JSON.
15. **Estado de cobertura preliminar:** Parcial: la tabla de auditoría y algunos eventos RBAC existen; el cambio de estado de usuario carece de evento y el esquema de detalle no es uniforme.
16. **Certeza y límites:** Los hallazgos se basan en los servicios de Usuarios/RBAC y entidad/servicio de Auditoría. No se verificó una base desplegada ni la configuración actual de procedimientos en producción; esta ficha sigue en borrador.

<a id="doc-requisitos-backend-auditoria-rf-aud-004-payload-auditoria"></a>

**Origen:** docs/requisitos/backend/auditoria/RF-AUD-004-payload-auditoria.md

---
id: RF-AUD-004
titulo: Estandarización de payload before/after en auditoría
tipo: RF
modulo: Auditoría
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; RF-AUD-001"
fuente_contraste: "src/auditoria/auditoria.entity.ts; src/auditoria/auditoria.service.ts; llamadores de auditoría"
depende_de: [RF-AUD-001, RF-AUD-002]
bloquea: []
brechas: [B-AUD-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-AUD-001; relacionado con atomicidad de RF-AUD-002."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos, preservando la distinción entre payload uniforme y atomicidad transaccional."
---

## RF-AUD-004 — Estandarización de payload before/after en auditoría

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-AUD-004`.
2. **Título:** Estandarización de payload before/after en auditoría.
3. **Tipo:** RF.
4. **Módulo:** Auditoría y módulos que generan eventos.
5. **Descripción funcional:** Aplicar un contrato uniforme a eventos de creación, edición, cambio de estado, asignación/revocación, aprobación y anulaciones, con estado anterior y posterior cuando corresponda.
6. **Reglas asociadas:** Identificar actor, acción, entidad/registro, fecha/hora y ámbito; distinguir creación sin estado previo y borrado lógico sin perder el estado anterior; excluir o enmascarar credenciales y otros secretos. La atomicidad se especifica en `RF-AUD-002`.
7. **Actores / permisos:** Actores son los usuarios autenticados que ejecutan operaciones de negocio; lectura y consulta de auditoría siguen `auditoria.ver` y los ámbitos RBAC.
8. **Datos y entidades:** La entidad `Auditoria` contiene `usuario_id`, `entidad`, `entidad_id`, `accion`, `detalle` JSON, `scope_id` y `created_at`; no declara columnas tipadas `before` y `after`.
9. **Flujo:** Cada servicio construye el evento mediante un contrato común → valida/filtra campos sensibles → persiste el detalle en el mismo manager transaccional si participa en una mutación → expone la evidencia por consulta autorizada.
10. **Criterios de aceptación preliminares:** Eventos comparables usan las mismas claves y semántica; creación, edición, cambios de estado y asignación conservan la información adecuada; payload sensible se excluye/enmascara; lectores pueden interpretar eventos históricos según una estrategia de compatibilidad aún por definir.
11. **Evidencia en backend:** `AuditoriaService.create` acepta un `detalle` JSON genérico. La migración `UnifyUserRoleAssignments` escribe `before` y `after` en una llamada SQL, mientras algunos servicios registran solo los campos enviados o valores posteriores; el patrón no es uniforme.
12. **Persistencia e interfaz:** El esquema JSON permite formas distintas y la API de consulta pagina eventos; la ficha no prescribe columnas relacionales ni cambios específicos de interfaz, que dependen del contrato aprobado.
13. **Brecha asociada:** `B-AUD-001` está abierta por falta de esquema uniforme; `RF-AUD-002` aborda que el evento use el contexto transaccional, problema relacionado pero distinto.
14. **Preguntas abiertas:** Definir estructura del objeto, representación de nulos y listas, tratamiento de datos sensibles, versionado del esquema y compatibilidad con eventos históricos.
15. **Estado de cobertura preliminar:** Parcial: existe persistencia y algunos eventos before/after, sin un contrato uniforme para todos los llamadores.
16. **Certeza y límites:** Confirmado por la entidad/servicio de auditoría y ejemplos de llamadores/migración citados. No se inventarió exhaustivamente cada productor ni se evaluó una base productiva; sigue en borrador.

<a id="doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-001-evaluacion-ciclos.md

---
id: RF-CAL-001
titulo: Evaluar ciclos según parámetros y protocolos
tipo: RF
modulo: Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 72–74; src/calidad/; src/certificados/; frontend app/(erp)/calidad/"
depende_de: [RF-PLA-004]
bloquea: [RF-CAL-005]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CAL-001 se deriva a RF-CAL-005 para exponer la sugerencia automática en la UI."
---

## RF-CAL-001 — Evaluar ciclos según parámetros y protocolos

**Fuente principal:** `Sterinova-ERP.md` §3 (Calidad: revisión de parámetros, protocolos y evaluación de resultados) y §6 (Calidad debe aprobar antes del despacho).

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 72–74; `src/calidad/`, `src/certificados/` y pantalla frontend de revisión de Calidad.

1. **ID:** `RF-CAL-001`.
2. **Título:** Evaluar ciclos según parámetros y protocolos.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Calidad revisa los parámetros medidos en el ciclo conforme a la versión aplicable del protocolo y registra su decisión explícita. La comparación automatizada apoya la evaluación, pero no libera materiales ni sustituye la aprobación humana.
6. **Reglas asociadas:** Aplicar protocolo versionado; comparar mediciones contra rangos; conservar medición y criterio; no aprobar si falta una evaluación aplicable o el valor no cumple. `NO_APLICA` requiere justificación según la regla de negocio, derivada a RF-PLA-013.
7. **Actores y permisos:** Usuario autorizado con `calidad.ciclos.ver` consulta; usuario con `calidad.aprobar` o `calidad.rechazar` evalúa. El operador que ejecutó el ciclo no puede aprobarlo.
8. **Datos y entidades:** `CicloEsterilizacion` guarda mediciones, estado, método, `protocolo_version_id`, revisor y fecha; `ProtocoloEsterilizacionVersion` conserva especificaciones versionadas; `CicloParametroEvaluacion` guarda parámetro, criterio, evaluador y fecha.
9. **Flujo:** El ciclo pasa a `PENDIENTE_CALIDAD`; Calidad lo revisa y envía criterios/opciones. En aprobación, el backend valida las mediciones contra rangos y genera el certificado; después cambia el estado a `APROBADO`. En rechazo se registra motivo y estado `RECHAZADO`.
10. **Criterios de aceptación:** No revisar ciclos fuera de estado pendiente; utilizar la versión vinculada; no aprobar sin todas las evaluaciones aplicables, mediciones finitas y rangos cumplidos; impedir autoaprobación; conservar identidad/fecha de aprobación; no permitir que el cálculo automático libere por sí solo.
11. **Evidencia en backend:** `CalidadController` expone pendientes, consulta, aprobar y rechazar; `CalidadService.aprobar` verifica contraseña, independencia, estado y transacción. `prepararInformacionTecnica` contrasta las mediciones y opciones del protocolo antes de generar el certificado.
12. **Evidencia de persistencia e interfaz:** Los datos estructurados del ciclo, evaluaciones y protocolo versionado persisten en entidades relacionadas. La pantalla `calidad/revisar/[ciclo_id]` requiere selección manual por Calidad y contraseña; no muestra el resultado calculado como sugerencia previa.
13. **Brechas derivadas:** `B-CAL-001` se asigna a `RF-CAL-005`: mostrar en UI la sugerencia automática de cumplimiento antes de la decisión. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Confirmar diseño visual y nivel de detalle de la sugerencia (por parámetro y total), y cómo presentar resultados fuera de rango sin inducir a sobrescritura. La justificación de `NO_APLICA` permanece en RF-PLA-013.
15. **Estado de cobertura:** Parcial. La validación de rangos ocurre automáticamente durante la aprobación y Calidad decide manualmente; falta exponer la sugerencia anticipada en la interfaz.
16. **Certeza y límites:** Confirmado en controladores, DTOs, servicio, generador de información técnica y frontend inspeccionados; no se ejecutaron pruebas ni se verificó una base desplegada.

<a id="doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-002-aprobacion-materiales.md

---
id: RF-CAL-002
titulo: Aprobar, rechazar o retener materiales
tipo: RF
modulo: Calidad / Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 70, 76–79; src/calidad/; src/planta/; src/logistica/"
depende_de: [RF-CAL-001, RF-LOG-005]
bloquea: [RF-CAL-006, RA-CAL-001, RF-CAL-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CAL-002 se deriva a RF-CAL-006 y RA-CAL-001; B-CAL-003 a RF-CAL-007."
---

## RF-CAL-002 — Aprobar, rechazar o retener materiales

**Fuente principal:** `Sterinova-ERP.md` §3 (aprobación/rechazo, cuarentena y evidencias) y §6 (Calidad aprueba antes del despacho).

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 70, 76–79; servicios y entidades de Calidad, Planta y Logística.

1. **ID:** `RF-CAL-002`.
2. **Título:** Aprobar, rechazar o retener materiales.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Logística.
5. **Descripción funcional:** Calidad registra aprobación o rechazo de ciclos y materiales; mantiene en cuarentena lo pendiente de resultados aplicables, identifica unidades rechazadas y determina su disposición sin permitir despacho ordinario antes de la liberación.
6. **Reglas asociadas:** No equiparar ciclo procesado con liberación. El rechazo debe tener motivo y evidencia, iniciar investigación CAPA y definir destino (devolución, reproceso o destrucción); material rechazado no se certifica como liberado. Excepciones requieren autorización documentada según política aplicable.
7. **Actores y permisos:** Calidad con `calidad.aprobar`/`calidad.rechazar`; Logística ejecuta despacho bajo las restricciones de liberación y certificación.
8. **Datos y entidades:** `CicloEsterilizacion` soporta estados de ciclo, revisor, fecha y motivo de rechazo. No se identificó estado `CUARENTENA`/`RETENIDO` ni entidad para decisión, cantidad y destino de material individual.
9. **Flujo:** La revisión actual aprueba o rechaza el ciclo completo. Una orden puede marcarse `PROCESADO` al completarse ciclos; para órdenes con método, la transición logística a `ENTREGADO` comprueba que todos los ciclos estén aprobados y certificados.
10. **Criterios de aceptación:** Mantener estados distinguibles de cuarentena/liberado/rechazado por unidad o lote; exigir motivo; registrar destino y evidencia; bloquear despacho ordinario a material no liberado; exigir ciclo aprobado y certificado, con manejo explícito de excepciones autorizadas.
11. **Evidencia en backend:** `CalidadService.rechazar` guarda `RECHAZADO`, revisor, fecha y motivo. `LogisticaService.updateEstado` exige ciclos aprobados y certificados antes de `ENTREGADO` si la orden tiene método de esterilización.
12. **Evidencia de persistencia e interfaz:** El enum solo tiene `EN_PROCESO`, `PENDIENTE_CALIDAD`, `APROBADO`, `RECHAZADO`. El DTO de rechazo recibe motivo y evaluaciones, sin disposición material/CAPA; no hay endpoint de retención por material.
13. **Brechas derivadas:** `B-CAL-002` deriva a `RF-CAL-006` (estado de cuarentena y rechazo por material/lote) y `RA-CAL-001` (políticas de cuarentena y destino); `B-CAL-003` deriva a `RF-CAL-007` para asegurar validación también en órdenes sin método. La ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Definir unidad de cuarentena (ciclo/material/cantidad), liberación parcial, evidencias y autorizaciones por destino. Se plantean en `RA-CAL-001`.
15. **Estado de cobertura:** Parcial. Existe rechazo de ciclo y bloqueo de entrega normal para órdenes con método y certificados, pero no cuarentena ni disposición por material; la compuerta depende de que el método esté informado.
16. **Certeza y límites:** Confirmado mediante lectura de entidades, DTOs, servicios y reglas maestras. La condición de orden sin método se deriva del código; no se verificaron datos de producción ni pruebas.

<a id="doc-requisitos-backend-calidad-rf-cal-003-desviaciones-capa"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-003-desviaciones-capa.md

---
id: RF-CAL-003
titulo: Registrar desviaciones e investigaciones CAPA
tipo: RF
modulo: Calidad
estado: faltante
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 79; src/calidad/; src/rbac/"
depende_de: [RF-CAL-002]
bloquea: [RF-CAL-008, RF-CAL-009, RA-CAL-002]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Faltante. B-CAL-004 y B-CAL-005 se derivan; políticas a RA-CAL-002."
---

## RF-CAL-003 — Registrar desviaciones e investigaciones CAPA

**Fuente principal:** `Sterinova-ERP.md` §3: registro de desviaciones y apertura de investigaciones CAPA.

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 77 y 79; `src/calidad/` y catálogo RBAC.

1. **ID:** `RF-CAL-003`.
2. **Título:** Registrar desviaciones e investigaciones CAPA.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Registrar desviaciones/no conformidades y gestionar investigaciones CAPA vinculadas a ciclo y materiales afectados, con análisis, acciones, evidencia y cierre.
6. **Reglas asociadas:** Fallos críticos requieren análisis de riesgo; rechazo requiere motivo, evidencia, investigación CAPA y destino del material. La medición/evidencia original se conserva.
7. **Actores y permisos:** El catálogo declara `calidad.desviaciones.verificar` y `calidad.desviaciones.aprobar`; no se halló flujo que los use para gestionar CAPA.
8. **Datos y entidades:** No se identificaron entidades Desviación, CAPA o Investigación ni vínculo a ciclo/material. Existe solo motivo de rechazo en ciclo y auditoría genérica.
9. **Flujo:** No hay proceso implementado para apertura, análisis causal, plan de acciones, verificación de eficacia o cierre.
10. **Criterios de aceptación:** Abrir expediente relacionado con ciclo/material; mantener estados y responsables; registrar análisis, acciones preventivas/correctivas, fechas, evidencia y aprobaciones; exigir verificación antes del cierre según política.
11. **Evidencia en backend:** `CalidadService.rechazar` registra motivo y estado del ciclo, pero no crea investigación, acción ni CAPA. Los permisos RBAC existentes no acreditan implementación.
12. **Persistencia e interfaz:** No se encontró módulo/controlador, entidad/migración ni pantalla CAPA en las rutas inspeccionadas.
13. **Brechas derivadas:** `B-CAL-004` se asigna a `RF-CAL-008` (entidades/endpoints); `B-CAL-005` a `RF-CAL-009` (ciclo de vida y eficacia). Preguntas de política a `RA-CAL-002`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Roles de apertura/investigación/cierre, estados y plazos, alcance de acciones, obligatoriedad por tipo de desviación y relación entre cierre CAPA y liberación; se derivan a `RA-CAL-002`.
15. **Estado de cobertura:** Faltante. Se encontró vocabulario y permisos, pero no capacidad funcional persistente de desviaciones/CAPA.
16. **Certeza y límites:** Confirmado por inspección de `src/calidad/`, entidades de ciclo y catálogo RBAC. No se consultó base desplegada ni se ejecutaron pruebas.

<a id="doc-requisitos-backend-calidad-rf-cal-004-liberacion-excepcion"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-004-liberacion-excepcion.md

---
id: RF-CAL-004
titulo: Autorizar liberaciones por excepción con evidencia
tipo: RF
modulo: Calidad
estado: faltante
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 80; src/calidad/; src/certificados/; src/rbac/"
depende_de: [RF-CAL-001, RF-CAL-003]
bloquea: [RF-CAL-010, RA-CAL-003]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Faltante. B-CAL-006 deriva a RF-CAL-010 y RA-CAL-003."
---

## RF-CAL-004 — Autorizar liberaciones por excepción con evidencia

**Fuente principal:** `Sterinova-ERP.md` §3 (liberación por excepción, confirmación mediante contraseña) y §6 (aprobación de Calidad previa al despacho).

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 77 y 80; servicios de Calidad/Certificados y permisos RBAC.

1. **ID:** `RF-CAL-004`.
2. **Título:** Autorizar liberaciones por excepción con evidencia.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Permitir liberación excepcional documentada cuando una desviación impide la aprobación ordinaria, con análisis de riesgo, responsables y evidencia, preservando medición y decisión originales.
6. **Reglas asociadas:** Fallo crítico bloquea certificado ordinario; liberación por desviación requiere análisis de riesgo y firma del Director Técnico; conservar marca “Liberado por Desviación”; mantener aprobaciones independientes que correspondan y confirmar mediante contraseña.
7. **Actores y permisos:** RBAC declara `calidad.liberacion_desviacion.autorizar` y `calidad.liberacion_condicionada.autorizar`; no se halló flujo que los consuma. Autoridades concretas y relación con doble aprobación deben respetar RA-CAL-003.
8. **Datos y entidades:** No se identificó entidad para autorización excepcional, análisis de riesgo, desviación asociada, evidencia, aprobadores o marca de liberación.
9. **Flujo:** El proceso ordinario evalúa parámetros y bloquea aprobación si valor/evaluación incumple. No existe ruta alternativa para liberar mediante excepción.
10. **Criterios de aceptación:** Registrar desviación, riesgo, justificación y evidencia; exigir las firmas/confirmaciones aprobadas; preservar resultado no conforme; emitir documento con marca explícita; auditar usuario, cargo, fecha/hora e IP; impedir despacho sin autorización válida.
11. **Evidencia en backend:** `prepararInformacionTecnica` rechaza valores fuera de rango o sin `CUMPLE`. `CalidadService.aprobar` requiere password para aprobación normal, sin override de desviación. No se encontró endpoint de liberación excepcional.
12. **Persistencia e interfaz:** No hay entidad, DTO, endpoint ni pantalla de autorización excepcional; solo permisos RBAC declarados y auditoría de acciones ordinarias.
13. **Brechas derivadas:** `B-CAL-006` se asigna a `RF-CAL-010` para el flujo técnico y `RA-CAL-003` para política de liberación/firmas. Ficha sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Diferenciar liberación condicionada de liberación por desviación; definir criterios de elegibilidad, cargos equivalentes/no equivalentes, evidencia y número de aprobadores. Derivadas a `RA-CAL-003`.
15. **Estado de cobertura:** Faltante. Hay bloqueo ordinario y contraseña para aprobación normal, pero no autorización excepcional.
16. **Certeza y límites:** Confirmado en servicio de Calidad, evaluador técnico, controladores y catálogo RBAC inspeccionados. No se verificó BD desplegada ni se ejecutaron pruebas.

<a id="doc-requisitos-backend-calidad-rf-cal-005-sugerencia-ui-calidad"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-005-sugerencia-ui-calidad.md

---
id: RF-CAL-005
titulo: Mostrar sugerencia automática de cumplimiento en UI de Calidad
tipo: RF
modulo: Calidad / Frontend
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 6, respuesta 73; Sterinova-ERP.md §3"
fuente_contraste: "src/certificados/informacion-tecnica.ts; src/calidad/; SterinovaFrontend/app/(erp)/calidad/"
depende_de: [RF-CAL-001]
bloquea: []
brechas: [B-CAL-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; la sugerencia visual no sustituye decisión de Calidad."
---

## RF-CAL-005 — Mostrar sugerencia automática de cumplimiento en UI de Calidad

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-005`.
2. **Título:** Mostrar sugerencia automática de cumplimiento en UI de Calidad.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Frontend.
5. **Descripción funcional:** Antes de confirmar una revisión, la interfaz muestra el resultado calculado por parámetro al comparar las mediciones del ciclo con la versión de protocolo asociada.
6. **Reglas asociadas:** Distinguir conforme, fuera de rango y no aplicable; mostrar la regla/rango usado; la sugerencia no aprueba ni libera materiales automáticamente. La persona autorizada de Calidad conserva la decisión y la firma explícita.
7. **Actores / permisos:** Revisor de Calidad con permiso de consulta y revisión de ciclos conforme a RBAC y ámbito.
8. **Datos y entidades:** Mediciones de `CicloParametroEvaluacion`, valores/rangos en `ProtocoloEsterilizacionVersion.especificaciones_json`, estado del ciclo y resultado por parámetro.
9. **Flujo:** Cargar ciclo y protocolo versionado → calcular resultado de cada medición → mostrarlo junto al valor observado y rango → permitir revisión/decisión autorizada → enviar evaluación al backend, que revalida.
10. **Criterios de aceptación preliminares:** La sugerencia se calcula con la versión exacta asociada al ciclo; muestra parámetros faltantes y no aplicables diferenciados; no permite que un resultado visual sustituya el endpoint de aprobación ni altera mediciones/protocolo.
11. **Evidencia en backend:** `CalidadService.aprobar` pasa por `CertificadosService.emitirDesdeCiclo`, que valida evaluaciones contra la versión del protocolo antes de aprobar. La verificación se realiza al confirmar, no se encontró una respuesta de sugerencias anticipada.
12. **Evidencia frontend/persistencia:** `EvaluacionTecnica` presenta selección manual de criterios; el formulario/API no exhibe una clasificación previa por parámetro. Los datos estructurados de protocolo y medición existen en el flujo backend.
13. **Brecha asociada:** `B-CAL-001` permanece abierta: falta exponer la sugerencia en la UI antes de la decisión humana.
14. **Preguntas abiertas:** Definir cómo presentar parámetros incompletos, unidades/tolerancias, advertencias, accesibilidad y manejo de resultados límite o datos históricos incompatibles.
15. **Cobertura preliminar:** Parcial: validación backend al aprobar; sugerencia anticipada de interfaz no encontrada.
16. **Certeza y límites:** Contraste basado en el servicio de Calidad, el validador de certificados y componentes frontend de evaluación citados en la matriz. No se ejecutó la UI ni se verificó flujo con backend real; sigue en borrador.

<a id="doc-requisitos-backend-calidad-rf-cal-006-cuarentena-materiales"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-006-cuarentena-materiales.md

---
id: RF-CAL-006
titulo: Implementar estado de Cuarentena y rechazo por material/lote
tipo: RF
modulo: Calidad / Planta / Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 70, 76–79"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/; src/logistica/"
depende_de: [RF-CAL-002, RA-CAL-001]
bloquea: []
brechas: [B-CAL-002]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-002; definición de políticas permanece en RA-CAL-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos e incorpora D-CAL-001 y D-CAL-002, manteniendo pendientes los detalles de evidencia/riesgo."
---

## RF-CAL-006 — Implementar estado de Cuarentena y rechazo por material/lote

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-006`.
2. **Título:** Implementar estado de cuarentena y rechazo por material/lote.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Planta / Logística.
5. **Descripción funcional:** Registrar retención, evaluación, liberación parcial o disposición de material por lote/cantidad sin tratar necesariamente toda la carga de un ciclo como una sola unidad.
6. **Reglas asociadas:** D-CAL-001: retener el lote afectado; si no se identifican con fiabilidad las unidades, retener el lote completo; evaluar por separado otros lotes; liberar lotes conformes antes del cierre de investigación requiere autorización documentada del Jefe de Calidad. D-CAL-002: Calidad determina disposición; devolución o destrucción requieren responsable, fecha y evidencia. No liberar ni certificar material no liberado.
7. **Actores / permisos:** Calidad decide evaluación, liberación y destino; Planta/Logística ejecutan las acciones autorizadas. Los permisos específicos y aprobaciones excepcionales deben coordinarse con RBAC y `RA-CAL-001`.
8. **Datos y entidades:** Ciclo, orden, lote/material/cantidad afectada, estado de retención, motivo, resultado, decisión de Calidad, aprobador, fecha, evidencia y disposición final.
9. **Flujo:** Registrar desviación/resultado → identificar lote/unidades afectados → retener el alcance correspondiente → evaluar lotes separadamente → documentar autorización y disposición → habilitar despacho únicamente para cantidades liberadas.
10. **Criterios de aceptación preliminares:** Cantidad retenida no puede certificarse ni despacharse; lotes no afectados conservan evaluación independiente; liberación parcial guarda autorización del Jefe de Calidad; devolución/destrucción no cierran sin responsable, fecha y evidencia.
11. **Evidencia en backend:** El ciclo tiene estados globales de pendiente/aprobado/rechazado; el servicio actual rechaza/aprueba el ciclo. No se encontró modelo de cuarentena/disposición de material individual.
12. **Persistencia e interfaz:** Materiales de orden conservan datos por línea; no se encontró asociación operacional de estado de retención y disposición por lote/cantidad, ni vista de cuarentena individual. El modelo y la pantalla quedan por diseñar.
13. **Brecha asociada:** `B-CAL-002` sigue asignada a esta ficha y `RA-CAL-001`; la política general está parcialmente resuelta por D-CAL-001/002, pero criterios técnicos/evidencias siguen pendientes.
14. **Preguntas abiertas:** Definir evidencia suficiente por destino, evaluación de riesgo adicional, autorizaciones para «otro destino», estados y conciliación con CAPA, reproceso, certificado, inventario y entregas.
15. **Cobertura preliminar:** Faltante para cuarentena/disposición por lote o cantidad; el flujo actual decide a nivel de ciclo.
16. **Certeza y límites:** Las decisiones citadas provienen del registro confirmado; el análisis de persistencia se limita a entidades/servicios señalados. No se fija diseño ni esquema sin cerrar dependencias; borrador pendiente de validación.

<a id="doc-requisitos-backend-calidad-rf-cal-007-bypass-ordenes-sin-metodo"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-007-bypass-ordenes-sin-metodo.md

---
id: RF-CAL-007
titulo: Blindar validación de Calidad para órdenes sin método de esterilización
tipo: RF
modulo: Calidad / Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6; docs/negocio/reglas-maestras.md, Módulo 6"
fuente_contraste: "src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts"
depende_de: [RF-CAL-002]
bloquea: []
brechas: [B-CAL-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-003."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; se explicita la diferencia entre método nulo legado y servicios que no requieren esterilización."
---

## RF-CAL-007 — Blindar validación de Calidad para órdenes sin método de esterilización

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-007`.
2. **Título:** Blindar validación de Calidad para órdenes sin método de esterilización.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Logística.
5. **Descripción funcional:** Garantizar que la transición a entrega evalúe la liberación de Calidad para toda orden que por su servicio/material requiera evaluación, incluso si el campo operacional `metodo_esterilizacion` está nulo o es legado.
6. **Reglas asociadas:** Calidad aprueba antes del despacho. Un campo nulo no debe constituir por sí solo una excepción; tampoco debe forzarse el flujo de esterilización en un servicio que no lo requiere. Las excepciones deben ser explícitas, autorizadas y auditadas.
7. **Actores / permisos:** Logística solicita/ejecuta la transición con su permiso; el backend verifica ciclos, certificados y liberación de Calidad. Calidad autoriza cualquier excepción definida por política.
8. **Datos y entidades:** Orden y líneas/materiales, método contratado/operativo, ciclos relacionados, decisiones de Calidad, certificados asociados y condición de aplicabilidad del proceso.
9. **Flujo:** Solicitar entrega → resolver si el tipo de servicio requiere control de Calidad → comprobar liberación/certificado por unidades aplicables → rechazar si falta evidencia → permitir solo con requisitos satisfechos o excepción autorizada.
10. **Criterios de aceptación preliminares:** Orden esterilizable con método nulo no elude revisión; orden con ciclos pendientes/rechazados no se entrega; servicio explícitamente no sujeto a esterilización sigue regla aprobada sin exigir un certificado inexistente; toda excepción deja trazabilidad.
11. **Evidencia en backend:** `LogisticaService.updateEstado` recorre la compuerta de ciclos aprobados/certificados dentro de la condición que requiere `orden.metodo_esterilizacion`; por ello, el valor nulo evita esa comprobación.
12. **Persistencia e interfaz:** `OrdenServicio` guarda `metodo_esterilizacion` nullable; no se identificó en el hallazgo un indicador explícito de aplicabilidad del control de Calidad por tipo de servicio.
13. **Brecha asociada:** `B-CAL-003` permanece abierta y asignada a este borrador; deriva del bypass por método nulo.
14. **Preguntas abiertas:** Definir catálogo/criterio para “requiere Calidad”, tratamiento de órdenes antiguas, servicios no estériles y quién puede autorizar excepciones.
15. **Cobertura preliminar:** Parcial; existe control en órdenes con método, pero el camino con método ausente no aplica la misma compuerta.
16. **Certeza y límites:** La condición se observó en `LogisticaService.updateEstado` y el campo nullable en `OrdenServicio`. La clasificación de servicios y cualquier excepción requieren negocio; borrador sin validación.

<a id="doc-requisitos-backend-calidad-rf-cal-008-modulo-capa"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-008-modulo-capa.md

---
id: RF-CAL-008
titulo: Implementar entidades y endpoints para Desviaciones y CAPA
tipo: RF
modulo: Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; RF-CAL-003"
fuente_contraste: "src/calidad/; src/rbac/permission-catalog.ts"
depende_de: [RF-CAL-003, RA-CAL-002]
bloquea: []
brechas: [B-CAL-004]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-004."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; no se presume un flujo de estados aprobado."
---

## RF-CAL-008 — Implementar entidades y endpoints para Desviaciones y CAPA

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-008`.
2. **Título:** Implementar entidades y endpoints para Desviaciones y CAPA.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Crear expediente persistente y API para informar desviaciones/no conformidades e investigaciones CAPA vinculadas con ciclo y, cuando aplique, material/lote.
6. **Reglas asociadas:** Registrar clasificación, descripción, origen, reportante, responsables y relaciones operativas; conservar historial; no cerrar/despachar con una investigación pendiente cuando la regla aprobada lo restrinja. El ciclo de estados/acciones se define en `RF-CAL-009`; políticas en `RA-CAL-002`.
7. **Actores / permisos:** Roles de Calidad con permisos de consulta, registro, investigación, verificación y aprobación según catálogo existente; la asignación concreta depende de RA-CAL-002 y RBAC.
8. **Datos y entidades:** Propuesta de entidades para desviación e investigación CAPA, con claves a ciclo, orden y lote/material, responsables, fechas, descripción, clasificación, estado, evidencias y relaciones a acciones. El esquema exacto está por diseñar.
9. **Flujo preliminar:** Detectar → registrar desviación → asociar ciclo/material → iniciar expediente → asignar investigación/acciones → pasar al flujo de seguimiento definido en `RF-CAL-009`.
10. **Criterios de aceptación preliminares:** Crear y consultar expedientes autorizados; mantener vínculo navegable al ciclo/lote; registrar actor y fechas; guardar evidencia sin sobrescribir el original; filtrar y restringir acceso por ámbito; impedir datos sin relación válida.
11. **Evidencia en backend:** No se encontraron entidades, servicios ni endpoints funcionales de Desviación/CAPA bajo `src/calidad/`; sí existen códigos de permisos relacionados en `permission-catalog.ts`.
12. **Persistencia e interfaz:** No existe persistencia CAPA observada ni UI de expedientes en la matriz revisada; campos, adjuntos y consultas son alcance nuevo.
13. **Brecha asociada:** `B-CAL-004` permanece abierta y asignada a este borrador.
14. **Preguntas abiertas:** Definir tipos de desviación, criterios de severidad, vínculos obligatorios, roles por etapa, datos mínimos, plazos, evidencias y retención con RA-CAL-002.
15. **Cobertura preliminar:** Faltante; el catálogo de permisos sin entidades/endpoints no implementa la capacidad.
16. **Certeza y límites:** La ausencia se basa en revisión de `src/calidad/` y catálogo de permisos; no se evaluaron sistemas externos CAPA ni requerimientos regulatorios no incluidos en el anexo. Borrador pendiente de validación.

<a id="doc-requisitos-backend-calidad-rf-cal-009-flujo-capa"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-009-flujo-capa.md

---
id: RF-CAL-009
titulo: Flujo de estados, acciones y verificación de eficacia de CAPA
tipo: RF
modulo: Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 79"
fuente_contraste: "src/calidad/; RF-CAL-008"
depende_de: [RF-CAL-008, RA-CAL-002]
bloquea: []
brechas: [B-CAL-005]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-005."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos y se vincula con D-CAL-001/002 sin inventar estados CAPA."
---

## RF-CAL-009 — Flujo de estados, acciones y verificación de eficacia de CAPA

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-009`.
2. **Título:** Flujo de estados, acciones y verificación de eficacia de CAPA.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Gestionar el ciclo de vida de investigaciones de desviación/CAPA con responsables, acciones, evidencias, verificación de eficacia y cierre autorizado.
6. **Reglas asociadas:** Preservar decisiones previas; no tratar un rechazo/aborto como liberación automática. Cuando afecte lotes, aplicar D-CAL-001/002 a retención, liberación parcial y disposición; los criterios de apertura/cierre de CAPA aún se deben acordar.
7. **Actores / permisos:** Calidad registra/investiga, asigna y verifica; autoridades y separación entre ejecutor/verificador/aprobador quedan por definir en `RA-CAL-002`.
8. **Datos y entidades:** Expediente CAPA (propuesto), estado, origen, vínculo ciclo/lote/material, responsables, fechas objetivo, análisis causal, acciones, evidencias, verificación de eficacia y cierre.
9. **Flujo preliminar:** Abrir → clasificar/asignar → investigar → definir y ejecutar acciones → verificar eficacia → cerrar con decisión y evidencia. Nombres de estados y transiciones están pendientes de aprobación.
10. **Criterios de aceptación preliminares:** Cambios de estado guardan actor/fecha/motivo; no se cierra sin actividades/verificaciones obligatorias una vez definidas; las evidencias y decisiones permanecen consultables; la liberación de lotes sigue independiente de cierre CAPA solo en los escenarios documentados por D-CAL-001.
11. **Evidencia en backend:** No se identificó flujo funcional CAPA ni estado/servicio de investigación en `src/calidad/`; permisos para algunas operaciones están declarados.
12. **Persistencia e interfaz:** Depende de entidades/API de `RF-CAL-008` y adjuntos de evidencia. No se encontró interfaz de expediente o verificación.
13. **Brecha asociada:** `B-CAL-005` permanece abierta y vinculada con `RF-CAL-008` y `RA-CAL-002`.
14. **Preguntas abiertas:** Acordar estados, umbrales de severidad, plan de acción obligatorio, fechas/plazos, evidencia, verificador independiente, reglas de eficacia, cierre y vínculo con cuarentena/disposición.
15. **Cobertura preliminar:** Faltante; no se encontró ciclo de vida de CAPA implementado.
16. **Certeza y límites:** El hallazgo de ausencia proviene de `src/calidad/`; D-CAL-001/002 son reglas de negocio incorporadas y no especifican el flujo CAPA completo. Borrador pendiente de validación.

<a id="doc-requisitos-backend-calidad-rf-cal-010-flujo-excepcion"></a>

**Origen:** docs/requisitos/backend/calidad/RF-CAL-010-flujo-excepcion.md

---
id: RF-CAL-010
titulo: Implementar flujo de liberación por excepción
tipo: RF
modulo: Calidad / Certificados
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 80"
fuente_contraste: "src/calidad/; src/certificados/; src/rbac/permission-catalog.ts"
depende_de: [RF-CAL-004, RA-CAL-003]
bloquea: []
brechas: [B-CAL-006]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-006."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; se distingue reautenticación normal de la futura autorización excepcional."
---

## RF-CAL-010 — Implementar flujo de liberación por excepción

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-010`.
2. **Título:** Implementar flujo de liberación por excepción.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Certificados / Seguridad.
5. **Descripción funcional:** Permitir una decisión excepcional, diferenciada de la aprobación ordinaria, cuando un proceso o parámetro no cumple un criterio y la política autorizada permite evaluar una posible liberación condicionada.
6. **Reglas asociadas:** Conservar valores y resultado original; exigir motivo, evaluación de riesgo, evidencia y aprobaciones requeridas; no convertir la excepción en aprobación ordinaria ni liberar automáticamente; reflejar claramente la condición excepcional en el documento cuando la política lo requiera.
7. **Actores / permisos:** Usuario de Calidad con `calidad.liberacion_desviacion.autorizar` o permiso aprobado equivalente. Confirmación por contraseña debe aplicarse según `RNF-SEG-002`; autoridad, separación y firmas se deciden en `RA-CAL-003`.
8. **Datos y entidades:** Ciclo, parámetro no conforme, regla/rango aplicable, motivo, análisis de riesgo, evidencia, aprobador(es), fecha/hora, usuario/cargo, estado y certificado relacionado. El registro de IP se mantiene como dato a decidir, no como requisito confirmado.
9. **Flujo preliminar:** Detectar desviación → iniciar expediente → documentar evaluación/evidencia → solicitar autorizaciones y reautenticación → aprobar o denegar excepción → actualizar condición de liberación/certificado sin modificar mediciones originales.
10. **Criterios de aceptación preliminares:** El flujo ordinario continúa rechazando parámetros fuera de rango; excepción requiere permisos, justificación y aprobaciones definidos; operación inválida no produce liberación/PDF; el certificado identifica la excepción cuando así se apruebe; todo queda auditable.
11. **Evidencia en backend:** No se encontró endpoint/servicio que autorice liberación excepcional. El permiso aparece en `permission-catalog.ts`. La aprobación ordinaria sí exige contraseña en `ApproveCycleDto` y `CalidadService.aprobar`, comprueba que el operador no se apruebe a sí mismo y emite certificado tras validar parámetros.
12. **Persistencia e interfaz:** No se identificó entidad para disposición excepcional, riesgo o firma/decisión especial; la interfaz revisada sigue el flujo normal de aprobar/rechazar.
13. **Brecha asociada:** `B-CAL-006` permanece abierta y asignada a esta ficha y a la decisión `RA-CAL-003`.
14. **Preguntas abiertas:** Determinar escenarios admisibles, nivel de riesgo y evidencia, número/perfil de aprobadores, independencia, dato de contraseña, sello/leyenda del certificado, trazabilidad de IP y efectos sobre cuarentena/CAPA.
15. **Cobertura preliminar:** Faltante para liberación por excepción; el permiso y la confirmación de contraseña de aprobación normal no implementan ese flujo.
16. **Certeza y límites:** La ausencia del flujo se contrastó en controladores/servicios de Calidad; el permiso y la aprobación ordinaria se observaron en los archivos citados. Ninguna excepción se presume autorizada; ficha en borrador.

<a id="doc-requisitos-backend-calidad-rn-cal-001-bloqueo-despacho"></a>

**Origen:** docs/requisitos/backend/calidad/RN-CAL-001-bloqueo-despacho.md

---
id: RN-CAL-001
titulo: Exigir aprobación de Calidad antes del despacho
tipo: RN
modulo: Calidad / Logística / Certificados
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 76–77; src/logistica/; src/calidad/; src/certificados/"
depende_de: [RF-CAL-001, RF-CAL-002]
bloquea: [RF-CAL-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CAL-003 se mantiene asignada a RF-CAL-007."
---

## RN-CAL-001 — Exigir aprobación de Calidad antes del despacho

**Fuente principal:** `Sterinova-ERP.md` §6: Calidad debe aprobar antes del despacho.

**Fuentes de contraste:** Anexo §3; `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 76–77; servicios de Logística, Calidad y Certificados.

1. **ID:** `RN-CAL-001`.
2. **Título:** Exigir aprobación de Calidad antes del despacho.
3. **Tipo:** RN.
4. **Módulo:** Calidad / Logística / Certificados.
5. **Enunciado:** La entrega ordinaria requiere liberación de Calidad y certificado aplicable para todo material que lo requiera; resultados pendientes/no conformes no autorizan despacho. Excepciones solo por flujo formal aprobado.
6. **Reglas asociadas:** Procesamiento terminado no equivale a liberación; estados pendientes no equivalen a resultados negativos; fallos críticos bloquean certificado ordinario; excepciones documentadas no alteran el resultado original.
7. **Actores y permisos:** Calidad revisa y aprueba; Logística registra entrega. Cualquier flujo alternativo debe validar permisos y autorizadores definidos.
8. **Datos y entidades:** `OrdenServicio.metodo_esterilizacion` puede ser nulo; los ciclos tienen estados y certificado asociado. No hay atributo general de liberación para órdenes sin método.
9. **Flujo y validación actual:** Antes de `ENTREGADO`, Logística valida existencia, aprobación y certificado de todos los ciclos solo si `metodo_esterilizacion` tiene valor. Si es nulo, ese bloque de comprobación se omite.
10. **Criterios de aceptación:** Aplicar compuerta a toda orden/material que requiera liberación; impedir despacho ordinario si faltan ciclos aprobados/certificados; definir explícitamente el tratamiento de órdenes sin método; validar excepciones por autorización específica y auditable.
11. **Evidencia en backend:** `LogisticaService.updateEstado` contiene la validación condicionada por el método. Cuando aplica, bloquea sin ciclos o ante ciclo no aprobado/sin certificado.
12. **Evidencia de persistencia/interfaz:** La entidad de orden permite método `null`; actualización de estado expone transición a `ENTREGADO`. No se identificó otra compuerta universal para órdenes sin método.
13. **Brechas derivadas:** `B-CAL-003` continúa asignada a `RF-CAL-007`, que debe blindar la validación para órdenes sin método. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Determinar qué órdenes sin método requieren Calidad (p. ej. procesos no esterilizantes) y qué certificado o constancia permite su despacho. Resolver dentro de `RF-CAL-007`/política aplicable.
15. **Estado de cobertura:** Parcial. El bloqueo es robusto para órdenes con método y ciclos, pero condicional; nulo puede evitar la verificación.
16. **Certeza y límites:** Confirmado en la condición de `LogisticaService.updateEstado` y entidad `OrdenServicio`. El riesgo es de ruta de código; no se confirmó cuántas órdenes operativas tienen método nulo ni se inspeccionó BD productiva.

<a id="doc-requisitos-backend-certificados-rf-cer-001-emision-certificados"></a>

**Origen:** docs/requisitos/backend/certificados/RF-CER-001-emision-certificados.md

---
id: RF-CER-001
titulo: Emitir certificados por orden y cliente
tipo: RF
modulo: Certificados / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/certificados/; src/planta/; src/database/migrations/"
depende_de: [RF-CAL-001, RF-PLA-002]
bloquea: [RF-CER-004, RA-CER-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-001 se deriva a RF-CER-004; política a RA-CER-001."
---

## RF-CER-001 — Emitir certificados por orden y cliente

**Fuente principal:** `Sterinova-ERP.md` §3 y §6: emisión por orden/cliente; ciclo compartido produce certificados independientes por cliente.

**Fuentes de contraste:** servicios y entidad de Certificados, ciclo de Planta y migración de unicidad.

1. **ID:** `RF-CER-001`.
2. **Título:** Emitir certificados por orden y cliente.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Calidad.
5. **Descripción funcional:** Emitir un certificado por cada cliente y orden representados en un ciclo, preservando asociación y contenido documental por cliente.
6. **Reglas asociadas:** Ciclo compartido entre clientes requiere certificados separados; aprobación de Calidad inicia la emisión y el PDF debe conservar datos congelados.
7. **Actores y permisos:** Calidad aprueba; el flujo de aprobación exige permiso y contraseña. Consulta/descarga del certificado requiere sus permisos RBAC.
8. **Datos y entidades:** Certificado se relaciona con ciclo y orden; cliente se deriva de orden→cotización→cliente. No existe relación directa ciclo/cliente de cardinalidad múltiple.
9. **Flujo:** `CalidadService.aprobar` llama una vez a `emitirDesdeCiclo`; este obtiene un único cliente de la orden, resuelve su formato y crea un documento.
10. **Criterios de aceptación:** Emitir un documento separado por cliente cuando compartan ciclo; cada certificado debe identificar cliente, órdenes/materiales correspondientes y ciclo, con formato/consecutivo independiente.
11. **Evidencia del backend:** `emitirDesdeCiclo` lee `ciclo.orden.cotizacion.cliente` y genera un solo certificado por invocación.
12. **Persistencia y BD:** `ciclo_id` es `OneToOne` y tiene índice/constraint único `UQ_certificados_ciclo_id`, impidiendo más de un certificado por ciclo.
13. **Brechas derivadas:** `B-CER-001` se asigna a `RF-CER-004`; partición por cliente y agrupación se deriva a `RA-CER-001`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definir asociación de materiales/cantidades por cliente dentro del ciclo compartido y reglas del formato/consecutivo; quedan en `RA-CER-001`.
15. **Estado de cobertura:** Parcial. Flujo emite para el único cliente de la orden; no soporta cliente múltiple en ciclo ni múltiples certificados por ciclo.
16. **Certeza y límites:** Confirmado en servicio, entidad y migración inspeccionados; no se verificó BD desplegada.

<a id="doc-requisitos-backend-certificados-rf-cer-002-identificacion-materiales"></a>

**Origen:** docs/requisitos/backend/certificados/RF-CER-002-identificacion-materiales.md

---
id: RF-CER-002
titulo: Identificar en el certificado los materiales y ciclos asociados
tipo: RF
modulo: Certificados / Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/; src/planta/; src/pdf/; src/database/migrations/"
depende_de: [RF-CER-001, RF-PLA-003, RF-PLA-004]
bloquea: [RF-CER-005, RA-CER-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-002 se deriva a RF-CER-005; partición/agrupación a RA-CER-001."
---

## RF-CER-002 — Identificar en el certificado los materiales y ciclos asociados

**Fuente principal:** `Sterinova-ERP.md` §3 (ciclos, lotes y agrupación) y §7 (PDFs con datos congelados).

**Fuentes de contraste:** entidad/servicio de Certificados, persistencia de cantidades procesadas de Planta, servicio PDF y migraciones.

1. **ID:** `RF-CER-002`.
2. **Título:** Identificar en el certificado los materiales y ciclos asociados.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Planta.
5. **Descripción funcional:** El certificado identifica ciclo/protocolo y los materiales, lotes y cantidades realmente procesados que ampara.
6. **Reglas asociadas:** Congelar los datos al emitir; regenerar desde snapshot; reflejar la cantidad y alcance reales del ciclo, no extrapolar del pedido.
7. **Actores y permisos:** Calidad aprueba y emite; usuarios autorizados consultan/descargan certificado.
8. **Datos y entidades:** Certificado contiene snapshot JSON, datos técnicos, formato/versiones, PDF/hash; snapshot de materiales incluye id, descripción, lote, cantidad, empaque, muestras y referencia al ítem cotizado.
9. **Flujo:** Al aprobar se copian los materiales de la orden, se construye snapshot y PDF; `ciclos_materiales_procesados` guarda por separado cantidades asignadas a cada ciclo.
10. **Criterios de aceptación:** El certificado debe incluir solo alcance procesado por ese ciclo con lote y cantidad correctos; preservar snapshot y verificar integridad PDF; regeneración no consulta datos operativos mutables.
11. **Evidencia del backend:** `emitirDesdeCiclo` mapea `ciclo.orden.materiales`; no consulta las filas de `ciclos_materiales_procesados` al construir la lista certificada.
12. **Persistencia y PDF:** `snapshot_datos` guarda datos completos; Playwright genera PDF en backend y SHA-256 se persiste. `ensurePdfCurrent` valida integridad y regenera desde el snapshot. Trigger de BD protege snapshot/campos principales de certificados aprobados.
13. **Brechas derivadas:** `B-CER-002` se asigna a `RF-CER-005` para usar cantidades procesadas del ciclo; partición multiorden/cliente se deriva a `RA-CER-001`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definir cómo presentar material parcial y rechazado y agrupar materiales de órdenes/ciclos diversos; `RA-CER-001`.
15. **Estado de cobertura:** Parcial. Snapshot y PDF conservan lotes y materiales, pero la cantidad incluida proviene del material completo de la orden, no de la cantidad procesada del ciclo.
16. **Certeza y límites:** Confirmado al comparar `CertificadosService` con la entidad de cantidades procesadas de Planta; no se verificó PDF real/base desplegada.

<a id="doc-requisitos-backend-certificados-rf-cer-003-versionado-anulacion"></a>

**Origen:** docs/requisitos/backend/certificados/RF-CER-003-versionado-anulacion.md

---
id: RF-CER-003
titulo: Conservar versiones y anular certificados sin borrar el original
tipo: RF
modulo: Certificados
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/; src/database/migrations/; src/pdf/"
depende_de: [RF-CER-001, RF-CER-002]
bloquea: [RF-CER-006, RF-CER-007, RA-CER-002]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-003 y B-CER-004 se derivan; políticas a RA-CER-002."
---

## RF-CER-003 — Conservar versiones y anular certificados sin borrar el original

**Fuente principal:** `Sterinova-ERP.md` §3 (versiones, anulación sin borrar original y reemplazos) y §7 (PDF con datos congelados).

**Fuentes de contraste:** entidad, controlador y servicio de Certificados; migraciones de inmutabilidad y versionado PDF.

1. **ID:** `RF-CER-003`.
2. **Título:** Conservar versiones y anular certificados sin borrar el original.
3. **Tipo:** RF.
4. **Módulo:** Certificados.
5. **Descripción funcional:** Conservar documentos emitidos y sus evidencias; anular sin borrar el original y emitir reemplazo vinculado cuando corresponda; mantener historial de versiones verificable.
6. **Reglas asociadas:** No sobrescribir el documento histórico. El reemplazo debe ser un registro nuevo, vinculado al anulado y preservando PDF, hash, snapshot y aprobación originales.
7. **Actores y permisos:** No se halló endpoint/permiso de anulación o reemplazo de certificado. Consulta y descarga sí tienen permisos.
8. **Datos y entidades:** Hay estado string, formato versionado, snapshot, hash, renderer y fecha de emisión; no hay vínculo de reemplazo ni versión secuencial del certificado.
9. **Flujo:** Se emite certificado `Aprobado`. No hay operaciones de anulación/reemplazo. Validación pública interpreta `Anulado`, pero no se encontró escritura de ese estado.
10. **Criterios de aceptación:** Anular sin eliminar; crear reemplazo vinculado; capturar motivo y autorización; conservar versiones documentales anteriores y registrar integridad/linaje.
11. **Evidencia del backend:** `CertificadosController` no expone anular/reemplazar; `CertificadosService` no tiene métodos de esas operaciones. La migración crea trigger de inmutabilidad de certificados aprobados.
12. **Persistencia/PDF:** `version_formato_id` identifica formato, `pdf_renderer_version` renderer. `ensurePdfCurrent` regenera desde snapshot; mismo renderer reutiliza la misma clave y otro renderer genera clave con sufijo, sin registro de versiones del documento. El trigger permite actualizar URL/hash/renderer para reparación, no estado/snapshot protegidos.
13. **Brechas derivadas:** `B-CER-003` a `RF-CER-006` (anulación y reemplazo); `B-CER-004` a `RF-CER-007` (historial PDF/protección); políticas a `RA-CER-002`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definir roles/autorizaciones, motivo, visibilidad de anulado, vínculo de sustitución y conservación de PDFs previos; `RA-CER-002`.
15. **Estado de cobertura:** Parcial. Snapshot, hash y formato versionado están implementados, pero no anulación ni reemplazo; regeneración no mantiene un historial documental completo.
16. **Certeza y límites:** Confirmado en código y migraciones inspeccionados. El estado `Anulado` en validación no equivale a flujo operativo; no se revisó base desplegada.

<a id="doc-requisitos-backend-certificados-rf-cer-004-certificados-ciclos-compartidos"></a>

**Origen:** docs/requisitos/backend/certificados/RF-CER-004-certificados-ciclos-compartidos.md

---
id: RF-CER-004
titulo: Soporte de certificados múltiples para ciclos compartidos
tipo: RF
modulo: Certificados / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/certificados/entities/certificado-esterilizacion.entity.ts; src/database/migrations/1730750401000-AddQualityCertificates.ts"
depende_de: [RF-CER-001, RA-CER-001]
bloquea: []
brechas: [B-CER-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; la partición de materiales/cantidades continúa pendiente en RA-CER-001."
---

## RF-CER-004 — Soporte de certificados múltiples para ciclos compartidos

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-004`.
2. **Título:** Soporte de certificados múltiples para ciclos compartidos.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Planta / Calidad.
5. **Descripción funcional:** Emitir certificados separados para cada cliente cubierto por un mismo ciclo compartido y relacionar cada documento con su ciclo, orden, cliente y materiales/cantidades que ampara.
6. **Reglas asociadas:** El certificado de un cliente no debe incluir materiales de otro; conservar snapshot y PDF por documento; no alterar el ciclo histórico. Método de partición de cantidades debe ser el acordado en `RA-CER-001`.
7. **Actores / permisos:** Calidad/usuarios autorizados para aprobar y emitir; consulta/descarga por permisos de Certificados y ámbito del ciclo. La responsabilidad de generar documentos separados debe ser idempotente.
8. **Datos y entidades:** `CertificadoEsterilizacion` con `ciclo_id`, `orden_id`, aprobador, snapshot, token, PDF/hash; relaciones ciclo/orden/cliente y líneas de materiales procesados. El vínculo cliente-documento debe hacerse explícito o ser inequívocamente reconstruible.
9. **Flujo preliminar:** Identificar clientes/órdenes del ciclo → determinar materiales/cantidades de cada cliente conforme a política → emitir un documento por cliente → persistir snapshot, consecutivo, token y PDF independientes.
10. **Criterios de aceptación preliminares:** Un ciclo con N clientes permite N certificados identificables; cada certificado contiene solo la partición asignada; cada documento tiene token y artefacto propios; reintentos no duplican certificados sin control; consultas respetan ámbito.
11. **Evidencia en backend:** La entidad usa `OneToOne` desde certificado a ciclo; la migración añade `UQ_certificados_ciclo_id`. El servicio `emitirDesdeCiclo` crea un certificado por ciclo y deriva cliente desde la orden/cotización asociada.
12. **Persistencia e interfaz:** `snapshot_datos` captura un cliente y materiales de la orden; la interfaz de certificados no presenta partición multi-cliente. Esquema y UX para varios clientes están por diseñar.
13. **Brecha asociada:** `B-CER-001` abierta; el modelo actual no admite certificados independientes para varios clientes del mismo ciclo.
14. **Preguntas abiertas:** `RA-CER-001` debe definir cómo asociar órdenes/clientes al ciclo y distribuir materiales/cantidades, además de tratamiento de casos sin partición inequívoca.
15. **Cobertura preliminar:** Faltante para ciclos compartidos; la emisión ordinaria para un ciclo/cliente sí existe.
16. **Certeza y límites:** La restricción se confirmó en entidad y migración citadas, y la emisión en `CertificadosService`. No se establece un algoritmo de partición sin decisión; ficha en borrador.

<a id="doc-requisitos-backend-certificados-rf-cer-005-cantidades-procesadas"></a>

**Origen:** docs/requisitos/backend/certificados/RF-CER-005-cantidades-procesadas.md

---
id: RF-CER-005
titulo: Corrección de cantidades procesadas en snapshot de certificado
tipo: RF
modulo: Certificados / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/certificados.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts"
depende_de: [RF-CER-002, RA-CER-001]
bloquea: []
brechas: [B-CER-002]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-002."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos, separando cantidad del ciclo de cantidad total de la orden."
---

## RF-CER-005 — Corrección de cantidades procesadas en snapshot de certificado

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-005`.
2. **Título:** Corrección de cantidades procesadas en snapshot de certificado.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Planta.
5. **Descripción funcional:** El snapshot del certificado debe declarar la cantidad efectivamente procesada en el ciclo certificado, no la cantidad total ordenada o recibida cuando el trabajo se distribuyó entre ciclos.
6. **Reglas asociadas:** Conservar material, lote, unidad, orden/cliente y cantidad del ciclo; no duplicar cantidades de otros ciclos; los ciclos rechazados/abortados y reprocesos siguen `RF-PLA-011` y políticas de `RA-PLA-006`.
7. **Actores / permisos:** Emisión por Calidad tras la aprobación del ciclo; el consumidor del certificado consulta el snapshot autorizado.
8. **Datos y entidades:** `CicloMaterialProcesado` (`ciclo_id`, `orden_servicio_material_id`, `cantidad_procesada`) vincula ciclo y línea de orden; snapshot `CertificadoEsterilizacion.snapshot_datos.materiales` incluye material/lote/cantidad.
9. **Flujo:** Obtener las líneas procesadas del ciclo → resolver datos del material/orden → validar suma y pertenencia → congelar en snapshot → generar PDF/hash dentro de la emisión.
10. **Criterios de aceptación preliminares:** Para órdenes repartidas entre ciclos, cada certificado muestra solo las cantidades del ciclo correspondiente; suma de snapshots no excede material recibido/ordenado; el PDF reproduce exactamente el snapshot persistido; el total de orden no se presenta como procesado por un ciclo.
11. **Evidencia en backend:** `CertificadosService.emitirDesdeCiclo` construye `materiales` desde `ciclo.orden.materiales` y copia `cantidad` de cada línea. No consulta `ciclos_materiales_procesados`, aunque esa entidad conserva cantidades por ciclo.
12. **Persistencia e interfaz:** Snapshot JSON y PDF/hash existen; el registro por ciclo/material está persistido, pero no se usa al construir el snapshot en el código revisado.
13. **Brecha asociada:** `B-CER-002` abierta; el documento puede atribuir al ciclo toda la cantidad de la línea de orden.
14. **Preguntas abiertas:** Definir partición por cliente en ciclos compartidos (`RA-CER-001`), redondeo/unidad, casos de líneas históricas sin registros de cantidad y tratamiento de corrección/reemisión.
15. **Cobertura preliminar:** Parcial: hay snapshot y cantidades efectivas por ciclo en persistencia, pero la consulta que alimenta el certificado usa cantidad de orden.
16. **Certeza y límites:** Confirmado en `CertificadosService` y `CicloMaterialProcesado`. No se verificaron datos desplegados ni reconciliación histórica; diseño de reparación queda pendiente.

<a id="doc-requisitos-backend-certificados-rf-cer-006-flujo-anulacion"></a>

**Origen:** docs/requisitos/backend/certificados/RF-CER-006-flujo-anulacion.md

---
id: RF-CER-006
titulo: Implementar flujo de anulación y reemplazo de certificados
tipo: RF
modulo: Certificados
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/certificados/certificados.controller.ts; src/certificados/certificados.service.ts; src/certificados/entities/certificado-esterilizacion.entity.ts"
depende_de: [RF-CER-003, RA-CER-002]
bloquea: []
brechas: [B-CER-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-003."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; distingue la validación pública existente del flujo administrativo ausente."
---

## RF-CER-006 — Implementar flujo de anulación y reemplazo de certificados

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-006`.
2. **Título:** Implementar flujo de anulación y reemplazo de certificados.
3. **Tipo:** RF.
4. **Módulo:** Certificados.
5. **Descripción funcional:** Permitir anular un certificado con autorización y motivo, conservando el registro y documento originales, y emitir un nuevo certificado de reemplazo relacionado cuando la política lo permita.
6. **Reglas asociadas:** Nunca borrar ni modificar silenciosamente el documento original; el reemplazo es un registro nuevo con vínculo explícito y referencia al motivo. La consulta pública debe mostrar estado vigente/anulado coherente.
7. **Actores / permisos:** Actor de Calidad/administración documental autorizado, con separación de funciones y permisos definidos en `RA-CER-002`; consulta pública solo mediante token y datos publicados permitidos.
8. **Datos y entidades:** Certificado original, estado, motivo, actor/fecha, aprobador, relación reemplaza/reemplazado-por, snapshots, versiones, PDF/hash y token de validación.
9. **Flujo preliminar:** Solicitar anulación → validar autoridad/justificación → registrar decisión conservando original → emitir reemplazo como nuevo documento si procede → actualizar validez pública de original y reemplazo.
10. **Criterios de aceptación preliminares:** Anulación no elimina original ni invalida su evidencia histórica; reemplazo queda enlazado y no comparte token/identidad documental; consulta pública identifica estado; acciones quedan auditadas; operación no autorizada se rechaza.
11. **Evidencia en backend:** El controlador solo expone consultas, descarga y validación pública. `validarToken` interpreta estado `Anulado`, pero no existe ruta/servicio para cambiar estado o crear reemplazo.
12. **Persistencia e interfaz:** La entidad tiene campo `estado`, snapshot, PDF/hash y token, pero no relación de reemplazo ni historial de decisión; la interfaz no expone anulación o reemplazo.
13. **Brecha asociada:** `B-CER-003` abierta; se deriva el flujo ausente a este requisito.
14. **Preguntas abiertas:** `RA-CER-002` debe definir motivos, quién solicita/aprueba, doble aprobación, documentos sustitutos, estados, validez del token original y conservación.
15. **Cobertura preliminar:** Parcial: consulta pública contempla un estado anulado, pero faltan las mutaciones y el vínculo de reemplazo.
16. **Certeza y límites:** Confirmado en controlador, servicio y entidad revisados; no se verificó operación desplegada. La política de anulación/reemplazo no se infiere; borrador.

<a id="doc-requisitos-backend-certificados-rf-cer-007-historial-versiones"></a>

**Origen:** docs/requisitos/backend/certificados/RF-CER-007-historial-versiones.md

---
id: RF-CER-007
titulo: Historial de versiones de PDF y protección contra sobrescritura
tipo: RF
modulo: Certificados / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/certificados.service.ts; src/certificados/entities/certificado-esterilizacion.entity.ts; src/pdf/pdf-generator.service.ts"
depende_de: [RF-CER-003, RA-CER-002]
bloquea: []
brechas: [B-CER-004]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-004."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos e incorpora el riesgo de reparación del PDF usando la misma clave."
---

## RF-CER-007 — Historial de versiones de PDF y protección contra sobrescritura

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-007`.
2. **Título:** Historial de versiones de PDF y protección contra sobrescritura.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Documentos.
5. **Descripción funcional:** Conservar cada PDF emitido o regenerado como artefacto histórico verificable y distinguirlo de la versión vigente sin sobrescribir o perder el original.
6. **Reglas asociadas:** Cada versión conserva hash, renderer, fecha, causa, snapshot asociado y actor si aplica; la reparación desde snapshot no modifica el contenido lógico original ni destruye la única copia anterior ante fallo.
7. **Actores / permisos:** Emisión/reparación por servicios autorizados de Certificados; descarga según `certificados.descargar` y ámbito; actor administrativo para acciones de mantenimiento por definir.
8. **Datos y entidades:** Certificado, versión del renderer/formato, `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, fecha/causa de creación y referencia de versión vigente. No existe entidad de historial de PDFs observada.
9. **Flujo preliminar:** Emitir primera versión → guardar artefacto y hash → registrar metadatos → ante actualización/reparación generar una nueva clave/version → validar guardado → conservar previa y cambiar referencia vigente de forma segura.
10. **Criterios de aceptación preliminares:** La regeneración no reemplaza artefacto histórico; toda versión valida contra su hash y snapshot; fallo de DB/storage conserva el PDF previo y referencias; selector/descarga identifica versión vigente e historial permitido.
11. **Evidencia en backend:** La entidad guarda solo referencias actuales. `ensurePdfCurrent` reconstruye desde snapshot; cuando el renderer cambia crea sufijo de versión, pero con el mismo renderer usa la clave anterior. Un error al guardar elimina la clave generada; si coincide con la anterior, hay riesgo para la copia vigente. La migración añade trigger de inmutabilidad para certificados aprobados, lo que añade riesgo de conflicto al guardar reparaciones.
12. **Persistencia e interfaz:** No hay entidad/versionado histórico; la UI descarga el PDF actual. El artefacto de storage y fila de certificado comparten una sola referencia/hash activos.
13. **Brecha asociada:** `B-CER-004` abierta por falta de versiones históricas y riesgo de sobrescritura/pérdida durante regeneración.
14. **Preguntas abiertas:** Definir política de reparación, conservación/retención, claves y metadatos, acceso a versiones antiguas, eventos auditados y tratamiento de archivos corruptos o renderer retirado.
15. **Cobertura preliminar:** Parcial: hash, snapshot y renderer actuales permiten validar/regenerar el documento actual; no existe historial de versiones durable.
16. **Certeza y límites:** Riesgo deducido del flujo de `ensurePdfCurrent`, servicio de generación y trigger migratorio citados. No se ejecutó la reparación ni se inspeccionó storage real; requiere validación técnica antes del diseño final.

<a id="doc-requisitos-backend-certificados-rn-cer-001-ciclos-compartidos"></a>

**Origen:** docs/requisitos/backend/certificados/RN-CER-001-ciclos-compartidos.md

---
id: RN-CER-001
titulo: Emitir certificados separados para clientes de un ciclo compartido
tipo: RN
modulo: Certificados / Planta / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/certificados/; src/planta/; src/database/migrations/"
depende_de: [RF-CER-001, RF-CER-002]
bloquea: [RF-CER-004, RA-CER-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-001 se mantiene en RF-CER-004; políticas en RA-CER-001."
---

## RN-CER-001 — Emitir certificados separados para clientes de un ciclo compartido

**Fuente principal:** `Sterinova-ERP.md` §3 y §6: un ciclo compartido produce certificados separados por cliente.

**Fuentes de contraste:** `CertificadosService`, entidades ciclo/certificado y migración con unicidad de `ciclo_id`.

1. **ID:** `RN-CER-001`.
2. **Título:** Emitir certificados separados para clientes de un ciclo compartido.
3. **Tipo:** RN.
4. **Módulo:** Certificados / Planta / Calidad.
5. **Enunciado:** Si un ciclo contiene materiales de varios clientes, emitir un certificado independiente y restringido a cada cliente y su material procesado.
6. **Reglas asociadas:** Mantener separación de datos, orden, lotes y cantidades; un certificado por cliente dentro del ciclo.
7. **Actores y permisos:** Calidad aprueba el ciclo; emisión debe conservar cliente/alcance y evitar exposición cruzada.
8. **Datos y entidades:** Un ciclo tiene relación con una orden; certificado apunta a ciclo y orden; el cliente se deriva de la cotización de esa orden. No hay relación ciclo-cliente múltiple.
9. **Flujo y validación actual:** `emitirDesdeCiclo` toma un solo cliente desde orden→cotización y crea un certificado. No hay iteración/partición multi-cliente.
10. **Criterios de aceptación:** Emitir un documento separado por cliente, incluir solo su parte del ciclo y vincular cliente, orden, lotes, cantidades y ciclo.
11. **Evidencia del backend:** La emisión resuelve `ciclo.orden.cotizacion.cliente` y no busca más clientes/órdenes asociados al ciclo.
12. **Persistencia y BD:** `ciclo_id` es OneToOne y tiene clave única, impidiendo varios certificados por ciclo. Ciclos multiorden están derivados separadamente a RF-PLA-006, pero eso no resuelve multi-cliente ni certificados.
13. **Brechas derivadas:** `B-CER-001` permanece asignada a `RF-CER-004`; políticas de partición a `RA-CER-001`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Precisar partición de materiales/cantidades, órdenes de un mismo cliente y forma de asignar versión documental; `RA-CER-001`.
15. **Estado de cobertura:** Parcial. Un solo cliente por orden/ciclo tiene soporte; ciclo compartido por varios clientes no está implementado.
16. **Certeza y límites:** Confirmado en servicio, entidades y migración inspeccionados; no se consultó una BD desplegada.

<a id="doc-requisitos-backend-comercial-rf-com-001-clientes"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-001-clientes.md

---
id: RF-COM-001
titulo: Registrar y consultar clientes
tipo: RF
modulo: Comercial
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §5"
fuente_contraste: "docs/arquitectura/api-y-contratos.md; docs/base-de-datos/esquema-y-migraciones.md; src/clientes/"
depende_de: []
bloquea: [RF-LOG-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto; importación y ciclo de vida se separan en requisitos derivados."
---

## RF-COM-001 — Registrar y consultar clientes

**Fuente principal:** `Sterinova-ERP.md` §3, «Módulos principales — Comercial»; §5, «Trazabilidad».

**Fuente de contraste:** documentación activa del backend y archivos del módulo de clientes citados abajo.

1. **ID:** `RF-COM-001`
2. **Título:** Registrar y consultar clientes.
3. **Tipo:** RF.
4. **Módulo:** Comercial.
5. **Descripción funcional:** El sistema debe permitir registrar clientes y consultar clientes existentes, incluida su consulta en el proceso comercial.
6. **Reglas de negocio asociadas:** El anexo §3 indica gestión y consulta de clientes; §5 requiere identificar qué cliente solicitó el servicio. El anexo no especifica campos obligatorios, reglas de identificación, duplicados, activación ni visibilidad.
7. **Actores / roles / ámbitos:** Los endpoints requieren `clientes.crear` o `clientes.ver`. El controlador aplica permisos con ámbito; el acceso efectivo depende de las concesiones y ámbitos del usuario. No se deducen perfiles concretos.
8. **Datos y entidades implicadas:** Entidad `Cliente`, tabla `clientes`: `id`, `razon_social`, `nit`, `contacto`, `telefono`, `email`, `direccion`, `cargo`, `ciudad`, `created_at`, `scope_id` y `creador_id`. `nit` es único. `scope_id` referencia `rbac_scopes(id)` y `creador_id` referencia `usuarios(id)`, ambos con `ON DELETE RESTRICT` e índices declarados en migración. No existe campo activo/inactivo ni tipo de identificación en la entidad.
9. **Precondiciones / postcondiciones:** Registro: usuario autenticado y autorizado con `clientes.crear`, datos válidos según `CreateClienteDto`; al guardar, se asocian ámbito y creador del contexto RBAC. Consulta: usuario autorizado con `clientes.ver`; se limita a ámbitos autorizados. Consulta individual inexistente o fuera del ámbito produce no encontrado. La base desplegada no se verificó.
10. **Criterios de aceptación:**
    - Dado un usuario autorizado y datos válidos, cuando envía `POST /clientes`, entonces el sistema crea y devuelve el cliente.
    - Dado un usuario autorizado, cuando consulta `GET /clientes` o `GET /clientes/:id`, entonces recibe los clientes visibles en su ámbito.
    - Dado un usuario sin el permiso requerido, cuando intenta registrar o consultar, entonces el backend deniega la operación. Este criterio adicional corresponde formalmente a `RNF-SEG-001`. No se ejecutaron pruebas.
11. **Evidencia en el backend:** `src/clientes/clientes.controller.ts` declara alta, listado, detalle, actualización, importación masiva y eliminación; `src/clientes/clientes.service.ts` implementa alta y consultas filtradas por `resourceWhere`; `src/clientes/dto/create-cliente.dto.ts` y `src/clientes/dto/update-cliente.dto.ts` definen las validaciones; no hay DTO bulk separado, el endpoint acepta arreglo de `CreateClienteDto` mediante `ParseArrayPipe`; `src/clientes/entities/cliente.entity.ts` define la entidad; `src/clientes/clientes.module.ts` registra `TypeOrmModule.forFeature([Cliente])`; `docs/arquitectura/api-y-contratos.md` documenta las rutas y autorización.
12. **Evidencia en BD:** `src/database/migrations/1730750400000-InitialSchema.ts` crea `clientes`, PK `id` y `UQ_clientes_nit`; `1793813200000-AddClienteDocumentFields.ts` agrega `cargo` y `ciudad`; `1794312000000-AddBackendRoleSchema.ts` agrega `scope_id`, `creador_id`, índices y FKs a `rbac_scopes(id)` y `usuarios(id)`, con `ON DELETE RESTRICT`; `docs/base-de-datos/esquema-y-migraciones.md` resume NIT único y restricciones. Aplicación en una instancia concreta: no verificable sin ejecución.
13. **Brechas detectadas:** Ninguna asignada a este requisito. El ciclo de vida se deriva a `RA-COM-001` y la importación masiva a `RF-COM-009`; ver `docs/requisitos/brechas/registro-brechas.md`.
14. **Preguntas abiertas:** Ninguna para cerrar esta ficha. El ciclo de vida queda en `RA-COM-001`; las reglas de importación se evaluarán en su ficha propia.
15. **Estado de cobertura:** Cubierto. Endpoints, DTO, servicio, entidad, autorización/ámbitos y migraciones versionadas cubren registro y consulta.
16. **Nivel de certeza:** Confirmado en código y migraciones versionadas; estado de una base desplegada no verificable sin ejecución.

**Trazabilidad:** cliente → cotización → orden → recepción → ciclo → calidad → certificado → entrega → auditoría. Esta ficha verifica registro y consulta del cliente; los enlaces posteriores se evalúan en sus requisitos respectivos.

<a id="doc-requisitos-backend-comercial-rf-com-002-productos-servicios"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-002-productos-servicios.md

---
id: RF-COM-002
titulo: Gestionar productos y servicios
tipo: RF
modulo: Comercial
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §8; §1 para dispositivos médicos"
fuente_contraste: "src/productos/; src/cotizaciones/; src/tasas-fiscales/; docs/negocio/reglas-maestras.md"
depende_de: []
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto; categorización de dispositivos y fiscalidad por producto se derivan a RA-COM-002 y RA-FIS-001."
---

## RF-COM-002 — Gestionar productos y servicios

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §8, «Estado del proyecto». §1 menciona la comercialización de dispositivos médicos.

**Fuente de contraste:** `src/productos/`, `src/cotizaciones/`, `src/tasas-fiscales/` y documentación activa del backend.

1. **ID:** `RF-COM-002`
2. **Título:** Gestionar productos y servicios.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Catálogo de productos y servicios.
5. **Descripción funcional:** El sistema debe permitir administrar productos y servicios en un catálogo común, distinguir su tipo, consultarlos para cotizaciones y añadir ítems manuales que no estén en el catálogo. Debe permitir desactivar una referencia sin borrar su registro y conservar los datos de ítems asociados a cotizaciones existentes.
6. **Reglas de negocio asociadas:** El anexo §3 requiere catálogo de productos y servicios y adición de ítems manuales. §8 confirma módulos de Productos y Tasas fiscales y marca como pendiente la integración fiscal real. §1 incluye comercialización de dispositivos médicos, sin definir categorías o atributos regulatorios. Las reglas maestras backend sirven como contraste y no sustituyen la fuente contractual.
7. **Actores / roles / ámbitos:** Administración del catálogo: permiso `productos.gestionar` con ámbito autorizado. Búsqueda para nuevas cotizaciones: `cotizaciones.crear`; búsqueda al editar: `cotizaciones.editar`. Consulta y publicación de tasas: `tasas_fiscales.gestionar` con ámbito global.
8. **Datos y entidades implicadas:** `Producto` / tabla `productos`: `id`, `scope_id`, `tipo_servicio`, `tipo_item` (`PRODUCTO` / `SERVICIO`), `categoria`, `codigo`, `referencia`, `metodo`, `presentacion`, `marca`, `descripcion`, `unidad`, `precision_cantidad`, `activo`, `created_at`, `updated_at`. Categorías: `EMPAQUES`, `MONITOREO`, `EQUIPOS`, `GENERAL`; su uso está condicionado a `INSUMOS`. `CotizacionItem` / `cotizacion_items` conserva `producto_id` nullable o un ítem manual, sus datos descriptivos, cantidades y valores. `TasaFiscal` / `tasas_fiscales` guarda impuesto, versión, tasa, vigencia, creador y motivo. `Cotizacion` conserva `iva_version_id` e `iva_tasa`; el vínculo fiscal es de cabecera, no de producto.
9. **Precondiciones / postcondiciones:** Para administrar el catálogo se requiere permiso y ámbito; las altas quedan activas y vinculadas a un ámbito. Para seleccionar una referencia en cotización debe estar activa y coincidir con el ámbito y servicio. Un ítem manual se guarda sin `producto_id`, con datos descriptivos, unidad, precisión, cantidad y valor unitario. Desactivar impide seleccionarlo en nuevas búsquedas; los ítems existentes conservan su snapshot. Al crear cotización se resuelve la tasa IVA vigente y se guarda la tasa y versión.
10. **Criterios de aceptación:**
    - Dado un usuario autorizado y datos válidos, cuando crea un producto o servicio, entonces queda registrado y aparece en las búsquedas de cotización mientras esté activo.
    - Dado un concepto ausente del catálogo, cuando se agrega manualmente a una cotización, entonces se guarda sin `producto_id` con sus datos, cantidad y precio.
    - Dado un producto asociado a una cotización existente, cuando se desactiva, entonces no aparece en búsquedas para nuevas cotizaciones y los datos del ítem existente continúan disponibles.
    - Dado que existe IVA vigente, cuando se crea la cotización, entonces se persisten en ella la tasa y versión utilizadas. Este criterio describe el snapshot actual a nivel de cotización, no una clasificación fiscal por producto.
11. **Evidencia en el backend:** `src/productos/entities/producto.entity.ts` define la entidad común y enums; `src/productos/productos.controller.ts` declara listar, buscar para crear/editar, crear, actualizar y cambiar estado; `src/productos/productos.service.ts` filtra las búsquedas por ámbito, tipo de servicio y `activo: true`, y desactiva mediante cambio de estado; DTOs en `src/productos/dto/`. `src/cotizaciones/cotizacion-item-builder.ts` valida referencias activas y ámbito/servicio, permite ítems manuales y crea el snapshot. `src/cotizaciones/entities/cotizacion-item.entity.ts` conserva los datos de línea. `src/tasas-fiscales/tasas-fiscales.controller.ts` y `tasas-fiscales.service.ts` exponen historial/publicación y resolución de IVA vigente; `src/cotizaciones/cotizaciones.service.ts` guarda tasa y versión en creación.
12. **Evidencia en BD:** `src/database/migrations/1794700000000-AddProductCatalog.ts` crea `productos`, campo `activo`, índices y FK del ámbito; no declara ruta de borrado de catálogo. `1794800000000-AddQuoteItemCatalogSnapshots.ts` agrega `producto_id` nullable y campos de snapshot a `cotizacion_items`, con FK `ON DELETE RESTRICT`. `1794225600000-AddVersionedIva.ts` crea tasas inmutables y su relación con `cotizaciones`; incluye unicidad de versión/vigencia, control de rango y triggers contra update/delete. Aplicación en una instancia concreta no verificada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha. `B-002-01` se deriva a `RA-COM-002` para decidir categorización de dispositivos médicos. `B-002-02` se deriva a `RA-FIS-001` para definir el alcance de la fiscalidad futura por producto/servicio. Ambas permanecen abiertas.
14. **Preguntas abiertas:** Las preguntas sobre categoría o atributos regulatorios de dispositivos médicos y sobre la asignación fiscal se derivan, respectivamente, a `RA-COM-002` y `RA-FIS-001`. No bloquean el flujo operativo actual ni el cierre de esta ficha.
15. **Estado de cobertura:** Cubierto para el alcance definido: catálogo común, distinción producto/servicio, uso en cotización, ítems manuales e inactivación con conservación histórica.
16. **Nivel de certeza:** Confirmado en código y migraciones versionadas para el comportamiento descrito; estado de una base desplegada no verificable sin ejecución.

**Trazabilidad:** catálogo o ítem manual → detalle de cotización con snapshot → cotización con IVA/versionado. Las etapas operativas posteriores se evalúan en sus requisitos respectivos.

<a id="doc-requisitos-backend-comercial-rf-com-003-cotizaciones-crud"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-003-cotizaciones-crud.md

---
id: RF-COM-003
titulo: Crear y editar cotizaciones con varios ítems
tipo: RF
modulo: Comercial
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/; src/database/migrations/"
depende_de: [RF-COM-001, RF-COM-002]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto en el núcleo transaccional; descuentos, reemplazo y transición EMITIDA se derivan."
---

## RF-COM-003 — Crear y editar cotizaciones con varios ítems

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §6, «Reglas operativas principales».

**Fuente de contraste:** código activo del módulo `src/cotizaciones/` y migraciones versionadas.

1. **ID:** `RF-COM-003`
2. **Título:** Crear y editar cotizaciones con varios ítems.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir crear cotizaciones en borrador con uno o más ítems, asociarlas a un cliente y editar el borrador con control de versión. Debe calcular subtotal, IVA y total según cantidades y valores unitarios. Una cotización emitida no debe modificarse directamente.
6. **Reglas de negocio asociadas:** El anexo §3 requiere crear y editar cotizaciones, y calcular cantidades, precios y descuentos. §6 prohíbe modificar directamente cotizaciones emitidas y requiere que sus correcciones se tramiten mediante nueva revisión o documento de reemplazo. Esta ficha cierra el núcleo de creación, edición e inmutabilidad; los descuentos y el flujo de reemplazo se derivan a fichas propias.
7. **Actores / roles / ámbitos:** Crear requiere `cotizaciones.crear`; editar requiere `cotizaciones.editar`. El acceso está limitado por autorización y ámbito. La aprobación y emisión usan permisos separados.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: cliente, creador, ámbito, consecutivo único, tipo de servicio, estado, versión, importes, tasa/versión IVA, condiciones y datos de emisión/snapshot. `CotizacionItem` / `cotizacion_items`: cabecera asociada, producto opcional, datos descriptivos, cantidad, valor unitario y total. Relación 1:N, declarada con cascada ORM.
9. **Precondiciones / postcondiciones:** Crear requiere cliente consultable, tipo de servicio válido y al menos un ítem válido. La cotización queda en `BORRADOR`, con ámbito/creador, consecutivo e IVA resueltos. Editar requiere que exista y sea visible, permanezca en `BORRADOR`, no tenga `fecha_emision` y la versión enviada coincida. Los ítems deben tener cantidad mayor que cero y no exceder la precisión configurada. Fallos de validación de cliente o ítem no dejan persistencia parcial.
10. **Criterios de aceptación:**
    - Dado un cliente autorizado y varios ítems válidos, cuando se crea una cotización, entonces se persisten en borrador la cabecera, todos los ítems, consecutivo e importes calculados.
    - Dado un ítem inválido en una cotización nueva, cuando falla la validación, entonces la transacción revierte y no queda cotización ni subconjunto de ítems persistido.
    - Dado un borrador con versión vigente, cuando se edita con esa versión y datos válidos, entonces los cambios de cabecera e ítems se guardan atómicamente; una versión obsoleta se rechaza.
    - Dado una cotización emitida o con estado distinto de borrador, cuando se intenta editarla, entonces el backend rechaza el cambio y conserva los datos emitidos.
11. **Evidencia en el backend:** `src/cotizaciones/cotizaciones.controller.ts` declara `POST /cotizaciones` y `PUT /cotizaciones/:id`; `src/cotizaciones/cotizaciones.service.ts` realiza alta y edición en transacciones. En creación, la consulta de cliente ocurre antes de la transacción y no persiste cotización; resolución fiscal, validación/construcción de ítems, consecutivo y guardado ocurren dentro de ella. En edición, cliente se valida antes de escribir, se construyen todos los ítems antes de borrar/recrear el detalle y la operación está transaccionada. La edición bloquea si existe `fecha_emision` o el estado no es `BORRADOR`. `src/cotizaciones/cotizacion-item-builder.ts` valida cantidad y precisión. `src/cotizaciones/dto/create-cotizacion.dto.ts`, `update-cotizacion.dto.ts` y `create-cotizacion-item.dto.ts` establecen DTOs. `src/cotizaciones/entities/estado-cotizacion.enum.ts` declara los estados. El método de emisión persiste `fecha_emision` y snapshot, pero no asigna explícitamente `EMITIDA`; esto queda en `RA-COM-004`. Descuentos quedan en `RF-COM-010` y reemplazos en `RA-COM-003`.
12. **Evidencia en BD:** `src/database/migrations/1730750400000-InitialSchema.ts` crea `cotizaciones` y `cotizacion_items`, con FK de ítem a cotización y `ON DELETE CASCADE`; la columna inicial `estado` es `VARCHAR(255)`. `1794225601000-AddQuoteEditVersion.ts` agrega `version`. `1794225600000-AddVersionedIva.ts` agrega snapshot de tasa/versión fiscal a la cabecera. `1794800000000-AddQuoteItemCatalogSnapshots.ts` agrega referencia opcional de producto y campos snapshot. No se verificó una instancia desplegada.
13. **Brechas detectadas:** No quedan brechas propias abiertas. `B-003-01` se descarta: el backend sí bloquea edición directa mediante estado y `fecha_emision`. `B-003-02` (flujo de reemplazo) se deriva a `RA-COM-003`; `B-003-03` (descuentos por ítem) a `RF-COM-010`; `B-003-04` (transición formal a `EMITIDA`) a `RA-COM-004`.
14. **Preguntas abiertas:** Las preguntas sobre vinculación de reemplazos y transición a `EMITIDA` se derivan a `RA-COM-003` y `RA-COM-004`. Las reglas de descuentos se analizarán en `RF-COM-010`; no bloquean el cierre del núcleo de esta ficha.
15. **Estado de cobertura:** Cubierto para el núcleo transaccional: creación/edición de cotizaciones con varios ítems, control de versión, validación de cantidades, atomicidad y bloqueo de edición tras emisión.
16. **Nivel de certeza:** Confirmado en código y migraciones versionadas; estado de una base desplegada no verificable sin ejecución.

**Trazabilidad:** cliente → cotización y sus ítems → orden → recepción → ciclo → calidad → certificado → entrega → auditoría. Esta ficha verifica cabecera/detalle de cotización y protección de emisión; los enlaces posteriores se cubren en requisitos de sus módulos.

<a id="doc-requisitos-backend-comercial-rf-com-004-condiciones-vigencia"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-004-condiciones-vigencia.md

---
id: RF-COM-004
titulo: Gestionar condiciones, precios y vigencia
tipo: RF
modulo: Comercial
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §2, §3"
fuente_contraste: "src/cotizaciones/; src/productos/; docs/negocio/reglas-maestras.md"
depende_de: [RF-COM-003]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; vigencia temporal y precios especiales por cliente se derivan a RF-COM-011 y RA-COM-005."
---

## RF-COM-004 — Gestionar condiciones, precios y vigencia

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §2, «Cotizaciones».

**Fuente de contraste:** documentación activa y código del backend en `src/cotizaciones/` y `src/productos/`.

1. **ID:** `RF-COM-004`
2. **Título:** Gestionar condiciones, precios y vigencia.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar en la cotización transporte, forma de pago, validez de oferta y demás condiciones comerciales; capturar precios por ítem y exigir que las condiciones estén completas antes de aprobar. El cálculo de descuentos está excluido y se analiza en `RF-COM-010`.
6. **Reglas de negocio asociadas:** El anexo §3 solicita registrar transporte y condiciones de pago, configurar vigencia y definir precios. La documentación backend de contraste requiere completar seis campos y menciona que los precios pueden variar por cliente. La fecha inicial de vigencia queda pendiente de conciliar entre el envío de la propuesta y la emisión operativa.
7. **Actores / roles / ámbitos:** El asesor captura o edita la cotización con `cotizaciones.crear` o `cotizaciones.editar`; la aprobación interna usa `cotizaciones.aprobar_interna`. El ámbito de acceso es el de la cotización. No se presume un catálogo de precios por cliente.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `tiempo_despacho`, `transporte`, `forma_pago`, `validez_oferta`, `precio_incluye`, `precio_no_incluye`, `condiciones_comerciales`, todos texto nullable; relación con `Cliente`; `fecha_emision` no es fecha de expiración. `CotizacionItem` / `cotizacion_items`: `valor_unitario` y `valor_total` por ítem. No se observó `vigente_hasta` ni entidad de precios especiales por cliente.
9. **Precondiciones / postcondiciones:** En creación y edición los campos comerciales son strings opcionales en DTO. Para aprobar, el servicio requiere que los seis campos estén completos. El precio unitario se conserva por ítem en una cotización asociada a cliente. El backend no calcula fecha de expiración ni bloquea aprobación/emisión por vencimiento; el control se deriva a `RF-COM-011`.
10. **Criterios de aceptación:**
    - Dado un borrador, cuando se intenta aprobar con alguno de los seis campos comerciales vacío, entonces el servicio rechaza la aprobación.
    - Dado una cotización con valores unitarios por ítem, cuando se guarda, entonces los valores quedan asociados a los ítems y a la cotización de su cliente.
    - Dado una oferta vencida, cuando se intenta aprobar o emitir, entonces el sistema debe bloquear la operación. Este control no está cubierto por el código inspeccionado y se especifica en `RF-COM-011`.
    - Dado que se emite una cotización, cuando se consulta su documento e información guardada, entonces sus condiciones y precios deben conservarse como parte de los datos emitidos.
11. **Evidencia en el backend:** `src/cotizaciones/entities/cotizacion.entity.ts` modela los campos de condiciones como texto. `src/cotizaciones/dto/create-cotizacion.dto.ts` y `update-cotizacion.dto.ts` los aceptan como strings opcionales. `src/cotizaciones/cotizaciones.service.ts` persiste los valores; `assertCommercialConditions` verifica que los seis tengan contenido al aprobar, pero no interpreta fechas ni compara expiración al aprobar o emitir. `src/cotizaciones/dto/create-cotizacion-item.dto.ts` recibe `valor_unitario`; `src/cotizaciones/entities/cotizacion-item.entity.ts` lo conserva por ítem. `src/productos/entities/producto.entity.ts` no contiene precio.
12. **Evidencia en BD:** `src/database/migrations/1794500000000-AddQuoteCommercialConditions.ts` agrega los seis campos como `TEXT NULL`. `src/database/migrations/1730750400000-InitialSchema.ts` crea valores de cantidad, unitario y total por ítem. No se encontró migración para fecha de expiración ni para precios maestros por cliente. Una instancia desplegada no se verificó.
13. **Brechas detectadas:** No quedan brechas propias abiertas en esta ficha. `B-004-01` se deriva a `RF-COM-011` para fecha estructurada y bloqueo por expiración. `B-004-02` se deriva a `RA-COM-005` para decidir si se requieren precios especiales reutilizables por cliente. Los seis campos comerciales sí se validan como completos al aprobar.
14. **Preguntas abiertas:** La pregunta sobre control temporal se deriva a `RF-COM-011`; la pregunta sobre reutilizar precios especiales o condiciones por cliente se deriva a `RA-COM-005`. Las derivaciones no bloquean el cierre de esta ficha como `Parcial`.
15. **Estado de cobertura:** Parcial. Los campos y precios por ítem se capturan, y las seis condiciones se exigen antes de aprobar; no existe cálculo/validación temporal de expiración. La necesidad de precios maestros por cliente queda pendiente de decisión.
16. **Nivel de certeza:** Confirmado en código para almacenamiento, captura y validación de presencia de condiciones; confirmado que no se observó fecha de expiración ni bloqueo temporal en los métodos revisados. Instancia de BD no verificada.

**Trazabilidad:** cliente → cotización con condiciones y precios por ítem → emisión y snapshot → orden y operación posterior. La expiración se desarrolla en `RF-COM-011`.

<a id="doc-requisitos-backend-comercial-rf-com-005-revision-aprobacion"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-005-revision-aprobacion.md

---
id: RF-COM-005
titulo: Revisar y aprobar cotizaciones
tipo: RF
modulo: Comercial / Cotizaciones
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §4, §6"
fuente_contraste: "src/cotizaciones/; src/rbac/; src/auth/; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-003, RF-COM-004]
bloquea: [RF-COM-006]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; transición a revisión deriva a RF-COM-012. La confirmación por contraseña se originó en RF-SEG-001 y se consolidó en RNF-SEG-002. B-005-01 descartada."
---

## RF-COM-005 — Revisar y aprobar cotizaciones

**Fuente principal:** `Sterinova-ERP.md` §3, «Módulos principales — Comercial»; §4, «Seguridad»; §6, «Reglas operativas principales».

**Fuente de contraste:** documentación activa `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 32–35; código del backend en `src/cotizaciones/`, `src/rbac/` y `src/auth/`.

1. **ID:** `RF-COM-005`.
2. **Título:** Revisar y aprobar cotizaciones.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir enviar una cotización a revisión y registrar una aprobación interna antes de enviarla al cliente. Revisión, aprobación y emisión son actuaciones diferenciadas, trazables y autorizadas.
6. **Reglas de negocio asociadas:** El anexo §3 contempla la revisión y aprobación; §6 describe la secuencia Borrador → Revisión → Aprobación interna → Envío al cliente → Aceptación → Emisión operativa. El anexo §4 establece confirmación por contraseña para aprobaciones críticas. La documentación activa precisa que quien crea la cotización no la aprueba y que aprueba el gerente comercial o administrador autorizado, distinto del creador. El backend registra la aprobación como `APROBADA`; la emisión es una operación posterior.
7. **Actores / roles / ámbitos:** El creador prepara el borrador. Aprobar requiere `cotizaciones.aprobar_interna` y acceso al ámbito de la cotización. La regla documental asigna la aprobación al gerente comercial o administrador autorizado, distinto del creador.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `estado`, `creador_id`, `aprobador_interno_id`, `aprobado_internamente_at` y `version`. El aprobador referencia a `usuarios`. `EstadoCotizacion` declara `BORRADOR`, `EN_REVISION` y `APROBADA`, además de estados posteriores.
9. **Precondiciones / postcondiciones:** Aprobar requiere cotización accesible, estado `BORRADOR`, versión vigente, creador asociado y condiciones comerciales obligatorias completas. El aprobador debe ser distinto del creador. Al aprobar, se persisten `APROBADA`, el aprobador, la fecha y una versión incrementada. La operación no exige contraseña adicional.
10. **Criterios de aceptación:**
    - Dado un borrador válido, cuando se solicita su revisión, entonces pasa a un estado de revisión registrado antes de aprobarse.
    - Dada una cotización en revisión, cuando la aprueba un usuario autorizado distinto del creador, entonces se registran aprobador, fecha y versión.
    - Dado que el creador intenta aprobar su cotización, cuando solicita la aprobación, entonces el backend la rechaza.
    - Dada una cotización que no está en el estado requerido o cuya versión no coincide, cuando se intenta aprobar, entonces el backend rechaza la operación.
    - Dada una aprobación crítica, cuando se confirma, entonces se valida la contraseña según la política transversal consolidada en `RNF-SEG-002` (antecedente: `RF-SEG-001`).
11. **Evidencia en el backend:** `src/cotizaciones/cotizaciones.controller.ts` expone `POST /cotizaciones/:id/aprobar`, protegido por `cotizaciones.aprobar_interna`, y recibe `QuoteVersionDto`. `src/cotizaciones/dto/update-cotizacion.dto.ts` define en ese DTO solo `version`, sin contraseña. `CotizacionesService.aprobar` comprueba autorización, ámbito, versión, estado y condiciones comerciales, y cambia directamente el estado a `APROBADA`. `assertApprovalCandidate` bloquea la aprobación por el creador. El enum declara `EN_REVISION`, pero no se encontró una operación del controlador/servicio que transicione a ese estado. `AuthService` tiene `verifyPassword`, pero la ruta de aprobación revisada no lo invoca.
12. **Evidencia en BD:** `Cotizacion` incluye `aprobador_interno_id` y `aprobado_internamente_at`. La migración `1794312000000-AddBackendRoleSchema.ts` agrega ambas columnas, índice y FK del aprobador a `usuarios` con `ON DELETE RESTRICT`. No se verificó una base desplegada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha porque los faltantes se derivaron. `B-005-01` se descarta: el servicio bloquea la autoaprobación. `B-005-02`, por la falta de transición a `EN_REVISION`, se deriva a `RF-COM-012`. `B-005-03`, por la confirmación por contraseña requerida transversalmente para operaciones críticas, se originó como `RF-SEG-001` y se consolidó en `RNF-SEG-002`.
14. **Preguntas abiertas:** La secuencia y separación de responsables quedan definidas en la documentación activa. La selección exacta de operaciones que requieren confirmación por contraseña queda pendiente en `RNF-SEG-002`; la implementación del paso de revisión se especificará en `RF-COM-012`.
15. **Estado de cobertura:** Parcial. El backend aplica autorización, ámbito, separación entre creador y aprobador, control de versión y estado, y registra quién y cuándo aprobó. No implementa la transición a revisión y la ruta no solicita confirmación por contraseña.
16. **Nivel de certeza:** Confirmado en el código inspeccionado que la autoaprobación se bloquea, la aprobación cambia directamente de `BORRADOR` a `APROBADA` y el DTO de aprobación no contiene contraseña. Confirmado en las fuentes documentales que revisión y aprobación son etapas separadas y que las aprobaciones críticas requieren confirmación por contraseña. No se verificó una base desplegada.

**Trazabilidad:** creador → borrador → revisión → aprobación interna → envío al cliente → aceptación → emisión operativa. El backend evidencia la aprobación interna y su responsable, pero no implementa la transición a revisión.

<a id="doc-requisitos-backend-comercial-rf-com-006-envio-aceptacion"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-006-envio-aceptacion.md

---
id: RF-COM-006
titulo: Enviar y registrar aceptación del cliente
tipo: RF
modulo: Comercial / Cotizaciones
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/; src/database/migrations/; docs/negocio/reglas-maestras.md, Módulo 3; docs/arquitectura/roles-y-permisos.md"
depende_de: [RF-COM-005]
bloquea: [RF-COM-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; lógica de envío/aceptación y bloqueo de emisión derivada a RF-COM-013; decisión sobre evidencia a RA-COM-006."
---

## RF-COM-006 — Enviar y registrar aceptación del cliente

**Fuente principal:** `Sterinova-ERP.md` §3, «Módulos principales — Comercial»; §6, «Reglas operativas principales».

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 32–35; `docs/arquitectura/roles-y-permisos.md`; código y migraciones en `src/cotizaciones/` y `src/database/migrations/`.

1. **ID:** `RF-COM-006`.
2. **Título:** Enviar y registrar aceptación del cliente.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar el envío al cliente de una cotización aprobada y registrar posteriormente la aceptación del cliente, vinculando los eventos con la versión correspondiente y conservando la trazabilidad de quien los registra.
6. **Reglas de negocio asociadas:** El anexo §3 incluye la emisión de propuestas al cliente; §6 ordena el flujo como aprobación interna → envío al cliente → aceptación → emisión operativa. La documentación activa distingue el envío de la emisión operativa. Como el cliente no inicia sesión, un usuario del ERP registra su respuesta. El tipo de evidencia —por ejemplo, orden de compra, firma o registro manual— no está definido como obligatorio. La documentación propone conservar fecha, responsable, medio, versión y alternativa aceptada.
7. **Actores / roles / ámbitos:** El asesor comercial registra el envío y la respuesta del cliente sujeto a sus permisos y ámbito. El cliente no inicia sesión en el ERP. El catálogo RBAC contiene `cotizaciones.enviar` y `cotizaciones.aceptar`, pero no se encontraron rutas que apliquen estos permisos al flujo.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `estado`, `version`, `aprobador_interno_id`, `aprobado_internamente_at`, `aceptacion_registrada_por_id` y `aceptacion_registrada_at`. El enum declara `ENVIADA` y `ACEPTADA_CLIENTE`. No se encontró en la cotización un campo para evidencia, medio, referencia documental o alternativa aceptada. `orden_compra_cliente` existe en `OrdenServicio` como dato de orden de servicio.
9. **Precondiciones / postcondiciones:** El envío debería requerir aprobación interna y vincular el evento con la versión enviada. El registro de aceptación debería requerir una cotización enviada y guardar al usuario ERP responsable y la fecha. El backend inspeccionado no implementa esas operaciones. La decisión sobre tipo de evidencia queda en `RA-COM-006`.
10. **Criterios de aceptación:**
    - Dada una cotización aprobada, cuando un usuario autorizado registra su envío, entonces queda en `ENVIADA` y se conserva la versión correspondiente.
    - Dada una cotización enviada, cuando un usuario autorizado registra la aceptación, entonces queda en `ACEPTADA_CLIENTE`.
    - Al registrar la aceptación, se persisten el usuario ERP responsable y la fecha.
    - Al registrar la aceptación, se conserva la evidencia o referencia que se acuerde en `RA-COM-006`.
    - Dada una cotización aprobada pero no aceptada, cuando se intenta emitirla, entonces el sistema impide avanzar al ciclo operativo hasta registrar la aceptación.
11. **Evidencia en el backend:** `src/cotizaciones/cotizaciones.controller.ts` expone rutas de creación, consulta, aprobación y emisión; no se encontraron endpoints de envío ni de aceptación. `UpdateCotizacionDto` no permite cambiar `estado`. `src/cotizaciones/cotizaciones.service.ts` no contiene operaciones que asignen `ENVIADA`, `ACEPTADA_CLIENTE`, `aceptacion_registrada_por_id` o `aceptacion_registrada_at`. `emitir` comprueba aprobación interna, pero no exige `ACEPTADA_CLIENTE`. `docs/arquitectura/roles-y-permisos.md` propone las rutas `/cotizaciones/:id/enviar` y `/cotizaciones/:id/aceptacion`; es documentación de diseño, no evidencia de implementación.
12. **Evidencia en BD:** `Cotizacion` declara `aceptacion_registrada_por_id` y `aceptacion_registrada_at`; `1794312000000-AddBackendRoleSchema.ts` agrega ambas columnas y la FK del usuario responsable. No se encontró campo de evidencia en `cotizaciones`. `orden_compra_cliente` se agrega a `ordenes_servicio` en `1795400000000-OrdenCompraCliente.ts`, por lo que no constituye por sí mismo evidencia de aceptación de la cotización. No se verificó una base desplegada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha porque los faltantes se derivaron. `B-006-01` (envío y transición a `ENVIADA`), `B-006-02` (registro de aceptación y transición a `ACEPTADA_CLIENTE`) y `B-006-04` (bloqueo de emisión sin aceptación) se derivan a `RF-COM-013`. `B-006-03` (tipo de evidencia de aceptación) se deriva a `RA-COM-006`.
14. **Preguntas abiertas:** ¿Qué evidencias acepta el negocio y cuáles son obligatorias: número de orden de compra, archivo firmado, correo u otra referencia? ¿Se deben registrar también el medio y la alternativa aceptada? Se plantean en `RA-COM-006`. La implementación del flujo y su compuerta de emisión se especificará en `RF-COM-013`.
15. **Estado de cobertura:** Parcial, con faltantes funcionales principales. El enum y el esquema contemplan estados de envío/aceptación y metadatos de responsable/fecha para aceptación, pero no se encontró lógica que los persista. No se conserva evidencia de aceptación y la emisión no está condicionada a ella.
16. **Nivel de certeza:** Confirmado en el controlador y servicio inspeccionados que no existen rutas/métodos de envío o aceptación, que los metadatos de aceptación no se escriben en el módulo y que emitir no exige `ACEPTADA_CLIENTE`. Confirmado en entidad y migración que existen columnas de usuario y fecha, pero no se encontró un campo de evidencia. La evidencia aceptable permanece pendiente de decisión de negocio.

**Trazabilidad:** aprobación interna → envío de una versión identificable → respuesta del cliente → registro por un usuario ERP con fecha y evidencia acordada → emisión operativa. El flujo y el bloqueo por falta de aceptación quedan en `RF-COM-013`.

<a id="doc-requisitos-backend-comercial-rf-com-007-emitir-documentos"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-007-emitir-documentos.md

---
id: RF-COM-007
titulo: Emitir documentos comerciales y conservar sus datos
tipo: RF
modulo: Comercial / Cotizaciones / Documentos
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6, §7"
fuente_contraste: "src/cotizaciones/; src/pdf/; src/database/migrations/; ../SterinovaFrontend/src/app/internal/pdf/cotizacion/"
depende_de: [RF-COM-006]
bloquea: [RF-COM-008]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; riesgo de reconstrucción de PDF histórico sin snapshot derivado a RA-COM-007."
---

## RF-COM-007 — Emitir documentos comerciales y conservar sus datos

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §6, «Reglas operativas principales»; §7, «Documentos generados».

**Fuente de contraste:** código backend en `src/cotizaciones/`, `src/pdf/` y migraciones relacionadas; ruta de renderizado del frontend en `src/app/internal/pdf/cotizacion/page.tsx` y `src/lib/pdf-render-data.ts`.

1. **ID:** `RF-COM-007`.
2. **Título:** Emitir documentos comerciales y conservar sus datos.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones / Documentos.
5. **Descripción funcional:** El sistema debe generar documentos comerciales en PDF y conservar los datos, el formato y la versión utilizados al emitirlos, para que puedan consultarse posteriormente sin reconstruir su contenido a partir de datos actuales diferentes.
6. **Reglas de negocio asociadas:** El anexo §3 incluye generar documentos comerciales y PDF; §6 dispone que los documentos emitidos conserven sus datos originales y no se modifiquen silenciosamente. §7 especifica Playwright y componentes internos de Next.js, y contempla PDF con datos congelados. §6 indica que un fallo de PDF no debe dejar el material aprobado sin documento; literalmente, esa regla se refiere a material y su documentación de calidad, pero sirve como criterio de consistencia transaccional al revisar la emisión comercial.
7. **Actores / roles / ámbitos:** Emitir requiere `cotizaciones.emitir` y autorización sobre el ámbito de la cotización. El servicio registra mediante auditoría el usuario ERP que efectúa la emisión. El cliente no interviene como usuario del sistema en esta operación.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `snapshot_datos` JSON, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision` y `version_formato_id`. El snapshot incluye datos del documento y formato, cliente, ítems, cantidades, precios, importes fiscales, condiciones comerciales e imágenes aplicables. El PDF queda en almacenamiento y se verifica con SHA-256.
9. **Precondiciones / postcondiciones:** La emisión exige aprobación interna vigente y rechaza cotizaciones anuladas. Genera un snapshot con los datos actuales y la versión documental. Si la generación finaliza correctamente, persiste snapshot, formato, fecha, ruta, hash y versión del renderer, y registra auditoría. Una cotización con `fecha_emision` ya asignada retorna como emitida sin regenerarse en ese método.
10. **Criterios de aceptación:**
    - Dada una cotización que cumple las precondiciones, cuando se emite, entonces se genera y guarda el PDF junto con el snapshot de los datos y formato usados.
    - Dado un PDF previamente emitido, cuando se consulta, entonces se sirve el archivo que coincide con el hash almacenado o se reconstruye desde el snapshot persistido.
    - Dado un fallo del renderer o del almacenamiento del PDF durante la emisión, cuando falla la operación, entonces no queda persistida una emisión parcial.
    - Dado un documento emitido, cuando cambian los datos maestros o el formato vigente, entonces el PDF histórico conserva los datos del snapshot.
    - Dado un documento histórico sin snapshot que requiere reconstrucción, cuando no se pueden recuperar fielmente los datos originales, entonces el sistema no los sustituye silenciosamente por valores actuales.
11. **Evidencia en el backend y frontend:** `CotizacionesService.emitir` ejecuta la emisión en una transacción, crea el snapshot con `buildPdfSnapshot`, llama a `PdfGeneratorService.generate` y luego persiste snapshot, fecha, ruta, hash y versión del renderer. La auditoría se guarda en la misma transacción. Un `catch` exterior elimina el PDF generado si falla la persistencia y relanza el error. `PdfGeneratorService` usa Playwright/Chromium en backend y abre una ruta interna del frontend; la página Next.js valida el token firmado y compone el PDF con `CotizacionPDF` o `LegacyCotizacionPDF` a partir del snapshot, sin consultar la cotización en la BD. `ensurePdfCurrent` verifica archivo, hash y renderer; si reconstruye, usa `snapshot_datos` cuando existe. Si falta el snapshot, su fallback construye uno con la cotización y formato consultados en ese momento.
12. **Evidencia en BD:** La entidad declara `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision` y `version_formato_id`. `1793750400000-AddDocumentFormatVersioning.ts` agrega snapshot, ruta, hash, fecha y referencia al formato. `1794225602000-AddOperationalDocumentData.ts` protege con trigger el sello asociado a cotizaciones emitidas, no el snapshot completo. No se encontró una protección equivalente para todos los campos del snapshot de cotización; `1793813500000-AddPdfRendererVersion.ts` protege snapshots de certificados. No se verificó una base desplegada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha porque `B-007-01` se deriva a `RA-COM-007`. El riesgo se presenta cuando un documento emitido carece de `snapshot_datos` y requiere reconstrucción: `ensurePdfCurrent` puede tomar datos de la cotización y el formato disponibles en ese momento. La ficha de decisión incluye además la observación sobre la protección parcial del snapshot en BD.
14. **Preguntas abiertas:** ¿Cómo debe actuar el sistema si un PDF histórico requiere reconstrucción y no tiene snapshot: bloquear y pedir restauración, generar una copia con marca «Documento Reconstruido» u otra política auditable? La pregunta y la observación de protección en BD se documentan en `RA-COM-007`.
15. **Estado de cobertura:** Parcial. La generación actual usa Playwright/Chromium desde backend y componentes Next.js del frontend; persiste snapshot, versión documental, PDF y hash. La emisión maneja fallos con transacción y limpieza compensatoria. Persiste una ruta de reconstrucción desde datos actuales si falta el snapshot, por lo que no se garantiza reproducir históricamente todos los documentos.
16. **Nivel de certeza:** Confirmado en código que la emisión guarda snapshot y PDF, que el frontend renderiza desde el snapshot recibido, que el servicio verifica el hash y que la transacción revierte la emisión si falla la generación o persistencia. Confirmado que existe una rama de reconstrucción desde datos actuales cuando falta snapshot. No se verificó la frecuencia de cotizaciones emitidas sin snapshot en una base desplegada.

**Trazabilidad:** cotización aprobada → snapshot y versión de formato → render PDF vía Playwright/Next.js → almacenamiento y hash → auditoría de emisión → consulta posterior o reconstrucción desde snapshot.

<a id="doc-requisitos-backend-comercial-rf-com-008-anulaciones"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-008-anulaciones.md

---
id: RF-COM-008
titulo: Solicitar y gestionar anulaciones
tipo: RF
modulo: Comercial / Cotizaciones
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6; regla de conservación del original en §3 — Certificados"
fuente_contraste: "src/cotizaciones/solicitud-anulacion.*; src/cotizaciones/entities/solicitud-anulacion.entity.ts; src/auditoria/; src/database/migrations/"
depende_de: [RF-COM-003, RF-COM-007]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; bloqueo de emisión con solicitud pendiente derivado a RF-COM-014, atomicidad de auditoría a RF-AUD-002 y políticas de resolución a RA-COM-008."
---

## RF-COM-008 — Solicitar y gestionar anulaciones

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §6, reglas operativas de cotizaciones. El texto «Anulación sin eliminación del original» aparece bajo «Certificados» en §3; §7 enumera documentos generados. Para cotizaciones se contrasta además la regla de documentos originales no modificables de §3 y las correcciones posteriores a emisión de §6.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 1, «Anulación con aprobación», y Módulo 3, respuesta 36; código en `src/cotizaciones/`, `src/auditoria/` y migraciones relacionadas.

1. **ID:** `RF-COM-008`.
2. **Título:** Solicitar y gestionar anulaciones.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir solicitar la anulación de una cotización con motivo, tramitar su aprobación o rechazo por un responsable autorizado y conservar el original y su trazabilidad. Una solicitud no constituye una anulación hasta que se aprueba.
6. **Reglas de negocio asociadas:** El anexo §3 incluye solicitudes de anulación con observación; §6 dispone que las cotizaciones emitidas no se modifican directamente y que sus correcciones requieren nueva revisión o documento de reemplazo. La documentación activa precisa que el asesor solicita y el administrador del área aprueba; la solicitud debe incluir observación y no equivale por sí misma a la anulación. La respuesta 36 de Cotizaciones indica que una cotización emitida que deba corregirse se anula y reemplaza.
7. **Actores / roles / ámbitos:** Solicitar requiere `solicitudes_anulacion.crear` y acceso a la cotización. Resolver requiere `solicitudes_anulacion.aprobar` y administración del ámbito correspondiente. El backend impide que la persona solicitante resuelva su propia solicitud.
8. **Datos y entidades implicadas:** `SolicitudAnulacion` / `solicitudes_anulacion`: `cotizacion_id`, `creador_id`, `aprobador_id`, `motivo`, `estado` (`PENDIENTE`, `APROBADA`, `RECHAZADA`), `created_at`, `fecha_resolucion` y `observacion_resolucion`. Relación `ManyToOne` con `Cotizacion`, FK con `ON DELETE RESTRICT`. `Cotizacion` mantiene estado, `pdf_url`, `hash_pdf`, `snapshot_datos` y `fecha_emision`.
9. **Precondiciones / postcondiciones:** Solo se puede solicitar o aprobar la anulación de cotizaciones `APROBADA` o `EMITIDA`. El motivo es obligatorio y no puede ser solo espacios. El servicio evita duplicar solicitudes pendientes bajo bloqueo transaccional. Resolver requiere una solicitud pendiente, ámbito autorizado y un aprobador distinto del solicitante. Al aprobar, la cotización pasa a `ANULADA`; se guardan decisión, responsable, fecha y observación. La observación de resolución puede estar vacía. Si hay órdenes de servicio activas, la anulación se rechaza hasta que se cancelen.
10. **Criterios de aceptación:**
    - Dada una cotización aprobada o emitida, cuando un usuario autorizado solicita anularla con motivo, entonces se crea una solicitud pendiente con solicitante y fecha.
    - Dada una solicitud pendiente, cuando el solicitante intenta resolverla, entonces el backend rechaza la operación.
    - Dada una solicitud pendiente, cuando un administrador autorizado la aprueba o rechaza, entonces se guardan decisión, responsable y fecha de resolución.
    - Dada una anulación aprobada, cuando se actualiza la cotización, entonces queda `ANULADA` y conserva el original y los datos del documento emitido.
    - Dada una cotización con órdenes de servicio activas, cuando se aprueba su anulación, entonces el sistema rechaza la operación.
    - Dada una solicitud de anulación pendiente de una cotización aprobada, cuando se intenta emitirla, entonces se aplica el bloqueo especificado en `RF-COM-014`.
11. **Evidencia en el backend:** `SolicitudAnulacionController` expone `POST /cotizaciones/:id/solicitud-anulacion`, `GET /solicitudes-anulacion/pendientes` y `PATCH /solicitudes-anulacion/:id/resolver`. Los DTO validan motivo no vacío y decisión `APROBADA` o `RECHAZADA`; observación de resolución solo requiere ser texto y admite vacío. `SolicitudAnulacionService` crea y resuelve en transacciones, comprueba ámbito y auto-resolución, evita solicitudes pendientes duplicadas y, al aprobar, cambia únicamente `quote.estado` a `ANULADA`. También rechaza anular si hay órdenes activas. La edición normal solo permite `BORRADOR`, por lo que una cotización aprobada o emitida no puede editarse mientras la solicitud está pendiente. No obstante, el bloqueo de emisión durante la pendencia se deriva a `RF-COM-014`. El evento de auditoría de anulación llama a `AuditoriaService.create` sin pasar el `EntityManager` de la transacción; su atomicidad se deriva a `RF-AUD-002`.
12. **Evidencia en BD:** `1794225603000-AddCancellationRequests.ts` crea la tabla con motivo requerido, estado enumerado, marcas de tiempo y FK a cotización, solicitante y aprobador, con `ON DELETE RESTRICT`. Al aprobar la solicitud, el servicio no borra `pdf_url`, `hash_pdf`, `snapshot_datos` ni `fecha_emision`. `DELETE /cotizaciones/:id` está denegado y `1795000000000-RevokeQuoteDeletion.ts` revoca concesiones de eliminación. No se verificó una base desplegada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha porque se derivaron los hallazgos: `B-008-01`, bloqueo de emisión mientras exista solicitud pendiente, a `RF-COM-014`; `B-008-02`, atomicidad del evento de auditoría, a `RF-AUD-002`; `B-008-03`, obligatoriedad de observación al resolver y política después del rechazo, a `RA-COM-008`.
14. **Preguntas abiertas:** ¿Debe exigirse observación al rechazar una solicitud? Si se rechaza, ¿la cotización aprobada vuelve a quedar disponible para emisión cuando cumpla las demás reglas? Estas preguntas quedan en `RA-COM-008`. La emisión mientras la solicitud está pendiente se define como bloqueada en `RF-COM-014`.
15. **Estado de cobertura:** Parcial. Existe flujo para solicitar, consultar, aprobar y rechazar; se requiere motivo, se impide la auto-resolución y se conserva la cotización anulada con su PDF/snapshot. Se derivan el bloqueo de emisión con solicitud pendiente, la atomicidad del registro de auditoría y las políticas de resolución.
16. **Nivel de certeza:** Confirmado en código y migración que el motivo es obligatorio, se guardan estado, solicitante y resolución, se bloquea la auto-resolución, la aprobación cambia el estado a `ANULADA` y no elimina los datos del PDF/snapshot. Confirmado que la emisión no verificaba solicitudes pendientes; se deriva la corrección a `RF-COM-014`. No se verificó una base desplegada.

**Trazabilidad:** cotización aprobada o emitida → solicitud con motivo, solicitante y fecha → decisión por administrador distinto → si se aprueba, estado `ANULADA` con original y PDF conservados → eventual reemplazo conforme a `RA-COM-003`.

<a id="doc-requisitos-backend-comercial-rf-com-009-importacion-clientes"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-009-importacion-clientes.md

---
id: RF-COM-009
titulo: Importación masiva de clientes
tipo: RF
modulo: Comercial
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 2, respuestas 11–20; src/clientes/"
depende_de: []
bloquea: []
brechas: [B-001-02]
historial:
  - version: 0.1
    nota: "Borrador pendiente de análisis y validación requisito por requisito."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-COM-009 — Importación masiva de clientes

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-009`.
2. **Título:** Importación masiva de clientes.
3. **Tipo:** RF.
4. **Módulo:** Comercial.
5. **Descripción funcional:** El sistema debe permitir importar clientes en lote e informar el resultado del procesamiento.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Identificación y normalización; duplicados y complementación; filas inválidas y conflictos; confirmación parcial o atómica; actualización de clientes persistidos; reporte de filas y trazabilidad del origen; restricciones y estado real de migraciones.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dado un lote válido, cuando un usuario autorizado ejecuta la importación, entonces el sistema informa cuántos registros importa y omite.<br>- Dado un identificador existente o repetido, cuando se procesa el lote, entonces el sistema no crea un duplicado conforme a la regla de identificación que se valide.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3. Contraste: docs/negocio/reglas-maestras.md, Módulo 2, respuestas 11–20; src/clientes/. Evidencia técnica leída: - `Sterinova-ERP.md` §3 incluye importación de clientes.
- `docs/negocio/reglas-maestras.md`, Módulo 2, trata identificación, normalización, duplicados, complementación de datos, conflictos y revisión; algunas reglas aparecen como propuesta o decisión pendiente.
- `src/clientes/clientes.controller.ts` declara `POST /clientes/bulk`, protegido por `clientes.importar`, y recibe un arreglo de `CreateClienteDto`.
- `src/clientes/clientes.service.ts` omite repetidos por NIT exacto en el lote y NIT ya existentes; devuelve `imported` y `skipped`.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-001-02]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Identificación y normalización; duplicados y complementación; filas inválidas y conflictos; confirmación parcial o atómica; actualización de clientes persistidos; reporte de filas y trazabilidad del origen; restricciones y estado real de migraciones.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-comercial-rf-com-010-descuentos-cotizaciones"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-010-descuentos-cotizaciones.md

---
id: RF-COM-010
titulo: Cálculo de descuentos en cotizaciones
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/cotizaciones/dto/create-cotizacion-item.dto.ts; src/cotizaciones/entities/cotizacion-item.entity.ts; src/cotizaciones/cotizacion-item-builder.ts; docs/negocio/reglas-maestras.md"
depende_de: [RF-COM-003]
bloquea: []
brechas: [B-003-03]
historial:
  - version: 0.1
    nota: "Borrador creado tras derivar B-003-03; reglas de modalidad y cálculo requieren análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-COM-010 — Cálculo de descuentos en cotizaciones

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-010`.
2. **Título:** Cálculo de descuentos en cotizaciones.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar y calcular descuentos en los ítems de una cotización y reflejar sus importes en el detalle y los totales comerciales.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Modalidad y exclusividad de descuentos; base de cálculo; redondeo y presentación; límites autorizados; persistencia del descuento y sus valores originales; recálculo de subtotal, impuestos y total; snapshot y conservación al emitir.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dado un descuento válido según la regla de negocio que se acuerde, cuando se calcula el ítem, entonces se conservan el importe bruto, descuento e importe neto de forma verificable.<br>- Dada una cotización con varios ítems y descuentos, cuando se calculan sus totales, entonces el subtotal y los importes fiscales reflejan los netos de línea conforme a la política aprobada.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3. Contraste: src/cotizaciones/dto/create-cotizacion-item.dto.ts; src/cotizaciones/entities/cotizacion-item.entity.ts; src/cotizaciones/cotizacion-item-builder.ts; docs/negocio/reglas-maestras.md. Evidencia técnica leída: - `Sterinova-ERP.md` §3 incluye cálculo de descuentos.
- `src/cotizaciones/dto/create-cotizacion-item.dto.ts` recibe cantidad y valor unitario, sin campos de descuento.
- `src/cotizaciones/entities/cotizacion-item.entity.ts` guarda cantidad, valor unitario y valor total, sin campos de descuento.
- `src/cotizaciones/cotizacion-item-builder.ts` calcula cantidad por valor unitario; no se encontró cálculo de descuento en el flujo inspeccionado.
- `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 26–29, menciona descuentos por ítem y propone modalidades porcentaje o importe; las validaciones ahí descritas no constituyen topes aprobados.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-003-03]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Modalidad y exclusividad de descuentos; base de cálculo; redondeo y presentación; límites autorizados; persistencia del descuento y sus valores originales; recálculo de subtotal, impuestos y total; snapshot y conservación al emitir.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-comercial-rf-com-011-vigencia-oferta"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-011-vigencia-oferta.md

---
id: RF-COM-011
titulo: Control de vigencia y expiración de ofertas
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §2"
fuente_contraste: "src/cotizaciones/entities/cotizacion.entity.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-004]
bloquea: []
brechas: [B-004-01]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-004-01; evento de inicio y límites de vigencia requieren validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-COM-011 — Control de vigencia y expiración de ofertas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-011`.
2. **Título:** Control de vigencia y expiración de ofertas.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe registrar una fecha estructurada de expiración de oferta (`vigente_hasta`) y debe impedir aprobar o emitir una cotización cuando la oferta haya expirado.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Evento inicial para calcular `vigente_hasta`; duración y valor por defecto; zona horaria y límite horario; inclusión del último día; prórrogas; comportamiento de ofertas vencidas ya enviadas o aceptadas; bloqueo requerido en aprobación y emisión.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una cotización con vigencia calculada, cuando se guarda y emite, entonces su fecha `vigente_hasta` queda persistida y conservada en el documento según la regla que se valide.<br>- Dada una cotización cuya fecha `vigente_hasta` ya pasó, cuando se intenta aprobar o emitir, entonces el backend rechaza la operación.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §2. Contraste: src/cotizaciones/entities/cotizacion.entity.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md, Módulo 3. Evidencia técnica leída: - `Sterinova-ERP.md` §2 solicita configurar la vigencia de la oferta.
- `src/cotizaciones/entities/cotizacion.entity.ts` guarda `validez_oferta` como texto nullable.
- `src/cotizaciones/cotizaciones.service.ts` comprueba que el campo tenga contenido al aprobar, pero no interpreta fechas ni aplica bloqueo temporal al aprobar o emitir.
- `docs/negocio/reglas-maestras.md`, Módulo 3, registra plazo de hasta 30 días y deja pendiente si inicia al enviar la propuesta o en la emisión operativa.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-004-01]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Evento inicial para calcular `vigente_hasta`; duración y valor por defecto; zona horaria y límite horario; inclusión del último día; prórrogas; comportamiento de ofertas vencidas ya enviadas o aceptadas; bloqueo requerido en aprobación y emisión.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-comercial-rf-com-012-paso-revision"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-012-paso-revision.md

---
id: RF-COM-012
titulo: Implementar el paso de Revisión (EN_REVISION)
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/estado-cotizacion.enum.ts; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-005]
bloquea: []
brechas: [B-005-02]
historial:
  - version: 0.1
    nota: "Borrador creado al derivar B-005-02; actor, controles y comportamiento de devolución requieren análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-COM-012 — Implementar el paso de Revisión (EN_REVISION)

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-012`.
2. **Título:** Implementar el paso de Revisión (EN_REVISION).
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir que una cotización en `BORRADOR` sea enviada formalmente a revisión, registrando el estado `EN_REVISION` antes de habilitar la aprobación interna.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Quién puede solicitar revisión; validaciones previas; quién puede revisar y si revisión y aprobación son una misma o distintas actuaciones; devolución a borrador y comentarios; historial de cambios/versión; permisos y ámbitos; efectos sobre cotizaciones editadas o aprobadas; auditoría y migración de registros existentes.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dado un borrador válido, cuando un usuario autorizado lo envía a revisión, entonces el sistema persiste `EN_REVISION` y deja evidencia del responsable y momento.<br>- Dada una cotización aún no revisada, cuando se intenta aprobarla, entonces el backend rechaza la operación.<br>- Dada una cotización en revisión, cuando se intenta editarla, entonces el comportamiento corresponde a la política de revisión aprobada y queda auditado.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §6. Contraste: src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/estado-cotizacion.enum.ts; docs/negocio/reglas-maestras.md, Módulo 3. Evidencia técnica leída: - `Sterinova-ERP.md` §3 contempla revisión y aprobación de cotizaciones; §6 define la secuencia Borrador → Revisión → Aprobación interna.
- `docs/negocio/reglas-maestras.md`, Módulo 3, propone `EN_REVISION` como etapa en la que el asesor solicita revisión al jefe.
- `src/cotizaciones/entities/estado-cotizacion.enum.ts` declara `EN_REVISION`.
- El endpoint de aprobación actual cambia directamente de `BORRADOR` a `APROBADA`; no se encontró una acción de envío a revisión en el controlador o servicio inspeccionados.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-005-02]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Quién puede solicitar revisión; validaciones previas; quién puede revisar y si revisión y aprobación son una misma o distintas actuaciones; devolución a borrador y comentarios; historial de cambios/versión; permisos y ámbitos; efectos sobre cotizaciones editadas o aprobadas; auditoría y migración de registros existentes.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-013-implementar-envio-aceptacion.md

---
id: RF-COM-013
titulo: Implementar flujo de envío y aceptación
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/cotizacion.entity.ts; src/database/migrations/1794312000000-AddBackendRoleSchema.ts; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-005, RF-COM-006]
bloquea: [RF-COM-007]
brechas: [B-006-01, B-006-02, B-006-04]
historial:
  - version: 0.1
    nota: "Borrador creado al agrupar B-006-01, B-006-02 y B-006-04; contrato, permisos y tratamiento de excepciones requieren análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-COM-013 — Implementar flujo de envío y aceptación

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-013`.
2. **Título:** Implementar flujo de envío y aceptación.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar el envío al cliente de una cotización aprobada, registrar su aceptación con responsable ERP y fecha, y bloquear la emisión operativa hasta que la cotización esté en estado `ACEPTADA_CLIENTE`.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Permisos y ámbito para cada acción; actor de envío y registro; condiciones de versión aprobada y no alterada; datos mínimos del envío; responsable, fecha y evidencia de aceptación; estados y transiciones; comportamiento ante rechazo, revocación o cambios posteriores; auditoría e idempotencia; bloqueo de emisión hasta aceptación; migración o tratamiento de registros existentes.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una cotización aprobada internamente, cuando un usuario autorizado registra su envío, entonces queda `ENVIADA` y se identifica la versión enviada.<br>- Dada una cotización enviada, cuando un usuario autorizado registra la aceptación del cliente, entonces queda `ACEPTADA_CLIENTE` y se guardan el usuario ERP y la fecha.<br>- Dada una cotización aprobada o enviada que aún no esté aceptada, cuando se intenta emitirla, entonces el backend rechaza la operación sin producir emisión ni efectos parciales.<br>- Dada una cotización aceptada, cuando se intenta emitirla, entonces la autorización y el resto de validaciones vigentes determinan si puede continuar.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §6. Contraste: src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/cotizacion.entity.ts; src/database/migrations/1794312000000-AddBackendRoleSchema.ts; docs/negocio/reglas-maestras.md, Módulo 3. Evidencia técnica leída: - `Sterinova-ERP.md` §3 contempla emisión de propuestas al cliente; §6 define el flujo de envío al cliente seguido de aceptación y emisión operativa.
- `docs/negocio/reglas-maestras.md`, Módulo 3, distingue envío de propuesta y emisión operativa, y propone conservar la versión enviada, fecha, responsable, medio y alternativa aceptada.
- El enum `src/cotizaciones/entities/estado-cotizacion.enum.ts` declara `ENVIADA` y `ACEPTADA_CLIENTE`.
- `src/cotizaciones/entities/cotizacion.entity.ts` y `1794312000000-AddBackendRoleSchema.ts` contemplan `aceptacion_registrada_por_id` y `aceptacion_registrada_at`, pero no se encontró lógica que las asigne.
- `CotizacionesService.emitir` comprueba aprobación interna, pero no exige `ACEPTADA_CLIENTE`.
- `docs/arquitectura/roles-y-permisos.md` propone `POST /cotizaciones/:id/enviar` y `POST /cotizaciones/:id/aceptacion`; no se encontraron esas rutas en el controlador inspeccionado.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-006-01, B-006-02, B-006-04]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Permisos y ámbito para cada acción; actor de envío y registro; condiciones de versión aprobada y no alterada; datos mínimos del envío; responsable, fecha y evidencia de aceptación; estados y transiciones; comportamiento ante rechazo, revocación o cambios posteriores; auditoría e idempotencia; bloqueo de emisión hasta aceptación; migración o tratamiento de registros existentes.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-comercial-rf-com-014-bloqueo-emision-anulacion"></a>

**Origen:** docs/requisitos/backend/comercial/RF-COM-014-bloqueo-emision-anulacion.md

---
id: RF-COM-014
titulo: Bloqueo de emisión por anulación pendiente
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/entities/solicitud-anulacion.entity.ts"
depende_de: [RF-COM-008]
bloquea: []
brechas: [B-008-01]
historial:
  - version: 0.1
    nota: "Borrador creado tras derivar B-008-01; bloqueo confirmado por decisión del usuario, detalles de concurrencia y desbloqueo requieren análisis técnico."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-COM-014 — Bloqueo de emisión por anulación pendiente

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-014`.
2. **Título:** Bloqueo de emisión por anulación pendiente.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El backend debe impedir la emisión de una cotización mientras exista una solicitud de anulación en estado `PENDIENTE` asociada a ella. La comprobación debe ser atómica frente a solicitudes concurrentes y no debe generar PDF ni marcar fecha de emisión cuando se rechace la operación.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Bloqueo en la transacción de emisión con bloqueo de fila suficiente; serialización frente a solicitud creada en paralelo; comportamiento después de rechazo o aprobación; limpieza/rollback; errores de conflicto; cobertura de rutas alternativas de emisión; impacto sobre cotizaciones ya emitidas que tengan una solicitud en trámite.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una cotización con solicitud `PENDIENTE`, cuando se intenta emitir, entonces el servicio rechaza la operación antes de generar PDF o persistir `fecha_emision`.<br>- Dada una emisión concurrente con la creación de una solicitud, cuando ambas operaciones compiten, entonces el bloqueo transaccional garantiza que no se completen ambas en un orden que deje una emisión posterior a una solicitud pendiente.<br>- Dada una solicitud resuelta, cuando ya no existe una solicitud pendiente, entonces la emisión sigue las demás reglas comerciales y de aceptación vigentes.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §6. Contraste: src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/entities/solicitud-anulacion.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §6 separa las cotizaciones emitidas y sus correcciones del flujo ordinario.
- `docs/negocio/reglas-maestras.md` define la solicitud con aprobación y establece que solicitar no equivale a anular.
- `src/cotizaciones/solicitud-anulacion.service.ts` guarda la solicitud como `PENDIENTE`, pero no cambia el estado de la cotización.
- `src/cotizaciones/cotizaciones.service.ts`, método `emitir`, valida anulación y aprobación interna, pero no consulta solicitudes de anulación pendientes.
- Una cotización aprobada puede tener una solicitud pendiente y aun así continuar al método de emisión.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-008-01]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Bloqueo en la transacción de emisión con bloqueo de fila suficiente; serialización frente a solicitud creada en paralelo; comportamiento después de rechazo o aprobación; limpieza/rollback; errores de conflicto; cobertura de rutas alternativas de emisión; impacto sobre cotizaciones ya emitidas que tengan una solicitud en trámite.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-001-recogidas-rutas"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-001-recogidas-rutas.md

---
id: RF-LOG-001
titulo: Registrar recogidas, rutas y llegadas directas
tipo: RF
modulo: Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 54; docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/; src/ordenes-servicio/"
depende_de: [RN-LOG-001]
bloquea: [RF-LOG-002, RF-LOG-008, RF-LOG-009]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-004 se derivó a RF-LOG-008 y B-LOG-006 a RF-LOG-009; B-LOG-005 queda registrado como pendiente para fase frontend."
---

## RF-LOG-001 — Registrar recogidas, rutas y llegadas directas

**Fuente principal:** `Sterinova-ERP.md` §3, «Logística», que solicita gestionar recogidas, llegadas directas y rutas con múltiples clientes.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 54, y `docs/negocio/hoja-ruta-integral-2026-11-12.md`, decisión D08; código de `src/logistica/` y las entidades de órdenes.

1. **ID:** `RF-LOG-001`.
2. **Título:** Registrar recogidas, rutas y llegadas directas.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe registrar el transporte del material desde instalaciones del cliente hasta planta, ya sea por recogida o por llegada directa, conservar los eventos y responsables por orden y permitir asociar varias órdenes/clientes a una ruta compartida.
6. **Reglas de negocio asociadas:** La recogida es la modalidad habitual y la llegada directa es excepcional. No se registra una recogida ficticia cuando el material llega directamente. La regla maestra pide transportador, conductor, placa, ruta y evidencia de entrega; las recepciones de cada orden siguen siendo independientes.
7. **Actores y permisos:** Operadores autorizados de Logística registran cambios/eventos de orden mediante permisos de gestión logística; usuario y fecha del evento deben quedar trazables.
8. **Datos y entidades implicadas:** `OrdenServicio`, `OrdenServicioEvento`, `OrdenServicioMaterial` y, para entrega final, `Entrega`. Se almacenan estado, fecha del evento, usuario, responsable, receptor/entregador y datos operativos. No existe entidad de ruta compartida ni `route_id` en la orden/evento.
9. **Precondiciones y postcondiciones:** La orden existe y el operador tiene acceso al ámbito. Una recogida registra el evento correspondiente; una llegada directa registra recepción en planta sin evento previo de recogida. La transición y la recepción mantienen su trazabilidad individual por orden.
10. **Criterios de aceptación:** (a) Registrar recogida con sus responsables y datos de transporte. (b) Agrupar órdenes de varios clientes en una ruta y asignar responsable/transportador. (c) Registrar llegada directa sin simular recogida. (d) Mantener registro de recepción y cantidades independiente por orden. (e) Consultar evidencia y datos de transporte asociados al evento/ruta.
11. **Evidencia en backend:** `LogisticaService.updateEstado` admite `PENDIENTE → EN_PLANTA`, registrando `RECEPCION_PLANTA`, así como eventos de recogida. Los eventos por orden guardan fecha, usuario y detalles. La entidad de entrega final es por orden y no implementa agrupación de rutas.
12. **Evidencia en base de datos y frontend:** `OrdenServicio` guarda `conductor_asignado` y `vehiculo_placa`, y `OrdenServicioEvento` conserva eventos por orden. No se encontró modelo o endpoint de ruta. El selector de estados en la interfaz presenta la secuencia `PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA` y no expone la llegada directa desde `PENDIENTE`.
13. **Brechas derivadas:** `B-LOG-004` (rutas compartidas) se asigna a `RF-LOG-008`; `B-LOG-006` (modalidad de ingreso explícita) se asigna a `RF-LOG-009`. `B-LOG-005` permanece únicamente en el registro de brechas como pendiente para fase frontend, conforme a la decisión del usuario. Esta ficha queda con `brechas: []` por la derivación acordada.
14. **Preguntas abiertas:** ¿Qué evidencia y datos deben ser obligatorios para la recogida y para la llegada directa? ¿Una ruta requiere estados propios además de los eventos individuales por orden? El principio de no simular recogida para llegada directa ya está definido en D08.
15. **Estado de cobertura:** Parcial. Hay eventos y trazabilidad por orden, y el backend representa recepción directa; faltan rutas compartidas y modalidad de ingreso explícita, y la llegada directa no está habilitada en la UI.
16. **Nivel de certeza y límites:** Confirmado en código y frontend inspeccionados; no se verificó una base desplegada. El anexo contractual se interpreta junto con la precisión posterior D08, que aclara el tratamiento de llegada directa.

**Trazabilidad:** Ruta/recogida o llegada directa → evento con usuario, fecha, responsable y evidencia → recepción independiente por orden.

<a id="doc-requisitos-backend-logistica-rf-log-002-recepciones"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-002-recepciones.md

---
id: RF-LOG-002
titulo: Registrar recepciones completas y parciales
tipo: RF
modulo: Logística / Recepción
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48–51; src/logistica/; src/ordenes-servicio/; SterinovaFrontend/src/app/(erp)/logistica/"
depende_de: [RN-LOG-002, RF-LOG-001]
bloquea: [RF-LOG-003, RF-LOG-010, RF-LOG-011, RF-LOG-012]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-007, B-LOG-008 y B-LOG-011 se derivaron a RF-LOG-010; B-LOG-009 a RF-LOG-011; B-LOG-010 a RF-LOG-012. RA-LOG-002 recoge preguntas de evidencia y notificación."
---

## RF-LOG-002 — Registrar recepciones completas y parciales

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, pide recibir materiales y registrar producto, lote, empaque, cantidad y recepciones parciales; §6 exige conservar los saldos pendientes.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 48–51; entidades, servicio, DTO y migración de `src/logistica/`; edición y eventos de recepción en `SterinovaFrontend/src/app/(erp)/logistica/`.

1. **ID:** `RF-LOG-002`.
2. **Título:** Registrar recepciones completas y parciales.
3. **Tipo:** RF.
4. **Módulo:** Logística / Recepción.
5. **Descripción funcional:** Registrar por orden la recepción física y sus cantidades por material, conservar diferencias frente a lo ordenado y permitir recepciones parciales con saldo pendiente trazable.
6. **Reglas de negocio asociadas:** La respuesta 48 pide remisión/factura, fecha y hora real, usuario receptor, sede de origen y evidencia. La respuesta 49 requiere marcar recepción parcial cuando llega menos, notificar a Comercial y registrar motivo si se rechaza material dañado. La respuesta 50 define fila por producto+lote+empaque y unidades/precisiones según servicio. Una diferencia no autoriza reescribir silenciosamente lo cotizado.
7. **Actores y permisos:** Personal autorizado de Logística registra recepción y resolución de diferencias; el usuario autenticado y la fecha deben quedar asociados al acto.
8. **Datos y entidades:** `RecepcionLogistica`, `RecepcionItem`, `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`; cabecera documental, materiales por línea, cantidades físicas, lote, referencia, unidad, sede, remitente y evidencia.
9. **Precondiciones y postcondiciones:** La orden existe y está accesible. Las líneas recibidas pertenecen a sus materiales; las cantidades acumuladas se comparan con las ordenadas y dejan saldo pendiente. Si hay recepción parcial o rechazo, el estado y la diferencia quedan registrados sin alterar el documento comercial.
10. **Criterios de aceptación:** (a) Guardar cabecera y detalle por material. (b) Acumular recepciones parciales y calcular saldo. (c) Rechazar cantidades acumuladas superiores a lo ordenado. (d) Identificar producto, lote, empaque y unidad con precisión adecuada. (e) Registrar la remisión y evidencia requeridas. (f) Registrar rechazo y motivo, y notificar a Comercial según la decisión de negocio.
11. **Evidencia en backend:** La antigua ruta `POST /logistica/ordenes/:id/recepcion` y `RecepcionService` fueron retirados; las entidades de recepción se conservan por integridad histórica. Las fases del acta registran cantidades por material en la orden, pero no crean líneas `RecepcionItem` ni una recepción acumulable independiente.
12. **Evidencia en BD y frontend:** `RecepcionLogistica` tiene índice único por orden; la migración `1795500000000-RecepcionLogistica.ts` crea solo la cabecera. No se encontró migración para `recepcion_items`. El formulario frontend edita las filas de `OrdenServicioMaterial` y registra un evento de llegada, no una cabecera/detalle de recepción mediante el endpoint dedicado.
13. **Brechas derivadas:** `B-LOG-007`, `B-LOG-008` y `B-LOG-011` se reasignaron a `RF-LOG-010` (persistencia de ítems, saldo y remisión); `B-LOG-009` a `RF-LOG-011` (lote/empaque y trazabilidad); `B-LOG-010` a `RF-LOG-012` (cantidades recibidas como límite de Planta). Las decisiones de evidencia y notificación se plantean en `RA-LOG-002`. La ficha validada queda con `brechas: []` por derivación acordada.
14. **Preguntas abiertas:** ¿Qué tipos de evidencia se aceptan para recepciones parciales y completas? ¿Qué evento dispara la notificación a Comercial y quién la recibe? ¿La fecha de vencimiento aplica a todos los materiales o solo a categorías definidas?
15. **Estado de cobertura:** Parcial. Existe una cabecera de recepción y eventos con datos operativos, pero no hay persistencia activa de líneas recibidas ni saldo parcial acumulado.
16. **Nivel de certeza y límites:** Confirmado en los servicios, entidades, DTO, migración y UI revisados. No se verificó una base desplegada. La obligación y alcance de vencimiento requieren definición del negocio por tipo de material.

**Trazabilidad:** Orden → cabecera y líneas de recepción → cantidades recibidas y saldo pendiente → registro de rechazo/notificación → cantidades disponibles para Planta.

<a id="doc-requisitos-backend-logistica-rf-log-003-novedades-custodia"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-003-novedades-custodia.md

---
id: RF-LOG-003
titulo: Registrar novedades, rechazos y custodia
tipo: RF
modulo: Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49, 53–55; src/logistica/; src/ordenes-servicio/; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx"
depende_de: [RF-LOG-001, RF-LOG-002]
bloquea: [RF-LOG-004, RF-LOG-013, RF-LOG-014, RF-LOG-015, RF-LOG-016]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-014 a B-LOG-017 se derivaron a RF-LOG-013 a RF-LOG-016; las políticas de disposición del material rechazado se plantean en RA-LOG-003."
---

## RF-LOG-003 — Registrar novedades, rechazos y custodia

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, solicita rechazo de materiales dañados, control de custodia, registro de novedades y conservación de evidencias/responsables; §6 contiene las reglas operativas de custodia y trazabilidad.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 49 y 53–55; servicios, DTO, entidades y migraciones de `src/logistica/` y `src/ordenes-servicio/`; UI de registro de eventos.

1. **ID:** `RF-LOG-003`.
2. **Título:** Registrar novedades, rechazos y custodia.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** Registrar incidencias y rechazos durante la operación, identificar materiales afectados y dejar trazabilidad de quién entrega y recibe el material en cada transferencia, con fecha, motivo y evidencia.
6. **Reglas de negocio asociadas:** Se pueden rechazar materiales dañados y debe guardarse el motivo. Un rechazo no autoriza a cambiar cantidades comerciales sin desviación aprobada por Calidad. Se deben diferenciar evidencia de recepción y prueba de entrega final. El empaque inadecuado puede ser motivo de rechazo.
7. **Actores y permisos:** Personal autorizado de Logística registra cambios de estado y eventos bajo los permisos correspondientes. El usuario autenticado del ERP se guarda para cada evento existente; los nombres de entregador/receptor son datos complementarios.
8. **Datos y entidades:** `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`, `RecepcionLogistica`, `RecepcionItem` y la entidad no integrada `Entrega`. Las observaciones se guardan en cabecera o en el JSON del evento; no hay una entidad de novedad operativa.
9. **Precondiciones y postcondiciones:** La orden debe existir y la transición ser válida. Recogida, recepción en planta y entrega registran actor y fecha. Un rechazo debe identificar la línea, motivo y tratamiento posterior; ese flujo por material no existe en el código actual.
10. **Criterios de aceptación:** (a) Rechazar un ítem con motivo obligatorio. (b) Mantener el ítem visible en estado pendiente de devolución, cuarentena u otro destino definido. (c) Registrar novedades a nivel de orden y de material. (d) Adjuntar evidencia al evento. (e) Registrar quien entrega y quien recibe con identidad, fecha y hora. (f) Conservar eventos repetidos cuando hay varias incidencias o entregas fallidas.
11. **Evidencia en backend:** `LogisticaService.updateEstado` crea eventos `RECOGIDA`, `RECEPCION_PLANTA` y `ENTREGA_CLIENTE`, con `usuario_id`, `ocurrido_at`, responsable, campos de entrega/recepción, cantidades y observaciones. No hay evento de novedad o rechazo de línea. `RecepcionService` admite estado `RECHAZADO` para cabecera, pero no identifica materiales ni exige motivo obligatorio.
12. **Evidencia en BD y frontend:** `OrdenServicioEvento` persiste JSON y la migración impone unicidad por `(orden_id, tipo)`, por lo que no admite más de un evento del mismo tipo en una orden. La interfaz ofrece observaciones y nombres de responsables, sin adjuntar fotos/firmas ni mostrar flujo específico para devolución o rechazo de ítem. Los campos JSON `evidencias` de recepción/entrega no forman un flujo de adjuntos integrado; `Entrega` no está conectada a controlador/servicio.
13. **Brechas derivadas:** `B-LOG-014` se asigna a `RF-LOG-013` (rechazo por ítem); `B-LOG-015` a `RF-LOG-014` (entidad de novedades); `B-LOG-016` a `RF-LOG-015` (adjuntos/evidencias); `B-LOG-017` a `RF-LOG-016` (cadena de custodia). La disposición del material rechazado se pregunta en `RA-LOG-003`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿El material rechazado queda para devolución, cuarentena, retiro por cliente u otro destino? ¿Quién decide la disposición y qué evidencia se requiere? Estas políticas se derivan a `RA-LOG-003`.
15. **Estado de cobertura:** Parcial. Existen eventos básicos por orden con usuario autenticado, fecha/hora, nombres de responsables y observaciones. No hay rechazo por ítem, novedades estructuradas, adjuntos operativos ni traspaso bilateral completo de custodia.
16. **Nivel de certeza y límites:** Confirmado en entidades, servicios, DTOs, migraciones y UI inspeccionados. No se encontró un servicio de inventario/devolución asociado a estos rechazos ni se verificó una base desplegada.

**Trazabilidad:** Orden y materiales → evento operativo → responsable/entregador/receptor → observación y evidencia → disposición del rechazo y continuidad de custodia.

<a id="doc-requisitos-backend-logistica-rf-log-004-transferencia-planta"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-004-transferencia-planta.md

---
id: RF-LOG-004
titulo: Transferir materiales entre Logística y Planta
tipo: RF
modulo: Logística / Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54–55; src/logistica/; src/ordenes-servicio/; src/planta/"
depende_de: [RF-LOG-002, RF-LOG-003]
bloquea: [RF-LOG-005, RF-LOG-017, RF-LOG-018]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-018 se derivó a RF-LOG-017; B-LOG-019 a RF-LOG-018; B-LOG-020 a RA-PLA-003."
---

## RF-LOG-004 — Transferir materiales entre Logística y Planta

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, solicita transferencias hacia Planta y control de custodia; §6 dispone que el material recibido no se reasigne dos veces.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 48 y 54–55; controlador/servicios de `src/logistica/`, listado de órdenes y ciclos en `src/planta/`.

1. **ID:** `RF-LOG-004`.
2. **Título:** Transferir materiales entre Logística y Planta.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta.
5. **Descripción funcional:** Registrar el paso de materiales desde Logística a Planta con identidad del material y cantidades transferidas, responsables de entrega y recepción, fecha/hora, evidencia y disponibilidad operativa para Planta.
6. **Reglas de negocio asociadas:** El anexo solicita transferencias a Planta y control de custodia. La regla de recepción requiere usuario receptor, fecha/hora, sede y evidencia; los estados separan recepción en planta de procesamiento. El anexo §8 reconoce inventario completo y microbodega como pendientes de negocio.
7. **Actores y permisos:** El cambio a `EN_PLANTA` se hace con `logistica.ordenes.cambiar_estado`. Planta lista órdenes con `planta.ordenes.ver` y crea ciclos con `planta.ciclos.crear`. El código no comprueba que el receptor sea un usuario autenticado de Planta.
8. **Datos y entidades:** `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`, `CicloEsterilizacion` y `CicloMaterialProcesado`. No se encontró entidad de transferencia ni de inventario/microbodega de Planta relacionada al cambio de estado.
9. **Precondiciones y postcondiciones:** La orden debe existir y la transición ser válida. El cambio a `EN_PLANTA` genera evento `RECEPCION_PLANTA` con responsable y receptor en texto. Planta puede consultar la orden y sus materiales por el estado `EN_PLANTA`; el registro de ciclo ocurre después.
10. **Criterios de aceptación:** (a) Registrar una transferencia como acto explícito de custodia. (b) Identificar a quien entrega y a quien acepta por usuario o identidad definida. (c) Registrar cantidades físicas y diferencias por material. (d) Conservar evidencia. (e) Crear movimiento/stock de Planta si el negocio decide que la transferencia alimenta inventario. (f) Exponer a Planta solo cantidades recibidas y disponibles.
11. **Evidencia en backend:** `PUT /logistica/ordenes/:id/estado` cambia la orden a `EN_PLANTA`; el servicio requiere `responsable` y `recibido_por` no vacío, guarda usuario autenticado (`usuario_id`), hora, cantidades y evento dentro de la transacción. `recibido_por` es una cadena libre, sin FK a `User` ni validación de permiso de Planta.
12. **Evidencia en BD y Planta:** `OrdenServicioEvento` guarda el evento `RECEPCION_PLANTA`. `PlantaService.findOrdenesEnPlanta` consulta órdenes en `EN_PLANTA` y carga `OrdenServicioMaterial`. `CicloMaterialProcesado` se crea al crear un ciclo, no durante el traspaso. No se encontró movimiento ni saldo de inventario en Planta. La entidad `Entrega` no participa en este flujo.
13. **Brechas derivadas:** `B-LOG-018` se asigna a `RF-LOG-017` (confirmación por usuario de Planta); `B-LOG-019` a `RF-LOG-018` (acta, cantidades y evidencia del traspaso); `B-LOG-020` a `RA-PLA-003` (política de inventario y microbodega). Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿La recepción debe confirmarla un usuario autenticado distinto de Logística? ¿La transferencia crea inventario de Planta o solo habilita la orden? ¿Qué acta y evidencia acreditan custodia y cantidades? Inventario/microbodega se consulta en `RA-PLA-003`.
15. **Estado de cobertura:** Parcial. El cambio de estado genera evento y deja la orden disponible para consulta en Planta. No hay recepción autenticada por Planta, acta bilateral de transferencia ni movimiento de inventario; su alcance se deriva a requisitos/decisión independientes.
16. **Nivel de certeza y límites:** Confirmado en controlador, servicios y entidades revisados; no se verificó una base desplegada. La necesidad y alcance de inventario quedan pendientes de decisión conforme al anexo §8.

**Trazabilidad actual:** Orden → estado `EN_PLANTA` y evento de recepción → consulta de orden/materiales en Planta → creación posterior del ciclo.

<a id="doc-requisitos-backend-logistica-rf-log-005-entregas-parciales"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-005-entregas-parciales.md

---
id: RF-LOG-005
titulo: Registrar entregas parciales y finales
tipo: RF
modulo: Logística / Entregas
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 54–56; src/logistica/; src/ordenes-servicio/; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx"
depende_de: [RF-LOG-004]
bloquea: [RF-LOG-019, RF-LOG-020, RF-LOG-021]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-021 se derivó a RF-LOG-019; B-LOG-022 a RF-LOG-020; B-LOG-023 a RF-LOG-021; criterios de cierre y liberación parcial a RA-LOG-004."
---

## RF-LOG-005 — Registrar entregas parciales y finales

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, solicita entregas parciales y finales.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 54–56; servicios, entidades, DTOs y migraciones de `src/logistica/` y `src/ordenes-servicio/`; formulario de eventos logísticos del frontend.

1. **ID:** `RF-LOG-005`.
2. **Título:** Registrar entregas parciales y finales.
3. **Tipo:** RF.
4. **Módulo:** Logística / Entregas.
5. **Descripción funcional:** Registrar cada entrega de material al cliente, completa o parcial, con cantidades por material, datos del transportista, receptor y evidencia, manteniendo el saldo pendiente hasta completar o cerrar la orden según reglas aprobadas.
6. **Reglas de negocio asociadas:** La respuesta 54 exige transportista, conductor, placa, ruta y prueba de entrega (POD) firmada o fotografiada. La respuesta 56 condiciona el despacho a liberación de Calidad y certificado cuando corresponda; alcance de la liberación en despachos parciales y regularización de excepciones siguen pendientes. La entrega al cliente debe distinguirse de la recepción en Planta.
7. **Actores y permisos:** Personal autenticado con `logistica.ordenes.cambiar_estado` registra el evento. El receptor se captura como nombre libre, no como usuario ERP.
8. **Datos y entidades:** `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`, `Entrega` y `User`. El evento guarda cantidades por material, responsable, receptor, transportista, observaciones, fecha/hora y usuario autenticado. `Entrega` modela cabecera, transporte, receptor y evidencias JSON opcionales, pero no detalla materiales/cantidades.
9. **Precondiciones y postcondiciones:** La transición permitida es `PROCESADO → ENTREGADO`. Para órdenes con método de esterilización se exige que todos sus ciclos estén aprobados y certificados. Actualmente el estado final cierra la orden tras una sola entrega y no conserva saldo para eventos posteriores.
10. **Criterios de aceptación:** (a) Registrar una o varias entregas por orden. (b) Acumular cantidades por línea y calcular saldo. (c) No cerrar orden mientras exista saldo, salvo política de excepción aprobada. (d) Registrar POD y receptor. (e) Aplicar reglas de Calidad/certificado a entregas parciales conforme a decisión de negocio. (f) Conservar cada intento o entrega fallida sin sobrescribir el anterior.
11. **Evidencia en backend:** `LogisticaService.updateEstado` acepta transición final a `ENTREGADO`, valida que los IDs cubran los materiales de la orden sin duplicados y que cada cantidad no supere la cantidad de la línea; requiere receptor textual y guarda `ENTREGA_CLIENTE` con usuario/hora. No acumula cantidades de entregas anteriores ni valida saldo total pendiente.
12. **Evidencia en BD y frontend:** `OrdenServicioEvento` tiene unicidad por `(orden_id, tipo)`, que permite un único evento `ENTREGA_CLIENTE` por orden. La UI ofrece “Marcar Entregado” desde `PROCESADO`; captura cantidades, responsable y receptor textual, pero no adjunta firma/POD. `Entrega` no está conectada a servicio/controlador y no se encontró una migración que cree su tabla.
13. **Brechas derivadas:** `B-LOG-021` se asigna a `RF-LOG-019` (entregas parciales acumulables y saldos); `B-LOG-022` a `RF-LOG-020` (POD y firmas); `B-LOG-023` a `RF-LOG-021` (integración o depuración de la entidad `Entrega`). Los criterios de cierre y despacho parcial se derivan a `RA-LOG-004`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿Qué determina la entrega completa ante faltantes, devoluciones o entregas parciales planificadas? ¿Qué condiciones de Calidad y certificado aplican a despachos parciales? ¿Qué firma/evidencia es aceptable para la POD? Se consultan en `RA-LOG-004` y `RF-LOG-020`.
15. **Estado de cobertura:** Parcial. El evento final registra cantidades, receptor, responsable y actor autenticado y verifica el límite por línea; no hay varias entregas acumulables, cálculo de saldo, cierre por saldo ni POD adjunta.
16. **Nivel de certeza y límites:** Confirmado en código, entidades, DTOs, rutas y UI revisados. No se encontró servicio/migración operativa para `Entrega`; no se verificó una base desplegada.

**Trazabilidad actual:** Ciclos aprobados/certificados → un evento `ENTREGA_CLIENTE` → estado `ENTREGADO`; una cantidad menor puede cerrar la orden sin saldo pendiente registrable.

<a id="doc-requisitos-backend-logistica-rf-log-006-precarga-items"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-006-precarga-items.md

---
id: RF-LOG-006
titulo: Precarga automática de ítems cotizados en órdenes
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46; src/logistica/logistica.service.ts; src/logistica/dto/create-orden.dto.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx"
depende_de: [RN-LOG-001, RF-COM-003]
bloquea: []
brechas: [B-LOG-001]
historial:
  - version: 0.1
    nota: "Borrador creado tras derivar B-LOG-001; definición de selección de cantidades y excepciones requiere análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-006 — Precarga automática de ítems cotizados en órdenes

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-006`.
2. **Título:** Precarga automática de ítems cotizados en órdenes.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** Al seleccionar una cotización aceptada para crear una orden, el sistema debe mostrar y precargar sus ítems como materiales candidatos. El operador debe indicar las cantidades de la orden (incluidas cantidades parciales), sin volver a transcribir descripciones y referencias. Cada material derivado debe conservar el vínculo con el ítem cotizado y un snapshot de los datos operativos usados.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Selección parcial de ítems y cantidades, control de saldo concurrente, tratamiento de variaciones entre la oferta y material físico, materiales extraordinarios, compatibilidad de campos comerciales y operativos, snapshot de descripción/referencia, migración o preservación de órdenes históricas y UX para varias sedes.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Seleccionar cotización debe cargar sus líneas elegibles con sus datos identificativos.<br>- El operador puede elegir cantidades parciales sin exceder el saldo restante por línea.<br>- Guardar una orden conserva la referencia al ítem cotizado y una copia de los datos operativos capturados.<br>- La API rechaza una orden sin materiales salvo que se defina explícitamente una excepción de negocio.<br>- Variaciones o materiales no cotizados requieren una política y trazabilidad aprobadas.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46; src/logistica/logistica.service.ts; src/logistica/dto/create-orden.dto.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere órdenes originadas en cotizaciones.
- `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 46, permite varias órdenes por cotización y ordenes parciales/por sede; una orden agrupa varios ítems de esa misma cotización.
- `LogisticaService.createOrden` recibe `dto.materiales`; no copia automáticamente los ítems desde la cotización. `CreateOrdenDto.materiales` es opcional.
- La interfaz inicializa una fila vacía, no precarga ítems al cambiar cotización y permite editar manualmente materiales.
- `OrdenServicioMaterial` contiene `cotizacion_item_id` nullable, descripción, referencia, lote, empaque y cantidad.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-001]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Selección parcial de ítems y cantidades, control de saldo concurrente, tratamiento de variaciones entre la oferta y material físico, materiales extraordinarios, compatibilidad de campos comerciales y operativos, snapshot de descripción/referencia, migración o preservación de órdenes históricas y UX para varias sedes.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-007-fix-relacion-orden"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-007-fix-relacion-orden.md

---
id: RF-LOG-007
titulo: Corrección de cardinalidad Cotización-Orden
tipo: RF
modulo: Logística / Persistencia
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46"
fuente_contraste: "src/ordenes-servicio/entities/orden-servicio.entity.ts; src/database/migrations/1795100000000-AllowMultipleOrdersPerQuote.ts; src/logistica/logistica.service.ts"
depende_de: [RN-LOG-001]
bloquea: []
brechas: [B-LOG-002]
historial:
  - version: 0.1
    nota: "Borrador para alinear el mapeo ORM con la relación de base de datos y la regla de varias órdenes por cotización."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-007 — Corrección de cardinalidad Cotización-Orden

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-007`.
2. **Título:** Corrección de cardinalidad Cotización-Orden.
3. **Tipo:** RF.
4. **Módulo:** Logística / Persistencia.
5. **Descripción funcional:** El modelo ORM de órdenes debe representar una relación de muchos a uno: cada orden pertenece a una cotización y una cotización puede tener varias órdenes. El mapeo de entidades y los contratos de consulta deben ser consistentes con la migración que elimina la unicidad de `ordenes_servicio.cotizacion_id`.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Dirección de la relación inversa en `Cotizacion`, carga eager/lazy, serialización para no duplicar payloads, sincronización de metadata ORM, índices/FK en instalaciones existentes, compatibilidad de migraciones y consultas, pruebas de lectura/escritura con dos órdenes de una cotización. No ejecutar migraciones sobre bases sin autorización.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Persistencia; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Una cotización existente puede relacionarse con dos o más órdenes sin violación de cardinalidad en ORM ni BD.<br>- Cada orden conserva exactamente una referencia obligatoria a una cotización.<br>- El borrado de cotizaciones referenciadas continúa restringido.<br>- Las consultas devuelven la cotización correcta en cada orden sin colisiones ni pérdida de relaciones.
11. **Fuentes y evidencia actual:** Fuente de requisito: docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46. Contraste: src/ordenes-servicio/entities/orden-servicio.entity.ts; src/database/migrations/1795100000000-AllowMultipleOrdersPerQuote.ts; src/logistica/logistica.service.ts. Evidencia técnica leída: - `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 46, establece que una cotización puede generar múltiples órdenes por sede o entrega parcial y que cada orden corresponde a una cotización.
- `1795100000000-AllowMultipleOrdersPerQuote.ts` reemplaza el índice único por un índice normal.
- `OrdenServicio.cotizacion` está actualmente declarada `OneToOne`, por lo que el mapeo ORM no expresa la cardinalidad permitida por la base de datos y el dominio.
- `LogisticaService.createOrden` y las consultas agregan órdenes por `cotizacion_id`.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-002]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Dirección de la relación inversa en `Cotizacion`, carga eager/lazy, serialización para no duplicar payloads, sincronización de metadata ORM, índices/FK en instalaciones existentes, compatibilidad de migraciones y consultas, pruebas de lectura/escritura con dos órdenes de una cotización. No ejecutar migraciones sobre bases sin autorización.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-008-entidad-rutas"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-008-entidad-rutas.md

---
id: RF-LOG-008
titulo: Implementar gestión de rutas compartidas
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 54; docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/"
depende_de: [RF-LOG-001, RN-LOG-001]
bloquea: []
brechas: [B-LOG-004]
historial:
  - version: 0.1
    nota: "Borrador creado por ausencia de entidad y flujo para rutas que agrupan múltiples clientes/órdenes."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-008 — Implementar gestión de rutas compartidas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-008`.
2. **Título:** Implementar gestión de rutas compartidas.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe permitir crear y gestionar rutas logísticas que agrupen varias órdenes, incluso de distintos clientes, asignando responsable, transportador, conductor y vehículo. Cada parada debe conservar su orden y eventos asociados; la ruta compartida no debe fusionar las recepciones ni la trazabilidad individual de las órdenes.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Estados y ciclo de vida de ruta, planificación vs. ejecución, orden de paradas, asignación y sustitución de transportador/conductor/vehículo, permisos por ámbito, evidencia por parada, cancelaciones y reprogramaciones, rutas parcialmente completadas, órdenes de diferentes sedes/clientes y separación de llegada directa.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Crear una ruta con responsable y datos de transporte.<br>- Asociar varias órdenes de clientes distintos y consultar sus paradas.<br>- Registrar ejecución/evidencia por parada sin reemplazar eventos de cada orden.<br>- Una orden de llegada directa no se incorpora como recogida ficticia.<br>- Auditar quién planificó y quién ejecutó la ruta, con fechas y cambios.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuesta 54; docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide rutas con múltiples clientes.
- `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 54, identifica transportador, conductor, placa, ruta y evidencia.
- Decisión D08 contempla rutas con responsable y varios clientes y establece que la llegada directa no simula recogida.
- El código inspeccionado tiene eventos y conductor/placa por orden, pero no entidad, controlador ni identificador de ruta compartida.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-004]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Estados y ciclo de vida de ruta, planificación vs. ejecución, orden de paradas, asignación y sustitución de transportador/conductor/vehículo, permisos por ámbito, evidencia por parada, cancelaciones y reprogramaciones, rutas parcialmente completadas, órdenes de diferentes sedes/clientes y separación de llegada directa.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-009-modalidad-ingreso"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-009-modalidad-ingreso.md

---
id: RF-LOG-009
titulo: Añadir modalidad de ingreso (Recogida vs. Llegada Directa)
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx"
depende_de: [RF-LOG-001]
bloquea: []
brechas: [B-LOG-006]
historial:
  - version: 0.1
    nota: "Borrador derivado de la ausencia de una modalidad explícita de ingreso por orden/evento."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-009 — Añadir modalidad de ingreso (Recogida vs. Llegada Directa)

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-009`.
2. **Título:** Añadir modalidad de ingreso (Recogida vs. Llegada Directa).
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe identificar explícitamente si el material ingresa a la operación mediante `RECOGIDA` o `LLEGADA_DIRECTA`, conservar la modalidad en la trazabilidad de la orden y guiar el flujo de estados y datos requeridos según el caso. Una llegada directa debe registrarse como recepción en planta sin crear una recogida ficticia.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Nivel de persistencia (orden, ruta o evento), estados permitidos por modalidad, campos obligatorios para entrega directa, responsable y evidencia, datos de sede de origen, cambio de modalidad por error, reportes y migración de históricos. La presentación del camino directo en frontend se mantiene fuera de una ficha de requisito backend separada por decisión del usuario.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Elegir o registrar una modalidad identificable para cada ingreso.<br>- `RECOGIDA` requiere su evento y datos operativos definidos.<br>- `LLEGADA_DIRECTA` registra recepción y origen sin evento de recogida.<br>- Consultas e historial permiten distinguir ambas modalidades.<br>- Los datos históricos sin modalidad no se clasifican automáticamente como llegada directa.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx. Evidencia técnica leída: - `Sterinova-ERP.md` §3 enumera recogidas y llegadas directas.
- La decisión D08 define recogida habitual, llegada directa excepcional y prohíbe simular recogida en ese último caso.
- El backend admite el evento de recepción directa desde `PENDIENTE`, pero no persiste un campo de modalidad explícita.
- La interfaz presenta la secuencia que pasa por `EN_RUTA` y `RECOGIDO` y no ofrece el ingreso directo desde estado pendiente.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-006]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Nivel de persistencia (orden, ruta o evento), estados permitidos por modalidad, campos obligatorios para entrega directa, responsable y evidencia, datos de sede de origen, cambio de modalidad por error, reportes y migración de históricos. La presentación del camino directo en frontend se mantiene fuera de una ficha de requisito backend separada por decisión del usuario.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-010-items-recepcion"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-010-items-recepcion.md

---
id: RF-LOG-010
titulo: Implementar persistencia de ítems y saldos de recepción
tipo: RF
modulo: Logística / Recepción
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48–49; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-logistica.entity.ts; src/logistica/entities/recepcion-item.entity.ts; src/database/migrations/1795500000000-RecepcionLogistica.ts"
depende_de: [RF-LOG-002]
bloquea: []
brechas: [B-LOG-007, B-LOG-008, B-LOG-011]
historial:
  - version: 0.1
    nota: "Borrador que agrupa persistencia de líneas, recepción parcial acumulada y remisión/factura obligatoria."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-010 — Implementar persistencia de ítems y saldos de recepción

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-010`.
2. **Título:** Implementar persistencia de ítems y saldos de recepción.
3. **Tipo:** RF.
4. **Módulo:** Logística / Recepción.
5. **Descripción funcional:** El backend debe registrar cada recepción con cabecera y detalle persistente por material de orden. Debe permitir varias recepciones parciales, acumular cantidades por línea, calcular el saldo pendiente y bloquear la cantidad acumulada que supere lo ordenado. La remisión/factura será un dato requerido conforme a la regla de recepción.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Clave de acumulación de detalle, varias remisiones/rondas por orden, cantidades decimales y unidad, rechazo de línea vs. rechazo total, locking/concurrencia, correcciones y auditoría, notificación a Comercial, evidencias y compatibilidad con eventos existentes del estado `EN_PLANTA`.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Recepción; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Guardar cabecera y líneas en una transacción.<br>- Permitir recepciones parciales sucesivas con saldo consultable por línea.<br>- Rechazar el agregado que supere cantidad ordenada y preservar la recepción previa.<br>- Exigir remisión/factura o definir explícitamente sus excepciones de negocio.<br>- No modificar silenciosamente la cantidad de la orden o cotización.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística; §6, reglas operativas. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48–49; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-logistica.entity.ts; src/logistica/entities/recepcion-item.entity.ts; src/database/migrations/1795500000000-RecepcionLogistica.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide recepción de materiales y §6 conservar saldo parcial.
- Respuestas 48–49 del Módulo 4 requieren registrar remisión/factura y recepción parcial con diferencia.
- `RecepcionService.createRecepcion` guarda la cabecera, sin insertar `RecepcionItem`.
- `RecepcionLogistica` declara índice único por `orden_id`, impidiendo múltiples cabeceras.
- La migración `1795500000000-RecepcionLogistica.ts` crea cabecera; no se encontró migración de `recepcion_items`.
- El DTO permite `numero_remision_factura` opcional y evidencia opcional.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-007, B-LOG-008, B-LOG-011]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Clave de acumulación de detalle, varias remisiones/rondas por orden, cantidades decimales y unidad, rechazo de línea vs. rechazo total, locking/concurrencia, correcciones y auditoría, notificación a Comercial, evidencias y compatibilidad con eventos existentes del estado `EN_PLANTA`.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-011-validacion-lotes"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-011-validacion-lotes.md

---
id: RF-LOG-011
titulo: Validaciones de trazabilidad en recepción (Lote/Empaque)
tipo: RF
modulo: Logística / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 50–53; src/logistica/entities/recepcion-item.entity.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts"
depende_de: [RF-LOG-002]
bloquea: []
brechas: [B-LOG-009]
historial:
  - version: 0.1
    nota: "Borrador para definir validaciones de lote, empaque, unidades y aplicabilidad de vencimiento en la trazabilidad de recepción."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-011 — Validaciones de trazabilidad en recepción (Lote/Empaque)

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-011`.
2. **Título:** Validaciones de trazabilidad en recepción (Lote/Empaque).
3. **Tipo:** RF.
4. **Módulo:** Logística / Calidad.
5. **Descripción funcional:** El sistema debe conservar la identidad trazable de cada línea recibida por producto/material, lote, empaque y unidad, con cantidad y precisión compatibles con el servicio. Debe aplicar reglas de obligatoriedad por tipo de material y conservar fecha de vencimiento cuando corresponda, una vez definida su aplicabilidad.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Clases de producto que requieren lote, productos sin lote de fabricante, dispositivos médicos, vencimiento y material sin vencimiento, códigos de barras/UDI si aplican, empaque original vs. reempaque, validación de sellado, precisión por unidad, lectura y conservación hasta certificados.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Calidad; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Una recepción diferenciada por lote/empaque crea líneas separadas.<br>- Validar lote y empaque según política configurada para el tipo de material.<br>- No tratar la ausencia de vencimiento como error universal hasta que el negocio defina aplicabilidad.<br>- Admitir las precisiones autorizadas por unidad sin redondeo inapropiado.<br>- Conservar los datos de trazabilidad desde recepción hasta procesamiento y certificado.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 50–53; src/logistica/entities/recepcion-item.entity.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts. Evidencia técnica leída: - El anexo §3 pide registro de producto, lote, empaque y cantidad.
- Respuesta 50 define una fila por combinación producto+lote+empaque y permite valores decimales según servicio/unidad.
- Respuesta 53 requiere inspeccionar integridad, tipo de empaque y sellado.
- `RecepcionItem.lote` es nullable, no tiene campo de empaque ni vencimiento; su cantidad tiene escala 2.
- `OrdenServicioMaterial` sí tiene lote y empaque opcionales, pero representa la línea de orden y no constituye la línea de recepción física.
- El evento de recepción existente usa cantidades enteras en su DTO.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-009]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Clases de producto que requieren lote, productos sin lote de fabricante, dispositivos médicos, vencimiento y material sin vencimiento, códigos de barras/UDI si aplican, empaque original vs. reempaque, validación de sellado, precisión por unidad, lectura y conservación hasta certificados.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-012-control-cantidades-planta.md

---
id: RF-LOG-012
titulo: Control de procesamiento contra cantidades realmente recibidas
tipo: RF
modulo: Logística / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49–51; Módulo 5, respuestas 62–63; src/logistica/logistica.service.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts"
depende_de: [RF-LOG-002, RN-LOG-002, RF-LOG-010]
bloquea: []
brechas: [B-LOG-010, B-LOG-012]
historial:
  - version: 0.1
    nota: "Borrador del control de saldo físico entre recepción, orden y asignaciones/procesamiento de Planta."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-012 — Control de procesamiento contra cantidades realmente recibidas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-012`.
2. **Título:** Control de procesamiento contra cantidades realmente recibidas.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta.
5. **Descripción funcional:** El sistema debe calcular la cantidad disponible para Planta desde las líneas de recepción aceptadas, restando cantidades reservadas/asignadas a ciclos y evitando que el acumulado de ciclos exceda lo realmente recibido. Las cantidades deben mantener vínculo con orden, material, lote y recepción; el control debe operar transaccionalmente frente a asignaciones concurrentes.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Definición de reservas vs. procesamiento, liberación de saldo por aborto/rechazo/reproceso, cantidad por lote/unidad, devoluciones y cuarentena, concurrencia entre ciclos y recepciones parciales, materiales manuales, compatibilidad con ciclos multiorden y conservación histórica.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Saldo disponible = cantidad recibida aceptada − cantidades reservadas/asignadas según política.<br>- Rechazar asignación que exceda el saldo, incluso bajo solicitudes concurrentes.<br>- Cada asignación conserva referencia a la línea de recepción y al material de la orden.<br>- Una recepción parcial limita el máximo que puede entrar a ciclo.<br>- Reglas de liberación ante ciclo fallido/reproceso deben ser explícitas y auditables.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §6, reglas operativas. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49–51; Módulo 5, respuestas 62–63; src/logistica/logistica.service.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §6 prohíbe reasignar dos veces material recibido y exige conservar saldos parciales.
- Respuestas 49–51 de Logística distinguen cantidades ordenadas y recibidas; respuestas 62–63 de Planta permiten distribución en ciclos parciales.
- `PlantaService.createCiclo` suma `CicloMaterialProcesado` y limita contra `OrdenServicioMaterial.cantidad`, no contra recibo físico.
- `RecepcionService` no persiste líneas de `RecepcionItem`; el evento `EN_PLANTA` deja cantidades dentro de JSON sin alimentar el saldo de Planta.
- El cálculo de órdenes puede omitir materiales con `cotizacion_item_id` nulo al calcular saldo de cotización.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-010, B-LOG-012]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Definición de reservas vs. procesamiento, liberación de saldo por aborto/rechazo/reproceso, cantidad por lote/unidad, devoluciones y cuarentena, concurrencia entre ciclos y recepciones parciales, materiales manuales, compatibilidad con ciclos multiorden y conservación histórica.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-013-rechazo-item"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-013-rechazo-item.md

---
id: RF-LOG-013
titulo: Rechazar material por ítem y registrar su disposición
tipo: RF
modulo: Logística / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49 y 53; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-item.entity.ts"
depende_de: [RF-LOG-002, RF-LOG-003]
bloquea: []
brechas: [B-LOG-014]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-014; el flujo de disposición se plantea también a decisión en RA-LOG-003."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-013 — Rechazar material por ítem y registrar su disposición

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-013`.
2. **Título:** Rechazar material por ítem y registrar su disposición.
3. **Tipo:** RF.
4. **Módulo:** Logística / Calidad.
5. **Descripción funcional:** El sistema debe permitir rechazar una o varias líneas específicas de una recepción, exigir motivo y responsable, conservar cantidad y evidencia, y mantener el material identificado hasta registrar su disposición (devolución, cuarentena, retiro u otra opción aprobada). El rechazo no debe borrar ni alterar la orden/cotización original.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Rechazo por línea vs. recepción completa, cantidad rechazada, motivo obligatorio, evidencia, autorización de Calidad, manejo de material parcialmente aceptado, devolución/recogida, saldo que puede procesar Planta, auditoría y notificación.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Calidad; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Registrar el material/lote/empaque y cantidad afectados.<br>- Exigir motivo y usuario que reporta.<br>- Preservar la historia de la recepción original.<br>- Excluir la cantidad rechazada del saldo disponible para Planta.<br>- Permitir cerrar el rechazo solo al registrar la disposición aprobada.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49 y 53; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-item.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide rechazar materiales dañados.
- Las respuestas 49 y 53 permiten rechazo por daño o empaque inadecuado, con motivo y sin alterar cantidad contratada sin desviación de Calidad.
- `RecepcionLogistica` solo guarda estado de cabecera `RECHAZADO`; `RecepcionItem` no tiene estado y no está conectado al servicio.
- No se encontró servicio logístico de devolución o inventario para material rechazado.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-014]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Rechazo por línea vs. recepción completa, cantidad rechazada, motivo obligatorio, evidencia, autorización de Calidad, manejo de material parcialmente aceptado, devolución/recogida, saldo que puede procesar Planta, auditoría y notificación.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-014-entidad-novedades"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-014-entidad-novedades.md

---
id: RF-LOG-014
titulo: Entidad y flujo de novedades logísticas
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts"
depende_de: [RF-LOG-003]
bloquea: []
brechas: [B-LOG-015]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-015; separar novedades operativas del texto libre de observaciones."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-014 — Entidad y flujo de novedades logísticas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-014`.
2. **Título:** Entidad y flujo de novedades logísticas.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe permitir registrar novedades logísticas estructuradas asociadas a una orden y, cuando aplique, a un material/lote. Cada novedad debe conservar tipo, descripción, fecha/hora, usuario responsable, estado/resolución y evidencias. Se debe admitir más de una novedad del mismo tipo o varias entregas fallidas para una orden.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Catálogo de tipos/prioridades, nivel orden vs. ítem, ciclo de resolución, responsables, relación con rechazo/desviación de Calidad, repetición y correlación de eventos, notificaciones, adjuntos, consultas/reportes y migración de observaciones históricas.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Registrar novedades distintas sin sobrescribir texto anterior.<br>- Asociar novedad a orden y opcionalmente a línea/lote.<br>- Registrar autor, responsable, tiempo, estado y resolución.<br>- Permitir varios reportes del mismo tipo y conservar historial.<br>- Relacionar evidencia y notificaciones con la novedad correspondiente.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide registro de novedades.
- `OrdenServicioEvento` tiene tipos fijos de recogida, recepción, procesamiento y entrega, con observaciones de texto en JSON.
- La migración crea índice único `(orden_id, tipo)`, que impide repetir un tipo de evento en una orden.
- `RecepcionItem` tiene observaciones por línea, pero no se integra en el flujo de recepción.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-015]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Catálogo de tipos/prioridades, nivel orden vs. ítem, ciclo de resolución, responsables, relación con rechazo/desviación de Calidad, repetición y correlación de eventos, notificaciones, adjuntos, consultas/reportes y migración de observaciones históricas.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-015-evidencias-adjuntos"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-015-evidencias-adjuntos.md

---
id: RF-LOG-015
titulo: Adjuntar evidencias a eventos logísticos
tipo: RF
modulo: Logística / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/recepcion-logistica.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/entrega.entity.ts"
depende_de: [RF-LOG-003, RF-LOG-014]
bloquea: []
brechas: [B-LOG-016]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-016; mecanismo de evidencia/firma debe alinearse con decisiones de negocio y conservación documental."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-015 — Adjuntar evidencias a eventos logísticos

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-015`.
2. **Título:** Adjuntar evidencias a eventos logísticos.
3. **Tipo:** RF.
4. **Módulo:** Logística / Documentos.
5. **Descripción funcional:** El sistema debe permitir asociar evidencia fotográfica, documental o firma al evento correspondiente de recogida, recepción, rechazo, novedad, transferencia o entrega. Cada adjunto debe conservar metadatos, usuario y fecha de carga, vínculo al evento y controles de consulta/conservación.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Tipos permitidos y tamaño, almacenamiento privado, formatos, firma digital vs. imagen, hash/integridad, permisos, retención, reemplazo/anulación, descarga, malware, acceso a través de API y vínculo con eventos repetibles.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Documentos; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Adjuntar evidencia a un evento específico y conservar vínculo no ambiguo.<br>- Registrar quién la aportó y cuándo.<br>- Controlar acceso y preservar el original conforme a política documental.<br>- Diferenciar evidencia de recepción y prueba de entrega al cliente.<br>- Evitar que la evidencia quede solo como URL o texto sin validación/retención definida.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/recepcion-logistica.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/entrega.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere evidencias y responsables.
- La respuesta 48 de Logística menciona fotos o firma de quien entrega; respuesta 54 distingue evidencia de recepción y prueba de entrega final.
- `OrdenServicioEvento.datos_json` y su DTO no modelan adjuntos.
- `RecepcionLogistica.evidencias` y `Entrega.evidencias` son campos JSON opcionales, pero no se encontró flujo de carga de archivo integrado; la entidad `Entrega` no tiene servicio/controlador operativo.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-016]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Tipos permitidos y tamaño, almacenamiento privado, formatos, firma digital vs. imagen, hash/integridad, permisos, retención, reemplazo/anulación, descarga, malware, acceso a través de API y vínculo con eventos repetibles.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-016-cadena-custodia"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-016-cadena-custodia.md

---
id: RF-LOG-016
titulo: Registrar traspasos de cadena de custodia
tipo: RF
modulo: Logística / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48, 54–55; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts"
depende_de: [RF-LOG-001, RF-LOG-003, RF-LOG-004]
bloquea: []
brechas: [B-LOG-017]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-017; requiere formalizar entrega y aceptación de custodia entre actores."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-016 — Registrar traspasos de cadena de custodia

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-016`.
2. **Título:** Registrar traspasos de cadena de custodia.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta.
5. **Descripción funcional:** El sistema debe registrar cada traspaso físico de materiales entre cliente, transportador/Logística y Planta mediante un evento explícito que identifique orden/materiales/cantidades, actor que entrega, actor receptor, usuario autenticado, fecha/hora, estado de aceptación y evidencia. La custodia no debe cambiarse solo por una actualización genérica de estado.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Roles de origen/destino, usuario ERP vs. persona externa, firma/evidencia, fecha/hora efectiva, material/lote/cantidad, rechazo de entrega, custodia durante tránsito, eventos parciales, rutas multiorden y auditoría no sobrescribible.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Identificar inequívocamente a quien entrega y quien acepta por la parte receptora.<br>- Registrar cantidades y materiales transferidos en ese acto.<br>- Guardar fecha/hora, usuario autenticado y evidencia.<br>- No marcar recepción completa en Planta sin confirmación exigida por política.<br>- Mantener historial de entregas rechazadas y reintentos sin duplicar o sobrescribir eventos.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística; §6, reglas operativas. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48, 54–55; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 solicita control de custodia y responsables; §6 define el movimiento entre Logística y Planta como parte del flujo operativo.
- `OrdenServicioEvento` guarda usuario autenticado y hora del evento; el JSON permite `entregado_por` y `recibido_por` como textos.
- El evento `RECOGIDA` registra quien entrega en cliente; `RECEPCION_PLANTA` exige `recibido_por`, pero no exige usuario autenticado de Planta ni acuse bilateral. El permiso de cambio de estado es `logistica.ordenes.cambiar_estado`.
- La secuencia de estados no genera un registro separado de traspaso de custodia.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-017]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Roles de origen/destino, usuario ERP vs. persona externa, firma/evidencia, fecha/hora efectiva, material/lote/cantidad, rechazo de entrega, custodia durante tránsito, eventos parciales, rutas multiorden y auditoría no sobrescribible.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-017-recepcion-usuario-planta"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-017-recepcion-usuario-planta.md

---
id: RF-LOG-017
titulo: Confirmación de recepción por usuario autenticado de Planta
tipo: RF
modulo: Logística / Planta / Seguridad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "src/logistica/logistica.controller.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts; src/planta/planta.controller.ts; src/users/"
depende_de: [RF-LOG-004]
bloquea: []
brechas: [B-LOG-018]
historial:
  - version: 0.1
    nota: "Borrador derivado de que el receptor en Planta se persiste como texto y no se valida como usuario autenticado de ese ámbito."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-017 — Confirmación de recepción por usuario autenticado de Planta

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-017`.
2. **Título:** Confirmación de recepción por usuario autenticado de Planta.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta / Seguridad.
5. **Descripción funcional:** La recepción de materiales en Planta debe ser confirmada por un usuario autenticado autorizado para recibir en Planta. El evento debe conservar su identificador de usuario como receptor y distinguirlo del usuario de Logística que entrega o registra el despacho.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Permisos y roles que pueden confirmar, acto de oferta/aceptación, recepción delegada, identidad temporal o externa, cantidades recibidas, diferencias, firma, fecha/hora efectiva y operación concurrente.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta / Seguridad; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Rechazar una recepción confirmada por usuario sin permiso de Planta.<br>- Guardar el ID autenticado del receptor en una relación de usuario, además del actor Logística.<br>- No aceptar cantidades sin asociarlas a la orden/material correspondiente.<br>- Auditar fecha, actor, cambios y resultado de la aceptación.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: src/logistica/logistica.controller.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts; src/planta/planta.controller.ts; src/users/. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere registrar responsables en transferencias.
- `LogisticaService.updateEstado` cambia la orden con permiso `logistica.ordenes.cambiar_estado`; el `usuario_id` guardado es quien invoca el endpoint.
- El campo `recibido_por` del evento es texto libre. No tiene relación con `User` ni valida permiso `planta.*`.
- `PlantaController` protege consulta y ciclos con permisos de Planta, pero no expone aceptación de transferencia.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-018]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Permisos y roles que pueden confirmar, acto de oferta/aceptación, recepción delegada, identidad temporal o externa, cantidades recibidas, diferencias, firma, fecha/hora efectiva y operación concurrente.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-018-acta-traspaso"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-018-acta-traspaso.md

---
id: RF-LOG-018
titulo: Acta de transferencia y cantidades físicas de traspaso
tipo: RF
modulo: Logística / Planta / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/documento-emitido.entity.ts"
depende_de: [RF-LOG-003, RF-LOG-004, RF-LOG-017]
bloquea: []
brechas: [B-LOG-019]
historial:
  - version: 0.1
    nota: "Borrador para generar acta/evidencia bilateral con detalle físico y confirmaciones de origen y destino."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-018 — Acta de transferencia y cantidades físicas de traspaso

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-018`.
2. **Título:** Acta de transferencia y cantidades físicas de traspaso.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta / Documentos.
5. **Descripción funcional:** El sistema debe documentar la transferencia Logística→Planta mediante un acta asociada a la orden y a sus líneas de material. Debe comparar cantidades entregadas y recibidas, registrar diferencias, responsables de ambas partes, momento del traspaso y evidencia/aceptación, conservando el original del acta.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Campos del documento, numeración/versionado, cantidades enviadas/recibidas/rechazadas, firmas o evidencia, diferencia parcial, impresión/PDF, conservación, correcciones, duplicidad de traspasos y relación con movimiento de inventario.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta / Documentos; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Asociar acta con orden y detalle exacto de materiales y cantidades.<br>- Capturar confirmación de origen y destino y su fecha/hora.<br>- Registrar diferencia física sin modificar la orden/cotización original.<br>- Conservar evidencia y versión emitida del acta.<br>- Permitir consulta posterior por orden y por material.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/documento-emitido.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere transferencias, responsables y evidencias.
- La respuesta 48 del Módulo 4 exige orden, remisión/factura, fecha/hora, receptor y evidencia; respuesta 54 distingue POD de recepción.
- El evento `RECEPCION_PLANTA` guarda cantidades en JSON y texto de receptor, pero no genera un acta específica ni adjuntos.
- El dominio tiene versiones/documentos emitidos para orden/acta, pero el acto de transferencia no cuenta con modelo de detalle/aceptación independiente.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-019]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Campos del documento, numeración/versionado, cantidades enviadas/recibidas/rechazadas, firmas o evidencia, diferencia parcial, impresión/PDF, conservación, correcciones, duplicidad de traspasos y relación con movimiento de inventario.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-019-entregas-acumulables"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-019-entregas-acumulables.md

---
id: RF-LOG-019
titulo: Implementar lógica de entregas parciales y control de saldos
tipo: RF
modulo: Logística / Entregas
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 54–56; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts"
depende_de: [RF-LOG-005]
bloquea: []
brechas: [B-LOG-021]
historial:
  - version: 0.1
    nota: "Borrador derivado de la falta de eventos de entrega parciales acumulables y saldo pendiente por material."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-019 — Implementar lógica de entregas parciales y control de saldos

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-019`.
2. **Título:** Implementar lógica de entregas parciales y control de saldos.
3. **Tipo:** RF.
4. **Módulo:** Logística / Entregas.
5. **Descripción funcional:** El sistema debe permitir registrar múltiples entregas por orden y material, acumular cantidades entregadas y mantener el saldo pendiente. El estado de orden `ENTREGADO` solo se asigna cuando el saldo cumple los criterios de cierre definidos; entregas parciales y fallidas conservan su historia.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Detalle por material/lote/unidad, cantidades planificadas vs. recibidas en devolución, cierres con faltantes, entregas fallidas/reintentos, concurrencia, estados parciales, inventario, devoluciones y condiciones de liberación de Calidad.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Entregas; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Registrar varias entregas y acumular por línea.<br>- Rechazar cantidades acumuladas que excedan la cantidad disponible para despacho.<br>- Calcular y mostrar saldo pendiente tras cada evento.<br>- No cerrar automáticamente con entrega menor que el saldo, salvo excepción aprobada.<br>- Mantener estados/eventos históricos y permitir consultar cada entrega.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 54–56; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide entregas parciales y finales.
- `LogisticaService.updateEstado` implementa solo transición final `PROCESADO → ENTREGADO`.
- `OrdenServicioEvento` impone unicidad de evento por tipo/orden, permitiendo un único `ENTREGA_CLIENTE`.
- El método valida cada cantidad contra la orden, pero no mantiene acumulado ni saldo remanente.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-021]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Detalle por material/lote/unidad, cantidades planificadas vs. recibidas en devolución, cierres con faltantes, entregas fallidas/reintentos, concurrencia, estados parciales, inventario, devoluciones y condiciones de liberación de Calidad.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-020-pod-firmas"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-020-pod-firmas.md

---
id: RF-LOG-020
titulo: Registro de Prueba de Entrega (POD) y firmas
tipo: RF
modulo: Logística / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/entrega.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx"
depende_de: [RF-LOG-005]
bloquea: []
brechas: [B-LOG-022]
historial:
  - version: 0.1
    nota: "Borrador derivado de que el evento de entrega solo registra receptor textual y no almacena POD/firmas adjuntas."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-020 — Registro de Prueba de Entrega (POD) y firmas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-020`.
2. **Título:** Registro de Prueba de Entrega (POD) y firmas.
3. **Tipo:** RF.
4. **Módulo:** Logística / Documentos.
5. **Descripción funcional:** El sistema debe permitir adjuntar una prueba de entrega (POD) firmada o fotografiada a cada entrega, vinculada con orden, materiales/cantidades, fecha/hora, transportista y persona receptora. Debe conservar el archivo original y metadatos de carga.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Tipos permitidos, firma manuscrita/digital, identidad del firmante, archivo y almacenamiento privado, hash, permisos de consulta, retención, descargas, correcciones y auditoría.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Documentos; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Exigir POD antes de cerrar entrega, según política aprobada.<br>- Vincular evidencia inequívocamente a la entrega y sus cantidades.<br>- Registrar usuario que carga y fecha/hora.<br>- Diferenciar POD de entrega de la evidencia de recepción en Planta.<br>- Preservar el original conforme a política documental.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/entrega.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx. Evidencia técnica leída: - La respuesta 54 del Módulo 4 exige POD firmada o fotografiada y distingue evidencia de recepción de la evidencia de entrega final.
- `EventoOrdenDto` admite `recibido_por` como texto y observaciones; no declara adjuntos.
- `OrdenServicioEvento.datos_json` no define evidencia.
- `Entrega` tiene `evidencias` JSON opcional, pero no está conectada a servicio/controlador; no se identificó flujo de carga asociado a entrega.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-022]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Tipos permitidos, firma manuscrita/digital, identidad del firmante, archivo y almacenamiento privado, hash, permisos de consulta, retención, descargas, correcciones y auditoría.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-021-fix-entidad-entrega"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-021-fix-entidad-entrega.md

---
id: RF-LOG-021
titulo: Integración o depuración técnica de la entidad Entrega
tipo: RF
modulo: Logística / Persistencia
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "src/logistica/entities/entrega.entity.ts; src/logistica/logistica.service.ts; src/logistica/logistica.controller.ts; src/database/migrations/"
depende_de: [RF-LOG-005, RF-LOG-019]
bloquea: []
brechas: [B-LOG-023]
historial:
  - version: 0.1
    nota: "Borrador para decidir integración funcional de Entrega o eliminación/deprecación segura del modelo sin uso."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-LOG-021 — Integración o depuración técnica de la entidad Entrega

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-021`.
2. **Título:** Integración o depuración técnica de la entidad Entrega.
3. **Tipo:** RF.
4. **Módulo:** Logística / Persistencia.
5. **Descripción funcional:** Resolver la divergencia entre la entidad `Entrega` y el flujo real basado en `OrdenServicioEvento`: integrar la entidad con rutas, servicio, migración y detalle de cantidades/evidencias, o retirar/deprecarla de manera controlada si el modelo de eventos será la fuente operativa. No mantener dos representaciones divergentes de una misma entrega.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Fuente de verdad, cardinalidades, relación con múltiples entregas, tablas/migraciones instaladas, compatibilidad de históricos, endpoints, permisos, auditoría, asociación de POD y comportamiento de reportes/PDF.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Persistencia; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Mantener un modelo operativo único y documentado para entregas.<br>- Si se integra `Entrega`, persistir encabezado y líneas con cantidades, estados y evidencia.<br>- Si se depreca, conservar compatibilidad y limpiar metadata/migraciones con política no destructiva.<br>- Verificar que consultas y documentos usen la misma fuente de datos.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: src/logistica/entities/entrega.entity.ts; src/logistica/logistica.service.ts; src/logistica/logistica.controller.ts; src/database/migrations/. Evidencia técnica leída: - `Entrega` declara orden, fecha, usuario, transportista, conductor, placa, receptor, evidencia JSON y estado.
- No se encontró un servicio/controlador que la persista ni migración que cree su tabla.
- La entrega real se registra como evento genérico `ENTREGA_CLIENTE` y el índice único impide eventos repetidos por orden.
- La entidad no tiene detalle por material/cantidad.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-023]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Fuente de verdad, cardinalidades, relación con múltiples entregas, tablas/migraciones instaladas, compatibilidad de históricos, endpoints, permisos, auditoría, asociación de POD y comportamiento de reportes/PDF.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-logistica-rf-log-022-inmutabilidad-documentos"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-022-inmutabilidad-documentos.md

---
id: RF-LOG-022
titulo: Emisión idempotente y conservación de PDFs logísticos
tipo: RF / Logística / Documentos
modulo: Logística / Documentos
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §7 Documentos generados; §6 Reglas operativas"
fuente_contraste: "src/logistica/logistica.controller.ts; src/logistica/logistica.service.ts; src/logistica/entities/documento-emitido.entity.ts; src/common/services/storage.service.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx"
depende_de: [RF-LOG-005, RF-LOG-007]
bloquea: []
brechas: [B-LOG-024]
historial:
  - version: 0.1
    nota: "Borrador derivado del contraste de §7; la ruta actual genera el documento al descargar y no resuelve explícitamente la recuperación idempotente del artefacto emitido."
---

## RF-LOG-022 — Emisión idempotente y conservación de PDFs logísticos

**Estado:** Borrador técnico; pendiente de validación.

1. **ID:** `RF-LOG-022`.
2. **Título:** Emisión idempotente y conservación de PDFs logísticos.
3. **Tipo:** RF / Logística / Documentos.
4. **Módulo:** Logística / Documentos.
5. **Descripción funcional:** Conservar las órdenes de servicio y actas emitidas como documentos históricos recuperables, cuyo PDF, snapshot, hash y versión de formato correspondan a la misma emisión. Repetir una descarga no debe crear una segunda emisión ni regenerar silenciosamente el documento desde datos actuales.
6. **Reglas asociadas:** La lectura de un documento emitido debe recuperar el artefacto persistido. Una corrección debe seguir un flujo explícito y mantener el original; toda regeneración técnica debe preservar el snapshot de la emisión y dejar evidencia auditable.
7. **Actores / permisos:** Usuarios de Logística autorizados mediante `logistica.ordenes.ver` y el ámbito del registro asociado.
8. **Datos y entidades:** `DocumentoEmitido` almacena tipo, consecutivo, versión de formato, `snapshot_json`, clave PDF, hash, fecha, usuario, estado y orden asociada. La relación con la orden debe seguir autorizada por ámbito.
9. **Flujo preliminar:** Solicitar el documento → verificar permiso y ámbito → si existe emisión, recuperar su snapshot/PDF/hash → si se trata de la primera emisión, generar, almacenar y registrar el documento de forma coherente → devolverlo. Reintentos y concurrencia deben producir un resultado idempotente.
10. **Criterios de aceptación preliminares:** (a) Descargar varias veces una emisión devuelve los mismos bytes y hash. (b) La segunda lectura no vuelve a renderizar ni intenta insertar otra fila. (c) Un cambio posterior de la orden no modifica el documento histórico. (d) Emisiones concurrentes no dejan PDF, hash y fila con versiones distintas. (e) Una corrección autorizada crea una versión/documento nuevo y conserva el anterior.
11. **Fuentes y evidencia actual:** §7 lista órdenes de servicio y actas; §6 requiere conservar documentos emitidos. `GET /logistica/ordenes/:id/pdf` crea el snapshot actual, renderiza y guarda bajo una clave estable antes de insertar `DocumentoEmitido`; el servicio impone unicidad por tipo/consecutivo y rechaza duplicados. La antigua ruta de descarga posterior, que buscaba un consecutivo a partir de un entero sin propagar el ámbito, fue retirada. Al emitir `ACTA_SERVICIO`, el snapshot usa `acta_consecutivo`, pero la fila `DocumentoEmitido` recibe `orden.consecutivo`. El frontend llama al endpoint de generación al previsualizar o descargar.
12. **Persistencia e interfaz:** La entidad guarda snapshot y hash; la ruta actual no consulta primero ese registro para servirlo y crea el documento desde el GET. `LocalStorageService.saveFile` escribe un temporal y luego renombra a la clave final; el comportamiento de sustitución depende del proveedor/plataforma y no fue probado. No se verificó una base desplegada.
13. **Brecha asociada:** `B-LOG-024` registra el conflicto entre regeneración/almacenamiento por clave estable, unicidad del registro y recuperación del documento emitido.
14. **Preguntas abiertas:** Definir si la primera emisión debe ser comando separado de la descarga; tratamiento de regeneraciones/correcciones, diferencias entre consecutivo de orden y acta, contrato de lectura por ID o consecutivo, propagación del ámbito y política de versiones/conservación. No se presume que todas las lecturas puedan emitir.
15. **Cobertura preliminar:** Parcial. Existe generación de PDF, snapshot, hash y persistencia documental; la recuperación idempotente, la correspondencia de identificadores y la conservación bajo reintento requieren resolución.
16. **Certeza y límites:** Confirmado mediante controlador, servicio, entidad, almacenamiento local y llamadas del frontend. El posible reemplazo de bytes bajo la misma clave no se comprobó en runtime ni en otros proveedores de almacenamiento; se documenta como riesgo técnico condicionado, no como daño demostrado.

<a id="doc-requisitos-backend-logistica-rf-log-023-acta-recepcion"></a>

**Origen:** docs/requisitos/backend/logistica/RF-LOG-023-acta-recepcion.md

---
id: RF-LOG-023
titulo: Generar y conservar actas de recepción de materiales
tipo: RF / Logística / Documentos
modulo: Logística / Recepción / Documentos
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Logística; §7 Documentos generados"
fuente_contraste: "src/logistica/recepcion.controller.ts; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-logistica.entity.ts; src/logistica/entities/recepcion-item.entity.ts; src/logistica/entities/documento-emitido.entity.ts; RA-LOG-002"
depende_de: [RF-LOG-002, RF-LOG-010]
bloquea: []
brechas: [B-LOG-025]
historial:
  - version: 0.1
    nota: "Borrador derivado de la lista contractual de documentos; se distingue el acta de recepción del Acta de Servicio generada desde la orden."
---

## RF-LOG-023 — Generar y conservar actas de recepción de materiales

**Estado:** Borrador técnico; pendiente de validación.

1. **ID:** `RF-LOG-023`.
2. **Título:** Generar y conservar actas de recepción de materiales.
3. **Tipo:** RF / Logística / Documentos.
4. **Módulo:** Logística / Recepción / Documentos.
5. **Descripción funcional:** Emitir un acta asociada a cada acto de recepción física de una orden, con el detalle que el negocio apruebe, y conservar su versión para consulta histórica. El acta debe distinguir recepción completa, parcial y materiales rechazados sin alterar la orden original.
6. **Reglas asociadas:** La recepción se relaciona con orden, fecha/hora y usuario receptor. Las líneas y saldos deben provenir de la recepción persistida; los soportes y firmas siguen la política de `RA-LOG-002`. Un acta de recepción no se debe confundir con el `ACTA_SERVICIO` emitido actualmente desde una orden.
7. **Actores / permisos:** Personal autorizado de Logística registra/consulta la recepción conforme a `logistica.recepciones.registrar`, `logistica.ordenes.ver` y el ámbito asociado.
8. **Datos y entidades:** `RecepcionLogistica`, futuras líneas persistidas de recepción, orden, usuario, sede, fecha/hora, remisión/factura, cantidades recibidas, diferencias, estado y evidencia aprobada. Campos finales y vínculo a versiones documentales requieren validación.
9. **Flujo preliminar:** Registrar una recepción y sus líneas → validar cantidades/documentos → construir un snapshot desde esos datos → emitir y conservar acta → consultar o descargar el mismo artefacto en el futuro.
10. **Criterios de aceptación preliminares:** (a) Cada acta identifica la orden y el acto de recepción al que corresponde. (b) Refleja solo líneas/cantidades recibidas en ese acto y permite comprender el saldo. (c) Conserva responsable y fecha/hora. (d) Las diferencias o rechazos aparecen de forma inequívoca. (e) La evidencia y firma cumplen `RA-LOG-002`. (f) Relecturas no alteran el documento histórico.
11. **Fuentes y evidencia actual:** La antigua ruta `POST /logistica/ordenes/:id/recepcion` y `RecepcionService` fueron retirados; las entidades de recepción permanecen para conservar datos históricos. `DocumentoEmitido` solo enumera `ORDEN` y `ACTA`; el controlador de PDF genera `ORDEN_SERVICIO` o `ACTA_SERVICIO` desde la orden, no una constancia específica de recepción.
12. **Persistencia e interfaz:** No se encontró ruta de emisión, entidad o tipo documental dedicado al acta de recepción. El detalle de líneas de recepción tampoco está conectado al servicio actual; su persistencia se deriva a `RF-LOG-010`. La UI registra eventos operativos, pero no expone una emisión de acta de recepción.
13. **Brecha asociada:** `B-LOG-025` registra la falta de un artefacto de recepción emitido, separado del acta de servicio.
14. **Preguntas abiertas:** Contenido y formato final; una acta por recepción o consolidada por orden; firma/evidencia obligatoria; emisión para parciales y rechazos; numeración, corrección y conservación. La política de evidencia se relaciona con `RA-LOG-002`.
15. **Cobertura preliminar:** Faltante para la emisión de un acta de recepción; hay una entidad de cabecera de recepción y otro tipo documental (`ACTA_SERVICIO`), pero no se encontró generación específica de la recepción.
16. **Certeza y límites:** Confirmado en controlador, servicio, entidades y UI citados. No se inspeccionó una instalación productiva ni se verificó si un formato manual externo satisface esta necesidad.

<a id="doc-requisitos-backend-logistica-rn-log-001-creacion-ordenes"></a>

**Origen:** docs/requisitos/backend/logistica/RN-LOG-001-creacion-ordenes.md

---
id: RN-LOG-001
titulo: Crear órdenes desde cotizaciones aceptadas
tipo: RN
modulo: Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 46–47; src/logistica/; src/ordenes-servicio/; src/database/migrations/1795100000000-AllowMultipleOrdersPerQuote.ts"
depende_de: [RF-COM-006, RF-COM-007]
bloquea: [RF-LOG-001, RF-LOG-006, RF-LOG-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-001 y B-LOG-002 se derivaron a RF-LOG-006 y RF-LOG-007; B-LOG-003 se derivó a RA-LOG-001."
---

## RN-LOG-001 — Crear órdenes desde cotizaciones aceptadas

**Fuente principal:** `Sterinova-ERP.md` §3, «Logística», que requiere creación de órdenes desde cotizaciones.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 46–47, que precisa aceptación del cliente, varias órdenes por cotización, entregas parciales o por sede y soporte comercial; código en `src/logistica/`, `src/ordenes-servicio/` y migraciones relacionadas.

1. **ID:** `RN-LOG-001`.
2. **Título:** Crear órdenes desde cotizaciones aceptadas.
3. **Tipo:** RN.
4. **Módulo:** Logística.
5. **Definición de la regla:** Una orden de servicio debe originarse en una cotización aceptada por el cliente. Una cotización puede originar múltiples órdenes para sedes o entregas parciales; cada orden referencia una sola cotización y agrupa ítems de esa cotización, sin mezclar cotizaciones.
6. **Reglas de negocio asociadas:** La respuesta 47 del Módulo 4 exige estado `ACEPTADA` y una Orden de Compra del cliente o autorización explícita del Jefe de Área. Si el acuerdo exige anticipo, se debe alertar; no se define bloqueo obligatorio antes de confirmación de Finanzas.
7. **Actores y permisos:** La creación corresponde al personal autorizado de Logística mediante `logistica.ordenes.crear`, con acceso al ámbito del recurso.
8. **Datos y entidades implicadas:** `Cotizacion`, `CotizacionItem`, `OrdenServicio`, `OrdenServicioMaterial`; relación por `cotizacion_id` y, para los materiales vinculados, `cotizacion_item_id`.
9. **Precondiciones y postcondiciones:** La cotización debe existir y estar `ACEPTADA_CLIENTE`; debe registrarse soporte comercial; las cantidades asignadas no deben exceder el saldo contratado. La orden se crea en estado `PENDIENTE`, con consecutivo y datos de soporte. Una cotización aceptada puede seguir generando órdenes mientras haya cantidades disponibles.
10. **Criterios de aceptación:** (a) Cotización en borrador o solo aprobada internamente: rechazar creación. (b) Cotización aceptada con soporte válido: permitir crear orden. (c) Permitir órdenes parciales o por sede. (d) No exceder el saldo de cada ítem contratado. (e) Impedir que una orden agrupe ítems de cotizaciones diferentes.
11. **Evidencia en backend:** `LogisticaService.createOrden` valida `ACEPTADA_CLIENTE`, exige `orden_compra_cliente`, bloquea la cotización durante la transacción y comprueba saldo por ítem contra órdenes no canceladas. El servicio permite varias órdenes parciales por la misma cotización.
12. **Evidencia en base de datos y frontend:** La migración `1795100000000-AllowMultipleOrdersPerQuote.ts` quita la unicidad de `ordenes_servicio.cotizacion_id`; la entidad `OrdenServicio` conserva una relación ORM `OneToOne`, inconsistente con esa cardinalidad. El formulario de `src/app/(erp)/logistica/page.tsx` inicia con materiales manuales vacíos y no carga automáticamente los ítems seleccionados de la cotización. `CreateOrdenDto.materiales` es opcional y el servicio acepta una lista vacía.
13. **Brechas derivadas:** `B-LOG-001` (precarga y trazabilidad de ítems) se asigna a `RF-LOG-006`; `B-LOG-002` (cardinalidad ORM) se asigna a `RF-LOG-007`; `B-LOG-003` (OC o autorización alternativa) se asigna a `RA-LOG-001`. Esta ficha queda con `brechas: []` por la derivación aprobada.
14. **Preguntas abiertas:** `RA-LOG-001` plantea si el soporte alternativo a la OC requiere evidencia adjunta, registro de autorizador/fecha o ambos. También debe decidirse el tratamiento de materiales manuales que no correspondan a un ítem de la cotización.
15. **Estado de cobertura:** Parcial. El estado de aceptación, el saldo de cantidades y la multiplicidad de órdenes están cubiertos por la lógica y migración. La captura/precarga de ítems y la cardinalidad del ORM requieren corrección; la alternativa de soporte comercial requiere decisión.
16. **Nivel de certeza y límites:** Confirmado en el código y migración inspeccionados; no se verificó una base desplegada. La regla de negocio contractual se complementa con respuestas 46–47 del documento activo de reglas maestras.

**Trazabilidad:** Cotización aceptada → soporte comercial → una o varias órdenes parciales/por sede → materiales asignados con saldo controlado.

<a id="doc-requisitos-backend-logistica-rn-log-002-no-reasignacion"></a>

**Origen:** docs/requisitos/backend/logistica/RN-LOG-002-no-reasignacion.md

---
id: RN-LOG-002
titulo: Evitar reasignar dos veces un material recibido
tipo: RN
modulo: Logística / Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49–51; Módulo 5, respuestas 62–63; src/logistica/; src/planta/"
depende_de: [RF-LOG-002]
bloquea: [RF-LOG-012, RF-PLA-006]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-010 y B-LOG-012 se derivaron a RF-LOG-012; B-LOG-013 se derivó a RF-PLA-006."
---

## RN-LOG-002 — Evitar reasignar dos veces un material recibido

**Fuente principal:** `Sterinova-ERP.md` §6 establece que un material recibido no puede reasignarse dos veces y que las cantidades pueden distribuirse en varios ciclos.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 49–51, y Módulo 5, respuestas 62–63; servicios y entidades de `src/logistica/` y `src/planta/`.

1. **ID:** `RN-LOG-002`.
2. **Título:** Evitar reasignar dos veces un material recibido.
3. **Tipo:** RN.
4. **Módulo:** Logística / Planta.
5. **Definición de la regla:** Una unidad física recibida solo puede asignarse una vez a una orden y a un ciclo de procesamiento. Una línea puede fraccionarse entre ciclos cuando se conserve el saldo y nunca se exceda la cantidad efectivamente recibida.
6. **Reglas asociadas:** Las recepciones parciales conservan pendiente. Las cantidades se controlan según unidad/servicio; Planta registra vínculos por material de orden y cantidad. Las precisiones 62–63 permiten distribuir una orden en ciclos parciales y asignar varias órdenes compatibles al mismo ciclo.
7. **Actores y permisos:** Logística registra y entrega material; personal autorizado de Planta asigna cantidades al crear ciclos. Los controles de integridad y saldo se aplican en backend bajo transacción.
8. **Datos y entidades:** `RecepcionItem` debería representar la cantidad física recibida; `OrdenServicioMaterial` identifica material por orden; `CicloMaterialProcesado` relaciona el material con ciclo y cantidad procesada; `CicloEsterilizacion` conserva el ciclo.
9. **Precondiciones y postcondiciones:** Solo materiales de órdenes elegibles pueden asignarse. La cantidad disponible se deriva de recepción acumulada menos reservas/procesamiento previos; no se duplica unidad alguna. Repartir una línea en ciclos distintos es válido si cada porción mantiene trazabilidad y el total no excede lo recibido.
10. **Criterios de aceptación:** (a) Rechazar material que no pertenezca a la orden/ciclo. (b) Evitar duplicar una misma asignación de cantidad. (c) Permitir fraccionamiento entre ciclos dentro del saldo recibido. (d) Serializar asignaciones concurrentes. (e) No permitir que una línea manual sin vínculo contractual eluda el control acordado. (f) Definir qué ocurre con saldo reservado por ciclo rechazado, abortado o reprocesado.
11. **Evidencia en backend:** `PlantaService.createCiclo` admite órdenes `EN_PLANTA`, restringe IDs a los materiales de esa orden, rechaza IDs repetidos y suma cantidades registradas en ciclos anteriores; impide superar `OrdenServicioMaterial.cantidad` y bloquea la orden en transacción. Así permite ciclos parciales sin sobrepasar el total de la orden.
12. **Evidencia en persistencia y límites:** `CicloMaterialProcesado` tiene FK a `OrdenServicioMaterial` y guarda cantidad, pero el agregado se compara contra cantidad ordenada, no recibida. Los eventos de recepción no alimentan este ledger. `createOrden` controla el saldo cotizado solo para líneas con `cotizacion_item_id`; materiales manuales sin vínculo se omiten del cálculo. La entidad de ciclo apunta a una sola orden, aunque la regla maestra de Planta permite varias órdenes por ciclo.
13. **Brechas derivadas:** `B-LOG-010` y `B-LOG-012` se reasignaron a `RF-LOG-012`, para controlar el procesamiento contra saldo físico recibido y cerrar bypasses de cantidad. `B-LOG-013` se reasignó a `RF-PLA-006`, para soportar varios pedidos en un ciclo. La ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿Una cantidad queda reservada al crear el ciclo o al iniciar el proceso? ¿Cómo se libera tras aborto, rechazo o reproceso? ¿Qué evidencia individualiza una unidad física cuando el material es homogéneo y se recibe por lote?
15. **Estado de cobertura:** Parcial. Existe un agregado transaccional por material de orden que evita superar la cantidad ordenada al distribuirla entre ciclos; no protege contra la cantidad realmente recibida ni asegura la identidad de la unidad física.
16. **Nivel de certeza y límites:** Confirmado en los servicios y entidades revisados; no se verificó una base desplegada. La posibilidad de ciclos parciales y multiorden proviene de las respuestas activas del Módulo 5, no de la capacidad actual del modelo de ciclo.

**Trazabilidad:** Cantidad física recibida → saldo disponible por material → reservas/asignaciones de ciclo → procesamiento, rechazo o reproceso con historia conservada.

<a id="doc-requisitos-backend-planta-rf-pla-001-equipos-disponibilidad"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-001-equipos-disponibilidad.md

---
id: RF-PLA-001
titulo: Registrar equipos y disponibilidad
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Planta; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 58–60; src/planta/"
depende_de: []
bloquea: [RF-PLA-007, RF-PLA-008, RF-PLA-009]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-001 se deriva a RF-PLA-007; B-PLA-002 a RF-PLA-008; B-PLA-003 a RF-PLA-009; las políticas pendientes se derivan a RA-PLA-004."
---

## RF-PLA-001 — Registrar equipos y disponibilidad

**Fuente principal:** `Sterinova-ERP.md` §3, gestión de equipos EtO, vapor y lavandería; §6, regla «Un equipo no disponible no puede utilizarse».

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 58–60; entidades, DTO y servicio en `src/planta/`.

1. **ID:** `RF-PLA-001`.
2. **Título:** Registrar equipos y disponibilidad.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Mantener catálogo de equipos con identificador trazable, tipo/método, capacidad, ubicación y disponibilidad; impedir programar o registrar ciclos con equipo inhabilitado.
6. **Reglas de negocio asociadas:** El anexo exige gestionar equipos EtO, vapor y lavandería y prohíbe utilizar equipos no disponibles. Las respuestas 59–60 de reglas maestras hacen obligatorio el catálogo de esterilización, con código único, método EtO/Vapor, capacidad, ubicación y estados Operativo/Mantenimiento/Fuera de Servicio. Calibración vencida, mantenimiento y Fuera de Servicio impiden programación/uso. Solo Calidad o Jefe de Planta puede reactivar después de cargar certificado. La clasificación de lavandería y las unidades de capacidad permanecen sin definir.
7. **Actores y permisos:** Jefe de Planta y Calidad administran catálogo/reactivación; operador de Planta selecciona equipo habilitado al registrar operación. Los permisos técnicos concretos se deben alinear con RBAC.
8. **Datos y entidades:** No se encontró entidad `Equipo` en `src/planta/`. `CicloEsterilizacion` persiste `equipo` como texto libre de hasta 100 caracteres y `metodo` como enum `ETO`/`VAPOR`; el estado del ciclo describe el proceso, no la disponibilidad del activo.
9. **Precondiciones y postcondiciones:** Requisito esperado: equipo del catálogo compatible, operativo y con calibración vigente. Implementación actual: al crear ciclo valida orden `EN_PLANTA`, operador existente, método de orden y protocolo compatible; guarda el texto de equipo sin consultar catálogo, disponibilidad o capacidad.
10. **Criterios de aceptación:** (a) Administrar equipos por catálogo con código único, tipo/método, capacidad, ubicación y estado. (b) Seleccionarlos por identificador al programar/crear ciclo. (c) Bloquear equipo en mantenimiento, fuera de servicio o con calibración vencida. (d) Restringir administración/reactivación y registrar certificado y actor. (e) Validar la carga respecto de capacidad en unidades definidas por tipo. (f) Modelar lavandería sin forzarla al ciclo EtO/Vapor.
11. **Evidencia en backend:** `src/planta/entities/ciclo-esterilizacion.entity.ts` define `equipo: varchar(100)` y enum `MetodoEsterilizacion` solo EtO/Vapor. `src/planta/dto/create-ciclo.dto.ts` exige string no vacío. `src/planta/planta.service.ts`, `createCiclo`, valida orden/método/protocolo/cantidades, pero no disponibilidad ni capacidad del equipo.
12. **Evidencia en BD y documentación técnica:** No hay entidad/relación de catálogo en el módulo Planta; el ciclo no enlaza un activo ni conserva estado/capacidad/ubicación/calibración de este. La ausencia de calibración o capacidad en el modelo de ciclo no demuestra cómo esté configurada una BD desplegada; esta ficha contrasta el código versionado.
13. **Brechas derivadas:** `B-PLA-001` se asigna a `RF-PLA-007` (catálogo y tipos de equipos); `B-PLA-002` a `RF-PLA-008` (disponibilidad, mantenimiento y calibración); `B-PLA-003` a `RF-PLA-009` (validación de capacidad). Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Se derivan a `RA-PLA-004`: política/clasificación de equipos de lavandería; unidades y criterios de capacidad; metadatos, vigencia y evidencia de calibración; roles operativos para programación, administración y reactivación.
15. **Estado de cobertura:** Parcial. El ciclo almacena una etiqueta de equipo, pero no hay catálogo, estado operativo, bloqueo por mantenimiento/calibración ni control de capacidad.
16. **Nivel de certeza y límites:** Confirmado en fuente contractual, reglas maestras y código consultado. No se certifica el estado de una base desplegada ni se modificó código o esquema.

<a id="doc-requisitos-backend-planta-rf-pla-002-creacion-ciclos"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-002-creacion-ciclos.md

---
id: RF-PLA-002
titulo: Crear ciclos y asociar órdenes
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Planta; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 61–64; src/planta/; SterinovaFrontend/src/app/(erp)/planta/ciclo/nuevo/page.tsx"
depende_de: [RF-LOG-004, RF-PLA-001]
bloquea: [RF-PLA-006, RF-PLA-010]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-013 sigue asignada a RF-PLA-006; B-PLA-004 se deriva a RF-PLA-010 y las políticas de numeración a RA-PLA-005."
---

## RF-PLA-002 — Crear ciclos y asociar órdenes

**Fuente principal:** `Sterinova-ERP.md` §3, Planta, creación de ciclos y asociación de varias órdenes.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 61–64; entidades, DTO, servicio/controlador del backend y formulario de creación del frontend.

1. **ID:** `RF-PLA-002`.
2. **Título:** Crear ciclos y asociar órdenes.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Crear un ciclo con materiales trazables de una o más órdenes elegibles, guardar cantidades procesadas y mantener los vínculos necesarios para seguimiento y calidad.
6. **Reglas de negocio asociadas:** El anexo §3 pide asociación de varias órdenes a un ciclo y distribución de una orden entre varios ciclos. Reglas maestras M5 respuestas 62–63: ciclos multiorden y asignación por materiales/cantidades; respuesta 64 prohíbe cambiar el método contratado. Respuesta 61 distingue consecutivo interno y número físico de ciclo.
7. **Actores y permisos:** Operador autenticado con `planta.ciclos.crear`. El controlador protege `POST /planta/ciclos` con ese permiso.
8. **Datos y relaciones:** `CicloEsterilizacion` tiene un único `orden_id`; `CicloMaterialProcesado` relaciona ciclo y línea de material de esa orden y almacena `cantidad_procesada`. El DTO recibe un `orden_id`, no una colección de órdenes.
9. **Precondiciones y postcondiciones:** El backend exige orden `EN_PLANTA`, operador existente, método coincidente con orden y protocolo compatible. En transacción guarda ciclo, cantidades procesadas, estado de la orden y evento de procesamiento. No soporta varias órdenes en la misma transacción del ciclo.
10. **Criterios de aceptación:** (a) Crear ciclo con una o varias órdenes elegibles. (b) Asociar cada material y cantidad a su orden de origen. (c) Distribuir una orden en varios ciclos sin exceder saldos. (d) Mantener el método contratado. (e) Conservar identificador interno y número físico de ciclo de acuerdo con política aprobada.
11. **Evidencia en backend:** `CicloEsterilizacion.orden_id` y `CreateCicloDto.orden_id` son escalares. `PlantaService.createCiclo` valida `orden.metodo_esterilizacion ?? metodoOrden(quote.tipo_servicio)` contra `dto.metodo` y rechaza discrepancias. El ciclo usa el `id` generado por BD como clave técnica.
12. **Evidencia en BD y frontend:** `CicloMaterialProcesado` guarda líneas vinculadas a un solo ciclo y material de orden. El formulario `planta/ciclo/nuevo/page.tsx` publica un único `orden_id`; el identificador `CIC-AAAA-NNN` y el número físico de máquina no están en su payload ni en la entidad actual. La BD no se inspeccionó directamente.
13. **Brechas derivadas:** El soporte multiorden ya se mantiene en `B-LOG-013` → `RF-PLA-006`. `B-PLA-004` (falta de consecutivo de negocio y número físico) se deriva a `RF-PLA-010`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Formato, reinicio y año aplicable del consecutivo; unicidad/formato del número físico; tratamiento de registros retroactivos. Se derivan a `RA-PLA-005`.
15. **Estado de cobertura:** Parcial. El ciclo de una orden conserva cantidades y bloquea el cambio de método contratado; multiorden y numeración operativa no están implementados.
16. **Nivel de certeza y límites:** Confirmado en fuentes versionadas, servicio, entidades, DTO y formulario revisados. No se verificó una BD desplegada.

<a id="doc-requisitos-backend-planta-rf-pla-003-distribucion-cantidades"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-003-distribucion-cantidades.md

---
id: RF-PLA-003
titulo: Distribuir cantidades entre ciclos
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Planta; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63 y 68; src/planta/; src/calidad/"
depende_de: [RF-PLA-002, RF-LOG-002]
bloquea: [RF-PLA-011]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-005 se deriva a RF-PLA-011; decisiones de reproceso y material rechazado se derivan a RA-PLA-006."
---

## RF-PLA-003 — Distribuir cantidades entre ciclos

**Fuente principal:** `Sterinova-ERP.md` §3, Planta, distribución de una orden entre ciclos y asignación de materiales por cantidad.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 62–63 y 68; servicio y entidades de Planta y Calidad.

1. **ID:** `RF-PLA-003`.
2. **Título:** Distribuir cantidades entre ciclos.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Asignar materiales de una orden a uno o varios ciclos en cantidades parciales, calcular saldo disponible y preservar historial por intento.
6. **Reglas de negocio asociadas:** Una orden puede distribuirse entre ciclos; los materiales deben asociarse por línea/cantidad y no exceder lo recibido. Un reproceso es un ciclo nuevo vinculado al original; el ciclo fallido no se borra ni sobrescribe y se conserva su evidencia.
7. **Actores y permisos:** Operador autenticado con `planta.ciclos.crear`; Calidad revisa, aprueba o rechaza el ciclo con permisos separados.
8. **Datos y entidades:** `CicloMaterialProcesado` vincula ciclo y línea de material de orden, y persiste cantidad. `CicloEsterilizacion` guarda estado, motivo de rechazo y una relación nullable `ciclo_correccion_de_id`, aunque el flujo de creación no la utiliza.
9. **Precondiciones y postcondiciones:** Para una orden `EN_PLANTA`, el servicio suma las cantidades guardadas en ciclos previos, resta del recibido y valida el saldo solicitado. Guarda ciclo y asignación en transacción y mantiene `EN_PLANTA` si faltan cantidades; de lo contrario marca `PROCESADO`. La suma actual incluye ciclos rechazados.
10. **Criterios de aceptación:** (a) Saldo calculado por material a partir de la cantidad recibida menos cantidades válidas procesadas. (b) No sobreasignar en ciclos sucesivos o concurrentes. (c) Un ciclo rechazado/abortado no se contabiliza como procesamiento conforme y su disposición debe quedar definida. (d) Reprocesar con ciclo nuevo vinculado al original, preservando el registro original y sus evidencias.
11. **Evidencia en backend:** `PlantaService.createCiclo` suma `cantidad_procesada` de todos los ciclos previos de la orden, sin filtrar su estado. Toma `pessimistic_write` sobre la fila de la orden dentro de la transacción, serializando las creaciones concurrentes de esa misma orden. Calidad marca ciclos `RECHAZADO`, pero el DTO de creación no permite `ciclo_correccion_de_id`.
12. **Evidencia en BD:** `CicloMaterialProcesado` persiste las cantidades de cada intento y `CicloEsterilizacion` conserva estado y motivo; no hay tabla/flujo de reproceso conectado. El cómputo de saldo trata igualmente ciclos pendientes, aprobados y rechazados.
13. **Brechas derivadas:** `B-PLA-005` se reasigna a `RF-PLA-011` para excluir saldos rechazados de procesamiento válido e implementar vínculo/flujo de reproceso. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Se derivan a `RA-PLA-006`: si un ciclo rechazado libera toda o parte de su cantidad; quién autoriza el reproceso; cómo tratar abortos y material rechazado; y cuándo debe cambiar el estado de la orden.
15. **Estado de cobertura:** Parcial. Saldo y bloqueo concurrente de la misma orden están implementados; estados rechazados se incluyen erróneamente en el acumulado y el vínculo de reproceso no está operativo.
16. **Nivel de certeza y límites:** Confirmado en fuente de negocio, servicios, entidades y DTO. No se verificó la base de datos desplegada.

<a id="doc-requisitos-backend-planta-rf-pla-004-parametros-protocolos"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-004-parametros-protocolos.md

---
id: RF-PLA-004
titulo: Registrar parámetros, evidencias y protocolos
tipo: RF
modulo: Planta / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3 y §5"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 65–66 y 73–75; src/planta/; src/calidad/; src/certificados/"
depende_de: [RF-PLA-002]
bloquea: [RF-PLA-012, RF-PLA-013]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-006 se deriva a RF-PLA-012; B-PLA-007 a RF-PLA-013; políticas de evidencia/formato a RA-PLA-007."
---

## RF-PLA-004 — Registrar parámetros, evidencias y protocolos

**Fuente principal:** `Sterinova-ERP.md` §3, registro de parámetros/evidencias; §5, trazabilidad de parámetros registrados y protocolo utilizado.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 65–66 y 73–75; entidades, DTO y servicios de Planta, Calidad y Certificados.

1. **ID:** `RF-PLA-004`.
2. **Título:** Registrar parámetros, evidencias y protocolos.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad.
5. **Descripción funcional:** Registrar mediciones y controles por ciclo, guardar referencia de la versión de protocolo aplicada, permitir evaluación posterior por Calidad y adjuntar evidencia documental del proceso.
6. **Reglas de negocio asociadas:** Mediciones deben compararse con el protocolo aplicable; la evaluación y liberación requieren decisión explícita de Calidad. El certificado conserva valores, especificaciones y evaluación. Reglas maestras requieren evidencias BI/CI y archivos PDF/CSV de máquina, gráficos y fotografías. `NO_APLICA` requiere justificación y cambios de resultado `NO_CUMPLE` exigen desviación y aprobación.
7. **Actores y permisos:** Operador registra el ciclo; Calidad evalúa, aprueba o rechaza. Aprobación requiere `calidad.aprobar`, contraseña confirmatoria y actor distinto del operador.
8. **Datos y entidades:** `CicloEsterilizacion` guarda temperatura, humedad, presión, tiempos como columnas numéricas; controles biológico/químico como texto; protocolo por `protocolo_version_id`. `CicloParametroEvaluacion` guarda nombre del parámetro, criterio, evaluador y fecha, pero no la medición numérica.
9. **Flujo y precondiciones:** En creación, Planta selecciona versión explícita o la última del método, valida parámetros aplicables y guarda su FK. Calidad consulta el ciclo y protocolo; la aprobación coteja mediciones con rangos y registra evaluaciones, estado, auditoría y certificado. No se encontró flujo para adjuntar evidencias de máquina al ciclo.
10. **Criterios de aceptación:** (a) Conservar mediciones estructuradas con unidades/rangos del protocolo. (b) Mantener la versión exacta del protocolo usada. (c) Registrar evaluación, actor y fecha de Calidad. (d) Bloquear certificado ordinario ante incumplimiento. (e) Adjuntar archivos de evidencia al ciclo/material con autor y fecha. (f) Exigir justificación de `NO_APLICA` y manejar desviaciones sin sobrescribir el resultado original.
11. **Evidencia en backend:** `ciclo-esterilizacion.entity.ts` define campos numéricos y controles textuales. `protocolo-esterilizacion-version.entity.ts` conserva versión y especificaciones JSON. `planta.service.ts` fija `protocolo_version_id`. `calidad.service.ts` evalúa y persiste criterios; `certificados/informacion-tecnica.ts` compara datos con rangos y arma la información técnica.
12. **Evidencia en BD y frontend:** Hay relación FK ciclo→versión de protocolo y registro evaluador/fecha; no hay campo ni endpoint de carga de archivos en los módulos revisados. `NO_APLICA` no incluye justificación en DTO/entidad de evaluación. El certificado genera snapshot técnico al aprobar, no sustituye los archivos fuente de máquina requeridos como evidencia.
13. **Brechas derivadas:** `B-PLA-006` se deriva a `RF-PLA-012` para adjuntos de evidencia; `B-PLA-007` a `RF-PLA-013` para justificar `NO_APLICA`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Tipos, obligatoriedad por proceso, tamaño, formatos aceptados y retención de evidencias se derivan a `RA-PLA-007`. También requiere definición operativa la justificación por parámetro no aplicable y el flujo de desviaciones.
15. **Estado de cobertura:** Parcial. Mediciones numéricas, referencia de protocolo y evaluación de Calidad existen; faltan adjuntos de evidencia y justificación de `NO_APLICA`.
16. **Nivel de certeza y límites:** Confirmado en fuentes y código versionado revisados. No se verificó el contenido de una base desplegada ni se certificó inmutabilidad física del JSON del protocolo.

<a id="doc-requisitos-backend-planta-rf-pla-005-tandas-recetas"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-005-tandas-recetas.md

---
id: RF-PLA-005
titulo: Registrar tandas, reprocesos, recetas e insumos
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3 y §8"
fuente_contraste: "docs/requisitos/por-aclarar/RA-PLA-003-inventario-planta.md; RF-PLA-011; src/planta/; src/productos/"
depende_de: [RF-PLA-002, RF-PLA-003]
bloquea: [RF-PLA-014]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-008 se deriva a RF-PLA-014; B-PLA-009 a RA-PLA-008; inventario/microbodega se mantiene en RA-PLA-003 y reprocesos en RF-PLA-011/RA-PLA-006."
---

## RF-PLA-005 — Registrar tandas, reprocesos, recetas e insumos

**Fuente principal:** `Sterinova-ERP.md` §3, Planta: tandas, reprocesos, consumo de insumos, microbodega, recetas y preparaciones; §8, pendientes de negocio para microbodega/consumos finales y recetas por proceso.

**Fuente de contraste:** `RA-PLA-003`, `RF-PLA-011`, entidades/servicios de `src/planta/` y catálogo comercial de `src/productos/`.

1. **ID:** `RF-PLA-005`.
2. **Título:** Registrar tandas, reprocesos, recetas e insumos.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Agrupar ciclos en tandas, registrar reprocesos, mantener recetas de consumo por proceso y controlar insumos y microbodega de Planta conforme a políticas definidas.
6. **Reglas de negocio asociadas:** El anexo §3 enumera estas capacidades; §8 deja microbodega/consumos finales y recetas por proceso pendientes de definición estratégica. Los reprocesos deben conservar el ciclo original y vincular un nuevo intento; su detalle técnico se deriva a `RF-PLA-011` y sus políticas a `RA-PLA-006`.
7. **Actores y permisos:** El anexo no precisa roles para configurar tandas, recetas o inventario. El operador actual registra ciclos con `planta.ciclos.crear`; roles de almacén, Planta y Calidad para consumos y aprobaciones quedan por decidir.
8. **Datos y entidades:** Existe `CicloEsterilizacion` y su detalle `CicloMaterialProcesado`; no se encontró entidad `Tanda`, inventario/microbodega, movimiento de insumo, receta ni consumo productivo. `ciclo_correccion_de_id` es una relación declarada, aún sin flujo operativo.
9. **Precondiciones y postcondiciones:** La implementación registra un ciclo de una orden y cantidades de sus materiales. No crea agrupación de tanda, valida existencias de consumibles ni calcula consumo estándar/real. La presencia de productos comerciales clasificados `INSUMOS` no crea una salida de inventario de Planta.
10. **Criterios de aceptación:** (a) Agrupar ciclos en una Tanda con identificador y relaciones trazables. (b) Administrar insumos, existencias y movimientos si el alcance se confirma. (c) Definir recetas versionadas por proceso/material y consumo previsto/real. (d) Registrar responsables, fechas, ajustes y trazabilidad. (e) Preservar ciclos originales y relacionar reprocesos.
11. **Evidencia en backend:** `src/planta/` contiene entidades de ciclo, material procesado, parámetros y protocolo; no servicios/repositorios de recetas, consumos o tandas. `PlantaService` registra cantidades procesadas por ciclo, no insumos consumibles.
12. **Evidencia en persistencia y alcance:** La búsqueda del código versionado no encontró tablas/migraciones de tanda, receta, microbodega o consumos de Planta. `INSUMOS` aparece en catálogo/cotización comercial para venta y no debe confundirse con inventario de producción.
13. **Brechas derivadas:** `B-PLA-008` se reasigna a `RF-PLA-014` para agrupación de ciclos por Tanda. `B-PLA-009` se deriva a `RA-PLA-008` para definir recetas, insumos y microbodega. El alcance general de inventario permanece en `RA-PLA-003`; el flujo de reprocesos en `RF-PLA-011`.
14. **Preguntas abiertas:** ¿Qué es una Tanda y qué cardinalidad tiene con órdenes/ciclos? ¿Qué insumos, unidades y movimientos se controlan? ¿Las recetas varían por método, equipo, material o empaque? ¿Se controlará consumo previsto contra consumo real y quién autoriza ajustes? Se derivan a `RA-PLA-003` y `RA-PLA-008` según tema.
15. **Estado de cobertura:** Parcial. Hay registro de ciclos y cantidades de materiales; Tanda, recetas, microbodega y consumos productivos no están implementados. El reproceso está derivado y cuenta solo con una relación de datos sin flujo operativo.
16. **Nivel de certeza y límites:** Confirmado en el anexo, decisiones documentadas, servicios, entidades y migraciones revisadas. No se verificó una base desplegada.

<a id="doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-006-ciclos-multiorden.md

---
id: RF-PLA-006
titulo: Soporte para ciclos con múltiples órdenes
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63"
fuente_contraste: "Sterinova-ERP.md §3, Planta; src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts"
depende_de: [RN-LOG-002, RF-LOG-012]
bloquea: []
brechas: [B-LOG-013]
historial:
  - version: 0.1
    nota: "Borrador derivado de que las reglas de Planta permiten un ciclo con varias órdenes, mientras el modelo y servicio actuales guardan una sola orden_id."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

## RF-PLA-006 — Soporte para ciclos con múltiples órdenes

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-PLA-006`.
2. **Título:** Soporte para ciclos con múltiples órdenes.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Planta debe poder crear un ciclo que agrupe materiales de varias órdenes elegibles, conservando por cada material su orden, línea de material, lote, cantidad asignada/procesada y saldo. Solo se combinarán cargas que cumplan compatibilidad técnica y capacidad de cámara aprobadas.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Entidad de asociación ciclo-orden, detalle por ciclo/material/lote, consulta multiámbito, compatibilidad de clientes y métodos, capacidad de cámara, totales y saldos por orden, evaluación/calidad por material, certificados y reportes, rechazo/reproceso y migración de ciclos históricos.
7. **Actores / permisos:** Usuarios autorizados del dominio Planta; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Crear un ciclo con materiales de más de una orden elegible.<br>- Validar por cada material origen, orden, lote y cantidad disponible.<br>- Evitar duplicidad y exceso de saldo por orden/material con transacción.<br>- Conservar resultados, evaluación de calidad y certificado vinculados a las órdenes/materiales correspondientes.<br>- Rechazar combinaciones incompatibles o que superen capacidad según reglas que defina Planta/Calidad.
11. **Fuentes y evidencia actual:** Fuente de requisito: docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63. Contraste: Sterinova-ERP.md §3, Planta; src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts. Evidencia técnica leída: - `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 62–63, establece que un ciclo puede contener varias órdenes/clientes si la carga cabe y que una orden puede distribuirse entre varios ciclos.
- `CicloEsterilizacion` tiene una única `orden_id` y `PlantaService.createCiclo` recibe una orden, carga sus materiales y suma ciclos previos por esa orden.
- `CicloMaterialProcesado` conserva los vínculos a ciclo y material de orden; es una base para el detalle multiorden, pero su servicio actual está restringido a una orden.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-013]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Entidad de asociación ciclo-orden, detalle por ciclo/material/lote, consulta multiámbito, compatibilidad de clientes y métodos, capacidad de cámara, totales y saldos por orden, evaluación/calidad por material, certificados y reportes, rechazo/reproceso y migración de ciclos históricos.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-planta-rf-pla-007-catalogo-equipos"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-007-catalogo-equipos.md

---
id: RF-PLA-007
titulo: Crear catálogo de equipos (EtO, Vapor, Lavandería)
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 5, respuestas 58–59"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/dto/create-ciclo.dto.ts"
depende_de: [RF-PLA-001]
bloquea: []
brechas: [B-PLA-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-001; formaliza catálogo y selección trazable frente al texto libre actual."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; clasificación, atributos y permisos siguen por definir."
---

## RF-PLA-007 — Crear catálogo de equipos (EtO, Vapor, Lavandería)

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-007`.
2. **Título:** Crear catálogo de equipos (EtO, Vapor, Lavandería).
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Administrar equipos operativos como activos identificables y seleccionables en ciclos, incluyendo equipos EtO, Vapor y lavandería.
6. **Reglas asociadas:** Cada equipo debe tener identificación estable y uso/método compatible; lavandería debe representarse sin asignarle EtO/Vapor por defecto. Campos y clasificadores se aprueban antes de migrar datos.
7. **Actores / permisos:** Administración de Planta/Calidad según matriz RBAC; usuarios operativos consultan y seleccionan equipos habilitados. Los códigos exactos de permisos quedan por validar.
8. **Datos y entidades:** Catálogo propuesto con código, nombre, tipo/uso, ubicación, método(s), capacidad y estado; relación de ciclo a equipo. No existe aún la entidad indicada.
9. **Flujo preliminar:** Registrar equipo → definir tipo/método y ubicación → habilitarlo según estado → seleccionarlo al crear ciclo → conservar vínculo histórico al equipo usado.
10. **Criterios de aceptación preliminares:** Equipo tiene código único y no ambiguo; ciclo nuevo referencia un equipo existente; equipos inactivos no aparecen como seleccionables; consulta histórica conserva el equipo aun tras cambio de catálogo; lavandería se distingue de tecnologías de esterilización.
11. **Evidencia en backend:** `CicloEsterilizacion` conserva `equipo` como texto y no se encontró entidad/servicio de catálogo en `src/planta/`.
12. **Persistencia e interfaz:** DTO/formulario actual recibe dato textual; falta catálogo relacional y administración/selección desde UI.
13. **Brecha asociada:** `B-PLA-001` abierta; el diseño de catálogo absorbe la inexistencia de entidad y clasificación estructurada.
14. **Preguntas abiertas:** Tipo/subtipo de lavandería, equipos multi-método, códigos, ubicaciones, capacidad, ciclo de vida, permisos y plan de migración de textos históricos (`RA-PLA-004`).
15. **Cobertura preliminar:** Faltante; solo existe identificación textual del equipo en el ciclo.
16. **Certeza y límites:** La ausencia se confirmó en entidades/DTO de Planta. Reglas maestras y anexo sustentan el catálogo requerido; atributos no definidos se mantienen abiertos. No se verificaron activos reales.

<a id="doc-requisitos-backend-planta-rf-pla-008-control-mantenimiento"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-008-control-mantenimiento.md

---
id: RF-PLA-008
titulo: Control de disponibilidad, mantenimiento y calibración de equipos
tipo: RF
modulo: Planta / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6; docs/negocio/reglas-maestras.md, Módulo 5, respuesta 60"
fuente_contraste: "src/planta/planta.service.ts; src/planta/entities/ciclo-esterilizacion.entity.ts"
depende_de: [RF-PLA-007]
bloquea: []
brechas: [B-PLA-002]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-002; exige compuerta operativa por estado y calibración."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; transiciones y autoridades permanecen pendientes de validación."
---

## RF-PLA-008 — Control de disponibilidad, mantenimiento y calibración de equipos

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-008`.
2. **Título:** Control de disponibilidad, mantenimiento y calibración de equipos.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad.
5. **Descripción funcional:** Registrar disponibilidad/mantenimiento/calibración del equipo y bloquear su selección y uso en ciclo mientras no esté disponible según criterios aprobados.
6. **Reglas asociadas:** Un equipo no disponible no puede utilizarse. Reglas maestras indican bloqueo por mantenimiento o calibración vencida y reactivación con certificado. Conservar historial de estados/certificados; no borrar períodos pasados.
7. **Actores / permisos:** Calidad o Jefe de Planta pueden autorizar reactivación según respuesta de negocio referenciada; quién programa mantenimiento y registra calibración está por definir.
8. **Datos y entidades:** Equipo, estado, intervalo efectivo, mantenimiento, certificado/resultado de calibración, vencimiento, actor, fecha y evidencia documental.
9. **Flujo preliminar:** Marcar indisponible → registrar motivo y período → prevenir asignación a ciclo → registrar mantenimiento/calibración y evidencia → autorizar reactivación → permitir nuevos ciclos.
10. **Criterios de aceptación preliminares:** Ciclo no puede iniciar con equipo en mantenimiento/fuera de servicio/calibración vencida; transición de estado exige actor autorizado; cada cambio conserva fecha/motivo/evidencia; ciclos históricos no cambian al cambiar el estado actual del equipo.
11. **Evidencia en backend:** `PlantaService.createCiclo` no consulta entidad de equipo ni valida disponibilidad/calibración; no hay catálogo en el modelo actual.
12. **Persistencia e interfaz:** No se encontró historial de mantenimiento/calibración ni UI de disponibilidad de equipo; depende del catálogo `RF-PLA-007` y de adjuntos (`RF-PLA-012`).
13. **Brecha asociada:** `B-PLA-002` abierta; compuerta de disponibilidad/calibración no está implementada.
14. **Preguntas abiertas:** Estados y transiciones, reglas/vigencia de calibración, contenido mínimo de certificados, autoridades exactas, retroactividad, recordatorios y anexos (`RA-PLA-004`).
15. **Cobertura preliminar:** Faltante para disponibilidad/calibración porque no hay activo estructurado ni compuerta.
16. **Certeza y límites:** Regla de indisponibilidad viene del anexo; proceso de calibración/autoridad de la fuente de reglas maestras citada. Estado de activos reales y normativa no se verificó; borrador.

<a id="doc-requisitos-backend-planta-rf-pla-009-validacion-capacidad"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-009-validacion-capacidad.md

---
id: RF-PLA-009
titulo: Validación de capacidad de carga por equipo
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 59; Sterinova-ERP.md §3"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts"
depende_de: [RF-PLA-007]
bloquea: []
brechas: [B-PLA-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-003; las unidades y criterios deben confirmarse antes de fijar validaciones."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; no se presupone una unidad universal de capacidad."
---

## RF-PLA-009 — Validación de capacidad de carga por equipo

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-009`.
2. **Título:** Validación de capacidad de carga por equipo.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Verificar que la carga asignada a un ciclo no supere la capacidad aprobada del equipo, usando unidades y reglas compatibles con la tecnología.
6. **Reglas asociadas:** El límite debe estar ligado al equipo y expresar valor/unidad/base; cargas incompatibles o mixtas se validan según política. No se comparan unidades incompatibles ni se presume capacidad para lavandería.
7. **Actores / permisos:** Personal de Planta asigna carga; administración/Calidad mantiene límites y validaciones según política todavía pendiente.
8. **Datos y entidades:** Equipo y capacidad nominal/útil, unidad, material con peso/volumen/conversión, carga del ciclo y excepciones documentadas.
9. **Flujo preliminar:** Seleccionar equipo → agregar materiales/cantidades → calcular carga según unidades admitidas → comparar con capacidad → aceptar o bloquear con detalle de exceso.
10. **Criterios de aceptación preliminares:** Cargas dentro del límite aprobado se aceptan; las superiores se bloquean o requieren excepción solo si se define; conversiones/unidades incompatibles no se aceptan silenciosamente; queda almacenada base de cálculo usada.
11. **Evidencia en backend:** El servicio limita cantidades procesadas por línea de material, pero no calcula peso/volumen agregado ni lo compara con capacidad.
12. **Persistencia e interfaz:** Actualmente no hay catálogo/equipo ni dimensiones de carga/capacidad estructuradas; depende de `RF-PLA-007` y de los datos de materiales.
13. **Brecha asociada:** `B-PLA-003` abierta; no hay validación de capacidad de equipo.
14. **Preguntas abiertas:** Unidades por tecnología, datos de peso/volumen, tolerancia, cargas mixtas, capacidad útil vs nominal, incompatibilidades, excepciones y lavandería (`RA-PLA-004`).
15. **Cobertura preliminar:** Faltante para capacidad; el saldo por cantidad de unidad no representa capacidad física.
16. **Certeza y límites:** La necesidad de capacidad aparece en reglas maestras y anexo; ausencia de cálculo específico en servicio revisado. No se inspeccionaron especificaciones de equipos reales; borrador.

<a id="doc-requisitos-backend-planta-rf-pla-010-consecutivos-ciclos"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-010-consecutivos-ciclos.md

---
id: RF-PLA-010
titulo: Implementar consecutivo de negocio y número físico de ciclo
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 61 y 68"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/dto/create-ciclo.dto.ts; SterinovaFrontend/src/app/(erp)/planta/ciclo/nuevo/page.tsx"
depende_de: [RF-PLA-002]
bloquea: []
brechas: [B-PLA-004]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-004; requiere decisión de formato y reglas de numeración antes del diseño final."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; formatos y retroactividad continúan en RA-PLA-005."
---

## RF-PLA-010 — Implementar consecutivo de negocio y número físico de ciclo

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-010`.
2. **Título:** Implementar consecutivo de negocio y número físico de ciclo.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Identificar cada ciclo mediante consecutivo interno de negocio y registrar por separado el número físico leído/reportado por el equipo.
6. **Reglas asociadas:** La fuente de reglas indica unicidad del número físico por equipo y año; reproceso conserva vínculo al original y nueva identificación. Ejemplo de formato no se toma como especificación final.
7. **Actores / permisos:** Planta registra/consulta ciclos; generación de consecutivo debe ser automática y atómica. Roles de corrección retroactiva por definir.
8. **Datos y entidades:** Ciclo, consecutivo interno, número físico, equipo, año/fecha, secuencia y ciclo origen de reproceso.
9. **Flujo preliminar:** Crear ciclo → asignar consecutivo interno → registrar número físico → validar unicidad equipo/año → relacionar si es reproceso → conservar ambos en consultas/certificados.
10. **Criterios de aceptación preliminares:** Consecutivos concurrentes no se duplican; duplicado físico en mismo equipo/año se rechaza; el mismo número en otro equipo se resuelve según alcance aprobado; un reproceso obtiene identificador propio y enlace al original.
11. **Evidencia en backend/frontend:** Entidad y DTO de ciclo usan `id` autogenerado sin números operativos separados; formulario de nuevo ciclo no los captura.
12. **Persistencia e interfaz:** No hay columnas para consecutivo interno/número físico ni secuencia para ciclo identificada; debe actualizar API, formulario, consultas y documentos.
13. **Brecha asociada:** `B-PLA-004` abierta; faltan ambos identificadores operativos.
14. **Preguntas abiertas:** Formato/secuencia, reinicio por año, retroactividad, cambios de equipo, reprocesos sucesivos, normalización y tratamiento de identificadores históricos en `RA-PLA-005`.
15. **Cobertura preliminar:** Faltante para identificación de negocio/física; la clave DB no cubre el número registrado en máquina.
16. **Certeza y límites:** Datos actuales revisados en entidad, DTO y formulario; reglas y ejemplo provienen de respuestas de negocio citadas. No se fijan formatos definitivos; borrador.

<a id="doc-requisitos-backend-planta-rf-pla-011-flujo-reprocesos"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-011-flujo-reprocesos.md

---
id: RF-PLA-011
titulo: Flujo de reprocesos y exclusión de saldos rechazados
tipo: RF
modulo: Planta / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63 y 68–69"
fuente_contraste: "src/planta/planta.service.ts; src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/calidad.service.ts"
depende_de: [RF-PLA-003]
bloquea: []
brechas: [B-PLA-005]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-005; políticas de material rechazado y autorización pendientes de RA-PLA-006."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos e incorpora D-PLA-001; tratamiento exacto de saldos sigue abierto."
---

## RF-PLA-011 — Flujo de reprocesos y exclusión de saldos rechazados

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-011`.
2. **Título:** Flujo de reprocesos y exclusión de saldos rechazados.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad / Logística.
5. **Descripción funcional:** Distinguir cantidades intentadas de cantidades válidas/liberadas y crear una ejecución nueva vinculada al ciclo rechazado/abortado cuando se autorice reproceso.
6. **Reglas asociadas:** D-PLA-001: Calidad y Planta aprueban antes de crear reproceso; nuevo ciclo enlazado al original; ciclo abortado no libera por sí mismo; Calidad determina/documenta disposición. No convertir intento fallido en liberación ni sobrescribir su evidencia.
7. **Actores / permisos:** Calidad y Planta deben aprobar previamente; Planta ejecuta el ciclo nuevo; Logística respeta saldos/disposición. Roles/permisos exactos sujetos a matriz RBAC y `RA-PLA-006`.
8. **Datos y entidades:** Ciclo original/nuevo, estado, cantidades por material, motivo, autorizaciones, evaluaciones, evidencias, saldo recuperable y certificados relacionados.
9. **Flujo preliminar:** Rechazo/aborto → decisión documentada de Calidad → aprobación de Calidad y Planta si reproceso → crear ciclo nuevo con referencia al original → procesar y evaluar → conciliar saldo y documentos.
10. **Criterios de aceptación preliminares:** No se crea reproceso sin las dos aprobaciones; ciclo previo permanece inmutable; nuevo ciclo tiene referencia al origen; cantidades rechazadas/abortadas no se cuentan como liberadas; el saldo se ajusta según regla por decidir.
11. **Evidencia en backend:** `PlantaService.createCiclo` excluye los ciclos rechazados del saldo válido y exige dos autorizaciones documentadas de personas distintas para enlazar el nuevo ciclo con el rechazado. `LogisticaService.updateEstado` verifica las mismas autorizaciones antes de reabrir la orden.
12. **Persistencia e interfaz:** El ciclo rechazado conserva ID, motivo, actor y fecha de las autorizaciones de Calidad y Planta. Las pantallas de Calidad y Planta permiten registrarlas; Logística ofrece la reapertura cuando el backend declara disponible el reproceso. La conciliación de saldo por disposición específica sigue pendiente de precisión.
13. **Brecha asociada:** `B-PLA-005` abierta; acumular cantidades rechazadas como procesadas bloquea operación/reintento.
14. **Preguntas abiertas:** Definir cantidad recuperable, cargas parcialmente abortadas, motivo/evidencia, actualización de orden, nueva evaluación, consecutivo, certificado y relación con inventario/logística (`RA-PLA-006`).
15. **Cobertura preliminar:** Parcial: existen autorizaciones previas, vínculo entre intentos y exclusión de ciclos rechazados; siguen abiertas la recuperación parcial, abortos, disposición final y conciliación entre lotes.
16. **Certeza y límites:** D-PLA-001 se confirmó de nuevo el 2026-11-23. Las migraciones de autorizaciones y RBAC quedaron escritas y registradas, pero no se ejecutaron en esta sesión; el comportamiento con base real no se verificó.

<a id="doc-requisitos-backend-planta-rf-pla-012-evidencias-adjuntas"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-012-evidencias-adjuntas.md

---
id: RF-PLA-012
titulo: Implementar gestión de archivos adjuntos (Evidencias de ciclo)
tipo: RF
modulo: Planta / Calidad / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 y §5; docs/negocio/reglas-maestras.md, Módulo 5, respuesta 75"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/; src/certificados/"
depende_de: [RF-PLA-004]
bloquea: []
brechas: [B-PLA-006]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-006; lista inicial de evidencias según regla maestra, sujeta a RA-PLA-007."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; formatos, obligatoriedad y retención siguen sujetos a decisión."
---

## RF-PLA-012 — Implementar gestión de archivos adjuntos (Evidencias de ciclo)

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-012`.
2. **Título:** Implementar gestión de archivos adjuntos (evidencias de ciclo).
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad / Documentos.
5. **Descripción funcional:** Adjuntar evidencia digital del proceso y relacionarla con ciclo y, cuando aplique, material/lote/parámetro.
6. **Reglas asociadas:** Conservar original e identidad del archivo; registrar tipo/autor/fecha y vínculo; no confundir adjunto con dato estructurado ni permitir que un archivo reemplace mediciones. Tipos obligatorios quedan en `RA-PLA-007`.
7. **Actores / permisos:** Planta carga evidencia operativa; Calidad consulta/evalúa y adjunta evidencia de decisión; lectura y descarga se limitan por permisos y ámbito.
8. **Datos y entidades:** Archivo/objeto almacenado, hash/metadata, nombre/tipo, autor, fecha, relación con ciclo y opcionalmente material/parámetro, política de retención.
9. **Flujo preliminar:** Subir y validar archivo → crear metadata y relación → consultar/descargar por usuarios autorizados → conservar versión/evidencia con su expediente.
10. **Criterios de aceptación preliminares:** Archivo queda vinculado al expediente correcto y verificable por hash; fallos de carga no dejan metadata huérfana; tipos/tamaño se validan según política; evidencia existente no se sobrescribe; lectura restringida por ámbito.
11. **Evidencia en backend:** Entidades y endpoints de Planta/Calidad revisados no incluyen carga/relación de archivos; `control_biologico` y `control_quimico` guardan texto.
12. **Persistencia e interfaz:** No se identificó entidad de adjuntos para ciclos ni flujo de carga/descarga asociado; integración con almacenamiento y UI aún no diseñada.
13. **Brecha asociada:** `B-PLA-006` abierta por falta de gestión de adjuntos de evidencia.
14. **Preguntas abiertas:** Formatos, tamaño, validación/escaneo, obligatoriedad por método, asociación por nivel, permisos, retención, eliminación, versiones y contingencia (`RA-PLA-007`).
15. **Cobertura preliminar:** Faltante como archivo adjunto; existen algunos resultados de control como texto, no gestión documental.
16. **Certeza y límites:** Ausencia confirmada en entidades/endpoints revisados; lista de tipos viene de reglas maestras y sigue sujeta a decisión. No se evaluó almacenamiento real; borrador.

<a id="doc-requisitos-backend-planta-rf-pla-013-justificacion-no-aplica"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-013-justificacion-no-aplica.md

---
id: RF-PLA-013
titulo: Añadir campo de justificación en evaluación de parámetros
tipo: RF
modulo: Planta / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 74"
fuente_contraste: "src/calidad/dto/evaluacion-parametro.dto.ts; src/planta/entities/ciclo-parametro-evaluacion.entity.ts; src/certificados/informacion-tecnica.ts"
depende_de: [RF-PLA-004]
bloquea: []
brechas: [B-PLA-007]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-007; el motivo debe ser obligatorio cuando corresponda."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; autorización y cambios históricos quedan explícitos como decisiones/controles."
---

## RF-PLA-013 — Añadir campo de justificación en evaluación de parámetros

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-013`.
2. **Título:** Añadir campo de justificación en evaluación de parámetros.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad.
5. **Descripción funcional:** Exigir y persistir justificación cuando Calidad evalúe un parámetro como `NO_APLICA`; cambios posteriores sobre `NO_CUMPLE` deben preservar la decisión original y dejar relación de corrección/desviación.
6. **Reglas asociadas:** `NO_APLICA` requiere motivo; `NO_CUMPLE` no se convierte en cumplimiento mediante edición directa. Corrección/desviación necesita el flujo autorizado y evidencia histórica.
7. **Actores / permisos:** Evaluador de Calidad; aprobación de una corrección por rol independiente/autorizado, pendiente de política.
8. **Datos y entidades:** Evaluación de ciclo/parámetro, criterio, actor, fecha, motivo/justificación y posible vínculo a desviación/corrección.
9. **Flujo preliminar:** Elegir evaluación → si `NO_APLICA`, validar motivo no vacío → guardar evaluación con usuario/fecha → si se intenta corregir `NO_CUMPLE`, abrir flujo autorizado sin sustituir el original.
10. **Criterios de aceptación preliminares:** Se rechaza `NO_APLICA` sin justificación; motivo se conserva en historial y certificado/evidencia cuando aplique; edición posterior mantiene original y registra quién/cuándo/por qué.
11. **Evidencia en backend:** `EvaluacionParametroDto` recibe parámetro/criterio/opción, y `CicloParametroEvaluacion` persiste criterio, evaluador y fecha; no se identificó campo de justificación.
12. **Persistencia e interfaz:** `EvaluacionTecnica` permite seleccionar resultado; no captura motivo estructurado para `NO_APLICA`. Cambio de esquema/API/UI sería requerido.
13. **Brecha asociada:** `B-PLA-007` abierta; ausencia de justificación impide explicar una no aplicación.
14. **Preguntas abiertas:** Longitud/formato, condiciones de `NO_APLICA`, alcance por protocolo/material, aprobador de excepción y forma de mantener historial/certificado.
15. **Cobertura preliminar:** Parcial: resultado y responsable se persisten; justificación y flujo protegido de corrección no están representados.
16. **Certeza y límites:** Comparación basada en DTO, entidad y UI citadas. Reglas provienen de respuesta 74 del registro de negocio; autorización detallada requiere definición. Borrador.

<a id="doc-requisitos-backend-planta-rf-pla-014-entidad-tandas"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-014-entidad-tandas.md

---
id: RF-PLA-014
titulo: Implementar agrupación de ciclos por Tanda
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Planta"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts"
depende_de: [RF-PLA-005]
bloquea: []
brechas: [B-PLA-008]
historial:
  - version: 0.1
    nota: "Borrador derivado de la ausencia de una entidad y flujo de Tanda distintos del ciclo."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; definición de agrupación sigue pendiente de negocio."
---

## RF-PLA-014 — Implementar agrupación de ciclos por Tanda

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-014`.
2. **Título:** Implementar agrupación de ciclos por Tanda.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Registrar una Tanda como unidad operativa distinta del Ciclo que agrupe operaciones/cargas de Planta con identidad y trazabilidad propias.
6. **Reglas asociadas:** Tanda y Ciclo no son sinónimos; conservación de la relación y de fechas/responsables; no asumir equivalencia uno-a-uno ni multiorden hasta decisión.
7. **Actores / permisos:** Planta crea/consulta tandas y asocia ciclos; Calidad consume la agrupación para evaluación/trazabilidad bajo ámbito. Permisos exactos pendientes.
8. **Datos y entidades:** Tanda con identificador/estado/fecha/responsable y relaciones a ciclo, orden y materiales según cardinalidades por definir.
9. **Flujo preliminar:** Crear tanda → reunir carga/órdenes elegibles → ejecutar uno o más ciclos asociados → conservar eventos → consultar evaluación y certificado desde la tanda.
10. **Criterios de aceptación preliminares:** Tanda se identifica independientemente del ciclo; relación Tanda–Ciclo se valida y consulta; cantidades/materiales no se duplican al agrupar; cambios conservan responsable y tiempo; cardinalidad respeta decisión aprobada.
11. **Evidencia en backend:** El modelo incluye `CicloEsterilizacion` y materiales procesados; no se encontró entidad, servicio ni endpoint `Tanda` en `src/planta/`.
12. **Persistencia e interfaz:** No existe tabla/relación/flujo UI separado; pantallas organizan por ciclos/órdenes.
13. **Brecha asociada:** `B-PLA-008` abierta por ausencia de entidad/agrupación Tanda.
14. **Preguntas abiertas:** Cardinalidades Tanda–Ciclo–Orden, consolidación de cargas, secuenciación, estado, numeración, cierre, auditoría e impacto en Calidad/certificados.
15. **Cobertura preliminar:** Faltante para una unidad Tanda separada; ciclos existen como unidad operativa.
16. **Certeza y límites:** Ausencia confirmada en entidades y servicio de Planta. El anexo nombra Tandas separadas de ciclos pero no establece el modelo; no se presume que sea la tanda física del equipo. Borrador.

<a id="doc-requisitos-backend-planta-rf-pla-015-bloqueo-metodo"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-015-bloqueo-metodo.md

---
id: RF-PLA-015
titulo: Bloqueo estricto del método contratado (Comercial-Logística-Planta)
tipo: RF
modulo: Comercial / Logística / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6; docs/negocio/reglas-maestras.md, Módulo 5, respuesta 64"
fuente_contraste: "src/cotizaciones/entities/cotizacion-item.entity.ts; src/logistica/logistica.service.ts; src/planta/planta.service.ts"
depende_de: [RN-PLA-001, RF-COM-003, RF-LOG-001, RF-PLA-002]
bloquea: []
brechas: [B-PLA-010]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-010; ancla la comparación del método al concepto contratado y limita correcciones."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; method por línea y excepciones requieren acuerdo de negocio."
---

## RF-PLA-015 — Bloqueo estricto del método contratado (Comercial-Logística-Planta)

**Estado:** Borrador, pendiente de análisis y validación.

### Enunciado preliminar

El método operativo de la orden y del ciclo debe derivarse del método contractual asociado a cada concepto/material. Logística no debe cambiarlo mediante edición operativa y Planta debe rechazar cualquier ciclo que no coincida; correcciones requieren el flujo comercial autorizado y trazabilidad.

### Base documental y técnica inicial

- `CicloEsterilizacion` compara con el método actual de la orden.
- Logística permite establecer/editar el método antes del primer evento/ciclo.
- `CotizacionItem` tiene `metodo`, pero la función de asignación de método no lo contrasta con la orden/ciclo para todos los tipos de servicio.

### Aspectos por definir

Método por línea para cotizaciones con varios servicios, método de tipos genéricos, restricciones de edición, permisos/flujo de corrección, auditoría y compatibilidad por material.

### Análisis estructurado (16 campos)

1. **ID:** `RF-PLA-015`.
2. **Título:** Bloqueo estricto del método contratado (Comercial–Logística–Planta).
3. **Tipo:** RF.
4. **Módulo:** Comercial / Logística / Planta.
5. **Descripción funcional:** Mantener el método operativo de la orden/ciclo anclado al método contratado por concepto, permitiendo corrección solo por flujo comercial autorizado y trazable.
6. **Reglas asociadas:** Planta no cambia el método contratado; comparación se realiza contra el valor contratado congelado, no solo contra campo editable de la orden. No inferir método para servicios genéricos sin decisión.
7. **Actores / permisos:** Comercial administra correcciones contractuales; Logística y Planta consultan y ejecutan método asignado; permisos de corrección y doble aprobación por definir.
8. **Datos y entidades:** Método en `CotizacionItem`, relación de cada línea con material de orden y método operativo del ciclo; conservar valor contratado/snapshot y actor/fecha de modificación autorizada.
9. **Flujo preliminar:** Cerrar cotización → derivar método a orden/material → permitir a Planta ciclo compatible → rechazar discrepancia → corrección contractual mediante acción autorizada y trazada.
10. **Criterios de aceptación preliminares:** Cambiar manualmente el método de orden no habilita método distinto en ciclo; cada línea valida el servicio contratado; corrección aprobada actualiza vínculo sin reescribir la historia; servicios sin método declarado aplican regla explícita.
11. **Evidencia backend:** Planta compara contra método actual de la orden; Logística puede asignarlo/editarlo antes del primer ciclo; `CotizacionItem` tiene método, pero el contraste end-to-end no garantiza anclaje por concepto en los caminos revisados.
12. **Persistencia e interfaz:** La orden conserva método operacional; el vínculo contractual por línea requiere propagación/snapshot. La interfaz permite cambios logísticos previos según flujo citado.
13. **Brecha asociada:** `B-PLA-010` abierta; se deriva el anclaje del método contractual a esta ficha.
14. **Preguntas abiertas:** Método por línea, servicios genéricos, compatibilidad de material, quién corrige, doble aprobación, auditoría y comportamiento de cotizaciones antiguas.
15. **Cobertura preliminar:** Parcial; se valida ciclo contra la orden vigente, pero el método de la orden puede divergir del contratado.
16. **Certeza y límites:** Evidencia en entidades/servicios citados y Regla Maestra M5 respuesta 64. No se definió el modelo de métodos para servicios mixtos; borrador pendiente de validación.

<a id="doc-requisitos-backend-planta-rf-pla-016-trigger-inmutabilidad"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-016-trigger-inmutabilidad.md

---
id: RF-PLA-016
titulo: Inmutabilidad de ciclos aprobados a nivel de base de datos
tipo: RF
modulo: Planta / Calidad / Base de Datos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/calidad.service.ts; src/database/migrations/"
depende_de: [RN-PLA-002]
bloquea: []
brechas: [B-PLA-011]
historial:
  - version: 0.1
    nota: "Borrador técnico de hardening para impedir en BD la alteración de datos de ejecución de ciclos aprobados."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; excepciones de flujo y estrategia de BD requieren diseño y validación."
---

## RF-PLA-016 — Inmutabilidad de ciclos aprobados a nivel de base de datos

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-016`.
2. **Título:** Inmutabilidad de ciclos aprobados a nivel de base de datos.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad / Base de Datos.
5. **Descripción funcional:** Impedir que una escritura directa altere o elimine mediciones y datos originales de un ciclo después de su aprobación, manteniendo únicamente las transiciones de flujo explícitamente permitidas.
6. **Reglas asociadas:** Un ciclo aprobado no se sobrescribe; una corrección o reproceso genera evidencia nueva enlazada, no sustituye los datos anteriores. Excepciones administrativas requieren autorización y auditoría.
7. **Actores / permisos:** Usuarios de aplicación ejecutan transiciones aprobadas; cuentas técnicas/administrativas de base de datos deben estar limitadas. Roles privilegiados y procedimiento de emergencia por definir.
8. **Datos y entidades:** Ciclo, parámetros, materiales procesados, evaluaciones de Calidad, aprobador/fecha y estados; definir qué campos son inmutables frente a qué metadatos de flujo pueden cambiar.
9. **Flujo preliminar:** Aprobación transaccional → ciclo adquiere estado protegido → mutación posterior de campos protegidos se rechaza → cualquier corrección autorizada crea registro nuevo y deja vínculo/auditoría.
10. **Criterios de aceptación preliminares:** API y SQL directo no modifican/eliminan campos protegidos tras aprobación; la aprobación inicial puede completar sus metadatos en la misma transacción; se conserva posibilidad de lectura; fallos de la guarda abortan la mutación; rollback/migración no debilitan historia existente.
11. **Evidencia en backend/BD:** La API no expone endpoint de edición; Calidad actualiza estado/revisor/fecha. FKs restringen borrado con relaciones, pero no se identificó trigger contra `UPDATE` directo de ciclo aprobado.
12. **Persistencia e interfaz:** La entidad contiene mediciones y estado; no hay una salvaguarda de BD citada para inmutabilidad. El cambio requeriría diseño de trigger/permisos u otra garantía equivalente para el motor soportado.
13. **Brecha asociada:** `B-PLA-011` abierta como hardening de integridad; el borrador no equivale a autorización de modificar base de datos.
14. **Preguntas abiertas:** Campos protegidos, orden de escritura en aprobación, privilegios de excepciones, motor/versiones, migración segura, auditoría y procedimiento de reparación/restauración.
15. **Cobertura preliminar:** Parcial: API limita mutaciones, pero no se constató protección completa frente a escritura directa.
16. **Certeza y límites:** Basado en entidad, servicio de Calidad y migraciones inspeccionadas. No se conectó a base desplegada ni se validó trigger; el diseño debe probarse en el motor autorizado antes de implementarse.

<a id="doc-requisitos-backend-planta-rf-pla-017-orden-esterilizacion-documento"></a>

**Origen:** docs/requisitos/backend/planta/RF-PLA-017-orden-esterilizacion-documento.md

---
id: RF-PLA-017
titulo: Generar y conservar la orden de esterilización
tipo: RF / Planta / Documentos
modulo: Planta / Documentos
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Planta; §7 Documentos generados"
fuente_contraste: "src/planta/planta.controller.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-esterilizacion.entity.ts; SterinovaFrontend/src/app/(erp)/planta/"
depende_de: [RF-PLA-002, RF-PLA-004, RF-PLA-010]
bloquea: []
brechas: [B-PLA-012]
historial:
  - version: 0.1
    nota: "Borrador derivado de §7; el código registra ciclos, pero no se encontró emisión/consulta de un documento de orden de esterilización."
---

## RF-PLA-017 — Generar y conservar la orden de esterilización

**Estado:** Borrador técnico; pendiente de validación.

1. **ID:** `RF-PLA-017`.
2. **Título:** Generar y conservar la orden de esterilización.
3. **Tipo:** RF / Planta / Documentos.
4. **Módulo:** Planta / Documentos.
5. **Descripción funcional:** Generar y conservar el documento de orden de esterilización que acompaña la preparación/ejecución del ciclo, vinculado al ciclo y a las órdenes/materiales de origen. El documento debe reflejar los datos autorizados al momento de su emisión.
6. **Reglas asociadas:** Respetar método contratado, ciclo, cantidades, protocolo versionado y reglas de autorización. La orden documental no sustituye el registro operativo de ciclo ni la evaluación/liberación de Calidad. Correcciones posteriores deben conservar el documento anterior.
7. **Actores / permisos:** Operadores de Planta autorizados para crear/consultar ciclos; permisos específicos para emitir, aprobar o descargar el documento deben definirse en la matriz RBAC.
8. **Datos y entidades:** Ciclo, orden(es), materiales/cantidades, método, equipo, protocolo/version, identificador interno y número físico cuando existan, responsable y datos documentales aprobados. El contenido exacto no está definido en §7.
9. **Flujo preliminar:** Crear ciclo con datos válidos → generar el documento en el momento que negocio determine → congelar snapshot y versión de formato → permitir consulta/descarga bajo ámbito de Planta → conservar versiones/correcciones.
10. **Criterios de aceptación preliminares:** (a) Documento vinculado inequívocamente a ciclo y materiales/órdenes correspondientes. (b) Contenido corresponde al snapshot aprobado. (c) No permite cambiar método contratado ni ampliar cantidades procesadas. (d) Descargas repetidas no cambian el original. (e) Enmienda conserva relación con el documento anterior. (f) Autorización respeta ámbito y separación de responsabilidades.
11. **Fuentes y evidencia actual:** §7 incluye órdenes de esterilización entre los documentos generados. `PlantaController` expone consulta/creación de ciclos y protocolos, no una ruta documental/PDF. `PlantaService` persiste el ciclo y sus cantidades; no se encontró emisión de `DocumentoEmitido` ni vínculo a snapshot/PDF de orden de esterilización. El frontend muestra y crea ciclos, sin vista de descarga del documento.
12. **Persistencia e interfaz:** Existe el registro operativo `CicloEsterilizacion`, pero no una entidad/tipo documental y flujo de generación específicos localizados en el módulo. El diseño deberá separar el snapshot del documento de los datos operativos mutables.
13. **Brecha asociada:** `B-PLA-012` registra que el documento de orden de esterilización exigido en §7 no tiene un flujo de generación/conservación identificado.
14. **Preguntas abiertas:** Contenido y destinatarios; si se emite al crear el ciclo, al preparar la tanda o antes del procesamiento; firma/aprobación requerida; relación con el número físico de máquina, protocolo y multiorden; formato y conservación. Se deriva a `RA-PLA-010`.
15. **Cobertura preliminar:** Faltante para documento emitido. La creación y persistencia del ciclo están cubiertas parcialmente por `RF-PLA-002`, pero no equivalen a una orden documental emitida.
16. **Certeza y límites:** La existencia del ciclo y ausencia de ruta de PDF/DocumentoEmitido se verificaron en el controlador/servicio de Planta y la UI. El anexo no detalla contenido ni momento de emisión; esos puntos requieren decisión y no se infieren.

<a id="doc-requisitos-backend-planta-rn-pla-001-metodo-contratado"></a>

**Origen:** docs/requisitos/backend/planta/RN-PLA-001-metodo-contratado.md

---
id: RN-PLA-001
titulo: No cambiar en Planta el método contratado
tipo: RN
modulo: Planta / Comercial / Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 64; src/planta/; src/logistica/; src/cotizaciones/"
depende_de: [RF-COM-003, RF-LOG-001, RF-PLA-002]
bloquea: [RF-PLA-015]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-010 se deriva a RF-PLA-015 para anclar la validación al método contratado por concepto."
---

## RN-PLA-001 — No cambiar en Planta el método contratado

**Fuente principal:** `Sterinova-ERP.md` §6: Planta no puede cambiar el método contratado.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 64; servicios, DTOs y entidades de Planta, Logística y Comercial.

1. **ID:** `RN-PLA-001`.
2. **Título:** No cambiar en Planta el método contratado.
3. **Tipo:** RN.
4. **Módulo:** Planta / Comercial / Logística.
5. **Enunciado:** El método del ciclo debe corresponder al método contratado para el concepto/material; Planta no puede sustituirlo durante el procesamiento.
6. **Reglas asociadas:** Comercial define el método según requerimiento y compatibilidad; órdenes con varios servicios deben conservar método por concepto y no inferir un método único para todos los materiales.
7. **Actores y permisos:** Operador con `planta.ciclos.crear` registra el método del ciclo. Logística puede crear/editar el método operativo de la orden antes del primer evento o ciclo.
8. **Datos y entidades:** `CotizacionItem.metodo` es texto libre; `OrdenServicio.metodo_esterilizacion` guarda un único método `ETO`/`VAPOR`; `CicloEsterilizacion.metodo` es enum `ETO`/`VAPOR`.
9. **Flujo y validación:** `PlantaService.createCiclo` compara el DTO con el método actual de la orden o el derivado del tipo de servicio. Rechaza discrepancia. La edición logística de materiales/método se bloquea cuando ya existe evento o ciclo, pero antes de ese punto permite cambiar el método conforme al tipo de cotización.
10. **Criterios de aceptación:** Resolver el método desde el concepto comercial correspondiente; no permitir cambios desde Planta; permitir correcciones solo mediante autorización/trazabilidad comercial; bloquear la creación de ciclo cuando el método no coincide con el concepto contratado.
11. **Evidencia en backend:** `createCiclo` valida igualdad con `orden.metodo_esterilizacion ?? metodoOrden(quote.tipo_servicio)`. `metodoOrden` impide contradicciones para tipos de servicio con sufijo `_ETO`/`_VAPOR`.
12. **Evidencia adicional:** `LogisticaService.createOrden` y `updateMateriales` establecen el método usando `metodoOrden`; esta función no compara con `CotizacionItem.metodo` cuando el tipo de servicio no codifica EtO/Vapor. El endpoint logístico de actualización deja modificarlo antes del primer evento/ciclo.
13. **Brechas derivadas:** `B-PLA-010` se asigna a `RF-PLA-015` para vincular estrictamente el método de orden/ciclo con el método contratado por concepto. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿Cómo se resuelven servicios múltiples o tipos genéricos con métodos distintos? ¿Qué rol aprueba una corrección contractual y cómo se audita? Se deben concretar dentro de `RF-PLA-015` y sus dependencias comerciales/logísticas.
15. **Estado de cobertura:** Parcial. El alta de ciclo no permite que el operador seleccione un método distinto del método actual de la orden, pero el método actual no siempre está anclado al método contractual por ítem y Logística puede cambiarlo antes del ciclo.
16. **Nivel de certeza y límites:** Confirmado en el código versionado y reglas de negocio revisadas. No se verificó una base desplegada.

<a id="doc-requisitos-backend-planta-rn-pla-002-no-sobrescribir"></a>

**Origen:** docs/requisitos/backend/planta/RN-PLA-002-no-sobrescribir.md

---
id: RN-PLA-002
titulo: No sobrescribir ciclos aprobados; vincular reprocesos con el original
tipo: RN
modulo: Planta / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 68; src/planta/; src/calidad/; src/certificados/; src/database/migrations/"
depende_de: [RF-PLA-003, RF-PLA-004]
bloquea: [RF-PLA-011, RF-PLA-016]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. El reproceso se mantiene en RF-PLA-011; B-PLA-011 deriva el hardening de inmutabilidad a RF-PLA-016."
---

## RN-PLA-002 — No sobrescribir ciclos aprobados; vincular reprocesos con el original

**Fuente principal:** `Sterinova-ERP.md` §6: un ciclo aprobado no debe sobrescribirse; un reproceso genera una ejecución nueva vinculada al original.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 68; controladores/servicios de Planta y Calidad, entidad de ciclo y migraciones.

1. **ID:** `RN-PLA-002`.
2. **Título:** No sobrescribir ciclos aprobados; vincular reprocesos con el original.
3. **Tipo:** RN.
4. **Módulo:** Planta / Calidad.
5. **Enunciado:** Un ciclo aprobado conserva sus parámetros y decisiones sin modificación ni eliminación; todo reproceso se registra como un nuevo ciclo vinculado al original.
6. **Reglas asociadas:** Conservar intentos originales fallidos y sus evidencias. Un reproceso no reemplaza el registro anterior y requiere conservar su vínculo y trazabilidad.
7. **Actores y permisos:** Planta crea ciclos; Calidad aprueba/rechaza con permisos separados y confirmación de contraseña para aprobar.
8. **Datos y entidades:** `CicloEsterilizacion` guarda estado, revisor, fecha de revisión, motivo de rechazo y `ciclo_correccion_de_id`; certificado y evaluaciones referencian el ciclo.
9. **Flujo y protección actual:** El controlador de Planta solo expone GET y POST de ciclos. Calidad expone consulta, aprobar y rechazar; esas operaciones solo cambian estado/revisión y exigen ciclo pendiente. No hay ruta normal para editar/eliminar el ciclo ni para establecer el vínculo de corrección en un nuevo ciclo.
10. **Criterios de aceptación:** Bloquear cambios de datos originales tras aprobación; impedir borrado; crear reproceso como nuevo ciclo enlazado; conservar información, evidencias y decisiones previas; auditar autor y fecha de cada acción.
11. **Evidencia en backend:** `CalidadService.aprobar/rechazar` carga el ciclo con bloqueo, verifica `PENDIENTE_CALIDAD` y actualiza estado/revisor/fecha; no modifica mediciones. `PlantaController` no declara PATCH/PUT/DELETE de ciclos.
12. **Evidencia en BD:** Certificados, evaluaciones, materiales procesados y correcciones usan FKs con `ON DELETE RESTRICT`, por lo que el ciclo aprobado con certificado no puede borrarse mientras este exista. No se encontró trigger que impida actualizar los campos de un ciclo aprobado mediante escritura directa en BD.
13. **Brechas derivadas:** La falta de flujo activo de reproceso sigue absorbida por `B-PLA-005` → `RF-PLA-011`. `B-PLA-011` se registra para protección de inmutabilidad a nivel de BD y se asigna a `RF-PLA-016`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿La inmutabilidad debe imponerse también con trigger/controles de BD? ¿Qué campos pueden cambiar por una transición legítima de Calidad y cómo distinguirlos de los datos de ejecución inmutables?
15. **Estado de cobertura:** Parcial. No hay endpoint de edición/borrado y la FK del certificado restringe eliminación; la BD no bloquea actualizaciones directas y el reproceso vinculado no tiene flujo operativo.
16. **Nivel de certeza y límites:** Confirmado en rutas, servicios, entidades y migraciones versionadas. No se consultó una BD desplegada.

<a id="doc-requisitos-backend-seguridad-rf-seg-001-password-aprobaciones"></a>

**Origen:** docs/requisitos/backend/seguridad/RF-SEG-001-password-aprobaciones.md

---
id: RF-SEG-001
titulo: Confirmación por contraseña en operaciones críticas
tipo: RF / Seguridad
modulo: Seguridad transversal
estado: consolidado
certeza: inferido
version: 0.1
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §4"
fuente_contraste: "src/auth/auth.service.ts; src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md"
depende_de: []
bloquea: []
brechas: []
historial:
  - version: 0.1
    nota: "Borrador de origen para B-005-03; su alcance se consolidó en RNF-SEG-002 para evitar mantener dos requisitos paralelos. Se conserva como antecedente hasta cerrar la ficha derivada."
---

## RF-SEG-001 — Confirmación por contraseña en operaciones críticas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-SEG-001`.
2. **Título:** Confirmación por contraseña en operaciones críticas.
3. **Tipo:** RF / Seguridad.
4. **Módulo:** Seguridad transversal.
5. **Descripción funcional:** El sistema debe solicitar y validar de nuevo la contraseña del usuario autenticado antes de confirmar operaciones que se clasifiquen como críticas, además de comprobar autorización y ámbito mediante la sesión vigente.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Operaciones críticas cubiertas; confirmación por contraseña frente a reautenticación equivalente; vigencia de la confirmación; protección contra repetición; límite de intentos y respuesta ante fallo; auditoría sin almacenar secretos; seguridad de transporte; experiencia de usuario; integración con sesiones, RBAC y ámbitos.
7. **Actores / permisos:** Usuarios autorizados del dominio Seguridad transversal; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una operación clasificada como crítica, cuando el usuario no aporta una confirmación válida de contraseña, entonces la operación se rechaza sin persistir sus efectos.<br>- Dada una confirmación válida, cuando el usuario también tiene permiso y ámbito suficientes, entonces la operación puede continuar y se registra su ejecución sin guardar la contraseña.<br>- Dada una operación no clasificada como crítica, cuando se ejecuta, entonces la política aprobada determina si no requiere confirmación adicional.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §4. Contraste: src/auth/auth.service.ts; src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md. Evidencia técnica leída: - `Sterinova-ERP.md` §4 contempla confirmación por contraseña para aprobaciones críticas.
- `src/auth/auth.service.ts` incluye `verifyPassword(userId, password)`.
- La ruta `POST /cotizaciones/:id/aprobar` exige `cotizaciones.aprobar_interna`, pero su DTO actual solo recibe la versión y no solicita contraseña; el servicio de aprobación no invoca `verifyPassword`.
- `B-005-03` se deriva desde `RF-COM-005` y se mantiene asociada a `RNF-SEG-002`. Esta ficha se conserva como antecedente del alcance inicial; no duplicar la brecha ni la implementación.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** []. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Operaciones críticas cubiertas; confirmación por contraseña frente a reautenticación equivalente; vigencia de la confirmación; protección contra repetición; límite de intentos y respuesta ante fallo; auditoría sin almacenar secretos; seguridad de transporte; experiencia de usuario; integración con sesiones, RBAC y ámbitos.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.

<a id="doc-requisitos-backend-seguridad-rnf-seg-001-autorizacion-ambito"></a>

**Origen:** docs/requisitos/backend/seguridad/RNF-SEG-001-autorizacion-ambito.md

---
id: RNF-SEG-001
titulo: Validación de autorización y ámbito en backend
tipo: RNF / Seguridad
modulo: Seguridad transversal
estado: parcial
certeza: confirmado
version: 1.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §4 Seguridad"
fuente_contraste: "src/auth/jwt.strategy.ts; src/rbac/authorization.guard.ts; src/rbac/rbac-authorization.service.ts; src/app.module.ts"
depende_de: []
bloquea: []
brechas: [B-SEG-001]
historial:
  - version: 1.0
    nota: "Análisis técnico presentado en chat y recontrastado con el código el 2026-11-20; pendiente de validación explícita de la ficha."
  - version: 1.1
    nota: "Se añade evidencia de una consulta de documento logístico que no propaga el ámbito al servicio; requiere revisión de autorización por recurso."
---

## RNF-SEG-001 — Validación de autorización y ámbito en backend

**Fuente principal:** `Sterinova-ERP.md` §4, Seguridad: ámbitos, validación de sesión, revalidación de permisos en backend y autorización real en el API.

**Fuentes de contraste:** guard global de JWT y autorización, estrategia JWT y servicio RBAC.

1. **ID:** `RNF-SEG-001`.
2. **Título:** Validación de autorización y ámbito en backend.
3. **Tipo:** RNF / Seguridad.
4. **Módulo:** Seguridad transversal.
5. **Descripción funcional:** El backend comprueba identidad, permiso y ámbito del recurso en cada operación protegida.
6. **Reglas asociadas:** Denegar por defecto; validar sesión y permisos en backend; obtener identidad y concesiones de fuentes del servidor; limitar consultas al ámbito autorizado; no confiar en rol, ámbito ni creador enviados por el cliente.
7. **Actores y permisos:** Usuarios autenticados con permisos y ámbitos vigentes según RBAC.
8. **Datos y entidades:** Usuario activo, asignaciones, roles, permisos, ámbitos jerárquicos y ámbito persistido del recurso.
9. **Flujo:** JWT → validación del usuario → guards → carga de concesiones vigentes → evaluación de permiso/ámbito → filtro del recurso o rechazo.
10. **Criterios de aceptación:** Sin sesión válida se responde 401; sin permiso, 403; recurso fuera de ámbito no se expone; el ámbito solicitado solo restringe concesiones existentes.
11. **Evidencia backend:** `JwtStrategy` comprueba usuario activo y `password_version`. `PermissionGuard` obtiene el contexto RBAC en cada solicitud; `AuthorizationGuard` es global y deniega rutas sin política explícita. La antigua descarga `GET /logistica/documentos-emitidos/:id/pdf`, cuyo lookup no filtraba por ámbito, fue retirada. Las rutas marcadas públicas en los controladores revisados son login, restablecimiento con token, validación pública de certificado y health; no se identificó otra ruta pública de datos operativos. `/health/ready` informa estado de base de datos, almacenamiento y renderer PDF, por lo que su exposición en producción requiere confirmación de operación. No se confirmó acceso cruzado ni exposición externa en ejecución.
12. **Persistencia y alcance:** El backend consulta roles, permisos, asignaciones y ámbitos RBAC. `x-scope-id` selecciona o acota un ámbito autorizado, no otorga permisos.
13. **Brechas derivadas:** `B-SEG-001`: completar y verificar la cobertura de autorización por permiso y ámbito en todas las rutas privadas vigentes, incluyendo el filtrado de consultas y documentos logísticos.
14. **Preguntas abiertas:** Confirmar si `/health/ready` debe seguir expuesto públicamente o limitarse a una red/sonda de infraestructura; completar el inventario de rutas y verificar filtrado de recurso/ámbito en las rutas vigentes.
15. **Estado de cobertura:** Parcial; el núcleo de sesión/RBAC está implementado y la cobertura transversal requiere completarse.
16. **Certeza y límites:** El requisito contractual está confirmado en §4. La cobertura parcial se basa en guards, estrategia, servicio RBAC, composición global y la ruta logística señalada. No se inventariaron exhaustivamente todas las rutas ni se probaron accesos cruzados de la API completa; la ruta se considera hallazgo estático pendiente de comprobación dinámica.

<a id="doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas"></a>

**Origen:** docs/requisitos/backend/seguridad/RNF-SEG-002-sesiones-operaciones-criticas.md

---
id: RNF-SEG-002
titulo: Protección de sesiones y operaciones críticas
tipo: RNF / Seguridad
modulo: Seguridad y autenticación
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §4 Seguridad; §3 Calidad"
fuente_contraste: "src/auth/; src/calidad/calidad.service.ts; src/cotizaciones/; SterinovaFrontend/src/lib/api.ts; SterinovaFrontend/src/app/login/page.tsx"
depende_de: [RNF-SEG-001]
bloquea: []
brechas: [B-005-03]
historial:
  - version: 1.0
    nota: "Análisis técnico presentado en chat y recontrastado con ambos repositorios el 2026-11-20; pendiente de validación explícita de la ficha."
---

## RNF-SEG-002 — Protección de sesiones y operaciones críticas

**Fuente principal:** `Sterinova-ERP.md` §4, Seguridad (JWT, validación de sesión, separación de responsabilidades, confirmación por contraseña y auditoría); §3, Calidad (confirmación mediante contraseña y aprobaciones independientes).

**Fuentes de contraste:** módulo/controlador de autenticación, estrategia JWT, servicio de contraseña, servicios de aprobación y cliente/login de SterinovaFrontend.

1. **ID:** `RNF-SEG-002`.
2. **Título:** Protección de sesiones y operaciones críticas.
3. **Tipo:** RNF / Seguridad.
4. **Módulo:** Seguridad y autenticación.
5. **Descripción funcional:** Proteger credenciales y sesiones, limitar intentos de autenticación y aplicar controles adicionales a las operaciones críticas definidas por el negocio.
6. **Reglas asociadas:** Validar sesión JWT y permisos en backend; conservar separación de responsabilidades; exigir confirmación por contraseña para aprobaciones críticas; rechazar operaciones no autorizadas y mantener trazabilidad sin registrar secretos.
7. **Actores y permisos:** Usuarios autenticados; la confirmación adicional no sustituye permisos ni ámbito.
8. **Datos y entidades:** Hash de contraseña, JWT, versión de contraseña, usuario activo, intentos y eventos de auditoría.
9. **Flujo:** Login limitado → emisión JWT → comprobación de firma, vencimiento, usuario y versión en solicitudes → autorización → reautenticación cuando la operación lo exija.
10. **Criterios de aceptación:** Rechazar tokens vencidos, usuarios inactivos y versiones obsoletas; limitar intentos; no guardar secretos en auditoría; no ejecutar una operación crítica ante confirmación inválida.
11. **Evidencia backend/frontend:** JWT de 8 horas; `JwtStrategy` revalida usuario activo y versión de contraseña. Login y restablecimiento limitan a cinco intentos por minuto; hay un límite global. `verifyPassword` existe y se usa en aprobación de Calidad, pero no en toda operación crítica. El login frontend guarda el access token en `localStorage`; ante 401 lo elimina y redirige a login.
12. **Persistencia y alcance:** Sesión backend stateless mediante JWT, sin refresh token ni sesión persistida identificados. La versión de contraseña permite invalidar tokens tras actualizar credenciales. La persistencia del token de acceso en `localStorage` debe considerarse al definir la política de sesión.
13. **Brechas derivadas:** `B-005-03`: definir las operaciones que requieren confirmación por contraseña y aplicar el control en cada una. No se registra contraseña en auditoría.
14. **Preguntas abiertas:** La clasificación funcional de operaciones críticas y si la confirmación será por operación o temporal quedan sujetas a la política acordada; el alcance funcional se mantiene como pendiente dentro de la brecha.
15. **Estado de cobertura:** Parcial; controles de sesión y login implementados, confirmación adicional no generalizada.
16. **Certeza y límites:** El requisito contractual se contrasta con §§3–4. La evidencia técnica se verificó en `AuthModule`, `AuthController`, `JwtStrategy`, usos localizados de `verifyPassword`, `SterinovaFrontend/src/lib/api.ts` y el login. El anexo no especifica duración del JWT ni límites de intentos; son controles observados, no requisitos contractuales. La ficha queda pendiente de validación explícita; no se auditó la configuración de proxy/infraestructura que puede afectar el rate limit por IP.

<a id="doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio"></a>

**Origen:** docs/requisitos/backend/trazabilidad/RF-TRA-001-cadena-servicio.md

---
id: RF-TRA-001
titulo: Reconstrucción de la cadena cliente-cotización-operación-certificado-entrega
tipo: RF / Trazabilidad
modulo: Transversal: Comercial, Logística, Planta y Certificados
estado: parcial
certeza: confirmado
version: 1.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Certificados; §5 Trazabilidad"
fuente_contraste: "src/ordenes-servicio/entities/; src/planta/entities/; src/certificados/entities/; src/logistica/"
depende_de: []
bloquea: []
brechas: [B-TRA-001]
historial:
  - version: 1.0
    nota: "Análisis técnico presentado en chat y recontrastado con ambos repositorios el 2026-11-20; pendiente de validación explícita de la ficha."
  - version: 1.1
    nota: "Se precisa que la entidad Entrega declarada no está conectada al flujo operativo revisado y se detallan los enlaces aún incompletos."
---

## RF-TRA-001 — Reconstrucción de la cadena cliente–cotización–operación–certificado–entrega

**Fuente principal:** `Sterinova-ERP.md` §5, Trazabilidad, que enumera doce elementos reconstruibles desde el cliente y la cotización hasta materiales entregados/devueltos y responsables; §3, Certificados, que exige asociación por orden/cliente, materiales de varios ciclos y certificados separados para clientes de ciclos compartidos.

**Fuentes de contraste:** entidades de orden, eventos, ciclos, certificados y entregas; consultas de Certificados y Logística.

1. **ID:** `RF-TRA-001`.
2. **Título:** Reconstrucción de la cadena cliente–cotización–operación–certificado–entrega.
3. **Tipo:** RF / Trazabilidad.
4. **Módulo:** Transversal: Comercial, Logística, Planta y Certificados.
5. **Descripción funcional:** Reconstruir quién solicitó el servicio, cotización de origen, materiales recibidos y lotes/cantidades que llegaron a Planta, tanda/ciclo, parámetros/protocolo, decisiones de Calidad, aprobaciones/rechazos, certificado, entrega/devolución y responsables.
6. **Reglas asociadas:** Conservar relaciones y eventos entre etapas; respetar permisos y ámbitos; mantener trazabilidad de recepciones y entregas parciales; vincular certificados por orden/cliente y agregar ciclos cuando corresponda; conservar certificados separados por cliente en ciclos compartidos; identificar responsables de cada operación.
7. **Actores y permisos:** Usuarios operativos autorizados según permiso y ámbito; el alcance de una vista integral debe seguir esos controles.
8. **Datos y entidades:** Cliente, cotización, orden, materiales, eventos logísticos, ciclos, certificados y entregas.
9. **Flujo:** Cliente → cotización → orden → recepción/eventos → ciclos → certificado → entrega.
10. **Criterios de aceptación:** Desde un identificador del servicio, reconstruir los doce elementos enumerados en §5 cuando existan; presentar fechas y responsables; enlazar materiales, cantidades, lotes, tanda/ciclo, parámetros, protocolo, decisiones y certificado; agrupar materiales de ciclos según orden/cliente sin mezclar certificados de clientes distintos; distinguir aprobados, rechazados, entregados y devueltos; señalar etapas faltantes; denegar elementos fuera del ámbito autorizado.
11. **Evidencia backend:** `OrdenServicio` enlaza cotización y `CicloEsterilizacion` enlaza una orden; `CicloMaterialProcesado` asocia ciclo con material de orden. `CertificadoEsterilizacion` enlaza ciclo y orden. Logística persiste `OrdenServicioEvento` por orden, pero `Entrega` está declarada sin servicio/controlador/migración operativa identificados; la ruta activa de entrega usa el evento `ENTREGA_CLIENTE`. Las consultas permanecen repartidas por módulo.
12. **Persistencia y alcance:** No se confirmó una consulta única de extremo a extremo. Los eventos guardan parte del detalle en JSON; `CicloEsterilizacion` admite una orden por ciclo; `Entrega` no constituye una fuente operativa verificada; las líneas de recepción no están persistidas por el servicio revisado. Las cantidades de certificado requieren reconciliación con `CicloMaterialProcesado` según `RF-CER-002`/`RF-CER-005`.
13. **Brechas derivadas:** `B-TRA-001`: implementar y verificar una consulta integral de trazabilidad con enlaces, hitos, responsables, fechas, etapas faltantes y autorización por ámbito.
14. **Preguntas abiertas:** El identificador inicial de búsqueda (orden, cotización, cliente o certificado) y los perfiles autorizados para la vista integral deben precisarse durante el diseño. Los artefactos logísticos y la orden documental de esterilización tienen requisitos derivados propios en `RF-LOG-022`, `RF-LOG-023` y `RF-PLA-017`; sus decisiones de contenido incluyen `RA-LOG-002` y `RA-PLA-010`.
15. **Estado de cobertura:** Parcial; hay relaciones y consultas por módulo, sin vista integral confirmada.
16. **Certeza y límites:** Requisito confirmado en §5. Las relaciones descritas se contrastaron con entidades y servicios citados; no se inspeccionó una base desplegada ni se probó reconstrucción integral por datos reales. El flujo multiorden, recepción por línea y ciclo de vida de Entrega siguen asociados a fichas derivadas pendientes.

<a id="doc-requisitos-backend-usuarios-rf-usr-001-administracion-usuarios"></a>

**Origen:** docs/requisitos/backend/usuarios/RF-USR-001-administracion-usuarios.md

---
id: RF-USR-001
titulo: Administrar usuarios y su estado
tipo: RF
modulo: Usuarios y Administración
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/users/; src/auth/; src/rbac/; src/database/migrations/"
depende_de: [RF-USR-002]
bloquea: [RF-AUD-003]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-USR-001 se deriva a RF-AUD-003."
---

## RF-USR-001 — Administrar usuarios y su estado

**Fuente principal:** `Sterinova-ERP.md` §3: usuarios activos/inactivos, cambio de estado y auditoría.

**Fuentes de contraste:** entidades, servicios, controladores y autorización de Usuarios/RBAC.

1. **ID:** `RF-USR-001`.
2. **Título:** Administrar usuarios y su estado.
3. **Tipo:** RF.
4. **Módulo:** Usuarios y Administración.
5. **Descripción funcional:** Crear y administrar identidades, activar/desactivar usuarios y preservar registros para no perder referencias históricas.
6. **Reglas asociadas:** Usuario inactivo no inicia sesión ni obtiene autorización; no desactivar el propio usuario ni al último administrador global. No borrar identidades por el flujo administrativo.
7. **Actores y permisos:** Gestión requiere `usuarios.identidad.gestionar` y autorización global; consulta requiere `usuarios.ver` y ámbito permitido.
8. **Datos y entidades:** `User` incluye `activo:boolean`; no tiene columna estado ni `DeleteDateColumn`.
9. **Flujo:** Creación de usuario y asignación inicial en transacción; activación/desactivación por `PATCH /users/:id/status`; DELETE es denegado.
10. **Criterios de aceptación:** Mantener usuarios activos/inactivos; inactivos no autorizan; desactivación protege último admin; conservar identidad y relaciones históricas.
11. **Evidencia backend:** `UsersService.setActive`, `AuthService` y `RbacAuthorizationService`; `UsersController` bloquea eliminación de identidad.
12. **Persistencia y trazabilidad:** Se conserva la fila con `activo=false`; FK de RBAC/auditoría restringen borrado. No se halló evento explícito de auditoría al cambiar `activo`.
13. **Brechas derivadas:** `B-USR-001` se asigna a `RF-AUD-003` para auditar cambios de estado de usuarios/RBAC. La ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Política de motivo y datos específicos a registrar al activar/desactivar; se concretará en RF-AUD-003.
15. **Estado de cobertura:** Parcial. Estado e inactivación están implementados; falta auditoría explícita del cambio de estado.
16. **Certeza y límites:** Confirmado en entidades, controladores, servicios, guards y migraciones inspeccionados; no se verificó BD desplegada.

<a id="doc-requisitos-backend-usuarios-rf-usr-002-roles-ambitos"></a>

**Origen:** docs/requisitos/backend/usuarios/RF-USR-002-roles-ambitos.md

---
id: RF-USR-002
titulo: Asignar varios roles, permisos y ámbitos a usuarios
tipo: RF
modulo: Usuarios / RBAC
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/users/user-roles.service.ts; src/rbac/entities/; src/rbac/rbac-authorization.service.ts; src/rbac/resource-access.ts"
depende_de: [RF-USR-001]
bloquea: [RA-USR-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto. La política para asignaciones en varias plantas se deriva a RA-USR-001."
---

## RF-USR-002 — Asignar varios roles, permisos y ámbitos a usuarios

**Fuente principal:** `Sterinova-ERP.md` §3: roles múltiples, permisos granulares y ámbitos globales/departamentales/por planta.

**Fuentes de contraste:** entidades RBAC, servicio de asignaciones, compilador de políticas, filtros de recursos y procedimiento transaccional.

1. **ID:** `RF-USR-002`.
2. **Título:** Asignar varios roles, permisos y ámbitos a usuarios.
3. **Tipo:** RF.
4. **Módulo:** Usuarios / RBAC.
5. **Descripción funcional:** Asignar varias combinaciones de rol y ámbito a cada usuario y aplicar permisos granulares sobre recursos de ámbitos autorizados.
6. **Reglas asociadas:** Solo asignaciones/roles/permisos/ámbitos activos conceden acceso; el ámbito solicitado reduce permisos existentes y nunca añade otros; ámbito Global requiere elegibilidad.
7. **Actores y permisos:** Asignaciones requieren `asignaciones.gestionar` y administración global; cada endpoint operativo exige permiso explícito y política de recurso.
8. **Datos y entidades:** `RbacUserRoleAssignment` enlaza usuario, rol y ámbito; `RbacScope` representa jerarquía `GLOBAL`, `DEPARTMENT`, `TEAM`, `PLANT`; permisos definen acceso `OWN`/`SCOPE` y descendientes.
9. **Flujo:** El servicio agrega/quita asignaciones y ejecuta `rbac_set_user_roles`; el procedimiento valida entradas y jerarquía, preserva cambios con control de versión y transacción.
10. **Criterios de aceptación:** Aceptar múltiples roles/ámbitos; rechazar duplicados e inactivos; derivar permiso y alcance por política; filtrar registros y denegar contexto no autorizado.
11. **Evidencia backend:** `UserRolesService.assign/remove`, `RbacAuthorizationService.getContext`, `compileAuthorizationPolicy`, `resourceWhere` y guardas de autorización.
12. **Persistencia y segregación:** Unicidad por usuario/rol/ámbito y FKs; scopes de tipo planta permiten aislamiento. Descendientes solo se incluyen cuando la concesión lo declara; endpoints deben aplicar los contextos/filtros.
13. **Brechas:** `brechas: []`. La validación funcional del núcleo RBAC se considera cubierta.
14. **Pregunta derivada:** La política de roles que se pueden asignar simultáneamente en varias plantas queda en `RA-USR-001`.
15. **Estado de cobertura:** Cubierto para asignación múltiple, permisos por rol y alcance RBAC según evidencia revisada.
16. **Certeza y límites:** Confirmado en código y esquema versionado; no se verificó configuración RBAC en una base desplegada. La decisión de negocio no altera la cobertura del mecanismo central.

<a id="doc-requisitos-backend-usuarios-rf-usr-003-administracion-areas"></a>

**Origen:** docs/requisitos/backend/usuarios/RF-USR-003-administracion-areas.md

---
id: RF-USR-003
titulo: Administrar áreas y permisos
tipo: RF
modulo: Usuarios / RBAC
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/rbac/ambitos/; src/rbac/entities/; src/users/user-roles.service.ts; src/rbac/permission-catalog.ts"
depende_de: [RF-USR-002]
bloquea: [RF-USR-004, RA-USR-002]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-USR-002 deriva a RA-USR-002; B-USR-003 a RF-USR-004."
---

## RF-USR-003 — Administrar áreas y permisos

**Fuente principal:** `Sterinova-ERP.md` §3: administración de áreas, roles y permisos.

**Fuentes de contraste:** entidades y API RBAC de scopes, roles, permisos y asignaciones.

1. **ID:** `RF-USR-003`.
2. **Título:** Administrar áreas y permisos.
3. **Tipo:** RF.
4. **Módulo:** Usuarios / RBAC.
5. **Descripción funcional:** Administrar estructura organizativa, permisos por rol y asociación de usuarios a áreas/ámbitos.
6. **Reglas asociadas:** Ámbitos jerárquicos globales, departamentales y por planta; autorización efectiva en backend con permisos granulares.
7. **Actores y permisos:** `ambitos.gestionar` permite administrar scopes; `roles.gestionar` está declarado para roles/permisos, pero no se encontró API de mutación; asignación de roles requiere permiso aparte.
8. **Datos y entidades:** No hay entidad `Area`; `RbacScope` usa tipos GLOBAL/DEPARTMENT/TEAM/PLANT. Usuario se relaciona al ámbito vía asignación de rol y `scope_id`.
9. **Flujo:** API de ámbitos lista/crea/actualiza/cierra scopes; el catálogo de roles/permisos se consulta, y la asignación de roles a usuarios sí es editable.
10. **Criterios de aceptación:** Administrar áreas y relación jerárquica; asociar usuarios; administrar permisos por rol; auditar cambios y hacer cumplir permisos/ámbitos.
11. **Evidencia backend:** `AmbitoController/Service` tiene CRUD de scopes; `UserRolesService.catalog` devuelve roles, permisos y scopes; `UserRolesController` permite asignaciones, no crear roles ni modificar sus permisos.
12. **Persistencia y límites:** Scopes y relaciones role-permission existen en esquema. No se encontró controlador/servicio de CRUD de rol/permisos; no existe `area_id` ni tabla específica de áreas.
13. **Brechas derivadas:** `B-USR-002` a `RA-USR-002` para decidir si scope DEPARTMENT equivale a área operativa; `B-USR-003` a `RF-USR-004` para CRUD dinámico de roles/permisos. Ficha sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definición de áreas frente a scopes queda en RA-USR-002; alcance/controles del CRUD dinámico en RF-USR-004.
15. **Estado de cobertura:** Parcial. Se administra jerarquía de ámbitos, pero no áreas separadas ni permisos por rol mediante API.
16. **Certeza y límites:** Confirmado en rutas RBAC/Usuarios y entidades inspeccionadas. No se verificó configuración desplegada.

<a id="doc-requisitos-backend-usuarios-rf-usr-004-crud-roles"></a>

**Origen:** docs/requisitos/backend/usuarios/RF-USR-004-crud-roles.md

---
id: RF-USR-004
titulo: Implementar CRUD para gestión dinámica de Roles y Permisos
tipo: RF
modulo: Usuarios / RBAC
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/rbac/entities/role.entity.ts; src/rbac/permission-catalog.ts; src/users/user-roles.service.ts"
depende_de: [RF-USR-003]
bloquea: []
brechas: [B-USR-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-USR-003."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos a partir del catálogo y API RBAC actuales."
---

## RF-USR-004 — Implementar CRUD para gestión dinámica de Roles y Permisos

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-USR-004`.
2. **Título:** Implementar CRUD para gestión dinámica de Roles y Permisos.
3. **Tipo:** RF.
4. **Módulo:** Usuarios / RBAC.
5. **Descripción funcional:** Permitir a personal administrador gestionar roles y su relación con permisos desde el sistema, en lugar de depender exclusivamente de cambios del catálogo en código.
6. **Reglas asociadas:** Exigir autorización administrativa; proteger asignaciones activas; preservar separación de funciones; registrar cambios; impedir quitar permisos o desactivar roles de forma que deje el sistema sin administrador operativo. Si los permisos siguen predefinidos, limitar CRUD a los códigos disponibles.
7. **Actores / permisos:** Actor con permiso administrativo global según la política RBAC. `roles.gestionar` está declarado, pero el catálogo y asignaciones actuales usan también `asignaciones.gestionar`; la autorización objetivo requiere decisión y contrato explícito.
8. **Datos y entidades:** `RbacRole`/`rbac_roles`, permisos (`rbac_permissions` y catálogo TypeScript `PERMISSION_CATALOG`), relación rol–permiso y asignaciones usuario–rol–ámbito.
9. **Flujo preliminar:** Consultar catálogo → crear/editar/desactivar rol → asociar permisos permitidos → validar dependencias y privilegios → auditar → publicar cambios y recalcular/revalidar concesiones.
10. **Criterios de aceptación preliminares:** Solo actores autorizados modifican roles; permisos desconocidos o inactivos se rechazan; cambios no alteran asignaciones históricas sin regla explícita; se registra before/after; los permisos efectivos se reevalúan tras cambios.
11. **Evidencia en backend:** `UserRolesController` expone catálogo y asignaciones, pero no CRUD de roles ni permisos. `UserRolesService.catalog` filtra un conjunto codificado de roles y lee concesiones. `PERMISSION_CATALOG` es fuente estática. La brecha `B-USR-003` corresponde al CRUD faltante.
12. **Persistencia e interfaz:** Existen entidades y tablas RBAC para roles, permisos y grants; la interfaz actual consulta catálogo y asignaciones, no crea roles/permisos. No se evaluó una migración/esquema para permisos arbitrarios.
13. **Brecha asociada:** `B-USR-003` abierta; esta ficha absorbe el alcance de CRUD dinámico derivado de `RF-USR-003`.
14. **Preguntas abiertas:** ¿El catálogo de permisos será extensible o controlado por código? ¿Qué atributos editará el administrador? ¿Qué operaciones requieren alcance global, aprobación adicional o bloqueo de autoescalamiento? ¿Cómo retirar roles usados históricamente?
15. **Estado de cobertura preliminar:** Faltante en API para creación/edición de roles y permisos; consulta de catálogo/asignaciones sí existe.
16. **Certeza y límites:** La ausencia de endpoints se comprobó en controladores/servicios consultados y la naturaleza estática en `permission-catalog.ts`. El diseño de gobierno de permisos no está decidido y el documento permanece en borrador.

<a id="doc-requisitos-brechas-registro-brechas"></a>

**Origen:** docs/requisitos/brechas/registro-brechas.md

## Registro acumulado de brechas

Las brechas permanecen abiertas hasta decisión explícita del usuario. Se conservan sus IDs al reasignarlas a fichas derivadas.

| ID brecha | Requisito asociado | Descripción | Fuentes / evidencia | Estado | Impacto |
|---|---|---|---|---|---|
| B-OPS-001 | [RNF-OPS-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-operacion-rnf-ops-001-operacion-produccion) | El anexo §8 declara pendiente el despliegue y operación completa en producción; no se encontró un criterio de salida a producción ni objetivos operativos aprobados en el paquete de requisitos. | `Sterinova-ERP.md` §8; inventario documental `docs/requisitos/` | Abierta; requiere levantamiento operativo | No hay base documental suficiente para declarar preparación productiva ni para comprobar criterios de despliegue, recuperación y soporte. |
| B-SEG-001 | [RNF-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-001-autorizacion-ambito) | Aunque hay guards globales y RBAC, la autorización por recurso/ámbito requiere revisión transversal. La antigua ruta `GET /logistica/documentos-emitidos/:id/pdf` sin filtro de ámbito fue retirada; `GET /health/ready` sigue marcado público y revela estado de base de datos, almacenamiento y renderer. No se comprobó acceso cruzado ni exposición en producción. | `Sterinova-ERP.md` §4; `src/app.module.ts`; `src/rbac/authorization.guard.ts`; `src/logistica/logistica.controller.ts`; `src/health/health.controller.ts` | Abierta | Completar el inventario de rutas y confirmar filtrado por ámbito en los accesos documentales vigentes; validar política de exposición de readiness. |
| B-TRA-001 | [RF-TRA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio) | La sección §5 exige reconstruir doce hitos del servicio; §3 exige certificados por orden/cliente, agrupación de ciclos y separación por cliente. Hay relaciones por módulo, pero falta verificar e implementar una consulta integral que cubra esas reglas junto con recepciones, cantidades/lotes, parámetros/protocolo, decisiones de Calidad y entregas/devoluciones. | `Sterinova-ERP.md` §3 y §5; `src/ordenes-servicio/entities/`; `src/planta/entities/`; `src/certificados/entities/`; `src/logistica/` | Abierta | No se puede reconstruir ni consultar de forma integral la evidencia y el estado de cada etapa del recorrido ni demostrar correctamente la composición documental por cliente. |
| B-001-01 | [RA-COM-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-001-ciclo-vida-cliente) | El ciclo activo/inactivo aparece en documentación backend, no en el alcance explícito de `Sterinova-ERP.md` §3 ni en la entidad/controlador inspeccionados. | Anexo §3; `docs/negocio/reglas-maestras.md`, Módulo 2, respuestas 17 y 20; `src/clientes/entities/cliente.entity.ts`; `src/clientes/clientes.controller.ts` | Abierta | No se determina si activación/inactivación es contractual ni se evidencia implementada en el módulo inspeccionado. |
| B-001-02 | [RF-COM-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-009-importacion-clientes) | Existe endpoint masivo y omisión por NIT exacto; falta contrastar normalización, conciliación, revisión y conflictos documentados. | Anexo §3; `docs/negocio/reglas-maestras.md`, Módulo 2, respuestas 11–20; `src/clientes/clientes.controller.ts`; `src/clientes/clientes.service.ts` | Abierta | No se conoce aún si la importación satisface el proceso completo de negocio. |
| B-002-01 | [RA-COM-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-002-categorizacion-dispositivos) | El anexo §1 menciona comercialización de dispositivos médicos, pero no define si deben tener categoría o atributos regulatorios específicos. | `Sterinova-ERP.md` §1, §3 y §8; `src/productos/entities/producto.entity.ts` | Abierta | El catálogo usa `PRODUCTO` genérico; el negocio debe definir si hace falta una clasificación adicional. |
| B-002-02 | [RA-FIS-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-fis-001-fiscalidad-por-producto) | La tasa versionada se vincula a la cotización; el anexo §8 marca la integración fiscal real como pendiente y no define clasificación fiscal por ítem. | `Sterinova-ERP.md` §8; `src/tasas-fiscales/`; `src/cotizaciones/entities/cotizacion.entity.ts`; migración `1794225600000-AddVersionedIva.ts` | Abierta | Debe definirse si la integración futura asignará tratamiento fiscal por producto/servicio o conservará la tasa a nivel de cotización. |
| B-003-01 | [RF-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-003-cotizaciones-crud) | Posible edición directa de cotizaciones emitidas. La revisión confirmó que el servicio bloquea la edición por estado y `fecha_emision`; no se observa incumplimiento. | Anexo §6; `src/cotizaciones/cotizaciones.service.ts` | Descartada por validación | No requiere corrección; conservar la evidencia del bloqueo. |
| B-003-02 | [RA-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-003-flujo-reemplazo) | El anexo exige nueva revisión o documento de reemplazo para corregir una cotización emitida; el flujo de reemplazo vinculado no se encontró en la evidencia revisada. | Anexo §6; `src/cotizaciones/cotizaciones.controller.ts`; `src/cotizaciones/cotizaciones.service.ts` | Abierta | Debe decidirse cómo representar y vincular la corrección sin modificar el original emitido. |
| B-003-03 | [RF-COM-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-010-descuentos-cotizaciones) | El anexo §3 pide descuentos; el DTO y la entidad de ítem inspeccionados no muestran campos ni cálculo de descuento por ítem. | Anexo §3; `src/cotizaciones/dto/create-cotizacion-item.dto.ts`; `src/cotizaciones/entities/cotizacion-item.entity.ts`; `src/cotizaciones/cotizacion-item-builder.ts` | Abierta | El cálculo comercial no cubre descuentos; reglas y criterios se analizarán en `RF-COM-010`. |
| B-003-04 | [RA-COM-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-004-transicion-estado-emitida) | El método de emisión persiste `fecha_emision`, pero no asigna explícitamente `EstadoCotizacion.EMITIDA`. | `src/cotizaciones/entities/estado-cotizacion.enum.ts`; `src/cotizaciones/cotizaciones.service.ts` | Abierta | Definir si la fecha basta como marca de emisión o si debe ocurrir transición formal de estado. |
| B-004-01 | [RF-COM-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-011-vigencia-oferta) | `validez_oferta` se almacena como texto libre; no se encontró fecha estructurada ni control temporal antes de aprobar o emitir. | Anexo §2; `docs/negocio/reglas-maestras.md`, Módulo 3, §9 y §12; `src/cotizaciones/entities/cotizacion.entity.ts`; `src/cotizaciones/cotizaciones.service.ts` | Abierta | Una oferta vencida no puede identificarse por lógica del backend ni bloquearse de forma verificable. |
| B-004-02 | [RA-COM-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-005-precios-cliente) | El precio se captura por ítem de cotización; no se encontró catálogo reutilizable de precios o condiciones especiales ligado al cliente. | `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 26–29; `src/cotizaciones/entities/cotizacion-item.entity.ts`; `src/productos/entities/producto.entity.ts`; `src/clientes/entities/cliente.entity.ts` | Abierta | El negocio debe decidir si el precio por cotización es suficiente o si requiere precios maestros reutilizables por cliente. |
| B-005-01 | [RF-COM-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-005-revision-aprobacion) | Posible autoaprobación por el creador. La revisión confirmó que el servicio compara creador y aprobador y rechaza si son la misma persona. | Anexo §4; `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 32–35; `src/cotizaciones/cotizaciones.service.ts`, `assertApprovalCandidate` | Descartada por validación | No requiere corrección; conservar la evidencia de la separación de responsabilidades. |
| B-005-02 | [RF-COM-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-012-paso-revision) | El enum declara `EN_REVISION`, pero no se encontró una transición a ese estado; la aprobación pasa directamente de `BORRADOR` a `APROBADA`. | Anexo §3 y §6; `src/cotizaciones/entities/estado-cotizacion.enum.ts`; `src/cotizaciones/cotizaciones.controller.ts`; `src/cotizaciones/cotizaciones.service.ts` | Abierta | No se implementa la etapa de revisión requerida antes de la aprobación interna. |
| B-005-03 | [RNF-SEG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas) | El anexo exige confirmación por contraseña para aprobaciones críticas; la aprobación de cotización no recibe contraseña ni valida reautenticación, y falta clasificar el resto de las operaciones críticas. | Anexo §4; `src/cotizaciones/dto/update-cotizacion.dto.ts`, `QuoteVersionDto`; `src/cotizaciones/cotizaciones.service.ts`; `src/auth/auth.service.ts` | Abierta | Definir el catálogo de operaciones que requieren confirmación y aplicar el control acordado. |
| B-006-01 | [RF-COM-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion) | No se encontró operación para registrar el envío ni transición de `APROBADA` a `ENVIADA`. | Anexo §3 y §6; `src/cotizaciones/cotizaciones.controller.ts`; `src/cotizaciones/cotizaciones.service.ts`; `docs/arquitectura/roles-y-permisos.md` | Abierta | No hay registro de envío de una versión aprobada al cliente. |
| B-006-02 | [RF-COM-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion) | No se encontró operación para registrar aceptación ni transición de `ENVIADA` a `ACEPTADA_CLIENTE`; existen columnas de responsable y fecha sin lógica que las persista. | Anexo §6; `src/cotizaciones/entities/cotizacion.entity.ts`; `src/cotizaciones/cotizaciones.controller.ts`; `src/cotizaciones/cotizaciones.service.ts`; migración `1794312000000-AddBackendRoleSchema.ts` | Abierta | La respuesta del cliente no puede registrarse mediante un flujo del backend inspeccionado. |
| B-006-03 | [RA-COM-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-006-evidencia-aceptacion) | La cotización no tiene campo ni asociación de evidencia; el negocio no ha definido si basta una orden de compra, documento firmado, correo o registro manual. | Anexo §6; `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 32–35; `src/cotizaciones/entities/cotizacion.entity.ts`; `src/ordenes-servicio/entities/orden-servicio.entity.ts` | Abierta | Debe definirse qué soporte se conserva para demostrar la aceptación. |
| B-006-04 | [RF-COM-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion) | La emisión comprueba aprobación interna, pero no exige estado `ACEPTADA_CLIENTE`. | Anexo §6; `src/cotizaciones/cotizaciones.service.ts`, método `emitir` | Abierta | Puede iniciarse la emisión operativa sin aceptación registrada del cliente. |
| B-007-01 | [RA-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-007-reconstruccion-pdf-historico) | Si un documento emitido carece de snapshot y debe reconstruirse, `ensurePdfCurrent` puede generar el PDF desde los datos y formato actuales; no se halló backfill de snapshots de cotizaciones históricas en la migración revisada. | Anexo §6 y §7; `src/cotizaciones/cotizaciones.service.ts`, `ensurePdfCurrent`; migración `1793750400000-AddDocumentFormatVersioning.ts` | Abierta | Una reconstrucción puede no coincidir con el documento comercial histórico; el negocio debe decidir bloquearla, marcarla o establecer otra política auditable. |
| B-008-01 | [RF-COM-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-014-bloqueo-emision-anulacion) | `emitir` no comprueba si la cotización tiene una solicitud de anulación `PENDIENTE`; una cotización aprobada puede emitirse mientras se tramita su anulación. | `src/cotizaciones/cotizaciones.service.ts`, método `emitir`; `src/cotizaciones/solicitud-anulacion.service.ts` | Abierta | Puede avanzarse a emisión pese a que una anulación está pendiente; se requiere una compuerta de emisión transaccional. |
| B-008-02 | [RF-AUD-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-002-atomicidad-auditoria) | La resolución de anulación guarda el evento `ANULAR` mediante `AuditoriaService.create` sin pasar el `EntityManager` de la transacción de negocio. | `src/cotizaciones/solicitud-anulacion.service.ts`; `src/auditoria/auditoria.service.ts` | Abierta | Una falla posterior podría revertir la decisión de negocio y dejar un evento de auditoría independiente. |
| B-008-03 | [RA-COM-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-008-politicas-anulacion) | La observación de resolución acepta texto vacío y no está definido si se requiere al rechazar; tampoco está precisado el comportamiento de emisión después del rechazo. | `src/cotizaciones/dto/solicitud-anulacion.dto.ts`; `src/cotizaciones/solicitud-anulacion.service.ts`; reglas-maestras M1 «Anulación con aprobación» | Abierta | La resolución puede carecer de explicación y la disponibilidad posterior de la cotización no está definida explícitamente. |
| B-LOG-001 | [RF-LOG-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-006-precarga-items) | Crear una orden no precarga los ítems de la cotización: la interfaz inicia con una fila manual vacía; el detalle enviado es opcional en el DTO/API y puede carecer de vínculo con un ítem cotizado. | `src/logistica/logistica.service.ts`; `src/logistica/dto/create-orden.dto.ts`; `src/ordenes-servicio/entities/orden-servicio-material.entity.ts`; `SterinovaFrontend/src/app/(erp)/logistica/page.tsx`; `SterinovaFrontend/src/components/logistica/MaterialesEditor.tsx` | Abierta | El operador retranscribe productos y puede quedar una orden vacía o con líneas cuya trazabilidad al contrato no está preservada. |
| B-LOG-002 | [RF-LOG-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-007-fix-relacion-orden) | `OrdenServicio.cotizacion` usa `OneToOne`, aunque la migración y el servicio admiten múltiples órdenes por cotización. | `src/ordenes-servicio/entities/orden-servicio.entity.ts`; `src/database/migrations/1795100000000-AllowMultipleOrdersPerQuote.ts`; `src/logistica/logistica.service.ts` | Abierta | El mapeo ORM contradice la cardinalidad del dominio/BD y puede producir relaciones o consultas inconsistentes. |
| B-LOG-003 | [RA-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-001-soportes-comerciales) | La regla permite OC del cliente o autorización explícita del Jefe de Área, pero el servicio exige `orden_compra_cliente` como un único soporte textual. | `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 47; `src/logistica/dto/create-orden.dto.ts`; `src/logistica/logistica.service.ts` | Abierta | Falta definir cómo registrar y evidenciar la autorización alternativa a la OC. |
| B-LOG-004 | [RF-LOG-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-008-entidad-rutas) | No se encontró entidad ni flujo para rutas compartidas que agrupen órdenes de varios clientes con responsable y datos de transporte a nivel de ruta. | `Sterinova-ERP.md` §3; reglas-maestras Módulo 4, respuesta 54; hoja de ruta D08; `src/logistica/`; `src/ordenes-servicio/` | Abierta | No puede planificarse ni consultarse una ruta común conservando los eventos independientes de cada orden. |
| B-LOG-005 | [RF-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-001-recogidas-rutas) | La interfaz no ofrece la transición directa desde `PENDIENTE` a recepción en planta; el backend sí admite el evento directo. Pendiente para fase frontend. | `src/logistica/logistica.service.ts`; `SterinovaFrontend/src/app/(erp)/logistica/page.tsx`; `SterinovaFrontend/src/lib/logistica-types.ts`; hoja de ruta D08 | Pendiente para fase frontend | El usuario de Logística no puede registrar desde la interfaz el flujo de llegada directa definido por negocio. |
| B-LOG-006 | [RF-LOG-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-009-modalidad-ingreso) | No hay una modalidad persistida y explícita que distinga ingreso por recogida de llegada directa, aunque ambos flujos se mencionan y el backend puede registrar recepción directa. | `Sterinova-ERP.md` §3; hoja de ruta D08; `src/ordenes-servicio/entities/orden-servicio.entity.ts`; `src/logistica/logistica.service.ts` | Abierta | Se dificulta distinguir y auditar el origen del material y aplicar validaciones específicas por modalidad. |
| B-LOG-007 | [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion) | `RecepcionService` solo persiste cabecera y no usa `RecepcionItem`; no se encontró migración que cree `recepcion_items`. | `src/logistica/recepcion.service.ts`; `src/logistica/entities/recepcion-item.entity.ts`; `src/database/migrations/1795500000000-RecepcionLogistica.ts` | Abierta | No quedan persistidos los materiales, lotes y cantidades de cada recepción. |
| B-LOG-008 | [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion) | La recepción tiene unicidad por orden y no conserva recepciones parciales sucesivas ni saldo acumulado por línea. | `src/logistica/entities/recepcion-logistica.entity.ts`; migración `1795500000000-RecepcionLogistica.ts`; `src/logistica/recepcion.service.ts` | Abierta | No se puede conocer de forma fiable cuánto queda pendiente después de varias entregas parciales. |
| B-LOG-009 | [RF-LOG-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-011-validacion-lotes) | La entidad de ítem permite lote nulo, no incluye empaque ni vencimiento; el evento logístico exige cantidades enteras pese a unidades decimales de negocio. | `src/logistica/entities/recepcion-item.entity.ts`; `src/logistica/dto/evento-orden.dto.ts`; reglas-maestras Módulo 4, respuesta 50 | Abierta | La trazabilidad por lote/empaque y la cantidad física según unidad quedan incompletas; la aplicabilidad de vencimiento requiere definición. |
| B-LOG-010 | [RF-LOG-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta) | El evento de recepción no bloquea una cantidad superior a la ordenada y Planta controla ciclos contra cantidad de orden, no contra cantidad físicamente recibida. | `src/logistica/logistica.service.ts`; `src/logistica/dto/evento-orden.dto.ts`; `src/planta/planta.service.ts`; `src/planta/entities/ciclo-material-procesado.entity.ts` | Abierta | Puede quedar disponible para procesamiento una cantidad superior a la recepción real. |
| B-LOG-011 | [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion) | Remisión/factura y evidencias son opcionales en el DTO, aunque la regla de recepción solicita documentar dichos soportes. | `src/logistica/dto/create-recepcion.dto.ts`; `src/logistica/entities/recepcion-logistica.entity.ts`; reglas-maestras Módulo 4, respuesta 48 | Abierta | La recepción puede quedar sin soportes documentales requeridos para su trazabilidad. |
| B-LOG-012 | [RF-LOG-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta) | No hay vínculo operativo entre líneas físicas recibidas y asignaciones de Planta; además, materiales manuales sin `cotizacion_item_id` se omiten del saldo de órdenes. | `src/logistica/recepcion.service.ts`; `src/logistica/logistica.service.ts`, `assertSaldoDisponible`; `src/planta/planta.service.ts`; entidades de recepción/ciclo | Abierta | No se puede probar que una unidad recibida no se reasigne entre órdenes o ciclos ni cerrar todos los bypasses de saldo. |
| B-LOG-013 | [RF-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden) | Las reglas permiten varias órdenes por ciclo, pero el modelo y servicio de Planta vinculan cada ciclo a una sola orden. | `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 62; `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/planta/planta.service.ts` | Abierta | No se puede consolidar en un ciclo una carga compatible compuesta por órdenes distintas. |
| B-LOG-014 | [RF-LOG-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-013-rechazo-item) | No existe flujo para rechazar una línea/material con motivo obligatorio y disposición; `RECHAZADO` aplica a cabecera de recepción y no actualiza el material. | `src/logistica/recepcion.service.ts`; `src/logistica/entities/recepcion-logistica.entity.ts`; `src/logistica/entities/recepcion-item.entity.ts`; reglas-maestras Módulo 4, respuestas 49 y 53 | Abierta | El material rechazado no queda identificado ni gestionado para devolución, cuarentena o retiro. |
| B-LOG-015 | [RF-LOG-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-014-entidad-novedades) | No hay entidad de novedades; observaciones libres se guardan en cabecera o eventos y la unicidad `(orden_id,tipo)` impide repetir tipos de evento por orden. | `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts`; `src/logistica/logistica.service.ts`; migración `1794600000000-AddActaEventsAndLogisticsFormats.ts` | Abierta | Incidencias a nivel de orden/ítem y eventos repetidos no tienen registro estructurado propio. |
| B-LOG-016 | [RF-LOG-015](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-015-evidencias-adjuntos) | Los eventos logísticos no contienen adjuntos; los campos JSON de evidencia en otras entidades son opcionales y no están conectados a una carga/consulta de archivos. | `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts`; `src/logistica/entities/recepcion-logistica.entity.ts`; `src/logistica/entities/entrega.entity.ts`; `src/logistica/` | Abierta | No se conserva evidencia fotográfica o firma vinculada al hecho logístico y sus responsables. |
| B-LOG-017 | [RF-LOG-016](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-016-cadena-custodia) | Los eventos guardan usuario ERP y nombres textuales, pero no un traspaso bilateral por material con aceptación formal del receptor. | `src/logistica/logistica.service.ts`, `updateEstado`; `src/logistica/dto/evento-orden.dto.ts`; `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts`; reglas-maestras Módulo 4, respuestas 48 y 54 | Abierta | La responsabilidad durante cada tramo y el acuse de recepción no quedan formalizados por línea/material. |
| B-LOG-018 | [RF-LOG-017](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-017-recepcion-usuario-planta) | `recibido_por` se persiste como texto libre; la transición a `EN_PLANTA` no valida identidad ni permiso del usuario receptor de Planta. | `src/logistica/dto/evento-orden.dto.ts`; `src/logistica/logistica.service.ts`; `src/planta/planta.controller.ts` | Abierta | No se acredita que el material haya sido recibido por un usuario autorizado del área destino. |
| B-LOG-019 | [RF-LOG-018](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-018-acta-traspaso) | El evento `RECEPCION_PLANTA` no genera acta de transferencia bilateral ni conserva evidencia vinculada a cantidades físicas traspasadas. | `src/logistica/logistica.service.ts`; `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts`; documentos/actas logísticos revisados | Abierta | No hay soporte formal para conciliar cantidades entregadas y recibidas ni acreditar aceptación de custodia. |
| B-LOG-020 | [RA-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-003-inventario-planta) | Planta consulta materiales de órdenes `EN_PLANTA`, pero no se encontró inventario/microbodega con movimientos y existencias alimentadas por la transferencia. | `Sterinova-ERP.md` §8; `src/planta/planta.service.ts`; `src/ordenes-servicio/entities/orden-servicio-material.entity.ts` | Abierta | El negocio debe decidir si requiere existencias y movimientos independientes del estado de la orden. |
| B-LOG-021 | [RF-LOG-019](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-019-entregas-acumulables) | El flujo permite una sola transición `ENTREGADO`; no acumula entregas parciales ni conserva saldo por material. | `src/logistica/logistica.service.ts`; `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts`; `src/logistica/dto/evento-orden.dto.ts` | Abierta | Una entrega parcial puede cerrar la orden sin saldo registrable para futuras entregas. |
| B-LOG-022 | [RF-LOG-020](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-020-pod-firmas) | La entrega guarda receptor textual, pero el evento no adjunta POD firmada/fotografiada y no hay flujo operativo de evidencia. | `src/logistica/dto/evento-orden.dto.ts`; `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts`; `src/components/logistica/RegistroEventoOrdenModal.tsx`; reglas-maestras Módulo 4, respuesta 54 | Abierta | No se conserva una prueba verificable de recepción del cliente vinculada con los materiales entregados. |
| B-LOG-023 | [RF-LOG-021](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-021-fix-entidad-entrega) | La entidad `Entrega` está declarada, pero no se encontró migración/flujo de servicio/controlador que la persista; la ruta operativa registra `ENTREGA_CLIENTE` en eventos de orden. | `src/logistica/entities/entrega.entity.ts`; `src/logistica/logistica.controller.ts`; `src/logistica/logistica.service.ts`; migraciones de Logística | Abierta | Hay dos modelos conceptuales de entrega sin una fuente operativa consistente; además la entidad no conserva líneas/cantidades parciales. |
| B-LOG-024 | [RF-LOG-022](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-022-inmutabilidad-documentos) | La ruta GET genera y guarda el PDF desde datos actuales antes de insertar `DocumentoEmitido`; una emisión duplicada es rechazada por unicidad. La antigua ruta posterior, que buscaba un entero como consecutivo, fue retirada; el acta aún persiste un consecutivo distinto del snapshot. | `src/logistica/logistica.controller.ts`; `src/logistica/logistica.service.ts`; `src/logistica/entities/documento-emitido.entity.ts`; `src/common/services/storage.service.ts`; `SterinovaFrontend/src/app/(erp)/logistica/page.tsx` | Abierta | Reintentos pueden fallar en lugar de recuperar el documento y falta una lectura idempotente de la emisión histórica; el artefacto podría divergir del snapshot si el almacenamiento sustituye la clave. El efecto de sustitución no se verificó en runtime. |
| B-LOG-025 | [RF-LOG-023](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-023-acta-recepcion) | §7 lista actas de recepción, pero se retiró el servicio dedicado que solo persistía cabecera y no generaba un acta/PDF; `ACTA_SERVICIO` se genera desde la orden y es otro tipo documental. | `Sterinova-ERP.md` §7; `src/logistica/logistica.controller.ts`; `src/logistica/entities/recepcion-logistica.entity.ts`; `src/logistica/entities/documento-emitido.entity.ts` | Abierta | La recepción física no produce el artefacto documental solicitado ni una copia histórica del detalle recibido. |
| B-PLA-001 | [RF-PLA-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-007-catalogo-equipos) | No existe catálogo de equipos: los ciclos guardan el equipo como texto libre; el modelo contempla EtO/Vapor, no clasificación de equipos de lavandería. | `Sterinova-ERP.md` §3; `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 58–59; `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/planta/dto/create-ciclo.dto.ts` | Abierta | No hay identidad de equipo seleccionable ni trazabilidad uniforme entre ciclos; lavandería carece de clasificación modelada. |
| B-PLA-002 | [RF-PLA-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-008-control-mantenimiento) | La creación del ciclo no verifica disponibilidad, mantenimiento, Fuera de Servicio ni vigencia de calibración del equipo. | `Sterinova-ERP.md` §6; `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 60; `src/planta/planta.service.ts` | Abierta | Un equipo inhabilitado podría registrarse en un ciclo porque el backend no comprueba el estado del activo. |
| B-PLA-003 | [RF-PLA-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-009-validacion-capacidad) | El modelo/servicio no guarda capacidad del equipo ni compara la carga del ciclo con un límite de capacidad. | `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 59; `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/planta/planta.service.ts` | Abierta | La carga puede superar la capacidad aprobada; unidades y cálculo deben definirse. |
| B-PLA-004 | [RF-PLA-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-010-consecutivos-ciclos) | Los ciclos solo tienen una clave primaria técnica; no conservan consecutivo de negocio ni número físico de ciclo de máquina. | `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 61 y 68; `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/planta/dto/create-ciclo.dto.ts` | Abierta | No se satisface la identificación operativa trazable del ciclo ni se registra el número de la máquina. |
| B-PLA-005 | [RF-PLA-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-011-flujo-reprocesos) | El acumulado de cantidades incluye ciclos `RECHAZADO` y no existe flujo activo para crear ciclo de reproceso enlazado al original. | `src/planta/planta.service.ts`; `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/calidad/calidad.service.ts`; reglas-maestras Módulo 5, respuesta 68 | Abierta | Los materiales rechazados quedan descontados del saldo y no pueden reintentarse según la regla de conservación y reproceso. |
| B-PLA-006 | [RF-PLA-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-012-evidencias-adjuntas) | No existe flujo de archivos adjuntos de ciclo para evidencias BI/CI, gráficos, CSV/PDF de máquina o fotos de carga. | `Sterinova-ERP.md` §3 y §5; `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 75; `src/planta/`; `src/calidad/` | Abierta | La revisión del proceso carece de evidencia documental/física asociada al ciclo/material. |
| B-PLA-007 | [RF-PLA-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-013-justificacion-no-aplica) | La evaluación guarda el criterio `NO_APLICA`, pero no un motivo justificativo, aunque la regla de negocio exige justificarlo. | `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 74; `src/calidad/dto/evaluacion-parametro.dto.ts`; `src/planta/entities/ciclo-parametro-evaluacion.entity.ts` | Abierta | No puede demostrarse por qué se excluyó un parámetro ni distinguir una no aplicación legítima de una omisión. |
| B-PLA-008 | [RF-PLA-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-014-entidad-tandas) | No existe una entidad/flujo `Tanda` separado del ciclo; el backend crea ciclos individuales asociados a órdenes. | `Sterinova-ERP.md` §3; `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/planta/planta.service.ts` | Abierta | No se puede representar ni consultar la agrupación operativa que el anexo distingue del ciclo. |
| B-PLA-009 | [RA-PLA-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-008-politicas-recetas) | No existen recetas de proceso ni relaciones con insumos consumidos; §8 deja la definición de recetas/consumos pendiente de negocio. | `Sterinova-ERP.md` §3 y §8; `src/planta/`; `src/productos/` | Abierta | Falta definir procesos, materiales, unidades, inventario y reglas antes de diseñar consumo productivo. |
| B-PLA-010 | [RF-PLA-015](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-015-bloqueo-metodo) | El ciclo compara con el método operativo actual de la orden, pero Logística puede editarlo antes del primer ciclo y el método no se contrasta consistentemente con el método contratado por concepto. | `src/planta/planta.service.ts`; `src/logistica/logistica.service.ts`; `src/cotizaciones/entities/cotizacion-item.entity.ts`; reglas-maestras Módulo 5, respuesta 64 | Abierta | La verificación del ciclo no garantiza por sí sola que el método de la orden permanezca anclado al contrato. |
| B-PLA-011 | [RF-PLA-016](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-016-trigger-inmutabilidad) | No se encontró protección de BD contra `UPDATE` directo de un ciclo aprobado; la inmutabilidad depende de que la API no exponga edición. | `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/calidad/calidad.service.ts`; `src/database/migrations/` | Abierta | Una escritura privilegiada directa podría alterar mediciones históricas aprobadas sin que la API la bloquee. |
| B-PLA-012 | [RF-PLA-017](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-017-orden-esterilizacion-documento) | §7 incluye órdenes de esterilización entre los documentos generados; el módulo de Planta crea y consulta ciclos, pero no se encontró generación/conservación de una orden documental o PDF vinculada al ciclo. | `Sterinova-ERP.md` §7; `src/planta/planta.controller.ts`; `src/planta/planta.service.ts`; `SterinovaFrontend/src/app/(erp)/planta/` | Abierta | No hay un artefacto documental verificable para la instrucción/orden de procesamiento; contenido y momento de emisión requieren decisión en `RA-PLA-010`. |
| B-CAL-001 | [RF-CAL-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-005-sugerencia-ui-calidad) | El backend compara mediciones con los rangos durante la aprobación, pero la UI no presenta previamente la sugerencia automática para revisión de Calidad. | `docs/negocio/reglas-maestras.md`, Módulo 6, respuesta 73; `src/certificados/informacion-tecnica.ts`; frontend `app/(erp)/calidad/` | Abierta | Calidad debe seleccionar manualmente los criterios sin ver una clasificación calculada previa por parámetro. |
| B-CAL-002 | [RF-CAL-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-006-cuarentena-materiales) / [RA-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-001-politicas-cuarentena) | No hay estado de cuarentena/retención ni decisión de rechazo por material/lote con destino; el backend rechaza el ciclo completo. | `Sterinova-ERP.md` §3; `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 70, 76–79; `src/planta/entities/ciclo-esterilizacion.entity.ts`; `src/calidad/` | Abierta | Material pendiente o rechazado carece de estado y disposición individual trazable; falta decidir el alcance de la cuarentena. |
| B-CAL-003 | [RF-CAL-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-007-bypass-ordenes-sin-metodo) | La validación de ciclos aprobados y certificados antes de entregar se ejecuta solo cuando la orden tiene `metodo_esterilizacion` informado. | `src/logistica/logistica.service.ts`; `src/ordenes-servicio/entities/orden-servicio.entity.ts`; `Sterinova-ERP.md` §6 | Abierta | Una orden sin método podría no pasar por la misma compuerta explícita de Calidad al despacho. |
| B-CAL-004 | [RF-CAL-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-008-modulo-capa) | No hay entidades ni endpoints para registrar desviaciones e investigaciones CAPA vinculadas a ciclos/materiales. | `Sterinova-ERP.md` §3; `src/calidad/`; `src/rbac/permission-catalog.ts` | Abierta | Los permisos de desviación están declarados sin un expediente funcional ni persistencia asociada. |
| B-CAL-005 | [RF-CAL-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-009-flujo-capa) / [RA-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-002-politicas-capa) | No existe ciclo de vida de CAPA con estados, plan de acciones, responsables, evidencia, verificación de eficacia y cierre. | `Sterinova-ERP.md` §3; `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 77 y 79; `src/calidad/` | Abierta | Sin reglas de negocio ni flujo implementado no se controla investigación ni efectividad de acciones. |
| B-CAL-006 | [RF-CAL-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-010-flujo-excepcion) / [RA-CAL-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-003-politicas-excepcion) | No existe flujo de liberación por excepción con evaluación de riesgo, evidencia, confirmación y firmas requeridas. | `Sterinova-ERP.md` §3, §6; `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 77 y 80; `src/calidad/`; `src/rbac/permission-catalog.ts` | Abierta | Los permisos están declarados, pero no hay autorización excepcional ni constancia diferenciada en el certificado. |
| B-CER-001 | [RF-CER-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-004-certificados-ciclos-compartidos) / [RA-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-001-politicas-certificacion) | Relación `OneToOne` y unicidad de `ciclo_id` impiden certificados independientes por cliente para un ciclo compartido. | `Sterinova-ERP.md` §3, §6; `src/certificados/entities/certificado-esterilizacion.entity.ts`; migración `1730750401000-AddQualityCertificates.ts` | Abierta | No se puede representar el escenario contractual de ciclo compartido entre clientes con certificados separados. |
| B-CER-002 | [RF-CER-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-005-cantidades-procesadas) / [RA-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-001-politicas-certificacion) | El snapshot de certificado toma `cantidad` desde materiales de orden y no las cantidades persistidas por ciclo en `ciclos_materiales_procesados`. | `src/certificados/certificados.service.ts`; `src/planta/entities/ciclo-material-procesado.entity.ts`; `Sterinova-ERP.md` §3, §7 | Abierta | Certificados de órdenes distribuidas entre ciclos pueden atribuir al ciclo la cantidad total de orden, no la cantidad procesada. |
| B-CER-003 | [RF-CER-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-006-flujo-anulacion) / [RA-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-002-politicas-reemplazo) | No existe operación de anulación de certificados ni creación de reemplazo vinculado; el estado `Anulado` solo se interpreta en consulta pública. | `Sterinova-ERP.md` §3; `src/certificados/certificados.controller.ts`; `src/certificados/certificados.service.ts` | Abierta | No se puede anular con trazabilidad ni conservar una relación formal entre original y sustituto. |
| B-CER-004 | [RF-CER-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-007-historial-versiones) / [RA-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-002-politicas-reemplazo) | No existe historial de versiones de PDF; regeneración con el mismo renderer puede escribir sobre la misma clave y la entidad mantiene solo referencia/hash actuales. | `Sterinova-ERP.md` §3, §7; `src/certificados/certificados.service.ts`; `src/certificados/entities/certificado-esterilizacion.entity.ts`; `src/pdf/pdf-generator.service.ts` | Abierta | Se pierde la evidencia de versiones anteriores o no queda registro verificable de regeneraciones. |
| B-USR-001 | [RF-AUD-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-003-auditoria-usuarios) | El cambio de `usuarios.activo` no genera un evento explícito de auditoría con actor y valores anterior/nuevo en el servicio de Usuarios. | `Sterinova-ERP.md` §3; `src/users/users.service.ts`; `src/users/users.controller.ts`; `src/auditoria/` | Abierta | La desactivación/reactivación no queda con trazabilidad de negocio explícita. |
| B-USR-002 | [RA-USR-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-usr-002-areas-scopes) | No hay entidad Área independiente; las áreas organizativas se representarían mediante scopes `DEPARTMENT`/`PLANT`, cuya equivalencia funcional debe confirmar el negocio. | `Sterinova-ERP.md` §3; `src/rbac/entities/scope.entity.ts`; `src/rbac/ambitos/` | Abierta | El modelo organizativo podría requerir atributos/relaciones no contenidos en scopes. |
| B-USR-003 | [RF-USR-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-004-crud-roles) | No existe API para crear/editar roles ni modificar sus permisos; `roles.gestionar` está declarado, pero el catálogo de roles/permisos es de consulta. | `Sterinova-ERP.md` §3; `src/rbac/entities/role.entity.ts`; `src/rbac/permission-catalog.ts`; `src/users/user-roles.service.ts` | Abierta | Para añadir roles/perfiles o cambiar permisos se requiere configuración técnica/código o intervención fuera del flujo de administración revisado. |
| B-AUD-001 | [RF-AUD-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-004-payload-auditoria) | El detalle de auditoría no usa un esquema uniforme before/after; algunos eventos capturan valores nuevos, otros ambos estados, y otros no registran cambio. | `Sterinova-ERP.md` §3; `src/auditoria/`; `src/rbac/ambitos/ambito.service.ts`; `src/database/migrations/1794312002000-UnifyUserRoleAssignments.ts` | Abierta | No se reconstruyen de forma homogénea los valores previos y posteriores a cada operación. |
| B-AUD-002 | [RF-AUD-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-001-consulta-auditoria) | La API devuelve un objeto paginado `{data,total,page,limit,totalPages}`, pero la página frontend lo tipa y consume como arreglo; además no presenta filtros de usuario/fecha ni controles de página. | `src/auditoria/auditoria.controller.ts`; `src/auditoria/auditoria.service.ts`; `src/auditoria/dto/query-auditoria.dto.ts`; `SterinovaFrontend/src/app/(erp)/auditoria/page.tsx`; `SterinovaFrontend/src/lib/auditoria-types.ts` | Abierta | La consulta UI no consume correctamente el contrato del API y puede fallar al aplicar `filter`; usuarios no pueden navegar por los filtros/páginas admitidos por backend. |

### Historial de reasignación

Al cerrar `RF-COM-001`, `B-001-01` se reasignó a `RA-COM-001` y `B-001-02` a `RF-COM-009`. La ficha `RF-COM-001` queda sin brechas propias y con cobertura `Cubierto`.

Al validar `RF-COM-002`, `B-002-01` se reasignó a `RA-COM-002` y `B-002-02` a `RA-FIS-001`. La ficha `RF-COM-002` queda sin brechas propias y con cobertura `Cubierto`.

Al validar `RF-COM-003`, `B-003-01` se descartó porque el servicio bloquea edición directa de cotizaciones emitidas. `B-003-02` se reasignó a `RA-COM-003`, `B-003-03` a `RF-COM-010` y `B-003-04` a `RA-COM-004`. La ficha `RF-COM-003` queda sin brechas propias y con cobertura `Cubierto`.

Al validar `RF-COM-004`, `B-004-01` se reasignó a `RF-COM-011` para desarrollar el control de vigencia y expiración; `B-004-02` se reasignó a `RA-COM-005` para decidir sobre precios especiales reutilizables por cliente. La ficha `RF-COM-004` conserva cobertura `Parcial` y queda sin brechas propias abiertas.

Al validar `RF-COM-005`, `B-005-01` se descartó porque el servicio bloquea la autoaprobación. `B-005-02` se reasignó a `RF-COM-012` para implementar la etapa de revisión; `B-005-03` se registró inicialmente en `RF-SEG-001` y luego se consolidó como brecha transversal de `RNF-SEG-002`, evitando duplicar el requisito de reautenticación. La ficha `RF-COM-005` conserva cobertura `Parcial` y queda sin brechas propias abiertas.

Al validar `RF-COM-006`, `B-006-01`, `B-006-02` y `B-006-04` se reasignaron a `RF-COM-013` para implementar envío, aceptación y bloqueo de emisión hasta la aceptación; `B-006-03` se reasignó a `RA-COM-006` para decidir qué evidencia conservar. La ficha `RF-COM-006` conserva cobertura `Parcial` y queda sin brechas propias abiertas.

Al validar `RF-COM-007`, `B-007-01` se reasignó a `RA-COM-007` para decidir cómo proceder con PDFs históricos sin snapshot. La pregunta incluye evaluar la protección en BD, ya que el trigger de cotizaciones revisado protege el sello asociado y no todo el JSON del snapshot. `RF-COM-007` conserva cobertura `Parcial` y queda sin brechas propias abiertas.

Al validar `RF-COM-008`, `B-008-01` se reasignó a `RF-COM-014` para bloquear la emisión mientras exista una solicitud de anulación pendiente; `B-008-02`, observación técnica sobre auditoría fuera de la transacción, se asignó a `RF-AUD-002`; `B-008-03`, políticas de observación y disponibilidad tras rechazo, se asignó a `RA-COM-008`. `RF-COM-008` conserva cobertura `Parcial` y queda sin brechas propias abiertas.

Al validar `RN-LOG-001` y `RF-LOG-001`, `B-LOG-001` se reasignó a `RF-LOG-006` para precarga y vínculo de ítems; `B-LOG-002` a `RF-LOG-007` para alinear la cardinalidad ORM; `B-LOG-003` a `RA-LOG-001` para decidir los soportes comerciales alternativos; `B-LOG-004` a `RF-LOG-008` para gestión de rutas compartidas; y `B-LOG-006` a `RF-LOG-009` para distinguir modalidad de ingreso. `B-LOG-005` queda asociado a `RF-LOG-001` únicamente como «Pendiente para fase frontend», sin crear requisito backend adicional. Ambas fichas aprobadas conservan cobertura `Parcial` y `brechas: []` en su frontmatter por derivación de hallazgos.

Al validar `RF-LOG-002` y `RN-LOG-002`, `B-LOG-007`, `B-LOG-008` y `B-LOG-011` se reasignaron a `RF-LOG-010` para persistencia de líneas, saldos parciales y remisión/factura; `B-LOG-009` a `RF-LOG-011` para validaciones de lote/empaque; `B-LOG-010` y `B-LOG-012` a `RF-LOG-012` para controlar Planta contra cantidades físicas recibidas; y `B-LOG-013` a `RF-PLA-006` para ciclos multiorden. Las preguntas de evidencia y notificación de parciales se derivaron a `RA-LOG-002`. Las dos fichas aprobadas conservan cobertura `Parcial` y `brechas: []` en frontmatter.

Al validar `RF-LOG-003`, `B-LOG-014` se reasignó a `RF-LOG-013` para rechazo y disposición por ítem; `B-LOG-015` a `RF-LOG-014` para novedades estructuradas; `B-LOG-016` a `RF-LOG-015` para adjuntos/evidencias; y `B-LOG-017` a `RF-LOG-016` para traspasos formales de custodia. La decisión sobre el destino del material rechazado se deriva a `RA-LOG-003`. La ficha `RF-LOG-003` conserva cobertura `Parcial` y queda con `brechas: []` en frontmatter.

Al validar `RF-LOG-004`, `B-LOG-018` se reasignó a `RF-LOG-017` para confirmar recepción con usuario autenticado de Planta; `B-LOG-019` a `RF-LOG-018` para acta, evidencia y cantidades de traspaso; y `B-LOG-020` a `RA-PLA-003` para decidir el alcance de inventario/microbodega en Planta. La ficha `RF-LOG-004` conserva cobertura `Parcial` y queda con `brechas: []` en frontmatter.

Al validar `RF-LOG-005`, `B-LOG-021` se reasignó a `RF-LOG-019` para entregas parciales acumulables y saldos; `B-LOG-022` a `RF-LOG-020` para POD y firmas; `B-LOG-023` a `RF-LOG-021` para integrar o depurar la entidad `Entrega`. Los criterios de cierre de orden y liberación de despachos parciales se derivaron a `RA-LOG-004`. La ficha `RF-LOG-005` conserva cobertura `Parcial` y queda con `brechas: []` en frontmatter.

Al validar `RF-PLA-001`, `B-PLA-001` se reasignó a `RF-PLA-007` para catálogo de equipos y clasificación de lavandería; `B-PLA-002` a `RF-PLA-008` para disponibilidad, mantenimiento y calibración; y `B-PLA-003` a `RF-PLA-009` para validación de capacidad. Las políticas de lavandería, calibración y unidades de capacidad se derivaron a `RA-PLA-004`. La ficha `RF-PLA-001` conserva cobertura `Parcial` y queda con `brechas: []` en su frontmatter.

Al validar `RF-PLA-002`, se confirmó que `B-LOG-013` permanece asignada a `RF-PLA-006` para soporte multiorden. `B-PLA-004`, por ausencia de consecutivo de negocio y número físico de ciclo, se asignó a `RF-PLA-010`; formatos y reglas de numeración se derivaron a `RA-PLA-005`. La ficha `RF-PLA-002` conserva cobertura `Parcial` y queda con `brechas: []`.

Al validar `RF-PLA-003`, `B-PLA-005` se reasignó a `RF-PLA-011` para implementar el flujo de reproceso y excluir cantidades rechazadas de los saldos procesados. Las reglas para reprocesos y disposición de material se derivaron a `RA-PLA-006`. La ficha `RF-PLA-003` conserva cobertura `Parcial` y queda con `brechas: []`.

Al validar `RF-PLA-004`, `B-PLA-006` se reasignó a `RF-PLA-012` para adjuntar evidencias de ciclo; `B-PLA-007` a `RF-PLA-013` para justificar `NO_APLICA`. Las políticas de tipos, formatos, obligatoriedad y conservación se derivaron a `RA-PLA-007`. La ficha `RF-PLA-004` conserva cobertura `Parcial` y queda con `brechas: []`.

Al validar `RF-PLA-005`, `B-PLA-008` se reasignó a `RF-PLA-014` para modelar una Tanda independiente de los ciclos. `B-PLA-009` se derivó a `RA-PLA-008` para definir recetas, insumos y microbodega, manteniendo coordinación con `RA-PLA-003`. La ficha `RF-PLA-005` conserva cobertura `Parcial` y queda con `brechas: []`.

Al validar `RN-PLA-001`, `B-PLA-010` se reasignó a `RF-PLA-015` para anclar el método operativo al método contratado por concepto. Al validar `RN-PLA-002`, `B-PLA-011` se asignó a `RF-PLA-016` para proteger la inmutabilidad de ciclos aprobados también en BD; el flujo de reprocesos permanece en `RF-PLA-011`. Ambas fichas de regla quedan con cobertura `Parcial` y `brechas: []`.

Al validar `RF-CAL-001` y `RF-CAL-002`, `B-CAL-001` se reasignó a `RF-CAL-005` para mostrar la sugerencia automática de cumplimiento en la UI; `B-CAL-002` se asignó a `RF-CAL-006` y `RA-CAL-001` para implementar cuarentena/rechazo por material y definir sus políticas; `B-CAL-003` se asignó a `RF-CAL-007` para asegurar la validación de Calidad al despachar órdenes sin método. Ambas fichas aprobadas conservan cobertura `Parcial` y `brechas: []`.

Al validar `RF-CAL-003` como `Faltante`, `B-CAL-004` se reasignó a `RF-CAL-008` para entidades/endpoints de Desviación y CAPA; `B-CAL-005` se asignó a `RF-CAL-009` para el ciclo de vida, acciones y eficacia, y a `RA-CAL-002` para acordar políticas. La ficha validada queda con `brechas: []` por derivación aprobada.

Al validar `RF-CAL-004` como `Faltante`, `B-CAL-006` se reasignó a `RF-CAL-010` para implementar el flujo de liberación por excepción y a `RA-CAL-003` para definir políticas, criterios y firmas. `B-CAL-003` permanece asignada a `RF-CAL-007` para blindar el despacho de órdenes sin método. `RN-CAL-001` queda con cobertura `Parcial` y `brechas: []` por derivación aprobada.

Al validar `RF-CER-001` y `RF-CER-002`, `B-CER-001` se reasignó a `RF-CER-004` para soportar certificados múltiples de ciclos compartidos, y `B-CER-002` a `RF-CER-005` para usar cantidades procesadas por ciclo en el snapshot. Las políticas de partición y agrupación se derivaron a `RA-CER-001`. Ambas fichas quedan con cobertura `Parcial` y `brechas: []`.

Al validar `RF-CER-003` y `RN-CER-001`, `B-CER-003` se reasignó a `RF-CER-006` para anulación/reemplazo vinculado y `B-CER-004` a `RF-CER-007` para historial de PDFs sin sobrescritura. Las políticas de conservación y sustitución se derivaron a `RA-CER-002`. Ambas fichas quedan con cobertura `Parcial` y `brechas: []`.

Al validar `RF-USR-001` como `Parcial`, `B-USR-001` se reasignó a `RF-AUD-003` para registrar auditoría explícita de cambios de estado de usuario y RBAC. `RF-USR-002` se validó como `Cubierto`; la política de roles simultáneos en varias plantas se deriva a `RA-USR-001`.

Al validar `RF-USR-003` y `RF-AUD-001` como `Parcial`, `B-USR-002` se derivó a `RA-USR-002` para decidir si las áreas operativas requieren entidad propia; `B-USR-003` se asignó a `RF-USR-004` para CRUD dinámico de roles/permisos; y `B-AUD-001` a `RF-AUD-004` para estandarizar before/after, relacionado con la atomicidad de `RF-AUD-002`.

En el contraste frontend/backend de auditoría del 2026-11-20 se detectó `B-AUD-002`: el API retorna un sobre paginado, pero la página frontend lo consume como lista plana y no expone todos los filtros/paginación disponibles. Se asigna a `RF-AUD-001`; no se modificó código.

Al validar `RNF-SEG-001`, `B-SEG-001` registra completar y verificar la autorización por permiso y ámbito en todas las rutas protegidas. Al validar `RNF-SEG-002`, `B-005-03` queda vinculada a la clasificación y reautenticación de operaciones críticas; la ficha preliminar `RF-SEG-001` se conserva para consolidación documental. Al validar `RF-TRA-001`, `B-TRA-001` registra la falta de una consulta integral de los doce hitos de §5. Las tres fichas quedan con cobertura `Parcial`.

En el cruce documental del anexo §7 se registraron brechas adicionales: `B-LOG-024` para recuperación idempotente y conservación de PDFs logísticos; `B-LOG-025` para emitir actas de recepción diferenciadas del Acta de Servicio; y `B-PLA-012` para generar y conservar la orden de esterilización enumerada en §7. El contenido y formato que el anexo no define se mantienen como preguntas abiertas; no se infieren como aprobados.

<a id="doc-requisitos-decisiones-decisiones-negocio"></a>

**Origen:** docs/requisitos/decisiones/decisiones-negocio.md

## Decisiones de negocio

Solo se registran decisiones explícitamente validadas por el usuario. Las preguntas abiertas permanecen en `por-aclarar/`.

| ID | Fecha | Decisión | Requisitos relacionados |
|---|---|---|---|
| D-COM-001 | 2026-11-18 | `RF-COM-001` se limita a registrar y consultar clientes y queda Cubierto. El ciclo activo/inactivo se separa en `RA-COM-001`; la importación masiva se analiza como `RF-COM-009`. | `RF-COM-001`, `RA-COM-001`, `RF-COM-009` |
| D-CAL-001 | Según registro de decisiones prioritarias | En una desviación que afecta un lote dentro de un ciclo compartido, se retiene el lote afectado; los demás lotes se evalúan de forma independiente. Si no es posible identificar con fiabilidad las unidades afectadas, se retiene el lote completo. La liberación de lotes conformes antes de cerrar la investigación requiere autorización documentada del Jefe de Calidad. | `RF-CAL-002`, `RF-CAL-006`, `RA-CAL-001`, `RF-CER-001`, `RF-CER-002` |
| D-CAL-002 | Según registro de decisiones prioritarias | Calidad determina el destino del material rechazado. Se admiten devolución al cliente, reproceso, destrucción u otro destino determinado por Calidad. Devolución y destrucción requieren constancia con responsable, fecha y evidencia. | `RF-CAL-002`, `RF-LOG-013`, `RA-CAL-001`, `RA-LOG-003` |
| D-PLA-001 | Según registro de decisiones prioritarias | Un reproceso requiere aprobación previa de Calidad y Planta y se registra en un ciclo nuevo vinculado al ciclo rechazado/original. Para un ciclo abortado, Calidad determina y documenta la disposición; abortar no libera automáticamente el material. Si se reprocesa, aplica la misma autorización previa y se crea un ciclo nuevo vinculado al abortado. | `RF-PLA-003`, `RF-PLA-011`, `RA-PLA-006` |
| D-LOG-001 | Según registro de decisiones prioritarias | Una orden se cierra cuando las cantidades aceptadas están liberadas y todo saldo restante tiene destino final registrado y la evidencia exigida completa. El procesamiento por sí solo no permite cerrar la orden. | `RF-LOG-005`, `RF-LOG-019`, `RA-LOG-004`, `RF-CAL-002` |

### Alcance y pendientes de precisión

Las decisiones D-CAL-001 a D-LOG-001 se transcriben del [registro de decisiones prioritarias](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-decisiones-prioridad-1-calidad-planta-logistica), que las identifica como confirmadas explícitamente por el usuario. La incorporación documental no cambia el estado de cobertura técnica ni aprueba la implementación. Las RA relacionadas conservan abiertos los detalles que el registro declara pendientes, como formatos de evidencia, saldos exactos, permisos de «otro destino» y conciliación entre lotes, certificados y entregas parciales. La instrucción de incorporación declara expresamente que los bloques funcionales de Logística y Planta no están validados como alcance operativo; las fichas técnicas aprobadas de esos módulos no sustituyen esa validación.

La fuente cita `RF-CAL-002-aprobar-rechazar-retener.md`; el archivo vigente es `RF-CAL-002-aprobacion-materiales.md`. Los enlaces activos usan el nombre vigente.

<a id="doc-requisitos-frontend-readme"></a>

**Origen:** docs/requisitos/frontend/README.md

## Análisis de requisitos frontend

`Sterinova-ERP.md` es la fuente contractual. Esta matriz describe la cobertura visible en SterinovaFrontend y enlaza requisitos y brechas backend existentes; no sustituye la autorización del API ni acredita operación en producción.

### Método y estado

- La matriz registra una fila por requisito contractual aplicable y separa cobertura frontend de cobertura backend.
- Se reutilizan los IDs del análisis backend cuando el requisito es compartido. No se abren fichas paralelas para las brechas ya registradas.
- Las fichas detalladas de 16 campos se crearán solo para requisitos frontend parciales, faltantes o ambiguos que no tengan ficha o brecha equivalente.
- Los bloques se analizan y presentan por módulo. Se documenta cada bloque después de su validación por el usuario.
- Las pruebas frontend revisadas usan API simulada, salvo que una fila indique lo contrario. No son verificación del recorrido contra backend o producción.

**Estado:** Comercial y Cotizaciones conserva su validación del 20 de noviembre de 2026. Logística, Planta, Calidad, Certificados, Usuarios/Auditoría, Seguridad y Trazabilidad se contrastaron con el código frontend y backend el 20 de noviembre de 2026; el análisis técnico queda pendiente de validación funcional por módulo. La evidencia de pruebas E2E existente usa API simulada y no demuestra integración en vivo.

### Comercial y Cotizaciones

**Fuente:** `Sterinova-ERP.md` §§3–7.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-COM-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-001-clientes), §3 | Consultar, crear y editar clientes | Listado, modal de alta/edición y selección de cliente en cotización. | Cubierto para consulta, alta y edición. | Backend: cubierto. La activación/inactivación de clientes no está exigida explícitamente por el anexo; se anota abajo como observación de integración. |
| [RF-COM-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-009-importacion-clientes), §3 | Importar clientes | Carga `.xlsx`/`.xls`, mapeo de encabezados, validación de razón social/NIT y resumen de importados/omitidos. | UI de importación disponible; el proceso integral depende del contrato y tratamiento de duplicados en API. | `B-001-02` abierta para normalización, conciliación y conflictos. |
| [RF-COM-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-002-productos-servicios), §3 | Gestionar catálogo de productos y servicios | CRUD de referencias y búsqueda de catálogo desde cotización; también se admiten ítems manuales. | Cubierto en interfaz. | Backend: cubierto según ficha vigente. |
| [RF-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-003-cotizaciones-crud), §3 | Crear y editar cotizaciones con varios ítems | Selector de cliente/tipo, múltiples líneas, catálogo e ítems manuales; edición de borrador con control de versión. | Cubierto para borradores y varias líneas. La emisión no permite edición directa desde UI. | Backend: cubierto para el alcance base. Descuentos se separan en `B-003-03`; el flujo de reemplazo emitido permanece en `RA-COM-003`. |
| [RF-COM-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-004-condiciones-vigencia), §3 | Gestionar precios y condiciones, incluida vigencia | Precio unitario por línea y campos para transporte, forma de pago, vigencia y otras condiciones. | Parcial: la vigencia es texto libre; no hay indicador o control temporal de expiración. | Backend parcial; `B-004-01` está derivada a [RF-COM-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-011-vigencia-oferta), borrador pendiente de validación. |
| [RF-COM-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-010-descuentos-cotizaciones), §3 | Aplicar descuentos por ítem | No se encontró campo ni cálculo de descuento en el formulario/tipo frontend. | Faltante. | `B-003-03` está derivada a [RF-COM-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-010-descuentos-cotizaciones), borrador pendiente de validación. |
| [RF-COM-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-005-revision-aprobacion), §3–4 | Revisar y aprobar cotizaciones | Acción de aprobar borradores, oculta al creador; no hay acción visible de paso a revisión ni confirmación por contraseña en aprobación comercial. | Parcial: aprobación presente, etapa previa de revisión y confirmación adicional no visibles. | `B-005-02` está derivada a [RF-COM-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-012-paso-revision); `B-005-03` está consolidada en [RNF-SEG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas). Ambos destinos están pendientes de validación/decisión de alcance. |
| [RF-COM-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-012-paso-revision), §3 | Transicionar cotización a `EN_REVISION` | No se encontró acción para enviar un borrador a revisión. | Faltante. | Vinculado a `B-005-02`; ficha backend derivada pendiente de validación. |
| [RF-COM-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-006-envio-aceptacion), §3, §6 | Enviar propuesta y registrar aceptación | Hay acción “Enviar al Cliente”; no hay acción/pantalla para registrar aceptación. El envío apunta a `/cotizaciones/:id/enviar`. | Parcial: acción de envío desconectada del API actual y aceptación ausente. | Envío y registro de aceptación (`B-006-01`, `B-006-02`) están derivados a [RF-COM-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion); evidencia aceptada (`B-006-03`) está en [RA-COM-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-006-evidencia-aceptacion). |
| [RF-COM-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion), §3, §6 | Implementar flujo de envío y aceptación | La UI presenta envío, pero no aceptación; permite también emitir desde cotización aprobada sin aceptación registrada. | Faltante para el flujo contractual completo. | `B-006-01`, `B-006-02` y `B-006-04` están derivadas a este borrador pendiente de validación. `B-006-03` corresponde a la decisión [RA-COM-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-006-evidencia-aceptacion). |
| [RF-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-007-emitir-documentos), §3, §7 | Generar y conservar documentos comerciales | Vista previa del borrador y descarga del PDF oficial; no expone edición de cotización emitida. | Cubierto en interfaz para vista previa/descarga; la conservación histórica depende del backend. | Backend parcial; la política de PDFs históricos `B-007-01` se deriva a [RA-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-007-reconstruccion-pdf-historico). |
| [RF-COM-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-008-anulaciones), §3 | Solicitar y resolver anulaciones | Modal exige motivo; bandeja permite aprobar o rechazar, y exige observación para rechazo. | Cubierto en UI para solicitar y resolver. | Backend parcial; `B-008-02` está derivada a [RF-AUD-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-002-atomicidad-auditoria) y `B-008-03` a [RA-COM-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-008-politicas-anulacion). |
| [RF-COM-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-014-bloqueo-emision-anulacion), §6 | Impedir emisión durante anulación pendiente | La lista no presenta estado de solicitud pendiente; una cotización aprobada puede conservar la acción de emitir. | No cubierto como control visual; la condición tampoco está expuesta por el modelo listado. | `B-008-01` está derivada a este borrador pendiente de validación; el bloqueo definitivo corresponde al backend. |
| [RNF-SEG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas), §3–4 | Confirmar aprobaciones críticas mediante contraseña | La aprobación comercial no muestra confirmación adicional de contraseña. | Parcial para aprobación comercial. | `B-005-03` está asignada a este requisito; la lista de operaciones críticas y el control de API requieren validación. |

### Logística

**Fuente:** `Sterinova-ERP.md` §§3, 5–6.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RN-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rn-log-001-creacion-ordenes), §3, §6 | Crear órdenes a partir de cotizaciones aceptadas | El tablero consume `/logistica/cotizaciones-aprobadas` y permite crear una orden desde la selección; el servicio del backend filtra cotizaciones `ACEPTADA_CLIENTE`. Los materiales se ingresan manualmente, no se precargan desde la cotización. | Parcial: selección y alta presentes; falta precarga/vínculo visible de líneas. | `B-LOG-001` → `RF-LOG-006`; `B-LOG-002` → `RF-LOG-007`; soporte comercial alternativo en `RA-LOG-001`. |
| [RF-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-001-recogidas-rutas), §3 | Registrar recogidas, rutas y llegadas directas | La pantalla recorre estados fijos `PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA`; el modal registra responsable, transportista, persona que entrega/recibe, observaciones y cantidades. No hay pantalla de rutas compartidas ni transición directa desde pendiente a llegada directa. | Parcial. | `B-LOG-004` → `RF-LOG-008`; `B-LOG-005` permanece pendiente frontend; `B-LOG-006` → `RF-LOG-009`. |
| [RF-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-002-recepciones), §3 | Registrar recepción completa o parcial | `MaterialesEditor` permite varias líneas con descripción, referencia, lote, empaque y cantidad. Lote y empaque son opcionales; no hay saldo de recepción parcial ni vista de líneas recibidas por entrega separada. | Parcial: captura inicial disponible; flujo de recepción y conciliación incompleto. | `B-LOG-007`, `B-LOG-008`, `B-LOG-011` → `RF-LOG-010`; `B-LOG-009` → `RF-LOG-011`; `B-LOG-010`/`012` → `RF-LOG-012`; evidencia/notificación en `RA-LOG-002`. |
| [RN-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rn-log-002-no-reasignacion), §6 | Evitar reasignar material recibido | La UI opera sobre materiales vinculados a una orden y no ofrece una acción para reasignar material entre órdenes/ciclos. | Parcial: no hay reasignación visible; el control definitivo corresponde al API y a los saldos persistidos. | `B-LOG-013` → `RF-PLA-006`. |
| [RF-LOG-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-003-novedades-custodia), §3, §5 | Registrar novedades, rechazos y custodia | El modal de evento guarda observación y nombres de responsables como texto; no hay formulario de rechazo por línea, expediente de novedades ni carga de evidencia fotográfica/documental. | Parcial. | `B-LOG-014`–`017` → `RF-LOG-013`–`016`; las políticas de disposición se relacionan con `RA-LOG-003`. |
| [RF-LOG-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-004-transferencia-planta), §3, §5 | Transferir materiales a Planta | Logística puede marcar `EN_PLANTA` y registrar `recibido_por` como texto libre. Planta consulta órdenes y materiales de orden; no hay confirmación de recepción desde una cuenta de Planta ni acta de traspaso en esta ruta. | Parcial. | `B-LOG-018` → `RF-LOG-017`; `B-LOG-019` → `RF-LOG-018`; inventario/microbodega en `RA-PLA-003`. |
| [RF-LOG-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-005-entregas-parciales), §3 | Registrar entregas parciales y finales | El evento de entrega captura cantidades y cajas por material, pero el recorrido de UI solo ofrece una transición a `ENTREGADO`; no muestra saldo acumulado, firma ni adjunto POD. | Parcial. | `B-LOG-021`–`023` → `RF-LOG-019`–`021`; criterios de cierre en `RA-LOG-004`. |

### Planta

**Fuente:** `Sterinova-ERP.md` §§3, 5–6.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-001-equipos-disponibilidad), §3, §6 | Registrar equipos y disponibilidad | El formulario de ciclo recibe el equipo en un campo de texto. No hay catálogo de equipos, disponibilidad, mantenimiento ni validación de capacidad en la interfaz. | Parcial. | `B-PLA-001`–`003` → `RF-PLA-007`–`009`; políticas en `RA-PLA-004`. |
| [RF-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-002-creacion-ciclos), [RF-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-003-distribucion-cantidades), §3, §6 | Crear ciclos y distribuir materiales | La pantalla crea un ciclo asociado a una sola `orden_id`, muestra sus materiales y captura cantidades por línea acotadas por el valor recibido de la orden. No permite seleccionar varias órdenes ni tiene flujo UI de reproceso vinculado. | Parcial. | Multiorden en `RF-PLA-006`; saldo/reproceso en `RF-PLA-011`; control contra recepciones reales en `RF-LOG-012`. |
| [RF-PLA-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-004-parametros-protocolos), §3, §5 | Registrar parámetros, evidencias y protocolos | El formulario captura mediciones numéricas y controles biológico/químico; muestra la versión del protocolo que se enviará con el ciclo. No hay carga de archivos para gráficos/evidencias ni justificación visible de `NO_APLICA`. | Parcial. | `B-PLA-006` → `RF-PLA-012`; `B-PLA-007` → `RF-PLA-013`; políticas en `RA-PLA-007`. |
| [RF-PLA-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-005-tandas-recetas), §3, §8 | Registrar tandas, reprocesos, recetas e insumos | Se consulta historial de ciclos y se registra un ciclo individual. No se encontró UI de Tanda, receta, microbodega, consumo de insumos ni creación de reproceso. | Faltante para las capacidades derivadas. | `B-PLA-008` → `RF-PLA-014`; recetas/insumos siguen en `RA-PLA-008`, coordinada con `RA-PLA-003`. |
| [RN-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rn-pla-001-metodo-contratado), [RN-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rn-pla-002-no-sobrescribir), §6 | Respetar método contratado y no sobrescribir ciclos aprobados | El método queda deshabilitado en la pantalla cuando la orden ya tiene método. No se observó una acción de editar ciclo aprobado en la interfaz. | Parcial; la protección final es del backend. | Anclaje contractual del método en `RF-PLA-015`; hardening de inmutabilidad en `RF-PLA-016`. |

### Calidad

**Fuente:** `Sterinova-ERP.md` §§3–6.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos), §3 | Evaluar ciclos según parámetros/protocolos | La pantalla muestra valores medidos y filas del protocolo; el revisor elige manualmente especificación y criterio. No presenta una sugerencia automática previa. | Parcial. | `B-CAL-001` → `RF-CAL-005`; la validación de rangos en aprobación es backend. |
| [RF-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales), [RN-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rn-cal-001-bloqueo-despacho), §3, §6 | Aprobar/rechazar ciclos antes del despacho | La bandeja muestra ciclos pendientes; permite aprobar y emitir certificado o rechazar con motivo. La confirmación de aprobación pide contraseña. No hay cuarentena o disposición por lote, liberación parcial ni vista de CAPA. | Parcial. | `B-CAL-002` → `RF-CAL-006` y `RA-CAL-001`; bypass de órdenes sin método en `RF-CAL-007`. |
| [RF-CAL-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-003-desviaciones-capa), [RF-CAL-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-004-liberacion-excepcion), §3 | Gestionar desviaciones/CAPA y liberaciones excepcionales | No se encontraron pantallas de CAPA, investigación, plan de acciones ni liberación por excepción. | Faltante. | `B-CAL-004`/`005` → `RF-CAL-008`/`009` y `RA-CAL-002`; `B-CAL-006` → `RF-CAL-010` y `RA-CAL-003`. |

### Certificados

**Fuente:** `Sterinova-ERP.md` §§3, 5–7.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-001-emision-certificados), [RF-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-002-identificacion-materiales), §3, §5, §7 | Emitir certificados e identificar materiales/ciclos | Calidad lista certificados y ofrece vista/descarga PDF oficial. El flujo de aprobación emite desde el ciclo y muestra el cliente derivado de su orden; no hay selección/partición de varios clientes dentro de un ciclo. | Parcial. | `B-CER-001`/`002` → `RF-CER-004`/`005`; políticas en `RA-CER-001`. |
| [RF-CER-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-003-versionado-anulacion), [RN-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rn-cer-001-ciclos-compartidos), §3, §7 | Conservar versiones y anular sin borrar original | La vista renderiza y descarga PDF del certificado actual. No hay UI de anulación, reemplazo vinculado ni selector de versiones anteriores. | Parcial. | `B-CER-003`/`004` → `RF-CER-006`/`007`; políticas en `RA-CER-002`. |

### Usuarios, administración y auditoría

**Fuente:** `Sterinova-ERP.md` §§3–5.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-USR-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-001-administracion-usuarios), [RF-USR-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-002-roles-ambitos), §3 | Administrar usuarios, varios roles y ámbitos | UI de usuarios permite alta/edición, activar/desactivar, restablecimiento y asignaciones múltiples rol-ámbito. | Parcial/cubierto en las operaciones expuestas. | `B-USR-001` → `RF-AUD-003`; la política de roles por planta está en `RA-USR-001`. |
| [RF-USR-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-003-administracion-areas), §3 | Administrar áreas, roles y permisos | La pantalla de administración permite consultar roles/ámbitos y asignar/quitar asignaciones; no crea áreas, roles ni permisos. | Parcial. | `B-USR-002` → `RA-USR-002`; `B-USR-003` → `RF-USR-004`. |
| [RF-AUD-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-001-consulta-auditoria), §3, §5 | Consultar operaciones y cambios | La página intenta cargar eventos y filtra entidad/acción; no expone filtros de fecha, usuario o página. El cliente espera un arreglo plano, mientras que el servicio backend devuelve un sobre `{data,total,page,limit,totalPages}`. | Incompatibilidad de contrato observada: el componente recibe un objeto y luego lo usa como arreglo, por lo que la vista puede fallar al filtrar/renderizar. | `B-AUD-001` → `RF-AUD-004`; nueva brecha de integración `B-AUD-002` asignada a `RF-AUD-001`. |

### Seguridad y trazabilidad

**Fuente:** `Sterinova-ERP.md` §§4–5.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RNF-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-001-autorizacion-ambito), §4 | Validar autorización y ámbito | Sesión consulta `/auth/me`; navegación oculta rutas según permisos y selecciona ámbito enviando `x-scope-id`. Son controles de UX y no sustituyen guards del API. | Parcial; se observó autorización de ruta/interfaz, no una verificación exhaustiva de cada control visual. | `B-SEG-001`: inventariar rutas y ámbito de recursos; incluye revisión estática de descarga logística y confirmación de exposición de `/health/ready`. |
| [RNF-SEG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas), §4 | Proteger sesiones y operaciones críticas | El token de acceso se guarda en `localStorage`; respuesta 401 elimina el token y redirige a login. No hay flujo frontend de refresh token. La aprobación de Calidad pide contraseña; la aprobación comercial no muestra reautenticación. | Parcial. | `B-005-03` se consolida en `RNF-SEG-002`; confirmar lista de operaciones críticas antes de extender el control. |
| [RF-TRA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio), §5 | Reconstruir cadena cliente–cotización–operación–certificado–entrega | Logística, Planta, Calidad y Certificados tienen pantallas separadas; no se encontró una vista de historial integral ni un recorrido que enlace los doce hitos. | Faltante como vista transversal. | `B-TRA-001`: consulta de trazabilidad integral pendiente; debe respetar ámbitos y cubrir estados parciales, rechazos y devoluciones. |

### Documentos generados (§7)

| Documento | Evidencia en frontend | Cobertura frontend | Requisito/observación |
|---|---|---|---|
| Orden de servicio y Acta de Servicio | Logística previsualiza/descarga ambos documentos mediante `GET /logistica/ordenes/:id/pdf?tipo=orden|acta`; cada acción solicita la generación del PDF. | UI disponible; recuperación histórica e idempotencia pendientes. | [RF-LOG-022](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-022-inmutabilidad-documentos), `B-LOG-024`. |
| Acta de recepción de materiales | La UI registra eventos/recepción operativa, pero no expone generación de un acta de recepción; el Acta de Servicio es otro artefacto. | No identificada. | [RF-LOG-023](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-023-acta-recepcion), `B-LOG-025`; evidencia y contenido en `RA-LOG-002`. |
| Orden de esterilización | Planta crea y consulta ciclos; no se encontró acción de emisión/descarga de una orden documental del ciclo. | No identificada. | [RF-PLA-017](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-017-orden-esterilizacion-documento), `B-PLA-012`; contenido pendiente en [RA-PLA-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-010-alcance-orden-esterilizacion). |
| Certificado de esterilización | Calidad permite listar, ver y descargar el PDF oficial del certificado. | Disponible; separación multi-cliente, historial de versiones y anulación no están expuestos. | [RF-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-001-emision-certificados), [RF-CER-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-003-versionado-anulacion). |
| Revisiones, aprobaciones y solicitudes de anulación | Las pantallas de Comercial/Calidad muestran acciones de aprobación, rechazo o solicitud; no se observó un artefacto documental independiente para cada decisión. | Flujo visible en parte; documento/firma independiente no definido. | Fichas del dominio; el alcance de firma jurídica se deriva a [RA-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-seg-001-evidencia-legal-firmas). |

### Límites de esta revisión

- El anexo `Sterinova-ERP.md` sigue siendo la fuente contractual; la UI se evaluó frente al anexo y se contrastó con las rutas backend citadas.
- No se inspeccionó una sesión real ni se probó contra una instancia desplegada.
- Los E2E existentes interceptan/mockean la API; no validan la integración real. No se ejecutaron pruebas en esta actualización documental.
- Las brechas describen diferencias observadas; la cobertura backend conserva el estado de sus fichas y no se marca como implementada por existir una pantalla.

#### Observación de integración fuera del alcance contractual

La pantalla de clientes cambia el estado mediante `PATCH /clientes/:id`, pero el controlador backend revisado expone actualización por `PUT /clientes/:id` y no define una ruta `PATCH`. El anexo no requiere explícitamente activar/inactivar clientes. Además, la UI muestra el botón si existe cualquiera de los permisos de activar o inactivar, y el estado vacío presenta “Crear cliente” sin filtrar por permiso. Se conserva como observación técnica, no como brecha contractual ni como cambio aprobado.

#### Evidencia revisada

- `SterinovaFrontend/src/app/(erp)/comercial/clientes/ClientesPageClient.tsx` y `SterinovaFrontend/src/lib/cliente-import.ts`.
- `SterinovaFrontend/src/app/(erp)/comercial/productos/ProductosCatalogoClient.tsx`.
- `SterinovaFrontend/src/components/cotizaciones/CotizacionForm.tsx` y `SterinovaFrontend/src/lib/cotizacion-types.ts`.
- `SterinovaFrontend/src/app/(erp)/comercial/cotizaciones/CotizacionesClient.tsx`.
- `SterinovaFrontend/src/components/SolicitudAnulacionButton.tsx` y `SterinovaFrontend/src/app/(erp)/solicitudes/page.tsx`.
- `SterinovaFrontend/src/app/(erp)/logistica/page.tsx`, `src/components/logistica/MaterialesEditor.tsx`, `src/components/logistica/RegistroEventoOrdenModal.tsx` y `src/lib/logistica-types.ts`.
- `SterinovaFrontend/src/app/(erp)/planta/page.tsx`, `src/app/(erp)/planta/ciclo/nuevo/page.tsx`, `src/lib/planta-types.ts` y `src/lib/operational-forms.ts`.
- `SterinovaFrontend/src/app/(erp)/calidad/page.tsx`, `src/app/(erp)/calidad/revisar/[ciclo_id]/page.tsx`, `src/components/calidad/EvaluacionTecnica.tsx` y `src/lib/operational-forms.ts`.
- `SterinovaFrontend/src/app/(erp)/calidad/certificados/[id]/page.tsx` y `src/components/pdf/CertificadoPDF.tsx`.
- `SterinovaFrontend/src/app/(erp)/usuarios/page.tsx`, `src/app/(erp)/usuarios/UserRolesDialog.tsx`, `src/app/(erp)/administracion/roles-ambitos/page.tsx` y `src/app/(erp)/auditoria/page.tsx`.
- `SterinovaFrontend/src/app/login/page.tsx`, `src/app/(erp)/layout.tsx`, `src/lib/api.ts`, `src/lib/session.tsx` y `src/lib/navigation.ts`.
- Contraste API: `Sterinova-Backend/src/cotizaciones/cotizaciones.controller.ts` y `Sterinova-Backend/src/clientes/clientes.controller.ts`.
- Contraste de auditoría: `Sterinova-Backend/src/auditoria/auditoria.controller.ts`, `src/auditoria/auditoria.service.ts` y `src/auditoria/dto/query-auditoria.dto.ts`.

#### Pruebas existentes consultadas

Las pruebas E2E existentes incluyen `comercial-flow.spec.ts`, `quote-edit.spec.ts`, `solicitudes-anulacion.spec.ts`, `calidad-flow.spec.ts`, `certificate-materials.spec.ts`, `hito4-operational.spec.ts` y `rbac-quotes.spec.ts`. La matriz no las ejecutó en esta actualización. Los escenarios comerciales descritos en la revisión previa interceptan/mockean la API; no se presume aquí que todos los demás E2E usen la misma estrategia. Ninguna prueba se usó como evidencia de integración real ni para verificar el contrato de paginación de Auditoría.

<a id="doc-requisitos-operacion-rnf-ops-001-operacion-produccion"></a>

**Origen:** docs/requisitos/operacion/RNF-OPS-001-operacion-produccion.md

---
id: RNF-OPS-001
titulo: Preparación y operación del ERP en producción
tipo: RNF
modulo: Operación / Infraestructura / Transversal
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §8: Despliegue y operación completa en producción"
fuente_contraste: "docs/CONTEXTO_RAPIDO.md; docs/arquitectura/; docs/manuales/; backend y frontend"
depende_de: []
bloquea: []
brechas: [B-OPS-001]
historial:
  - version: 0.1
    nota: "Borrador creado para hacer trazable el pendiente explícito de producción en §8. Los criterios operativos y objetivos de servicio no están definidos ni aprobados."
---

## RNF-OPS-001 — Preparación y operación del ERP en producción

**Estado:** Borrador de alcance; pendiente de inventario técnico, criterios de aceptación y validación.

1. **ID:** `RNF-OPS-001`.
2. **Título:** Preparación y operación del ERP en producción.
3. **Tipo:** RNF.
4. **Módulo:** Operación / Infraestructura / Transversal.
5. **Descripción:** Definir y demostrar las condiciones bajo las cuales backend, frontend, datos, almacenamiento y servicios dependientes pueden desplegarse y operarse en el entorno productivo acordado.
6. **Reglas asociadas:** El anexo §8 declara pendiente el despliegue y operación completa en producción; no declara que el proyecto esté en producción ni define un nivel de servicio.
7. **Actores / responsables:** Propietario del sistema, responsables técnicos y responsables de operación/soporte por identificar.
8. **Componentes implicados:** Aplicaciones backend y frontend, base de datos, almacenamiento de archivos/PDF, configuración y secretos, integraciones, observabilidad, respaldos y procedimientos operativos; existencia y configuración real por verificar.
9. **Flujo operativo a definir:** Preparar ambiente → desplegar versión → validar salud y dependencias → habilitar uso → monitorear → atender incidente/restaurar o revertir según procedimientos aprobados.
10. **Criterios de aceptación preliminares:** Definir y validar lista de ambientes, estrategia de despliegue y reversa, monitoreo/alertas, respaldo y restauración, respuesta a incidentes, responsables, objetivos de recuperación y criterios de salida a producción. No se asignan valores de disponibilidad, RTO/RPO ni ventanas sin decisión.
11. **Evidencia técnica disponible:** El anexo §8 declara que la operación completa en producción es pendiente. Esta ficha no verificó despliegues, configuración de nube, entornos productivos ni capacidad de recuperación.
12. **Persistencia e infraestructura:** Arquitectura, configuración de producción, topología, retención de datos, respaldos, recuperación y dependencias externas requieren inventario y verificación.
13. **Brecha:** `B-OPS-001` registra que el anexo declara pendiente el despliegue/operación productiva y que no existe en este paquete un criterio de salida de producción aprobado.
14. **Preguntas abiertas:** ¿Qué ambientes se requieren? ¿Quién opera y responde? ¿Qué disponibilidad, recuperación, respaldo, retención, monitoreo y seguridad se exigen? ¿Qué aprobaciones y controles son necesarios para el go-live?
15. **Estado de cobertura:** No evaluado; el documento solo formaliza el pendiente del anexo. No se emite juicio sobre la infraestructura actual.
16. **Certeza y límites:** Confirmado que §8 lista este tema como pendiente. Requisitos concretos y estado de la infraestructura se deben levantar con responsables técnicos y operativos; no se inspeccionó producción.

<a id="doc-requisitos-por-aclarar-decisiones-prioridad-1-calidad-planta-logistica"></a>

**Origen:** docs/requisitos/por-aclarar/decisiones-prioridad-1-calidad-planta-logistica.md

## Instrucción de incorporación — Decisiones de Prioridad 1

**Proyecto:** Sterinova ERP  
**Fuente contractual:** `Sterinova-ERP.md`  
**Propósito:** entregar al agente que trabaja en el repositorio el registro validado en conversación para actualizar la documentación activa de requisitos y decisiones pendientes.

### Instrucción para el agente receptor

Incorpora las decisiones confirmadas de este documento en la documentación activa bajo `docs/requisitos/`, manteniendo la trazabilidad a los requisitos y brechas existentes. Revisa primero `docs/requisitos/README.md`, `docs/requisitos/brechas/registro-brechas.md`, las fichas indicadas en «Documentos relacionados» y las instrucciones del repositorio.

Al realizar la incorporación:

1. Registra como confirmadas **solo** las decisiones listadas en «Decisiones confirmadas». Conserva el texto y sus condiciones; no conviertas recomendaciones anteriores del asistente en política aprobada.
2. No cambies el estado de cobertura técnica ni marques requisitos derivados como implementados. Una decisión de negocio confirma la regla operativa, no el diseño de datos/API, la cobertura del frontend/backend ni la aceptación de una implementación.
3. No marques como aprobado ningún bloque funcional que no haya sido validado explícitamente por el usuario. Las matrices frontend de Logística y Planta permanecen como diagnósticos observados, según su estado real en la documentación central.
4. Consolida o enlaza las decisiones en lugar de duplicar fichas. Si varios RA expresan la misma pregunta (por ejemplo, cuarentena/rechazo en Calidad y Logística), deja un dueño documental claro y referencias cruzadas desde las otras fichas.
5. Conserva como pendientes los detalles que no se decidieron, incluidos los señalados expresamente al final de este documento.
6. Actualiza índices, relaciones de `depende_de`/`bloquea` y el registro de brechas solo cuando sea necesario para reflejar la decisión. No renumeres IDs existentes.
7. No cambies código, esquema, migraciones ni datos. Esta instrucción cubre la incorporación documental; cualquier implementación se planificará después en etapas con criterios de aceptación y verificaciones integradas.
8. Al terminar, informa qué archivos se actualizaron, qué decisiones se registraron, cuáles permanecen abiertas y cualquier inconsistencia encontrada. No declares cerrado el análisis global.

### Decisiones confirmadas

Estas respuestas fueron confirmadas explícitamente por el usuario en la conversación. Deben registrarse como reglas de negocio acordadas para orientar el análisis y el diseño posterior.

#### 1. Alcance de cuarentena ante una desviación

**Escenario validado:** un ciclo contiene varios lotes; falla el indicador biológico de uno y los demás presentan resultados conformes.

- Se retiene **solo el lote afectado**, no automáticamente todo el ciclo.
- Los demás lotes pueden evaluarse por separado.
- Si no se pueden identificar con fiabilidad las unidades afectadas dentro del lote, se retiene **el lote completo**.

**Consecuencia documental/técnica:** representar retención y destino al menos por lote, y permitir que Calidad determine el estado del lote sin convertir el ciclo completo en una sola unidad indivisible. La regla no autoriza liberar material sin la decisión y evidencia requeridas.

#### 2. Liberación parcial de lotes conformes

- Los lotes conformes de un ciclo pueden liberarse antes de cerrar la investigación del lote afectado.
- La liberación parcial requiere **autorización documentada del Jefe de Calidad**.

**Consecuencia:** el sistema necesitará registrar qué lotes/cantidades se liberan, la decisión y el responsable autorizador, manteniendo retenido el lote investigado. Los campos exactos y soportes documentales siguen por definir.

#### 3. Autoridad para disponer el material rechazado

- **Calidad determina el destino** del material rechazado.
- El usuario confirmó “todos” los destinos discutidos: devolución al cliente, reproceso, destrucción y otro destino que Calidad determine.
- Toda devolución o destrucción debe dejar constancia.

**Consecuencia:** conservar una disposición explícita por lote/cantidad y motivo. «Otro destino» requiere descripción para no perder significado operacional. No asumir todavía un catálogo cerrado de destinos ni validaciones específicas de cada uno.

#### 4. Evidencia de la disposición

- Para devolución o destrucción, debe registrarse **todo lo relevante**.
- Como mínimo, otra respuesta confirmada exige constancia con responsable, fecha y evidencia.

**Interpretación acotada:** responsable, fecha y evidencia son obligatorios; el contenido y formato de la evidencia dependen del caso y deben ser suficientes para acreditar el destino. No se confirmaron tipos de archivo, firma, formato de acta, retención ni tamaños máximos.

#### 5. Autorización y vínculo del reproceso

- El reproceso requiere aprobación de **Calidad y Planta antes de crear el reproceso**.
- El nuevo ciclo queda **vinculado al ciclo rechazado/original**.

**Consecuencia:** no tratar un reproceso como edición o reemplazo del ciclo rechazado. Preservar los resultados y evidencias del ciclo original y asociar el nuevo intento con su autorización y ciclo origen.

#### 6. Ciclos abortados

- Ante un ciclo abortado, **Calidad determina y documenta la disposición** del material afectado.
- Las salidas consideradas son retener para investigar, reprocesar, devolver o destruir, según el caso.
- Planta participa en la ejecución cuando corresponda.
- No se libera automáticamente el material por el solo hecho de abortar.
- Si se decide reprocesar, aplica la aprobación previa de Calidad y Planta y se registra un ciclo nuevo vinculado al abortado.

#### 7. Cierre de la orden

- La orden solo se cierra cuando las cantidades aceptadas estén liberadas y todo saldo restante tenga **destino final registrado y evidencia exigida completa**.
- El procesamiento terminado, por sí solo, no basta para cerrar.

**Consecuencia:** el cierre debe conciliar cantidades aceptadas, liberadas, retenidas, reprocesadas, devueltas o destruidas; no declarar resuelta una cantidad con destino pendiente o evidencia incompleta.

### Temas que continúan pendientes

No asumir ni completar por inferencia:

- Qué datos y documentos concretos exige «todo lo relevante» por tipo de disposición, y cómo se firma, adjunta, conserva y consulta la evidencia.
- Quién puede escoger/aprobar «otro destino», además de la competencia general de Calidad para determinar destinos.
- Si las decisiones de cuarentena/liberación parcial exigen evaluación de riesgo adicional o aprobación distinta del Jefe de Calidad en casos especiales.
- Qué saldos exactos se liberan para reproceso tras rechazo o aborto; tratamiento de ciclos abortados con carga parcialmente procesada.
- Cómo se refleja una liberación, devolución, destrucción o reproceso en cantidades disponibles, certificados, entregas parciales y saldos logísticos.
- Cómo se particionan por cliente los ciclos compartidos y qué cantidad se declara en cada certificado.
- Capacidad/unidades de equipos, clasificación de lavandería, catálogo de equipos, mantenimiento/calibración, consecutivos, Tanda, recetas, insumos y microbodega.
- Ámbitos/roles de usuarios, vista integral de trazabilidad y cobertura frontend/backend.
- Validación funcional de los bloques de Logística y Planta: el usuario indicó que el Bloque 2 logístico no debe considerarse requisito funcional aprobado. Mantener también la cobertura E2E descrita como simulada, sin atribuir integración real.

### Documentos relacionados que deben revisarse

- `docs/requisitos/por-aclarar/RA-CAL-001-politicas-cuarentena.md`
- `docs/requisitos/por-aclarar/RA-PLA-006-politicas-reproceso.md`
- `docs/requisitos/por-aclarar/RA-LOG-003-politicas-rechazo.md`
- `docs/requisitos/por-aclarar/RA-LOG-004-cierre-ordenes.md`
- `docs/requisitos/backend/calidad/RF-CAL-002-aprobar-rechazar-retener.md` (confirmar nombre exacto en el índice antes de enlazar)
- `docs/requisitos/backend/planta/RF-PLA-003-distribucion-cantidades.md`
- `docs/requisitos/backend/planta/RF-PLA-011-flujo-reprocesos.md`
- `docs/requisitos/backend/logistica/RF-LOG-019-entregas-acumulables.md`
- `docs/requisitos/brechas/registro-brechas.md`
- `docs/requisitos/README.md`

La lista es de referencias para contraste; no significa que todos esos documentos tengan que modificarse. El agente debe verificar sus rutas actuales y evitar crear links rotos.

### Próxima etapa después de incorporar estas decisiones

1. Mostrar al usuario el resumen documental incorporado y las preguntas todavía abiertas de Prioridad 1.
2. Continuar la ronda de negocio en bloques de hasta cinco preguntas, sin volver a pedir validación de una decisión que ya fue confirmada explícitamente.
3. Mantener los bloques y requisitos no confirmados como pendientes.
4. Con las respuestas restantes, proponer etapas de implementación que crucen frontend/backend/datos y definan criterios de aceptación y verificaciones integradas para reducir errores.
5. No iniciar cambios de código hasta que el usuario defina/autorice el alcance de implementación por etapas.

<a id="doc-requisitos-por-aclarar-ra-cal-001-politicas-cuarentena"></a>

**Origen:** docs/requisitos/por-aclarar/RA-CAL-001-politicas-cuarentena.md

---
id: RA-CAL-001
titulo: Políticas de cuarentena y destino de materiales rechazados
tipo: RA
modulo: Calidad / Planta / Logística
estado: parcialmente_resuelta
certeza: parcial
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 70, 76–79"
fuente_contraste: "decisiones-prioridad-1-calidad-planta-logistica.md; RF-CAL-002; src/calidad/; src/planta/; src/logistica/"
depende_de: [RF-CAL-002]
bloquea: [RF-CAL-006]
brechas: [B-CAL-002]
historial:
  - version: 0.1
    nota: "Pregunta de negocio derivada de B-CAL-002."
  - version: 0.2
    nota: "Se incorporan D-CAL-001 y D-CAL-002: retención por lote, liberación documentada de lotes conformes y autoridad de Calidad sobre el destino. Continúan abiertos los detalles de evidencia, riesgo y autorizaciones específicas."
---

## RA-CAL-001 — Políticas de cuarentena y destino de materiales rechazados

### Preguntas aún abiertas

La unidad de retención y la autoridad general de disposición están resueltas por D-CAL-001 y D-CAL-002. Quedan por definir: qué evaluación de riesgo adicional puede exigirse; qué evidencia y cierre CAPA se requieren por escenario; y qué autorización corresponde para «otro destino», además de la determinación de Calidad.

### Decisiones ya confirmadas

- Retener el lote afectado; retener el lote completo si no se pueden identificar con fiabilidad las unidades afectadas.
- Evaluar por separado los demás lotes; liberar lotes conformes antes del cierre de la investigación solo con autorización documentada del Jefe de Calidad.
- Calidad determina el destino del material rechazado; devolución o destrucción requieren constancia con responsable, fecha y evidencia.

### Impacto

La decisión afecta modelo de estados, cantidades despachables, emisión de certificados, investigación CAPA, permisos y trazabilidad de custodia. No debe asumirse que una aprobación del ciclo libera unidades rechazadas.

### Fuente de decisiones confirmadas

La unidad de retención, liberación parcial de lotes conformes y autoridad de Calidad para disposición están confirmadas en [D-CAL-001 y D-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio). Esta ficha conserva solo los aspectos aún abiertos; no vuelve a someter esas reglas a decisión.

### Alcance pendiente

La clasificación de impacto y el flujo técnico aún requieren definición; esta decisión queda parcialmente resuelta, no cerrada. Ver [D-CAL-001 y D-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio).

<a id="doc-requisitos-por-aclarar-ra-cal-002-politicas-capa"></a>

**Origen:** docs/requisitos/por-aclarar/RA-CAL-002-politicas-capa.md

---
id: RA-CAL-002
titulo: Políticas de gestión de desviaciones y cierre de CAPA
tipo: RA
modulo: Calidad
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 79"
fuente_contraste: "RF-CAL-003; RF-CAL-008; RF-CAL-009"
depende_de: [RF-CAL-003]
bloquea: [RF-CAL-008, RF-CAL-009]
brechas: [B-CAL-005]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de preguntas abiertas de RF-CAL-003."
---

## RA-CAL-002 — Políticas de gestión de desviaciones y cierre de CAPA

### Preguntas de negocio

- ¿Qué eventos y niveles de severidad obligan a abrir una desviación o CAPA?
- ¿Qué estados, roles y plazos aplican a investigación, plan de acción, verificación y cierre?
- ¿Qué evidencia y aprobación son obligatorias para demostrar eficacia?
- ¿Cerrar una CAPA es condición para liberar el material afectado u otros materiales del ciclo?

### Impacto

Estas decisiones definen permisos, estados, controles de cierre y la relación entre CAPA, rechazo, reproceso, cuarentena y liberación por excepción. No se presume que la mera selección de un destino cierre la investigación.

<a id="doc-requisitos-por-aclarar-ra-cal-003-politicas-excepcion"></a>

**Origen:** docs/requisitos/por-aclarar/RA-CAL-003-politicas-excepcion.md

---
id: RA-CAL-003
titulo: Políticas de liberación por excepción y firmas
tipo: RA
modulo: Calidad / Certificados / Logística
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 80"
fuente_contraste: "RF-CAL-004; RF-CAL-010; src/rbac/permission-catalog.ts"
depende_de: [RF-CAL-004]
bloquea: [RF-CAL-010]
brechas: [B-CAL-006]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-CAL-006."
---

## RA-CAL-003 — Políticas de liberación por excepción y firmas

### Preguntas de negocio

1. ¿Qué condiciones permiten liberación condicionada y cuáles liberación por desviación? ¿Son vías distintas?
2. ¿Qué parámetros críticos o tipos de incumplimiento son elegibles para excepción y cuál exige rechazo/reproceso?
3. ¿Qué cargos deben autorizar: Director Técnico, Gerente de Calidad, Jefe de Calidad u otros? ¿Cuándo se requieren aprobaciones independientes múltiples?
4. ¿Qué análisis de riesgo, evidencias y firmas/confirmaciones por contraseña son obligatorios, y qué texto/leyenda debe aparecer en el certificado?
5. ¿Qué efecto tiene una excepción sobre el despacho, seguimiento posterior y cierre de CAPA?

### Impacto

La decisión controla quién puede liberar producto no conforme, cómo se evita normalizar el incumplimiento y qué soporte documental necesita el certificado y la entrega. No se asumen equivalentes cargos ni tipos de liberación.

<a id="doc-requisitos-por-aclarar-ra-cer-001-politicas-certificacion"></a>

**Origen:** docs/requisitos/por-aclarar/RA-CER-001-politicas-certificacion.md

---
id: RA-CER-001
titulo: Políticas de certificación para ciclos compartidos y cantidades
tipo: RA
modulo: Certificados / Calidad / Planta
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6, §7"
fuente_contraste: "RF-CER-001; RF-CER-002; RF-CER-004; RF-CER-005"
depende_de: [RF-CER-001, RF-CER-002]
bloquea: [RF-CER-004, RF-CER-005]
brechas: [B-CER-001, B-CER-002]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-CER-001 y B-CER-002."
---

## RA-CER-001 — Políticas de certificación para ciclos compartidos y cantidades

### Preguntas de negocio

1. ¿Cómo se particionan en certificados separados los materiales de varios clientes dentro del mismo ciclo?
2. ¿Cada documento incluye solo materiales/cantidades de su cliente y cuál es la agrupación por orden, ciclo y lote?
3. ¿Qué cantidad debe declararse cuando un material se procesa parcialmente o se rechaza?
4. ¿Cómo se identifican ciclos y reprocesos relacionados en uno o varios certificados?

### Impacto

La decisión define cardinalidades, contenido y alcance legal/operativo de cada certificado, además de los vínculos entre órdenes, clientes, lotes y ciclos. No se presume que el total ordenado equivalga a lo procesado.

<a id="doc-requisitos-por-aclarar-ra-cer-002-politicas-reemplazo"></a>

**Origen:** docs/requisitos/por-aclarar/RA-CER-002-politicas-reemplazo.md

---
id: RA-CER-002
titulo: Políticas de anulación, reemplazo y conservación de certificados
tipo: RA
modulo: Certificados / Calidad
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "RF-CER-003; RF-CER-006; RF-CER-007"
depende_de: [RF-CER-003]
bloquea: [RF-CER-006, RF-CER-007]
brechas: [B-CER-003, B-CER-004]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-CER-003 y B-CER-004."
---

## RA-CER-002 — Políticas de anulación, reemplazo y conservación de certificados

### Preguntas de negocio

- ¿Quién puede anular y con qué causas/evidencia obligatoria?
- ¿Cómo se vincula, identifica y presenta un certificado de reemplazo y su original anulado?
- ¿Qué historial de PDFs debe conservarse ante regeneración, corrupción o cambio de renderer y por cuánto tiempo?
- ¿Cómo debe responder la validación pública para documentos anulados, reemplazados o vencidos?

### Impacto

La decisión afecta trazabilidad, conservación documental, validez pública y controles de acceso. La anulación nunca debe implicar borrar silenciosamente el documento histórico.

<a id="doc-requisitos-por-aclarar-ra-com-001-ciclo-vida-cliente"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-001-ciclo-vida-cliente.md

---
id: RA-COM-001
titulo: Alcance contractual del ciclo de vida del cliente
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 2, respuestas 17 y 20; src/clientes/"
depende_de: []
bloquea: []
brechas: [B-001-01]
historial:
  - version: 1.0
    nota: "Pregunta abierta derivada de RF-COM-001; no implica decisión del usuario."
---

## RA-COM-001 — Alcance contractual del ciclo de vida del cliente

**Pregunta de negocio:** ¿El ciclo de vida del cliente (activo/inactivo) forma parte del alcance contractual del ERP?

### Contexto

`Sterinova-ERP.md` §3 solicita gestión de clientes, pero no especifica estados activo/inactivo. La documentación backend menciona activación e inactivación, mientras que la entidad y el controlador inspeccionados no muestran un estado ni endpoints específicos para esas acciones.

### Opciones e impacto

- **Sí, forma parte del alcance:** se define un requisito funcional propio y se precisan estados, transiciones, responsables y efectos sobre cotizaciones y operaciones.
- **No, queda fuera del alcance contractual actual:** se conserva como necesidad pendiente o futura y no se incluye en la cobertura de `RF-COM-001`.

### Requisitos afectados

- `RF-COM-001` permanece limitado a registrar y consultar clientes, con cobertura `Cubierto`.
- Un requisito de activación/inactivación se asignará si se confirma que pertenece al alcance.

**Estado:** Pendiente de decisión del usuario. No se cierra `B-001-01` sin respuesta explícita.

<a id="doc-requisitos-por-aclarar-ra-com-002-categorizacion-dispositivos"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-002-categorizacion-dispositivos.md

---
id: RA-COM-002
titulo: Categorización de dispositivos médicos
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §1, §3, §8"
fuente_contraste: "src/productos/entities/producto.entity.ts; src/productos/dto/"
depende_de: []
bloquea: []
brechas: [B-002-01]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-002; no bloquea su cierre ni el flujo actual."
---

## RA-COM-002 — Categorización de dispositivos médicos

**Pregunta de negocio:** ¿El catálogo debe distinguir explícitamente los dispositivos médicos mediante una categoría o atributos regulatorios específicos, o basta el tipo genérico `PRODUCTO`?

### Contexto

`Sterinova-ERP.md` §1 incluye la comercialización de dispositivos médicos; §3 solicita un catálogo de productos y servicios. El anexo no define una categoría ni atributos regulatorios para esos productos. El backend tiene `tipo_item` (`PRODUCTO` / `SERVICIO`) y categorías para insumos, pero no una clasificación específica de dispositivos médicos.

### Opciones e impacto

- **Definir categoría o atributos regulatorios:** el negocio debe precisar cuáles se requieren y cuándo son obligatorios; permitirá identificar y filtrar estos dispositivos, con cambios en captura y datos.
- **Mantener `PRODUCTO` genérico:** evita añadir clasificación no especificada; los dispositivos se registran como productos sin atributos especializados.

### Requisitos afectados

- `RF-COM-002` queda Cubierto con el modelo actual mientras esta decisión permanece pendiente.
- `B-002-01` seguirá abierta hasta decisión explícita.

<a id="doc-requisitos-por-aclarar-ra-com-003-flujo-reemplazo"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-003-flujo-reemplazo.md

---
id: RA-COM-003
titulo: Flujo de reemplazo de cotizaciones emitidas
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts"
depende_de: [RF-COM-003]
bloquea: []
brechas: [B-003-02]
historial:
  - version: 1.0
    nota: "Pregunta abierta derivada de RF-COM-003; no autoriza modificar el documento emitido."
---

## RA-COM-003 — Flujo de reemplazo de cotizaciones emitidas

**Pregunta de negocio:** Cuando se debe corregir una cotización emitida, ¿se debe crear una nueva cotización vinculada a la original o emitir un documento anexo/de reemplazo relacionado con el original?

### Contexto

`Sterinova-ERP.md` §6 prohíbe modificar cotizaciones emitidas y exige nueva revisión o documento de reemplazo. El código bloquea la edición directa, pero en la evidencia revisada no aparece un flujo de reemplazo que vincule un nuevo documento con el emitido original.

### Opciones e impacto

- **Nueva cotización vinculada:** genera un nuevo registro y revisión comercial; requiere conservar relación explícita con el original y definir su estado/efecto.
- **Documento anexo o reemplazo vinculado:** conserva la cotización original y agrega evidencia formal de corrección; requiere definir el tipo documental, aprobación y relación entre documentos.

### Requisito afectado

`RF-COM-003` queda Cubierto para crear/editar borradores y bloquear edición directa de emitidas. `B-003-02` permanece abierta hasta decisión explícita.

<a id="doc-requisitos-por-aclarar-ra-com-004-transicion-estado-emitida"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-004-transicion-estado-emitida.md

---
id: RA-COM-004
titulo: Transición de estado a EMITIDA
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §2, §6"
fuente_contraste: "src/cotizaciones/entities/estado-cotizacion.enum.ts; src/cotizaciones/cotizaciones.service.ts"
depende_de: [RF-COM-003]
bloquea: []
brechas: [B-003-04]
historial:
  - version: 1.0
    nota: "Pregunta técnica/de negocio derivada de RF-COM-003; no se presume cambio de código."
---

## RA-COM-004 — Transición de estado a EMITIDA

**Pregunta técnica/de negocio:** Al completar la emisión, ¿debe el sistema asignar formalmente `EstadoCotizacion.EMITIDA`, o es suficiente conservar el estado previo aprobado y usar `fecha_emision` como bandera de emisión?

### Contexto

El enum de estados contiene `EMITIDA`. El método de emisión inspeccionado guarda `fecha_emision`, snapshot y PDF, pero no asigna explícitamente `EMITIDA`. La edición directa sí se bloquea usando tanto la fecha como el estado. Se requiere decidir cuál es el contrato de estado para otros consumidores y reportes.

### Opciones e impacto

- **Cambiar el estado a `EMITIDA`:** alinea el campo de estado con el flujo declarado; requiere revisar consumidores, persistencia y compatibilidad histórica.
- **Mantener `fecha_emision` como indicador suficiente:** evita transición explícita; los consumidores deberán usar la fecha para distinguir emitidas de aprobadas sin emitir.

### Requisito afectado

`RF-COM-003` queda Cubierto en su núcleo transaccional; `B-003-04` permanece abierta hasta que el equipo decida el contrato.

<a id="doc-requisitos-por-aclarar-ra-com-005-precios-cliente"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-005-precios-cliente.md

---
id: RA-COM-005
titulo: Precios especiales reutilizables por cliente
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 3, respuestas 26–29; src/productos/; src/cotizaciones/"
depende_de: [RF-COM-004]
bloquea: []
brechas: [B-004-02]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-004; el precio por cotización permanece disponible mientras se decide si hace falta reutilización."
---

## RA-COM-005 — Precios especiales reutilizables por cliente

**Pregunta de negocio:** ¿Es suficiente capturar o editar el precio en cada cotización, o se necesita un catálogo maestro que permita guardar y reutilizar precios y condiciones especiales por cliente?

### Contexto

El backend recibe `valor_unitario` por ítem y lo guarda en una línea asociada a una cotización de cliente. La entidad de producto no contiene precio y no se observó relación de tarifas con clientes. La documentación backend indica que los precios pueden variar por cliente y propone seleccionar el precio del cliente o capturarlo en la cotización; no confirma que se requiera persistir tarifas reutilizables.

### Opciones e impacto

- **Precio por cotización es suficiente:** el asesor establece el valor unitario en cada oferta; no se mantiene una tarifa especial reutilizable.
- **Se requiere catálogo por cliente:** deben definirse vigencia, moneda, unidad, alcance de productos/servicios, autorización de cambios y uso de la tarifa al cotizar.

### Requisito afectado

`RF-COM-004` mantiene cobertura parcial y permite capturar precios por ítem. `B-004-02` permanece abierta hasta decisión explícita.

<a id="doc-requisitos-por-aclarar-ra-com-006-evidencia-aceptacion"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-006-evidencia-aceptacion.md

---
id: RA-COM-006
titulo: Evidencia de aceptación del cliente
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 3, respuestas 32–35; src/cotizaciones/entities/cotizacion.entity.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts"
depende_de: [RF-COM-006]
bloquea: []
brechas: [B-006-03]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-006; no establece evidencia obligatoria hasta decisión explícita del negocio."
---

## RA-COM-006 — Evidencia de aceptación del cliente

**Pregunta de negocio:** ¿Qué documento o referencia debe conservar el sistema para demostrar que el cliente aceptó una cotización?

### Contexto

El cliente no inicia sesión en el ERP; un usuario interno registraría su respuesta. La documentación activa propone conservar fecha, responsable, medio, versión y alternativa aceptada, pero no define si debe adjuntarse un documento o cuál evidencia es suficiente. La cotización tiene columnas de auditoría para el usuario ERP y la fecha del registro, pero no un campo o asociación específica para la evidencia.

### Opciones e impacto

- **Número de orden de compra:** guardar número, fecha y eventualmente emisor; definir cómo tratar aceptación sin orden de compra.
- **Documento firmado:** adjuntar o referenciar un archivo y conservar su identidad/integridad; definir formatos y quién lo carga.
- **Correo u otra comunicación:** conservar referencia, emisor, fecha y medio; decidir si se adjunta el mensaje.
- **Registro manual en el sistema:** guardar responsable, fecha, medio y referencia/observación, sin adjunto obligatorio.
- **Combinación de evidencias:** determinar qué evidencia se exige según el tipo de cliente o transacción.

### Requisito afectado

`RF-COM-006` mantiene cobertura Parcial. `B-006-03` queda abierta hasta decisión explícita; esta ficha no convierte ninguna opción en requisito aprobado.

<a id="doc-requisitos-por-aclarar-ra-com-007-reconstruccion-pdf-historico"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-007-reconstruccion-pdf-historico.md

---
id: RA-COM-007
titulo: Política de reconstrucción de PDFs históricos
tipo: RA
modulo: Comercial / Documentos
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6, §7"
fuente_contraste: "src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/cotizacion.entity.ts; src/database/migrations/1793750400000-AddDocumentFormatVersioning.ts; src/database/migrations/1794225602000-AddOperationalDocumentData.ts"
depende_de: [RF-COM-007]
bloquea: []
brechas: [B-007-01]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-007; incluye observación técnica de que el trigger de cotizaciones protege el sello, no todo el snapshot JSON."
---

## RA-COM-007 — Política de reconstrucción de PDFs históricos

**Pregunta de negocio:** ¿Qué debe hacer el sistema si un PDF comercial histórico necesita reconstruirse y su cotización no tiene snapshot persistido?

### Contexto

`CotizacionesService.ensurePdfCurrent` reconstruye desde `snapshot_datos` cuando está disponible. Si no existe, puede construir un snapshot desde la cotización y el formato que encuentra en ese momento. Eso podría generar un documento diferente a la versión histórica original. La migración revisada agrega la columna de snapshot, pero no evidencia un backfill de snapshots para cotizaciones históricas como el realizado para certificados.

### Opciones e impacto

- **Bloquear y solicitar restauración:** no generar PDF desde datos actuales; pedir recuperación de una copia histórica verificable. Preserva el criterio de no sustituir silenciosamente datos, pero puede dejar el documento temporalmente inaccesible.
- **Generar con marca «Documento Reconstruido»:** permitir una copia basada en los datos disponibles, identificar visiblemente que fue reconstruida y registrar responsable, fecha y motivo. No asegura por sí sola que los datos coincidan con el original.
- **Política diferenciada:** bloquear si no hay respaldo verificable y permitir una copia marcada solo mediante autorización y auditoría explícitas.

### Observación técnica para análisis posterior

La entidad guarda `snapshot_datos` en una columna JSON. La migración `1794225602000-AddOperationalDocumentData.ts` crea `trg_cotizaciones_sello_inmutable`, pero su condición protege el cambio de `sello_icontec_version_id` cuando existe emisión o snapshot; no protege todos los campos del JSON ni otros datos documentales. La migración `1793813500000-AddPdfRendererVersion.ts` incluye protección de snapshot para certificados, no una protección equivalente general para cotizaciones. Debe evaluarse si la política aprobada requiere inmutabilidad del snapshot a nivel de BD y cómo mantener compatible la regeneración operativa del PDF.

### Requisito afectado

`RF-COM-007` conserva cobertura Parcial. `B-007-01` permanece abierta hasta decidir la política de recuperación y reconstrucción; esta ficha no aprueba ninguna opción ni declara implementada la protección adicional de BD.

<a id="doc-requisitos-por-aclarar-ra-com-008-politicas-anulacion"></a>

**Origen:** docs/requisitos/por-aclarar/RA-COM-008-politicas-anulacion.md

---
id: RA-COM-008
titulo: Políticas de resolución de anulaciones
tipo: RA
modulo: Comercial / Cotizaciones
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 1, Anulación con aprobación; Módulo 3, respuesta 36; src/cotizaciones/solicitud-anulacion.service.ts"
depende_de: [RF-COM-008, RF-COM-014]
bloquea: []
brechas: [B-008-03]
historial:
  - version: 1.0
    nota: "Preguntas derivadas de RF-COM-008; no modifican el bloqueo de emisión mientras la solicitud está pendiente, definido por el usuario para RF-COM-014."
---

## RA-COM-008 — Políticas de resolución de anulaciones

**Preguntas de negocio:** ¿Debe exigirse una observación al aprobar o rechazar una solicitud de anulación? Si una solicitud se rechaza, ¿la cotización aprobada vuelve a quedar disponible para emisión cuando cumpla las demás reglas comerciales?

### Contexto

El DTO y el servicio exigen motivo no vacío al solicitar la anulación. La observación de resolución debe ser texto, pero puede quedar vacía. Una resolución rechazada guarda estado, aprobador, fecha y observación; no cambia el estado de la cotización. La emisión durante una solicitud pendiente queda bloqueada por `RF-COM-014`; esta decisión abierta se refiere al comportamiento una vez rechazada.

### Opciones e impacto

- **Observación obligatoria para ambas decisiones:** requiere justificar aprobación y rechazo; facilita interpretar la decisión y responder consultas posteriores.
- **Obligatoria solo para rechazo:** documenta el motivo de denegación y permite aprobar sin texto adicional.
- **Opcional para ambas decisiones:** conserva el campo sin imponer contenido; puede limitar la explicación disponible en la trazabilidad.

Para solicitudes rechazadas, confirmar si la cotización aprobada queda habilitada para emisión una vez que el estado de la solicitud ya no sea pendiente, o si requiere una acción adicional. El bloqueo mientras está pendiente ya se definió para `RF-COM-014`.

### Requisito afectado

`RF-COM-008` conserva cobertura Parcial. `B-008-03` queda abierta hasta decisión explícita; esta ficha no cambia permisos ni estados.

<a id="doc-requisitos-por-aclarar-ra-fis-001-fiscalidad-por-producto"></a>

**Origen:** docs/requisitos/por-aclarar/RA-FIS-001-fiscalidad-por-producto.md

---
id: RA-FIS-001
titulo: Fiscalidad por producto o servicio
tipo: RA
modulo: Fiscal
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §8"
fuente_contraste: "src/tasas-fiscales/; src/cotizaciones/entities/cotizacion.entity.ts; src/cotizaciones/cotizaciones.service.ts"
depende_de: []
bloquea: []
brechas: [B-002-02]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-002; el IVA en cabecera se conserva como solución operativa actual."
---

## RA-FIS-001 — Fiscalidad por producto o servicio

**Pregunta de negocio:** Cuando se defina la integración fiscal real pendiente en el anexo §8, ¿se requerirá asignar tasas o clasificación fiscal a cada producto/servicio, o se mantendrá el tratamiento tributario a nivel de cotización?

### Contexto

El backend mantiene versiones inmutables de tasas fiscales y, al crear una cotización, guarda una tasa IVA y su versión en la cabecera. No hay vínculo fiscal en `Producto` ni en `CotizacionItem`. El usuario confirmó que este modelo es un parche operativo válido por ahora; la integración fiscal real permanece pendiente.

### Opciones e impacto

- **Fiscalidad por producto/servicio:** el negocio debe definir categorías, tasas aplicables, excepciones y precedencia; el cálculo puede variar por línea.
- **Fiscalidad a nivel de cotización:** mantener una tasa única por cotización como mecanismo actual; se necesita definir el alcance de la integración fiscal real sin asumir que el parche actual la satisface.

### Requisitos afectados

- `RF-COM-002` queda Cubierto y no bloquea el flujo comercial actual.
- `B-002-02` permanece abierta hasta que se defina el alcance fiscal futuro.

<a id="doc-requisitos-por-aclarar-ra-log-001-soportes-comerciales"></a>

**Origen:** docs/requisitos/por-aclarar/RA-LOG-001-soportes-comerciales.md

---
id: RA-LOG-001
titulo: Soportes comerciales para creación de órdenes
tipo: RA
modulo: Logística / Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 47"
fuente_contraste: "src/logistica/dto/create-orden.dto.ts; src/logistica/logistica.service.ts; Sterinova-ERP.md §3"
depende_de: [RN-LOG-001]
bloquea: []
brechas: [B-LOG-003]
historial:
  - version: 1.0
    nota: "Decisión derivada de RN-LOG-001: la regla acepta OC del cliente o autorización explícita del Jefe de Área, pero el servicio exige un único campo de OC."
---

## RA-LOG-001 — Soportes comerciales para creación de órdenes

**Pregunta de negocio:** Cuando no se dispone de una Orden de Compra del cliente, ¿qué forma debe tener la autorización explícita del Jefe de Área y qué datos/evidencias deben conservarse para permitir crear la orden?

### Contexto

La respuesta 47 del Módulo 4 de `docs/negocio/reglas-maestras.md` define dos alternativas: Orden de Compra del cliente **o** autorización explícita del Jefe de Área. `LogisticaService.createOrden` actualmente exige `orden_compra_cliente` como texto no vacío; el DTO no modela un tipo de soporte alternativo ni datos de autorización separados.

### Opciones para decisión

- **Solo OC:** mantener la OC como condición obligatoria y revisar la regla de negocio para retirar o limitar la alternativa de autorización.
- **OC o autorización registrada:** permitir ambas alternativas y guardar tipo de soporte, autorizador, fecha, motivo y referencia documental.
- **OC o evidencia adjunta:** aceptar autorización solo con soporte documental adjunto y definir quién puede cargarla y consultarla.

### Impacto

La decisión determina los campos, permisos, evidencia y validaciones al crear una orden. También evita registrar una autorización verbal como si fuera número de orden de compra.

### Requisito y brecha afectados

`RN-LOG-001` conserva cobertura Parcial. `B-LOG-003` permanece abierta y se reasigna a esta decisión. No se cambia el código hasta que se valide una alternativa.

<a id="doc-requisitos-por-aclarar-ra-log-002-notificacion-parciales"></a>

**Origen:** docs/requisitos/por-aclarar/RA-LOG-002-notificacion-parciales.md

---
id: RA-LOG-002
titulo: Políticas de evidencia y notificación en recepciones parciales
tipo: RA
modulo: Logística / Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.1
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48–49; src/logistica/dto/create-recepcion.dto.ts; src/logistica/recepcion.service.ts"
depende_de: [RF-LOG-002, RF-LOG-010, RF-LOG-023]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-LOG-002 sobre evidencia de recepción y notificación a Comercial cuando queda saldo pendiente."
  - version: 1.1
    nota: "Se incluye la precisión de negocio sobre contenido, evidencia y periodicidad del acta de recepción listada en §7."
---

## RA-LOG-002 — Políticas de evidencia y notificación en recepciones parciales

**Preguntas de negocio:** ¿Qué evidencia debe conservarse para cada recepción parcial o completa? ¿En qué momento y a qué rol/persona se notifica a Comercial sobre la cantidad faltante? ¿La notificación se repite por cada recepción parcial o solo ante determinados eventos? ¿Qué datos, firma y soportes requiere el acta de recepción listada en §7, y se emite por cada ingreso parcial o se consolida por orden?

### Contexto

La respuesta 48 del Módulo 4 pide fecha/hora, usuario receptor, sede de origen y evidencias (fotos o firma digital de quien entrega). La respuesta 49 pide notificar a Comercial cuando se recibe menos de lo esperado. El DTO de recepción permite evidencia opcional y el servicio no implementa notificación. §7 también enumera actas de recepción, pero no define contenido ni vínculo con recepciones parciales. La modalidad aceptable, destinatario, canal y política de reintentos no están definidos.

### Opciones para decisión

- **Evidencia obligatoria por evento:** definir tipos admitidos (foto, documento, firma digital), quién carga/valida y reglas de conservación.
- **Notificación inmediata por cada parcial:** informar a los responsables de Comercial al registrar cada diferencia, con orden, ítems y saldo pendiente.
- **Notificación por umbral o al cierre:** avisar solo si la diferencia supera una tolerancia definida o cuando se complete/rechace la recepción.
- **Bandeja interna y alertas:** registrar la novedad en el ERP y decidir si además se envían avisos externos.

### Impacto

La decisión determina obligatoriedad de campos, modelo de evidencias, roles destinatarios, canal, deduplicación y auditoría. No cambia la regla ya acordada de conservar el saldo parcial.

### Requisitos afectados

`RF-LOG-002` conserva cobertura Parcial. La persistencia y saldo se implementan en el borrador `RF-LOG-010`; la emisión documental se analiza en `RF-LOG-023`; esta decisión define evidencia, contenido del acta y notificación. No se modifica código hasta validar la política.

<a id="doc-requisitos-por-aclarar-ra-log-003-politicas-rechazo"></a>

**Origen:** docs/requisitos/por-aclarar/RA-LOG-003-politicas-rechazo.md

---
id: RA-LOG-003
titulo: Políticas de disposición de materiales rechazados
tipo: RA
modulo: Logística / Calidad
estado: parcialmente_resuelta
certeza: parcial
version: 1.1
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "decisiones-prioridad-1-calidad-planta-logistica.md; docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49 y 53; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-logistica.entity.ts"
depende_de: [RF-LOG-003, RF-LOG-013]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-LOG-003; RF-LOG-013 implementará el rechazo por línea, sujeto a definir quién decide su disposición."
  - version: 1.1
    nota: "D-CAL-002 establece que Calidad determina el destino y que devolución/destrucción requieren responsable, fecha y evidencia. Se mantienen abiertos el proceso de coordinación con Logística, otros destinos y el detalle probatorio."
---

## RA-LOG-003 — Políticas de disposición de materiales rechazados

**Pregunta pendiente:** ¿Cómo coordina Logística con Calidad el rechazo inicial por daño/empaque, la evaluación del material y la ejecución de la disposición aprobada por Calidad? ¿Quién autoriza «otro destino» y qué registro adicional necesita cada salida?

### Contexto

El anexo pide rechazar materiales dañados y la respuesta 49 requiere motivo. Las reglas maestras indican que la secuencia de rechazo, devolución y acumulación de recepciones parciales todavía no está definida. El código permite marcar la cabecera de recepción como `RECHAZADO`, pero no registra rechazo por línea ni flujo de devolución/inventario.

### Decisiones ya confirmadas

La autoridad para determinar el destino corresponde a Calidad. Devolución y destrucción requieren constancia con responsable, fecha y evidencia. Siguen pendientes la autorización para «otro destino», el procedimiento de entrega/recepción de custodia y las notificaciones a Comercial y al cliente.

### Alternativas de flujo no decididas

Devolución inmediata, cuarentena previa, rechazo parcial con continuación o rechazo total son alternativas que requieren una decisión operativa; la regla confirmada sobre autoridad de Calidad no selecciona por sí sola una de ellas.

### Impacto

La decisión determina estados por línea, permisos, impacto en cantidades disponibles para Planta, devolución, evidencia y notificaciones. El borrador `RF-LOG-013` puede modelar el rechazo, pero no debe asumir el destino sin esta decisión.

### Referencia de decisión

Ver [D-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio): Calidad determina el destino; devolución y destrucción requieren constancia con responsable, fecha y evidencia. La RA no reabre esa autoridad. Siguen por decidir la secuencia de rechazo logístico, cuarentena previa, rechazo parcial/total, custodios y quién autoriza «otro destino». El impacto en inventario y cantidades disponibles se coordina con `RF-LOG-010`, `RF-LOG-012` y `RF-CAL-006` y no queda definido por esta decisión.

<a id="doc-requisitos-por-aclarar-ra-log-004-cierre-ordenes"></a>

**Origen:** docs/requisitos/por-aclarar/RA-LOG-004-cierre-ordenes.md

---
id: RA-LOG-004
titulo: Criterios de cierre de órdenes y despachos parciales
tipo: RA
modulo: Logística / Calidad
estado: parcialmente_resuelta
certeza: parcial
version: 1.1
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "decisiones-prioridad-1-calidad-planta-logistica.md; docs/negocio/reglas-maestras.md, Módulo 4, respuestas 54–56; src/logistica/logistica.service.ts"
depende_de: [RF-LOG-005, RF-LOG-019]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Preguntas derivadas de RF-LOG-005: definir cierre de orden con entregas parciales/faltantes y criterios de Calidad/certificación en despacho parcial."
  - version: 1.1
    nota: "D-LOG-001 fija el criterio base de cierre: cantidades aceptadas liberadas y saldo restante con destino final y evidencia completa. Detalles de conciliación y documentos por disposición siguen abiertos."
---

## RA-LOG-004 — Criterios de cierre de órdenes y despachos parciales

**Preguntas aún abiertas:** ¿Cómo se concilian numéricamente entregas, devoluciones, reprocesos, certificados y cantidades liberadas? ¿Qué evidencia concreta exige cada destino final y qué certificado acompaña cada despacho parcial?

### Contexto

El anexo §3 requiere entregas parciales y finales. Las reglas activas exigen liberación de Calidad y certificado para despacho cuando corresponda, pero dejan pendiente el alcance de la liberación en despachos parciales. El backend solo dispone de estado final `ENTREGADO` y el flujo actual cierra la orden con un único evento.

### Regla de cierre confirmada y precisiones pendientes

- La orden solo se cierra cuando las cantidades aceptadas están liberadas y todo saldo restante tiene destino final registrado y evidencia exigida completa.
- El procesamiento por sí solo no cierra la orden.

Para despacho parcial siguen por definirse la relación entre cantidad liberada y cantidad certificada, la granularidad del certificado y las excepciones permitidas.

### Impacto

La decisión determina estados, cantidades de saldo, alertas, requisitos de certificado, permisos, facturación y métricas de cumplimiento. `RF-LOG-019` debe implementarse conforme a esta política.

### Referencia de decisión

Ver [D-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio). Esta RA queda parcialmente resuelta y no define el diseño de estados ni la conciliación técnica entre entregas, reprocesos, certificados y devoluciones. La regla de cierre está confirmada; las preguntas de conciliación, liberación/certificación por despacho parcial y evidencia concreta permanecen abiertas. La validación funcional del bloque de Logística continúa pendiente según la instrucción de incorporación de decisiones prioritarias.

<a id="doc-requisitos-por-aclarar-ra-pla-003-inventario-planta"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-003-inventario-planta.md

---
id: RA-PLA-003
titulo: Política de inventario y microbodega en Planta
tipo: RA
modulo: Planta / Logística
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §8, pendientes: Inventario completo y Microbodega"
fuente_contraste: "Sterinova-ERP.md §3, Logística y Planta; src/planta/planta.service.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts"
depende_de: [RF-LOG-004]
bloquea: []
brechas: [B-LOG-020]
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-LOG-004: el flujo actual expone materiales de órdenes en Planta, pero no persiste un inventario/microbodega operativo al transferir."
---

## RA-PLA-003 — Política de inventario y microbodega en Planta

**Pregunta de negocio:** ¿Planta requiere inventario propio/microbodega con existencias por ubicación, material/lote y estado, o basta con consultar los materiales asociados a órdenes que están en `EN_PLANTA` y registrar su asignación a ciclos?

### Contexto

El anexo §8 identifica “Inventario completo” y “Microbodega” como pendientes. En el código revisado, `PlantaService.findOrdenesEnPlanta` consulta órdenes en `EN_PLANTA` y sus `OrdenServicioMaterial`; los ciclos registran cantidades procesadas, pero no se encontró saldo de inventario de Planta generado por la transferencia.

### Opciones para decisión

- **Solo materiales por orden:** mantener el acceso operacional por estado, sin inventario independiente; definir cómo se controlan devoluciones, sobrantes y ubicaciones.
- **Microbodega por orden/lote:** registrar entradas y consumos internos ligados a órdenes, materiales y lotes, sin inventario general.
- **Inventario completo de Planta:** manejar existencias, ubicaciones, reservas, movimientos, cuarentena, consumos, devoluciones y ajustes con conciliación/auditoría.

### Impacto

La decisión define si la transferencia crea una entrada de inventario, qué saldo limita ciclos y reprocesos, cómo se registran devoluciones y qué reportes requiere Planta. No se presume que un simple cambio a `EN_PLANTA` constituya movimiento de existencias.

### Requisito y brecha afectados

`RF-LOG-004` conserva cobertura Parcial. `B-LOG-020` queda abierta y se deriva a esta decisión hasta que negocio defina el alcance de inventario y microbodega.

<a id="doc-requisitos-por-aclarar-ra-pla-004-politicas-equipos"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-004-politicas-equipos.md

---
id: RA-PLA-004
titulo: Políticas de equipos, calibración y capacidad
tipo: RA
modulo: Planta / Calidad
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 y §6; docs/negocio/reglas-maestras.md, Módulo 5, respuestas 58–60"
fuente_contraste: "RF-PLA-001; RF-PLA-007; RF-PLA-008; RF-PLA-009"
depende_de: [RF-PLA-007, RF-PLA-008, RF-PLA-009]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-PLA-001; precisa lavandería, calibración y capacidad antes del diseño detallado."
---

## RA-PLA-004 — Políticas de equipos, calibración y capacidad

### Preguntas para negocio, Planta y Calidad

1. ¿Qué clases, atributos y flujo de estados aplican a los equipos de lavandería? ¿Se administrarán en el mismo catálogo que EtO/Vapor o como tipo independiente?
2. ¿Qué unidades y método de cálculo de capacidad se aplican a cada equipo y proceso? ¿Qué atributos de los materiales permiten computar la carga?
3. ¿Qué certificado y metadatos acreditan calibración vigente, quién puede cargarlos y qué periodicidad aplica? Las reglas existentes no fijan vigencias ni criterios de aceptación.
4. ¿Quién programa o asigna un equipo además de los roles autorizados para administrarlo/reactivarlo?

### Contexto

Las reglas maestras requieren catálogo, capacidad, estado operativo y bloqueo por mantenimiento/calibración. El código actual solo persiste el nombre de equipo en el ciclo. Las respuestas de negocio dejan pendientes las unidades de capacidad y la clasificación de lavandería.

<a id="doc-requisitos-por-aclarar-ra-pla-005-numeracion-ciclos"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-005-numeracion-ciclos.md

---
id: RA-PLA-005
titulo: Formatos de consecutivos y numeración física
tipo: RA
modulo: Planta / Calidad
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 61, 67–68"
fuente_contraste: "RF-PLA-002; RF-PLA-010; src/planta/entities/ciclo-esterilizacion.entity.ts"
depende_de: [RF-PLA-010]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-PLA-002 para fijar formato, reinicio anual, registros retroactivos y número físico del ciclo."
---

## RA-PLA-005 — Formatos de consecutivos y numeración física

### Preguntas para negocio, Planta y Calidad

1. ¿Qué formato, secuencia y política de reinicio debe tener el consecutivo interno? ¿Qué año se utiliza en ciclos capturados retroactivamente?
2. ¿Cómo se ingresa y valida el número físico de ciclo de máquina, incluido su alcance de unicidad por equipo/año?
3. ¿Cómo se identifican ciclos sucesivos de reproceso (por ejemplo, `R1`, `R2`) sin reemplazar el ciclo original?
4. ¿Qué excepciones de captura retroactiva requieren autorización y qué fechas y responsables deben quedar separados?

### Contexto

La regla maestra exige dos identificadores distintos, pero deja pendiente el formato del consecutivo y las reglas temporales. El código actual solo genera una clave primaria técnica y no captura número físico.

<a id="doc-requisitos-por-aclarar-ra-pla-006-politicas-reproceso"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-006-politicas-reproceso.md

---
id: RA-PLA-006
titulo: Políticas de reprocesos y material rechazado
tipo: RA
modulo: Planta / Calidad / Logística
estado: parcialmente_resuelta
certeza: parcial
version: 1.1
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 68–69"
fuente_contraste: "decisiones-prioridad-1-calidad-planta-logistica.md; RF-PLA-003; RF-PLA-011; src/planta/; src/calidad/"
depende_de: [RF-PLA-011]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-PLA-003 para definir saldo, autorización y disposición durante reprocesos."
  - version: 1.1
    nota: "Se incorpora D-PLA-001: aprobación previa de Calidad y Planta, ciclo nuevo vinculado al original y disposición documentada por Calidad para ciclos abortados. Saldo exacto y carga abortada parcialmente siguen abiertos."
---

## RA-PLA-006 — Políticas de reprocesos y material rechazado

### Preguntas aún abiertas para Planta, Calidad y Logística

1. Cuando se rechaza o aborta un ciclo, ¿qué cantidad exacta vuelve al saldo procesable, en particular si solo una parte de la carga fue procesada?
2. ¿Qué motivo y evidencia deben registrarse para cada disposición y aprobación?
3. ¿Cómo se reflejan liberación, devolución, destrucción o reproceso en inventario, cantidades logísticas, certificados y entregas parciales?
4. ¿Qué estado conserva la orden mientras quedan cantidades retenidas o con disposición pendiente?

### Contexto

Las reglas exigen preservar el ciclo fallido y crear uno nuevo vinculado. El backend acumula cantidades rechazadas como procesadas y no dispone de flujo conectado para `ciclo_correccion_de_id`; definir la regla de negocio precede el detalle técnico.

### Decisiones ya confirmadas

Calidad y Planta aprueban el reproceso antes de su creación; se crea un ciclo nuevo vinculado al rechazado/original. Para ciclos abortados, Calidad determina y documenta la disposición; el aborto no libera automáticamente el material. Ver [D-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio). La definición de saldo y el tratamiento de carga abortada parcialmente continúan pendientes. La decisión confirma el flujo de autorización y vínculo, pero no la cantidad que vuelve al saldo procesable ni la conciliación con Logística, certificados y entregas.

<a id="doc-requisitos-por-aclarar-ra-pla-007-politicas-evidencias"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-007-politicas-evidencias.md

---
id: RA-PLA-007
titulo: Políticas de evidencias documentales y formatos
tipo: RA
modulo: Planta / Calidad / Documentos
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 y §5; docs/negocio/reglas-maestras.md, Módulo 5, respuestas 65 y 75"
fuente_contraste: "RF-PLA-004; RF-PLA-012; src/planta/; src/calidad/"
depende_de: [RF-PLA-012]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-PLA-004 para fijar tipos de evidencia, formatos, obligatoriedad y conservación."
---

## RA-PLA-007 — Políticas de evidencias documentales y formatos

### Preguntas para Planta y Calidad

1. ¿Qué evidencias se exigen por método/protocolo y cuáles son opcionales? Considerar resultados BI/CI, gráficos, CSV/PDF de máquina y fotografías.
2. ¿Qué extensiones, límites de tamaño y validaciones técnicas se permiten?
3. ¿La evidencia se asocia al ciclo, a cada material, a cada parámetro o a más de un nivel?
4. ¿Qué plazo de retención, permisos de consulta y reglas de reemplazo/corrección aplican?
5. ¿Qué controles deben evitar que la carga de un archivo sustituya la captura o evaluación de datos originales?

### Contexto

El anexo y las reglas maestras piden evidencias del proceso, pero dejan por precisar formatos, conservación y qué tipos son obligatorios por método.

<a id="doc-requisitos-por-aclarar-ra-pla-008-politicas-recetas"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-008-politicas-recetas.md

---
id: RA-PLA-008
titulo: Políticas de recetas, insumos y microbodega
tipo: RA
modulo: Planta / Calidad / Abastecimiento
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 y §8"
fuente_contraste: "RA-PLA-003; RF-PLA-005; src/planta/; src/productos/"
depende_de: [RF-PLA-005]
bloquea: []
brechas: [B-PLA-009]
historial:
  - version: 1.0
    nota: "Decisión de negocio derivada de B-PLA-009; el anexo §8 deja recetas por proceso y microbodega/consumos finales pendientes."
---

## RA-PLA-008 — Políticas de recetas, insumos y microbodega

### Preguntas para negocio, Planta y Abastecimiento

1. ¿Qué procesos/materiales requieren receta y qué insumos deben declararse por unidad, lote o carga?
2. ¿La receta será estándar, específica por método/equipo/empaque, o parametrizable por producto/material?
3. ¿Se requiere microbodega propia de Planta, inventario completo o solo registro de consumos por orden/ciclo? Coordinar con `RA-PLA-003` para mantener una decisión coherente.
4. ¿El sistema debe descontar consumo estándar automáticamente, registrar consumo real o permitir ambos con autorización de diferencias?
5. ¿Qué roles controlan recepción, ajuste, devolución, merma y aprobación de consumos?

### Contexto

El anexo §8 marca microbodega/consumos finales y recetas por proceso como pendientes de negocio. El catálogo comercial de productos `INSUMOS` no constituye inventario operativo de Planta.

<a id="doc-requisitos-por-aclarar-ra-pla-009-validacion-normativa-procesos"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-009-validacion-normativa-procesos.md

---
id: RA-PLA-009
titulo: Alcance de validación normativa de los procesos de esterilización
tipo: RA
modulo: Planta / Calidad / Cumplimiento
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §8: Validación normativa de procesos de esterilización"
fuente_contraste: "RF-PLA-001 a RF-PLA-005; RF-CAL-001 a RF-CAL-004; src/planta/; src/calidad/"
depende_de: []
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Ficha creada para representar un pendiente contractual de §8 que no tenía decisión propia. No identifica ni presume normas aplicables."
---

## RA-PLA-009 — Alcance de validación normativa de los procesos de esterilización

### Pregunta de negocio y cumplimiento

¿Qué procesos, métodos, equipos, productos y sedes deben someterse a validación normativa, y qué evidencia debe conservar Sterinova para demostrar que la validación aplica al proceso ejecutado?

### Aspectos a definir

- Marco normativo y jurisdicción que el negocio determine como aplicables, con asesoría de las personas responsables de cumplimiento.
- Alcance por método, tipo de equipo, producto, instalación y cambio del proceso.
- Responsables de aprobar, revisar y renovar la validación.
- Evidencias, vigencia, revisión, conservación y relación con protocolos, ciclos y desviaciones.
- Tratamiento documental cuando el proceso o equipo cambia.

### Impacto

La decisión condiciona los requisitos de equipos, protocolos, parámetros, evidencias, CAPA y aprobación de Calidad. Esta ficha no afirma cumplimiento normativo ni selecciona normas por inferencia.

### Referencia contractual

El anexo enumera “Validación normativa de procesos de esterilización” entre pendientes del proyecto en §8; no detalla los criterios técnicos ni jurídicos de aceptación.

<a id="doc-requisitos-por-aclarar-ra-pla-010-alcance-orden-esterilizacion"></a>

**Origen:** docs/requisitos/por-aclarar/RA-PLA-010-alcance-orden-esterilizacion.md

---
id: RA-PLA-010
titulo: Alcance documental de la orden de esterilización
tipo: RA
modulo: Planta / Calidad / Documentos
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 1.0
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Planta; §7 Documentos generados"
fuente_contraste: "RF-PLA-002; RF-PLA-004; RF-PLA-010; RF-PLA-017; src/planta/"
depende_de: [RF-PLA-017]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión abierta para precisar el contenido, momento de emisión, destinatarios y firma del documento de orden de esterilización enumerado en §7."
---

## RA-PLA-010 — Alcance documental de la orden de esterilización

### Preguntas para Planta y Calidad

1. ¿Qué datos debe mostrar la orden: cliente, orden de servicio, materiales/cantidades, método, equipo, protocolo/version, tanda, operador u otros?
2. ¿En qué momento se emite: al crear ciclo, preparar tanda, iniciar ciclo o en otro hito?
3. ¿Es un documento de trabajo interno o requiere aprobación/firmas y entrega a otra área?
4. ¿Cómo representa ciclos multiorden y cantidades parciales sin confundir orden de ciclo con certificado final?
5. ¿Qué formato, numeración, conservación, corrección y acceso por ámbito requiere?

### Contexto

`Sterinova-ERP.md` §7 enumera órdenes de esterilización como documentos generados, pero no define su contenido ni momento de emisión. El backend y frontend registran ciclos operativos; no se encontró un flujo separado para generar y conservar este documento.

### Requisito relacionado

`RF-PLA-017` mantiene la brecha documental abierta hasta que Planta/Calidad definan este alcance. Esta decisión no aprueba contenido ni autoriza cambios de código/BD.

<a id="doc-requisitos-por-aclarar-ra-seg-001-evidencia-legal-firmas"></a>

**Origen:** docs/requisitos/por-aclarar/RA-SEG-001-evidencia-legal-firmas.md

---
id: RA-SEG-001
titulo: Alcance jurídico y evidencia de firmas y autorizaciones
tipo: RA
modulo: Seguridad / Documentos / Calidad
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 1.0
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §7 Documentos generados; §8 Evidencia jurídica completa de firmas"
fuente_contraste: "RF-SEG-001; RNF-SEG-002; RF-PLA-007; RF-CAL-010; docs/requisitos/frontend/README.md"
depende_de: []
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Ficha creada para el pendiente jurídico de §8. No se presume que un nombre, imagen de firma, contraseña o aprobación en el ERP tenga un efecto legal específico."
---

## RA-SEG-001 — Alcance jurídico y evidencia de firmas y autorizaciones

### Pregunta de negocio y jurídica

¿Qué operaciones y documentos requieren firma o evidencia jurídicamente suficiente, quién puede firmarlos y qué debe conservar el ERP para demostrar identidad, intención, integridad y momento de la aprobación?

### Aspectos a definir

- Documentos y operaciones afectados, incluyendo aprobaciones de Calidad, liberaciones por excepción y documentos comerciales.
- Tipo de firma o constancia aceptado para cada uso y las validaciones jurídicas aplicables.
- Identidad del firmante, delegación, separación de funciones y evidencia temporal requerida.
- Integridad, conservación, consulta, revocación y reemplazo del documento firmado.
- Casos en que basta la aprobación autenticada en el ERP y casos que requieren evidencia externa.

### Impacto

La decisión condiciona el diseño de aprobaciones, adjuntos, auditoría, PDFs y retención documental. La autenticación por contraseña y la captura visual de una firma no se consideran automáticamente equivalentes a una firma con efecto jurídico.

### Referencia contractual

El anexo §8 marca “Evidencia jurídica completa de firmas” como pendiente y §7 enumera evidencias de firmas y autorizaciones, sin definir tipo, validez ni criterio de aceptación.

<a id="doc-requisitos-por-aclarar-ra-usr-001-roles-por-planta"></a>

**Origen:** docs/requisitos/por-aclarar/RA-USR-001-roles-por-planta.md

---
id: RA-USR-001
titulo: Políticas de asignación de roles por planta
tipo: RA
modulo: Usuarios / RBAC / Planta
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "RF-USR-002; src/rbac/entities/user-role-assignment.entity.ts; src/rbac/entities/scope.entity.ts"
depende_de: [RF-USR-002]
bloquea: []
brechas: []
historial:
  - version: 0.1
    nota: "Decisión de negocio sobre asignación de perfiles a múltiples plantas."
---

## RA-USR-001 — Políticas de asignación de roles por planta

### Pregunta de negocio

¿Un mismo usuario puede tener el mismo rol operativo en varias plantas simultáneamente? ¿Hay combinaciones de rol/planta que deban prohibirse o requerir una aprobación adicional, y cómo deben mostrarse/switcharse los ámbitos disponibles en la sesión?

### Impacto

La decisión afecta administración de asignaciones, selección de ámbito, alcance operativo y segregación de responsabilidades. El RBAC actual permite combinaciones de rol/ámbito, pero el negocio debe confirmar qué combinaciones son válidas para cada perfil.

<a id="doc-requisitos-por-aclarar-ra-usr-002-areas-scopes"></a>

**Origen:** docs/requisitos/por-aclarar/RA-USR-002-areas-scopes.md

---
id: RA-USR-002
titulo: Definición de Áreas Operativas vs. Scopes
tipo: RA
modulo: Usuarios / RBAC
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "RF-USR-003; src/rbac/entities/scope.entity.ts; src/rbac/ambitos/"
depende_de: [RF-USR-003]
bloquea: []
brechas: [B-USR-002]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-USR-002."
---

## RA-USR-002 — Definición de Áreas Operativas vs. Scopes

### Pregunta de negocio

¿Los ámbitos `DEPARTMENT`/`PLANT` de RBAC representan adecuadamente las áreas operativas del ERP (Comercial, Logística, Planta, Calidad), o se requiere un catálogo/entidad de Área independiente con atributos, responsables y relaciones propias?

### Impacto

La decisión determina el modelo organizativo, la asignación de usuarios/roles, el alcance de reportes y las fronteras de autorización. No se equipara automáticamente un área funcional a una planta física ni a un scope.

<a id="doc-requisitos-readme"></a>

**Origen:** docs/requisitos/README.md

## Requisitos Sterinova ERP

### Criterio de fuentes

`Sterinova-ERP.md` es la fuente contractual; documentación y código son contraste técnico. Las marcas de cierre de módulos backend se refieren a sus fichas, no a la cobertura del frontend. La [matriz de análisis frontend](./REQUISITOS_Y_REGLAS.md#doc-requisitos-frontend-readme) conserva por separado evidencia UI y cobertura API; las diferencias se registran sin resolución silenciosa. Esta documentación no acredita una base desplegada.

### Criterio de cierre documental previo a implementación

El cierre documental global requiere: mapear cada requisito contractual a una ficha o exclusión justificada; conservar los 16 campos y evidencia de backend, persistencia y frontend cuando aplique; asignar cada brecha a un destino vigente; registrar por separado las decisiones confirmadas y las preguntas que bloquean diseño; y obtener validación explícita de las fichas que siguen pendientes. Una decisión de negocio no implica que el código esté cubierto ni autoriza cambios.

**Estado verificado al 2026-11-20:** 38 fichas base cuentan con análisis de 16 campos. Las 35 fichas de Comercial, Logística, Planta, Calidad, Certificados, Usuarios y Auditoría fueron validadas como análisis de cobertura; esto no aprueba políticas funcionales aún abiertas. `RNF-SEG-001`, `RNF-SEG-002` y `RF-TRA-001` fueron presentadas y siguen pendientes de validación explícita. Además, la instrucción de decisiones de Prioridad 1 declara que los bloques funcionales de Logística y Planta no están aprobados como requisitos operativos, aunque sus análisis técnicos estén validados; mantener esa distinción hasta la ronda funcional correspondiente. Hay 51 requisitos derivados activos en borrador más el antecedente `RF-SEG-001` consolidado en `RNF-SEG-002`. Las 52 fichas derivadas/antecedentes están normalizadas al formato de 16 campos preliminares. Hay 29 fichas RA y un documento general de decisiones prioritarias; varias RA quedaron parcialmente resueltas con D-CAL-001/002, D-PLA-001 y D-LOG-001, mientras sus detalles técnicos/evidencias siguen abiertos. La matriz frontend tiene evidencia estática de todos los módulos, pero solo el bloque Comercial consta como validado funcionalmente. Por tanto, el cierre documental global **sigue en curso** y no se inicia implementación hasta resolver/validar los elementos bloqueantes y cerrar la matriz de cobertura.

### Índice y trazabilidad inicial

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
| [RF-COM-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-001-clientes) | Registrar y consultar clientes | RF / Comercial | Validado; cubierto | `src/clientes/`; tabla `clientes` y migraciones versionadas |
| [RF-COM-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-002-productos-servicios) | Gestionar productos y servicios | RF / Comercial | Validado; cubierto | `src/productos/`, `src/cotizaciones/`, `src/tasas-fiscales/`; tablas `productos`, `cotizacion_items`, `tasas_fiscales`, `cotizaciones` |
| [RF-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-003-cotizaciones-crud) | Crear y editar cotizaciones con varios ítems | RF / Comercial | Validado; cubierto | `src/cotizaciones/`; tablas `cotizaciones`, `cotizacion_items` |
| [RF-COM-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-004-condiciones-vigencia) | Gestionar condiciones, precios y vigencia | RF / Comercial | Validado; parcial | `src/cotizaciones/`; tabla `cotizaciones` y detalle `cotizacion_items` |
| [RF-COM-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-005-revision-aprobacion) | Revisar y aprobar cotizaciones | RF / Comercial | Validado; parcial | `src/cotizaciones/`, `src/rbac/`; aprobación y responsable persistidos en `cotizaciones` |
| [RF-COM-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-006-envio-aceptacion) | Enviar y registrar aceptación del cliente | RF / Comercial | Validado; parcial | `src/cotizaciones/`; estados y metadatos de aceptación existen, flujo pendiente |
| [RF-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-007-emitir-documentos) | Emitir documentos comerciales y conservar sus datos | RF / Comercial | Validado; parcial | `src/cotizaciones/`, `src/pdf/`; snapshot, PDF, hash y versión documental |
| [RF-COM-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-008-anulaciones) | Solicitar y gestionar anulaciones | RF / Comercial | Validado; parcial | `src/cotizaciones/`; solicitud, aprobación/rechazo y conservación del original |
| [RF-COM-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-012-paso-revision) | Implementar el paso de Revisión (`EN_REVISION`) | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; transición a revisión pendiente |
| [RF-COM-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-013-implementar-envio-aceptacion) | Implementar flujo de envío y aceptación | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; rutas, transiciones y bloqueo de emisión pendientes |
| [RF-COM-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-014-bloqueo-emision-anulacion) | Bloqueo de emisión por anulación pendiente | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; compuerta transaccional pendiente |
| [RF-COM-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-009-importacion-clientes) | Importación masiva de clientes | RF / Comercial | Borrador, pendiente de validación | `POST /clientes/bulk`; tabla `clientes` |
| [RF-COM-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-010-descuentos-cotizaciones) | Cálculo de descuentos en cotizaciones | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; cálculo de descuentos no evidenciado en DTO/entidad revisados |
| [RF-COM-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-011-vigencia-oferta) | Control de vigencia y expiración de ofertas | RF / Comercial | Borrador, pendiente de validación | `src/cotizaciones/`; fecha de vencimiento y control pendientes |
| [RF-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rf-seg-001-password-aprobaciones) | Confirmación por contraseña en operaciones críticas | RF / Seguridad | Consolidado como antecedente en RNF-SEG-002; sin requisito independiente | Verificación de contraseña existe; el catálogo de operaciones críticas queda pendiente |
| [RNF-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-001-autorizacion-ambito) | Validación de autorización y ámbito en backend | RNF / Seguridad | Análisis presentado; ficha pendiente de validación; parcial | `src/auth/`, `src/rbac/`; guardia global; ruta de descarga logística pendiente de verificar el ámbito del recurso |
| [RNF-SEG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas) | Protección de sesiones y operaciones críticas | RNF / Seguridad | Análisis presentado; ficha pendiente de validación; parcial | JWT 8 horas, invalidación por versión, throttling; frontend conserva access token en `localStorage`; reautenticación no generalizada |
| [RA-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-seg-001-evidencia-legal-firmas) | Alcance jurídico y evidencia de firmas y autorizaciones | RA / Seguridad / Documentos / Calidad | Pendiente de decisión | Evidencia jurídica de firmas declarada pendiente en §8; criterios por definir |
| [RA-COM-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-001-ciclo-vida-cliente) | Alcance contractual del ciclo de vida del cliente | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-002-categorizacion-dispositivos) | Categorización de dispositivos médicos | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-003-flujo-reemplazo) | Flujo de reemplazo de cotizaciones emitidas | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-004-transicion-estado-emitida) | Transición de estado a EMITIDA | RA / Comercial | Pendiente de decisión técnica/negocio | No aplica hasta decisión |
| [RA-COM-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-005-precios-cliente) | Precios especiales reutilizables por cliente | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-006-evidencia-aceptacion) | Evidencia de aceptación del cliente | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-007-reconstruccion-pdf-historico) | Política de reconstrucción de PDFs históricos | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-COM-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-008-politicas-anulacion) | Políticas de resolución de anulaciones | RA / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RA-FIS-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-fis-001-fiscalidad-por-producto) | Fiscalidad por producto o servicio | RA / Fiscal | Pendiente de decisión | No aplica hasta decisión |
| [RN-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rn-log-001-creacion-ordenes) | Crear órdenes desde cotizaciones aceptadas | RN / Logística | Validado; parcial | `src/logistica/`, `src/ordenes-servicio/`; `ordenes_servicio`, `ordenes_servicio_materiales` |
| [RF-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-001-recogidas-rutas) | Registrar recogidas, rutas y llegadas directas | RF / Logística | Validado; parcial | `src/logistica/`; órdenes y eventos logísticos; ruta compartida pendiente |
| [RF-LOG-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-006-precarga-items) | Precarga automática de ítems cotizados en órdenes | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; precarga y vínculo de materiales pendientes |
| [RF-LOG-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-007-fix-relacion-orden) | Corrección de cardinalidad Cotización-Orden | RF / Logística / Persistencia | Borrador, pendiente de validación | Entidad `OrdenServicio` declara `OneToOne`; migración permite múltiples órdenes |
| [RF-LOG-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-008-entidad-rutas) | Implementar gestión de rutas compartidas | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; entidad y flujo de ruta pendientes |
| [RF-LOG-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-009-modalidad-ingreso) | Añadir modalidad de ingreso (Recogida vs. Llegada Directa) | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; distinción persistida pendiente |
| [RA-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-001-soportes-comerciales) | Soportes comerciales para creación de órdenes | RA / Logística / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RF-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-002-recepciones) | Registrar recepciones completas y parciales | RF / Logística | Validado; parcial | `src/logistica/`; cabecera de recepción, detalle y saldo pendientes |
| [RN-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rn-log-002-no-reasignacion) | Evitar reasignar dos veces un material recibido | RN / Logística / Planta | Validado; parcial | `src/planta/`; acumulado contra cantidad ordenada, puente a recepción pendiente |
| [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion) | Implementar persistencia de ítems y saldos de recepción | RF / Logística | Borrador, pendiente de validación | `src/logistica/`; líneas, saldo parcial y soporte requeridos |
| [RF-LOG-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-011-validacion-lotes) | Validaciones de trazabilidad en recepción (Lote/Empaque) | RF / Logística / Calidad | Borrador, pendiente de validación | `src/logistica/`; lote/empaque y vencimiento por definir |
| [RF-LOG-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta) | Control de procesamiento contra cantidades realmente recibidas | RF / Logística / Planta | Borrador, pendiente de validación | `src/planta/` y `src/logistica/`; control por saldo físico pendiente |
| [RF-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden) | Soporte para ciclos con múltiples órdenes | RF / Planta | Borrador, pendiente de validación | `src/planta/`; asociación ciclo-orden múltiple pendiente |
| [RA-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-002-notificacion-parciales) | Políticas de evidencia y notificación en recepciones parciales | RA / Logística / Comercial | Pendiente de decisión | No aplica hasta decisión |
| [RF-LOG-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-003-novedades-custodia) | Registrar novedades, rechazos y custodia | RF / Logística | Validado; parcial | `src/logistica/`, `src/ordenes-servicio/`; eventos básicos presentes, rechazo/novedades/evidencias pendientes |
| [RF-LOG-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-013-rechazo-item) | Rechazar material por ítem y registrar su disposición | RF / Logística / Calidad | Borrador, pendiente de validación | Rechazo por línea y disposición pendiente |
| [RF-LOG-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-014-entidad-novedades) | Entidad y flujo de novedades logísticas | RF / Logística | Borrador, pendiente de validación | Novedad estructurada y repetición de eventos pendientes |
| [RF-LOG-015](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-015-evidencias-adjuntos) | Adjuntar evidencias a eventos logísticos | RF / Logística / Documentos | Borrador, pendiente de validación | Flujo de adjuntos/evidencias pendiente |
| [RF-LOG-016](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-016-cadena-custodia) | Registrar traspasos de cadena de custodia | RF / Logística / Planta | Borrador, pendiente de validación | Acuse bilateral e identificación por material pendientes |
| [RA-LOG-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-003-politicas-rechazo) | Políticas de disposición de materiales rechazados | RA / Logística / Calidad | Parcialmente resuelta; detalles pendientes | Calidad determina destino; evidencia mínima confirmada |
| [RF-LOG-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-004-transferencia-planta) | Transferir materiales entre Logística y Planta | RF / Logística / Planta | Validado; parcial | `src/logistica/` registra `EN_PLANTA`; inventario/acta/auth de receptor derivados |
| [RF-LOG-017](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-017-recepcion-usuario-planta) | Confirmación de recepción por usuario autenticado de Planta | RF / Logística / Planta / Seguridad | Borrador, pendiente de validación | Usuario receptor y permiso de Planta pendientes |
| [RF-LOG-018](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-018-acta-traspaso) | Acta de transferencia y cantidades físicas de traspaso | RF / Logística / Planta / Documentos | Borrador, pendiente de validación | Acta bilateral y cantidades físicas pendientes |
| [RA-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-003-inventario-planta) | Política de inventario y microbodega en Planta | RA / Planta / Logística | Pendiente de decisión | No aplica hasta decisión |
| [RF-LOG-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-005-entregas-parciales) | Registrar entregas parciales y finales | RF / Logística / Entregas | Validado; parcial | `src/logistica/`; evento único de entrega, sin acumulación ni saldo |
| [RF-LOG-019](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-019-entregas-acumulables) | Implementar lógica de entregas parciales y control de saldos | RF / Logística / Entregas | Borrador, pendiente de validación | Acumulación, estados y saldo pendiente por implementar |
| [RF-LOG-020](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-020-pod-firmas) | Registro de Prueba de Entrega (POD) y firmas | RF / Logística / Documentos | Borrador, pendiente de validación | Captura y conservación de evidencia pendiente |
| [RF-LOG-021](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-021-fix-entidad-entrega) | Integración o depuración técnica de la entidad Entrega | RF / Logística / Persistencia | Borrador, pendiente de validación | Entidad declarada sin servicio/controlador de entrega |
| [RF-LOG-022](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-022-inmutabilidad-documentos) | Emisión idempotente y conservación de PDFs logísticos | RF / Logística / Documentos | Borrador, pendiente de validación | Reintentos, recuperación por snapshot y protección del PDF emitido pendientes |
| [RF-LOG-023](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-023-acta-recepcion) | Generar y conservar actas de recepción de materiales | RF / Logística / Recepción / Documentos | Borrador, pendiente de validación | No se encontró documento generado para la recepción física |
| [RA-LOG-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-004-cierre-ordenes) | Criterios de cierre de órdenes y despachos parciales | RA / Logística / Calidad | Parcialmente resuelta; conciliación pendiente | Regla de cierre base confirmada; detalle por línea/lote pendiente |

#### Mapa de trazabilidad — Logística (primer bloque)

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RN-LOG-001` | `B-LOG-001`: precarga y vínculo de ítems de cotización | [RF-LOG-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-006-precarga-items) | Derivada; borrador |
| `RN-LOG-001` | `B-LOG-002`: `OneToOne` contradice varias órdenes por cotización | [RF-LOG-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-007-fix-relacion-orden) | Derivada; borrador |
| `RN-LOG-001` | `B-LOG-003`: OC o autorización explícita alternativa | [RA-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-001-soportes-comerciales) | Derivada; pendiente de decisión |
| `RF-LOG-001` | `B-LOG-004`: gestión y agrupación de rutas | [RF-LOG-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-008-entidad-rutas) | Derivada; borrador |
| `RF-LOG-001` | `B-LOG-005`: UI sin transición de llegada directa | [RF-LOG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-001-recogidas-rutas) | Pendiente para fase frontend |
| `RF-LOG-001` | `B-LOG-006`: modalidad de ingreso explícita | [RF-LOG-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-009-modalidad-ingreso) | Derivada; borrador |

#### Mapa de trazabilidad — Recepción y asignación a Planta

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-002` | `B-LOG-007`, `B-LOG-008`, `B-LOG-011`: líneas, saldo parcial y soporte de recepción | [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion) | Derivadas; borrador |
| `RF-LOG-002` | `B-LOG-009`: lote, empaque, unidad y aplicabilidad de vencimiento | [RF-LOG-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-011-validacion-lotes) | Derivada; borrador |
| `RF-LOG-002` / `RN-LOG-002` | `B-LOG-010`, `B-LOG-012`: cantidades de ciclo limitadas por recepción real y trazabilidad física | [RF-LOG-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta) | Derivadas; borrador |
| `RN-LOG-002` | `B-LOG-013`: una carga de ciclo puede agrupar órdenes compatibles | [RF-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden) | Derivada; borrador |
| `RF-LOG-002` | Evidencia y notificación a Comercial ante diferencias/recepciones parciales | [RA-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-002-notificacion-parciales) | Preguntas de negocio; pendientes |

#### Mapa de trazabilidad — Novedades, rechazos y custodia

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-003` | `B-LOG-014`: rechazo por línea, motivo y disposición | [RF-LOG-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-013-rechazo-item) | Derivada; borrador |
| `RF-LOG-003` | `B-LOG-015`: novedades estructuradas y eventos repetibles | [RF-LOG-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-014-entidad-novedades) | Derivada; borrador |
| `RF-LOG-003` | `B-LOG-016`: evidencias y adjuntos en eventos | [RF-LOG-015](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-015-evidencias-adjuntos) | Derivada; borrador |
| `RF-LOG-003` | `B-LOG-017`: traspaso bilateral de custodia | [RF-LOG-016](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-016-cadena-custodia) | Derivada; borrador |
| `RF-LOG-003` | Destino, responsables y políticas para material rechazado | [RA-LOG-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-003-politicas-rechazo) | Pregunta de negocio; pendiente |

#### Mapa de trazabilidad — Transferencia Logística a Planta

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-004` | `B-LOG-018`: receptor de Planta no autenticado ni autorizado por rol destino | [RF-LOG-017](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-017-recepcion-usuario-planta) | Derivada; borrador |
| `RF-LOG-004` | `B-LOG-019`: falta acta bilateral con cantidades y evidencia | [RF-LOG-018](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-018-acta-traspaso) | Derivada; borrador |
| `RF-LOG-004` | `B-LOG-020`: alcance del inventario/microbodega no definido | [RA-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-003-inventario-planta) | Derivada; pendiente de decisión |

#### Mapa de trazabilidad — Entregas al cliente

| Fuente / requisito validado | Hallazgo | Destino | Estado |
|---|---|---|---|
| `RF-LOG-005` | `B-LOG-021`: falta acumulación de entregas parciales y saldo | [RF-LOG-019](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-019-entregas-acumulables) | Derivada; borrador |
| `RF-LOG-005` | `B-LOG-022`: falta POD firmada/fotografiada | [RF-LOG-020](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-020-pod-firmas) | Derivada; borrador |
| `RF-LOG-005` | `B-LOG-023`: entidad `Entrega` huérfana | [RF-LOG-021](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-021-fix-entidad-entrega) | Derivada; borrador |
| `RF-LOG-005` | Criterios de cierre y Calidad para despachos parciales | [RA-LOG-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-004-cierre-ordenes) | Pregunta de negocio; pendiente |

Registro acumulado: [brechas/registro-brechas.md](./REQUISITOS_Y_REGLAS.md#doc-requisitos-brechas-registro-brechas). Decisiones validadas: [decisiones/decisiones-negocio.md](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio). Las reglas de Prioridad 1 ya están incorporadas; sus precisiones aún abiertas y la validación funcional del Bloque 2 Logístico se mantienen señaladas en las RA y en la nota de reconciliación superior.

### Organización

- `backend/`: fichas de requisitos backend, una por archivo.
- [`frontend/`](./REQUISITOS_Y_REGLAS.md#doc-requisitos-frontend-readme): matriz central de cobertura frontend, con evidencia del repositorio SterinovaFrontend y enlaces a requisitos/brechas backend.
- `brechas/`: tabla acumulada; no se cierran brechas sin decisión explícita.
- `decisiones/`: decisiones confirmadas por el usuario.
- `por-aclarar/`: preguntas de negocio, con opciones e impacto.

No se crea una ficha cerrada antes de su validación. Toda revisión posterior conserva la versión anterior y agrega historial.

#### Planta

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-001-equipos-disponibilidad) | Registrar equipos y disponibilidad | RF / Planta | Validado; parcial | `src/planta/`; equipo libre en ciclo, sin catálogo, disponibilidad ni capacidad |
| [RF-PLA-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-007-catalogo-equipos) | Crear catálogo de equipos (EtO, Vapor, Lavandería) | RF / Planta | Borrador, pendiente de validación | Catálogo y vínculo trazable pendientes |
| [RF-PLA-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-008-control-mantenimiento) | Control de disponibilidad, mantenimiento y calibración de equipos | RF / Planta / Calidad | Borrador, pendiente de validación | Bloqueo operativo y calibración pendientes |
| [RF-PLA-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-009-validacion-capacidad) | Validación de capacidad de carga por equipo | RF / Planta | Borrador, pendiente de validación | Unidades y validación de carga pendientes |
| [RA-PLA-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-004-politicas-equipos) | Políticas de equipos, calibración y capacidad | RA / Planta / Calidad | Pendiente de decisión | Definiciones de lavandería, calibración y capacidad |
| [RF-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-002-creacion-ciclos) | Crear ciclos y asociar órdenes | RF / Planta | Validado; parcial | `src/planta/`; una orden por ciclo; método contratado validado |
| [RF-PLA-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-010-consecutivos-ciclos) | Implementar consecutivo de negocio y número físico de ciclo | RF / Planta | Borrador, pendiente de validación | Identificadores operativos del ciclo pendientes |
| [RA-PLA-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-005-numeracion-ciclos) | Formatos de consecutivos y numeración física | RA / Planta / Calidad | Pendiente de decisión | Formato, reinicio anual y reglas retroactivas |
| [RF-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-003-distribucion-cantidades) | Distribuir cantidades entre ciclos | RF / Planta | Validado; parcial | `src/planta/`; saldo y lock presentes, reprocesos requieren exclusión de rechazos |
| [RF-PLA-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-011-flujo-reprocesos) | Flujo de reprocesos y exclusión de saldos rechazados | RF / Planta / Calidad | Borrador, pendiente de validación | Saldo rechazado y vínculo al ciclo original pendientes |
| [RA-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-006-politicas-reproceso) | Políticas de reprocesos y material rechazado | RA / Planta / Calidad / Logística | Parcialmente resuelta; saldos pendientes | Aprobación previa y ciclo vinculado confirmados |
| [RF-PLA-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-004-parametros-protocolos) | Registrar parámetros, evidencias y protocolos | RF / Planta / Calidad | Validado; parcial | `src/planta/`, `src/calidad/`, `src/certificados/`; mediciones y evaluación disponibles, adjuntos pendientes |
| [RF-PLA-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-012-evidencias-adjuntas) | Implementar gestión de archivos adjuntos (Evidencias de ciclo) | RF / Planta / Calidad / Documentos | Borrador, pendiente de validación | Carga y vínculo de archivos pendientes |
| [RF-PLA-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-013-justificacion-no-aplica) | Añadir campo de justificación en evaluación de parámetros | RF / Planta / Calidad | Borrador, pendiente de validación | Justificación de `NO_APLICA` pendiente |
| [RA-PLA-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-007-politicas-evidencias) | Políticas de evidencias documentales y formatos | RA / Planta / Calidad / Documentos | Pendiente de decisión | Tipos, formatos, obligatoriedad y retención |
| [RF-PLA-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-005-tandas-recetas) | Registrar tandas, reprocesos, recetas e insumos | RF / Planta | Validado; parcial | `src/planta/`; ciclos existentes, tandas/recetas/consumos pendientes |
| [RF-PLA-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-014-entidad-tandas) | Implementar agrupación de ciclos por Tanda | RF / Planta | Borrador, pendiente de validación | Entidad y relación Tanda-Ciclo pendientes |
| [RA-PLA-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-008-politicas-recetas) | Políticas de recetas, insumos y microbodega | RA / Planta / Calidad / Abastecimiento | Pendiente de decisión | Definir recetas, consumos y alcance de microbodega |
| [RA-PLA-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-009-validacion-normativa-procesos) | Alcance de validación normativa de los procesos de esterilización | RA / Planta / Calidad / Cumplimiento | Pendiente de decisión | Normativa aplicable, evidencia y responsables por definir; no se presume cumplimiento |
| [RN-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rn-pla-001-metodo-contratado) | No cambiar en Planta el método contratado | RN / Planta / Comercial / Logística | Validado; parcial | Comparación con método de orden; anclaje al concepto pendiente |
| [RF-PLA-015](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-015-bloqueo-metodo) | Bloqueo estricto del método contratado (Comercial-Logística-Planta) | RF / Comercial / Logística / Planta | Borrador, pendiente de validación | Bloqueo contra método contractual por concepto pendiente |
| [RN-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rn-pla-002-no-sobrescribir) | No sobrescribir ciclos aprobados; vincular reprocesos con el original | RN / Planta / Calidad | Validado; parcial | API sin edición; hardening BD y reproceso derivados |
| [RF-PLA-016](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-016-trigger-inmutabilidad) | Inmutabilidad de ciclos aprobados a nivel de base de datos | RF / Planta / Calidad / Base de Datos | Borrador, pendiente de validación | Protección BD de ciclos aprobados pendiente |
| [RF-PLA-017](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-017-orden-esterilizacion-documento) | Generar y conservar la orden de esterilización | RF / Planta / Documentos | Borrador, pendiente de validación | Registro de ciclo disponible; generación/conservación documental no identificada |
| [RA-PLA-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-010-alcance-orden-esterilizacion) | Alcance documental de la orden de esterilización | RA / Planta / Calidad / Documentos | Pendiente de decisión | Contenido, momento, destinatario y aprobación por definir |

#### Calidad

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos) | Evaluar ciclos según parámetros y protocolos | RF / Calidad | Validado; parcial | Validación de rango durante aprobación; sugerencia visible derivada |
| [RF-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales) | Aprobar, rechazar o retener materiales | RF / Calidad / Logística | Validado; parcial | Rechazo de ciclo y guardia de entrega; cuarentena/disposición derivadas |
| [RF-CAL-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-005-sugerencia-ui-calidad) | Mostrar sugerencia automática de cumplimiento en UI de Calidad | RF / Calidad / Frontend | Borrador, pendiente de validación | Sugerencia previa por parámetro pendiente |
| [RF-CAL-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-006-cuarentena-materiales) | Implementar estado de Cuarentena y rechazo por material/lote | RF / Calidad / Planta / Logística | Borrador, pendiente de validación | Cuarentena y disposición individual pendientes |
| [RA-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-001-politicas-cuarentena) | Políticas de cuarentena y destino de materiales rechazados | RA / Calidad / Planta / Logística | Parcialmente resuelta; precisiones pendientes | Retención por lote, liberación parcial documentada y autoridad de Calidad confirmadas |
| [RF-CAL-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-007-bypass-ordenes-sin-metodo) | Blindar validación de Calidad para órdenes sin método de esterilización | RF / Calidad / Logística | Borrador, pendiente de validación | Validación obligatoria de liberación/certificado pendiente |
| [RF-CAL-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-003-desviaciones-capa) | Registrar desviaciones e investigaciones CAPA | RF / Calidad | Validado; faltante | Permisos RBAC declarados; sin entidades, endpoints ni flujo CAPA |
| [RF-CAL-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-008-modulo-capa) | Implementar entidades y endpoints para Desviaciones y CAPA | RF / Calidad | Borrador, pendiente de validación | Persistencia y API de investigación pendientes |
| [RF-CAL-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-009-flujo-capa) | Flujo de estados, acciones y verificación de eficacia de CAPA | RF / Calidad | Borrador, pendiente de validación | Ciclo de vida y verificaciones pendientes |
| [RA-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-002-politicas-capa) | Políticas de gestión de desviaciones y cierre de CAPA | RA / Calidad | Pendiente de decisión | Severidad, responsables y cierre por definir |
| [RF-CAL-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-004-liberacion-excepcion) | Autorizar liberaciones por excepción con evidencia | RF / Calidad | Validado; faltante | Sin endpoint/entidad de liberación excepcional |
| [RN-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rn-cal-001-bloqueo-despacho) | Exigir aprobación de Calidad antes del despacho | RN / Calidad / Logística | Validado; parcial | Bloqueo condicionado a método; caso nulo derivado |
| [RF-CAL-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-010-flujo-excepcion) | Implementar flujo de liberación por excepción | RF / Calidad / Certificados | Borrador, pendiente de validación | Autorización, evidencia y firmas pendientes |
| [RA-CAL-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-003-politicas-excepcion) | Políticas de liberación por excepción y firmas | RA / Calidad / Certificados / Logística | Pendiente de decisión | Criterios de elegibilidad y cargos por definir |

#### Certificados

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-001-emision-certificados) | Emitir certificados por orden y cliente | RF / Certificados / Calidad | Validado; parcial | Un certificado por ciclo y cliente único; unicidad impide compartir |
| [RF-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-002-identificacion-materiales) | Identificar en el certificado los materiales y ciclos asociados | RF / Certificados / Planta | Validado; parcial | Snapshot/PDF presentes; cantidad procesada por ciclo derivada |
| [RF-CER-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-004-certificados-ciclos-compartidos) | Soporte de certificados múltiples para ciclos compartidos | RF / Certificados / Planta | Borrador, pendiente de validación | Cardinalidad y certificados múltiples pendientes |
| [RF-CER-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-005-cantidades-procesadas) | Corrección de cantidades procesadas en snapshot de certificado | RF / Certificados / Planta | Borrador, pendiente de validación | Snapshot desde cantidades efectivas del ciclo pendiente |
| [RA-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-001-politicas-certificacion) | Políticas de certificación para ciclos compartidos y cantidades | RA / Certificados / Calidad / Planta | Pendiente de decisión | Partición, cantidad certificada y agrupación por definir |
| [RF-CER-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-003-versionado-anulacion) | Conservar versiones y anular certificados sin borrar el original | RF / Certificados | Validado; parcial | Snapshot/formato/PDF actuales; anulación y versionado derivadas |
| [RN-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rn-cer-001-ciclos-compartidos) | Emitir certificados separados para clientes de un ciclo compartido | RN / Certificados / Planta / Calidad | Validado; parcial | Emisión limitada a cliente único; multi-cliente derivado |
| [RF-CER-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-006-flujo-anulacion) | Implementar flujo de anulación y reemplazo de certificados | RF / Certificados | Borrador, pendiente de validación | Anulación y vínculo de reemplazo pendientes |
| [RF-CER-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-007-historial-versiones) | Historial de versiones de PDF y protección contra sobrescritura | RF / Certificados / Documentos | Borrador, pendiente de validación | Versiones inmutables y cadena de evidencia pendientes |
| [RA-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-002-politicas-reemplazo) | Políticas de anulación, reemplazo y conservación de certificados | RA / Certificados / Calidad | Pendiente de decisión | Autorizaciones, enlaces y retención por definir |

#### Usuarios y Administración

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-USR-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-001-administracion-usuarios) | Administrar usuarios y su estado | RF / Usuarios | Validado; parcial | Activación/desactivación implementada; auditoría explícita derivada |
| [RF-USR-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-002-roles-ambitos) | Asignar varios roles, permisos y ámbitos a usuarios | RF / Usuarios / RBAC | Validado; cubierto | Asignaciones múltiples y permisos por ámbito implementados |
| [RF-AUD-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-003-auditoria-usuarios) | Implementar auditoría explícita en cambios de estado de usuarios y RBAC | RNF / Auditoría / Usuarios / RBAC | Borrador, pendiente de validación | Bitácora de activación/cambios de usuario pendiente |
| [RA-USR-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-usr-001-roles-por-planta) | Políticas de asignación de roles por planta | RA / Usuarios / RBAC / Planta | Pendiente de decisión | Combinaciones válidas de rol/plantas por definir |
| [RF-USR-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-003-administracion-areas) | Administrar áreas y permisos | RF / Usuarios / RBAC | Validado; parcial | Scopes administrables; áreas autónomas y CRUD de permisos pendientes |
| [RF-USR-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-usuarios-rf-usr-004-crud-roles) | Implementar CRUD para gestión dinámica de Roles y Permisos | RF / Usuarios / RBAC | Borrador, pendiente de validación | Roles/permisos configurables por API pendientes |
| [RA-USR-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-usr-002-areas-scopes) | Definición de Áreas Operativas vs. Scopes | RA / Usuarios / RBAC | Pendiente de decisión | Equivalencia entre áreas y scopes por definir |

#### Auditoría

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-AUD-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-002-atomicidad-auditoria) | Atomicidad en registros de auditoría | RNF / Auditoría | Borrador, pendiente de validación | Propagación transaccional pendiente |
| [RF-AUD-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-001-consulta-auditoria) | Consultar operaciones, responsables y cambios registrados | RF / Auditoría | Validado; parcial | API devuelve sobre paginado; UI lo consume como arreglo (`B-AUD-002`); payload before/after no uniforme |
| [RF-AUD-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-004-payload-auditoria) | Estandarización de payload before/after en auditoría | RF / Auditoría | Borrador, pendiente de validación | Esquema uniforme de cambios pendiente |

#### Trazabilidad

| ID | Requisito | Tipo / módulo | Estado | Backend y BD |
|---|---|---|---|---|
| [RF-TRA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio) | Reconstruir cadena cliente–cotización–operación–certificado–entrega | RF / Transversal | Análisis presentado; ficha pendiente de validación; parcial | Relaciones existen por módulo; vista integral frontend/backend pendiente |

#### Pendientes transversales declarados en el anexo §8

| Pendiente contractual | Ficha activa | Estado documental |
|---|---|---|
| Inventario completo y microbodega/consumos finales | [RA-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-003-inventario-planta), [RA-PLA-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-008-politicas-recetas) | Decisiones pendientes |
| Recetas por proceso | [RA-PLA-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-008-politicas-recetas) | Decisión pendiente |
| Retenciones e investigaciones integrales | [RA-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-001-politicas-cuarentena), [RF-CAL-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-008-modulo-capa), [RF-CAL-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-009-flujo-capa) | Política parcialmente resuelta; requisitos derivados en borrador |
| Matriz definitiva de permisos productivos | [RNF-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-001-autorizacion-ambito), [RA-USR-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-usr-001-roles-por-planta), [RA-USR-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-usr-002-areas-scopes) | Análisis presentado; ficha de seguridad pendiente de validación y políticas de roles/áreas pendientes |
| Evidencia jurídica completa de firmas | [RA-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-seg-001-evidencia-legal-firmas) | Decisión pendiente; alcance nuevo derivado de §8 |
| Integración fiscal real | [RA-FIS-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-fis-001-fiscalidad-por-producto) | Decisión pendiente |
| Validación normativa de procesos de esterilización | [RA-PLA-009](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-009-validacion-normativa-procesos) | Decisión pendiente; normas y criterios no inferidos |
| Despliegue y operación completa en producción | [RNF-OPS-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-operacion-rnf-ops-001-operacion-produccion) | Borrador; inventario operativo y criterios de salida pendientes |

Decisiones del §8 que afectan cuarentena, reproceso, disposición y cierre de órdenes se registran en [decisiones de negocio](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio). Los pendientes explícitos de §8 quedan así trazados; esta correspondencia no certifica cumplimiento técnico, normativo o productivo.

#### Cruce de reglas operativas — anexo §6

| Regla contractual | Requisitos y decisiones trazados | Estado documental y hallazgo resumido |
|---|---|---|
| Una cotización emitida no se modifica; la corrección requiere revisión nueva o reemplazo. | [RF-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-003-cotizaciones-crud), [RF-COM-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-012-paso-revision), [RA-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-003-flujo-reemplazo) | El bloqueo de edición directa está validado; la etapa de revisión y el mecanismo de reemplazo siguen derivados y pendientes. |
| Un material recibido no puede reasignarse dos veces. | [RN-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rn-log-002-no-reasignacion), [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion), [RF-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden) | La regla está analizada como parcial; recepción persistida, saldo real y vínculo multiorden siguen en borrador. |
| Las cantidades pueden ser parciales o distribuirse entre varios ciclos. | [RF-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-002-recepciones), [RF-LOG-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-005-entregas-parciales), [RF-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-003-distribucion-cantidades), [RF-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden), [RA-LOG-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-004-cierre-ordenes) | Análisis validado; recepción/entrega acumulable y ciclo multiorden no están completos. La política base de cierre tiene decisión confirmada y su conciliación sigue abierta. |
| Las recepciones parciales conservan saldo pendiente. | [RF-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-002-recepciones), [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion), [RF-LOG-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta) | La cabecera existe, pero las líneas y el saldo no quedan implementados en el flujo revisado; requisitos derivados pendientes. |
| Una retención impide el avance no autorizado. | [RF-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales), [RF-CAL-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-006-cuarentena-materiales), [RA-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-001-politicas-cuarentena), [D-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio) | La política confirma retención por lote y liberación parcial autorizada; el estado/disposición por material aún requiere implementación y precisiones. |
| Planta no puede cambiar el método contratado. | [RN-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rn-pla-001-metodo-contratado), [RF-PLA-015](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-015-bloqueo-metodo) | El método se valida contra la orden operativa, pero esta puede modificarse antes del ciclo; anclaje al contrato pendiente. |
| Un equipo no disponible no puede utilizarse. | [RF-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-001-equipos-disponibilidad), [RF-PLA-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-007-catalogo-equipos), [RF-PLA-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-008-control-mantenimiento), [RA-PLA-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-004-politicas-equipos) | No se encontró catálogo ni disponibilidad de equipos; catálogo, mantenimiento/calibración y bloqueo están en borradores/decisión. |
| Un ciclo aprobado no puede sobrescribirse. | [RN-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rn-pla-002-no-sobrescribir), [RF-PLA-016](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-016-trigger-inmutabilidad) | No se encontró candado de base de datos para proteger un ciclo aprobado frente a escrituras directas; hardening derivado. |
| El reproceso crea una nueva ejecución vinculada al original. | [RN-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rn-pla-002-no-sobrescribir), [RF-PLA-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-011-flujo-reprocesos), [RA-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-006-politicas-reproceso), [D-PLA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-decisiones-decisiones-negocio) | Autorización previa de Calidad y Planta y vínculo nuevo están confirmados; saldo reprocesable y conciliación continúan pendientes. |
| Calidad debe aprobar antes del despacho. | [RF-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos), [RF-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales), [RN-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rn-cal-001-bloqueo-despacho), [RF-CAL-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-007-bypass-ordenes-sin-metodo) | Hay bloqueo para órdenes con método y certificado; la condición de método nulo sigue como brecha derivada. |
| El certificado se genera por cliente dentro del ciclo. | [RF-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-001-emision-certificados), [RN-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rn-cer-001-ciclos-compartidos), [RF-CER-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-004-certificados-ciclos-compartidos), [RF-CER-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-005-cantidades-procesadas), [RA-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-001-politicas-certificacion) | El modelo permite un certificado por ciclo y usa el total de la orden; separar clientes y reflejar cantidades procesadas requiere cambios y decisión de partición. |
| Un fallo de PDF no debe dejar el material aprobado sin documento. | [RF-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos), [RF-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-001-emision-certificados) | El flujo revisado agrupa aprobación y emisión en una transacción; la atomicidad ante fallo de PDF se documentó estáticamente, sin prueba de fallo ejecutada. No se registró una brecha funcional separada para este control; los problemas de contenido del snapshot se trazan aparte. |

#### Cruce de hitos de trazabilidad — anexo §5

| Hito contractual | Requisitos trazados | Estado de evidencia documentado |
|---|---|---|
| 1. Cliente que solicitó el servicio | [RF-COM-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-001-clientes), [RF-TRA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio) | Cliente y relación comercial existen; el alcance de historial integral está en `B-TRA-001`. |
| 2. Cotización emitida que originó el trabajo | [RF-COM-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-003-cotizaciones-crud), [RF-COM-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-006-envio-aceptacion), [RF-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-007-emitir-documentos), [RF-TRA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio) | Existe vínculo entre orden y cotización; flujo de aceptación, emisión y consulta unificada tiene requisitos derivados/políticas abiertas. |
| 3. Materiales recibidos | [RF-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-002-recepciones), [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion), [RF-LOG-023](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-023-acta-recepcion) | Se persiste la cabecera, pero el servicio revisado no persiste líneas de recepción ni genera acta específica. |
| 4. Cantidades y lotes que llegaron a Planta | [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion), [RF-LOG-011](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-011-validacion-lotes), [RF-LOG-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-012-control-cantidades-planta), [RF-LOG-018](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-018-acta-traspaso) | La recepción por línea/saldo, validación de trazabilidad y constancia de traspaso siguen en requisitos derivados. |
| 5. Tanda o ciclo que procesó el material | [RF-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-002-creacion-ciclos), [RF-PLA-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-003-distribucion-cantidades), [RF-PLA-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-006-ciclos-multiorden), [RF-PLA-014](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-014-entidad-tandas) | Se persisten ciclos y asignaciones por material; no se encontró Tanda independiente ni soporte multiorden operativo. |
| 6. Parámetros registrados | [RF-PLA-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-004-parametros-protocolos), [RF-PLA-012](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-012-evidencias-adjuntas), [RF-PLA-013](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-013-justificacion-no-aplica) | Mediciones y evaluaciones estructuradas existen; adjuntos y justificación `NO_APLICA` están derivados. |
| 7. Protocolo utilizado | [RF-PLA-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-004-parametros-protocolos), [RF-TRA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio) | El ciclo referencia una versión de protocolo; su presentación en una consulta integral queda en `B-TRA-001`. |
| 8. Decisiones de Calidad | [RF-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos), [RF-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales), [RF-CAL-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-008-modulo-capa) | Decisiones de aprobación/rechazo de ciclo se registran; CAPA y evidencia por lote/material no están completas. |
| 9. Materiales aprobados o rechazados | [RF-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales), [RF-CAL-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-006-cuarentena-materiales), [RA-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cal-001-politicas-cuarentena) | El estado actual es principalmente de ciclo; cuarentena, disposición y liberación por lote/cantidad siguen derivadas. |
| 10. Certificado emitido | [RF-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-001-emision-certificados), [RF-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-002-identificacion-materiales), [RF-CER-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-004-certificados-ciclos-compartidos), [RF-CER-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-005-cantidades-procesadas) | PDF y snapshot existen; certificado multi-cliente y cantidades exactas por ciclo no están resueltos. |
| 11. Materiales entregados o devueltos | [RF-LOG-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-005-entregas-parciales), [RF-LOG-019](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-019-entregas-acumulables), [RF-LOG-020](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-020-pod-firmas), [RA-LOG-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-004-cierre-ordenes) | Hay eventos de entrega; entregas acumulables, POD, devolución y conciliación de saldos requieren completar requisitos y decisiones. |
| 12. Quién realizó cada operación | [RF-AUD-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-001-consulta-auditoria), [RF-AUD-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-auditoria-rf-aud-004-payload-auditoria), [RF-LOG-016](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-016-cadena-custodia), [RF-TRA-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-trazabilidad-rf-tra-001-cadena-servicio) | Hay auditoría y eventos con responsables en distintos módulos; esquema before/after, custodia y consulta transversal siguen parciales. |

#### Cruce documental — Documentos generados del anexo §7

| Documento del anexo | Requisitos asociados | Hallazgo documental actual |
|---|---|---|
| Cotizaciones | [RF-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-007-emitir-documentos), [RA-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-007-reconstruccion-pdf-historico) | PDF/snapshot/hash implementados; política para reconstruir históricos sin snapshot pendiente. |
| Órdenes de servicio | [RF-LOG-022](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-022-inmutabilidad-documentos) | Se genera orden PDF y se persiste snapshot/hash; idempotencia y recuperación histórica pendientes. |
| Actas de recepción | [RF-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-002-recepciones), [RF-LOG-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-010-items-recepcion), [RF-LOG-023](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-023-acta-recepcion), [RA-LOG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-log-002-notificacion-parciales) | Se registra una cabecera de recepción; no se identificó un acta generada específica ni detalle persistido por el servicio. El Acta de Servicio actual es otro documento. |
| Órdenes de esterilización | [RF-PLA-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-002-creacion-ciclos), [RF-PLA-017](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-planta-rf-pla-017-orden-esterilizacion-documento), [RA-PLA-010](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-pla-010-alcance-orden-esterilizacion) | Se registra el ciclo operativo; no se identificó generación/conservación de la orden documental. Su contenido y momento de emisión están pendientes. |
| Certificados de esterilización | [RF-CER-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-001-emision-certificados), [RF-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-002-identificacion-materiales), [RF-CER-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-003-versionado-anulacion), [RF-CER-004](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-004-certificados-ciclos-compartidos), [RF-CER-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-005-cantidades-procesadas), [RF-CER-006](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-006-flujo-anulacion), [RF-CER-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-007-historial-versiones), [RA-CER-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-cer-002-politicas-reemplazo) | Emisión PDF/snapshot documentada; ciclos compartidos, cantidades, anulaciones y versiones siguen en requisitos derivados. |
| Documentos de revisión y aprobación | [RF-COM-005](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-005-revision-aprobacion), [RF-CAL-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-001-evaluacion-ciclos), [RF-CAL-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-calidad-rf-cal-002-aprobacion-materiales), [RNF-SEG-002](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-seguridad-rnf-seg-002-sesiones-operaciones-criticas) | Acciones/decisiones se registran en los módulos; el anexo no define si requiere un artefacto independiente firmado. La evidencia jurídica queda en [RA-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-seg-001-evidencia-legal-firmas). |
| Solicitudes de anulación | [RF-COM-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-008-anulaciones), [RA-COM-008](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-com-008-politicas-anulacion) | Solicitud y resolución tienen flujo; política de observaciones y conservación se mantiene abierta. |
| PDFs con datos congelados y evidencias de firmas/autorizaciones | [RF-COM-007](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-comercial-rf-com-007-emitir-documentos), [RF-LOG-022](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-logistica-rf-log-022-inmutabilidad-documentos), [RF-CER-003](./REQUISITOS_Y_REGLAS.md#doc-requisitos-backend-certificados-rf-cer-003-versionado-anulacion), [RA-SEG-001](./REQUISITOS_Y_REGLAS.md#doc-requisitos-por-aclarar-ra-seg-001-evidencia-legal-firmas) | Se documentan capacidades actuales y brechas por dominio; alcance jurídico, evidencia y conservación no se presumen definidos.

