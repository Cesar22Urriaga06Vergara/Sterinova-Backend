---
id: RF-CAL-006
titulo: Implementar estado de Cuarentena y rechazo por material/lote
tipo: RF
modulo: Calidad / Planta / Logística
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 70, 76–79"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/; src/logistica/"
depende_de: [RF-CAL-002, RA-CAL-001]
bloquea: []
brechas: [B-CAL-002]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CAL-002; definición de políticas permanece en RA-CAL-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos e incorpora D-CAL-001 y D-CAL-002, manteniendo pendientes los detalles de evidencia/riesgo."
---

# RF-CAL-006 — Implementar estado de Cuarentena y rechazo por material/lote

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CAL-006`.
2. **Título:** Implementar estado de cuarentena y rechazo por material/lote.
3. **Tipo:** RF.
4. **Módulo:** Calidad / Planta / Logística.
5. **Descripción funcional:** Registrar retención, evaluación, liberación parcial o disposición de material por lote/cantidad sin tratar necesariamente toda la carga de un ciclo como una sola unidad.
6. **Reglas asociadas:** D-CAL-001: retener el lote afectado; si no se identifican con fiabilidad las unidades, retener el lote completo; evaluar por separado otros lotes; liberar lotes conformes antes del cierre de investigación requiere autorización documentada del Jefe de Calidad. D-CAL-002: Calidad determina disposición; devolución o destrucción requieren responsable, fecha y evidencia. No liberar ni certificar material no liberado.
7. **Actores / permisos:** Calidad decide evaluación, liberación y destino; Planta/Logística ejecutan las acciones autorizadas. Los permisos específicos y aprobaciones excepcionales deben coordinarse con RBAC y `RA-CAL-001`.
8. **Datos y entidades:** Ciclo, orden, lote/material/cantidad afectada, estado de retención, motivo, resultado, decisión de Calidad, aprobador, fecha, evidencia y disposición final.
9. **Flujo:** Registrar desviación/resultado → identificar lote/unidades afectados → retener el alcance correspondiente → evaluar lotes separadamente → documentar autorización y disposición → habilitar despacho únicamente para cantidades liberadas.
10. **Criterios de aceptación preliminares:** Cantidad retenida no puede certificarse ni despacharse; lotes no afectados conservan evaluación independiente; liberación parcial guarda autorización del Jefe de Calidad; devolución/destrucción no cierran sin responsable, fecha y evidencia.
11. **Evidencia en backend:** El ciclo tiene estados globales de pendiente/aprobado/rechazado; el servicio actual rechaza/aprueba el ciclo. No se encontró modelo de cuarentena/disposición de material individual.
12. **Persistencia e interfaz:** Materiales de orden conservan datos por línea; no se encontró asociación operacional de estado de retención y disposición por lote/cantidad, ni vista de cuarentena individual. El modelo y la pantalla quedan por diseñar.
13. **Brecha asociada:** `B-CAL-002` sigue asignada a esta ficha y `RA-CAL-001`; la política general está parcialmente resuelta por D-CAL-001/002, pero criterios técnicos/evidencias siguen pendientes.
14. **Preguntas abiertas:** Definir evidencia suficiente por destino, evaluación de riesgo adicional, autorizaciones para «otro destino», estados y conciliación con CAPA, reproceso, certificado, inventario y entregas.
15. **Cobertura preliminar:** Faltante para cuarentena/disposición por lote o cantidad; el flujo actual decide a nivel de ciclo.
16. **Certeza y límites:** Las decisiones citadas provienen del registro confirmado; el análisis de persistencia se limita a entidades/servicios señalados. No se fija diseño ni esquema sin cerrar dependencias; borrador pendiente de validación.
