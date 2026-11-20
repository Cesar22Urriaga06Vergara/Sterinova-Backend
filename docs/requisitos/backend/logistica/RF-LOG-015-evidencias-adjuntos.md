---
id: RF-LOG-015
titulo: Adjuntar evidencias a eventos logísticos
tipo: RF
modulo: Logística / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/recepcion-logistica.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/entrega.entity.ts"
depende_de: [RF-LOG-003, RF-LOG-014]
bloquea: []
brechas: [B-LOG-016]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-016; mecanismo de evidencia/firma debe alinearse con decisiones de negocio y conservación documental."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-015 — Adjuntar evidencias a eventos logísticos

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-015`.
2. **Título:** Adjuntar evidencias a eventos logísticos.
3. **Tipo:** RF.
4. **Módulo:** Logística / Documentos.
5. **Descripción funcional:** El sistema debe permitir asociar evidencia fotográfica, documental o firma al evento correspondiente de recogida, recepción, rechazo, novedad, transferencia o entrega. Cada adjunto debe conservar metadatos, usuario y fecha de carga, vínculo al evento y controles de consulta/conservación.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Tipos permitidos y tamaño, almacenamiento privado, formatos, firma digital vs. imagen, hash/integridad, permisos, retención, reemplazo/anulación, descarga, malware, acceso a través de API y vínculo con eventos repetibles.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Documentos; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Adjuntar evidencia a un evento específico y conservar vínculo no ambiguo.<br>- Registrar quién la aportó y cuándo.<br>- Controlar acceso y preservar el original conforme a política documental.<br>- Diferenciar evidencia de recepción y prueba de entrega al cliente.<br>- Evitar que la evidencia quede solo como URL o texto sin validación/retención definida.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48 y 54; src/logistica/entities/recepcion-logistica.entity.ts; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/entities/entrega.entity.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 requiere evidencias y responsables.
- La respuesta 48 de Logística menciona fotos o firma de quien entrega; respuesta 54 distingue evidencia de recepción y prueba de entrega final.
- `OrdenServicioEvento.datos_json` y su DTO no modelan adjuntos.
- `RecepcionLogistica.evidencias` y `Entrega.evidencias` son campos JSON opcionales, pero no se encontró flujo de carga de archivo integrado; la entidad `Entrega` no tiene servicio/controlador operativo.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-016]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Tipos permitidos y tamaño, almacenamiento privado, formatos, firma digital vs. imagen, hash/integridad, permisos, retención, reemplazo/anulación, descarga, malware, acceso a través de API y vínculo con eventos repetibles.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




