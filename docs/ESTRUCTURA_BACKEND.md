# Estructura de Sterinova-Backend

- Proyecto: Sterinova-Backend
- Ruta raíz del repositorio: `C:\Users\urria\Sterinova-Backend`
- Fecha de generación: 2026-11-11
- Carpetas incluidas (incluye la raíz): 87
- Archivos incluidos: 380
- Total de carpetas y archivos: 467

```text
Sterinova-Backend/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── assets/
│   └── pdf-templates/
│       ├── certificaciones-icontec-iqnet.jpeg
│       ├── Logo1.png
│       ├── quote-industrial-eto-watermark.jpg
│       ├── quote-institutional-eto-watermark.jpg
│       ├── quote-institutional-steam-watermark.jpg
│       ├── quote-laundry-watermark.jpg
│       ├── quote-supplies-watermark.jpg
│       └── sello-calidad.png
├── docs/
│   ├── archivo/
│   │   ├── 2026-11-10/
│   │   │   ├── contexto/
│   │   │   │   ├── auth.md
│   │   │   │   ├── cobertura-tests.md
│   │   │   │   ├── deuda-tecnica.md
│   │   │   │   ├── endpoints.md
│   │   │   │   ├── estados-entidades.md
│   │   │   │   ├── INDEX.md
│   │   │   │   ├── INSTRUCCIONES_CONTEXTO_TANDA2.md
│   │   │   │   ├── migraciones.md
│   │   │   │   ├── modelo-datos.md
│   │   │   │   ├── modulos-backend.md
│   │   │   │   ├── pdf-render.md
│   │   │   │   └── rbac.md
│   │   │   └── estado-proyecto/
│   │   │       ├── historico/
│   │   │       │   ├── analisis-estado-2026-11-03.md
│   │   │       │   └── analisis-estado-2026-11-04.md
│   │   │       ├── auditoria-docs-2026-11-06.md
│   │   │       ├── baseline-fase0.md
│   │   │       ├── cierre-hito4-y-traspaso-2026-11-09.md
│   │   │       ├── hito1-iva-dinamico-2026-11-09.md
│   │   │       ├── hito2-edicion-borradores-2026-11-09.md
│   │   │       ├── hito4-paso1-datos-operativos-2026-11-09.md
│   │   │       ├── hito4-paso2-backend-2026-11-09.md
│   │   │       ├── hito4-paso3-frontend-2026-11-09.md
│   │   │       ├── inicio-fase1-rbac-2026-11-08.md
│   │   │       ├── modulos.md
│   │   │       ├── piloto-cotizaciones-rbac-2026-11-08.md
│   │   │       ├── plan-accion-backend-2026-11-06.md
│   │   │       ├── reporte-fase1.md
│   │   │       ├── reporte-fase2.md
│   │   │       ├── reporte-fase3.md
│   │   │       ├── reporte-fase4.md
│   │   │       ├── reporte-fase5.md
│   │   │       ├── reporte-fase6.md
│   │   │       ├── reporte-fase7.md
│   │   │       ├── resumen-cierre-auditoria-2026-11-06.md
│   │   │       ├── revision-calidad-documental.md
│   │   │       └── transicion-frontend-y-reglas-2026-11-09.md
│   │   └── 2026-11-11/
│   │       ├── calidad-y-pruebas/
│   │       │   └── unificacion-roles-2026-11-10.md
│   │       ├── gestion-documental/
│   │       │   ├── inventario-origen.json
│   │       │   ├── reorganizacion-2026-11-10.md
│   │       │   └── verificacion-2026-11-10.md
│   │       └── superpowers/
│   │           └── plans/
│   │               └── 2026-11-10-usuarios-prueba.md
│   ├── arquitectura/
│   │   ├── adr/
│   │   │   ├── 001-evidencias-y-firmas.md
│   │   │   ├── 002-pdf-playwright-nextjs.md
│   │   │   ├── 003-consecutivos-transaccionales.md
│   │   │   ├── 004-rbac-con-ambitos.md
│   │   │   └── README.md
│   │   ├── api-y-contratos.md
│   │   ├── arquitectura-y-stack.md
│   │   ├── auditoria-dependencias.md
│   │   ├── contexto-frontend.md
│   │   ├── contrato-autorizacion-rbac.md
│   │   ├── estado-implementado.md
│   │   ├── openapi.json
│   │   └── roles-y-permisos.md
│   ├── auditorias/
│   │   ├── OPTIMIZACION_ESTRUCTURA_Y_CONTEXTO_IA.md
│   │   ├── PLAN_CORRECCION_AUTENTICACION_RBAC.md
│   │   ├── RESULTADO_CORRECCION_AUTENTICACION_RBAC.md
│   │   └── VALIDACION_FORMATOS_LOGISTICA.md
│   ├── base-de-datos/
│   │   ├── esquema-y-migraciones.md
│   │   └── respaldos-y-operacion.md
│   ├── calidad-y-pruebas/
│   │   ├── aceptacion-visual-pdfs.md
│   │   ├── calidad-de-datos.md
│   │   ├── checklist-verificacion-operativa.md
│   │   └── pruebas.md
│   ├── contexto/
│   ├── ejemplos-formatos/
│   │   ├── Acta de Servicio.pdf
│   │   ├── COT- CMED139 Ejemplo de Cotizacion Diligenciado.pdf
│   │   ├── COT-CEMFA192-1 Ejemplo de Cotizacion Diligenciado.pdf
│   │   ├── COT-CME1095 Ejemplo de Cotizacion Diligenciado.pdf
│   │   ├── COT-CMI522 Ejemplo de Cotizacion Diligenciado.pdf
│   │   ├── COT-LAV15-1 Ejemplo de Cotizacion Diligenciado.pdf
│   │   ├── Ejemplo de Certificado de Esterilizacion.pdf
│   │   ├── LOGISTICA.xlsm
│   │   ├── Orden de Servicio.pdf
│   │   ├── R-CM-07-1 COTIZACION ESTERILIZACION INDUSTRIAL V4 17-09-2026.docx
│   │   ├── R-CM-07-2 COTIZACION ESTERILIZACION INSTITUCIONAL ETO V4 17-09-2026.docx
│   │   ├── R-CM-07-3 COTIZACION ESTERILIZACION INSTITUCIONAL VAPOR V4 17-09-2026.docx
│   │   ├── R-CM-07-4 COTIZACION INSUMOS V4 17-09-2026.docx
│   │   └── R-CM-07-5 LAVANDERIA FARMACEUTICA V4 17-09-2026.docx
│   ├── estado-proyecto/
│   │   └── historico/
│   ├── gestion-documental/
│   ├── manuales/
│   │   ├── configuracion-local.md
│   │   ├── despliegue.md
│   │   ├── runbook-incidentes.md
│   │   └── runbook-pdfs.md
│   ├── negocio/
│   │   ├── contexto-producto.md
│   │   ├── cuestionarios-origen.md
│   │   └── reglas-maestras.md
│   ├── superpowers/
│   │   └── plans/
│   │       ├── 2026-11-10-rbac-backend.md
│   │       └── 2026-11-11-rbac-users-validation.md
│   ├── ui-ux/
│   │   └── correspondencia-ui-api.md
│   ├── auditoria-funcional-y-oportunidades.md
│   ├── CONTEXTO_RAPIDO.md
│   ├── ESTRUCTURA_BACKEND.md
│   ├── inventario-documental.md
│   └── README.md
├── scripts/
│   ├── backup-local-db.mjs
│   ├── generate-structure-docs.ps1
│   ├── run-isolated-app-e2e.mjs
│   ├── seed-local-role-users.mjs
│   ├── test-rbac-schema.ps1
│   ├── verify-local-role-access.mjs
│   └── verify-rbac-unification.mjs
├── src/
│   ├── auditoria/
│   │   ├── dto/
│   │   │   └── query-auditoria.dto.ts
│   │   ├── entities/
│   │   │   └── auditoria.entity.ts
│   │   ├── auditoria.controller.spec.ts
│   │   ├── auditoria.controller.ts
│   │   ├── auditoria.module.ts
│   │   ├── auditoria.service.spec.ts
│   │   └── auditoria.service.ts
│   ├── auth/
│   │   ├── decorators/
│   │   │   └── public.decorator.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.security.spec.ts
│   │   ├── auth.service.ts
│   │   ├── auth-rbac-flow.spec.ts
│   │   └── jwt.strategy.ts
│   ├── calidad/
│   │   ├── dto/
│   │   │   ├── approve-cycle.dto.ts
│   │   │   ├── evaluacion-parametro.dto.ts
│   │   │   └── reject-cycle.dto.ts
│   │   ├── calidad.controller.ts
│   │   ├── calidad.module.ts
│   │   ├── calidad.service.spec.ts
│   │   └── calidad.service.ts
│   ├── certificados/
│   │   ├── entities/
│   │   │   └── certificado-esterilizacion.entity.ts
│   │   ├── certificados.concurrency.spec.ts
│   │   ├── certificados.controller.spec.ts
│   │   ├── certificados.controller.ts
│   │   ├── certificados.module.ts
│   │   ├── certificados.service.spec.ts
│   │   ├── certificados.service.ts
│   │   ├── fecha-vencimiento.spec.ts
│   │   ├── fecha-vencimiento.ts
│   │   ├── informacion-tecnica.spec.ts
│   │   └── informacion-tecnica.ts
│   ├── clientes/
│   │   ├── dto/
│   │   │   ├── cliente-fields.spec.ts
│   │   │   ├── create-cliente.dto.spec.ts
│   │   │   ├── create-cliente.dto.ts
│   │   │   └── update-cliente.dto.ts
│   │   ├── entities/
│   │   │   └── cliente.entity.ts
│   │   ├── clientes.controller.ts
│   │   ├── clientes.module.ts
│   │   ├── clientes.service.spec.ts
│   │   └── clientes.service.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── guards/
│   │   │   ├── roles.guard.spec.ts
│   │   │   └── roles.guard.ts
│   │   └── services/
│   │       ├── storage.service.spec.ts
│   │       └── storage.service.ts
│   ├── cotizaciones/
│   │   ├── dto/
│   │   │   ├── create-cotizacion.dto.spec.ts
│   │   │   ├── create-cotizacion.dto.ts
│   │   │   ├── create-cotizacion-item.dto.ts
│   │   │   ├── solicitud-anulacion.dto.ts
│   │   │   └── update-cotizacion.dto.ts
│   │   ├── entities/
│   │   │   ├── cotizacion.entity.ts
│   │   │   ├── cotizacion-item.entity.ts
│   │   │   ├── solicitud-anulacion.entity.ts
│   │   │   └── tipo-servicio.enum.ts
│   │   ├── cotizaciones.controller.spec.ts
│   │   ├── cotizaciones.controller.ts
│   │   ├── cotizaciones.module.ts
│   │   ├── cotizaciones.quality-branches.spec.ts
│   │   ├── cotizaciones.service.spec.ts
│   │   ├── cotizaciones.service.ts
│   │   ├── cotizaciones-cancelled-emission.spec.ts
│   │   ├── cotizaciones-edit.spec.ts
│   │   ├── cotizaciones-emission.spec.ts
│   │   ├── cotizaciones-tax.spec.ts
│   │   ├── quote-access.ts
│   │   ├── solicitud-anulacion.controller.ts
│   │   ├── solicitud-anulacion.service.spec.ts
│   │   └── solicitud-anulacion.service.ts
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 1730750400000-InitialSchema.ts
│   │   │   ├── 1730750401000-AddQualityCertificates.ts
│   │   │   ├── 1730750402000-AddCertificateValidationToken.ts
│   │   │   ├── 1793750400000-AddDocumentFormatVersioning.ts
│   │   │   ├── 1793754000000-ResetCertificateSequenceToThreeDigits.ts
│   │   │   ├── 1793757600000-ExtendDocumentSequences.ts
│   │   │   ├── 1793813200000-AddClienteDocumentFields.ts
│   │   │   ├── 1793813300000-CreateAuditoria.ts
│   │   │   ├── 1793813400000-AddTemplateResponsible.ts
│   │   │   ├── 1793813500000-AddPdfRendererVersion.ts
│   │   │   ├── 1793813600000-AddUsersAndCertificationSeals.spec.ts
│   │   │   ├── 1793813600000-AddUsersAndCertificationSeals.ts
│   │   │   ├── 1793813700000-ExtendAuditoriaEvents.ts
│   │   │   ├── 1794096000000-AddScopedRbac.spec.ts
│   │   │   ├── 1794096000000-AddScopedRbac.ts
│   │   │   ├── 1794096001000-ScopeQuotePilot.spec.ts
│   │   │   ├── 1794096001000-ScopeQuotePilot.ts
│   │   │   ├── 1794225600000-AddVersionedIva.ts
│   │   │   ├── 1794225601000-AddQuoteEditVersion.ts
│   │   │   ├── 1794225602000-AddOperationalDocumentData.ts
│   │   │   ├── 1794225603000-AddCancellationRequests.ts
│   │   │   ├── 1794225604000-AddCancellationPermissions.ts
│   │   │   ├── 1794312000000-AddBackendRoleSchema.ts
│   │   │   ├── 1794312001000-SeedBackendRoles.ts
│   │   │   ├── 1794312002000-UnifyUserRoleAssignments.ts
│   │   │   ├── 1794398400000-BridgeLegacyUserAdministration.ts
│   │   │   ├── 1794413600000-AddPasswordVersion.spec.ts
│   │   │   ├── 1794413600000-AddPasswordVersion.ts
│   │   │   ├── 1794413660000-CreatePasswordResetTokens.ts
│   │   │   ├── backend-role-metadata.spec.ts
│   │   │   ├── backend-role-phase1.spec.ts
│   │   │   └── schema-migrations.spec.ts
│   │   ├── data-source.ts
│   │   ├── entities.ts
│   │   └── migration-registry.ts
│   ├── documentos/
│   │   ├── entities/
│   │   │   └── secuencia-consecutivos.entity.ts
│   │   ├── consecutivo.spec.ts
│   │   └── consecutivo.ts
│   ├── formatos-documentales/
│   │   ├── dto/
│   │   │   ├── create-formato-documental.dto.ts
│   │   │   ├── create-formato-version.dto.ts
│   │   │   ├── formato-firma.dto.ts
│   │   │   ├── update-formato-documental.dto.ts
│   │   │   ├── update-formato-version.dto.ts
│   │   │   └── update-formato-version-state.dto.ts
│   │   ├── entities/
│   │   │   ├── formato-asignaciones-cliente.entity.ts
│   │   │   ├── formatos-documentales.entity.ts
│   │   │   └── formato-versiones.entity.ts
│   │   ├── document-template-content.spec.ts
│   │   ├── document-template-content.ts
│   │   ├── docx-template-reader.spec.ts
│   │   ├── docx-template-reader.ts
│   │   ├── formato-resolver.service.spec.ts
│   │   ├── formato-resolver.service.ts
│   │   ├── formatos-documentales.controller.ts
│   │   ├── formatos-documentales.module.ts
│   │   ├── formatos-documentales.service.ts
│   │   ├── format-version-workflow.spec.ts
│   │   └── format-version-workflow.ts
│   ├── health/
│   │   ├── health.controller.spec.ts
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── logistica/
│   │   ├── dto/
│   │   │   ├── create-orden.dto.ts
│   │   │   ├── material-orden.dto.ts
│   │   │   ├── update-estado-orden.dto.ts
│   │   │   └── update-materiales-orden.dto.ts
│   │   ├── fecha-programada.spec.ts
│   │   ├── logistica.controller.spec.ts
│   │   ├── logistica.controller.ts
│   │   ├── logistica.module.ts
│   │   ├── logistica.service.spec.ts
│   │   ├── logistica.service.ts
│   │   ├── logistica-sequence.spec.ts
│   │   ├── materiales-orden.spec.ts
│   │   └── materiales-orden.ts
│   ├── openapi/
│   │   ├── persist-openapi-document.spec.ts
│   │   └── persist-openapi-document.ts
│   ├── ordenes-servicio/
│   │   └── entities/
│   │       ├── estado-orden.enum.ts
│   │       ├── orden-servicio.entity.ts
│   │       └── orden-servicio-material.entity.ts
│   ├── pdf/
│   │   ├── pdf.module.ts
│   │   ├── pdf-generator.service.spec.ts
│   │   ├── pdf-generator.service.ts
│   │   ├── pdf-render-token.spec.ts
│   │   └── pdf-render-token.ts
│   ├── planta/
│   │   ├── dto/
│   │   │   ├── create-ciclo.dto.spec.ts
│   │   │   ├── create-ciclo.dto.ts
│   │   │   └── create-ciclo.spec.ts
│   │   ├── entities/
│   │   │   ├── ciclo-esterilizacion.entity.ts
│   │   │   ├── ciclo-parametro-evaluacion.entity.ts
│   │   │   └── protocolo-esterilizacion-version.entity.ts
│   │   ├── planta.controller.ts
│   │   ├── planta.module.ts
│   │   ├── planta.service.spec.ts
│   │   └── planta.service.ts
│   ├── rbac/
│   │   ├── entities/
│   │   │   ├── role.entity.ts
│   │   │   ├── scope.entity.ts
│   │   │   └── user-role-assignment.entity.ts
│   │   ├── authorization.guard.spec.ts
│   │   ├── authorization.guard.ts
│   │   ├── authorization.types.ts
│   │   ├── authorization-policy.spec.ts
│   │   ├── authorization-policy.ts
│   │   ├── cancellation-approval.spec.ts
│   │   ├── cancellation-permissions.spec.ts
│   │   ├── local-pilot-data-migration.ts
│   │   ├── permission-catalog.ts
│   │   ├── rbac.module.ts
│   │   ├── rbac-authorization.service.ts
│   │   ├── rbac-schema.spec.ts
│   │   ├── rbac-session.spec.ts
│   │   ├── require-permission.decorator.ts
│   │   └── require-session.decorator.ts
│   ├── scripts/
│   │   ├── bootstrap-admin.spec.ts
│   │   ├── bootstrap-admin.ts
│   │   ├── migrate-local-rbac-pilot.ts
│   │   ├── seed-backend-roles.ts
│   │   ├── seed-document-templates.ts
│   │   └── seed-icontec.ts
│   ├── sellos/
│   │   ├── dto/
│   │   │   ├── create-sello-certificacion.dto.ts
│   │   │   └── update-sello-certificacion.dto.ts
│   │   ├── entities/
│   │   │   ├── sello-certificacion.entity.ts
│   │   │   └── sello-certificacion-version.entity.ts
│   │   ├── seed-icontec.ts
│   │   ├── sellos.controller.ts
│   │   ├── sellos.module.ts
│   │   ├── sellos.service.spec.ts
│   │   ├── sellos.service.ts
│   │   ├── sello-snapshot.module.ts
│   │   ├── sello-snapshot.service.spec.ts
│   │   └── sello-snapshot.service.ts
│   ├── tasas-fiscales/
│   │   ├── entities/
│   │   │   └── tasa-fiscal.entity.ts
│   │   ├── iva-amount.ts
│   │   ├── tasas-fiscales.controller.ts
│   │   ├── tasas-fiscales.module.ts
│   │   ├── tasas-fiscales.service.spec.ts
│   │   └── tasas-fiscales.service.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── assign-user-role.dto.ts
│   │   │   ├── complete-password-reset.dto.ts
│   │   │   ├── create-user.dto.ts
│   │   │   ├── set-user-status.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   ├── password-reset-token.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   └── user-role.enum.ts
│   │   ├── password-reset.service.spec.ts
│   │   ├── password-reset.service.ts
│   │   ├── user-roles.controller.ts
│   │   ├── user-roles.security.spec.ts
│   │   ├── user-roles.service.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.spec.ts
│   │   ├── users.service.ts
│   │   └── users-rbac.spec.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── storage/
├── tasks/
│   ├── plan.md
│   └── todo.md
├── test/
│   ├── fixtures/
│   │   ├── operational-cycle.ts
│   │   ├── quote-permission.ts
│   │   └── rbac-fixture-write.ts
│   ├── app.e2e-spec.ts
│   ├── auth-throttle.e2e-spec.ts
│   ├── hito4-local-backup.integration-spec.ts
│   ├── hito4-operational.integration-spec.ts
│   ├── hito4-pdf.integration-spec.ts
│   ├── openapi-contract.e2e-spec.ts
│   ├── rbac-migration-chain.integration-spec.ts
│   ├── rbac-quote-pilot.integration-spec.ts
│   ├── rbac-schema.integration-spec.ts
│   ├── rbac-users.integration-spec.ts
│   └── solicitud-anulacion.e2e-spec.ts
├── .codexignore
├── .editorconfig
├── .env.example
├── .gitignore
├── .nvmrc
├── .prettierrc
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── nest-cli.json
├── oxlint.json
├── package.json
├── package-lock.json
├── PROMPT_MAESTRO_AUDITORIA_INTEGRACION_LOGISTICA_STERINOVA.md
├── PROMPT_MAESTRO_V2_LOGISTICA_STERINOVA_IMPORTACION_XLSM.md
├── README.md
├── tsconfig.build.json
├── tsconfig.json
├── vitest.config.e2e.ts
├── vitest.config.hito4.ts
├── vitest.config.rbac.ts
└── vitest.config.ts
```
