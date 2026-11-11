# Cuestionarios originales de negocio

Conservados el 11 de noviembre de 2026 desde el frontend. Las respuestas oficiales se mantienen en [reglas maestras](reglas-maestras.md).

<a id="modulo-1"></a>

## Módulo 1

1. ¿Cuál es la estructura real de la empresa que debe representar el sistema: departamentos, equipos comerciales, sedes, plantas y responsables?

2. ¿Cuáles son los perfiles reales y sus funciones? ¿Los cinco roles legados —Admin, Comercial, Logística, Planta y Calidad— representan suficientemente esa estructura?

3. ¿Una persona puede desempeñar varios roles en distintos equipos o plantas? ¿Cómo deben manejarse suplencias y permisos temporales?

4. Para cada módulo, ¿quién puede consultar, crear, editar, aprobar, emitir, descargar, anular y administrar? ¿Qué información debe quedar oculta incluso para usuarios del mismo departamento?

5. ¿Un comercial ve únicamente sus clientes y cotizaciones, los de su equipo o todos? ¿Quién puede reasignarlos cuando cambia el responsable?

6. ¿El superior jerárquico hereda acceso a todo lo de sus subordinados o necesita permisos explícitos? ¿Hay excepciones por sede o cliente?

7. ¿Quién puede crear usuarios, asignar permisos y desactivarlos? ¿Se necesita aprobación de otra persona para conceder facultades sensibles?

8. ¿La recuperación de contraseña debe hacerse por correo, mediante un administrador o por ambos medios? ¿El restablecimiento debe obligar a cambiar la contraseña al ingresar?

9. ¿Qué duración de sesión, cierre por inactividad, sesiones simultáneas y segundo factor necesitan? ¿Al desactivar una cuenta o cambiar permisos deben invalidarse inmediatamente sus sesiones?

10. ¿Qué actuaciones deben auditarse, quién puede consultar esa auditoría y cuánto tiempo debe conservarse? ¿Qué ocurre con registros y responsabilidades de un usuario que se retira?



<a id="modulo-2"></a>

## Módulo 2

11. ¿Los clientes pueden ser personas naturales, empresas colombianas, entidades públicas y empresas extranjeras? ¿Qué identificación corresponde a cada caso?

12. Para NIT colombiano, ¿se exige dígito de verificación válido? ¿Debe almacenarse separado y normalizar puntos, espacios y guiones?

13. ¿Qué debe pasar cuando se intenta registrar el mismo NIT: bloquear, reutilizar el cliente o permitir una sede adicional vinculada a la misma razón social?

14. ¿Una empresa puede tener varias sedes y direcciones distintas para facturación, recogida y entrega? ¿Cuál debe imprimirse en cada documento?

15. ¿Necesitan varios contactos por cliente, con funciones como compras, pagos, recepción y calidad? ¿Se selecciona un destinatario diferente por cotización?

16. ¿Qué campos son obligatorios para guardar un prospecto y cuáles solo para emitir una cotización u ordenar un servicio?

17. ¿Quién puede corregir razón social, identificación y dirección? ¿Qué cambios requieren motivo, soporte o aprobación?

18. Si cambian los datos del cliente, ¿los borradores deben actualizarse automáticamente o pedir confirmación? ¿Se confirma que los documentos ya emitidos conservan los datos originales?

19. En importaciones Excel, ¿los duplicados se omiten, se actualizan o se presentan para conciliación? ¿Se permite importar parcialmente las filas correctas y entregar un informe de errores?

20. ¿Necesitan clientes inactivos o bloqueados por cartera, documentación o calidad? ¿Qué operaciones bloquea cada motivo y quién puede autorizar una excepción?



<a id="modulo-3"></a>

## Módulo 3

21. ¿Qué servicios entran en esta fase? El último cierre excluía temporalmente Insumos: ¿se mantiene esa exclusión o ahora debemos analizarlo funcionalmente también?

22. ¿Qué diferencia comercial y operativa existe entre Industrial EtO, Farmacéutico y Fabricante? ¿Son servicios distintos o clasificaciones del cliente que podrían usar el mismo servicio?

23. ¿Una cotización puede combinar esterilización, laboratorio, empaque, transporte, lavandería e insumos, o debe pertenecer obligatoriamente a un solo servicio?

24. ¿La cotización es un presupuesto de cantidades concretas, una lista de tarifas o puede ser cualquiera de los dos? ¿Cómo se distingue cada modalidad?

