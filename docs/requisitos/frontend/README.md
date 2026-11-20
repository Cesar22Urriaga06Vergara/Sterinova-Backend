# Análisis de requisitos frontend

`Sterinova-ERP.md` es la fuente contractual. Esta matriz describe la cobertura visible en SterinovaFrontend y enlaza requisitos y brechas backend existentes; no sustituye la autorización del API ni acredita operación en producción.

## Método y estado

- La matriz registra una fila por requisito contractual aplicable y separa cobertura frontend de cobertura backend.
- Se reutilizan los IDs del análisis backend cuando el requisito es compartido. No se abren fichas paralelas para las brechas ya registradas.
- Las fichas detalladas de 16 campos se crearán solo para requisitos frontend parciales, faltantes o ambiguos que no tengan ficha o brecha equivalente.
- Los bloques se analizan y presentan por módulo. Se documenta cada bloque después de su validación por el usuario.
- Las pruebas frontend revisadas usan API simulada, salvo que una fila indique lo contrario. No son verificación del recorrido contra backend o producción.

**Estado:** Comercial y Cotizaciones conserva su validación del 20 de noviembre de 2026. Logística, Planta, Calidad, Certificados, Usuarios/Auditoría, Seguridad y Trazabilidad se contrastaron con el código frontend y backend el 20 de noviembre de 2026; el análisis técnico queda pendiente de validación funcional por módulo. La evidencia de pruebas E2E existente usa API simulada y no demuestra integración en vivo.

## Comercial y Cotizaciones

