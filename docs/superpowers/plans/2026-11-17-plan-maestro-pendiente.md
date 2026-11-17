# Plan Maestro — Todo lo que falta (Sterinova Backend)

**Fecha:** 17 de noviembre de 2026  
**Estado:** Documento de planificación, sin implementación ni ejecución de migraciones.  
**Alcance:** Backend de Sterinova (NestJS 12, TypeScript, TypeORM 0.3, MariaDB).  
**Convención:** Cada ítem se clasifica como P0 (bloqueante/integridad), P1 (funcional principal) o P2 (mejora/administrativo). Ningún cambio se ejecuta sin autorización explícita del usuario.

---

## 1. Diagnóstico de estado actual

### Qué ya existe y está operativo

| Área | Estado | Evidencia principal |
|---|---|---|
| Auth / Usuarios / JWT | Implementado | `src/auth/`, `src/users/` |
| RBAC con ámbitos y concesiones | Fase 1 completada (pilot solo en Cotizaciones) | `src/rbac/`, migraciones RBAC aplicadas localmente |
| Clientes | CRUD existente | `src/clientes/` |
| Cotizaciones (crear, editar, emitir, anular, impuestos) | Implementado | `src/cotizaciones/` |
| Logística: órdenes, materiales, transiciones de estado, eventos, PDF Orden/Acta | Parcialmente implementado | `src/logistica/`, `src/ordenes-servicio/` |
| Formatos documentales versionados | Implementado | `src/formatos-documentales/` |
| PDF render (Playwright/Chromium en memoria) | Implementado | `src/pdf/` |
| Planta: ciclos de esterilización | Implementado | `src/planta/` |
| Calidad: ciclos de evaluación | Implementado | `src/calidad/` |
| Certificados de esterilización | Implementado | `src/certificados/` |
| Tasas fiscales / IVA | Implementado | `src/tasas-fiscales/` |
| Auditoría | Implementado | `src/auditoria/` |
| Sellos / ICONTEC | Implementado | `src/sellos/` |
| Gerencia / métricas / administradores | Implementado | `src/gerencia/` |
| Productos | Esqueleto implementado | `src/productos/` |
| OpenAPI / contrato de API | Mantenido | `src/openapi/`, `docs/arquitectura/openapi.json` |
| Scripts de bootstrap, seeds | Implementado | `src/scripts/`, `scripts/` |

### Qué falta (consolidado por fuente)

**A. `tasks/todo.md` — continuación pendiente de Fase 1 RBAC:**
1. API general de gestión de ámbitos/cierre y asignaciones con delegación y auditoría.
2. Conciliación y filtros SQL en módulos restantes (Comercial, Logística, Planta, Calidad, documentos); proyecciones operativas sin datos financieros.
3. Política general de sesiones y revocación fuera del piloto.
4. `/auth/me` y frontend por capacidades, incluida selección de ámbito para cuentas multidepartamento.
5. Activación gradual y validación del resto del sistema.
6. Revisar contrato fecha/hora de Logística (DTO acepta ISO con hora; columna DATE lo rechaza) — *en código ya hay validación estricta `YYYY-MM-DD`, queda confirmar cierre del ítem*.

**B. `docs/auditorias/VALIDACION_FORMATOS_LOGISTICA.md` — FASE 2 PENDIENTE:**
7. Definir y modelar fuentes de: recepción real (fecha/hora/responsable), proceso ejecutado, responsables, cantidades/cajas de entrega, observaciones separadas (recepción vs cliente), firmas, numeración independiente del Acta, historial auditable de emisiones.
8. Decidir integridad de importes: ¿bloquear emisión, ocultar importes por línea o mostrar ambos conceptos (cotizado vs operativo)? (fixture incoherente documentada).
9. Órdenes antiguas sin ámbito en la orden ni en la cotización enlazada quedan denegadas por diseño (fail-closed); requieren asignación explícita antes de habilitar sus PDFs.

