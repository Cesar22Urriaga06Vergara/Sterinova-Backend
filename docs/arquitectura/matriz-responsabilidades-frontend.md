# Especificación de responsabilidades por rol — Frontend Sterinova

**Fecha:** 17 de noviembre de 2026  
**Versión:** 1.0  
**Estado:** Aprobado para entrega al equipo frontend  
**Fuente:** ADR-005 (`docs/arquitectura/adr/005-unificacion-catalogo-roles.md`) y estado de base de datos verificado

Este documento define qué ve y qué puede hacer cada rol en el frontend de Sterinova. Úselo como referencia única para construir menús, botones, vistas y validaciones de autorización por perfil.

---

## 1. Principios de autorización

| Principio | Descripción |
|-----------|-------------|
| **Denegar por defecto** | Cualquier acción no enumerada en este documento se oculta o devuelve 403. No existen comodines ni bypass por nombre de rol. |
| **Separación de funciones (SoD)** | Una persona no puede ser creador y aprobador del mismo recurso. Comparar siempre por `usuario_id`, nunca por nombre de rol. |
| **Ámbito (scope)** | Cada usuario tiene uno o más ámbitos autorizados. El encabezado `x-scope-id` reduce el contexto; nunca lo amplía. Un asesor comercial solo ve sus propias cotizaciones (OWN) o las de su ámbito compartido. |
| **Sin precios para operaciones** | Logística y Planta reciben datos operativos necesarios, **sin precios** (`subtotal`, `iva`, `total`, `valor_unitario`, `valor_total`) por mera pertenencia a un ciclo u orden. |
| **Roles inactivos** | Los roles con `active=0` en la base de datos no se pueden asignar a usuarios. El frontend no debe ofrecerlos como opción de asignación. |

---

## 2. Catálogo de roles y estado

### Roles activos (asignables en frontend)

| Código | Nombre visible | Clase | Ámbito típico | Estado |
|--------|---------------|-------|---------------|--------|
| `superadmin` | Titular de plataforma | PLATFORM | GLOBAL | Activo |
| `gerente_general` | Gerente General | STANDARD | GLOBAL (elegible) | Activo |
| `admin_comercial` | Admin Comercial | STANDARD | DEPARTMENT Comercial | Activo |
| `asesor_comercial` | Asesor Comercial | STANDARD | SCOPE propio / Comercial compartido | Activo |
| `admin_logistica` | Admin Logística | STANDARD | DEPARTMENT Logística | Activo |
| `operador_logistica` | Operador Logística | STANDARD | Ámbito operativo exacto | Activo |
| `admin_calidad` | Admin Calidad | STANDARD | DEPARTMENT Calidad | Activo |
| `analista_calidad` | Analista Calidad | STANDARD | Calidad sobre plantas/procesos delegados | Activo |
| `auditor` | Auditor | STANDARD | GLOBAL o ámbitos expresos | Activo |
| `gestor_documental` | Gestor Documental | STANDARD | Documentos bajo Calidad | Activo |

### Roles INACTIVOS (no asignables, pendientes de autoridad de negocio)

| Código | Nombre visible | Motivo de inactivación |
|--------|---------------|------------------------|
| `admin_planta` | Admin Planta | Retroactividad sin autoridad formal definida |
| `operario_planta` | Operario Planta | Mismo motivo |
| `director_tecnico` | Director Técnico | Anulación de certificados y liberación sin autoridad definida |
| `gerente_calidad` | Gerente Calidad | Vía de urgencia médica bloqueada (reglas M6/M7 pendientes) |
| `admin_lavanderia` | Admin Lavandería | Liberación de lavandería sin documento definido |
| `operario_lavanderia` | Operario Lavandería | Mismo motivo |
| `admin_general` | Admin General | Rol de migración temporal; viola SoD (clon de superadmin). Desactivado. |

> **Regla para el frontend:** El catálogo de roles (`GET /users/role-catalog`) filtra por `active=1`. Los roles inactivos se muestran solo como referencia informativa, nunca como opción de asignación.

---

## 3. Matriz detallada de responsabilidades por rol

### 3.1 superadmin — Titular de plataforma

**Ámbito:** GLOBAL (único titular en `rbac_platform_owner`)

**Módulos visibles:** Todos

