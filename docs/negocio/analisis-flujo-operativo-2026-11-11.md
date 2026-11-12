# Análisis del flujo Comercial → Logística → Planta → Calidad

Fecha: 11 de noviembre de 2026. Estado: análisis para discusión; no es una especificación aprobada ni acredita implementación.

## 1. Lo confirmado en esta conversación

- Comercial valida las características del servicio: esterilización cuando aplique, empaque como PGM y necesidad de recogida. Cotizaciones pertenece a Comercial.
- Logística puede recoger el producto o recibirlo directamente. Registra cantidades y datos que alimentan el acta de servicio.
- Planta ejecuta procesos según recetas por cliente. Existen etapas intermedias adicionales que aún deben identificarse.
- Planta tendrá una bodega propia: registra lo recibido cuando Logística le entrega los insumos solicitados.
- El usuario aclaró que el documento final mencionado para Calidad es el **certificado de esterilización**.
- Se requiere avanzar por partes conectadas, sin implementar todas las entidades simultáneamente.

Las reglas previas de aprobación técnica de protocolos por Calidad permanecen vigentes: validar el alcance con Comercial no equivale a que Comercial apruebe parámetros técnicos.

## 2. Evidencia de los formatos

| Fuente revisada | Qué muestra | Consecuencia para el diseño |
| --- | --- | --- |
| LOGISTICA.xlsm, encabezados de INFORMACION ENTRADA | Esterilización, empaque y transporte separados; recepción con fecha, hora, responsables y cajas | Registrar dimensiones independientes y eventos reales de recepción. |
| LOGISTICA.xlsm, INFORMACION DETALLADA | Producto, lote, cantidad y cajas por línea; grupos repetidos hasta 15 líneas | Conservar detalle por material; no heredar el límite de 15 líneas del formulario. |
| Acta de Servicio.pdf, R-LG-04, v03 | Cantidades y cajas recibidas/entregadas, observaciones de recepción y cliente, referencias a certificado/factura | El acta reúne varios momentos; no puede completarse íntegramente al recibir ni copiar recibido en entregado. |
| Orden de Servicio.pdf, R-ES-02, v03 | Orden de servicio de esterilización; método, empaque, transporte, cantidades y verificación de recepción/entrega | La orden orienta el trabajo y acumula verificaciones; no es el certificado. |
| COT-CEMFA192-1, ejemplo de cotización, pp. 2–3 | Servicio de empaque en doble PGM, esterilización, análisis e informe; condiciones diferentes por concepto | Un solo tipo en la cabecera no describe todo el alcance; cada concepto necesita su proceso, unidad e inclusiones. |
| Ejemplo de Certificado de Esterilizacion.pdf, R-AQ-09, v05 | Cliente, materiales/lotes/empaque, equipo/ciclo, parámetros, controles y responsables | Calidad debe utilizar evidencia de ejecución y trazabilidad del material. |

Se revisaron visualmente los dos PDF escaneados de Orden y Acta; se extrajo texto de cotización y certificado. El XLSM se leyó sin guardarlo ni ejecutar macros. No se importó su historial. Los formatos no enumeran por sí solos todas las etapas de Planta ni acreditan una receta técnica vigente.

## 3. Recorrido propuesto

```text
COMERCIAL: alcance del servicio y cotización aceptada
    → orden / instrucción operativa identificable
    → si hay recogida: programación → recogida → recepción
    → si llega directamente: recepción
LOGÍSTICA: recepción comprobada y apertura del acta
    → entrega identificada a Planta
PLANTA: receta aplicable y etapas registradas
    → revisión de evidencias por Calidad
CALIDAD: liberación y certificado cuando corresponde esterilización
    → Logística: despacho / entrega real y cierre del acta
```

El regreso a Logística para entregar está respaldado por los apartados de salida de los formatos. Su detalle operativo debe concretarse. Un servicio sin esterilización necesita su proceso y documento de cierre aplicables; no se propone generar un certificado de esterilización ficticio. La venta de insumos puede requerir una ruta de despacho sin proceso en Planta, pendiente de definir por servicio.

La orden debe conservar referencia a la versión comercial que la originó. Las cantidades contratadas, esperadas para una entrega, recibidas, procesadas, liberadas y entregadas son hechos distintos. Las diferencias deben tener motivo y responsable, sin sobrescribir el acuerdo comercial.

