---
id: RA-PLA-008
titulo: Políticas de recetas, insumos y microbodega
tipo: RA
modulo: Planta / Calidad / Abastecimiento
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 y §8"
fuente_contraste: "RA-PLA-003; RF-PLA-005; src/planta/; src/productos/"
depende_de: [RF-PLA-005]
bloquea: []
brechas: [B-PLA-009]
historial:
  - version: 1.0
    nota: "Decisión de negocio derivada de B-PLA-009; el anexo §8 deja recetas por proceso y microbodega/consumos finales pendientes."
---

# RA-PLA-008 — Políticas de recetas, insumos y microbodega

## Preguntas para negocio, Planta y Abastecimiento

1. ¿Qué procesos/materiales requieren receta y qué insumos deben declararse por unidad, lote o carga?
2. ¿La receta será estándar, específica por método/equipo/empaque, o parametrizable por producto/material?
3. ¿Se requiere microbodega propia de Planta, inventario completo o solo registro de consumos por orden/ciclo? Coordinar con `RA-PLA-003` para mantener una decisión coherente.
4. ¿El sistema debe descontar consumo estándar automáticamente, registrar consumo real o permitir ambos con autorización de diferencias?
5. ¿Qué roles controlan recepción, ajuste, devolución, merma y aprobación de consumos?

## Contexto

El anexo §8 marca microbodega/consumos finales y recetas por proceso como pendientes de negocio. El catálogo comercial de productos `INSUMOS` no constituye inventario operativo de Planta.
