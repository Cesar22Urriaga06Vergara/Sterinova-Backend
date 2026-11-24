# Arquitectura del backend Sterinova

## 1. Resumen del Stack y Configuración

- **Runtime:** Node.js 22.x (archivo `.nvmrc`: 22), npm 10.x, TypeScript ^6.0.2.
- **API:** NestJS ^12.0.1, Express, Swagger/OpenAPI, JWT/Passport, validación con class-validator y class-transformer, Helmet, throttling y logging con Pino.
- **Persistencia:** MariaDB mediante TypeORM ^0.3.31 y mysql2 ^3.24.6; `synchronize: false` y migraciones separadas. Caché global de `@nestjs/cache-manager`.
- **Documentos y pruebas:** Playwright para render PDF, `@e965/xlsx` para hojas de cálculo, Vitest/Supertest para pruebas. `src/main.ts` configura CORS, validación global, Swagger en `/api/docs` y puerto por defecto 3002.

**Variables declaradas en `.env.example` (solo nombres):** `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `NODE_ENV`, `PORT`, `CORS_ORIGINS`, `JWT_SECRET`, `PDF_RENDER_SECRET`, `PDF_RENDER_BASE_URL`, `FRONTEND_INTERNAL_URL`, `PDF_RENDER_TIMEOUT_MS`, `PDF_MAX_CONCURRENCY`, `PDF_STORAGE_PATH`, `CERTIFICATION_SEALS_PATH`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ICONTEC_SELLO_ID`, `RUN_DB_INTEGRATION`.

## 2. Árbol de Directorios Completo

El árbol muestra todos los archivos y directorios de `src/` y `test/`, además de las entradas de la raíz. Los demás directorios de la raíz se muestran como puntos de entrada. No se inspeccionó `storage/`. Se excluyen archivos generados, temporales y `.env`.