**C. `docs/negocio/hoja-ruta-integral-2026-11-12.md` — hitos H0-H8 (backend + frontend):**
10. H0 Contratos y conservación: inventario de comportamiento actual, matriz de permisos, contrato OpenAPI, datos ficticios comunes.
11. H1 Comercial: catálogo, revisión, emisión inmutable e instrucciones a Logística.
12. H2 Recepción y custodia: trabajo, modalidad documental, rutas, recepción directa, materiales y parciales.
13. H3 Novedades y retenciones: registro compartido, cantidades afectadas, investigaciones separadas.
14. H4 Microbodega: insumos, unidades, transferencias, recepción y conciliación.
15. H5 Recetas y tandas: cliente Planta vinculado, versiones, preparación parcial y consumos.
16. H6 Ciclos y ejecución: equipos, compatibilidad, reservas, ciclos mixtos y reprocesos.
17. H7 Calidad y documentos: evaluación, investigación, liberación y certificados por cliente.
18. H8 Entrega y validación integral: retorno de Planta, despacho parcial, devolución/retorno y cierre.

**D. `PROMPT_MAESTRO_V2_LOGISTICA_STERINOVA_IMPORTACION_XLSM.md` — importación histórica:**
19. Auditoría estructural del Excel `.xlsm` (ya parcialmente hecha: `VALIDACION_FORMATOS_LOGISTICA.md`).
20. Propuesta de ETL: mapeo origen-destino, normalización, limpieza, reglas de conflictos, dry run, reconciliación, logs, idempotencia y rollback. **No importar datos sin autorización.**
21. Regla D06 de la hoja de ruta: *"El Excel queda obsoleto para operar... No se importa Excel como parte de este recorrido"* — validar con el usuario si la importación histórica sigue vigente o queda descartada.

**E. `docs/arquitectura/estado-implementado.md`:**
22. Migración correctiva `RemoveLegacyUserRole1794484800000` (retira columna `usuarios.rol` y compatibilidad SQL) — aprobada pero **no ejecutada** en la base; requiere solicitud explícita.
23. Conciliar semilla RBAC (visibilidad SCOPE inicial vs restricción OWN del piloto) con requisitos de visibilidad compartida de Comercial.

**F. `docs/negocio/reglas-maestras.md` (módulos 1-8):**
24. Reglas de clientes: tipos de identificación (CC/NIT/CE/PET), unicidad por NIT, estados de activación/bloqueo, contactos múltiples, auditoría de ediciones.
25. Reglas de cotizaciones: múltiples servicios, estados (BORRADOR → EN_REVISIÓN → APROBADA_INTERNA → ENVIADA → ACEPTADA_CLIENTE → EMITIDA → ANULADA), separación creador/aprobador/emisor, seis condiciones obligatorias, IVA sin respuesta (pregunta 29).
26. Reglas de Logística: recepción física, diferencias/rechazos, materiales/lotes/unidades, empaque, transporte, estados operativos, control de despacho bloqueado por certificado de Calidad, bloqueo de materiales tras ciclo de Planta.
27. Reglas de Planta, Calidad, Certificados, Seguimiento (pendientes de lectura completa, referenciadas en reglas-maestras).

---

## 2. Plan por fases (orden sugerido)

Cada fase entrega código, pruebas, migraciones aditivas y documentación. No se ejecuta ninguna migración en base productiva sin autorización explícita.

### Fase A — Cierre de RBAC Fase 1 (P0)

**Objetivo:** Extender el piloto de Cotizaciones a los módulos restantes y completar la API de gestión de ámbitos/asignaciones.

| # | Tarea | Ámbito | Prioridad | Entregable | Criterio de salida |
|---|---|---|---|---|---|
| A1 | API general de gestión de ámbitos (crear/cerrar/asignar/delegar) con auditoría | Backend (rbac) | P0 | Endpoints + DTOs + pruebas | Pruebas de denegación, ámbito, propiedad, múltiples asignaciones pasan |
| A2 | Conciliar titular, asignaciones y cotizaciones históricas conforme a IDs del usuario | BD (migración/seed local) | P0 | Script de conciliación transaccional | Idempotente, con auditoría, sin fallback legado |
| A3 | Filtros SQL y proyecciones mínimas en Comercial, Logística, Planta, Calidad y documentos | Backend (varios módulos) | P0 | `resourceWhere` aplicado | Ninguna ruta expone datos fuera de ámbito sin permiso |
| A4 | Política general de sesiones y revocación fuera del piloto | Backend (rbac/users) | P0 | Servicio de revocación | Revocación probada sin afectar sesiones válidas |
| A5 | Endpoint `/auth/me` y selección de ámbito para cuentas multidepartamento | Backend (auth/rbac) | P1 | Endpoint + DTO | Usuario obtiene scopes disponibles y puede reducir contexto |
| A6 | Sustitución coordinada de guards por roles en módulos no piloto | Backend (guards) | P1 | Guards actualizados | Otros módulos migran de RolesGuard a AuthorizationGuard explícito |
| A7 | Pruebas de integración con MariaDB aislada: acceso por ID, delegación, revocación, ausencia de campos financieros | Pruebas | P0 | Suite de integración | 0 fallos, sin campos financieros en respuestas |
| A8 | Ejecutar migración correctiva `RemoveLegacyUserRole...` (solo con autorización) | BD | P0 | Migración aplicada | Columna `usuarios.rol` retirada, build y tests pasan |

