# Auditoría de roles, permisos y vistas

> Fecha de revisión: 20 de noviembre de 2026. Alcance: código fuente de `Sterinova-Backend` y `SterinovaFrontend`. Esta auditoría es estática: no consulté una base desplegada, asignaciones reales, usuarios ni respuestas HTTP de un ambiente activo. Los roles disponibles en código no prueban que una migración esté aplicada ni que un usuario tenga una asignación.

## 1. Resumen

- El backend combina JWT, un `AuthorizationGuard` global con política fail-closed, permisos RBAC y ámbitos. No encontré controladores protegidos mediante `@Roles`; las rutas privadas usan `@RequirePermission` o `@RequireSession`.
- No encontré endpoints privados sin política efectiva. Las excepciones públicas son expresas: login, restablecimiento de contraseña con token, health checks y validación pública de certificados con token. Las rutas sin política en controladores marcados `@ScopedPermissions()` se deniegan.
- El frontend no usa el nombre del rol como autorización de interfaz. Obtiene `/auth/me` y compara la lista de permisos para filtrar navegación, permitir vistas y mostrar acciones. Esos controles son de UX; el backend debe conservar la decisión final y el filtro por ámbito/propiedad.
- Hay brechas de correspondencia verificables entre rutas/acciones y el API: activación de clientes usa `PATCH` donde el backend ofrece `PUT`; el envío de cotizaciones llama un endpoint inexistente; la página de roles/ámbitos permite entrar con permisos que no cubren todas sus llamadas; y la ruta de protocolos no tiene un permiso propio en el mapa de acceso de rutas.
- El catálogo reconoce permisos futuros que se siembran inactivos. Un permiso en TypeScript o una concesión de rol no implica que sea efectivo: el evaluador exige que el permiso y la asignación estén activos.

## 2. Modelo de autorización backend

### 2.1 Fuentes y ejecución

| Elemento | Fuente | Función observada |
|---|---|---|
| Guards globales | `src/app.module.ts` | `ThrottlerGuard`, `JwtAuthGuard` y `AuthorizationGuard` se aplican globalmente. |
| Autorización | `src/rbac/authorization.guard.ts` | Para rutas privadas requiere sesión; rutas `@ScopedPermissions()` requieren metadato explícito `@RequirePermission`. Si falta, responde 403. Sin permiso, ámbito activo o usuario válido, deniega. |
| Permiso de endpoint | `src/rbac/require-permission.decorator.ts` | Publica el código en metadatos y OpenAPI (`x-required-permission`). |
| Sesión autenticada sin acción RBAC | `src/rbac/require-session.decorator.ts` | Solo exige usuario válido y activo; no sustituye un permiso para operaciones de negocio. |
| Concesiones y ámbitos | `src/rbac/authorization-policy.ts`, `src/rbac/rbac-authorization.service.ts` | Compila grants activos por asignación; diferencia `OWN` de `SCOPE`, admite descendientes solo cuando la concesión lo indica y acota `x-scope-id`. Una asignación no toma prestado el ámbito de otra. |
| Catálogo del runtime | `src/rbac/permission-catalog.ts` | Lista identificadores que el runtime reconoce. No activa por sí mismo permisos en la base. |
| Perfiles iniciales | `src/database/migrations/1794096000000-AddScopedRbac.ts` | Define `superadmin`, `admin_area`, `comercial`, `emisor_comercial`, `logistica`, `planta`, `calidad`, `auditor_calidad`, `gestor_documental` y concesiones iniciales. |
| Perfiles funcionales | `src/database/migrations/1794312001000-SeedBackendRoles.ts` | Define otros 14 perfiles; crea los nuevos permisos de fase 1 inactivos. |
| Estado correctivo | `src/database/migrations/1794484800000-RemoveLegacyUserRole.ts`, `src/database/migrations/1794700000000-AddProductCatalog.ts`, `src/database/migrations/1794900000000-EnableGeneralManager.ts` y migraciones posteriores | Activa perfiles/permisos y ajusta grants. El estado real depende de qué migraciones haya aplicado cada ambiente. |

`@Roles`/`RolesGuard` y el enum heredado no son la fuente de acceso de estos controladores. El esquema RBAC es la fuente operativa. `superadmin` se registra como titular PLATFORM único; los perfiles estándar se asignan a ámbitos. Los nombres `Admin`, `Comercial`, etc. no forman una jerarquía de permisos por sí solos.

### 2.2 Perfiles reconocidos por las migraciones

Los perfiles funcionales creados por la migración de fase 1 se insertan inicialmente inactivos; una migración correctiva los activa. La disponibilidad efectiva debe comprobarse en la base del ambiente.

