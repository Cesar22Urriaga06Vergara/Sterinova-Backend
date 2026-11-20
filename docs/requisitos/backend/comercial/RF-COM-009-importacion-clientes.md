---
id: RF-COM-009
titulo: Importación masiva de clientes
tipo: RF
modulo: Comercial
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 2, respuestas 11–20; src/clientes/"
depende_de: []
bloquea: []
brechas: [B-001-02]
historial:
  - version: 0.1
    nota: "Borrador pendiente de análisis y validación requisito por requisito."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-COM-009 — Importación masiva de clientes

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-009`.
2. **Título:** Importación masiva de clientes.
3. **Tipo:** RF.
4. **Módulo:** Comercial.
5. **Descripción funcional:** El sistema debe permitir importar clientes en lote e informar el resultado del procesamiento.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Identificación y normalización; duplicados y complementación; filas inválidas y conflictos; confirmación parcial o atómica; actualización de clientes persistidos; reporte de filas y trazabilidad del origen; restricciones y estado real de migraciones.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dado un lote válido, cuando un usuario autorizado ejecuta la importación, entonces el sistema informa cuántos registros importa y omite.<br>- Dado un identificador existente o repetido, cuando se procesa el lote, entonces el sistema no crea un duplicado conforme a la regla de identificación que se valide.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3. Contraste: docs/negocio/reglas-maestras.md, Módulo 2, respuestas 11–20; src/clientes/. Evidencia técnica leída: - `Sterinova-ERP.md` §3 incluye importación de clientes.
- `docs/negocio/reglas-maestras.md`, Módulo 2, trata identificación, normalización, duplicados, complementación de datos, conflictos y revisión; algunas reglas aparecen como propuesta o decisión pendiente.
- `src/clientes/clientes.controller.ts` declara `POST /clientes/bulk`, protegido por `clientes.importar`, y recibe un arreglo de `CreateClienteDto`.
- `src/clientes/clientes.service.ts` omite repetidos por NIT exacto en el lote y NIT ya existentes; devuelve `imported` y `skipped`.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-001-02]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Identificación y normalización; duplicados y complementación; filas inválidas y conflictos; confirmación parcial o atómica; actualización de clientes persistidos; reporte de filas y trazabilidad del origen; restricciones y estado real de migraciones.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




