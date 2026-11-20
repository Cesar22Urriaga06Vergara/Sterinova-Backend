---
id: RF-CAL-007
titulo: Blindar validación de Calidad para órdenes sin método de esterilización
tipo: RF
modulo: Calidad / Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6; docs/negocio/reglas-maestras.md, Módulo 6"
fuente_contraste: "src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts"
depende_de: [RF-CAL-002]
bloquea: []
brechas: [B-CAL-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-003."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; se explicita la diferencia entre método nulo legado y servicios que no requieren esterilización."
---

# RF-CAL-007 — Blindar validación de Calidad para órdenes sin método de esterilización

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-007`.
2. **Título:** Blindar validación de Calidad para órdenes sin método de esterilización.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Logística.
5. **Descripción funcional:** Garantizar que la transición a entrega evalúe la liberación de Calidad para toda orden que por su servicio/material requiera evaluación, incluso si el campo operacional `metodo_esterilizacion` está nulo o es legado.
6. **Reglas asociadas:** Calidad aprueba antes del despacho. Un campo nulo no debe constituir por sí solo una excepción; tampoco debe forzarse el flujo de esterilización en un servicio que no lo requiere. Las excepciones deben ser explícitas, autorizadas y auditadas.
7. **Actores / permisos:** Logística solicita/ejecuta la transición con su permiso; el backend verifica ciclos, certificados y liberación de Calidad. Calidad autoriza cualquier excepción definida por política.
8. **Datos y entidades:** Orden y líneas/materiales, método contratado/operativo, ciclos relacionados, decisiones de Calidad, certificados asociados y condición de aplicabilidad del proceso.
9. **Flujo:** Solicitar entrega → resolver si el tipo de servicio requiere control de Calidad → comprobar liberación/certificado por unidades aplicables → rechazar si falta evidencia → permitir solo con requisitos satisfechos o excepción autorizada.
10. **Criterios de aceptación preliminares:** Orden esterilizable con método nulo no elude revisión; orden con ciclos pendientes/rechazados no se entrega; servicio explícitamente no sujeto a esterilización sigue regla aprobada sin exigir un certificado inexistente; toda excepción deja trazabilidad.
11. **Evidencia en backend:** `LogisticaService.updateEstado` recorre la compuerta de ciclos aprobados/certificados dentro de la condición que requiere `orden.metodo_esterilizacion`; por ello, el valor nulo evita esa comprobación.
12. **Persistencia e interfaz:** `OrdenServicio` guarda `metodo_esterilizacion` nullable; no se identificó en el hallazgo un indicador explícito de aplicabilidad del control de Calidad por tipo de servicio.
13. **Brecha asociada:** `B-CAL-003` permanece abierta y asignada a este borrador; deriva del bypass por método nulo.
14. **Preguntas abiertas:** Definir catálogo/criterio para “requiere Calidad”, tratamiento de órdenes antiguas, servicios no estériles y quién puede autorizar excepciones.
15. **Cobertura preliminar:** Parcial; existe control en órdenes con método, pero el camino con método ausente no aplica la misma compuerta.
16. **Certeza y límites:** La condición se observó en `LogisticaService.updateEstado` y el campo nullable en `OrdenServicio`. La clasificación de servicios y cualquier excepción requieren negocio; borrador sin validación.
