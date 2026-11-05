# Sterinova ERP — Backend

API REST del ERP de Sterinova, construida con NestJS y TypeORM sobre MariaDB.

## Requisitos

- Node.js y npm.
- MariaDB accesible localmente y una base de datos creada para la aplicación.
- Variables de entorno configuradas en .env. No subas secretos al repositorio.

## Inicio local

~~~powershell
npm install
npm run migration:show
npm run migration:run
npm run start:dev
~~~

La API escucha en http://localhost:3001. migration:run compila antes de aplicar migraciones. Revisa el estado de la base y crea un respaldo antes de migrar datos existentes.

Variables utilizadas: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE y JWT_SECRET. Para crear el primer administrador, define también ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD y ejecuta npm run bootstrap:admin.

## Comandos útiles

- npm run build: compila la API.
- npm run lint: analiza src/ y test/.
- npm run test: ejecuta pruebas unitarias.
- npm run test:e2e: ejecuta pruebas end to end.

## Documentación

Consulta el [índice de documentación](docs/README.md) para arquitectura, esquema, configuración local, estado del proyecto y formatos de referencia.
## PDF rendering

Set PDF_RENDER_BASE_URL to the internal frontend URL. Set PDF_RENDER_SECRET to the same secret of at least 32 characters in both backend and frontend deployments. Keep it server-only; do not use a NEXT_PUBLIC_* variable. The local frontend default is http://localhost:3000.
