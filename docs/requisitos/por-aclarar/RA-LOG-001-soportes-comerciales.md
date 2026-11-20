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

# RA-LOG-001 — Soportes comerciales para creación de órdenes

**Pregunta de negocio:** Cuando no se dispone de una Orden de Compra del cliente, ¿qué forma debe tener la autorización explícita del Jefe de Área y qué datos/evidencias deben conservarse para permitir crear la orden?

## Contexto

La respuesta 47 del Módulo 4 de `docs/negocio/reglas-maestras.md` define dos alternativas: Orden de Compra del cliente **o** autorización explícita del Jefe de Área. `LogisticaService.createOrden` actualmente exige `orden_compra_cliente` como texto no vacío; el DTO no modela un tipo de soporte alternativo ni datos de autorización separados.

## Opciones para decisión

- **Solo OC:** mantener la OC como condición obligatoria y revisar la regla de negocio para retirar o limitar la alternativa de autorización.
- **OC o autorización registrada:** permitir ambas alternativas y guardar tipo de soporte, autorizador, fecha, motivo y referencia documental.
- **OC o evidencia adjunta:** aceptar autorización solo con soporte documental adjunto y definir quién puede cargarla y consultarla.

## Impacto

La decisión determina los campos, permisos, evidencia y validaciones al crear una orden. También evita registrar una autorización verbal como si fuera número de orden de compra.

## Requisito y brecha afectados

`RN-LOG-001` conserva cobertura Parcial. `B-LOG-003` permanece abierta y se reasigna a esta decisión. No se cambia el código hasta que se valide una alternativa.