| Orden de referencia recomendado | Código / nombre | Tipo y alcance indicado en código | Concesiones principales documentadas |
|---:|---|---|---|
| 1 | `superadmin` — Titular de plataforma | PLATFORM, GLOBAL; titular único | Concesiones iniciales activas y posteriores grants explícitos. Administración técnica de roles/ámbitos/asignaciones, más capacidades de negocio concedidas explícitamente. No se hereda por nombre. |
| 2 | `admin_general` — Admin General | STANDARD; global asignable | Perfil legado amplio: la migración lo crea copiando las concesiones del `superadmin` que existían en ese momento, y agrega lectura de protocolos y recepción logística. No es una copia dinámica de futuras concesiones. Debe tratarse como perfil de privilegio crítico. |
| 3 | `gerente_general` — Gerente General | STANDARD; alcance global/descendientes asignables según migración | Lectura global gerencial y operativa, consulta de gerencia/administradores y aprobación de versiones documentales. La migración correctiva reemplaza sus grants; no lo convierte en PLATFORM. |
| 4 | `admin_comercial` — Admin Comercial | STANDARD; área y descendientes | Lectura comercial, gestión delegada de identidades/asignaciones del área, clientes y cotizaciones, aprobación interna, envío, emisión y resolución de anulaciones; conforme grants sembrados y estado activo. |
| 4 | `admin_logistica` — Admin Logística | STANDARD; área y descendientes | Operación logística, autorización de reempaque y administración delegada del área. |
| 4 | `admin_planta` — Admin Planta | STANDARD; área y descendientes | Lectura/registro de ciclos, equipos y administración delegada del área. |
| 4 | `admin_calidad` — Admin Calidad | STANDARD; área y descendientes | Operación de Calidad, gestión de protocolos/desviaciones y administración delegada del área. |
| 4 | `admin_lavanderia` — Admin Lavandería | STANDARD; área y descendientes | Consulta y registro del proceso de lavandería y administración delegada del área. |
| 5 | `asesor_comercial` — Asesor Comercial | STANDARD; grants SCOPE y OWN | Clientes y preparación comercial; editar, enviar, aceptar, emitir y solicitar anulación en los ámbitos/recursos OWN especificados. |
| 5 | `operador_logistica` — Asesor Logística | STANDARD; ámbito asignado | Consultar cotizaciones disponibles, órdenes, crear órdenes, registrar recepción/despacho y cambiar estados, sujeto a permisos activos. |
| 5 | `operario_planta` — Asesor Planta | STANDARD; ámbito asignado | Consultar órdenes/ciclos y registrar ciclos; incluye elaborar certificados según el grant de fase 1. |
| 5 | `analista_calidad` — Asesor Calidad | STANDARD; ámbito asignado | Lectura/decisión ordinaria de Calidad, certificados y operaciones incluidas en `quality`. |
| 5 | `operario_lavanderia` — Asesor Lavandería | STANDARD; ámbito asignado | Consultar órdenes y registrar proceso de lavandería. |
| 5 | `director_tecnico` — Director Técnico | STANDARD; ámbito asignado | Lectura de Calidad, gestión de protocolos, liberaciones autorizadas y aprobaciones técnicas/documentales definidas en el grant. |
| 5 | `gerente_calidad` — Gerente Calidad | STANDARD; ámbito asignado | `qualityRead`: lectura de ciclos, certificados y descarga; el nombre no concede aprobación adicional. |
| 6 | `auditor` — Auditor | STANDARD; grants de lectura y descendientes | Lectura transversal, auditoría y exportaciones comerciales/certificados indicadas en su perfil. Paralelo a la cadena de mando, sin escritura de negocio. |
| 6 | `auditor_calidad` — Auditoría de Calidad | STANDARD; ámbito asignado | Lectura de ciclos, certificados y auditoría. |
| 6 | `gestor_documental` — Gestión documental | STANDARD; ámbito asignado | Consultar/crear/editar/eliminar formatos, versiones y sellos conforme a grants activos. |
| 5 | `emisor_comercial` — Emisión comercial | STANDARD; ámbito asignado | Solo `cotizaciones.emitir`; puede componerse con otros perfiles mediante asignaciones separadas. |
| 5 | `comercial` — Comercial (perfil inicial) | STANDARD; ámbito asignado | Permisos comerciales iniciales y edición/eliminación OWN; emisión se separó en `emisor_comercial`. |
| 5 | `logistica` — Logística (perfil inicial) | STANDARD; ámbito asignado | Permisos logísticos base de lectura, creación y cambio de estado. |
| 5 | `planta` — Planta (perfil inicial) | STANDARD; ámbito asignado | Permisos iniciales de órdenes, ciclos y creación de ciclos. |
| 5 | `calidad` — Calidad (perfil inicial) | STANDARD; ámbito asignado | Permisos iniciales de Calidad y certificados. |
| 5 | `admin_area` — Administración de área | STANDARD; ámbito asignado y descendientes | `usuarios.ver`, `asignaciones.gestionar`, capacidades de cancelación y productos incorporadas por migraciones. Algunas operaciones que sugiere el perfil requieren autorización GLOBAL en el servicio y no son delegables desde un ámbito de área; ver brechas. |

El orden es una propuesta de presentación, no herencia: los perfiles no forman un árbol automático. `admin_general`, `gerente_general`, el auditor y los administradores de área tienen responsabilidades distintas y no deben ordenarse como si cada rango heredara íntegramente al anterior. Los nueve perfiles iniciales pueden coexistir con los funcionales añadidos después; el código no los elimina automáticamente.

### 2.3 Catálogo de permisos reconocido

Los siguientes códigos aparecen en `PERMISSION_CATALOG`. “Fase 1” identifica permisos que la migración `SeedBackendRoles` introduce como inactivos. La tabla no certifica el estado de la BD de producción.

