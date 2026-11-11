> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Cobertura y tests – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente: `src/**/*.spec.ts`, `test/**/*.ts`, `vitest.config*.ts`, `package.json`.
- Estado: ✅ consolidado por inspección estática.

## 1) Inventario de pruebas unitarias y de dominio

Se observan tests unitarios por módulo en `src/**/*.spec.ts`, por ejemplo:

- `src/auth/auth.security.spec.ts`
- `src/users/users.service.spec.ts`
- `src/clientes/clientes.service.spec.ts`
- `src/cotizaciones/cotizaciones.service.spec.ts`
- `src/cotizaciones/cotizaciones-edit.spec.ts`
- `src/cotizaciones/cotizaciones-emission.spec.ts`
- `src/cotizaciones/cotizaciones-tax.spec.ts`
- `src/cotizaciones/cotizaciones.quality-branches.spec.ts`
- `src/logistica/materiales-orden.spec.ts`
- `src/logistica/logistica-sequence.spec.ts`
- `src/planta/planta.service.spec.ts`
- `src/planta/dto/create-ciclo.dto.spec.ts`
- `src/calidad/calidad.service.spec.ts`
- `src/certificados/certificados.service.spec.ts`
- `src/certificados/certificados.concurrency.spec.ts`
- `src/pdf/pdf-generator.service.spec.ts`
- `src/pdf/pdf-render-token.spec.ts`
- `src/rbac/rbac-session.spec.ts`
- `src/rbac/rbac-schema.spec.ts`
- `src/rbac/authorization.guard.spec.ts`
- `src/rbac/authorization-policy.spec.ts`
- `src/formatos-documentales/*.spec.ts`
- `src/common/services/storage.service.spec.ts`

## 2) Pruebas de migración y RBAC

Además del core de módulo, se observan pruebas específicas para funciones históricas y de seguridad:

- `src/database/migrations/1794096000000-AddScopedRbac.spec.ts`
- `src/database/migrations/1794096001000-ScopeQuotePilot.spec.ts`
- `src/database/migrations/1793813600000-AddUsersAndCertificationSeals.spec.ts`
- `src/database/migrations/schema-migrations.spec.ts`

## 3) Pruebas E2E / integración

La carpeta `test/` contiene escenarios de integración y del contrato real:

- `app.e2e-spec.ts`
- `auth-throttle.e2e-spec.ts`
- `openapi-contract.e2e-spec.ts`
- `hito4-operational.integration-spec.ts`
- `hito4-pdf.integration-spec.ts`
- `hito4-local-backup.integration-spec.ts`
- `rbac-schema.integration-spec.ts`
- `rbac-quote-pilot.integration-spec.ts`
- `rbac-migration-chain.integration-spec.ts`

## 4) Ejecutores observados

`package.json` define:

- `npm test` -> `vitest run`
- `npm run test:e2e` -> `vitest run --config ./vitest.config.e2e.ts`
- `npm run test:rbac:schema` -> `vitest run --config ./vitest.config.rbac.ts`
- `npm run test:contract` -> validación del contrato OpenAPI

## 5) Gaps observados

- Hay una cobertura fuerte en RBAC, PDF, calidad y cotizaciones.
- No aparece un conjunto exhaustivo de specs para `clientes`/`usuarios`/`auditoria` a nivel end-to-end.
- La evidencia existente confirma una base sólida de pruebas unitarias, pero no reemplaza la validación de DB real con datos de negocio y migraciones aplicadas.
