# RBAC Backend: plan de implementación por fases

**Objetivo:** migrar la autorización backend a capacidades, ámbitos por etapa y separación de personas sin ampliar accesos actuales por semillas.
**Arquitectura:** extender el RBAC existente de NestJS/TypeORM/MariaDB, conservar la transición explícita y aplicar filtros/SoD en servicios transaccionales. Roles configurables; no ampliar el enum legacy por cada cargo.
**Especificación:** [matriz técnica y reglas](../../arquitectura/roles-y-permisos.md), secciones 8–13. Fecha: 10/11/2026.
**Ejecución:** tareas con TDD; esta entrega implementa solo Fase 1. Las fases restantes requieren una nueva autorización del usuario.

## Restricciones globales y decisiones

- Backend exclusivamente; no modificar frontend, controladores ni servicios de negocio en Fase 1.
- No editar migraciones históricas, inferir autoría histórica ni asignar perfiles a usuarios desde semillas.
- Perfiles nuevos inactivos; permisos nuevos inactivos. Roles y concesiones legacy, incluido SuperAdmin, intactos durante Fase 1.
- Ámbito por etapa: Comercial → Logística → Planta; acceso de Calidad explícito sobre procesos/plantas. Los vínculos de trazabilidad no autorizan precios ni ámbitos ajenos.
- SoD por IDs de personas en servicios; transacción, versión/bloqueo, auditoría y excepciones. Sin triggers nuevos de autorización.
- No implementar anulación de certificados, liberación de lavandería ni urgencias médicas hasta resolver su autoridad. No tratar el modelo actual de certificado por ciclo como si ya fuera por orden.
- Usar el checkout autorizado existente, preservar cambios ajenos y no hacer commits ni despliegues automáticos.

## Fase 1 — Esquema y semillas

### Tarea 1.1: contrato relacional y metadatos

**Archivos:** `src/database/migrations/1794312000000-AddBackendRoleSchema.ts`, `src/database/migration-registry.ts`; entidades de `src/rbac`, `src/clientes`, `src/ordenes-servicio`, `src/planta`, `src/cotizaciones`, `src/certificados`, `src/formatos-documentales`, `src/auditoria`.

- [x] Escribir y ejecutar pruebas RED antes de implementar DDL/semillas.
- [x] Añadir `rbac_roles.global_assignable` y `rbac_user_role_assignments.role_global_assignable` con false por defecto, FK compuesta y CHECK para GLOBAL controlado. Conservar STANDARD ordinario y PLATFORM singleton.
- [x] Añadir ámbitos propios nullable a clientes, órdenes, ciclos, versiones de formato y auditoría; FK RESTRICT e índices. Certificados se autorizan por sus relaciones operativas, sin duplicar ámbito.
- [x] Añadir autoría a clientes/órdenes/versiones; aprobación interna y aceptación a cotizaciones; elaboración/verificación a certificados; aprobación/publicación a versiones. Reutilizar actores existentes de ciclo y certificado.
- [x] Mantener campos históricos NULL; ninguna actualización de negocio ni backfill inferido. Fechas DATETIME(6), IDs INT nullable.
- [x] Registrar migraciones nuevas después de AddCancellationPermissions. DDL sin transacción en MariaDB; ante error parcial detener, inspeccionar y corregir, sin reejecutar a ciegas.

**Interfaces producidas:** campos descritos en la sección 12 de la matriz; asignaciones GLOBAL requieren elegibilidad coincidente con el rol. Las asignaciones locales de un rol elegible también deben indicar el valor correcto. La elegibilidad solo se administra mediante configuración técnica controlada futura.

### Tarea 1.2: semillas versionadas sin asignaciones

**Archivos:** `src/database/migrations/1794312001000-SeedBackendRoles.ts`, `src/scripts/seed-backend-roles.ts`, `package.json`.

- [x] Sembrar 14 perfiles STANDARD inactivos: gerente_general, admin_comercial, asesor_comercial, admin_logistica, operador_logistica, admin_planta, operario_planta, admin_calidad, analista_calidad, director_tecnico, gerente_calidad, auditor, admin_lavanderia y operario_lavanderia.
- [x] Sembrar 32 capacidades futuras inactivas y sus concesiones objetivo; reutilizar permisos existentes sin cambiar su activación. Ninguna escritura en usuarios, asignaciones o titularidad PLATFORM.
- [x] No recrear gestor_documental ni superadmin, ya existentes; su alineación funcional pertenece a módulos posteriores.
- [x] Habilitar elegibilidad GLOBAL solo en los nuevos perfiles gerente_general y auditor. No activarlos.
- [x] Detectar colisiones de código y abortar antes de sembrar perfiles. No usar upsert que sobrescriba configuración local.
- [x] Proporcionar `npm run seed:backend-roles`: utiliza el historial TypeORM y solo aplica la semilla pendiente si el esquema ya está listo. `migration:run` aplica esquema y semilla en secuencia. Repetir el comando no reinicia perfiles modificados manualmente.

