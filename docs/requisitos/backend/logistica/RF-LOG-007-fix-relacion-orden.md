---
id: RF-LOG-007
titulo: Corrección de cardinalidad Cotización-Orden
tipo: RF
modulo: Logística / Persistencia
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46"
fuente_contraste: "src/ordenes-servicio/entities/orden-servicio.entity.ts; src/database/migrations/1795100000000-AllowMultipleOrdersPerQuote.ts; src/logistica/logistica.service.ts"
depende_de: [RN-LOG-001]
bloquea: []
brechas: [B-LOG-002]
historial:
  - version: 0.1
    nota: "Borrador para alinear el mapeo ORM con la relación de base de datos y la regla de varias órdenes por cotización."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-007 — Corrección de cardinalidad Cotización-Orden

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-007`.
2. **Título:** Corrección de cardinalidad Cotización-Orden.
3. **Tipo:** RF.
4. **Módulo:** Logística / Persistencia.
5. **Descripción funcional:** El modelo ORM de órdenes debe representar una relación de muchos a uno: cada orden pertenece a una cotización y una cotización puede tener varias órdenes. El mapeo de entidades y los contratos de consulta deben ser consistentes con la migración que elimina la unicidad de `ordenes_servicio.cotizacion_id`.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Dirección de la relación inversa en `Cotizacion`, carga eager/lazy, serialización para no duplicar payloads, sincronización de metadata ORM, índices/FK en instalaciones existentes, compatibilidad de migraciones y consultas, pruebas de lectura/escritura con dos órdenes de una cotización. No ejecutar migraciones sobre bases sin autorización.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Persistencia; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Una cotización existente puede relacionarse con dos o más órdenes sin violación de cardinalidad en ORM ni BD.<br>- Cada orden conserva exactamente una referencia obligatoria a una cotización.<br>- El borrado de cotizaciones referenciadas continúa restringido.<br>- Las consultas devuelven la cotización correcta en cada orden sin colisiones ni pérdida de relaciones.
11. **Fuentes y evidencia actual:** Fuente de requisito: docs/negocio/reglas-maestras.md, Módulo 4, respuesta 46. Contraste: src/ordenes-servicio/entities/orden-servicio.entity.ts; src/database/migrations/1795100000000-AllowMultipleOrdersPerQuote.ts; src/logistica/logistica.service.ts. Evidencia técnica leída: - `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 46, establece que una cotización puede generar múltiples órdenes por sede o entrega parcial y que cada orden corresponde a una cotización.
- `1795100000000-AllowMultipleOrdersPerQuote.ts` reemplaza el índice único por un índice normal.
- `OrdenServicio.cotizacion` está actualmente declarada `OneToOne`, por lo que el mapeo ORM no expresa la cardinalidad permitida por la base de datos y el dominio.
- `LogisticaService.createOrden` y las consultas agregan órdenes por `cotizacion_id`.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-002]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Dirección de la relación inversa en `Cotizacion`, carga eager/lazy, serialización para no duplicar payloads, sincronización de metadata ORM, índices/FK en instalaciones existentes, compatibilidad de migraciones y consultas, pruebas de lectura/escritura con dos órdenes de una cotización. No ejecutar migraciones sobre bases sin autorización.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