**Fuente:** `Sterinova-ERP.md` §§3–7.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-COM-001](../backend/comercial/RF-COM-001-clientes.md), §3 | Consultar, crear y editar clientes | Listado, modal de alta/edición y selección de cliente en cotización. | Cubierto para consulta, alta y edición. | Backend: cubierto. La activación/inactivación de clientes no está exigida explícitamente por el anexo; se anota abajo como observación de integración. |
| [RF-COM-009](../backend/comercial/RF-COM-009-importacion-clientes.md), §3 | Importar clientes | Carga `.xlsx`/`.xls`, mapeo de encabezados, validación de razón social/NIT y resumen de importados/omitidos. | UI de importación disponible; el proceso integral depende del contrato y tratamiento de duplicados en API. | `B-001-02` abierta para normalización, conciliación y conflictos. |
| [RF-COM-002](../backend/comercial/RF-COM-002-productos-servicios.md), §3 | Gestionar catálogo de productos y servicios | CRUD de referencias y búsqueda de catálogo desde cotización; también se admiten ítems manuales. | Cubierto en interfaz. | Backend: cubierto según ficha vigente. |
| [RF-COM-003](../backend/comercial/RF-COM-003-cotizaciones-crud.md), §3 | Crear y editar cotizaciones con varios ítems | Selector de cliente/tipo, múltiples líneas, catálogo e ítems manuales; edición de borrador con control de versión. | Cubierto para borradores y varias líneas. La emisión no permite edición directa desde UI. | Backend: cubierto para el alcance base. Descuentos se separan en `B-003-03`; el flujo de reemplazo emitido permanece en `RA-COM-003`. |
| [RF-COM-004](../backend/comercial/RF-COM-004-condiciones-vigencia.md), §3 | Gestionar precios y condiciones, incluida vigencia | Precio unitario por línea y campos para transporte, forma de pago, vigencia y otras condiciones. | Parcial: la vigencia es texto libre; no hay indicador o control temporal de expiración. | Backend parcial; `B-004-01` está derivada a [RF-COM-011](../backend/comercial/RF-COM-011-vigencia-oferta.md), borrador pendiente de validación. |
| [RF-COM-010](../backend/comercial/RF-COM-010-descuentos-cotizaciones.md), §3 | Aplicar descuentos por ítem | No se encontró campo ni cálculo de descuento en el formulario/tipo frontend. | Faltante. | `B-003-03` está derivada a [RF-COM-010](../backend/comercial/RF-COM-010-descuentos-cotizaciones.md), borrador pendiente de validación. |
| [RF-COM-005](../backend/comercial/RF-COM-005-revision-aprobacion.md), §3–4 | Revisar y aprobar cotizaciones | Acción de aprobar borradores, oculta al creador; no hay acción visible de paso a revisión ni confirmación por contraseña en aprobación comercial. | Parcial: aprobación presente, etapa previa de revisión y confirmación adicional no visibles. | `B-005-02` está derivada a [RF-COM-012](../backend/comercial/RF-COM-012-paso-revision.md); `B-005-03` está consolidada en [RNF-SEG-002](../backend/seguridad/RNF-SEG-002-sesiones-operaciones-criticas.md). Ambos destinos están pendientes de validación/decisión de alcance. |
| [RF-COM-012](../backend/comercial/RF-COM-012-paso-revision.md), §3 | Transicionar cotización a `EN_REVISION` | No se encontró acción para enviar un borrador a revisión. | Faltante. | Vinculado a `B-005-02`; ficha backend derivada pendiente de validación. |
| [RF-COM-006](../backend/comercial/RF-COM-006-envio-aceptacion.md), §3, §6 | Enviar propuesta y registrar aceptación | Hay acción “Enviar al Cliente”; no hay acción/pantalla para registrar aceptación. El envío apunta a `/cotizaciones/:id/enviar`. | Parcial: acción de envío desconectada del API actual y aceptación ausente. | Envío y registro de aceptación (`B-006-01`, `B-006-02`) están derivados a [RF-COM-013](../backend/comercial/RF-COM-013-implementar-envio-aceptacion.md); evidencia aceptada (`B-006-03`) está en [RA-COM-006](../por-aclarar/RA-COM-006-evidencia-aceptacion.md). |
| [RF-COM-013](../backend/comercial/RF-COM-013-implementar-envio-aceptacion.md), §3, §6 | Implementar flujo de envío y aceptación | La UI presenta envío, pero no aceptación; permite también emitir desde cotización aprobada sin aceptación registrada. | Faltante para el flujo contractual completo. | `B-006-01`, `B-006-02` y `B-006-04` están derivadas a este borrador pendiente de validación. `B-006-03` corresponde a la decisión [RA-COM-006](../por-aclarar/RA-COM-006-evidencia-aceptacion.md). |
| [RF-COM-007](../backend/comercial/RF-COM-007-emitir-documentos.md), §3, §7 | Generar y conservar documentos comerciales | Vista previa del borrador y descarga del PDF oficial; no expone edición de cotización emitida. | Cubierto en interfaz para vista previa/descarga; la conservación histórica depende del backend. | Backend parcial; la política de PDFs históricos `B-007-01` se deriva a [RA-COM-007](../por-aclarar/RA-COM-007-reconstruccion-pdf-historico.md). |
| [RF-COM-008](../backend/comercial/RF-COM-008-anulaciones.md), §3 | Solicitar y resolver anulaciones | Modal exige motivo; bandeja permite aprobar o rechazar, y exige observación para rechazo. | Cubierto en UI para solicitar y resolver. | Backend parcial; `B-008-02` está derivada a [RF-AUD-002](../backend/auditoria/RF-AUD-002-atomicidad-auditoria.md) y `B-008-03` a [RA-COM-008](../por-aclarar/RA-COM-008-politicas-anulacion.md). |
| [RF-COM-014](../backend/comercial/RF-COM-014-bloqueo-emision-anulacion.md), §6 | Impedir emisión durante anulación pendiente | La lista no presenta estado de solicitud pendiente; una cotización aprobada puede conservar la acción de emitir. | No cubierto como control visual; la condición tampoco está expuesta por el modelo listado. | `B-008-01` está derivada a este borrador pendiente de validación; el bloqueo definitivo corresponde al backend. |
| [RNF-SEG-002](../backend/seguridad/RNF-SEG-002-sesiones-operaciones-criticas.md), §3–4 | Confirmar aprobaciones críticas mediante contraseña | La aprobación comercial no muestra confirmación adicional de contraseña. | Parcial para aprobación comercial. | `B-005-03` está asignada a este requisito; la lista de operaciones críticas y el control de API requieren validación. |

## Logística

