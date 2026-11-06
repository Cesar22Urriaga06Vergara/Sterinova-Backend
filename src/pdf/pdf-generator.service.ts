import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { chromium, type Browser, type Page } from 'playwright';
import { createHash } from 'node:crypto';
import { createPdfRenderToken, type PdfRenderDocumentType } from './pdf-render-token.js';
import { StorageService } from '../common/services/storage.service.js';

type Snapshot = Record<string, any>;

export const PDF_RENDERER_VERSION = 'react-playwright-v1';
const PDF_RENDER_TIMEOUT_MS = 15_000;

@Injectable()
export class PdfGeneratorService implements OnModuleDestroy {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private browserPromise?: Promise<Browser>;

  constructor(@Inject(StorageService) private readonly storage: StorageService) {}

  private async getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = chromium.launch({ headless: true }).catch((error: unknown) => {
        this.browserPromise = undefined;
        throw error;
      });
    }
    return this.browserPromise;
  }

  async healthCheck(): Promise<void> {
    const browser = await this.getBrowser();
    if (!browser.isConnected()) throw new Error('PDF renderer browser is disconnected');
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
    if (!documentType) throw new Error('Tipo de documento PDF inválido');
    const baseUrl = process.env.PDF_RENDER_BASE_URL ?? process.env.FRONTEND_INTERNAL_URL ?? 'http://localhost:3000';
    return { type: documentType, url: new URL(`/internal/pdf/${documentType}`, baseUrl).toString() };
  }

  async generate(snapshot: Snapshot, storageKey: string): Promise<{ storageKey: string; hash: string }> {
    if (!/^(cotizaciones|certificados)\/[\w.-]+\.pdf$/.test(storageKey)) {
      throw new Error('Clave de almacenamiento PDF inválida');
    }
    const renderPage = this.renderPage(snapshot);
    const token = createPdfRenderToken(snapshot, renderPage.type, process.env.PDF_RENDER_SECRET ?? '');
    let page: Page | undefined;
    let timedOut = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const renderAndStore = async () => {
      const browser = await this.getBrowser();
      page = await browser.newPage({
        locale: 'es-CO', timezoneId: 'America/Bogota', viewport: { width: 816, height: 1056 },
      });
      await page.setExtraHTTPHeaders({ 'x-pdf-render-token': token });
      const response = await page.goto(renderPage.url, { waitUntil: 'networkidle', timeout: PDF_RENDER_TIMEOUT_MS });
      if (!response?.ok()) throw new Error(`render HTTP ${response?.status() ?? 'sin respuesta'}`);
      await page.waitForSelector(`[data-pdf-document="${renderPage.type}"]`, {
        state: 'visible', timeout: PDF_RENDER_TIMEOUT_MS,
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, async (image) => {
          if (!image.complete || image.naturalWidth === 0) await image.decode();
          if (image.naturalWidth === 0 || image.naturalHeight === 0) throw new Error('Imagen PDF no disponible');
        }));
      });
      await page.emulateMedia({ media: 'print' });
      const pdf = await page.pdf({
        format: 'Letter', printBackground: true, preferCSSPageSize: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      });
      if (timedOut) throw new Error('PDF render deadline exceeded');
      await this.storage.saveFile(pdf, storageKey);
      return { storageKey, hash: createHash('sha256').update(pdf).digest('hex') };
    };

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        const configuredTimeout = Number(process.env.PDF_RENDER_TIMEOUT_MS);
        const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0
          ? configuredTimeout
          : PDF_RENDER_TIMEOUT_MS;
        timeout = setTimeout(() => {
          timedOut = true;
          void Promise.resolve(page?.close()).catch(() => undefined);
          reject(new Error('PDF render deadline exceeded'));
        }, timeoutMs);
      });
      return await Promise.race([renderAndStore(), timeoutPromise]);
    } catch (error) {
      this.logger.warn(timedOut ? 'PDF rendering exceeded its deadline' : 'PDF rendering failed');
      void Promise.resolve(page?.close()).catch(() => undefined);
      throw new ServiceUnavailableException(
        timedOut
          ? 'La generación del PDF excedió el tiempo límite. Intente nuevamente.'
          : 'No fue posible generar el PDF. Intente nuevamente.',
      );
    } finally {
      if (timeout) clearTimeout(timeout);
      void Promise.resolve(page?.close()).catch(() => undefined);
    }
  }

  async remove(storageKey: string): Promise<void> {
    if (!/^(cotizaciones|certificados)\/[\w.-]+\.pdf$/.test(storageKey)) return;
    await this.storage.deleteFile(storageKey);
  }

  async getFile(storageKey: string, expectedHash?: string): Promise<Buffer> {
    const file = await this.storage.getFile(storageKey);
    if (expectedHash) {
      const actualHash = createHash('sha256').update(file).digest('hex');
      if (actualHash !== expectedHash) {
        this.logger.error('Stored PDF integrity check failed');
        throw new ServiceUnavailableException('El PDF almacenado no superó la verificación de integridad.');
      }
    }
    return file;
  }
}
