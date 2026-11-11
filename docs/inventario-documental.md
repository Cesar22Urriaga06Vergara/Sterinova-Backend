# Inventario maestro de documentación

Actualizado el 11 de noviembre de 2026 después de la limpieza. Incluye Markdown de raíz y archivos de docs, salvo este inventario. Los documentos históricos conservan su fecha y alcance.

## Sterinova-Backend

### Sterinova-Backend/CHANGELOG.md

- **Contenido:** Cambios pendientes de publicación y línea base del 6 de noviembre.
- **Propósito:** Historial de cambios de la API.
- **Estado Sugerido:** Vigente
- **Observaciones:** La etiqueta de la línea base no acredita una versión desplegada.

### Sterinova-Backend/CONTRIBUTING.md

- **Contenido:** Entorno, ramas, commits, PR y sincronización de OpenAPI.
- **Propósito:** Guía para contribuir al backend.
- **Estado Sugerido:** Vigente
- **Observaciones:** Incluye el alta inicial del administrador mediante bootstrap.

### Sterinova-Backend/README.md

- **Contenido:** Requisitos, arranque, variables, comandos y render PDF.
- **Propósito:** Entrada para desarrolladores backend.
- **Estado Sugerido:** Vigente
- **Observaciones:** El índice de docs amplía la orientación.

## Sterinova-Backend/docs

### Sterinova-Backend/docs/README.md

- **Contenido:** Índice de requisitos, diseño, implementación, archivo y guías operativas.
- **Propósito:** Entrada canónica de documentación backend.
- **Estado Sugerido:** Vigente
- **Observaciones:** Conviene incluir el informe de unificación y este inventario en una actualización posterior.

## Sterinova-Backend/docs/archivo/2026-11-10/contexto

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/INDEX.md

- **Contenido:** Mapa de documentos del paquete de contexto backend.
- **Propósito:** Facilitar consulta del paquete archivado.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Remite al índice activo.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/INSTRUCCIONES_CONTEXTO_TANDA2.md

- **Contenido:** Guion de levantamiento de endpoints, esquema, RBAC, pruebas y estados.
- **Propósito:** Documentar la metodología de la segunda ronda.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Es una instrucción de trabajo histórica.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/auth.md

- **Contenido:** Flujo JWT, payload, expiración y persistencia en cliente.
- **Propósito:** Referencia del mecanismo de autenticación observado entonces.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Contrastar con arquitectura-y-stack y con el código de sesión actual.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/cobertura-tests.md

- **Contenido:** Inventario de suites de dominio, migraciones, RBAC e integración.
- **Propósito:** Evidencia histórica de cobertura y vacíos.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Las cifras y ejecutores corresponden a la captura archivada.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/deuda-tecnica.md

- **Contenido:** Brechas observadas de integración, evolución y autorización.
- **Propósito:** Registrar deuda identificada en la ronda de contexto.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Validar cada punto antes de trasladarlo al backlog.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/endpoints.md

- **Contenido:** Listado de rutas HTTP por módulo y observaciones de acceso.
- **Propósito:** Mapa de API del corte archivado.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** OpenAPI ya incluye rutas de administración de roles ausentes de esta captura.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/estados-entidades.md

- **Contenido:** Estados de cotizaciones, órdenes, ciclos y formatos.
- **Propósito:** Referencia para reconstruir transiciones conocidas.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Conciliar valores y transiciones con servicios y reglas maestras.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/migraciones.md

- **Contenido:** Serie de migraciones, patrones y carga de datos.
- **Propósito:** Referencia de evolución del esquema.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La cadena actual incluye migraciones posteriores de roles.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/modelo-datos.md

- **Contenido:** Entidades de usuario, relaciones RBAC y módulos principales.
- **Propósito:** Orientación histórica del modelo.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La captura reconoce que el esquema está incompleto.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/modulos-backend.md

- **Contenido:** Mapa de módulos NestJS y sus responsabilidades.
- **Propósito:** Orientación técnica del corte archivado.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Usar estado-implementado como entrada para el diagnóstico actual.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/pdf-render.md

- **Contenido:** Secuencia de render, variables, almacenamiento y fallos.
- **Propósito:** Conservar la explicación técnica del flujo original.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El runbook PDF cubre la operación vigente.

### Sterinova-Backend/docs/archivo/2026-11-10/contexto/rbac.md

- **Contenido:** Roles legacy, catálogo, matriz, ámbitos y piloto de cotizaciones.
- **Propósito:** Preservar el punto de partida RBAC.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Anterior a la unificación de asignaciones.

## Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/auditoria-docs-2026-11-06.md

