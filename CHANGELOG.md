# Changelog

Los cambios relevantes del backend se registran aquí. Las entradas describen capacidades integradas en el repositorio; no implican que exista un despliegue productivo o una etiqueta Git publicada.

## [Sin publicar]

- Inicio de Fase 1: contrato RBAC por ámbitos, matriz de 42 permisos y nueve roles, motor de políticas sin bypass por nombre de rol y migración aditiva de siete tablas.
- Pruebas de políticas, metadatos y restricciones sobre MariaDB desechable; helper Windows para iniciar/detener esa instancia sin usar `DB_*`.
- Piloto RBAC de Cotizaciones: permisos por endpoint, carga de concesiones vigentes y filtros SQL por ámbito/creador; el resto mantiene RolesGuard sin fallback tras una denegación RBAC.
- Migración aditiva de ámbito en cotizaciones, respaldo local verificado por restauración y conciliación local transaccional/auditada con configuración explícita fuera de Git. Cadena de 14 migraciones aplicada en desarrollo local, sin despliegue productivo.
- Pruebas HTTP con JWT y MariaDB desechable para aislamiento, IDOR, revocación y convivencia con rutas antiguas; contrato OpenAPI con permisos y selección de ámbito.

## [1.0.0] - 2026-11-06 (baseline documental)

### Añadido

- Flujo principal para clientes, cotizaciones, órdenes de servicio, ciclos de esterilización, revisión de Calidad y certificados.
- Autenticación JWT, roles, administración de usuarios, validación de entrada y limitación de solicitudes de autenticación.
- Persistencia con MariaDB y TypeORM, migraciones versionadas y secuencias transaccionales para cotizaciones y certificados.
- Generación de documentos PDF con Playwright/Chromium y páginas de renderizado del frontend Next.js; almacenamiento, huella SHA-256 y versión del renderer.
- Auditoría de acciones seleccionadas y registros estructurados con identificador de correlación.
- Endpoints de salud para vida y disponibilidad de dependencias.
- Configuración de despliegue, respaldo, recuperación y runbooks para incidentes y generación de PDFs.
- Plantillas y versiones documentales, sellos de certificación y documentación del esquema, módulos, API y calidad.

### Seguridad

- Hash de contraseñas, autorización por roles, endurecimiento HTTP y protección de secretos de render PDF.
- Se documentó como pendiente la definición de requisitos de evidencias y firmas en el [ADR-001](docs/arquitectura/adr/001-evidencias-y-firmas.md).

### Operación

- Build, pruebas automatizadas y contrato de rutas OpenAPI comprobable en CI/local.
- El despliegue real, los secretos de infraestructura, alertas y respaldos automatizados deben verificarse en el ambiente de destino; este baseline no los certifica.
