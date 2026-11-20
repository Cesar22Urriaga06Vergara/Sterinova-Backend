---
id: RF-AUD-004
titulo: Estandarización de payload before/after en auditoría
tipo: RF
modulo: Auditoría
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; RF-AUD-001"
fuente_contraste: "src/auditoria/auditoria.entity.ts; src/auditoria/auditoria.service.ts; llamadores de auditoría"
depende_de: [RF-AUD-001, RF-AUD-002]
bloquea: []
brechas: [B-AUD-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-AUD-001; relacionado con atomicidad de RF-AUD-002."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos, preservando la distinción entre payload uniforme y atomicidad transaccional."
---

# RF-AUD-004 — Estandarización de payload before/after en auditoría

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-AUD-004`.
2. **Título:** Estandarización de payload before/after en auditoría.
3. **Tipo:** RF.
4. **Módulo:** Auditoría y módulos que generan eventos.
5. **Descripción funcional:** Aplicar un contrato uniforme a eventos de creación, edición, cambio de estado, asignación/revocación, aprobación y anulaciones, con estado anterior y posterior cuando corresponda.
6. **Reglas asociadas:** Identificar actor, acción, entidad/registro, fecha/hora y ámbito; distinguir creación sin estado previo y borrado lógico sin perder el estado anterior; excluir o enmascarar credenciales y otros secretos. La atomicidad se especifica en `RF-AUD-002`.
7. **Actores / permisos:** Actores son los usuarios autenticados que ejecutan operaciones de negocio; lectura y consulta de auditoría siguen `auditoria.ver` y los ámbitos RBAC.
8. **Datos y entidades:** La entidad `Auditoria` contiene `usuario_id`, `entidad`, `entidad_id`, `accion`, `detalle` JSON, `scope_id` y `created_at`; no declara columnas tipadas `before` y `after`.
9. **Flujo:** Cada servicio construye el evento mediante un contrato común → valida/filtra campos sensibles → persiste el detalle en el mismo manager transaccional si participa en una mutación → expone la evidencia por consulta autorizada.
10. **Criterios de aceptación preliminares:** Eventos comparables usan las mismas claves y semántica; creación, edición, cambios de estado y asignación conservan la información adecuada; payload sensible se excluye/enmascara; lectores pueden interpretar eventos históricos según una estrategia de compatibilidad aún por definir.
11. **Evidencia en backend:** `AuditoriaService.create` acepta un `detalle` JSON genérico. La migración `UnifyUserRoleAssignments` escribe `before` y `after` en una llamada SQL, mientras algunos servicios registran solo los campos enviados o valores posteriores; el patrón no es uniforme.
12. **Persistencia e interfaz:** El esquema JSON permite formas distintas y la API de consulta pagina eventos; la ficha no prescribe columnas relacionales ni cambios específicos de interfaz, que dependen del contrato aprobado.
13. **Brecha asociada:** `B-AUD-001` está abierta por falta de esquema uniforme; `RF-AUD-002` aborda que el evento use el contexto transaccional, problema relacionado pero distinto.
14. **Preguntas abiertas:** Definir estructura del objeto, representación de nulos y listas, tratamiento de datos sensibles, versionado del esquema y compatibilidad con eventos históricos.
15. **Estado de cobertura preliminar:** Parcial: existe persistencia y algunos eventos before/after, sin un contrato uniforme para todos los llamadores.
16. **Certeza y límites:** Confirmado por la entidad/servicio de auditoría y ejemplos de llamadores/migración citados. No se inventarió exhaustivamente cada productor ni se evaluó una base productiva; sigue en borrador.