| Módulo | Permisos reconocidos |
|---|---|
| Accesos/RBAC | `usuarios.ver`, `usuarios.identidad.gestionar`, `asignaciones.gestionar`, `roles.gestionar`, `ambitos.gestionar`, `usuarios.area.invitar` (Fase 1), `usuarios.area.restablecimiento.iniciar` (Fase 1). |
| Comercial — clientes | `clientes.ver`, `clientes.crear`, `clientes.editar`, `clientes.importar`, `clientes.eliminar`, `clientes.activar` (Fase 1), `clientes.inactivar` (Fase 1). |
| Comercial — catálogo | `productos.gestionar` (activado por migración de catálogo; grants para `admin_area` y `superadmin`). |
| Comercial — cotizaciones | `cotizaciones.ver`, `cotizaciones.crear`, `cotizaciones.editar`, `cotizaciones.eliminar`, `cotizaciones.previsualizar`, `cotizaciones.emitir`, `cotizaciones.descargar`, `cotizaciones.aceptar`, `cotizaciones.aprobar_interna` (Fase 1), `cotizaciones.enviar` (Fase 1), `cotizaciones.reasignar` (Fase 1), `cotizaciones.exportar` (Fase 1). |
| Comercial — anulaciones | `solicitudes_anulacion.crear`, `solicitudes_anulacion.aprobar`, `solicitudes_anulacion.ver` (permisos dinámicos de negocio; concedidos explícitamente por migración). |
| Logística | `logistica.cotizaciones_disponibles.ver`, `logistica.ordenes.ver`, `logistica.ordenes.crear`, `logistica.ordenes.cambiar_estado`, `logistica.recepciones.registrar` (Fase 1 y activado), `logistica.reempaque.autorizar` (Fase 1), `logistica.despacho.ejecutar` (Fase 1). |
| Planta | `planta.ordenes.ver`, `planta.ciclos.ver`, `planta.ciclos.crear`, `planta.protocolos.ver` (Fase 1 y activado), `planta.equipos.gestionar` (Fase 1), `planta.equipos.reactivar` (Fase 1), `planta.retroactividad.autorizar` (Fase 1), `planta.reprocesos.registrar` (Fase 1). |
| Calidad | `calidad.ciclos.ver`, `calidad.aprobar`, `calidad.rechazar`, `calidad.protocolos.gestionar` (Fase 1), `calidad.desviaciones.verificar` (Fase 1), `calidad.desviaciones.aprobar` (Fase 1), `calidad.liberacion_condicionada.autorizar` (Fase 1), `calidad.liberacion_desviacion.autorizar` (Fase 1). |
| Certificados | `certificados.ver`, `certificados.descargar`, `certificados.elaborar` (Fase 1), `certificados.verificar` (Fase 1), `certificados.aprobar` (Fase 1), `certificados.exportar` (Fase 1), `certificados.restaurar` (Fase 1), `certificados.anular` (Fase 1). |
| Auditoría | `auditoria.ver`. |
| Documentos y sellos | `formatos.ver`, `formatos.crear`, `formatos.editar`, `formatos.eliminar`, `formatos.versiones.crear`, `formatos.versiones.editar`, `formatos.versiones.publicar`, `formatos.versiones.aprobar` (Fase 1), `formatos.excepcion.autorizar` (Fase 1), `sellos.ver`, `sellos.crear`, `sellos.editar`, `sellos.desactivar`, `sellos.licencias.gestionar` (Fase 1). |
| Finanzas | `tasas_fiscales.gestionar` (activado por migración de IVA). |
| Gerencia | `gerencia.metricas.ver`, `gerencia.administradores.gestionar` (activados por migración gerencial). |
| Lavandería | `lavanderia.ordenes.ver`, `lavanderia.proceso.registrar` (Fase 1). |

La migración de fase 1 inserta una parte de los permisos con `active=0`; las concesiones de perfil no bastan para autorizarlos. Las migraciones correctivas activan solo capacidades implementadas (entre ellas recepción logística, protocolos Planta, catálogo de productos, anulaciones, IVA y gerencia). Varias capacidades futuras no tienen endpoint correspondiente aún.

### 2.4 Matriz de módulos, acciones y roles

Roles en cada fila significa “el grant está descrito en las migraciones”. La autorización final sigue dependiendo de que rol, asignación, permiso y ámbito estén activos y de la política de propiedad del recurso.

