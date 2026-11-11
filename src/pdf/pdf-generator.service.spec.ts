import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chromium, type Browser } from 'playwright';
import { readPdfRenderToken } from './pdf-render-token.js';
import { PdfGeneratorService } from './pdf-generator.service.js';
import { LocalStorageService } from '../common/services/storage.service.js';

vi.mock('playwright', () => ({ chromium: { launch: vi.fn() } }));

describe('PdfGeneratorService', () => {
  it('refuses schema 2 snapshots when the renderer only implements the old contract', async () => {
    process.env.PDF_RENDER_SECRET='test-render-secret-containing-at-least-32-bytes';
    const page={setExtraHTTPHeaders:vi.fn(),goto:vi.fn(async()=>({ok:()=>true})),
      waitForSelector:vi.fn(async(selector:string)=>{if(selector.includes('data-pdf-schema-version'))throw new Error('incompatible renderer');}),
      evaluate:vi.fn(),emulateMedia:vi.fn(),pdf:vi.fn(async()=>Buffer.from('%PDF')),close:vi.fn()};
    vi.mocked(chromium.launch).mockResolvedValue({newPage:async()=>page} as unknown as Browser);
    const storage={saveFile:vi.fn()};
    const service=new PdfGeneratorService(storage as never,{} as never);
    await expect(service.generate({schema_version:2,documento:{tipo:'CERTIFICADO'}},'certificados/schema2.pdf')).rejects.toThrow();
    expect(page.pdf).not.toHaveBeenCalled();
    expect(storage.saveFile).not.toHaveBeenCalled();
  });

  it('renders logistic service documents from inline HTML without a frontend route', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'sterinova-pdf-logistica-'));
    process.env.PDF_STORAGE_PATH = temporaryRoot;
    process.env.PDF_RENDER_SECRET = 'test-render-secret-containing-at-least-32-bytes';
    const pdfBuffer = Buffer.from('%PDF-1.7 logistic rendered bytes');
    const page = {
      setExtraHTTPHeaders: vi.fn(),
      setContent: vi.fn(async () => undefined),
      goto: vi.fn(),
      waitForSelector: vi.fn(),
      evaluate: vi.fn(async () => undefined),
      emulateMedia: vi.fn(),
      pdf: vi.fn(async () => pdfBuffer),
      close: vi.fn(),
    };
    vi.mocked(chromium.launch).mockResolvedValue({ newPage: vi.fn(async () => page), close: vi.fn() } as unknown as Browser);
    const service = new PdfGeneratorService(new LocalStorageService());
    const snapshot = {
      documento: {
        tipo: 'ORDEN_SERVICIO',
        consecutivo: 'OS-2026-0001',
        fecha_programada: '2026-11-10',
      },
      cliente: { razon_social: 'ACME S.A.S.' },
      orden: {
        metodo_esterilizacion: 'ETO',
        conductor_asignado: 'Laura',
        vehiculo_placa: 'ABC123',
        observaciones: 'Entrega en horario de la tarde.',
      },
      materiales: [
        { descripcion: 'Bata', referencia: 'REF-01', lote: 'L-01', cantidad: 25 },
        { descripcion: 'Guantes', referencia: 'REF-02', lote: 'L-02', cantidad: 15 },
      ],
    };

    try {
      const result = await service.generate(snapshot, 'logistica/OS-2026-0001.pdf');
      expect(page.setContent).toHaveBeenCalledWith(
        expect.stringContaining('ORDEN DE SERVICIO'),
        expect.objectContaining({ waitUntil: 'load' }),
      );
      expect(page.setExtraHTTPHeaders).not.toHaveBeenCalled();
      expect(page.goto).not.toHaveBeenCalled();
      expect(result.storageKey).toBe('logistica/OS-2026-0001.pdf');
    } finally {
      await service.remove('logistica/OS-2026-0001.pdf');
      await service.onModuleDestroy();
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it.each(['orden_servicio', 'acta_servicio'] as const)(
    'builds dynamic %s tables for large and long material lists',
    async (type) => {
      const temporaryRoot = await mkdtemp(
        path.join(os.tmpdir(), 'sterinova-pdf-logistica-dynamic-'),
      );
      process.env.PDF_STORAGE_PATH = temporaryRoot;
      process.env.PDF_RENDER_SECRET =
        'test-render-secret-containing-at-least-32-bytes';
      const page = {
        setExtraHTTPHeaders: vi.fn(),
        setContent: vi.fn(async () => undefined),
        goto: vi.fn(),
        waitForSelector: vi.fn(),
        evaluate: vi.fn(async () => undefined),
        emulateMedia: vi.fn(),
        pdf: vi.fn(async () => Buffer.from('%PDF-1.7 logistic')),
        close: vi.fn(),
      };
      vi.mocked(chromium.launch).mockResolvedValue({
        newPage: vi.fn(async () => page),
        close: vi.fn(),
      } as unknown as Browser);
      const service = new PdfGeneratorService(
        new LocalStorageService(),
        {} as never,
      );
      const storageKeys: string[] = [];

      try {
        for (const count of [1, 15, 50, 101]) {
          const materials = Array.from({ length: count }, (_, index) => ({
            descripcion:
              `Material-${index + 1} & instrumental ` +
              'descripción extendida '.repeat(15),
            lote:
              index === 0
                ? `LOTE-${index + 1}-` + 'X'.repeat(90)
                : `LOTE-${index + 1}`,
            cantidad: index + 1,
            cotizacion_item_id: index + 1,
          }));
          const expectedSubtotal = materials.reduce(
            (sum, material) => sum + material.cantidad * 1000,
            0,
          );
          const expectedTax = Number((expectedSubtotal * 0.19).toFixed(2));
          const snapshot = {
            documento: {
              tipo: type === 'orden_servicio' ? 'ORDEN_SERVICIO' : 'ACTA_SERVICIO',
              consecutivo: `OS-2026-${count}`,
              fecha_programada: '2026-11-10',
            },
            cliente: {
              razon_social: 'Cliente de prueba S.A.S.',
              direccion: null,
              nit: null,
              telefono: null,
              email: null,
            },
            orden: {
              metodo_esterilizacion: 'ETO',
              observaciones: 'Observación extensa. '.repeat(100),
            },
            cotizacion: {
              tipo_servicio: 'INDUSTRIAL_ETO',
              subtotal: expectedSubtotal,
              iva: expectedTax,
              total: expectedSubtotal + expectedTax,
              items: materials.map((material, index) => ({
                id: index + 1,
                cantidad: material.cantidad,
                valor_unitario: 1000,
                valor_total: material.cantidad * 1000,
              })),
            },
            materiales: materials,
          };
          const storageKey = `logistica/OS-2026-${count}-${type}.pdf`;
          storageKeys.push(storageKey);

          await service.generate(snapshot, storageKey);

          const htmlCall =
            page.setContent.mock.calls[page.setContent.mock.calls.length - 1];
          const html = htmlCall?.[0] ?? '';
          expect(html).toContain(
            type === 'orden_servicio'
              ? 'ORDEN DE SERVICIO DE ESTERILIZACIÓN'
              : 'ACTA DE SERVICIO',
          );
          expect(html).toContain(
            type === 'orden_servicio' ? 'R-ES-02' : 'R-LG-04',
          );
          expect(html).toContain('Material-1 &amp; instrumental');
          expect(html).toContain('descripción extendida');
          expect(html.match(/<td class="description">/g)).toHaveLength(count);
          if (type === 'acta_servicio') {
            expect(html).toContain('<td class="lot">LOTE-1-');
            expect(html).toContain('overflow-wrap: anywhere');
            expect(html).not.toContain('10/11/2026');
            expect(html).not.toContain('Observación extensa.');
            expect(html).toContain('No. __________');
          } else {
            const formatCurrency = (value: number) =>
              new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 2,
              }).format(value);
            expect(html).toContain(formatCurrency(expectedSubtotal));
            expect(html).toContain(formatCurrency(expectedSubtotal + expectedTax));
            for (const material of materials) {
              expect(html).toContain(
                formatCurrency(material.cantidad * 1000),
              );
            }
            expect(html).toContain('Observación extensa.');
          }
        }
      } finally {
        for (const storageKey of storageKeys) await service.remove(storageKey);
        await service.onModuleDestroy();
        await rm(temporaryRoot, { recursive: true, force: true });
      }
    },
  );

  const originalEnvironment = {
    storage: process.env.PDF_STORAGE_PATH,
    baseUrl: process.env.PDF_RENDER_BASE_URL,
    secret: process.env.PDF_RENDER_SECRET,
    timeout: process.env.PDF_RENDER_TIMEOUT_MS,
  };

  afterEach(() => {
    vi.clearAllMocks();
    for (const [key, value] of Object.entries({
      PDF_STORAGE_PATH: originalEnvironment.storage,
      PDF_RENDER_BASE_URL: originalEnvironment.baseUrl,
      PDF_RENDER_SECRET: originalEnvironment.secret,
      PDF_RENDER_TIMEOUT_MS: originalEnvironment.timeout,
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
    const service = new PdfGeneratorService(new LocalStorageService());
    const snapshot = {
      documento: { tipo: 'COTIZACION', consecutivo: 'COT-LAV-TEST' },
      formato: { codigo: 'R-CM-07-5', version: 4 },
    };

    try {
      const result = await service.generate(snapshot, 'cotizaciones/COT-LAV-TEST.pdf');
      const stored = await service.getFile(result.storageKey, result.hash);

      expect(stored).toEqual(pdfBuffer);
      expect(result.hash).toBe(createHash('sha256').update(stored).digest('hex'));
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
    const service = new PdfGeneratorService(new LocalStorageService());

    try {
      await expect(service.generate({ documento: { tipo: 'CERTIFICADO' } }, 'certificados/CERT-TEST.pdf'))
        .rejects.toThrow(/No fue posible generar el PDF/);
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
    const service = new PdfGeneratorService(new LocalStorageService());

    await expect(service.generate({ documento: { tipo: 'COTIZACION' } }, '../bad.pdf'))
      .rejects.toThrow(/Clave de almacenamiento/);
    await service.onModuleDestroy();
  });

  it('times out a stalled Playwright render and leaves no PDF in storage', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'sterinova-pdf-timeout-'));
    process.env.PDF_STORAGE_PATH = temporaryRoot;
    process.env.PDF_RENDER_SECRET = 'test-render-secret-containing-at-least-32-bytes';
    process.env.PDF_RENDER_TIMEOUT_MS = '20';
    const page = {
      setExtraHTTPHeaders: vi.fn(),
      goto: vi.fn(() => new Promise(() => undefined)),
      close: vi.fn(async () => undefined),
    };
    vi.mocked(chromium.launch).mockResolvedValue({
      newPage: vi.fn(async () => page), close: vi.fn(),
    } as unknown as Browser);
    const service = new PdfGeneratorService(new LocalStorageService());
    try {
      await expect(service.generate({ documento: { tipo: 'CERTIFICADO' } }, 'certificados/CERT-TIMEOUT.pdf'))
        .rejects.toThrow(/tiempo límite/);
      await expect(readFile(path.join(temporaryRoot, 'certificados', 'CERT-TIMEOUT.pdf')))
        .rejects.toMatchObject({ code: 'ENOENT' });
      expect(page.close).toHaveBeenCalled();
    } finally {
      await service.onModuleDestroy();
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });
});
