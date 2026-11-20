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

# RA-COM-008 — Políticas de resolución de anulaciones

**Preguntas de negocio:** ¿Debe exigirse una observación al aprobar o rechazar una solicitud de anulación? Si una solicitud se rechaza, ¿la cotización aprobada vuelve a quedar disponible para emisión cuando cumpla las demás reglas comerciales?

## Contexto

El DTO y el servicio exigen motivo no vacío al solicitar la anulación. La observación de resolución debe ser texto, pero puede quedar vacía. Una resolución rechazada guarda estado, aprobador, fecha y observación; no cambia el estado de la cotización. La emisión durante una solicitud pendiente queda bloqueada por `RF-COM-014`; esta decisión abierta se refiere al comportamiento una vez rechazada.

## Opciones e impacto

- **Observación obligatoria para ambas decisiones:** requiere justificar aprobación y rechazo; facilita interpretar la decisión y responder consultas posteriores.
- **Obligatoria solo para rechazo:** documenta el motivo de denegación y permite aprobar sin texto adicional.
- **Opcional para ambas decisiones:** conserva el campo sin imponer contenido; puede limitar la explicación disponible en la trazabilidad.

Para solicitudes rechazadas, confirmar si la cotización aprobada queda habilitada para emisión una vez que el estado de la solicitud ya no sea pendiente, o si requiere una acción adicional. El bloqueo mientras está pendiente ya se definió para `RF-COM-014`.

## Requisito afectado

`RF-COM-008` conserva cobertura Parcial. `B-008-03` queda abierta hasta decisión explícita; esta ficha no cambia permisos ni estados.