| Módulo / vista / acción | Permiso backend | Roles con grant de referencia |
|---|---|---|
| Inicio: mostrar contexto autenticado | Sesión | Cualquier usuario activo con JWT válido. |
| Consultar usuarios del ámbito | `usuarios.ver` | `superadmin`, `admin_general`, `gerente_general`, `admin_area`, administradores de área, `gerente_calidad`, `auditor`, `auditor_calidad` y perfiles funcionales a los que se conceda explícitamente. |
| Crear/editar/desactivar identidad | `usuarios.identidad.gestionar` | `superadmin`, `admin_general`; `gerente_general` tiene grant para administración delegada, pero el backend también requiere alcance GLOBAL. |
| Consultar/asignar perfiles | `asignaciones.gestionar` | `superadmin`, `admin_general`, `admin_area`, administradores de área; varios servicios vuelven a exigir GLOBAL. |
| Configurar roles y ámbitos | `roles.gestionar`, `ambitos.gestionar` | Principalmente `superadmin` y el legado `admin_general`; no se hereda por cargo. |
| Clientes: listar/detalle | `clientes.ver` | `superadmin`, `admin_general`, `gerente_general`, `admin_comercial`, `asesor_comercial`, `comercial`, `auditor`. |
| Clientes: crear/editar/importar | `clientes.crear`, `clientes.editar`, `clientes.importar` | `superadmin`, `admin_general`, `admin_comercial`, `asesor_comercial`, `comercial`; `admin_comercial` agrega descendientes. |
| Clientes: activar/inactivar | `clientes.activar`, `clientes.inactivar` | Grants de `admin_comercial`/`asesor_comercial`; permisos de fase 1. Actualmente la vista usa PATCH y el backend no declara PATCH de cliente. |
| Catálogo de productos | `productos.gestionar` | `superadmin`, `admin_general`, `admin_area` según concesiones de migración; no está concedido a `admin_comercial` por el seed de fase 1. |
| Cotizaciones: listar/detalle/previsualizar/descargar | `cotizaciones.ver`, `.previsualizar`, `.descargar` | `superadmin`, `admin_general`, `gerente_general`, `admin_comercial`, `asesor_comercial`, `comercial`, `auditor` (descarga/previsualización según perfil). |
| Cotizaciones: crear/editar/eliminar | `cotizaciones.crear`, `.editar`, `.eliminar` | `superadmin`, `admin_general`, `admin_comercial`, `asesor_comercial`, `comercial`; perfiles comerciales aplican SCOPE/OWN diferente. Borrar cotizaciones está expresamente denegado por endpoint. |
| Cotizaciones: aprobación interna | `cotizaciones.aprobar_interna` | `admin_comercial` y grants amplios del legacy `admin_general`/`superadmin`; permiso de fase 1. |
| Cotizaciones: emitir | `cotizaciones.emitir` | `superadmin`, `admin_general`, `admin_comercial`, `asesor_comercial` (OWN), `emisor_comercial`; chequeo adicional de estado del documento. |
| Cotizaciones: enviar al cliente | `cotizaciones.enviar` | Grant de fase 1 para perfiles comerciales; no existe la ruta API `/cotizaciones/:id/enviar` en el controlador actual. |
| Solicitar/resolver anulación | `solicitudes_anulacion.crear`, `.aprobar`, `.ver` | Solicitud: perfiles comerciales autorizados; resolución: `admin_comercial`, `admin_area`, `admin_general`, `superadmin`. El servicio además valida ámbito y separación creador/aprobador donde aplica. |
| Logística: cotizaciones disponibles/órdenes/estados | `logistica.*` base | `superadmin`, `admin_general`, `admin_logistica`, `operador_logistica`, `logistica`; los administradores de área tienen descendientes. |
| Logística: recepción/reempaque/despacho | `logistica.recepciones.registrar`, `.reempaque.autorizar`, `.despacho.ejecutar` | Recepción/despacho incluidos en roles de administración y operación logística; reempaque para `admin_logistica` y perfiles amplios. Recepción está activada; otros permisos de fase 1 pueden seguir inactivos. |
| Planta: órdenes/ciclos/registro de ciclo | `planta.ordenes.ver`, `planta.ciclos.ver`, `.crear` | `superadmin`, `admin_general`, `gerente_general`, `admin_planta`, `operario_planta`, `planta`, `auditor` (lectura donde concedida). |
| Planta: protocolos/equipos/retroactividad/reprocesos | `planta.protocolos.ver`, `planta.equipos.*`, `planta.retroactividad.autorizar`, `planta.reprocesos.registrar` | Lectura de protocolo en roles de lectura/Planta; gestión de equipo para `admin_planta`; retroactividad para `admin_calidad`; capacidades futuras restantes según grants y activación. |
| Calidad: revisar/aprobar/rechazar ciclos | `calidad.ciclos.ver`, `.aprobar`, `.rechazar` | `superadmin`, `admin_general`, `admin_calidad`, `analista_calidad`, `calidad`; lectura de `gerente_calidad`, `director_tecnico`, auditores. |
| Protocolos de calidad / desviaciones / liberación | `calidad.protocolos.gestionar`, `calidad.desviaciones.*`, `calidad.liberacion_*` | Grants para `admin_calidad`, `analista_calidad`, `director_tecnico` según acción; permisos de fase 1, no todos tienen rutas implementadas. |
| Certificados: consultar/descargar | `certificados.ver`, `.descargar` | Calidad, auditorías, `gerente_general`, comerciales y perfiles amplios conforme grants específicos. |
| Certificados: elaborar/verificar/aprobar/exportar/restaurar/anular | `certificados.*` | Capacidad futura, asignaciones diversas según roles de Calidad/Planta/Auditoría; no debe interpretarse como endpoint disponible sin encontrar controlador. |
| Auditoría | `auditoria.ver` | `superadmin`, `admin_general`, `gerente_general`, `auditor`, `auditor_calidad`; sujeto a ámbitos. |
| Formatos/documentos/versiones | `formatos.*` | `gestor_documental` para gestión operativa; `gerente_general` recibe aprobación de versión; `director_tecnico` tiene aprobación según su concesión; perfiles gerenciales amplios tienen lectura. |
| Sellos de certificación | `sellos.*` | `gestor_documental`; perfiles gerenciales amplios con lectura; modificaciones requieren grants explícitos. |
| Tasas fiscales/IVA | `tasas_fiscales.gestionar` | `superadmin` y cualquier otra asignación explícita activa. La vista pide este mismo permiso para lectura y publicación. |
| Métricas de gerencia | `gerencia.metricas.ver` | `gerente_general`, `superadmin`; otros solo por asignación explícita. |
| Administración de áreas | `gerencia.administradores.gestionar` | `gerente_general`, `superadmin`; endpoint dedicado, no equivale a RBAC general. |
| Operación de lavandería | `lavanderia.*` | `admin_lavanderia`, `operario_lavanderia`; los permisos están catalogados como fase 1. |

## 3. Frontend: rutas, navegación y acciones

### 3.1 Sesión y protección de vistas

