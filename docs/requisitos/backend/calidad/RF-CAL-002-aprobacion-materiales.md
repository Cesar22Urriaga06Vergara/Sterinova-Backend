---
id: RF-CAL-002
titulo: Aprobar, rechazar o retener materiales
tipo: RF
modulo: Calidad / Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 70, 76–79; src/calidad/; src/planta/; src/logistica/"
depende_de: [RF-CAL-001, RF-LOG-005]
bloquea: [RF-CAL-006, RA-CAL-001, RF-CAL-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CAL-002 se deriva a RF-CAL-006 y RA-CAL-001; B-CAL-003 a RF-CAL-007."
---

# RF-CAL-002 — Aprobar, rechazar o retener materiales

**Fuente principal:** `Sterinova-ERP.md` §3 (aprobación/rechazo, cuarentena y evidencias) y §6 (Calidad aprueba antes del despacho).

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 70, 76–79; servicios y entidades de Calidad, Planta y Logística.

1. **ID:** `RF-CAL-002`.
2. **Título:** Aprobar, rechazar o retener materiales.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Logística.
5. **Descripción funcional:** Calidad registra aprobación o rechazo de ciclos y materiales; mantiene en cuarentena lo pendiente de resultados aplicables, identifica unidades rechazadas y determina su disposición sin permitir despacho ordinario antes de la liberación.
6. **Reglas asociadas:** No equiparar ciclo procesado con liberación. El rechazo debe tener motivo y evidencia, iniciar investigación CAPA y definir destino (devolución, reproceso o destrucción); material rechazado no se certifica como liberado. Excepciones requieren autorización documentada según política aplicable.
7. **Actores y permisos:** Calidad con `calidad.aprobar`/`calidad.rechazar`; Logística ejecuta despacho bajo las restricciones de liberación y certificación.
8. **Datos y entidades:** `CicloEsterilizacion` soporta estados de ciclo, revisor, fecha y motivo de rechazo. No se identificó estado `CUARENTENA`/`RETENIDO` ni entidad para decisión, cantidad y destino de material individual.
9. **Flujo:** La revisión actual aprueba o rechaza el ciclo completo. Una orden puede marcarse `PROCESADO` al completarse ciclos; para órdenes con método, la transición logística a `ENTREGADO` comprueba que todos los ciclos estén aprobados y certificados.
10. **Criterios de aceptación:** Mantener estados distinguibles de cuarentena/liberado/rechazado por unidad o lote; exigir motivo; registrar destino y evidencia; bloquear despacho ordinario a material no liberado; exigir ciclo aprobado y certificado, con manejo explícito de excepciones autorizadas.
11. **Evidencia en backend:** `CalidadService.rechazar` guarda `RECHAZADO`, revisor, fecha y motivo. `LogisticaService.updateEstado` exige ciclos aprobados y certificados antes de `ENTREGADO` si la orden tiene método de esterilización.
12. **Evidencia de persistencia e interfaz:** El enum solo tiene `EN_PROCESO`, `PENDIENTE_CALIDAD`, `APROBADO`, `RECHAZADO`. El DTO de rechazo recibe motivo y evaluaciones, sin disposición material/CAPA; no hay endpoint de retención por material.
13. **Brechas derivadas:** `B-CAL-002` deriva a `RF-CAL-006` (estado de cuarentena y rechazo por material/lote) y `RA-CAL-001` (políticas de cuarentena y destino); `B-CAL-003` deriva a `RF-CAL-007` para asegurar validación también en órdenes sin método. La ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Definir unidad de cuarentena (ciclo/material/cantidad), liberación parcial, evidencias y autorizaciones por destino. Se plantean en `RA-CAL-001`.
15. **Estado de cobertura:** Parcial. Existe rechazo de ciclo y bloqueo de entrega normal para órdenes con método y certificados, pero no cuarentena ni disposición por material; la compuerta depende de que el método esté informado.
16. **Certeza y límites:** Confirmado mediante lectura de entidades, DTOs, servicios y reglas maestras. La condición de orden sin método se deriva del código; no se verificaron datos de producción ni pruebas.
