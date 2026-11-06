# Contribuir a Backend Sterinova

Este documento define el flujo para preparar cambios revisables y mantener el contrato de la API alineado con el backend.

## Preparar el entorno

1. Clona el repositorio y ejecuta `npm ci` desde la raíz.
2. Copia `.env.example` a `.env` y completa MariaDB, `JWT_SECRET` y `PDF_RENDER_SECRET` con valores locales privados. Configura el frontend en `http://localhost:3000` para renderizar PDFs.
3. Crea o selecciona una base MariaDB local. Antes de aplicar migraciones, confirma que `DB_DATABASE` apunta al esquema correcto.
4. Ejecuta `npm run start:dev`. El comando aplica las migraciones y levanta NestJS en el puerto configurado; durante el arranque genera `docs/arquitectura/openapi.json` y Swagger UI queda disponible en `/api/docs`.
5. Ejecuta `npm run build`, `npm run test` y `npm run lint` antes de abrir un PR. Las pruebas que requieran servicios externos deben configurarse según `docs/calidad-y-pruebas/pruebas.md`.

Para aprovisionar el primer usuario administrador, define `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` según `.env.example` y ejecuta `npm run bootstrap:admin`.

## Ramas

Usa nombres cortos en minúscula con guiones, prefijo de tipo y una descripción:

- `feature/<descripcion>` para capacidades nuevas.
- `fix/<descripcion>` para correcciones.
- `docs/<descripcion>` para documentación.
- `chore/<descripcion>` para mantenimiento y herramientas.
- `hotfix/<descripcion>` para correcciones urgentes de producción.

Ejemplo: `feature/auditoria-de-certificados`.

## Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/) en español o inglés, con un tipo y un ámbito opcional:

```text
feat(certificados): agrega consulta de auditoría
fix(auth): limita intentos de inicio de sesión
docs(api): actualiza el contrato OpenAPI
```

Tipos habituales: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build` y `chore`. Cada commit debe representar un cambio coherente.

## Pull Requests

1. Actualiza tu rama desde la rama base y abre un PR con objetivo, contexto y pasos de verificación.
2. Completa todos los puntos de `.github/PULL_REQUEST_TEMPLATE.md`. Si un punto no aplica, explica por qué.
3. Incluye o actualiza pruebas para cambios de comportamiento. Si cambia una ruta, DTO, respuesta, autenticación o error observable, actualiza el OpenAPI y verifica el contrato.
4. Describe las migraciones y cambios de configuración; nunca incluyas secretos ni datos reales.
5. Espera los checks requeridos y la revisión del equipo. Atiende observaciones en commits nuevos y solicita la revisión final antes de integrar.

## Documentación viva

- El contrato ejecutable es `docs/arquitectura/openapi.json`, generado desde decoradores NestJS al iniciar en un entorno no productivo y al ejecutar `npm run test:contract`. La interfaz Swagger se sirve en `/api/docs`.
- Si una ruta o DTO cambia, revisa las anotaciones OpenAPI y `npm run test:contract`; `test/openapi-contract.e2e-spec.ts` comprueba que las rutas registradas estén documentadas.
- Registra decisiones de arquitectura aceptadas o propuestas en `docs/arquitectura/adr/` y añade el enlace al índice.
- Añade cambios relevantes a `CHANGELOG.md` y actualiza manuales operativos cuando varíe el despliegue o la configuración.
