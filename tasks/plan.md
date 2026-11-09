# Fase 1 — RBAC y seguridad

Plan aprobado el 8 de noviembre de 2026. Contrato: [autorización RBAC](../docs/arquitectura/contrato-autorizacion-rbac.md).

## Entrega inicial solicitada

1. Preservar OpenAPI con stash, crear ramas en ambos repositorios y recuperar sus bytes originales.
2. Definir contrato central y matriz inicial; probar denegación, ámbitos, propiedad y múltiples asignaciones.
3. Añadir entidades TypeORM y migración aditiva sin modificar usuarios o documentos existentes.
4. Ejecutar pruebas, compilación y revisión. No aplicar la migración a la base con datos reales.

## Hitos posteriores autorizados y completados

1. Respaldar la base local y verificar restauración/cadena completa en MariaDB desechable.
2. Aplicar las dos migraciones RBAC localmente (14 migraciones totales, ninguna pendiente).
3. Conciliar titular, cinco asignaciones y tres cotizaciones históricas conforme a IDs confirmados por el usuario,
   usando configuración local ignorada por Git, transacción y auditoría.
4. Activar permisos exclusivamente en Cotizaciones; consultas SQL por ámbito y creador, sin fallback legado.
5. Probar JWT/HTTP, aislamiento por ID, revocación y convivencia con módulos antiguos; regenerar OpenAPI.

## Continuación pendiente de Fase 1

- API general de gestión de ámbitos/cierre y asignaciones con delegación y auditoría.
- Conciliación de registros de los demás módulos y política general de revocación de sesiones.
- Filtros SQL y proyecciones mínimas en Comercial, Logística, Planta, Calidad y documentos.
- Sustitución coordinada de guards por roles, `/auth/me`, navegación y administración de accesos frontend.
- Pruebas de integración con MariaDB aislada, acceso por ID, delegación, revocación y ausencia de campos financieros.

La Fase 1 completa permanece abierta. El piloto está activo solo en Cotizaciones; conservar el guard anterior
en los demás módulos hasta su migración explícita. No combinar autorizaciones como fallback.

## Verificación y seguridad del cambio

Pruebas enfocadas RED/GREEN, suite unitaria completa, lint y build. Registrar resultados en la tarea.
Conservar la descripción preexistente de OpenAPI al regenerar el contrato; su copia original está respaldada.
Sin commits, push ni cambios de fases posteriores. La autorización de migración cubre solo el desarrollo local.