- **Contenido:** Inventario, verdades comprobadas, contradicciones y riesgos de la auditoría.
- **Propósito:** Evidencia detallada de la auditoría anterior.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La cabecera interior todavía dice «vigente» debajo del aviso de archivo.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/baseline-fase0.md

- **Contenido:** Entorno, esquema, migraciones, pruebas y Git del arranque.
- **Propósito:** Línea base para comparar las fases backend.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Resultados limitados a ese entorno.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/cierre-hito4-y-traspaso-2026-11-09.md

- **Contenido:** Ajuste de certificado, validación y tareas de traspaso.
- **Propósito:** Preservar decisiones y pruebas del cierre del hito 4.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Las instrucciones de arranque pertenecen a la sesión fechada.

## Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/historico

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/historico/analisis-estado-2026-11-03.md

- **Contenido:** Mapa de API, datos y frontend, con reglas de Excel, IVA y consecutivos.
- **Propósito:** Fotografía previa a los hitos de noviembre.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El IVA dinámico y los cambios RBAC son posteriores.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/historico/analisis-estado-2026-11-04.md

- **Contenido:** Estado de módulos y pendientes al 4 de noviembre.
- **Propósito:** Fotografía del avance inicial de ERP.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Mantener la fecha visible al citar capacidades.

## Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/hito1-iva-dinamico-2026-11-09.md

- **Contenido:** Tasas fiscales configurables, cálculo y congelación del IVA por documento.
- **Propósito:** Evidencia de implementación y aplicación local del hito 1.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Conservar como trazabilidad de la migración y los casos probados.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/hito2-edicion-borradores-2026-11-09.md

- **Contenido:** Contrato de edición de borradores, interfaz y migración local.
- **Propósito:** Registrar alcance del punto A del hito 2.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El contrato API vigente debe ser la referencia operativa.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/hito4-paso1-datos-operativos-2026-11-09.md

- **Contenido:** Protocolos de referencia, datos operativos y consecutivos.
- **Propósito:** Evidencia de aplicación local del paso 1.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Su aprobación está fechada y acotada al entorno local.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/hito4-paso2-backend-2026-11-09.md

- **Contenido:** Material recibido, ciclos, evaluación, vencimiento y congelación de sello.
- **Propósito:** Evidencia de la entrega backend del hito 4.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El propio reporte remite al paso 3 terminado.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/hito4-paso3-frontend-2026-11-09.md

- **Contenido:** Formularios, renderizadores e inicialización local de ICONTEC.
- **Propósito:** Registrar entrega frontend y criterios de prueba real.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Distingue verificación técnica de prueba manual.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/inicio-fase1-rbac-2026-11-08.md

- **Contenido:** Fundamentos RBAC, entrega inicial, pruebas y límites.
- **Propósito:** Preservar el arranque de la refactorización de seguridad.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Anterior al piloto y a la unificación.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/modulos.md

- **Contenido:** Disponibilidad funcional, tipos y prefijos de cotización, certificados y PDFs.
- **Propósito:** Preservar el mapa de módulos anterior.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La cabecera «vigente» contradice el aviso de archivo.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/piloto-cotizaciones-rbac-2026-11-08.md

- **Contenido:** Respaldo, esquema, conciliación local y validación del piloto.
- **Propósito:** Trazabilidad del primer despliegue local acotado a cotizaciones.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Consultar el contrato técnico para la semántica del piloto.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/plan-accion-backend-2026-11-06.md

- **Contenido:** Plan por fases de seguridad, datos, regulación, PDF, calidad y operación.
- **Propósito:** Preservar el plan que originó los reportes.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Extenso y rotulado «vigente» bajo el aviso de archivo.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/reporte-fase1.md

- **Contenido:** Endurecimiento, DTOs, dependencias y validación de la API.
- **Propósito:** Evidencia de cierre de seguridad y contrato.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Las referencias de dependencias son del 6 de noviembre.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/reporte-fase2.md

- **Contenido:** Concurrencia de consecutivos, trigger y migraciones.
- **Propósito:** Evidencia del cierre de datos y consecutivos.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Para operar, consultar el runbook de respaldos.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/reporte-fase3.md

- **Contenido:** ADR de evidencias y firmas, auditoría y retención.
- **Propósito:** Evidencia del trabajo de dominio regulatorio.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La decisión de firmas queda condicionada a negocio.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/reporte-fase4.md

- **Contenido:** Implementación PDF, documentación de operación y validaciones.
- **Propósito:** Evidencia de la fase de documentos oficiales.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La aceptación visual requiere revisión de Calidad.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/reporte-fase5.md

- **Contenido:** CI con MariaDB, E2E, OpenAPI y cobertura.
- **Propósito:** Evidencia del cierre de calidad y CI.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El pipeline actual debe cotejarse con el workflow.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/reporte-fase6.md

