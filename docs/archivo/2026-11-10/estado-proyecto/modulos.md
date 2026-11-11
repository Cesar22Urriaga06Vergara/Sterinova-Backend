> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Estado funcional y pendientes

> **Estado:** vigente.
> **Verificado contra:** código backend y frontend el 6 de noviembre de 2026.
> **Alcance:** capacidades visibles en API/UI y mapa funcional.
> **No cubre:** despliegue, datos productivos ni aceptación visual.
> **Fuente canónica de:** estado funcional, tipos/prefijos de cotización y comportamiento funcional del PDF.

## Módulos

| Área | Estado comprobado en código | Referencias |
|---|---|---|
| Acceso y usuarios | Login JWT; API y pantalla de administración de usuarios; control por rol y activación/cambio de contraseña. Bootstrap inicial por CLI. | `src/auth`, `src/users`; frontend `src/app/(erp)/usuarios`. |
| Comercial | CRUD de clientes, importación Excel, cotizaciones con cálculo en backend, previsualización, emisión y descarga de PDF. | `src/clientes`, `src/cotizaciones`; frontend `src/app/(erp)/comercial`. |
| Logística | Creación de órdenes desde cotizaciones aprobadas, consulta y cambio de estado. | `src/logistica`; frontend `src/app/(erp)/logistica`. |
| Planta | Consulta de órdenes en planta e historial de ciclos; alta de ciclo ligado a usuario y orden. | `src/planta`; frontend `src/app/(erp)/planta`. |
| Calidad | Lista y detalle de ciclos pendientes; aprobación con revalidación de contraseña, emisión de certificado y PDF; rechazo con motivo. | `src/calidad`, `src/certificados`; frontend `src/app/(erp)/calidad`. |
| Certificados | Numeración transaccional, snapshot/versionado, PDF oficial, hash, token público de validación y QR en el PDF. | `src/certificados`, `src/documentos`, frontend `src/components/pdf/CertificadoPDF.tsx`. |
| Formatos y sellos | API y UI para administrar formatos/versiones y sellos de certificación; auditoría selectiva de cambios documentales. | `src/formatos-documentales`, `src/sellos`, `src/auditoria`; frontend `src/app/(erp)/configuracion`. |

La existencia de interfaz y API no demuestra que las rutas estén desplegadas ni que el proceso haya sido validado en operación.

## Tipos de cotización, prefijos y disponibilidad

El backend enumera siete tipos (`src/cotizaciones/entities/tipo-servicio.enum.ts`). El selector y tipos de la UI ofrecen cinco (`frontend_sterinova/src/lib/cotizacion-types.ts`). La API acepta los siete, aunque `FARMACEUTICO` y `FABRICANTE` no están disponibles en el selector de nueva cotización.

| Tipo | Prefijo consecutivo en backend | Selector UI | Plantilla Word de referencia |
|---|---|---:|---|
| `INDUSTRIAL_ETO` | `COT-IND-` | Sí | R-CM-07-1 |
| `INSTITUCIONAL_ETO` | `COT-CME-` | Sí | R-CM-07-2 |
| `INSTITUCIONAL_VAPOR` | `COT-CME-` | Sí | R-CM-07-3 |
| `INSUMOS` | `COT-CMI-` | Sí | R-CM-07-4 |
| `LAVANDERIA` | `COT-LAV-` | Sí | R-CM-07-5 |
| `FARMACEUTICO` | `COT-CEMFA-` | No | Sin archivo identificado en los cinco formatos listados |
| `FABRICANTE` | `COT-CMED-` | No | Sin archivo identificado en los cinco formatos listados |

Los prefijos usan secuencias en `secuencias_consecutivos`; para cotizaciones el servicio aplica bloqueo y actualiza el contador. La disponibilidad de plantillas documentales operativas se resuelve en código por formato/configuración y cliente; los documentos Word del repositorio son referencias y no prueban asignación operativa.

## Calidad y certificado 55388

Calidad **sí tiene API y UI**. Aprobar requiere confirmar la contraseña del usuario autenticado con permiso Admin/Calidad. La aprobación transaccional cambia el ciclo a `APROBADO`, guarda revisor/fecha, crea certificado, genera PDF y devuelve el documento. Rechazar cambia a `RECHAZADO` y requiere motivo. El certificado tiene token público aleatorio; `GET /certificados/validar/:token` es la ruta pública de verificación. El PDF renderiza un QR con dicha URL.

La secuencia vigente del código **no da por hecho el consecutivo 55388**. Las migraciones posteriores reinician el contador a cero si no hay certificados y el servicio rellena a tres caracteres: una base limpia migrada emite `001`. La secuencia previa `55387 → 55388` en `AddQualityCertificates` es histórica y está supersedida por `ResetCertificateSequenceToThreeDigits` y `ExtendDocumentSequences`. El estado de cualquier base desplegada queda pendiente de consultar.

No se encontraron entidades de evidencias adjuntas ni firma digital del cliente/aprobador. Hay sello de certificación como recurso gráfico, que no equivale a firma digital. La tabla `auditoria` y su servicio existen, con usos visibles en emisión de cotización y gestión de formatos; no registran automáticamente cada operación del sistema.

## PDF oficial y documentos

El backend usa `PdfGeneratorService` y Playwright para abrir páginas internas de render del frontend (`/internal/pdf/cotizacion` y `/internal/pdf/certificado`). Los componentes React de cotización y certificado se renderizan para emisión/descarga oficial; `html2pdf.js` no participa en ese flujo aunque figure como dependencia del frontend. La UI solicita `POST /cotizaciones/:id/emitir` y descarga por `GET /cotizaciones/:id/descargar`; la emisión oficial de cotización está restringida a Admin. Calidad emite el certificado al aprobar y se descarga con `GET /certificados/:id/descargar`.

Las entidades guardan `pdf_url`, `hash_pdf` SHA-256 y `pdf_renderer_version`; el snapshot permite reconstruir ciertos PDFs antiguos. `AddPdfRendererVersion1793813500000` agrega el campo de versión y actualiza el trigger de inmutabilidad. El estado aplicado de esa migración en una instancia no se verificó.

Variables de entorno: `PDF_RENDER_SECRET` (mínimo 32 caracteres, privado y compartido con frontend), `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL`, y opcionalmente `PDF_STORAGE_PATH`. El render local usa frontend en `http://localhost:3000`; el almacenamiento predeterminado queda bajo `storage/pdfs`. El QR es parte del PDF del certificado y apunta al endpoint público de validación por token.

## Pendientes y límites verificados

- El selector de cotizaciones UI no incluye `FARMACEUTICO` ni `FABRICANTE`, aunque la API/backend los soporta.
- Los contadores del dashboard frontend están codificados como valores fijos; no son métricas de API.
- No hay evidencia adjunta ni firma digital en el modelo/flujo inspeccionado.
- No se verificó visualmente la salida PDF contra las plantillas Word ni se ejecutaron pruebas durante esta auditoría.
- No se consultaron estado de migraciones, configuración real o integridad de datos de una base desplegada.

Para hallazgos detallados y clasificación documental, consulta la [auditoría del 6 de noviembre de 2026](auditoria-docs-2026-11-06.md). El análisis del 4 de noviembre es una [fotografía histórica](historico/analisis-estado-2026-11-04.md), no fuente vigente.