**Interfaces producidas:** BACKEND_ROLES y FUTURE_PERMISSIONS son snapshots congelados de migración, independientes del catálogo runtime. El script no asigna usuarios. La API runtime sigue sin reconocer capacidades futuras hasta Fase 2/3.

### Tarea 1.3: validación aislada y entrega

**Pruebas:** `src/database/migrations/backend-role-phase1.spec.ts`, `test/rbac-migration-chain.integration-spec.ts`, fixtures históricas de `test/rbac-schema.integration-spec.ts`.

- [x] Ejecutar pruebas unitarias de semillas/DDL y suite general.
- [x] Ejecutar cadena completa en BD vacía y actualización desde esquema previo con datos de prueba; comparar usuarios, asignaciones y concesiones legacy.
- [x] Probar rechazo de GLOBAL no elegible, falsificación de elegibilidad, aceptación de GLOBAL elegible inactivo y conservación de PLATFORM.
- [x] Verificar escritura legacy con campos NULL y rechazo de actor inexistente por FK.
- [x] Revisión independiente y del diff; build y lint sin errores. Corregida discrepancia de índices entre DDL y metadatos con prueba RED→GREEN.

Comandos: `npm test`, `npm run build`, `npm run lint`. Esquema: `./scripts/test-rbac-schema.ps1 -MariaDbBin 'C:/xampp/mysql/bin'`; este wrapper ejecuta el equivalente a `npm run test:rbac:schema` con servidor temporal, puerto exclusivo y sin DB_* de trabajo. No usar `migration:run` contra la base real durante esta entrega.

**Hito:** documentación guardada, cadena y actualización comprobadas, perfiles inactivos/sin asignaciones, cambios limitados a esquema/semillas/pruebas. Revisar esquema con el usuario antes de Fase 2. Rollback destructivo bloqueado; correcciones mediante migración nueva o restauración controlada.

## Fase 2 — Motor de autorización existente

**Archivos:** `src/rbac/authorization.guard.ts`, `src/rbac/rbac-authorization.service.ts`, `src/rbac/authorization-policy.ts`, `src/rbac/permission-catalog.ts`, decoradores y sus pruebas; guard legacy solo para retirar bypass al cierre.

- [ ] RED: ruta migrada sin política → 403; denegación RBAC no vuelve a RolesGuard; permisos de una asignación no se combinan con ámbito de otra; cabecera solo reduce acceso.
- [ ] Extender tipos/catálogo únicamente para capacidades implementadas. Revisar que resourceScopeIds de creación respete x-scope-id, además de las ramas de lectura.
- [ ] Preparar política de identidad GLOBAL y delegación local sin permitir a un administrador ampliar su propio conjunto delegable. Validar elegibilidad GLOBAL al administrar asignaciones.
- [ ] Mantener PermissionContext como contrato de guard/servicio; extractor de usuario persistido y proyección pública de sesión. Roles nuevos no se activan en bloque.
- [ ] Añadir migraciones de activación solo cuando guard y servicio de la capacidad estén completos; registro de cambios y revocación efectiva.

**Hito:** pruebas de política, sesión y denegación pasan; ningún endpoint depende solo de que un permiso exista en catálogo. Aplicar por módulo en Fase 3, nunca desplegar denegación global sin inventario completo.

## Fase 3 — Refactorización de módulos con TDD

Cada tarea modifica el controlador, servicio, DTO y pruebas del módulo indicado. Cada endpoint sigue RED → confirmar fallo por acceso/condición incorrectos → implementar mínimo → GREEN → refactor → suite. Si ya deniega, RED demuestra la capacidad nueva pendiente, no se debilita la seguridad para fabricar un fallo.

