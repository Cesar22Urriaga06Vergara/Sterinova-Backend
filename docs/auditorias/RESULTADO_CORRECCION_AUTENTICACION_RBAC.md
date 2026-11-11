# Resultado de validación: autenticación, RBAC y recuperación de acceso

## 1. Alcance y conclusión

Se implementaron y probaron cambios de backend y frontend con usuarios y permisos ficticios. El trabajo no cambió cuentas, contraseñas ni roles reales, no ejecutó migraciones contra ninguna base de datos y no realizó despliegues.

La validación de código demuestra que perfiles sintéticos de Administración, Comercial, Logística, Planta y Calidad pueden iniciar sesión y que sus capacidades se derivan de RBAC. También demuestra que una identidad sin asignación válida no obtiene permisos de módulo. Esto no demuestra todavía la integridad de las asignaciones de usuarios existentes: para ello se requiere una base MariaDB desechable y autorizada.

## 2. Causas comprobadas y comportamiento

### Identidad frente a autorización

- `src/auth/auth.service.ts:14` valida la identidad por credenciales; `src/auth/auth.controller.ts:79` atiende el login. Credenciales desconocidas o incorrectas reciben el error de autenticación genérico, sin revelar si una cuenta existe. Las cuentas inactivas no pueden autenticarse.
- Iniciar sesión no implica tener acceso a módulos. `src/auth/auth-rbac-flow.spec.ts:140` verifica que una identidad sin asignaciones puede autenticarse, pero recibe cero permisos de módulo.
- La fuente de permisos continúa siendo RBAC, no `usuarios.rol`. `src/rbac/rbac-authorization.service.ts:55` carga las asignaciones de usuario y de plataforma; `src/rbac/rbac-authorization.service.ts:196` comprueba permisos en el ámbito asignado y documenta explícitamente que no debe inferirse autorización desde el rol legacy.
- `src/rbac/rbac-authorization.service.ts:183` valida el formato del scope y `src/rbac/rbac-authorization.service.ts:258` rechaza un scope seleccionado que no esté permitido por la política del usuario.
- Por tanto, se distinguen tres situaciones: credenciales desconocidas/incorrectas o cuenta inactiva producen rechazo de autenticación; identidad válida sin RBAC válido puede tener sesión, pero no permisos de módulos; scope fuera de las asignaciones produce denegación de autorización.

### Versión de contraseña y JWT

- `src/auth/auth.service.ts:42` incluye `password_version` en el JWT.
- `src/auth/jwt.strategy.ts:33` valida el JWT contra el usuario actual y `src/auth/jwt.strategy.ts:37` rechaza tokens sin versión numérica válida o cuya versión no coincide. Los JWT anteriores sin versión dejan de ser válidos con el despliegue de esta política; el usuario debe iniciar sesión otra vez.
- `src/users/entities/user.entity.ts:36` modela la columna `password_version`. La migración `src/database/migrations/1794413600000-AddPasswordVersion.ts:9` la agrega con valor por defecto `1`; no modifica los hashes de contraseña. El cambio de contraseña incrementa la versión y hace inválidas las sesiones previas.
- El backend nuevo requiere que ambas migraciones estén aplicadas antes de activarlo. No se añadió un fallback al esquema antiguo: desplegar primero el backend nuevo contra una base sin la columna o la tabla de tokens causaría errores de consulta.

### Restablecimiento de contraseña

- `src/users/users.controller.ts:71` expone `PATCH /users/:id/password/reset`, protegido por autorización RBAC; `src/users/user-roles.service.ts:21` comprueba la autoridad administrativa y `src/users/user-roles.service.ts:35` identifica cuentas privilegiadas para exigir controles adicionales.
- La solicitud emite un token aleatorio de un solo uso, de 32 bytes, almacena únicamente su SHA-256 y establece vencimiento de 15 minutos (`src/users/password-reset.service.ts:16`, `:19`, `:29`). El usuario establece su propia contraseña mediante `POST /auth/password/reset` (`src/auth/auth.controller.ts:113`).
- El consumo, la actualización del hash y de `password_version`, la invalidación del token y la auditoría se realizan en una transacción (`src/users/password-reset.service.ts:79`). El token no se incluye en el registro de auditoría.
- El usuario ID 1 está excluido del restablecimiento (`src/users/password-reset.service.ts:33`). Restablecer una cuenta privilegiada requiere autoridad global de identidad y gestión global de roles; una autorización de ámbito limitado no basta.
- El endpoint de cambio administrativo directo de contraseña ya no permite fijar contraseñas (`src/users/users.controller.ts:63` devuelve `410 Gone`). La respuesta segura del restablecimiento no permite recuperar la contraseña anterior ni expone hashes.
- No se identificó un servicio de correo integrado. El enlace se muestra una sola vez al administrador autorizado para su entrega por un canal seguro. El titular fija directamente su nueva contraseña con el token; no se necesita una contraseña temporal ni un indicador adicional de cambio forzado.

## 3. Archivos modificados

### Backend

