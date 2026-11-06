# Configuración local del backend

> **Estado:** vigente.
> **Verificado contra:** configuración, scripts y dependencias del backend el 6 de noviembre de 2026.
> **Alcance:** preparación local del backend y comandos disponibles.
> **No cubre:** configuración productiva ni valores de secretos.

## Requisitos

- Node.js y npm compatibles con el proyecto.
- MariaDB accesible y base de datos creada.
- Dependencias instaladas con `npm install`.

## Variables

Configura en `.env` local:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`.
- `JWT_SECRET`.
- Para generar PDFs: `PDF_RENDER_SECRET` (mínimo 32 caracteres) y `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL`. El valor local habitual es `http://localhost:3000`.
- Opcional: `PDF_STORAGE_PATH`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

El archivo .env.example incluye las variables reconocidas y deja los secretos vacios. Copia ese archivo como .env y completa credenciales locales; nunca copies secretos reales a archivos versionados.

No publiques secretos ni uses una variable `NEXT_PUBLIC_*` para `PDF_RENDER_SECRET`.

## Arranque

Primero inicia el frontend según su [manual local](../../../frontend_sterinova/docs/manuales/desarrollo-local.md), y luego en el backend:

```powershell
npm install
npm run migration:show
npm run migration:run
npm run start:dev
```

La API escucha en `http://localhost:3001`. `start:dev` ejecuta migraciones antes de levantar NestJS. Revisa el estado y respalda la base antes de aplicar migraciones a datos existentes.

Para aprovisionar el primer Admin, define `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` de al menos 12 caracteres y ejecuta `npm run bootstrap:admin`. No existe una ruta HTTP `/auth/seed`.

## Comandos útiles

- `npm run build`: compila la API.
- `npm run lint`: analiza `src/` y `test/`.
- `npm run test`: ejecuta las pruebas unitarias.
- `npm run test:e2e`: ejecuta pruebas end to end.
- `npm run migration:show`: compila y muestra migraciones pendientes/aplicadas en la base configurada.

Consulta el [índice](../README.md), la [arquitectura y seguridad](../arquitectura/arquitectura-y-stack.md) y el [esquema y migraciones](../base-de-datos/esquema-y-migraciones.md).
