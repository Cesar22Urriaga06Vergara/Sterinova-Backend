# Plan de acción — Backend Sterinova ERP



> **Estado:** vigente

> **Rol del autor:** Experto en backend (NestJS 12, TypeORM 0.3, MariaDB, Playwright)

> **Repositorio:** `backend_sterinova`

> **Fecha:** 6 de noviembre de 2026

> **Base:** auditoría del 6-nov, checklist operativo, resumen de cierre, revisión de calidad documental

> **Alcance:** plan ejecutable por fases; no reabre la auditoría; no certifica despliegue

> **No cubre:** aceptación visual de PDFs (responsable de negocio), validación regulatoria (Calidad), operación en producción (DevOps)



---



## 1. Contexto y estado de partida



El backend está en un estado funcional parcial con cobertura de los flujos Comercial, Logística, Planta, Calidad, Certificados, Formatos y Sellos. Persisten gaps conocidos que este plan cierra de forma ordenada:



- Seguridad: JWT y roles implementados; faltan rate limiting, headers, política de secretos sin fallback, CORS por ambiente.

- Datos: `synchronize: false`, 11 migraciones registradas; estado aplicado por ambiente no verificado.

- Consecutivos: mecanismo transaccional con bloqueo; base limpia emite `001`.

- Dominio: no hay entidades de evidencias ni firma digital; auditoría selectiva, no integral.

- PDFs: Playwright + rutas internas Next.js; storage local por defecto; hash y versión guardados.

- Pruebas: 25 `*.spec.ts` + 1 e2e; no ejecutadas en la auditoría.

- Documentación: actualizada, con fuente canónica por tema.



**Este plan no reabre la auditoría. Ejecuta lo que la auditoría dejó como pendiente operativo.**



---



## 2. Objetivo del plan



Llevar el backend a un estado **operable, verificable y mantenible** en un ambiente controlado (staging), con:



1. Seguridad endurecida y secretos sin fallback.

2. Contrato API formal (OpenAPI) y validación completa.

3. Datos con integridad demostrada (migraciones, consecutivos, inmutabilidad).

4. Dominio regulatorio decidido y, si aplica, implementado (evidencias/firmas).

5. PDFs trazables, persistentes y aceptados.

6. Cobertura de pruebas significativa y CI verde.

7. Observabilidad mínima y despliegue reproducible.

8. Documentación viva enlazada al contrato.



---



## 3. Roles y responsabilidades



| Rol | Responsabilidad principal | Participa en fases |

|---|---|---|

| **Tech Lead Backend** | Prioriza, desbloquea, aprueba DoD, coordina con producto y DevOps | Todas |

| **Backend Senior — Auth y Seguridad** | JWT, guardas, roles, rate limiting, headers, DTOs, errores | F1, F5 |

| **Backend Senior — Datos y Migraciones** | Entidades, migraciones, triggers, consecutivos, integridad | F2, F3 |

| **Backend Senior — Dominio** | Módulos de negocio, reglas, transacciones, PDFs | F3, F4 |

| **Backend Mid** | Implementación de endpoints, tests unitarios, correcciones | F1–F5 |

| **DBA / Data Engineer** | Estado de BD, respaldos, restore, baseline, consultas de diagnóstico | F0, F2, F6 |

| **QA Backend** | Pruebas unitarias, e2e, concurrencia, cobertura, CI | F0, F2, F4, F5 |

| **Security Engineer** | Revisión de auth, secretos, CORS, dependencias, OWASP | F1, F6 |

| **DevOps / SRE** | Ambientes, secretos, observabilidad, despliegue, backups | F0, F6, F7 |

| **Responsable de producto / negocio** | Decisiones de dominio (evidencias, firma, aceptación visual), priorización | F3, F4 |

| **Tech Writer** | OpenAPI, changelog, ADRs, `.env.example`, runbooks | F7 |

| **Responsable de Calidad (regulatorio)** | Validación de invariantes y aceptación de PDFs | F3, F4 |



**Regla de asignación:** ningún rol puede ser ejercido por la misma persona en revisión y ejecución de la misma actividad crítica (auth, migraciones, inmutabilidad).



---



## 4. Principios de ejecución



1. **Nada se declara hecho sin evidencia archivada** (comando, salida, captura, commit).

2. **Ninguna migración se aplica sin respaldo previo y `migration:show` archivado.**

3. **Ningún cambio de contrato API se mergea sin actualizar OpenAPI y docs.**

4. **Ningún endpoint nuevo sin DTO validado, guarda de rol y test.**

5. **Ningún secreto en repo, logs o capturas.**

