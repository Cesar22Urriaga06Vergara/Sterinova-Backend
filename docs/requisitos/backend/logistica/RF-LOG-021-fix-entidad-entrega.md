---
id: RF-LOG-021
titulo: Integración o depuración técnica de la entidad Entrega
tipo: RF
modulo: Logística / Persistencia
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "src/logistica/entities/entrega.entity.ts; src/logistica/logistica.service.ts; src/logistica/logistica.controller.ts; src/database/migrations/"
depende_de: [RF-LOG-005, RF-LOG-019]
bloquea: []
brechas: [B-LOG-023]
historial:
  - version: 0.1
    nota: "Borrador para decidir integración funcional de Entrega o eliminación/deprecación segura del modelo sin uso."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-021 — Integración o depuración técnica de la entidad Entrega

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-021`.
2. **Título:** Integración o depuración técnica de la entidad Entrega.
3. **Tipo:** RF.
4. **Módulo:** Logística / Persistencia.
5. **Descripción funcional:** Resolver la divergencia entre la entidad `Entrega` y el flujo real basado en `OrdenServicioEvento`: integrar la entidad con rutas, servicio, migración y detalle de cantidades/evidencias, o retirar/deprecarla de manera controlada si el modelo de eventos será la fuente operativa. No mantener dos representaciones divergentes de una misma entrega.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Fuente de verdad, cardinalidades, relación con múltiples entregas, tablas/migraciones instaladas, compatibilidad de históricos, endpoints, permisos, auditoría, asociación de POD y comportamiento de reportes/PDF.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Persistencia; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Mantener un modelo operativo único y documentado para entregas.<br>- Si se integra `Entrega`, persistir encabezado y líneas con cantidades, estados y evidencia.<br>- Si se depreca, conservar compatibilidad y limpiar metadata/migraciones con política no destructiva.<br>- Verificar que consultas y documentos usen la misma fuente de datos.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: src/logistica/entities/entrega.entity.ts; src/logistica/logistica.service.ts; src/logistica/logistica.controller.ts; src/database/migrations/. Evidencia técnica leída: - `Entrega` declara orden, fecha, usuario, transportista, conductor, placa, receptor, evidencia JSON y estado.
- No se encontró un servicio/controlador que la persista ni migración que cree su tabla.
- La entrega real se registra como evento genérico `ENTREGA_CLIENTE` y el índice único impide eventos repetidos por orden.
- La entidad no tiene detalle por material/cantidad.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-023]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Fuente de verdad, cardinalidades, relación con múltiples entregas, tablas/migraciones instaladas, compatibilidad de históricos, endpoints, permisos, auditoría, asociación de POD y comportamiento de reportes/PDF.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




