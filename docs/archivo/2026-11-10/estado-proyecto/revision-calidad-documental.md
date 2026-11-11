> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Revisión de calidad documental — cierre de auditoría

> **Estado:** vigente.
> **Verificado contra:** los 29 archivos Markdown finales de ambos repositorios, índices y estado Git observado el 6 de noviembre de 2026.
> **Alcance:** clasificación, cabeceras, fuentes canónicas, avisos de referencia, atribución por archivo y enlaces relativos.
> **No cubre:** reauditoría de código, despliegues, datos de MariaDB, ejecución de pruebas o aceptación visual.
> **Fuente canónica de:** calidad editorial y enlaces cruzados al cierre de la auditoría.

## Resultado

La documentación usa un índice por repositorio y una fuente canónica para cada tema duplicado. Se añadieron avisos en los documentos secundarios para que mantengan el contexto sin competir con el documento fuente. Los históricos permanecen separados. Las rutas locales entre `backend_sterinova` y `frontend_sterinova` resuelven desde la estructura actual de repositorios hermanos.

## Inventario y clasificación

| Repositorio | Documento | Clasificación | Tema / función |
|---|---|---|---|
| Backend | `docs/README.md` | Vigente | Índice del repositorio, agrupado por clasificación. |
| Backend | `docs/arquitectura/arquitectura-y-stack.md` | Vigente | Stack, autenticación, roles y riesgos de seguridad. |
| Backend | `docs/arquitectura/api-y-contratos.md` | Vigente | Rutas, acceso, DTO y límites del contrato API. |
| Backend | `docs/base-de-datos/esquema-y-migraciones.md` | Vigente | Entidades, columnas y migraciones. |
| Backend | `docs/base-de-datos/respaldos-y-operacion.md` | Referencia | Precauciones operativas de base de datos y storage. |
| Backend | `docs/calidad-y-pruebas/calidad-de-datos.md` | Vigente | Invariantes implementadas y límites de auditoría. |
| Backend | `docs/calidad-y-pruebas/pruebas.md` | Vigente | Inventario de pruebas y comandos de ambos repositorios. |
| Backend | `docs/estado-proyecto/auditoria-docs-2026-11-06.md` | Vigente | Informe de auditoría y atribución de cambios. |
| Backend | `docs/estado-proyecto/contexto-producto.md` | Vigente | Contexto del producto, no especificación funcional. |
| Backend | `docs/estado-proyecto/modulos.md` | Vigente | Estado funcional, tipos/prefijos y PDF. |
| Backend | `docs/estado-proyecto/revision-calidad-documental.md` | Vigente | Cierre editorial y enlaces de ambos repositorios. |
| Backend | `docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | Vigente | Síntesis ejecutiva de hallazgos, límites y siguientes pasos. |
| Backend | `docs/estado-proyecto/historico/analisis-estado-2026-11-03.md` | Histórico | Fotografía de código del 3 de noviembre. |
| Backend | `docs/estado-proyecto/historico/analisis-estado-2026-11-04.md` | Histórico | Fotografía de código del 4 de noviembre. |
| Backend | `docs/manuales/configuracion-local.md` | Vigente | Arranque local del backend. |
| Backend | `docs/manuales/despliegue.md` | Referencia | Configuración esperada y límites de despliegue. |
| Backend | `docs/ui-ux/correspondencia-ui-api.md` | Referencia | Diferencias observadas entre API y UI. |
| Frontend | `docs/README.md` | Vigente | Índice del frontend, enlaza fuentes backend donde corresponde. |
| Frontend | `docs/arquitectura/integracion-y-stack.md` | Vigente | Stack, sesión, cliente API y render PDF. |
| Frontend | `docs/arquitectura/navegacion-y-permisos.md` | Vigente | Rutas y visibilidad de enlaces. |
| Frontend | `docs/calidad-y-pruebas/pruebas-frontend.md` | Referencia | Detalle específico de pruebas frontend. |
| Frontend | `docs/estado-proyecto/contexto-producto.md` | Vigente | Contexto del producto desde frontend. |
| Frontend | `docs/estado-proyecto/modulos.md` | Vigente | Rutas y funciones visibles. |
| Frontend | `docs/estado-proyecto/historico/diseno-base-de-datos-inicial.md` | Histórico | Propuesta de base de datos inicial, reemplazada. |
| Frontend | `docs/manuales/desarrollo-local.md` | Vigente | Arranque local e integración con backend. |
| Frontend | `docs/ui-ux/accesibilidad.md` | Referencia | Hallazgos estáticos de accesibilidad. |
| Frontend | `docs/ui-ux/flujos-criticos.md` | Referencia | Síntesis de recorridos de interfaz. |
| Frontend | `docs/ui-ux/principios-y-patrones.md` | Referencia | Patrones de UI y estados observados. |
| Backend | `docs/calidad-y-pruebas/checklist-verificacion-operativa.md` | Vigente | Plan de verificación para ambiente controlado; no ejecutado. |

Los cinco Word `R-CM-07-1` a `R-CM-07-5` están clasificados como referencia desde el índice backend. No son archivos Markdown y no cuentan dentro de los 29 documentos `.md` listados arriba.

## Fuentes canónicas por tema

| Tema | Documento canónico | Documentos que lo referencian (sin duplicar) |
|---|---|---|
| Tipos/prefijos de cotización y disponibilidad | Backend `estado-proyecto/modulos.md` | Frontend `estado-proyecto/modulos.md`, `ui-ux/flujos-criticos.md`, backend `ui-ux/correspondencia-ui-api.md`. Avisos de referencia aplicados. |
| Esquema de entidades y columnas | Backend `base-de-datos/esquema-y-migraciones.md` | Backend `calidad-y-pruebas/calidad-de-datos.md`; aviso aplicado. |
| Migraciones y reversibilidad | Backend `base-de-datos/esquema-y-migraciones.md` | Backend `base-de-datos/respaldos-y-operacion.md`; aviso aplicado. |
| Autenticación y permisos API | Backend `arquitectura/arquitectura-y-stack.md` | Frontend `arquitectura/integracion-y-stack.md`, `arquitectura/navegacion-y-permisos.md`. Avisos aplicados. |
| Rutas/métodos API | Backend `arquitectura/api-y-contratos.md` | Backend `ui-ux/correspondencia-ui-api.md`, frontend `arquitectura/navegacion-y-permisos.md`, `ui-ux/flujos-criticos.md`. Avisos aplicados. |
| PDF oficial, QR y persistencia funcional | Backend `estado-proyecto/modulos.md` | Backend `arquitectura/arquitectura-y-stack.md`, frontend `arquitectura/integracion-y-stack.md`, `estado-proyecto/modulos.md`, `ui-ux/flujos-criticos.md`. Avisos aplicados. |
| Rutas visibles frontend | Frontend `estado-proyecto/modulos.md` | Frontend `arquitectura/navegacion-y-permisos.md`, `ui-ux/flujos-criticos.md`. Avisos aplicados. |
| Pruebas de ambos repositorios y estado de ejecución | Backend `calidad-y-pruebas/pruebas.md` | Frontend `calidad-y-pruebas/pruebas-frontend.md`; aviso aplicado. |
| Configuración para despliegue | Backend `manuales/despliegue.md` | Backend `base-de-datos/respaldos-y-operacion.md`, manuales locales. Avisos aplicados. |
| Accesibilidad | Frontend `ui-ux/accesibilidad.md` | Frontend `ui-ux/principios-y-patrones.md`; aviso aplicado. |
| Recorridos críticos frontend | Frontend `ui-ux/flujos-criticos.md` | Backend `ui-ux/correspondencia-ui-api.md`, módulos por repositorio. Avisos aplicados. |

El detalle de módulos y contexto del producto permanece en sus índices respectivos; no se ha promovido contenido histórico a fuente vigente.

## Cabeceras

Los 26 archivos Markdown presentes al cierre de la auditoría original y los tres documentos de cierre contienen estado clasificado, verificación con fecha, alcance y límite (`No cubre`). `Reemplaza a` / `Reemplazado por` se incluye cuando aplica; los históricos enlazan a sus sustitutos. El estado no se infiere para los Word de referencia porque no son Markdown.

## Validación de enlaces locales

Se recorrieron enlaces Markdown relativos de todos los documentos en ambos repositorios; se excluyeron URL web, correo y anclas sin ruta. Cada fila representa un enlace detectado. El tipo es `interno` si permanece en el repositorio de origen o `cruzado` si apunta al repositorio hermano.

En esta revisi?n se validaron **103 enlaces relativos**: 7 de backend a frontend y 20 de frontend a backend; todos resuelven. El conteo anterior de 71 correspond?a al cierre de auditor?a previo a estos documentos y enlaces de cierre.

| Archivo de origen | Enlace | Tipo | ?Resuelve? | Acci?n |
|---|---|---|---:|---|
| `backend/docs/arquitectura/api-y-contratos.md` | `arquitectura-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/arquitectura/api-y-contratos.md` | `../estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/arquitectura/api-y-contratos.md` | `../../../frontend_sterinova/docs/README.md` | cruzado | S? | Sin cambio; destino existe |
| `backend/docs/arquitectura/arquitectura-y-stack.md` | `../../../frontend_sterinova/docs/README.md` | cruzado | S? | Sin cambio; destino existe |
| `backend/docs/arquitectura/arquitectura-y-stack.md` | `../estado-proyecto/modulos.md#pdf-oficial-y-documentos` | interno | S? | Sin cambio; destino existe |
| `backend/docs/arquitectura/arquitectura-y-stack.md` | `../manuales/configuracion-local.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/arquitectura/arquitectura-y-stack.md` | `../base-de-datos/esquema-y-migraciones.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/base-de-datos/esquema-y-migraciones.md` | `../arquitectura/arquitectura-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/base-de-datos/esquema-y-migraciones.md` | `../estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/base-de-datos/respaldos-y-operacion.md` | `esquema-y-migraciones.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/base-de-datos/respaldos-y-operacion.md` | `esquema-y-migraciones.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/base-de-datos/respaldos-y-operacion.md` | `../manuales/despliegue.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/calidad-y-pruebas/calidad-de-datos.md` | `../base-de-datos/esquema-y-migraciones.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/calidad-y-pruebas/checklist-verificacion-operativa.md` | `../estado-proyecto/revision-calidad-documental.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/calidad-y-pruebas/pruebas.md` | `../../../frontend_sterinova/docs/calidad-y-pruebas/pruebas-frontend.md` | cruzado | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/historico/analisis-estado-2026-11-03.md` | `analisis-estado-2026-11-04.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/historico/analisis-estado-2026-11-03.md` | `../modulos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/historico/analisis-estado-2026-11-04.md` | `../modulos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/historico/analisis-estado-2026-11-04.md` | `../auditoria-docs-2026-11-06.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/modulos.md` | `auditoria-docs-2026-11-06.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/modulos.md` | `historico/analisis-estado-2026-11-04.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | `revision-calidad-documental.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | `../calidad-y-pruebas/checklist-verificacion-operativa.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | `revision-calidad-documental.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | `auditoria-docs-2026-11-06.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | `../calidad-y-pruebas/checklist-verificacion-operativa.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/manuales/configuracion-local.md` | `../../../frontend_sterinova/docs/manuales/desarrollo-local.md` | cruzado | S? | Sin cambio; destino existe |
| `backend/docs/manuales/configuracion-local.md` | `../README.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/manuales/configuracion-local.md` | `../arquitectura/arquitectura-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/manuales/configuracion-local.md` | `../base-de-datos/esquema-y-migraciones.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/manuales/despliegue.md` | `../base-de-datos/respaldos-y-operacion.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/manuales/despliegue.md` | `../base-de-datos/respaldos-y-operacion.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `arquitectura/arquitectura-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `arquitectura/api-y-contratos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `base-de-datos/esquema-y-migraciones.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `base-de-datos/respaldos-y-operacion.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `manuales/configuracion-local.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `manuales/despliegue.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `calidad-y-pruebas/pruebas.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `calidad-y-pruebas/calidad-de-datos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `ui-ux/correspondencia-ui-api.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `estado-proyecto/contexto-producto.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `estado-proyecto/auditoria-docs-2026-11-06.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `estado-proyecto/revision-calidad-documental.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `calidad-y-pruebas/checklist-verificacion-operativa.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `estado-proyecto/historico/analisis-estado-2026-11-04.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `estado-proyecto/historico/analisis-estado-2026-11-03.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `../../frontend_sterinova/docs/estado-proyecto/historico/diseno-base-de-datos-inicial.md` | cruzado | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `ejemplos-formatos/R-CM-07-1 COTIZACION ESTERILIZACION INDUSTRIAL V4 17-09-2026.docx` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `ejemplos-formatos/R-CM-07-2 COTIZACION ESTERILIZACION INSTITUCIONAL ETO V4 17-09-2026.docx` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `ejemplos-formatos/R-CM-07-3 COTIZACION ESTERILIZACION INSTITUCIONAL VAPOR V4 17-09-2026.docx` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `ejemplos-formatos/R-CM-07-4 COTIZACION INSUMOS V4 17-09-2026.docx` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `ejemplos-formatos/R-CM-07-5 LAVANDERIA FARMACEUTICA V4 17-09-2026.docx` | interno | S? | Sin cambio; destino existe |
| `backend/docs/README.md` | `../../frontend_sterinova/docs/README.md` | cruzado | S? | Sin cambio; destino existe |
| `backend/docs/ui-ux/correspondencia-ui-api.md` | `../arquitectura/api-y-contratos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/ui-ux/correspondencia-ui-api.md` | `../../../frontend_sterinova/docs/estado-proyecto/modulos.md` | cruzado | S? | Sin cambio; destino existe |
| `backend/docs/ui-ux/correspondencia-ui-api.md` | `../estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `backend/docs/ui-ux/correspondencia-ui-api.md` | `../arquitectura/api-y-contratos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/integracion-y-stack.md` | `../estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/integracion-y-stack.md` | `../../../backend_sterinova/docs/arquitectura/arquitectura-y-stack.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/integracion-y-stack.md` | `../../../backend_sterinova/docs/estado-proyecto/modulos.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/integracion-y-stack.md` | `../../../backend_sterinova/docs/estado-proyecto/modulos.md#pdf-oficial-y-documentos` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/integracion-y-stack.md` | `../manuales/desarrollo-local.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/navegacion-y-permisos.md` | `../estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/navegacion-y-permisos.md` | `../../../backend_sterinova/docs/arquitectura/arquitectura-y-stack.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/arquitectura/navegacion-y-permisos.md` | `../estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/calidad-y-pruebas/pruebas-frontend.md` | `../../../backend_sterinova/docs/calidad-y-pruebas/pruebas.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/estado-proyecto/historico/diseno-base-de-datos-inicial.md` | `../../../../backend_sterinova/docs/base-de-datos/esquema-y-migraciones.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/estado-proyecto/modulos.md` | `../../../backend_sterinova/docs/estado-proyecto/modulos.md#pdf-oficial-y-documentos` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/estado-proyecto/modulos.md` | `../../../backend_sterinova/docs/estado-proyecto/modulos.md#tipos-de-cotización-prefijos-y-disponibilidad` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/estado-proyecto/modulos.md` | `../../../backend_sterinova/docs/estado-proyecto/modulos.md#tipos-de-cotización-prefijos-y-disponibilidad` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/estado-proyecto/modulos.md` | `../arquitectura/integracion-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/estado-proyecto/modulos.md` | `../arquitectura/integracion-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/estado-proyecto/modulos.md` | `contexto-producto.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/manuales/desarrollo-local.md` | `../arquitectura/integracion-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/manuales/desarrollo-local.md` | `../../../backend_sterinova/docs/manuales/configuracion-local.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `../../backend_sterinova/docs/README.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `arquitectura/integracion-y-stack.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `arquitectura/navegacion-y-permisos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `manuales/desarrollo-local.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `estado-proyecto/contexto-producto.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `ui-ux/principios-y-patrones.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `ui-ux/accesibilidad.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `ui-ux/flujos-criticos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `calidad-y-pruebas/pruebas-frontend.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `../../backend_sterinova/docs/estado-proyecto/modulos.md#tipos-de-cotización-prefijos-y-disponibilidad` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `../../backend_sterinova/docs/estado-proyecto/auditoria-docs-2026-11-06.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `../../backend_sterinova/docs/estado-proyecto/revision-calidad-documental.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `../../backend_sterinova/docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `../../backend_sterinova/docs/calidad-y-pruebas/checklist-verificacion-operativa.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `estado-proyecto/historico/diseno-base-de-datos-inicial.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/README.md` | `../../backend_sterinova/docs/base-de-datos/esquema-y-migraciones.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/flujos-criticos.md` | `../estado-proyecto/modulos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/flujos-criticos.md` | `../../../backend_sterinova/docs/arquitectura/api-y-contratos.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/flujos-criticos.md` | `../../../backend_sterinova/docs/estado-proyecto/modulos.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/flujos-criticos.md` | `../../../backend_sterinova/docs/arquitectura/api-y-contratos.md` | cruzado | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/principios-y-patrones.md` | `accesibilidad.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/principios-y-patrones.md` | `flujos-criticos.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/principios-y-patrones.md` | `accesibilidad.md` | interno | S? | Sin cambio; destino existe |
| `frontend/docs/ui-ux/principios-y-patrones.md` | `../arquitectura/navegacion-y-permisos.md` | interno | S? | Sin cambio; destino existe |

La validación confirma resolución de rutas en la estructura actual de directorios hermanos. No garantiza que los enlaces cruzados sigan resolviendo si los repositorios se reubican o distribuyen por separado.
