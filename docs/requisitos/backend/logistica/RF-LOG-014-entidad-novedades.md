---
id: RF-LOG-014
titulo: Entidad y flujo de novedades logísticas
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts"
depende_de: [RF-LOG-003]
bloquea: []
brechas: [B-LOG-015]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-015; separar novedades operativas del texto libre de observaciones."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-014 — Entidad y flujo de novedades logísticas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-014`.
2. **Título:** Entidad y flujo de novedades logísticas.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe permitir registrar novedades logísticas estructuradas asociadas a una orden y, cuando aplique, a un material/lote. Cada novedad debe conservar tipo, descripción, fecha/hora, usuario responsable, estado/resolución y evidencias. Se debe admitir más de una novedad del mismo tipo o varias entregas fallidas para una orden.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Catálogo de tipos/prioridades, nivel orden vs. ítem, ciclo de resolución, responsables, relación con rechazo/desviación de Calidad, repetición y correlación de eventos, notificaciones, adjuntos, consultas/reportes y migración de observaciones históricas.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Registrar novedades distintas sin sobrescribir texto anterior.<br>- Asociar novedad a orden y opcionalmente a línea/lote.<br>- Registrar autor, responsable, tiempo, estado y resolución.<br>- Permitir varios reportes del mismo tipo y conservar historial.<br>- Relacionar evidencia y notificaciones con la novedad correspondiente.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide registro de novedades.
- `OrdenServicioEvento` tiene tipos fijos de recogida, recepción, procesamiento y entrega, con observaciones de texto en JSON.
- La migración crea índice único `(orden_id, tipo)`, que impide repetir un tipo de evento en una orden.
- `RecepcionItem` tiene observaciones por línea, pero no se integra en el flujo de recepción.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-015]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Catálogo de tipos/prioridades, nivel orden vs. ítem, ciclo de resolución, responsables, relación con rechazo/desviación de Calidad, repetición y correlación de eventos, notificaciones, adjuntos, consultas/reportes y migración de observaciones históricas.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




