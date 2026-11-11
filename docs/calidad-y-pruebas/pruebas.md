# Pruebas backend

> **Estado:** vigente como inventario estático, revisado el 6 de noviembre de 2026.
> **Verificado contra:** scripts y archivos de pruebas backend/frontend el 6 de noviembre de 2026.
> **Alcance:** comandos, configuraciones y archivos de prueba detectados.
> **No cubre:** resultados, cobertura medida ni calidad demostrada por ejecución.
> **Fuente canónica de:** comandos y alcance de pruebas backend.

## Comandos declarados

| Comando | Uso declarado |
|---|---|
| `npm run test` | Vitest unitario (`vitest run`). |
| `npm run test:watch` | Vitest interactivo. |
| `npm run test:cov` | Vitest con cobertura. |
| `npm run test:e2e` | Vitest con `vitest.config.e2e.ts`. |
| `npm run lint` | Oxlint en `src/` y `test/`. |
| `npm run build` | Compilación NestJS. |

El backend contiene especificaciones `*.spec.ts` en módulos y migraciones y `test/app.e2e-spec.ts`. Las áreas incluyen auth/guards, Calidad, certificados, clientes, cotizaciones, migraciones, formatos, PDF, Planta, sellos, usuarios y controlador raíz.

En frontend existen cuatro pruebas `.mjs` puntuales y no hay script `test` en `package.json`. El detalle por repositorio está en [pruebas frontend](../../../SterinovaFrontend/docs/calidad-y-pruebas/pruebas-frontend.md); esta página es la fuente canónica del inventario y estado general de verificación de pruebas de ambos repositorios.

La auditoría inventarió los archivos; no ejecutó pruebas, lint ni build.

No se reporta aquí cobertura numérica ni resultado de CI. Los comandos de migración requieren configuración de base incluso si el proyecto compila.