25. ¿Las unidades incluyen prendas, kilogramos, litros, cajas, ciclos y unidades? ¿Cuáles admiten decimales y cómo se relacionan capacidad, cantidad y precio?

26. ¿Los productos y servicios deben seleccionarse de un catálogo con tarifas o pueden escribirse libremente? ¿Quién puede modificar precios y con qué límites?

27. ¿Necesitan descuentos por ítem o por documento, precios mínimos y aprobación por margen? ¿En qué orden se aplican descuentos, transporte e impuestos?

28. ¿Qué reglas de redondeo deben aplicarse por ítem, subtotal, impuesto y total? ¿El PDF debe mostrar centavos cuando existan?

29. ¿Puede haber tratamientos de IVA distintos dentro de una misma cotización? ¿Quién determina y acredita las excepciones tributarias, incluidas las operaciones internacionales?

30. El ejemplo CMED139 está en inglés y convierte COP a USD: ¿debe soportarse moneda e idioma por cotización? ¿Quién fija la tasa de cambio y en qué momento queda congelada?

31. ¿Una cotización puede presentar alternativas excluyentes, como las dos opciones del ejemplo CMED139? ¿Cómo registra el cliente cuál acepta?

32. ¿Qué significa exactamente “aprobar”: revisión interna, autorización para emitir, aceptación del cliente o autorización para iniciar el servicio? ¿Debemos separar esos eventos?

33. ¿Cuál es la secuencia completa de estados y quién puede ejecutar cada transición? ¿Debe distinguir borrador, revisión, aprobada internamente, emitida, enviada, aceptada, rechazada, vencida y anulada?

34. ¿El creador puede aprobar y emitir su propia cotización? ¿Hay umbrales de valor, descuento o condiciones especiales que exijan otra persona?

35. ¿Qué acredita la aceptación del cliente: orden de compra, correo, firma, portal o registro manual? ¿Debe adjuntarse evidencia antes de crear una orden de servicio?

36. ¿Qué sucede si una cotización emitida necesita corrección: nueva revisión del mismo consecutivo, nueva cotización vinculada o anulación y reemplazo?

37. ¿Cuándo se asigna el consecutivo y cómo funcionan prefijos, revisiones y reinicios de numeración? Si cambia el tipo de servicio durante el borrador, ¿debe conservarse el prefijo original?

38. **Obligatoriedad:** ¿los seis campos comerciales pueden quedar incompletos en borrador pero deben estar diligenciados al emitir? ¿En cuáles se permite “No aplica”?

39. **TIEMPO DE DESPACHO:** ¿se redacta libremente o se estructura en plazo, unidad y evento inicial? ¿Debe admitir plazos separados para producto, laboratorio e informe, como muestran los ejemplos?

40. **TRANSPORTE:** ¿debe registrar quién lo presta y paga, cobertura, recogida/entrega y condiciones por monto? ¿Una tarifa de transporte debe aparecer también como ítem calculable?

41. **FORMA DE PAGO:** ¿debe admitir anticipos y cuotas con porcentajes y eventos de vencimiento? ¿Es solo texto contractual o debe bloquear operaciones hasta registrar el pago?

42. **VALIDEZ DE LA OFERTA:** ¿se expresa como fecha límite, días desde emisión o texto? Si se escribe “diciembre de 2026”, ¿qué fecha exacta debe usar el sistema para determinar el vencimiento?

43. **EL PRECIO INCLUYE / EL PRECIO NO INCLUYE:** ¿serán textos libres, listas seleccionables o ambos? ¿Necesitan advertencias cuando contradigan los ítems cotizados?

44. ¿Debe haber condiciones sugeridas por servicio o cliente? ¿Quién las administra y quién puede modificarlas? ¿Los textos largos deben continuar en otra página sin recortarse?

45. ¿Qué hacemos con el texto general de cotizaciones existentes: conservarlo como observación, pedir clasificación manual o mantenerlo solo en históricos? ¿Se necesitan “OBSERVACIONES” adicionales, como en algunos ejemplos, además de los seis campos?



<a id="modulo-4"></a>

## Módulo 4

46. ¿Una cotización aceptada puede generar varias órdenes por recogidas, sedes o entregas parciales? ¿Puede una orden reunir ítems de varias cotizaciones?

47. ¿Qué condiciones deben cumplirse para crear y programar una orden: aceptación, orden de compra, anticipo, documentación y disponibilidad?