- Autenticación/JWT: `src/auth/auth.controller.ts`, `src/auth/auth.security.spec.ts`, `src/auth/auth-rbac-flow.spec.ts`, `src/auth/jwt.strategy.ts`.
- Usuarios, roles y recuperación: `src/users/users.controller.ts`, `src/users/users.service.ts`, `src/users/users.service.spec.ts`, `src/users/users-rbac.spec.ts`, `src/users/user-roles.service.ts`, `src/users/user-roles.security.spec.ts`, `src/users/users.module.ts`.
- Nuevos componentes: `src/users/password-reset.service.ts`, `src/users/password-reset.service.spec.ts`, `src/users/entities/password-reset-token.entity.ts`, `src/users/dto/complete-password-reset.dto.ts`.
- Migraciones y registro: `src/database/entities.ts`, `src/database/migration-registry.ts`, `src/database/migrations/1794413600000-AddPasswordVersion.ts`, `src/database/migrations/1794413600000-AddPasswordVersion.spec.ts`, `src/database/migrations/1794413660000-CreatePasswordResetTokens.ts`.
- Prueba con perfiles ficticios: `test/rbac-users.integration-spec.ts` (no se ejecutó contra una base real).
- Se eliminó `src/users/dto/change-user-password.dto.ts`, que quedó sin consumidores al retirar el cambio administrativo directo de contraseña.

### Frontend

- Administración de usuarios y roles: `src/app/(erp)/usuarios/page.tsx`, `src/app/(erp)/usuarios/UserDialogs.tsx`, `src/app/(erp)/usuarios/UsersTable.tsx`.
- Restablecimiento: `src/app/reset-password/page.tsx`.
- Navegación y errores: `src/lib/navigation.ts`, `src/lib/api-errors.ts`.
- Pruebas: `tests/api-errors.test.mjs`, `tests/phase3-critical-flows.test.mjs`, `tests/sidebar-navigation.test.mjs`.

## 4. Funcionalidades corregidas

- Los permisos de rutas, navegación y acciones de administración se calculan con permisos RBAC efectivos, no con el rol legacy.
- La gestión muestra asignaciones y scopes, señala perfiles/asignaciones inactivos y detecta usuarios sin asignación RBAC.
- Crear usuarios requiere los permisos de identidad y asignaciones necesarios; las asignaciones se validan contra roles y scopes permitidos y sus cambios conservan las protecciones RBAC existentes.
- Los errores 401 y 403 tienen mensajes diferenciados en el frontend (`src/lib/api-errors.ts:42`).
- Se agregó una página para que el titular complete el restablecimiento desde un enlace de un solo uso. Los JWT obsoletos se rechazan.
- Las pruebas de flujo usan identidades sintéticas de Administración, Comercial, Logística, Planta, Calidad, sin rol, con rol inactivo, con scope inválido e inactiva. No otorgan privilegios administrativos a usuarios normales.

## 5. Migraciones: estado, orden y reversión

Las migraciones están registradas en orden: `src/database/migration-registry.ts:52-53`.

1. `1794413600000-AddPasswordVersion.ts`: agrega `usuarios.password_version` con `NOT NULL DEFAULT 1`; el `down` elimina la columna (`:9-15`).
2. `1794413660000-CreatePasswordResetTokens.ts`: crea la tabla de tokens y su `down` la elimina (`:6-23`).

Las pruebas de migración usan un `QueryRunner` simulado y verifican SQL, registro y orden; **no equivalen a aplicar las migraciones a MariaDB ni prueban allí la conservación de usuarios o hashes**. No había una base desechable autorizada/configurada (`RBAC_TEST_DISPOSABLE_SERVER=1` y servidor de pruebas ausentes). No se usó la conexión de `.env`.

**Orden requerido para una futura base de pruebas o despliegue autorizado:** respaldo verificable; aplicar primero ambas migraciones; validar el esquema y los valores; solo entonces activar el backend nuevo. Tras la activación, tokens anteriores sin `password_version` requerirán nuevo login.

**Reversión:** detener el uso del flujo nuevo antes de revertir. La reversión de la tabla invalida enlaces pendientes y elimina tokens activos; la reversión de `password_version` solo se debe hacer después de volver a una versión del backend que no consulte esa columna. En caso de rollback de aplicación, se recomienda conservar inicialmente las adiciones de esquema y revertirlas únicamente en una ventana separada, después de confirmar compatibilidad y respaldos.

## 6. Pruebas ejecutadas

Los siguientes resultados corresponden a las ejecuciones registradas durante esta implementación:

| Proyecto | Comando | Resultado |
|---|---|---|
| Backend | `npm run build` | Aprobado. |
| Backend | `npm test -- --run src/auth/auth-rbac-flow.spec.ts src/auth/auth.security.spec.ts src/users/password-reset.service.spec.ts src/users/user-roles.security.spec.ts src/users/users.service.spec.ts src/users/users-rbac.spec.ts src/database/migrations/1794413600000-AddPasswordVersion.spec.ts` | 7 archivos y 49 pruebas aprobadas. |
| Backend | `npm run lint` | Aprobado; una advertencia preexistente en `src/pdf/pdf-generator.service.ts`. |
| Backend | `npm test` | 340 aprobadas, 2 omitidas y 3 fallidas. Dos fallos PDF reportaron `ReferenceError: materiales is not defined`; `bootstrap-admin` excedió el timeout bajo la carga completa. Sus 3 pruebas pasaron al ejecutarse aisladas. |
| Frontend | `npm run lint` | Aprobado. |
| Frontend | `npm test` | 64 pruebas aprobadas. |
| Frontend | `npm run build` | Aprobado. |

