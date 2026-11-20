---
id: RF-LOG-018
titulo: Acta de transferencia y cantidades físicas de traspaso
tipo: RF
modulo: Logística / Planta / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/documento-emitido.entity.ts"
depende_de: [RF-LOG-003, RF-LOG-004, RF-LOG-017]
bloquea: []
brechas: [B-LOG-019]
historial:
  - version: 0.1
    nota: "Borrador para generar acta/evidencia bilateral con detalle físico y confirmaciones de origen y destino."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-018 — Acta de transferencia y cantidades físicas de traspaso

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-018`.
2. **Título:** Acta de transferencia y cantidades físicas de traspaso.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta / Documentos.
5. **Descripción funcional:** El sistema debe documentar la transferencia Logística→Planta mediante un acta asociada a la orden y a sus líneas de material. Debe comparar cantidades entregadas y recibidas, registrar diferencias, responsables de ambas partes, momento del traspaso y evidencia/aceptación, conservando el original del acta.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Campos del documento, numeración/versionado, cantidades enviadas/recibidas/rechazadas, firmas o evidencia, diferencia parcial, impresión/PDF, conservación, correcciones, duplicidad de traspasos y relación con movimiento de inventario.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta / Documentos; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Asociar acta con orden y detalle exacto de materiales y cantidades.<br>- Capturar confirmación de origen y destino y su fecha/hora.<br>- Registrar diferencia física sin modificar la orden/cotización original.<br>- Conservar evidencia y versión emitida del acta.<br>- Permitir consulta posterior por orden y por material.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/documento-emitido.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere transferencias, responsables y evidencias.
- La respuesta 48 del Módulo 4 exige orden, remisión/factura, fecha/hora, receptor y evidencia; respuesta 54 distingue POD de recepción.
- El evento `RECEPCION_PLANTA` guarda cantidades en JSON y texto de receptor, pero no genera un acta específica ni adjuntos.
- El dominio tiene versiones/documentos emitidos para orden/acta, pero el acto de transferencia no cuenta con modelo de detalle/aceptación independiente.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-019]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Campos del documento, numeración/versionado, cantidades enviadas/recibidas/rechazadas, firmas o evidencia, diferencia parcial, impresión/PDF, conservación, correcciones, duplicidad de traspasos y relación con movimiento de inventario.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