**Acciones permitidas:**
- Gestionar identidades globales (`usuarios.identidad.gestionar`)
- Configurar roles y sus permisos (`roles.gestionar`)
- Configurar estructura organizativa / ámbitos (`ambitos.gestionar`)
- Gestionar asignaciones delegadas (`asignaciones.gestionar`)
- Consultar usuarios del ámbito (`usuarios.ver`)
- Publicar versiones de tasas fiscales (`tasas_fiscales.gestionar`)
- Ver métricas gerenciales (`gerencia.metricas.ver`)
- Gestionar administradores de áreas (`gerencia.administradores.gestionar`)
- Todas las lecturas del negocio (módulos operativos)

**Límites (SoD):**
- No sustituye firmas profesionales
- No elimina evidencias
- No es un bypass de criterios de calidad

---

### 3.2 gerente_general — Gerente General

**Ámbito:** GLOBAL (elegible, asignación STANDARD explícita)

**Módulos visibles:** Todos (lectura global de negocio y trazabilidad)

**Acciones permitidas:**
- Consultar todos los módulos y trazabilidad del negocio
- Aprobar finalmente versiones documentales conforme M8
- Ver métricas gerenciales
- Ver auditoría
- Gestionar identidades globales (`usuarios.identidad.gestionar`)
- Gestionar asignaciones delegadas (`asignaciones.gestionar`)

**Límites (SoD):**
- No administrar plataforma por su cargo
- No es titular de plataforma (no hereda privilegios de superadmin)

---

### 3.3 admin_comercial — Admin Comercial

**Ámbito:** DEPARTMENT Comercial

**Módulos visibles:** Clientes, Cotizaciones, Usuarios del área

**Acciones permitidas:**
- Crear, editar, importar, activar/inactivar clientes
- Crear cotizaciones (borrador)
- Aprobar propuesta interna de cotización (persona distinta del creador)
- Enviar cotización al cliente
- Emitir cotización (tras aceptación y aprobación interna)
- Descargar cotizaciones
- Crear y resolver solicitudes de anulación
- Ver solicitudes de anulación pendientes
- Invitar usuarios del área y gestionar sus asignaciones delegadas
- Ver usuarios del ámbito

**Límites (SoD):**
- Nunca aprueba su propia propuesta (la persona distinta del creador debe aprobar)
- No gestiona identidad global (solo pertenencias del área)

---

### 3.4 asesor_comercial — Asesor Comercial

**Ámbito:** SCOPE propio / Comercial compartido

**Módulos visibles:** Clientes, Cotizaciones propias

**Acciones permitidas:**
- Crear clientes en su ámbito autorizado
- Editar clientes (solo los de su ámbito/propiedad)
- Crear borradores de cotización
- Editar borradores de cotización (solo los suyos, OWN)
- Previsualizar cotizaciones
- Descargar cotizaciones
- Enviar cotización (tras aprobación interna y aceptación del cliente)
- Emitir cotización (tras aceptación documentada y aprobación vigentes)
- Registrar aceptación del cliente
- Solicitar anulación de cotización (con motivo)
- Ver solicitudes de anulación (solo las suyas)

**Límites (SoD):**
- Nunca aprueba su propia propuesta
- La emisión no equivale a aprobación; exige aceptación documentada + aprobación interna vigentes
- Escritura solo OWN (dentro de su ámbito autorizado)

---

### 3.5 admin_logistica — Admin Logística

**Ámbito:** DEPARTMENT Logística

**Módulos visibles:** Órdenes de servicio, Cotizaciones disponibles, Recepciones, Despacho

**Acciones permitidas:**
- Crear órdenes logísticas (exige cotización ACEPTADA y OC o autorización del jefe de área)
- Cambiar estado de órdenes (flujo permitido: PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA → PROCESADO)
- Recibir materiales y registrar recepciones
- Autorizar reempaque (solo como jefe de área competente)
- Ejecutar despacho
- Ver cotizaciones disponibles con saldo pendiente
- Invitar usuarios del área y gestionar sus asignaciones delegadas
- Ver usuarios del ámbito

**Límites (SoD):**
- No liberar producto sin certificado de Calidad aplicable
- Cambiar estado no autoriza saltos arbitrarios en el flujo

---

### 3.6 operador_logistica — Operador Logística

**Ámbito:** Ámbito operativo exacto

**Módulos visibles:** Órdenes, Recepciones, Despacho

**Acciones permitidas:**
- Recepción de materiales
- Registro de recepciones
- Transporte y entrega
- Registro de diferencias con motivo/evidencia

**Límites (SoD):**
- No liberar producto

---

