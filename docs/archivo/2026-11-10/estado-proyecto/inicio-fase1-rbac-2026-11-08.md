> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Inicio de Fase 1 — Fundamentos RBAC

Fecha: 8 de noviembre de 2026. Rama backend y frontend: `feature/rbac-security`.

> Registro histórico de la entrega inicial. La continuación autorizada sí aplicó las migraciones locales
> e integró Cotizaciones: [reporte vigente del piloto](piloto-cotizaciones-rbac-2026-11-08.md).

## Entrega solicitada

- Se preservó mediante stash y recuperó el cambio previo de OpenAPI. Sus bytes originales se verificaron con
  SHA-256 `1746C569046D295CF2AB02546EC0091A73CCB86AC2ACBE18F2E3C01129FB865F`.
- Se definieron el [contrato central y matriz inicial](../../../arquitectura/contrato-autorizacion-rbac.md)
  y el [ADR-004](../../../arquitectura/adr/004-rbac-con-ambitos.md).
- El motor compila restricciones por permiso/ámbito/creador; no usa nombres de rol para autorizar.
- Se registraron siete entidades y la migración aditiva `AddScopedRbac1794096000000`.
  Sus semillas contienen 42 permisos y nueve roles. No asigna usuarios ni modifica tablas de negocio.
- La migración rechaza esquemas parciales antes de crear tablas y rechaza rollback destructivo automático.
- No se añadieron dependencias ni cambiaron rutas HTTP. El frontend solo cambió de rama.

## Pruebas ejecutadas

| Comprobación | Resultado |
|---|---|
| Baseline unitario antes de cambios | 108 aprobadas; 2 omitidas por integración opt-in preexistente. |
| Políticas, matriz/migración y metadatos RBAC | 31 pruebas nuevas aprobadas. |
| `npm test` final | 139 aprobadas; las mismas 2 omitidas preexistentes. |
| `npm run build` | Correcto. |
| `npm run lint` | Código 0; las dos advertencias anteriores, ninguna nueva. |
| TypeScript de los 12 archivos nuevos y sus dependencias | 0 diagnósticos. |
| TypeScript completo, incluidas pruebas antiguas | 16 diagnósticos, los mismos 16 obtenidos contra fuentes de `HEAD`; 0 introducidos. |
| Integración real en MariaDB 10.4.32 desechable | 5 aprobadas; servidor detenido al terminar. |
| `git diff --check` | Correcto. |

La integración usa un puerto local exclusivo, contraseña temporal y una base aleatoria. No importa el DataSource
de la aplicación ni usa `.env`/`DB_*`. Verifica preservación de fixtures, varios roles por usuario, rol creado por
configuración, restricciones de escalación, titular/global únicos y rechazo de reinstalación parcial.
Una prueba real detectó el CHECK incompatible contra un ID autoincremental; se retiró antes del resultado final.
Los ciclos de ámbitos se rechazan en el motor; su prevención al editar la jerarquía corresponde a la integración pendiente.

## Revisión y límites

Se revisaron denegación por defecto, mezcla de asignaciones, descendencia explícita, propiedad dentro del ámbito,
restricciones relacionales, semillas congeladas, preflight, limpieza del servidor temporal y preservación de OpenAPI.
No se ejecutaron `migration:run`, `start:dev`, pruebas E2E contra la base de trabajo, commits ni push.

**La Fase 1 no está completada ni activada en API/UI.** Continúan pendientes el cargador de asignaciones,
aprovisionamiento explícito del titular, conciliación de ámbitos/registros, delegación controlada, filtros SQL,
proyecciones operativas, revocación y adaptación de guards/frontend. El bypass del guard anterior sigue siendo
una deuda abierta hasta esa sustitución coordinada; las pruebas del motor nuevo no certifican las rutas actuales.

El seguimiento se mantiene en [plan](../../../../tasks/plan.md) y [tareas](../../../../tasks/todo.md).