- **Contenido:** Salud, observabilidad, despliegue y verificaciones locales.
- **Propósito:** Evidencia de cierre de observabilidad.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Los resultados locales no son evidencia de ambientes remotos.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/reporte-fase7.md

- **Contenido:** Gobernanza documental, ADR y contrato OpenAPI.
- **Propósito:** Evidencia del cierre documental.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El índice ADR actual también registra RBAC.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md

- **Contenido:** Alcance, hallazgos, riesgos y responsables del cierre de auditoría.
- **Propósito:** Resumen ejecutivo del levantamiento anterior.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La cabecera de vigencia pertenece al corte original.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/revision-calidad-documental.md

- **Contenido:** Clasificación, fuentes canónicas y enlaces comprobados en la auditoría.
- **Propósito:** Evidencia de revisión documental.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Las rutas históricas requieren cotejo con la reorganización.

### Sterinova-Backend/docs/archivo/2026-11-10/estado-proyecto/transicion-frontend-y-reglas-2026-11-09.md

- **Contenido:** Traspaso RBAC y propuestas sobre borradores, IVA, sellos y estampado.
- **Propósito:** Rastro de la transición y de decisiones previas a los hitos.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Separar las propuestas originales de los hitos ya ejecutados.

## Sterinova-Backend/docs/archivo/2026-11-11/calidad-y-pruebas

### Sterinova-Backend/docs/archivo/2026-11-11/calidad-y-pruebas/unificacion-roles-2026-11-10.md

- **Contenido:** Aplicación local de roles múltiples, procedimiento SQL, endpoints y resultados.
- **Propósito:** Evidencia de la entrega verificada el 11 de noviembre.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Archivado el 11 de noviembre de 2026. Consultar referencias activas para el estado vigente.

## Sterinova-Backend/docs/archivo/2026-11-11/gestion-documental

### Sterinova-Backend/docs/archivo/2026-11-11/gestion-documental/inventario-origen.json

- **Contenido:** Rutas, hashes y títulos de la línea base documental.
- **Propósito:** Manifiesto de procedencia de la reorganización.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Archivado el 11 de noviembre de 2026. Consultar referencias activas para el estado vigente.

### Sterinova-Backend/docs/archivo/2026-11-11/gestion-documental/reorganizacion-2026-11-10.md

- **Contenido:** Plan ejecutado, movimientos y consolidaciones del backend.
- **Propósito:** Trazabilidad de la reorganización documental.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Archivado el 11 de noviembre de 2026. Consultar referencias activas para el estado vigente.

### Sterinova-Backend/docs/archivo/2026-11-11/gestion-documental/verificacion-2026-11-10.md

- **Contenido:** Comprobaciones de archivos, enlaces y reglas consolidadas.
- **Propósito:** Evidencia de aceptación documental del 10 de noviembre.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Archivado el 11 de noviembre de 2026. Consultar referencias activas para el estado vigente.

## Sterinova-Backend/docs/archivo/2026-11-11/superpowers/plans

### Sterinova-Backend/docs/archivo/2026-11-11/superpowers/plans/2026-11-10-usuarios-prueba.md

- **Contenido:** Perfilado de cuentas locales y referencia a resultados de verificación.
- **Propósito:** Rastro de la habilitación de usuarios de prueba.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Archivado el 11 de noviembre de 2026. Consultar referencias activas para el estado vigente.

## Sterinova-Backend/docs/arquitectura/adr

### Sterinova-Backend/docs/arquitectura/adr/001-evidencias-y-firmas.md

- **Contenido:** Propuesta de evidencia, firmas, almacenamiento privado e integridad.
- **Propósito:** ADR para decisión pendiente de negocio y Calidad.
- **Estado Sugerido:** Vigente
- **Observaciones:** Mantener explícito el estado propuesto.

### Sterinova-Backend/docs/arquitectura/adr/002-pdf-playwright-nextjs.md

- **Contenido:** Decisión de render con Playwright y vistas Next.js.
- **Propósito:** ADR del mecanismo de PDF oficial.
- **Estado Sugerido:** Vigente
- **Observaciones:** Los pasos de operación están en runbook-pdfs.

### Sterinova-Backend/docs/arquitectura/adr/003-consecutivos-transaccionales.md

- **Contenido:** Secuencias persistentes y bloqueo pesimista.
- **Propósito:** ADR de concurrencia para consecutivos.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar tablas y formatos con las migraciones al ampliar servicios.

### Sterinova-Backend/docs/arquitectura/adr/004-rbac-con-ambitos.md

- **Contenido:** Permisos centrales y asignaciones acotadas por ámbito.
- **Propósito:** ADR de autorización.
- **Estado Sugerido:** Vigente
- **Observaciones:** Actualizar las referencias de adopción con los avances de administración de roles.

