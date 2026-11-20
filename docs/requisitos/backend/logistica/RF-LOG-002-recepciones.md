---
id: RF-LOG-002
titulo: Registrar recepciones completas y parciales
tipo: RF
modulo: Logística / Recepción
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48–51; src/logistica/; src/ordenes-servicio/; SterinovaFrontend/src/app/(erp)/logistica/"
depende_de: [RN-LOG-002, RF-LOG-001]
bloquea: [RF-LOG-003, RF-LOG-010, RF-LOG-011, RF-LOG-012]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-007, B-LOG-008 y B-LOG-011 se derivaron a RF-LOG-010; B-LOG-009 a RF-LOG-011; B-LOG-010 a RF-LOG-012. RA-LOG-002 recoge preguntas de evidencia y notificación."
---

# RF-LOG-002 — Registrar recepciones completas y parciales

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, pide recibir materiales y registrar producto, lote, empaque, cantidad y recepciones parciales; §6 exige conservar los saldos pendientes.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 48–51; entidades, servicio, DTO y migración de `src/logistica/`; edición y eventos de recepción en `SterinovaFrontend/src/app/(erp)/logistica/`.

1. **ID:** `RF-LOG-002`.
2. **Título:** Registrar recepciones completas y parciales.
3. **Tipo:** RF.
4. **Módulo:** Logística / Recepción.
5. **Descripción funcional:** Registrar por orden la recepción física y sus cantidades por material, conservar diferencias frente a lo ordenado y permitir recepciones parciales con saldo pendiente trazable.
6. **Reglas de negocio asociadas:** La respuesta 48 pide remisión/factura, fecha y hora real, usuario receptor, sede de origen y evidencia. La respuesta 49 requiere marcar recepción parcial cuando llega menos, notificar a Comercial y registrar motivo si se rechaza material dañado. La respuesta 50 define fila por producto+lote+empaque y unidades/precisiones según servicio. Una diferencia no autoriza reescribir silenciosamente lo cotizado.
7. **Actores y permisos:** Personal autorizado de Logística registra recepción y resolución de diferencias; el usuario autenticado y la fecha deben quedar asociados al acto.
8. **Datos y entidades:** `RecepcionLogistica`, `RecepcionItem`, `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`; cabecera documental, materiales por línea, cantidades físicas, lote, referencia, unidad, sede, remitente y evidencia.
9. **Precondiciones y postcondiciones:** La orden existe y está accesible. Las líneas recibidas pertenecen a sus materiales; las cantidades acumuladas se comparan con las ordenadas y dejan saldo pendiente. Si hay recepción parcial o rechazo, el estado y la diferencia quedan registrados sin alterar el documento comercial.
10. **Criterios de aceptación:** (a) Guardar cabecera y detalle por material. (b) Acumular recepciones parciales y calcular saldo. (c) Rechazar cantidades acumuladas superiores a lo ordenado. (d) Identificar producto, lote, empaque y unidad con precisión adecuada. (e) Registrar la remisión y evidencia requeridas. (f) Registrar rechazo y motivo, y notificar a Comercial según la decisión de negocio.
11. **Evidencia en backend:** `POST /logistica/ordenes/:id/recepcion` crea solo `RecepcionLogistica`; `RecepcionService` no inserta `RecepcionItem`. El evento `EN_PLANTA` sí recibe cantidades por material en JSON, pero no las asocia a una recepción acumulable. La entidad de ítem no es utilizada por servicios inspeccionados.
12. **Evidencia en BD y frontend:** `RecepcionLogistica` tiene índice único por orden; la migración `1795500000000-RecepcionLogistica.ts` crea solo la cabecera. No se encontró migración para `recepcion_items`. El formulario frontend edita las filas de `OrdenServicioMaterial` y registra un evento de llegada, no una cabecera/detalle de recepción mediante el endpoint dedicado.
13. **Brechas derivadas:** `B-LOG-007`, `B-LOG-008` y `B-LOG-011` se reasignaron a `RF-LOG-010` (persistencia de ítems, saldo y remisión); `B-LOG-009` a `RF-LOG-011` (lote/empaque y trazabilidad); `B-LOG-010` a `RF-LOG-012` (cantidades recibidas como límite de Planta). Las decisiones de evidencia y notificación se plantean en `RA-LOG-002`. La ficha validada queda con `brechas: []` por derivación acordada.
14. **Preguntas abiertas:** ¿Qué tipos de evidencia se aceptan para recepciones parciales y completas? ¿Qué evento dispara la notificación a Comercial y quién la recibe? ¿La fecha de vencimiento aplica a todos los materiales o solo a categorías definidas?
15. **Estado de cobertura:** Parcial. Existe una cabecera de recepción y eventos con datos operativos, pero no hay persistencia activa de líneas recibidas ni saldo parcial acumulado.
16. **Nivel de certeza y límites:** Confirmado en los servicios, entidades, DTO, migración y UI revisados. No se verificó una base desplegada. La obligación y alcance de vencimiento requieren definición del negocio por tipo de material.

**Trazabilidad:** Orden → cabecera y líneas de recepción → cantidades recibidas y saldo pendiente → registro de rechazo/notificación → cantidades disponibles para Planta.