**Fuente:** `Sterinova-ERP.md` §§3, 5–6.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RN-LOG-001](../backend/logistica/RN-LOG-001-creacion-ordenes.md), §3, §6 | Crear órdenes a partir de cotizaciones aceptadas | El tablero consume `/logistica/cotizaciones-aprobadas` y permite crear una orden desde la selección; el servicio del backend filtra cotizaciones `ACEPTADA_CLIENTE`. Los materiales se ingresan manualmente, no se precargan desde la cotización. | Parcial: selección y alta presentes; falta precarga/vínculo visible de líneas. | `B-LOG-001` → `RF-LOG-006`; `B-LOG-002` → `RF-LOG-007`; soporte comercial alternativo en `RA-LOG-001`. |
| [RF-LOG-001](../backend/logistica/RF-LOG-001-recogidas-rutas.md), §3 | Registrar recogidas, rutas y llegadas directas | La pantalla recorre estados fijos `PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA`; el modal registra responsable, transportista, persona que entrega/recibe, observaciones y cantidades. No hay pantalla de rutas compartidas ni transición directa desde pendiente a llegada directa. | Parcial. | `B-LOG-004` → `RF-LOG-008`; `B-LOG-005` permanece pendiente frontend; `B-LOG-006` → `RF-LOG-009`. |
| [RF-LOG-002](../backend/logistica/RF-LOG-002-recepciones.md), §3 | Registrar recepción completa o parcial | `MaterialesEditor` permite varias líneas con descripción, referencia, lote, empaque y cantidad. Lote y empaque son opcionales; no hay saldo de recepción parcial ni vista de líneas recibidas por entrega separada. | Parcial: captura inicial disponible; flujo de recepción y conciliación incompleto. | `B-LOG-007`, `B-LOG-008`, `B-LOG-011` → `RF-LOG-010`; `B-LOG-009` → `RF-LOG-011`; `B-LOG-010`/`012` → `RF-LOG-012`; evidencia/notificación en `RA-LOG-002`. |
| [RN-LOG-002](../backend/logistica/RN-LOG-002-no-reasignacion.md), §6 | Evitar reasignar material recibido | La UI opera sobre materiales vinculados a una orden y no ofrece una acción para reasignar material entre órdenes/ciclos. | Parcial: no hay reasignación visible; el control definitivo corresponde al API y a los saldos persistidos. | `B-LOG-013` → `RF-PLA-006`. |
| [RF-LOG-003](../backend/logistica/RF-LOG-003-novedades-custodia.md), §3, §5 | Registrar novedades, rechazos y custodia | El modal de evento guarda observación y nombres de responsables como texto; no hay formulario de rechazo por línea, expediente de novedades ni carga de evidencia fotográfica/documental. | Parcial. | `B-LOG-014`–`017` → `RF-LOG-013`–`016`; las políticas de disposición se relacionan con `RA-LOG-003`. |
| [RF-LOG-004](../backend/logistica/RF-LOG-004-transferencia-planta.md), §3, §5 | Transferir materiales a Planta | Logística puede marcar `EN_PLANTA` y registrar `recibido_por` como texto libre. Planta consulta órdenes y materiales de orden; no hay confirmación de recepción desde una cuenta de Planta ni acta de traspaso en esta ruta. | Parcial. | `B-LOG-018` → `RF-LOG-017`; `B-LOG-019` → `RF-LOG-018`; inventario/microbodega en `RA-PLA-003`. |
| [RF-LOG-005](../backend/logistica/RF-LOG-005-entregas-parciales.md), §3 | Registrar entregas parciales y finales | El evento de entrega captura cantidades y cajas por material, pero el recorrido de UI solo ofrece una transición a `ENTREGADO`; no muestra saldo acumulado, firma ni adjunto POD. | Parcial. | `B-LOG-021`–`023` → `RF-LOG-019`–`021`; criterios de cierre en `RA-LOG-004`. |

## Planta