### Sterinova-Backend/docs/arquitectura/adr/README.md

- **Contenido:** Listado y estados de los cuatro ADR.
- **Propósito:** Índice de decisiones arquitectónicas.
- **Estado Sugerido:** Vigente
- **Observaciones:** Conservar la distinción entre propuesta y decisión aceptada.

## Sterinova-Backend/docs/arquitectura

### Sterinova-Backend/docs/arquitectura/api-y-contratos.md

- **Contenido:** Mapa de rutas, validación y errores de la API.
- **Propósito:** Orientación previa a consultar el contrato generado.
- **Estado Sugerido:** Vigente
- **Observaciones:** Revisar cada cambio de rutas contra OpenAPI.

### Sterinova-Backend/docs/arquitectura/arquitectura-y-stack.md

- **Contenido:** Componentes, JWT, autorización y límites de seguridad.
- **Propósito:** Descripción transversal de arquitectura backend.
- **Estado Sugerido:** Vigente
- **Observaciones:** Coordinar las referencias RBAC con el diagnóstico y el informe de unificación.

### Sterinova-Backend/docs/arquitectura/auditoria-dependencias.md

- **Contenido:** Resultados y pendientes de npm audit durante la fase 1.
- **Propósito:** Evidencia de revisión de dependencias fechada.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Un nuevo resultado requiere ejecutar otra auditoría.

### Sterinova-Backend/docs/arquitectura/contexto-frontend.md

- **Contenido:** Sesión, configuración, módulos, patrones, cobertura y deuda del frontend.
- **Propósito:** Centralizar el contexto técnico antes de eliminar las copias.
- **Estado Sugerido:** Vigente
- **Observaciones:** Referencia documental consolidada al 11 de noviembre de 2026.

### Sterinova-Backend/docs/arquitectura/contrato-autorizacion-rbac.md

- **Contenido:** Decisión de acceso, permisos, migración y HTTP del piloto de cotizaciones.
- **Propósito:** Contrato de referencia para el piloto y anulaciones.
- **Estado Sugerido:** Vigente
- **Observaciones:** Delimitar el piloto frente a la operación posterior de usuarios.

### Sterinova-Backend/docs/arquitectura/estado-implementado.md

- **Contenido:** Dos motores, tablas RBAC y brechas respecto al negocio.
- **Propósito:** Mapa técnico del comportamiento implementado.
- **Estado Sugerido:** Vigente
- **Observaciones:** La administración de roles de usuarios ya tiene controlador propio. Incorporar esa superficie y la derivación de usuarios.rol.

### Sterinova-Backend/docs/arquitectura/openapi.json

- **Contenido:** Contrato OpenAPI con rutas, operaciones y esquemas REST.
- **Propósito:** Referencia de integración y verificación de cambios.
- **Estado Sugerido:** Vigente
- **Observaciones:** Incluye las cuatro operaciones de catálogo y asignaciones de roles del controlador actual.

### Sterinova-Backend/docs/arquitectura/roles-y-permisos.md

- **Contenido:** Jerarquía, ámbitos, segregación, catálogo y matriz por endpoint.
- **Propósito:** Diseño objetivo de autorización y referencia de permisos.
- **Estado Sugerido:** Vigente
- **Observaciones:** Extenso. Actualizar las marcas existente/propuesto con la unificación sin perder la distinción entre diseño y comportamiento.

## Sterinova-Backend/docs

### Sterinova-Backend/docs/auditoria-funcional-y-oportunidades.md

- **Contenido:** Dieciocho brechas, oportunidades y hoja de ruta funcional.
- **Propósito:** Priorizar mejoras sustentadas en evidencia y fuentes externas.
- **Estado Sugerido:** Vigente
- **Observaciones:** Referencia documental consolidada al 11 de noviembre de 2026.

## Sterinova-Backend/docs/base-de-datos

### Sterinova-Backend/docs/base-de-datos/esquema-y-migraciones.md

- **Contenido:** Configuración de MariaDB, entidades, migraciones, consecutivos e inmutabilidad.
- **Propósito:** Referencia del modelo persistente.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar cambios con migration-registry.ts y las migraciones de roles.

### Sterinova-Backend/docs/base-de-datos/respaldos-y-operacion.md

- **Contenido:** Respaldo, restauración, despliegue de migraciones e integridad.
- **Propósito:** Runbook de operación de base de datos.
- **Estado Sugerido:** Vigente
- **Observaciones:** Conservar los procedimientos de verificación de consecutivos y PDFs tras restaurar.

## Sterinova-Backend/docs/calidad-y-pruebas

### Sterinova-Backend/docs/calidad-y-pruebas/aceptacion-visual-pdfs.md

