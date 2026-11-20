---
id: RF-USR-004
titulo: Implementar CRUD para gestión dinámica de Roles y Permisos
tipo: RF
modulo: Usuarios / RBAC
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/rbac/entities/role.entity.ts; src/rbac/permission-catalog.ts; src/users/user-roles.service.ts"
depende_de: [RF-USR-003]
bloquea: []
brechas: [B-USR-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-USR-003."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos a partir del catálogo y API RBAC actuales."
---

# RF-USR-004 — Implementar CRUD para gestión dinámica de Roles y Permisos

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-USR-004`.
2. **Título:** Implementar CRUD para gestión dinámica de Roles y Permisos.
3. **Tipo:** RF.
4. **Módulo:** Usuarios / RBAC.
5. **Descripción funcional:** Permitir a personal administrador gestionar roles y su relación con permisos desde el sistema, en lugar de depender exclusivamente de cambios del catálogo en código.
6. **Reglas asociadas:** Exigir autorización administrativa; proteger asignaciones activas; preservar separación de funciones; registrar cambios; impedir quitar permisos o desactivar roles de forma que deje el sistema sin administrador operativo. Si los permisos siguen predefinidos, limitar CRUD a los códigos disponibles.
7. **Actores / permisos:** Actor con permiso administrativo global según la política RBAC. `roles.gestionar` está declarado, pero el catálogo y asignaciones actuales usan también `asignaciones.gestionar`; la autorización objetivo requiere decisión y contrato explícito.
8. **Datos y entidades:** `RbacRole`/`rbac_roles`, permisos (`rbac_permissions` y catálogo TypeScript `PERMISSION_CATALOG`), relación rol–permiso y asignaciones usuario–rol–ámbito.
9. **Flujo preliminar:** Consultar catálogo → crear/editar/desactivar rol → asociar permisos permitidos → validar dependencias y privilegios → auditar → publicar cambios y recalcular/revalidar concesiones.
10. **Criterios de aceptación preliminares:** Solo actores autorizados modifican roles; permisos desconocidos o inactivos se rechazan; cambios no alteran asignaciones históricas sin regla explícita; se registra before/after; los permisos efectivos se reevalúan tras cambios.
11. **Evidencia en backend:** `UserRolesController` expone catálogo y asignaciones, pero no CRUD de roles ni permisos. `UserRolesService.catalog` filtra un conjunto codificado de roles y lee concesiones. `PERMISSION_CATALOG` es fuente estática. La brecha `B-USR-003` corresponde al CRUD faltante.
12. **Persistencia e interfaz:** Existen entidades y tablas RBAC para roles, permisos y grants; la interfaz actual consulta catálogo y asignaciones, no crea roles/permisos. No se evaluó una migración/esquema para permisos arbitrarios.
13. **Brecha asociada:** `B-USR-003` abierta; esta ficha absorbe el alcance de CRUD dinámico derivado de `RF-USR-003`.
14. **Preguntas abiertas:** ¿El catálogo de permisos será extensible o controlado por código? ¿Qué atributos editará el administrador? ¿Qué operaciones requieren alcance global, aprobación adicional o bloqueo de autoescalamiento? ¿Cómo retirar roles usados históricamente?
15. **Estado de cobertura preliminar:** Faltante en API para creación/edición de roles y permisos; consulta de catálogo/asignaciones sí existe.
16. **Certeza y límites:** La ausencia de endpoints se comprobó en controladores/servicios consultados y la naturaleza estática en `permission-catalog.ts`. El diseño de gobierno de permisos no está decidido y el documento permanece en borrador.
