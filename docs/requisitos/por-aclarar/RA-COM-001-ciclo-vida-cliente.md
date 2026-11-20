---
id: RA-COM-001
titulo: Alcance contractual del ciclo de vida del cliente
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 2, respuestas 17 y 20; src/clientes/"
depende_de: []
bloquea: []
brechas: [B-001-01]
historial:
  - version: 1.0
    nota: "Pregunta abierta derivada de RF-COM-001; no implica decisión del usuario."
---

# RA-COM-001 — Alcance contractual del ciclo de vida del cliente

**Pregunta de negocio:** ¿El ciclo de vida del cliente (activo/inactivo) forma parte del alcance contractual del ERP?

## Contexto

`Sterinova-ERP.md` §3 solicita gestión de clientes, pero no especifica estados activo/inactivo. La documentación backend menciona activación e inactivación, mientras que la entidad y el controlador inspeccionados no muestran un estado ni endpoints específicos para esas acciones.

## Opciones e impacto

- **Sí, forma parte del alcance:** se define un requisito funcional propio y se precisan estados, transiciones, responsables y efectos sobre cotizaciones y operaciones.
- **No, queda fuera del alcance contractual actual:** se conserva como necesidad pendiente o futura y no se incluye en la cobertura de `RF-COM-001`.

## Requisitos afectados

- `RF-COM-001` permanece limitado a registrar y consultar clientes, con cobertura `Cubierto`.
- Un requisito de activación/inactivación se asignará si se confirma que pertenece al alcance.

**Estado:** Pendiente de decisión del usuario. No se cierra `B-001-01` sin respuesta explícita.
