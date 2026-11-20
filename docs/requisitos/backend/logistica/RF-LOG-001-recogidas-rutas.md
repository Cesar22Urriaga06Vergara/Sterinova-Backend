---
id: RF-LOG-001
titulo: Registrar recogidas, rutas y llegadas directas
tipo: RF
modulo: Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuesta 54; docs/negocio/hoja-ruta-integral-2026-11-12.md, D08; src/logistica/; src/ordenes-servicio/"
depende_de: [RN-LOG-001]
bloquea: [RF-LOG-002, RF-LOG-008, RF-LOG-009]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-004 se derivó a RF-LOG-008 y B-LOG-006 a RF-LOG-009; B-LOG-005 queda registrado como pendiente para fase frontend."
---

# RF-LOG-001 — Registrar recogidas, rutas y llegadas directas

**Fuente principal:** `Sterinova-ERP.md` §3, «Logística», que solicita gestionar recogidas, llegadas directas y rutas con múltiples clientes.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuesta 54, y `docs/negocio/hoja-ruta-integral-2026-11-12.md`, decisión D08; código de `src/logistica/` y las entidades de órdenes.

1. **ID:** `RF-LOG-001`.
2. **Título:** Registrar recogidas, rutas y llegadas directas.
3. **Tipo:** RF.
4. **Módulo:** Logística.
5. **Descripción funcional:** El sistema debe registrar el transporte del material desde instalaciones del cliente hasta planta, ya sea por recogida o por llegada directa, conservar los eventos y responsables por orden y permitir asociar varias órdenes/clientes a una ruta compartida.
6. **Reglas de negocio asociadas:** La recogida es la modalidad habitual y la llegada directa es excepcional. No se registra una recogida ficticia cuando el material llega directamente. La regla maestra pide transportador, conductor, placa, ruta y evidencia de entrega; las recepciones de cada orden siguen siendo independientes.
7. **Actores y permisos:** Operadores autorizados de Logística registran cambios/eventos de orden mediante permisos de gestión logística; usuario y fecha del evento deben quedar trazables.
8. **Datos y entidades implicadas:** `OrdenServicio`, `OrdenServicioEvento`, `OrdenServicioMaterial` y, para entrega final, `Entrega`. Se almacenan estado, fecha del evento, usuario, responsable, receptor/entregador y datos operativos. No existe entidad de ruta compartida ni `route_id` en la orden/evento.
9. **Precondiciones y postcondiciones:** La orden existe y el operador tiene acceso al ámbito. Una recogida registra el evento correspondiente; una llegada directa registra recepción en planta sin evento previo de recogida. La transición y la recepción mantienen su trazabilidad individual por orden.
10. **Criterios de aceptación:** (a) Registrar recogida con sus responsables y datos de transporte. (b) Agrupar órdenes de varios clientes en una ruta y asignar responsable/transportador. (c) Registrar llegada directa sin simular recogida. (d) Mantener registro de recepción y cantidades independiente por orden. (e) Consultar evidencia y datos de transporte asociados al evento/ruta.
11. **Evidencia en backend:** `LogisticaService.updateEstado` admite `PENDIENTE → EN_PLANTA`, registrando `RECEPCION_PLANTA`, así como eventos de recogida. Los eventos por orden guardan fecha, usuario y detalles. La entidad de entrega final es por orden y no implementa agrupación de rutas.
12. **Evidencia en base de datos y frontend:** `OrdenServicio` guarda `conductor_asignado` y `vehiculo_placa`, y `OrdenServicioEvento` conserva eventos por orden. No se encontró modelo o endpoint de ruta. El selector de estados en la interfaz presenta la secuencia `PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA` y no expone la llegada directa desde `PENDIENTE`.
13. **Brechas derivadas:** `B-LOG-004` (rutas compartidas) se asigna a `RF-LOG-008`; `B-LOG-006` (modalidad de ingreso explícita) se asigna a `RF-LOG-009`. `B-LOG-005` permanece únicamente en el registro de brechas como pendiente para fase frontend, conforme a la decisión del usuario. Esta ficha queda con `brechas: []` por la derivación acordada.
14. **Preguntas abiertas:** ¿Qué evidencia y datos deben ser obligatorios para la recogida y para la llegada directa? ¿Una ruta requiere estados propios además de los eventos individuales por orden? El principio de no simular recogida para llegada directa ya está definido en D08.
15. **Estado de cobertura:** Parcial. Hay eventos y trazabilidad por orden, y el backend representa recepción directa; faltan rutas compartidas y modalidad de ingreso explícita, y la llegada directa no está habilitada en la UI.
16. **Nivel de certeza y límites:** Confirmado en código y frontend inspeccionados; no se verificó una base desplegada. El anexo contractual se interpreta junto con la precisión posterior D08, que aclara el tratamiento de llegada directa.

**Trazabilidad:** Ruta/recogida o llegada directa → evento con usuario, fecha, responsable y evidencia → recepción independiente por orden.
