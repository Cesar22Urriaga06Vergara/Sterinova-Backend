---
id: RA-COM-006
titulo: Evidencia de aceptación del cliente
tipo: RA
modulo: Comercial
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 3, respuestas 32–35; src/cotizaciones/entities/cotizacion.entity.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts"
depende_de: [RF-COM-006]
bloquea: []
brechas: [B-006-03]
historial:
  - version: 1.0
    nota: "Pregunta derivada de RF-COM-006; no establece evidencia obligatoria hasta decisión explícita del negocio."
---

# RA-COM-006 — Evidencia de aceptación del cliente

**Pregunta de negocio:** ¿Qué documento o referencia debe conservar el sistema para demostrar que el cliente aceptó una cotización?

## Contexto

El cliente no inicia sesión en el ERP; un usuario interno registraría su respuesta. La documentación activa propone conservar fecha, responsable, medio, versión y alternativa aceptada, pero no define si debe adjuntarse un documento o cuál evidencia es suficiente. La cotización tiene columnas de auditoría para el usuario ERP y la fecha del registro, pero no un campo o asociación específica para la evidencia.

## Opciones e impacto

- **Número de orden de compra:** guardar número, fecha y eventualmente emisor; definir cómo tratar aceptación sin orden de compra.
- **Documento firmado:** adjuntar o referenciar un archivo y conservar su identidad/integridad; definir formatos y quién lo carga.
- **Correo u otra comunicación:** conservar referencia, emisor, fecha y medio; decidir si se adjunta el mensaje.
- **Registro manual en el sistema:** guardar responsable, fecha, medio y referencia/observación, sin adjunto obligatorio.
- **Combinación de evidencias:** determinar qué evidencia se exige según el tipo de cliente o transacción.

## Requisito afectado

`RF-COM-006` mantiene cobertura Parcial. `B-006-03` queda abierta hasta decisión explícita; esta ficha no convierte ninguna opción en requisito aprobado.