**Fuente:** `Sterinova-ERP.md` §§3, 5–6.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-PLA-001](../backend/planta/RF-PLA-001-equipos-disponibilidad.md), §3, §6 | Registrar equipos y disponibilidad | El formulario de ciclo recibe el equipo en un campo de texto. No hay catálogo de equipos, disponibilidad, mantenimiento ni validación de capacidad en la interfaz. | Parcial. | `B-PLA-001`–`003` → `RF-PLA-007`–`009`; políticas en `RA-PLA-004`. |
| [RF-PLA-002](../backend/planta/RF-PLA-002-creacion-ciclos.md), [RF-PLA-003](../backend/planta/RF-PLA-003-distribucion-cantidades.md), §3, §6 | Crear ciclos y distribuir materiales | La pantalla crea un ciclo asociado a una sola `orden_id`, muestra sus materiales y captura cantidades por línea acotadas por el valor recibido de la orden. No permite seleccionar varias órdenes ni tiene flujo UI de reproceso vinculado. | Parcial. | Multiorden en `RF-PLA-006`; saldo/reproceso en `RF-PLA-011`; control contra recepciones reales en `RF-LOG-012`. |
| [RF-PLA-004](../backend/planta/RF-PLA-004-parametros-protocolos.md), §3, §5 | Registrar parámetros, evidencias y protocolos | El formulario captura mediciones numéricas y controles biológico/químico; muestra la versión del protocolo que se enviará con el ciclo. No hay carga de archivos para gráficos/evidencias ni justificación visible de `NO_APLICA`. | Parcial. | `B-PLA-006` → `RF-PLA-012`; `B-PLA-007` → `RF-PLA-013`; políticas en `RA-PLA-007`. |
| [RF-PLA-005](../backend/planta/RF-PLA-005-tandas-recetas.md), §3, §8 | Registrar tandas, reprocesos, recetas e insumos | Se consulta historial de ciclos y se registra un ciclo individual. No se encontró UI de Tanda, receta, microbodega, consumo de insumos ni creación de reproceso. | Faltante para las capacidades derivadas. | `B-PLA-008` → `RF-PLA-014`; recetas/insumos siguen en `RA-PLA-008`, coordinada con `RA-PLA-003`. |
| [RN-PLA-001](../backend/planta/RN-PLA-001-metodo-contratado.md), [RN-PLA-002](../backend/planta/RN-PLA-002-no-sobrescribir.md), §6 | Respetar método contratado y no sobrescribir ciclos aprobados | El método queda deshabilitado en la pantalla cuando la orden ya tiene método. No se observó una acción de editar ciclo aprobado en la interfaz. | Parcial; la protección final es del backend. | Anclaje contractual del método en `RF-PLA-015`; hardening de inmutabilidad en `RF-PLA-016`. |

## Calidad

**Fuente:** `Sterinova-ERP.md` §§3–6.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-CAL-001](../backend/calidad/RF-CAL-001-evaluacion-ciclos.md), §3 | Evaluar ciclos según parámetros/protocolos | La pantalla muestra valores medidos y filas del protocolo; el revisor elige manualmente especificación y criterio. No presenta una sugerencia automática previa. | Parcial. | `B-CAL-001` → `RF-CAL-005`; la validación de rangos en aprobación es backend. |
| [RF-CAL-002](../backend/calidad/RF-CAL-002-aprobacion-materiales.md), [RN-CAL-001](../backend/calidad/RN-CAL-001-bloqueo-despacho.md), §3, §6 | Aprobar/rechazar ciclos antes del despacho | La bandeja muestra ciclos pendientes; permite aprobar y emitir certificado o rechazar con motivo. La confirmación de aprobación pide contraseña. No hay cuarentena o disposición por lote, liberación parcial ni vista de CAPA. | Parcial. | `B-CAL-002` → `RF-CAL-006` y `RA-CAL-001`; bypass de órdenes sin método en `RF-CAL-007`. |
| [RF-CAL-003](../backend/calidad/RF-CAL-003-desviaciones-capa.md), [RF-CAL-004](../backend/calidad/RF-CAL-004-liberacion-excepcion.md), §3 | Gestionar desviaciones/CAPA y liberaciones excepcionales | No se encontraron pantallas de CAPA, investigación, plan de acciones ni liberación por excepción. | Faltante. | `B-CAL-004`/`005` → `RF-CAL-008`/`009` y `RA-CAL-002`; `B-CAL-006` → `RF-CAL-010` y `RA-CAL-003`. |

## Certificados