**Dependencias:** Fase A requiere la conciliación de IDs confirmada por el usuario (mismo patrón que el piloto de Cotizaciones).

---

### Fase B — Logística Fase 2 (P0/P1)

**Objetivo:** Completar el módulo Logística con fuentes operativas reales, acta numerada independientemente, historial de emisiones y cierre de importes.

| # | Tarea | Ámbito | Prioridad | Entregable | Criterio de salida |
|---|---|---|---|---|---|
| B1 | Definir modelo de recepción real: fecha/hora, responsable, sede, evidencias (fotos/firma) | BD + Backend | P0 | Entidades `recepcion` / `recepcion_item` o extensión de `OrdenServicioEvento` | Campos de recepción persistidos, no confundidos con `fecha_programada` |
| B2 | Modelo de entrega: cantidades/cajas entregadas, transportista, conductor, placa, POD, recibido por | BD + Backend | P0 | Entidades `entrega` / `entrega_item` | Entrega parcial permitida si el negocio lo autoriza |
| B3 | Numeración independiente del Acta (consecutivo propio `AS-...`) ya existe en `ordenes_servicio.acta_consecutivo`; confirmar política institucional | BD/negocio | P0 | Decisión documentada | Acta no reusa consecutivo de Orden sin confirmación |
| B4 | Observaciones separadas: recepción vs cliente | Backend (DTO/entidad) | P1 | Campos `observaciones_recepcion`, `observaciones_cliente` | No se duplica `orden.observaciones` sin regla |
| B5 | Firmas y responsables: definir si manuscritas, digitalizadas o electrónicas | Backend + frontend | P1 | Entidades de firma/aprobación o documento de decisión | Decisión registrada en ADR |
| B6 | Historial auditable de emisiones: PDF inmutable, hash, snapshot, versión de plantilla | Backend (formatos-documentales + emitidos) | P0 | Entidad `documento_emitido` / `documento_evento` | Cada PDF generado deja registro inmutable |
| B7 | Decisión de integridad de importes (bloquear / ocultar / mostrar ambos) | Backend (logistica.service) | P0 | Regla implementada + pruebas | Fixture de estrés concilia o se documenta la política |
| B8 | Validar contrato fecha/hora de Logística: cerrar ítem del todo.md | Backend (DTO) | P1 | Validación estricta `YYYY-MM-DD` confirmada | Sin hora ni zona horaria en `fecha_programada` |
| B9 | Pruebas visuales de PDF Orden y Acta con datos ficticios (1, 10, 30, 100 materiales) | Pruebas (PDF) | P0 | Matriz de aceptación visual | Sin cortes, encabezados repetidos, firmas íntegras |

**Dependencias:** B1-B6 requieren confirmación del negocio sobre la relación Orden ↔ Acta (1:1, 1:N, N:1) y sobre el origen de los campos de recepción/entrega.

---

### Fase C — Hoja de ruta integral H0-H8 (P0/P1/P2)

**Objetivo:** Implementar los 8 hitos comunes backend + frontend según `hoja-ruta-integral-2026-11-12.md`.

