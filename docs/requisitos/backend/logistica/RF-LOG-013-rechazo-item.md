---
id: RF-LOG-013
titulo: Rechazar material por ítem y registrar su disposición
tipo: RF
modulo: Logística / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49 y 53; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-item.entity.ts"
depende_de: [RF-LOG-002, RF-LOG-003]
bloquea: []
brechas: [B-LOG-014]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-014; el flujo de disposición se plantea también a decisión en RA-LOG-003."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-013 — Rechazar material por ítem y registrar su disposición

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-013`.
2. **Título:** Rechazar material por ítem y registrar su disposición.
3. **Tipo:** RF.
4. **Módulo:** Logística / Calidad.
5. **Descripción funcional:** El sistema debe permitir rechazar una o varias líneas específicas de una recepción, exigir motivo y responsable, conservar cantidad y evidencia, y mantener el material identificado hasta registrar su disposición (devolución, cuarentena, retiro u otra opción aprobada). El rechazo no debe borrar ni alterar la orden/cotización original.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Rechazo por línea vs. recepción completa, cantidad rechazada, motivo obligatorio, evidencia, autorización de Calidad, manejo de material parcialmente aceptado, devolución/recogida, saldo que puede procesar Planta, auditoría y notificación.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Calidad; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Registrar el material/lote/empaque y cantidad afectados.<br>- Exigir motivo y usuario que reporta.<br>- Preservar la historia de la recepción original.<br>- Excluir la cantidad rechazada del saldo disponible para Planta.<br>- Permitir cerrar el rechazo solo al registrar la disposición aprobada.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49 y 53; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-item.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide rechazar materiales dañados.
- Las respuestas 49 y 53 permiten rechazo por daño o empaque inadecuado, con motivo y sin alterar cantidad contratada sin desviación de Calidad.
- `RecepcionLogistica` solo guarda estado de cabecera `RECHAZADO`; `RecepcionItem` no tiene estado y no está conectado al servicio.
- No se encontró servicio logístico de devolución o inventario para material rechazado.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-014]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Rechazo por línea vs. recepción completa, cantidad rechazada, motivo obligatorio, evidencia, autorización de Calidad, manejo de material parcialmente aceptado, devolución/recogida, saldo que puede procesar Planta, auditoría y notificación.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




