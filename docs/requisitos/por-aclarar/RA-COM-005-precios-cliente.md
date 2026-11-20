---
id: RA-COM-005
titulo: Precios especiales reutilizables por cliente
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 3, respuestas 26–29; src/productos/; src/cotizaciones/"
depende_de: [RF-COM-004]
bloquea: []
brechas: [B-004-02]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-004; el precio por cotización permanece disponible mientras se decide si hace falta reutilización."
---

# RA-COM-005 — Precios especiales reutilizables por cliente

**Pregunta de negocio:** ¿Es suficiente capturar o editar el precio en cada cotización, o se necesita un catálogo maestro que permita guardar y reutilizar precios y condiciones especiales por cliente?

## Contexto

El backend recibe `valor_unitario` por ítem y lo guarda en una línea asociada a una cotización de cliente. La entidad de producto no contiene precio y no se observó relación de tarifas con clientes. La documentación backend indica que los precios pueden variar por cliente y propone seleccionar el precio del cliente o capturarlo en la cotización; no confirma que se requiera persistir tarifas reutilizables.

## Opciones e impacto

- **Precio por cotización es suficiente:** el asesor establece el valor unitario en cada oferta; no se mantiene una tarifa especial reutilizable.
- **Se requiere catálogo por cliente:** deben definirse vigencia, moneda, unidad, alcance de productos/servicios, autorización de cambios y uso de la tarifa al cotizar.

## Requisito afectado

`RF-COM-004` mantiene cobertura parcial y permite capturar precios por ítem. `B-004-02` permanece abierta hasta decisión explícita.