6. **Ningún PR sin checklist de PR (tests, docs, migración, seguridad).**

7. **Ninguna afirmación de “funciona” sin ejecución en staging.**



---



## 5. Fases



### Fase 0 — Baseline y verificación operativa



**Objetivo:** tener una fotografía verificable del estado real antes de tocar nada.



**Roles:** Tech Lead, DBA, QA Backend, DevOps.



**Actividades:**

- Clonar repos, `npm ci`, `npm run build`.

- Ejecutar `npm run migration:show` en staging y archivar salida.

- Ejecutar `npm run test` y `npm run test:e2e`; archivar resumen y cobertura.

- Verificar `synchronize: false` y `migrationsRun: false` en `app.module.ts` y `data-source.ts`.

- Registrar versión de Node, npm, MariaDB y Playwright.

- Documentar variables de entorno requeridas por el código (sin valores).

- Confirmar ausencia de `.env.example` y registrar como pendiente para F7.

- Verificar `git log`, `git status`, rama base.



**Entregables:**

- `baseline.md` con todos los comandos, salidas y versiones.

- Reporte de cobertura actual.

- Lista de divergencias entre baseline y auditoría del 6-nov.



**DoD:**

- Baseline archivado y firmado por Tech Lead.

- Cero divergencias no explicadas con la auditoría.

- Staging accesible y reproducible.



**Dependencias:** ninguna. Bloquea todas las fases.



---



### Fase 1 — Seguridad y contrato API



**Objetivo:** endurecer seguridad y formalizar el contrato HTTP.



**Roles:** Backend Senior Auth, Security Engineer, Backend Mid, QA Backend.



**Actividades:**

- Eliminar fallback de `JWT_SECRET`; fallar al arranque si falta o es débil.

- Confirmar ausencia de `POST /auth/seed` en el controlador y en la API desplegada.

- Endurecer `bootstrap:admin`: longitud mínima, complejidad, idempotencia, log sin secretos.

- Rate limiting en `/auth/login` (por IP y por email).

- Headers de seguridad (`helmet` o equivalente).

- CORS por ambiente vía variable (`CORS_ORIGINS`), no hardcode.

