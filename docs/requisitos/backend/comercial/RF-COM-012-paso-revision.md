---
id: RF-COM-012
titulo: Implementar el paso de Revisión (EN_REVISION)
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/estado-cotizacion.enum.ts; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-005]
bloquea: []
brechas: [B-005-02]
historial:
  - version: 0.1
    nota: "Borrador creado al derivar B-005-02; actor, controles y comportamiento de devolución requieren análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-COM-012 — Implementar el paso de Revisión (EN_REVISION)

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-012`.
2. **Título:** Implementar el paso de Revisión (EN_REVISION).
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir que una cotización en `BORRADOR` sea enviada formalmente a revisión, registrando el estado `EN_REVISION` antes de habilitar la aprobación interna.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Quién puede solicitar revisión; validaciones previas; quién puede revisar y si revisión y aprobación son una misma o distintas actuaciones; devolución a borrador y comentarios; historial de cambios/versión; permisos y ámbitos; efectos sobre cotizaciones editadas o aprobadas; auditoría y migración de registros existentes.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dado un borrador válido, cuando un usuario autorizado lo envía a revisión, entonces el sistema persiste `EN_REVISION` y deja evidencia del responsable y momento.<br>- Dada una cotización aún no revisada, cuando se intenta aprobarla, entonces el backend rechaza la operación.<br>- Dada una cotización en revisión, cuando se intenta editarla, entonces el comportamiento corresponde a la política de revisión aprobada y queda auditado.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §6. Contraste: src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/estado-cotizacion.enum.ts; docs/negocio/reglas-maestras.md, Módulo 3. Evidencia técnica leída: - `Sterinova-ERP.md` §3 contempla revisión y aprobación de cotizaciones; §6 define la secuencia Borrador → Revisión → Aprobación interna.
- `docs/negocio/reglas-maestras.md`, Módulo 3, propone `EN_REVISION` como etapa en la que el asesor solicita revisión al jefe.
- `src/cotizaciones/entities/estado-cotizacion.enum.ts` declara `EN_REVISION`.
- El endpoint de aprobación actual cambia directamente de `BORRADOR` a `APROBADA`; no se encontró una acción de envío a revisión en el controlador o servicio inspeccionados.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-005-02]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Quién puede solicitar revisión; validaciones previas; quién puede revisar y si revisión y aprobación son una misma o distintas actuaciones; devolución a borrador y comentarios; historial de cambios/versión; permisos y ámbitos; efectos sobre cotizaciones editadas o aprobadas; auditoría y migración de registros existentes.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