```text
Sterinova-Backend/
├── .github/
├── .qwen/
├── .superpowers/
├── .vscode/
├── assets/  # Recursos gráficos y plantillas
├── docs/  # Documentación activa e histórica
├── scripts/  # Scripts operativos
├── src/  # Código de aplicación
│   ├── auditoria/  # Registro y consulta de eventos de auditoría.
│   │   ├── dto/
│   │   │   └── query-auditoria.dto.ts
│   │   ├── entities/
│   │   │   └── auditoria.entity.ts
│   │   ├── auditoria.controller.spec.ts
│   │   ├── auditoria.controller.ts
│   │   ├── auditoria.module.ts
│   │   ├── auditoria.service.spec.ts
│   │   └── auditoria.service.ts
│   ├── auth/  # Inicio de sesión, identidad de la sesión y recuperación de acceso.
│   │   ├── decorators/
│   │   │   └── public.decorator.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── auth-rbac-flow.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.security.spec.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── calidad/  # Evaluación y liberación de calidad del proceso.
│   │   ├── dto/
│   │   │   ├── approve-cycle.dto.ts
│   │   │   ├── evaluacion-parametro.dto.ts
│   │   │   └── reject-cycle.dto.ts
│   │   ├── calidad.controller.ts
│   │   ├── calidad.module.ts
│   │   ├── calidad.service.spec.ts
│   │   └── calidad.service.ts
│   ├── certificados/  # Emisión y consulta de certificados de esterilización.
│   │   ├── entities/
│   │   │   └── certificado-esterilizacion.entity.ts
│   │   ├── certificados-scope.spec.ts
│   │   ├── certificados.concurrency.spec.ts
│   │   ├── certificados.controller.spec.ts
│   │   ├── certificados.controller.ts
│   │   ├── certificados.module.ts
│   │   ├── certificados.service.spec.ts
│   │   ├── certificados.service.ts
│   │   ├── certificados.validar-token.spec.ts
│   │   ├── fecha-vencimiento.spec.ts
│   │   ├── fecha-vencimiento.ts
│   │   ├── informacion-tecnica.spec.ts
│   │   └── informacion-tecnica.ts
│   ├── clientes/  # Registro y consulta de clientes y sus datos comerciales.
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
│   ├── common/  # Guardas, decoradores y servicios compartidos.
│   │   ├── services/
│   │   │   ├── storage.service.spec.ts
│   │   │   └── storage.service.ts
│   │   ├── canonical-quote-format.ts
│   │   ├── evaluacion-parametro.ts
│   │   ├── fecha-vencimiento.ts
│   │   ├── metodo-orden.ts
│   │   ├── proyeccion-operativa.ts
│   │   ├── public.decorator.ts
│   │   └── tipo-servicio-cotizacion.ts
│   ├── cotizaciones/  # Creación, edición, aprobación, emisión y anulación de cotizaciones.
│   │   ├── dto/
│   │   │   ├── create-cotizacion-item.dto.ts
│   │   │   ├── create-cotizacion.dto.spec.ts
│   │   │   ├── create-cotizacion.dto.ts
│   │   │   ├── solicitud-anulacion.dto.ts
│   │   │   └── update-cotizacion.dto.ts
│   │   ├── entities/
│   │   │   ├── cotizacion-item.entity.ts
│   │   │   ├── cotizacion.entity.ts
│   │   │   ├── estado-cotizacion.enum.ts
│   │   │   ├── solicitud-anulacion.entity.ts
│   │   │   └── tipo-servicio.enum.ts
│   │   ├── canonical-quote-format.spec.ts
│   │   ├── canonical-quote-format.ts
│   │   ├── cotizacion-item-builder.spec.ts
│   │   ├── cotizacion-item-builder.ts
│   │   ├── cotizacion-item-image.service.spec.ts
│   │   ├── cotizacion-item-image.service.ts
│   │   ├── cotizaciones-cancelled-emission.spec.ts
│   │   ├── cotizaciones-edit.spec.ts
│   │   ├── cotizaciones-emission.spec.ts
│   │   ├── cotizaciones-item-image.spec.ts
│   │   ├── cotizaciones-tax.spec.ts
│   │   ├── cotizaciones.controller.spec.ts
│   │   ├── cotizaciones.controller.ts
│   │   ├── cotizaciones.module.ts
│   │   ├── cotizaciones.quality-branches.spec.ts
│   │   ├── cotizaciones.service.spec.ts
│   │   ├── cotizaciones.service.ts
│   │   ├── quote-access.ts
│   │   ├── solicitud-anulacion.controller.ts
│   │   ├── solicitud-anulacion.service.spec.ts
│   │   └── solicitud-anulacion.service.ts
│   ├── database/  # Configuración de TypeORM, registro de entidades y migraciones.
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
│   │   │   ├── 1794484800000-RemoveLegacyUserRole.ts
│   │   │   ├── 1794500000000-AddQuoteCommercialConditions.ts
│   │   │   ├── 1794600000000-AddActaEventsAndLogisticsFormats.ts
│   │   │   ├── 1794700000000-AddProductCatalog.ts
│   │   │   ├── 1794800000000-AddQuoteItemCatalogSnapshots.ts
│   │   │   ├── 1794900000000-EnableGeneralManager.spec.ts
│   │   │   ├── 1794900000000-EnableGeneralManager.ts
│   │   │   ├── 1795000000000-RevokeQuoteDeletion.spec.ts
│   │   │   ├── 1795000000000-RevokeQuoteDeletion.ts
│   │   │   ├── 1795100000000-AllowMultipleOrdersPerQuote.ts
│   │   │   ├── 1795200000000-CicloMaterialesProcesados.ts
│   │   │   ├── 1795300000000-MaterialesCantidadDecimal.ts
│   │   │   ├── 1795400000000-OrdenCompraCliente.ts
│   │   │   ├── 1795500000000-RecepcionLogistica.ts
│   │   │   ├── 1795600000000-DocumentosEmitidos.ts
│   │   │   ├── 1795700000000-ObservacionesSeparadasOrden.ts
│   │   │   ├── 1795800000000-AddQuoteOperationalScope.ts
│   │   │   ├── 1795900000000-AddLogisticsDriversRoutes.ts
│   │   │   ├── 1796000000000-DynamicQuoteDocuments.ts
│   │   │   ├── 1796100000000-ActaServicePhases.ts
│   │   │   ├── backend-role-metadata.spec.ts
│   │   │   ├── backend-role-phase1.spec.ts
│   │   │   ├── product-catalog-migration.spec.ts
│   │   │   ├── quote-item-catalog-snapshots-migration.spec.ts
│   │   │   └── schema-migrations.spec.ts
│   │   ├── data-source.ts
│   │   ├── entities.ts
│   │   └── migration-registry.ts
│   ├── documentos/  # Consecutivos documentales transaccionales.
│   │   ├── entities/
│   │   │   └── secuencia-consecutivos.entity.ts
│   │   ├── consecutivo.spec.ts
│   │   └── consecutivo.ts
│   ├── formatos-documentales/  # Versiones y asignaciones de formatos para documentos.
│   │   ├── dto/
│   │   │   ├── create-formato-documental.dto.ts
│   │   │   ├── create-formato-version.dto.ts
│   │   │   ├── formato-firma.dto.ts
│   │   │   ├── update-formato-documental.dto.ts
│   │   │   ├── update-formato-version-state.dto.ts
│   │   │   └── update-formato-version.dto.ts
│   │   ├── entities/
│   │   │   ├── formato-asignaciones-cliente.entity.ts
│   │   │   ├── formato-versiones.entity.ts
│   │   │   └── formatos-documentales.entity.ts
│   │   ├── document-template-content.spec.ts
│   │   ├── document-template-content.ts
│   │   ├── docx-template-reader.spec.ts
│   │   ├── docx-template-reader.ts
│   │   ├── format-version-edit.spec.ts
│   │   ├── format-version-workflow.spec.ts
│   │   ├── format-version-workflow.ts
│   │   ├── formato-resolver.service.spec.ts
│   │   ├── formato-resolver.service.ts
│   │   ├── formatos-documentales.controller.ts
│   │   ├── formatos-documentales.module.ts
│   │   ├── formatos-documentales.service.ts
│   │   └── formatos-documentales.versiones.spec.ts
│   ├── gerencia/  # Consultas consolidadas y supervisión gerencial.
│   │   ├── dto/
│   │   │   ├── administrador.dto.ts
│   │   │   └── metricas-query.dto.ts
│   │   ├── administradores-policy.spec.ts
│   │   ├── administradores-policy.ts
│   │   ├── gerencia-administradores.controller.ts
│   │   ├── gerencia-administradores.service.ts
│   │   ├── gerencia-administradores.spec.ts
│   │   ├── gerencia-contract.spec.ts
│   │   ├── gerencia-metricas.service.ts
│   │   ├── gerencia-metricas.spec.ts
│   │   ├── gerencia-permissions.spec.ts
│   │   ├── gerencia.controller.ts
│   │   ├── gerencia.module.ts
│   │   └── metricas-policy.ts
│   ├── health/  # Verificación de salud de la aplicación.
│   │   ├── health.controller.spec.ts
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── logistica/  # Órdenes logísticas, conductores, actas por fases y documentos emitidos.
│   │   ├── dto/
│   │   │   ├── acta-fase1.dto.ts
│   │   │   ├── acta-fase2.dto.ts
│   │   │   ├── cerrar-acta.dto.ts
│   │   │   ├── create-documento-emitido.dto.ts
│   │   │   ├── create-orden.dto.ts
│   │   │   ├── documento-evento.dto.ts
│   │   │   ├── evento-orden.dto.ts
│   │   │   ├── material-orden.dto.ts
│   │   │   ├── save-conductor.dto.ts
│   │   │   ├── update-estado-orden.dto.ts
│   │   │   └── update-materiales-orden.dto.ts
│   │   ├── entities/
│   │   │   ├── conductor.entity.ts
│   │   │   ├── documento-emitido.entity.ts
│   │   │   ├── documento-evento.entity.ts
│   │   │   ├── entrega.entity.ts
│   │   │   ├── recepcion-item.entity.ts
│   │   │   └── recepcion-logistica.entity.ts
│   │   ├── acta-events.spec.ts
│   │   ├── conductores.controller.ts
│   │   ├── conductores.service.ts
│   │   ├── fecha-programada.spec.ts
│   │   ├── logistica-multi-orden.spec.ts
│   │   ├── logistica-sequence.spec.ts
│   │   ├── logistica.controller.spec.ts
│   │   ├── logistica.controller.ts
│   │   ├── logistica.module.ts
│   │   ├── logistica.service.spec.ts
│   │   ├── logistica.service.ts
│   │   ├── materiales-orden.spec.ts
│   │   └── materiales-orden.ts
│   ├── openapi/  # Persistencia del contrato OpenAPI generado.
│   │   ├── persist-openapi-document.spec.ts
│   │   └── persist-openapi-document.ts
│   ├── ordenes-servicio/  # Modelo persistente de órdenes de servicio, materiales y eventos.
│   │   └── entities/
│   │       ├── estado-orden.enum.ts
│   │       ├── orden-servicio-evento.entity.ts
│   │       ├── orden-servicio-material.entity.ts
│   │       └── orden-servicio.entity.ts
│   ├── pdf/  # Generación de PDF a partir de snapshots y plantillas.
│   │   ├── pdf-generator.service.spec.ts
│   │   ├── pdf-generator.service.ts
│   │   ├── pdf-render-token.spec.ts
│   │   ├── pdf-render-token.ts
│   │   └── pdf.module.ts
│   ├── planta/  # Ciclos de esterilización, materiales procesados y protocolos.
│   │   ├── dto/
│   │   │   ├── create-ciclo.dto.spec.ts
│   │   │   ├── create-ciclo.dto.ts
│   │   │   └── create-ciclo.spec.ts
│   │   ├── entities/
│   │   │   ├── ciclo-esterilizacion.entity.ts
│   │   │   ├── ciclo-material-procesado.entity.ts
│   │   │   ├── ciclo-parametro-evaluacion.entity.ts
│   │   │   └── protocolo-esterilizacion-version.entity.ts
│   │   ├── planta.controller.ts
│   │   ├── planta.module.ts
│   │   ├── planta.service.spec.ts
│   │   └── planta.service.ts
│   ├── productos/  # Catálogo de productos y búsqueda para cotizaciones.
│   │   ├── dto/
│   │   │   ├── create-producto.dto.spec.ts
│   │   │   ├── create-producto.dto.ts
│   │   │   ├── query-productos.dto.ts
│   │   │   ├── search-productos.dto.ts
│   │   │   ├── update-producto-status.dto.ts
│   │   │   └── update-producto.dto.ts
│   │   ├── entities/
│   │   │   └── producto.entity.ts
│   │   ├── productos.controller.spec.ts
│   │   ├── productos.controller.ts
│   │   ├── productos.module.ts
│   │   ├── productos.service.spec.ts
│   │   └── productos.service.ts
│   ├── rbac/  # Autorización por permisos, roles y ámbitos; gestión de ámbitos.
│   │   ├── ambitos/
│   │   │   ├── ambito.service.ts
│   │   │   ├── ambitos.controller.ts
│   │   │   ├── ambitos.module.spec.ts
│   │   │   ├── ambitos.module.ts
│   │   │   └── dtos.ts
│   │   ├── entities/
│   │   │   ├── role.entity.ts
│   │   │   ├── scope.entity.ts
│   │   │   └── user-role-assignment.entity.ts
│   │   ├── revocacion/
│   │   ├── authorization-policy.spec.ts
│   │   ├── authorization-policy.ts
│   │   ├── authorization.guard.spec.ts
│   │   ├── authorization.guard.ts
│   │   ├── authorization.types.ts
│   │   ├── cancellation-approval.spec.ts
│   │   ├── cancellation-permissions.spec.ts
│   │   ├── local-pilot-data-migration.ts
│   │   ├── permission-catalog.ts
│   │   ├── productos-permissions.spec.ts
│   │   ├── rbac-authorization.service.ts
│   │   ├── rbac-schema.spec.ts
│   │   ├── rbac-session.spec.ts
│   │   ├── rbac.module.ts
│   │   ├── require-permission.decorator.ts
│   │   ├── require-session.decorator.ts
│   │   ├── resource-access.spec.ts
│   │   ├── resource-access.ts
│   │   └── single-authority.spec.ts
│   ├── scripts/  # Tareas de consola para semillas y bootstrap.
│   │   ├── bootstrap-admin.spec.ts
│   │   ├── bootstrap-admin.ts
│   │   ├── migrate-local-rbac-pilot.ts
│   │   ├── seed-backend-roles.ts
│   │   ├── seed-document-templates.ts
│   │   └── seed-icontec.ts
│   ├── sellos/  # Catálogo y versiones de sellos de certificación.
│   │   ├── dto/
│   │   │   ├── create-sello-certificacion.dto.ts
│   │   │   └── update-sello-certificacion.dto.ts
│   │   ├── entities/
│   │   │   ├── sello-certificacion-version.entity.ts
│   │   │   └── sello-certificacion.entity.ts
│   │   ├── seed-icontec.ts
│   │   ├── sello-snapshot.module.ts
│   │   ├── sello-snapshot.service.spec.ts
│   │   ├── sello-snapshot.service.ts
│   │   ├── sellos.controller.ts
│   │   ├── sellos.module.ts
│   │   ├── sellos.service.spec.ts
│   │   └── sellos.service.ts
│   ├── tasas-fiscales/  # Administración de tasas fiscales aplicadas al negocio.
│   │   ├── dto/
│   │   │   └── publish-iva.dto.ts
│   │   ├── entities/
│   │   │   └── tasa-fiscal.entity.ts
│   │   ├── iva-amount.ts
│   │   ├── tasas-fiscales.controller.ts
│   │   ├── tasas-fiscales.module.ts
│   │   ├── tasas-fiscales.service.spec.ts
│   │   └── tasas-fiscales.service.ts
│   ├── users/  # Administración de usuarios, estado y asignación de roles.
│   │   ├── dto/
│   │   │   ├── assign-user-role.dto.ts
│   │   │   ├── complete-password-reset.dto.ts
│   │   │   ├── create-user.dto.ts
│   │   │   ├── set-user-status.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   ├── password-reset-token.entity.ts
│   │   │   └── user.entity.ts
│   │   ├── general-manager-catalog.spec.ts
│   │   ├── password-reset.service.spec.ts
│   │   ├── password-reset.service.ts
│   │   ├── user-roles.controller.ts
│   │   ├── user-roles.security.spec.ts
│   │   ├── user-roles.service.ts
│   │   ├── users-rbac.spec.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.spec.ts
│   │   └── users.service.ts
│   ├── app.module.ts
│   └── main.ts
├── storage/  # Archivos persistidos; contenido no inspeccionado
├── tasks/
├── test/  # Pruebas E2E y de contrato
│   ├── fixtures/  # Pruebas de integración y E2E
│   │   ├── legacy-user-role.ts
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
│   ├── rbac-single-authority.integration-spec.ts
│   ├── rbac-users.integration-spec.ts
│   └── solicitud-anulacion.e2e-spec.ts
├── .codexignore
├── .editorconfig
├── .env.example  # Nombres de configuración sin secretos
├── .gitignore
├── .nvmrc
├── .prettierrc
├── AGENTS.md  # Instrucciones del repositorio
├── ARQUITECTURA_BACKEND.md  # Este mapa
├── CHANGELOG.md
├── CONTRIBUTING.md
├── nest-cli.json
├── oxlint.json
├── package-lock.json
├── package.json  # Dependencias y comandos
├── QODER_BACKEND.md
├── README.md  # Guía de inicio
├── tsconfig.build.json
├── tsconfig.json
├── vitest.config.e2e.ts
├── vitest.config.hito4.ts
├── vitest.config.rbac.ts
└── vitest.config.ts
```

