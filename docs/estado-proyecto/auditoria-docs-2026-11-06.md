# Fase 5 — Informe estructurado de auditoría documental Sterinova ERP

> **Estado:** vigente (informe final de auditoría documental).
> **Verificado contra:** código backend/frontend y Markdown del repositorio el 6 de noviembre de 2026.
> **Alcance:** inventario, veracidad documental, contradicciones, UI/UX y límites de verificación de ambos repositorios.
> **No cubre:** estado de despliegues, bases de datos, resultados de pruebas ni aceptación visual.
> **Límite:** no se inspeccionaron secretos, instancias, despliegues, resultados de pruebas ni presentación visual.

**Fecha de revisión:** 6 de noviembre de 2026
**Alcance:** documentación de `backend_sterinova/docs` y `frontend_sterinova/docs`, cotejada con el código fuente de ambos repositorios.
**Límite:** no se leyeron archivos `.env` ni `.env.local`, no se consultó una instancia de MariaDB, no se verificó un despliegue, no se ejecutaron pruebas ni validaciones visuales. No se encontró `.env.example` en ninguno de los dos repositorios; las variables se cotejaron directamente contra el código y los manuales.

## 1. Inventario documental final

### Backend — `backend_sterinova/docs`

| Carpeta | Documento | Clasificación final |
|---|---|---|
| raíz | `README.md` | Índice vigente; separa vigentes e históricos. |
| `arquitectura/` | `arquitectura-y-stack.md` | Vigente, actualizado con auth, roles, seguridad y flujo de PDF. |
| `arquitectura/` | `api-y-contratos.md` | Vigente; rutas, acceso, validación y límites de contrato. |
| `base-de-datos/` | `esquema-y-migraciones.md` | Vigente, actualizado contra entidades y 11 migraciones registradas. |
| `base-de-datos/` | `respaldos-y-operacion.md` | Referencia operativa; procedimientos efectivos no verificados. |
| `manuales/` | `configuracion-local.md` | Vigente, actualizado con entorno y bootstrap. |
| `manuales/` | `despliegue.md` | Referencia de configuración esperada; entorno no verificado. |
| `calidad-y-pruebas/` | `pruebas.md`, `calidad-de-datos.md` | Inventario de pruebas e invariantes declaradas en código. |
| `ui-ux/` | `correspondencia-ui-api.md` | Vigente; discrepancias estáticas entre repositorios. |
| `estado-proyecto/` | `modulos.md` | Vigente, mapa canónico funcional y de cotizaciones. |
| `estado-proyecto/` | `contexto-producto.md` | Vigente; contexto, no especificación de capacidades implementadas. |
| `estado-proyecto/` | `auditoria-docs-2026-11-06.md` | Informe de esta auditoría. |
| `estado-proyecto/historico/` | `analisis-estado-2026-11-04.md` | Histórico; movido, marcado con reemplazo y enlace al estado vigente. |
| `estado-proyecto/historico/` | `analisis-estado-2026-11-03.md` | Histórico; conserva aviso y enlace al análisis fechado siguiente. |
| `ejemplos-formatos/` | 5 archivos Word R-CM-07-1 a R-CM-07-5 | Plantillas/ejemplos de referencia; no prueban configuración operativa. |

### Frontend — `frontend_sterinova/docs`

| Carpeta | Documento | Clasificación final |
|---|---|---|
| raíz | `README.md` | Índice vigente con sección histórica. |
| `arquitectura/` | `integracion-y-stack.md` | Vigente, actualizado contra rutas, cliente API y render PDF. |
| `arquitectura/` | `navegacion-y-permisos.md` | Vigente; rutas y visibilidad de enlaces, no autorización efectiva. |
| `manuales/` | `desarrollo-local.md` | Vigente, actualizado; documenta URL fija de login. |
| `estado-proyecto/` | `modulos.md` | Vigente, actualizado con rutas de Calidad, Usuarios y Configuración. |
| `estado-proyecto/` | `contexto-producto.md` | Vigente; contexto, no evidencia de funcionalidades. |
| `estado-proyecto/historico/` | `diseno-base-de-datos-inicial.md` | Histórico; conserva aviso de borrador, enlazado desde índices al esquema vigente backend. |
| `ui-ux/` | `principios-y-patrones.md`, `accesibilidad.md`, `flujos-criticos.md` | Referencias de hallazgos estáticos y pendientes de validación visual/teclado. |
| `calidad-y-pruebas/` | `pruebas-frontend.md` | Inventario estático de pruebas `.mjs`, sin ejecución. |

## 2. Verdades verificadas

