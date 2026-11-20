---
id: RF-COM-007
titulo: Emitir documentos comerciales y conservar sus datos
tipo: RF
modulo: Comercial / Cotizaciones / Documentos
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6, §7"
fuente_contraste: "src/cotizaciones/; src/pdf/; src/database/migrations/; ../SterinovaFrontend/src/app/internal/pdf/cotizacion/"
depende_de: [RF-COM-006]
bloquea: [RF-COM-008]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; riesgo de reconstrucción de PDF histórico sin snapshot derivado a RA-COM-007."
---

# RF-COM-007 — Emitir documentos comerciales y conservar sus datos

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §6, «Reglas operativas principales»; §7, «Documentos generados».

**Fuente de contraste:** código backend en `src/cotizaciones/`, `src/pdf/` y migraciones relacionadas; ruta de renderizado del frontend en `src/app/internal/pdf/cotizacion/page.tsx` y `src/lib/pdf-render-data.ts`.

1. **ID:** `RF-COM-007`.
2. **Título:** Emitir documentos comerciales y conservar sus datos.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones / Documentos.
5. **Descripción funcional:** El sistema debe generar documentos comerciales en PDF y conservar los datos, el formato y la versión utilizados al emitirlos, para que puedan consultarse posteriormente sin reconstruir su contenido a partir de datos actuales diferentes.
6. **Reglas de negocio asociadas:** El anexo §3 incluye generar documentos comerciales y PDF; §6 dispone que los documentos emitidos conserven sus datos originales y no se modifiquen silenciosamente. §7 especifica Playwright y componentes internos de Next.js, y contempla PDF con datos congelados. §6 indica que un fallo de PDF no debe dejar el material aprobado sin documento; literalmente, esa regla se refiere a material y su documentación de calidad, pero sirve como criterio de consistencia transaccional al revisar la emisión comercial.
7. **Actores / roles / ámbitos:** Emitir requiere `cotizaciones.emitir` y autorización sobre el ámbito de la cotización. El servicio registra mediante auditoría el usuario ERP que efectúa la emisión. El cliente no interviene como usuario del sistema en esta operación.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `snapshot_datos` JSON, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision` y `version_formato_id`. El snapshot incluye datos del documento y formato, cliente, ítems, cantidades, precios, importes fiscales, condiciones comerciales e imágenes aplicables. El PDF queda en almacenamiento y se verifica con SHA-256.
9. **Precondiciones / postcondiciones:** La emisión exige aprobación interna vigente y rechaza cotizaciones anuladas. Genera un snapshot con los datos actuales y la versión documental. Si la generación finaliza correctamente, persiste snapshot, formato, fecha, ruta, hash y versión del renderer, y registra auditoría. Una cotización con `fecha_emision` ya asignada retorna como emitida sin regenerarse en ese método.
10. **Criterios de aceptación:**
    - Dada una cotización que cumple las precondiciones, cuando se emite, entonces se genera y guarda el PDF junto con el snapshot de los datos y formato usados.
    - Dado un PDF previamente emitido, cuando se consulta, entonces se sirve el archivo que coincide con el hash almacenado o se reconstruye desde el snapshot persistido.
    - Dado un fallo del renderer o del almacenamiento del PDF durante la emisión, cuando falla la operación, entonces no queda persistida una emisión parcial.
    - Dado un documento emitido, cuando cambian los datos maestros o el formato vigente, entonces el PDF histórico conserva los datos del snapshot.
    - Dado un documento histórico sin snapshot que requiere reconstrucción, cuando no se pueden recuperar fielmente los datos originales, entonces el sistema no los sustituye silenciosamente por valores actuales.
11. **Evidencia en el backend y frontend:** `CotizacionesService.emitir` ejecuta la emisión en una transacción, crea el snapshot con `buildPdfSnapshot`, llama a `PdfGeneratorService.generate` y luego persiste snapshot, fecha, ruta, hash y versión del renderer. La auditoría se guarda en la misma transacción. Un `catch` exterior elimina el PDF generado si falla la persistencia y relanza el error. `PdfGeneratorService` usa Playwright/Chromium en backend y abre una ruta interna del frontend; la página Next.js valida el token firmado y compone el PDF con `CotizacionPDF` o `LegacyCotizacionPDF` a partir del snapshot, sin consultar la cotización en la BD. `ensurePdfCurrent` verifica archivo, hash y renderer; si reconstruye, usa `snapshot_datos` cuando existe. Si falta el snapshot, su fallback construye uno con la cotización y formato consultados en ese momento.
12. **Evidencia en BD:** La entidad declara `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision` y `version_formato_id`. `1793750400000-AddDocumentFormatVersioning.ts` agrega snapshot, ruta, hash, fecha y referencia al formato. `1794225602000-AddOperationalDocumentData.ts` protege con trigger el sello asociado a cotizaciones emitidas, no el snapshot completo. No se encontró una protección equivalente para todos los campos del snapshot de cotización; `1793813500000-AddPdfRendererVersion.ts` protege snapshots de certificados. No se verificó una base desplegada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha porque `B-007-01` se deriva a `RA-COM-007`. El riesgo se presenta cuando un documento emitido carece de `snapshot_datos` y requiere reconstrucción: `ensurePdfCurrent` puede tomar datos de la cotización y el formato disponibles en ese momento. La ficha de decisión incluye además la observación sobre la protección parcial del snapshot en BD.
14. **Preguntas abiertas:** ¿Cómo debe actuar el sistema si un PDF histórico requiere reconstrucción y no tiene snapshot: bloquear y pedir restauración, generar una copia con marca «Documento Reconstruido» u otra política auditable? La pregunta y la observación de protección en BD se documentan en `RA-COM-007`.
15. **Estado de cobertura:** Parcial. La generación actual usa Playwright/Chromium desde backend y componentes Next.js del frontend; persiste snapshot, versión documental, PDF y hash. La emisión maneja fallos con transacción y limpieza compensatoria. Persiste una ruta de reconstrucción desde datos actuales si falta el snapshot, por lo que no se garantiza reproducir históricamente todos los documentos.
16. **Nivel de certeza:** Confirmado en código que la emisión guarda snapshot y PDF, que el frontend renderiza desde el snapshot recibido, que el servicio verifica el hash y que la transacción revierte la emisión si falla la generación o persistencia. Confirmado que existe una rama de reconstrucción desde datos actuales cuando falta snapshot. No se verificó la frecuencia de cotizaciones emitidas sin snapshot en una base desplegada.

**Trazabilidad:** cotización aprobada → snapshot y versión de formato → render PDF vía Playwright/Next.js → almacenamiento y hash → auditoría de emisión → consulta posterior o reconstrucción desde snapshot.
