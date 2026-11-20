---
id: RF-LOG-019
titulo: Implementar lógica de entregas parciales y control de saldos
tipo: RF
modulo: Logística / Entregas
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 54–56; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts"
depende_de: [RF-LOG-005]
bloquea: []
brechas: [B-LOG-021]
historial:
  - version: 0.1
    nota: "Borrador derivado de la falta de eventos de entrega parciales acumulables y saldo pendiente por material."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-019 — Implementar lógica de entregas parciales y control de saldos

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-019`.
2. **Título:** Implementar lógica de entregas parciales y control de saldos.
3. **Tipo:** RF.
4. **Módulo:** Logística / Entregas.
5. **Descripción funcional:** El sistema debe permitir registrar múltiples entregas por orden y material, acumular cantidades entregadas y mantener el saldo pendiente. El estado de orden `ENTREGADO` solo se asigna cuando el saldo cumple los criterios de cierre definidos; entregas parciales y fallidas conservan su historia.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Detalle por material/lote/unidad, cantidades planificadas vs. recibidas en devolución, cierres con faltantes, entregas fallidas/reintentos, concurrencia, estados parciales, inventario, devoluciones y condiciones de liberación de Calidad.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Entregas; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Registrar varias entregas y acumular por línea.<br>- Rechazar cantidades acumuladas que excedan la cantidad disponible para despacho.<br>- Calcular y mostrar saldo pendiente tras cada evento.<br>- No cerrar automáticamente con entrega menor que el saldo, salvo excepción aprobada.<br>- Mantener estados/eventos históricos y permitir consultar cada entrega.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 54–56; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide entregas parciales y finales.
- `LogisticaService.updateEstado` implementa solo transición final `PROCESADO → ENTREGADO`.
- `OrdenServicioEvento` impone unicidad de evento por tipo/orden, permitiendo un único `ENTREGA_CLIENTE`.
- El método valida cada cantidad contra la orden, pero no mantiene acumulado ni saldo remanente.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-021]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Detalle por material/lote/unidad, cantidades planificadas vs. recibidas en devolución, cierres con faltantes, entregas fallidas/reintentos, concurrencia, estados parciales, inventario, devoluciones y condiciones de liberación de Calidad.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




