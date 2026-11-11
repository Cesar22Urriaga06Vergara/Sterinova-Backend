# Auditoría funcional y oportunidades del ERP Sterinova

Fecha de corte y consulta de fuentes externas — 11 de noviembre de 2026.

## 1. Resumen Ejecutivo

El ERP dispone de una base funcional para cotizaciones, órdenes, materiales recibidos, ciclos EtO/Vapor, revisión de Calidad y certificados PDF con snapshot. La autorización por ámbitos está en transición y la administración de asignaciones ha avanzado después del roadmap original. El mayor trabajo pendiente consiste en completar el control operativo del material y de la decisión de liberación. El código incorpora controles reales de concurrencia, evaluación física y conservación documental que conviene extender.

Los tres hallazgos prioritarios son los siguientes.

1. **La liberación carece de una comprobación estructurada del resultado biológico y de independencia del aprobador.** BI y CI son cadenas de texto. La aprobación verifica contraseña, estado pendiente y evaluación física, pero el recorrido examinado no compara operador y aprobador ni exige un resultado BI negativo tipado. Las reglas M6 exigen esos controles. La consecuencia potencial es una aprobación técnicamente aceptada por la aplicación con evidencia biológica insuficiente o por la misma persona que registró el ciclo. Es un hallazgo estático que requiere una prueba negativa aislada para confirmar el comportamiento HTTP completo. Evidencia en [Calidad](../src/calidad/calidad.service.ts), [evaluación técnica](../src/certificados/informacion-tecnica.ts), [DTO de ciclo](../src/planta/dto/create-ciclo.dto.ts) y [reglas M6](negocio/reglas-maestras.md#modulo-6).

2. **La trazabilidad está centrada en una orden por ciclo y en todos los materiales de esa orden.** Falta asignar cantidades de cada material a cargas específicas y conservar saldos, rechazos parciales y reprocesos. El certificado copia los materiales de la orden. Esta estructura limita la reconstrucción exacta de cargas multicliente y la identificación del material afectado por una incidencia. Evidencia en [entidad de ciclo](../src/planta/entities/ciclo-esterilizacion.entity.ts), [materiales recibidos](../src/ordenes-servicio/entities/orden-servicio-material.entity.ts) y [emisión](../src/certificados/certificados.service.ts).

3. **Las capacidades de Planta y Lavandería requieren controles operativos adicionales.** El equipo se captura como texto y los protocolos se seleccionan principalmente por método y versión. El flujo de ciclos solo admite EtO/Vapor. Las capacidades futuras de lavandería aparecen en semillas RBAC, mientras su proceso específico sigue pendiente. Se necesita catálogo de equipos, habilitación temporal, protocolos por producto/empaque y un flujo de lavandería con liberación definida. Evidencia en [Planta](../src/planta/planta.service.ts), [modelo del ciclo](../src/planta/entities/ciclo-esterilizacion.entity.ts), [semillas](../src/database/migrations/1794312001000-SeedBackendRoles.ts) y [reglas maestras](negocio/reglas-maestras.md).

### Contexto empresarial contrastado

Sterinova publica una capacidad instalada EtO de **21.300 litros**, operación continua, esterilización por vapor, lavandería farmacéutica y comercialización de equipos. La cifra pública corresponde al total instalado. Para convertirla en capacidad planificable se requieren equipos, cargas compatibles, duración de procesos, aireación, mantenimiento y disponibilidad. La empresa publica certificaciones ISO 9001 e ISO 13485 y describe para esta última el servicio de esterilización industrial de dispositivos médicos. Las publicaciones son evidencia corporativa. Queda pendiente verificar certificados, sedes, vencimientos y alcance contractual con los documentos controlados de la empresa. [Sterinova](https://sterinova.co/) · [Quiénes somos](https://sterinova.co/quienes-somos/).

La página corporativa de lavandería describe áreas ISO 5 de ensamble/acondicionamiento. La extracción directa falló durante esta revisión y la referencia ISO 8 aportada en el encargo queda pendiente de corroboración documental. Las clases ambientales concretas deben validarse con los informes vigentes de clasificación y calificación antes de configurar controles en el ERP. [Lavandería Sterinova](https://sterinova.co/lavanderia-dotacion-farmaceutica-2/).

### Alcance y método

El [inventario documental](inventario-documental.md) aporta 134 fichas del corte anterior, incluidos documentos históricos y ejemplos. Esta auditoría cruza las fuentes funcionales vigentes, el roadmap, los informes posteriores y los recorridos de código más relevantes. La profundidad de revisión es mayor en logística, ciclos, Calidad y certificados. La revisión de documentos históricos se apoya en el inventario existente. No se realizó una nueva lectura integral de los 134 originales ni una validación ejecutada de todas las funcionalidades.

«Implementada» identifica comportamiento visible en código. «Parcial» identifica una capacidad con controles relevantes pendientes. «En diseño» identifica reglas o propuestas documentadas. «Pendiente» identifica una capacidad sin implementación localizada en los recorridos examinados. Las conclusiones describen el árbol de trabajo con sus cambios locales. La base productiva, los equipos físicos y las prácticas humanas quedan pendientes de verificación. Los resultados de pruebas publicados en reportes anteriores conservan su fecha y procedencia.

## 2. Análisis de Brechas (Gap Analysis)

### Referencias del sector y marco normativo

ISO 13485 establece requisitos de gestión de calidad para dispositivos médicos y servicios relacionados. El análisis utiliza su descripción oficial pública y debe complementarse con la copia controlada del estándar para una evaluación cláusula por cláusula. Las recomendaciones de arquitectura de este informe son propuestas derivadas de las brechas observadas. La certificación del sistema de gestión requiere evidencia organizacional y evaluación competente. [ISO 13485](https://www.iso.org/iso-13485-medical-devices.html).

ISO 11135:2014 continúa publicada y fue confirmada en 2024. Su alcance comprende desarrollo, validación y control rutinario de procesos EtO industriales y sanitarios. El catálogo anuncia una revisión y registra una enmienda de 2018. Calidad debe mantener una matriz de versiones aplicables a sus procesos. [ISO 11135](https://www.iso.org/standard/56137.html).

La Resolución 914 de 2025 fue publicada el 3 de julio de 2025 y su artículo 15 fija vigencia dieciocho meses después, **3 de enero de 2027**. Al corte de esta auditoría está en transición. Incluye prestadores y operadores externos que contratan empaque, esterilización, transporte y entrega de DMER. Excluye dispositivos de un solo uso y otros procedimientos definidos en su artículo 1. La aplicabilidad a cada contrato de Sterinova debe documentarse por actividad. Sus artículos 12 y 14 regulan transitorios y derogatorias. El análisis industrial exige además revisar el régimen pertinente de dispositivos médicos y el alcance de las autorizaciones de la empresa. [Resolución 914](https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_0914_2025.htm) · [Decreto 4725](https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_4725_2005.htm).

Como referencia técnica hospitalaria, CDC describe monitoreo mecánico, químico y biológico, registros de cargas y actuaciones ante resultados positivos. Su aplicación debe adaptarse al método, dispositivo, instrucciones del fabricante y protocolo validado. El ERP necesita conservar esas condiciones de aplicación. Los tiempos de incubación y los límites numéricos deben proceder del protocolo aprobado y del indicador utilizado. [CDC](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/sterilizing-practices.html).

### Comparación de soluciones disponibles en la región

| Solución | Capacidad publicada | Aplicación al ERP |
| --- | --- | --- |
| Getinge T-DOC Select | Seguimiento de instrumentos y bandejas, personal, reprocesamiento, reparaciones, alertas por pasos omitidos y retirada ante eventos adversos. Incluye registro de datos de equipos. | Adoptar identificación persistente, historia de eventos, control de pasos y búsqueda inversa de cargas afectadas. [Getinge](https://www.getinge.com/lat/productos/t-doc-select/). |
| Interlab | Trazabilidad para centrales y quirófanos, identificación UDI mediante láser, Micro ID y RFID. Declara presencia en Colombia y varios países latinoamericanos. | Evaluar códigos y lectura en recepción, carga y despacho según materiales y volumen. [Interlab](https://interlabd.com/). |
| Philips Tasy | Integración de procesos clínicos, administración, suministros y finanzas. | Vincular pedidos, servicios, inventarios y costos con identificadores compartidos. La página general no acredita una integración específica con los equipos de Sterinova. [Philips](https://www.philips.com.lb/en/healthcare/resource-catalog/landing/tasy). |
| SOUL MV | Gestión integrada de procesos y datos hospitalarios mediante módulos. | Adoptar consistencia entre operaciones y gestión empresarial, priorizando interoperabilidad útil para clientes institucionales. El detalle del flujo de esterilización requiere documentación específica del proveedor. [MV](https://mv.com.br/mvsistemas/es/solucao/soul-mv). |

La selección es una muestra de referencias públicas pertinentes. La investigación consultada carece de cifras comparables para establecer un ranking de liderazgo o participación de mercado.

### Matriz funcional

Las referencias externas de las filas remiten a las fuentes anteriores. Las referencias internas enlazan los archivos que sustentan el estado.

| Funcionalidad | Estado en Sterinova | Estándar del Sector | Brecha Detectada |
| --- | --- | --- | --- |
| G01. Genealogía material–orden–ciclo | **Parcial.** Materiales con lote, cantidad y empaque, ciclo con un orden_id. | Seguimiento de objetos y reprocesamientos, según Getinge. | Falta relación de asignaciones por cantidad para cargas parciales y multiórdenes. [Modelo](../src/planta/entities/ciclo-esterilizacion.entity.ts). |
| G02. Recepciones y órdenes parciales | **Parcial.** createOrden rechaza una segunda orden de la misma cotización. | Continuidad entre pedido, entrega y procesamiento, inferida de gestión integrada y reglas M4. | La unicidad actual impide entregas parciales documentadas como objetivo. [Logística](../src/logistica/logistica.service.ts). |
| G03. Indicadores biológicos | **Parcial.** Texto obligatorio, copiado al certificado. | Monitoreo biológico y respuesta documentada, CDC, más M6. | Faltan resultado tipado, lote/caducidad, ubicación, incubación, controles, lectura, evidencia y decisión explícita. El texto no bloquea por resultado positivo o pendiente. [DTO](../src/planta/dto/create-ciclo.dto.ts) · [Emisión](../src/certificados/certificados.service.ts). |
| G04. Indicadores químicos | **Parcial.** Campo libre obligatorio. | Identificación e interpretación de indicadores según proceso, CDC. | Faltan tipo, ubicación, lote, resultado verificable y asociación con paquete/carga. [Entidad](../src/planta/entities/ciclo-esterilizacion.entity.ts). |
| G05. Parámetros físicos | **Implementada con alcance parcial.** Evalúa cinco filas por método y exige CUMPLE y valor en rango. | Control rutinario basado en proceso validado, ISO 11135. | Falta registro continuo/archivo original y criterios estructurados independientes de textos interpretados por expresiones regulares. [Evaluación](../src/certificados/informacion-tecnica.ts). |
| G06. Resolución de protocolos | **Parcial.** Conserva versión y valida método. Selección por última versión del método. | Proceso validado y control de cambios, ISO 11135 y reglas M5/M6. | Falta elegibilidad explícita por equipo, producto, empaque y vigencia aprobada. [Planta](../src/planta/planta.service.ts). |
| G07. Cuarentena y liberación | **En diseño con aprobación parcial.** Estado pendiente de Calidad y revisión transaccional. | Control del producto pendiente y evidencia de liberación, según M6 y monitoreo CDC. | Falta estado operativo por material y comprobación estructurada BI negativo. Pendiente de Calidad no representa toda la custodia física. [Calidad](../src/calidad/calidad.service.ts) · [M6](negocio/reglas-maestras.md#modulo-6). |
| G08. Independencia y doble aprobación | **En diseño.** Una contraseña confirma una decisión. | Requisito propio M6 de separación de personas y doble aprobación de desviaciones críticas. | aprobar no compara operador_id con aprobadorId. Falta registro de dos decisiones independientes y facultad especial DT. [Servicio](../src/calidad/calidad.service.ts). |
| G09. Averías, invalidaciones y CAPA | **Parcial.** Rechazo con motivo y vínculo ciclo_correccion_de_id en entidad. | Gestión de reparaciones/retiradas, Getinge, e investigación exigida en M6. | Falta expediente de incidencia, alcance por carga, investigación, acciones y destino del material. El vínculo de entidad requiere flujo operativo para usarlo. [Ciclo](../src/planta/entities/ciclo-esterilizacion.entity.ts) · [Calidad](../src/calidad/calidad.service.ts). |
| G10. Equipos y calibración | **En diseño.** equipo es texto. | Equipo identificado y proceso validado, ISO 11135, y reglas M5. | Sin catálogo relacionado al ciclo ni bloqueo por mantenimiento/calibración vencida en createCiclo. [DTO](../src/planta/dto/create-ciclo.dto.ts) · [Servicio](../src/planta/planta.service.ts). |
| G11. Aireación EtO | **Parcial.** Registra tiempo_aireacion y evaluación. | Validación y control rutinario EtO, ISO 11135. | Falta contexto de etapa, equipo, inicio/fin y evidencia del protocolo aplicable. La suficiencia técnica debe determinarla Calidad con validaciones y criterios de residuales pertinentes. [Evaluación](../src/certificados/informacion-tecnica.ts). |
| G12. Certificado y alcance del material | **Parcial.** Emisión desde ciclo con todos los materiales de su orden. | Trazabilidad de lo liberado y regla M7 de certificado por orden. | Falta agregación de varios ciclos, exclusión de rechazos parciales y actuaciones Elaborado/Verificado/Aprobado independientes. [Emisión](../src/certificados/certificados.service.ts) · [Roadmap 3.6](superpowers/plans/2026-11-10-rbac-backend.md). |
| G13. Recuperación e integridad PDF | **Implementada con brecha.** Snapshot, hash, regeneración y limpieza compensatoria. | Conservación de registros y regla M7 de copia restaurada. | La regeneración puede actualizar objeto/hash. Falta verificar marca de restauración, historial de representaciones y auditoría específica. [Certificados](../src/certificados/certificados.service.ts). |
| G14. Inventario, caducidades y despacho | **Parcial.** Cantidades recibidas y fecha de vencimiento del certificado. | Trazabilidad de existencias y uso seguro, propuesta de gestión integrada apoyada en M4/M7. | Faltan saldos por ubicación/estado, reserva, devolución y política de vencimiento por producto/empaque. updateEstado solo valida pertenencia al enum, sin matriz completa de transiciones. [Logística](../src/logistica/logistica.service.ts) · [Estados](../src/ordenes-servicio/entities/estado-orden.enum.ts). |
| G15. Integración con equipos y lectura | **Pendiente en recorridos inspeccionados.** Captura manual en formulario. | Data logging de Getinge e identificación de Interlab. | Falta importación verificable de archivos y eventos de lectura. No se identificaron conectores PLC/OPC/Modbus en la búsqueda de src. Confirmar interfaces disponibles físicamente. [Formulario](../../SterinovaFrontend/src/app/%28erp%29/planta/ciclo/nuevo/page.tsx). |
| G16. Lavandería farmacéutica | **En diseño.** Perfiles/capacidades futuras sembrados. | Servicio corporativo específico y requisitos M5/M6. | Falta proceso de prendas, lotes de lavado, equipos, zonas, entrega y liberación con autoridad definida. El enum del ciclo admite solo EtO/Vapor. [Semilla](../src/database/migrations/1794312001000-SeedBackendRoles.ts) · [Modelo](../src/planta/entities/ciclo-esterilizacion.entity.ts). |
| G17. Autorización por etapa | **Parcial.** Gestión de asignaciones implementada, coexistencia legacy. | Restricción por funciones y ámbito definida por el roadmap. | Calidad conserva roles generales y consultas sin contexto de ámbito. Un rol futuro sembrado no prueba autorización aplicada al recurso. [Controlador](../src/calidad/calidad.controller.ts) · [Asignaciones](../src/users/user-roles.controller.ts). |
| G18. Documentación de avance | **Parcial.** Roadmap Fase 1 y reporte posterior de unificación. | Control de cambios y evidencia verificable de implantación. | Conciliar el avance real de identidad con el roadmap y el diagnóstico, conservando límites de las fases pendientes. [Reporte](archivo/2026-11-11/calidad-y-pruebas/unificacion-roles-2026-11-10.md) · [Diagnóstico](arquitectura/estado-implementado.md). |

## 3. Oportunidades de Mejora

Las prioridades siguientes son estimaciones relativas. Impacto alto significa reducción de riesgo de liberación incorrecta, pérdida de trazabilidad o interrupción relevante. Esfuerzo alto implica modelo de datos, varios módulos, migración o validación operativa. Los criterios de aceptación propuestos deben convertirse en pruebas durante implementación.

| Orden | Oportunidad y brechas | Impacto | Esfuerzo | Resultado verificable |
| --- | --- | --- | --- | --- |
| 1 | Bloqueo de liberación por BI pendiente/positivo y separación operador–aprobador, G03/G07/G08 | Alto | Medio | Rechazo desde API, aunque la solicitud omita la interfaz. Persistencia de causa y actor. |
| 2 | Registro de indicadores y evidencias, G03/G04/G05 | Alto | Alto | Identificar indicador, lote, caducidad, carga, lectura, responsable y documento fuente. |
| 3 | Asignación de materiales por cantidad a ciclos, G01/G02/G12/G14 | Alto | Alto | Reconstruir cualquier cantidad recibida y sus ciclos, decisiones, certificados y destinos. |
| 4 | Catálogo de equipos y protocolos elegibles, G06/G10/G11 | Alto | Alto | Impedir uso de equipo inhabilitado y protocolo incompatible, incluida captura retroactiva. |
| 5 | Incidencias, CAPA, invalidación y retirada, G09 | Alto | Alto | Localizar todas las cargas y entregas afectadas, conservar responsables y cierre documentado. |
| 6 | Firmas por actuación y certificados por orden, G08/G12/G13 | Alto | Alto | Documentos con actores y alcance correcto, conservación del original y sustitución trazable. |
| 7 | Estados de custodia, saldos y despacho, G07/G14 | Alto | Alto | Bloquear salida de material rechazado, pendiente o vencido conforme a la política validada. |
| 8 | Conciliar avance documental y matriz RBAC, G17/G18 | Alto | Bajo | Tabla de capacidades con evidencia de control, activación y prueba por endpoint. |
| 9 | Flujo propio de lavandería, G16 | Alto | Alto | Registrar prendas/lotes por etapas y emitir autorización de salida según criterio aprobado. |
| 10 | Importar archivos originales de equipo, G05/G15 | Medio | Medio | Preservar archivo y hash, mapear unidades, detectar duplicados y registrar errores. |
| 11 | Escaneo en recepción, carga y despacho, G01/G14/G15 | Medio | Medio | Detectar material ajeno o cantidad incorrecta y mantener eventos idempotentes. |
| 12 | Integración automática y tablero operativo, G10/G15 | Medio | Alto | Piloto con un equipo, recuperación tras desconexión y métricas calculadas sobre eventos comprobables. |

### Diseño mínimo del expediente de ciclo

El expediente debe vincular equipo y número físico, orden/material/cantidad, método, protocolo aprobado, operador, fechas reales, captura y origen del dato. Cada intento o reproceso tendrá identidad propia y relación con el anterior. La asignación necesita control transaccional de cantidades para evitar consumir dos veces un mismo saldo.

Para BI se propone conservar fabricante/referencia, lote y caducidad, ubicación en carga, identificación del dispositivo de desafío cuando corresponda, incubador, condiciones y tiempos según instrucciones, control asociado, estado pendiente/negativo/positivo/inválido, lecturas y responsables. Las correcciones conservarán la lectura original. Un resultado tardío adverso debe poder abrir incidencia y localizar material ya entregado. Calidad debe definir qué campos son obligatorios por protocolo.

Para CI se propone identificar tipo y aplicación, paquete o carga, lote/caducidad, interpretación, persona y evidencia visual cuando corresponda. Los valores físicos deben conservar unidad, origen, instante y archivo fuente. El cálculo de conformidad y la decisión humana se registrarán separadamente para poder explicar cualquier excepción.

La liberación ordinaria debe exigir expediente completo según protocolo, equipo elegible y decisiones autorizadas. Las excepciones requieren reglas de autoridad aprobadas y evidencia explícita. El intervalo orientativo de incubación de 24–48 horas citado por negocio no debe convertirse en aprobación automática. Las reglas actuales ya indican que el resultado pendiente permanece en cuarentena. [Reglas M5/M6](negocio/reglas-maestras.md).

## 4. Hoja de Ruta Sugerida

| Etapa | Relación con roadmap RBAC | Trabajo y responsables propuestos | Criterio de salida |
| --- | --- | --- | --- |
| 0. Conciliación y decisiones | Conciliar Fase 1 y avances de 3.1 | Arquitectura y Calidad documentan capacidades efectivas, campos históricos, autoridades de excepciones, certificado por orden y liberación de lavandería. Responsable regulatorio verifica aplicabilidad por contrato. | Matriz aprobada de proceso, evidencia, autoridad y requisitos aplicables. |
| 1. Autorización y bloqueo de riesgos inmediatos | Fase 2 y 3.1, controles prioritarios de 3.5 | Desarrollo aplica capacidades por recurso, separación de personas y condición BI en aprobación. Calidad define resultados y casos válidos. | API rechaza autoprobación, ámbito ajeno, BI pendiente/positivo y evaluaciones incompletas. |
| 2. Trazabilidad logística y carga | Fases 3.2–3.4 | Logística, Planta y desarrollo implantan órdenes parciales, asignaciones por cantidad, equipos y protocolo elegible. | Recepción parcial y carga multiórdenes conservan saldos exactos y visibilidad por cliente/ámbito. |
| 3. Expediente y decisiones de Calidad | Fase 3.5 | Calidad y Dirección Técnica definen indicadores, evidencia, cuarentena, desviaciones, doble aprobación y CAPA. | Caso normal, rechazo parcial, indicador inválido y resultado tardío tienen recorrido auditable. |
| 4. Certificados y control documental | Fases 3.6–3.8 | Dirección Técnica y gestión documental implantan actuaciones, certificados por orden, versiones y restauración trazable. | Fallo de PDF, reintento y sustitución preservan evidencia y evitan duplicidad o liberación indebida. |
| 5. Lavandería e inventario operativo | Extensión modular de Fase 3 | Responsable de lavandería y Calidad acuerdan proceso, equipos, controles ambientales pertinentes y autoridad de liberación. | Un lote completa recepción, lavado, acondicionamiento, control y entrega con evidencia y saldos. |
| 6. Integración, validación y cierre legacy | Fase 4 | Desarrollo y responsables operativos ejecutan matriz de acceso y escenarios de extremo a extremo. Automatización comienza con importación validada y después un piloto de equipo. | Todas las rutas internas tienen política comprobada y las pruebas operativas están aceptadas. |

La etapa 1 puede incorporar el control de independencia antes del rediseño completo de materiales. La genealogía de la etapa 2 es dependencia de rechazos parciales, retiradas exactas y certificados agregados. La integración automática debe consumir un modelo estable y comprobar su semántica antes de influir en liberación.

Las migraciones futuras deben ser aditivas y conservar los certificados históricos por ciclo. Las cantidades, actores y ámbitos históricos desconocidos requieren conciliación con evidencia. La nulabilidad puede expresar información no recuperable. Una activación de roles debe acompañarse de controles de servicio y pruebas de denegación por ámbito.

### Escenarios de aceptación para la ejecución futura

- Un mismo lote distribuido en dos ciclos conserva cantidades procesadas, pendientes y rechazadas sin duplicación.
- Un ciclo con dos clientes permite certificar y consultar exclusivamente el material de cada cliente.
- Dos solicitudes concurrentes de carga o liberación producen una sola asignación/decisión válida.
- Operador con rol adicional de Calidad recibe rechazo al intentar autoaprobar.
- BI pendiente, positivo, inválido o fuera de vigencia impide liberación ordinaria conforme al protocolo.
- Resultado positivo tardío permite recuperar clientes, cantidades, certificados y entregas afectados.
- Equipo en mantenimiento o calibración vencida bloquea uso. La captura retroactiva verifica elegibilidad en la fecha real.
- Una modificación de protocolo conserva el criterio histórico aplicado.
- El fallo del generador PDF y el reintento conservan el estado coherente entre base, objetos y certificados.
- Una restauración deja identificación de la copia, motivo, actor y relación con el original.
- Un ámbito hermano, un actor inactivo y un auditor con intento de escritura reciben denegación en lista, detalle, exportación y archivo.
- Lavandería completa sus etapas propias con el responsable de liberación aprobado.

La observación del piloto debe medir intentos de liberación bloqueados, ciclos con expediente completo, resultados pendientes, conflictos de versión, fallos de PDF y diferencias de saldos. Los objetivos numéricos se fijarán después de medir una línea base operativa.

## 5. Riesgos y Consideraciones

| Riesgo | Consecuencia | Tratamiento propuesto |
| --- | --- | --- |
| Aplicar reglas universales a EtO, vapor y lavandería | Controles insuficientes o bloqueos injustificados | Calidad define criterios por proceso, producto, empaque, equipo e instrucciones del fabricante. |
| Interpretar la certificación corporativa como validación de funcionalidades | Evidencia insuficiente ante auditoría | Relacionar requisito, riesgo, especificación, prueba y aceptación del uso previsto del ERP. |
| Activación de permisos futuros sin política de recurso | Ampliación de acceso o exposición entre clientes | Activar por módulo y probar ámbito, identidad, exportaciones y excepciones públicas. |
| Concurrencia y caída durante aprobación/PDF | Duplicados, archivos huérfanos o estados incoherentes | Idempotencia, bloqueo/versionado, compensación y reconciliación de almacenamiento. |
| Carga retrospectiva sin evidencia | Autoría y cantidades históricas incorrectas | Registrar procedencia, fecha de captura e incertidumbre. Mantener originales. |
| Datos de equipo incompletos o reloj incorrecto | Asociar una curva al ciclo equivocado | Identidad del equipo, sincronización, unidades, número de ciclo y controles de integridad. |
| Cambios de protocolo o formato sobre documentos anteriores | Pérdida de reproducibilidad | Versiones inmutables, snapshots y conservación de originales. |
| Incertidumbre sobre autoridades de urgencia y excepciones | Liberación sin competencia definida | Resolver con Calidad y Dirección Técnica los pendientes de M6/M7 antes de habilitar excepciones. |
| Alcance de lavandería sin criterios de aceptación | Automatización de un proceso incompleto | Definir autoridad, estados, equipos, documentación y controles aplicables por servicio. |
| Falta de evidencia productiva | Sobreestimar madurez y disponibilidad | Validar con un piloto representativo, muestras reales y responsables de operación. |

### Límites de la evidencia y verificaciones pendientes

La auditoría se realizó por lectura y contraste estático. Las pruebas funcionales y migraciones no se ejecutaron en esta revisión. Las referencias de resultados anteriores corresponden al [informe de unificación](archivo/2026-11-11/calidad-y-pruebas/unificacion-roles-2026-11-10.md). Quedan pendientes la inspección del ambiente productivo, la observación de operación, la copia controlada de normas completas, los certificados vigentes y las interfaces de equipos.

La lectura pública de ISO permite confirmar alcance y edición. El detalle de cláusulas y criterios técnicos exige acceso autorizado a la norma completa. El manual anexo de la Resolución 914 requiere revisión específica en la evaluación de cumplimiento posterior. Las páginas comerciales permiten identificar capacidades anunciadas, con alcance sujeto a edición, módulos y contratación.

La conclusión de esta fase es una priorización de evolución del ERP sustentada en código y requisitos. Las propuestas de campos, estados y pruebas del informe requieren validación funcional de los responsables indicados antes de convertirse en reglas operativas.