48. ¿Qué identifica cada recepción física: orden, remisión, fecha, responsable, sede de origen y evidencia? ¿Se necesita firma o fotografía?

49. ¿Cómo se manejan diferencias entre cantidades cotizadas, recogidas y recibidas: aceptación parcial, devolución, ajuste comercial o bloqueo?

50. ¿Un mismo producto puede llegar en varios lotes, referencias o empaques? ¿Cada combinación debe conservar trazabilidad independiente?

51. ¿Las cantidades operativas siempre son enteras o lavandería y otros servicios necesitan peso o volumen decimal?

52. ¿Qué significa cada cantidad de muestras —retención, cliente y laboratorio— y si se descuenta del material recibido? ¿Cómo se diferencian cero, desconocido y “No aplica”?

53. ¿Qué condiciones de empaque se inspeccionan al recibir? ¿Quién puede autorizar reempaque, rechazar material o registrar un costo adicional?

54. ¿Se necesita controlar transportistas propios y externos, conductores, vehículos, rutas y prueba de entrega? ¿Qué datos deben quedar obligatoriamente registrados?

55. ¿Cuál es la secuencia real desde recogida hasta entrega final? ¿Se necesitan estados separados de recepción, cuarentena, liberación por Calidad, despacho y entrega?

56. ¿Puede despacharse material sin certificado o antes de la liberación de Calidad? ¿Existen excepciones autorizadas y cómo quedan documentadas?

57. ¿Hasta cuándo se pueden corregir materiales y lotes? Si ya existe un ciclo, ¿cómo se corrige un error sin perder lo originalmente procesado?



<a id="modulo-5"></a>

## Módulo 5

58. ¿Qué procesos debe gestionar Planta además de EtO y Vapor? ¿Lavandería necesita un flujo propio y cuáles son sus etapas?

59. ¿Los equipos deben salir de un catálogo controlado con código, método, capacidad, ubicación y estado? ¿Quién administra ese catálogo?

60. ¿Mantenimiento, calibración o calificación vencida deben impedir programar o registrar ciclos? ¿Quién puede liberar nuevamente un equipo?

61. ¿Qué identifica el número de ciclo: consecutivo del sistema o número registrado por la máquina? ¿Debe ser único por equipo, año o toda la empresa?

62. ¿Un ciclo puede procesar varias órdenes y clientes? ¿Una orden puede distribuirse entre varios ciclos?

63. ¿Cómo se registra exactamente qué materiales y cantidades entraron en cada ciclo, incluidos reprocesos y remanentes?

64. ¿Quién decide el método de esterilización y con qué evidencia de compatibilidad del producto? ¿Puede Planta cambiar el método contratado?

65. ¿Cuáles son los parámetros, unidades y precisiones obligatorias por método? ¿Se capturan valores únicos, mínimos/máximos, series temporales o archivos del equipo?

66. ¿El protocolo depende únicamente del método o también del equipo, producto, empaque y cliente? ¿Quién selecciona y aprueba la versión aplicable?

67. ¿Se puede registrar posteriormente un ciclo ya ejecutado? ¿Qué límites, motivos y autorizaciones requieren las fechas retroactivas o correcciones?

68. ¿Cómo se registran ciclos abortados, incompletos o fallidos? ¿El reproceso crea otro ciclo vinculado y conserva todos los resultados anteriores?

69. ¿Qué debe ocurrir para declarar una orden procesada: registrar un ciclo, completar todas sus cantidades o recibir aprobación de Calidad?



<a id="modulo-6"></a>

## Módulo 6

70. ¿Qué revisa y libera Calidad: un ciclo completo, una carga, una orden, un lote o cada material individualmente?

71. ¿La persona que ejecutó el ciclo puede aprobarlo? ¿Se requiere revisión independiente o doble aprobación en determinados casos?

72. ¿Quién define los criterios de aceptación y dónde está su fuente controlada? ¿Cambian por método, equipo, producto, empaque o cliente?

73. ¿El sistema debe calcular automáticamente “Cumple” comparando mediciones y límites, permitir evaluación manual o combinar ambos mecanismos?

74. ¿En qué parámetros se permite “No aplica” y qué justificación exige? ¿Puede modificarse el resultado calculado y quién lo autoriza?

75. ¿Qué evidencia debe adjuntarse: resultados biológicos, químicos, gráficos del equipo, análisis externos, fotografías o informes?

