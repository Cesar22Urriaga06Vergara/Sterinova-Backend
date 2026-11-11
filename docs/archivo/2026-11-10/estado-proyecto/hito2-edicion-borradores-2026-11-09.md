> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Hito 2 - Punto A: edición de borradores

Entrega del 9 de noviembre de 2026. Backend y frontend en `feature/rbac-security`.

## Consolidación del Hito 1

- Backend: `5e94ac7`.
- Frontend: `6792c54`.
- Mensaje: `feat(billing): implementar tasas de IVA versionadas e inmutables`.
- Sin push. Los cambios del Hito 2 quedan sin commit, para revisión.

## Contrato y comportamiento

`PUT /cotizaciones/:id` mantiene `cotizaciones.editar` y el filtro SQL por ámbito/propietario.
Solo acepta documentos cuyo estado, normalizado a mayúsculas, sea BORRADOR y que no tengan
`fecha_emision`. Cualquier otro estado o una fecha de emisión presente produce 409.
Un ID fuera del alcance autorizado produce 404; carecer de la capacidad produce 403.

El cuerpo exige `version` entera positiva. Puede incluir `cliente_id`, `tipo_servicio`,
`condiciones_comerciales` e `items`. Una lista de ítems reemplaza completamente la anterior;
no acepta IDs de ítems, propiedad, ámbito, estado ni importes fiscales aportados por el cliente.
Se validan descripciones, cantidades positivas, precios no negativos, dos decimales y límites.
Lista vacía o null se rechaza con 400. Omitir `items` conserva los ítems e importes actuales.
Cambiar el tipo no renumera el consecutivo existente.

```json
{
  "version": 1,
  "cliente_id": 12,
  "tipo_servicio": "INSUMOS",
  "condiciones_comerciales": "Contado",
  "items": [{ "descripcion": "Servicio", "cantidad": 2, "valor_unitario": 100 }]
}
```

La transacción bloquea la fila, comprueba estado y versión, reemplaza los ítems,
recalcula subtotal/IVA/total con `iva_tasa` persistida e incrementa `version`.
No consulta la tasa vigente ni cambia `iva_version_id`. El IVA usa el cálculo de enteros escalados
del Hito 1. Un fallo al insertar ítems revierte también su borrado, los importes y la versión.
Dos solicitudes con la misma versión producen un 200 y un 409, sin sobrescritura silenciosa.
La emisión usa el mismo bloqueo de fila: el snapshot coincide con los ítems finalmente guardados.

La aprobación anterior dependía de un cambio arbitrario de `estado` en el PUT. Se conserva
mediante `POST /cotizaciones/:id/aprobar`, con `cotizaciones.editar`, cuerpo `{ "version": 1 }`,
control de alcance, bloqueo y transición exclusiva de BORRADOR sin emisión a APROBADA.
También incrementa la versión. No permite reabrir documentos ni modificar su contenido.
El frontend y la prueba integral de Logística consumen esta transición explícita.
OpenAPI regenerado y contrastado contra las rutas reales.

## Frontend

- Botón Editar en la lista y en la vista de detalles/previsualización, condicionado a permiso,
  BORRADOR y ausencia de fecha de emisión.
- Ruta `/comercial/cotizaciones/:id/editar`, con formulario compartido con creación.
  Carga cliente, tipo, condiciones, ítems, tasa guardada y versión.
- No requiere `cotizaciones.crear` ni consulta IVA vigente para editar.
- Acceso forzado a emitidas, aprobadas o sin permiso: bloqueo y redirección a la lista.
  Los 403/404 al cargar también redirigen.
- Un 409 conserva las entradas visibles y deshabilita guardar hasta recargar;
  no reenvía automáticamente cambios sobre una versión nueva.
- Revalidar la sesión al recuperar foco conserva los datos introducidos en el formulario.

## Migración local y conservación

`AddQuoteEditVersion1794225601000` agrega `cotizaciones.version INT NOT NULL DEFAULT 1`.
Se ensayó en MariaDB desechable, incluyendo restauración y cadena de migraciones.
Aplicada después en `sterinova` local: 16 migraciones, ninguna pendiente.
Las tres cotizaciones existentes tienen versión 1. Comparación antes/después de todas las
columnas anteriores de cotizaciones, ítems y certificados: idénticas.

- Respaldo: `storage/backups/sterinova-pre-rbac-2026-11-09T12-34-34-450Z.sql`.
- SHA-256 del respaldo: `fdf6f4155ccbec462c5ae0170bec4e56a5359967363908c768055a0c1eec7869`.
- Huella de los datos comparados: `dca24e216dc3f63d62d8e6e836f02c28056bb8c1ac00f14d8f62279e5c91b5bf`.
- Evidencia local ignorada por Git: `storage/backups/quote-edit-migration-verification-2026-11-09.json`.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Backend `npm test` | 169 aprobadas; 2 omisiones preexistentes |
| MariaDB desechable, RBAC y migraciones | 21 aprobadas |
| Aplicación completa en base desechable | 4 E2E aprobadas |
| Frontend `npm test` | 45 aprobadas |
| Frontend Playwright | 10 E2E aprobadas |
| Builds backend/frontend | Aprobados |
| Lint backend/frontend | Sin errores; dos advertencias backend preexistentes |
| Contrato OpenAPI | Aprobado en E2E de aplicación |

Cobertura nueva: estado y fecha de emisión independientes, versión obligatoria y obsoleta,
dos escritores simultáneos, emisión concurrente, cambio real de cliente y tipo, reemplazo/borrado
de ítems, IVA anterior tras cambio de tasa vigente, rollback por fallo SQL inducido, IDOR entre
propietarios y ámbitos, permisos, inyección de campos y acceso forzado a la ruta frontend.
Las pruebas de rollback provocan deliberadamente un error SQL 500 en la base desechable.
Revisión de corrección, seguridad, estructura y rendimiento completada sin defectos bloqueantes.

## Límites de la entrega

Los borradores históricos sin tasa fiscal guardada rechazan reemplazos de ítems con 409.
La UI informa la ausencia y deshabilita guardar: no inventa una tasa ni recalcula historia.
La API permite modificar sus metadatos omitiendo `items`. Conciliar su tasa requiere una
entrega posterior explícita. Los documentos emitidos y sus PDFs no se reescribieron.

No se hizo push ni despliegue. No se implementaron sellos versionados ni cuadro de estampado.
El trabajo se detiene en este punto para revisión del hito.
