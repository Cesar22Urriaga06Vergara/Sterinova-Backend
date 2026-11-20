---
id: RF-AUD-003
titulo: Implementar auditoría explícita en cambios de estado de usuarios y RBAC
tipo: RNF
modulo: Auditoría / Usuarios / RBAC
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/users/users.service.ts; src/users/user-roles.service.ts; src/rbac/ambitos/ambito.service.ts; src/auditoria/"
depende_de: [RF-USR-001, RF-USR-002]
bloquea: []
brechas: [B-USR-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-USR-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos. La evidencia distingue la falta de auditoría explícita en cambio de estado de usuario de los registros existentes, pero no uniformes, en RBAC."
---

# RF-AUD-003 — Implementar auditoría explícita en cambios de estado de usuarios y RBAC

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-AUD-003`.
2. **Título:** Implementar auditoría explícita en cambios de estado de usuarios y RBAC.
3. **Tipo:** RNF.
4. **Módulo:** Usuarios, RBAC y Auditoría.
5. **Descripción funcional:** Registrar de forma atómica el actor, usuario afectado, operación, fecha/hora, ámbito y valores anteriores/nuevos al activar o desactivar usuarios y al modificar asignaciones y ámbitos RBAC. El alcance de cambios en el catálogo de roles/permisos debe coordinarse con `RF-USR-004`.
6. **Reglas asociadas:** El evento debe persistir en la misma transacción que el cambio; preservar el dato previo y posterior; no guardar contraseñas, tokens ni secretos; la auditoría complementa y no sustituye el historial de asignaciones.
7. **Actores / permisos:** Cambios de identidad bajo `usuarios.identidad.gestionar`; asignaciones bajo `asignaciones.gestionar`; cambios de ámbitos bajo `ambitos.gestionar`. El evento debe identificar al usuario autenticado que ejecutó la operación.
8. **Datos y entidades:** `auditoria` (`usuario_id`, `entidad`, `entidad_id`, `accion`, `detalle` JSON, `scope_id`, `created_at`), `usuarios.activo`, asignaciones usuario–rol–ámbito y ámbitos RBAC.
9. **Flujo:** Capturar estado previo → autorizar el cambio → persistir cambio y evento de auditoría con estado posterior en una misma transacción → devolver resultado sin exponer secretos.
10. **Criterios de aceptación preliminares:** Todo cambio de estado de usuario genera evento con actor y before/after; los cambios RBAC relevantes conservan contexto equivalente; fallo al guardar auditoría revierte también la modificación; eventos no contienen credenciales.
11. **Evidencia en backend:** `UsersService.setActive` actualiza `activo` dentro de transacción, pero no invoca `AuditoriaService`. La asignación de roles usa `rbac_set_user_roles`, cuya migración escribe `before` y `after`; `AmbitoService` crea/actualiza ámbitos y registra eventos en la misma transacción. Por tanto, la cobertura de RBAC es mixta y el faltante `B-USR-001` se refiere específicamente al cambio de estado de usuario.
12. **Persistencia e interfaz:** La tabla de auditoría admite detalle JSON y ámbito; las operaciones administrativas se exponen en `UsersController`, `UserRolesController` y `AmbitoService`. No se confirmó una pantalla específica para inspeccionar cada before/after de estas mutaciones.
13. **Brecha asociada:** `B-USR-001` permanece abierta para auditoría explícita del cambio `usuarios.activo`; la uniformidad del payload se mantiene en `B-AUD-001`/`RF-AUD-004` y la atomicidad transversal en `RF-AUD-002`.
14. **Preguntas abiertas:** Definir si cambios de permisos/catálogo dinámico forman parte de este alcance o de `RF-USR-004`; precisar los campos de motivo y la representación estable de los snapshots JSON.
15. **Estado de cobertura preliminar:** Parcial: la tabla de auditoría y algunos eventos RBAC existen; el cambio de estado de usuario carece de evento y el esquema de detalle no es uniforme.
16. **Certeza y límites:** Los hallazgos se basan en los servicios de Usuarios/RBAC y entidad/servicio de Auditoría. No se verificó una base desplegada ni la configuración actual de procedimientos en producción; esta ficha sigue en borrador.

