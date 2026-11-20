---
id: RF-CER-007
titulo: Historial de versiones de PDF y protección contra sobrescritura
tipo: RF
modulo: Certificados / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/certificados.service.ts; src/certificados/entities/certificado-esterilizacion.entity.ts; src/pdf/pdf-generator.service.ts"
depende_de: [RF-CER-003, RA-CER-002]
bloquea: []
brechas: [B-CER-004]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-004."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos e incorpora el riesgo de reparación del PDF usando la misma clave."
---

# RF-CER-007 — Historial de versiones de PDF y protección contra sobrescritura

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-007`.
2. **Título:** Historial de versiones de PDF y protección contra sobrescritura.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Documentos.
5. **Descripción funcional:** Conservar cada PDF emitido o regenerado como artefacto histórico verificable y distinguirlo de la versión vigente sin sobrescribir o perder el original.
6. **Reglas asociadas:** Cada versión conserva hash, renderer, fecha, causa, snapshot asociado y actor si aplica; la reparación desde snapshot no modifica el contenido lógico original ni destruye la única copia anterior ante fallo.
7. **Actores / permisos:** Emisión/reparación por servicios autorizados de Certificados; descarga según `certificados.descargar` y ámbito; actor administrativo para acciones de mantenimiento por definir.
8. **Datos y entidades:** Certificado, versión del renderer/formato, `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, fecha/causa de creación y referencia de versión vigente. No existe entidad de historial de PDFs observada.
9. **Flujo preliminar:** Emitir primera versión → guardar artefacto y hash → registrar metadatos → ante actualización/reparación generar una nueva clave/version → validar guardado → conservar previa y cambiar referencia vigente de forma segura.
10. **Criterios de aceptación preliminares:** La regeneración no reemplaza artefacto histórico; toda versión valida contra su hash y snapshot; fallo de DB/storage conserva el PDF previo y referencias; selector/descarga identifica versión vigente e historial permitido.
11. **Evidencia en backend:** La entidad guarda solo referencias actuales. `ensurePdfCurrent` reconstruye desde snapshot; cuando el renderer cambia crea sufijo de versión, pero con el mismo renderer usa la clave anterior. Un error al guardar elimina la clave generada; si coincide con la anterior, hay riesgo para la copia vigente. La migración añade trigger de inmutabilidad para certificados aprobados, lo que añade riesgo de conflicto al guardar reparaciones.
12. **Persistencia e interfaz:** No hay entidad/versionado histórico; la UI descarga el PDF actual. El artefacto de storage y fila de certificado comparten una sola referencia/hash activos.
13. **Brecha asociada:** `B-CER-004` abierta por falta de versiones históricas y riesgo de sobrescritura/pérdida durante regeneración.
14. **Preguntas abiertas:** Definir política de reparación, conservación/retención, claves y metadatos, acceso a versiones antiguas, eventos auditados y tratamiento de archivos corruptos o renderer retirado.
15. **Cobertura preliminar:** Parcial: hash, snapshot y renderer actuales permiten validar/regenerar el documento actual; no existe historial de versiones durable.
16. **Certeza y límites:** Riesgo deducido del flujo de `ensurePdfCurrent`, servicio de generación y trigger migratorio citados. No se ejecutó la reparación ni se inspeccionó storage real; requiere validación técnica antes del diseño final.