| Hito | Entrega backend | Entrega frontend | Puerta de salida | Prioridad |
|---|---|---|---|---|
| H0 Contratos y conservación | Inventario de comportamiento actual, matriz de permisos, OpenAPI, datos ficticios comunes | — | Diferencias actual/objetivo documentadas | P0 |
| H1 Comercial | Catálogo, revisión, emisión inmutable, instrucciones a Logística | Navegación comercial | Asesor no aprueba; emitir dos veces no duplica | P1 |
| H2 Recepción y custodia | Trabajo, modalidad documental, rutas, recepción, materiales, parciales | Formularios de recepción | Recorrido orden/acta/ambos sin doble contabilización | P1 |
| H3 Novedades y retenciones | Registro compartido, cantidades afectadas, investigaciones | Pantalla de novedades | Retención efectiva en backend y visible en todas las áreas | P1 |
| H4 Microbodega | Insumos, unidades, transferencias, recepción, conciliación | Pantalla microbodega | Enviar 100 / recibir 98 → 2 por conciliar, 98 disponibles | P2 |
| H5 Recetas y tandas | Cliente Planta vinculado, versiones, preparación parcial, consumos | Gestión de recetas | Reanudar tanda no duplica insumo fijo | P2 |
| H6 Ciclos y ejecución | Equipos, compatibilidad, reservas, ciclos mixtos, reprocesos | Asignación a ciclos | Dos operadores no asignan el mismo saldo | P2 |
| H7 Calidad y documentos | Evaluación, investigación, liberación, certificados por cliente | Pantalla Calidad | Dos clientes → dos certificados sin filtración | P1 |
| H8 Entrega y validación integral | Retorno de Planta, despacho parcial, devolución, cierre | Despacho y cierre | Cada cantidad tiene destino; historial íntegro | P1 |

**Regla de entrada:** H3 precede a ejecución productiva en Planta. H3 no se añade como mejora posterior.

**Entradas técnicas necesarias antes de cada hito (no adivinarlas):**
- H5/H6: capacidades, unidades, restricciones, compatibilidad de cargas (Planta + Calidad); recetas reales (Jefe de Planta + Calidad).
- H7: evidencias, responsables, criterios de evaluación (Calidad).
- H2: formatos/numeración/agrupación institucional de acta y orden (Logística + responsable documental).
- Sincronización Siigo: identificador y mecanismo (Comercial + integración; se puede diseñar adaptador sin activarla).
- Tratamiento fiscal de diferencias (Comercial; antes de emisión real por diferencia).

---

### Fase D — Importación histórica desde Excel `.xlsm` (P2, condicional)

**Objetivo:** Si el usuario confirma que sigue vigente (a pesar de D06), construir el importador seguro.

| # | Tarea | Ámbito | Prioridad | Entregable | Criterio de salida |
|---|---|---|---|---|---|
| D1 | Auditar estructura real del Excel local (hash SHA-256, hojas, filas, claves, órganos huérfanos, duplicados) | Análisis de solo lectura | P2 | Informe `09_MAPA_EXCEL_Y_MIGRACION.md` | Estadísticas recalculadas sobre la copia local |
| D2 | Propuesta de ETL: mapeo origen-destino, normalización, limpieza, reglas de conflictos | Diseño | P2 | Documento de mapeo | Mapeo revisado por el negocio |
| D3 | Dry run con conteos de reconciliación, logs, idempotencia y rollback | Pruebas (base aislada) | P2 | Script dry run | 0 escrituras reales, reconciliación documentada |
| D4 | Importación efectiva (solo con autorización explícita) | BD | P2 | Datos importados | Sin duplicados, sin sobrescribir existentes |

**Nota:** D06 de la hoja de ruta dice *"El Excel queda obsoleto para operar... No se importa Excel como parte de este recorrido"*. Validar con el usuario antes de iniciar D1-D4.

---

### Fase E — Calidad, pruebas, despliegue y documentación (P0 transversal)

| # | Tarea | Ámbito | Prioridad | Entregable | Criterio de salida |
|---|---|---|---|---|---|
| E1 | Suite unitaria completa (`npm test`) | Pruebas | P0 | 0 fallos | Cobertura mantenida |
| E2 | Lint (`npm run lint`) | Calidad de código | P0 | 0 errores | oxlint limpio |
| E3 | Build (`npm run build`) | Compilación | P0 | Sin errores de TS | dist generado |
| E4 | Pruebas E2E enfocadas (`npm run test:e2e`) | Integración | P0 | 0 fallos | Contratos OpenAPI preservados |
| E5 | Pruebas de PDF visuales (aceptación documental) | PDF | P0 | Matriz pasada | Fidelidad institucional verificada |
| E6 | Actualizar documentación activa solo si cambia comportamiento documentado | Docs | P1 | ADRs / README actualizados | Sin generalidades, con `ruta:línea` |
| E7 | Runbook de despliegue y rollback | Operación | P1 | `docs/manuales/despliegue.md` actualizado | Procedimiento de reversión documentado |

