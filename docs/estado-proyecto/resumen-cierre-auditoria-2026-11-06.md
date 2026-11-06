# Resumen ejecutivo — Cierre de auditoría documental

> **Estado:** vigente.
> **Verificado contra:** informe de auditoría, índices y documentación de ambos repositorios el 6 de noviembre de 2026.
> **Alcance:** resultados, límites y preparación para una siguiente verificación operativa.
> **No cubre:** validación operativa, visual, de seguridad en despliegue ni de datos productivos.
> **Fuente canónica de:** resumen de cierre de la auditoría documental.

## 1. Qué se auditó

Se revisó la documentación de `backend_sterinova/docs/` y `frontend_sterinova/docs/`, contrastando previamente las afirmaciones existentes con código del repositorio. Esta fase de cierre revisó clasificación, cabeceras, fuentes canónicas, enlaces y atribución de cambios a nivel de archivo. La fecha de auditoría es el 6 de noviembre de 2026.

## 2. Qué se encontró

- El backend define siete tipos de cotización; el selector frontend ofrece cinco (`FARMACEUTICO` y `FABRICANTE` no aparecen en UI).
- El login frontend llama a `http://localhost:3001/auth/login`, aunque el cliente API usa `NEXT_PUBLIC_API_URL`.
- Cuatro cifras del dashboard son estáticas, no métricas de API.
- El código no declara entidades para evidencias adjuntas ni firmas digitales; sello gráfico no equivale a firma.
- Para una base limpia que completa la cadena vigente de migraciones, el consecutivo de certificado comienza en `001`; bases existentes requieren revisar estado y datos.
- Se documentaron guardas JWT/roles, rutas, generación PDF con Playwright y límites de almacenamiento; despliegue no fue verificado.

## 3. Qué se creó / actualizó

La auditoría consolidó índices, arquitectura, base de datos, manuales y mapas de módulos; clasificó documentos históricos y creó guías sobre API, operación, despliegue, pruebas, calidad de datos, UI/UX, navegación, accesibilidad y flujos. En esta fase de cierre se añadieron [revisión de calidad](revision-calidad-documental.md) y [checklist operativo](../calidad-y-pruebas/checklist-verificacion-operativa.md), además de este resumen ejecutivo.

## 4. Qué NO se verificó

No se consultaron bases MariaDB, estado de migraciones aplicadas, variables de entorno, secretos, CORS productivo, despliegues, persistencia o respaldo de PDFs. Tampoco se ejecutaron pruebas, validaciones visuales, mediciones de contraste ni recorridos de teclado/lector de pantalla.

## 5. Riesgos residuales

- La revisión de fuentes canónicas mitiga duplicación documental; su tabla y avisos están en la [revisión de calidad](revision-calidad-documental.md).
- Enlaces cruzados funcionan con los dos repositorios como directorios hermanos; la reubicación conjunta o separada debe volver a validarse.
- Hay cambios locales que precedían al inicio de la auditoría. Su estado inicial por archivo se registra en el [informe principal](auditoria-docs-2026-11-06.md); la atribución exacta de cada línea no es verificable sin commits intermedios.

## 6. Próximos pasos operativos

Ejecutar el [checklist de verificación operativa](../calidad-y-pruebas/checklist-verificacion-operativa.md) en staging/controlado, guardar evidencias por ambiente y obtener aceptación de responsables antes de tomar decisiones de producción. El checklist no se ejecutó en esta fase.

## 7. Responsables y fechas

- Owner de aceptación visual de PDFs: **pendiente de asignar por el equipo**.
- Responsable de base de datos/despliegue: **pendiente de asignar por el equipo**.
- Fecha de próxima revisión: **pendiente de acordar**.
