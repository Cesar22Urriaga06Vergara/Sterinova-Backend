---
id: RA-COM-007
titulo: Política de reconstrucción de PDFs históricos
tipo: RA
modulo: Comercial / Documentos
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6, §7"
fuente_contraste: "src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/cotizacion.entity.ts; src/database/migrations/1793750400000-AddDocumentFormatVersioning.ts; src/database/migrations/1794225602000-AddOperationalDocumentData.ts"
depende_de: [RF-COM-007]
bloquea: []
brechas: [B-007-01]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-007; incluye observación técnica de que el trigger de cotizaciones protege el sello, no todo el snapshot JSON."
---

# RA-COM-007 — Política de reconstrucción de PDFs históricos

**Pregunta de negocio:** ¿Qué debe hacer el sistema si un PDF comercial histórico necesita reconstruirse y su cotización no tiene snapshot persistido?

## Contexto

`CotizacionesService.ensurePdfCurrent` reconstruye desde `snapshot_datos` cuando está disponible. Si no existe, puede construir un snapshot desde la cotización y el formato que encuentra en ese momento. Eso podría generar un documento diferente a la versión histórica original. La migración revisada agrega la columna de snapshot, pero no evidencia un backfill de snapshots para cotizaciones históricas como el realizado para certificados.

## Opciones e impacto

- **Bloquear y solicitar restauración:** no generar PDF desde datos actuales; pedir recuperación de una copia histórica verificable. Preserva el criterio de no sustituir silenciosamente datos, pero puede dejar el documento temporalmente inaccesible.
- **Generar con marca «Documento Reconstruido»:** permitir una copia basada en los datos disponibles, identificar visiblemente que fue reconstruida y registrar responsable, fecha y motivo. No asegura por sí sola que los datos coincidan con el original.
- **Política diferenciada:** bloquear si no hay respaldo verificable y permitir una copia marcada solo mediante autorización y auditoría explícitas.

## Observación técnica para análisis posterior

La entidad guarda `snapshot_datos` en una columna JSON. La migración `1794225602000-AddOperationalDocumentData.ts` crea `trg_cotizaciones_sello_inmutable`, pero su condición protege el cambio de `sello_icontec_version_id` cuando existe emisión o snapshot; no protege todos los campos del JSON ni otros datos documentales. La migración `1793813500000-AddPdfRendererVersion.ts` incluye protección de snapshot para certificados, no una protección equivalente general para cotizaciones. Debe evaluarse si la política aprobada requiere inmutabilidad del snapshot a nivel de BD y cómo mantener compatible la regeneración operativa del PDF.

## Requisito afectado

`RF-COM-007` conserva cobertura Parcial. `B-007-01` permanece abierta hasta decidir la política de recuperación y reconstrucción; esta ficha no aprueba ninguna opción ni declara implementada la protección adicional de BD.
