---
id: RA-CER-001
titulo: Políticas de certificación para ciclos compartidos y cantidades
tipo: RA
modulo: Certificados / Calidad / Planta
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6, §7"
fuente_contraste: "RF-CER-001; RF-CER-002; RF-CER-004; RF-CER-005"
depende_de: [RF-CER-001, RF-CER-002]
bloquea: [RF-CER-004, RF-CER-005]
brechas: [B-CER-001, B-CER-002]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-CER-001 y B-CER-002."
---

# RA-CER-001 — Políticas de certificación para ciclos compartidos y cantidades

## Preguntas de negocio

1. ¿Cómo se particionan en certificados separados los materiales de varios clientes dentro del mismo ciclo?
2. ¿Cada documento incluye solo materiales/cantidades de su cliente y cuál es la agrupación por orden, ciclo y lote?
3. ¿Qué cantidad debe declararse cuando un material se procesa parcialmente o se rechaza?
4. ¿Cómo se identifican ciclos y reprocesos relacionados en uno o varios certificados?

## Impacto

La decisión define cardinalidades, contenido y alcance legal/operativo de cada certificado, además de los vínculos entre órdenes, clientes, lotes y ciclos. No se presume que el total ordenado equivalga a lo procesado.