- `ValidationPipe` global con `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.

- DTOs completos en todos los endpoints (crear, actualizar, query params).

- Catálogo de errores: códigos estables, mensajes claros, sin filtrar detalles internos.

- Documento OpenAPI generado y versionado.

- Revisión OWASP Top 10 sobre auth, roles, PDF y validación pública.



**Entregables:**

- `openapi.yaml` (o JSON) en `docs/arquitectura/api-y-contratos.md`.

- Guía de errores (`docs/arquitectura/errores-api.md`).

- Reporte de revisión de seguridad.

- Tests de auth: login OK/KO, token expirado, rol insuficiente, rate limit.



**DoD:**

- 100 % endpoints con DTO validado.

- OpenAPI coincide con la implementación (validado con test de contrato).

- Sin secretos hardcodeados ni fallbacks.

- Reporte de seguridad sin hallazgos críticos o con mitigaciones aceptadas.



**Dependencias:** F0.



---



### Fase 2 — Datos, migraciones y consecutivos



**Objetivo:** garantizar integridad de datos y atomicidad de consecutivos.



**Roles:** Backend Senior Datos, DBA, QA Backend.



**Actividades:**

- Aplicar las 11 migraciones en staging limpio y en copia de producción; archivar salidas.

- Documentar baseline vs. migración (`InitialSchema`) y cómo se reconoce una BD existente.

- Verificar trigger de inmutabilidad de certificados aprobados.

- Verificar que `AddPdfRendererVersion` permite solo cambios técnicos del PDF.

- Test de concurrencia: N hilos emitiendo certificado simultáneamente; debe emitirse 1 y fallar N-1 con reintento controlado.

- Documentar valor actual de `secuencias_consecutivos` por ambiente.

- Confirmar comportamiento en base limpia: primer certificado = `001`.

- Definir política de respaldo previo a DDL y restore probado.

- Crear `.env.example` con todas las variables (sin valores).

- Documentar `migration:revert` y su uso restringido.



**Entregables:**

- `docs/base-de-datos/respaldos-y-operacion.md` actualizado con runbook de migración.

- Test `concurrencia-secuencias.spec.ts`.

- `.env.example` en raíz.

- Reporte de migraciones aplicadas por ambiente.



**DoD:**

- 0 migraciones pendientes en staging.

- Test de concurrencia verde.

- Restore probado y documentado.

- `.env.example` completo y versionado.



**Dependencias:** F0.



---



### Fase 3 — Dominio regulatorio: evidencias, firmas, auditoría



**Objetivo:** decidir y, si aplica, implementar entidades y flujos de evidencia y firma; extender auditoría.



**Roles:** Backend Senior Dominio, Responsable de producto, Responsable de Calidad, DBA, QA.



**Actividades:**

- ADR-001: ¿se requiere entidad de evidencias adjuntas al ciclo? (foto, tirilla, PDF externo)

- ADR-002: ¿se requiere firma digital del aprobador/cliente? (interna vs. tercero vs. aceptación gráfica)

- Si sí: diseñar entidades, migración, endpoints, permisos, storage seguro, hash, versionado.

- Si no: documentar decisión y alcance regulatorio aceptado por Calidad.

- Extender auditoría para cubrir operaciones críticas (auth, emisión, aprobación, rechazo, cambios de formato) en lugar de selectiva.

- Endpoint de historial por entidad (auditoría paginada, filtros por entidad, usuario, fecha).

- Política de retención y anonimización acordada con Calidad.



**Entregables:**

- `docs/arquitectura/adr-001-evidencias.md` y `adr-002-firmas.md` (existan o no las entidades).

- Migración (si aplica) probada en staging.

- `docs/calidad-y-pruebas/calidad-de-datos.md` actualizado con invariantes y política de retención.

- Endpoint `/auditoria` con permisos y tests.



**DoD:**

- Decisión documentada y aprobada por Calidad.

- Si hay entidad, migración probada, endpoints con permisos y tests.

- Auditoría cubre 100 % de operaciones críticas listadas.



**Dependencias:** F1 (auth), F2 (datos).



---



### Fase 4 — PDFs y documentos oficiales



**Objetivo:** PDFs trazables, persistentes, aceptados y recuperables.



**Roles:** Backend Senior Dominio (PDF), Frontend Senior (render), QA, DevOps, Responsable de Calidad.



**Actividades:**

- Aceptación visual formal de cotización y certificado contra plantillas Word (responsable: Calidad + negocio).

- Versionado de renderer: documentar cuándo cambia y cómo se regenera.

- Storage: migrar de `storage/pdfs` local a almacenamiento persistente (volumen compartido o S3-compatible).

- Health check del render Playwright; fallback con cola y reintento si el render falla.

- Verificación de hash SHA-256 al descargar; alertar si no coincide.

- Endpoint público `/certificados/validar/:token`: rate limiting, CORS controlado, sin datos sensibles extra.

- Test de regeneración desde snapshot: emitir con versión A, actualizar renderer, regenerar, verificar que cambia `pdf_renderer_version` pero no datos de negocio.

- QR: validar URL absoluta correcta por ambiente.



**Entregables:**

- `docs/calidad-y-pruebas/aceptacion-visual-pdfs.md` con firma de Calidad por versión de formato.

- `docs/manuales/runbook-pdfs.md` (storage, health, fallback, regeneración).

- Tests de regeneración y de hash.



**DoD:**

- PDFs aceptados formalmente por Calidad.

- Storage persistente operativo en staging.

- QR verificado en dispositivo real.

- Runbook publicado.



**Dependencias:** F1, F2.



---



### Fase 5 — Calidad y pruebas



**Objetivo:** cobertura significativa y CI verde.



**Roles:** QA Backend, Backend Senior, Tech Lead.



**Actividades:**

- Cobertura de tests: auth (login, token, roles), clientes (CRUD + bulk + dedupe), cotizaciones (cálculo, prefijos, 7 tipos), órdenes (transiciones), ciclos (transacción), calidad (aprobar/rechazar), certificados (consecutivo, inmutabilidad, PDF), formatos, sellos, auditoría.

- E2E del flujo completo: cotización → orden → ciclo → calidad → certificado → PDF → validación pública.

- Mocks de Playwright para tests rápidos; test de render real en pipeline separado.

- Umbral de cobertura acordado por módulo (sugerido: 70 % líneas, 60 % ramas en módulos críticos).

- Pipeline CI: lint + build + test + e2e + migration check.

- Test de contrato OpenAPI vs. implementación.



**Entregables:**

- Reporte de cobertura por módulo.

- Pipeline CI funcional.

- Lista de tests añadidos.



**DoD:**

- Cobertura ≥ umbral en módulos críticos.

- E2E verde en CI.

- Contrato OpenAPI validado en CI.



**Dependencias:** F1, F2, F3, F4.



---



### Fase 6 — Observabilidad y despliegue



**Objetivo:** operabilidad y despliegue reproducible.



**Roles:** DevOps, Tech Lead, Backend Senior, Security Engineer.



**Actividades:**

- Logs estructurados JSON con `correlation_id` propagado por request.

- Health endpoints: `/health/live`, `/health/ready` (verifican DB, storage PDF, render).

- Métricas mínimas: latencia, errores, emisiones, aprobaciones, PDFs generados.

- Secrets en gestor (no en `.env` de servidor); rotación documentada.

- CORS por ambiente.

- Estrategia de deploy: blue/green o rolling; rollback documentado.

- Backups automáticos de MariaDB y de storage PDF; restore probado.

- Runbook de incidentes: qué mirar, a quién escalar.

- Alertas básicas (errores 5xx, fallo de migración, fallo de render, cola atascada).



**Entregables:**

- `docs/manuales/despliegue.md` completo.

- `docs/manuales/runbook-incidentes.md`.

- Dashboards mínimos.

- Backups y restore probados con fecha.



**DoD:**

- Staging operativo con observabilidad.

- Backups y restore verificados.

- Alertas configuradas.

- Rollback probado.



**Dependencias:** F5.



---



### Fase 7 — Documentación viva



**Objetivo:** mantener documentación alineada al código de forma sostenible.



**Roles:** Tech Writer, Tech Lead, todos.



**Actividades:**

- OpenAPI como fuente única del contrato; publicación automática.

- `.env.example` versionado; docs de variables.

- `CHANGELOG.md` por release.

- `CONTRIBUTING.md` con checklist de PR.

- ADRs para decisiones de arquitectura y dominio.

- PR template que obligue a: tests, docs, migración, seguridad, contrato.

- Proceso: ningún PR cambia contrato, rutas, migraciones o permisos sin actualizar la fuente canónica correspondiente.



**Entregables:**

- `CHANGELOG.md`, `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`.

- `docs/arquitectura/adr/` con al menos 2 ADRs iniciales.

- OpenAPI publicado en docs.



**DoD:**

- Docs vivas y enlazadas.

- PR template activo.

- OpenAPI válido y accesible.



**Dependencias:** transversal; cierra al final.



---



## 6. Orden de ejecución y dependencias



```

