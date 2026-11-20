---
id: RF-LOG-017
titulo: Confirmación de recepción por usuario autenticado de Planta
tipo: RF
modulo: Logística / Planta / Seguridad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "src/logistica/logistica.controller.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts; src/planta/planta.controller.ts; src/users/"
depende_de: [RF-LOG-004]
bloquea: []
brechas: [B-LOG-018]
historial:
  - version: 0.1
    nota: "Borrador derivado de que el receptor en Planta se persiste como texto y no se valida como usuario autenticado de ese ámbito."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-017 — Confirmación de recepción por usuario autenticado de Planta

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-017`.
2. **Título:** Confirmación de recepción por usuario autenticado de Planta.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta / Seguridad.
5. **Descripción funcional:** La recepción de materiales en Planta debe ser confirmada por un usuario autenticado autorizado para recibir en Planta. El evento debe conservar su identificador de usuario como receptor y distinguirlo del usuario de Logística que entrega o registra el despacho.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Permisos y roles que pueden confirmar, acto de oferta/aceptación, recepción delegada, identidad temporal o externa, cantidades recibidas, diferencias, firma, fecha/hora efectiva y operación concurrente.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta / Seguridad; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Rechazar una recepción confirmada por usuario sin permiso de Planta.<br>- Guardar el ID autenticado del receptor en una relación de usuario, además del actor Logística.<br>- No aceptar cantidades sin asociarlas a la orden/material correspondiente.<br>- Auditar fecha, actor, cambios y resultado de la aceptación.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: src/logistica/logistica.controller.ts; src/logistica/logistica.service.ts; src/logistica/dto/evento-orden.dto.ts; src/planta/planta.controller.ts; src/users/. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere registrar responsables en transferencias.
- `LogisticaService.updateEstado` cambia la orden con permiso `logistica.ordenes.cambiar_estado`; el `usuario_id` guardado es quien invoca el endpoint.
- El campo `recibido_por` del evento es texto libre. No tiene relación con `User` ni valida permiso `planta.*`.
- `PlantaController` protege consulta y ciclos con permisos de Planta, pero no expone aceptación de transferencia.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-018]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Permisos y roles que pueden confirmar, acto de oferta/aceptación, recepción delegada, identidad temporal o externa, cantidades recibidas, diferencias, firma, fecha/hora efectiva y operación concurrente.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




