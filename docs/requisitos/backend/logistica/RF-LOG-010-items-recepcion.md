---
id: RF-LOG-010
titulo: Implementar persistencia de ítems y saldos de recepción
tipo: RF
modulo: Logística / Recepción
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48–49; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-logistica.entity.ts; src/logistica/entities/recepcion-item.entity.ts; src/database/migrations/1795500000000-RecepcionLogistica.ts"
depende_de: [RF-LOG-002]
bloquea: []
brechas: [B-LOG-007, B-LOG-008, B-LOG-011]
historial:
  - version: 0.1
    nota: "Borrador que agrupa persistencia de líneas, recepción parcial acumulada y remisión/factura obligatoria."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-010 — Implementar persistencia de ítems y saldos de recepción

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-010`.
2. **Título:** Implementar persistencia de ítems y saldos de recepción.
3. **Tipo:** RF.
4. **Módulo:** Logística / Recepción.
5. **Descripción funcional:** El backend debe registrar cada recepción con cabecera y detalle persistente por material de orden. Debe permitir varias recepciones parciales, acumular cantidades por línea, calcular el saldo pendiente y bloquear la cantidad acumulada que supere lo ordenado. La remisión/factura será un dato requerido conforme a la regla de recepción.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Clave de acumulación de detalle, varias remisiones/rondas por orden, cantidades decimales y unidad, rechazo de línea vs. rechazo total, locking/concurrencia, correcciones y auditoría, notificación a Comercial, evidencias y compatibilidad con eventos existentes del estado `EN_PLANTA`.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Recepción; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Guardar cabecera y líneas en una transacción.<br>- Permitir recepciones parciales sucesivas con saldo consultable por línea.<br>- Rechazar el agregado que supere cantidad ordenada y preservar la recepción previa.<br>- Exigir remisión/factura o definir explícitamente sus excepciones de negocio.<br>- No modificar silenciosamente la cantidad de la orden o cotización.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística; §6, reglas operativas. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48–49; src/logistica/recepcion.service.ts; src/logistica/entities/recepcion-logistica.entity.ts; src/logistica/entities/recepcion-item.entity.ts; src/database/migrations/1795500000000-RecepcionLogistica.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 pide recepción de materiales y §6 conservar saldo parcial.
- Respuestas 48–49 del Módulo 4 requieren registrar remisión/factura y recepción parcial con diferencia.
- `RecepcionService.createRecepcion` guarda la cabecera, sin insertar `RecepcionItem`.
- `RecepcionLogistica` declara índice único por `orden_id`, impidiendo múltiples cabeceras.
- La migración `1795500000000-RecepcionLogistica.ts` crea cabecera; no se encontró migración de `recepcion_items`.
- El DTO permite `numero_remision_factura` opcional y evidencia opcional.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-007, B-LOG-008, B-LOG-011]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Clave de acumulación de detalle, varias remisiones/rondas por orden, cantidades decimales y unidad, rechazo de línea vs. rechazo total, locking/concurrencia, correcciones y auditoría, notificación a Comercial, evidencias y compatibilidad con eventos existentes del estado `EN_PLANTA`.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




