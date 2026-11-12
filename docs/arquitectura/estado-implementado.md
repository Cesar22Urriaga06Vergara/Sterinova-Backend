# Estado implementado y límites de autorización

Inspección estática: 12 de noviembre de 2026. Este documento sustituye los índices de fases como punto de entrada al diagnóstico; no sustituye los contratos detallados de API ni afirma estado de una base desplegada. Diseño organizacional objetivo en [roles y permisos](roles-y-permisos.md); requisitos en [reglas maestras](../negocio/reglas-maestras.md).

## Identidad y autorización

`User` ya no mapea `usuarios.rol`; `cargo` sigue siendo descriptivo. El guard global `AuthorizationGuard` solo admite rutas públicas, políticas explícitas de sesión o permisos. `PermissionGuard` carga concesiones persistidas; no existe fallback a `RolesGuard`, al nombre del perfil ni al ID del usuario. La migración correctiva `RemoveLegacyUserRole1794484800000` retira la columna y su compatibilidad SQL sin editar migraciones históricas.

La migración debe aplicarse por separado y no se ejecutó en esta entrega; por tanto, este estado del código no acredita que una base existente ya haya retirado la columna o conserve las asignaciones requeridas. Los endpoints de negocio validan recursos y condiciones además del permiso de ruta. Las respuestas públicas de certificados siguen teniendo una proyección independiente y no son concesiones internas.

## Modelo RBAC observado

Fuentes: `src/rbac/entities/*.ts`, `authorization-policy.ts`, `rbac-authorization.service.ts`, `permission-catalog.ts`, `src/database/migrations/1794096000000-AddScopedRbac.ts` y `src/rbac/local-pilot-data-migration.ts`.

| Componente | Comportamiento |
|---|---|
| rbac_scopes y rbac_scope_closure | GLOBAL único, DEPARTMENT/TEAM/PLANT, jerarquía activa y descendientes explícitos |
| rbac_roles y rbac_role_permissions | Roles STANDARD/PLATFORM; acciones explícitas, OWN/SCOPE e inclusión de descendientes |
| rbac_user_role_assignments | Múltiples roles y ámbitos por usuario; CHECK impide STANDARD en GLOBAL y roles PLATFORM por esta tabla |
| rbac_platform_owner | Única fila id=1, usuario titular, rol PLATFORM y ámbito GLOBAL |
| Cargador de sujeto | Recarga usuario activo, perfiles y asignaciones/concesiones desde servidor; incorpora titularidad en la misma consulta |
| Evaluador | Denegación ante inactividad/inconsistencia; no mezcla permiso y ámbito de asignaciones diferentes |
| Sesión | Perfiles descriptivos, permissions, capabilities, current_scope y available_scopes; cabecera x-scope-id reduce contexto autorizado |

La semilla define superadmin, admin_area, comercial, emisor_comercial, logistica, planta, calidad, auditor_calidad y gestor_documental. Son plantillas, no evidencia de usuarios productivos asignados. El SuperAdmin real es quien esté registrado como titular en rbac_platform_owner; su identidad concreta no se conoce sin consultar el ambiente. El script de conciliación exige ID y correo esperados y rechaza sustituir una titularidad distinta. No se consultó la base ni se ejecutó ese script.

La semilla comercial contiene lectura SCOPE, pero la migración posterior del piloto restringe concesiones a OWN. Leer solo la semilla inicial produce una matriz efectiva incorrecta. El contrato del piloto describe esa restricción, anterior a los requisitos de visibilidad compartida.

La aprobación de anulaciones requiere el permiso persistido y un ámbito no global exacto; no se habilita mediante un nombre o código visible de perfil. La operación también mantiene la separación de funciones y restricciones de negocio antes de resolver la solicitud.

## Protección operativa integrada en logística

El módulo de logística ya incorpora controles de negocio adicionales para evitar errores operativos no triviales:

- validación estricta de `fecha_programada` en formato civil `YYYY-MM-DD` sin hora ni zona horaria,
- bloqueo de transiciones de estado fuera del flujo permitido (`PENDIENTE -> EN_RUTA -> RECOGIDO -> EN_PLANTA -> PROCESADO`, con cancelación solo en pasos no concluidos),
- detección de materiales duplicados dentro de la misma orden (misma referencia, descripción y lote),
- y eliminación del límite artificial de 200 filas por material para permitir cargas dinámicas reales sin forzar un tamaño fijo.

Estas protecciones se aplican en la capa de servicio y en la validación de DTO para que el frontend reciba errores claros y de negocio, no solo errores de persistencia.

## Síntesis funcional frente a negocio

Hay módulos de autenticación/usuarios, clientes, cotizaciones, logística, planta, calidad, certificados, formatos/sellos, auditoría y tasas fiscales. Existen PDF con snapshot, almacenamiento/hash y flujo de Calidad. Su existencia no demuestra los ocho módulos de negocio completos.

Las reglas nuevas exigen clientes sin borrado, cotizaciones multiservicio y separación aprobación/envío/aceptación/emisión; órdenes parciales, ciclos multiórdenes, Lavandería propia, protocolos/equipos, doble aprobación, firmas diferenciadas y control documental por funciones. Estos requisitos no deben darse por implementados por disponer de rutas genéricas.

El runbook PDF describe recuperación técnica actual. El requisito nuevo exige COPIA RESTAURADA y auditoría al reconstruir: debe alinearse en implementación posterior; la regeneración actual no acredita por sí sola cumplimiento del M7. Igual distinción aplica a los cinco años de conservación y las sesiones de diez horas.

## Consulta de detalle

- [Contrato técnico del piloto](contrato-autorizacion-rbac.md).
- [API y contratos](api-y-contratos.md) y [OpenAPI](openapi.json).
- [Arquitectura y stack](arquitectura-y-stack.md).
- [Esquema y migraciones](../base-de-datos/esquema-y-migraciones.md).
- [Archivo de contexto del 10 de noviembre](../archivo/2026-11-10/contexto/INDEX.md): inventarios detallados con su fecha y limitaciones, no política vigente.
- [Archivo del estado funcional anterior](../archivo/2026-11-10/estado-proyecto/modulos.md).

La verificación de esta entrega incluyó pruebas y builds de backend y frontend. No se ejecutó ninguna migración ni se modificó una base de datos; los resultados concretos se informan en la entrega.
