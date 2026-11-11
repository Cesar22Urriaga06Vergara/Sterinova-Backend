> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Reporte Fase 6 — Observabilidad y despliegue

**Fecha:** 6 de noviembre de 2026
**Repositorio:** `backend_sterinova`

## Implementación

- Se integraron `nestjs-pino`, `pino-http`, `pino-pretty` y `@nestjs/terminus`.
- En desarrollo los logs salen en consola con `pino-pretty`; con `NODE_ENV=production` se emiten como JSON.
- Cada petición obtiene un UUID `correlation_id`, se devuelve en `x-correlation-id` y se adjunta a los logs HTTP. Los serializers no escriben body, headers, dirección del cliente ni query string. Pino redacta propiedades `password`, `token`, `access_token`, `refresh_token`, `authorization` y `cookie`.
- Se agregó `GET /health/live` para verificar el proceso y `GET /health/ready` para comprobar MariaDB, escritura/lectura temporal del storage configurado y conectividad real de Chromium/Playwright. El chequeo de readiness usa límites de tiempo y devuelve 503 cuando una dependencia aparece `down`.
- Los endpoints de health son públicos y están excluidos del throttling para que el balanceador pueda consultarlos.

## Verificación local

| Comprobación | Resultado |
|---|---|
| `npm run build` | Correcto. |
| `npm run migration:show` | 12 migraciones aplicadas; no había pendientes. |
| `npm run start:dev` | Inició correctamente; la ejecución previa de migraciones indicó “No migrations are pending”. |
| `GET /health/live` | HTTP 200, `{"status":"ok"}`. |
| `GET /health/ready` | HTTP 200; `database`, `storage` y `pdf_renderer` en `up` (24 ms, 120 ms y 579 ms en esta ejecución). |
| Logs HTTP | Se observaron UUID `correlation_id` en las peticiones de health; salida legible de desarrollo. |
| `npm test` | 30 archivos pasaron, 1 omitido; 107 pruebas pasaron, 2 omitidas. |

Los endpoints se comprobaron contra la configuración local y la base local disponibles en esta máquina; esto no demuestra disponibilidad de staging/producción.

## Runbooks

- [Runbook de despliegue](../../../manuales/despliegue.md): variables, secuencia de instalación/build/migraciones/arranque, estrategia Blue/Green, rollback y persistencia de PDFs.
- [Runbook de incidentes](../../../manuales/runbook-incidentes.md): base de datos caída, fallos/OOM de Playwright, storage lleno y migraciones fallidas.

## Alcance operativo pendiente de ambiente

El código, documentación y verificaciones locales de la Fase 6 solicitadas quedaron completados. No se ejecutó un despliegue real ni se configuraron recursos externos de staging, gestor de secretos, balanceador, alertas, dashboards o backups automáticos; esos elementos dependen de la infraestructura del ambiente y deben verificarse allí antes de declarar el staging operativo.
