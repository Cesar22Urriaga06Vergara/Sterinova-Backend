# API y contratos observados

> **Estado:** vigente.
> **Verificado contra:** controladores, DTOs, guards y servicios backend el 6 de noviembre de 2026.
> **Alcance:** rutas declaradas, acceso y validación del backend.
> **No cubre:** disponibilidad en despliegue, contrato de red capturado ni comportamiento de una instancia.
> **Fuente canónica de:** inventario de endpoints del backend.

La API REST NestJS no configura prefijo global en `src/main.ts`; las rutas siguientes son relativas a la raíz del host. Las guardas JWT y roles son globales. Todas requieren JWT salvo `POST /auth/login` y `GET /certificados/validar/:token`. `GET /` no tiene declaración `@Public()` y, por tanto, también requiere JWT. Un `@Roles(...)` de controlador restringe adicionalmente; `Admin` tiene bypass en `RolesGuard`.

## Rutas

| Área | Método y ruta | Acceso observado | DTO / propósito |
|---|---|---|---|
| Auth | `POST /auth/login` | Público | `LoginDto`; valida credenciales y entrega JWT. |
| Usuarios | `GET /users`, `POST /users`, `PATCH /users/:id`, `PATCH /users/:id/password`, `PATCH /users/:id/status`, `DELETE /users/:id` | Admin | DTOs de creación/actualización/cambio de contraseña/estado. |
| Clientes | `POST /clientes`, `POST /clientes/bulk`, `GET /clientes`, `GET /clientes/:id`, `PUT /clientes/:id`, `DELETE /clientes/:id` | Admin, Comercial | DTO de cliente; `bulk` recibe carga de importación. |
| Cotizaciones | `POST /cotizaciones`, `GET /cotizaciones`, `GET /cotizaciones/:id`, `GET /cotizaciones/:id/previsualizar`, `PUT /cotizaciones/:id`, `DELETE /cotizaciones/:id` | Admin, Comercial | DTO de creación/actualización; listado sin paginación observada en firma del controlador. |
| Cotizaciones | `POST /cotizaciones/:id/emitir` | Admin | Emite y genera PDF oficial; el servicio rechaza emitir una cotización ya emitida. |
| Cotizaciones | `GET /cotizaciones/:id/descargar` | Admin, Comercial | Descarga PDF guardado/regenerado por el servicio. |
| Logística | `POST /logistica/ordenes`, `GET /logistica/ordenes`, `GET /logistica/cotizaciones-aprobadas`, `GET /logistica/ordenes/:id`, `PUT /logistica/ordenes/:id/estado` | Admin, Logística | DTOs de creación/estado; la orden se crea desde cotización aprobada y es única por cotización. |
| Planta | `GET /planta/ordenes`, `GET /planta/ciclos`, `POST /planta/ciclos` | Admin, Planta | DTO de ciclo; consulta órdenes y registra proceso. |
| Calidad | `GET /calidad/pendientes`, `GET /calidad/ciclos/:id`, `POST /calidad/aprobar`, `POST /calidad/rechazar` | Admin, Calidad | Aprobación exige contraseña; rechazo exige motivo. La aprobación actualiza ciclo y crea certificado en transacción. |
| Certificados | `GET /certificados`, `GET /certificados/:id`, `GET /certificados/:id/descargar` | Admin, Calidad | Consulta/descarga de certificados. |
| Certificados | `GET /certificados/validar/:token` | Público con token opaco | Valida un certificado mediante token; no equivale a endpoint privado de consulta. |
| Formatos | `GET /formatos-documentales`, `GET /formatos-documentales/:id`, `POST /formatos-documentales`, `PUT /formatos-documentales/:id`, `DELETE /formatos-documentales/:id`, `POST /formatos-documentales/:id/versiones`, `PUT /formatos-documentales/:id/versiones/:versionId`, `POST /formatos-documentales/:id/versiones/:versionId/estado` | Admin | DTOs de formato, versión y estado; operaciones registran auditoría selectiva. |
| Sellos | `GET /sellos`, `GET /sellos/:id/imagen`, `POST /sellos`, `PATCH /sellos/:id`, `DELETE /sellos/:id` | Admin | Gestión/servicio de recursos gráficos de sellos. |

## Validación y errores

`src/main.ts` instala `ValidationPipe` global con `whitelist: true`, `forbidNonWhitelisted: true` y `transform: true`; DTOs definen reglas `class-validator`. Servicios usan excepciones NestJS para errores como `400`, `401`, `403`, `404` y `409`. Los códigos exactos por caso, mensajes, cuerpo de respuesta y paginación no están formalizados en un OpenAPI ni probados aquí; confirmar en controlador/servicio antes de depender de ellos como contrato externo.

No se identificó soporte general de idempotency keys. La creación de orden previene duplicar la orden por cotización mediante unicidad/consulta. No se observó política común de paginación o filtros para todos los listados.

## Evidencia principal

Controladores en `src/auth/`, `src/users/`, `src/clientes/`, `src/cotizaciones/`, `src/logistica/`, `src/planta/`, `src/calidad/`, `src/certificados/`, `src/formatos-documentales/` y `src/sellos/`; guards en `src/auth/guards/` y `src/common/guards/`; validación global en `src/main.ts`.

Consulta [arquitectura y seguridad](arquitectura-y-stack.md), [módulos funcionales](../estado-proyecto/modulos.md) e [índice frontend](../../../frontend_sterinova/docs/README.md).