76. ¿Existen resultados pendientes que obliguen a mantener el producto en cuarentena? ¿Se permite liberación condicionada y con qué restricciones?

77. ¿Un parámetro “No cumple” bloquea siempre la aprobación o existe liberación por desviación formal? ¿Quién asume y registra esa decisión?

78. ¿Puede aprobarse parte de los materiales de un ciclo y rechazarse otra? ¿Cómo se identifican los subconjuntos y su destino?

79. ¿Qué procedimiento sigue un rechazo: motivo, evidencia, investigación, acciones correctivas, devolución o reproceso?

80. ¿Confirmar la contraseña satisface la aprobación interna requerida o necesitan otra modalidad de firma, identidad, cargo y marca de tiempo? ¿Quién define los requisitos aplicables?

81. ¿Cómo se corrige una evaluación ya aprobada y qué pasa con el certificado y material entregado? Si falla la generación del PDF, ¿la aprobación debe quedar pendiente o completada con emisión por reintentar?



<a id="modulo-7"></a>

## Módulo 7

82. ¿Se emite un certificado por ciclo, cliente, orden, lote o entrega? ¿Puede incluir materiales de varios ciclos?

83. ¿Qué formatos oficiales aplican a EtO, Vapor y otros servicios? ¿Qué campos y textos deben coincidir literalmente con cada referencia?

84. ¿Los tres años de vigencia aplican a todos los productos y empaques? Si existen excepciones, ¿quién determina el plazo y qué evidencia debe conservarse?

85. ¿Qué se está declarando con la fecha de vencimiento: vigencia del certificado, conservación de esterilidad o vida útil del producto? ¿Qué condiciones de almacenamiento deben acompañarla?

86. ¿Cuál es la regla de numeración y cómo debe convivir con certificados anteriores? ¿Se comparte consecutivo entre plantas y métodos?

87. ¿Qué datos y firmas hacen que un certificado esté autorizado para entregarse? ¿Quién valida sus requisitos legales y de calidad, y cuáles son las referencias controladas aplicables?

88. ¿El cuadro de estampado debe permanecer completamente blanco en todos los formatos? ¿Qué dimensiones físicas debe tener y dónde deben quedar QR, firma y sellos de cabecera?

89. ¿Qué información puede consultar públicamente quien escanee el QR? ¿Debe mostrar estado vigente, vencido, anulado o reemplazado sin exponer información comercial?

90. ¿Cómo se anula o reemplaza un certificado incorrecto? ¿Se conserva el original, se enlaza el sustituto y se identifica a los clientes que deban ser notificados?

91. ¿Durante cuánto tiempo deben conservarse PDF, datos, evidencias y versiones? Si se pierde el PDF original, ¿se permite reconstruirlo y cómo se distinguiría esa reconstrucción?



<a id="modulo-8"></a>

## Módulo 8

92. ¿Quién es dueño de cada formato y quién puede redactar, revisar, aprobar, publicar y retirar una versión? ¿Deben ser personas distintas?

93. ¿Cuál es la fuente aprobada: Word controlado, PDF firmado, repositorio documental externo o configuración del sistema? ¿Cómo se resuelve una discrepancia entre esas fuentes?

94. ¿Qué cambios obligan a crear una versión nueva: textos, campos, cálculos, diseño, firmas, logotipo o correcciones tipográficas?

95. ¿La fecha de aprobación y la fecha de entrada en vigor pueden ser diferentes? ¿Se necesita programar publicaciones futuras y controlar documentos en preparación durante el cambio?

96. ¿Qué tiene prioridad: versión general, versión por cliente, servicio, idioma o sede? ¿Puede un cliente seguir usando una versión anterior y quién autoriza esa excepción?

97. ¿Qué debe ocurrir si no existe un formato publicado o un sello vigente para emitir: bloquear, emitir sin sello o aplicar una alternativa expresamente aprobada?

98. ¿Cómo se administran normas, licencias, imágenes y vigencias de los sellos? ¿Quién recibe alertas y qué ocurre cuando una licencia se suspende, vence o cambia de alcance?

99. ¿Confirmamos que cambiar un formato o sello no altera documentos emitidos anteriormente? ¿Las nuevas condiciones comerciales deben introducirse mediante una versión documental identificable?

100. ¿Quién dará la aceptación final de cada formato y con qué casos representativos? ¿Debe incluir revisión impresa, textos extensos, varias páginas, diferentes monedas/idiomas y conservación de históricos?
