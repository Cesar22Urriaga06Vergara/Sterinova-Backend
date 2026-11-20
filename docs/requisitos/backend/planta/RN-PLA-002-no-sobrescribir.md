---
id: RN-PLA-002
titulo: No sobrescribir ciclos aprobados; vincular reprocesos con el original
tipo: RN
modulo: Planta / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuesta 68; src/planta/; src/calidad/; src/certificados/; src/database/migrations/"
depende_de: [RF-PLA-003, RF-PLA-004]
bloquea: [RF-PLA-011, RF-PLA-016]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. El reproceso se mantiene en RF-PLA-011; B-PLA-011 deriva el hardening de inmutabilidad a RF-PLA-016."
---

# RN-PLA-002 — No sobrescribir ciclos aprobados; vincular reprocesos con el original

**Fuente principal:** `Sterinova-ERP.md` §6: un ciclo aprobado no debe sobrescribirse; un reproceso genera una ejecución nueva vinculada al original.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuesta 68; controladores/servicios de Planta y Calidad, entidad de ciclo y migraciones.

1. **ID:** `RN-PLA-002`.
2. **Título:** No sobrescribir ciclos aprobados; vincular reprocesos con el original.
3. **Tipo:** RN.
4. **Módulo:** Planta / Calidad.
5. **Enunciado:** Un ciclo aprobado conserva sus parámetros y decisiones sin modificación ni eliminación; todo reproceso se registra como un nuevo ciclo vinculado al original.
6. **Reglas asociadas:** Conservar intentos originales fallidos y sus evidencias. Un reproceso no reemplaza el registro anterior y requiere conservar su vínculo y trazabilidad.
7. **Actores y permisos:** Planta crea ciclos; Calidad aprueba/rechaza con permisos separados y confirmación de contraseña para aprobar.
8. **Datos y entidades:** `CicloEsterilizacion` guarda estado, revisor, fecha de revisión, motivo de rechazo y `ciclo_correccion_de_id`; certificado y evaluaciones referencian el ciclo.
9. **Flujo y protección actual:** El controlador de Planta solo expone GET y POST de ciclos. Calidad expone consulta, aprobar y rechazar; esas operaciones solo cambian estado/revisión y exigen ciclo pendiente. No hay ruta normal para editar/eliminar el ciclo ni para establecer el vínculo de corrección en un nuevo ciclo.
10. **Criterios de aceptación:** Bloquear cambios de datos originales tras aprobación; impedir borrado; crear reproceso como nuevo ciclo enlazado; conservar información, evidencias y decisiones previas; auditar autor y fecha de cada acción.
11. **Evidencia en backend:** `CalidadService.aprobar/rechazar` carga el ciclo con bloqueo, verifica `PENDIENTE_CALIDAD` y actualiza estado/revisor/fecha; no modifica mediciones. `PlantaController` no declara PATCH/PUT/DELETE de ciclos.
12. **Evidencia en BD:** Certificados, evaluaciones, materiales procesados y correcciones usan FKs con `ON DELETE RESTRICT`, por lo que el ciclo aprobado con certificado no puede borrarse mientras este exista. No se encontró trigger que impida actualizar los campos de un ciclo aprobado mediante escritura directa en BD.
13. **Brechas derivadas:** La falta de flujo activo de reproceso sigue absorbida por `B-PLA-005` → `RF-PLA-011`. `B-PLA-011` se registra para protección de inmutabilidad a nivel de BD y se asigna a `RF-PLA-016`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿La inmutabilidad debe imponerse también con trigger/controles de BD? ¿Qué campos pueden cambiar por una transición legítima de Calidad y cómo distinguirlos de los datos de ejecución inmutables?
15. **Estado de cobertura:** Parcial. No hay endpoint de edición/borrado y la FK del certificado restringe eliminación; la BD no bloquea actualizaciones directas y el reproceso vinculado no tiene flujo operativo.
16. **Nivel de certeza y límites:** Confirmado en rutas, servicios, entidades y migraciones versionadas. No se consultó una BD desplegada.