`src/app/(erp)/layout.tsx` envuelve las páginas con `SessionProvider`, valida el token con `/auth/me`, redirige al login si no hay sesión y evalúa `canAccessPath`. Las rutas de cotización tienen una regla especial: `/nueva` exige `cotizaciones.crear`; las restantes rutas del subárbol exigen `cotizaciones.ver`. La autorización API no depende de este layout.

`src/lib/session.tsx` mantiene `permissions`, `capabilities`, ámbitos disponibles y ámbito actual desde `/auth/me`. El selector del `Header` puede cambiar el ámbito y volver a cargar la sesión. `src/lib/navigation.ts` filtra el Sidebar y determina el permiso requerido por ruta. `src/lib/dashboard.ts` vuelve a filtrar tarjetas de acceso. En los componentes de negocio, `can()` o comparaciones con `permissions` muestran/ocultan botones y operaciones. No encontré decisiones de autorización basadas en nombres/códigos de perfil en vistas; `profiles` se usa como dato de presentación.

### 3.2 Inventario de rutas de páginas

| Ruta frontend | Menú | Condición de ruta/acciones observada |
|---|---|---|
| `/login`, `/reset-password` | No; públicas | Flujos de acceso/recuperación. La API aplica login público y recuperación con token. |
| `/` dentro de `(erp)` | Principal, requiere sesión | Dashboard filtra secciones por permisos; el inicio en sí devuelve permitido para sesión válida aunque el usuario no tenga permisos de módulo. |
| `/comercial` | Menú Comercial implícito por enlaces | Accesos del dashboard requieren alguno de `clientes.ver`, `productos.gestionar`, `cotizaciones.ver`. |
| `/comercial/clientes` | `clientes.ver` | Acciones de crear/editar/importar por permisos; activar/inactivar se muestra con permisos dedicados de fase 1. |
| `/comercial/productos` | `productos.gestionar` | CRUD de catálogo condicionado por `productos.gestionar`. |
| `/comercial/cotizaciones` | `cotizaciones.ver` | Crear, editar, previsualizar, aprobar, emitir, enviar, descargar y solicitud de anulación usan checks de permiso en pantalla/acción. |
| `/comercial/cotizaciones/nueva` | Sin enlace propio | Layout requiere `cotizaciones.crear`. |
| `/comercial/cotizaciones/:id/editar` | Sin enlace propio | Layout requiere `cotizaciones.ver`; el formulario/CTA de edición requiere además `cotizaciones.editar`. |
| `/logistica` | `logistica.ordenes.ver` | Acciones de crear órdenes, recepción y cambio de estado verifican permisos específicos. |
| `/planta` | `planta.ordenes.ver` o `planta.ciclos.ver` | Muestra secciones de órdenes/ciclos y creación si `planta.ciclos.crear`. |
| `/planta/ciclo/nuevo` | Sin enlace propio | Ruta requiere `planta.ciclos.crear`. |
| `/calidad` | `calidad.ciclos.ver` o `certificados.ver` | Lista, revisión y certificados por permisos específicos. |
| `/calidad/revisar/:ciclo_id` | Sin enlace propio | Ruta requiere `calidad.ciclos.ver`; botones requieren aprobar/rechazar y descarga. |
| `/calidad/certificados/:id` | Sin enlace propio | Ruta requiere `certificados.ver`; descarga exige `certificados.descargar`. |
| `/calidad/protocolos` | Sin enlace Sidebar | Página requiere `planta.protocolos.ver`; botón de gestión condicional por `calidad.protocolos.gestionar`. |
| `/solicitudes` | `solicitudes_anulacion.ver` | Consulta requiere ver; resolver requiere aprobar. |
| `/usuarios` | `usuarios.ver` | Alta requiere `usuarios.identidad.gestionar` y `asignaciones.gestionar`; gestión de asignaciones requiere el segundo; botones condicionales por permiso. |
| `/administracion/roles-ambitos` | `roles.gestionar` **o** `ambitos.gestionar` | La página obtiene catálogo/asignaciones y ámbitos; ver brechas de permisos de llamadas. |
| `/configuracion/plantillas` y `/configuracion/plantillas/:id/versiones` | `formatos.ver` | Crear/editar/publicar/eliminar usan permisos de acción separados. |
| `/configuracion/sellos` | `sellos.ver` | La vista tiene acciones de modificación, aunque el control fino de permisos en algunos diálogos debe cotejarse con sus llamadas `sellos.*`. |
| `/configuracion/tasas-fiscales` | `tasas_fiscales.gestionar` | Lee/publica con el mismo permiso. |
| `/gerencia`, `/gerencia/detalle` | `gerencia.metricas.ver` | La vista filtra métricas; envía el ámbito actual como filtro cuando no es GLOBAL. |
| `/gerencia/administradores` | `gerencia.administradores.gestionar` | Administra perfiles de área mediante endpoints de gerencia; el catálogo de perfiles se obtiene desde `/users/role-catalog`. |
| `/auditoria` | `auditoria.ver` | Consulta eventos de auditoría. |
| `/internal/pdf/cotizacion`, `/internal/pdf/certificado` | No; flujo interno | No son vistas de usuario del ERP. Dependen del mecanismo interno de render y token PDF, no del menú RBAC. |

El Sidebar tiene secciones Principal, Comercial, Operación, Gestión, Documentos, Gerencia, Auditoría y Administración. La entrada de protocolos no aparece en el menú. Inicio presenta una selección reducida de tarjetas y no incluye todas las entradas del Sidebar.

## 4. Endpoints backend y controles

En la columna “control” se indica el permiso que exige el método. Los controladores marcados `@ScopedPermissions()` aplican además la denegación por defecto a un método sin permiso.

