# Arquitectura y stack

## Componentes

- Backend: API REST en NestJS y TypeScript.
- Persistencia: MariaDB mediante TypeORM. El esquema se administra con migraciones y synchronize está desactivado.
- Autenticación: JWT con guardas globales de autenticación y roles.
- Frontend: aplicación Next.js y React en frontend_sterinova; consume la API en el puerto 3001.
- Caché: CacheModule de NestJS. Redis aparece como pendiente en el código, no como dependencia activa.
- Pruebas: Vitest para pruebas unitarias e integración; configuración separada para E2E.

El backend habilita CORS para http://localhost:3000 y escucha actualmente en el puerto 3001. Las entidades y migraciones son la referencia para el esquema real; los documentos de diseño antiguos pueden describir objetivos aún no implementados.

Consulta [Configuración local](../manuales/configuracion-local.md) y [Base de datos](../base-de-datos/esquema-y-migraciones.md).