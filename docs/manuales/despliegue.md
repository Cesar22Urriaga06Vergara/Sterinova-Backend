# Runbook de despliegue

> **Estado:** procedimiento de referencia; no implica que staging o producción ya estén desplegados.
> **Fuente de configuración:** variables contrastadas con `src/app.module.ts`, `src/main.ts`, `src/pdf/pdf-generator.service.ts` y `src/common/services/storage.service.ts`.

## Prerrequisitos

- Node.js y npm compatibles con `package-lock.json`; desplegar desde un commit/tag inmutable.
- MariaDB accesible desde la nueva versión y con usuario de mínimo privilegio para la API y permisos de DDL temporales/restringidos para el operador de migraciones.
- Chromium de Playwright y bibliotecas del sistema instaladas en la imagen/runtime. La readiness lanza Chromium para comprobar el renderer.
- Un gestor de secretos del entorno (por ejemplo, el gestor administrado del proveedor). No guardar secretos en Git, imágenes, logs ni archivos `.env` del servidor.
- Volumen persistente para PDFs montado en todas las instancias con permisos de lectura/escritura para el usuario de Node.
- Respaldo reciente de MariaDB y storage, con verificación de recuperación según [respaldos y operación](../base-de-datos/respaldos-y-operacion.md).

## Variables de entorno

Configurar en el gestor de secretos o en la configuración protegida del runtime:

| Variable | Requerida | Uso |
|---|---:|---|
| `DB_HOST` | Sí | Host MariaDB. |
| `DB_PORT` | Sí | Puerto MariaDB, normalmente `3306`. |
| `DB_USERNAME` | Sí | Usuario de conexión de la aplicación. |
| `DB_PASSWORD` | Sí | Secreto de conexión; nunca imprimir su valor. |
| `DB_DATABASE` | Sí | Esquema de la aplicación. |
| `JWT_SECRET` | Sí | Firma JWT. Generar aleatorio y privado; rotarlo con un plan de invalidación de sesiones. |
| `PDF_RENDER_SECRET` | Sí | Firma del acceso interno del renderer; usar al menos 32 caracteres aleatorios y compartirlo solo con el frontend renderer. |
| `PDF_RENDER_BASE_URL` | Sí* | URL interna alcanzable por el backend para las rutas `/internal/pdf/...`. Tiene prioridad sobre `FRONTEND_INTERNAL_URL`. |
| `FRONTEND_INTERNAL_URL` | Sí* | Alternativa para resolver las rutas internas PDF cuando no se define `PDF_RENDER_BASE_URL`. |
| `PDF_STORAGE_PATH` | Sí en producción | Ruta del volumen persistente montado para PDFs. Sin ella, se usa `storage/pdfs` relativo al código. |
| `NODE_ENV` | Sí | Usar `production` para emitir logs JSON. |
| `PORT` | No | Puerto HTTP; predeterminado `3001`. |
| `CORS_ORIGINS` | Sí si hay navegador | Orígenes web exactos separados por coma; evitar comodines. |
| `PDF_RENDER_TIMEOUT_MS` | No | Límite de generación PDF; predeterminado 15000 ms. |

`*` Configurar exactamente una URL interna accesible. Cualquier contraseña/token usado por el frontend se suministra por separado y no debe aparecer en el URL.

Para aprovisionar el primer administrador, inyectar temporalmente `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` al job autorizado `npm run bootstrap:admin`; retirar esos valores al terminar. No incluirlos en el servicio web.

## Secuencia de despliegue

1. Seleccionar el release/tag y comprobar el estado de migraciones contra el ambiente (`npm run migration:show`) sin imprimir secretos.
2. Tomar respaldo consistente de MariaDB y storage; registrar ubicación, hora, resultado y responsable. No continuar si falla.
3. Crear la nueva imagen/instancia desde el release y cargar los secretos/configuración del ambiente.
4. En el artefacto de despliegue, ejecutar exactamente:

   ```sh
   npm ci
   npm run build
   npm run migration:run
   npm run start:prod
   ```

   `migration:run` vuelve a ejecutar `npm run build` internamente; se conserva aquí la secuencia explícita requerida y se puede optimizar el script en un cambio posterior.
