# Contexto rápido — Sterinova Backend

## Stack comprobado

NestJS 12, TypeScript, TypeORM 0.3 y MariaDB/MySQL (`mysql2`). Los paquetes y comandos vigentes están en `package.json`.

## Entradas y módulos

- Entrada HTTP y composición: `src/main.ts`, `src/app.module.ts`.
- Configuración de datos: `src/database/`, especialmente `data-source.ts`, entidades y migraciones.
- Dominios: `src/auth/`, `src/users/`, `src/rbac/`, `src/clientes/`, `src/cotizaciones/`, `src/logistica/`, `src/ordenes-servicio/`, `src/planta/`, `src/calidad/`, `src/certificados/`, `src/formatos-documentales/`, `src/pdf/`.
- Compartidos: `src/common/` (guards, decorators y servicios); scripts operativos en `src/scripts/` y `scripts/`.

## Contratos y pruebas

- DTO y entidades viven junto al dominio que los usa, en sus carpetas `dto/` y `entities/`.
- OpenAPI: `docs/arquitectura/openapi.json`; documentación de API: `docs/arquitectura/api-y-contratos.md`.
- Pruebas unitarias: junto al código en `src/**/*.spec.ts`; integración/E2E: `test/`. Configuración: archivos `vitest.config*.ts`.
- Comandos: `npm test`, `npm run test:e2e -- <archivo>`, `npm run build`.

## Documentación activa

- Índice: `docs/README.md`.
- Reglas: `docs/negocio/`; estado y decisiones técnicas: `docs/arquitectura/` y `docs/arquitectura/adr/`.
- Persistencia: `docs/base-de-datos/`; operación: `docs/manuales/`; calidad: `docs/calidad-y-pruebas/`.
- `docs/auditorias/` contiene resultados por tema; léelos solo si son pertinentes. `docs/archivo/` conserva antecedentes y no es contexto de inicio.

## Cómo localizar un cambio

Consulta primero el [mapa completo](ESTRUCTURA_BACKEND.md), ubica el dominio aquí y limita búsquedas a esa ruta y extensión. Si la tarea afecta el Frontend, su mapa está en `../../SterinovaFrontend/docs/ESTRUCTURA_FRONTEND.md`. Sigue una llamada hacia sus dependencias directas; no abras todo el histórico, todas las pruebas ni el frontend si la tarea no lo requiere. Los formatos institucionales en `docs/ejemplos-formatos/` son solo referencias por tarea: no leas ni copies su contenido al contexto general.
