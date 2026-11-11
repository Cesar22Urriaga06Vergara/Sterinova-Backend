> **Referencia del piloto, no matriz organizacional definitiva.** El [estado implementado](estado-implementado.md) precisa las extensiones a anulación/tasas y la restricción especial por código de rol. El [diseño objetivo](roles-y-permisos.md) reconcilia los ocho módulos. Las afirmaciones de ejecución local siguientes son reportes históricos, no verificaciones de esta entrega.

# Contrato central de autorización RBAC

Fecha: 8 de noviembre de 2026. Decisiones aprobadas durante la auditoría de Sterinova.

## Estado de esta entrega

El piloto RBAC está integrado exclusivamente en Cotizaciones: cargador servidor de concesiones,
`@RequirePermission` por endpoint y filtros SQL por ámbito/creador. Las rutas y métodos HTTP se conservan.
`AuthorizationGuard` despacha los controladores marcados con `@ScopedPermissions()` al nuevo guard;
el resto mantiene `RolesGuard`. Una denegación RBAC nunca se reintenta con el guard antiguo.
Las dos migraciones RBAC y la conciliación autorizada se aplicaron únicamente a la base local de desarrollo.
`synchronize` y `migrationsRun` permanecen desactivados. La Fase 1 completa sigue pendiente:
proyecciones operativas, otros módulos, gestión de accesos y frontend por capacidades.
Véase el [reporte del piloto](../archivo/2026-11-10/estado-proyecto/piloto-cotizaciones-rbac-2026-11-08.md).

## Decisión de acceso

- La entrada es un sujeto autenticado cargado por el servidor, un permiso concreto y el ámbito persistido del recurso.
- Un sujeto contiene su ID/estado y asignaciones activas de rol, cada una con su ámbito y concesiones.
- Cada concesión conserva unidos permiso, ámbito, acceso `OWN`/`SCOPE` e inclusión explícita de descendientes.
- El resultado compilado contiene ámbitos con acceso completo y ámbitos limitados al creador.
- Se deniega por defecto: sesión ausente, usuario/rol/asignación/permiso/ámbito inactivo, permiso desconocido,
  recurso sin ámbito, jerarquía inválida o concesión insuficiente.
- `OWN` exige a la vez pertenencia al ámbito autorizado y coincidencia del ID del creador.
- Los ámbitos hijos no otorgan acceso a su padre ni a sus hermanos. Un ancestro inactivo invalida su rama.
- No se combinan el permiso de una asignación y el ámbito de otra. No existen comodines ni bypass por nombres de rol.
- Los filtros SQL deberán aplicar las mismas restricciones antes de paginar, contar o devolver registros.
  Un cliente HTTP nunca construye el sujeto ni la jerarquía confiable.

## Modelo relacional

| Tabla                        | Responsabilidad                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `rbac_scopes`                | Ámbitos GLOBAL, DEPARTMENT, TEAM y PLANT; padre, clave única y estado. Un único ámbito global.     |
| `rbac_scope_closure`         | Ancestro/descendiente/profundidad con clave compuesta; incluye la relación reflexiva.              |
| `rbac_roles`                 | Roles configurables; clase STANDARD o PLATFORM, sin enum de nombres de rol.                        |
| `rbac_permissions`           | Catálogo de acciones implementadas, módulo, etiqueta y estado.                                     |
| `rbac_role_permissions`      | Rol/permiso, restricción OWN o SCOPE e inclusión de descendientes.                                 |
| `rbac_user_role_assignments` | Usuario/rol/ámbito único; múltiples asignaciones por usuario. Solo roles y ámbitos ordinarios.     |
| `rbac_platform_owner`        | Titular global único; referencia usuario, rol PLATFORM y ámbito GLOBAL mediante claves compuestas. |

Las claves foráneas no eliminan asignaciones en cascada. Un rol PLATFORM no puede asignarse por la tabla ordinaria;
la titularidad global tiene una sola fila posible. El motor evalúa sus permisos explícitos igual que los demás.
Los índices cubren usuario/activo, ámbito/activo/rol, y ambos sentidos del cierre jerárquico.
Los ciclos de jerarquía se rechazan en el motor y deberán prevenirse al gestionar ámbitos; no se usa un CHECK
contra el ID autoincremental, incompatible con MariaDB 10.4.

## Matriz inicial

Las migraciones de esquema crean plantillas sin asignar usuarios. Todas las concesiones salvo las indicadas son SCOPE
en el ámbito exacto. Los permisos son acciones técnicas estables; crear roles nuevos no exige cambiar código.

