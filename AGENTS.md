# Sterinova Backend — instrucciones para agentes

## Lectura progresiva

1. Decide si la tarea afecta al backend, al frontend o a ambos; consulta solo los mapas necesarios: `docs/ESTRUCTURA_BACKEND.md` y, si aplica, `../SterinovaFrontend/docs/ESTRUCTURA_FRONTEND.md`.
2. Usa `docs/CONTEXTO_RAPIDO.md` para ubicar la entrada y el dominio. Lee únicamente los archivos del módulo afectado.
3. Amplía la lectura a DTO, entidades, servicios, controladores, migraciones y pruebas directamente relacionadas; sigue dependencias directas solo cuando hagan falta.
4. Limita búsquedas por ruta y extensión (por ejemplo, `src/auth/**/*.ts` o `src/logistica/**/*.spec.ts`). No busques recursivamente ambos repositorios por defecto.
5. Ejecuta las pruebas focalizadas pertinentes (`npm test -- <archivo>` o `npm run test:e2e -- <archivo>`) y el build si el cambio lo requiere.
6. Actualiza documentación activa solo cuando cambie el comportamiento documentado. Usa `docs/README.md` para navegar y `docs/archivo/` solo para antecedentes.

## Límites de contexto y datos

- No cargues automáticamente todo el historial de auditorías, planes, pruebas, migraciones, documentos institucionales ni el repositorio frontend.
- No leas `storage/backups/`. Conserva los archivos de `docs/ejemplos-formatos/`; consulta solo formatos pertinentes a cotizaciones, logística, órdenes, actas, importación histórica, plantillas o certificados.
- Las restricciones de lectura no impiden verificaciones de seguridad, análisis de dependencias directas o pruebas de regresión necesarias.
- No ejecutes migraciones, modifiques bases de datos ni macros salvo solicitud explícita.