| Tema | Estado real según código | Evidencia principal | Documento actualizado |
|---|---|---|---|
| `synchronize` | Desactivado en AppModule y DataSource; las migraciones no se ejecutan al iniciar TypeORM automáticamente. | `backend_sterinova/src/app.module.ts`, `src/database/data-source.ts` | Backend arquitectura y base de datos |
| Migraciones | Hay 11 clases registradas en DataSource, desde `InitialSchema` hasta `AddUsersAndCertificationSeals`; pruebas de migración no son migraciones. Estado aplicado en MariaDB: no verificado. | `backend_sterinova/src/database/data-source.ts`, `src/database/migrations/` | Backend base de datos |
| `/auth/seed` | No aparece en el controlador actual. `POST /auth/login` es público. | `backend_sterinova/src/auth/auth.controller.ts`, `src/auth/decorators/public.decorator.ts` | Backend arquitectura y configuración local |
| `bootstrap:admin` | Sí existe como script npm; requiere variables `ADMIN_*`, contraseña mínima de 12 caracteres y falla si el correo ya está creado. | `backend_sterinova/package.json`, `src/scripts/bootstrap-admin.ts` | Backend arquitectura y configuración local |
| JWT y roles | Guardas globales JWT y Roles; controladores asignan perfiles. Rol Admin tiene bypass en `RolesGuard`. | `backend_sterinova/src/app.module.ts`, `src/auth/guards/jwt-auth.guard.ts`, `src/common/guards/roles.guard.ts`, controladores de módulos | Backend arquitectura |
| Calidad | Hay API de pendientes/detalle/aprobar/rechazar y UI. La aprobación confirma contraseña, crea certificado y actualiza ciclo dentro de transacción; rechazo requiere motivo. | `backend_sterinova/src/calidad/`, `frontend_sterinova/src/app/(erp)/calidad/` | Backend módulos; frontend módulos |
| Certificado, QR y firma | Se emite certificado con token público y PDF; endpoint público valida el token y el PDF React incluye QR. No se encontró entidad de evidencia ni firma digital; el sello gráfico es recurso distinto. | `backend_sterinova/src/certificados/`, `src/calidad/`; `frontend_sterinova/src/components/pdf/CertificadoPDF.tsx` | Backend módulos y base de datos |
| Consecutivo `55388` | No es la siguiente emisión definida por la cadena actual para una base limpia: migración posterior reinicia a cero y servicio rellena a tres dígitos, así que comienza `001`. Los valores de una DB específica no se consultaron. | `backend_sterinova/src/database/migrations/1793754000000-ResetCertificateSequenceToThreeDigits.ts`, `1793757600000-ExtendDocumentSequences.ts`, `src/certificados/certificados.service.ts` | Backend base de datos y módulos |
| `secuencias_consecutivos` | Existe entidad/tabla y se usa para certificados y prefijos de cotización; emisión usa transacción y bloqueo pesimista. | `backend_sterinova/src/documentos/entities/secuencia-consecutivos.entity.ts`, `src/certificados/certificados.service.ts`, `src/cotizaciones/cotizaciones.service.ts` | Backend base de datos y módulos |
| Cotizaciones | Backend enumera 7 tipos; UI ofrece 5. `FARMACEUTICO` y `FABRICANTE` no están en el selector. Prefijos: `COT-IND`, `COT-CME` para dos tipos institucionales, `COT-CMI`, `COT-LAV`, `COT-CEMFA`, `COT-CMED`. | `backend_sterinova/src/cotizaciones/entities/tipo-servicio.enum.ts`, `cotizaciones.service.ts`; `frontend_sterinova/src/lib/cotizacion-types.ts` | Backend módulos; frontend módulos |
| PDF oficial | Backend Playwright renderiza rutas internas Next.js con componentes React; no es PDF oficial generado por html2pdf/jsPDF en navegador. Guarda URL/hash y versión de motor. UI solicita `POST /cotizaciones/:id/emitir`, `GET /cotizaciones/:id/descargar` y `GET /certificados/:id/descargar`. | `backend_sterinova/src/pdf/pdf-generator.service.ts`, servicios/controladores de cotizaciones/certificados; `frontend_sterinova/src/app/(erp)/comercial/cotizaciones/CotizacionesClient.tsx`, `src/app/(erp)/calidad/` | Backend módulos; ambas arquitecturas |
| Migración/versionado PDF | Existe `AddPdfRendererVersion1793813500000`; entidades incluyen `pdf_url`, `hash_pdf` y `pdf_renderer_version`. Si está aplicada en una instancia concreta: no verificado. | `backend_sterinova/src/database/migrations/1793813500000-AddPdfRendererVersion.ts`, entidades de cotización y certificado | Backend base de datos y módulos |
| Auditoría, evidencias, firmas, historial | Existe tabla/entidad auditoría y se usa para emisión de cotización y operaciones de formatos; no es historial integral. No se encontraron entidades de evidencia adjunta o firma digital. Hay versiones/snapshots de documentos. | `backend_sterinova/src/auditoria/`, usos en `cotizaciones.service.ts` y `formatos-documentales.service.ts` | Backend base de datos y módulos |
| Rutas UI Calidad/Usuarios | Ambas existen; también existen rutas de Configuración para plantillas y sellos. | `frontend_sterinova/src/app/(erp)/calidad/`, `usuarios/`, `configuracion/` | Frontend módulos |
| Navegación Sidebar/Header | `src/lib/navigation.ts` registra `/calidad` y `/usuarios`, con visibilidad por rol; las páginas correspondientes existen. `Header.tsx` muestra identidad y cierre de sesión, no enlaces de módulos. | `frontend_sterinova/src/lib/navigation.ts`, `src/components/Sidebar.tsx`, `src/components/Header.tsx`, páginas de `src/app/(erp)/calidad/` y `usuarios/` | Frontend módulos |
| Cliente API | Usa `NEXT_PUBLIC_API_URL` y envía bearer JWT; el formulario login llama a `http://localhost:3001/auth/login` fijo. | `frontend_sterinova/src/lib/api.ts`, `src/app/login/page.tsx` | Frontend arquitectura y manual local |
| Dashboard | Cuatro contadores son literales en componente, no llegan de API. | `frontend_sterinova/src/app/(erp)/page.tsx` | Backend módulos; frontend módulos |
| Estados de Calidad y revisión | El enum del ciclo contiene `PENDIENTE_CALIDAD`, `APROBADO`, `RECHAZADO` (además de `EN_PROCESO`); el modelo guarda revisor como `revisado_por`/relación `revisor` y el motivo como `motivo_rechazo`. No se encontró `motivo_decision` como columna/campo. | `backend_sterinova/src/planta/entities/ciclo-esterilizacion.entity.ts`, `src/calidad/calidad.service.ts` | Backend esquema y módulos |
| Secuencia vs. tabla de certificados | La tabla es `certificados_esterilizacion`; el nombre de secuencia guardado en `secuencias_consecutivos` es `certificado_esterilizacion`. Certificados y cotizaciones consumen secuencias transaccionales con bloqueo de escritura. | `backend_sterinova/src/documentos/entities/secuencia-consecutivos.entity.ts`, `src/certificados/certificados.service.ts`, `src/cotizaciones/cotizaciones.service.ts` | Backend esquema y módulos |
| Variables de render y archivo de ejemplo | El código reconoce `PDF_RENDER_SECRET`, `PDF_RENDER_BASE_URL` y `FRONTEND_INTERNAL_URL`. No existe `.env.example` en backend ni frontend. No se leyeron valores de los archivos locales de entorno. | `backend_sterinova/src/pdf/pdf-generator.service.ts`, `src/pdf/pdf-render-token.ts`; ausencia confirmada por listado de archivos | Backend configuración local; frontend desarrollo local |
| Vencimiento de sesión en UI | El interceptor frontend elimina el token y redirige al recibir `401`; no verifica expiración de JWT antes de enviar solicitudes. El token interno para render PDF sí tiene vencimiento de 90 segundos. | `frontend_sterinova/src/lib/api.ts`, `backend_sterinova/src/pdf/pdf-render-token.ts` | Frontend integración |
| Recursos PDF | Cotización y certificado usan `Logo1.png` y `certificaciones-icontec-iqnet.jpeg`; certificado también usa `sello-calidad.png`. `html2pdf.js` figura como dependencia, pero no se usa para la generación oficial backend con Playwright. | `frontend_sterinova/src/components/pdf/CotizacionPDF.tsx`, `CertificadoPDF.tsx`, `frontend_sterinova/package.json`, `backend_sterinova/src/pdf/pdf-generator.service.ts` | Frontend integración |
| Tests localizados | Backend: 25 archivos `*.spec.ts` más `test/app.e2e-spec.ts`; cubren auth/guardas, Calidad, certificados, clientes, cotizaciones, migraciones, formatos, PDF, planta, sellos, usuarios y controlador raíz. Frontend: cuatro pruebas `.mjs` para moneda, contenido PDF de cotización, navegación y usuario almacenado; `package.json` no declara script de test. Se inventariaron, pero no se ejecutaron. | `backend_sterinova/src/**`, `backend_sterinova/test/app.e2e-spec.ts`, `frontend_sterinova/tests/`, `frontend_sterinova/package.json` | Backend arquitectura; frontend módulos |