### 3.7 admin_calidad — Admin Calidad

**Ámbito:** DEPARTMENT Calidad

**Módulos visibles:** Ciclos, Certificados, Protocolos, Desviaciones, Formatos (versiones)

**Acciones permitidas:**
- Ver ciclos de esterilización
- Aprobar ciclos de Calidad
- Rechazar ciclos de Calidad
- Gestionar protocolos de Calidad
- Verificar desviaciones
- Aprobar desviaciones
- Gestionar liberación condicionada / por desviación (con Director Técnico)
- Ver y descargar certificados
- Crear y editar versiones de formato
- Ver formatos documentales
- Invitar usuarios del área y gestionar sus asignaciones delegadas
- Ver usuarios del ámbito

**Límites (SoD):**
- Nunca es registrador y aprobador del mismo ciclo
- No recibe automáticamente las facultades del Director Técnico
- La liberación excepcional requiere autorización formal del Director Técnico

---

### 3.8 analista_calidad — Analista Calidad

**Ámbito:** Calidad sobre plantas/procesos delegados

**Módulos visibles:** Ciclos, Certificados, Formatos (versiones borrador)

**Acciones permitidas:**
- Ver ciclos para Calidad
- Aprobar ciclos de Calidad (decisión ordinaria)
- Rechazar ciclos de Calidad
- Verificar desviaciones (primera aprobación)
- Ver y descargar certificados
- Ver formatos documentales
- Crear y editar versiones de formato (borrador)

**Límites (SoD):**
- Nunca es registrador y aprobador del mismo ciclo
- Las desviaciones críticas requieren dos actores distintos (no duplicar aprobador por multirrol)

---

### 3.9 auditor — Auditor

**Ámbito:** GLOBAL (elegible) o ámbitos expresos

**Módulos visibles:** Todos (lectura), Auditoría

**Acciones permitidas:**
- Lectura de expedientes y auditoría
- Exportar cotizaciones y certificados a Excel (mismo filtro que lectura, columnas autorizadas)
- Ver eventos de auditoría

**Límites (SoD):**
- Sin edición, liberación ni administración
- Exportación con idénticos filtros/columnas autorizadas y evento de exportación

---

### 3.10 gestor_documental — Gestor Documental

**Ámbito:** Documentos bajo Calidad

**Módulos visibles:** Formatos documentales, Versiones de formato, Sellos de certificación

**Acciones permitidas:**
- Crear formatos documentales
- Editar formatos documentales
- Ver formatos documentales
- Crear versiones de formato (borrador)
- Editar versiones borrador
- Publicar/retirar versiones (solo versiones aprobadas)
- Ver sellos de certificación
- Crear sellos de certificación
- Editar sellos de certificación
- Desactivar sellos de certificación

**Límites (SoD):**
- No autoatribuir aprobación final (aprobación es del Director Técnico o Gerente General)
- Publicar/retirar solo versiones ya aprobadas

---

## 4. Matriz de acciones por pantalla (uso en frontend)

Esta tabla indica qué botones y acciones mostrar en cada pantalla según el rol.

| Pantalla | admin_comercial | asesor_comercial | admin_logistica | operador_logistica | admin_calidad | analista_calidad | auditor | gestor_documental | gerente_general | superadmin |
|----------|----------------|------------------|-----------------|--------------------|---------------|------------------|---------|-------------------|-----------------|------------|
| **Clientes** | Crear, Editar, Ver, Activar/Inactivar | Crear, Editar (OWN), Ver | — | — | — | — | Ver | — | Ver | Ver |
| **Cotizaciones** | Crear, Editar, Aprobar interna, Enviar, Emitir, Descargar, Ver, Anular | Crear, Editar (OWN), Enviar, Emitir, Descargar, Ver, Solicitar anulación | Ver disponibles | — | Ver | Ver | Ver | — | Ver | Ver |
| **Órdenes de servicio** | — | — | Crear, Cambiar estado, Ver | Ver, Cambiar estado | Ver | Ver | Ver | — | Ver | Ver |
| **Recepción de materiales** | — | — | Registrar recepción | Registrar recepción | — | — | — | — | — | — |
| **Despacho** | — | — | Ejecutar despacho | — | — | — | — | — | — | — |
| **Ciclos de esterilización** | — | — | — | — | Aprobar, Rechazar, Ver | Aprobar, Rechazar, Ver | Ver | — | Ver | Ver |
| **Protocolos de Calidad** | — | — | — | — | Gestionar, Ver | Ver | Ver | — | Ver | Ver |
| **Certificados** | — | — | — | — | Ver, Descargar | Ver, Descargar | Ver, Descargar, Exportar Excel | — | Ver | Ver |
| **Formatos documentales** | — | — | — | — | Ver, Crear, Editar | Ver, Crear, Editar | Ver | Crear, Editar, Publicar, Retirar, Ver | Ver | Ver |
| **Versiones de formato** | — | — | — | — | Crear, Editar, Publicar | Crear, Editar | Ver | Crear, Editar, Publicar, Retirar | Ver | Ver |
| **Sellos de certificación** | — | — | — | — | — | — | Ver | Crear, Editar, Desactivar, Ver | Ver | Ver |
| **Auditoría** | — | — | — | — | — | — | Ver, Exportar Excel | — | Ver | Ver |
| **Usuarios del área** | Invitar, gestionar asignaciones | — | Invitar, gestionar asignaciones | — | Invitar, gestionar asignaciones | — | Ver | — | Gestionar identidades globales | Gestionar identidades globales |
| **Roles y ámbitos** | — | — | — | — | — | — | — | — | — | Configurar roles, ámbitos, titularidad |
| **Tasas fiscales / IVA** | — | — | — | — | — | — | — | — | — | Publicar versiones |