| Área / controlador | Rutas y acciones | Control |
|---|---|---|
| Inicio (`app.controller.ts`) | `GET /` | Sesión activa (`@RequireSession`). |
| Auth (`auth.controller.ts`) | `GET /auth/me`; `POST /auth/login`; `POST /auth/password/reset` | Sesión; pública con throttling; pública con token de un solo uso y throttling, respectivamente. |
| Salud (`health.controller.ts`) | `GET /health/live`, `GET /health/ready` | Públicas explícitas; liveness/readiness, sin operaciones de negocio. |
| Auditoría | `GET /auditoria` | `auditoria.ver`. |
| Clientes | `POST /clientes`, `POST /clientes/bulk`, `GET /clientes`, `GET /clientes/:id`, `PUT /clientes/:id`, `DELETE /clientes/:id` | `clientes.crear`, `.importar`, `.ver`, `.ver`, `.editar`, `.eliminar`. El servicio aplica contexto del ámbito; eliminación depende de reglas de referencias. |
| Productos | `GET/POST /productos`, `PUT /productos/:id`, `PATCH /productos/:id/estado` | `productos.gestionar`; búsquedas auxiliares `GET /productos/buscar/crear` y `/editar` exigen `cotizaciones.crear` y `.editar`. |
| Cotizaciones | `POST /cotizaciones`, `GET /cotizaciones`, `GET /cotizaciones/exportar`, `GET /cotizaciones/iva-vigente`, `GET /cotizaciones/:id`, `GET /:id/previsualizar`, `POST /:id/emitir`, `GET /:id/descargar`, `POST /:id/aprobar`, `PUT/DELETE /:id/items/:itemId/imagen`, `PUT /:id` | Crear, ver, exportar, crear, ver, previsualizar, emitir, descargar, aprobar interna, editar, editar, editar respectivamente. Todas requieren metadato. `/cotizaciones/:id` DELETE es denegado expresamente y el handler responde Forbidden. No hay ruta `/cotizaciones/:id/enviar`. |
| Anulaciones | `POST /cotizaciones/:id/solicitud-anulacion`, `GET /solicitudes-anulacion/pendientes`, `PATCH /solicitudes-anulacion/:id/resolver` | `solicitudes_anulacion.crear`, `.ver`, `.aprobar`; lógica adicional de ámbito y estado. |
| Logística | Crear orden; editar materiales; listar/consultar orden; cotizaciones aprobadas; PDF; documentos emitidos y PDF; cambiar estado | `logistica.ordenes.crear`, `logistica.recepciones.registrar`, `logistica.ordenes.ver`, `logistica.cotizaciones_disponibles.ver`, `logistica.ordenes.ver`, `logistica.ordenes.ver`, `logistica.ordenes.cambiar_estado`. |
| Recepción logística | `POST /logistica/ordenes/:id/recepcion`, listar/consultar recepciones, `PATCH /.../recepcion/estado` | Registrar recepción requiere `logistica.recepciones.registrar`; lectura `logistica.ordenes.ver`. |
| Planta | `GET /planta/protocolos`, `/ordenes`, `/ciclos`; `POST /planta/ciclos` | `planta.protocolos.ver`, `planta.ordenes.ver`, `planta.ciclos.ver`, `planta.ciclos.crear`. |
| Calidad | Consultar pendientes/ciclo; aprobar y rechazar ciclo | `calidad.ciclos.ver`, `.aprobar`, `.rechazar`. |
| Certificados | Listar/detalle/exportar/descargar; `GET /certificados/validar/:token` | `certificados.ver`, `.exportar`, `.descargar`; validación por token es pública explícita. |
| Formatos documentales | Listar/detalle/crear/editar/eliminar; crear/editar/publicar versión | `formatos.ver`, `.crear`, `.editar`, `.eliminar`, `formatos.versiones.crear`, `.editar`, `.publicar`. |
| Sellos | Listar/imagen/crear/editar/desactivar | `sellos.ver`, `.crear`, `.editar`, `.desactivar`. |
| Tasas fiscales | Consultar y publicar IVA | `tasas_fiscales.gestionar`. |
| Gerencia | Resumen/detalle y catálogo/listado/crear/asignar/quitar administradores | `gerencia.metricas.ver` y `gerencia.administradores.gestionar`. |
| Usuarios | Listar/crear/editar/cambiar contraseña/reset/status/eliminar | Listar: `usuarios.ver`; resto: `usuarios.identidad.gestionar`; cambio directo de contraseña y delete responden Gone/Forbidden. Identidad además requiere global en el servicio. |
| Asignaciones de usuario | Catálogo/asignaciones/crear/quitar | `asignaciones.gestionar`; servicio exige que el contexto contenga ámbito GLOBAL. |
| Ámbitos | Listar/detalle/crear/editar/cerrar | `ambitos.gestionar`. |
| Revocación | Revocar sesión/usuario, revocar asignación, ver historial | `usuarios.identidad.gestionar` o `asignaciones.gestionar`; servicios aplican autorización adicional. |

No encontré un endpoint de negocio privado que dependa solo de ocultar un botón del frontend. Métodos de borrado de cotización y usuario carecen de permiso concedido y están cerrados de forma explícita. Las rutas públicas citadas no son permisos ausentes: tienen `@Public()` y un contrato de acceso público/token.

## 5. Brechas e inconsistencias

### 5.1 Brechas de UX o contrato frontend/backend

