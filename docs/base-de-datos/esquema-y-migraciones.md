# Base de datos Sterinova

La API usa MariaDB con TypeORM. El esquema se administra exclusivamente con migraciones; `synchronize` permanece desactivado.

## Entidades

- `usuarios`: nombre, email único, hash de contraseña, rol (`Admin`, `Comercial`, `Logistica`, `Planta`, `Calidad`) y fecha de creación.
- `clientes`, `cotizaciones`, `cotizacion_items` y `ordenes_servicio`: datos comerciales y logísticos; las relaciones y reglas de borrado están definidas en las entidades TypeORM.
- `ciclos_esterilizacion`: parámetros del proceso, operador, estado (`EN_PROCESO`, `PENDIENTE_CALIDAD`, `APROBADO`, `RECHAZADO`), revisor, fecha/motivo de decisión y referencia al ciclo corregido cuando aplique.
- `certificados_esterilizacion`: consecutivo único de cinco dígitos, ciclo único asociado, token público opaco de validación, datos técnicos, aprobador y fecha de aprobación. Los certificados aprobados son inmutables.
- `secuencias_consecutivos`: contador transaccional del consecutivo `certificado_esterilizacion`. Comienza en `55387`; la primera aprobación entrega `55388`.

## Migraciones

`src/database/data-source.ts` es el DataSource usado por la API y el CLI. Las migraciones compiladas se ejecutan explícitamente:

```powershell
npm run migration:show
npm run migration:run
```

La migración `InitialSchema` crea el esquema para una base vacía. Si detecta las tablas y columnas del esquema existente, registra el baseline sin recrearlas; un esquema parcial o incompatible se detiene para conciliación. La migración de Calidad valida roles y certificados legados antes de modificarlos. Certificados que no puedan asociarse inequívocamente a un ciclo requieren conciliación manual. La migración de validación QR agrega un token aleatorio por certificado existente y mantiene el trigger de inmutabilidad.

Antes de aplicar migraciones sobre una base con datos, hacer respaldo y revisar el resultado de `migration:show`. No ejecutar DDL de migración en producción hasta verificar el respaldo y la compatibilidad del esquema.

## Aprovisionamiento del primer Admin

La ruta pública `/auth/seed` fue retirada. Después de configurar las variables de base de datos y aplicar las migraciones, definir `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` (mínimo 12 caracteres) en el entorno operativo y ejecutar:

```powershell
npm run bootstrap:admin
```

El proceso falla si la cuenta ya existe; no hay contraseña fija ni credenciales de bootstrap en HTTP.
