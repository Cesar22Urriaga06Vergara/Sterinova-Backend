# Estado funcional por módulos

Este resumen orienta sobre las áreas funcionales. Para detalles técnicos y rutas, consulta el [análisis de estado fechado](analisis-estado-2026-11-04.md) y valida siempre contra el código actual.

- Autenticación y usuarios: inicio de sesión JWT y modelo de usuarios; el aprovisionamiento inicial se realiza con bootstrap:admin.
- Comercial: gestión de clientes, importación desde Excel y cotizaciones con cálculo de valores y generación de PDF en el frontend.
- Logística: órdenes de servicio asociadas a cotizaciones y seguimiento de estados.
- Planta: registro de ciclos de esterilización ligados a órdenes.
- Calidad y certificados: existen módulos y pantallas en evolución; verifica el alcance implementado antes de asumir que la aprobación final o la emisión de certificados está completa.

Los documentos funcionales heredados describen metas de producto, no evidencia de que una capacidad esté implementada.