## 3. Mapa de Módulos de Negocio (Dominios)

Se documentan 23 carpetas de primer nivel en `src/`, incluidas áreas técnicas sin `*.module.ts`. Los archivos de soporte aparecen en el árbol. Las dependencias se derivan de importaciones relativas entre dominios.

`documentos/` conserva el cálculo puro de consecutivos y su entidad; cada servicio consumidor adquiere el bloqueo y actualiza la secuencia dentro de su propia transacción. Convertirlo en un servicio Nest separado exigiría revisar esas fronteras transaccionales. `ordenes-servicio/` contiene entidades y estados persistidos; Logística dirige la creación, actas y entregas, mientras Planta dirige los ciclos. No expone controladores propios.

Los enlaces entre dominios incluyen tipos y entidades compartidas, no siempre llamadas de servicio en ambos sentidos. Calidad llama a `CertificadosService` al aprobar; Certificados usa un contrato de evaluación en `common/` y no importa Calidad. Logística consulta entidades de Planta; Planta usa `common/metodo-orden.ts` y `common/fecha-vencimiento.ts` sin importar Logística ni Certificados. RBAC usa el decorador público de `common/` sin importar Auth. Productos usa el tipo de servicio de `common/` sin importar Cotizaciones. Cotizaciones y Formatos comparten el contrato canónico desde `common/`; siguen vinculados mediante entidades TypeORM, mientras que el grafo de `imports` de módulos Nest no forma un ciclo. Las referencias inversas que permanecen son asociaciones de entidades o la utilidad de migración local RBAC. No hay `forwardRef()` en estos módulos.

### auditoria

- **Propósito del módulo:** Registro y consulta de eventos de auditoría.
- **Controladores:** `src/auditoria/auditoria.controller.ts`.
- **Servicios:** `src/auditoria/auditoria.service.ts`.
- **Entidades:** `src/auditoria/entities/auditoria.entity.ts`.
- **DTOs:** `src/auditoria/dto/query-auditoria.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/auditoria/auditoria.module.ts`.
- **Dependencias internas:** `rbac`, `users`.

### auth

- **Propósito del módulo:** Inicio de sesión, identidad de la sesión y recuperación de acceso.
- **Controladores:** `src/auth/auth.controller.ts`.
- **Servicios:** `src/auth/auth.service.ts`.
- **Entidades:** Ninguno.
- **DTOs:** `src/auth/dto/login.dto.ts`.
- **Guards:** `src/auth/guards/jwt-auth.guard.ts`.
- **Definición Nest:** `src/auth/auth.module.ts`.
- **Dependencias internas:** `auditoria`, `common`, `rbac`, `users`.

### calidad

- **Propósito del módulo:** Evaluación y liberación de calidad del proceso.
- **Controladores:** `src/calidad/calidad.controller.ts`.
- **Servicios:** `src/calidad/calidad.service.ts`.
- **Entidades:** Ninguno.
- **DTOs:** `src/calidad/dto/approve-cycle.dto.ts`, `src/calidad/dto/evaluacion-parametro.dto.ts`, `src/calidad/dto/reject-cycle.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/calidad/calidad.module.ts`.
- **Dependencias internas:** `auditoria`, `auth`, `certificados`, `pdf`, `planta`, `rbac`, `users`.

### certificados

- **Propósito del módulo:** Emisión y consulta de certificados de esterilización.
- **Controladores:** `src/certificados/certificados.controller.ts`.
- **Servicios:** `src/certificados/certificados.service.ts`.
- **Entidades:** `src/certificados/entities/certificado-esterilizacion.entity.ts`.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** `src/certificados/certificados.module.ts`.
- **Dependencias internas:** `auditoria`, `auth`, `common`, `documentos`, `formatos-documentales`, `ordenes-servicio`, `pdf`, `planta`, `rbac`, `users`.

### clientes

- **Propósito del módulo:** Registro y consulta de clientes y sus datos comerciales.
- **Controladores:** `src/clientes/clientes.controller.ts`.
- **Servicios:** `src/clientes/clientes.service.ts`.
- **Entidades:** `src/clientes/entities/cliente.entity.ts`.
- **DTOs:** `src/clientes/dto/create-cliente.dto.ts`, `src/clientes/dto/update-cliente.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/clientes/clientes.module.ts`.
- **Dependencias internas:** `rbac`, `users`.

### common

- **Propósito del módulo:** Guardas, decoradores y servicios compartidos.
- **Controladores:** Ninguno.
- **Servicios:** `src/common/services/storage.service.ts`.
- **Entidades:** Ninguno.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** Ninguno.
- **Dependencias internas:** Ninguna importación directa a otro dominio.

### cotizaciones

- **Propósito del módulo:** Creación, edición, aprobación, emisión y anulación de cotizaciones.
- **Controladores:** `src/cotizaciones/cotizaciones.controller.ts`, `src/cotizaciones/solicitud-anulacion.controller.ts`.
- **Servicios:** `src/cotizaciones/cotizacion-item-image.service.ts`, `src/cotizaciones/cotizaciones.service.ts`, `src/cotizaciones/solicitud-anulacion.service.ts`.
- **Entidades:** `src/cotizaciones/entities/cotizacion-item.entity.ts`, `src/cotizaciones/entities/cotizacion.entity.ts`, `src/cotizaciones/entities/solicitud-anulacion.entity.ts`.
- **DTOs:** `src/cotizaciones/dto/create-cotizacion-item.dto.ts`, `src/cotizaciones/dto/create-cotizacion.dto.ts`, `src/cotizaciones/dto/solicitud-anulacion.dto.ts`, `src/cotizaciones/dto/update-cotizacion.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/cotizaciones/cotizaciones.module.ts`.
- **Dependencias internas:** `auditoria`, `clientes`, `common`, `documentos`, `formatos-documentales`, `ordenes-servicio`, `pdf`, `productos`, `rbac`, `sellos`, `tasas-fiscales`, `users`.

### database

- **Propósito del módulo:** Configuración de TypeORM, registro de entidades y migraciones.
- **Controladores:** Ninguno.
- **Servicios:** Ninguno.
- **Entidades:** Ninguno.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** Ninguno.
- **Dependencias internas:** `auditoria`, `certificados`, `clientes`, `cotizaciones`, `documentos`, `formatos-documentales`, `logistica`, `ordenes-servicio`, `planta`, `productos`, `rbac`, `sellos`, `tasas-fiscales`, `users`.

### documentos

- **Propósito del módulo:** Consecutivos documentales transaccionales.
- **Controladores:** Ninguno.
- **Servicios:** Ninguno.
- **Entidades:** `src/documentos/entities/secuencia-consecutivos.entity.ts`.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** Ninguno.
- **Dependencias internas:** Ninguna importación directa a otro dominio.

### formatos-documentales

- **Propósito del módulo:** Versiones y asignaciones de formatos para documentos.
- **Controladores:** `src/formatos-documentales/formatos-documentales.controller.ts`.
- **Servicios:** `src/formatos-documentales/formato-resolver.service.ts`, `src/formatos-documentales/formatos-documentales.service.ts`.
- **Entidades:** `src/formatos-documentales/entities/formato-asignaciones-cliente.entity.ts`, `src/formatos-documentales/entities/formato-versiones.entity.ts`, `src/formatos-documentales/entities/formatos-documentales.entity.ts`.
- **DTOs:** `src/formatos-documentales/dto/create-formato-documental.dto.ts`, `src/formatos-documentales/dto/create-formato-version.dto.ts`, `src/formatos-documentales/dto/formato-firma.dto.ts`, `src/formatos-documentales/dto/update-formato-documental.dto.ts`, `src/formatos-documentales/dto/update-formato-version-state.dto.ts`, `src/formatos-documentales/dto/update-formato-version.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/formatos-documentales/formatos-documentales.module.ts`.
- **Dependencias internas:** `auditoria`, `certificados`, `clientes`, `common`, `cotizaciones`, `database`, `ordenes-servicio`, `rbac`, `users`.

### gerencia

- **Propósito del módulo:** Consultas consolidadas y supervisión gerencial.
- **Controladores:** `src/gerencia/gerencia-administradores.controller.ts`, `src/gerencia/gerencia.controller.ts`.
- **Servicios:** `src/gerencia/gerencia-administradores.service.ts`, `src/gerencia/gerencia-metricas.service.ts`.
- **Entidades:** Ninguno.
- **DTOs:** `src/gerencia/dto/administrador.dto.ts`, `src/gerencia/dto/metricas-query.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/gerencia/gerencia.module.ts`.
- **Dependencias internas:** `auditoria`, `rbac`, `users`.

### health

- **Propósito del módulo:** Verificación de salud de la aplicación.
- **Controladores:** `src/health/health.controller.ts`.
- **Servicios:** Ninguno.
- **Entidades:** Ninguno.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** `src/health/health.module.ts`.
- **Dependencias internas:** `auth`, `common`, `pdf`.

### logistica

