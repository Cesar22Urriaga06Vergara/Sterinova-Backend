# Eliminación de la autorización legacy — diseño

Fecha: 2026-11-12

## Objetivo aprobado por el usuario
Una sola fuente de autoridad: usuarios vinculados mediante claves a roles y ámbitos, y roles vinculados a permisos. Eliminar usuarios.rol, sin conservar campos de compatibilidad ni decisiones de acceso basadas en nombres visibles. Mantener el selector de Admin General, administradores y asesores por área, y perfiles especializados.

## Estado verificado
AuthorizationGuard despacha todavía a RolesGuard. Este último autoriza al enum Admin independientemente de los roles requeridos. Clientes, Logística, Planta, Calidad, Certificados, Formatos, Sellos y Auditoría conservan decoradores legacy. Auth, Users, bootstrap, rutinas SQL y frontend consumen usuarios.rol. La eliminación es transversal, no cosmética.

## Enfoque
Sustituir todos los consumidores activos antes de retirar la columna mediante una migración nueva. No editar migraciones históricas aplicadas. No mantener un fallback legacy ni sustituir el enum por comprobaciones de nombres de roles. Conservar claves estables y asignaciones existentes; las etiquetas no conceden permisos.

## Reglas
- Toda ruta protegida exige un permiso explícito o sesión explícita; sin política se deniega.
- Cada operación sobre recursos valida ámbito, propiedad cuando corresponda y condiciones de negocio. Un permiso de ruta no autoriza todos los registros.
- Admin General requiere concesiones explícitas; no elude separación entre creador y aprobador ni estados de documentos.
- El usuario ID 1 conserva acceso administrativo por asignaciones persistidas, sin excepción por su ID en código.
- Los administradores de área no obtienen gestión global de usuarios ni delegación ilimitada por su nombre.
- Los perfiles especializados conservan sus responsabilidades; no se activan permisos de funciones aún inexistentes.
- El formulario envía role_id y scope_id; muestra etiquetas claras y responsabilidades. No envía rol.
- Las asignaciones pueden seguir siendo múltiples; crear un usuario selecciona su perfil inicial.
- No se atribuyen documentos históricos a un ámbito por inferencia.

## Validación y aplicación
Pruebas positivas y negativas por permiso, ámbito, propiedad, revocación y usuario inactivo; cobertura de rutas sin política y de protección del último administrador. Ensayo de migración en base desechable y builds de ambos repositorios. Aplicar a la base de trabajo únicamente después de verificar la transición y revisar el resultado concreto, conforme a AGENTS.md. No recrear cuentas de prueba allí.