- **Contenido:** Matriz de aceptación de PDFs oficiales y validación visual.
- **Propósito:** Pauta para revisión humana de Calidad.
- **Estado Sugerido:** Vigente
- **Observaciones:** Actualizar muestras y criterios cuando cambien las plantillas.

### Sterinova-Backend/docs/calidad-y-pruebas/calidad-de-datos.md

- **Contenido:** Invariantes, retención y límites de auditoría.
- **Propósito:** Referencia técnica de calidad del dato.
- **Estado Sugerido:** Vigente
- **Observaciones:** Conciliar las reglas de retención con requisitos y configuración.

### Sterinova-Backend/docs/calidad-y-pruebas/checklist-verificacion-operativa.md

- **Contenido:** Controles de datos, suites, acceso, PDF, frontend y despliegue.
- **Propósito:** Lista operativa de comprobación.
- **Estado Sugerido:** Vigente
- **Observaciones:** Registrar resultados por ambiente y fecha.

### Sterinova-Backend/docs/calidad-y-pruebas/pruebas.md

- **Contenido:** Comandos de pruebas backend, integración y límites.
- **Propósito:** Guía para reproducir comprobaciones.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar comandos con package.json y CI.

## Sterinova-Backend/docs/ejemplos-formatos

### Sterinova-Backend/docs/ejemplos-formatos/COT- CMED139 Ejemplo de Cotizacion Diligenciado.pdf

- **Contenido:** Cotización diligenciada de cuatro páginas con condiciones industriales, IVA y total.
- **Propósito:** Muestra de composición y paginación de una emisión real.
- **Estado Sugerido:** Vigente
- **Observaciones:** Usar como referencia histórica para la aceptación visual y omitir datos comerciales al compartir extractos.

### Sterinova-Backend/docs/ejemplos-formatos/COT-CEMFA192-1 Ejemplo de Cotizacion Diligenciado.pdf

- **Contenido:** Cotización diligenciada de tres páginas con esterilización industrial, métodos y totales.
- **Propósito:** Ejemplo de contenido técnico y económico.
- **Estado Sugerido:** Vigente
- **Observaciones:** Mantener la asociación con el tipo de servicio y la fecha de emisión.

### Sterinova-Backend/docs/ejemplos-formatos/COT-CME1095 Ejemplo de Cotizacion Diligenciado.pdf

- **Contenido:** Cotización diligenciada de tres páginas con condiciones institucionales e IVA.
- **Propósito:** Ejemplo de presentación institucional.
- **Estado Sugerido:** Vigente
- **Observaciones:** Comparar con la plantilla del método correspondiente al validar un render.

### Sterinova-Backend/docs/ejemplos-formatos/COT-CMI522 Ejemplo de Cotizacion Diligenciado.pdf

- **Contenido:** Cotización diligenciada de tres páginas para insumos, con condiciones y referencias a IVA.
- **Propósito:** Muestra de emisión del flujo de insumos.
- **Estado Sugerido:** Vigente
- **Observaciones:** Distinguir las condiciones del ejemplo de las reglas maestras actuales.

### Sterinova-Backend/docs/ejemplos-formatos/COT-LAV15-1 Ejemplo de Cotizacion Diligenciado.pdf

- **Contenido:** Cotización diligenciada de dos páginas de lavandería con condiciones e IVA.
- **Propósito:** Muestra del documento comercial de lavandería.
- **Estado Sugerido:** Vigente
- **Observaciones:** Contrastar con el R-CM-07-5 para la revisión de diseño.

### Sterinova-Backend/docs/ejemplos-formatos/Ejemplo de Certificado de Esterilizacion.pdf

- **Contenido:** Certificado de una página con datos de ciclo, lote y esterilización.
- **Propósito:** Referencia visual e histórica del certificado.
- **Estado Sugerido:** Vigente
- **Observaciones:** Usar junto al checklist de aceptación y al requisito de certificados.

### Sterinova-Backend/docs/ejemplos-formatos/R-CM-07-1 COTIZACION ESTERILIZACION INDUSTRIAL V4 17-09-2026.docx

- **Contenido:** Plantilla V4 de esterilización industrial con condiciones, IVA y total.
- **Propósito:** Referencia documental para reproducir la cotización industrial.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar la versión publicada con el registro documental del ambiente.

### Sterinova-Backend/docs/ejemplos-formatos/R-CM-07-2 COTIZACION ESTERILIZACION INSTITUCIONAL ETO V4 17-09-2026.docx

- **Contenido:** Plantilla V4 de esterilización institucional EtO con condiciones e importes.
- **Propósito:** Referencia documental del flujo institucional EtO.
- **Estado Sugerido:** Vigente
- **Observaciones:** Mantener separada de la plantilla institucional de vapor.

