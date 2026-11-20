---
id: RF-PLA-005
titulo: Registrar tandas, reprocesos, recetas e insumos
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3 y §8"
fuente_contraste: "docs/requisitos/por-aclarar/RA-PLA-003-inventario-planta.md; RF-PLA-011; src/planta/; src/productos/"
depende_de: [RF-PLA-002, RF-PLA-003]
bloquea: [RF-PLA-014]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-008 se deriva a RF-PLA-014; B-PLA-009 a RA-PLA-008; inventario/microbodega se mantiene en RA-PLA-003 y reprocesos en RF-PLA-011/RA-PLA-006."
---

# RF-PLA-005 — Registrar tandas, reprocesos, recetas e insumos

**Fuente principal:** `Sterinova-ERP.md` §3, Planta: tandas, reprocesos, consumo de insumos, microbodega, recetas y preparaciones; §8, pendientes de negocio para microbodega/consumos finales y recetas por proceso.

**Fuente de contraste:** `RA-PLA-003`, `RF-PLA-011`, entidades/servicios de `src/planta/` y catálogo comercial de `src/productos/`.

1. **ID:** `RF-PLA-005`.
2. **Título:** Registrar tandas, reprocesos, recetas e insumos.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Agrupar ciclos en tandas, registrar reprocesos, mantener recetas de consumo por proceso y controlar insumos y microbodega de Planta conforme a políticas definidas.
6. **Reglas de negocio asociadas:** El anexo §3 enumera estas capacidades; §8 deja microbodega/consumos finales y recetas por proceso pendientes de definición estratégica. Los reprocesos deben conservar el ciclo original y vincular un nuevo intento; su detalle técnico se deriva a `RF-PLA-011` y sus políticas a `RA-PLA-006`.
7. **Actores y permisos:** El anexo no precisa roles para configurar tandas, recetas o inventario. El operador actual registra ciclos con `planta.ciclos.crear`; roles de almacén, Planta y Calidad para consumos y aprobaciones quedan por decidir.
8. **Datos y entidades:** Existe `CicloEsterilizacion` y su detalle `CicloMaterialProcesado`; no se encontró entidad `Tanda`, inventario/microbodega, movimiento de insumo, receta ni consumo productivo. `ciclo_correccion_de_id` es una relación declarada, aún sin flujo operativo.
9. **Precondiciones y postcondiciones:** La implementación registra un ciclo de una orden y cantidades de sus materiales. No crea agrupación de tanda, valida existencias de consumibles ni calcula consumo estándar/real. La presencia de productos comerciales clasificados `INSUMOS` no crea una salida de inventario de Planta.
10. **Criterios de aceptación:** (a) Agrupar ciclos en una Tanda con identificador y relaciones trazables. (b) Administrar insumos, existencias y movimientos si el alcance se confirma. (c) Definir recetas versionadas por proceso/material y consumo previsto/real. (d) Registrar responsables, fechas, ajustes y trazabilidad. (e) Preservar ciclos originales y relacionar reprocesos.
11. **Evidencia en backend:** `src/planta/` contiene entidades de ciclo, material procesado, parámetros y protocolo; no servicios/repositorios de recetas, consumos o tandas. `PlantaService` registra cantidades procesadas por ciclo, no insumos consumibles.
12. **Evidencia en persistencia y alcance:** La búsqueda del código versionado no encontró tablas/migraciones de tanda, receta, microbodega o consumos de Planta. `INSUMOS` aparece en catálogo/cotización comercial para venta y no debe confundirse con inventario de producción.
13. **Brechas derivadas:** `B-PLA-008` se reasigna a `RF-PLA-014` para agrupación de ciclos por Tanda. `B-PLA-009` se deriva a `RA-PLA-008` para definir recetas, insumos y microbodega. El alcance general de inventario permanece en `RA-PLA-003`; el flujo de reprocesos en `RF-PLA-011`.
14. **Preguntas abiertas:** ¿Qué es una Tanda y qué cardinalidad tiene con órdenes/ciclos? ¿Qué insumos, unidades y movimientos se controlan? ¿Las recetas varían por método, equipo, material o empaque? ¿Se controlará consumo previsto contra consumo real y quién autoriza ajustes? Se derivan a `RA-PLA-003` y `RA-PLA-008` según tema.
15. **Estado de cobertura:** Parcial. Hay registro de ciclos y cantidades de materiales; Tanda, recetas, microbodega y consumos productivos no están implementados. El reproceso está derivado y cuenta solo con una relación de datos sin flujo operativo.
16. **Nivel de certeza y límites:** Confirmado en el anexo, decisiones documentadas, servicios, entidades y migraciones revisadas. No se verificó una base desplegada.
