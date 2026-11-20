---
id: RF-LOG-012
titulo: Control de procesamiento contra cantidades realmente recibidas
tipo: RF
modulo: Logística / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49–51; Módulo 5, respuestas 62–63; src/logistica/logistica.service.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts"
depende_de: [RF-LOG-002, RN-LOG-002, RF-LOG-010]
bloquea: []
brechas: [B-LOG-010, B-LOG-012]
historial:
  - version: 0.1
    nota: "Borrador del control de saldo físico entre recepción, orden y asignaciones/procesamiento de Planta."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-012 — Control de procesamiento contra cantidades realmente recibidas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-012`.
2. **Título:** Control de procesamiento contra cantidades realmente recibidas.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta.
5. **Descripción funcional:** El sistema debe calcular la cantidad disponible para Planta desde las líneas de recepción aceptadas, restando cantidades reservadas/asignadas a ciclos y evitando que el acumulado de ciclos exceda lo realmente recibido. Las cantidades deben mantener vínculo con orden, material, lote y recepción; el control debe operar transaccionalmente frente a asignaciones concurrentes.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Definición de reservas vs. procesamiento, liberación de saldo por aborto/rechazo/reproceso, cantidad por lote/unidad, devoluciones y cuarentena, concurrencia entre ciclos y recepciones parciales, materiales manuales, compatibilidad con ciclos multiorden y conservación histórica.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Saldo disponible = cantidad recibida aceptada − cantidades reservadas/asignadas según política.<br>- Rechazar asignación que exceda el saldo, incluso bajo solicitudes concurrentes.<br>- Cada asignación conserva referencia a la línea de recepción y al material de la orden.<br>- Una recepción parcial limita el máximo que puede entrar a ciclo.<br>- Reglas de liberación ante ciclo fallido/reproceso deben ser explícitas y auditables.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §6, reglas operativas. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49–51; Módulo 5, respuestas 62–63; src/logistica/logistica.service.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §6 prohíbe reasignar dos veces material recibido y exige conservar saldos parciales.
- Respuestas 49–51 de Logística distinguen cantidades ordenadas y recibidas; respuestas 62–63 de Planta permiten distribución en ciclos parciales.
- `PlantaService.createCiclo` suma `CicloMaterialProcesado` y limita contra `OrdenServicioMaterial.cantidad`, no contra recibo físico.
- `RecepcionService` no persiste líneas de `RecepcionItem`; el evento `EN_PLANTA` deja cantidades dentro de JSON sin alimentar el saldo de Planta.
- El cálculo de órdenes puede omitir materiales con `cotizacion_item_id` nulo al calcular saldo de cotización.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-010, B-LOG-012]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Definición de reservas vs. procesamiento, liberación de saldo por aborto/rechazo/reproceso, cantidad por lote/unidad, devoluciones y cuarentena, concurrencia entre ciclos y recepciones parciales, materiales manuales, compatibilidad con ciclos multiorden y conservación histórica.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