La recepción directa elimina la recogida, pero no la identificación del cliente, el alcance autorizado ni la revisión de recepción. Si llega producto sin orden previa, hace falta definir una recepción pendiente de conciliación comercial; no se presume autorización para procesarlo.

## 4. Información que debe viajar entre áreas

| Entrega | Información mínima propuesta |
| --- | --- |
| Comercial → Logística | Cliente/sede/contacto; servicio y materiales esperados; esterilización sí/no y método cuando aplique; empaque acordado; quién aporta el empaque; recogida o llegada directa; dirección/ventana cuando corresponda; referencia comercial y responsable. |
| Logística → Planta | Recepción y orden de origen; producto, lote, unidad, cantidades y cajas reales; condición/empaque recibido; diferencias, rechazos y evidencias; entrega/recepción interna con responsables. |
| Planta → Calidad | Receta y versión aplicadas; etapas realizadas, responsables y fechas; materiales/cantidades asignados; consumos; equipos, parámetros y controles aplicables; incidencias y reprocesos. |
| Calidad → Logística | Materiales y cantidades liberados, retenidos o rechazados; certificado aplicable; restricciones para despacho. |

PGM debe distinguirse como requisito comercial, empaque observado en recepción e insumo realmente utilizado. Un indicador «con PGM» no explica tipo, presentación, cantidad, proveedor del empaque ni su consumo.

## 5. Recetas y etapas intermedias

Se propone una receta identificada por cliente/producto/servicio y versión, con aplicabilidad técnica. No basta el nombre del cliente si ese cliente entrega productos distintos.

Cada etapa deberá indicar: entrada requerida, responsable, operación, datos/evidencias, insumos, salida y condición para continuar. Posibles etapas a contrastar con la operación son inspección, preparación, acondicionamiento, empaque/sellado, procesamiento, secado/aireación y controles. **Son ejemplos para levantar el proceso, no una secuencia confirmada ni instrucciones técnicas.**

Separar receta prevista de ejecución real. Conservar versiones históricas y las incidencias; un reproceso debe enlazarse al intento anterior. Calidad interviene también en la aprobación de protocolos y tratamiento de desviaciones, aunque la revisión final esté al final del recorrido.

## 6. Bodega de Planta e inventario

Se propone separar dos controles:

- **Producto del cliente en custodia:** dueño, material, lote, ubicación, cantidad y estado del proceso; no es inventario propio disponible para vender o consumir.
- **Insumos de Sterinova:** referencia, unidad, lote/vencimiento cuando corresponda, bodega, disponibilidad, transferencias y consumos.

Flujo propuesto: solicitud de Planta → preparación/entrega de Logística → confirmación de recepción en Planta → disponibilidad en bodega de Planta → consumo asociado al proceso.

La solicitud no aumenta existencias. La entrega de Logística y recepción de Planta deben referirse a una sola transferencia para evitar duplicados. Si ocurren en momentos distintos, conservar cantidad en tránsito; registrar entregas parciales y diferencias. El consumo reduce existencias de Planta; el traslado entre bodegas conserva el total de la empresa. Devoluciones, mermas y ajustes requieren movimientos con motivo, no edición directa de saldos.

Ejemplo ilustrativo: Logística envía 100 bolsas PGM y Planta confirma 98. Deben quedar 98 recibidas y 2 pendientes de conciliación, sin crear 100 disponibles en ambas bodegas. Si consume 20 de las 98, quedan 78 disponibles antes de otros movimientos.

## 7. Brechas verificadas en el código actual

