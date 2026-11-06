# Reporte de ejecución — Fase 2: Datos, migraciones y consecutivos

Fecha: 2026-11-06

## Consecutivos bajo concurrencia

El servicio de certificados ya tomaba la fila `certificado_esterilizacion` con `pessimistic_write` dentro de la transacción recibida por Calidad. Cotizaciones también serializa el acceso a cada fila de secuencia dentro de su transacción. La prueba de integración nueva invoca `CertificadosService.emitirDesdeCiclo` doce veces en paralelo sobre MariaDB y comprueba que se persistan doce consecutivos únicos, ordenados y sin saltos, además de que `ultimo_valor` avance en doce.

Resultado: **aprobado**, 12/12 emisiones, valores únicos y contiguos.

## Trigger de inmutabilidad

En el mismo esquema temporal se actualizó por SQL directo un campo de negocio (`equipo`) de un certificado aprobado y MariaDB rechazó la operación con el mensaje del trigger. Luego se actualizaron `pdf_url`, `hash_pdf` y `pdf_renderer_version` y se verificó que esos cambios se aceptaran y persistieran.

Resultado: **aprobado**. La prueba limpia certificados y fixtures y restaura el valor original de la secuencia en `afterAll`. El esquema temporal `sterinova_phase2_test` se conservó para repetir la integración; durante la primera ejecución no pudo hacerse una verificación independiente de conteos porque el servicio MySQL80 se detuvo, aunque el teardown de la prueba finalizó sin error.

## Migraciones y runbook

`npm run migration:show` mostró las 11 migraciones aplicadas en la base local configurada. En el esquema desechable vacío, `migration:show` mostró las 11 pendientes; se revisaron las operaciones y se aplicaron únicamente a ese esquema para instalar las tablas y el trigger de prueba. No se ejecutó `migration:run` en la base de negocio.

El procedimiento operativo de respaldo, restauración, consulta de migraciones y auditoría de consecutivos está en [respaldos-y-operacion.md](../base-de-datos/respaldos-y-operacion.md).

`.env.example` ahora incluye comentarios para la conexión usada por `data-source.ts` y `AppModule`, los secretos, las URLs de PDF, puerto, CORS y el modo de integración con una base aislada.

## Quality gate

- `npm run build`: **aprobado**.
- `npm run test`: **87 aprobadas**, 2 pruebas de integración omitidas al no activar `RUN_DB_INTEGRATION`.
- Ejecución enfocada con `RUN_DB_INTEGRATION=1` y `DB_DATABASE=sterinova_phase2_test`: **2 aprobadas** (concurrencia e inmutabilidad).
- `npm run test:e2e`: **aprobado** después de restablecer MariaDB; 2 archivos y 2 pruebas aprobadas.

## Cierre oficial

Consecutivos, trigger, documentación operativa, build, pruebas unitarias y e2e están verificados. **Fase 2 cerrada oficialmente el 2026-11-06.**
