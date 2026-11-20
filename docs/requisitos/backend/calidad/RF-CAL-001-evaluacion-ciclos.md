---
id: RF-CAL-001
titulo: Evaluar ciclos según parámetros y protocolos
tipo: RF
modulo: Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 72–74; src/calidad/; src/certificados/; frontend app/(erp)/calidad/"
depende_de: [RF-PLA-004]
bloquea: [RF-CAL-005]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CAL-001 se deriva a RF-CAL-005 para exponer la sugerencia automática en la UI."
---

# RF-CAL-001 — Evaluar ciclos según parámetros y protocolos

**Fuente principal:** `Sterinova-ERP.md` §3 (Calidad: revisión de parámetros, protocolos y evaluación de resultados) y §6 (Calidad debe aprobar antes del despacho).

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 72–74; `src/calidad/`, `src/certificados/` y pantalla frontend de revisión de Calidad.

1. **ID:** `RF-CAL-001`.
2. **Título:** Evaluar ciclos según parámetros y protocolos.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Calidad revisa los parámetros medidos en el ciclo conforme a la versión aplicable del protocolo y registra su decisión explícita. La comparación automatizada apoya la evaluación, pero no libera materiales ni sustituye la aprobación humana.
6. **Reglas asociadas:** Aplicar protocolo versionado; comparar mediciones contra rangos; conservar medición y criterio; no aprobar si falta una evaluación aplicable o el valor no cumple. `NO_APLICA` requiere justificación según la regla de negocio, derivada a RF-PLA-013.
7. **Actores y permisos:** Usuario autorizado con `calidad.ciclos.ver` consulta; usuario con `calidad.aprobar` o `calidad.rechazar` evalúa. El operador que ejecutó el ciclo no puede aprobarlo.
8. **Datos y entidades:** `CicloEsterilizacion` guarda mediciones, estado, método, `protocolo_version_id`, revisor y fecha; `ProtocoloEsterilizacionVersion` conserva especificaciones versionadas; `CicloParametroEvaluacion` guarda parámetro, criterio, evaluador y fecha.
9. **Flujo:** El ciclo pasa a `PENDIENTE_CALIDAD`; Calidad lo revisa y envía criterios/opciones. En aprobación, el backend valida las mediciones contra rangos y genera el certificado; después cambia el estado a `APROBADO`. En rechazo se registra motivo y estado `RECHAZADO`.
10. **Criterios de aceptación:** No revisar ciclos fuera de estado pendiente; utilizar la versión vinculada; no aprobar sin todas las evaluaciones aplicables, mediciones finitas y rangos cumplidos; impedir autoaprobación; conservar identidad/fecha de aprobación; no permitir que el cálculo automático libere por sí solo.
11. **Evidencia en backend:** `CalidadController` expone pendientes, consulta, aprobar y rechazar; `CalidadService.aprobar` verifica contraseña, independencia, estado y transacción. `prepararInformacionTecnica` contrasta las mediciones y opciones del protocolo antes de generar el certificado.
12. **Evidencia de persistencia e interfaz:** Los datos estructurados del ciclo, evaluaciones y protocolo versionado persisten en entidades relacionadas. La pantalla `calidad/revisar/[ciclo_id]` requiere selección manual por Calidad y contraseña; no muestra el resultado calculado como sugerencia previa.
13. **Brechas derivadas:** `B-CAL-001` se asigna a `RF-CAL-005`: mostrar en UI la sugerencia automática de cumplimiento antes de la decisión. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Confirmar diseño visual y nivel de detalle de la sugerencia (por parámetro y total), y cómo presentar resultados fuera de rango sin inducir a sobrescritura. La justificación de `NO_APLICA` permanece en RF-PLA-013.
15. **Estado de cobertura:** Parcial. La validación de rangos ocurre automáticamente durante la aprobación y Calidad decide manualmente; falta exponer la sugerencia anticipada en la interfaz.
16. **Certeza y límites:** Confirmado en controladores, DTOs, servicio, generador de información técnica y frontend inspeccionados; no se ejecutaron pruebas ni se verificó una base desplegada.
