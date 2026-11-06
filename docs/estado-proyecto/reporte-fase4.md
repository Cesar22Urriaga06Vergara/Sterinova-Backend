# Reporte Fase 4 — PDFs y documentos oficiales

- **Fecha:** 2026-11-06
- **Estado:** Implementación completada; aceptación visual pendiente de firma de Calidad.

## Implementación

- Se creó `StorageService` como interfaz de almacenamiento con `saveFile`, `getFile` y `deleteFile`. `LocalStorageService` implementa almacenamiento privado en `storage/pdfs` (configurable mediante `PDF_STORAGE_PATH`), con claves relativas validadas y escritura atómica. `PdfModule` registra la implementación local detrás del contrato para permitir reemplazarla por un adaptador de almacenamiento de objetos.
- `PdfGeneratorService` ahora usa la abstracción de almacenamiento, calcula SHA-256 sobre los bytes finales y limita la operación de Playwright a 15 segundos (configurable con `PDF_RENDER_TIMEOUT_MS`). Ante timeout o fallo devuelve 503, registra un mensaje sin snapshot ni datos del cliente y cierra la página de render.
- La descarga lee el objeto por `StorageService` y compara SHA-256 con `hash_pdf` antes de entregar los mismos bytes. Un archivo ausente, con hash incorrecto o con renderer antiguo se regenera desde `snapshot_datos`; si falla la generación, la transacción no actualiza la fila del documento.
- `GET /certificados/validar/:token` está limitado a 5 solicitudes por minuto. La respuesta pública contiene únicamente indicador de validez, equipo, fechas y estado; se quitaron nombre del cliente y método.

## Documentación operativa

- [Runbook de PDFs](../manuales/runbook-pdfs.md): flujo, verificación SHA-256 y recuperación desde snapshot.
- [Checklist de aceptación visual](../calidad-y-pruebas/aceptacion-visual-pdfs.md): comparación con la plantilla Word y firma de Calidad.

## Validación

- `npm run build`: aprobado.
- `npm test`: 28 archivos aprobados, 1 omitido; 97 pruebas aprobadas y 2 omitidas.
- Las pruebas añadidas cubren timeout sin guardar PDF, escritura/lectura local, hash de los bytes persistidos, integridad en descargas, respuesta pública sin PII y límite de throttling.
- `git diff --check`: aprobado.

La revisión visual contra los Word oficiales requiere ejecución y firma humana de Calidad según el checklist enlazado.
