---
id: RF-CAL-003
titulo: Registrar desviaciones e investigaciones CAPA
tipo: RF
modulo: Calidad
estado: faltante
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 79; src/calidad/; src/rbac/"
depende_de: [RF-CAL-002]
bloquea: [RF-CAL-008, RF-CAL-009, RA-CAL-002]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Faltante. B-CAL-004 y B-CAL-005 se derivan; políticas a RA-CAL-002."
---

# RF-CAL-003 — Registrar desviaciones e investigaciones CAPA

**Fuente principal:** `Sterinova-ERP.md` §3: registro de desviaciones y apertura de investigaciones CAPA.

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 77 y 79; `src/calidad/` y catálogo RBAC.

1. **ID:** `RF-CAL-003`.
2. **Título:** Registrar desviaciones e investigaciones CAPA.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Registrar desviaciones/no conformidades y gestionar investigaciones CAPA vinculadas a ciclo y materiales afectados, con análisis, acciones, evidencia y cierre.
6. **Reglas asociadas:** Fallos críticos requieren análisis de riesgo; rechazo requiere motivo, evidencia, investigación CAPA y destino del material. La medición/evidencia original se conserva.
7. **Actores y permisos:** El catálogo declara `calidad.desviaciones.verificar` y `calidad.desviaciones.aprobar`; no se halló flujo que los use para gestionar CAPA.
8. **Datos y entidades:** No se identificaron entidades Desviación, CAPA o Investigación ni vínculo a ciclo/material. Existe solo motivo de rechazo en ciclo y auditoría genérica.
9. **Flujo:** No hay proceso implementado para apertura, análisis causal, plan de acciones, verificación de eficacia o cierre.
10. **Criterios de aceptación:** Abrir expediente relacionado con ciclo/material; mantener estados y responsables; registrar análisis, acciones preventivas/correctivas, fechas, evidencia y aprobaciones; exigir verificación antes del cierre según política.
11. **Evidencia en backend:** `CalidadService.rechazar` registra motivo y estado del ciclo, pero no crea investigación, acción ni CAPA. Los permisos RBAC existentes no acreditan implementación.
12. **Persistencia e interfaz:** No se encontró módulo/controlador, entidad/migración ni pantalla CAPA en las rutas inspeccionadas.
13. **Brechas derivadas:** `B-CAL-004` se asigna a `RF-CAL-008` (entidades/endpoints); `B-CAL-005` a `RF-CAL-009` (ciclo de vida y eficacia). Preguntas de política a `RA-CAL-002`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Roles de apertura/investigación/cierre, estados y plazos, alcance de acciones, obligatoriedad por tipo de desviación y relación entre cierre CAPA y liberación; se derivan a `RA-CAL-002`.
15. **Estado de cobertura:** Faltante. Se encontró vocabulario y permisos, pero no capacidad funcional persistente de desviaciones/CAPA.
16. **Certeza y límites:** Confirmado por inspección de `src/calidad/`, entidades de ciclo y catálogo RBAC. No se consultó base desplegada ni se ejecutaron pruebas.
