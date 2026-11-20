---
id: RN-PLA-001
titulo: No cambiar en Planta el método contratado
tipo: RN
modulo: Planta / Comercial / Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 64; src/planta/; src/logistica/; src/cotizaciones/"
depende_de: [RF-COM-003, RF-LOG-001, RF-PLA-002]
bloquea: [RF-PLA-015]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-010 se deriva a RF-PLA-015 para anclar la validación al método contratado por concepto."
---

# RN-PLA-001 — No cambiar en Planta el método contratado

**Fuente principal:** `Sterinova-ERP.md` §6: Planta no puede cambiar el método contratado.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 64; servicios, DTOs y entidades de Planta, Logística y Comercial.

1. **ID:** `RN-PLA-001`.
2. **Título:** No cambiar en Planta el método contratado.
3. **Tipo:** RN.
4. **Módulo:** Planta / Comercial / Logística.
5. **Enunciado:** El método del ciclo debe corresponder al método contratado para el concepto/material; Planta no puede sustituirlo durante el procesamiento.
6. **Reglas asociadas:** Comercial define el método según requerimiento y compatibilidad; órdenes con varios servicios deben conservar método por concepto y no inferir un método único para todos los materiales.
7. **Actores y permisos:** Operador con `planta.ciclos.crear` registra el método del ciclo. Logística puede crear/editar el método operativo de la orden antes del primer evento o ciclo.
8. **Datos y entidades:** `CotizacionItem.metodo` es texto libre; `OrdenServicio.metodo_esterilizacion` guarda un único método `ETO`/`VAPOR`; `CicloEsterilizacion.metodo` es enum `ETO`/`VAPOR`.
9. **Flujo y validación:** `PlantaService.createCiclo` compara el DTO con el método actual de la orden o el derivado del tipo de servicio. Rechaza discrepancia. La edición logística de materiales/método se bloquea cuando ya existe evento o ciclo, pero antes de ese punto permite cambiar el método conforme al tipo de cotización.
10. **Criterios de aceptación:** Resolver el método desde el concepto comercial correspondiente; no permitir cambios desde Planta; permitir correcciones solo mediante autorización/trazabilidad comercial; bloquear la creación de ciclo cuando el método no coincide con el concepto contratado.
11. **Evidencia en backend:** `createCiclo` valida igualdad con `orden.metodo_esterilizacion ?? metodoOrden(quote.tipo_servicio)`. `metodoOrden` impide contradicciones para tipos de servicio con sufijo `_ETO`/`_VAPOR`.
12. **Evidencia adicional:** `LogisticaService.createOrden` y `updateMateriales` establecen el método usando `metodoOrden`; esta función no compara con `CotizacionItem.metodo` cuando el tipo de servicio no codifica EtO/Vapor. El endpoint logístico de actualización deja modificarlo antes del primer evento/ciclo.
13. **Brechas derivadas:** `B-PLA-010` se asigna a `RF-PLA-015` para vincular estrictamente el método de orden/ciclo con el método contratado por concepto. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿Cómo se resuelven servicios múltiples o tipos genéricos con métodos distintos? ¿Qué rol aprueba una corrección contractual y cómo se audita? Se deben concretar dentro de `RF-PLA-015` y sus dependencias comerciales/logísticas.
15. **Estado de cobertura:** Parcial. El alta de ciclo no permite que el operador seleccione un método distinto del método actual de la orden, pero el método actual no siempre está anclado al método contractual por ítem y Logística puede cambiarlo antes del ciclo.
16. **Nivel de certeza y límites:** Confirmado en el código versionado y reglas de negocio revisadas. No se verificó una base desplegada.
