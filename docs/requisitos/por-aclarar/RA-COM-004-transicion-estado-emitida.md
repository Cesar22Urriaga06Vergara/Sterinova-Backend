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

# RA-COM-004 — Transición de estado a EMITIDA

**Pregunta técnica/de negocio:** Al completar la emisión, ¿debe el sistema asignar formalmente `EstadoCotizacion.EMITIDA`, o es suficiente conservar el estado previo aprobado y usar `fecha_emision` como bandera de emisión?

## Contexto

El enum de estados contiene `EMITIDA`. El método de emisión inspeccionado guarda `fecha_emision`, snapshot y PDF, pero no asigna explícitamente `EMITIDA`. La edición directa sí se bloquea usando tanto la fecha como el estado. Se requiere decidir cuál es el contrato de estado para otros consumidores y reportes.

## Opciones e impacto

- **Cambiar el estado a `EMITIDA`:** alinea el campo de estado con el flujo declarado; requiere revisar consumidores, persistencia y compatibilidad histórica.
- **Mantener `fecha_emision` como indicador suficiente:** evita transición explícita; los consumidores deberán usar la fecha para distinguir emitidas de aprobadas sin emitir.

## Requisito afectado

`RF-COM-003` queda Cubierto en su núcleo transaccional; `B-003-04` permanece abierta hasta que el equipo decida el contrato.
