# ADR-002: Renderizado de PDFs con Playwright y Next.js

- **Estado:** Aceptado (implementado en el repositorio)
- **Fecha:** 2026-11-06

## Contexto

Las cotizaciones y los certificados oficiales necesitan una salida PDF reproducible basada en el snapshot de datos y en la versión del formato documental. El backend ya delega el layout y los recursos visuales a páginas internas del frontend Next.js.

## Decisión

El backend usa Playwright con Chromium headless para abrir las rutas internas de renderizado del frontend (`/internal/pdf/cotizacion` y `/internal/pdf/certificado`), espera fuentes e imágenes y genera PDF tamaño Letter con estilos de impresión. El acceso de render se valida mediante un token firmado asociado al contenido. El backend guarda el PDF con una clave interna y registra su SHA-256 y versión del renderer para validar integridad o regenerar desde el snapshot persistido.

## Consecuencias

- El servicio necesita Chromium instalado y conectividad desde backend a `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL`.
- Los cambios de diseño PDF se realizan en el frontend; cambios de URL, token, renderer o formato requieren actualizar las pruebas y la documentación operativa.
- Readiness comprueba la disponibilidad del navegador. Un frontend inaccesible o un secreto de render desalineado impide emitir PDFs.
- No se debe considerar el hash como prueba de autoría ni los sellos visuales como firmas digitales.

## Evidencia en el repositorio

- `src/pdf/pdf-generator.service.ts` implementa Chromium, carga de rutas internas, espera de recursos, PDF, timeout, almacenamiento y hash.
- `src/pdf/pdf-render-token.ts` crea y valida el token de render.
- `docs/manuales/runbook-pdfs.md` describe diagnóstico y operación.