### 2.1 Entidades TypeORM registradas y columnas

`src/database/entities.ts` registra 13 clases `@Entity`. Esta lista enumera las columnas y llaves foráneas declaradas en cada entidad; las propiedades de relación inversa no crean columnas adicionales por sí solas. El esquema efectivo de una base desplegada sigue siendo **NO VERIFICABLE EN CÓDIGO**.

| Tabla (`@Entity`) | Columnas declaradas |
|---|---|
| `usuarios` (`User`) | `id`, `nombre`, `apellido`, `cargo`, `celular`, `email_contacto`, `email`, `password_hash`, `rol`, `activo`, `created_at` |
| `clientes` (`Cliente`) | `id`, `razon_social`, `nit`, `contacto`, `telefono`, `email`, `direccion`, `cargo`, `ciudad`, `created_at` |
| `cotizaciones` (`Cotizacion`) | `id`, `consecutivo`, `fecha`, `tipo_servicio`, `estado`, `subtotal`, `iva`, `total`, `condiciones_comerciales`, `version_formato_id`, `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision`, `cliente_id`, `creador_id` |
| `cotizacion_items` (`CotizacionItem`) | `id`, `descripcion`, `cantidad`, `valor_unitario`, `valor_total`, `cotizacion_id` |
| `ordenes_servicio` (`OrdenServicio`) | `id`, `consecutivo`, `cotizacion_id`, `fecha_programada`, `estado`, `conductor_asignado`, `vehiculo_placa`, `observaciones`, `created_at` |
| `ciclos_esterilizacion` (`CicloEsterilizacion`) | `id`, `orden_id`, `equipo`, `metodo`, `operador_id`, `temperatura`, `humedad`, `presion`, `tiempo_exposicion`, `tiempo_aireacion`, `control_biologico`, `control_quimico`, `fecha_proceso`, `estado`, `revisado_por`, `revisado_en`, `motivo_rechazo`, `ciclo_correccion_de_id` |
| `certificados_esterilizacion` (`CertificadoEsterilizacion`) | `id`, `consecutivo`, `token_publico`, `ciclo_id`, `orden_id`, `equipo`, `ciclo`, `parametros_tecnicos`, `controles_biologicos`, `estado`, `aprobador_id`, `aprobado_at`, `version_formato_id`, `snapshot_datos`, `pdf_url`, `hash_pdf`, `pdf_renderer_version`, `fecha_emision`, `created_at` |
| `secuencias_consecutivos` (`SecuenciaConsecutivos`) | `nombre`, `ultimo_valor` |
| `formatos_documentales` (`FormatosDocumentales`) | `id`, `clave`, `tipo_documento`, `tipo_servicio`, `codigo`, `nombre`, `created_at`, `updated_at` |
| `formato_versiones` (`FormatoVersiones`) | `id`, `formato_id`, `version`, `responsable`, `estado`, `renderer_key`, `configuracion_json`, `fecha_version`, `es_vigente`, `created_at`, `updated_at` |
| `formato_asignaciones_cliente` (`FormatoAsignacionesCliente`) | `id`, `cliente_id`, `formato_id`, `version_formato_id`, `activa`, `created_at` |
| `auditoria` (`Auditoria`) | `id`, `usuario_id`, `entidad`, `entidad_id`, `accion`, `detalle`, `created_at` |
| `sellos_certificacion` (`SelloCertificacion`) | `id`, `nombre_norma`, `numero_licencia`, `imagen_key`, `activo`, `orden`, `created_at`, `updated_at` |

