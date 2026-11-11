> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Reporte Fase 3 — Dominio regulatorio

- **Fecha:** 2026-11-06
- **Estado:** Implementación completada en código; migración pendiente de aplicarse en cada entorno.

## Decisión de evidencias y firmas

ADR: [001 — Evidencias y firmas](../../../arquitectura/adr/001-evidencias-y-firmas.md). Propone Opción B: posponer la implementación hasta confirmar requisitos con negocio, Calidad y el responsable regulatorio. Incluye el diseño sugerido para tablas, almacenamiento privado y hashes. La decisión definitiva corresponde al negocio.

## Auditoría

Se amplió `AuditoriaService` y se instrumentaron operaciones en sus servicios/controladores de dominio:

- Login exitoso/fallido: actor cuando se conoce, IP y User-Agent. No se persisten email, contraseña, token ni cuerpo de solicitud.
- Aprobación/rechazo de ciclos: actor, ciclo, transición de estado y eventos fallidos sin motivo libre ni contraseña. Aprobación también registra la emisión del certificado.
- Cambio de estado de orden: actor y estados anterior/nuevo, dentro de la transacción.
- Descarga de certificado: evento después de completar correctamente la transferencia; emisión se registra en la transacción de aprobación.

En Calidad y logística, evento exitoso y cambio de dominio comparten transacción. Los intentos fallidos se intentan registrar fuera de la transacción y no reemplazan el error original. Login y descarga usan auditoría best effort para no cambiar su resultado. El esquema permite acciones nuevas y `entidad_id` nulo para intentos sin identidad conocida.

## Consulta `GET /auditoria`

Requiere JWT y rol `Admin`. Parámetros: `page` (predeterminado 1), `limit` (20, máximo 100), `entidad`, `usuario_id`, `desde` y `hasta` (fechas ISO 8601 inclusivas). Devuelve `data`, `total`, `page`, `limit` y `totalPages`, ordenado por fecha descendente.

## Retención

La política operativa propuesta conserva registros cinco años y luego requiere purga controlada. El plazo está pendiente de aprobación regulatoria/de negocio y no se presenta como garantía legal. Detalle en [calidad de datos](../../../calidad-y-pruebas/calidad-de-datos.md).

## Pruebas y validación

- Pruebas unitarias de auditoría paginada/filtrada y creación del evento de aprobación de ciclo.
- Prueba HTTP: un usuario `Comercial` recibe 403 en `GET /auditoria`.
- Suite `npm test`: 27 archivos aprobados, 1 omitido; 91 pruebas aprobadas, 2 omitidas.
- `npm run build`: aprobado.
- `git diff --check`: sin errores de whitespace.