| Rol inicial         | Permisos                                                                                                  | Alcance                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `superadmin`        | Todos los permisos del catálogo inicial, enumerados expresamente.                                         | GLOBAL y descendientes; solo titular de plataforma.                                            |
| `admin_area`        | `usuarios.ver`, `asignaciones.gestionar`.                                                                 | Ámbito asignado y descendientes. No incluye negocio, identidades globales ni edición de roles. |
| `comercial`         | Clientes: ver/crear/editar/importar. Cotizaciones: ver/crear/editar/eliminar/previsualizar/descargar/aceptar. | Cotizaciones: ver/editar/eliminar/previsualizar/descargar/aceptar requiere OWN dentro del ámbito exacto. Crear usa el ámbito autorizado. |
| `emisor_comercial`  | `cotizaciones.emitir`.                                                                                    | Ámbito exacto; puede combinarse con otros roles.                                               |
| `logistica`         | Ver cotizaciones disponibles operativas y ver/crear/cambiar estado de órdenes.                            | Ámbito operativo exacto; sin permiso de consulta comercial.                                    |
| `planta`            | Ver órdenes y ciclos; crear ciclos.                                                                       | Ámbito operativo exacto.                                                                       |
| `calidad`           | Ver ciclos, aprobar/rechazar; ver/descargar certificados.                                                 | Ámbito operativo exacto.                                                                       |
| `auditor_calidad`   | Ver ciclos, certificados y auditoría.                                                                     | Ámbito exacto; sin mutaciones.                                                                 |
| `gestor_documental` | Ver/crear/editar/eliminar formatos, crear/editar/publicar versiones y ver/crear/editar/desactivar sellos. | Ámbito exacto.                                                                                 |

Los permisos `roles.gestionar`, `ambitos.gestionar` y `usuarios.identidad.gestionar` quedan inicialmente solo
en el rol de plataforma. `admin_area` no puede asignarse permisos que no le hayan sido delegados, roles PLATFORM
ni ámbitos ajenos. La API de gestión deberá comprobar esa delegación: el evaluador de lectura de recursos no
autoriza por sí solo a conceder roles. Desactivar una pertenencia no equivale a desactivar globalmente al usuario.

## Migración y activación

### Solicitudes de anulación (Módulo 1)

La migración `AddCancellationPermissions1794225604000` agrega los permisos
`solicitudes_anulacion.crear`, `solicitudes_anulacion.aprobar` y
`solicitudes_anulacion.ver`, con `is_dynamic = true`. Otorga los tres a
`superadmin` y `admin_area` mediante concesiones explícitas; no introduce herencia
entre roles. `comercial` recibe únicamente `crear`, con acceso OWN.

Los endpoints requieren JWT y el permiso de cada operación:

| Método | Ruta | Permiso |
| --- | --- | --- |
| POST | `/cotizaciones/:id/solicitud-anulacion` | `solicitudes_anulacion.crear` |
| GET | `/solicitudes-anulacion/pendientes` | `solicitudes_anulacion.ver` |
| PATCH | `/solicitudes-anulacion/:id/resolver` | `solicitudes_anulacion.aprobar` |

El creador y el aprobador se toman del JWT, nunca del body. La creación acepta
`motivo`; la resolución acepta `estado` (APROBADA o RECHAZADA) y `observacion`.
Resolver y consultar pendientes requieren además una asignación activa de
`admin_area` en el ámbito exacto de la cotización, o ser el titular SuperAdmin de
plataforma. Se comprueban ámbitos y ancestros activos. `x-scope-id` limita el
ámbito seleccionado y nunca amplía el acceso. Asignar un permiso a otro rol no
elimina esta restricción de negocio.

La aprobación actualiza solicitud y cotización en una transacción con bloqueos;
la cotización queda ANULADA y no puede emitirse. El rechazo conserva su estado.
Una solicitud resuelta no admite una segunda resolución. Solo se solicita la
anulación de cotizaciones APROBADAS o EMITIDAS.

`AddScopedRbac1794096000000` agrega únicamente las siete tablas RBAC, el ámbito global, su cierre reflexivo y la matriz inicial.
No modifica tablas de negocio, no migra el enum `usuarios.rol`, no crea usuarios ni convierte Admin en SuperAdmin.
Las semillas están congeladas dentro de la migración; el código de ejecución no importa migraciones.
La migración rechaza un esquema RBAC preexistente antes de emitir DDL, para no mezclar instalaciones parciales.
MariaDB confirma DDL implícitamente: se usa `transaction = false`; si un DDL falla, revisar el esquema antes de reintentar.
`down()` se rechaza expresamente para evitar eliminar concesiones o estructura organizativa ya utilizadas.
La recuperación se hará mediante respaldo consistente o migración correctiva, nunca borrado automático de permisos.

