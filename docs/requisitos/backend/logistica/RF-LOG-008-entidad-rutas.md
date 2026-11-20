---
id: RF-LOG-008
titulo: Implementar gestión de rutas compartidas
tipo: RF
modulo: Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 54; docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/"
depende_de: [RF-LOG-001, RN-LOG-001]
bloquea: []
brechas: [B-LOG-004]
historial:
  - version: 0.1
    nota: "Borrador creado por ausencia de entidad y flujo para rutas que agrupan múltiples clientes/órdenes."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-008 — Implementar gestión de rutas compartidas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-008`.
2. **Título:** Implementar gestión de rutas compartidas.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe permitir crear y gestionar rutas logísticas que agrupen varias órdenes, incluso de distintos clientes, asignando responsable, transportador, conductor y vehículo. Cada parada debe conservar su orden y eventos asociados; la ruta compartida no debe fusionar las recepciones ni la trazabilidad individual de las órdenes.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Estados y ciclo de vida de ruta, planificación vs. ejecución, orden de paradas, asignación y sustitución de transportador/conductor/vehículo, permisos por ámbito, evidencia por parada, cancelaciones y reprogramaciones, rutas parcialmente completadas, órdenes de diferentes sedes/clientes y separación de llegada directa.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Crear una ruta con responsable y datos de transporte.<br>- Asociar varias órdenes de clientes distintos y consultar sus paradas.<br>- Registrar ejecución/evidencia por parada sin reemplazar eventos de cada orden.<br>- Una orden de llegada directa no se incorpora como recogida ficticia.<br>- Auditar quién planificó y quién ejecutó la ruta, con fechas y cambios.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuesta 54; docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide rutas con múltiples clientes.
- `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 54, identifica transportador, conductor, placa, ruta y evidencia.
- Decisión D08 contempla rutas con responsable y varios clientes y establece que la llegada directa no simula recogida.
- El código inspeccionado tiene eventos y conductor/placa por orden, pero no entidad, controlador ni identificador de ruta compartida.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-004]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Estados y ciclo de vida de ruta, planificación vs. ejecución, orden de paradas, asignación y sustitución de transportador/conductor/vehículo, permisos por ámbito, evidencia por parada, cancelaciones y reprogramaciones, rutas parcialmente completadas, órdenes de diferentes sedes/clientes y separación de llegada directa.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




