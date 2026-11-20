---
id: RF-PLA-015
titulo: Bloqueo estricto del método contratado (Comercial-Logística-Planta)
tipo: RF
modulo: Comercial / Logística / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6; docs/negocio/reglas-maestras.md, Módulo 5, respuesta 64"
fuente_contraste: "src/cotizaciones/entities/cotizacion-item.entity.ts; src/logistica/logistica.service.ts; src/planta/planta.service.ts"
depende_de: [RN-PLA-001, RF-COM-003, RF-LOG-001, RF-PLA-002]
bloquea: []
brechas: [B-PLA-010]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-010; ancla la comparación del método al concepto contratado y limita correcciones."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; method por línea y excepciones requieren acuerdo de negocio."
---

# RF-PLA-015 — Bloqueo estricto del método contratado (Comercial-Logística-Planta)

**Estado:** Borrador, pendiente de análisis y validación.

## Enunciado preliminar

El método operativo de la orden y del ciclo debe derivarse del método contractual asociado a cada concepto/material. Logística no debe cambiarlo mediante edición operativa y Planta debe rechazar cualquier ciclo que no coincida; correcciones requieren el flujo comercial autorizado y trazabilidad.

## Base documental y técnica inicial

- `CicloEsterilizacion` compara con el método actual de la orden.
- Logística permite establecer/editar el método antes del primer evento/ciclo.
- `CotizacionItem` tiene `metodo`, pero la función de asignación de método no lo contrasta con la orden/ciclo para todos los tipos de servicio.

## Aspectos por definir

Método por línea para cotizaciones con varios servicios, método de tipos genéricos, restricciones de edición, permisos/flujo de corrección, auditoría y compatibilidad por material.

## Análisis estructurado (16 campos)

1. **ID:** `RF-PLA-015`.
2. **Título:** Bloqueo estricto del método contratado (Comercial–Logística–Planta).
3. **Tipo:** RF.
4. **Módulo:** Comercial / Logística / Planta.
5. **Descripción funcional:** Mantener el método operativo de la orden/ciclo anclado al método contratado por concepto, permitiendo corrección solo por flujo comercial autorizado y trazable.
6. **Reglas asociadas:** Planta no cambia el método contratado; comparación se realiza contra el valor contratado congelado, no solo contra campo editable de la orden. No inferir método para servicios genéricos sin decisión.
7. **Actores / permisos:** Comercial administra correcciones contractuales; Logística y Planta consultan y ejecutan método asignado; permisos de corrección y doble aprobación por definir.
8. **Datos y entidades:** Método en `CotizacionItem`, relación de cada línea con material de orden y método operativo del ciclo; conservar valor contratado/snapshot y actor/fecha de modificación autorizada.
9. **Flujo preliminar:** Cerrar cotización → derivar método a orden/material → permitir a Planta ciclo compatible → rechazar discrepancia → corrección contractual mediante acción autorizada y trazada.
10. **Criterios de aceptación preliminares:** Cambiar manualmente el método de orden no habilita método distinto en ciclo; cada línea valida el servicio contratado; corrección aprobada actualiza vínculo sin reescribir la historia; servicios sin método declarado aplican regla explícita.
11. **Evidencia backend:** Planta compara contra método actual de la orden; Logística puede asignarlo/editarlo antes del primer ciclo; `CotizacionItem` tiene método, pero el contraste end-to-end no garantiza anclaje por concepto en los caminos revisados.
12. **Persistencia e interfaz:** La orden conserva método operacional; el vínculo contractual por línea requiere propagación/snapshot. La interfaz permite cambios logísticos previos según flujo citado.
13. **Brecha asociada:** `B-PLA-010` abierta; se deriva el anclaje del método contractual a esta ficha.
14. **Preguntas abiertas:** Método por línea, servicios genéricos, compatibilidad de material, quién corrige, doble aprobación, auditoría y comportamiento de cotizaciones antiguas.
15. **Cobertura preliminar:** Parcial; se valida ciclo contra la orden vigente, pero el método de la orden puede divergir del contratado.
16. **Certeza y límites:** Evidencia en entidades/servicios citados y Regla Maestra M5 respuesta 64. No se definió el modelo de métodos para servicios mixtos; borrador pendiente de validación.

