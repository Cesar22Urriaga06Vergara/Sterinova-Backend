---
id: RF-PLA-016
titulo: Inmutabilidad de ciclos aprobados a nivel de base de datos
tipo: RF
modulo: Planta / Calidad / Base de Datos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/calidad.service.ts; src/database/migrations/"
depende_de: [RN-PLA-002]
bloquea: []
brechas: [B-PLA-011]
historial:
  - version: 0.1
    nota: "Borrador técnico de hardening para impedir en BD la alteración de datos de ejecución de ciclos aprobados."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; excepciones de flujo y estrategia de BD requieren diseño y validación."
---

# RF-PLA-016 — Inmutabilidad de ciclos aprobados a nivel de base de datos

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-016`.
2. **Título:** Inmutabilidad de ciclos aprobados a nivel de base de datos.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad / Base de Datos.
5. **Descripción funcional:** Impedir que una escritura directa altere o elimine mediciones y datos originales de un ciclo después de su aprobación, manteniendo únicamente las transiciones de flujo explícitamente permitidas.
6. **Reglas asociadas:** Un ciclo aprobado no se sobrescribe; una corrección o reproceso genera evidencia nueva enlazada, no sustituye los datos anteriores. Excepciones administrativas requieren autorización y auditoría.
7. **Actores / permisos:** Usuarios de aplicación ejecutan transiciones aprobadas; cuentas técnicas/administrativas de base de datos deben estar limitadas. Roles privilegiados y procedimiento de emergencia por definir.
8. **Datos y entidades:** Ciclo, parámetros, materiales procesados, evaluaciones de Calidad, aprobador/fecha y estados; definir qué campos son inmutables frente a qué metadatos de flujo pueden cambiar.
9. **Flujo preliminar:** Aprobación transaccional → ciclo adquiere estado protegido → mutación posterior de campos protegidos se rechaza → cualquier corrección autorizada crea registro nuevo y deja vínculo/auditoría.
10. **Criterios de aceptación preliminares:** API y SQL directo no modifican/eliminan campos protegidos tras aprobación; la aprobación inicial puede completar sus metadatos en la misma transacción; se conserva posibilidad de lectura; fallos de la guarda abortan la mutación; rollback/migración no debilitan historia existente.
11. **Evidencia en backend/BD:** La API no expone endpoint de edición; Calidad actualiza estado/revisor/fecha. FKs restringen borrado con relaciones, pero no se identificó trigger contra `UPDATE` directo de ciclo aprobado.
12. **Persistencia e interfaz:** La entidad contiene mediciones y estado; no hay una salvaguarda de BD citada para inmutabilidad. El cambio requeriría diseño de trigger/permisos u otra garantía equivalente para el motor soportado.
13. **Brecha asociada:** `B-PLA-011` abierta como hardening de integridad; el borrador no equivale a autorización de modificar base de datos.
14. **Preguntas abiertas:** Campos protegidos, orden de escritura en aprobación, privilegios de excepciones, motor/versiones, migración segura, auditoría y procedimiento de reparación/restauración.
15. **Cobertura preliminar:** Parcial: API limita mutaciones, pero no se constató protección completa frente a escritura directa.
16. **Certeza y límites:** Basado en entidad, servicio de Calidad y migraciones inspeccionadas. No se conectó a base desplegada ni se validó trigger; el diseño debe probarse en el motor autorizado antes de implementarse.