- **Propósito del módulo:** Órdenes logísticas, conductores, actas por fases y documentos emitidos.
- **Controladores:** `src/logistica/conductores.controller.ts`, `src/logistica/logistica.controller.ts`.
- **Servicios:** `src/logistica/conductores.service.ts`, `src/logistica/logistica.service.ts`.
- **Entidades:** `src/logistica/entities/conductor.entity.ts`, `src/logistica/entities/documento-emitido.entity.ts`, `src/logistica/entities/documento-evento.entity.ts`, `src/logistica/entities/entrega.entity.ts`, `src/logistica/entities/recepcion-item.entity.ts`, `src/logistica/entities/recepcion-logistica.entity.ts`.
- **DTOs:** `src/logistica/dto/acta-fase1.dto.ts`, `src/logistica/dto/acta-fase2.dto.ts`, `src/logistica/dto/cerrar-acta.dto.ts`, `src/logistica/dto/create-documento-emitido.dto.ts`, `src/logistica/dto/create-orden.dto.ts`, `src/logistica/dto/documento-evento.dto.ts`, `src/logistica/dto/evento-orden.dto.ts`, `src/logistica/dto/material-orden.dto.ts`, `src/logistica/dto/save-conductor.dto.ts`, `src/logistica/dto/update-estado-orden.dto.ts`, `src/logistica/dto/update-materiales-orden.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/logistica/logistica.module.ts`.
- **Dependencias internas:** `auditoria`, `common`, `cotizaciones`, `documentos`, `formatos-documentales`, `ordenes-servicio`, `pdf`, `planta`, `rbac`, `tasas-fiscales`, `users`.

### openapi

- **Propósito del módulo:** Persistencia del contrato OpenAPI generado.
- **Controladores:** Ninguno.
- **Servicios:** Ninguno.
- **Entidades:** Ninguno.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** Ninguno.
- **Dependencias internas:** Ninguna importación directa a otro dominio.

### ordenes-servicio

- **Propósito del módulo:** Modelo persistente de órdenes de servicio, materiales y eventos.
- **Controladores:** Ninguno.
- **Servicios:** Ninguno.
- **Entidades:** `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts`, `src/ordenes-servicio/entities/orden-servicio-material.entity.ts`, `src/ordenes-servicio/entities/orden-servicio.entity.ts`.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** Ninguno.
- **Dependencias internas:** `cotizaciones`, `rbac`, `users`.

### pdf

- **Propósito del módulo:** Generación de PDF a partir de snapshots y plantillas.
- **Controladores:** Ninguno.
- **Servicios:** `src/pdf/pdf-generator.service.ts`.
- **Entidades:** Ninguno.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** `src/pdf/pdf.module.ts`.
- **Dependencias internas:** `common`, `sellos`.

### planta

- **Propósito del módulo:** Ciclos de esterilización, materiales procesados y protocolos.
- **Controladores:** `src/planta/planta.controller.ts`.
- **Servicios:** `src/planta/planta.service.ts`.
- **Entidades:** `src/planta/entities/ciclo-esterilizacion.entity.ts`, `src/planta/entities/ciclo-material-procesado.entity.ts`, `src/planta/entities/ciclo-parametro-evaluacion.entity.ts`, `src/planta/entities/protocolo-esterilizacion-version.entity.ts`.
- **DTOs:** `src/planta/dto/create-ciclo.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/planta/planta.module.ts`.
- **Dependencias internas:** `certificados`, `common`, `cotizaciones`, `ordenes-servicio`, `rbac`, `users`.

### productos

- **Propósito del módulo:** Catálogo de productos y búsqueda para cotizaciones.
- **Controladores:** `src/productos/productos.controller.ts`.
- **Servicios:** `src/productos/productos.service.ts`.
- **Entidades:** `src/productos/entities/producto.entity.ts`.
- **DTOs:** `src/productos/dto/create-producto.dto.ts`, `src/productos/dto/query-productos.dto.ts`, `src/productos/dto/search-productos.dto.ts`, `src/productos/dto/update-producto-status.dto.ts`, `src/productos/dto/update-producto.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/productos/productos.module.ts`.
- **Dependencias internas:** `common`, `rbac`.

### rbac

- **Propósito del módulo:** Autorización por permisos, roles y ámbitos; gestión de ámbitos.
- **Controladores:** `src/rbac/ambitos/ambitos.controller.ts`.
- **Servicios:** `src/rbac/ambitos/ambito.service.ts`, `src/rbac/rbac-authorization.service.ts`.
- **Entidades:** `src/rbac/entities/role.entity.ts`, `src/rbac/entities/scope.entity.ts`, `src/rbac/entities/user-role-assignment.entity.ts`.
- **DTOs:** `src/rbac/ambitos/dtos.ts`.
- **Guards:** `src/rbac/authorization.guard.ts`.
- **Definición Nest:** `src/rbac/ambitos/ambitos.module.ts`, `src/rbac/rbac.module.ts`.
- **Dependencias internas:** `auditoria`, `common`, `cotizaciones`, `users`.

### scripts

- **Propósito del módulo:** Tareas de consola para semillas y bootstrap.
- **Controladores:** Ninguno.
- **Servicios:** Ninguno.
- **Entidades:** Ninguno.
- **DTOs:** Ninguno.
- **Guards:** Ninguno.
- **Definición Nest:** Ninguno.
- **Dependencias internas:** `database`, `formatos-documentales`, `rbac`, `sellos`, `users`.

### sellos

- **Propósito del módulo:** Catálogo y versiones de sellos de certificación.
- **Controladores:** `src/sellos/sellos.controller.ts`.
- **Servicios:** `src/sellos/sello-snapshot.service.ts`, `src/sellos/sellos.service.ts`.
- **Entidades:** `src/sellos/entities/sello-certificacion-version.entity.ts`, `src/sellos/entities/sello-certificacion.entity.ts`.
- **DTOs:** `src/sellos/dto/create-sello-certificacion.dto.ts`, `src/sellos/dto/update-sello-certificacion.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/sellos/sello-snapshot.module.ts`, `src/sellos/sellos.module.ts`.
- **Dependencias internas:** `rbac`, `users`.

### tasas-fiscales

- **Propósito del módulo:** Administración de tasas fiscales aplicadas al negocio.
- **Controladores:** `src/tasas-fiscales/tasas-fiscales.controller.ts`.
- **Servicios:** `src/tasas-fiscales/tasas-fiscales.service.ts`.
- **Entidades:** `src/tasas-fiscales/entities/tasa-fiscal.entity.ts`.
- **DTOs:** `src/tasas-fiscales/dto/publish-iva.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/tasas-fiscales/tasas-fiscales.module.ts`.
- **Dependencias internas:** `auditoria`, `rbac`.

### users

- **Propósito del módulo:** Administración de usuarios, estado y asignación de roles.
- **Controladores:** `src/users/user-roles.controller.ts`, `src/users/users.controller.ts`.
- **Servicios:** `src/users/password-reset.service.ts`, `src/users/user-roles.service.ts`, `src/users/users.service.ts`.
- **Entidades:** `src/users/entities/password-reset-token.entity.ts`, `src/users/entities/user.entity.ts`.
- **DTOs:** `src/users/dto/assign-user-role.dto.ts`, `src/users/dto/complete-password-reset.dto.ts`, `src/users/dto/create-user.dto.ts`, `src/users/dto/set-user-status.dto.ts`, `src/users/dto/update-user.dto.ts`.
- **Guards:** Ninguno.
- **Definición Nest:** `src/users/users.module.ts`.
- **Dependencias internas:** `auditoria`, `rbac`.

## 4. Inventario Completo de Endpoints (API REST)

Se inventarían 102 métodos HTTP declarados en 20 controladores. La ruta de Swagger `/api/docs` se monta en `main.ts` y se indica aparte porque no es un método de controlador. JWT, autorización y límite de solicitudes son guards globales de `AppModule`; las excepciones públicas se anotan por ruta.

