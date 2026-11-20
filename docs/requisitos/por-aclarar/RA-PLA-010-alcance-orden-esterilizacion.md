---
id: RA-PLA-010
titulo: Alcance documental de la orden de esterilización
tipo: RA
modulo: Planta / Calidad / Documentos
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 1.0
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Planta; §7 Documentos generados"
fuente_contraste: "RF-PLA-002; RF-PLA-004; RF-PLA-010; RF-PLA-017; src/planta/"
depende_de: [RF-PLA-017]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión abierta para precisar el contenido, momento de emisión, destinatarios y firma del documento de orden de esterilización enumerado en §7."
---

# RA-PLA-010 — Alcance documental de la orden de esterilización

## Preguntas para Planta y Calidad

1. ¿Qué datos debe mostrar la orden: cliente, orden de servicio, materiales/cantidades, método, equipo, protocolo/version, tanda, operador u otros?
2. ¿En qué momento se emite: al crear ciclo, preparar tanda, iniciar ciclo o en otro hito?
3. ¿Es un documento de trabajo interno o requiere aprobación/firmas y entrega a otra área?
4. ¿Cómo representa ciclos multiorden y cantidades parciales sin confundir orden de ciclo con certificado final?
5. ¿Qué formato, numeración, conservación, corrección y acceso por ámbito requiere?

## Contexto

`Sterinova-ERP.md` §7 enumera órdenes de esterilización como documentos generados, pero no define su contenido ni momento de emisión. El backend y frontend registran ciclos operativos; no se encontró un flujo separado para generar y conservar este documento.

## Requisito relacionado

`RF-PLA-017` mantiene la brecha documental abierta hasta que Planta/Calidad definan este alcance. Esta decisión no aprueba contenido ni autoriza cambios de código/BD.
