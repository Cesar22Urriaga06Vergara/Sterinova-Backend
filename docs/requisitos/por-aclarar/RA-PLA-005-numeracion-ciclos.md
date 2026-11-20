---
id: RA-PLA-005
titulo: Formatos de consecutivos y numeración física
tipo: RA
modulo: Planta / Calidad
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 61, 67–68"
fuente_contraste: "RF-PLA-002; RF-PLA-010; src/planta/entities/ciclo-esterilizacion.entity.ts"
depende_de: [RF-PLA-010]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-PLA-002 para fijar formato, reinicio anual, registros retroactivos y número físico del ciclo."
---

# RA-PLA-005 — Formatos de consecutivos y numeración física

## Preguntas para negocio, Planta y Calidad

1. ¿Qué formato, secuencia y política de reinicio debe tener el consecutivo interno? ¿Qué año se utiliza en ciclos capturados retroactivamente?
2. ¿Cómo se ingresa y valida el número físico de ciclo de máquina, incluido su alcance de unicidad por equipo/año?
3. ¿Cómo se identifican ciclos sucesivos de reproceso (por ejemplo, `R1`, `R2`) sin reemplazar el ciclo original?
4. ¿Qué excepciones de captura retroactiva requieren autorización y qué fechas y responsables deben quedar separados?

## Contexto

La regla maestra exige dos identificadores distintos, pero deja pendiente el formato del consecutivo y las reglas temporales. El código actual solo genera una clave primaria técnica y no captura número físico.
