> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Instrucciones para la segunda tanda de contexto — Sterinova ERP

**Archivo de destino:** `docs/contexto/INSTRUCCIONES_CONTEXTO_TANDA2.md`
**Fecha de creación:** 2026-11-10
**Precede:** `INSTRUCCIONES_CONTEXTO.md` (tanda 1)
**Prerrequisito:** leer primero los bloques P0 de la tanda 1. Esta tanda no reemplaza ni repite lo ya hecho.

---

## Objetivo

Ampliar y cerrar la documentación de contexto para ambos repositorios con la evidencia que todavía está parcialmente incompleta: volcado real de OpenAPI/BD, RBAC contrastado, migraciones, tests, deuda técnica, estados de negocio y reglas de negocio. La intención es que un agente o desarrollador pueda operar sin depender de inferencias no contrastadas.

---

## Reglas generales

- No incluir valores reales de secretos, credenciales ni cadenas de conexión. Usar `<REDACTADO>`.
- Marcar fecha y fuente en cada bloque, por ejemplo: “extraído de `openapi.json` el 2026-11-10”.
- Distinguir hecho de inferencia con la etiqueta `[inferido]`.
- Si algo no aplica o no existe, indicarlo explícitamente como “No aplica / no existe”.
- Cada bloque debe ir en un `.md` dentro de `docs/contexto/` y enlazarse desde `INDEX.md` con estado: ✅ listo / 🚧 parcial / ❌ pendiente.
- Si requiere ejecución, indicar el comando exacto a ejecutar y no inventar el resultado.

---

## Tanda 2A — Desbloquear los P0 parciales (máxima prioridad)

### 2A-1. Volcado real de endpoints

**Qué necesito:** regenerar `endpoints.md` desde un OpenAPI real y no solo desde grep.

**Cómo obtenerlo:**

```bash
npm run start:dev
curl http://localhost:3001/api-json -o docs/contexto/openapi.json
```

Si la ruta real de Swagger en `src/openapi/` es otra, usar esa ruta declarada. Si `api-json` no existe, documentar el bloque como `🚧` con el comando exacto pendiente.

**Salida esperada:**

- `docs/contexto/openapi.json` creado y fechado.
- `docs/contexto/endpoints.md` reescrito con tabla origen real: método, path, auth, DTO entrada, DTO salida, `@Public()`, `@Roles`, `@RequirePermission` si aplica.

**Criterio de cierre:** el bloque debe estar contrastado con el JSON real y no solo con patrones de controlador.

---

### 2A-2. Esquema real de BD

**Qué necesito:** sustituir la base inferida de `modelo-datos.md` por un volcado real del schema MariaDB.

**Cómo obtenerlo:**

```sql
SHOW TABLES;
SHOW CREATE TABLE <cada_tabla>;
```

O bien, si existe entorno de TypeORM con schema exportable:

```bash
npx typeorm-uml ormconfig.json
```

**Salida esperada:**

- `docs/contexto/modelo-datos.md` actualizado con información por tabla.
- Cada bloque debe indicar: nombre de tabla, columnas clave, tipos, default, FK, índices y constraints.
- Añadir fuente: “`SHOW CREATE TABLE` el 2026-11-10” o “`typeorm-uml` el 2026-11-10”.

**Criterio de cierre:** no dejar datos con etiqueta `[inferido]` cuando exista la fuente real.

---

### 2A-3. Matriz RBAC real

**Qué necesito:** cerrar la matriz real de roles, permisos, scopes y recursos, contrastando:

- `src/rbac/`
- `src/auth/`
- `docs/estado-proyecto/piloto-cotizaciones-rbac-2026-11-08.md`
- `tasks/todo.md`

**Cómo extraerlo:**

