---
id: RF-PLA-006
titulo: Soporte para ciclos con múltiples órdenes
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63"
fuente_contraste: "Sterinova-ERP.md §3, Planta; src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts"
depende_de: [RN-LOG-002, RF-LOG-012]
bloquea: []
brechas: [B-LOG-013]
historial:
  - version: 0.1
    nota: "Borrador derivado de que las reglas de Planta permiten un ciclo con varias órdenes, mientras el modelo y servicio actuales guardan una sola orden_id."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-PLA-006 — Soporte para ciclos con múltiples órdenes

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-PLA-006`.
2. **Título:** Soporte para ciclos con múltiples órdenes.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Planta debe poder crear un ciclo que agrupe materiales de varias órdenes elegibles, conservando por cada material su orden, línea de material, lote, cantidad asignada/procesada y saldo. Solo se combinarán cargas que cumplan compatibilidad técnica y capacidad de cámara aprobadas.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Entidad de asociación ciclo-orden, detalle por ciclo/material/lote, consulta multiámbito, compatibilidad de clientes y métodos, capacidad de cámara, totales y saldos por orden, evaluación/calidad por material, certificados y reportes, rechazo/reproceso y migración de ciclos históricos.
7. **Actores / permisos:** Usuarios autorizados del dominio Planta; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Crear un ciclo con materiales de más de una orden elegible.<br>- Validar por cada material origen, orden, lote y cantidad disponible.<br>- Evitar duplicidad y exceso de saldo por orden/material con transacción.<br>- Conservar resultados, evaluación de calidad y certificado vinculados a las órdenes/materiales correspondientes.<br>- Rechazar combinaciones incompatibles o que superen capacidad según reglas que defina Planta/Calidad.
11. **Fuentes y evidencia actual:** Fuente de requisito: docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63. Contraste: Sterinova-ERP.md §3, Planta; src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts. Evidencia técnica leída: - `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 62–63, establece que un ciclo puede contener varias órdenes/clientes si la carga cabe y que una orden puede distribuirse entre varios ciclos.
- `CicloEsterilizacion` tiene una única `orden_id` y `PlantaService.createCiclo` recibe una orden, carga sus materiales y suma ciclos previos por esa orden.
- `CicloMaterialProcesado` conserva los vínculos a ciclo y material de orden; es una base para el detalle multiorden, pero su servicio actual está restringido a una orden.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-013]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Entidad de asociación ciclo-orden, detalle por ciclo/material/lote, consulta multiámbito, compatibilidad de clientes y métodos, capacidad de cámara, totales y saldos por orden, evaluación/calidad por material, certificados y reportes, rechazo/reproceso y migración de ciclos históricos.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




