# Correspondencia UI–API

> **Estado:** vigente como cotejo estático entre repositorios, 6 de noviembre de 2026.
> **Verificado contra:** controladores backend y cliente/rutas frontend el 6 de noviembre de 2026.
> **Alcance:** rutas, tipos, permisos y operación de documentos observables.
> **No cubre:** despliegue conjunto, pruebas de integración en vivo ni aceptación visual.
> **Fuente canónica de:** discrepancias backend/frontend.

| Tema | Backend | Frontend | Hallazgo |
|---|---|---|---|
| Cotizaciones | Enum de 7 tipos y API CRUD/emisión/descarga. | Selector de alta ofrece 5 tipos. | `FARMACEUTICO` y `FABRICANTE` no pueden iniciarse desde el selector actual. |
| Roles | Guards aplican JWT y roles en endpoints. | Navegación oculta enlaces por rol y layout comprueba sesión local. | La UI no reemplaza la autorización API; su estado local no valida acceso a recursos. |
| Calidad | Admin/Calidad consulta, aprueba con contraseña y rechaza con motivo. | Rutas de bandeja/revisión y certificado disponibles. | Correspondencia de flujo estático; no se comprobó contra una API desplegada. |
| PDF | Backend Playwright usa páginas internas del frontend; emite y sirve archivos. | Componentes React sirven al render, cliente solicita emitir/descargar. | `html2pdf.js` no forma parte del flujo oficial. Requiere URL interna y secreto compartido en entorno. |
| Login | `POST /auth/login` público en backend. | Formulario llama a `http://localhost:3001/auth/login`. | URL fija limita despliegues donde API use otro host. |
| Dashboard | No hay endpoint de métricas identificado para esos contadores. | Cuatro contadores son valores estáticos. | No representar como datos actuales. |
| Descargas | Certificados y cotizaciones tienen endpoints autenticados de descarga. | La interfaz consume esos endpoints con cliente bearer. | La descarga requiere sesión válida; disponibilidad de archivo depende de storage/configuración. |

> **Fuentes canónicas:** rutas API en [API y contratos](../arquitectura/api-y-contratos.md), rutas visibles en [módulos frontend](../../../frontend_sterinova/docs/estado-proyecto/modulos.md), tipos/prefijos y flujo PDF en [módulos backend](../estado-proyecto/modulos.md). Esta tabla conserva solo las diferencias entre capas.

Fuentes: `backend_sterinova/src/*/*.controller.ts`, `src/cotizaciones/entities/tipo-servicio.enum.ts`, `frontend_sterinova/src/lib/cotizacion-types.ts`, `src/lib/navigation.ts`, `src/lib/api.ts` y páginas de cotización/Calidad. Para rutas, access control y validación completos, consultar [API y contratos](../arquitectura/api-y-contratos.md).
