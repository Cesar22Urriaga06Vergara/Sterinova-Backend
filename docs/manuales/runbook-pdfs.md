# Runbook de PDFs oficiales

## Flujo de emisión

1. Cotizaciones y certificados preparan `snapshot_datos` con los valores y la versión de formato usados para emitir.
2. El backend firma ese snapshot con `PDF_RENDER_SECRET` y abre la ruta interna correspondiente del frontend (`/internal/pdf/cotizacion` o `/internal/pdf/certificado`) usando Playwright.
3. Playwright espera la respuesta, el documento, las fuentes y las imágenes, aplica medio de impresión y produce los bytes PDF. La generación completa tiene un límite de 15 segundos (`PDF_RENDER_TIMEOUT_MS` permite ajustarlo).
4. `PdfGeneratorService` calcula SHA-256 de esos bytes y los entrega a `StorageService`. La implementación local guarda en `storage/pdfs` (o en `PDF_STORAGE_PATH`) mediante archivo temporal y renombrado atómico.
5. En la transacción del documento se guardan `pdf_url`, `hash_pdf`, `pdf_renderer_version` y el snapshot. Si el render falla o excede el límite, se devuelve 503 y no se guarda el registro de emisión.
6. Al descargar, el backend lee los bytes a través de `StorageService`, comprueba el SHA-256 contra `hash_pdf` y responde con esos mismos bytes. Una discrepancia no se entrega como si fuera un documento válido.

`StorageService` es el límite para el proveedor: un adaptador de S3 u otro object store debe implementar `saveFile`, `getFile` y `deleteFile`, y registrarse como proveedor de `StorageService` en `PdfModule`. Las claves son privadas y relativas, por ejemplo `certificados/001-react-playwright-v1.pdf`.

## Diagnóstico de integridad

Obtenga `pdf_url` y `hash_pdf` del registro correspondiente, descargue el objeto de almacenamiento por el canal operativo autorizado y calcule el hash:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath .\certificado.pdf
```

Compare `Hash` con `hash_pdf` (64 caracteres hexadecimales). Para verificar lo que recibe el usuario, descargue por `GET /certificados/:id/descargar` o `GET /cotizaciones/:id/descargar` y calcule el hash sobre el archivo descargado. El servicio también hace esta comparación antes de responder.

No copie snapshots, tokens públicos ni archivos PDF a tickets o canales públicos. `snapshot_datos` puede contener datos personales/comerciales y credenciales de validación del certificado.

## Recuperación de un PDF huérfano

Un PDF huérfano puede ser un objeto ausente o alterado mientras el registro y su snapshot siguen en la base de datos. La descarga oficial detecta el objeto ausente o un hash incorrecto y regenera el documento desde `snapshot_datos`; una versión de render antigua también se reconstruye desde ese snapshot. Solicite de nuevo la descarga autenticada del registro para activar la recuperación y confirme que `pdf_url`, `hash_pdf` y `pdf_renderer_version` se actualizaron.

Si no hay snapshot, no reconstruya el documento con datos actuales: eso produciría un documento distinto al emitido. Marque el caso para revisión de Calidad y recupere el respaldo consistente del PDF o de la base de datos. Si la generación devuelve 503, revise disponibilidad del frontend interno, Chromium/Playwright, fuentes e imágenes; reintente cuando el servicio esté estable. La operación fallida no reemplaza la fila previa.

La recuperación requiere que el PDF esté emitido y que exista `snapshot_datos`. Proteja el acceso al endpoint de descarga y ejecute el procedimiento con una cuenta autorizada.
