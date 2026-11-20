---
id: RF-USR-003
titulo: Administrar áreas y permisos
tipo: RF
modulo: Usuarios / RBAC
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/rbac/ambitos/; src/rbac/entities/; src/users/user-roles.service.ts; src/rbac/permission-catalog.ts"
depende_de: [RF-USR-002]
bloquea: [RF-USR-004, RA-USR-002]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-USR-002 deriva a RA-USR-002; B-USR-003 a RF-USR-004."
---

# RF-USR-003 — Administrar áreas y permisos

**Fuente principal:** `Sterinova-ERP.md` §3: administración de áreas, roles y permisos.

**Fuentes de contraste:** entidades y API RBAC de scopes, roles, permisos y asignaciones.

1. **ID:** `RF-USR-003`.
2. **Título:** Administrar áreas y permisos.
3. **Tipo:** RF.
4. **Módulo:** Usuarios / RBAC.
5. **Descripción funcional:** Administrar estructura organizativa, permisos por rol y asociación de usuarios a áreas/ámbitos.
6. **Reglas asociadas:** Ámbitos jerárquicos globales, departamentales y por planta; autorización efectiva en backend con permisos granulares.
7. **Actores y permisos:** `ambitos.gestionar` permite administrar scopes; `roles.gestionar` está declarado para roles/permisos, pero no se encontró API de mutación; asignación de roles requiere permiso aparte.
8. **Datos y entidades:** No hay entidad `Area`; `RbacScope` usa tipos GLOBAL/DEPARTMENT/TEAM/PLANT. Usuario se relaciona al ámbito vía asignación de rol y `scope_id`.
9. **Flujo:** API de ámbitos lista/crea/actualiza/cierra scopes; el catálogo de roles/permisos se consulta, y la asignación de roles a usuarios sí es editable.
10. **Criterios de aceptación:** Administrar áreas y relación jerárquica; asociar usuarios; administrar permisos por rol; auditar cambios y hacer cumplir permisos/ámbitos.
11. **Evidencia backend:** `AmbitoController/Service` tiene CRUD de scopes; `UserRolesService.catalog` devuelve roles, permisos y scopes; `UserRolesController` permite asignaciones, no crear roles ni modificar sus permisos.
12. **Persistencia y límites:** Scopes y relaciones role-permission existen en esquema. No se encontró controlador/servicio de CRUD de rol/permisos; no existe `area_id` ni tabla específica de áreas.
13. **Brechas derivadas:** `B-USR-002` a `RA-USR-002` para decidir si scope DEPARTMENT equivale a área operativa; `B-USR-003` a `RF-USR-004` para CRUD dinámico de roles/permisos. Ficha sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definición de áreas frente a scopes queda en RA-USR-002; alcance/controles del CRUD dinámico en RF-USR-004.
15. **Estado de cobertura:** Parcial. Se administra jerarquía de ámbitos, pero no áreas separadas ni permisos por rol mediante API.
16. **Certeza y límites:** Confirmado en rutas RBAC/Usuarios y entidades inspeccionadas. No se verificó configuración desplegada.
