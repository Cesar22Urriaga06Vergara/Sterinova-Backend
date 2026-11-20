---
id: RF-AUD-001
titulo: Consultar operaciones, responsables y cambios registrados
tipo: RF
modulo: Auditoría
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/auditoria/; src/rbac/; src/users/; src/rbac/ambitos/"
depende_de: [RF-AUD-003]
bloquea: [RF-AUD-004]
brechas: [B-AUD-002]
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-AUD-001 se deriva a RF-AUD-004; el contraste frontend posterior identificó B-AUD-002 por incompatibilidad entre la respuesta paginada y el consumidor UI."
---

# RF-AUD-001 — Consultar operaciones, responsables y cambios registrados

**Fuente principal:** `Sterinova-ERP.md` §3, Auditoría: consultar responsable, registro, valores anteriores/nuevos, motivos y operaciones.

**Fuentes de contraste:** entidad, controlador, DTO y servicio de auditoría; página `SterinovaFrontend/src/app/(erp)/auditoria/page.tsx` y tipo frontend de eventos.

1. **ID:** `RF-AUD-001`.
2. **Título:** Consultar operaciones, responsables y cambios registrados.
3. **Tipo:** RF.
4. **Módulo:** Auditoría.
5. **Descripción funcional:** Consultar registros con responsable, entidad afectada, acción, fecha, motivo y cambios anteriores/nuevos.
6. **Reglas asociadas:** Respetar permiso/ámbito del consultante; preservar trazabilidad y no registrar secretos; proveer filtros y paginación.
7. **Actores y permisos:** `auditoria.ver`, sujeto a contexto de ámbito RBAC.
8. **Datos y entidades:** Auditoria persiste usuario, entidad, ID afectado, acción, detalle JSON, scope y fecha.
9. **Flujo:** `GET /auditoria` recibe filtros, consulta paginada y devuelve data/total/página.
10. **Criterios de aceptación:** Filtrar por usuario, fechas y entidad; limitar por scope; exponer responsable, operación y before/after cuando aplique.
11. **Evidencia backend/frontend:** `AuditoriaController`/`QueryAuditoriaDto` soportan filtros y paginación; `AuditoriaService.findAll` devuelve `{ data, total, page, limit, totalPages }`. La página frontend tipa la respuesta como arreglo, guarda el objeto completo en el estado y luego invoca `filter`, por lo que el contrato actual no coincide y la vista puede fallar al renderizar. La UI no envía filtros de usuario/fecha ni página.
12. **Persistencia y alcance:** `detalle` permite payload flexible; algunos flujos guardan `before`/`after`, otros solo nuevos datos o no registran evento, por lo que la comparación no es uniforme.
13. **Brechas:** `B-AUD-001` se deriva a `RF-AUD-004` para estandarizar payload anterior/nuevo. `B-AUD-002` registra la incompatibilidad entre el sobre paginado del API y el tipo/uso de respuesta en UI, además de la falta de controles de paginación y filtros disponibles en la pantalla.
14. **Preguntas abiertas:** Acordar schema estándar y campos que deben excluirse/enmascararse; RF-AUD-004.
15. **Estado de cobertura:** Parcial. La API implementa consulta filtrada y paginada, pero la UI no consume el contrato paginado como está definido; before/after tampoco es consistente entre operaciones.
16. **Certeza y límites:** Confirmado en controlador, DTO, servicio y página frontend inspeccionados. La incompatibilidad se determinó estáticamente; no se ejecutó la pantalla ni una prueba de integración en esta revisión.
