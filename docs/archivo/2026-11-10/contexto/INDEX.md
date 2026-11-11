> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Índice de contexto – Sterinova-Backend

- Fecha de compilación: 2026-11-10
- Fuente principal: inspección de controladores, módulos, servicios, entidades y migraciones.
- Estado general: `🚧 parcial` para el material que requiere validación adicional con OpenAPI/BD real.

## Bloques

| Bloque                                 | Estado | Ruta                                         | Observación                                                                                                                                   |
| -------------------------------------- | ------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-1 Inventario real de endpoints HTTP | 🚧     | [endpoints.md](endpoints.md)                 | OpenAPI real generado en `docs/arquitectura/openapi.json`; la exportación directa a `docs/contexto` quedó bloqueada por `EADDRINUSE` en 3001. |
| P0-2 Modelo de datos                   | 🚧     | [modelo-datos.md](modelo-datos.md)           | Base estática desde entidades/migraciones; falta volcado real de BD.                                                                          |
| P0-3 RBAC                              | ✅     | [rbac.md](rbac.md)                           | Roles, permisos, scopes y pilot de cotizaciones.                                                                                              |
| P0-4 Autenticación JWT                 | ✅     | [auth.md](auth.md)                           | Registro de flujo actual y límites.                                                                                                           |
| P0-5 PDF render                        | ✅     | [pdf-render.md](pdf-render.md)               | Secuencia real de render y almacenamiento.                                                                                                    |
| P1-6 Inventario de módulos backend     | ✅     | [modulos-backend.md](modulos-backend.md)     | Mapa estructural actual del backend por dominio.                                                                                              |
| P1-7 Migraciones y seeds               | ✅     | [migraciones.md](migraciones.md)             | Serie real de migraciones y scripts de arranque/semillas.                                                                                     |
| P1-8 Cobertura de tests                | ✅     | [cobertura-tests.md](cobertura-tests.md)     | Inventario de unitarios, integración y E2E observados.                                                                                        |
| P1-9 Deuda técnica                     | ✅     | [deuda-tecnica.md](deuda-tecnica.md)         | TODOs y deuda visibles, con prioridad y alcance.                                                                                              |
| P1-10 Estados de entidades             | ✅     | [estados-entidades.md](estados-entidades.md) | Máquinas de estado reales para cotizaciones, órdenes y ciclos.                                                                                |

## Reglas y aclaraciones

- No se incluyen secretos reales; los valores de entorno se señalan como `<REDACTADO>`.
- Si un elemento no existe, se indica expresamente: “No aplica / no existe”.
- Cuando una afirmación no tiene fuente directa, se marca como `[inferido]`.
