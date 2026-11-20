---
id: RF-LOG-023
titulo: Generar y conservar actas de recepción de materiales
tipo: RF / Logística / Documentos
modulo: Logística / Recepción / Documentos
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Logística; §7 Documentos generados"
fuente_contraste: "src/logistica/recepcion.controller.ts; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-logistica.entity.ts; src/logistica/entities/recepcion-item.entity.ts; src/logistica/entities/documento-emitido.entity.ts; RA-LOG-002"
depende_de: [RF-LOG-002, RF-LOG-010]
bloquea: []
brechas: [B-LOG-025]
historial:
  - version: 0.1
    nota: "Borrador derivado de la lista contractual de documentos; se distingue el acta de recepción del Acta de Servicio generada desde la orden."
---

# RF-LOG-023 — Generar y conservar actas de recepción de materiales

**Estado:** Borrador técnico; pendiente de validación.

1. **ID:** `RF-LOG-023`.
2. **Título:** Generar y conservar actas de recepción de materiales.
3. **Tipo:** RF / Logística / Documentos.
4. **Módulo:** Logística / Recepción / Documentos.
5. **Descripción funcional:** Emitir un acta asociada a cada acto de recepción física de una orden, con el detalle que el negocio apruebe, y conservar su versión para consulta histórica. El acta debe distinguir recepción completa, parcial y materiales rechazados sin alterar la orden original.
6. **Reglas asociadas:** La recepción se relaciona con orden, fecha/hora y usuario receptor. Las líneas y saldos deben provenir de la recepción persistida; los soportes y firmas siguen la política de `RA-LOG-002`. Un acta de recepción no se debe confundir con el `ACTA_SERVICIO` emitido actualmente desde una orden.
7. **Actores / permisos:** Personal autorizado de Logística registra/consulta la recepción conforme a `logistica.recepciones.registrar`, `logistica.ordenes.ver` y el ámbito asociado.
8. **Datos y entidades:** `RecepcionLogistica`, futuras líneas persistidas de recepción, orden, usuario, sede, fecha/hora, remisión/factura, cantidades recibidas, diferencias, estado y evidencia aprobada. Campos finales y vínculo a versiones documentales requieren validación.
9. **Flujo preliminar:** Registrar una recepción y sus líneas → validar cantidades/documentos → construir un snapshot desde esos datos → emitir y conservar acta → consultar o descargar el mismo artefacto en el futuro.
10. **Criterios de aceptación preliminares:** (a) Cada acta identifica la orden y el acto de recepción al que corresponde. (b) Refleja solo líneas/cantidades recibidas en ese acto y permite comprender el saldo. (c) Conserva responsable y fecha/hora. (d) Las diferencias o rechazos aparecen de forma inequívoca. (e) La evidencia y firma cumplen `RA-LOG-002`. (f) Relecturas no alteran el documento histórico.
11. **Fuentes y evidencia actual:** `POST /logistica/ordenes/:id/recepcion` persiste una cabecera en `RecepcionLogistica`; `RecepcionService` no genera PDF y no inserta `RecepcionItem`. `DocumentoEmitido` solo enumera `ORDEN` y `ACTA`; el controlador de PDF genera `ORDEN_SERVICIO` o `ACTA_SERVICIO` desde la orden, no una constancia específica de recepción.
12. **Persistencia e interfaz:** No se encontró ruta de emisión, entidad o tipo documental dedicado al acta de recepción. El detalle de líneas de recepción tampoco está conectado al servicio actual; su persistencia se deriva a `RF-LOG-010`. La UI registra eventos operativos, pero no expone una emisión de acta de recepción.
13. **Brecha asociada:** `B-LOG-025` registra la falta de un artefacto de recepción emitido, separado del acta de servicio.
14. **Preguntas abiertas:** Contenido y formato final; una acta por recepción o consolidada por orden; firma/evidencia obligatoria; emisión para parciales y rechazos; numeración, corrección y conservación. La política de evidencia se relaciona con `RA-LOG-002`.
15. **Cobertura preliminar:** Faltante para la emisión de un acta de recepción; hay una entidad de cabecera de recepción y otro tipo documental (`ACTA_SERVICIO`), pero no se encontró generación específica de la recepción.
16. **Certeza y límites:** Confirmado en controlador, servicio, entidades y UI citados. No se inspeccionó una instalación productiva ni se verificó si un formato manual externo satisface esta necesidad.
