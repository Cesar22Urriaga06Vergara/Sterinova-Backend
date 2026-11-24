<a id="doc-contexto-rapido"></a>

# Contexto rápido — Sterinova Backend

## Stack comprobado

NestJS 12, TypeScript, TypeORM 0.3 y MariaDB/MySQL (`mysql2`). Los paquetes y comandos vigentes están en `package.json`.

## Entradas y módulos

- Entrada HTTP y composición: `src/main.ts`, `src/app.module.ts`.
- Configuración de datos: `src/database/`, especialmente `data-source.ts`, entidades y migraciones.
- Dominios: `src/auth/`, `src/users/`, `src/rbac/`, `src/clientes/`, `src/cotizaciones/`, `src/logistica/`, `src/ordenes-servicio/`, `src/planta/`, `src/calidad/`, `src/certificados/`, `src/formatos-documentales/`, `src/pdf/`.
- Compartidos: `src/common/` (guards, decorators y servicios); scripts operativos en `src/scripts/` y `scripts/`.

## Contratos y pruebas

Los estados `Borrador` de cotizaciones y `BORRADOR` de versiones de formatos documentales pertenecen a enums independientes. El valor persistido de cotizaciones sigue siendo `Borrador`; no requiere migración de datos.

- DTO y entidades viven junto al dominio que los usa, en sus carpetas `dto/` y `entities/`.
- OpenAPI: `docs/arquitectura/openapi.json`; documentación de API: `docs/arquitectura/api-y-contratos.md`.
- Pruebas unitarias: junto al código en `src/**/*.spec.ts`; integración/E2E: `test/`. Configuración: archivos `vitest.config*.ts`.
- Comandos: `npm test`, `npm run test:e2e -- <archivo>`, `npm run build`.

## Documentación activa

- Punto de entrada: `docs/FUENTES_VIGENTES.md`; índice: `docs/FUENTES_VIGENTES.md`.
- Reglas: `docs/REQUISITOS_Y_REGLAS.md`; estado y decisiones técnicas: `docs/ARQUITECTURA_Y_CONTRATOS.md` y `docs/arquitectura/adr/`.
- Persistencia: `docs/base-de-datos/`; operación: `docs/OPERACION_Y_CALIDAD.md`; calidad: `docs/OPERACION_Y_CALIDAD.md`.
- los históricos y auditorías se retiraron conserva mapas, planes, auditorías y prompts fechados; no es contexto de inicio. `docs/auditoria-contratos/` está en curso.

## Cómo localizar un cambio

Consulta primero [Fuentes vigentes](FUENTES_VIGENTES.md), ubica el dominio aquí y limita búsquedas a esa ruta y extensión. El [mapa del 11 de noviembre](historico/capturas/FUENTES_VIGENTES.md) es solo una captura. Si la tarea afecta el Frontend, usa su `docs/FUENTES_VIGENTES.md`. Sigue una llamada hacia sus dependencias directas; no abras todo el histórico, todas las pruebas ni el frontend si la tarea no lo requiere. Los formatos institucionales en `docs/ejemplos-formatos/` son solo referencias por tarea: no leas ni copies su contenido al contexto general.