| Prioridad | Hallazgo | Efecto probable |
|---|---|---|
| Alta | `ClientesPageClient.toggleStatus()` envía `PATCH /clientes/:id`; el backend declara `PUT /clientes/:id` y no declara `PATCH` para clientes. Además, la vista comprueba `clientes.activar/inactivar`, mientras que el endpoint existente protege con `clientes.editar`. | Cuando se muestra Activar/Inactivar, la llamada no encuentra una ruta compatible (404). Si se agrega solo el permiso de acción al usuario, no basta para pasar el guard de `clientes.editar`. |
| Alta | `CotizacionesClient.handleEnviar()` llama `POST /cotizaciones/:id/enviar`; `CotizacionesController` no implementa esa ruta. `cotizaciones.enviar` es un permiso de fase 1 sembrado inactivo, pero la interfaz tiene el botón condicionado a él. | Con grants/migración que lo hagan visible, el botón falla con 404. El permiso está adelantado respecto del API. |
| Alta | La entrada Usuarios aparece con `usuarios.ver`; `UsersPage` hace `Promise.all` incluyendo `/users/role-assignments` y `/users/role-catalog` cuando `asignaciones.gestionar` está presente. `UserRolesService.authorize()` exige que el contexto alcance GLOBAL. | Un `admin_area` asignado a un ámbito departamental puede tener `usuarios.ver` y `asignaciones.gestionar` (la concesión es de área/descendientes), ver la página y aun así recibir 403 en las llamadas RBAC; el `Promise.all` puede impedir que cargue también el listado. |
| Alta | Enlace Roles y ámbitos y `canManage` aceptan `roles.gestionar OR ambitos.gestionar`; al entrar, la página solicita catálogo/asignaciones de usuario además de los ámbitos. El catálogo/asignaciones exige `asignaciones.gestionar`, y no hay controlador de gestión de roles que use `roles.gestionar`. | Un sujeto con solo `ambitos.gestionar` ve la ruta, pero las llamadas de catálogo/asignaciones pueden fallar 403; un sujeto con solo `roles.gestionar` ve una ruta que no tiene API implementada para esa capacidad y también puede fallar. |
| Media | `/calidad/protocolos` no tiene regla propia en `canAccessPath`; cae en prefijo `/calidad`, que exige `calidad.ciclos.ver` o `certificados.ver`. La página y su consulta usan `planta.protocolos.ver`. Tampoco existe enlace de Sidebar a Protocolos. | Un usuario con permiso para protocolos pero sin permisos de ciclos/certificados no llega a la vista; el redirect lo saca aunque el permiso del endpoint esté concedido. |
| Media | `calidad.protocolos.gestionar` solo habilita un botón cuyo `onClick` declara que la navegación de gestión está pendiente. No hay endpoint de administración de protocolos en los controladores revisados. | El botón visible no ejecuta una acción. No es un 403 del API, sino una función incompleta/permisología adelantada. |
| Media | `gerente_general` y `director_tecnico` reciben `formatos.versiones.aprobar`, pero `FormatosDocumentalesController` protege el cambio de estado con `formatos.versiones.publicar`; no encontré un endpoint separado que consuma `.aprobar`. | El grant de aprobación no se traduce por sí solo en una acción API diferenciada; la vista de versiones solo muestra el control de publicación con `.publicar`. Definir si aprobación y publicación son una misma acción o si requieren una etapa/endpoint propio. |
| Media | La ruta de nueva cotización tiene acceso por `cotizaciones.crear`, pero los demás subrutas bajo `/comercial/cotizaciones/` se autorizan como `cotizaciones.ver` en el layout. | El formulario luego filtra edición por `cotizaciones.editar`; los usuarios con solo edición OWN deben tener permiso de lectura para pasar la puerta de ruta y cargar el registro. Confirmar que las asignaciones siempre acompañen edición con lectura. |
| Baja | Dashboard (`lib/dashboard.ts`) no ofrece tarjetas de Gerencia, Auditoría, Solicitudes ni Roles/Ámbitos, aunque Sidebar sí muestra sus enlaces por permisos. | No produce 403; solo hace que algunos módulos no aparezcan como acceso rápido. |

### 5.2 Riesgos de seguridad / coherencia de autorización

- La navegación está bien basada en permisos y no en nombres de rol, pero `can(permission)` solo evalúa presencia del permiso. La UI no expresa `OWN` versus `SCOPE` para cada recurso; el backend mantiene la protección correcta, pero un botón puede aparecer para una capacidad cuyo recurso concreto no sea accesible y la acción acabar en 403/404 por ámbito/propiedad.
- El control de la página de Usuarios agrupa `usuarios.identidad.gestionar` y `asignaciones.gestionar`, pero el backend además requiere ámbito GLOBAL para ciertas mutaciones. La interfaz no proyecta esa precondición como una capacidad compuesta explícita.
- `roles.gestionar` existe en el catálogo y habilita una entrada del menú, pero no se halló un controlador que lo consuma. La asignación usa `asignaciones.gestionar`; por tanto, mostrar el permiso como “gestionar roles” confunde configuración de catálogo y asignación de perfiles.
- Los permisos de acción `clientes.activar/inactivar` no se alinean con el permiso de endpoint `clientes.editar`, además de la discrepancia HTTP. Si se busca delegación fina, se debe exponer un endpoint de estado con su permiso específico o controlar en el backend el campo `activo` mediante permisos dedicados.
- No hay brecha de backend causada por confiar solamente en el frontend: los endpoints observados tienen protección global o explícita. La observación anterior sobre inactividad se refiere a coherencia y concesión excesiva/granularidad de permisos, no a ausencia total de guard.

