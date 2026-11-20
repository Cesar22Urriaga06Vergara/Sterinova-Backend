---
id: RF-COM-003
titulo: Crear y editar cotizaciones con varios ítems
tipo: RF
modulo: Comercial
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/; src/database/migrations/"
depende_de: [RF-COM-001, RF-COM-002]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto en el núcleo transaccional; descuentos, reemplazo y transición EMITIDA se derivan."
---

# RF-COM-003 — Crear y editar cotizaciones con varios ítems

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §6, «Reglas operativas principales».

**Fuente de contraste:** código activo del módulo `src/cotizaciones/` y migraciones versionadas.

1. **ID:** `RF-COM-003`
2. **Título:** Crear y editar cotizaciones con varios ítems.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir crear cotizaciones en borrador con uno o más ítems, asociarlas a un cliente y editar el borrador con control de versión. Debe calcular subtotal, IVA y total según cantidades y valores unitarios. Una cotización emitida no debe modificarse directamente.
6. **Reglas de negocio asociadas:** El anexo §3 requiere crear y editar cotizaciones, y calcular cantidades, precios y descuentos. §6 prohíbe modificar directamente cotizaciones emitidas y requiere que sus correcciones se tramiten mediante nueva revisión o documento de reemplazo. Esta ficha cierra el núcleo de creación, edición e inmutabilidad; los descuentos y el flujo de reemplazo se derivan a fichas propias.
7. **Actores / roles / ámbitos:** Crear requiere `cotizaciones.crear`; editar requiere `cotizaciones.editar`. El acceso está limitado por autorización y ámbito. La aprobación y emisión usan permisos separados.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: cliente, creador, ámbito, consecutivo único, tipo de servicio, estado, versión, importes, tasa/versión IVA, condiciones y datos de emisión/snapshot. `CotizacionItem` / `cotizacion_items`: cabecera asociada, producto opcional, datos descriptivos, cantidad, valor unitario y total. Relación 1:N, declarada con cascada ORM.
9. **Precondiciones / postcondiciones:** Crear requiere cliente consultable, tipo de servicio válido y al menos un ítem válido. La cotización queda en `BORRADOR`, con ámbito/creador, consecutivo e IVA resueltos. Editar requiere que exista y sea visible, permanezca en `BORRADOR`, no tenga `fecha_emision` y la versión enviada coincida. Los ítems deben tener cantidad mayor que cero y no exceder la precisión configurada. Fallos de validación de cliente o ítem no dejan persistencia parcial.
10. **Criterios de aceptación:**
    - Dado un cliente autorizado y varios ítems válidos, cuando se crea una cotización, entonces se persisten en borrador la cabecera, todos los ítems, consecutivo e importes calculados.
    - Dado un ítem inválido en una cotización nueva, cuando falla la validación, entonces la transacción revierte y no queda cotización ni subconjunto de ítems persistido.
    - Dado un borrador con versión vigente, cuando se edita con esa versión y datos válidos, entonces los cambios de cabecera e ítems se guardan atómicamente; una versión obsoleta se rechaza.
    - Dado una cotización emitida o con estado distinto de borrador, cuando se intenta editarla, entonces el backend rechaza el cambio y conserva los datos emitidos.
11. **Evidencia en el backend:** `src/cotizaciones/cotizaciones.controller.ts` declara `POST /cotizaciones` y `PUT /cotizaciones/:id`; `src/cotizaciones/cotizaciones.service.ts` realiza alta y edición en transacciones. En creación, la consulta de cliente ocurre antes de la transacción y no persiste cotización; resolución fiscal, validación/construcción de ítems, consecutivo y guardado ocurren dentro de ella. En edición, cliente se valida antes de escribir, se construyen todos los ítems antes de borrar/recrear el detalle y la operación está transaccionada. La edición bloquea si existe `fecha_emision` o el estado no es `BORRADOR`. `src/cotizaciones/cotizacion-item-builder.ts` valida cantidad y precisión. `src/cotizaciones/dto/create-cotizacion.dto.ts`, `update-cotizacion.dto.ts` y `create-cotizacion-item.dto.ts` establecen DTOs. `src/cotizaciones/entities/estado-cotizacion.enum.ts` declara los estados. El método de emisión persiste `fecha_emision` y snapshot, pero no asigna explícitamente `EMITIDA`; esto queda en `RA-COM-004`. Descuentos quedan en `RF-COM-010` y reemplazos en `RA-COM-003`.
12. **Evidencia en BD:** `src/database/migrations/1730750400000-InitialSchema.ts` crea `cotizaciones` y `cotizacion_items`, con FK de ítem a cotización y `ON DELETE CASCADE`; la columna inicial `estado` es `VARCHAR(255)`. `1794225601000-AddQuoteEditVersion.ts` agrega `version`. `1794225600000-AddVersionedIva.ts` agrega snapshot de tasa/versión fiscal a la cabecera. `1794800000000-AddQuoteItemCatalogSnapshots.ts` agrega referencia opcional de producto y campos snapshot. No se verificó una instancia desplegada.
13. **Brechas detectadas:** No quedan brechas propias abiertas. `B-003-01` se descarta: el backend sí bloquea edición directa mediante estado y `fecha_emision`. `B-003-02` (flujo de reemplazo) se deriva a `RA-COM-003`; `B-003-03` (descuentos por ítem) a `RF-COM-010`; `B-003-04` (transición formal a `EMITIDA`) a `RA-COM-004`.
14. **Preguntas abiertas:** Las preguntas sobre vinculación de reemplazos y transición a `EMITIDA` se derivan a `RA-COM-003` y `RA-COM-004`. Las reglas de descuentos se analizarán en `RF-COM-010`; no bloquean el cierre del núcleo de esta ficha.
15. **Estado de cobertura:** Cubierto para el núcleo transaccional: creación/edición de cotizaciones con varios ítems, control de versión, validación de cantidades, atomicidad y bloqueo de edición tras emisión.
16. **Nivel de certeza:** Confirmado en código y migraciones versionadas; estado de una base desplegada no verificable sin ejecución.

**Trazabilidad:** cliente → cotización y sus ítems → orden → recepción → ciclo → calidad → certificado → entrega → auditoría. Esta ficha verifica cabecera/detalle de cotización y protección de emisión; los enlaces posteriores se cubren en requisitos de sus módulos.