| Módulo | Método HTTP | Ruta Completa | Controlador / Función | Roles / Guards requeridos | Descripción breve |
|---|---|---|---|---|---|
| auditoria | GET | `/auditoria` | `AuditoriaController.findAll` | JWT + autorización global; permiso auditoria.ver; ámbito | Consultar auditoría paginada (solo Admin) |
| auth | POST | `/auth/login` | `AuthController.login` | Público; límite global de solicitudes | Iniciar sesión |
| auth | GET | `/auth/me` | `AuthController.me` | JWT; sesión requerida | Identidad, capacidades y ámbito de la sesión actual |
| auth | POST | `/auth/password/reset` | `AuthController.completePasswordReset` | Público; límite global de solicitudes | Completar restablecimiento con token de un solo uso |
| calidad | POST | `/calidad/aprobar` | `CalidadController.aprobar` | JWT + autorización global; permiso calidad.aprobar; ámbito | Aprobar ciclo |
| calidad | GET | `/calidad/ciclos/:id` | `CalidadController.findCicloPendiente` | JWT + autorización global; permiso calidad.ciclos.ver; ámbito | Consultar ciclo pendiente |
| calidad | GET | `/calidad/pendientes` | `CalidadController.findPendientes` | JWT + autorización global; permiso calidad.ciclos.ver; ámbito | Listar ciclos pendientes de revisión |
| calidad | POST | `/calidad/rechazar` | `CalidadController.rechazar` | JWT + autorización global; permiso calidad.rechazar; ámbito | Rechazar ciclo |
| certificados | GET | `/certificados` | `CertificadosController.findAll` | JWT + autorización global; permiso certificados.ver; ámbito | Listar certificados |
| certificados | GET | `/certificados/:id` | `CertificadosController.findOne` | JWT + autorización global; permiso certificados.ver; ámbito | Consultar certificado |
| certificados | GET | `/certificados/:id/descargar` | `CertificadosController.descargar` | JWT + autorización global; permiso certificados.descargar; ámbito | Descargar PDF de certificado |
| certificados | GET | `/certificados/exportar` | `CertificadosController.exportar` | JWT + autorización global; permiso certificados.exportar; ámbito | Exportar certificados a Excel |
| certificados | GET | `/certificados/validar/:token` | `CertificadosController.validar` | Público; límite global de solicitudes; ámbito | Validar certificado mediante token público |
| clientes | GET | `/clientes` | `ClientesController.findAll` | JWT + autorización global; permiso clientes.ver; ámbito | Listar clientes |
| clientes | POST | `/clientes` | `ClientesController.create` | JWT + autorización global; permiso clientes.crear; ámbito | Crear cliente |
| clientes | DELETE | `/clientes/:id` | `ClientesController.remove` | JWT + autorización global; permiso clientes.eliminar; ámbito | Eliminar cliente |
| clientes | GET | `/clientes/:id` | `ClientesController.findOne` | JWT + autorización global; permiso clientes.ver; ámbito | Consultar cliente |
| clientes | PUT | `/clientes/:id` | `ClientesController.update` | JWT + autorización global; permiso clientes.editar; ámbito | Actualizar cliente |
| clientes | POST | `/clientes/bulk` | `ClientesController.bulk` | JWT + autorización global; permiso clientes.importar; ámbito | Crear clientes en lote |
| cotizaciones | GET | `/cotizaciones` | `CotizacionesController.findAll` | JWT + autorización global; permiso cotizaciones.ver; ámbito | Listar cotizaciones |
| cotizaciones | POST | `/cotizaciones` | `CotizacionesController.create` | JWT + autorización global; permiso cotizaciones.crear; ámbito | Crear cotización |
| cotizaciones | DELETE | `/cotizaciones/:id` | `CotizacionesController.remove` | JWT; denegado por falta de permiso explícito; ámbito | remove |
| cotizaciones | GET | `/cotizaciones/:id` | `CotizacionesController.findOne` | JWT + autorización global; permiso cotizaciones.ver; ámbito | Consultar cotización |
| cotizaciones | PUT | `/cotizaciones/:id` | `CotizacionesController.update` | JWT + autorización global; permiso cotizaciones.editar; ámbito | Actualizar cotización |
| cotizaciones | POST | `/cotizaciones/:id/aceptar` | `CotizacionesController.aceptar` | JWT + autorización global; permiso cotizaciones.aceptar; ámbito | Registrar aceptación del cliente sobre cotización aprobada y emitida |
| cotizaciones | POST | `/cotizaciones/:id/aprobar` | `CotizacionesController.aprobar` | JWT + autorización global; permiso cotizaciones.aprobar_interna; ámbito | Aprobar un borrador sin modificar su contenido |
| cotizaciones | GET | `/cotizaciones/:id/descargar` | `CotizacionesController.descargar` | JWT + autorización global; permiso cotizaciones.descargar; ámbito | Descargar PDF de cotización |
| cotizaciones | POST | `/cotizaciones/:id/emitir` | `CotizacionesController.emitir` | JWT + autorización global; permiso cotizaciones.emitir; ámbito | Emitir cotización |
| cotizaciones | DELETE | `/cotizaciones/:id/items/:itemId/imagen` | `CotizacionesController.removeItemImage` | JWT + autorización global; permiso cotizaciones.editar; ámbito | Quitar la imagen de un ítem de Insumos |
| cotizaciones | PUT | `/cotizaciones/:id/items/:itemId/imagen` | `CotizacionesController.uploadItemImage` | JWT + autorización global; permiso cotizaciones.editar; ámbito | Adjuntar una imagen opcional a un ítem de Insumos |
| cotizaciones | GET | `/cotizaciones/:id/previsualizar` | `CotizacionesController.previsualizar` | JWT + autorización global; permiso cotizaciones.previsualizar; ámbito | Previsualizar cotización |
| cotizaciones | POST | `/cotizaciones/:id/solicitud-anulacion` | `SolicitudAnulacionController.crear` | JWT + autorización global; permiso solicitudes_anulacion.crear; ámbito | Solicitar anulación de una cotización aprobada o emitida |
| cotizaciones | GET | `/cotizaciones/exportar` | `CotizacionesController.exportar` | JWT + autorización global; permiso cotizaciones.exportar; ámbito | Exportar cotizaciones a Excel |
| cotizaciones | GET | `/cotizaciones/iva-vigente` | `CotizacionesController.currentIva` | JWT + autorización global; permiso cotizaciones.crear; ámbito | Consultar la versión de IVA vigente para nuevos borradores |
| cotizaciones | PATCH | `/solicitudes-anulacion/:id/resolver` | `SolicitudAnulacionController.resolver` | JWT + autorización global; permiso solicitudes_anulacion.aprobar; ámbito | Aprobar o rechazar una solicitud de anulación |
| cotizaciones | GET | `/solicitudes-anulacion/pendientes` | `SolicitudAnulacionController.pendientes` | JWT + autorización global; permiso solicitudes_anulacion.ver; ámbito | Consultar solicitudes pendientes de los ámbitos administrados |
| formatos-documentales | GET | `/formatos-documentales` | `FormatosDocumentalesController.findAll` | JWT + autorización global; permiso formatos.ver; ámbito | find all (servicio: formatosDocumentalesService.findAll) |
| formatos-documentales | POST | `/formatos-documentales` | `FormatosDocumentalesController.create` | JWT + autorización global; permiso formatos.crear; ámbito | create (servicio: formatosDocumentalesService.create) |
| formatos-documentales | DELETE | `/formatos-documentales/:id` | `FormatosDocumentalesController.remove` | JWT + autorización global; permiso formatos.eliminar; ámbito | remove (servicio: formatosDocumentalesService.remove) |
| formatos-documentales | GET | `/formatos-documentales/:id` | `FormatosDocumentalesController.findOne` | JWT + autorización global; permiso formatos.ver; ámbito | find one (servicio: formatosDocumentalesService.findOne) |
| formatos-documentales | PUT | `/formatos-documentales/:id` | `FormatosDocumentalesController.update` | JWT + autorización global; permiso formatos.editar; ámbito | update (servicio: formatosDocumentalesService.update) |
| formatos-documentales | GET | `/formatos-documentales/:id/versiones` | `FormatosDocumentalesController.findVersions` | JWT + autorización global; permiso formatos.ver; ámbito | find versions (servicio: formatosDocumentalesService.findVersions) |
| formatos-documentales | POST | `/formatos-documentales/:id/versiones` | `FormatosDocumentalesController.createVersion` | JWT + autorización global; permiso formatos.versiones.crear; ámbito | create version (servicio: formatosDocumentalesService.createVersion) |
| formatos-documentales | PUT | `/formatos-documentales/:id/versiones/:versionId` | `FormatosDocumentalesController.updateVersion` | JWT + autorización global; permiso formatos.versiones.editar; ámbito | update version (servicio: formatosDocumentalesService.updateVersion) |
| formatos-documentales | POST | `/formatos-documentales/:id/versiones/:versionId/estado` | `FormatosDocumentalesController.updateVersionState` | JWT + autorización global; permiso formatos.versiones.publicar; ámbito | update version state (servicio: formatosDocumentalesService.updateVersionState) |
| gerencia | GET | `/gerencia/administradores` | `GerenciaAdministradoresController.listar` | JWT + autorización global; permiso gerencia.administradores.gestionar; ámbito | listar (servicio: administrators.listar) |
| gerencia | POST | `/gerencia/administradores` | `GerenciaAdministradoresController.crear` | JWT + autorización global; permiso gerencia.administradores.gestionar; ámbito | Crear cuenta y asignación de administrador de área de forma atómica |
| gerencia | POST | `/gerencia/administradores/:userId/asignaciones` | `GerenciaAdministradoresController.asignar` | JWT + autorización global; permiso gerencia.administradores.gestionar; ámbito | asignar (servicio: administrators.asignar) |
| gerencia | DELETE | `/gerencia/administradores/:userId/asignaciones/:assignmentId` | `GerenciaAdministradoresController.retirar` | JWT + autorización global; permiso gerencia.administradores.gestionar; ámbito | Retirar solo esta pertenencia; conserva cuenta, otras áreas e historial |
| gerencia | GET | `/gerencia/administradores/catalogo` | `GerenciaAdministradoresController.catalogo` | JWT + autorización global; permiso gerencia.administradores.gestionar; ámbito | catalogo (servicio: administrators.catalogo) |
| gerencia | GET | `/gerencia/detalle` | `GerenciaController.detalle` | JWT + autorización global; permiso gerencia.metricas.ver; ámbito | Detalle paginado de un indicador usando las mismas fechas y ámbitos del resumen |
| gerencia | GET | `/gerencia/resumen` | `GerenciaController.resumen` | JWT + autorización global; permiso gerencia.metricas.ver; ámbito | Resumen y serie diaria gerencial; importes cotizados y emitidos, sin ingresos cobrados |
| health | GET | `/health/live` | `HealthController.live` | Público; límite global de solicitudes | live |
| health | GET | `/health/ready` | `HealthController.ready` | Público; límite global de solicitudes | ready (servicio: health.check, database.pingCheck) |
| logistica | GET | `/logistica/conductores` | `ConductoresController.list` | JWT + autorización global; permiso logistica.ordenes.ver; ámbito | list (servicio: service.list) |
| logistica | POST | `/logistica/conductores` | `ConductoresController.create` | JWT + autorización global; permiso logistica.ordenes.crear; ámbito | create (servicio: service.create) |
| logistica | PUT | `/logistica/conductores/:id` | `ConductoresController.update` | JWT + autorización global; permiso logistica.ordenes.crear; ámbito | update (servicio: service.update) |
| logistica | PATCH | `/logistica/conductores/:id/estado` | `ConductoresController.state` | JWT + autorización global; permiso logistica.ordenes.cambiar_estado; ámbito | state (servicio: service.setActive) |
| logistica | GET | `/logistica/cotizaciones-aprobadas` | `LogisticaController.findCotizacionesAprobadas` | JWT + autorización global; permiso logistica.cotizaciones_disponibles.ver; ámbito | find cotizaciones aprobadas (servicio: logisticaService.findCotizacionesAprobadasConSaldo) |
| logistica | GET | `/logistica/ordenes` | `LogisticaController.findAllOrdenes` | JWT + autorización global; permiso logistica.ordenes.ver; ámbito | find all ordenes (servicio: logisticaService.findAll) |
| logistica | POST | `/logistica/ordenes` | `LogisticaController.createOrden` | JWT + autorización global; permiso logistica.ordenes.crear; ámbito | create orden (servicio: logisticaService.createOrden) |
| logistica | GET | `/logistica/ordenes/:id` | `LogisticaController.findOneOrden` | JWT + autorización global; permiso logistica.ordenes.ver; ámbito | find one orden (servicio: logisticaService.findOne) |
| logistica | PATCH | `/logistica/ordenes/:id/acta/cerrar` | `LogisticaController.cerrarActa` | JWT + autorización global; permiso logistica.despacho.ejecutar; ámbito | cerrar acta (servicio: logisticaService.cerrarActa) |
| logistica | PATCH | `/logistica/ordenes/:id/acta/fase1` | `LogisticaController.guardarFase1Acta` | JWT + autorización global; permiso logistica.recepciones.registrar; ámbito | guardar fase1acta (servicio: logisticaService.guardarFase1Acta) |
| logistica | PATCH | `/logistica/ordenes/:id/acta/fase2` | `LogisticaController.guardarFase2Acta` | JWT + autorización global; permiso logistica.despacho.ejecutar; ámbito | guardar fase2acta (servicio: logisticaService.guardarFase2Acta) |
| logistica | GET | `/logistica/ordenes/:id/documentos-emitidos` | `LogisticaController.listarDocumentosEmitidos` | JWT + autorización global; permiso logistica.ordenes.ver; ámbito | listar documentos emitidos (servicio: logisticaService.findDocumentosEmitidosPorOrden) |
| logistica | PUT | `/logistica/ordenes/:id/estado` | `LogisticaController.updateEstado` | JWT + autorización global; permiso logistica.ordenes.cambiar_estado; ámbito | update estado (servicio: logisticaService.updateEstado) |
| logistica | PATCH | `/logistica/ordenes/:id/materiales` | `LogisticaController.updateMateriales` | JWT + autorización global; permiso logistica.recepciones.registrar; ámbito | update materiales (servicio: logisticaService.updateMateriales) |
| logistica | GET | `/logistica/ordenes/:id/pdf` | `LogisticaController.descargarPdf` | JWT + autorización global; permiso logistica.ordenes.ver; ámbito | descargar pdf (servicio: logisticaService.findOneForPdf, logisticaService.buildPdfSnapshot) |
| planta | GET | `/planta/ciclos` | `PlantaController.findCiclos` | JWT + autorización global; permiso planta.ciclos.ver; ámbito | find ciclos (servicio: plantaService.findCiclos) |
| planta | POST | `/planta/ciclos` | `PlantaController.createCiclo` | JWT + autorización global; permiso planta.ciclos.crear; ámbito | create ciclo (servicio: plantaService.createCiclo) |
| planta | GET | `/planta/ordenes` | `PlantaController.findOrdenesEnPlanta` | JWT + autorización global; permiso planta.ordenes.ver; ámbito | find ordenes en planta (servicio: plantaService.findOrdenesEnPlanta) |
| planta | GET | `/planta/protocolos` | `PlantaController.findProtocolos` | JWT + autorización global; permiso planta.protocolos.ver; ámbito | find protocolos (servicio: plantaService.findProtocolos) |
| productos | GET | `/productos` | `ProductosController.findAll` | JWT + autorización global; permiso productos.gestionar; ámbito | Listar catálogo de productos y servicios |
| productos | POST | `/productos` | `ProductosController.create` | JWT + autorización global; permiso productos.gestionar; ámbito | Crear producto o servicio del catálogo |
| productos | PUT | `/productos/:id` | `ProductosController.update` | JWT + autorización global; permiso productos.gestionar; ámbito | Actualizar producto o servicio del catálogo |
| productos | PATCH | `/productos/:id/estado` | `ProductosController.updateStatus` | JWT + autorización global; permiso productos.gestionar; ámbito | Activar o desactivar una referencia del catálogo |
| productos | GET | `/productos/buscar/crear` | `ProductosController.searchForCreation` | JWT + autorización global; permiso cotizaciones.crear; ámbito | Buscar productos activos para una cotización nueva |
| productos | GET | `/productos/buscar/editar` | `ProductosController.searchForEditing` | JWT + autorización global; permiso cotizaciones.editar; ámbito | Buscar productos activos para editar una cotización |
| productos | POST | `/productos/importar-excel` | `ProductosController.importExcel` | JWT + autorización global; permiso productos.gestionar; ámbito | Importar insumos desde un archivo Excel .xlsx |
| rbac | GET | `/ambitos` | `AmbitoController.listar` | JWT + autorización global; permiso ambitos.gestionar; ámbito | listar (servicio: ambitos.listar) |
| rbac | POST | `/ambitos` | `AmbitoController.crear` | JWT + autorización global; permiso ambitos.gestionar; ámbito | crear (servicio: ambitos.crear) |
| rbac | GET | `/ambitos/:id` | `AmbitoController.obtener` | JWT + autorización global; permiso ambitos.gestionar; ámbito | obtener (servicio: ambitos.obtener) |
| rbac | PATCH | `/ambitos/:id` | `AmbitoController.actualizar` | JWT + autorización global; permiso ambitos.gestionar; ámbito | actualizar (servicio: ambitos.actualizar) |
| rbac | PATCH | `/ambitos/:id/cerrar` | `AmbitoController.cerrar` | JWT + autorización global; permiso ambitos.gestionar; ámbito | cerrar (servicio: ambitos.cerrar) |
| sellos | GET | `/sellos` | `SellosController.findAll` | JWT + autorización global; permiso sellos.ver; ámbito | find all (servicio: sellosService.findAll) |
| sellos | POST | `/sellos` | `SellosController.create` | JWT + autorización global; permiso sellos.crear; ámbito | create (servicio: sellosService.create) |
| sellos | DELETE | `/sellos/:id` | `SellosController.deactivate` | JWT + autorización global; permiso sellos.desactivar; ámbito | deactivate (servicio: sellosService.deactivate) |
| sellos | PATCH | `/sellos/:id` | `SellosController.update` | JWT + autorización global; permiso sellos.editar; ámbito | update (servicio: sellosService.update) |
| sellos | GET | `/sellos/:id/imagen` | `SellosController.getImage` | JWT + autorización global; permiso sellos.ver; ámbito | get image (servicio: sellosService.getImage) |
| tasas-fiscales | GET | `/tasas-fiscales/iva` | `TasasFiscalesController.history` | JWT + autorización global; permiso tasas_fiscales.gestionar; ámbito | history (servicio: service.history) |
| tasas-fiscales | POST | `/tasas-fiscales/iva` | `TasasFiscalesController.publish` | JWT + autorización global; permiso tasas_fiscales.gestionar; ámbito | publish (servicio: service.publish) |
| users | GET | `/users` | `UsersController.findAll` | JWT + autorización global; permiso usuarios.ver; ámbito | find all (servicio: usersService.findAll) |
| users | POST | `/users` | `UsersController.create` | JWT + autorización global; permiso usuarios.identidad.gestionar; ámbito | create (servicio: userRoles.authorizeIdentity, userRoles.authorize) |
| users | DELETE | `/users/:id` | `UsersController.deactivate` | JWT; denegado por falta de permiso explícito; ámbito | deactivate |
| users | PATCH | `/users/:id` | `UsersController.update` | JWT + autorización global; permiso usuarios.identidad.gestionar; ámbito | update (servicio: userRoles.authorizeIdentity, usersService.update) |
| users | PATCH | `/users/:id/password/reset` | `UsersController.resetPassword` | JWT + autorización global; permiso usuarios.identidad.gestionar; ámbito | reset password (servicio: userRoles.authorizePasswordReset, passwordReset.requestReset) |
| users | POST | `/users/:id/role-assignments` | `UserRolesController.assign` | JWT + autorización global; permiso asignaciones.gestionar; ámbito | assign (servicio: roles.assign) |
| users | DELETE | `/users/:id/role-assignments/:assignmentId` | `UserRolesController.remove` | JWT + autorización global; permiso asignaciones.gestionar; ámbito | remove (servicio: roles.remove) |
| users | PATCH | `/users/:id/status` | `UsersController.setActive` | JWT + autorización global; permiso usuarios.identidad.gestionar; ámbito | set active (servicio: userRoles.authorizeIdentity, usersService.setActive) |
| users | GET | `/users/role-assignments` | `UserRolesController.assignments` | JWT + autorización global; permiso asignaciones.gestionar; ámbito | assignments (servicio: roles.assignments) |
| users | GET | `/users/role-catalog` | `UserRolesController.catalog` | JWT + autorización global; permiso asignaciones.gestionar; ámbito | catalog (servicio: roles.catalog) |

