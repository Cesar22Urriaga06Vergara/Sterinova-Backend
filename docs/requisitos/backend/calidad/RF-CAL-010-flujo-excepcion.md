---
id: RF-CAL-010
titulo: Implementar flujo de liberación por excepción
tipo: RF
modulo: Calidad / Certificados
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 80"
fuente_contraste: "src/calidad/; src/certificados/; src/rbac/permission-catalog.ts"
depende_de: [RF-CAL-004, RA-CAL-003]
bloquea: []
brechas: [B-CAL-006]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-006."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; se distingue reautenticación normal de la futura autorización excepcional."
---

# RF-CAL-010 — Implementar flujo de liberación por excepción

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-010`.
2. **Título:** Implementar flujo de liberación por excepción.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Certificados / Seguridad.
5. **Descripción funcional:** Permitir una decisión excepcional, diferenciada de la aprobación ordinaria, cuando un proceso o parámetro no cumple un criterio y la política autorizada permite evaluar una posible liberación condicionada.
6. **Reglas asociadas:** Conservar valores y resultado original; exigir motivo, evaluación de riesgo, evidencia y aprobaciones requeridas; no convertir la excepción en aprobación ordinaria ni liberar automáticamente; reflejar claramente la condición excepcional en el documento cuando la política lo requiera.
7. **Actores / permisos:** Usuario de Calidad con `calidad.liberacion_desviacion.autorizar` o permiso aprobado equivalente. Confirmación por contraseña debe aplicarse según `RNF-SEG-002`; autoridad, separación y firmas se deciden en `RA-CAL-003`.
8. **Datos y entidades:** Ciclo, parámetro no conforme, regla/rango aplicable, motivo, análisis de riesgo, evidencia, aprobador(es), fecha/hora, usuario/cargo, estado y certificado relacionado. El registro de IP se mantiene como dato a decidir, no como requisito confirmado.
9. **Flujo preliminar:** Detectar desviación → iniciar expediente → documentar evaluación/evidencia → solicitar autorizaciones y reautenticación → aprobar o denegar excepción → actualizar condición de liberación/certificado sin modificar mediciones originales.
10. **Criterios de aceptación preliminares:** El flujo ordinario continúa rechazando parámetros fuera de rango; excepción requiere permisos, justificación y aprobaciones definidos; operación inválida no produce liberación/PDF; el certificado identifica la excepción cuando así se apruebe; todo queda auditable.
11. **Evidencia en backend:** No se encontró endpoint/servicio que autorice liberación excepcional. El permiso aparece en `permission-catalog.ts`. La aprobación ordinaria sí exige contraseña en `ApproveCycleDto` y `CalidadService.aprobar`, comprueba que el operador no se apruebe a sí mismo y emite certificado tras validar parámetros.
12. **Persistencia e interfaz:** No se identificó entidad para disposición excepcional, riesgo o firma/decisión especial; la interfaz revisada sigue el flujo normal de aprobar/rechazar.
13. **Brecha asociada:** `B-CAL-006` permanece abierta y asignada a esta ficha y a la decisión `RA-CAL-003`.
14. **Preguntas abiertas:** Determinar escenarios admisibles, nivel de riesgo y evidencia, número/perfil de aprobadores, independencia, dato de contraseña, sello/leyenda del certificado, trazabilidad de IP y efectos sobre cuarentena/CAPA.
15. **Cobertura preliminar:** Faltante para liberación por excepción; el permiso y la confirmación de contraseña de aprobación normal no implementan ese flujo.
16. **Certeza y límites:** La ausencia del flujo se contrastó en controladores/servicios de Calidad; el permiso y la aprobación ordinaria se observaron en los archivos citados. Ninguna excepción se presume autorizada; ficha en borrador.
