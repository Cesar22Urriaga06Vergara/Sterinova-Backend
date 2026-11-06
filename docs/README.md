# Documentación del backend

> **Estado:** vigente (índice).
> **Verificado contra:** inventario documental de ambos repositorios el 6 de noviembre de 2026.
> **Alcance:** clasificación y navegación de la documentación backend.
> **No cubre:** estado de despliegues, esquemas efectivos ni cumplimiento operativo.
> **Fuente canónica de:** índice documental backend.

Revisada contra el código de `backend_sterinova` y `frontend_sterinova` el 6 de noviembre de 2026. Las instancias desplegadas y el estado real de sus bases de datos no se consultaron; las afirmaciones de implementación describen el código del repositorio.

## Documentos vigentes

- [Arquitectura, autenticación y seguridad](arquitectura/arquitectura-y-stack.md)
- [API y contratos](arquitectura/api-y-contratos.md)
- [Contrato OpenAPI generado](arquitectura/openapi.json) (se regenera al iniciar el backend en desarrollo)
- [Indice de decisiones de arquitectura (ADR)](arquitectura/adr/README.md)
- [Reporte de cierre de Fase 7](estado-proyecto/reporte-fase7.md)
- [Esquema, entidades y migraciones](base-de-datos/esquema-y-migraciones.md)
- [Respaldos y operación de base de datos](base-de-datos/respaldos-y-operacion.md)
- [Configuración local](manuales/configuracion-local.md)
- [Despliegue: aspectos verificables](manuales/despliegue.md)
- [Pruebas y comandos](calidad-y-pruebas/pruebas.md)
- [Calidad e invariantes de datos](calidad-y-pruebas/calidad-de-datos.md)
- [Correspondencia UI–API](ui-ux/correspondencia-ui-api.md)
- [Estado funcional, tipos de cotización y pendientes](estado-proyecto/modulos.md)
- [Contexto del producto](estado-proyecto/contexto-producto.md)
- [Auditoría documental del 6 de noviembre de 2026](estado-proyecto/auditoria-docs-2026-11-06.md)
- [Revisión de calidad documental](estado-proyecto/revision-calidad-documental.md)
- [Resumen ejecutivo de cierre](estado-proyecto/resumen-cierre-auditoria-2026-11-06.md)
- [Plan de acción backend (6 de noviembre de 2026)](estado-proyecto/plan-accion-backend-2026-11-06.md)
- [Checklist de verificación operativa](calidad-y-pruebas/checklist-verificacion-operativa.md)

## Documentos históricos

- [Análisis fechado del 4 de noviembre de 2026](estado-proyecto/historico/analisis-estado-2026-11-04.md): fotografía anterior al flujo actual de Calidad, Usuarios y emisión de documentos. Reemplazado por los documentos vigentes y por la auditoría del 6 de noviembre.
- [Análisis fechado del 3 de noviembre de 2026](estado-proyecto/historico/analisis-estado-2026-11-03.md): antecedente histórico; reemplazado por el análisis del 4 de noviembre.
- [Diseño inicial de base de datos](../../frontend_sterinova/docs/estado-proyecto/historico/diseno-base-de-datos-inicial.md): propuesta, no esquema actual.

## Formatos de referencia

Los archivos Word son referencias documentales y no prueban por sí solos que una plantilla operativa coincida con ellos.

- R-CM-07-1 — Esterilización industrial
- R-CM-07-2 — Esterilización institucional EtO
- R-CM-07-3 — Esterilización institucional vapor
- R-CM-07-4 — Insumos
- R-CM-07-5 — Lavandería farmacéutica

La documentación del frontend está en el [índice de frontend](../../frontend_sterinova/docs/README.md).