## 5. Modelo de Datos (Entidades y Relaciones)

Se documentan 36 clases con decorador `@Entity` en archivos `*.entity.ts`. Los campos listados son columnas persistidas; las propiedades de relación se presentan por separado.

| Dominio / entidad | Tabla | Campos persistidos | Relaciones TypeORM |
|---|---|---|---|
| `src/auditoria/entities/auditoria.entity.ts` (`Auditoria`) | `auditoria` | `scope_id`, `id`, `usuario_id`, `entidad`, `entidad_id`, `accion`, `detalle`, `created_at` | `rbac_scope_id_ref: ManyToOne(RbacScope)`, `usuario: ManyToOne(User)` |
| `src/certificados/entities/certificado-esterilizacion.entity.ts` (`CertificadoEsterilizacion`) | `certificados_esterilizacion` | `elaborado_por_id`, `verificado_por_id`, `elaborado_at`, `verificado_at`, `fecha_esterilizacion`, `fecha_vencimiento`, `id`, `consecutivo`, `token_publico`, `ciclo_id`, `orden_id`, `equipo`, `ciclo`, `parametros_tecnicos`, `controles_biologicos`, `estado`, `aprobador_id`, `aprobado_at`, `version_formato_id`, `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision`, `created_at` | `rbac_elaborado_por_id_ref: ManyToOne(User)`, `rbac_verificado_por_id_ref: ManyToOne(User)`, `cicloEsterilizacion: OneToOne(CicloEsterilizacion)`, `aprobador: ManyToOne(User)`, `version_formato: ManyToOne(FormatoVersiones)`, `orden: ManyToOne(OrdenServicio)` |
| `src/clientes/entities/cliente.entity.ts` (`Cliente`) | `clientes` | `scope_id`, `creador_id`, `id`, `razon_social`, `nit`, `contacto`, `telefono`, `email`, `direccion`, `cargo`, `ciudad`, `created_at` | `rbac_scope_id_ref: ManyToOne(RbacScope)`, `rbac_creador_id_ref: ManyToOne(User)` |
| `src/cotizaciones/entities/cotizacion-item.entity.ts` (`CotizacionItem`) | `cotizacion_items` | `id`, `producto_id`, `tipo_item`, `categoria`, `codigo`, `referencia`, `metodo`, `presentacion`, `marca`, `descripcion`, `unidad`, `precision_cantidad`, `imagen_key`, `imagen_sha256`, `imagen_mime_type`, `imagen_tamano_bytes`, `cantidad`, `valor_unitario`, `valor_total`, `cotizacion_id` | `producto: ManyToOne(Producto)`, `cotizacion: ManyToOne(Cotizacion)` |
| `src/cotizaciones/entities/cotizacion.entity.ts` (`Cotizacion`) | `cotizaciones` | `metodo_esterilizacion`, `aplica_esterilizacion`, `aplica_empaque`, `aplica_transporte`, `valor_transporte`, `aprobador_interno_id`, `aceptacion_registrada_por_id`, `aprobado_internamente_at`, `aceptacion_registrada_at`, `sello_icontec_version_id`, `id`, `consecutivo`, `fecha`, `tipo_servicio`, `version`, `estado`, `subtotal`, `iva`, `iva_tasa`, `iva_version_id`, `total`, `condiciones_comerciales`, `tiempo_despacho`, `transporte`, `forma_pago`, `validez_oferta`, `precio_incluye`, `precio_no_incluye`, `version_formato_id`, `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision`, `cliente_id`, `creador_id`, `scope_id` | `rbac_aprobador_interno_id_ref: ManyToOne(User)`, `rbac_aceptacion_registrada_por_id_ref: ManyToOne(User)`, `sello_icontec_version: ManyToOne(SelloCertificacionVersion)`, `iva_version: ManyToOne(TasaFiscal)`, `version_formato: ManyToOne(FormatoVersiones)`, `scope: ManyToOne(RbacScope)`, `creador: ManyToOne(User)`, `cliente: ManyToOne(Cliente)`, `items: OneToMany(CotizacionItem)` |
| `src/cotizaciones/entities/solicitud-anulacion.entity.ts` (`SolicitudAnulacion`) | `solicitudes_anulacion` | `id`, `cotizacion_id`, `creador_id`, `aprobador_id`, `motivo`, `estado`, `created_at`, `fecha_resolucion`, `observacion_resolucion` | `cotizacion: ManyToOne(Cotizacion)`, `creador: ManyToOne(User)`, `aprobador: ManyToOne(User)` |
| `src/documentos/entities/secuencia-consecutivos.entity.ts` (`SecuenciaConsecutivos`) | `secuencias_consecutivos` | `nombre`, `ultimo_valor` | — |
| `src/formatos-documentales/entities/formato-asignaciones-cliente.entity.ts` (`FormatoAsignacionesCliente`) | `formato_asignaciones_cliente` | `id`, `cliente_id`, `formato_id`, `version_formato_id`, `activa`, `created_at` | `cliente: ManyToOne(Cliente)`, `formato: ManyToOne(FormatosDocumentales)`, `version_formato: ManyToOne(FormatoVersiones)` |
| `src/formatos-documentales/entities/formato-versiones.entity.ts` (`FormatoVersiones`) | `formato_versiones` | `scope_id`, `creador_id`, `aprobador_id`, `publicado_por_id`, `aprobado_at`, `publicado_at`, `id`, `formato_id`, `version`, `responsable`, `estado`, `renderer_key`, `configuracion_json`, `fecha_version`, `es_vigente`, `created_at`, `updated_at` | `rbac_scope_id_ref: ManyToOne(RbacScope)`, `rbac_creador_id_ref: ManyToOne(User)`, `rbac_aprobador_id_ref: ManyToOne(User)`, `rbac_publicado_por_id_ref: ManyToOne(User)`, `formato: ManyToOne(FormatosDocumentales)`, `asignaciones_cliente: OneToMany(FormatoAsignacionesCliente)` |
| `src/formatos-documentales/entities/formatos-documentales.entity.ts` (`FormatosDocumentales`) | `formatos_documentales` | `id`, `clave`, `tipo_documento`, `tipo_servicio`, `codigo`, `nombre`, `cliente_id`, `created_at`, `updated_at` | `versiones: OneToMany(FormatoVersiones)`, `asignaciones_cliente: OneToMany(FormatoAsignacionesCliente)` |
| `src/logistica/entities/documento-emitido.entity.ts` (`DocumentoEmitido`) | `documentos_emitidos` | `id`, `tipo`, `consecutivo`, `formato_version_id`, `snapshot_json`, `pdf_storage_key`, `pdf_hash`, `fecha_emision`, `usuario_id`, `estado`, `orden_id`, `created_at` | `usuario: ManyToOne(User)`, `orden: ManyToOne(OrdenServicio)` |
| `src/logistica/entities/documento-evento.entity.ts` (`DocumentoEvento`) | `documentos_eventos` | `id`, `documento_emitido_id`, `tipo_evento`, `usuario_id`, `fecha`, `motivo`, `datos_json`, `created_at` | `documentoEmitido: ManyToOne(DocumentoEmitido)`, `usuario: ManyToOne(User)` |
| `src/logistica/entities/entrega.entity.ts` (`Entrega`) | `entregas` | `id`, `orden_id`, `fecha_hora_entrega`, `usuario_id`, `transportista`, `conductor`, `placa`, `recibido_por`, `evidencias`, `estado`, `created_at` | `orden: ManyToOne(OrdenServicio)`, `usuario: ManyToOne(User)` |
| `src/logistica/entities/conductor.entity.ts` (`Conductor`) | `logistica_conductores` | `id`, `scope_id`, `nombre_completo`, `documento`, `telefono`, `placa_vehiculo`, `activo` | — |
| `src/logistica/entities/recepcion-item.entity.ts` (`RecepcionItem`) | `recepcion_items` | `id`, `recepcion_id`, `orden_servicio_material_id`, `descripcion`, `referencia`, `lote`, `cantidad_recibida`, `cantidad_recibida_cajas`, `unidad_medida`, `observaciones`, `created_at` | `recepcion: ManyToOne(RecepcionLogistica)` |
| `src/logistica/entities/recepcion-logistica.entity.ts` (`RecepcionLogistica`) | `recepciones_logistica` | `id`, `orden_id`, `numero_remision_factura`, `fecha_hora_recepcion`, `usuario_id`, `sede_origen`, `evidencias`, `estado`, `created_at` | `orden: ManyToOne(OrdenServicio)`, `usuario: ManyToOne(User)` |
| `src/ordenes-servicio/entities/orden-servicio.entity.ts` (`OrdenServicio`) | `ordenes_servicio` | `scope_id`, `creador_id`, `metodo_esterilizacion`, `version`, `id`, `consecutivo`, `acta_consecutivo`, `formato_orden_version_id`, `formato_acta_version_id`, `cotizacion_id`, `orden_compra_cliente`, `fecha_programada`, `estado`, `conductor_asignado`, `vehiculo_placa`, `conductor_recoleccion_id`, `conductor_entrega_id`, `fecha_hora_recoleccion`, `lote_recoleccion`, `cajas_recibidas`, `cantidad_recibida`, `entregado_por_cliente`, `recibido_por_sterinova`, `fecha_hora_entrega`, `cajas_entregadas`, `cantidad_entregada`, `certificado_asociado`, `entregado_por_sterinova`, `recibido_por_cliente`, `generar_acta`, `generar_orden`, `acta_fase`, `acta_cerrada_at`, `certificado_no`, `factura_no`, `novedad_tipo`, `novedad_motivo`, `observaciones`, `observaciones_recepcion`, `observaciones_cliente`, `created_at` | `rbac_scope_id_ref: ManyToOne(RbacScope)`, `rbac_creador_id_ref: ManyToOne(User)`, `materiales: OneToMany(OrdenServicioMaterial)`, `eventos: OneToMany(OrdenServicioEvento)`, `cotizacion: OneToOne(Cotizacion)` |
| `src/ordenes-servicio/entities/orden-servicio-evento.entity.ts` (`OrdenServicioEvento`) | `ordenes_servicio_eventos` | `id`, `orden_id`, `tipo`, `ocurrido_at`, `usuario_id`, `datos_json` | `orden: ManyToOne(OrdenServicio)`, `usuario: ManyToOne(User)` |
| `src/ordenes-servicio/entities/orden-servicio-material.entity.ts` (`OrdenServicioMaterial`) | `ordenes_servicio_materiales` | `id`, `orden_id`, `cotizacion_item_id`, `posicion`, `descripcion`, `referencia`, `lote`, `cantidad`, `cantidad_recibida`, `cajas_recibidas`, `cantidad_entregada`, `cajas_entregadas`, `visto_bueno`, `devolucion_registrada`, `cantidad_devuelta`, `empaque`, `muestras_retencion`, `muestras_cliente`, `muestras_laboratorio`, `created_at`, `updated_at` | `orden: ManyToOne(OrdenServicio)`, `cotizacion_item: ManyToOne(CotizacionItem)` |
| `src/planta/entities/ciclo-esterilizacion.entity.ts` (`CicloEsterilizacion`) | `ciclos_esterilizacion` | `scope_id`, `fecha_esterilizacion`, `tiempo_secado`, `protocolo_version_id`, `id`, `orden_id`, `equipo`, `metodo`, `operador_id`, `temperatura`, `humedad`, `presion`, `tiempo_exposicion`, `tiempo_aireacion`, `control_biologico`, `control_quimico`, `fecha_proceso`, `estado`, `revisado_por`, `revisado_en`, `motivo_rechazo`, `ciclo_correccion_de_id` | `rbac_scope_id_ref: ManyToOne(RbacScope)`, `protocolo_version: ManyToOne(ProtocoloEsterilizacionVersion)`, `evaluaciones: OneToMany(CicloParametroEvaluacion)`, `orden: ManyToOne(OrdenServicio)`, `operador: ManyToOne(User)`, `revisor: ManyToOne(User)`, `cicloOriginal: ManyToOne(CicloEsterilizacion)`, `certificado: OneToOne(CertificadoEsterilizacion)` |
| `src/planta/entities/ciclo-material-procesado.entity.ts` (`CicloMaterialProcesado`) | `ciclos_materiales_procesados` | `id`, `ciclo_id`, `orden_servicio_material_id`, `cantidad_procesada`, `created_at` | `ciclo: ManyToOne(CicloEsterilizacion)`, `ordenServicioMaterial: ManyToOne(OrdenServicioMaterial)` |
| `src/planta/entities/ciclo-parametro-evaluacion.entity.ts` (`CicloParametroEvaluacion`) | `ciclos_parametros_evaluaciones` | `id`, `ciclo_id`, `parametro`, `criterio`, `evaluador_id`, `evaluado_at` | `ciclo: ManyToOne(CicloEsterilizacion)`, `evaluador: ManyToOne(User)` |
| `src/planta/entities/protocolo-esterilizacion-version.entity.ts` (`ProtocoloEsterilizacionVersion`) | `protocolos_esterilizacion_versiones` | `id`, `metodo`, `version`, `especificaciones_json`, `motivo`, `creado_por_id`, `created_at` | `creado_por: ManyToOne(User)` |
| `src/productos/entities/producto.entity.ts` (`Producto`) | `productos` | `id`, `scope_id`, `tipo_servicio`, `tipo_item`, `categoria`, `codigo`, `referencia`, `metodo`, `presentacion`, `marca`, `descripcion`, `unidad`, `precision_cantidad`, `activo`, `created_at`, `updated_at` | `scope: ManyToOne(RbacScope)` |
| `src/rbac/entities/role.entity.ts` (`RbacPermission`) | `rbac_permissions` | `code`, `module`, `label`, `active`, `isDynamic` | — |
| `src/rbac/entities/user-role-assignment.entity.ts` (`RbacPlatformOwner`) | `rbac_platform_owner` | `id`, `user_id`, `role_id`, `role_kind`, `scope_id`, `scope_kind`, `created_at` | `user: ManyToOne(User)`, `role: ManyToOne(RbacRole)`, `scope: ManyToOne(RbacScope)` |
| `src/rbac/entities/role.entity.ts` (`RbacRolePermission`) | `rbac_role_permissions` | `role_id`, `permission_code`, `resource_access`, `include_descendants` | `role: ManyToOne(RbacRole)`, `permission: ManyToOne(RbacPermission)` |
| `src/rbac/entities/role.entity.ts` (`RbacRole`) | `rbac_roles` | `global_assignable`, `id`, `code`, `name`, `kind`, `active`, `created_at` | — |
| `src/rbac/entities/scope.entity.ts` (`RbacScopeClosure`) | `rbac_scope_closure` | `ancestor_id`, `descendant_id`, `depth` | `ancestor: ManyToOne(RbacScope)`, `descendant: ManyToOne(RbacScope)` |
| `src/rbac/entities/scope.entity.ts` (`RbacScope`) | `rbac_scopes` | `id`, `code`, `name`, `kind`, `parent_id`, `active`, `global_slot`, `created_at` | `parent: ManyToOne(RbacScope)` |
| `src/rbac/entities/user-role-assignment.entity.ts` (`RbacUserRoleAssignment`) | `rbac_user_role_assignments` | `role_global_assignable`, `id`, `user_id`, `role_id`, `role_kind`, `scope_id`, `scope_kind`, `active`, `created_at` | `global_eligibility_role: ManyToOne(RbacRole)`, `user: ManyToOne(User)`, `role: ManyToOne(RbacRole)`, `scope: ManyToOne(RbacScope)` |
| `src/sellos/entities/sello-certificacion.entity.ts` (`SelloCertificacion`) | `sellos_certificacion` | `id`, `nombre_norma`, `numero_licencia`, `imagen_key`, `aplica_a`, `activo`, `orden`, `created_at`, `updated_at` | — |
| `src/sellos/entities/sello-certificacion-version.entity.ts` (`SelloCertificacionVersion`) | `sellos_certificacion_versiones` | `id`, `sello_id`, `version`, `imagen_key`, `imagen_sha256`, `mime_type`, `tamano_bytes`, `nombre_norma`, `numero_licencia`, `creado_por_id`, `created_at` | `sello: ManyToOne(SelloCertificacion)`, `creado_por: ManyToOne(User)` |
| `src/tasas-fiscales/entities/tasa-fiscal.entity.ts` (`TasaFiscal`) | `tasas_fiscales` | `id`, `impuesto`, `version`, `tasa`, `vigente_desde`, `creado_por`, `motivo`, `creado_at` | — |
| `src/users/entities/password-reset-token.entity.ts` (`PasswordResetToken`) | `password_reset_tokens` | `id`, `user_id`, `token_hash`, `created_by`, `expires_at`, `used_at`, `created_at` | — |
| `src/users/entities/user.entity.ts` (`User`) | `usuarios` | `id`, `nombre`, `apellido`, `cargo`, `celular`, `email_contacto`, `email`, `password_hash`, `password_version`, `rbac_version`, `activo`, `created_at` | — |

