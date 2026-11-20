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

# RA-LOG-004 — Criterios de cierre de órdenes y despachos parciales

**Preguntas aún abiertas:** ¿Cómo se concilian numéricamente entregas, devoluciones, reprocesos, certificados y cantidades liberadas? ¿Qué evidencia concreta exige cada destino final y qué certificado acompaña cada despacho parcial?

## Contexto

El anexo §3 requiere entregas parciales y finales. Las reglas activas exigen liberación de Calidad y certificado para despacho cuando corresponda, pero dejan pendiente el alcance de la liberación en despachos parciales. El backend solo dispone de estado final `ENTREGADO` y el flujo actual cierra la orden con un único evento.

## Regla de cierre confirmada y precisiones pendientes

- La orden solo se cierra cuando las cantidades aceptadas están liberadas y todo saldo restante tiene destino final registrado y evidencia exigida completa.
- El procesamiento por sí solo no cierra la orden.

Para despacho parcial siguen por definirse la relación entre cantidad liberada y cantidad certificada, la granularidad del certificado y las excepciones permitidas.

## Impacto

La decisión determina estados, cantidades de saldo, alertas, requisitos de certificado, permisos, facturación y métricas de cumplimiento. `RF-LOG-019` debe implementarse conforme a esta política.

## Referencia de decisión

Ver [D-LOG-001](../decisiones/decisiones-negocio.md). Esta RA queda parcialmente resuelta y no define el diseño de estados ni la conciliación técnica entre entregas, reprocesos, certificados y devoluciones. La regla de cierre está confirmada; las preguntas de conciliación, liberación/certificación por despacho parcial y evidencia concreta permanecen abiertas. La validación funcional del bloque de Logística continúa pendiente según la instrucción de incorporación de decisiones prioritarias.