### Sterinova-Backend/docs/ejemplos-formatos/R-CM-07-3 COTIZACION ESTERILIZACION INSTITUCIONAL VAPOR V4 17-09-2026.docx

- **Contenido:** Plantilla V4 de esterilización institucional por vapor con condiciones e importes.
- **Propósito:** Referencia documental del flujo institucional de vapor.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar encabezado y condiciones con la salida PDF.

### Sterinova-Backend/docs/ejemplos-formatos/R-CM-07-4 COTIZACION INSUMOS V4 17-09-2026.docx

- **Contenido:** Plantilla V4 de insumos con condiciones comerciales y tratamiento de IVA.
- **Propósito:** Referencia documental de cotización de insumos.
- **Estado Sugerido:** Vigente
- **Observaciones:** El cuerpo es más extenso que los otros Word y aporta un caso de paginación.

### Sterinova-Backend/docs/ejemplos-formatos/R-CM-07-5 LAVANDERIA FARMACEUTICA V4 17-09-2026.docx

- **Contenido:** Plantilla V4 de lavandería farmacéutica con condiciones, IVA y total.
- **Propósito:** Referencia documental de cotización de lavandería.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar con el PDF diligenciado de lavandería.

## Sterinova-Backend/docs/manuales

### Sterinova-Backend/docs/manuales/configuracion-local.md

- **Contenido:** Requisitos, variables, arranque y comandos.
- **Propósito:** Preparar el entorno backend local.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar variables con .env.example.

### Sterinova-Backend/docs/manuales/despliegue.md

- **Contenido:** Prerrequisitos, migraciones, rollback, persistencia de PDFs y rotación.
- **Propósito:** Procedimiento para desplegar y revertir.
- **Estado Sugerido:** Vigente
- **Observaciones:** Distinguir la estrategia blue/green propuesta de la configuración de cada ambiente.

### Sterinova-Backend/docs/manuales/runbook-incidentes.md

- **Contenido:** Respuesta a fallas de BD, Playwright, disco y migraciones.
- **Propósito:** Guiar diagnóstico y recuperación operativa.
- **Estado Sugerido:** Vigente
- **Observaciones:** Las acciones dependen del motor y ambiente afectados.

### Sterinova-Backend/docs/manuales/runbook-pdfs.md

- **Contenido:** Emisión, verificación de integridad y recuperación de PDFs huérfanos.
- **Propósito:** Operación de documentos oficiales.
- **Estado Sugerido:** Vigente
- **Observaciones:** La regla M7 añade marca de copia restaurada y auditoría. Verificar su cobertura al actualizar el procedimiento.

## Sterinova-Backend/docs/negocio

### Sterinova-Backend/docs/negocio/contexto-producto.md

- **Contenido:** Descripción del ERP y sus responsabilidades de negocio.
- **Propósito:** Contexto común de producto.
- **Estado Sugerido:** Vigente
- **Observaciones:** El frontend conserva una descripción solapada.

### Sterinova-Backend/docs/negocio/cuestionarios-origen.md

- **Contenido:** Cien preguntas originales de los ocho módulos.
- **Propósito:** Preservar la procedencia de los requisitos.
- **Estado Sugerido:** Vigente
- **Observaciones:** Referencia documental consolidada al 11 de noviembre de 2026.

### Sterinova-Backend/docs/negocio/reglas-maestras.md

- **Contenido:** Decisiones, propuestas y vacíos de ocho módulos.
- **Propósito:** Referencia consolidada de requisitos.
- **Estado Sugerido:** Vigente
- **Observaciones:** Más de 1.200 líneas y fuentes por módulo en frontend. Definir mantenimiento sincronizado o una única edición canónica.

## Sterinova-Backend/docs/superpowers/plans

### Sterinova-Backend/docs/superpowers/plans/2026-11-10-rbac-backend.md

- **Contenido:** Plan por fases de esquema, semillas, motor y adopción por módulos.
- **Propósito:** Coordinar la evolución de RBAC.
- **Estado Sugerido:** Vigente
- **Observaciones:** Actualizar avance con las migraciones y endpoints de unificación.

## Sterinova-Backend/docs/ui-ux

### Sterinova-Backend/docs/ui-ux/correspondencia-ui-api.md

- **Contenido:** Relación entre rutas de interfaz y API por área.
- **Propósito:** Mapa de integración entre repositorios.
- **Estado Sugerido:** Vigente
- **Observaciones:** El cotejo del 6 de noviembre precede a UserRolesDialog y las rutas de asignaciones.

## SterinovaFrontend

### SterinovaFrontend/AGENTS.md

