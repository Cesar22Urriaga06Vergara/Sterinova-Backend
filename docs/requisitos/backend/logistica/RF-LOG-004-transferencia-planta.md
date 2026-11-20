---
id: RF-LOG-004
titulo: Transferir materiales entre Logística y Planta
tipo: RF
modulo: Logística / Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54–55; src/logistica/; src/ordenes-servicio/; src/planta/"
depende_de: [RF-LOG-002, RF-LOG-003]
bloquea: [RF-LOG-005, RF-LOG-017, RF-LOG-018]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-018 se derivó a RF-LOG-017; B-LOG-019 a RF-LOG-018; B-LOG-020 a RA-PLA-003."
---

# RF-LOG-004 — Transferir materiales entre Logística y Planta

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, solicita transferencias hacia Planta y control de custodia; §6 dispone que el material recibido no se reasigne dos veces.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 48 y 54–55; controlador/servicios de `src/logistica/`, listado de órdenes y ciclos en `src/planta/`.

1. **ID:** `RF-LOG-004`.
2. **Título:** Transferir materiales entre Logística y Planta.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta.
5. **Descripción funcional:** Registrar el paso de materiales desde Logística a Planta con identidad del material y cantidades transferidas, responsables de entrega y recepción, fecha/hora, evidencia y disponibilidad operativa para Planta.
6. **Reglas de negocio asociadas:** El anexo solicita transferencias a Planta y control de custodia. La regla de recepción requiere usuario receptor, fecha/hora, sede y evidencia; los estados separan recepción en planta de procesamiento. El anexo §8 reconoce inventario completo y microbodega como pendientes de negocio.
7. **Actores y permisos:** El cambio a `EN_PLANTA` se hace con `logistica.ordenes.cambiar_estado`. Planta lista órdenes con `planta.ordenes.ver` y crea ciclos con `planta.ciclos.crear`. El código no comprueba que el receptor sea un usuario autenticado de Planta.
8. **Datos y entidades:** `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`, `CicloEsterilizacion` y `CicloMaterialProcesado`. No se encontró entidad de transferencia ni de inventario/microbodega de Planta relacionada al cambio de estado.
9. **Precondiciones y postcondiciones:** La orden debe existir y la transición ser válida. El cambio a `EN_PLANTA` genera evento `RECEPCION_PLANTA` con responsable y receptor en texto. Planta puede consultar la orden y sus materiales por el estado `EN_PLANTA`; el registro de ciclo ocurre después.
10. **Criterios de aceptación:** (a) Registrar una transferencia como acto explícito de custodia. (b) Identificar a quien entrega y a quien acepta por usuario o identidad definida. (c) Registrar cantidades físicas y diferencias por material. (d) Conservar evidencia. (e) Crear movimiento/stock de Planta si el negocio decide que la transferencia alimenta inventario. (f) Exponer a Planta solo cantidades recibidas y disponibles.
11. **Evidencia en backend:** `PUT /logistica/ordenes/:id/estado` cambia la orden a `EN_PLANTA`; el servicio requiere `responsable` y `recibido_por` no vacío, guarda usuario autenticado (`usuario_id`), hora, cantidades y evento dentro de la transacción. `recibido_por` es una cadena libre, sin FK a `User` ni validación de permiso de Planta.
12. **Evidencia en BD y Planta:** `OrdenServicioEvento` guarda el evento `RECEPCION_PLANTA`. `PlantaService.findOrdenesEnPlanta` consulta órdenes en `EN_PLANTA` y carga `OrdenServicioMaterial`. `CicloMaterialProcesado` se crea al crear un ciclo, no durante el traspaso. No se encontró movimiento ni saldo de inventario en Planta. La entidad `Entrega` no participa en este flujo.
13. **Brechas derivadas:** `B-LOG-018` se asigna a `RF-LOG-017` (confirmación por usuario de Planta); `B-LOG-019` a `RF-LOG-018` (acta, cantidades y evidencia del traspaso); `B-LOG-020` a `RA-PLA-003` (política de inventario y microbodega). Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿La recepción debe confirmarla un usuario autenticado distinto de Logística? ¿La transferencia crea inventario de Planta o solo habilita la orden? ¿Qué acta y evidencia acreditan custodia y cantidades? Inventario/microbodega se consulta en `RA-PLA-003`.
15. **Estado de cobertura:** Parcial. El cambio de estado genera evento y deja la orden disponible para consulta en Planta. No hay recepción autenticada por Planta, acta bilateral de transferencia ni movimiento de inventario; su alcance se deriva a requisitos/decisión independientes.
16. **Nivel de certeza y límites:** Confirmado en controlador, servicios y entidades revisados; no se verificó una base desplegada. La necesidad y alcance de inventario quedan pendientes de decisión conforme al anexo §8.

**Trazabilidad actual:** Orden → estado `EN_PLANTA` y evento de recepción → consulta de orden/materiales en Planta → creación posterior del ciclo.