Antes de activar: identificar explícitamente al titular por ID, asignar ámbitos a usuarios y registros,
probar acceso cruzado/ID directo y revocación, y conservar un procedimiento de recuperación.
Los registros históricos sin ámbito conocido no reciben acceso global implícito.

`ScopeQuotePilot1794096001000` añade `cotizaciones.scope_id` nullable, clave foránea e índice compuesto
por ámbito/creador/ID, y restringe las lecturas comerciales a OWN. No atribuye registros históricos.
La conciliación local se ejecuta por separado mediante `src/scripts/migrate-local-rbac-pilot.ts` con un JSON
explícito, fuera de Git. Comprueba base local, identidad del titular y roles; aplica asignaciones y atribuciones
en una transacción auditada e idempotente. No contiene IDs de usuarios de desarrollo en la lógica.

## Contrato HTTP del piloto

- Cada endpoint declara una acción: ver, crear, editar, eliminar, previsualizar, emitir o descargar.
  El permiso `cotizaciones.aceptar` sigue en el catálogo; no se inventa un endpoint en este hito.
- Las concesiones vigentes se consultan por solicitud; el nombre de rol del JWT no concede acceso al piloto.
- Listado, detalle, edición, eliminación, previsualización, emisión y descarga filtran en SQL.
  Un ID fuera del ámbito/propiedad devuelve 404; ausencia de concesión devuelve 403; sin sesión devuelve 401.
- El creador se obtiene de la sesión. El ámbito se selecciona únicamente entre concesiones válidas.
  `x-scope-id` puede acotar las solicitudes y es obligatorio al crear cuando existen varios ámbitos elegibles.
  Con un solo ámbito se selecciona automáticamente. GLOBAL no es un ámbito de creación de documentos.
- SuperAdmin conserva lectura global por concesiones explícitas. Emisor Comercial puede emitir dentro de
  su ámbito exacto; esa concesión no amplía sus permisos OWN de consulta comercial.
- Los demás módulos conservan su modelo anterior, incluidos sus riesgos conocidos. Este piloto no corrige
  todavía proyecciones operativas ni reglas completas del ciclo de vida de documentos.

## Fronteras y casos de abuso

No confiar en rol, ámbito activo ni ID de creador recibidos del navegador. Obtener el ámbito del recurso de su
registro persistido. Probar usuario multirrol que intenta trasladar un permiso a otro equipo, Admin de otra área,
rol renombrado, concesión desactivada, creador fuera de ámbito y titular global sin permiso explícito.
Los datos operativos serán proyecciones permitidas por tarea; un permiso de Planta no autoriza datos financieros.

## Verificación

Las pruebas de política ejercitan decisiones con sujetos/ámbitos en memoria. Las pruebas del esquema verifican
metadatos TypeORM, semillas, preflight y límites de la migración sin conectar a la base de trabajo.
La integración real está separada: `npm run test:rbac:schema` requiere un servidor desechable en loopback,
`RBAC_TEST_DISPOSABLE_SERVER=1`, `RBAC_TEST_PORT` distinto de 3306 y `RBAC_TEST_PASSWORD` temporal.
No importa el DataSource de la aplicación, no carga `.env` ni usa credenciales `DB_*`.
Cada ejecución crea y elimina solamente su base aleatoria `sterinova_rbac_test_<hex>`.

En Windows, `powershell -NoProfile -File scripts/test-rbac-schema.ps1 -MariaDbBin <directorio-bin-MariaDB>`
inicializa un datadir exclusivo bajo `tmp/`, selecciona un puerto libre, genera contraseña temporal y detiene
esa instancia al terminar. No instala servicios, no usa el datadir habitual y restaura sus variables de entorno.
Al pasar las pruebas limpia únicamente ese datadir después de validar su ruta; en caso de fallo conserva sus logs.
El test comprueba el DDL real, inserciones con TypeORM, múltiples roles/ámbitos, rechazo de escalación,
unicidad de titular/global y preservación de datos de negocio. La compatibilidad con otras versiones
de MariaDB debe verificarse en el ambiente aislado correspondiente.

Opciones del helper: `-BackupFile <dump.sql>` verifica SHA-256 y restauración antes de ejecutar la cadena;
`-RunApplicationE2E` ejecuta además el flujo HTTP completo en otra base aleatoria de esa misma instancia.
Los PDFs se simulan en las pruebas HTTP: estas verifican autorización, no el render visual de Chromium.
