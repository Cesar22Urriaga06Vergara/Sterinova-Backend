# Arquitectura, autenticación y seguridad

> **Estado:** vigente.
> **Verificado contra:** código backend y frontend el 6 de noviembre de 2026.
> **Alcance:** arquitectura backend, autenticación, autorización y riesgos de seguridad visibles.
> **No cubre:** configuración efectiva de despliegue ni seguridad de instancias.

## Componentes

- API REST: NestJS 12 y TypeScript; puerto predeterminado 3001, sin prefijo global. La configuración de CORS permite `http://localhost:3000` (`src/main.ts`).
- Persistencia: MariaDB mediante TypeORM 0.3; migraciones explícitas, `synchronize: false` y `migrationsRun: false` (`src/app.module.ts`, `src/database/data-source.ts`).
- Web: Next.js 16.4.5, React 19.3 y TypeScript; el detalle de rutas e integración está en [documentación del frontend](../../../SterinovaFrontend/docs/README.md).
- PDF: Playwright en el backend renderiza componentes React servidos por páginas internas del frontend. El flujo, QR y hash se documentan en la [fuente canónica funcional](../archivo/2026-11-10/estado-proyecto/modulos.md#pdf-oficial-y-documentos).
- Caché: `CacheModule` en memoria; el módulo contiene un TODO de Redis, que no está configurado como almacén activo (`src/app.module.ts`).
- Pruebas: hay especificaciones Vitest en `src/`; existen configuraciones separadas para pruebas unitarias e E2E. Esta auditoría no ejecutó pruebas.

## Autenticación y autorización

`JwtAuthGuard` y `RolesGuard` están registrados como guardas globales. Las rutas requieren JWT válido salvo que estén marcadas con `@Public()`. Los controladores usan `@Roles(...)` para autorización por perfil; `RolesGuard` también permite al rol `Admin` en rutas restringidas.

Roles definidos: `Admin`, `Comercial`, `Logistica`, `Planta` y `Calidad` (`src/users/entities/user-role.enum.ts`). La ruta `POST /auth/login` es pública. La ruta `GET /certificados/validar/:token` es pública para validación; las demás rutas de certificados requieren autenticación y roles de Admin o Calidad. No existe `POST /auth/seed` en el controlador actual.

El primer administrador se aprovisiona mediante `npm run bootstrap:admin`, que requiere `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` de al menos 12 caracteres y falla si ya existe esa cuenta (`src/scripts/bootstrap-admin.ts`). No se observaron credenciales de bootstrap en una ruta HTTP.

Las credenciales y secretos deben permanecer en configuración privada del entorno: `JWT_SECRET`, `DB_*`, `PDF_RENDER_SECRET`, `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL`. `PDF_RENDER_SECRET` debe tener al menos 32 caracteres y compartirse entre backend y frontend sin prefijo `NEXT_PUBLIC_` (`src/pdf/pdf-render-token.ts`). No se revisaron valores de `.env`.

## Alcance y riesgos de seguridad observables

- La autorización por rol sí está implementada en API; no debe confundirse con la visibilidad de enlaces o la protección visual de la UI.
- `/certificados/validar/:token` publica datos del certificado aprobado asociados al token aleatorio. Tratar el token como credencial pública de validación.
- Los PDFs se guardan en disco local por defecto (`storage/pdfs`); no se verificó persistencia compartida o respaldos en despliegue.
- El CORS observado solo declara el origen local; no se verificó configuración por ambiente productivo.
- No se encontró configuración de rate limiting ni una canalización de métricas/trazas/logs estructurados; la observación es sobre el código inspeccionado, no sobre servicios externos del despliegue.

Consulta [configuración local](../manuales/configuracion-local.md) y [esquema y migraciones](../base-de-datos/esquema-y-migraciones.md).
