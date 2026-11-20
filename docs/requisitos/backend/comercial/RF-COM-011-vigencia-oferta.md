---
id: RF-COM-011
titulo: Control de vigencia y expiración de ofertas
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §2"
fuente_contraste: "src/cotizaciones/entities/cotizacion.entity.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-004]
bloquea: []
brechas: [B-004-01]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-004-01; evento de inicio y límites de vigencia requieren validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-COM-011 — Control de vigencia y expiración de ofertas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-011`.
2. **Título:** Control de vigencia y expiración de ofertas.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe registrar una fecha estructurada de expiración de oferta (`vigente_hasta`) y debe impedir aprobar o emitir una cotización cuando la oferta haya expirado.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Evento inicial para calcular `vigente_hasta`; duración y valor por defecto; zona horaria y límite horario; inclusión del último día; prórrogas; comportamiento de ofertas vencidas ya enviadas o aceptadas; bloqueo requerido en aprobación y emisión.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una cotización con vigencia calculada, cuando se guarda y emite, entonces su fecha `vigente_hasta` queda persistida y conservada en el documento según la regla que se valide.<br>- Dada una cotización cuya fecha `vigente_hasta` ya pasó, cuando se intenta aprobar o emitir, entonces el backend rechaza la operación.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §2. Contraste: src/cotizaciones/entities/cotizacion.entity.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md, Módulo 3. Evidencia técnica leída: - `Sterinova-ERP.md` §2 solicita configurar la vigencia de la oferta.
- `src/cotizaciones/entities/cotizacion.entity.ts` guarda `validez_oferta` como texto nullable.
- `src/cotizaciones/cotizaciones.service.ts` comprueba que el campo tenga contenido al aprobar, pero no interpreta fechas ni aplica bloqueo temporal al aprobar o emitir.
- `docs/negocio/reglas-maestras.md`, Módulo 3, registra plazo de hasta 30 días y deja pendiente si inicia al enviar la propuesta o en la emisión operativa.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-004-01]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Evento inicial para calcular `vigente_hasta`; duración y valor por defecto; zona horaria y límite horario; inclusión del último día; prórrogas; comportamiento de ofertas vencidas ya enviadas o aceptadas; bloqueo requerido en aprobación y emisión.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