> **Nota:** Las celdas vacías (—) significan que el rol no tiene acción en esa pantalla; el frontend debe ocultar el menú/botón o devolver 403 si se intenta acceder directamente.

---

## 5. Reglas de UI/UX para el frontend

### 5.1 Menú de navegación
Mostrar solo los módulos para los que el rol tenga al menos una acción permitida. Si un rol solo tiene lectura en un módulo, mostrar el módulo en modo solo-lectura.

### 5.2 Botones de aprobación (SoD)
- **Cotización — Aprobar interna:** Deshabilitar si `usuario_id === creador_id`.
- **Ciclo — Aprobar/Rechazar:** Deshabilitar si `usuario_id === operador_id` (registrador del ciclo).
- **Desviación crítica:** Requerir dos actores con `usuario_id` distintos.

### 5.3 Ámbito (scope)
- El endpoint `/auth/me` devuelve `available_scopes` y `current_scope`.
- El frontend debe permitir al usuario seleccionar un ámbito de `available_scopes` mediante el encabezado `x-scope-id`.
- Al listar recursos, enviar `x-scope-id` para reducir el contexto. Nunca ampliar el acceso más allá de lo autorizado.
- Si el usuario tiene un solo ámbito disponible, preseleccionarlo automáticamente.

### 5.4 Campos financieros
- **No mostrar** `subtotal`, `iva`, `total`, `valor_unitario`, `valor_total` en pantallas de Logística y Planta.
- Los PDFs de orden y acta generados desde el backend ya no incluyen estos campos (ver PUNTO 6 implementado).
- Solo Comercial y Gerencia ven importes de cotización.

### 5.5 Estados de cotización
Flujo válido: `BORRADOR → EN_REVISIÓN → APROBADA_INTERNA → ENVIADA → ACEPTADA_CLIENTE → EMITIDA → ANULADA`

- `BORRADOR`: solo creador y admin_comercial pueden editar.
- `APROBADA_INTERNA`: requiere aprobación interna por persona distinta del creador.
- `EMITIDA`: solo después de aceptación del cliente y aprobación interna.
- `ANULADA`: no se puede emitir ni editar.

### 5.6 Roles inactivos en catálogo
El endpoint `GET /users/role-catalog` devuelve roles filtrados por `active=1`. El frontend debe:
- Mostrar solo roles activos en el selector de asignación de usuarios.
- Los roles inactivos (`admin_planta`, `director_tecnico`, etc.) no son opciones válidas.

---

## 6. Mapeo de permisos del backend a acciones del frontend

