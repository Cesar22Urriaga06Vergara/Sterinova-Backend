---
id: RA-CER-002
titulo: Políticas de anulación, reemplazo y conservación de certificados
tipo: RA
modulo: Certificados / Calidad
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "RF-CER-003; RF-CER-006; RF-CER-007"
depende_de: [RF-CER-003]
bloquea: [RF-CER-006, RF-CER-007]
brechas: [B-CER-003, B-CER-004]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-CER-003 y B-CER-004."
---

# RA-CER-002 — Políticas de anulación, reemplazo y conservación de certificados

## Preguntas de negocio

- ¿Quién puede anular y con qué causas/evidencia obligatoria?
- ¿Cómo se vincula, identifica y presenta un certificado de reemplazo y su original anulado?
- ¿Qué historial de PDFs debe conservarse ante regeneración, corrupción o cambio de renderer y por cuánto tiempo?
- ¿Cómo debe responder la validación pública para documentos anulados, reemplazados o vencidos?

## Impacto

La decisión afecta trazabilidad, conservación documental, validez pública y controles de acceso. La anulación nunca debe implicar borrar silenciosamente el documento histórico.
