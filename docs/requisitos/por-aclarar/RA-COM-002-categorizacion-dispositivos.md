---
id: RA-COM-002
titulo: Categorización de dispositivos médicos
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §1, §3, §8"
fuente_contraste: "src/productos/entities/producto.entity.ts; src/productos/dto/"
depende_de: []
bloquea: []
brechas: [B-002-01]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-002; no bloquea su cierre ni el flujo actual."
---

# RA-COM-002 — Categorización de dispositivos médicos

**Pregunta de negocio:** ¿El catálogo debe distinguir explícitamente los dispositivos médicos mediante una categoría o atributos regulatorios específicos, o basta el tipo genérico `PRODUCTO`?

## Contexto

`Sterinova-ERP.md` §1 incluye la comercialización de dispositivos médicos; §3 solicita un catálogo de productos y servicios. El anexo no define una categoría ni atributos regulatorios para esos productos. El backend tiene `tipo_item` (`PRODUCTO` / `SERVICIO`) y categorías para insumos, pero no una clasificación específica de dispositivos médicos.

## Opciones e impacto

- **Definir categoría o atributos regulatorios:** el negocio debe precisar cuáles se requieren y cuándo son obligatorios; permitirá identificar y filtrar estos dispositivos, con cambios en captura y datos.
- **Mantener `PRODUCTO` genérico:** evita añadir clasificación no especificada; los dispositivos se registran como productos sin atributos especializados.

## Requisitos afectados

- `RF-COM-002` queda Cubierto con el modelo actual mientras esta decisión permanece pendiente.
- `B-002-01` seguirá abierta hasta decisión explícita.