| Hallazgo | Evidencia local | Efecto |
| --- | --- | --- |
| Cotizaciones ya tiene ruta en Comercial | Frontend: src/lib/navigation.ts, /comercial/cotizaciones | El cambio principal es de alcance y traspaso operativo, además de cualquier ajuste visual necesario. |
| La orden se crea desde Logística y exige estado APROBADA | src/logistica/logistica.service.ts, createOrden | Debe conciliarse con la aceptación/emisión comercial documentada; no confundir aprobación interna con aceptación del cliente. |
| Una orden por cotización | src/ordenes-servicio/entities/orden-servicio.entity.ts, cotizacion_id único y OneToOne; validación en createOrden | Contradice el requisito previo de varias órdenes por sede o entregas parciales. |
| Secuencia obligatoria PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA | src/logistica/logistica.service.ts, TRANSICIONES_ESTADO | Falta la ruta de recepción directa. |
| Un tipo de servicio en cabecera; ítems sin proceso/unidad estructurados | src/cotizaciones/entities/cotizacion.entity.ts y cotizacion-item.entity.ts | Insuficiente para expresar todos los conceptos del ejemplo de doble PGM y análisis. |
| Materiales tienen una cantidad entera y empaque como texto | src/ordenes-servicio/entities/orden-servicio-material.entity.ts | No separa recepción/entrega/cajas; requiere unidades y decimales cuando aplique. |
| Planta registra ciclos EtO/Vapor; protocolo por método/versión | src/planta/planta.service.ts y entities/protocolo-esterilizacion-version.entity.ts | No representa todavía una receta completa por cliente con todas sus etapas. |
| Cada ciclo referencia una orden y su registro marca toda la orden PROCESADO | src/planta/entities/ciclo-esterilizacion.entity.ts y planta.service.ts | Falta asignación por cantidades para varias órdenes/cargas y procesamiento parcial. |
| Calidad aprueba y llama la emisión del certificado | src/calidad/calidad.service.ts, aprobar | Coincide con la aclaración del usuario, pero no demuestra que todas las etapas previas ya existan. |
| No aparece módulo de inventario/bodegas en la composición revisada | src/app.module.ts y mapa del backend | Se necesita diseñar movimientos, transferencias y consumos. |

La inspección fue estática sobre el checkout existente, que contiene cambios previos. No se ejecutaron pruebas de operación ni se consultó la base de datos; estos hallazgos no son una auditoría exhaustiva.

## 8. Camino de trabajo recomendado

Recomendación: avanzar por un caso de servicio completo, concretando primero cada traspaso. Terminar módulos aislados dejaría sus conexiones sin comprobar; abordar todas las tablas simultáneamente ampliaría demasiado el alcance.

1. **Comercial: ficha del servicio.** Elegir un caso real; definir qué se contrata, esterilización, PGM, unidades, recogida y origen de la orden. Salida: ejemplo de información que Logística recibe sin reinterpretar texto libre.
2. **Logística: recepción y acta.** Probar el mismo caso con recogida y con llegada directa; diferenciar cantidades previstas/reales, recepción parcial y rechazo. Salida: recepción trazable y entrega a Planta.
3. **Bodega de Planta, alcance mínimo.** Usar los insumos que ese caso requiere; solicitud, transferencia, recepción, saldo y consumo. Salida: reconciliar qué entregó Logística y qué recibió/usó Planta.
4. **Planta: receta de ese caso.** Levantar una a una las etapas reales, registros y responsables; vincular consumos y cantidades procesadas. Salida: expediente de ejecución completo, incluidos procesos intermedios.
5. **Calidad y entrega.** Revisar el expediente, liberar cantidades, emitir certificado aplicable y cerrar entrega/acta. Salida: rastrear el certificado hasta materiales recibidos y procesos ejecutados.
6. **Ampliar variantes.** Sin esterilización, sin PGM, lavandería, insumos, servicios combinados, parciales, múltiples cargas y reprocesos. Sus relaciones deben preverse desde el primer paso, aunque su ejecución se incorpore después.

Por cada paso: datos y responsable → estados/eventos → conexión con el anterior → ejemplo de aceptación → implementación focalizada cuando corresponda. No es necesario construir un catálogo corporativo completo para validar el primer caso.

## 9. Próxima definición

Empezar con una ficha Comercial de un servicio real que use PGM y esterilización, indicando si se recoge o llega directamente. Después levantar sus etapas intermedias con los formatos correspondientes, sin asumir que el certificado contiene toda la receta.

Quedan pendientes el significado y cardinalidad institucional de Orden/Acta, quién aporta el PGM, las etapas reales por servicio y el documento de cierre para servicios sin esterilización. La aclaración de Calidad como emisor del certificado ya quedó resuelta y no requiere repetirse.

## 10. Referencia externa

Como referencia técnica general, las [recomendaciones de CDC, apartados 13, 16 y 17](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/summary-recommendations.html) relacionan compatibilidad del empaque, registros de ciclo/operador/controles y trazabilidad de cargas. Apoyan conservar esa evidencia separada del documento comercial. No determinan las recetas de Sterinova ni se presentan como normativa colombiana aplicable.

No se modificaron código, formatos originales, datos, macros ni migraciones. Este documento conserva hallazgos y propuestas sin sustituir las reglas maestras aprobadas.
