---
id: RF-COM-002
titulo: Gestionar productos y servicios
tipo: RF
modulo: Comercial
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §8; §1 para dispositivos médicos"
fuente_contraste: "src/productos/; src/cotizaciones/; src/tasas-fiscales/; docs/negocio/reglas-maestras.md"
depende_de: []
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto; categorización de dispositivos y fiscalidad por producto se derivan a RA-COM-002 y RA-FIS-001."
---

# RF-COM-002 — Gestionar productos y servicios

**Fuente principal:** `Sterinova-ERP.md` §3, «Comercial»; §8, «Estado del proyecto». §1 menciona la comercialización de dispositivos médicos.

**Fuente de contraste:** `src/productos/`, `src/cotizaciones/`, `src/tasas-fiscales/` y documentación activa del backend.

1. **ID:** `RF-COM-002`
2. **Título:** Gestionar productos y servicios.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Catálogo de productos y servicios.
5. **Descripción funcional:** El sistema debe permitir administrar productos y servicios en un catálogo común, distinguir su tipo, consultarlos para cotizaciones y añadir ítems manuales que no estén en el catálogo. Debe permitir desactivar una referencia sin borrar su registro y conservar los datos de ítems asociados a cotizaciones existentes.
6. **Reglas de negocio asociadas:** El anexo §3 requiere catálogo de productos y servicios y adición de ítems manuales. §8 confirma módulos de Productos y Tasas fiscales y marca como pendiente la integración fiscal real. §1 incluye comercialización de dispositivos médicos, sin definir categorías o atributos regulatorios. Las reglas maestras backend sirven como contraste y no sustituyen la fuente contractual.
7. **Actores / roles / ámbitos:** Administración del catálogo: permiso `productos.gestionar` con ámbito autorizado. Búsqueda para nuevas cotizaciones: `cotizaciones.crear`; búsqueda al editar: `cotizaciones.editar`. Consulta y publicación de tasas: `tasas_fiscales.gestionar` con ámbito global.
8. **Datos y entidades implicadas:** `Producto` / tabla `productos`: `id`, `scope_id`, `tipo_servicio`, `tipo_item` (`PRODUCTO` / `SERVICIO`), `categoria`, `codigo`, `referencia`, `metodo`, `presentacion`, `marca`, `descripcion`, `unidad`, `precision_cantidad`, `activo`, `created_at`, `updated_at`. Categorías: `EMPAQUES`, `MONITOREO`, `EQUIPOS`, `GENERAL`; su uso está condicionado a `INSUMOS`. `CotizacionItem` / `cotizacion_items` conserva `producto_id` nullable o un ítem manual, sus datos descriptivos, cantidades y valores. `TasaFiscal` / `tasas_fiscales` guarda impuesto, versión, tasa, vigencia, creador y motivo. `Cotizacion` conserva `iva_version_id` e `iva_tasa`; el vínculo fiscal es de cabecera, no de producto.
9. **Precondiciones / postcondiciones:** Para administrar el catálogo se requiere permiso y ámbito; las altas quedan activas y vinculadas a un ámbito. Para seleccionar una referencia en cotización debe estar activa y coincidir con el ámbito y servicio. Un ítem manual se guarda sin `producto_id`, con datos descriptivos, unidad, precisión, cantidad y valor unitario. Desactivar impide seleccionarlo en nuevas búsquedas; los ítems existentes conservan su snapshot. Al crear cotización se resuelve la tasa IVA vigente y se guarda la tasa y versión.
10. **Criterios de aceptación:**
    - Dado un usuario autorizado y datos válidos, cuando crea un producto o servicio, entonces queda registrado y aparece en las búsquedas de cotización mientras esté activo.
    - Dado un concepto ausente del catálogo, cuando se agrega manualmente a una cotización, entonces se guarda sin `producto_id` con sus datos, cantidad y precio.
    - Dado un producto asociado a una cotización existente, cuando se desactiva, entonces no aparece en búsquedas para nuevas cotizaciones y los datos del ítem existente continúan disponibles.
    - Dado que existe IVA vigente, cuando se crea la cotización, entonces se persisten en ella la tasa y versión utilizadas. Este criterio describe el snapshot actual a nivel de cotización, no una clasificación fiscal por producto.
11. **Evidencia en el backend:** `src/productos/entities/producto.entity.ts` define la entidad común y enums; `src/productos/productos.controller.ts` declara listar, buscar para crear/editar, crear, actualizar y cambiar estado; `src/productos/productos.service.ts` filtra las búsquedas por ámbito, tipo de servicio y `activo: true`, y desactiva mediante cambio de estado; DTOs en `src/productos/dto/`. `src/cotizaciones/cotizacion-item-builder.ts` valida referencias activas y ámbito/servicio, permite ítems manuales y crea el snapshot. `src/cotizaciones/entities/cotizacion-item.entity.ts` conserva los datos de línea. `src/tasas-fiscales/tasas-fiscales.controller.ts` y `tasas-fiscales.service.ts` exponen historial/publicación y resolución de IVA vigente; `src/cotizaciones/cotizaciones.service.ts` guarda tasa y versión en creación.
12. **Evidencia en BD:** `src/database/migrations/1794700000000-AddProductCatalog.ts` crea `productos`, campo `activo`, índices y FK del ámbito; no declara ruta de borrado de catálogo. `1794800000000-AddQuoteItemCatalogSnapshots.ts` agrega `producto_id` nullable y campos de snapshot a `cotizacion_items`, con FK `ON DELETE RESTRICT`. `1794225600000-AddVersionedIva.ts` crea tasas inmutables y su relación con `cotizaciones`; incluye unicidad de versión/vigencia, control de rango y triggers contra update/delete. Aplicación en una instancia concreta no verificada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha. `B-002-01` se deriva a `RA-COM-002` para decidir categorización de dispositivos médicos. `B-002-02` se deriva a `RA-FIS-001` para definir el alcance de la fiscalidad futura por producto/servicio. Ambas permanecen abiertas.
14. **Preguntas abiertas:** Las preguntas sobre categoría o atributos regulatorios de dispositivos médicos y sobre la asignación fiscal se derivan, respectivamente, a `RA-COM-002` y `RA-FIS-001`. No bloquean el flujo operativo actual ni el cierre de esta ficha.
15. **Estado de cobertura:** Cubierto para el alcance definido: catálogo común, distinción producto/servicio, uso en cotización, ítems manuales e inactivación con conservación histórica.
16. **Nivel de certeza:** Confirmado en código y migraciones versionadas para el comportamiento descrito; estado de una base desplegada no verificable sin ejecución.

**Trazabilidad:** catálogo o ítem manual → detalle de cotización con snapshot → cotización con IVA/versionado. Las etapas operativas posteriores se evalúan en sus requisitos respectivos.