| Permiso backend | Acción frontend | Roles que lo ven |
|-----------------|-----------------|------------------|
| `usuarios.ver` | Ver lista de usuarios | admin_comercial, admin_logistica, admin_calidad, admin_lavanderia, auditor, gestor_documental, gerente_general, superadmin |
| `usuarios.identidad.gestionar` | Crear/editar identidad global, contraseña, estado | gerente_general, superadmin |
| `asignaciones.gestionar` | Gestionar asignaciones de usuarios del área | admin_comercial, admin_logistica, admin_calidad, admin_lavanderia, gerente_general, superadmin |
| `roles.gestionar` | Configurar roles y permisos | superadmin |
| `ambitos.gestionar` | Configurar estructura organizativa | superadmin |
| `clientes.ver/crear/editar/importar/activar/inactivar` | CRUD de clientes | admin_comercial, asesor_comercial, gerente_general, auditor |
| `cotizaciones.ver/crear/editar/previsualizar/descargar/aceptar` | Ver, crear, editar, previsualizar, descargar, aceptar cotizaciones | admin_comercial, asesor_comercial, gerente_general, auditor |
| `cotizaciones.aprobar_interna` | Aprobar propuesta interna | admin_comercial |
| `cotizaciones.enviar` | Enviar cotización al cliente | admin_comercial, asesor_comercial |
| `cotizaciones.emitir` | Emitir cotización | admin_comercial, asesor_comercial |
| `cotizaciones.reasignar` | Reasignar cotización | admin_comercial |
| `cotizaciones.exportar` | Exportar cotizaciones a Excel | auditor |
| `solicitudes_anulacion.crear/ver/aprobar` | Solicitar, ver, resolver anulaciones | admin_comercial, asesor_comercial (crear/ver), admin_comercial (aprobar) |
| `logistica.ordenes.ver/crear/cambiar_estado` | Ver, crear, cambiar estado de órdenes | admin_logistica, operador_logistica, gerente_general, auditor |
| `logistica.cotizaciones_disponibles.ver` | Ver cotizaciones disponibles | admin_logistica, operador_logistica, gerente_general, auditor |
| `logistica.recepciones.registrar` | Registrar recepciones | admin_logistica, operador_logistica |
| `logistica.reempaque.autorizar` | Autorizar reempaque | admin_logistica |
| `logistica.despacho.ejecutar` | Ejecutar despacho | admin_logistica |
| `planta.ordenes.ver` | Ver órdenes de Planta | admin_planta (inactivo), operario_planta (inactivo), gerente_general, auditor |
| `planta.ciclos.ver/crear` | Ver, crear ciclos | admin_planta (inactivo), operario_planta (inactivo), gerente_general, auditor |
| `planta.protocolos.ver` | Ver protocolos | admin_planta (inactivo), operario_planta (inactivo), gerente_general, auditor |
| `calidad.ciclos.ver` | Ver ciclos para Calidad | admin_calidad, analista_calidad, director_tecnico (inactivo), gerente_calidad (inactivo), auditor |
| `calidad.aprobar/rechazar` | Aprobar/rechazar ciclos | admin_calidad, analista_calidad |
| `calidad.protocolos.gestionar` | Gestionar protocolos | admin_calidad, director_tecnico (inactivo) |
| `calidad.desviaciones.verificar/aprobar` | Verificar/aprobar desviaciones | analista_calidad, admin_calidad |
| `calidad.liberacion_condicionada.autorizar` | Autorizar liberación condicionada | director_tecnico (inactivo) |
| `calidad.liberacion_desviacion.autorizar` | Autorizar liberación por desviación | director_tecnico (inactivo) |
| `certificados.ver/descargar` | Ver, descargar certificados | admin_calidad, analista_calidad, director_tecnico (inactivo), gerente_calidad (inactivo), auditor, gestor_documental |
| `certificados.elaborar/verificar/aprobar/exportar/restaurar` | Operaciones de certificado | admin_calidad, analista_calidad, director_tecnico (inactivo) |
| `certificados.anular` | Anular certificado | Sin rol asignado (pendiente de autoridad) |
| `formatos.ver/crear/editar/eliminar` | CRUD de formatos | gestor_documental, admin_calidad, analista_calidad, gerente_general, auditor |
| `formatos.versiones.crear/editar/publicar/aprobar` | Versiones de formato | gestor_documental, admin_calidad, analista_calidad, director_tecnico (inactivo), gerente_general |
| `formatos.excepcion.autorizar` | Autorizar excepción de versión | Sin rol asignado |
| `sellos.ver/crear/editar/desactivar` | CRUD de sellos | gestor_documental, gerente_general, auditor |
| `sellos.licencias.gestionar` | Gestionar licencias de sellos | Sin rol asignado |
| `auditoria.ver` | Ver eventos de auditoría | admin_calidad, auditor, gerente_general, superadmin |
| `tasas_fiscales.gestionar` | Publicar tasas fiscales | superadmin |
| `gerencia.metricas.ver` | Ver métricas gerenciales | gerente_general, superadmin |
| `gerencia.administradores.gestionar` | Gestionar administradores de áreas | superadmin |
| `lavanderia.ordenes.ver/proceso.registrar` | Órdenes y proceso de lavandería | admin_lavanderia (inactivo), operario_lavanderia (inactivo) |