### 2.2 Migraciones de código y pruebas asociadas

El DataSource registra 11 migraciones ejecutables. En `src/database/migrations/` también hay dos archivos de pruebas (`schema-migrations.spec.ts` y `1793813600000-AddUsersAndCertificationSeals.spec.ts`); no son migraciones.

| Archivo / clase registrada | Resumen del `up()` |
|---|---|
| `1730750400000-InitialSchema` | Crea el esquema inicial de usuarios, clientes, cotizaciones, ítems, órdenes, ciclos y certificados; incluye manejo de base/baseline existente. |
| `1730750401000-AddQualityCertificates` | Amplía rol/ciclo/certificados para Calidad; crea la tabla de secuencias y trigger de inmutabilidad. |
| `1730750402000-AddCertificateValidationToken` | Agrega y asigna tokens públicos únicos a certificados existentes; recrea el trigger. |
| `1793750400000-AddDocumentFormatVersioning` | Crea catálogo, versiones y asignaciones de formatos; agrega snapshots y restricciones relacionadas. |
| `1793754000000-ResetCertificateSequenceToThreeDigits` | Reduce consecutivo a tres caracteres y reinicia secuencia solo si no hay certificados; `down()` no revierte ese reset. |
| `1793757600000-ExtendDocumentSequences` | Amplía consecutivos y recalcula/crea secuencias de certificados y prefijos de cotización según datos existentes. |
| `1793813200000-AddClienteDocumentFields` | Agrega `cargo` y `ciudad` a clientes. |
| `1793813300000-CreateAuditoria` | Crea tabla de auditoría e índices. |
| `1793813400000-AddTemplateResponsible` | Agrega `responsable` requerido a versiones de formato y completa filas previas. |
| `1793813500000-AddPdfRendererVersion` | Agrega `pdf_renderer_version` en cotizaciones/certificados y ajusta el trigger de inmutabilidad del certificado. |
| `1793813600000-AddUsersAndCertificationSeals` | Amplía datos de usuarios/cotizaciones y crea la tabla de sellos de certificación. |

La aplicación de esas migraciones en una instalación concreta es **NO VERIFICABLE EN CÓDIGO**; requiere consultar esa instancia con `npm run migration:show`.

## 3. Contradicciones resueltas

