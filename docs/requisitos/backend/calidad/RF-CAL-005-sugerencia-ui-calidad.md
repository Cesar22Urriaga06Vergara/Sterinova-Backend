---
id: RF-CAL-005
titulo: Mostrar sugerencia automática de cumplimiento en UI de Calidad
tipo: RF
modulo: Calidad / Frontend
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 6, respuesta 73; Sterinova-ERP.md §3"
fuente_contraste: "src/certificados/informacion-tecnica.ts; src/calidad/; SterinovaFrontend/app/(erp)/calidad/"
depende_de: [RF-CAL-001]
bloquea: []
brechas: [B-CAL-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; la sugerencia visual no sustituye decisión de Calidad."
---

# RF-CAL-005 — Mostrar sugerencia automática de cumplimiento en UI de Calidad

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-005`.
2. **Título:** Mostrar sugerencia automática de cumplimiento en UI de Calidad.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Frontend.
5. **Descripción funcional:** Antes de confirmar una revisión, la interfaz muestra el resultado calculado por parámetro al comparar las mediciones del ciclo con la versión de protocolo asociada.
6. **Reglas asociadas:** Distinguir conforme, fuera de rango y no aplicable; mostrar la regla/rango usado; la sugerencia no aprueba ni libera materiales automáticamente. La persona autorizada de Calidad conserva la decisión y la firma explícita.
7. **Actores / permisos:** Revisor de Calidad con permiso de consulta y revisión de ciclos conforme a RBAC y ámbito.
8. **Datos y entidades:** Mediciones de `CicloParametroEvaluacion`, valores/rangos en `ProtocoloEsterilizacionVersion.especificaciones_json`, estado del ciclo y resultado por parámetro.
9. **Flujo:** Cargar ciclo y protocolo versionado → calcular resultado de cada medición → mostrarlo junto al valor observado y rango → permitir revisión/decisión autorizada → enviar evaluación al backend, que revalida.
10. **Criterios de aceptación preliminares:** La sugerencia se calcula con la versión exacta asociada al ciclo; muestra parámetros faltantes y no aplicables diferenciados; no permite que un resultado visual sustituya el endpoint de aprobación ni altera mediciones/protocolo.
11. **Evidencia en backend:** `CalidadService.aprobar` pasa por `CertificadosService.emitirDesdeCiclo`, que valida evaluaciones contra la versión del protocolo antes de aprobar. La verificación se realiza al confirmar, no se encontró una respuesta de sugerencias anticipada.
12. **Evidencia frontend/persistencia:** `EvaluacionTecnica` presenta selección manual de criterios; el formulario/API no exhibe una clasificación previa por parámetro. Los datos estructurados de protocolo y medición existen en el flujo backend.
13. **Brecha asociada:** `B-CAL-001` permanece abierta: falta exponer la sugerencia en la UI antes de la decisión humana.
14. **Preguntas abiertas:** Definir cómo presentar parámetros incompletos, unidades/tolerancias, advertencias, accesibilidad y manejo de resultados límite o datos históricos incompatibles.
15. **Cobertura preliminar:** Parcial: validación backend al aprobar; sugerencia anticipada de interfaz no encontrada.
16. **Certeza y límites:** Contraste basado en el servicio de Calidad, el validador de certificados y componentes frontend de evaluación citados en la matriz. No se ejecutó la UI ni se verificó flujo con backend real; sigue en borrador.