---

## 7. Ejemplo de respuesta de `/auth/me`

El frontend debe consumir este endpoint para conocer los permisos y ámbitos del usuario autenticado:

```json
{
  "user": {
    "id": 4,
    "nombre": "María",
    "apellido": "García",
    "email": "maria@sterinova.local",
    "cargo": "Asesora Comercial",
    "celular": "3001234567",
    "email_contacto": "maria.contacto@sterinova.local",
    "profiles": [
      { "id": 12, "code": "asesor_comercial", "name": "Asesor Comercial" }
    ]
  },
  "permissions": ["clientes.ver", "clientes.crear", "clientes.editar", "cotizaciones.ver", "cotizaciones.crear", "cotizaciones.editar", "cotizaciones.previsualizar", "cotizaciones.descargar", "cotizaciones.enviar", "cotizaciones.emitir", "cotizaciones.aceptar", "solicitudes_anulacion.crear", "solicitudes_anulacion.ver"],
  "capabilities": [
    {
      "permission": "cotizaciones.crear",
      "scope_ids": [2],
      "own_scope_ids": []
    },
    {
      "permission": "cotizaciones.editar",
      "scope_ids": [],
      "own_scope_ids": [2]
    },
    {
      "permission": "cotizaciones.emitir",
      "scope_ids": [],
      "own_scope_ids": [2]
    }
  ],
  "current_scope": { "id": 2, "code": "comercial", "name": "Comercial", "kind": "DEPARTMENT" },
  "available_scopes": [
    { "id": 2, "code": "comercial", "name": "Comercial", "kind": "DEPARTMENT" }
  ]
}
```

**Campos clave para el frontend:**
- `profiles`: perfiles activos del usuario (para mostrar en UI).
- `permissions`: lista plana de permisos que el usuario tiene en al menos un ámbito.
- `capabilities`: permiso + `scope_ids` (SCOPE) + `own_scope_ids` (OWN). Usar para decidir qué botones mostrar y con qué ámbito.
- `current_scope`: ámbito seleccionado actualmente.
- `available_scopes`: ámbitos entre los que el usuario puede elegir (encabezado `x-scope-id`).

---

## 8. Notas de implementación para el frontend

1. **No confiar en el rol del JWT para autorización.** El backend valida permisos y ámbitos persistidos en cada request. El frontend solo debe usar la información de `/auth/me` para mostrar u ocultar elementos de UI.
2. **Siempre enviar `x-scope-id`** cuando el usuario haya seleccionado un ámbito. Si no hay selección y hay varios ámbitos disponibles, pedir al usuario que elija antes de mostrar datos.
3. **Manejar 403 como "acción no autorizada"** y 404 como "recurso no encontrado o fuera de ámbito" (el backend devuelve 404 para recursos fuera de ámbito para no filtrar existencia).
4. **Validar SoD en cliente como UX, no como seguridad.** La validación real está en el backend. El frontend puede deshabilitar botones de aprobación si `usuario_id === creador_id` para evitar errores innecesarios.
5. **Los roles inactivos no se envían al selector de asignación.** Si el backend devuelve `active=0` para un rol, no ofrecerlo como opción.
6. **Sin precios para Logística/Planta.** No solicitar ni mostrar campos de importe en pantallas de operaciones logísticas o de planta.

---

## 9. Pendientes de decisión de negocio (no implementar hasta resolver)

| Ítem | Roles afectados | Qué se necesita |
|------|----------------|-----------------|
| Activar `director_tecnico` | Director Técnico | Definir autoridad de anulación de certificados y liberación condicionada |
| Activar `gerente_calidad` | Gerente Calidad | Conciliar reglas de urgencia médica (M6/M7) |
| Activar `admin_planta` / `operario_planta` | Planta | Definir modelo de equipos, protocolos y retroactividad |
| Activar `admin_lavanderia` / `operario_lavanderia` | Lavandería | Definir documento de liberación de lavandería |
| Retirar o redefinir `admin_general` | Admin General | Actualmente desactivado; viola SoD |

---

**Fin de la especificación.** Este archivo puede entregarse al agente del frontend como referencia única de responsabilidades por rol.
