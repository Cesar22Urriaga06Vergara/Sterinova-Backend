> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Endpoints HTTP – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente real: `docs/arquitectura/openapi.json` generado por la app en el arranque de Nest; la ejecución también mostró `Nest application successfully started` y luego `EADDRINUSE: address already in use :::3001` por un proceso previo escuchando en 3001.
- Nota: la ruta documentada por Swagger es `http://localhost:3001/api/docs` en entorno local; el JSON cruza la app que ya estaba levantada y se obtuvo como evidencia del schema real.
- Bloqueador: la exportación directa a `docs/contexto/openapi.json` quedó pendiente por el puerto ocupado; el comando exacto a repetir es `npm run start:dev` y luego `curl http://localhost:3001/api-json -o docs/contexto/openapi.json` cuando no haya otro proceso usando 3001.

## Inventario real

| Módulo                | Método | Path                                                     | Auth / guard                                                    | Nota                                         |
| --------------------- | ------ | -------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| Health                | GET    | `/health/live`                                           | `@Public()`                                                     | Health check público.                        |
| Health                | GET    | `/health/ready`                                          | `@Public()`                                                     | Health check público.                        |
| Auth                  | POST   | `/auth/login`                                            | `@Public()`, throttling 5/60s                                   | Genera JWT; valida credenciales con bcrypt.  |
| Auth                  | GET    | `/auth/me`                                               | Bearer JWT + `x-scope-id` opcional                              | Devuelve identidad, permisos y scopes.       |
| Auditoría             | GET    | `/auditoria`                                             | Legacy `@Roles(UserRole.ADMIN)`                                 | Solo Admin.                                  |
| Calidad               | GET    | `/calidad/pendientes`                                    | `@Roles(Admin, Calidad)`                                        | Lista ciclos pendientes.                     |
| Calidad               | GET    | `/calidad/ciclos/:id`                                    | `@Roles(Admin, Calidad)`                                        | Consulta ciclo.                              |
| Calidad               | POST   | `/calidad/aprobar`                                       | `@Roles(Admin, Calidad)`                                        | Aprueba ciclo.                               |
| Calidad               | POST   | `/calidad/rechazar`                                      | `@Roles(Admin, Calidad)`                                        | Rechaza ciclo.                               |
| Certificados          | GET    | `/certificados/validar/:token`                           | `@Public()` + `@Roles()`                                        | Valida certificado con token público.        |
| Certificados          | GET    | `/certificados/:id`                                      | `@Roles(Admin, Calidad)`                                        | Consulta certificado.                        |
| Certificados          | GET    | `/certificados/:id/descargar`                            | `@Roles(Admin, Calidad)`                                        | Descarga PDF.                                |
| Clientes              | POST   | `/clientes/bulk`                                         | `@Roles(Admin, Comercial)`                                      | Importación masiva.                          |
| Clientes              | GET    | `/clientes/:id`                                          | `@Roles(Admin, Comercial)`                                      | Consulta cliente.                            |
| Clientes              | PUT    | `/clientes/:id`                                          | `@Roles(Admin, Comercial)`                                      | Actualización.                               |
| Clientes              | DELETE | `/clientes/:id`                                          | `@Roles(Admin, Comercial)`                                      | Eliminación.                                 |
| Cotizaciones          | POST   | `/cotizaciones`                                          | RBAC `@ScopedPermissions()`, permiso `cotizaciones.crear`       | Creación con `x-scope-id` opcional.          |
| Cotizaciones          | GET    | `/cotizaciones`                                          | RBAC `@RequirePermission('cotizaciones.ver')`                   | Listado con filtro por scope.                |
| Cotizaciones          | GET    | `/cotizaciones/iva-vigente`                              | RBAC `@RequirePermission('cotizaciones.crear')`                 | Consulta IVA vigente para nuevos borradores. |
| Cotizaciones          | GET    | `/cotizaciones/:id`                                      | RBAC `@RequirePermission('cotizaciones.ver')`                   | Consulta detallada.                          |
| Cotizaciones          | GET    | `/cotizaciones/:id/previsualizar`                        | RBAC `@RequirePermission('cotizaciones.previsualizar')`         | Vista previa.                                |
| Cotizaciones          | POST   | `/cotizaciones/:id/emitir`                               | RBAC `@RequirePermission('cotizaciones.emitir')`                | Emite documento.                             |
| Cotizaciones          | GET    | `/cotizaciones/:id/descargar`                            | RBAC `@RequirePermission('cotizaciones.descargar')`             | Devuelve PDF.                                |
| Cotizaciones          | POST   | `/cotizaciones/:id/aprobar`                              | RBAC `@RequirePermission('cotizaciones.editar')`                | Aprueba borrador sin modificar contenido.    |
| Cotizaciones          | PUT    | `/cotizaciones/:id`                                      | RBAC `@RequirePermission('cotizaciones.editar')`                | Actualización.                               |
| Cotizaciones          | DELETE | `/cotizaciones/:id`                                      | RBAC `@RequirePermission('cotizaciones.eliminar')`              | Eliminación.                                 |
| Formatos documentales | GET    | `/formatos-documentales/:id`                             | `@Roles(Admin)`                                                 | Consulta formato.                            |
| Formatos documentales | PUT    | `/formatos-documentales/:id`                             | `@Roles(Admin)`                                                 | Actualiza formato.                           |
| Formatos documentales | DELETE | `/formatos-documentales/:id`                             | `@Roles(Admin)`                                                 | Elimina formato.                             |
| Formatos documentales | POST   | `/formatos-documentales/:id/versiones`                   | `@Roles(Admin)`                                                 | Crea versión.                                |
| Formatos documentales | PUT    | `/formatos-documentales/:id/versiones/:versionId`        | `@Roles(Admin)`                                                 | Modifica versión.                            |
| Formatos documentales | POST   | `/formatos-documentales/:id/versiones/:versionId/estado` | `@Roles(Admin)`                                                 | Cambia estado.                               |
| Logística             | POST   | `/logistica/ordenes`                                     | `@Roles(Admin, Logistica)`                                      | Crea orden.                                  |
| Logística             | PATCH  | `/logistica/ordenes/:id/materiales`                      | `@Roles(Admin, Logistica)`                                      | Actualiza materiales.                        |
| Logística             | GET    | `/logistica/ordenes`                                     | `@Roles(Admin, Logistica)`                                      | Lista órdenes.                               |
| Logística             | GET    | `/logistica/cotizaciones-aprobadas`                      | `@Roles(Admin, Logistica)`                                      | Lista cotizaciones autorizadas.              |
| Logística             | GET    | `/logistica/ordenes/:id`                                 | `@Roles(Admin, Logistica)`                                      | Consulta orden.                              |
| Logística             | PUT    | `/logistica/ordenes/:id/estado`                          | `@Roles(Admin, Logistica)`                                      | Cambia estado.                               |
| Planta                | GET    | `/planta/protocolos`                                     | `@Roles(Admin, Planta)`                                         | Lista protocolos.                            |
| Planta                | GET    | `/planta/ordenes`                                        | `@Roles(Admin, Planta)`                                         | Lista órdenes.                               |
| Planta                | GET    | `/planta/ciclos`                                         | `@Roles(Admin, Planta)`                                         | Lista ciclos.                                |
| Planta                | POST   | `/planta/ciclos`                                         | `@Roles(Admin, Planta)`                                         | Registra ciclo.                              |
| Sellos                | GET    | `/sellos/:id/imagen`                                     | `@Roles(Admin)`                                                 | Recupera imagen de sello.                    |
| Sellos                | PATCH  | `/sellos/:id`                                            | `@Roles(Admin)`                                                 | Actualiza sello.                             |
| Sellos                | DELETE | `/sellos/:id`                                            | `@Roles(Admin)`                                                 | Desactiva/elimina sello.                     |
| Tasas fiscales        | GET    | `/tasas-fiscales/iva`                                    | RBAC `@ScopedPermissions()`, permiso `tasas_fiscales.gestionar` | Historial de IVA.                            |
| Tasas fiscales        | POST   | `/tasas-fiscales/iva`                                    | RBAC `@RequirePermission('tasas_fiscales.gestionar')`           | Publica nueva tasa.                          |
| Users                 | PATCH  | `/users/:id`                                             | `@Roles(Admin)`                                                 | Actualiza usuario.                           |
| Users                 | PATCH  | `/users/:id/password`                                    | `@Roles(Admin)`                                                 | Reemplaza contraseña.                        |
| Users                 | PATCH  | `/users/:id/status`                                      | `@Roles(Admin)`                                                 | Activa/inactiva usuario.                     |
| Users                 | DELETE | `/users/:id`                                             | `@Roles(Admin)`                                                 | Elimina usuario.                             |

## Observaciones clave

- El backend mezcla dos modelos de autorización:
  - Legacy/temporal: `@Roles(...)` + `RolesGuard`.
  - Nuevo: `@ScopedPermissions()` + `@RequirePermission()` + `AuthorizationGuard` para rutas de negocio.
- La estrategia actual de `AuthorizationGuard` prioriza RBAC cuando el controlador usa `@ScopedPermissions()`; si no, cae a `RolesGuard` legacy.
- No se detectan endpoints de refresh token ni logout explícitos en `src/auth/`; el flujo actual se limita a JWT con firma y validación de usuario activo.
