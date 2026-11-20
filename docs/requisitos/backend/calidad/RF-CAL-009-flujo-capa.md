---
id: RF-CAL-009
titulo: Flujo de estados, acciones y verificación de eficacia de CAPA
tipo: RF
modulo: Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 79"
fuente_contraste: "src/calidad/; RF-CAL-008"
depende_de: [RF-CAL-008, RA-CAL-002]
bloquea: []
brechas: [B-CAL-005]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-005."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos y se vincula con D-CAL-001/002 sin inventar estados CAPA."
---

# RF-CAL-009 — Flujo de estados, acciones y verificación de eficacia de CAPA

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-009`.
2. **Título:** Flujo de estados, acciones y verificación de eficacia de CAPA.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Gestionar el ciclo de vida de investigaciones de desviación/CAPA con responsables, acciones, evidencias, verificación de eficacia y cierre autorizado.
6. **Reglas asociadas:** Preservar decisiones previas; no tratar un rechazo/aborto como liberación automática. Cuando afecte lotes, aplicar D-CAL-001/002 a retención, liberación parcial y disposición; los criterios de apertura/cierre de CAPA aún se deben acordar.
7. **Actores / permisos:** Calidad registra/investiga, asigna y verifica; autoridades y separación entre ejecutor/verificador/aprobador quedan por definir en `RA-CAL-002`.
8. **Datos y entidades:** Expediente CAPA (propuesto), estado, origen, vínculo ciclo/lote/material, responsables, fechas objetivo, análisis causal, acciones, evidencias, verificación de eficacia y cierre.
9. **Flujo preliminar:** Abrir → clasificar/asignar → investigar → definir y ejecutar acciones → verificar eficacia → cerrar con decisión y evidencia. Nombres de estados y transiciones están pendientes de aprobación.
10. **Criterios de aceptación preliminares:** Cambios de estado guardan actor/fecha/motivo; no se cierra sin actividades/verificaciones obligatorias una vez definidas; las evidencias y decisiones permanecen consultables; la liberación de lotes sigue independiente de cierre CAPA solo en los escenarios documentados por D-CAL-001.
11. **Evidencia en backend:** No se identificó flujo funcional CAPA ni estado/servicio de investigación en `src/calidad/`; permisos para algunas operaciones están declarados.
12. **Persistencia e interfaz:** Depende de entidades/API de `RF-CAL-008` y adjuntos de evidencia. No se encontró interfaz de expediente o verificación.
13. **Brecha asociada:** `B-CAL-005` permanece abierta y vinculada con `RF-CAL-008` y `RA-CAL-002`.
14. **Preguntas abiertas:** Acordar estados, umbrales de severidad, plan de acción obligatorio, fechas/plazos, evidencia, verificador independiente, reglas de eficacia, cierre y vínculo con cuarentena/disposición.
15. **Cobertura preliminar:** Faltante; no se encontró ciclo de vida de CAPA implementado.
16. **Certeza y límites:** El hallazgo de ausencia proviene de `src/calidad/`; D-CAL-001/002 son reglas de negocio incorporadas y no especifican el flujo CAPA completo. Borrador pendiente de validación.