- **Contenido:** Aviso generado por Next.js sobre cambios de API y convenciones.
- **Propósito:** Orientar agentes hacia la documentación local de la versión instalada.
- **Estado Sugerido:** Vigente
- **Observaciones:** El propio archivo identifica el generador en next dev.

### SterinovaFrontend/CHANGELOG.md

- **Contenido:** Altas, mejoras y verificaciones de la línea base del frontend.
- **Propósito:** Registrar cambios relevantes.
- **Estado Sugerido:** Vigente
- **Observaciones:** La última entrada corresponde al 6 de noviembre.

### SterinovaFrontend/CONTRIBUTING.md

- **Contenido:** Flujo de contribución, reutilización UI, accesibilidad y pruebas.
- **Propósito:** Guiar cambios y revisión de PR.
- **Estado Sugerido:** Vigente
- **Observaciones:** Enlaza el sistema de diseño y sus patrones.

### SterinovaFrontend/README.md

- **Contenido:** Requisitos, inicio y comandos del frontend.
- **Propósito:** Punto de entrada al repositorio.
- **Estado Sugerido:** Vigente
- **Observaciones:** Conservar alineación con desarrollo-local y package.json.

## SterinovaFrontend/docs

### SterinovaFrontend/docs/README.md

- **Contenido:** Índice de guías vigentes y reportes históricos.
- **Propósito:** Navegar documentación frontend.
- **Estado Sugerido:** Vigente
- **Observaciones:** El corte del 6 de noviembre precede a docs/contexto y a las reglas por módulo.

## SterinovaFrontend/docs/arquitectura

### SterinovaFrontend/docs/arquitectura/auditoria-dependencias.md

- **Contenido:** Resultados de npm audit y gestión de la dependencia de hojas de cálculo.
- **Propósito:** Evidencia de una revisión fechada de dependencias.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Revalidar con el manifiesto actual antes de reutilizar sus conclusiones.

### SterinovaFrontend/docs/arquitectura/integracion-y-stack.md

- **Contenido:** App Router, API, sesión y render PDF.
- **Propósito:** Mapa técnico de integración frontend.
- **Estado Sugerido:** Vigente
- **Observaciones:** Consolidar aquí la configuración y las referencias de sesión de docs/contexto.

### SterinovaFrontend/docs/arquitectura/navegacion-y-permisos.md

- **Contenido:** Menú, guardas de ruta y permisos visibles.
- **Propósito:** Referencia de acceso y navegación de interfaz.
- **Estado Sugerido:** Vigente
- **Observaciones:** Actualizar con la gestión de asignaciones de roles en Usuarios.

## SterinovaFrontend/docs/calidad-y-pruebas

### SterinovaFrontend/docs/calidad-y-pruebas/pruebas-frontend.md

- **Contenido:** Comandos, suites y alcance de la verificación frontend.
- **Propósito:** Guía de pruebas unitarias y E2E.
- **Estado Sugerido:** Vigente
- **Observaciones:** Complementar con el detalle vigente del inventario de cobertura.

## SterinovaFrontend/docs/estado-proyecto

### SterinovaFrontend/docs/estado-proyecto/baseline-fase0.md

- **Contenido:** Entorno, navegación, API, UI y Git al iniciar.
- **Propósito:** Línea base para comparar entregas frontend.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Conservar como evidencia del diagnóstico inicial.

### SterinovaFrontend/docs/estado-proyecto/contexto-producto.md

- **Contenido:** Resumen del producto ERP y alcance general.
- **Propósito:** Orientar a quien llega al frontend.
- **Estado Sugerido:** Duplicado (Consolidar)
- **Observaciones:** El backend conserva el contexto común en docs/negocio/contexto-producto.md.

## SterinovaFrontend/docs/estado-proyecto/historico

### SterinovaFrontend/docs/estado-proyecto/historico/diseno-base-de-datos-inicial.md

- **Contenido:** Propuesta de tablas, arquitectura MariaDB y triggers.
- **Propósito:** Registrar el diseño preliminar.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El esquema operativo está documentado en el backend.

## SterinovaFrontend/docs/estado-proyecto

### SterinovaFrontend/docs/estado-proyecto/modulos.md

- **Contenido:** Mapa de módulos, rutas y cotizaciones visibles.
- **Propósito:** Orientación funcional sobre lo que expone la interfaz.
- **Estado Sugerido:** Vigente
- **Observaciones:** Verificar contra src/app y el módulo actualizado de Usuarios.

### SterinovaFrontend/docs/estado-proyecto/plan-accion-frontend-2026-11-06.md

- **Contenido:** Plan por fases de navegación, sesión, módulos, diseño y accesibilidad.
- **Propósito:** Rastro del programa original de mejora frontend.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Casi 900 líneas. Conciliar pendientes que sigan abiertos antes de archivar.

