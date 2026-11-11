# PLAN DE CORRECCIÓN: AUTENTICACIÓN Y RBAC EN STERINOVA

## 1. Alcance y principio del plan

Este documento es un plan operativo de corrección para la autenticación y la autorización del backend de Sterinova. No incluye cambios de código ni ejecución de migraciones ni restablecimiento de contraseñas ni modificaciones de permisos en producción. Tiene como objetivo preparar la corrección segura y verificable del problema documentado:

- usuarios activos que no pueden iniciar sesión;
- usuarios activos que autenticaron con credenciales válidas pero no acceden a módulos;
- inconsistencias entre la compatibilidad legacy de `usuarios.rol` y la autorización real basada en RBAC;
- riesgo de ausencia de rutas de administración seguras para restablecer acceso.

### Qué queda fuera de este plan

- Recuperación de credenciales originales de usuarios.
- Descifrado o inspección de hashes.
- Cambios operativos sobre la base de datos durante esta fase de diagnóstico.
- Modificaciones de código en estos pasos iniciales.

---

## 2. Resumen ejecutivo de las causas confirmadas

### Causa confirmada A: login y JWT no son los puntos de fallo primario

La autenticación del backend valida el usuario por email, exige `activo = true` y compara la contraseña con `bcrypt.compare(...)`.[src/auth/auth.service.ts:14-31]

El controlador de login sólo emite token si `validateUser()` devuelve un usuario válido; en caso contrario responde `401` y registra evento de auditoría fallido.[src/auth/auth.controller.ts:40-67]

El JWT verifica el usuario actual desde `findActiveById(payload.sub)` y rechaza usuarios inexistentes o inactivos.[src/auth/jwt.strategy.ts:10-31]

Esto confirma que el login puede funcionar correctamente para usuarios activos y con contraseña válida. El problema real no es un fallo genérico del flujo de autenticación.

### Causa confirmada B: autorización real no se deriva de `usuarios.rol`

La carga de sesión y permisos se construye a partir de `rbac_user_role_assignments` y `rbac_platform_owner`, no a partir del valor legacy de `usuarios.rol`.[src/rbac/rbac-authorization.service.ts:26-87]

La guardia de autorización exige permisos explícitos y carga el contexto de autorización por cada request.[src/rbac/authorization.guard.ts:18-60]

La migración 1794312002000 establece que `usuarios.rol` es compatibilidad y que la escritura autorizada se hace mediante `rbac_set_user_roles`, con validaciones del estilo “Version RBAC obsoleta; recargue las asignaciones” y “Actor sin administracion RBAC global”.[src/database/migrations/1794312002000-UnifyUserRoleAssignments.ts:9-80]

### Causa confirmada C: existen usuarios con administración legacy migrada de forma explícita, pero no siempre con RBAC completo

La migración BridgeLegacyUserAdministration crea una transición temporal de administración legacy y solo asocia usuarios `activo=1` y `rol='Admin'` que no tienen historial RBAC.[src/database/migrations/1794398400000-BridgeLegacyUserAdministration.ts:6-47]

Esto explica por qué el usuario con ID 1 suele ser el único que parece funcionar: se trata de una cuenta que, por herencia de la administración legacy, pudo quedar resuelta en la transición explícita o en bootstrap inicial, mientras otros usuarios requieren coincidir exactamente con un perfil RBAC válido y visible por ámbito.

### Causa confirmada D: la creación de usuarios y la gestión de identidad están separadas de la gestión de roles

El controlador de usuarios crea el usuario con `dto.role_id` y `dto.scope_id` y luego aplica `setActive(user.id, true, request.user.id)` después de asignar RBAC. Si la creación se queda incompleta o la asignación RBAC no existe, el usuario queda en un estado parcial.[src/users/users.controller.ts:18-50]

La gestión de usuarios legacy permite `rol`, pero el controlador rechaza la edición directa de ese valor para evitar inconsistencias con la fuente de verdad RBAC: “El rol de compatibilidad se deriva de las asignaciones RBAC”.[src/users/users.controller.ts:30-37]

---

## 3. Relación entre `usuarios`, `rbac_user_role_assignments` y `rbac_platform_owner`

### 3.1 Entidades relevantes