| Documento anterior | Afirmación contradictoria o imprecisa | Corrección aplicada |
|---|---|---|
| Backend `analisis-estado-2026-11-04.md` | Afirmaba `synchronize: true`, ausencia de migraciones, sin roles, sin módulos/API/UI de Calidad/Usuarios y PDF frontend. | Se marcó histórico; los documentos vigentes describen `synchronize: false`, migraciones, guards/roles, Calidad/Usuarios y render Playwright. |
| Backend `esquema-y-migraciones.md` anterior | Afirmaba que el primer certificado posterior comenzaría en `55388`. | Se documentó la cadena posterior de reset/expansión y el resultado `001` para base limpia; estado de DB real queda no verificado. |
| Backend `arquitectura-y-stack.md` anterior | Decía “guardas globales de autenticación y roles” sin aclarar el mecanismo ni los perfiles. | Ahora enlaza a JWT global, `@Roles`, roles explícitos y excepciones públicas. |
| Backend `modulos.md` anterior | Delegaba detalles al análisis fechado antiguo y decía que Calidad estaba en evolución. | Ahora es fuente funcional canónica con tabla de tipos/prefijos, estado de Calidad/PDF y límites. |
| Frontend `modulos.md` anterior | Describía Calidad como en desarrollo y omitía Usuarios/Configuración. | Se agregaron rutas y funciones existentes, con aclaración de que código no demuestra despliegue. |
| Frontend `integracion-y-stack.md` anterior | No documentaba bearer JWT, ruta de login fija ni flujo de PDF oficial. | Se documentaron interceptor, URL de login, rutas internas y secreto del render. |
| Enlaces de integración entre repositorios | Tres referencias relativas desde arquitectura/configuración apuntaban a ubicaciones inexistentes. | Se corrigió el nivel relativo y se validaron los enlaces Markdown entre ambos árboles de documentación. |
| Índices de ambos repos | Mezclaban documentos fechados e históricos con vigentes. | Se separaron secciones vigentes/históricas y se corrigieron enlaces al sustituto. |

## 4. Hallazgos UI/UX

| Criterio | Hallazgo | Severidad | Evidencia | Recomendación |
|---|---|---|---|---|
| Arquitectura de información | Sidebar agrupa Comercial, Logística, Planta, Calidad, Usuarios y Configuración; páginas existen para las rutas funcionales. | Baja | `frontend_sterinova/src/lib/navigation.ts`, `src/components/Sidebar.tsx`, `src/app/(erp)/` | Mantener navegación y páginas sincronizadas al añadir módulos. |
| Consistencia | Hay patrones locales de tablas, formularios, alertas y diálogos, sin estado compartido uniforme en todos los módulos. | Media | páginas y componentes de `src/app/(erp)/` | Consolidar estados accesibles reutilizables al cambiar interfaz. |
| Accesibilidad | Labels y roles ARIA aparecen en flujos inspeccionados; gestión de foco de diálogos, contraste y teclado no se verificaron completamente. | Media | `usuarios/UserDialogs.tsx`, `calidad/revisar/[ciclo_id]/page.tsx`, formularios de ciclo/cotización | Probar con teclado/lector de pantalla y medir contraste en navegador. |
| Estados y feedback | Algunos flujos muestran carga/error/éxito y deshabilitan acciones durante guardado; cobertura no uniforme. | Media | páginas de Calidad, Planta, Usuarios y configuración | Revisar cada pantalla para estados vacío/carga/error/éxito/sesión. |
| Flujos críticos | Login usa URL local fija; cotización a PDF, logística/planta y Calidad/certificado están representados en páginas. | Media | `src/app/login/page.tsx`, `src/app/(erp)/`, `src/lib/api.ts` | Probar recorrido integrado en entorno y corregir URL configurable del login. |
| Correspondencia UI–API | Backend enumera 7 tipos de cotización; selector ofrece 5. Visibilidad por rol en frontend complementa, pero no reemplaza, guardas backend. | Alta | backend `tipo-servicio.enum.ts`; frontend `cotizacion-types.ts`, `navigation.ts`; guards backend | Acordar disponibilidad de los dos tipos omitidos y mantener tipos/permisos alineados. |
| Dashboard | Cuatro contadores son valores estáticos. | Media | `frontend_sterinova/src/app/(erp)/page.tsx` | Identificar métricas reales antes de presentarlas como datos actuales. |
| PDF | Playwright backend renderiza componentes React frontend; assets locales y rutas internas están declarados. No se hizo aceptación visual contra Word. | Media | `backend_sterinova/src/pdf/pdf-generator.service.ts`, `frontend_sterinova/src/components/pdf/` | Comparar visualmente con formatos aprobados y registrar versión/aceptación. |

La revisión UI/UX fue estática; no se ejecutaron páginas ni se midió accesibilidad visual. El detalle está en los documentos UI/UX del frontend.

## 5. Pendientes no verificables

