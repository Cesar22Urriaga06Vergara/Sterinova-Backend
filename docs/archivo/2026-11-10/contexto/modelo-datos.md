> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Modelo de datos – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente: entidades en `src/**/entities/*.entity.ts`, migraciones y tablas RBAC.
- Estado: 🚧 parcial; requiere volcado real de esquema MariaDB para completar detalles de columnas por tabla y constraints.

## Entidades principales

### 1) `usuarios`

- Tabla: `usuarios`
- PK: `id`
- Campos observados:
  - `id`: int autoincremental
  - `nombre`: varchar
  - `apellido`: varchar nullable
  - `cargo`: varchar nullable
  - `celular`: varchar nullable
  - `email_contacto`: varchar nullable
  - `email`: varchar unique
  - `password_hash`: varchar, oculto/`select: false`
  - `rol`: enum `UserRole`, default `Admin`
  - `activo`: boolean default true
  - `created_at`: datetime
- Relación: no se observa relación directa a clientes / cotizaciones en esta entidad, pero sí se usa como identidad autenticada y sujeto para RBAC.

### 2) `rbac_scopes`

- Tabla: `rbac_scopes`
- PK: `id`
- Campos clave:
  - `code`: varchar unique
  - `name`: varchar
  - `kind`: enum `GLOBAL | DEPARTMENT | TEAM | PLANT`
  - `parent_id`: int nullable
  - `active`: boolean default true
  - `global_slot`: virtual/derived para el tipo GLOBAL
  - `created_at`: datetime
- Relaciones:
  - `ManyToOne` hacia `RbacScope` padre (`parent_id`)
- Índices/constraints:
  - `UQ_rbac_scopes_code`
  - `UQ_rbac_scopes_id_kind`
  - `UQ_rbac_scopes_global_slot`
  - `IDX_rbac_scopes_parent_active`
  - `CHK_rbac_scopes_root`

### 3) `rbac_scope_closure`

- Tabla: `rbac_scope_closure`
- Clave compuesta: `ancestor_id`, `descendant_id`
- Campos:
  - `depth`: int unsigned
- Relaciones: `ManyToOne` a `RbacScope` por `ancestor_id` y `descendant_id`
- Check: `CHK_rbac_closure_depth`

### 4) `rbac_roles`

- Tabla: `rbac_roles`
- Observado en migración y entidades: rol con `code`, `name`, `kind`, `active` y relación con permisos.
- Índices/constraints: `UQ_rbac_roles_code`

### 5) `rbac_permissions`

- Tabla: `rbac_permissions`
- Observado en migración: permisos con `code`, `module`, `label`, `active`
- Índices: `UQ_rbac_permissions_code`

### 6) Entidades de negocio core

Las entidades de negocio reales no se listan todas aquí por falta de volcado completo de esquema; se identifican en módulos clave como:

- `clientes` -> clientes, direcciones, contactos
- `cotizaciones` -> cotización, items, versión, IVA
- `logistica` -> ordenes de servicio, materiales,
- `planta` -> ciclos / protocolos
- `calidad` -> evaluaciones, aprobaciones
- `certificados` -> `certificados_esterilizacion`
- `sellos` -> sello snapshot / política de firma visual

## Nota de completitud

Se requiere ejecutar el volcado del esquema real desde MariaDB o generar la representación ER con `typeorm-uml`, por ejemplo:

```bash
SHOW TABLES;
SHOW CREATE TABLE <tabla>;
```

Sin ese paso, la lista anterior es una vista de dominio y no un esquema asegurado al 100%.
