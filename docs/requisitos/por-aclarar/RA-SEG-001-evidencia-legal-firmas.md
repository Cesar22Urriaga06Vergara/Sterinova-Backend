---
id: RA-SEG-001
titulo: Alcance jurídico y evidencia de firmas y autorizaciones
tipo: RA
modulo: Seguridad / Documentos / Calidad
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 1.0
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §7 Documentos generados; §8 Evidencia jurídica completa de firmas"
fuente_contraste: "RF-SEG-001; RNF-SEG-002; RF-PLA-007; RF-CAL-010; docs/requisitos/frontend/README.md"
depende_de: []
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Ficha creada para el pendiente jurídico de §8. No se presume que un nombre, imagen de firma, contraseña o aprobación en el ERP tenga un efecto legal específico."
---

# RA-SEG-001 — Alcance jurídico y evidencia de firmas y autorizaciones

## Pregunta de negocio y jurídica

¿Qué operaciones y documentos requieren firma o evidencia jurídicamente suficiente, quién puede firmarlos y qué debe conservar el ERP para demostrar identidad, intención, integridad y momento de la aprobación?

## Aspectos a definir

- Documentos y operaciones afectados, incluyendo aprobaciones de Calidad, liberaciones por excepción y documentos comerciales.
- Tipo de firma o constancia aceptado para cada uso y las validaciones jurídicas aplicables.
- Identidad del firmante, delegación, separación de funciones y evidencia temporal requerida.
- Integridad, conservación, consulta, revocación y reemplazo del documento firmado.
- Casos en que basta la aprobación autenticada en el ERP y casos que requieren evidencia externa.

## Impacto

La decisión condiciona el diseño de aprobaciones, adjuntos, auditoría, PDFs y retención documental. La autenticación por contraseña y la captura visual de una firma no se consideran automáticamente equivalentes a una firma con efecto jurídico.

## Referencia contractual

El anexo §8 marca “Evidencia jurídica completa de firmas” como pendiente y §7 enumera evidencias de firmas y autorizaciones, sin definir tipo, validez ni criterio de aceptación.