| Pendiente | Motivo |
|---|---|
| Migraciones aplicadas y migraciones pendientes por ambiente | Requiere conectar a cada instancia MariaDB y ejecutar `npm run migration:show`; no se consultaron valores `.env` ni bases remotas. |
| Valor actual de `secuencias_consecutivos`, certificados emitidos y posibilidad de emitir el siguiente número | Depende de datos reales y estado aplicado de migraciones. La conclusión `001` aplica a una base limpia que completa la secuencia actual, no a cualquier base existente. |
| Compatibilidad del esquema real con el baseline/migraciones | Requiere revisar la base objetivo y respaldos antes de cualquier DDL. |
| Configuración efectiva de secretos, CORS, URL frontend, almacenamiento PDF y persistencia de archivos en despliegue | Los archivos de entorno no se inspeccionaron y no se revisaron despliegues. |
| Aceptación visual y correspondencia final de PDFs frente a los formatos Word | No se renderizaron páginas ni se cotejaron archivos visualmente durante esta auditoría. |
| Resultado/cobertura real de pruebas | Hay specs en backend y pruebas frontend, pero no se ejecutaron. |
| Validación funcional/regulatoria del proceso y vigencia de los formatos Word | Requiere criterio del equipo y verificación operativa/documental fuera del código. |

## 6. Cambios por archivo

| Archivo | Acción |
|---|---|
| `backend_sterinova/docs/README.md` | ACTUALIZADO: índice, estados y enlaces. |
| `backend_sterinova/docs/arquitectura/arquitectura-y-stack.md` | ACTUALIZADO: arquitectura y seguridad. |
| `backend_sterinova/docs/base-de-datos/esquema-y-migraciones.md` | ACTUALIZADO: entidades, migraciones, secuencia, inmutabilidad. |
| `backend_sterinova/docs/manuales/configuracion-local.md` | ACTUALIZADO: variables, migraciones, bootstrap y PDF. |
| `backend_sterinova/docs/estado-proyecto/modulos.md` | ACTUALIZADO: módulos canónicos, matriz de cotización y pendientes. |
| `backend_sterinova/docs/estado-proyecto/historico/analisis-estado-2026-11-04.md` | MOVIDO y MARCADO HISTÓRICO: enlazado a documentos vigentes; contenido preservado. |
| `backend_sterinova/docs/estado-proyecto/auditoria-docs-2026-11-06.md` | CREADO: informe de auditoría. |
| `backend_sterinova/docs/arquitectura/api-y-contratos.md`, `base-de-datos/respaldos-y-operacion.md`, `manuales/despliegue.md` | CREADOS: inventario de API y límites operativos. |
| `backend_sterinova/docs/calidad-y-pruebas/*.md`, `ui-ux/correspondencia-ui-api.md` | CREADOS: inventario de pruebas, invariantes y cotejo UI–API. |
| `frontend_sterinova/docs/README.md` | ACTUALIZADO: secciones vigentes/históricas, enlace al mapa canónico de cotizaciones y al informe de auditoría. |
| `frontend_sterinova/docs/arquitectura/integracion-y-stack.md` | ACTUALIZADO: rutas, API, sesión, PDF y assets. |
| `frontend_sterinova/docs/estado-proyecto/modulos.md` | ACTUALIZADO: rutas presentes, acciones de PDF, navegación y discrepancia de tipos. |
| `frontend_sterinova/docs/manuales/desarrollo-local.md` | ACTUALIZADO: URL fija del login y configuración PDF. |
| `frontend_sterinova/docs/arquitectura/navegacion-y-permisos.md`, `ui-ux/*.md`, `calidad-y-pruebas/pruebas-frontend.md` | CREADOS: navegación, accesibilidad, flujos y pruebas. |
| Ambos `docs/README.md` y documentos de contexto/históricos | ACTUALIZADOS con cabeceras de estado, alcance y reemplazo donde aplica. |
| Análisis histórico del 3 de noviembre y 5 Word de ejemplo | SIN CAMBIOS: preservados como antecedentes/formatos de referencia. |

Las modificaciones en documentación del backend y frontend que ya estaban presentes al iniciar esta sesión se conservaron y cotejaron; no se atribuye su autoría a esta auditoría. El archivo de análisis del 4 de noviembre ya figuraba como movido en el estado local y se preservó en su ubicación histórica.

No se modificó código de aplicación ni se borraron documentos durante esta sesión.

## 7. Riesgos abiertos

- No hay evidencia adjunta ni firma digital del aprobador/cliente en las entidades revisadas; el sello gráfico no la sustituye.
- El selector UI omite dos tipos que la API permite (`FARMACEUTICO`, `FABRICANTE`), lo que limita su creación desde la interfaz.
- El dashboard muestra cifras codificadas, que no deben interpretarse como indicadores actuales.
- No se comprobó que `AddPdfRendererVersion` u otras migraciones estén aplicadas en las bases destino; desplegar emisión PDF requiere versión de esquema compatible.
- PDFs en el backend se guardan en filesystem local por defecto; disponibilidad, copia de seguridad y persistencia entre instancias deben confirmarse en el despliegue.
- El login frontend usa URL local fija aunque el cliente API sí lee `NEXT_PUBLIC_API_URL`; despliegues con API en otro host deben considerar esta diferencia.
- No se encontró rate limiting ni configuración central de métricas/trazas/logs estructurados en el código inspeccionado; no se descarta instrumentación externa al repositorio.
- La auditoría no certifica que guardas, secretos, CORS, archivos PDF ni datos estén configurados correctamente en producción.

