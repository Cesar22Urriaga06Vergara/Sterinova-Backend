---
id: RA-PLA-006
titulo: Políticas de reprocesos y material rechazado
tipo: RA
modulo: Planta / Calidad / Logística
estado: parcialmente_resuelta
certeza: parcial
version: 1.1
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 68–69"
fuente_contraste: "decisiones-prioridad-1-calidad-planta-logistica.md; RF-PLA-003; RF-PLA-011; src/planta/; src/calidad/"
depende_de: [RF-PLA-011]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-PLA-003 para definir saldo, autorización y disposición durante reprocesos."
  - version: 1.1
    nota: "Se incorpora D-PLA-001: aprobación previa de Calidad y Planta, ciclo nuevo vinculado al original y disposición documentada por Calidad para ciclos abortados. Saldo exacto y carga abortada parcialmente siguen abiertos."
---

# RA-PLA-006 — Políticas de reprocesos y material rechazado

## Preguntas aún abiertas para Planta, Calidad y Logística

1. Cuando se rechaza o aborta un ciclo, ¿qué cantidad exacta vuelve al saldo procesable, en particular si solo una parte de la carga fue procesada?
2. ¿Qué motivo y evidencia deben registrarse para cada disposición y aprobación?
3. ¿Cómo se reflejan liberación, devolución, destrucción o reproceso en inventario, cantidades logísticas, certificados y entregas parciales?
4. ¿Qué estado conserva la orden mientras quedan cantidades retenidas o con disposición pendiente?

## Contexto

Las reglas exigen preservar el ciclo fallido y crear uno nuevo vinculado. El backend acumula cantidades rechazadas como procesadas y no dispone de flujo conectado para `ciclo_correccion_de_id`; definir la regla de negocio precede el detalle técnico.

## Decisiones ya confirmadas

Calidad y Planta aprueban el reproceso antes de su creación; se crea un ciclo nuevo vinculado al rechazado/original. Para ciclos abortados, Calidad determina y documenta la disposición; el aborto no libera automáticamente el material. Ver [D-PLA-001](../decisiones/decisiones-negocio.md). La definición de saldo y el tratamiento de carga abortada parcialmente continúan pendientes. La decisión confirma el flujo de autorización y vínculo, pero no la cantidad que vuelve al saldo procesable ni la conciliación con Logística, certificados y entregas.
