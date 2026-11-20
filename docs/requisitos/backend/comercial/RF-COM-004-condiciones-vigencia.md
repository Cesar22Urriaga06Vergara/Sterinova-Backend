---
id: RF-COM-004
titulo: Gestionar condiciones, precios y vigencia
tipo: RF
modulo: Comercial
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §2, §3"
fuente_contraste: "src/cotizaciones/; src/productos/; docs/negocio/reglas-maestras.md"
depende_de: [RF-COM-003]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; vigencia temporal y precios especiales por cliente se derivan a RF-COM-011 y RA-COM-005."
---

# RF-COM-004 — Gestionar condiciones, precios y vigencia

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §2, «Cotizaciones».

**Fuente de contraste:** documentación activa y código del backend en `src/cotizaciones/` y `src/productos/`.

1. **ID:** `RF-COM-004`
2. **Título:** Gestionar condiciones, precios y vigencia.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar en la cotización transporte, forma de pago, validez de oferta y demás condiciones comerciales; capturar precios por ítem y exigir que las condiciones estén completas antes de aprobar. El cálculo de descuentos está excluido y se analiza en `RF-COM-010`.
6. **Reglas de negocio asociadas:** El anexo §3 solicita registrar transporte y condiciones de pago, configurar vigencia y definir precios. La documentación backend de contraste requiere completar seis campos y menciona que los precios pueden variar por cliente. La fecha inicial de vigencia queda pendiente de conciliar entre el envío de la propuesta y la emisión operativa.
7. **Actores / roles / ámbitos:** El asesor captura o edita la cotización con `cotizaciones.crear` o `cotizaciones.editar`; la aprobación interna usa `cotizaciones.aprobar_interna`. El ámbito de acceso es el de la cotización. No se presume un catálogo de precios por cliente.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `tiempo_despacho`, `transporte`, `forma_pago`, `validez_oferta`, `precio_incluye`, `precio_no_incluye`, `condiciones_comerciales`, todos texto nullable; relación con `Cliente`; `fecha_emision` no es fecha de expiración. `CotizacionItem` / `cotizacion_items`: `valor_unitario` y `valor_total` por ítem. No se observó `vigente_hasta` ni entidad de precios especiales por cliente.
9. **Precondiciones / postcondiciones:** En creación y edición los campos comerciales son strings opcionales en DTO. Para aprobar, el servicio requiere que los seis campos estén completos. El precio unitario se conserva por ítem en una cotización asociada a cliente. El backend no calcula fecha de expiración ni bloquea aprobación/emisión por vencimiento; el control se deriva a `RF-COM-011`.
10. **Criterios de aceptación:**
    - Dado un borrador, cuando se intenta aprobar con alguno de los seis campos comerciales vacío, entonces el servicio rechaza la aprobación.
    - Dado una cotización con valores unitarios por ítem, cuando se guarda, entonces los valores quedan asociados a los ítems y a la cotización de su cliente.
    - Dado una oferta vencida, cuando se intenta aprobar o emitir, entonces el sistema debe bloquear la operación. Este control no está cubierto por el código inspeccionado y se especifica en `RF-COM-011`.
    - Dado que se emite una cotización, cuando se consulta su documento e información guardada, entonces sus condiciones y precios deben conservarse como parte de los datos emitidos.
11. **Evidencia en el backend:** `src/cotizaciones/entities/cotizacion.entity.ts` modela los campos de condiciones como texto. `src/cotizaciones/dto/create-cotizacion.dto.ts` y `update-cotizacion.dto.ts` los aceptan como strings opcionales. `src/cotizaciones/cotizaciones.service.ts` persiste los valores; `assertCommercialConditions` verifica que los seis tengan contenido al aprobar, pero no interpreta fechas ni compara expiración al aprobar o emitir. `src/cotizaciones/dto/create-cotizacion-item.dto.ts` recibe `valor_unitario`; `src/cotizaciones/entities/cotizacion-item.entity.ts` lo conserva por ítem. `src/productos/entities/producto.entity.ts` no contiene precio.
12. **Evidencia en BD:** `src/database/migrations/1794500000000-AddQuoteCommercialConditions.ts` agrega los seis campos como `TEXT NULL`. `src/database/migrations/1730750400000-InitialSchema.ts` crea valores de cantidad, unitario y total por ítem. No se encontró migración para fecha de expiración ni para precios maestros por cliente. Una instancia desplegada no se verificó.
13. **Brechas detectadas:** No quedan brechas propias abiertas en esta ficha. `B-004-01` se deriva a `RF-COM-011` para fecha estructurada y bloqueo por expiración. `B-004-02` se deriva a `RA-COM-005` para decidir si se requieren precios especiales reutilizables por cliente. Los seis campos comerciales sí se validan como completos al aprobar.
14. **Preguntas abiertas:** La pregunta sobre control temporal se deriva a `RF-COM-011`; la pregunta sobre reutilizar precios especiales o condiciones por cliente se deriva a `RA-COM-005`. Las derivaciones no bloquean el cierre de esta ficha como `Parcial`.
15. **Estado de cobertura:** Parcial. Los campos y precios por ítem se capturan, y las seis condiciones se exigen antes de aprobar; no existe cálculo/validación temporal de expiración. La necesidad de precios maestros por cliente queda pendiente de decisión.
16. **Nivel de certeza:** Confirmado en código para almacenamiento, captura y validación de presencia de condiciones; confirmado que no se observó fecha de expiración ni bloqueo temporal en los métodos revisados. Instancia de BD no verificada.

**Trazabilidad:** cliente → cotización con condiciones y precios por ítem → emisión y snapshot → orden y operación posterior. La expiración se desarrolla en `RF-COM-011`.
