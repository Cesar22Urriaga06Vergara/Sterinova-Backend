---
id: RF-LOG-022
titulo: Emisión idempotente y conservación de PDFs logísticos
tipo: RF / Logística / Documentos
modulo: Logística / Documentos
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §7 Documentos generados; §6 Reglas operativas"
fuente_contraste: "src/logistica/logistica.controller.ts; src/logistica/logistica.service.ts; src/logistica/entities/documento-emitido.entity.ts; src/common/services/storage.service.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx"
depende_de: [RF-LOG-005, RF-LOG-007]
bloquea: []
brechas: [B-LOG-024]
historial:
  - version: 0.1
    nota: "Borrador derivado del contraste de §7; la ruta actual genera el documento al descargar y no resuelve explícitamente la recuperación idempotente del artefacto emitido."
---

# RF-LOG-022 — Emisión idempotente y conservación de PDFs logísticos

**Estado:** Borrador técnico; pendiente de validación.

1. **ID:** `RF-LOG-022`.
2. **Título:** Emisión idempotente y conservación de PDFs logísticos.
3. **Tipo:** RF / Logística / Documentos.
4. **Módulo:** Logística / Documentos.
5. **Descripción funcional:** Conservar las órdenes de servicio y actas emitidas como documentos históricos recuperables, cuyo PDF, snapshot, hash y versión de formato correspondan a la misma emisión. Repetir una descarga no debe crear una segunda emisión ni regenerar silenciosamente el documento desde datos actuales.
6. **Reglas asociadas:** La lectura de un documento emitido debe recuperar el artefacto persistido. Una corrección debe seguir un flujo explícito y mantener el original; toda regeneración técnica debe preservar el snapshot de la emisión y dejar evidencia auditable.
7. **Actores / permisos:** Usuarios de Logística autorizados mediante `logistica.ordenes.ver` y el ámbito del registro asociado.
8. **Datos y entidades:** `DocumentoEmitido` almacena tipo, consecutivo, versión de formato, `snapshot_json`, clave PDF, hash, fecha, usuario, estado y orden asociada. La relación con la orden debe seguir autorizada por ámbito.
9. **Flujo preliminar:** Solicitar el documento → verificar permiso y ámbito → si existe emisión, recuperar su snapshot/PDF/hash → si se trata de la primera emisión, generar, almacenar y registrar el documento de forma coherente → devolverlo. Reintentos y concurrencia deben producir un resultado idempotente.
10. **Criterios de aceptación preliminares:** (a) Descargar varias veces una emisión devuelve los mismos bytes y hash. (b) La segunda lectura no vuelve a renderizar ni intenta insertar otra fila. (c) Un cambio posterior de la orden no modifica el documento histórico. (d) Emisiones concurrentes no dejan PDF, hash y fila con versiones distintas. (e) Una corrección autorizada crea una versión/documento nuevo y conserva el anterior.
11. **Fuentes y evidencia actual:** §7 lista órdenes de servicio y actas; §6 requiere conservar documentos emitidos. `GET /logistica/ordenes/:id/pdf` crea el snapshot actual, renderiza y guarda bajo una clave estable antes de insertar `DocumentoEmitido`; el servicio impone unicidad por tipo/consecutivo y rechaza duplicados. La ruta de descarga posterior recibe un entero, busca tipo `ORDEN` por `consecutivo=String(id)`, mientras que las órdenes usan `OS-AAAA-NNNN`; tampoco propaga el ámbito al lookup (`B-SEG-001`). Al emitir `ACTA_SERVICIO`, el snapshot usa `acta_consecutivo`, pero la fila `DocumentoEmitido` recibe `orden.consecutivo`. El frontend llama al endpoint de generación al previsualizar o descargar.
12. **Persistencia e interfaz:** La entidad guarda snapshot y hash; la ruta actual no consulta primero ese registro para servirlo y crea el documento desde el GET. `LocalStorageService.saveFile` escribe un temporal y luego renombra a la clave final; el comportamiento de sustitución depende del proveedor/plataforma y no fue probado. No se verificó una base desplegada.
13. **Brecha asociada:** `B-LOG-024` registra el conflicto entre regeneración/almacenamiento por clave estable, unicidad del registro y recuperación del documento emitido.
14. **Preguntas abiertas:** Definir si la primera emisión debe ser comando separado de la descarga; tratamiento de regeneraciones/correcciones, diferencias entre consecutivo de orden y acta, contrato de lectura por ID o consecutivo, propagación del ámbito y política de versiones/conservación. No se presume que todas las lecturas puedan emitir.
15. **Cobertura preliminar:** Parcial. Existe generación de PDF, snapshot, hash y persistencia documental; la recuperación idempotente, la correspondencia de identificadores y la conservación bajo reintento requieren resolución.
16. **Certeza y límites:** Confirmado mediante controlador, servicio, entidad, almacenamiento local y llamadas del frontend. El posible reemplazo de bytes bajo la misma clave no se comprobó en runtime ni en otros proveedores de almacenamiento; se documenta como riesgo técnico condicionado, no como daño demostrado.
