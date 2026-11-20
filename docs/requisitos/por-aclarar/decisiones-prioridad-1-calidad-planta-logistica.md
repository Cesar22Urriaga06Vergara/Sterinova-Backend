# Instrucción de incorporación — Decisiones de Prioridad 1

**Proyecto:** Sterinova ERP  
**Fuente contractual:** `Sterinova-ERP.md`  
**Propósito:** entregar al agente que trabaja en el repositorio el registro validado en conversación para actualizar la documentación activa de requisitos y decisiones pendientes.

## Instrucción para el agente receptor

Incorpora las decisiones confirmadas de este documento en la documentación activa bajo `docs/requisitos/`, manteniendo la trazabilidad a los requisitos y brechas existentes. Revisa primero `docs/requisitos/README.md`, `docs/requisitos/brechas/registro-brechas.md`, las fichas indicadas en «Documentos relacionados» y las instrucciones del repositorio.

Al realizar la incorporación:

1. Registra como confirmadas **solo** las decisiones listadas en «Decisiones confirmadas». Conserva el texto y sus condiciones; no conviertas recomendaciones anteriores del asistente en política aprobada.
2. No cambies el estado de cobertura técnica ni marques requisitos derivados como implementados. Una decisión de negocio confirma la regla operativa, no el diseño de datos/API, la cobertura del frontend/backend ni la aceptación de una implementación.
3. No marques como aprobado ningún bloque funcional que no haya sido validado explícitamente por el usuario. Las matrices frontend de Logística y Planta permanecen como diagnósticos observados, según su estado real en la documentación central.
4. Consolida o enlaza las decisiones en lugar de duplicar fichas. Si varios RA expresan la misma pregunta (por ejemplo, cuarentena/rechazo en Calidad y Logística), deja un dueño documental claro y referencias cruzadas desde las otras fichas.
5. Conserva como pendientes los detalles que no se decidieron, incluidos los señalados expresamente al final de este documento.
6. Actualiza índices, relaciones de `depende_de`/`bloquea` y el registro de brechas solo cuando sea necesario para reflejar la decisión. No renumeres IDs existentes.
7. No cambies código, esquema, migraciones ni datos. Esta instrucción cubre la incorporación documental; cualquier implementación se planificará después en etapas con criterios de aceptación y verificaciones integradas.
8. Al terminar, informa qué archivos se actualizaron, qué decisiones se registraron, cuáles permanecen abiertas y cualquier inconsistencia encontrada. No declares cerrado el análisis global.

## Decisiones confirmadas

Estas respuestas fueron confirmadas explícitamente por el usuario en la conversación. Deben registrarse como reglas de negocio acordadas para orientar el análisis y el diseño posterior.

### 1. Alcance de cuarentena ante una desviación

**Escenario validado:** un ciclo contiene varios lotes; falla el indicador biológico de uno y los demás presentan resultados conformes.

- Se retiene **solo el lote afectado**, no automáticamente todo el ciclo.
- Los demás lotes pueden evaluarse por separado.
- Si no se pueden identificar con fiabilidad las unidades afectadas dentro del lote, se retiene **el lote completo**.

**Consecuencia documental/técnica:** representar retención y destino al menos por lote, y permitir que Calidad determine el estado del lote sin convertir el ciclo completo en una sola unidad indivisible. La regla no autoriza liberar material sin la decisión y evidencia requeridas.

### 2. Liberación parcial de lotes conformes

- Los lotes conformes de un ciclo pueden liberarse antes de cerrar la investigación del lote afectado.
- La liberación parcial requiere **autorización documentada del Jefe de Calidad**.

**Consecuencia:** el sistema necesitará registrar qué lotes/cantidades se liberan, la decisión y el responsable autorizador, manteniendo retenido el lote investigado. Los campos exactos y soportes documentales siguen por definir.

### 3. Autoridad para disponer el material rechazado

- **Calidad determina el destino** del material rechazado.
- El usuario confirmó “todos” los destinos discutidos: devolución al cliente, reproceso, destrucción y otro destino que Calidad determine.
- Toda devolución o destrucción debe dejar constancia.

**Consecuencia:** conservar una disposición explícita por lote/cantidad y motivo. «Otro destino» requiere descripción para no perder significado operacional. No asumir todavía un catálogo cerrado de destinos ni validaciones específicas de cada uno.

### 4. Evidencia de la disposición

- Para devolución o destrucción, debe registrarse **todo lo relevante**.
- Como mínimo, otra respuesta confirmada exige constancia con responsable, fecha y evidencia.

