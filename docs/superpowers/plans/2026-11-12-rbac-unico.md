# RBAC único Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Retirar usuarios.rol y toda autorización legacy, conservando acceso por permisos persistidos y ámbitos.
**Architecture:** Un único AuthorizationGuard y RbacAuthorizationService; relaciones RBAC por claves. Migración correctiva posterior a la sustitución de consumidores, sin reescribir historial.
**Tech Stack:** NestJS, TypeORM, MariaDB, Next.js, Vitest.
**Spec:** [Diseño](2026-11-12-rbac-unico-design.md)

## Global Constraints
Preservar cambios ajenos en ambos repositorios. No commit ni push durante esta limpieza. No migrar base de trabajo antes de validar. No inferir atribuciones históricas ni añadir bypass por ID 1 o nombre de perfil.

## Review Focus
- Usuario con permiso en un área intenta acceder por ID a otra: denegar sin exponer datos.
- Admin General intenta autoaprobar una operación incompatible: conservar separación de funciones.
- Revocación de asignación con JWT vigente: retirar acceso en siguiente solicitud.
- Eliminación o desactivación del último administrador: rechazar usando concesiones reales.
- Rol enviado en un payload o almacenado en navegador: no concede acceso y no pertenece al contrato nuevo.

## 1. Inventario y políticas por operación
Archivos: controladores y servicios de clientes, logistica, planta, calidad, certificados, formatos-documentales, sellos y auditoria; src/rbac/permission-catalog.ts.
- [ ] Registrar ruta, permiso existente, filtro de recursos y condiciones de negocio; seguir únicamente dependencias de estos módulos.
- [ ] Escribir pruebas de denegación por ámbito/propiedad y de acceso permitido por operación; ejecutarlas y comprobar la causa de cada fallo.
- [ ] Sustituir @Roles por políticas explícitas y propagar PermissionContext a consultas y escrituras; proyectar solo datos autorizados.
- [ ] Ejecutar pruebas focalizadas por módulo antes de continuar.

## 2. Identidad, sesión y guard único
Archivos: src/rbac/authorization.guard.ts, rbac.module.ts, rbac-authorization.service.ts; src/auth/{auth.service,jwt.strategy}.ts; src/users/{users.service,users.controller}.ts; DTO de usuarios; src/scripts/bootstrap-admin.ts.
- [ ] Añadir pruebas: ruta sin política denegada, token sin rol funcional, revocación inmediata y último administrador protegido por RBAC.
- [ ] Retirar RolesGuard, decorador Roles y enum UserRole del runtime; eliminar rol de DTO, JWT, respuestas y selección de entidades.
- [ ] Rehacer bootstrap y protección del último administrador con concesiones persistidas; mantener asignaciones por role_id y scope_id.
- [ ] Ejecutar pruebas de auth/users/rbac y build backend.

## 3. Frontend y selector de perfiles
Archivos frontend: src/app/(erp)/usuarios/{page,UserDialogs,UserRolesDialog,UsersTable,types}; src/lib/session, stored-user y navegación; src/components/{Header,Sidebar}; layout ERP; configuración de sellos; tipos de Calidad.
- [ ] Leer guías Next.js locales pertinentes e inventariar dependencias directas de sesión y navegación.
- [ ] Añadir pruebas de navegación y acciones por capabilities sin rol legacy, selección de perfil y payload role_id/scope_id.
- [ ] Mostrar Admin General, Admin/Asesor por área y especializados usando claves estables; retirar selector y leyenda de compatibilidad.
- [ ] Mostrar responsabilidades del perfil sin inventar permisos; navegación y controles por permisos actuales de sesión.
- [ ] Ejecutar pruebas focalizadas, lint y build frontend.

## 4. Esquema y transición
Archivos: nueva migración en src/database/migrations/, migration-registry.ts, src/users/entities/user.entity.ts; scripts operativos relacionados.
- [ ] Inspeccionar definición vigente de rbac_set_user_roles, rbac_is_global_admin y triggers; enumerar sus dependencias de rol.
- [ ] Añadir ensayo que conserve identidades/asignaciones, elimine columna y función de compatibilidad y mantenga protección del último administrador.
- [ ] Crear migración correctiva que sustituya rutinas dependientes y retire usuarios.rol; impedir rollback destructivo y documentar recuperación.
- [ ] Verificar cadena desde cero y actualización en base desechable, sin credenciales de trabajo.
- [ ] Comprobar que ID 1 conserva permisos administrativos explícitos antes de cualquier aplicación local; no asignar privilegios por inferencia.

## 5. Verificación completa y documentación
Archivos: contrato OpenAPI y documentación activa de roles, autorización y operación.
- [ ] Ejecutar regresión backend, contratos, pruebas frontend y builds; resolver fallos vinculados al cambio.
- [ ] Buscar referencias legacy activas y confirmar que solo quedan antecedentes históricos donde corresponda.
- [ ] Revisar permisos cruzados, revocación, estados y separación de funciones de Review Focus.
- [ ] Actualizar documentación con comportamiento probado y límites reales.
- [ ] Presentar diff, resultados y migración concreta; aplicar a base de trabajo solo con autorización explícita que cubra esa operación.
