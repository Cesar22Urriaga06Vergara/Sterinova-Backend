> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Módulos backend – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente: carpetas bajo `src/` y controladores/servicios principales.
- Estado: 🚧 parcial; se basa en inspección de estructura y rutas.

| Módulo                  | Responsabilidad                             | Entidades principales           | Servicios clave                               | Dependencias                                      |
| ----------------------- | ------------------------------------------- | ------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| `auth`                  | Login, JWT y validación de identidad        | `usuarios`                      | `AuthService`, `JwtStrategy`                  | `users`, `rbac`, `auditoria`                      |
| `users`                 | Gestión de usuarios y estado                | `usuarios`                      | `UsersService`                                | `auth`, `rbac`                                    |
| `clientes`              | Catálogo comercial de clientes              | `clientes`                      | `ClientesService`                             | `cotizaciones`, `usuarios`                        |
| `cotizaciones`          | Creación, emisión y edición de cotizaciones | cotizaciones, IVA, items        | `CotizacionesService`, `PdfGeneratorService`  | `clientes`, `pdf`, `rbac`, `logistica`            |
| `logistica`             | Órdenes y coordinación operativa            | órdenes, materiales             | `LogisticaService`                            | `cotizaciones`, `planta`                          |
| `planta`                | Protocolos, ciclos y ejecución productiva   | protocolos, ciclos              | `PlantaService`                               | `logistica`, `calidad`, `certificados`            |
| `calidad`               | Revisión, aprobación y rechazo de ciclos    | ciclos de calidad, evaluaciones | `CalidadService`                              | `planta`, `certificados`                          |
| `certificados`          | Emisión y validación de certificados        | certificados_esterilizacion     | `CertificadosService`                         | `calidad`, `pdf`                                  |
| `pdf`                   | Render PDF con Playwright y almacenamiento  | snapshot + blob local           | `PdfGeneratorService`                         | `sellos`, `common/storage`                        |
| `formatos-documentales` | Versionado y publicación de formatos        | formatos, plantillas            | `FormatosDocumentalesService`                 | `sellos`, `documentos`                            |
| `sellos`                | Gestión de sellos y firma visual            | sellos                          | `SellosService`                               | `pdf`                                             |
| `auditoria`             | Registro de eventos de negocio y seguridad  | auditoria                       | `AuditoriaService`                            | `auth`, `users`, `config`                         |
| `tasas-fiscales`        | Historico y publicación de IVA              | tasas fiscales                  | `TasasFiscalesService`                        | `rbac`                                            |
| `rbac`                  | Autorización por permisos y scopes          | `rbac_*`                        | `RbacAuthorizationService`, `PermissionGuard` | `auth`, `users`, `cotizaciones`, `tasas-fiscales` |
| `health`                | Salud del servicio                          | no aplica                       | `HealthController`                            | none                                              |
| `common`                | Utilidades transversales                    | no aplica                       | `StorageService`, guards, DTOs                | varios                                            |

## Observación

La estructura sugiere una arquitectura modular NestJS con dominios claros, pero la documentación del modelo de datos es todavía incompleta para entidades de negocio complejas sin volcado de schema real.
