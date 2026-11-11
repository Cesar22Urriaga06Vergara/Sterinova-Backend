# Usuarios y perfiles de prueba

**Objetivo:** consultar y modificar perfiles RBAC desde Usuarios, crear una cuenta local por perfil y documentar sus credenciales y edición desde HeidiSQL.

**Diseño final solicitado:** las tablas RBAC son la fuente única de verdad. Una fila representa cada combinación usuario–rol–ámbito; no se guardan listas en `usuarios.rol`. ERP y HeidiSQL llaman `rbac_set_user_roles`, que posee la transacción, valida al actor global, verifica la revisión, conserva la titularidad técnica única, protege la última administración global y deriva el enum legacy. Se rechaza modificar las asignaciones directamente. Credenciales únicamente en `CREDENCIALES-LOCALES.md`, excluido de Git. Los permisos futuros permanecen inactivos.

- [x] Probar validación de perfiles/ámbitos, protección de administración y transacciones.
- [x] Implementar API de catálogo, consulta y edición de asignaciones.
- [x] Añadir el diálogo de roles en Usuarios y mostrar perfiles efectivos en la tabla.
- [x] Crear cuentas locales con contraseñas aleatorias y ámbitos por área. Validar autenticación y permisos.
- [x] Documentar credenciales e instrucciones SQL para HeidiSQL. Verificar ERP en navegador y ejecutar pruebas y compilaciones.

Resultados y pruebas omitidas en el [informe de verificación](../../calidad-y-pruebas/unificacion-roles-2026-11-10.md).
