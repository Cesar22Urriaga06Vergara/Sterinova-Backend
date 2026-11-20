---
id: RF-LOG-020
titulo: Registro de Prueba de Entrega (POD) y firmas
tipo: RF
modulo: Logística / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/entrega.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx"
depende_de: [RF-LOG-005]
bloquea: []
brechas: [B-LOG-022]
historial:
  - version: 0.1
    nota: "Borrador derivado de que el evento de entrega solo registra receptor textual y no almacena POD/firmas adjuntas."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-020 — Registro de Prueba de Entrega (POD) y firmas

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-020`.
2. **Título:** Registro de Prueba de Entrega (POD) y firmas.
3. **Tipo:** RF.
4. **Módulo:** Logística / Documentos.
5. **Descripción funcional:** El sistema debe permitir adjuntar una prueba de entrega (POD) firmada o fotografiada a cada entrega, vinculada con orden, materiales/cantidades, fecha/hora, transportista y persona receptora. Debe conservar el archivo original y metadatos de carga.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Tipos permitidos, firma manuscrita/digital, identidad del firmante, archivo y almacenamiento privado, hash, permisos de consulta, retención, descargas, correcciones y auditoría.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Documentos; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Exigir POD antes de cerrar entrega, según política aprobada.<br>- Vincular evidencia inequívocamente a la entrega y sus cantidades.<br>- Registrar usuario que carga y fecha/hora.<br>- Diferenciar POD de entrega de la evidencia de recepción en Planta.<br>- Preservar el original conforme a política documental.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/entrega.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx. Evidencia técnica leída: - La respuesta 54 del Módulo 4 exige POD firmada o fotografiada y distingue evidencia de recepción de la evidencia de entrega final.
- `EventoOrdenDto` admite `recibido_por` como texto y observaciones; no declara adjuntos.
- `OrdenServicioEvento.datos_json` no define evidencia.
- `Entrega` tiene `evidencias` JSON opcional, pero no está conectada a servicio/controlador; no se identificó flujo de carga asociado a entrega.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-022]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Tipos permitidos, firma manuscrita/digital, identidad del firmante, archivo y almacenamiento privado, hash, permisos de consulta, retención, descargas, correcciones y auditoría.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




