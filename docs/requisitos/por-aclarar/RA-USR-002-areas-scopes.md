---
id: RA-USR-002
titulo: Definición de Áreas Operativas vs. Scopes
tipo: RA
modulo: Usuarios / RBAC
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "RF-USR-003; src/rbac/entities/scope.entity.ts; src/rbac/ambitos/"
depende_de: [RF-USR-003]
bloquea: []
brechas: [B-USR-002]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-USR-002."
---

# RA-USR-002 — Definición de Áreas Operativas vs. Scopes

## Pregunta de negocio

¿Los ámbitos `DEPARTMENT`/`PLANT` de RBAC representan adecuadamente las áreas operativas del ERP (Comercial, Logística, Planta, Calidad), o se requiere un catálogo/entidad de Área independiente con atributos, responsables y relaciones propias?

## Impacto

La decisión determina el modelo organizativo, la asignación de usuarios/roles, el alcance de reportes y las fronteras de autorización. No se equipara automáticamente un área funcional a una planta física ni a un scope.
