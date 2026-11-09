import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { PdfGeneratorService } from '../src/pdf/pdf-generator.service.js';

it('renders a schema 2 document in real Chromium using verified seal bytes without fetching an external image', async () => {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAE0lEQVR4nGP8//8/AwMDEwMYAAAkBgMBXaJOiAAAAABJRU5ErkJggg==',
    'base64',
  );
  const sha256 = createHash('sha256').update(png).digest('hex');
  const seal = {
    sello_id: 1,
    version_id: 1,
    version: 1,
    sha256,
    mime_type: 'image/png',
    imagen_key: `versiones/${sha256}.png`,
    imagen_src: `/internal/pdf-assets/sellos/${sha256}.png`,
  };
  const paths: string[] = [];
  const server = createServer((req, res) => {
    paths.push(req.url ?? '');
    if (req.url !== '/internal/pdf/cotizacion') {
      res.writeHead(404);
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.end(
      `<article data-pdf-document="cotizacion" data-pdf-schema-version="2"><h1>Test backend snapshot</h1><img src="${seal.imagen_src}" width="40" height="40"></article>`,
    );
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  const oldBase = process.env.PDF_RENDER_BASE_URL,
    oldSecret = process.env.PDF_RENDER_SECRET;
  process.env.PDF_RENDER_BASE_URL = `http://127.0.0.1:${address.port}`;
  process.env.PDF_RENDER_SECRET =
    'isolated-hito4-render-secret-at-least-32-characters';
  let stored: Buffer | undefined;
  const storage = {
    saveFile: async (buffer: Buffer) => {
      stored = buffer;
    },
  };
  const sealService = { readFrozen: vi.fn(async () => png) };
  const service = new PdfGeneratorService(
    storage as never,
    sealService as never,
  );
  try {
    const result = await service.generate(
      {
        schema_version: 2,
        documento: { tipo: 'COTIZACION' },
        sellos: { icontec: seal },
      },
      'cotizaciones/H4-RENDER.pdf',
    );
    expect(stored?.subarray(0, 5).toString()).toBe('%PDF-');
    expect(result.hash).toBe(
      createHash('sha256').update(stored!).digest('hex'),
    );
    expect(sealService.readFrozen).toHaveBeenCalledWith(seal, undefined);
    expect(paths).not.toContain(seal.imagen_src);
  } finally {
    await service.onModuleDestroy();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    if (oldBase === undefined) delete process.env.PDF_RENDER_BASE_URL;
    else process.env.PDF_RENDER_BASE_URL = oldBase;
    if (oldSecret === undefined) delete process.env.PDF_RENDER_SECRET;
    else process.env.PDF_RENDER_SECRET = oldSecret;
  }
}, 30000);
