---
id: RF-PLA-013
titulo: Añadir campo de justificación en evaluación de parámetros
tipo: RF
modulo: Planta / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 74"
fuente_contraste: "src/calidad/dto/evaluacion-parametro.dto.ts; src/planta/entities/ciclo-parametro-evaluacion.entity.ts; src/certificados/informacion-tecnica.ts"
depende_de: [RF-PLA-004]
bloquea: []
brechas: [B-PLA-007]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-007; el motivo debe ser obligatorio cuando corresponda."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; autorización y cambios históricos quedan explícitos como decisiones/controles."
---

# RF-PLA-013 — Añadir campo de justificación en evaluación de parámetros

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-013`.
2. **Título:** Añadir campo de justificación en evaluación de parámetros.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad.
5. **Descripción funcional:** Exigir y persistir justificación cuando Calidad evalúe un parámetro como `NO_APLICA`; cambios posteriores sobre `NO_CUMPLE` deben preservar la decisión original y dejar relación de corrección/desviación.
6. **Reglas asociadas:** `NO_APLICA` requiere motivo; `NO_CUMPLE` no se convierte en cumplimiento mediante edición directa. Corrección/desviación necesita el flujo autorizado y evidencia histórica.
7. **Actores / permisos:** Evaluador de Calidad; aprobación de una corrección por rol independiente/autorizado, pendiente de política.
8. **Datos y entidades:** Evaluación de ciclo/parámetro, criterio, actor, fecha, motivo/justificación y posible vínculo a desviación/corrección.
9. **Flujo preliminar:** Elegir evaluación → si `NO_APLICA`, validar motivo no vacío → guardar evaluación con usuario/fecha → si se intenta corregir `NO_CUMPLE`, abrir flujo autorizado sin sustituir el original.
10. **Criterios de aceptación preliminares:** Se rechaza `NO_APLICA` sin justificación; motivo se conserva en historial y certificado/evidencia cuando aplique; edición posterior mantiene original y registra quién/cuándo/por qué.
11. **Evidencia en backend:** `EvaluacionParametroDto` recibe parámetro/criterio/opción, y `CicloParametroEvaluacion` persiste criterio, evaluador y fecha; no se identificó campo de justificación.
12. **Persistencia e interfaz:** `EvaluacionTecnica` permite seleccionar resultado; no captura motivo estructurado para `NO_APLICA`. Cambio de esquema/API/UI sería requerido.
13. **Brecha asociada:** `B-PLA-007` abierta; ausencia de justificación impide explicar una no aplicación.
14. **Preguntas abiertas:** Longitud/formato, condiciones de `NO_APLICA`, alcance por protocolo/material, aprobador de excepción y forma de mantener historial/certificado.
15. **Cobertura preliminar:** Parcial: resultado y responsable se persisten; justificación y flujo protegido de corrección no están representados.
16. **Certeza y límites:** Comparación basada en DTO, entidad y UI citadas. Reglas provienen de respuesta 74 del registro de negocio; autorización detallada requiere definición. Borrador.
