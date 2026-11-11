# ADR-004: Permisos centrales con asignaciones por ámbito

- Estado: aceptado; piloto API de Cotizaciones integrado, resto de API y UI pendientes.
- Fecha: 8 de noviembre de 2026.

## Contexto y decisión

Los roles fijos y el bypass global de Admin no representan administradores por área ni usuarios multirrol.
Se incorporan roles configurables, permisos explícitos y asignaciones usuario/rol/ámbito. La jerarquía incluye
departamentos, equipos y plantas. Un permiso no se traslada al ámbito de otra asignación del mismo usuario.
El titular global es único y se referencia separadamente para impedir su asignación por el mecanismo ordinario.
Su autoridad procede de permisos enumerados, no de una condición por nombre de rol.

El [contrato RBAC](../contrato-autorizacion-rbac.md) define matriz inicial, propiedad, restricciones relacionales,
casos de abuso y migración. Sus políticas producen restricciones utilizables en SQL antes de filtrar/paginar.

## Consecuencias

La migración es aditiva y no promueve usuarios ni altera documentos existentes. Su reversión automática se rechaza
para proteger las concesiones futuras. Las semillas de migración están congeladas y no se importan desde ejecución.
Las pruebas separan decisiones de política, metadatos y DDL real en un servidor desechable.

Cotizaciones usa el nuevo guard mediante despacho explícito por controlador y permiso por endpoint;
los otros módulos conservan los guards actuales. Las lecturas comerciales requieren creador y ámbito.
La base local fue respaldada, migrada y conciliada con autorización expresa; la migración general no
contiene IDs de usuarios. Véase el [reporte del piloto](../../archivo/2026-11-10/estado-proyecto/piloto-cotizaciones-rbac-2026-11-08.md).
La Fase 1 no se considera completada hasta
integrar carga de asignaciones, conciliación de ámbitos, filtros SQL, proyecciones operativas y frontend por capacidades.
No se habilitará un fallback que conceda acceso por el rol antiguo cuando falle la política nueva.