5. `migration:run` solo procede si el respaldo está confirmado. Verificar su salida y luego ejecutar `npm run migration:show`; no promocionar la instancia si quedan migraciones pendientes o hay errores.
6. En una instancia nueva, llamar `GET /health/live` y `GET /health/ready`. La readiness debe informar `database`, `storage` y `pdf_renderer` como `up`. Confirmar además una operación autenticada de lectura y una emisión PDF de prueba con datos no productivos.
7. Promover tráfico al release nuevo y observar errores HTTP, latencia, readiness, logs con `correlation_id`, generación/descarga PDF y espacio del volumen.
8. Mantener la versión anterior disponible hasta completar el período de observación definido por operación. Verificar que la versión anterior sea compatible con el esquema expandido.

## Estrategia recomendada: Blue/Green

Mantener dos grupos de instancias detrás del balanceador: el grupo activo (Blue) y el nuevo (Green). Ejecutar migraciones compatibles hacia adelante antes de cambiar tráfico; desplegar Green con el mismo volumen persistente compartido (o el adaptador de object storage) y verificar health checks. Cambiar el balanceador a Green gradualmente. Mantener Blue disponible para volver a enrutar tráfico.

Las migraciones deben seguir expansión/contracción: primero agregar estructuras compatibles, desplegar código que soporte ambas formas, migrar datos y eliminar estructuras antiguas en un release posterior. No iniciar dos procesos de migración simultáneos. La configuración TypeORM del backend usa `synchronize: false` y `migrationsRun: false`; migraciones se ejecutan como paso controlado.

## Rollback

1. Si Green falla en health, API o PDFs, enrutar el tráfico al grupo Blue desde el balanceador/orquestador. No borrar Green ni el volumen hasta preservar logs y diagnóstico.
2. Si la migración fue compatible hacia atrás, dejar el esquema expandido y ejecutar el binario anterior. No revertir el esquema solo para volver el tráfico.
3. Solo si la migración es reversible, la versión previa requiere el esquema anterior y el responsable de base de datos confirma el respaldo, ejecutar una migración a la vez:

   ```sh
   npm run migration:revert
   npm run migration:show
   ```

   TypeORM revierte la última migración aplicada. Revisar primero el método `down()` y el impacto de pérdida de datos. Si no es segura, restaurar el respaldo en una base separada y planificar recuperación; no repetir la migración sobre producción a ciegas.
4. Si hay corrupción o pérdida de datos, detener escrituras, preservar el estado actual, y seguir el procedimiento de restauración de [respaldos y operación](../base-de-datos/respaldos-y-operacion.md). Reconciliar datos creados después del respaldo antes de reabrir tráfico.
5. Registrar release, hora, decisión, correlaciones afectadas y resultado. Mantener tráfico en la versión estable hasta corregir y volver a desplegar Green.

## Persistencia de PDFs

La implementación local guarda PDFs en `PDF_STORAGE_PATH`; el valor predeterminado `storage/pdfs` es solo para desarrollo y **no es adecuado para producción efímera**. Montar un volumen persistente compartido en la misma ruta en todas las instancias, limitar permisos al usuario del proceso, incluirlo en respaldos y probar una restauración. No limpiar PDFs como archivos temporales. En despliegues multi-instancia, un filesystem compartido consistente o un adaptador S3-compatible registrado en `PdfModule` es obligatorio.

## Rotación de secretos

Rotar desde el gestor de secretos, nunca editando valores en el repositorio. Para `PDF_RENDER_SECRET`, coordinar el cambio en backend y frontend y desplegarlos de forma compatible para evitar renders inválidos. Para `JWT_SECRET`, planificar la invalidación de tokens/sesiones y comunicar la reautenticación; no asumir rotación transparente. Revisar logs posteriores para confirmar ausencia de valores filtrados.
