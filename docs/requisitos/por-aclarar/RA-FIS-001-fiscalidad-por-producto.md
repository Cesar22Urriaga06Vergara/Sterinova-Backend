---
id: RA-FIS-001
titulo: Fiscalidad por producto o servicio
tipo: RA
modulo: Fiscal
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §8"
fuente_contraste: "src/tasas-fiscales/; src/cotizaciones/entities/cotizacion.entity.ts; src/cotizaciones/cotizaciones.service.ts"
depende_de: []
bloquea: []
brechas: [B-002-02]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-002; el IVA en cabecera se conserva como solución operativa actual."
---

# RA-FIS-001 — Fiscalidad por producto o servicio

**Pregunta de negocio:** Cuando se defina la integración fiscal real pendiente en el anexo §8, ¿se requerirá asignar tasas o clasificación fiscal a cada producto/servicio, o se mantendrá el tratamiento tributario a nivel de cotización?

## Contexto

El backend mantiene versiones inmutables de tasas fiscales y, al crear una cotización, guarda una tasa IVA y su versión en la cabecera. No hay vínculo fiscal en `Producto` ni en `CotizacionItem`. El usuario confirmó que este modelo es un parche operativo válido por ahora; la integración fiscal real permanece pendiente.

## Opciones e impacto

- **Fiscalidad por producto/servicio:** el negocio debe definir categorías, tasas aplicables, excepciones y precedencia; el cálculo puede variar por línea.
- **Fiscalidad a nivel de cotización:** mantener una tasa única por cotización como mecanismo actual; se necesita definir el alcance de la integración fiscal real sin asumir que el parche actual la satisface.

## Requisitos afectados

- `RF-COM-002` queda Cubierto y no bloquea el flujo comercial actual.
- `B-002-02` permanece abierta hasta que se defina el alcance fiscal futuro.
