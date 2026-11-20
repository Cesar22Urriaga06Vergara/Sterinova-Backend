---
id: RF-USR-001
titulo: Administrar usuarios y su estado
tipo: RF
modulo: Usuarios y Administración
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/users/; src/auth/; src/rbac/; src/database/migrations/"
depende_de: [RF-USR-002]
bloquea: [RF-AUD-003]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-USR-001 se deriva a RF-AUD-003."
---

# RF-USR-001 — Administrar usuarios y su estado

**Fuente principal:** `Sterinova-ERP.md` §3: usuarios activos/inactivos, cambio de estado y auditoría.

**Fuentes de contraste:** entidades, servicios, controladores y autorización de Usuarios/RBAC.

1. **ID:** `RF-USR-001`.
2. **Título:** Administrar usuarios y su estado.
3. **Tipo:** RF.
4. **Módulo:** Usuarios y Administración.
5. **Descripción funcional:** Crear y administrar identidades, activar/desactivar usuarios y preservar registros para no perder referencias históricas.
6. **Reglas asociadas:** Usuario inactivo no inicia sesión ni obtiene autorización; no desactivar el propio usuario ni al último administrador global. No borrar identidades por el flujo administrativo.
7. **Actores y permisos:** Gestión requiere `usuarios.identidad.gestionar` y autorización global; consulta requiere `usuarios.ver` y ámbito permitido.
8. **Datos y entidades:** `User` incluye `activo:boolean`; no tiene columna estado ni `DeleteDateColumn`.
9. **Flujo:** Creación de usuario y asignación inicial en transacción; activación/desactivación por `PATCH /users/:id/status`; DELETE es denegado.
10. **Criterios de aceptación:** Mantener usuarios activos/inactivos; inactivos no autorizan; desactivación protege último admin; conservar identidad y relaciones históricas.
11. **Evidencia backend:** `UsersService.setActive`, `AuthService` y `RbacAuthorizationService`; `UsersController` bloquea eliminación de identidad.
12. **Persistencia y trazabilidad:** Se conserva la fila con `activo=false`; FK de RBAC/auditoría restringen borrado. No se halló evento explícito de auditoría al cambiar `activo`.
13. **Brechas derivadas:** `B-USR-001` se asigna a `RF-AUD-003` para auditar cambios de estado de usuarios/RBAC. La ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Política de motivo y datos específicos a registrar al activar/desactivar; se concretará en RF-AUD-003.
15. **Estado de cobertura:** Parcial. Estado e inactivación están implementados; falta auditoría explícita del cambio de estado.
16. **Certeza y límites:** Confirmado en entidades, controladores, servicios, guards y migraciones inspeccionados; no se verificó BD desplegada.
