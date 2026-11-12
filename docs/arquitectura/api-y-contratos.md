# API y contratos observados

> **Estado:** vigente.
> **Verificado contra:** controladores, DTOs, guards y servicios backend el 12 de noviembre de 2026.
> **Alcance:** rutas declaradas, acceso y validación del backend.
> **No cubre:** disponibilidad en despliegue, contrato de red capturado ni comportamiento de una instancia.
> **Fuente canónica de:** inventario de endpoints del backend.

La API REST NestJS no configura prefijo global en `src/main.ts`; las rutas siguientes son relativas a la raíz del host. Las rutas privadas requieren JWT y una política explícita: permiso RBAC con ámbito, o sesión para una ruta que solo exige autenticación. Las rutas sin política se deniegan. `POST /auth/login` y `GET /certificados/validar/:token` son públicas según su declaración. Ningún nombre de perfil ni campo `usuarios.rol` concede acceso.

## Rutas

| Área | Método y ruta | Acceso observado | DTO / propósito |
|---|---|---|---|
| Auth | `POST /auth/login` | Público | `LoginDto`; valida credenciales y entrega JWT. |
| Usuarios | `GET /users`, `POST /users`, `PATCH /users/:id`, `PATCH /users/:id/password`, `PATCH /users/:id/status`, `DELETE /users/:id` | JWT + permiso y ámbito RBAC por operación | DTOs de identidad, contraseña y estado; las asignaciones de perfiles usan `role_id` y `scope_id`. |
| Clientes | `POST /clientes`, `POST /clientes/bulk`, `GET /clientes`, `GET /clientes/:id`, `PUT /clientes/:id`, `DELETE /clientes/:id` | JWT + permiso y ámbito RBAC por operación | DTO de cliente; `bulk` recibe carga de importación. |
| Cotizaciones | `POST /cotizaciones`, `GET /cotizaciones`, `GET /cotizaciones/:id`, `GET /cotizaciones/:id/previsualizar`, `PUT /cotizaciones/:id`, `DELETE /cotizaciones/:id` | JWT + permiso, ámbito y propiedad RBAC por operación | DTO de creación/actualización; listado sin paginación observada en firma del controlador. |
| Cotizaciones | `POST /cotizaciones/:id/emitir` | JWT + permiso y ámbito RBAC; mantiene reglas de negocio | Emite y genera PDF oficial; el servicio rechaza emitir una cotización ya emitida. |
| Cotizaciones | `GET /cotizaciones/:id/descargar` | JWT + permiso y ámbito RBAC por operación | Descarga PDF guardado/regenerado por el servicio. |
| Logística | `POST /logistica/ordenes`, `GET /logistica/ordenes`, `GET /logistica/cotizaciones-aprobadas`, `GET /logistica/ordenes/:id`, `PUT /logistica/ordenes/:id/estado` | JWT + permiso y ámbito RBAC por operación | DTOs de creación/estado; la orden se crea desde cotización aprobada y es única por cotización. |
| Planta | `GET /planta/ordenes`, `GET /planta/ciclos`, `POST /planta/ciclos` | JWT + permiso y ámbito RBAC por operación | DTO de ciclo; consulta órdenes y registra proceso. |
| Calidad | `GET /calidad/pendientes`, `GET /calidad/ciclos/:id`, `POST /calidad/aprobar`, `POST /calidad/rechazar` | JWT + permiso y ámbito RBAC por operación; mantiene reglas de negocio | Aprobación exige contraseña; rechazo exige motivo. La aprobación actualiza ciclo y crea certificado en transacción. |
| Certificados | `GET /certificados`, `GET /certificados/:id`, `GET /certificados/:id/descargar` | JWT + permiso y ámbito RBAC por operación | Consulta/descarga de certificados. |
| Certificados | `GET /certificados/validar/:token` | Público con token opaco | Valida un certificado mediante token; no equivale a endpoint privado de consulta. |
| Formatos | `GET /formatos-documentales`, `GET /formatos-documentales/:id`, `POST /formatos-documentales`, `PUT /formatos-documentales/:id`, `DELETE /formatos-documentales/:id`, `POST /formatos-documentales/:id/versiones`, `PUT /formatos-documentales/:id/versiones/:versionId`, `POST /formatos-documentales/:id/versiones/:versionId/estado` | JWT + permiso y ámbito RBAC por operación | DTOs de formato, versión y estado; operaciones registran auditoría selectiva. |
| Sellos | `GET /sellos`, `GET /sellos/:id/imagen`, `POST /sellos`, `PATCH /sellos/:id`, `DELETE /sellos/:id` | JWT + permiso y ámbito RBAC por operación | Gestión/servicio de recursos gráficos de sellos. |

El permiso concreto y sus restricciones se declaran en los controladores y se completan en los servicios que consultan o modifican recursos; las etiquetas visibles del perfil no son parte del contrato de autorización.

## Validación y errores

En Logística, `CreateOrdenDto.fecha_programada` es una fecha civil obligatoria `YYYY-MM-DD`
(OpenAPI `string`, `format: date`). DTO y servicio rechazan fechas inexistentes, horas y zonas
horarias con HTTP 400. Se persiste y devuelve el mismo texto en `ordenes_servicio.fecha_programada`
(`DATE`), sin truncar timestamps ni convertir a UTC. Revisión del 10 de noviembre de 2026:
se conserva el esquema y los datos existentes; no requiere migración.

`src/main.ts` instala `ValidationPipe` global con `whitelist: true`, `forbidNonWhitelisted: true` y `transform: true`; DTOs definen reglas `class-validator`. Servicios usan excepciones NestJS para errores como `400`, `401`, `403`, `404` y `409`. Los códigos exactos por caso, mensajes, cuerpo de respuesta y paginación no están formalizados en un OpenAPI ni probados aquí; confirmar en controlador/servicio antes de depender de ellos como contrato externo.

No se identificó soporte general de idempotency keys. La creación de orden previene duplicar la orden por cotización mediante unicidad/consulta. No se observó política común de paginación o filtros para todos los listados.

## Evidencia principal

Controladores en `src/auth/`, `src/users/`, `src/clientes/`, `src/cotizaciones/`, `src/logistica/`, `src/planta/`, `src/calidad/`, `src/certificados/`, `src/formatos-documentales/` y `src/sellos/`; guards en `src/auth/guards/` y `src/common/guards/`; validación global en `src/main.ts`.

Consulta [arquitectura y seguridad](arquitectura-y-stack.md), [módulos funcionales](../archivo/2026-11-10/estado-proyecto/modulos.md) e [índice frontend](../../../SterinovaFrontend/docs/README.md).
