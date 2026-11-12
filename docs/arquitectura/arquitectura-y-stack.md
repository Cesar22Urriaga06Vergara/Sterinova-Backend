# Arquitectura, autenticación y seguridad

> **Estado:** vigente.
> **Verificado contra:** código backend y frontend el 12 de noviembre de 2026.
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

Las rutas privadas requieren JWT y una política explícita del guard global de autorización. Las políticas RBAC validan permisos persistidos y ámbitos por solicitud; una ruta sin política explícita se deniega. No existe bypass por `usuarios.rol`, nombre visible de perfil o ID de cuenta. `POST /auth/login` y las rutas declaradas públicas usan `@Public()`.

Los perfiles se asignan por `role_id` y `scope_id`; sus permisos determinan las capacidades de la sesión. La respuesta de sesión publica permisos, capacidades, ámbito actual y perfiles descriptivos, no un rol de compatibilidad. La UI usa esos permisos para navegación y acciones; las operaciones sobre recursos también validan sus ámbitos y reglas de negocio.

El bootstrap requiere `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` de al menos 12 caracteres, configurados en el entorno privado. En una instalación sin asignaciones RBAC, `npm run bootstrap:admin` crea el usuario y asigna `Admin General` mediante `rbac_set_user_roles`. `--if-missing` no modifica una cuenta existente. Para reconfigurar la identidad ya conservada con ID 1, usar `npm run bootstrap:admin -- --reconfigure-id1`: requiere `ADMIN_EMAIL` y `ADMIN_PASSWORD`; si no se define `ADMIN_NAME`, conserva el nombre actual. La operación invalida sesiones previas y verifica una concesión global explícita. Si hay asignaciones existentes y la cuenta ID 1 no es ya administradora global, el script se detiene y requiere que una cuenta autorizada asigne el perfil; no concede privilegios por ID. No se ejecutó el bootstrap ni se modificó una base de datos en esta revisión.

No se observaron credenciales de bootstrap en una ruta HTTP. Las credenciales y secretos deben permanecer en configuración privada del entorno: `JWT_SECRET`, `DB_*`, `PDF_RENDER_SECRET`, `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL`. `PDF_RENDER_SECRET` debe tener al menos 32 caracteres y compartirse entre backend y frontend sin prefijo `NEXT_PUBLIC_` (`src/pdf/pdf-render-token.ts`). No se revisaron valores de `.env`.

Las credenciales y secretos deben permanecer en configuración privada del entorno: `JWT_SECRET`, `DB_*`, `PDF_RENDER_SECRET`, `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL`. `PDF_RENDER_SECRET` debe tener al menos 32 caracteres y compartirse entre backend y frontend sin prefijo `NEXT_PUBLIC_` (`src/pdf/pdf-render-token.ts`). No se revisaron valores de `.env`.

## Alcance y riesgos de seguridad observables

- La visibilidad de enlaces es solo una ayuda de navegación; la API vuelve a validar el permiso y el ámbito.
- `/certificados/validar/:token` publica datos del certificado aprobado asociados al token aleatorio. Tratar el token como credencial pública de validación.
- Los PDFs se guardan en disco local por defecto (`storage/pdfs`); no se verificó persistencia compartida o respaldos en despliegue.
- El CORS observado solo declara el origen local; no se verificó configuración por ambiente productivo.
- No se encontró configuración de rate limiting ni una canalización de métricas/trazas/logs estructurados; la observación es sobre el código inspeccionado, no sobre servicios externos del despliegue.

Consulta [configuración local](../manuales/configuracion-local.md) y [esquema y migraciones](../base-de-datos/esquema-y-migraciones.md).