`usuarios` almacena la identidad del usuario, email, `password_hash`, `rol` legacy, `activo`, `rbac_version` y no expone el hash salvo en consultas selectivas de auth.[src/users/entities/user.entity.ts:1-39]

`rbac_user_role_assignments` contiene la asignación actual de perfil RBAC y scope para usuarios normales. Las consultas de sesión analizan exactamente estas filas para construir permisos.[src/rbac/rbac-authorization.service.ts:35-80]

`rbac_platform_owner` representa titularidad técnica o de plataforma para un usuario concreto, y la lógica de migración lo considera un caso distinto de asignación estándar. La migración lo valida de forma explícita y excluye duplicados del titular de plataforma.[src/database/migrations/1794312002000-UnifyUserRoleAssignments.ts:74-96]

### 3.2 Regla de negocio funcional

La autorización final no se deriva de `usuarios.rol`. La fuente de verdad es la combinación:

- `usuarios.id` y `usuarios.activo`;
- `rbac_user_role_assignments` con `active=1` y `scope_id` válido;
- `rbac_platform_owner` para titularidad técnica o perfiles de plataforma;
- roles activos y permisos activos en RBAC;
- scopes activos y jerarquía válida de ámbitos.

Esto se confirma en la compilación del contexto RBAC.[src/rbac/rbac-authorization.service.ts:34-65]

### 3.3 Qué significa esto a nivel operativo

Un usuario puede cumplir estas condiciones:

- tener email y password correctos;
- existir y estar activo;
- pero no tener ninguna asignación RBAC válida;
- y entonces no obtener `permissions`, `capabilities` ni `current_scope` válidos en la respuesta de sesión.

El problema es, por tanto, un desajuste entre identidad y autorización, no una simple contraseñaposible de un usuario.

---

## 4. Qué condiciones exactas debe cumplir un usuario para iniciar sesión y acceder a cada módulo

### 4.1 Condiciones para iniciar sesión

Para que `AuthController.login` emita token, el usuario debe pasar esta secuencia:

1. `findByEmail(email)` debe devolver una fila con el email solicitado.
2. `user.activo` debe ser `true`.
3. `bcrypt.compare(password, user.password_hash)` debe devolver `true`.
4. `AuthService.login(user)` genera el JWT con `sub`, `email` y `rol`.

Evidencia:

- `src/auth/auth.service.ts:14-31`
- `src/auth/auth.controller.ts:40-67`
- `src/auth/jwt.strategy.ts:10-31`

### 4.2 Condiciones para acceso posterior a una ruta autenticada

El JWT global exige que el token sea válido y que el usuario existiera y siga activo. Después, la guardia de autorización decide si la ruta está permitida.

- `JwtAuthGuard` permite acceso público solo si la ruta tiene `@Public()`, y en caso contrario llama a `super.canActivate(context)`.[src/auth/guards/jwt-auth.guard.ts:1-18]
- `AuthorizationGuard` aplica `PermissionGuard` si la ruta usa `@ScopedPermissions()`, o `RolesGuard` si usa `@Roles()`, o exige `RequireSession()`.[src/rbac/authorization.guard.ts:18-60]
- `RbacAuthorizationService.getContext()` compila el contexto de permisos del usuario según RBAC y scope actual.[src/rbac/rbac-authorization.service.ts:95-174]

### 4.3 Condiciones para cada módulo

Se requiere cumplir la intersección de:

- identidad autenticada (`user.id` válido y activo);
- JWT válido;
- `scope` vigente y autorizado por header `x-scope-id` si la ruta lo exige;
- permiso explícito o perfil legacy autorizado por la guardia relevante;
- for routes under `@ScopedPermissions`, a permission catalog entry that matches the requested action for the selected scope.

Esto es especialmente importante porque la lógica de permisos en RBAC no se basa en una simple comparación de roles de usuarios sino en la política exacta del subject y del scope.[src/rbac/rbac-authorization.service.ts:95-174]

---

## 5. Cómo comprobar, con consultas de solo lectura, qué usuarios activos carecen de asignaciones RBAC válidas

### 5.1 Consulta objetivo

Se debe preparar una auditoría de solo lectura para responder estas preguntas:

- ¿Qué usuarios están activos pero no tienen ninguna asignación real en RBAC?
- ¿Qué usuarios tienen `rol` legacy pero no asignación en RBAC?
- ¿Qué usuarios tienen asignación RBAC pero sin scope activo o sin role activo?
- ¿Qué usuarios tienen solo `rbac_platform_owner`, pero no scope válido?

### 5.2 Consulta propuesta (solo lectura)

```sql
SELECT
  u.id,
  u.email,
  u.rol AS legacy_rol,
  u.activo,
  u.rbac_version,
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM rbac_user_role_assignments a
      JOIN rbac_roles r ON r.id = a.role_id
      JOIN rbac_scopes s ON s.id = a.scope_id
      WHERE a.user_id = u.id
        AND a.active = 1
        AND r.active = 1
        AND s.active = 1
    ) OR EXISTS (
      SELECT 1
      FROM rbac_platform_owner o
      JOIN rbac_roles r ON r.id = o.role_id
      JOIN rbac_scopes s ON s.id = o.scope_id
      WHERE o.user_id = u.id
        AND r.active = 1
        AND s.active = 1
    ) THEN 'RBAC_VÁLIDO'
    ELSE 'SIN_RBAC_VÁLIDO'
  END AS estado_rbac,
  CASE
    WHEN u.activo = 1 AND u.rol = 'Admin' AND NOT EXISTS (
      SELECT 1 FROM rbac_user_role_assignments a WHERE a.user_id = u.id AND a.active = 1
    ) AND NOT EXISTS (
      SELECT 1 FROM rbac_platform_owner o WHERE o.user_id = u.id
    ) THEN 'TRANSICIÓN_LEGACY_SIN_RBAC'
    ELSE 'OTRO'
  END AS categoria
FROM usuarios u
WHERE u.activo = 1
ORDER BY u.id;
```

### 5.3 Qué validar después de esa consulta

- Si un usuario tiene `activo=1` y no tiene asignación RBAC válida: está en riesgo de no producir permisos.
- Si un usuario tiene `activo=1` y `rol='Admin'` pero ninguna asignación RBAC: corresponde a la transición legacy y debe resolverse por conciliación explícita.
- Si tiene asignación RBAC pero el scope/role no está activo o es inválido: requiere corrección de datos o re-asignación.

### 5.4 Evidencia técnica de la fuente de verdad

La validación de permisos se hace en la carga del subject completo, con unión a `rbac_user_role_assignments` y `rbac_platform_owner`, y validación de rol y scope activos.[src/rbac/rbac-authorization.service.ts:26-87]

La migración de consolidación exige exactamente que para considerar una cuenta funcional existan roles y ámbitos activos y no puedan quedar en estado de compatibilidad vaga.[src/database/migrations/1794312002000-UnifyUserRoleAssignments.ts:18-81]

---

## 6. Diferenciación clara de los tres tipos de problema

### 6.1 Credenciales desconocidas / contraseña no disponible

Se presenta cuando el usuario existe y está activo, pero no se dispone de la contraseña correcta y no hay proceso seguro de recuperación. Esto no se resuelve reusing passwords, ni descifrando el hash. Debe manejarse con restablecimiento seguro de credenciales por administración.

Evidencia:

- `password_hash` está presente en la entidad y se compara con bcrypt en login.[src/users/entities/user.entity.ts:15-39], [src/auth/auth.service.ts:14-31]
- No hay flujo de recuperación seguro documentado en el código inspeccionado.

### 6.2 Cuenta inactiva

Se presenta cuando `usuarios.activo = false` y el backend rechaza la identidad antes de validar la contraseña. La resolución es habilitación administrativa con validación y auditoría; no se debe reactivar sin control.

Evidencia:

- `AuthService.validateUser()` devuelve `null` si `!user || !user.activo`.[src/auth/auth.service.ts:14-31]
- `UsersService.setActive()` gestiona activación/desactivación con validaciones de reinado y de último admin activo.[src/users/users.service.ts:99-129]

### 6.3 Permisos insuficientes / acceso denegado

Se presenta cuando el usuario tiene credenciales válidas, está activo, pero no tiene asignación RBAC válida para el módulo o scope requerido. Aquí el login puede funcionar y el JWT emitirse, pero los módulos exigen permisos y los mismos no existen.

