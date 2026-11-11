> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Piloto RBAC de Cotizaciones: migración y resultados

Fecha local: 8 de noviembre de 2026 (Bogotá). Ambos repositorios en `feature/rbac-security`.
Los nombres de respaldo usan UTC (9 de noviembre). Solo se intervino la base local `sterinova`.
No se ejecutó despliegue productivo, commit ni push. Frontend sin cambios.

## Respaldo y esquema

Antes de aplicar DDL se generó un dump consistente con `mysqldump --single-transaction`, rutinas, eventos,
triggers y datos binarios. Las tablas inspeccionadas eran InnoDB. Las credenciales no aparecen en argumentos
ni en el repositorio. Los respaldos y sus manifiestos SHA-256 permanecen en `storage/backups/`, ignorado por Git.

| Respaldo | Tamaño | SHA-256 |
| --- | --- | --- |
| `sterinova-pre-rbac-2026-11-09T02-09-23-655Z.sql` | 134439 bytes | `e7ea5daa3cc00c30a8f78803f56cc988f87b8d2c5d7cc850a2bc828e46fa759f` |
| `sterinova-pre-rbac-2026-11-09T02-26-16-453Z.sql` | 150999 bytes | `657bcc38aad292e81848dbae9cbed935d772379e18e80c3e1404cb3833e85b9b` |

El primero se restauró en una instancia MariaDB 10.4.32 desechable y se ejecutó la cadena pendiente.
También se ensayó la cadena completa desde una base vacía. En local están aplicadas 14 migraciones y
`showMigrations()` devuelve false. Las nuevas son:

- `AddScopedRbac1794096000000`: siete tablas, jerarquía global y matriz de nueve roles/42 permisos.
- `ScopeQuotePilot1794096001000`: ámbito nullable de cotizaciones, FK, índice ámbito/creador/ID
  y lectura comercial OWN. No contiene asignaciones de usuarios ni atribuciones históricas.

MariaDB confirma DDL implícitamente. Ambas migraciones rechazan un rollback automático destructivo;
ante una incidencia, detener escrituras y preparar una migración correctiva o restauración consistente.
No ejecutar `migration:revert` para recuperar permisos. `synchronize` y `migrationsRun` siguen desactivados.

## Conciliación local autorizada

Se ejecutó una migración de datos separada, transaccional, auditada e idempotente. Su configuración está en
`storage/rbac-local-pilot.json`, fuera de Git. Los IDs siguientes son datos confirmados por el usuario;
no hay IDs de estas cuentas hardcodeados en la lógica ni en migraciones generales.

| Usuario ID | Asignación | Ámbito |
| --- | --- | --- |
| 1 | Único titular `superadmin` | GLOBAL |
| 2 | `comercial` y `emisor_comercial` | Comercial |
| 3 | `logistica` | Logística |
| 4 | `planta` | Planta |
| 5 | `calidad` | Calidad |

Cotizaciones históricas 1, 2 y 3: creador provisional ID 2 y ámbito Comercial (ID local 2).
Solo se actualizaron `creador_id` y `scope_id`: se preservaron snapshots, huellas, importes y archivos PDF.
La atribución provisional queda auditada y debe revisarse antes de reutilizar estos datos fuera de desarrollo.
El campo legado `usuarios.rol` no se cambió, para conservar el funcionamiento de otros módulos.

## Integración del piloto

`AuthorizationGuard` despacha explícitamente los controladores marcados con `@ScopedPermissions()` a
`PermissionGuard`. Cotizaciones declara `@RequirePermission` en todos sus endpoints. Los demás módulos
siguen con `RolesGuard`; no existe reintento legado después de una denegación RBAC.

El servidor consulta usuario activo, asignaciones, roles, permisos y jerarquía por solicitud. Los filtros SQL
aplican ámbito y creador simultáneamente para OWN, antes de devolver registros o ejecutar mutaciones/PDFs.
Se restringen listado, detalle, edición, eliminación, previsualización, emisión y descarga. Un ID inaccesible
devuelve 404; falta de concesión 403; falta de autenticación 401. Las revocaciones afectan la siguiente solicitud.

