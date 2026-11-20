---
id: RF-SEG-001
titulo: Confirmación por contraseña en operaciones críticas
tipo: RF / Seguridad
modulo: Seguridad transversal
estado: consolidado
certeza: inferido
version: 0.1
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §4"
fuente_contraste: "src/auth/auth.service.ts; src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md"
depende_de: []
bloquea: []
brechas: []
historial:
  - version: 0.1
    nota: "Borrador de origen para B-005-03; su alcance se consolidó en RNF-SEG-002 para evitar mantener dos requisitos paralelos. Se conserva como antecedente hasta cerrar la ficha derivada."
---

# RF-SEG-001 — Confirmación por contraseña en operaciones críticas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-SEG-001`.
2. **Título:** Confirmación por contraseña en operaciones críticas.
3. **Tipo:** RF / Seguridad.
4. **Módulo:** Seguridad transversal.
5. **Descripción funcional:** El sistema debe solicitar y validar de nuevo la contraseña del usuario autenticado antes de confirmar operaciones que se clasifiquen como críticas, además de comprobar autorización y ámbito mediante la sesión vigente.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Operaciones críticas cubiertas; confirmación por contraseña frente a reautenticación equivalente; vigencia de la confirmación; protección contra repetición; límite de intentos y respuesta ante fallo; auditoría sin almacenar secretos; seguridad de transporte; experiencia de usuario; integración con sesiones, RBAC y ámbitos.
7. **Actores / permisos:** Usuarios autorizados del dominio Seguridad transversal; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dada una operación clasificada como crítica, cuando el usuario no aporta una confirmación válida de contraseña, entonces la operación se rechaza sin persistir sus efectos.<br>- Dada una confirmación válida, cuando el usuario también tiene permiso y ámbito suficientes, entonces la operación puede continuar y se registra su ejecución sin guardar la contraseña.<br>- Dada una operación no clasificada como crítica, cuando se ejecuta, entonces la política aprobada determina si no requiere confirmación adicional.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §4. Contraste: src/auth/auth.service.ts; src/cotizaciones/cotizaciones.controller.ts; src/cotizaciones/cotizaciones.service.ts; docs/negocio/reglas-maestras.md. Evidencia técnica leída: - `Sterinova-ERP.md` §4 contempla confirmación por contraseña para aprobaciones críticas.
- `src/auth/auth.service.ts` incluye `verifyPassword(userId, password)`.
- La ruta `POST /cotizaciones/:id/aprobar` exige `cotizaciones.aprobar_interna`, pero su DTO actual solo recibe la versión y no solicita contraseña; el servicio de aprobación no invoca `verifyPassword`.
- `B-005-03` se deriva desde `RF-COM-005` y se mantiene asociada a `RNF-SEG-002`. Esta ficha se conserva como antecedente del alcance inicial; no duplicar la brecha ni la implementación.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** []. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Operaciones críticas cubiertas; confirmación por contraseña frente a reautenticación equivalente; vigencia de la confirmación; protección contra repetición; límite de intentos y respuesta ante fallo; auditoría sin almacenar secretos; seguridad de transporte; experiencia de usuario; integración con sesiones, RBAC y ámbitos.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.



