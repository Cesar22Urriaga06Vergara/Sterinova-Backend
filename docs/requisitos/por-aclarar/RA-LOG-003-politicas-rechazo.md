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

# RA-LOG-003 — Políticas de disposición de materiales rechazados

**Pregunta pendiente:** ¿Cómo coordina Logística con Calidad el rechazo inicial por daño/empaque, la evaluación del material y la ejecución de la disposición aprobada por Calidad? ¿Quién autoriza «otro destino» y qué registro adicional necesita cada salida?

## Contexto

El anexo pide rechazar materiales dañados y la respuesta 49 requiere motivo. Las reglas maestras indican que la secuencia de rechazo, devolución y acumulación de recepciones parciales todavía no está definida. El código permite marcar la cabecera de recepción como `RECHAZADO`, pero no registra rechazo por línea ni flujo de devolución/inventario.

## Decisiones ya confirmadas

La autoridad para determinar el destino corresponde a Calidad. Devolución y destrucción requieren constancia con responsable, fecha y evidencia. Siguen pendientes la autorización para «otro destino», el procedimiento de entrega/recepción de custodia y las notificaciones a Comercial y al cliente.

## Alternativas de flujo no decididas

Devolución inmediata, cuarentena previa, rechazo parcial con continuación o rechazo total son alternativas que requieren una decisión operativa; la regla confirmada sobre autoridad de Calidad no selecciona por sí sola una de ellas.

## Impacto

La decisión determina estados por línea, permisos, impacto en cantidades disponibles para Planta, devolución, evidencia y notificaciones. El borrador `RF-LOG-013` puede modelar el rechazo, pero no debe asumir el destino sin esta decisión.

## Referencia de decisión

Ver [D-CAL-002](../decisiones/decisiones-negocio.md): Calidad determina el destino; devolución y destrucción requieren constancia con responsable, fecha y evidencia. La RA no reabre esa autoridad. Siguen por decidir la secuencia de rechazo logístico, cuarentena previa, rechazo parcial/total, custodios y quién autoriza «otro destino». El impacto en inventario y cantidades disponibles se coordina con `RF-LOG-010`, `RF-LOG-012` y `RF-CAL-006` y no queda definido por esta decisión.
