> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Deuda técnica – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente: grep sobre `TODO|FIXME|HACK|XXX` en `src/**` y `package.json`.
- Estado: ✅ consolidado por inspección estática.

## 1) Elementos observados

| Repo     | Archivo:línea                          | Descripción                                                                    | Prioridad | Bloqueador |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------ | --------- | ---------- |
| Backend  | `src/app.module.ts:86`                 | `// TODO: Cambiar a Redis en producción` en el registro de `CacheModule`.      | Media     | No         |
| Frontend | `src/app/(erp)/DashboardClient.tsx:78` | `TODO: Conectar a endpoint /api/metrics cuando esté disponible en el backend.` | Media     | No         |

## 2) Interpretación

- El backend no muestra una deuda técnica acuciante en código, salvo la decisión de cache local en memoria/Redis aún no migrado a producción.
- El frontend presenta un punto claro de integración pendiente para métricas operativas.
- No se observan `FIXME` o `HACK` activos en el código principal del backend ni del frontend, más allá de estos dos comentarios explícitos.

## 3) Estado operativo

La deuda detectada es de tipo de integración y evolución, no de estabilidad inmediata del núcleo de negocio. Hay una base de pruebas y una estructura RBAC/servicios que ya están funcionando en la práctica dentro del repo.
