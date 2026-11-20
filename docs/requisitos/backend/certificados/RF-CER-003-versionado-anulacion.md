---
id: RF-CER-003
titulo: Conservar versiones y anular certificados sin borrar el original
tipo: RF
modulo: Certificados
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/; src/database/migrations/; src/pdf/"
depende_de: [RF-CER-001, RF-CER-002]
bloquea: [RF-CER-006, RF-CER-007, RA-CER-002]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-003 y B-CER-004 se derivan; políticas a RA-CER-002."
---

# RF-CER-003 — Conservar versiones y anular certificados sin borrar el original

**Fuente principal:** `Sterinova-ERP.md` §3 (versiones, anulación sin borrar original y reemplazos) y §7 (PDF con datos congelados).

**Fuentes de contraste:** entidad, controlador y servicio de Certificados; migraciones de inmutabilidad y versionado PDF.

1. **ID:** `RF-CER-003`.
2. **Título:** Conservar versiones y anular certificados sin borrar el original.
3. **Tipo:** RF.
4. **Módulo:** Certificados.
5. **Descripción funcional:** Conservar documentos emitidos y sus evidencias; anular sin borrar el original y emitir reemplazo vinculado cuando corresponda; mantener historial de versiones verificable.
6. **Reglas asociadas:** No sobrescribir el documento histórico. El reemplazo debe ser un registro nuevo, vinculado al anulado y preservando PDF, hash, snapshot y aprobación originales.
7. **Actores y permisos:** No se halló endpoint/permiso de anulación o reemplazo de certificado. Consulta y descarga sí tienen permisos.
8. **Datos y entidades:** Hay estado string, formato versionado, snapshot, hash, renderer y fecha de emisión; no hay vínculo de reemplazo ni versión secuencial del certificado.
9. **Flujo:** Se emite certificado `Aprobado`. No hay operaciones de anulación/reemplazo. Validación pública interpreta `Anulado`, pero no se encontró escritura de ese estado.
10. **Criterios de aceptación:** Anular sin eliminar; crear reemplazo vinculado; capturar motivo y autorización; conservar versiones documentales anteriores y registrar integridad/linaje.
11. **Evidencia del backend:** `CertificadosController` no expone anular/reemplazar; `CertificadosService` no tiene métodos de esas operaciones. La migración crea trigger de inmutabilidad de certificados aprobados.
12. **Persistencia/PDF:** `version_formato_id` identifica formato, `pdf_renderer_version` renderer. `ensurePdfCurrent` regenera desde snapshot; mismo renderer reutiliza la misma clave y otro renderer genera clave con sufijo, sin registro de versiones del documento. El trigger permite actualizar URL/hash/renderer para reparación, no estado/snapshot protegidos.
13. **Brechas derivadas:** `B-CER-003` a `RF-CER-006` (anulación y reemplazo); `B-CER-004` a `RF-CER-007` (historial PDF/protección); políticas a `RA-CER-002`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definir roles/autorizaciones, motivo, visibilidad de anulado, vínculo de sustitución y conservación de PDFs previos; `RA-CER-002`.
15. **Estado de cobertura:** Parcial. Snapshot, hash y formato versionado están implementados, pero no anulación ni reemplazo; regeneración no mantiene un historial documental completo.
16. **Certeza y límites:** Confirmado en código y migraciones inspeccionados. El estado `Anulado` en validación no equivale a flujo operativo; no se revisó base desplegada.
