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

# Reglas de Seguridad y Despliegue (Bootstrapping)

Al generar o modificar código relacionado con autenticación, creación de usuarios iniciales o despliegue, cumple estrictamente estas reglas:

1. **Cero credenciales en el código:** Nunca escribas usuarios, contraseñas, tokens o claves de API directamente en el código fuente (_hardcoded_), ni en archivos HTML/JS de Bootstrap, ni en seeders públicos.
2. **Sin registro público de administradores:** No crees formularios web abiertos para registrar al primer usuario administrador en producción. Si existe una ruta de configuración inicial (_setup_), el backend debe bloquearla (`403 Forbidden` o `404`) automáticamente si ya existe al menos 1 usuario en la base de datos y exigir un `SETUP_TOKEN` leído desde variables de entorno.
3. **Creación segura por CLI o entorno:** Implementa la creación del primer administrador mediante un script de consola (CLI) interactivo o leyendo variables de entorno (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) que no queden guardadas en el repositorio.
4. **Cifrado obligatorio:** Todas las contraseñas deben procesarse en el backend usando algoritmos de hashing robustos (`bcrypt` o `Argon2`) antes de guardarse en la base de datos. Nunca en texto plano.
5. **Gestión de secretos:** Usa archivos `.env` para configuración sensible y asegúrate de incluir `.env` en el archivo `.gitignore`. Proporciona únicamente un `.env.example` con valores vacíos.
6. **Seguridad Frontend (Bootstrap):** Usa únicamente Bootstrap 5+. Nunca confíes en las validaciones HTML/JS del cliente; replica y refuerza todas las validaciones y controles de permisos en el backend.

Para despliegues de producción en plataformas PaaS o contenedores, usa `npm run start:deploy` como comando de inicio: ejecuta las migraciones, el bootstrap idempotente del administrador y luego `start:prod` desde `dist/`. Mantén `start:dev` y `start:prod` sin migraciones ni creación automática de datos. Después del primer despliegue exitoso, elimina `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` de la configuración del proveedor; el bootstrap debe finalizar correctamente cuando falten en producción o ya existan usuarios.
