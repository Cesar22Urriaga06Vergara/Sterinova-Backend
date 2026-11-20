---
id: RA-USR-001
titulo: Políticas de asignación de roles por planta
tipo: RA
modulo: Usuarios / RBAC / Planta
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "RF-USR-002; src/rbac/entities/user-role-assignment.entity.ts; src/rbac/entities/scope.entity.ts"
depende_de: [RF-USR-002]
bloquea: []
brechas: []
historial:
  - version: 0.1
    nota: "Decisión de negocio sobre asignación de perfiles a múltiples plantas."
---

# RA-USR-001 — Políticas de asignación de roles por planta

## Pregunta de negocio

¿Un mismo usuario puede tener el mismo rol operativo en varias plantas simultáneamente? ¿Hay combinaciones de rol/planta que deban prohibirse o requerir una aprobación adicional, y cómo deben mostrarse/switcharse los ámbitos disponibles en la sesión?

## Impacto

La decisión afecta administración de asignaciones, selección de ámbito, alcance operativo y segregación de responsabilidades. El RBAC actual permite combinaciones de rol/ámbito, pero el negocio debe confirmar qué combinaciones son válidas para cada perfil.
