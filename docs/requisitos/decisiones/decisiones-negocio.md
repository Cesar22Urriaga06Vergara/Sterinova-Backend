# Decisiones de negocio

Solo se registran decisiones explícitamente validadas por el usuario. Las preguntas abiertas permanecen en `por-aclarar/`.

| ID | Fecha | Decisión | Requisitos relacionados |
|---|---|---|---|
| D-COM-001 | 2026-11-18 | `RF-COM-001` se limita a registrar y consultar clientes y queda Cubierto. El ciclo activo/inactivo se separa en `RA-COM-001`; la importación masiva se analiza como `RF-COM-009`. | `RF-COM-001`, `RA-COM-001`, `RF-COM-009` |
| D-CAL-001 | Según registro de decisiones prioritarias | En una desviación que afecta un lote dentro de un ciclo compartido, se retiene el lote afectado; los demás lotes se evalúan de forma independiente. Si no es posible identificar con fiabilidad las unidades afectadas, se retiene el lote completo. La liberación de lotes conformes antes de cerrar la investigación requiere autorización documentada del Jefe de Calidad. | `RF-CAL-002`, `RF-CAL-006`, `RA-CAL-001`, `RF-CER-001`, `RF-CER-002` |
| D-CAL-002 | Según registro de decisiones prioritarias | Calidad determina el destino del material rechazado. Se admiten devolución al cliente, reproceso, destrucción u otro destino determinado por Calidad. Devolución y destrucción requieren constancia con responsable, fecha y evidencia. | `RF-CAL-002`, `RF-LOG-013`, `RA-CAL-001`, `RA-LOG-003` |
| D-PLA-001 | Según registro de decisiones prioritarias | Un reproceso requiere aprobación previa de Calidad y Planta y se registra en un ciclo nuevo vinculado al ciclo rechazado/original. Para un ciclo abortado, Calidad determina y documenta la disposición; abortar no libera automáticamente el material. Si se reprocesa, aplica la misma autorización previa y se crea un ciclo nuevo vinculado al abortado. | `RF-PLA-003`, `RF-PLA-011`, `RA-PLA-006` |
| D-LOG-001 | Según registro de decisiones prioritarias | Una orden se cierra cuando las cantidades aceptadas están liberadas y todo saldo restante tiene destino final registrado y la evidencia exigida completa. El procesamiento por sí solo no permite cerrar la orden. | `RF-LOG-005`, `RF-LOG-019`, `RA-LOG-004`, `RF-CAL-002` |

## Alcance y pendientes de precisión

Las decisiones D-CAL-001 a D-LOG-001 se transcriben del [registro de decisiones prioritarias](../por-aclarar/decisiones-prioridad-1-calidad-planta-logistica.md), que las identifica como confirmadas explícitamente por el usuario. La incorporación documental no cambia el estado de cobertura técnica ni aprueba la implementación. Las RA relacionadas conservan abiertos los detalles que el registro declara pendientes, como formatos de evidencia, saldos exactos, permisos de «otro destino» y conciliación entre lotes, certificados y entregas parciales. La instrucción de incorporación declara expresamente que los bloques funcionales de Logística y Planta no están validados como alcance operativo; las fichas técnicas aprobadas de esos módulos no sustituyen esa validación.

La fuente cita `RF-CAL-002-aprobar-rechazar-retener.md`; el archivo vigente es `RF-CAL-002-aprobacion-materiales.md`. Los enlaces activos usan el nombre vigente.
