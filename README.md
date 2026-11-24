# Sterinova ERP — Backend

API REST del ERP de Sterinova, construida con NestJS y TypeORM sobre MariaDB.

## Requisitos

- Node.js 22.x (ver `.nvmrc` o `nvm use 22`) y npm 10.x.
- MariaDB 11.4 accesible localmente y una base de datos creada para la aplicación.
- Variables de entorno configuradas en `.env` a partir de `.env.example`. No subas secretos al repositorio.

## Inicio local

```powershell
npm ci
Copy-Item .env.example .env
npm run migration:show
npm run migration:run
npm run start:dev
```

La API escucha por defecto en http://localhost:3002. Las migraciones se ejecutan de forma explícita con `npm run migration:run`; revisa el estado de la base y crea un respaldo antes de migrar datos existentes. `start:dev` y `start:prod` no aplican migraciones ni cargan datos; `start:deploy` ejecuta migraciones y bootstrap antes de iniciar producción.

Para crear el primer administrador en un entorno local, ejecuta `npm run bootstrap:admin`, inyectando temporalmente `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` desde el entorno privado. El CLI falla si ya existe cualquier usuario, y `start:deploy` puede crear la cuenta inicial una sola vez cuando recibe esas variables en producción. Los demás usuarios se crean desde la gestión protegida por permisos de administrador.

## Variables de entorno

Las variables que el código lee realmente son:

- Base de datos: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- Servidor HTTP: `PORT`, `CORS_ORIGINS`, `NODE_ENV`
- Seguridad: `JWT_SECRET`
- Generación de PDF: `PDF_STORAGE_PATH`, `PDF_RENDER_BASE_URL`, `FRONTEND_INTERNAL_URL`, `PDF_RENDER_SECRET`, `PDF_RENDER_TIMEOUT_MS`
- Administrador inicial: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Sellos/ICONTEC: `CERTIFICATION_SEALS_PATH`, `ICONTEC_SELLO_ID` (opcional)
- Pruebas con base aislada: `RUN_DB_INTEGRATION=1` (solo en entornos de prueba)

Las obligatorias para iniciar la API son `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET` y `PDF_RENDER_SECRET`. Para aprovisionar el primer usuario, entrega temporalmente `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` solo al proceso CLI.

## Comandos útiles

- npm run build: compila la API.
- npm run lint: analiza src/ y test/.
- npm run test: ejecuta pruebas unitarias.
- npm run test:e2e: ejecuta pruebas end to end.

## Documentación

Empieza por [fuentes vigentes](docs/FUENTES_VIGENTES.md) y usa el [fuentes vigentes](docs/FUENTES_VIGENTES.md) para arquitectura, esquema, operación y formatos de referencia.

## PDF rendering

Set PDF_RENDER_BASE_URL to the internal frontend URL. Set PDF_RENDER_SECRET to the same secret of at least 32 characters in both backend and frontend deployments. Keep it server-only; do not use a NEXT_PUBLIC_* variable. The local frontend default is http://localhost:3000.
