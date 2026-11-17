# ADR-005: Unificación del catálogo de roles y funciones RBAC

- **Estado:** aceptado
- **Fecha:** 17 de noviembre de 2026
- **Autor:** análisis de backend / ingeniería de requerimientos
- **Supersede:** roles legacy `usuarios.rol` (Admin, Comercial, Logistica, Planta, Calidad), plantillas RBAC iniciales (admin_area, comercial, emisor_comercial, logistica, planta, calidad, auditor_calidad), y rol temporal `legacy_admin_transition`.

## 1. Problema

Coexisten tres capas de roles sin una única fuente de verdad:

1. **Legacy** (`usuarios.rol`): `Admin`, `Comercial`, `Logistica`, `Planta`, `Calidad`. Columna aún presente; migración `RemoveLegacyUserRole1794484800000` aprobada pero no ejecutada.
2. **RBAC inicial** (activos): `superadmin`, `admin_area`, `comercial`, `emisor_comercial`, `logistica`, `planta`, `calidad`, `auditor_calidad`, `gestor_documental`. Piloto solo en Cotizaciones; permisos parciales fuera de ese módulo.
3. **Backend roles** (inactivos, `active=0`): 14 roles de negocio sin asignar a usuarios y sin endpoints migrados en la mayoría de módulos.

Esto genera permisos superpuestos, agujeros de autorización y responsabilidades difusas. No existe una matriz de separación de funciones (SoD) documentada.

## 2. Decisión

Se adopta un **catálogo único de roles RBAC** con clases `STANDARD` y `PLATFORM`, ámbitos (`GLOBAL`, `DEPARTMENT`, `TEAM`, `PLANT`), y permisos explícitos del catálogo (`permission-catalog.ts`). Cada rol tiene funciones y responsabilidades definidas, con restricciones de SoD aplicadas en capa de servicio.

## 3. Catálogo final de roles

### Roles activos en Fase 1

| Rol | Clase | Ámbito | Función y responsabilidad | Límites (SoD) |
|-----|-------|--------|---------------------------|---------------|
| `superadmin` | PLATFORM | GLOBAL | Titular técnico único. Identidades globales, catálogo de roles, ámbitos, delegación y recuperación técnica. Autoriza captura retroactiva M5. | No sustituye firmas profesionales. No elimina evidencias. |
| `gerente_general` | STANDARD | GLOBAL (elegible) | Consulta global de negocio y trazabilidad; aprobar finalmente versiones documentales conforme M8. | No administrar plataforma por su cargo. |
| `admin_comercial` | STANDARD | DEPARTMENT Comercial | Gerente Comercial; revisar condiciones y aprobar propuestas ajenas; resolver anulaciones; administrar pertenencias del área. | No autoaprobar su propia propuesta; persona distinta del creador. |
| `asesor_comercial` | STANDARD | SCOPE propio / Comercial compartido | Crear borradores, envío autorizado, registro de aceptación, emisión tras aceptación, solicitud de anulación motivada. | Nunca aprueba su propia propuesta; emisión exige aceptación documentada y aprobación vigentes. |
| `admin_logistica` | STANDARD | DEPARTMENT Logística | Jefe de Logística; operación del área, autorización de reempaque, pertenencias; autorización sin OC solo como jefe de área competente. | No liberar producto sin certificado de Calidad aplicable. |
| `operador_logistica` | STANDARD | Ámbito operativo exacto | Recepción, materiales, transporte, diferencias y entrega. | No liberar producto. |
| `admin_calidad` | STANDARD | DEPARTMENT Calidad | Jefe/Director de Calidad; protocolos, desviaciones, vigencias, propiedad documental y aceptación de pruebas. | No recibir automáticamente facultades del Director Técnico. |
| `analista_calidad` | STANDARD | Calidad sobre plantas/procesos delegados | Evaluación, verificación, decisión ordinaria por ciclo; primera aprobación de desviaciones/reprocesos; redacción/revisión documental. | Nunca ser registrador y aprobador del mismo ciclo. |
| `auditor` | STANDARD | GLOBAL (elegible) o ámbitos expresos | Lectura de expedientes y auditoría; exportar cotizaciones/certificados a Excel. | Sin edición, liberación ni administración. |
| `gestor_documental` | STANDARD | Documentos bajo Calidad | Redactar y versionar; publicar/retirar solo versiones aprobadas; gestionar sellos/licencias según delegación. | No autoatribuir aprobación final. |

### Roles inicialmente inactivos (pendientes de autoridad no definida)

| Rol | Motivo de exclusión | Pendiente de resolver |
|-----|---------------------|----------------------|
| `director_tecnico` | Autoridad de anulación de certificados y liberación condicionada/por desviación no definida | §6 y §13 de `roles-y-permisos.md` |
| `gerente_calidad` | Vía de urgencia médica bloqueada hasta conciliar reglas M6/M7 | M4/M6/M7 pendientes |
| `admin_planta` / `operario_planta` | Retroactividad requiere autorización formal separada | H6 de hoja de ruta integral |
| `admin_lavanderia` / `operario_lavanderia` | Liberación de lavandería y documento de liberación pendientes | Modelo inicialmente como rama de Planta no confirmado |

