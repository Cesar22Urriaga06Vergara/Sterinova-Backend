import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { chromium, type Browser, type Page } from 'playwright';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPdfRenderToken, type PdfRenderDocumentType } from './pdf-render-token.js';

type Snapshot = Record<string, any>;

export const PDF_RENDERER_VERSION = 'react-playwright-v1';

@Injectable()
export class PdfGeneratorService implements OnModuleDestroy {
  private readonly applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  private readonly storagePath = path.resolve(process.env.PDF_STORAGE_PATH ?? path.join(this.applicationRoot, 'storage', 'pdfs'));
  private browserPromise?: Promise<Browser>;

  private async getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = chromium.launch({ headless: true }).catch((error: unknown) => {
        this.browserPromise = undefined;
        throw error;
      });
    }
    return this.browserPromise;
  }

  async onModuleDestroy(): Promise<void> {
    const browser = await this.browserPromise?.catch(() => undefined);
    await browser?.close();
    this.browserPromise = undefined;
  }

  private renderPage(snapshot: Snapshot): { type: PdfRenderDocumentType; url: string } {
    const documentType = snapshot.documento?.tipo === 'COTIZACION'
      ? 'cotizacion'
      : snapshot.documento?.tipo === 'CERTIFICADO'
        ? 'certificado'
        : null;
    if (!documentType) throw new Error('Tipo de documento PDF invalido');
    const baseUrl = process.env.PDF_RENDER_BASE_URL ?? process.env.FRONTEND_INTERNAL_URL ?? 'http://localhost:3000';
    return {
      type: documentType,
      url: new URL(`/internal/pdf/${documentType}`, baseUrl).toString(),
    };
  }

  async generate(snapshot: Snapshot, storageKey: string): Promise<{ storageKey: string; hash: string }> {
    if (!/^(cotizaciones|certificados)\/[\w.-]+\.pdf$/.test(storageKey)) throw new Error('Clave de almacenamiento PDF invalida');
    const secret = process.env.PDF_RENDER_SECRET ?? '';
    const renderPage = this.renderPage(snapshot);
    const token = createPdfRenderToken(snapshot, renderPage.type, secret);
    const browser = await this.getBrowser();
    let temporaryPath = '';
    let page: Page | undefined;
    try {
      page = await browser.newPage({
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        viewport: { width: 816, height: 1056 },
      });
      await page.setExtraHTTPHeaders({ 'x-pdf-render-token': token });
      const response = await page.goto(renderPage.url, { waitUntil: 'networkidle', timeout: 45_000 });
      if (!response?.ok()) {
        throw new Error(`La ruta interna de renderizado respondió ${response?.status() ?? 'sin respuesta'}`);
      }
      await page.waitForSelector(`[data-pdf-document="${renderPage.type}"]`, { state: 'visible', timeout: 15_000 });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, async (image) => {
          if (!image.complete || image.naturalWidth === 0) await image.decode();
          if (image.naturalWidth === 0 || image.naturalHeight === 0) {
            throw new Error(`Imagen PDF no disponible: ${image.currentSrc || image.src}`);
          }
        }));
      });
      await page.emulateMedia({ media: 'print' });
      const pdf = await page.pdf({
        format: 'Letter',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      });
      const hash = createHash('sha256').update(pdf).digest('hex');
      const finalPath = path.resolve(this.storagePath, storageKey);
      if (!finalPath.startsWith(`${this.storagePath}${path.sep}`)) throw new Error('Ruta PDF fuera del almacenamiento configurado');
      await mkdir(path.dirname(finalPath), { recursive: true });
      temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
      await writeFile(temporaryPath, pdf, { flag: 'wx' });
      await rename(temporaryPath, finalPath);
      return { storageKey, hash };
    } catch (error) {
      if (temporaryPath) await rm(temporaryPath, { force: true });
      throw error;
    } finally {
      await page?.close();
    }
  }

  async remove(storageKey: string): Promise<void> {
    if (!/^(cotizaciones|certificados)\/[\w.-]+\.pdf$/.test(storageKey)) return;
    await rm(path.resolve(this.storagePath, storageKey), { force: true });
  }

  async getAbsolutePath(storageKey: string): Promise<string> {
    if (!/^(cotizaciones|certificados)\/[\w.-]+\.pdf$/.test(storageKey)) throw new Error('Clave PDF invalida');
    const result = path.resolve(this.storagePath, storageKey);
    if (!result.startsWith(`${this.storagePath}${path.sep}`)) throw new Error('Ruta PDF fuera del almacenamiento configurado');
    await readFile(result);
    return result;
  }
}