---

## 3. Matriz de prioridades y puertas de salida

| Prioridad | Significado | Ejemplos |
|---|---|---|
| **P0** | Bloqueante: integridad de datos, permisos, conservación de documentos emitidos, numeración sin duplicados, historial auditable | A1, A2, A3, A7, A8, B1, B3, B6, B7, B9, E1-E3 |
| **P1** | Funcional principal: proceso Orden/Acta, recepción, entrega, despacho, certificados, retenciones | A5, A6, B2, B4, B5, B8, C (H1,H2,H3,H7,H8) |
| **P2** | Mejora/administrativo: microbodega, recetas, ciclos mixtos, importación Excel, editor de versiones | C (H4,H5,H6), D1-D4 |

**Puerta de salida general de cada fase:** pruebas focalizadas + contratos + tipos/lint/build + recorrido con permisos de cada área + conciliación de movimientos + revisión de documentos reales con datos ficticios.

---

## 4. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Copiar el Excel de forma literal | Modelar entidades normalizadas; no usar filas planas como esquema |
| Crear módulo independiente/duplicado | Reutilizar servicios existentes (`OrdenServicio`, `Cotizacion`, `FormatoVersiones`, `AuditoriaService`) |
| Confundir Orden con Acta | Diccionario de campos y flujos diferenciados; numeración independiente |
| Tratar escaneo como plantilla editable | Reconstrucción visual documentada; no fondo de imagen fijo |
| PDF con filas cortadas | Motor de paginación probado con casos de estrés (1, 10, 30, 100 ítems) |
| Formatos antiguos alterados | PDF/snapshot inmutables + vínculo a versión de plantilla congelada |
| Consecutivos duplicados | Restricciones únicas, transacciones, idempotencia, `ON DUPLICATE KEY` |
| Cálculos de valores incorrectos | Backend valida; no confiar en cálculos de frontend; redondeo formal |
| Cambios no aprobados de plantilla | Permisos, revisión, aprobación, publicación y auditoría de versiones |
| Reglas sanitarias inventadas | Registrar requisitos normativos pendientes; responsable de validación |
| Migración con datos corruptos | Dry run, trazabilidad, limpieza documentada, conciliación, rollback |
| Ejecutar migración sin autorización | `RemoveLegacyUserRole...` solo con solicitud explícita del usuario |

---

## 5. Preguntas abiertas / bloqueantes (para validar con el usuario)

**Bloqueantes (paralizan si no se resuelven):**
1. ¿Confirma que la importación histórica desde Excel `.xlsm` se descarta por regla D06, o sigue vigente como Fase D?
2. ¿Cuál es la relación institucional Orden ↔ Acta (1:1, 1:N, N:1)? Define si se necesita entidad de Acta independiente.
3. ¿Qué IDs de titular, usuarios y cotizaciones deben usarse para la conciliación RBAC (mismo patrón que el piloto)?
4. ¿Autoriza ejecutar la migración correctiva `RemoveLegacyUserRole1794484800000` en la base local?
5. ¿Cuál es la política de importes en la emisión de Logística: ¿bloquear, ocultar o mostrar ambos conceptos (cotizado vs operativo)?

**No bloqueantes (documentar y seguir):**
6. ¿Tamaño de hoja, márgenes y fuente institucional oficial para PDFs?
7. ¿Firmas en pantalla, impresas o digitales/electrónicas?
8. ¿Origen oficial de precios, transporte, impuestos y redondeos (Siigo o interno)?
9. ¿Mecanismo de firma digital para recepción (foto no equivale a firma digital)?
10. ¿Alcance exacto del rol auditor (exportación a Excel de cotizaciones y certificados)?

---

## 6. Siguiente paso concreto sugerido

Sin modificar código ni base de datos:

1. El usuario confirma el alcance prioritario (¿Fase A, B, C, D o combinación?).
2. El usuario responde las preguntas bloqueantes (1-5).
3. Se escribe el plan técnico detallado por fase (ADR + archivos previstos + esfuerzo relativo).
4. Con autorización explícita, se inicia la implementación incremental de la Fase A.

Este documento no es autorización para ejecutar migraciones, commits ni cambios en producción.
