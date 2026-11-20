---
id: RF-USR-002
titulo: Asignar varios roles, permisos y ámbitos a usuarios
tipo: RF
modulo: Usuarios / RBAC
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/users/user-roles.service.ts; src/rbac/entities/; src/rbac/rbac-authorization.service.ts; src/rbac/resource-access.ts"
depende_de: [RF-USR-001]
bloquea: [RA-USR-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto. La política para asignaciones en varias plantas se deriva a RA-USR-001."
---

# RF-USR-002 — Asignar varios roles, permisos y ámbitos a usuarios

**Fuente principal:** `Sterinova-ERP.md` §3: roles múltiples, permisos granulares y ámbitos globales/departamentales/por planta.

**Fuentes de contraste:** entidades RBAC, servicio de asignaciones, compilador de políticas, filtros de recursos y procedimiento transaccional.

1. **ID:** `RF-USR-002`.
2. **Título:** Asignar varios roles, permisos y ámbitos a usuarios.
3. **Tipo:** RF.
4. **Módulo:** Usuarios / RBAC.
5. **Descripción funcional:** Asignar varias combinaciones de rol y ámbito a cada usuario y aplicar permisos granulares sobre recursos de ámbitos autorizados.
6. **Reglas asociadas:** Solo asignaciones/roles/permisos/ámbitos activos conceden acceso; el ámbito solicitado reduce permisos existentes y nunca añade otros; ámbito Global requiere elegibilidad.
7. **Actores y permisos:** Asignaciones requieren `asignaciones.gestionar` y administración global; cada endpoint operativo exige permiso explícito y política de recurso.
8. **Datos y entidades:** `RbacUserRoleAssignment` enlaza usuario, rol y ámbito; `RbacScope` representa jerarquía `GLOBAL`, `DEPARTMENT`, `TEAM`, `PLANT`; permisos definen acceso `OWN`/`SCOPE` y descendientes.
9. **Flujo:** El servicio agrega/quita asignaciones y ejecuta `rbac_set_user_roles`; el procedimiento valida entradas y jerarquía, preserva cambios con control de versión y transacción.
10. **Criterios de aceptación:** Aceptar múltiples roles/ámbitos; rechazar duplicados e inactivos; derivar permiso y alcance por política; filtrar registros y denegar contexto no autorizado.
11. **Evidencia backend:** `UserRolesService.assign/remove`, `RbacAuthorizationService.getContext`, `compileAuthorizationPolicy`, `resourceWhere` y guardas de autorización.
12. **Persistencia y segregación:** Unicidad por usuario/rol/ámbito y FKs; scopes de tipo planta permiten aislamiento. Descendientes solo se incluyen cuando la concesión lo declara; endpoints deben aplicar los contextos/filtros.
13. **Brechas:** `brechas: []`. La validación funcional del núcleo RBAC se considera cubierta.
14. **Pregunta derivada:** La política de roles que se pueden asignar simultáneamente en varias plantas queda en `RA-USR-001`.
15. **Estado de cobertura:** Cubierto para asignación múltiple, permisos por rol y alcance RBAC según evidencia revisada.
16. **Certeza y límites:** Confirmado en código y esquema versionado; no se verificó configuración RBAC en una base desplegada. La decisión de negocio no altera la cobertura del mecanismo central.
