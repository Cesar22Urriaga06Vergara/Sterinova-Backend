---
id: RF-AUD-002
titulo: Atomicidad en registros de auditoría
tipo: RNF / Auditoría
modulo: Auditoría transversal
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §5"
fuente_contraste: "src/auditoria/auditoria.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/cotizaciones.service.ts"
depende_de: []
bloquea: []
brechas: [B-008-02]
historial:
  - version: 0.1
    nota: "Borrador transversal derivado de la resolución de anulaciones; debe analizarse si la atomicidad aplica de forma uniforme a todos los dominios."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-AUD-002 — Atomicidad en registros de auditoría

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-AUD-002`.
2. **Título:** Atomicidad en registros de auditoría.
3. **Tipo:** RNF / Auditoría.
4. **Módulo:** Auditoría transversal.
5. **Descripción funcional:** Cuando una operación de negocio y su evento de auditoría deban representar una misma decisión, el sistema debe persistir ambos dentro de la misma transacción de base de datos, de modo que el commit o rollback deje sus estados coherentes.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Alcance de atomicidad por tipo de evento; propagación obligatoria del `EntityManager`; operaciones que cruzan almacenamiento externo; estrategia ante fallo del canal de auditoría; correlación e idempotencia; conservación de auditoría cuando se requiere rollback del negocio; impacto y reconciliación de eventos históricos.
7. **Actores / permisos:** Usuarios autorizados del dominio Auditoría transversal; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una operación transaccional auditada, cuando negocio y auditoría se guardan, entonces ambos se confirman juntos.<br>- Dada una falla antes del commit, cuando la transacción revierte, entonces no queda un evento que afirme que la acción se completó.<br>- Dado un evento de auditoría requerido, cuando no se puede persistir de forma consistente, entonces la operación sigue la política de fallo definida, sin producir un estado engañoso.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §5. Contraste: src/auditoria/auditoria.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/cotizaciones.service.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 y §5 contempla auditoría y trazabilidad de operaciones.
- `AuditoriaService.create` acepta un `EntityManager` opcional; si no se pasa, usa el repositorio inyectado directamente.
- `SolicitudAnulacionService.resolverSolicitud` transacciona el cambio de estado de cotización y la resolución, pero crea el evento `ANULAR` sin pasar el `EntityManager` de la transacción.
- Si posteriormente falla el guardado de la solicitud, la cotización puede revertirse mientras el evento de auditoría ya quedó persistido por separado.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-008-02]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Alcance de atomicidad por tipo de evento; propagación obligatoria del `EntityManager`; operaciones que cruzan almacenamiento externo; estrategia ante fallo del canal de auditoría; correlación e idempotencia; conservación de auditoría cuando se requiere rollback del negocio; impacto y reconciliación de eventos históricos.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




