# ADR-003: Consecutivos transaccionales con bloqueo pesimista en base de datos

- **Estado:** Aceptado (implementado para cotizaciones y certificados)
- **Fecha:** 2026-11-06

## Contexto

Los números oficiales de cotizaciones y certificados deben ser únicos aunque existan solicitudes simultáneas o más de una instancia del backend. Un contador en memoria no coordina procesos y calcular el máximo de los documentos sin bloqueo permite colisiones.

## Decisión

Persistir el último valor en `secuencias_consecutivos`, dentro de MariaDB. Al asignar un número, la operación corre en una transacción y obtiene el registro de secuencia con bloqueo pesimista de escritura (`pessimistic_write`); incrementa el valor y guarda el documento dentro de la misma transacción. La restricción única del consecutivo en las tablas documentales es una defensa adicional.

La secuencia de cotizaciones se separa por prefijo de servicio. La secuencia de certificados usa `certificado_esterilizacion` y se incrementa durante la aprobación del ciclo. El registro de certificados debe inicializarse mediante migración; si falta, la emisión falla de forma explícita.

## Consecuencias

- La base de datos coordina instancias concurrentes y el rollback revierte tanto el contador como el documento de la transacción.
- Las secuencias son estado persistente; deben incluirse en los respaldos y restaurarse junto con sus documentos.
- Los bloqueos requieren transacciones InnoDB y deben mantenerse acotados para evitar contención.
- Este ADR no afirma que las órdenes de servicio usen esta estrategia: su consecutivo se calcula por separado en `LogisticaService` y debe revisarse antes de escalar concurrencia.

## Evidencia en el repositorio

- `src/cotizaciones/cotizaciones.service.ts` bloquea y avanza secuencias de cotización en transacción.
- `src/calidad/calidad.service.ts` y `src/certificados/certificados.service.ts` comparten la transacción de aprobación y emisión del certificado.
- `src/database/migrations/` crea y evoluciona `secuencias_consecutivos`.
