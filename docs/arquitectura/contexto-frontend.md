# Contexto técnico del frontend

Consolidado el 11 de noviembre de 2026 a partir de la inspección del 10 de noviembre. Las observaciones conservan la fecha de su fuente y deben cotejarse con el código al cambiar la implementación.

<a id="auth"></a>

# Autenticación y sesión – SterinovaFrontend

- Fecha: 2026-11-10
- Fuente: `src/app/login/page.tsx`, `src/lib/api.ts`, `src/lib/session.tsx`, `src/app/(erp)/layout.tsx`.
- Estado: ✅ consolidado por inspección estática.

## Login

La pantalla de `/login` ejecuta una petición directa con Axios a:

```ts
`${API_BASE_URL.replace(/\/+$/, "")}/auth/login`;
```

Tras éxito:

```ts
localStorage.setItem("access_token", data.access_token);
localStorage.setItem("user", JSON.stringify(data.user));
router.push("/");
```

## Persistencia del token

La instancia `api` usa interceptor de request:

```ts
const token = window.localStorage.getItem("access_token");
config.headers.Authorization = `Bearer ${token}`;
```

Si no hay token y la ruta no es `/login`, fuerza redirección a la pantalla de login.

## SSO / sesión

Tras una respuesta 401, el frontend:

- elimina `access_token`
- elimina `user`
- muestra una alerta de sesión expirada
- redirige a `/login`

## Validación de sesión

`SessionProvider` dispara `GET /auth/me` en montaje e invocación de focus para refrescar la sesión. Además marca el `x-scope-id` actual si existe.

La respuesta esperada contiene:

- user
- permissions
- capabilities
- current_scope
- available_scopes

La vista de ERP usa `useSession()` para saber si el usuario tiene permiso para la ruta actual y redirigir si no.

## Observaciones

- No existe refresh token implementado en frontend. El flujo actual es token de acceso persistido en `localStorage`.
- No aplica / no existe: cookie HttpOnly, refresh token, silent refresh, logout backend explícito en la app visible.


<a id="cobertura-tests"></a>

# Cobertura y tests – SterinovaFrontend

- Fecha: 2026-11-10
- Fuente: `tests/*.test.mjs`, `e2e/*.spec.ts`, `playwright.config.ts`, `package.json`.
- Estado: ✅ consolidado por inspección estática.

## 1) Tests automáticos de Node

La suite `node --test tests/*.test.mjs` incluye archivos como:

- `tests/accessibility-contracts.test.mjs`
- `tests/api-errors.test.mjs`
- `tests/cotizacion-currency.test.mjs`
- `tests/cotizacion-pdf-content.test.mjs`
- `tests/design-system.test.mjs`
- `tests/iva.test.mjs`
- `tests/operational-forms.test.mjs`
- `tests/pdf-schema-v2.test.mjs`
- `tests/phase3-critical-flows.test.mjs`
- `tests/sidebar-navigation.test.mjs`
- `tests/stored-user.test.mjs`

Estos tests cubren reglas de negocio del frontend, validación de contenido PDF y estructura de navegación.

## 2) Tests E2E de Playwright

En `e2e/` se observan escenarios de flujo de negocio y validación de interfaces:

- `calidad-flow.spec.ts`
- `certificate-materials.spec.ts`
- `comercial-flow.spec.ts`
- `hito4-operational.spec.ts`
- `iva-flow.spec.ts`
- `quote-edit.spec.ts`
- `rbac-quotes.spec.ts`

## 3) Ejecutores definidos

`package.json` define:

- `npm test` -> `node --test tests/*.test.mjs`
- `npm run test:e2e` -> `playwright test`

## 4) Gaps observados

- La base de tests es bastante buena para flujos críticos y validación de contrato/presentación.
- No hay evidencia de pruebas de integración directa con backend para todos los módulos, pero la suite actuall cruza navegación, formato y flujo de negocio del ERP.
- La validación real del entorno debe seguir ejecutándose con el backend en funcionamiento para confirmar full-stack.


<a id="config-nextjs"></a>

# Configuración de Next.js – SterinovaFrontend