## 6. Scripts, Pruebas y Tareas Automáticas

**Scripts de `package.json`:**

- `npm run build`: `nest build`.
- `npm run deploy`: `nest deploy`.
- `npm run format`: `prettier --write "src/**/*.ts" "test/**/*.ts"`.
- `npm run start`: `nest start`.
- `npm run start:dev`: `nest start --watch`.
- `npm run start:debug`: `nest start --debug --watch`.
- `npm run start:prod`: `node dist/main`.
- `npm run start:deploy`: `npm run migration:run && npm run bootstrap:admin && npm run start:prod`.
- `npm run migration:run`: `npm run build && typeorm migration:run -d dist/database/data-source.js`.
- `npm run migration:revert`: `npm run build && typeorm migration:revert -d dist/database/data-source.js`.
- `npm run migration:show`: `npm run build && typeorm migration:show -d dist/database/data-source.js`.
- `npm run seed:icontec`: `npm run build && node dist/scripts/seed-icontec.js`.
- `npm run seed:templates`: `npm run build && node dist/scripts/seed-document-templates.js`.
- `npm run seed:document-templates`: `npm run seed:templates`.
- `npm run bootstrap:admin`: `npm run build && node dist/scripts/bootstrap-admin.js`.
- `npm run lint`: `oxlint src/ test/`.
- `npm run test`: `vitest run`.
- `npm run test:contract`: `vitest run --config ./vitest.config.e2e.ts test/openapi-contract.e2e-spec.ts`.
- `npm run test:rbac:schema`: `vitest run --config ./vitest.config.rbac.ts`.
- `npm run test:watch`: `vitest`.
- `npm run test:cov`: `vitest run --coverage`.
- `npm run test:debug`: `vitest --inspect-brk --no-file-parallelism`.
- `npm run test:e2e`: `vitest run --config ./vitest.config.e2e.ts`.
- `npm run seed:backend-roles`: `npm run build && node dist/scripts/seed-backend-roles.js`.