**Fuente:** `Sterinova-ERP.md` §§3, 5–7.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-CER-001](../backend/certificados/RF-CER-001-emision-certificados.md), [RF-CER-002](../backend/certificados/RF-CER-002-identificacion-materiales.md), §3, §5, §7 | Emitir certificados e identificar materiales/ciclos | Calidad lista certificados y ofrece vista/descarga PDF oficial. El flujo de aprobación emite desde el ciclo y muestra el cliente derivado de su orden; no hay selección/partición de varios clientes dentro de un ciclo. | Parcial. | `B-CER-001`/`002` → `RF-CER-004`/`005`; políticas en `RA-CER-001`. |
| [RF-CER-003](../backend/certificados/RF-CER-003-versionado-anulacion.md), [RN-CER-001](../backend/certificados/RN-CER-001-ciclos-compartidos.md), §3, §7 | Conservar versiones y anular sin borrar original | La vista renderiza y descarga PDF del certificado actual. No hay UI de anulación, reemplazo vinculado ni selector de versiones anteriores. | Parcial. | `B-CER-003`/`004` → `RF-CER-006`/`007`; políticas en `RA-CER-002`. |

## Usuarios, administración y auditoría

**Fuente:** `Sterinova-ERP.md` §§3–5.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RF-USR-001](../backend/usuarios/RF-USR-001-administracion-usuarios.md), [RF-USR-002](../backend/usuarios/RF-USR-002-roles-ambitos.md), §3 | Administrar usuarios, varios roles y ámbitos | UI de usuarios permite alta/edición, activar/desactivar, restablecimiento y asignaciones múltiples rol-ámbito. | Parcial/cubierto en las operaciones expuestas. | `B-USR-001` → `RF-AUD-003`; la política de roles por planta está en `RA-USR-001`. |
| [RF-USR-003](../backend/usuarios/RF-USR-003-administracion-areas.md), §3 | Administrar áreas, roles y permisos | La pantalla de administración permite consultar roles/ámbitos y asignar/quitar asignaciones; no crea áreas, roles ni permisos. | Parcial. | `B-USR-002` → `RA-USR-002`; `B-USR-003` → `RF-USR-004`. |
| [RF-AUD-001](../backend/auditoria/RF-AUD-001-consulta-auditoria.md), §3, §5 | Consultar operaciones y cambios | La página intenta cargar eventos y filtra entidad/acción; no expone filtros de fecha, usuario o página. El cliente espera un arreglo plano, mientras que el servicio backend devuelve un sobre `{data,total,page,limit,totalPages}`. | Incompatibilidad de contrato observada: el componente recibe un objeto y luego lo usa como arreglo, por lo que la vista puede fallar al filtrar/renderizar. | `B-AUD-001` → `RF-AUD-004`; nueva brecha de integración `B-AUD-002` asignada a `RF-AUD-001`. |

## Seguridad y trazabilidad

**Fuente:** `Sterinova-ERP.md` §§4–5.

| ID / fuente | Requisito | Evidencia en frontend | Cobertura frontend | Backend y brechas relacionadas |
|---|---|---|---|---|
| [RNF-SEG-001](../backend/seguridad/RNF-SEG-001-autorizacion-ambito.md), §4 | Validar autorización y ámbito | Sesión consulta `/auth/me`; navegación oculta rutas según permisos y selecciona ámbito enviando `x-scope-id`. Son controles de UX y no sustituyen guards del API. | Parcial; se observó autorización de ruta/interfaz, no una verificación exhaustiva de cada control visual. | `B-SEG-001`: inventariar rutas y ámbito de recursos; incluye revisión estática de descarga logística y confirmación de exposición de `/health/ready`. |
| [RNF-SEG-002](../backend/seguridad/RNF-SEG-002-sesiones-operaciones-criticas.md), §4 | Proteger sesiones y operaciones críticas | El token de acceso se guarda en `localStorage`; respuesta 401 elimina el token y redirige a login. No hay flujo frontend de refresh token. La aprobación de Calidad pide contraseña; la aprobación comercial no muestra reautenticación. | Parcial. | `B-005-03` se consolida en `RNF-SEG-002`; confirmar lista de operaciones críticas antes de extender el control. |
| [RF-TRA-001](../backend/trazabilidad/RF-TRA-001-cadena-servicio.md), §5 | Reconstruir cadena cliente–cotización–operación–certificado–entrega | Logística, Planta, Calidad y Certificados tienen pantallas separadas; no se encontró una vista de historial integral ni un recorrido que enlace los doce hitos. | Faltante como vista transversal. | `B-TRA-001`: consulta de trazabilidad integral pendiente; debe respetar ámbitos y cubrir estados parciales, rechazos y devoluciones. |

