# Fase 3.1 — Usuarios y Auth

Fase 2 consolidada localmente en `f6bd4f7`, sin push. La implementación de Fase 3.1 queda sin commit para revisión.

## Contrato implementado

- Ambos controladores de Usuarios declaran políticas RBAC explícitas. Listar exige `usuarios.ver`; crear/editar identidad, contraseña y estado exige `usuarios.identidad.gestionar` en GLOBAL. No existe `usuarios.crear` en el contrato aprobado.
- La lista aplica un predicado SQL parametrizado con EXISTS sobre pertenencias activas, roles activos y ámbitos autorizados. No permite OWN como permiso de listar miembros. Un ámbito GLOBAL explícito permite ver identidades sin asignación; `x-scope-id` reduce ese acceso.
- Asignaciones y catálogo requieren `asignaciones.gestionar` GLOBAL. La delegación local positiva permanece pendiente de un contrato de subconjunto delegable y de implementación transaccional: un administrador de área no puede asignar roles, tampoco fuera de su ámbito. No se amplió el procedimiento protegido existente.
- Gerencia consulta por concesión GLOBAL explícita; no recibe gestión de identidad por su cargo. El titular superadmin mantiene gestión global.
- DELETE de identidad queda denegado conforme a la matriz arquitectónica. La desactivación se realiza mediante PATCH de estado.

## Transición legacy y despliegue

La migración nueva `BridgeLegacyUserAdministration1794398400000` crea el rol técnico temporal `legacy_admin_transition` y asigna administración global de Usuarios únicamente a identidades Admin activas sin ningún historial RBAC. No promueve jefes de área, cuentas revocadas ni cuentas inactivas. No cambia el titular PLATFORM ni activa perfiles de negocio. La transición registra auditoría y versión RBAC; no existe bypass runtime basado en `usuarios.rol`.

Esta migración debe aplicarse como parte del despliegue antes de habilitar los controladores migrados. En esta entrega se ensaya exclusivamente en MariaDB desechable, sin modificar la base de trabajo. El rol temporal requiere retiro posterior mediante conciliación explícita.

## Pruebas y revisión

RED observado en políticas de controladores y en integración MariaDB: listado fuera de ámbito, reducción por cabecera, ausencia de política y falta de transición legacy. GREEN verificado tras implementación. La revisión del SQL y de la migración comprobó unión de permiso/ámbito, ausencia de interpolación de IDs, exclusión de hashes y conservación de la revocación.

Los resultados finales de la suite y del contrato se reportan en la entrega de esta sesión. Los cambios previos de Fase 1, unificación de roles y otros archivos pendientes se preservan; esta entrega no los declara creados aquí.
