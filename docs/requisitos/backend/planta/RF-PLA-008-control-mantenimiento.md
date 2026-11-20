---
id: RF-PLA-008
titulo: Control de disponibilidad, mantenimiento y calibración de equipos
tipo: RF
modulo: Planta / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6; docs/negocio/reglas-maestras.md, Módulo 5, respuesta 60"
fuente_contraste: "src/planta/planta.service.ts; src/planta/entities/ciclo-esterilizacion.entity.ts"
depende_de: [RF-PLA-007]
bloquea: []
brechas: [B-PLA-002]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-002; exige compuerta operativa por estado y calibración."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; transiciones y autoridades permanecen pendientes de validación."
---

# RF-PLA-008 — Control de disponibilidad, mantenimiento y calibración de equipos

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-008`.
2. **Título:** Control de disponibilidad, mantenimiento y calibración de equipos.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad.
5. **Descripción funcional:** Registrar disponibilidad/mantenimiento/calibración del equipo y bloquear su selección y uso en ciclo mientras no esté disponible según criterios aprobados.
6. **Reglas asociadas:** Un equipo no disponible no puede utilizarse. Reglas maestras indican bloqueo por mantenimiento o calibración vencida y reactivación con certificado. Conservar historial de estados/certificados; no borrar períodos pasados.
7. **Actores / permisos:** Calidad o Jefe de Planta pueden autorizar reactivación según respuesta de negocio referenciada; quién programa mantenimiento y registra calibración está por definir.
8. **Datos y entidades:** Equipo, estado, intervalo efectivo, mantenimiento, certificado/resultado de calibración, vencimiento, actor, fecha y evidencia documental.
9. **Flujo preliminar:** Marcar indisponible → registrar motivo y período → prevenir asignación a ciclo → registrar mantenimiento/calibración y evidencia → autorizar reactivación → permitir nuevos ciclos.
10. **Criterios de aceptación preliminares:** Ciclo no puede iniciar con equipo en mantenimiento/fuera de servicio/calibración vencida; transición de estado exige actor autorizado; cada cambio conserva fecha/motivo/evidencia; ciclos históricos no cambian al cambiar el estado actual del equipo.
11. **Evidencia en backend:** `PlantaService.createCiclo` no consulta entidad de equipo ni valida disponibilidad/calibración; no hay catálogo en el modelo actual.
12. **Persistencia e interfaz:** No se encontró historial de mantenimiento/calibración ni UI de disponibilidad de equipo; depende del catálogo `RF-PLA-007` y de adjuntos (`RF-PLA-012`).
13. **Brecha asociada:** `B-PLA-002` abierta; compuerta de disponibilidad/calibración no está implementada.
14. **Preguntas abiertas:** Estados y transiciones, reglas/vigencia de calibración, contenido mínimo de certificados, autoridades exactas, retroactividad, recordatorios y anexos (`RA-PLA-004`).
15. **Cobertura preliminar:** Faltante para disponibilidad/calibración porque no hay activo estructurado ni compuerta.
16. **Certeza y límites:** Regla de indisponibilidad viene del anexo; proceso de calibración/autoridad de la fuente de reglas maestras citada. Estado de activos reales y normativa no se verificó; borrador.
