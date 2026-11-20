---
id: RF-COM-010
titulo: Cálculo de descuentos en cotizaciones
tipo: RF
modulo: Comercial / Cotizaciones
estado: borrador
certeza: inferido
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/cotizaciones/dto/create-cotizacion-item.dto.ts; src/cotizaciones/entities/cotizacion-item.entity.ts; src/cotizaciones/cotizacion-item-builder.ts; docs/negocio/reglas-maestras.md"
depende_de: [RF-COM-003]
bloquea: []
brechas: [B-003-03]
historial:
  - version: 0.1
    nota: "Borrador creado tras derivar B-003-03; reglas de modalidad y cálculo requieren análisis y validación."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-COM-010 — Cálculo de descuentos en cotizaciones

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-COM-010`.
2. **Título:** Cálculo de descuentos en cotizaciones.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar y calcular descuentos en los ítems de una cotización y reflejar sus importes en el detalle y los totales comerciales.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Modalidad y exclusividad de descuentos; base de cálculo; redondeo y presentación; límites autorizados; persistencia del descuento y sus valores originales; recálculo de subtotal, impuestos y total; snapshot y conservación al emitir.
7. **Actores / permisos:** Usuarios autorizados del dominio Comercial / Cotizaciones; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Dado un descuento válido según la regla de negocio que se acuerde, cuando se calcula el ítem, entonces se conservan el importe bruto, descuento e importe neto de forma verificable.<br>- Dada una cotización con varios ítems y descuentos, cuando se calculan sus totales, entonces el subtotal y los importes fiscales reflejan los netos de línea conforme a la política aprobada.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3. Contraste: src/cotizaciones/dto/create-cotizacion-item.dto.ts; src/cotizaciones/entities/cotizacion-item.entity.ts; src/cotizaciones/cotizacion-item-builder.ts; docs/negocio/reglas-maestras.md. Evidencia técnica leída: - `Sterinova-ERP.md` §3 incluye cálculo de descuentos.
- `src/cotizaciones/dto/create-cotizacion-item.dto.ts` recibe cantidad y valor unitario, sin campos de descuento.
- `src/cotizaciones/entities/cotizacion-item.entity.ts` guarda cantidad, valor unitario y valor total, sin campos de descuento.
- `src/cotizaciones/cotizacion-item-builder.ts` calcula cantidad por valor unitario; no se encontró cálculo de descuento en el flujo inspeccionado.
- `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 26–29, menciona descuentos por ítem y propone modalidades porcentaje o importe; las validaciones ahí descritas no constituyen topes aprobados.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-003-03]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Modalidad y exclusividad de descuentos; base de cálculo; redondeo y presentación; límites autorizados; persistencia del descuento y sus valores originales; recálculo de subtotal, impuestos y total; snapshot y conservación al emitir.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `inferido`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




