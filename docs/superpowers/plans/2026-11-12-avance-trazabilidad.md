# Avance por pasos pequeños

## Paso 1 — Separar edición y aprobación comercial

Implementado en código, no desplegado. Se reutiliza `cotizaciones.aprobar_interna`, ya presente en el catálogo y en la definición de roles; no se modificaron grants ni bases de datos.

- Endpoint y consulta autorizada de aprobación exigen el permiso específico, no editar.
- El creador no puede aprobar su propia cotización, aunque posea permiso de aprobación.
- Se registran aprobador y fecha en columnas existentes.
- El botón usa el permiso específico y se oculta al creador.
- Pruebas nuevas reprodujeron la brecha antes de corregirla. Resultado posterior: 13 pruebas focalizadas aprobadas, build backend, lint backend focalizado y TypeScript frontend correctos.

Alcance deliberadamente reducido por solicitud del usuario. No completa B1/F1: quedan revisión/devolución, control de emisión y demás requisitos del plan. No se verificaron grants reales ni interacción en navegador; la autorización efectiva de cada administrador depende de sus asignaciones existentes. Sin migraciones, cambios de estado nuevos ni modificaciones de importes.

Siguiente paso propuesto: verificar y cerrar emisión exclusiva de la versión aprobada, con pruebas focalizadas, antes de agregar nuevos estados.