Las pruebas enfocadas de autenticación/RBAC cubren perfiles ficticios, credenciales incorrectas, cuenta inactiva, sesión sin permisos, JWT inválido/expirado/obsoleto y scopes ajenos. Las pruebas de reset cubren emisión, almacenamiento del hash, expiración, un solo uso, auditoría, invalidación y autorización de cuentas privilegiadas.

**No ejecutado:** pruebas HTTP integrales contra MariaDB, las migraciones en un servidor temporal y un E2E de navegador conectado a una instancia del backend. La prueba de integración preparada requiere un servidor desechable autorizado.

## 7. Estado del frontend e integración

El frontend existente se actualizó sin crear un segundo módulo de administración. La navegación y las acciones se filtran por permisos RBAC, el administrador autorizado puede consultar usuarios/asignaciones e iniciar el reset, y el titular puede enviar la nueva contraseña desde el enlace. El frontend no sustituye la autorización del backend.

Las pruebas automatizadas y el build de frontend pasaron. No se realizó una prueba E2E visual o HTTP contra un backend y una base activos.

## 8. Procedimiento seguro de recuperación de usuarios existentes

1. Confirmar la identidad del solicitante y que posee permisos RBAC globales para administrar identidades.
2. Verificar que la cuenta objetivo es la correcta y que el administrador tiene ámbito suficiente. Para cuentas privilegiadas, verificar también autorización global para gestión de roles. El ID 1 no puede usar este flujo.
3. Solicitar el restablecimiento desde la administración. El backend emite un token de un solo uso con expiración de 15 minutos; solo se entrega una vez.
4. Compartir el enlace únicamente mediante un canal seguro acordado con el titular. No registrar ni enviar el token por canales públicos.
5. El titular establece una contraseña nueva desde el formulario de restablecimiento. La operación consume el token y actualiza contraseña, versión de contraseña y auditoría atómicamente.
6. El titular inicia sesión con la nueva contraseña. Las sesiones previas quedan invalidadas; los enlaces vencidos o ya usados no se aceptan.

La contraseña anterior no puede recuperarse ni descifrarse. No se utilizan contraseñas temporales compartidas.

## 9. Respaldo, validación previa y control operativo

Antes de probar las migraciones en un entorno futuro:

1. Confirmar por escrito que el servidor es de pruebas y desechable; no reutilizar la configuración de producción ni inferir autorización a partir de `.env`.
2. Tomar un respaldo cifrado y con acceso restringido de la base de pruebas; restaurarlo en otra base aislada para comprobar que es recuperable.
3. Registrar conteos agregados previos (usuarios, asignaciones activas, roles y scopes), sin exportar contraseñas, hashes, tokens ni datos personales al informe.
4. Aplicar las migraciones únicamente a esa base, comprobar la columna/tabla y comparar conteos agregados. Verificar que los hashes no cambian comparando únicamente huellas calculadas en el entorno de pruebas, sin registrarlas en el informe.
5. Ejecutar pruebas de login, RBAC y reset con datos ficticios; mantener el backend nuevo apagado si falta cualquiera de las tablas/columnas.
6. Conservar evidencia de resultados y el respaldo hasta completar la validación. En caso de fallo, detener pruebas, restaurar la base desechable y documentar el error; nunca corregir con escrituras manuales sobre cuentas reales.

No se creó ni restauró un respaldo durante este trabajo, ya que no se ejecutaron cambios de base de datos.

## 10. Riesgos pendientes y aprobaciones requeridas

- No se ha comprobado el esquema/migraciones en MariaDB real de pruebas ni la conservación efectiva de hashes mediante una comparación pre/post.
- La actualización del backend debe coordinarse con las dos migraciones; el esquema antiguo no es compatible con el código nuevo.
- Los JWT previos sin versión serán rechazados al activar la nueva versión; se requiere comunicar el nuevo inicio de sesión.
- No se identificó proveedor de correo para entregar enlaces de reset automáticamente; hasta que exista uno, la entrega debe gestionarse manualmente por un canal seguro.
- La suite completa de backend mantiene los tres fallos descritos; los fallos PDF no se abordaron porque están fuera del alcance de autenticación/RBAC. Investigar las regresiones o el timeout requiere una tarea separada.
- La condición real de usuarios activos, sus asignaciones y scopes no se ha consultado ni conciliado.

Requieren aprobación explícita antes de ejecutarse: conectar o aprovisionar un servidor de pruebas no configurado; aplicar migraciones fuera de una base desechable; modificar cuentas, credenciales o roles reales; procesar la cuenta ID 1; realizar cambios privilegiados o en producción; desplegar.

**No se ejecutaron** migraciones, restablecimientos reales, conciliaciones, cambios sobre usuarios o permisos reales, ni despliegues o commits automáticos.