### SterinovaFrontend/docs/estado-proyecto/reporte-fase2.md

- **Contenido:** Cliente API, sesión, notificaciones y estados de vista.
- **Propósito:** Evidencia de ejecución de la fase 2.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Los patrones vigentes se describen en las guías UI y de integración.

### SterinovaFrontend/docs/estado-proyecto/reporte-fase3.md

- **Contenido:** Alineación de cotizaciones, dashboard, Calidad y Usuarios.
- **Propósito:** Evidencia de cambios en módulos críticos.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Usuarios incorporó gestión de asignaciones después de ese corte.

### SterinovaFrontend/docs/estado-proyecto/reporte-fase4.md

- **Contenido:** Tokens, componentes y migración de vistas piloto.
- **Propósito:** Evidencia de adopción del sistema visual.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** La validación visual humana tiene su propio alcance.

### SterinovaFrontend/docs/estado-proyecto/reporte-fase5.md

- **Contenido:** Correcciones de accesibilidad y auditoría Lighthouse.
- **Propósito:** Evidencia fechada de revisión automatizada.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El recorrido de teclado y lector de pantalla figura pendiente en el reporte.

### SterinovaFrontend/docs/estado-proyecto/reporte-fase6.md

- **Contenido:** Configuración Playwright, flujos cubiertos y validación.
- **Propósito:** Evidencia de entrega E2E.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** El catálogo de pruebas actual debe cotejarse con e2e/.

### SterinovaFrontend/docs/estado-proyecto/reporte-fase7.md

- **Contenido:** Gobernanza, aviso de Next.js, dependencias y verificación.
- **Propósito:** Evidencia de cierre documental y UI/UX.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Consultar las guías vigentes para aplicar sus decisiones.

## SterinovaFrontend/docs/kickoff

### SterinovaFrontend/docs/kickoff/instruccion-copilot-fase1-frontend.md

- **Contenido:** Encargo de integración, sesión JWT, errores y protección de rutas.
- **Propósito:** Preservar el alcance inicial de la fase 1.
- **Estado Sugerido:** Histórico (Archivar)
- **Observaciones:** Las tareas reflejan el estado de la línea base.

## SterinovaFrontend/docs/manuales

### SterinovaFrontend/docs/manuales/desarrollo-local.md

- **Contenido:** Requisitos, arranque y URL del backend.
- **Propósito:** Configurar una instancia local del frontend.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar valores con .env.example.

## SterinovaFrontend/docs/ui-ux

### SterinovaFrontend/docs/ui-ux/accesibilidad.md

- **Contenido:** Criterios, resultados automatizados y recorridos manuales con tecnologías de apoyo.
- **Propósito:** Guía de validación de accesibilidad.
- **Estado Sugerido:** Vigente
- **Observaciones:** Los resultados publicados se limitan a las vistas piloto.

### SterinovaFrontend/docs/ui-ux/design-system.md

- **Contenido:** Tokens y variantes de componentes base con ejemplos.
- **Propósito:** Referencia de reutilización y consistencia visual.
- **Estado Sugerido:** Vigente
- **Observaciones:** Cotejar variantes con src/components/ui al cambiar componentes.

### SterinovaFrontend/docs/ui-ux/flujos-criticos.md

- **Contenido:** Rutas y recorridos críticos con alcance de pruebas E2E.
- **Propósito:** Mapa para verificación de la experiencia.
- **Estado Sugerido:** Vigente
- **Observaciones:** La verificación fechada precede al diálogo de asignaciones en Usuarios.

### SterinovaFrontend/docs/ui-ux/principios-y-patrones.md

- **Contenido:** Estructura de páginas ERP, tokens, estados, accesibilidad y controles.
- **Propósito:** Guía para construir y mantener vistas.
- **Estado Sugerido:** Vigente
- **Observaciones:** Incorporar convenciones comprobadas de patrones-frontend.

## Resumen Ejecutivo

Se registran **111 archivos**. Se archivaron **5 archivos del backend** y se eliminaron **24 archivos del frontend** después de conservar reglas, cuestionarios y contexto técnico en el backend. Los 11 ejemplos PDF/DOCX permanecen como referencias activas.

Las 31 recomendaciones originales incluían ambos repositorios y ejemplos protegidos. Se aplicaron las excepciones a arquitectura, negocio, ADR y ejemplos. Los archivos personales se trasladaron a C:/Users/urria/ y quedan fuera del inventario del ERP.

| Repositorio | Archivos |
| --- | ---: |
| Sterinova-Backend | 85 |
| SterinovaFrontend | 26 |

Los tres documentos prioritarios son [reglas maestras](negocio/reglas-maestras.md), [OpenAPI](arquitectura/openapi.json) y [estado implementado](arquitectura/estado-implementado.md).