F0 ──► F1 ──┬──► F4 ──┐

│ ├──► F5 ──► F6 ──► F7 (cierre)

F2 ──┘ │

│ │

F3 ──┘ (necesita decisión de negocio)

```



- F0 bloquea todo.

- F1 y F2 en paralelo tras F0.

- F3 requiere F1 y F2; depende de decisión de negocio.

- F4 requiere F1 y F2; puede solaparse con F3.

- F5 requiere F1–F4.

- F6 requiere F5.

- F7 es transversal y cierra al final.



---



## 7. Riesgos y mitigaciones



| Riesgo | Mitigación |

|---|---|

| Migración falla en producción | Respaldo previo, `migration:show` archivado, ensayo en copia |

| Concurrencia de secuencias genera duplicados | Test de concurrencia obligatorio, revisión de lock |

| PDFs se pierden entre instancias | Storage persistente compartido, backups probados |

| Render falla y bloquea emisión | Cola + reintento, health check, alerta |

| Firma/evidencias no se implementan y Calidad no acepta | ADR con decisión formal, aceptación documentada |

| Cambios de contrato rompen frontend | OpenAPI validado en CI, coordinación con frontend |

| Secretos filtrados | Gestor de secretos, revisión de PRs, sin `.env` en repo |

| Cobertura baja en módulos críticos | Umbral por módulo, gate en CI |



---



## 8. Métricas de éxito



- 0 migraciones pendientes en staging.

- 0 hallazgos críticos de seguridad abiertos.

- Cobertura ≥ umbral en módulos críticos.

- E2E del flujo completo verde.

- PDFs aceptados formalmente.

- Staging con observabilidad, backups y rollback probados.

- OpenAPI válido y publicado.

- `.env.example` completo.

- Docs vivas y enlazadas.



---



## 9. Anexos



- Auditoría del 6-nov: `docs/estado-proyecto/auditoria-docs-2026-11-06.md`

- Revisión de calidad documental: `docs/estado-proyecto/revision-calidad-documental.md`

- Resumen de cierre: `docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md`

- Checklist operativo: `docs/calidad-y-pruebas/checklist-verificacion-operativa.md`

- Esquema y migraciones: `docs/base-de-datos/esquema-y-migraciones.md`

- Arquitectura: `docs/arquitectura/arquitectura-y-stack.md`

- Estado funcional: `docs/estado-proyecto/modulos.md`