| Orden | Componentes/archivos principales | Migraciones y comportamiento | Prueba/hito |
|---|---|---|---|
| 3.1 | `src/auth`, `src/users`, `src/rbac` | Gestión de identidad separada de pertenencia; historial/delegación explícitos; nunca devolver hashes | Admin local no edita identidad global ni concede PLATFORM; revocación local conserva otras áreas |
| 3.2 | `src/clientes`, `src/cotizaciones`, `src/tasas-fiscales` | Conciliar ámbitos de clientes; sustituir permiso de aprobar; registrar versión aprobada/aceptación; añadir endpoints futuros de la matriz y reasignación con historial | Creador multirrol no se autoaprueba; PUT emitida y DELETE objetivo denegados; aceptación no equivale a emisión; anulaciones concurrentes |
| 3.3 | `src/logistica`, `src/ordenes-servicio` | Conciliar ámbito logístico con responsable autorizado; registrar actor; proyección sin precios; vínculos de asignación operativa hacia Planta | No basta el ámbito de cotización; OC/autorización, reempaque y despacho controlados; listas y detalle idénticamente filtrados |
| 3.4 | `src/planta` | Conciliar scope_id de ciclos; asignación explícita de órdenes a plantas y protocolo; equipos/retroactividad con contratos propios | Operador del JWT, método inalterable y ámbito operativo; no liberar desde Planta |
| 3.5 | `src/calidad` | Delegar procesos/plantas, conservar mediciones y decisiones; modelo de doble aprobación de desviación | Operador distinto de revisor, dos aprobadores humanos distintos y transiciones atómicas |
| 3.6 | `src/certificados` | Separar elaboración/verificación/aprobación DT; migración propia para certificado por orden y ciclos incluidos, preservando documentos por ciclo históricos | Aprobación de ciclo no firma automáticamente; PDF fallido no libera; QR mínimo; descargas por ámbito |
| 3.7 | `src/formatos-documentales`, `src/sellos` | Ámbito/autoría conciliados; aprobación DT/GG separada de publicación; versiones inmutables y licencia | Publicador no autoaprueba; versión aprobada antes de publicar; desactivar sello conserva histórico |
| 3.8 | `src/auditoria` y exportaciones comercial/certificados | Auditoría contextual y exportación con mismas políticas; conciliación histórica sin atribuir hechos nuevos | Conteos, archivos y exportaciones no filtran datos ajenos; auditor no escribe |

En cada subfase: primero desplegar campos aditivos; conciliar datos con evidencia; probar filtros y SoD; activar únicamente concesiones/asignaciones expresas; finalmente endurecer nulabilidad si la conciliación completa lo permite. Conservar NULL histórico cuando no haya autoría verificable y excluir esas filas de nuevas transiciones. No inventar departamentos/plantas para completar backfill.

## Fase 4 — Integración, E2E y cierre legacy

**Archivos:** `test/` (matriz HTTP, integración de flujos y contrato OpenAPI), `src/common/guards/roles.guard.ts`, guard de transición y documentación backend.

- [ ] Matriz parametrizada de las 64 rutas actuales más las nuevas implementadas: JWT ausente/inactivo, permiso ausente, ámbito hermano, descendiente explícito, OWN ajeno, ámbito NULL y multirrol.
- [ ] Flujos cotización → recepción → ciclo → calidad → certificado; pruebas negativas por SoD y cruces de ámbito. Probar repetición, conflictos de versión y doble solicitud concurrente.
- [ ] Verificar listas, conteos, proyecciones, PDF, QR y exportaciones; auditoría transaccional; secretos excluidos.
- [ ] Ejecutar `npm test`, `npm run test:e2e`, `npm run test:contract`, esquema aislado, build y lint. Repetir solo ante cambios/fallos nuevos.
- [ ] Retirar fallback/bypass de Admin únicamente cuando todas las rutas internas tengan política explícita. Las rutas públicas se mantienen como excepciones declaradas.

**Despliegue:** observación de decisiones por módulo sin ampliar acceso; contabilizar denegaciones/conflictos sin volcar datos sensibles. Detener activación ante regresiones; corregir hacia adelante, sin restaurar bypass en rutas ya migradas. No borrar evidencia con rollback.
**Hito final:** matriz completa, flujos críticos y contratos comprobados; ninguna ruta interna depende del rol legacy Admin. La Fase 1 no acredita ninguno de estos hitos futuros.

## Registro de ejecución de esta entrega

- Dos pruebas de Fase 1 fallaron con perfiles/DDL vacíos y pasaron tras implementar las migraciones.
- Primera ejecución aislada con MariaDB 13.0 no completó el sondeo de disponibilidad; se utilizó la instalación MariaDB de XAMPP y su datadir temporal exclusivo.
- Se corrigió el fixture de actualización para inicializar realmente con las migraciones anteriores; cambiar opciones de un DataSource ya inicializado no reconstruye su lista interna de migraciones.
- Resultado final: esquema aislado 26 pruebas aprobadas, 2 omitidas; suite general con `npm test -- --no-file-parallelism`: 247 aprobadas, 2 omitidas. Las omisiones son escenarios condicionados existentes, incluido backup real no suministrado; no se afirma restauración de backup productivo.
- No se ejecutaron migraciones en la base de trabajo, no se asignaron perfiles a usuarios y no se inició Fase 2.

- Una repetición paralela agotó 5000 ms en `src/scripts/bootstrap-admin.spec.ts > creates a missing admin with a usable hashed password`; la suite completa sin paralelismo pasó sin modificar esa prueba. Build y lint terminaron con código 0; lint conserva una advertencia previa por catch no usado en `src/pdf/pdf-generator.service.ts:184`.
- Revisión independiente completada; único hallazgo material (índices de metadatos) corregido y verificado. Logs de validación en `tmp/phase1-validation/` (artefactos locales).