### Roles retirados

| Rol retirado | Motivo | Reemplazo |
|--------------|--------|-----------|
| `Admin`, `Comercial`, `Logistica`, `Planta`, `Calidad` (legacy `usuarios.rol`) | Fallback implícito que invalida RBAC con ámbitos | Catálogo RBAC único |
| `admin_area` | Plantilla con permisos parciales; no representa administrador de área especializado | `admin_comercial`, `admin_logistica`, `admin_planta`, `admin_calidad`, `admin_lavanderia` |
| `comercial` | Plantilla RBAC inicial con permisos incompletos fuera de Cotizaciones | `admin_comercial`, `asesor_comercial` |
| `emisor_comercial` | Rol de emisión aislado sin integración completa | `asesor_comercial` (con `cotizaciones.emitir` OWN) |
| `logistica`, `planta`, `calidad`, `auditor_calidad` | Plantillas RBAC iniciales con alcance limitado | Roles especializados del catálogo final |
| `legacy_admin_transition` | Rol temporal de transición; debe retirarse tras conciliación | Ninguno (transferencia explícita de titularidad) |

## 4. Matriz de separación de funciones (SoD)

| Operación | Ejecuta | Revisa / aprueba | Solo consulta | Restricción clave |
|-----------|---------|------------------|---------------|-------------------|
| Crear/invitar usuario del área | Admin del área | Conjunto delegable por SuperAdmin | GG, auditor | Admin de área no gestiona identidad global |
| Identidad global, roles, ámbitos, titularidad | SuperAdmin | Transferencia técnica explícita y auditada | SuperAdmin, auditoría | Nunca desde admin de área |
| Crear cliente | Asesor / admin Comercial | Revisión cliente por cliente | GG, auditor | Lectura compartida en Comercial |
| Aprobar propuesta interna (cotización) | Admin Comercial | Persona distinta del creador | Asesor, GG, auditor | No autoaprobación por multirrol |
| Enviar / emitir cotización | Asesor autorizado | Aprobación interna + aceptación previos | Comercial, GG, auditor | Emisión no es aprobación |
| Anulación de cotización | Asesor solicita | Admin del área resuelve (distinto del solicitante) | GG, auditor | Estado y versión válidos atómicamente |
| Crear orden / recibir material | Operador/admin Logística | Cotización aceptada + OC o autorización jefe | GG, auditor | No liberar sin certificado Calidad |
| Registrar ciclo Planta | Operario Planta | Equipo habilitado, protocolo aprobado por Calidad | Planta, Calidad, GG, auditor | Método contratado inalterable |
| Aprobar/rechazar ciclo | Analista Calidad | Nunca registrador del ciclo | GG, auditor | Dos personas distintas para desviaciones críticas |
| Liberación condicionada/por desviación | Director Técnico | Autorización formal + análisis de riesgo | GG, auditor | No contar como dos aprobadores |
| Elaborar / verificar / aprobar certificado | Planta / analista / DT | Distinto de elaborador y verificador | Calidad, GG, auditor | Doble aprobación por IDs distintos |
| Crear versión formato | Analista/gestor documental | Jefe Calidad propietario | Calidad, GG, auditor | Una versión nueva por cambio |
| Aprobar versión formato | Director Técnico o GG | Actor distinto del creador | Calidad, GG, auditor | Aprobación separada de publicación |

Regla general: una persona no satisface dos aprobaciones independientes. Comparar por ID de usuario, nunca por nombre de rol.

## 5. Consecuencias

- La migración `RemoveLegacyUserRole1794484800000` retira `usuarios.rol`, `rbac_roles.legacy_role`, y la función `rbac_user_legacy_role`. No tiene `down()` automático.
- Los roles retirados dejan de existir; sus asignaciones deben conciliarse al catálogo final antes o durante la migración.
- `admin_general` se crea como rol STANDARD con `global_assignable=1` y permisos heredados de `superadmin` (conforme a la migración existente).
- `superadmin` permanece como única clase PLATFORM con titularidad en `rbac_platform_owner`.
- No existe fallback a nombres de rol legacy ni a `usuarios.rol` en tiempo de ejecución.

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Pérdida de acceso tras retirar `usuarios.rol` | Conciliar asignaciones explícitas antes de ejecutar la migración; mantener al menos un global admin activo |
| Roles inactivos sin permisos claros | Activar solo los roles del catálogo final con funciones documentadas; los demás permanecen inactivos |
| SoD violada por multirrol | Validar por ID de usuario en capa de servicio, no por nombre de rol |
| Rol temporal `legacy_admin_transition` olvidado | Retirar mediante migración correctiva tras conciliación de titularidad |

## 7. Siguientes pasos

1. Ejecutar migración `RemoveLegacyUserRole1794484800000` (con backup y autorización explícita).
2. Retirar `legacy_admin_transition`.
3. Extender `AuthorizationGuard` a todos los módulos.
4. Aplicar filtros SQL por ámbito en módulos restantes.
5. Conciliar titular y asignaciones con script transaccional.
6. Pruebas de integración, build, lint.
