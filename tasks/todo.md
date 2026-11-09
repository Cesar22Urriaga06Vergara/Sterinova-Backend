# Inicio de Fase 1

- [x] Stash de OpenAPI, ramas backend/frontend y recuperación exacta por SHA-256.
- [x] Contrato y matriz inicial documentados.
- [x] Pruebas RED/GREEN de autorización por permiso, ámbito y creador.
- [x] Entidades, semillas congeladas y migración aditiva registradas en TypeORM.
- [x] Pruebas de metadatos y seguridad de migración, 139 unitarias, 5 sobre MariaDB desechable, lint y build.
- [x] Revisión final del diff y preservación del OpenAPI previo.

Resultados y límites: [reporte de la entrega](../docs/estado-proyecto/inicio-fase1-rbac-2026-11-08.md).

## Hitos autorizados: migración local y piloto Cotizaciones

- [x] Respaldo SHA-256 y restauración verificada en MariaDB desechable.
- [x] Cadena completa de 14 migraciones ensayada y aplicada localmente.
- [x] Conciliación local explícita de titular, usuarios y tres cotizaciones históricas; auditoría e idempotencia.
- [x] Cargador servidor, permisos por endpoint y filtros SQL por ámbito/creador en Cotizaciones.
- [x] Despacho de guards sin fallback; otros módulos mantienen RolesGuard.
- [x] 16 pruebas de integración y 4 E2E aprobadas; 145 unitarias aprobadas, build y lint comprobados.
- [x] OpenAPI actualizado conservando la descripción anterior.

Resultados: [reporte del piloto](../docs/estado-proyecto/piloto-cotizaciones-rbac-2026-11-08.md).

## Continuación pendiente de Fase 1

- [ ] API general de gestión de ámbitos/cierre y asignaciones con delegación.
- [ ] Conciliación y filtros SQL en módulos restantes; proyecciones operativas sin datos financieros.
- [ ] Política general de sesiones y revocación fuera del piloto.
- [ ] `/auth/me` y frontend por capacidades, incluida selección de ámbito para cuentas multidepartamento.
- [ ] Activación gradual y validación del resto del sistema.
- [ ] Revisar contrato fecha/hora de Logística: el DTO admite ISO con hora y la columna DATE lo rechaza.
