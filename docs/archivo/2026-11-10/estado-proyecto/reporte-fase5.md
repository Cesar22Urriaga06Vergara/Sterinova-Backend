> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Reporte Fase 5 — Calidad, pruebas y CI

**Fecha:** 2026-11-06
**Estado:** implementación local completada; flujo integral habilitado para CI.

## Pipeline de CI

El workflow [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml) se ejecuta en `push` y `pull_request` a `main`. Levanta MariaDB 11.4 con el esquema aislado `sterinova_test`, instala con `npm ci` y ejecuta, en orden, `lint`, `build`, migraciones, pruebas con cobertura y E2E.

El job configura las variables `DB_*`, `JWT_SECRET` y `PDF_RENDER_SECRET`. En E2E activa `RUN_E2E_FULL_FLOW=1`, condición que ejecuta el recorrido integral y exige una base cuyo nombre incluya `test`.

## Flujo E2E y contrato OpenAPI

`test/app.e2e-spec.ts` incorpora el recorrido HTTP autenticado: login, alta de cliente y cotización, aprobación, creación de orden y paso a `EN_PLANTA`, registro del ciclo, aprobación de Calidad con confirmación de contraseña, descarga del PDF del certificado y consulta pública de su token. Usa MariaDB real y un renderer PDF determinista para aislar la dependencia del frontend. El bloque `finally` elimina los registros creados. La prueba valida status 200, `application/pdf` y la firma `%PDF-`.

`test/openapi-contract.e2e-spec.ts` solicita `/api/docs-json` desde la aplicación Nest iniciada en memoria. Compara las rutas y verbos HTTP documentados con los metadatos de los controladores registrados en Nest, en ambas direcciones. Así detecta rutas implementadas que faltan en Swagger y rutas documentadas que no existen en la implementación.

## Cobertura

Vitest limita el informe a `src/cotizaciones`, `src/calidad` y `src/certificados` y exige en cada directorio al menos 70% de líneas y 60% de ramas. El comando `npm run test -- --coverage` completó con esos umbrales.

Comparación de los servicios principales (líneas / ramas):

| Módulo | Antes | Después |
|---|---:|---:|
| Cotizaciones | 77.47% / 42.37% | 90.99% / 62.71% |
| Calidad | 81.96% / 64.28% | 81.96% / 64.28% |
| Certificados | 78.08% / 62.79% | 78.08% / 62.79% |

Las pruebas nuevas cubren cotización sin ítems, actualización de cliente, reglas de inmutabilidad y eliminación, reintentos/estados de PDF. El informe configurado incluye controladores y módulos además de los servicios; el umbral se evalúa sobre el conjunto de archivos de cada directorio.

## Runbook PDF y validaciones

`docs/manuales/runbook-pdfs.md` fue reescrito en UTF-8. Se verificó que sus bytes decodifican como UTF-8 y que el contenido recuperó acentos y caracteres españoles.

Validaciones locales ejecutadas:

- `npm run build` — correcto.
- `npm run lint` — código de salida 0 (quedaron dos warnings preexistentes en archivos fuera de esta fase).
- `npm run test` — 29 archivos aprobados, 104 pruebas aprobadas; una suite y dos pruebas omitidas por opt-in de integración con base de datos.
- `npm run test -- --coverage` — 29 archivos aprobados, 104 pruebas aprobadas; umbrales de cobertura satisfechos.
- `npm run test:e2e` — 3 archivos aprobados, 3 pruebas aprobadas y una omitida.
- `npx prettier --check .github/workflows/ci.yml` — sintaxis YAML válida.

La base configurada localmente no es un esquema de pruebas, por lo que no se habilitó allí el recorrido E2E con escrituras. El workflow sí lo habilita sobre `sterinova_test`; su resultado remoto se conocerá cuando GitHub ejecute el workflow.
