# Reporte de cierre — Fase 1: Seguridad y contrato API

Fecha: 2026-11-06

## Seguridad e infraestructura

- `JWT_SECRET` ya no tiene secreto de fallback. `JwtStrategy` falla explícitamente al inicializar si falta o está vacío; `AuthModule` exige la variable con `ConfigService.getOrThrow`.
- CORS lee `CORS_ORIGINS` como lista separada por comas y elimina espacios y entradas vacías. El puerto HTTP lee `PORT` (por defecto `3001`).
- Helmet se aplica globalmente.
- El límite global es de 100 solicitudes por minuto por IP. `POST /auth/login` queda limitado a 5 solicitudes por minuto.
- El `ValidationPipe` global mantiene `whitelist`, `forbidNonWhitelisted` y `transform` habilitados.
- `.env.example` documenta variables de base de datos, JWT, render PDF, frontend, puerto y CORS con valores vacíos o locales de ejemplo. No se agregó ni modificó `.env`.

## DTOs y contrato

La auditoría de controladores encontró DTOs validados para todos los `@Body()` y ningún `@Query()` en controladores. Los DTOs existentes de clientes, cotizaciones, calidad, usuarios, logística, planta, sellos y formatos documentales ya usan `class-validator`; no fue necesario crear DTOs de entrada adicionales.

Se añadieron metadatos OpenAPI a `LoginDto`, `CreateClienteDto`, `CreateCotizacionDto` y `CreateCotizacionItemDto`, y documentación de operaciones y respuestas en Auth, Clientes, Cotizaciones, Calidad y Certificados.

Swagger está expuesto en `/api/docs` (JSON en `/api/docs-json`). Se inició la aplicación y se verificó que el JSON responde con HTTP 200 y el título `Sterinova API`.

## Dependencias

El primer escaneo registró 9 hallazgos (2 altos, 5 moderados y 2 bajos). Tras `npm audit fix` sin `--force` y retirar `@nestjs/mau`, que no se usaba, el escaneo final registra 3 moderados y ningún hallazgo alto o crítico. Los restantes están en `glob`/`minimatch` dentro de TypeORM; npm propone para resolverlos un salto mayor a TypeORM 1.1.2, que se dejó pendiente por compatibilidad. El detalle está en [auditoria-dependencias.md](../arquitectura/auditoria-dependencias.md).

## Validación

- Build: `npm run build` — correcto.
- Unitarias: `npm run test` — 25 archivos, 87 pruebas aprobadas.
- E2E: `npm run test:e2e` — 2 archivos, 2 pruebas aprobadas.
- Seguridad auth: se probó el error al instanciar `JwtStrategy` sin `JWT_SECRET` y `POST /auth/login` devuelve 429 en el sexto intento dentro de la ventana.
- Runtime: la aplicación inició con configuración local y se consultó `/api/docs-json` correctamente.

Fase 1 completada. El contrato de API está documentado en Swagger y el reporte de dependencias deja identificado el trabajo pendiente que requiere una migración mayor de TypeORM.
