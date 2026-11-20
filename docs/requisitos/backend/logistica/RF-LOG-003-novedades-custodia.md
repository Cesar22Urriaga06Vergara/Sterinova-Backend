---
id: RF-LOG-003
titulo: Registrar novedades, rechazos y custodia
tipo: RF
modulo: Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49, 53–55; src/logistica/; src/ordenes-servicio/; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx"
depende_de: [RF-LOG-001, RF-LOG-002]
bloquea: [RF-LOG-004, RF-LOG-013, RF-LOG-014, RF-LOG-015, RF-LOG-016]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-014 a B-LOG-017 se derivaron a RF-LOG-013 a RF-LOG-016; las políticas de disposición del material rechazado se plantean en RA-LOG-003."
---

# RF-LOG-003 — Registrar novedades, rechazos y custodia

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, solicita rechazo de materiales dañados, control de custodia, registro de novedades y conservación de evidencias/responsables; §6 contiene las reglas operativas de custodia y trazabilidad.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 49 y 53–55; servicios, DTO, entidades y migraciones de `src/logistica/` y `src/ordenes-servicio/`; UI de registro de eventos.

1. **ID:** `RF-LOG-003`.
2. **Título:** Registrar novedades, rechazos y custodia.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** Registrar incidencias y rechazos durante la operación, identificar materiales afectados y dejar trazabilidad de quién entrega y recibe el material en cada transferencia, con fecha, motivo y evidencia.
6. **Reglas de negocio asociadas:** Se pueden rechazar materiales dañados y debe guardarse el motivo. Un rechazo no autoriza a cambiar cantidades comerciales sin desviación aprobada por Calidad. Se deben diferenciar evidencia de recepción y prueba de entrega final. El empaque inadecuado puede ser motivo de rechazo.
7. **Actores y permisos:** Personal autorizado de Logística registra cambios de estado y eventos bajo los permisos correspondientes. El usuario autenticado del ERP se guarda para cada evento existente; los nombres de entregador/receptor son datos complementarios.
8. **Datos y entidades:** `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`, `RecepcionLogistica`, `RecepcionItem` y la entidad no integrada `Entrega`. Las observaciones se guardan en cabecera o en el JSON del evento; no hay una entidad de novedad operativa.
9. **Precondiciones y postcondiciones:** La orden debe existir y la transición ser válida. Recogida, recepción en planta y entrega registran actor y fecha. Un rechazo debe identificar la línea, motivo y tratamiento posterior; ese flujo por material no existe en el código actual.
10. **Criterios de aceptación:** (a) Rechazar un ítem con motivo obligatorio. (b) Mantener el ítem visible en estado pendiente de devolución, cuarentena u otro destino definido. (c) Registrar novedades a nivel de orden y de material. (d) Adjuntar evidencia al evento. (e) Registrar quien entrega y quien recibe con identidad, fecha y hora. (f) Conservar eventos repetidos cuando hay varias incidencias o entregas fallidas.
11. **Evidencia en backend:** `LogisticaService.updateEstado` crea eventos `RECOGIDA`, `RECEPCION_PLANTA` y `ENTREGA_CLIENTE`, con `usuario_id`, `ocurrido_at`, responsable, campos de entrega/recepción, cantidades y observaciones. No hay evento de novedad o rechazo de línea. `RecepcionService` admite estado `RECHAZADO` para cabecera, pero no identifica materiales ni exige motivo obligatorio.
12. **Evidencia en BD y frontend:** `OrdenServicioEvento` persiste JSON y la migración impone unicidad por `(orden_id, tipo)`, por lo que no admite más de un evento del mismo tipo en una orden. La interfaz ofrece observaciones y nombres de responsables, sin adjuntar fotos/firmas ni mostrar flujo específico para devolución o rechazo de ítem. Los campos JSON `evidencias` de recepción/entrega no forman un flujo de adjuntos integrado; `Entrega` no está conectada a controlador/servicio.
13. **Brechas derivadas:** `B-LOG-014` se asigna a `RF-LOG-013` (rechazo por ítem); `B-LOG-015` a `RF-LOG-014` (entidad de novedades); `B-LOG-016` a `RF-LOG-015` (adjuntos/evidencias); `B-LOG-017` a `RF-LOG-016` (cadena de custodia). La disposición del material rechazado se pregunta en `RA-LOG-003`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿El material rechazado queda para devolución, cuarentena, retiro por cliente u otro destino? ¿Quién decide la disposición y qué evidencia se requiere? Estas políticas se derivan a `RA-LOG-003`.
15. **Estado de cobertura:** Parcial. Existen eventos básicos por orden con usuario autenticado, fecha/hora, nombres de responsables y observaciones. No hay rechazo por ítem, novedades estructuradas, adjuntos operativos ni traspaso bilateral completo de custodia.
16. **Nivel de certeza y límites:** Confirmado en entidades, servicios, DTOs, migraciones y UI inspeccionados. No se encontró un servicio de inventario/devolución asociado a estos rechazos ni se verificó una base desplegada.

**Trazabilidad:** Orden y materiales → evento operativo → responsable/entregador/receptor → observación y evidencia → disposición del rechazo y continuidad de custodia.
