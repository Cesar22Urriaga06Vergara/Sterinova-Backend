---
id: RF-PLA-009
titulo: Validación de capacidad de carga por equipo
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 59; Sterinova-ERP.md §3"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts"
depende_de: [RF-PLA-007]
bloquea: []
brechas: [B-PLA-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-003; las unidades y criterios deben confirmarse antes de fijar validaciones."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; no se presupone una unidad universal de capacidad."
---

# RF-PLA-009 — Validación de capacidad de carga por equipo

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-009`.
2. **Título:** Validación de capacidad de carga por equipo.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Verificar que la carga asignada a un ciclo no supere la capacidad aprobada del equipo, usando unidades y reglas compatibles con la tecnología.
6. **Reglas asociadas:** El límite debe estar ligado al equipo y expresar valor/unidad/base; cargas incompatibles o mixtas se validan según política. No se comparan unidades incompatibles ni se presume capacidad para lavandería.
7. **Actores / permisos:** Personal de Planta asigna carga; administración/Calidad mantiene límites y validaciones según política todavía pendiente.
8. **Datos y entidades:** Equipo y capacidad nominal/útil, unidad, material con peso/volumen/conversión, carga del ciclo y excepciones documentadas.
9. **Flujo preliminar:** Seleccionar equipo → agregar materiales/cantidades → calcular carga según unidades admitidas → comparar con capacidad → aceptar o bloquear con detalle de exceso.
10. **Criterios de aceptación preliminares:** Cargas dentro del límite aprobado se aceptan; las superiores se bloquean o requieren excepción solo si se define; conversiones/unidades incompatibles no se aceptan silenciosamente; queda almacenada base de cálculo usada.
11. **Evidencia en backend:** El servicio limita cantidades procesadas por línea de material, pero no calcula peso/volumen agregado ni lo compara con capacidad.
12. **Persistencia e interfaz:** Actualmente no hay catálogo/equipo ni dimensiones de carga/capacidad estructuradas; depende de `RF-PLA-007` y de los datos de materiales.
13. **Brecha asociada:** `B-PLA-003` abierta; no hay validación de capacidad de equipo.
14. **Preguntas abiertas:** Unidades por tecnología, datos de peso/volumen, tolerancia, cargas mixtas, capacidad útil vs nominal, incompatibilidades, excepciones y lavandería (`RA-PLA-004`).
15. **Cobertura preliminar:** Faltante para capacidad; el saldo por cantidad de unidad no representa capacidad física.
16. **Certeza y límites:** La necesidad de capacidad aparece en reglas maestras y anexo; ausencia de cálculo específico en servicio revisado. No se inspeccionaron especificaciones de equipos reales; borrador.