Evidencia:

- `AuthorizationGuard` y `PermissionGuard` cargan permisos a partir del contexto RBAC para cada route.[src/rbac/authorization.guard.ts:18-60]
- `RbacAuthorizationService.loadSubject()` realiza `SELECT ... FROM rbac_user_role_assignments ... UNION ALL ... FROM rbac_platform_owner ...` para construir subject y permissions.[src/rbac/rbac-authorization.service.ts:26-87]

---

## 7. Diseño de conciliación segura de roles legacy hacia RBAC

### 7.1 Principio rector

La política de acceso debe ser una sola fuente de verdad: RBAC. `usuarios.rol` queda como compatibilidad histórica y solo como dato informativo, no como autorización efectiva.

### 7.2 Objetivo de la conciliación

Reconstruir para cada usuario activo una asignación RBAC válida que asegure:

- rol activo;
- scope activo;
- permisos activos en el códigode la ruta;
- scope global, regional o de módulo según el caso;
- sin dejar cuentas “existen pero no pueden navegar”.

### 7.3 Reglas de conciliación recomendadas

1. Cargar la lista de usuarios activos y sus roles legacy.
2. Para cada usuario que tenga `rol='Admin'`, crear la asignación RBAC explícita con permiso global o de administración según el ámbito real.
3. Para usuarios con perfiles funcionales (`Comercial`, `Logistica`, `Planta`, `Calidad`), mapear a roles RBAC relevantes con scope normalizado.
4. Verificar que el scope final existe y está activo.
5. Evitar sobrerescribir titularidad técnica de `rbac_platform_owner` sin validación explícita.
6. Registrar auditoría de la operación con actor responsable y versión anterior.

### 7.4 Criterio de validación de reconciliación

Se considerará conciliación correcta solo si:

- todos los usuarios activos tienen un `subject` RBAC válido;
- la sesión devuelve `permissions` no vacíos para el usuario relevante;
- la ruta administrativa no depende de `usuarios.rol`;
- el paso de migración no deja ningún usuario activo sin permisos ni sin scope válido.

### 7.5 Evidencia de la obligación de no depender de `usuarios.rol`

La migración 1794312002000 marca explícitamente: “RBAC remains authoritative. All assignment writes use rbac_set_user_roles.”[src/database/migrations/1794312002000-UnifyUserRoleAssignments.ts:1-10]

La migración de bridge legacy también indica: “One-time explicit transition; never infer runtime privileges from usuarios.rol.”[src/database/migrations/1794398400000-BridgeLegacyUserAdministration.ts:1-8]

---

## 8. Mecanismo administrativo para restablecer contraseñas con seguridad

### 8.1 Principio de diseño

No se deben reutilizar contraseñas antiguas ni revelar hashes. El mecanismo correcto es:

1. autenticación del administrador responsable;
2. verificación de identidad y autorización por RBAC;
3. generación de contraseña temporal de un solo uso;
4. cambio obligatorio de contraseña posterior a inicio de sesión;
5. invalidación de sesiones previas para la cuenta afectada;
6. auditoría del evento.

### 8.2 Flujo recomendado

- Admin autenticado con permiso de administración de identidad y RBAC global.
- Solicitud de restablecimiento a una cuenta existente.
- Revisión del usuario destino y su estado `activo`.
- Generación de token de reset de un solo uso con expiración corta.
- Contraseña temporal solo para primera sesión, con cambio obligatorio.
- Invalidación de JWTs activos de la cuenta objetivo.
- Registro de operación con usuario actor, usuario afectado, timestamp y motivo.

### 8.3 Requisitos de seguridad

- nunca usar contraseña por defecto universal;
- nunca desactivar la validación de complejidad;
- nunca enviar contraseña temporal por email sin verificación de identidad adicional;
- usar auditoría y trazabilidad;
- permitir la revocación del token ante sospecha;
- proteger la operación contra escalamiento de privilegios.

### 8.4 Evidencia del punto de integración operacional

El servicio de usuarios y el controlador ya contienen el punto de cambio de contraseña y activación/desactivación; ahí debe añadirse la lógica segura de restablecimiento bajo permisos RBAC.[src/users/users.service.ts:87-129], [src/users/users.controller.ts:35-67]

