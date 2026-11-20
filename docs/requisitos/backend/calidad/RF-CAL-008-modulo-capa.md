---
id: RF-CAL-008
titulo: Implementar entidades y endpoints para Desviaciones y CAPA
tipo: RF
modulo: Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; RF-CAL-003"
fuente_contraste: "src/calidad/; src/rbac/permission-catalog.ts"
depende_de: [RF-CAL-003, RA-CAL-002]
bloquea: []
brechas: [B-CAL-004]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-004."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; no se presume un flujo de estados aprobado."
---

# RF-CAL-008 — Implementar entidades y endpoints para Desviaciones y CAPA

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-008`.
2. **Título:** Implementar entidades y endpoints para Desviaciones y CAPA.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Crear expediente persistente y API para informar desviaciones/no conformidades e investigaciones CAPA vinculadas con ciclo y, cuando aplique, material/lote.
6. **Reglas asociadas:** Registrar clasificación, descripción, origen, reportante, responsables y relaciones operativas; conservar historial; no cerrar/despachar con una investigación pendiente cuando la regla aprobada lo restrinja. El ciclo de estados/acciones se define en `RF-CAL-009`; políticas en `RA-CAL-002`.
7. **Actores / permisos:** Roles de Calidad con permisos de consulta, registro, investigación, verificación y aprobación según catálogo existente; la asignación concreta depende de RA-CAL-002 y RBAC.
8. **Datos y entidades:** Propuesta de entidades para desviación e investigación CAPA, con claves a ciclo, orden y lote/material, responsables, fechas, descripción, clasificación, estado, evidencias y relaciones a acciones. El esquema exacto está por diseñar.
9. **Flujo preliminar:** Detectar → registrar desviación → asociar ciclo/material → iniciar expediente → asignar investigación/acciones → pasar al flujo de seguimiento definido en `RF-CAL-009`.
10. **Criterios de aceptación preliminares:** Crear y consultar expedientes autorizados; mantener vínculo navegable al ciclo/lote; registrar actor y fechas; guardar evidencia sin sobrescribir el original; filtrar y restringir acceso por ámbito; impedir datos sin relación válida.
11. **Evidencia en backend:** No se encontraron entidades, servicios ni endpoints funcionales de Desviación/CAPA bajo `src/calidad/`; sí existen códigos de permisos relacionados en `permission-catalog.ts`.
12. **Persistencia e interfaz:** No existe persistencia CAPA observada ni UI de expedientes en la matriz revisada; campos, adjuntos y consultas son alcance nuevo.
13. **Brecha asociada:** `B-CAL-004` permanece abierta y asignada a este borrador.
14. **Preguntas abiertas:** Definir tipos de desviación, criterios de severidad, vínculos obligatorios, roles por etapa, datos mínimos, plazos, evidencias y retención con RA-CAL-002.
15. **Cobertura preliminar:** Faltante; el catálogo de permisos sin entidades/endpoints no implementa la capacidad.
16. **Certeza y límites:** La ausencia se basa en revisión de `src/calidad/` y catálogo de permisos; no se evaluaron sistemas externos CAPA ni requerimientos regulatorios no incluidos en el anexo. Borrador pendiente de validación.