- Fecha: 2026-11-10
- Fuente: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`.
- Estado: ✅ consolidado por inspección.

## Next.js

`next.config.ts` establece:

- `cacheComponents: true`
- `partialPrefetching: true`
- `turbopack.rules['*.css'] = ['@tailwindcss/turbopack']`

Esto indica un setup moderno con renderización por App Router y optimizaciones de prefetch/cache.

## Tailwind

`tailwind.config.ts` define:

- contenido scanning para `src/app`, `src/components`, `src/pages`
- palette propia con tokens `sterinova`, `primary`, `secondary`, `success`, `warning`, `error`, `surface`
- tamaños tipográficos y radii de UI

## TypeScript

`tsconfig.json`:

- `strict: true`
- `moduleResolution: 'bundler'`
- alias `@/*` -> `./src/*`
- `jsx: 'react-jsx'`
- `allowJs: true`

## Producción local vs dev

- `npm run dev` => Next dev server con Turbopack.
- `npm run build` + `npm run start` => producción local.
- La ruta interna PDF (render de backend) usa `process.env.PDF_RENDER_SECRET`, no una sesión de Next.js. Por eso el backend llama a un route interno SSR que debe resolverse en la misma red interna del frontend.

## Nota

La configuración actual no define rewrites/headers especializados para PDF render ni un mecanismo de cookies httpOnly para autenticación. El sistema depende de `localStorage` y de la validación manual de la sesión con `/auth/me`.


<a id="deuda-tecnica"></a>

# Deuda técnica – SterinovaFrontend

- Fecha: 2026-11-10
- Fuente: grep sobre `TODO|FIXME|HACK|XXX` en `src/**` y `package.json`.
- Estado: ✅ consolidado por inspección estática.

## 1) Elementos observados

| Repo     | Archivo:línea                          | Descripción                                                                    | Prioridad | Bloqueador |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------ | --------- | ---------- |
| Frontend | `src/app/(erp)/DashboardClient.tsx:78` | `TODO: Conectar a endpoint /api/metrics cuando esté disponible en el backend.` | Media     | No         |

## 2) Comentarios

- La deuda técnica del frontend es ligera y está centrada en un panel de métricas aún no conectado.
- La arquitectura general no presenta `HACK` estructural ni bloqueos de negocio visibles en la capa UI.
- La integración con sesión, RBAC y PDF ya está con un diseño consistente y separado por módulos.

## 3) Observación

El riesgo principal no es una deuda técnica funcional aguda, sino la evolución futura de métricas y del backend para completar la visión “ERP completo” del dashboard.


<a id="modulos-frontend"></a>

# Módulos frontend y rutas – SterinovaFrontend

- Fecha: 2026-11-10
- Fuente: `src/app/(erp)/**`, `src/lib/navigation.ts`, `src/lib/session.tsx`.
- Estado: ✅ condensado por inspección estática.

## Estructura del ERP

| Ruta real                   | Módulo / propósito         | Componente principal                             |
| --------------------------- | -------------------------- | ------------------------------------------------ |
| `/`                         | Dashboard ERP              | `src/app/(erp)/page.tsx` + `DashboardClient.tsx` |
| `/login`                    | Inicio de sesión           | `src/app/login/page.tsx`                         |
| `/comercial`                | Área comercial             | `src/app/(erp)/comercial/...`                    |
| `/comercial/clientes`       | Gestión de clientes        | `ClientesPageClient.tsx`                         |
| `/comercial/cotizaciones`   | Cotizaciones               | `CotizacionesClient.tsx`                         |
| `/logistica`                | Órdenes y logística        | `src/app/(erp)/logistica/page.tsx`               |
| `/planta`                   | Ordenes/ciclos de planta   | `src/app/(erp)/planta/page.tsx`                  |
| `/calidad`                  | Revisión y certificados    | `src/app/(erp)/calidad/page.tsx`                 |
| `/configuracion/plantillas` | Formatos documentales      | `PlantillasDocumentalesClient.tsx`               |
| `/configuracion/sellos`     | Sellos                     | `src/app/(erp)/configuracion/sellos/page.tsx`    |
| `/usuarios`                 | Administración de usuarios | `src/app/(erp)/usuarios/page.tsx`                |

## Acceso y guardas

El layout ERP usa `AuthorizedErpLayout()` para:

- verificar que exista `access_token` en `localStorage`
- validar sesión con `useSession()`
- redirigir a `/login` cuando el usuario no está autenticado
- comprobar permisos por ruta con `canAccessPath(pathname, user.rol)`

Para cotizaciones, además compara el permiso de negocio con scope actual y usa `cotizaciones.ver` / `cotizaciones.crear`.

## Llamadas API típicas

- `GET /clientes` -> lista clientes
- `POST /cotizaciones` -> crear cotización
- `GET /cotizaciones/:id` -> detalle
- `GET /logistica/ordenes` -> órdenes logísticas
- `GET /planta/ordenes` -> órdenes de planta
- `GET /calidad/pendientes` -> ciclos pendientes de calidad
- `GET /certificados` -> listado de certificados
- `GET /formatos-documentales` -> formatos documentales
- `GET /sellos` -> sellos activos

## Observación importante

La ruta virtual `(erp)` no aparece en la URL real. Es una convención de Next.js App Router para agrupar un layout compartido.


<a id="patrones-frontend"></a>

# Patrones frontend – SterinovaFrontend

- Fecha: 2026-11-10
- Fuente: `src/lib/**`, `src/components/**`, páginas representativas como `cotizaciones` y `calidad`.
- Estado: ✅ consolidado por inspección.

## Data fetching

- El proyecto usa `Axios` centralizado en `src/lib/api.ts`.
- No se observa React Query ni SWR en este repositorio.
- Las páginas de módulo hacen `api.get()`, `api.post()`, `api.put()` y `api.patch()` directamente.
- La session/permiso se obtiene de `useSession()` y el header `x-scope-id` cuando aplica.

## Formularios

- Los formularios están construidos con componentes UI y estado local de React.
- No se observa `react-hook-form` ni `form actions` del App Router.
- Los flujos más complejos usan `useState`, `useEffect` y submit manual.

## Estado global

- No hay Redux, Zustand ni Context global más allá de `SessionProvider` para sesión y permisos.
- `SessionProvider` expone `can(permission)` y `selectScope(id)`.

## Manejo de errores UI

- `src/lib/api-errors.ts` centraliza el mensaje del error API.
- `api` interceptor responde con toast en errores HTTP no 401.
- `ToastProvider` y `toast-events` son el mecanismo estándar de notificación del usuario.

## Loading y Estados vacíos

- No se ve un patrón formal de skeletons en páginas clave.
- El layout y la sesión muestran `Cargando...` cuando aún no hay sesión validada.
- Los componentes de formulario usan `loading` dentro del botón y mensajes inline de error.

## Estructura típica de una página módulo

Un patrón frecuente es:

1. usar `useEffect` para cargar datos desde `api`
2. mantener `loading`, `error` y estado de formulario local
3. invocar endpoints del backend con `api.get/post/put/patch`
4. mostrar UI y toasts
5. limpiar `localStorage`/redirigir al logout si la sesión expira

## Observación

La app se apoya en un estilo de “cliente de página” con componentes responsables de estado y llamadas directas a API; no hay una capa de repositorio ni un patrón de server actions dominante.