---

## 9. Módulos, servicios, guards y pruebas que deberán modificarse

### 9.1 Módulos y servicios

- `src/auth/auth.service.ts` – validación de usuario y flujo de login.
- `src/auth/auth.controller.ts` – inicio de sesión y auditoría de login.
- `src/auth/jwt.strategy.ts` – validación de JWT y usuario activo.
- `src/users/users.service.ts` – gestión de identidad, activación, cambio de contraseña.
- `src/users/users.controller.ts` – endpoints de identidad y administración.
- `src/users/user-roles.service.ts` – gestión de asignaciones y RBAC en usuario.
- `src/rbac/rbac-authorization.service.ts` – carga de subject y permisos.
- `src/rbac/authorization.guard.ts` – validación de permisos y autorización por request.
- `src/common/guards/roles.guard.ts` – compatibilidad legacy para rutas aún no migradas.

### 9.2 Migraciones y soporte de datos

- `src/database/migrations/1794312002000-UnifyUserRoleAssignments.ts` – la fuente normativa del modelo de RBAC y la validación de asignaciones.
- `src/database/migrations/1794398400000-BridgeLegacyUserAdministration.ts` – la transición explícita de administración legacy.

### 9.3 Pruebas que deberían revisarse o añadirse

- `src/auth/auth.security.spec.ts` – cubre JWT y validación de usuario activo.
- `src/users/users.service.spec.ts` – cubre casos de activación/desactivación y admins activos.
- `src/rbac/authorization.guard.spec.ts` – cubre guardias y rutas de autorización.
- `src/common/guards/roles.guard.spec.ts` – cubre compatibilidad legacy.

---

## 10. Procedimientos de respaldo, verificación previa y reversión

### 10.1 Respaldos previos

Antes de iniciar la conciliación de usuarios, se recomienda:

1. exportar la tabla `usuarios` y los datos de RBAC (`rbac_user_role_assignments`, `rbac_platform_owner`, `rbac_roles`, `rbac_scopes`);
2. guardar una instantánea de la tabla de auditoría;
3. registrar la versión del código y la migración actual;
4. comprobar que la exportación no incluya secretos ni hashes sensibles en el paquete reportado;
5. documentar el actor responsable y el rango de usuarios a modificar.

### 10.2 Validación previa

Antes de aceptar la corrección, deben cumplirse estas validaciones:

- identidad única por email;
- usuarios activos listados con estado RBAC;
- no se modifica ninguna cuenta sin aprobación administrativa;
- el usuario responsable debe estar autenticado con permisos de administración global;
- se debe reconocer la diferencia entre “usuario activo” y “usuario con acceso funcional”;
- la ruta de recuperación admin debe estar probada con un caso de no autorización y un caso de éxito.

### 10.3 Reversión segura

Si la conciliación falla, la reversión debe ser:

- controlada por una copia de seguridad y un script de restauración de roles y permisos;
- limitada al conjunto de usuarios afectados;
- documentada con identidad del actor y motivo;
- ejecutada solo si la autenticación administrativa sigue intacta;
- validada con una prueba ejecutada en lectura antes de restaurar una cuenta recargada.

---

## 11. Fases de implementación

### Fase 0 — Diagnóstico y validación de inventario

Objetivo: distinguir usuarios activos, admin legacy y usuarios con acceso real.

- Revisión de inventario de usuarios activos al momento de la corrección.
- Consulta de solo lectura para evaluar asignación RBAC.
- Comprobación de `activo`, `rol`, `scope` y permisos.
- Criterio de aceptación: listado y clasificación completos.
- Riesgo: omitir usuarios no visibles por migración parcial.

### Fase 1 — Corrección de estado de identidad

Objetivo: eliminar cuentas “activas pero sin acceso funcional”.

- Reconciliar usuario con RBAC válido.
- Reasignar roles y scope de forma explícita.
- No tocar la contraseña de usuarios sin aprobación.
- Criterio de aceptación: sin usuarios activos sin RBAC válido.
- Riesgo: sobreescritura de titularidad técnica.

### Fase 2 — Revisión de compatibilidad legacy

