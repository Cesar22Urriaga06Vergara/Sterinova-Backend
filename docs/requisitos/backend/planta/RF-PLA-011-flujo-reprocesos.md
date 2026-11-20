---
id: RF-PLA-011
titulo: Flujo de reprocesos y exclusión de saldos rechazados
tipo: RF
modulo: Planta / Calidad
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63 y 68–69"
fuente_contraste: "src/planta/planta.service.ts; src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/calidad.service.ts"
depende_de: [RF-PLA-003]
bloquea: []
brechas: [B-PLA-005]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-005; políticas de material rechazado y autorización pendientes de RA-PLA-006."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos e incorpora D-PLA-001; tratamiento exacto de saldos sigue abierto."
---

# RF-PLA-011 — Flujo de reprocesos y exclusión de saldos rechazados

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-011`.
2. **Título:** Flujo de reprocesos y exclusión de saldos rechazados.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad / Logística.
5. **Descripción funcional:** Distinguir cantidades intentadas de cantidades válidas/liberadas y crear una ejecución nueva vinculada al ciclo rechazado/abortado cuando se autorice reproceso.
6. **Reglas asociadas:** D-PLA-001: Calidad y Planta aprueban antes de crear reproceso; nuevo ciclo enlazado al original; ciclo abortado no libera por sí mismo; Calidad determina/documenta disposición. No convertir intento fallido en liberación ni sobrescribir su evidencia.
7. **Actores / permisos:** Calidad y Planta deben aprobar previamente; Planta ejecuta el ciclo nuevo; Logística respeta saldos/disposición. Roles/permisos exactos sujetos a matriz RBAC y `RA-PLA-006`.
8. **Datos y entidades:** Ciclo original/nuevo, estado, cantidades por material, motivo, autorizaciones, evaluaciones, evidencias, saldo recuperable y certificados relacionados.
9. **Flujo preliminar:** Rechazo/aborto → decisión documentada de Calidad → aprobación de Calidad y Planta si reproceso → crear ciclo nuevo con referencia al original → procesar y evaluar → conciliar saldo y documentos.
10. **Criterios de aceptación preliminares:** No se crea reproceso sin las dos aprobaciones; ciclo previo permanece inmutable; nuevo ciclo tiene referencia al origen; cantidades rechazadas/abortadas no se cuentan como liberadas; el saldo se ajusta según regla por decidir.
11. **Evidencia en backend:** `PlantaService.createCiclo` acumula cantidades previas incluyendo ciclos rechazados; columna `ciclo_correccion_de_id` existe pero el DTO/servicio no proveen flujo operativo completo.
12. **Persistencia e interfaz:** Ciclo y cantidades procesadas persisten; no se encontró interfaz de reproceso, autorización previa ni conciliación de saldo por disposición.
13. **Brecha asociada:** `B-PLA-005` abierta; acumular cantidades rechazadas como procesadas bloquea operación/reintento.
14. **Preguntas abiertas:** Definir cantidad recuperable, cargas parcialmente abortadas, motivo/evidencia, actualización de orden, nueva evaluación, consecutivo, certificado y relación con inventario/logística (`RA-PLA-006`).
15. **Cobertura preliminar:** Parcial: persisten vínculos/cantidades por ciclo, pero no hay flujo de reproceso y el cálculo de saldo incluye ciclos rechazados.
16. **Certeza y límites:** La regla previa confirmada se registra como D-PLA-001; la mecánica de saldo no está decidida. Evidencia técnica limitada a servicio, entidad y DTO citados; borrador.
