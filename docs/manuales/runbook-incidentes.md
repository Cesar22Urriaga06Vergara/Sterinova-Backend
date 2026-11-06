# Runbook de respuesta a incidentes

## Reglas para cualquier incidente

1. Registrar hora, ambiente, release, síntoma y `x-correlation-id` de una petición afectada. No copiar tokens, contraseñas, snapshots ni datos personales a tickets.
2. Consultar `GET /health/live` y `GET /health/ready`; revisar logs JSON por `correlation_id`, status HTTP y servicio marcado `down`.
3. Priorizar detener el impacto y conservar evidencia. No borrar PDFs, reiniciar migraciones ni restaurar sobre la base activa sin preservar el estado y coordinar con el responsable de base de datos/operación.
4. Registrar acciones, resultado, responsable y decisión de recuperación; notificar al responsable operativo definido para el ambiente.

## Base de datos MariaDB/PostgreSQL no disponible

> La implementación actual usa MariaDB (`type: 'mariadb'` en TypeORM). PostgreSQL requiere un driver y configuración específicos antes de usarse.

1. Confirmar `GET /health/live` (proceso) y el estado `database` de `/health/ready`. Verificar desde la instancia conectividad DNS/red/puerto, disponibilidad y conexiones del servidor de base de datos.
2. Revisar estado del proveedor, pool/conexiones, límites de conexiones y logs de base de datos. No imprimir `DB_PASSWORD` ni cadenas de conexión.
3. Si la base está reiniciando o inaccesible, mantener instancias vivas; la aplicación no está lista y el balanceador debe retirar tráfico según su configuración. No cambiar credenciales por ensayo/error.
4. Si hay saturación, detener jobs/consumidores no esenciales y reducir temporalmente tráfico de escritura de acuerdo con operación. No aumentar conexiones sin revisar capacidad del servidor.
5. Cuando la base se recupere, comprobar `/health/ready`, una lectura autenticada y una escritura controlada. Revisar errores recientes agrupados por `correlation_id` antes de reabrir tráfico.
6. Si hay corrupción o pérdida, congelar escrituras y ejecutar restauración desde [respaldos y operación](../base-de-datos/respaldos-y-operacion.md); no restaurar encima de la base sin preservar copia del estado fallido.

## Playwright falla o agota memoria al generar PDF

1. Buscar respuestas 503 de emisión/descarga y `pdf_renderer` en `/health/ready`; correlacionar petición usando `x-correlation-id`. Los logs de renderer no deben incluir datos de documentos.
2. Revisar memoria disponible, reinicios/OOM del contenedor, procesos Chromium huérfanos, conectividad desde backend a `PDF_RENDER_BASE_URL`/`FRONTEND_INTERNAL_URL`, fuentes y assets del frontend interno.
3. Si hay presión de memoria, detener temporalmente nuevas emisiones (no borrar/alterar documentos ya emitidos) y escalar capacidad o reducir concurrencia de instancias/trabajos conforme a la plataforma. El servicio mantiene un solo browser y crea una página por render.
4. Verificar que `PDF_RENDER_SECRET` coincida en backend/frontend sin mostrar el valor. Revisar que Playwright/Chromium y sus dependencias estén presentes en el runtime.
5. Cuando `/health/ready` reporte renderer arriba, generar un PDF de prueba controlado, validar descarga y hash SHA-256. Reanudar emisiones y observar errores 503 y memoria.
6. No regenerar un documento oficial desde datos actuales si no existe su snapshot inmutable. Seguir [runbook de PDFs](runbook-pdfs.md).

## Disco `storage/pdfs` lleno

1. Confirmar `storage` en `/health/ready`, espacio e inodos del volumen configurado por `PDF_STORAGE_PATH`, cuotas y errores de escritura. No asumir que la ruta por defecto es un volumen persistente.
2. Suspender nuevas emisiones PDF para evitar fallos repetidos; mantener lecturas si los archivos existentes siguen disponibles.
3. Identificar crecimiento por fecha/tamaño y revisar política de retención aprobada. **No borrar PDFs oficiales** como limpieza urgente. Si no hay retención aprobada, ampliar volumen o migrar a object storage persistente.
4. Verificar espacio libre y permisos después de ampliar/liberar únicamente archivos temporales autorizados. Probar escritura y lectura por readiness y emitir un PDF de prueba.
5. Reanudar emisiones, revisar fallos de persistencia y comprobar hash de archivos afectados. Si faltan archivos, recuperar desde respaldo o usar el flujo de regeneración desde snapshot del runbook PDF.

## Migración TypeORM falla a mitad

1. Detener la promoción y no iniciar otra ejecución concurrente de `npm run migration:run`. Conservar salida del proceso, release, hora y logs; retirar la nueva versión del balanceador si afecta servicio.
2. Consultar `npm run migration:show` y la tabla `typeorm_migrations`; determinar si la migración marcó aplicación, si la transacción fue revertida y qué DDL quedó aplicado. El datasource usa `migrationsTransactionMode: 'each'`, pero no asumir que todo DDL MariaDB es transaccional.
3. Tomar una copia del estado actual antes de cualquier reparación. Revisar el `up()` y `down()` exactos, comprobar esquema/datos y estimar si reejecutar es idempotente.
4. Si quedó aplicada y el esquema es correcto, verificar el release y continuar con el procedimiento documentado. Si quedó parcial, preparar reparación explícita con DBA en staging/copia primero; no editar la tabla de migraciones manualmente ni borrar filas para forzar reejecución sin evidencia.
5. Ejecutar `npm run migration:revert` solo si `down()` fue revisado, es seguro para los datos y se aprobó recuperación. En otro caso, restaurar respaldo en una base separada o crear una migración correctiva hacia adelante.
6. Repetir en staging, volver a ejecutar `npm run migration:show`, validar `/health/ready` y pruebas de lectura/escritura antes de promover. Registrar la causa y la reparación aplicada.

## Cierre

Anotar impacto/usuarios afectados, duración, release, correlaciones, causa conocida o pendiente, respaldo/restauración usados y acciones preventivas. Confirmar alertas de 5xx, base, renderer y capacidad de storage antes de cerrar el incidente.
