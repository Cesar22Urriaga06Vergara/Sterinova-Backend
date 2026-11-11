> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Reporte Fase 7 — Documentación viva y cierre

**Fecha:** 6 de noviembre de 2026
**Repositorio:** `backend_sterinova`

## Gobernanza y mantenimiento

- `CONTRIBUTING.md` en la raíz documenta preparación del entorno, ramas, Conventional Commits, PRs y obligaciones de actualización documental.
- `.github/PULL_REQUEST_TEMPLATE.md` incluye checklist de pruebas, OpenAPI, migraciones, variables de entorno y documentación relacionada.
- `CHANGELOG.md` registra el baseline documental `1.0.0` de las fases 0 a 6. No representa una etiqueta Git ni un release desplegado.

## Decisiones de arquitectura

El índice actualizado está en [`docs/arquitectura/adr/README.md`](../../../arquitectura/adr/README.md): ADR-001 sobre evidencias y firmas permanece como propuesta de negocio; ADR-002 registra Playwright + Next.js para PDFs; ADR-003 documenta el bloqueo pesimista y almacenamiento de secuencias de cotizaciones y certificados.

## OpenAPI

`src/main.ts` construye el documento con `@nestjs/swagger` y lo sirve en `/api/docs`. En cada arranque con `NODE_ENV` distinto de `production` persiste el mismo documento como `docs/arquitectura/openapi.json`; `npm run start:dev` ejecuta ese arranque después de las migraciones. Se evita escribir documentación durante el arranque productivo. `npm run test:contract` tambien persiste el JSON y comprueba que las rutas registradas coincidan con las documentadas.

Al modificar rutas o DTOs, actualiza decoradores/anotaciones OpenAPI, ejecuta `npm run test:contract` para regenerar y verificar el JSON. La guía de contribución y el template de PR mantienen este paso visible.

## Quality gate local

| Comprobación | Resultado |
|---|---|
| `npm run build` | Correcto. |
| `npm run test` | 31 archivos pasaron, 1 omitido; 108 pruebas pasaron, 2 omitidas. |
| `npm run test:contract` | Correcto; 1 prueba de contrato pasó y generó `docs/arquitectura/openapi.json`. |
| Revisión Markdown | Cercas de código balanceadas. La revisión de enlaces encontró cinco referencias preexistentes en `docs/README.md` a formatos `.docx` que no están en este repositorio. |

## Estado de cierre

La Fase 7 queda documentada y el backend está listo para el hand-off técnico y condicionado para operar: antes de declararlo en producción deben completarse y verificarse el despliegue real, secretos, conectividad y recursos de infraestructura, respaldos y monitoreo en el ambiente de destino. Las verificaciones locales de build y pruebas se consignan según su resultado al cierre de esta fase; no sustituyen la validación del ambiente productivo.
