---
id: RF-COM-014
titulo: Bloqueo de emisión por anulación pendiente
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/entities/solicitud-anulacion.entity.ts"
depende_de: [RF-COM-008]
bloquea: []
brechas: [B-008-01]
historial:
  - version: 0.1
    nota: "Borrador creado tras derivar B-008-01; bloqueo confirmado por decisión del usuario, detalles de concurrencia y desbloqueo requieren análisis técnico."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-COM-014 — Bloqueo de emisión por anulación pendiente

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-014`.
2. **Título:** Bloqueo de emisión por anulación pendiente.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El backend debe impedir la emisión de una cotización mientras exista una solicitud de anulación en estado `PENDIENTE` asociada a ella. La comprobación debe ser atómica frente a solicitudes concurrentes y no debe generar PDF ni marcar fecha de emisión cuando se rechace la operación.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Bloqueo en la transacción de emisión con bloqueo de fila suficiente; serialización frente a solicitud creada en paralelo; comportamiento después de rechazo o aprobación; limpieza/rollback; errores de conflicto; cobertura de rutas alternativas de emisión; impacto sobre cotizaciones ya emitidas que tengan una solicitud en trámite.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una cotización con solicitud `PENDIENTE`, cuando se intenta emitir, entonces el servicio rechaza la operación antes de generar PDF o persistir `fecha_emision`.<br>- Dada una emisión concurrente con la creación de una solicitud, cuando ambas operaciones compiten, entonces el bloqueo transaccional garantiza que no se completen ambas en un orden que deje una emisión posterior a una solicitud pendiente.<br>- Dada una solicitud resuelta, cuando ya no existe una solicitud pendiente, entonces la emisión sigue las demás reglas comerciales y de aceptación vigentes.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §6. Contraste: src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/solicitud-anulacion.service.ts; src/cotizaciones/entities/solicitud-anulacion.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §6 separa las cotizaciones emitidas y sus correcciones del flujo ordinario.
- `docs/negocio/reglas-maestras.md` define la solicitud con aprobación y establece que solicitar no equivale a anular.
- `src/cotizaciones/solicitud-anulacion.service.ts` guarda la solicitud como `PENDIENTE`, pero no cambia el estado de la cotización.
- `src/cotizaciones/cotizaciones.service.ts`, método `emitir`, valida anulación y aprobación interna, pero no consulta solicitudes de anulación pendientes.
- Una cotización aprobada puede tener una solicitud pendiente y aun así continuar al método de emisión.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-008-01]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Bloqueo en la transacción de emisión con bloqueo de fila suficiente; serialización frente a solicitud creada en paralelo; comportamiento después de rechazo o aprobación; limpieza/rollback; errores de conflicto; cobertura de rutas alternativas de emisión; impacto sobre cotizaciones ya emitidas que tengan una solicitud en trámite.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




