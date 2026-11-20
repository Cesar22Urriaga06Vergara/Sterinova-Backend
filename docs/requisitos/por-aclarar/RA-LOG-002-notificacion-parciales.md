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

# RA-LOG-002 — Políticas de evidencia y notificación en recepciones parciales

**Preguntas de negocio:** ¿Qué evidencia debe conservarse para cada recepción parcial o completa? ¿En qué momento y a qué rol/persona se notifica a Comercial sobre la cantidad faltante? ¿La notificación se repite por cada recepción parcial o solo ante determinados eventos? ¿Qué datos, firma y soportes requiere el acta de recepción listada en §7, y se emite por cada ingreso parcial o se consolida por orden?

## Contexto

La respuesta 48 del Módulo 4 pide fecha/hora, usuario receptor, sede de origen y evidencias (fotos o firma digital de quien entrega). La respuesta 49 pide notificar a Comercial cuando se recibe menos de lo esperado. El DTO de recepción permite evidencia opcional y el servicio no implementa notificación. §7 también enumera actas de recepción, pero no define contenido ni vínculo con recepciones parciales. La modalidad aceptable, destinatario, canal y política de reintentos no están definidos.

## Opciones para decisión

- **Evidencia obligatoria por evento:** definir tipos admitidos (foto, documento, firma digital), quién carga/valida y reglas de conservación.
- **Notificación inmediata por cada parcial:** informar a los responsables de Comercial al registrar cada diferencia, con orden, ítems y saldo pendiente.
- **Notificación por umbral o al cierre:** avisar solo si la diferencia supera una tolerancia definida o cuando se complete/rechace la recepción.
- **Bandeja interna y alertas:** registrar la novedad en el ERP y decidir si además se envían avisos externos.

## Impacto

La decisión determina obligatoriedad de campos, modelo de evidencias, roles destinatarios, canal, deduplicación y auditoría. No cambia la regla ya acordada de conservar el saldo parcial.

## Requisitos afectados

`RF-LOG-002` conserva cobertura Parcial. La persistencia y saldo se implementan en el borrador `RF-LOG-010`; la emisión documental se analiza en `RF-LOG-023`; esta decisión define evidencia, contenido del acta y notificación. No se modifica código hasta validar la política.
