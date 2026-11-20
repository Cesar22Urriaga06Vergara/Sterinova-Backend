---
id: RF-LOG-009
titulo: Añadir modalidad de ingreso (Recogida vs. Llegada Directa)
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx"
depende_de: [RF-LOG-001]
bloquea: []
brechas: [B-LOG-006]
historial:
  - version: 0.1
    nota: "Borrador derivado de la ausencia de una modalidad explícita de ingreso por orden/evento."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-009 — Añadir modalidad de ingreso (Recogida vs. Llegada Directa)

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-009`.
2. **Título:** Añadir modalidad de ingreso (Recogida vs. Llegada Directa).
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe identificar explícitamente si el material ingresa a la operación mediante `RECOGIDA` o `LLEGADA_DIRECTA`, conservar la modalidad en la trazabilidad de la orden y guiar el flujo de estados y datos requeridos según el caso. Una llegada directa debe registrarse como recepción en planta sin crear una recogida ficticia.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Nivel de persistencia (orden, ruta o evento), estados permitidos por modalidad, campos obligatorios para entrega directa, responsable y evidencia, datos de sede de origen, cambio de modalidad por error, reportes y migración de históricos. La presentación del camino directo en frontend se mantiene fuera de una ficha de requisito backend separada por decisión del usuario.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Elegir o registrar una modalidad identificable para cada ingreso.<br>- `RECOGIDA` requiere su evento y datos operativos definidos.<br>- `LLEGADA_DIRECTA` registra recepción y origen sin evento de recogida.<br>- Consultas e historial permiten distinguir ambas modalidades.<br>- Los datos históricos sin modalidad no se clasifican automáticamente como llegada directa.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/logistica.service.ts; src/ordenes-servicio/entities/orden-servicio.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx. Evidencia técnica leída: - `Sterinova-ERP.md` §3 enumera recogidas y llegadas directas.
- La decisión D08 define recogida habitual, llegada directa excepcional y prohíbe simular recogida en ese último caso.
- El backend admite el evento de recepción directa desde `PENDIENTE`, pero no persiste un campo de modalidad explícita.
- La interfaz presenta la secuencia que pasa por `EN_RUTA` y `RECOGIDO` y no ofrece el ingreso directo desde estado pendiente.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-006]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Nivel de persistencia (orden, ruta o evento), estados permitidos por modalidad, campos obligatorios para entrega directa, responsable y evidencia, datos de sede de origen, cambio de modalidad por error, reportes y migración de históricos. La presentación del camino directo en frontend se mantiene fuera de una ficha de requisito backend separada por decisión del usuario.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