## Documentos generados (§7)

| Documento | Evidencia en frontend | Cobertura frontend | Requisito/observación |
|---|---|---|---|
| Orden de servicio y Acta de Servicio | Logística previsualiza/descarga ambos documentos mediante `GET /logistica/ordenes/:id/pdf?tipo=orden|acta`; cada acción solicita la generación del PDF. | UI disponible; recuperación histórica e idempotencia pendientes. | [RF-LOG-022](../backend/logistica/RF-LOG-022-inmutabilidad-documentos.md), `B-LOG-024`. |
| Acta de recepción de materiales | La UI registra eventos/recepción operativa, pero no expone generación de un acta de recepción; el Acta de Servicio es otro artefacto. | No identificada. | [RF-LOG-023](../backend/logistica/RF-LOG-023-acta-recepcion.md), `B-LOG-025`; evidencia y contenido en `RA-LOG-002`. |
| Orden de esterilización | Planta crea y consulta ciclos; no se encontró acción de emisión/descarga de una orden documental del ciclo. | No identificada. | [RF-PLA-017](../backend/planta/RF-PLA-017-orden-esterilizacion-documento.md), `B-PLA-012`; contenido pendiente en [RA-PLA-010](../por-aclarar/RA-PLA-010-alcance-orden-esterilizacion.md). |
| Certificado de esterilización | Calidad permite listar, ver y descargar el PDF oficial del certificado. | Disponible; separación multi-cliente, historial de versiones y anulación no están expuestos. | [RF-CER-001](../backend/certificados/RF-CER-001-emision-certificados.md), [RF-CER-003](../backend/certificados/RF-CER-003-versionado-anulacion.md). |
| Revisiones, aprobaciones y solicitudes de anulación | Las pantallas de Comercial/Calidad muestran acciones de aprobación, rechazo o solicitud; no se observó un artefacto documental independiente para cada decisión. | Flujo visible en parte; documento/firma independiente no definido. | Fichas del dominio; el alcance de firma jurídica se deriva a [RA-SEG-001](../por-aclarar/RA-SEG-001-evidencia-legal-firmas.md). |

## Límites de esta revisión

- El anexo `Sterinova-ERP.md` sigue siendo la fuente contractual; la UI se evaluó frente al anexo y se contrastó con las rutas backend citadas.
- No se inspeccionó una sesión real ni se probó contra una instancia desplegada.
- Los E2E existentes interceptan/mockean la API; no validan la integración real. No se ejecutaron pruebas en esta actualización documental.
- Las brechas describen diferencias observadas; la cobertura backend conserva el estado de sus fichas y no se marca como implementada por existir una pantalla.

### Observación de integración fuera del alcance contractual

La pantalla de clientes cambia el estado mediante `PATCH /clientes/:id`, pero el controlador backend revisado expone actualización por `PUT /clientes/:id` y no define una ruta `PATCH`. El anexo no requiere explícitamente activar/inactivar clientes. Además, la UI muestra el botón si existe cualquiera de los permisos de activar o inactivar, y el estado vacío presenta “Crear cliente” sin filtrar por permiso. Se conserva como observación técnica, no como brecha contractual ni como cambio aprobado.

### Evidencia revisada

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

### Pruebas existentes consultadas

Las pruebas E2E existentes incluyen `comercial-flow.spec.ts`, `quote-edit.spec.ts`, `solicitudes-anulacion.spec.ts`, `calidad-flow.spec.ts`, `certificate-materials.spec.ts`, `hito4-operational.spec.ts` y `rbac-quotes.spec.ts`. La matriz no las ejecutó en esta actualización. Los escenarios comerciales descritos en la revisión previa interceptan/mockean la API; no se presume aquí que todos los demás E2E usen la misma estrategia. Ninguna prueba se usó como evidencia de integración real ni para verificar el contrato de paginación de Auditoría.
