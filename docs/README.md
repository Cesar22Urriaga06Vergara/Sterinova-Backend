# Documentación de Sterinova

Reorganización: 10 de noviembre de 2026. Separar requisitos confirmados, diseño objetivo y comportamiento implementado. La documentación no acredita despliegue ni certificación normativa.

## Lectura progresiva

Empieza por [contexto rápido](CONTEXTO_RAPIDO.md) y consulta el [mapa completo](ESTRUCTURA_BACKEND.md) solo para localizar rutas. Abre únicamente el módulo y las referencias directas de la tarea. `archivo/`, los planes, las auditorías y los formatos institucionales se consultan por tema, no como contexto inicial.

## Lectura principal

1. [Contexto del producto](negocio/contexto-producto.md).
2. [Reglas maestras de los ocho módulos](negocio/reglas-maestras.md): decisiones, propuestas y pendientes preservados.
3. [Arquitectura organizacional y matriz RBAC](arquitectura/roles-y-permisos.md): jerarquía, ámbitos, separación de funciones y brechas.
4. [Estado implementado](arquitectura/estado-implementado.md): evidencia del código y límites del piloto.

## Referencias técnicas y operación

| Carpeta | Contenido |
|---|---|
| arquitectura/ | Diseño RBAC, diagnóstico actual, stack, API/OpenAPI, dependencias y [decisiones ADR](arquitectura/adr/README.md) |
| negocio/ | Contexto y maestro de reglas de negocio |
| base-de-datos/ | [Esquema y migraciones](base-de-datos/esquema-y-migraciones.md), [respaldos](base-de-datos/respaldos-y-operacion.md) |
| manuales/ | [Configuración local](manuales/configuracion-local.md), [despliegue](manuales/despliegue.md), [incidentes](manuales/runbook-incidentes.md), [PDF](manuales/runbook-pdfs.md) |
| calidad-y-pruebas/ | [Pruebas](calidad-y-pruebas/pruebas.md), calidad de datos, aceptación PDF y checklist operativo |
| ui-ux/ | Correspondencia UI/API, con fecha de verificación propia |
| ejemplos-formatos/ | Referencias Word/PDF conservadas; no implican aprobación de implementación |
| gestion-documental/ | [Registro de movimientos y consolidaciones](archivo/2026-11-11/gestion-documental/reorganizacion-2026-11-10.md), inventario original con SHA-256 |
| archivo/2026-11-10/ | Fases, hitos, auditorías e inventarios anteriores; solo trazabilidad histórica |

El [contrato del piloto](arquitectura/contrato-autorizacion-rbac.md) conserva el comportamiento técnico previo; el diseño objetivo no altera los permisos actuales. Las reglas fuente de los módulos se conservan también en el [repositorio frontend](negocio/reglas-maestras.md). Si se modifican, conciliar el maestro para evitar divergencia.

Los documentos técnicos conservados tienen fechas propias: usar el diagnóstico actual para RBAC y consultar el archivo solo para antecedentes. No copiar instrucciones de arranque de una fase histórica sin contrastarlas con la configuración vigente.

## Consolidación del 11 de noviembre de 2026

- [Contexto técnico del frontend](arquitectura/contexto-frontend.md).
- [Cuestionarios originales](negocio/cuestionarios-origen.md).
- [Inventario actualizado](inventario-documental.md).
