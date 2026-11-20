---
id: RF-LOG-006
titulo: Precarga automática de ítems cotizados en órdenes
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46; src/logistica/logistica.service.ts; src/logistica/dto/create-orden.dto.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx"
depende_de: [RN-LOG-001, RF-COM-003]
bloquea: []
brechas: [B-LOG-001]
historial:
  - version: 0.1
    nota: "Borrador creado tras derivar B-LOG-001; definición de selección de cantidades y excepciones requiere análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-006 — Precarga automática de ítems cotizados en órdenes

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-006`.
2. **Título:** Precarga automática de ítems cotizados en órdenes.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** Al seleccionar una cotización aceptada para crear una orden, el sistema debe mostrar y precargar sus ítems como materiales candidatos. El operador debe indicar las cantidades de la orden (incluidas cantidades parciales), sin volver a transcribir descripciones y referencias. Cada material derivado debe conservar el vínculo con el ítem cotizado y un snapshot de los datos operativos usados.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Selección parcial de ítems y cantidades, control de saldo concurrente, tratamiento de variaciones entre la oferta y material físico, materiales extraordinarios, compatibilidad de campos comerciales y operativos, snapshot de descripción/referencia, migración o preservación de órdenes históricas y UX para varias sedes.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Seleccionar cotización debe cargar sus líneas elegibles con sus datos identificativos.<br>- El operador puede elegir cantidades parciales sin exceder el saldo restante por línea.<br>- Guardar una orden conserva la referencia al ítem cotizado y una copia de los datos operativos capturados.<br>- La API rechaza una orden sin materiales salvo que se defina explícitamente una excepción de negocio.<br>- Variaciones o materiales no cotizados requieren una política y trazabilidad aprobadas.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46; src/logistica/logistica.service.ts; src/logistica/dto/create-orden.dto.ts; src/ordenes-servicio/entities/orden-servicio-material.entity.ts; SterinovaFrontend/src/app/(erp)/logistica/page.tsx. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere órdenes originadas en cotizaciones.
- `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 46, permite varias órdenes por cotización y ordenes parciales/por sede; una orden agrupa varios ítems de esa misma cotización.
- `LogisticaService.createOrden` recibe `dto.materiales`; no copia automáticamente los ítems desde la cotización. `CreateOrdenDto.materiales` es opcional.
- La interfaz inicializa una fila vacía, no precarga ítems al cambiar cotización y permite editar manualmente materiales.
- `OrdenServicioMaterial` contiene `cotizacion_item_id` nullable, descripción, referencia, lote, empaque y cantidad.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-001]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Selección parcial de ítems y cantidades, control de saldo concurrente, tratamiento de variaciones entre la oferta y material físico, materiales extraordinarios, compatibilidad de campos comerciales y operativos, snapshot de descripción/referencia, migración o preservación de órdenes históricas y UX para varias sedes.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