Al crear, el creador procede de la sesión. Con un solo ámbito elegible se selecciona automáticamente;
con varios se exige `x-scope-id`, validado contra las concesiones. SuperAdmin debe seleccionar un ámbito
ordinario al crear. El frontend aún no incorpora ese selector; JUAN solo tiene un ámbito y puede crear sin header.

El permiso de emisión sigue separado y con alcance departamental. No amplía la lectura OWN del comercial.
El catálogo incluye `cotizaciones.aceptar`, pero no se añadió una ruta nueva de aceptación en este hito.
Las reglas completas de transición de estados y la corrección de datos fijos de PDFs siguen pendientes.

## Verificación

- `npm run build`: aprobado.
- `npm test`: 145 aprobadas, 2 omitidas preexistentes por activación opcional.
- `npm run lint`: sin errores; dos advertencias previas en PDF y un import de test de Certificados.
- MariaDB desechable: 16 pruebas de integración aprobadas (esquema, cadena/restauración y piloto HTTP).
- Aplicación completa en otra base desechable: 4 E2E aprobadas, incluido cotización → Logística → Planta
  → Calidad → certificado y contrato OpenAPI. El generador PDF se simula; no valida Chromium ni diseño visual.
- TypeScript completo incluyendo tests: 15 diagnósticos preexistentes pendientes; ninguna incidencia nueva.
  La entrega anterior registraba 16; uno desapareció al adaptar el fixture de Cotizaciones.
- Comprobación HTTP con AppModule/JWT y datos locales: Admin y JUAN listan las tres cotizaciones (200),
  Logística/Planta/Calidad obtienen 403 en Cotizaciones, anónimo 401 y Usuarios sigue accesible para Admin (200).
- Acceso cruzado entre dos comerciales del mismo departamento, acceso a otro departamento, IDOR,
  suplantación del creador, emisión sin permiso y revocación cubiertos en integración.

El ensayo completo detectó un fixture antiguo que enviaba fecha/hora a `ordenes_servicio.fecha_programada`
(DATE). Se corrigió el dato del test a YYYY-MM-DD, conservando el flujo probado. El contrato del DTO de
Logística quedó revisado el 10 de noviembre de 2026: DTO y servicio rechazan timestamps y fechas
inexistentes; conservan el día YYYY-MM-DD sin conversiones en la columna DATE. OpenAPI y pruebas
específicas reflejan esta regla. No se modificó el esquema ni se aplicaron migraciones.

El contrato OpenAPI se regeneró con autenticación bearer, permiso por operación y header de creación.
Se conserva la descripción preexistente. Su copia original `storage/backups/openapi-before-quote-pilot.json`
tiene SHA-256 `1746C569046D295CF2AB02546EC0091A73CCB86AC2ACBE18F2E3C01129FB865F`.

Para repetir el ensayo aislado (requiere build vigente):

```powershell
npm run build
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/test-rbac-schema.ps1 -MariaDbBin C:\xampp\mysql\bin -BackupFile storage/backups/sterinova-pre-rbac-2026-11-09T02-09-23-655Z.sql -RunApplicationE2E
```

La instancia temporal usa datadir/puerto/contraseña propios, se detiene al terminar y no toca la base de trabajo.
`node scripts/backup-local-db.mjs` crea un respaldo nuevo. La conciliación puede repetirse con
`node dist/scripts/migrate-local-rbac-pilot.js storage/rbac-local-pilot.json` después de comprobar el destino;
el script exige base local, identidad del titular y ausencia de migraciones pendientes.

## Alcance pendiente

La Fase 1 completa permanece abierta. Faltan la gestión general de delegaciones/asignaciones, otros módulos,
proyecciones operativas sin información financiera, `/auth/me`, frontend por capacidades y despliegue por entorno.
Las rutas operativas conservan sus riesgos previos; que RolesGuard siga activo no certifica su aislamiento RBAC.