Objetivo: dejar `usuarios.rol` como indicador visual, no como autorización efectiva.

- Validar que las rutas protegidas dependan de RBAC y no de legacy role.
- Revisión de `RolesGuard`, `AuthorizationGuard` y de controllers still using legacy checks.
- Criterio de aceptación: todas las rutas relevantes pasan por permisos explícitos y scope.
- Riesgo: rutas antiguas sin migración quedan protegidas inconsistente.

### Fase 3 — Recuperación admin segura

Objetivo: restablecer acceso sin comprometer seguridad.

- Implementar reset de contraseña con token de un solo uso.
- Validar admin y registrar auditoría.
- Invalidar sesiones viejas del usuario destino.
- Criterio de aceptación: reset administrativo funciona y no abre escalamiento de privilegios.
- Riesgo: almacenamiento inseguro del token o no invalidación de sesiones.

### Fase 4 — Verificación funcional y prueba de regresión

Objetivo: asegurar que los usuarios regresan a un estado funcional sin romper acceso existente.

- Login por usuarios activos.
- Verificación de permisos por módulo.
- Validación de sesión y scope para usuarios normales y administradores.
- Criterio de aceptación: los usuarios correctos inician sesión y tienen acceso al módulo correspondiente.
- Riesgo: falsos positivos al validar solo login y no permisos.

---

## 12. Hipótesis pendientes de verificar con datos reales

Las siguientes conclusiones se consideran hipótesis razonables, pero requieren corroboración con inventario y metadatos de producción antes de adoptar la corrección como definitiva:

1. El problema se concentra en usuarios activos con `rol='Admin'` o perfiles legacy que no fueron migrados completamente a RBAC. La evidencia disponible lo sugiere, pero no se ha validado con una consulta de inventario sobre todos los usuarios del entorno real.[src/database/migrations/1794398400000-BridgeLegacyUserAdministration.ts:6-47]
2. El usuario con ID 1 probablemente quedó cubierto por la transición legacy o por bootstrap inicial, mientras otros usuarios quedaron sin `rbac_user_role_assignments` o `rbac_platform_owner` válidos. Esta hipótesis coincide con las migraciones y con el patrón de comportamiento observado, pero requiere comprobación de datos en producción.[src/database/migrations/1794312002000-UnifyUserRoleAssignments.ts:18-81]
3. No se observa una condición literal `user.id === 1` en código activo; sin embargo, la exclusividad funcional del usuario 1 puede deberse a que fue el único usuario habilitado de forma efectiva durante la transición de administración legacy. Esta conclusión requiere verificación sobre el conjunto real de usuarios activos y sus asignaciones RBAC.[src/rbac/rbac-authorization.service.ts:26-87]

## 13. Decisiones que requieren aprobación explícita

Antes de ejecutar la corrección real, deben aprobarse estas decisiones:

1. ¿Se debe aplicar reconciliación automática a todos los usuarios activos, o solo a los usuarios con rol administrativo y a los que fallan en RBAC?
2. ¿Se debe realizar la corrección en una ventana de mantenimiento o durante un proceso controlado con acceso limitado?
3. ¿Se debe permitir la recuperación administrativa por contraseña temporal de un solo uso o se prefiere reset con enlace de verificación y cambio obligatorio?
4. ¿Se debe invalidar todas las sesiones del usuario afectado al restablecer contraseña o solo las más recientes?
5. ¿Se requiere revisión de todos los módulos y rutas legacy antes de remover o desactivar compatibilidad de roles?
6. ¿Se debe registrar el proceso en la auditoría de seguridad con responsables y justificantes por usuario?

---

## 14. Conclusión

El problema real no es que únicamente el usuario 1 haya sido privilegiado por un `if (user.id === 1)` visible; la evidencia del código muestra una separación funcional clara entre identidad y autorización, con una fuente de verdad RBAC y una capa legacy que puede dejar usuarios activados sin permisos efectivos. La corrección debe enfocarse en tres puntos: reconciliación de usuarios activos con RBAC válido, recuperación administrativa segura de credenciales y validación de permisos a nivel de scope y módulo.

La solución segura es disciplinada y gradual, no improvisada: empezar por inventario, después reconciliación, luego reset administrativo y finalmente validación funcional por módulo y scope.
