---
id: RA-PLA-003
titulo: Política de inventario y microbodega en Planta
tipo: RA
modulo: Planta / Logística
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §8, pendientes: Inventario completo y Microbodega"
fuente_contraste: "Sterinova-ERP.md §3, Logística y Planta; src/planta/planta.service.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts"
depende_de: [RF-LOG-004]
bloquea: []
brechas: [B-LOG-020]
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-LOG-004: el flujo actual expone materiales de órdenes en Planta, pero no persiste un inventario/microbodega operativo al transferir."
---

# RA-PLA-003 — Política de inventario y microbodega en Planta

**Pregunta de negocio:** ¿Planta requiere inventario propio/microbodega con existencias por ubicación, material/lote y estado, o basta con consultar los materiales asociados a órdenes que están en `EN_PLANTA` y registrar su asignación a ciclos?

## Contexto

El anexo §8 identifica “Inventario completo” y “Microbodega” como pendientes. En el código revisado, `PlantaService.findOrdenesEnPlanta` consulta órdenes en `EN_PLANTA` y sus `OrdenServicioMaterial`; los ciclos registran cantidades procesadas, pero no se encontró saldo de inventario de Planta generado por la transferencia.

## Opciones para decisión

- **Solo materiales por orden:** mantener el acceso operacional por estado, sin inventario independiente; definir cómo se controlan devoluciones, sobrantes y ubicaciones.
- **Microbodega por orden/lote:** registrar entradas y consumos internos ligados a órdenes, materiales y lotes, sin inventario general.
- **Inventario completo de Planta:** manejar existencias, ubicaciones, reservas, movimientos, cuarentena, consumos, devoluciones y ajustes con conciliación/auditoría.

## Impacto

La decisión define si la transferencia crea una entrada de inventario, qué saldo limita ciclos y reprocesos, cómo se registran devoluciones y qué reportes requiere Planta. No se presume que un simple cambio a `EN_PLANTA` constituya movimiento de existencias.

## Requisito y brecha afectados

`RF-LOG-004` conserva cobertura Parcial. `B-LOG-020` queda abierta y se deriva a esta decisión hasta que negocio defina el alcance de inventario y microbodega.
