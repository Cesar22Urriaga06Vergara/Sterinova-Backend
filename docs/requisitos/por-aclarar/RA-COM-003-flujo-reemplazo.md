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

# RA-COM-003 — Flujo de reemplazo de cotizaciones emitidas

**Pregunta de negocio:** Cuando se debe corregir una cotización emitida, ¿se debe crear una nueva cotización vinculada a la original o emitir un documento anexo/de reemplazo relacionado con el original?

## Contexto

`Sterinova-ERP.md` §6 prohíbe modificar cotizaciones emitidas y exige nueva revisión o documento de reemplazo. El código bloquea la edición directa, pero en la evidencia revisada no aparece un flujo de reemplazo que vincule un nuevo documento con el emitido original.

## Opciones e impacto

- **Nueva cotización vinculada:** genera un nuevo registro y revisión comercial; requiere conservar relación explícita con el original y definir su estado/efecto.
- **Documento anexo o reemplazo vinculado:** conserva la cotización original y agrega evidencia formal de corrección; requiere definir el tipo documental, aprobación y relación entre documentos.

## Requisito afectado

`RF-COM-003` queda Cubierto para crear/editar borradores y bloquear edición directa de emitidas. `B-003-02` permanece abierta hasta decisión explícita.
