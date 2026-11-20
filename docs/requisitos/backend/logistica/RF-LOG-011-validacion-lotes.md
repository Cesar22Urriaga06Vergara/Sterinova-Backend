---
id: RF-LOG-011
titulo: Validaciones de trazabilidad en recepción (Lote/Empaque)
tipo: RF
modulo: Logística / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 50–53; src/logistica/entities/recepcion-item.entity.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts"
depende_de: [RF-LOG-002]
bloquea: []
brechas: [B-LOG-009]
historial:
  - version: 0.1
    nota: "Borrador para definir validaciones de lote, empaque, unidades y aplicabilidad de vencimiento en la trazabilidad de recepción."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-011 — Validaciones de trazabilidad en recepción (Lote/Empaque)

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-011`.
2. **Título:** Validaciones de trazabilidad en recepción (Lote/Empaque).
3. **Tipo:** RF.
4. **Módulo:** Logística / Calidad.
5. **Descripción funcional:** El sistema debe conservar la identidad trazable de cada línea recibida por producto/material, lote, empaque y unidad, con cantidad y precisión compatibles con el servicio. Debe aplicar reglas de obligatoriedad por tipo de material y conservar fecha de vencimiento cuando corresponda, una vez definida su aplicabilidad.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Clases de producto que requieren lote, productos sin lote de fabricante, dispositivos médicos, vencimiento y material sin vencimiento, códigos de barras/UDI si aplican, empaque original vs. reempaque, validación de sellado, precisión por unidad, lectura y conservación hasta certificados.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Calidad; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Una recepción diferenciada por lote/empaque crea líneas separadas.<br>- Validar lote y empaque según política configurada para el tipo de material.<br>- No tratar la ausencia de vencimiento como error universal hasta que el negocio defina aplicabilidad.<br>- Admitir las precisiones autorizadas por unidad sin redondeo inapropiado.<br>- Conservar los datos de trazabilidad desde recepción hasta procesamiento y certificado.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 50–53; src/logistica/entities/recepcion-item.entity.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts. Evidencia técnica leída: - El anexo §3 pide registro de producto, lote, empaque y cantidad.
- Respuesta 50 define una fila por combinación producto+lote+empaque y permite valores decimales según servicio/unidad.
- Respuesta 53 requiere inspeccionar integridad, tipo de empaque y sellado.
- `RecepcionItem.lote` es nullable, no tiene campo de empaque ni vencimiento; su cantidad tiene escala 2.
- `OrdenServicioMaterial` sí tiene lote y empaque opcionales, pero representa la línea de orden y no constituye la línea de recepción física.
- El evento de recepción existente usa cantidades enteras en su DTO.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-009]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Clases de producto que requieren lote, productos sin lote de fabricante, dispositivos médicos, vencimiento y material sin vencimiento, códigos de barras/UDI si aplican, empaque original vs. reempaque, validación de sellado, precisión por unidad, lectura y conservación hasta certificados.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




