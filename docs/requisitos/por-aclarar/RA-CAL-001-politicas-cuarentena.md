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

# RA-CAL-001 — Políticas de cuarentena y destino de materiales rechazados

## Preguntas aún abiertas

La unidad de retención y la autoridad general de disposición están resueltas por D-CAL-001 y D-CAL-002. Quedan por definir: qué evaluación de riesgo adicional puede exigirse; qué evidencia y cierre CAPA se requieren por escenario; y qué autorización corresponde para «otro destino», además de la determinación de Calidad.

## Decisiones ya confirmadas

- Retener el lote afectado; retener el lote completo si no se pueden identificar con fiabilidad las unidades afectadas.
- Evaluar por separado los demás lotes; liberar lotes conformes antes del cierre de la investigación solo con autorización documentada del Jefe de Calidad.
- Calidad determina el destino del material rechazado; devolución o destrucción requieren constancia con responsable, fecha y evidencia.

## Impacto

La decisión afecta modelo de estados, cantidades despachables, emisión de certificados, investigación CAPA, permisos y trazabilidad de custodia. No debe asumirse que una aprobación del ciclo libera unidades rechazadas.

## Fuente de decisiones confirmadas

La unidad de retención, liberación parcial de lotes conformes y autoridad de Calidad para disposición están confirmadas en [D-CAL-001 y D-CAL-002](../decisiones/decisiones-negocio.md). Esta ficha conserva solo los aspectos aún abiertos; no vuelve a someter esas reglas a decisión.

## Alcance pendiente

La clasificación de impacto y el flujo técnico aún requieren definición; esta decisión queda parcialmente resuelta, no cerrada. Ver [D-CAL-001 y D-CAL-002](../decisiones/decisiones-negocio.md).