## 6. Propuesta para unificar roles y permisos

1. **Permiso como contrato único por acción.** Mantener códigos de acción estables (`clientes.estado.cambiar`, por ejemplo) en una única fuente de catálogo versionada. El backend declara cada endpoint con ese permiso; el frontend genera reglas de ruta y controles de botón a partir del contrato API (`x-required-permission`) o de un manifiesto compartido validado en CI.
2. **Separar capacidad de ámbito.** La sesión debe exponer por permiso capacidades que incluyan ámbitos SCOPE/OWN. La UI oculta/deshabilita acciones sin capacidad para el ámbito actual y el backend vuelve a validar siempre el registro y propietario. `x-scope-id` solo limita; nunca otorga alcance.
3. **Eliminar checks por nombre de rol.** Usar roles como paquetes administrables de permisos, no como condición en componentes/controladores. Mantener perfiles técnicos especiales como `superadmin`/PLATFORM con reglas de titularidad propias y explícitas.
4. **Separar privilegios por responsabilidad.** Mantener en paralelo lectura gerencial/auditoría, administración de identidad, aprobación técnica, edición comercial y operación. No ordenar como herencia automática. Migrar o retirar `admin_general` después de definir su reemplazo, porque es una concesión amplia estática derivada del `superadmin`.
5. **Delegación de usuarios consistente.** Decidir si `admin_area` administra usuarios/asignaciones de su ámbito. Si sí, permitirle llamadas con ámbito y limitar recursos en SQL; si no, retirarle/renombrarle los grants que la UI interpreta como delegables. No conceder una interfaz de administración que acaba en requisito GLOBAL.
6. **Separar menú, ruta y acción.** Cada ruta debe declarar permisos de entrada; cada botón su permiso de acción; cada API la misma acción. Una ruta puede entrar con lectura y esconder mutaciones, pero la vista no debe cargar APIs de administración opcionales en un `Promise.all` que bloquee el contenido de lectura.
7. **Tratar permisos futuros como no disponibles.** No mostrar botones/rutas para permisos sin handler backend. Mantener una lista automatizada de permisos con ruta/controlador y bloquear diferencias en CI, incluidas rutas declaradas por frontend sin operación OpenAPI.
8. **Matriz jerárquica propuesta (sin herencia implícita):**

| Nivel de gobierno/función | Perfiles propuestos | Regla |
|---|---|---|
| Plataforma | `superadmin` | Gobierno del catálogo, ámbitos, asignación técnica y recuperación; titularidad única, auditable. |
| Dirección/consulta transversal | `gerente_general`, `auditor` | Lectura global explícita, con acciones de negocio separadas y sin heredar administración técnica. Auditoría es independiente de la línea gerencial. |
| Administración departamental | `admin_comercial`, `admin_logistica`, `admin_planta`, `admin_calidad`, `admin_lavanderia` | Solo su área y descendientes delegados; administra pertenencias locales si el backend ofrece API de área. No configura roles globales. |
| Supervisión técnica | `director_tecnico`, `gerente_calidad` | Aprobaciones/autoridades técnicas separadas de operación y autoría; no se amplían por similitud de título. |
| Especialistas de proceso | `asesor_comercial`, `operador_logistica`, `operario_planta`, `analista_calidad`, `operario_lavanderia`, `emisor_comercial`, `gestor_documental`, `auditor_calidad` | Permisos de ejecución/lectura OWN o por ámbito con separación de funciones. |
| Compatibilidad heredada | `admin_general`, `admin_area`, `comercial`, `logistica`, `planta`, `calidad`, `emisor_comercial`, `auditor_calidad`, `gestor_documental` | Congelar asignaciones nuevas, mapear usuarios a perfiles canónicos y retirar el legado mediante migración revisada. Algunos códigos se solapan con perfiles funcionales y requieren conciliación antes de eliminarlos. |

## 7. Archivos principales revisados

**Backend:** `src/app.module.ts`, `src/main.ts`, `src/auth/`, `src/rbac/authorization.guard.ts`, `src/rbac/authorization-policy.ts`, `src/rbac/rbac-authorization.service.ts`, `src/rbac/permission-catalog.ts`, `src/database/migrations/1794096000000-AddScopedRbac.ts`, `1794312001000-SeedBackendRoles.ts`, `1794484800000-RemoveLegacyUserRole.ts`, `1794700000000-AddProductCatalog.ts`, `1794900000000-EnableGeneralManager.ts`; controladores de clientes, productos, cotizaciones, logística, planta, calidad, certificados, formatos, usuarios, asignaciones, ámbitos, revocación, gerencia, auditoría y tasas fiscales.

**Frontend:** `src/app/(erp)/layout.tsx`, `src/lib/session.tsx`, `src/lib/navigation.ts`, `src/lib/dashboard.ts`, `src/components/Sidebar.tsx`, `src/components/Header.tsx`; páginas de Comercial, Logística, Planta, Calidad, Usuarios, Roles/Ámbitos, Gerencia, Auditoría, Solicitudes y Configuración.

## 8. Límites del análisis

No conecté a una base de datos ni comprobé el conjunto efectivo de grants, scopes, perfiles activos o cuentas asignadas en producción. Tampoco probé cada combinación desde navegador; las brechas se derivan de rutas, permisos y llamadas declaradas en el código. La matriz describe las migraciones/código versionado al momento de revisión y debe contrastarse con el ledger de migraciones y los grants del ambiente antes de cambios de acceso.
