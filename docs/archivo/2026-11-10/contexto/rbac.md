> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# RBAC y permisos – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente: `src/rbac/**`, `src/common/guards/roles.guard.ts`, `src/users/entities/user-role.enum.ts`, `src/database/migrations/1794096000000-AddScopedRbac.ts`.
- Estado: ✅ consolidado por inspección estática.

## 1) Roles legacy de la app

`UserRole` en `src/users/entities/user-role.enum.ts` define los roles históricos:

- `Admin`
- `Comercial`
- `Logistica`
- `Planta`
- `Calidad`

Estos roles aún se usan con `@Roles(...)` en controladores legacy como `clientes`, `logistica`, `planta`, `calidad`, `users` y `auditoria`.

## 2) RBAC nuevo

La base nueva usa tablas y entidades:

- `rbac_scopes`
- `rbac_scope_closure`
- `rbac_roles`
- `rbac_permissions`
- `rbac_role_permissions`
- `rbac_user_role_assignments`
- `rbac_platform_owner`

Puntos clave:

- `RbacScope` modela `GLOBAL`, `DEPARTMENT`, `TEAM` y `PLANT`.
- `AuthorizationGuard` selecciona el flujo según `@ScopedPermissions()`.
- `PermissionGuard` resuelve permisos con `request.user.id` y `x-scope-id`.
- `RbacAuthorizationService.getSession()` devuelve `permissions`, `capabilities`, `current_scope`, `available_scopes`.

## 3) Catálogo de permisos

`src/rbac/permission-catalog.ts` contiene el catálogo real de permisos. Algunos ejemplos:

- `cotizaciones.ver`, `cotizaciones.crear`, `cotizaciones.editar`, `cotizaciones.emitir`, `cotizaciones.descargar`
- `logistica.ordenes.ver`, `logistica.ordenes.crear`, `logistica.ordenes.cambiar_estado`
- `planta.ciclos.crear`, `planta.ciclos.ver`
- `calidad.aprobar`, `calidad.rechazar`
- `formatos.versiones.publicar`, `sellos.desactivar`
- `roles.gestionar`, `ambitos.gestionar`, `asignaciones.gestionar`

## 4) Matriz rol → permisos

La migración `1794096000000-AddScopedRbac.ts` define roles iniciales:

| Rol          | Kind       | Permisos principales                            |
| ------------ | ---------- | ----------------------------------------------- |
| `superadmin` | `PLATFORM` | Todos los permisos del catálogo.                |
| `admin_area` | `STANDARD` | `usuarios.ver`, `asignaciones.gestionar`, etc.  |
| `comercial`  | `STANDARD` | clientes, cotizaciones, IVA, previsualización.  |
| `logistica`  | `STANDARD` | órdenes logísticas, cotizaciones disponibles.   |
| `planta`     | `STANDARD` | órdenes, ciclos, protocolos de planta.          |
| `calidad`    | `STANDARD` | ciclos de calidad, certificados y aprobaciones. |

## 5) Scope y contexto

- El scope se envía por cabecera HTTP: `x-scope-id`.
- La parte del frontend usa `SessionProvider` y `useQuoteHeaders()` para opcionalmente enviar el ámbito activo.
- El backend valida el scope con `RbacAuthorizationService.getContext()`, rechazando ámbitos no autorizados con `ForbiddenException`.
- En `RbacScope` la estructura incluye `kind` y `parent_id` y los checks de integridad `CHECK` para raíz y cierre.

## 6) Cómo se usa en cotizaciones

En `CotizacionesController`:

- El controlador está decorado con `@ScopedPermissions()`.
- Cada endpoint exige un permiso concreto con `@RequirePermission(...)`.
- La resolución del contexto se hace vía `request.rbac`.

Ejemplos:

- `@RequirePermission('cotizaciones.crear')`
- `@RequirePermission('cotizaciones.ver')`
- `@RequirePermission('cotizaciones.emitir')`

## 7) Estado del piloto

- El piloto de cotizaciones usa la nueva autorización por permisos y scope.
- El código aún contiene rutas legacy con `@Roles` y `RolesGuard` como protección temporal.
- El patrón actual es de migración gradual: `@ScopedPermissions()` en controladores del negocio; `@Roles` en módulos aún no migrados.
- [inferido] La intención es eliminar el guard legacy progresivamente, pero no hay evidencia de una fecha final en código.