**Interpretación acotada:** responsable, fecha y evidencia son obligatorios; el contenido y formato de la evidencia dependen del caso y deben ser suficientes para acreditar el destino. No se confirmaron tipos de archivo, firma, formato de acta, retención ni tamaños máximos.

### 5. Autorización y vínculo del reproceso

- El reproceso requiere aprobación de **Calidad y Planta antes de crear el reproceso**.
- El nuevo ciclo queda **vinculado al ciclo rechazado/original**.

**Consecuencia:** no tratar un reproceso como edición o reemplazo del ciclo rechazado. Preservar los resultados y evidencias del ciclo original y asociar el nuevo intento con su autorización y ciclo origen.

### 6. Ciclos abortados

- Ante un ciclo abortado, **Calidad determina y documenta la disposición** del material afectado.
- Las salidas consideradas son retener para investigar, reprocesar, devolver o destruir, según el caso.
- Planta participa en la ejecución cuando corresponda.
- No se libera automáticamente el material por el solo hecho de abortar.
- Si se decide reprocesar, aplica la aprobación previa de Calidad y Planta y se registra un ciclo nuevo vinculado al abortado.

### 7. Cierre de la orden

- La orden solo se cierra cuando las cantidades aceptadas estén liberadas y todo saldo restante tenga **destino final registrado y evidencia exigida completa**.
- El procesamiento terminado, por sí solo, no basta para cerrar.

**Consecuencia:** el cierre debe conciliar cantidades aceptadas, liberadas, retenidas, reprocesadas, devueltas o destruidas; no declarar resuelta una cantidad con destino pendiente o evidencia incompleta.

## Temas que continúan pendientes

No asumir ni completar por inferencia:

- Qué datos y documentos concretos exige «todo lo relevante» por tipo de disposición, y cómo se firma, adjunta, conserva y consulta la evidencia.
- Quién puede escoger/aprobar «otro destino», además de la competencia general de Calidad para determinar destinos.
- Si las decisiones de cuarentena/liberación parcial exigen evaluación de riesgo adicional o aprobación distinta del Jefe de Calidad en casos especiales.
- Qué saldos exactos se liberan para reproceso tras rechazo o aborto; tratamiento de ciclos abortados con carga parcialmente procesada.
- Cómo se refleja una liberación, devolución, destrucción o reproceso en cantidades disponibles, certificados, entregas parciales y saldos logísticos.
- Cómo se particionan por cliente los ciclos compartidos y qué cantidad se declara en cada certificado.
- Capacidad/unidades de equipos, clasificación de lavandería, catálogo de equipos, mantenimiento/calibración, consecutivos, Tanda, recetas, insumos y microbodega.
- Ámbitos/roles de usuarios, vista integral de trazabilidad y cobertura frontend/backend.
- Validación funcional de los bloques de Logística y Planta: el usuario indicó que el Bloque 2 logístico no debe considerarse requisito funcional aprobado. Mantener también la cobertura E2E descrita como simulada, sin atribuir integración real.

## Documentos relacionados que deben revisarse

- `docs/requisitos/por-aclarar/RA-CAL-001-politicas-cuarentena.md`
- `docs/requisitos/por-aclarar/RA-PLA-006-politicas-reproceso.md`
- `docs/requisitos/por-aclarar/RA-LOG-003-politicas-rechazo.md`
- `docs/requisitos/por-aclarar/RA-LOG-004-cierre-ordenes.md`
- `docs/requisitos/backend/calidad/RF-CAL-002-aprobar-rechazar-retener.md` (confirmar nombre exacto en el índice antes de enlazar)
- `docs/requisitos/backend/planta/RF-PLA-003-distribucion-cantidades.md`
- `docs/requisitos/backend/planta/RF-PLA-011-flujo-reprocesos.md`
- `docs/requisitos/backend/logistica/RF-LOG-019-entregas-acumulables.md`
- `docs/requisitos/brechas/registro-brechas.md`
- `docs/requisitos/README.md`

La lista es de referencias para contraste; no significa que todos esos documentos tengan que modificarse. El agente debe verificar sus rutas actuales y evitar crear links rotos.

## Próxima etapa después de incorporar estas decisiones

1. Mostrar al usuario el resumen documental incorporado y las preguntas todavía abiertas de Prioridad 1.
2. Continuar la ronda de negocio en bloques de hasta cinco preguntas, sin volver a pedir validación de una decisión que ya fue confirmada explícitamente.
3. Mantener los bloques y requisitos no confirmados como pendientes.
4. Con las respuestas restantes, proponer etapas de implementación que crucen frontend/backend/datos y definan criterios de aceptación y verificaciones integradas para reducir errores.
5. No iniciar cambios de código hasta que el usuario defina/autorice el alcance de implementación por etapas.
