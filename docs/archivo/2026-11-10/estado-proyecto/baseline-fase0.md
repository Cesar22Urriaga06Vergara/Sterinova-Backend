> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

﻿# Reporte Baseline — Fase 0 Backend

## 1. Entorno
- Node: v24.13.0
- npm: 11.10.0
- Estado de compilación (`npm run build`): Exitoso (código de salida 0; `nest build`, sin errores ni advertencias de TypeScript)
- `npm ci`: Exitoso; agregó 494 paquetes y auditó 495. npm informó 9 vulnerabilidades (2 low, 5 moderate, 2 high).

## 2. Base de Datos y Migraciones
- Salida de `migration:show`:
  ```text
  npm warn using --force Recommended protections disabled.

  > Backend Sterinova@0.0.1 migration:show
  > npm run build && typeorm migration:show -d dist/database/data-source.js

  npm warn using --force Recommended protections disabled.

  > Backend Sterinova@0.0.1 build
  > nest build

  ◇ injected env (10) from .env
  [X] 1 InitialSchema1730750400000
  [X] 2 AddQualityCertificates1730750401000
  [X] 3 AddCertificateValidationToken1730750402000
  [X] 5 AddDocumentFormatVersioning1793750400000
  [X] 6 ResetCertificateSequenceToThreeDigits1793754000000
  [X] 7 ExtendDocumentSequences1793757600000
  [X] 8 AddClienteDocumentFields1793813200000
  [X] 9 CreateAuditoria1793813300000
  [X] 10 AddTemplateResponsible1793813400000
  [X] 11 AddPdfRendererVersion1793813500000
  [X] 12 AddUsersAndCertificationSeals1793813600000
  ```
- Conclusión: 11 migraciones aplicadas y 0 pendientes. Coincide el total de 11 migraciones declaradas en `src/database/data-source.ts` (líneas 24–36). Los identificadores mostrados son 1, 2, 3, 5–12.

## 3. Pruebas Automatizadas
- Resultados Unitarias (`npm run test`): 25 archivos pasaron; 86 pruebas pasaron (0 fallidas). Cobertura no reportada. Duración: 11.00 s.
- Resultados E2E (`npm run test:e2e`): 1 archivo pasó; 1 prueba pasó (0 fallidas). Cobertura no reportada. Duración: 3.51 s.
- Fallos detectados: Ninguno.

## 4. Configuración TypeORM y Seguridad
- `synchronize`: false (Línea exacta: `src/app.module.ts:40`; también `src/database/data-source.ts:39`)
- `migrationsRun`: false (Línea exacta: `src/app.module.ts:41`; no aparece en `src/database/data-source.ts`)
- Fallback de `JWT_SECRET`: Sí. `src/auth/jwt.strategy.ts:18-20` usa `configService.get<string>('JWT_SECRET') ?? process.env.JWT_SECRET ?? 'sterinova_secret_key_2026'`.
- Archivo `.env.example`: No existe en la raíz (verificado con `Test-Path -LiteralPath .env.example`, resultado `False`).

## 5. Estado de Git
- Rama actual: `main` (sincronizada con `origin/main` al momento de `git status`). Último commit: `e6a6bd5 feat: add Sterinova ERP backend`.
- Cambios sin confirmar: Sí. `git status` reportó archivos modificados y eliminados bajo `docs/`, además de varios archivos y directorios sin seguimiento bajo `docs/`. No se modificó código en `src/` o `test/`. Este reporte se crea como archivo nuevo sin seguimiento.

## 6. Conclusión de la Fase 0
- ¿El entorno es estable para iniciar la Fase 1 (Seguridad y Contrato API)? Sí con salvedades. Build, migraciones de solo lectura y pruebas terminaron correctamente. La Fase 1 debería priorizar retirar el fallback literal de `JWT_SECRET` y asegurar que el secreto se exija en configuración. `npm ci` reportó 9 vulnerabilidades; no se ejecutó `npm audit` ni se intentó corregirlas.
- Bloqueantes identificados: Ningún bloqueo operativo observado. Riesgos a tratar en Fase 1: fallback de JWT presente, ausencia de `.env.example` y 2 vulnerabilidades high reportadas durante la instalación.
