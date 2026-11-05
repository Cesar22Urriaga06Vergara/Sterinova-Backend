import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium, type Browser } from 'playwright';
import { readPdfRenderToken } from './pdf-render-token.js';
import { PdfGeneratorService } from './pdf-generator.service.js';

vi.mock('playwright', () => ({ chromium: { launch: vi.fn() } }));

describe('PdfGeneratorService', () => {
  const originalEnvironment = {
    storage: process.env.PDF_STORAGE_PATH,
    baseUrl: process.env.PDF_RENDER_BASE_URL,
    secret: process.env.PDF_RENDER_SECRET,
  };

  afterEach(() => {
    vi.clearAllMocks();
    for (const [key, value] of Object.entries({
      PDF_STORAGE_PATH: originalEnvironment.storage,
      PDF_RENDER_BASE_URL: originalEnvironment.baseUrl,
      PDF_RENDER_SECRET: originalEnvironment.secret,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it('renders the encrypted snapshot from the frontend route and stores the PDF hash', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'sterinova-pdf-'));
    process.env.PDF_STORAGE_PATH = temporaryRoot;
    process.env.PDF_RENDER_BASE_URL = 'http://frontend.internal:3000';
    process.env.PDF_RENDER_SECRET = 'test-render-secret-containing-at-least-32-bytes';
    const pdfBuffer = Buffer.from('%PDF-1.7 fake rendered bytes');
    const page = {
      setExtraHTTPHeaders: vi.fn(),
      goto: vi.fn(async () => ({ ok: () => true, status: () => 200 })),
      waitForSelector: vi.fn(),
      evaluate: vi.fn(async () => undefined),
      emulateMedia: vi.fn(),
      pdf: vi.fn(async () => pdfBuffer),
      close: vi.fn(),
    };
    const browser = { newPage: vi.fn(async () => page), close: vi.fn() };
    vi.mocked(chromium.launch).mockResolvedValue(browser as unknown as Browser);
    const service = new PdfGeneratorService();
    const snapshot = {
      documento: { tipo: 'COTIZACION', consecutivo: 'COT-LAV-TEST' },
      formato: { codigo: 'R-CM-07-5', version: 4 },
    };

    try {
      const result = await service.generate(snapshot, 'cotizaciones/COT-LAV-TEST.pdf');
      const stored = await readFile(await service.getAbsolutePath(result.storageKey));

      expect(stored).toEqual(pdfBuffer);
      expect(result.hash).toBeDefined();
      expect(page.goto).toHaveBeenCalledWith(
        'http://frontend.internal:3000/internal/pdf/cotizacion',
        expect.objectContaining({ waitUntil: 'networkidle' }),
      );
      const token = page.setExtraHTTPHeaders.mock.calls[0][0]['x-pdf-render-token'];
      expect(readPdfRenderToken(token, 'cotizacion', process.env.PDF_RENDER_SECRET)).toEqual(snapshot);
      expect(page.waitForSelector).toHaveBeenCalledWith(
        '[data-pdf-document="cotizacion"]',
        expect.objectContaining({ state: 'visible' }),
      );
      expect(page.emulateMedia).toHaveBeenCalledWith({ media: 'print' });
      expect(page.pdf).toHaveBeenCalledWith(expect.objectContaining({
        format: 'Letter',
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      }));
    } finally {
      await service.remove('cotizaciones/COT-LAV-TEST.pdf');
      await service.onModuleDestroy();
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it('does not create a PDF file when the internal render route fails', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'sterinova-pdf-'));
    process.env.PDF_STORAGE_PATH = temporaryRoot;
    process.env.PDF_RENDER_BASE_URL = 'http://frontend.internal:3000';
    process.env.PDF_RENDER_SECRET = 'test-render-secret-containing-at-least-32-bytes';
    const page = {
      setExtraHTTPHeaders: vi.fn(),
      goto: vi.fn(async () => ({ ok: () => false, status: () => 404 })),
      close: vi.fn(),
    };
    vi.mocked(chromium.launch).mockResolvedValue({ newPage: vi.fn(async () => page), close: vi.fn() } as unknown as Browser);
    const service = new PdfGeneratorService();

    try {
      await expect(service.generate({ documento: { tipo: 'CERTIFICADO' } }, 'certificados/CERT-TEST.pdf'))
        .rejects.toThrow(/renderizado respondió 404/);
      await expect(readFile(path.join(temporaryRoot, 'certificados', 'CERT-TEST.pdf')))
        .rejects.toMatchObject({ code: 'ENOENT' });
    } finally {
      await service.onModuleDestroy();
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it('closes a page after errors and rejects invalid storage keys', async () => {
    const page = {
      setExtraHTTPHeaders: vi.fn(),
      goto: vi.fn(async () => ({ ok: () => false, status: () => 503 })),
      close: vi.fn(),
    };
    vi.mocked(chromium.launch).mockResolvedValue({ newPage: vi.fn(async () => page), close: vi.fn() } as unknown as Browser);
    process.env.PDF_RENDER_SECRET = 'test-render-secret-containing-at-least-32-bytes';
    const service = new PdfGeneratorService();

    await expect(service.generate({ documento: { tipo: 'COTIZACION' } }, '../bad.pdf'))
      .rejects.toThrow(/Clave de almacenamiento/);
    await service.onModuleDestroy();
  });
});
