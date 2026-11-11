# Unificación de roles: aplicación local y pruebas

Aplicado el 10 de noviembre de 2026 en la base local `sterinova`. Verificación final el 11 de noviembre de 2026.

## Resultado implementado

Las asignaciones relacionadas en `rbac_user_role_assignments` y la titularidad única en `rbac_platform_owner` son la fuente de verdad. Un usuario puede acumular roles y usar el mismo perfil en varios ámbitos. `usuarios.rol` conserva sus cinco valores originales y se deriva como compatibilidad; no almacena listas.

Se aplicó `UnifyUserRoleAssignments1794312002000`. Conservó las asignaciones anteriores del Gerente General, que mantiene sus 46 permisos implementados. Se crearon 22 cuentas, para disponer de una cuenta por cada uno de los 23 perfiles. Los perfiles se activaron expresamente en la base de desarrollo; los permisos futuros siguen inactivos. Las credenciales están en `CREDENCIALES-LOCALES.md`, excluido de Git. Antes de migrar se guardó un respaldo privado de usuarios y tablas RBAC en `tmp/rbac-before-unification.json`.

## Operación común

`CALL rbac_set_user_roles(usuario_id, asignaciones_json, actor_id, revision_esperada)` sustituye el conjunto completo de asignaciones activas. Cada elemento JSON contiene `role_id` y `scope_id`; JSON es un parámetro de transporte y no una columna de perfiles. El procedimiento posee la transacción y no debe llamarse dentro de otra transacción abierta.

La operación valida al actor activo con administración global, los perfiles activos, el árbol de ámbitos, la elegibilidad GLOBAL, los duplicados y la revisión de `usuarios.rbac_version`. Un mutex serializa cambios. Todo error revierte las asignaciones, la compatibilidad y la auditoría. Se conservan filas históricas desactivadas. El registro de auditoría identifica actor declarado, cuenta SQL, antes/después y revisión, sin credenciales.

El ERP usa el procedimiento mediante `POST /users/:id/role-assignments` y `DELETE /users/:id/role-assignments/:assignmentId`. El catálogo completo y las asignaciones se consultan mediante `GET /users/role-catalog` y `GET /users/role-assignments`. Usuarios muestra los perfiles efectivos y separa el valor de compatibilidad. La creación recibe perfil y ámbito inicial; una creación incompleta queda desactivada.

En HeidiSQL se consultan IDs en `rbac_roles` y `rbac_scopes`, la revisión en `usuarios` y se llama al mismo procedimiento. El documento privado incluye un ejemplo SQL completo de multirrol/multiámbito. No editar `usuarios.rol` ni las tablas de asignaciones directamente: los triggers rechazan cambios independientes inconsistentes. La última cuenta con administración GLOBAL no puede perder esa facultad, desactivarse o eliminarse en los flujos verificados.

## Evidencia real

| Comprobación | Resultado |
|---|---|
| Suite backend `npm test -- --reporter=dot` | 247 pasan, 2 omitidas; 55 archivos pasan, 1 omitido |
| Suite frontend `npm test` | 61 pasan |
| Build backend | Correcto |
| Build frontend | Correcto, TypeScript y generación de rutas completados |
| `scripts/verify-rbac-unification.mjs` | 14 comprobaciones pasan en una base clonada aislada que se elimina al terminar |
| `scripts/test-rbac-schema.ps1` | 3 suites aprobadas, 26 pruebas aprobadas y 2 omitidas en una instancia MariaDB temporal |
| `scripts/verify-local-role-access.mjs` | 11 comprobaciones pasan en la base local; restaura el perfil del asesor al terminar |
| Navegador Chromium contra ERP local | Catálogo de 23 perfiles visible; añade y quita un perfil de Calidad al asesor; alta muestra los 23 perfiles |
| Credenciales | Hash bcrypt validado contra las 23 contraseñas documentadas; las 23 cuentas activas generan sesión |
| API local | Catálogo y cotizaciones 200 para Gerencia; asesor consulta cotizaciones y recibe 403 al administrar perfiles; Logística recibe 403 en cotizaciones incluso con un claim legacy Admin |
| SQL local | El procedimiento agrega roles en varios ámbitos; la sesión refleja el cambio; edición directa del enum y de asignaciones rechazada |

