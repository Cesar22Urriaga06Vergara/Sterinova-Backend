---
id: RF-COM-013
titulo: Implementar flujo de envío y aceptación
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/cotizacion.entity.ts; src/database/migrations/1794312000000-AddBackendRoleSchema.ts; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-005, RF-COM-006]
bloquea: [RF-COM-007]
brechas: [B-006-01, B-006-02, B-006-04]
historial:
  - version: 0.1
    nota: "Borrador creado al agrupar B-006-01, B-006-02 y B-006-04; contrato, permisos y tratamiento de excepciones requieren análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-COM-013 — Implementar flujo de envío y aceptación

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-013`.
2. **Título:** Implementar flujo de envío y aceptación.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar el envío al cliente de una cotización aprobada, registrar su aceptación con responsable ERP y fecha, y bloquear la emisión operativa hasta que la cotización esté en estado `ACEPTADA_CLIENTE`.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Permisos y ámbito para cada acción; actor de envío y registro; condiciones de versión aprobada y no alterada; datos mínimos del envío; responsable, fecha y evidencia de aceptación; estados y transiciones; comportamiento ante rechazo, revocación o cambios posteriores; auditoría e idempotencia; bloqueo de emisión hasta aceptación; migración o tratamiento de registros existentes.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una cotización aprobada internamente, cuando un usuario autorizado registra su envío, entonces queda `ENVIADA` y se identifica la versión enviada.<br>- Dada una cotización enviada, cuando un usuario autorizado registra la aceptación del cliente, entonces queda `ACEPTADA_CLIENTE` y se guardan el usuario ERP y la fecha.<br>- Dada una cotización aprobada o enviada que aún no esté aceptada, cuando se intenta emitirla, entonces el backend rechaza la operación sin producir emisión ni efectos parciales.<br>- Dada una cotización aceptada, cuando se intenta emitirla, entonces la autorización y el resto de validaciones vigentes determinan si puede continuar.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, §6. Contraste: src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; src/cotizaciones/entities/cotizacion.entity.ts; src/database/migrations/1794312000000-AddBackendRoleSchema.ts; docs/negocio/reglas-maestras.md, Módulo 3. Evidencia técnica leída: - `Sterinova-ERP.md` §3 contempla emisión de propuestas al cliente; §6 define el flujo de envío al cliente seguido de aceptación y emisión operativa.
- `docs/negocio/reglas-maestras.md`, Módulo 3, distingue envío de propuesta y emisión operativa, y propone conservar la versión enviada, fecha, responsable, medio y alternativa aceptada.
- El enum `src/cotizaciones/entities/estado-cotizacion.enum.ts` declara `ENVIADA` y `ACEPTADA_CLIENTE`.
- `src/cotizaciones/entities/cotizacion.entity.ts` y `1794312000000-AddBackendRoleSchema.ts` contemplan `aceptacion_registrada_por_id` y `aceptacion_registrada_at`, pero no se encontró lógica que las asigne.
- `CotizacionesService.emitir` comprueba aprobación interna, pero no exige `ACEPTADA_CLIENTE`.
- `docs/arquitectura/roles-y-permisos.md` propone `POST /cotizaciones/:id/enviar` y `POST /cotizaciones/:id/aceptacion`; no se encontraron esas rutas en el controlador inspeccionado.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-006-01, B-006-02, B-006-04]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Permisos y ámbito para cada acción; actor de envío y registro; condiciones de versión aprobada y no alterada; datos mínimos del envío; responsable, fecha y evidencia de aceptación; estados y transiciones; comportamiento ante rechazo, revocación o cambios posteriores; auditoría e idempotencia; bloqueo de emisión hasta aceptación; migración o tratamiento de registros existentes.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