**Pruebas:** unitarias y de servicio junto al código en `src/**/*.spec.ts`; integración, contrato OpenAPI y E2E en `test/`, con configuraciones `vitest.config*.ts`. `npm test -- <archivo>` y `npm run test:e2e -- <archivo>` permiten ejecutar suites focalizadas.

**Ejecución y tareas:** `start:deploy` compone migraciones, bootstrap idempotente del administrador y arranque de producción. Los scripts `seed:*` son tareas manuales. En el código de `src/` no hay decoradores `@Cron`, `@Processor`, `@InjectQueue` ni registro de `ScheduleModule`/`BullModule`; no se detectaron cron jobs ni colas de trabajo.

`npm run seed:icontec` ejecuta `src/scripts/seed-icontec.ts`, que comprueba el entorno local y las migraciones antes de invocar la única implementación de escritura en `src/sellos/seed-icontec.ts`. Son un punto de entrada y una función reutilizable, no dos semillas independientes.

**PDF:** `PdfGeneratorService` reutiliza un navegador Playwright y limita las páginas simultáneas mediante una cola local al proceso. `PDF_MAX_CONCURRENCY` fija el máximo (por defecto 2); el límite no coordina varias instancias del backend. Las páginas se cierran al terminar o fallar y `PDF_RENDER_TIMEOUT_MS` limita la espera de cada petición.
