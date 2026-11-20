---
id: RF-LOG-016
titulo: Registrar traspasos de cadena de custodia
tipo: RF
modulo: Logística / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Logística; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48, 54–55; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts"
depende_de: [RF-LOG-001, RF-LOG-003, RF-LOG-004]
bloquea: []
brechas: [B-LOG-017]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-LOG-017; requiere formalizar entrega y aceptación de custodia entre actores."
  - version: 0.2
    nota: "Se normaliza la ficha al formato de 16 campos; contenido preliminar pendiente de validación."
---

# RF-LOG-016 — Registrar traspasos de cadena de custodia

**Estado:** Borrador técnico preliminar; no aprobado para implementación.

1. **ID:** `RF-LOG-016`.
2. **Título:** Registrar traspasos de cadena de custodia.
3. **Tipo:** RF.
4. **Módulo:** Logística / Planta.
5. **Descripción funcional:** El sistema debe registrar cada traspaso físico de materiales entre cliente, transportador/Logística y Planta mediante un evento explícito que identifique orden/materiales/cantidades, actor que entrega, actor receptor, usuario autenticado, fecha/hora, estado de aceptación y evidencia. La custodia no debe cambiarse solo por una actualización genérica de estado.
6. **Reglas asociadas:** Aplicar controles de autorización, ámbito, integridad y conservación histórica pertinentes. Las reglas específicas aún pendientes son: Roles de origen/destino, usuario ERP vs. persona externa, firma/evidencia, fecha/hora efectiva, material/lote/cantidad, rechazo de entrega, custodia durante tránsito, eventos parciales, rutas multiorden y auditoría no sobrescribible.
7. **Actores / permisos:** Usuarios autorizados del dominio Logística / Planta; los permisos, ámbitos y responsables exactos quedan sujetos a la matriz RBAC y a validación del requisito.
8. **Datos y entidades:** La estructura de datos debe cubrir el enunciado y conservar sus relaciones e historial. Campos, cardinalidades, restricciones, índices y migraciones se definirán al analizar el diseño aceptado; no aplicar cambios de base de datos durante esta revisión.
9. **Flujo preliminar:** Flujo preliminar: iniciar la operación desde el registro de origen → validar permisos, estado y reglas aplicables → persistir el resultado y su trazabilidad → devolver confirmación o errores accionables. Los estados y excepciones específicos permanecen sujetos a las reglas y decisiones citadas.
10. **Criterios de aceptación preliminares:** - Identificar inequívocamente a quien entrega y quien acepta por la parte receptora.<br>- Registrar cantidades y materiales transferidos en ese acto.<br>- Guardar fecha/hora, usuario autenticado y evidencia.<br>- No marcar recepción completa en Planta sin confirmación exigida por política.<br>- Mantener historial de entregas rechazadas y reintentos sin duplicar o sobrescribir eventos.
11. **Fuentes y evidencia actual:** Fuente de requisito: Sterinova-ERP.md §3, Logística; §6, reglas operativas. Contraste: docs/negocio/reglas-maestras.md, Módulo 4, respuestas 48, 54–55; src/ordenes-servicio/entities/orden-servicio-evento.entity.ts; src/logistica/logistica.service.ts. Evidencia técnica leída: - `Sterinova-ERP.md` §3 solicita control de custodia y responsables; §6 define el movimiento entre Logística y Planta como parte del flujo operativo.
- `OrdenServicioEvento` guarda usuario autenticado y hora del evento; el JSON permite `entregado_por` y `recibido_por` como textos.
- El evento `RECOGIDA` registra quien entrega en cliente; `RECEPCION_PLANTA` exige `recibido_por`, pero no exige usuario autenticado de Planta ni acuse bilateral. El permiso de cambio de estado es `logistica.ordenes.cambiar_estado`.
- La secuencia de estados no genera un registro separado de traspaso de custodia.
12. **Persistencia e interfaz:** La implementación debe acordar el contrato API, persistencia y pantallas afectadas y mantener consistencia transaccional cuando aplique. No se define una solución técnica final en esta ficha preliminar.
13. **Brechas asociadas:** [B-LOG-017]. Mantener las brechas vinculadas a este requisito hasta validar su alcance y resolución documental.
14. **Preguntas abiertas:** Roles de origen/destino, usuario ERP vs. persona externa, firma/evidencia, fecha/hora efectiva, material/lote/cantidad, rechazo de entrega, custodia durante tránsito, eventos parciales, rutas multiorden y auditoría no sobrescribible.
15. **Cobertura preliminar:** Pendiente de determinación por análisis requisito-por-requisito; la existencia de este borrador no acredita cobertura.
16. **Certeza y límites:** Certeza declarada en frontmatter: `confirmado`. Hallazgos y criterios son preliminares, sujetos a revisión del código vigente, dependencias directas y validación del usuario/negocio; no se han modificado código ni base de datos.