- revisar `permission-catalog.ts`, `authorization.guard.ts`, `authorization-policy.ts`, `entities/*.entity.ts`
- comprobar la versión histórica de migración RBAC en `src/database/migrations/1794096000000-AddScopedRbac.ts`
- contrastar con `docs/estado-proyecto/...` para distinguir lo que sigue siendo piloto y lo que ya está normalizado.

**Salida esperada:**

- `docs/contexto/rbac.md` actualizado.
- `docs/contexto/modelo-datos.md` y `endpoints.md` ajustados si la matriz real exige cambios de permisos/scope.
- Anotar filas `[inferido]` cuando no haya código o doc fuente directa.

---

## Tanda 2B — Bloques P1 restantes

### 2B-1. Migraciones y seeds (`migraciones.md`)

**Qué necesito:** lista ordenada de migraciones, identificando qué son reversibles y qué no, además de los seeds y sus efectos.

**Fuentes:**

- `src/database/migrations/`
- `scripts/`
- `package.json` de backend (`seed:icontec`, `seed:templates`, `bootstrap:admin`)

**Salida:**
`docs/contexto/migraciones.md` con:

- nombre de migración → propósito en una línea
- tablas afectadas
- reversible (sí/no)
- seeds: qué crean y a qué entidades afectan

**Criterio:** no inventar migraciones no visibles en la carpeta; si no hay source, indicar “No aplica / no existe”.

---

### 2B-2. Inventario de tests (`cobertura-tests.md`)

**Qué necesito:** inventario estático de pruebas, sin ejecutar.

**Fuentes:**

- Backend: `src/**/*.spec.ts`, `test/**/*.ts`, `vitest.config*.ts`
- Frontend: `tests/*.test.mjs`, `e2e/*.spec.ts`, `playwright.config.ts`

**Salida:**
`docs/contexto/cobertura-tests.md` con:

- backend: archivos por módulo, tests E2E/integración/contrato, módulos sin tests
- frontend: flujo y archivo por prueba, gaps claros
- fecha de revisión

**Criterio:** no asumir cobertura; documentar únicamente lo que se ve en la estructura actual.

---

### 2B-3. Deuda técnica (`deuda-tecnica.md`)

**Qué necesito:** consolidar TODOs, FIXMEs, HACKs y `throw new Error('TODO')` con priorización.

**Comandos a ejecutar:**

```bash
grep -RIn "TODO\|FIXME\|HACK\|XXX" src test docs --include="*.ts" --include="*.tsx" --include="*.md"
```

En ambos repos: backend y frontend.

**Salida:**
`docs/contexto/deuda-tecnica.md` con tabla:

- repo
- archivo:línea
- descripción
- prioridad estimada
- bloqueador (sí/no)

**Criterio:** cruzar con `tasks/todo.md` y con TODOs visibles en el dashboard/frontend si existen; no dejar items ambiguos.

---

### 2B-4. Máquina de estados por entidad (`estados-entidades.md`)

**Qué necesito:** documentar los estados reales para:

- cotización
- orden de servicio
- ciclo de esterilización
- evaluación de Calidad
- certificado

**Fuentes:**

- `src/cotizaciones/`
- `src/logistica/`
- `src/planta/`
- `src/calidad/`
- `src/certificados/`
- docs/arquitectura y estado del proyecto si aplica

**Salida:**
`docs/contexto/estados-entidades.md` con:

- enum real del estado
- transiciones válidas
- quién dispara (rol / endpoint)
- efectos colaterales (PDF, sello, correo, etc.)
- diagramas Mermaid

**Criterio:** si no existe una transición documentada, marcar “No documentado en código” en lugar de inventarla.

---

### 2B-5. Patrones frontend (`patrones-frontend.md`)

**Qué necesito:** documentar el patrón de UI frontend usando 2–3 ejemplos reales.

**Fuentes:**

- `src/lib/`
- `src/components/ui/`
- páginas de `cotizaciones` y `calidad`

**Salida:**
`docs/contexto/patrones-frontend.md` con:

- data fetching
- formularios
- state global
- manejo de errores
- loading/skeleton
- estructura típica de página `(erp)/<módulo>/`

**Criterio:** no repetir lo hecho en la tanda 1; se actualiza solo si hay evidencia adicional.

---

### 2B-6. Dependencias directas (`dependencias-directas.md`)

**Qué necesito:** lista exacta de dependencias directas por repositorio, agrupadas por categoría, sin transitivas.

**Fuente:** `package.json` de ambos repos.

**Salida:**
`docs/contexto/dependencias-directas.md` con tablas por categoría:

- framework
- persistencia
- seguridad
- UI
- testing
- build

**Criterio:** documentar versión exacta y señalar duplicidades entre repos si coinciden nombre con versión distinta.

---

### 2B-7. Reglas de negocio tabuladas (`reglas-negocio.md`)

**Qué necesito:** consolidar reglas de negocio por módulo y vincularlas a fuente y test.

**Fuentes:**

- `docs/estado-proyecto/modulos.md`
- `docs/estado-proyecto/contexto-producto.md`
- tests relevantes por módulo (si existen)

**Salida:**
`docs/contexto/reglas-negocio.md` con formato:

- módulo
- regla
- fuente
- test que la cubre (o “sin test”)

**Criterio:** si una regla viene solo de documentación y no hay test, dejar claro la ausencia de cobertura.

---

## Tanda 2C — Bloques P2 (menor prioridad)

### 2C-1. Contrato HTTP (`contrato-http.md`)

**Qué necesito:** revisar si existe wrapper de respuesta estándar y cómo se manejan errores HTTP.

**Fuentes:**

- backend: filtros globales, excepciones, DTOs de respuesta
- frontend: interceptores Axios, manejo de errores

**Salida:** `docs/contexto/contrato-http.md`.

---

### 2C-2. Configuración Next.js (`config-nextjs.md`)

**Qué necesito:** documentar la configuración real de Next.js, Tailwind y TS.

**Fuentes:**

- `next.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`

**Salida:** `docs/contexto/config-nextjs.md` con diferencias dev/prod relevantes para PDF render.

---

### 2C-3. Auditoría (`auditoria.md`)

**Qué necesito:** describir eventos de auditoría, datos guardados y alcance de consulta.

**Fuentes:** `src/auditoria/`

**Salida:** `docs/contexto/auditoria.md`.

---

### 2C-4. Catálogos (`catalogos.md`)

**Qué necesito:** listar tipos de cliente, servicios, sellos, formatos y tasas fiscales.

**Salida:** `docs/contexto/catalogos.md`.

---

### 2C-5. Despliegue (`despliegue.md`)

**Qué necesito:** explicar cómo se despliega cada repo hoy, mostrando evidencia real o indicando “no documentado”.

**Fuentes:** scripts, README, CI/config, infra visible.

**Salida:** `docs/contexto/despliegue.md`.

---

## Verificación al cerrar la tanda

1. Leer `docs/contexto/INDEX.md` de cada repo y confirmar:
   - que cada bloque nuevo está enlazado con estado real
   - que los bloques `🚧` llevan comando pendiente anotado
   - que no aparecen secretos reales ni cadenas sospechosas
2. Confirmar que `openapi.json`, si se obtuvo, está fecha y adjunto en `docs/contexto/`.
3. Reportar brevemente:
   - qué quedó ✅
   - qué sigue 🚧
   - qué requiere ejecución real y no puede cerrarse por inspección estática

---

## Notas de alcance

- No se modifica código; solo documentación.
- No ejecutar `migration:revert`, seeds ni tests para “probar”: solo inspección estática, salvo los comandos explícitos de 2A para OpenAPI y esquema de BD.
- Si un comando de 2A no puede ejecutarse por falta de acceso a MariaDB o entorno local, dejar el bloque en `🚧` y anotar el comando exacto pendiente.