Las 14 comprobaciones aisladas incluyen rollback por perfil inválido, ámbito global no permitido, actor sin facultad, lectura permitida/borrado denegado, múltiples roles y ámbitos, revisión obsoleta, duplicados, protección de última administración ante sustitución/desactivación/borrado y dos escrituras concurrentes con un solo ganador.

El piloto histórico usa el esquema anterior a la unificación porque sus datos de prueba escriben asignaciones directamente. La cadena completa de migraciones usa el esquema nuevo y la verificación aislada del procedimiento cubre sus protecciones. La prueba de `/users` confirma que un Admin legacy sin concesiones RBAC globales recibe 403. El error simulado al insertar un ítem de cotización forma parte de una prueba de reversión que pasó.

La suite MariaDB omitió la restauración desde respaldo porque el ensayo se ejecutó sin `-BackupFile`. También omitió la generación real de PDF de cotizaciones y certificados EtO/Vapor porque el ensayo no configuró `HITO4_RENDER_BASE_URL` y `HITO4_ICONTEC_SOURCE`.

## Limitaciones

- La migración de autorización por recurso de todos los módulos no forma parte de esta unificación. Cotizaciones y otros endpoints ya migrados aplican permisos/ámbitos RBAC; varios módulos antiguos siguen usando el enum derivado y no representan todas las restricciones de perfiles y ámbitos. No se declara esa migración completa.
- Compatibilidad: `Admin > Comercial > Logistica > Planta > Calidad`. Los perfiles administrativos se proyectan a Admin; varios roles entre áreas no caben con precisión en un solo enum. La administración de usuarios y asignaciones exige además facultad RBAC global.
- `operario_lavanderia` todavía no tiene permisos operativos implementados. `admin_lavanderia` conserva concesiones administrativas de diseño, pero no existe aún el flujo operativo de lavandería. No se activan permisos futuros para simularlo.
- La titularidad técnica es única. Transferirla a otra identidad requiere un proceso explícito; no se reasigna accidentalmente al elegir un perfil.
- No se infieren ámbitos de documentos históricos. La unificación conserva los accesos existentes y no reescribe la autoría histórica.
- La protección cubre las operaciones de asignación y la activación/eliminación de usuarios. Alterar directamente catálogos, permisos, ámbitos, triggers o procedimientos con credenciales privilegiadas está fuera de estos flujos. Un administrador SQL puede eludir cualquier guard de la aplicación; el actor del CALL es declarado y auditado, no autenticado por otra contraseña.
- El rol compatible se sincroniza al modificar asignaciones mediante el procedimiento. Los cambios directos en metadatos del catálogo no son una vía soportada de gestión de perfiles.
- El modo bootstrap del procedimiento solo admite actor NULL cuando no existe ni ha existido ninguna fila de asignación ni titular. No es una puerta de recuperación general. Una instalación existente sin administrador RBAC requiere conciliación explícita; no se convierte a todos los Admin legacy en titulares por inferencia.

## Reproducción

1. `npm run build`.
2. `node scripts/verify-rbac-unification.mjs` crea una base temporal con nombre aleatorio, verifica y la elimina; requiere privilegios locales de creación de base. No modifica datos de la aplicación.
3. Con backend local activo, `node scripts/verify-local-role-access.mjs` valida credenciales, API y procedimiento, y restaura el asesor. Usa los registros privados de credenciales en `tmp/`.
4. `node scripts/seed-local-role-users.mjs` solo admite base local y conserva las cuentas/contraseñas existentes. No ejecutar contra producción.