## 8. Próximos pasos recomendados

1. Ejecutar `npm run migration:show` con configuración de cada ambiente y archivar el resultado antes de ejecutar migraciones.
2. Confirmar con el responsable de base de datos el consecutivo vigente y conciliar el valor antes de emitir certificados en una instalación con datos.
3. Alinear selector frontend y tipos de backend para `FARMACEUTICO` y `FABRICANTE`, si deben estar disponibles para usuarios.
4. Verificar configuración de URL de login, secreto de render, CORS y almacenamiento compartido/respaldado antes de despliegue.
5. Validar visualmente PDFs contra formatos aprobados y documentar esa aceptación por versión de formato.
6. Si se requieren evidencias o firmas, definir e implementar el flujo y modelo; la documentación actual no los presenta como existentes.
7. Actualizar estos documentos en la misma revisión que cambie rutas, migraciones, permisos o contratos de PDF.

## 9. Checklist de calidad documental

- [x] Los documentos Markdown tienen clasificación/estado explícito; los históricos señalan reemplazo.
- [x] Históricos y referencias están separados de vigentes en índices.
- [x] Los enlaces Markdown relativos se validaron dentro de ambos repositorios.
- [x] Existe fuente canónica por tema y referencias cruzadas backend–frontend.
- [x] Las afirmaciones de implementación incluyen evidencia de ruta/símbolo o se marcan como no verificables.
- [x] Los límites de auditoría están declarados; no se leyeron secretos ni `.env`.
- [x] Se documentaron pruebas disponibles sin ejecutarlas y la limitación de cobertura conocida.
- [x] Correspondencia backend–frontend y hallazgos UI/UX están documentados.
- [ ] Aceptación visual de PDFs, medición de contraste, teclado y lector de pantalla: pendiente de verificación en navegador.
- [ ] Estado de migraciones, respaldos, CORS productivo, secretos y storage: pendiente de verificación por responsables de entorno.

## 10. Atribución de cambios locales

La línea base siguiente se reconstruye del `git status --short` capturado al iniciar la auditoría de documentación en esta sesión. Los últimos commits visibles entonces fueron `e6a6bd50f314dbf1424c4ddd5701c4a5dfb8ba1c` (backend) y `17d786a494b7c30efd8611852f75d7bc303352b7` (frontend), ambos del 4 de noviembre de 2026. No hubo commit intermedio que aisle cada edición. Por eso la atribución es por archivo/estado inicial y no por línea.

