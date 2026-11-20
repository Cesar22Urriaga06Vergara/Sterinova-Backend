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

# RF-COM-008 — Solicitar y gestionar anulaciones

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