| Archivo | Estado al iniciar | Cambio atribuible a auditoría/cierre | Cambio preexistente | Nota |
|---|---|---|---|---|
| Backend `docs/README.md` | `M` | Índice, clasificación, fuentes y enlaces completados durante auditoría y cierre. | Sí; ya estaba modificado. | No se puede separar cada hunk preexistente sin snapshot/diff inicial. |
| Backend `docs/arquitectura/arquitectura-y-stack.md` | `M` | Verificación de seguridad y referencia canónica ampliadas. | Sí; ya estaba modificado. | Atribución disponible solo por archivo. |
| Backend `docs/arquitectura/api-y-contratos.md` | No existía | Creado durante auditoría; cabecera y referencia de contratos ajustadas en cierre. | No. | Nuevo documento de auditoría. |
| Backend `docs/base-de-datos/esquema-y-migraciones.md` | `M` | Entidades/migraciones cotejadas y fuente canónica afirmada. | Sí; ya estaba modificado. | La edición previa no tiene commit intermedio. |
| Backend `docs/base-de-datos/respaldos-y-operacion.md` | No existía | Creado durante auditoría y enlazado a esquema/despliegue en cierre. | No. | Documento de referencia operativa. |
| Backend `docs/calidad-y-pruebas/calidad-de-datos.md` | No existía | Creado durante auditoría; aviso de fuente canónica añadido en cierre. | No. | Documento de invariantes. |
| Backend `docs/calidad-y-pruebas/pruebas.md` | No existía | Creado durante auditoría y ampliado en cierre como inventario cross-repo. | No. | No se ejecutaron pruebas. |
| Backend `docs/estado-proyecto/auditoria-docs-2026-11-06.md` | `??` | Documento existente ampliado durante auditoría; UI/UX, checklist y atribución incorporados en fases posteriores. | El archivo ya existía sin seguimiento Git al iniciar. | Autoría/contenido inicial exacto **NO VERIFICABLE** sin historial. |
| Backend `docs/estado-proyecto/contexto-producto.md` | Sin cambios | Cabecera de estado y alcance añadida durante auditoría. | No había cambios Git iniciales. | El cuerpo de contexto se preservó. |
| Backend `docs/estado-proyecto/modulos.md` | `M` | Fuente funcional revisada; tipo/prefijo y PDF declarados canónicos. | Sí; ya estaba modificado. | No hay diff inicial preservado. |
| Backend `docs/estado-proyecto/revision-calidad-documental.md` | No existía | Creado durante cierre documental. | No. | Registra canon, clasificación y enlaces. |
| Backend `docs/estado-proyecto/resumen-cierre-auditoria-2026-11-06.md` | No existía | Creado durante cierre documental. | No. | Resumen ejecutivo; responsables quedan pendientes. |
| Backend `docs/estado-proyecto/analisis-estado-2026-11-04.md` | `D` | No se borró en esta auditoría; conserva el antecedente en carpeta histórica. | El movimiento ya estaba reflejado al inicio. | El estado `D` original y el nuevo path sin seguimiento aparecieron juntos. |
| Backend `docs/estado-proyecto/historico/analisis-estado-2026-11-04.md` | `??` | Cabecera histórica y vínculos de reemplazo revisados. | El archivo en esta ubicación ya existía al inicio. | La clasificación/movimiento inicial es preexistente. |
| Backend `docs/estado-proyecto/historico/analisis-estado-2026-11-03.md` | `M` | Aviso histórico y sustitución explícita revisados. | Sí; ya estaba modificado. | Contenido histórico preservado. |
| Backend `docs/manuales/configuracion-local.md` | `M` | Variables y arranque cotejados; metadatos normalizados. | Sí; ya estaba modificado. | Secretos no leídos. |
| Backend `docs/manuales/despliegue.md` | No existía | Creado durante auditoría y enlazado desde el índice. | No. | Describe configuración esperada, no entorno efectivo. |
| Backend `docs/ui-ux/correspondencia-ui-api.md` | No existía | Creado durante auditoría y señalado como matriz de diferencias. | No. | Fuentes canónicas enlazadas en cierre. |
| Backend `docs/calidad-y-pruebas/checklist-verificacion-operativa.md` | No existía | Creado durante cierre documental. | No. | Es un plan; no fue ejecutado. |
| Frontend `docs/README.md` | `M` | Índice y referencias cruzadas ampliados durante auditoría y cierre. | Sí; ya estaba modificado. | No se separan hunks previos línea a línea. |
| Frontend `docs/arquitectura/integracion-y-stack.md` | `M` | Sesión/PDF documentados y fuentes canónicas añadidas. | Sí; ya estaba modificado. | Atribución disponible por archivo. |
| Frontend `docs/arquitectura/navegacion-y-permisos.md` | No existía | Creado durante auditoría; lista de rutas secundaria reducida en cierre. | No. | Visibilidad no se presenta como autorización. |
| Frontend `docs/calidad-y-pruebas/pruebas-frontend.md` | No existía | Creado durante auditoría y enlazado a inventario general en cierre. | No. | No se ejecutaron archivos `.mjs`. |
| Frontend `docs/estado-proyecto/contexto-producto.md` | Sin cambios | Cabecera de estado y alcance añadida durante auditoría. | No había cambios Git iniciales. | Cuerpo preservado. |
| Frontend `docs/estado-proyecto/modulos.md` | `M` | Rutas cotejadas; avisos para tipos/PDF agregados. | Sí; ya estaba modificado. | Sin snapshot inicial de hunks. |
| Frontend `docs/estado-proyecto/historico/diseno-base-de-datos-inicial.md` | Sin cambios | Metadatos históricos y enlace a sustituto añadidos durante auditoría. | No había cambios Git iniciales. | Propuesta original preservada. |
| Frontend `docs/manuales/desarrollo-local.md` | `M` | URL fija de login y requisitos PDF documentados. | Sí; ya estaba modificado. | Secretos no leídos. |
| Frontend `docs/ui-ux/accesibilidad.md` | No existía | Creado durante auditoría; cabecera y canonicidad ajustadas en cierre. | No. | Revisión estática, no evaluación WCAG. |
| Frontend `docs/ui-ux/flujos-criticos.md` | No existía | Creado durante auditoría y enlazado a fuentes canónicas en cierre. | No. | Flujos no ejecutados. |
| Frontend `docs/ui-ux/principios-y-patrones.md` | No existía | Creado durante auditoría y referido a accesibilidad/flujos canónicos. | No. | Referencia estática. |

> **NO VERIFICABLE:** la procedencia exacta de las líneas ya modificadas antes de comenzar y del borrador del informe que ya estaba sin seguimiento Git. Git conserva solo los últimos commits base; el estado inicial de archivos se obtuvo del `git status` de la conversación. Se preservaron los cambios preexistentes y no se eliminaron históricos.
