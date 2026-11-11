import {
  SelloSnapshotService,
  type FrozenSeal,
} from '../sellos/sello-snapshot.service.js';
import type { EntityManager } from 'typeorm';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { chromium, type Browser, type Page } from 'playwright';
import { createHash } from 'node:crypto';
import {
  createPdfRenderToken,
  type PdfRenderDocumentType,
} from './pdf-render-token.js';
import { StorageService } from '../common/services/storage.service.js';

type Snapshot = Record<string, any>;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(value: number | string | null | undefined): string {
  if (value == null || value === '') return '';
  const normalized = Number(value ?? 0);
  if (!Number.isFinite(normalized)) return '';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 2,
  }).format(normalized);
}

const LOGISTICS_FORMATS = {
  orden_servicio: { code: 'R-ES-02', version: '03', date: '15/10/2024' },
  acta_servicio: { code: 'R-LG-04', version: '03', date: '18/11/2024' },
} as const;

function buildLogisticDocumentHtml(
  snapshot: Snapshot,
  type: 'orden_servicio' | 'acta_servicio',
): string {
  const document = snapshot.documento;
  const order = snapshot.orden;
  const customer = snapshot.cliente;
  const quote = snapshot.cotizacion;
  const materials: Snapshot[] = Array.isArray(snapshot.materiales)
    ? snapshot.materiales
    : [];
  const format = LOGISTICS_FORMATS[type];
  const isOrder = type === 'orden_servicio';
  const title = isOrder
    ? 'ORDEN DE SERVICIO DE ESTERILIZACIÓN'
    : 'ACTA DE SERVICIO';
  const customerName = escapeHtml(customer?.razon_social);
  const consecutivo = escapeHtml(document?.consecutivo);
  const method = escapeHtml(order?.metodo_esterilizacion);
  const serviceType = escapeHtml(
    String(quote?.tipo_servicio ?? '').replace(/_/g, ' '),
  );
  const logoBase = process.env.PDF_RENDER_BASE_URL ??
    process.env.FRONTEND_INTERNAL_URL ?? 'http://localhost:3000';
  const logoUrl = escapeHtml(new URL('/Logo1.png', logoBase).toString());
  const certificationUrl = escapeHtml(
    new URL('/certificaciones-icontec-iqnet.jpeg', logoBase).toString(),
  );
  const quoteItems = isOrder && Array.isArray(quote?.items) ? quote.items : [];
  const lineValues = materials.map((material) => {
    const item = quoteItems.find(
      (candidate: Snapshot) => candidate.id === material.cotizacion_item_id,
    );
    const unitValue = item?.valor_unitario;
    const totalValue =
      unitValue == null || material.cantidad == null
        ? null
        : Number(unitValue) * Number(material.cantidad);
    return { unitValue, totalValue };
  });
  const totalQuantity = materials.reduce((total, material) => {
    const quantity = Number(material.cantidad ?? 0);
    return Number.isFinite(quantity) ? total + quantity : total;
  }, 0);
  const tableRows = materials.length
    ? materials
        .map((material, index) => {
          const description = escapeHtml(material.descripcion);
          const lot = escapeHtml(material.lote);
          const quantity = escapeHtml(material.cantidad);
          const values = lineValues[index];
          if (isOrder) {
            return `<tr>
              <td class="description">${description}</td>
              <td class="number">${quantity}</td>
              <td class="number"></td>
              <td class="number"></td>
              <td class="money">${formatCurrency(values.unitValue)}</td>
              <td class="money">${formatCurrency(values.totalValue)}</td>
            </tr>`;
          }
          return `<tr>
            <td class="description">${description}</td>
            <td class="lot">${lot}</td>
            <td class="number">${quantity}</td>
            <td class="number"></td>
            <td class="number"></td>
            <td class="number"></td>
            <td class="number"></td>
            <td class="money"></td>
            <td class="money"></td>
          </tr>`;
        })
        .join('')
    : `<tr><td class="empty" colspan="${isOrder ? 6 : 9}"></td></tr>`;
  const address = escapeHtml(customer?.direccion);
  const nit = escapeHtml(customer?.nit);
  const phone = escapeHtml(customer?.telefono);
  const email = escapeHtml(customer?.email);
  const observation = isOrder ? escapeHtml(order?.observaciones) : '';
  const quoteSubtotal = isOrder ? formatCurrency(quote?.subtotal) : '';
  const quoteTax = isOrder ? formatCurrency(quote?.iva) : '';
  const quoteTotal = isOrder ? formatCurrency(quote?.total) : '';
  const methodology = method === 'ETO' ? 'GAS' : method;

  return `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        @page { size: Letter portrait; margin: 8mm 9mm 24mm; }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          color: #111;
          background: #fff;
          font-size: 8px;
        }
        table { border-collapse: collapse; width: 100%; table-layout: fixed; }
        .document-header { margin-bottom: 2px; }
        .document-header td, .section td, .section th, .items td, .items th,
        .totals td, .signatures td {
          border: 1px solid #222;
          padding: 3px 4px;
          vertical-align: middle;
        }
        .document-header .logo { width: 32%; }
        .document-header .logo img { display: block; width: 100%; max-height: 36px; object-fit: contain; }
        .document-header .doc-title {
          font-weight: 700; font-size: 13px; text-align: center; padding: 6px;
        }
        .document-header .certifications { width: 15%; text-align: center; }
        .document-header .certifications img { width: 100%; max-height: 33px; object-fit: contain; }
        .document-header .metadata { width: 16%; text-align: center; font-size: 8px; }
        .metadata div { padding: 2px 0; }
        .metadata div + div { border-top: 1px solid #777; }
        .metadata .document-number { min-height: 14px; }
        .section { margin-bottom: 3px; }
        .section .label, .items th, .totals .label, .signatures .label {
          font-weight: 700; text-transform: uppercase; text-align: center;
        }
        .shade { background: #e5e5e5; }
        .center { text-align: center; }
        .right { text-align: right; }
        .small { font-size: 7px; }
        .subhead { font-size: 7px; font-weight: 700; text-align: center; }
        .blank { min-height: 14px; }
        .check { font-family: Arial, Helvetica, sans-serif; font-size: 10px; }
        .items { margin-top: 3px; page-break-inside: auto; }
        .items thead { display: table-header-group; }
        .document-header thead { display: table-header-group; }
        .items tr { page-break-inside: avoid; break-inside: avoid; }
        .items th { font-size: 7px; line-height: 1.1; }
        .items td { height: 15px; }
        .items .description { width: 40%; overflow-wrap: anywhere; }
        .items .lot { overflow-wrap: anywhere; word-break: break-word; }
        .items .number, .items .money { text-align: right; }
        .items .empty { height: 14px; }
        .closing { margin-top: 3px; }
        .closing .totals, .closing .section, .closing .signatures {
          page-break-inside: avoid; break-inside: avoid;
        }
        .notes { margin: 3px 0; }
        .notes .note-content { height: 50px; vertical-align: top; white-space: pre-wrap; overflow-wrap: anywhere; }
        .signatures { margin-top: 4px; }
        .signatures .signature-space { height: 38px; vertical-align: bottom; text-align: center; }
        .footer {
          position: fixed; bottom: 0; left: 0; right: 0;
          border-top: 1px solid #333; padding-top: 2px;
          font-size: 7px; line-height: 1.2; text-align: center;
        }
        table {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      </style>
    </head>
    <body>
      <table class="document-header">
        <thead><tr>
            <td class="logo"><img src="${logoUrl}" alt="Sterinova" /></td>
            <td class="doc-title">${title}</td>
            ${isOrder ? `<td class="certifications"><img src="${certificationUrl}" alt="Certificaciones ICONTEC" /></td>` : ''}
            <td class="metadata">
              <div><strong>${format.code}</strong></div>
              <div>VERSIÓN: ${format.version}</div>
              <div>${format.date}</div>
              ${isOrder ? '' : '<div class="document-number">No. __________</div>'}
            </td>
        </tr></thead>
      </table>
      ${isOrder ? `
        <table class="section">
          <tr>
            <td class="label shade" style="width: 18%">CLIENTE:</td>
            <td style="width: 38%">${customerName}</td>
            <td class="label shade" style="width: 22%">ESTERILIZACIÓN CON:</td>
            <td class="center">${methodology}</td>
            <td class="label shade" style="width: 8%">No.</td>
            <td class="center">${consecutivo}</td>
          </tr>
          <tr>
            <td class="label shade">SERVICIO CON:</td>
            <td colspan="5">
              EMPAQUE Y ESTERILIZACIÓN <span class="check">□</span>
              &nbsp; ESTERILIZACIÓN <span class="check">${method ? '☒' : '□'}</span>
              &nbsp; TRANSPORTE <span class="check">□</span>
              &nbsp; VOLUMEN <span class="blank"></span>
            </td>
          </tr>
          <tr><td colspan="6" class="small">Estos datos aplican si el cliente es nuevo.</td></tr>
          <tr>
            <td class="label shade">DIRECCIÓN:</td><td colspan="2">${address}</td>
            <td class="label shade">NIT:</td><td colspan="2">${nit}</td>
          </tr>
          <tr>
            <td class="label shade">TELÉFONO/FAX:</td><td colspan="2">${phone}</td>
            <td class="label shade">E-mail:</td><td colspan="2">${email}</td>
          </tr>
        </table>
        <table class="items order-items">
          <thead>
            <tr>
              <th rowspan="2" style="width: 41%">DESCRIPCIÓN DEL MATERIAL</th>
              <th rowspan="2" style="width: 9%">CANTIDAD</th>
              <th colspan="2" style="width: 22%">VERIFICADO</th>
              <th rowspan="2" style="width: 14%">VALOR UNITARIO</th>
              <th rowspan="2" style="width: 14%">VALOR TOTAL</th>
            </tr>
            <tr><th>RECEPCIÓN</th><th>ENTREGA</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="closing">
          <table class="totals">
            <tr>
              <td class="center" style="width: 22%">${new Intl.NumberFormat('es-CO').format(totalQuantity)}</td>
              <td class="center" style="width: 22%"></td>
              <td class="center" style="width: 22%"></td>
              <td class="label shade" style="width: 17%">SUB TOTAL</td><td class="right">${quoteSubtotal}</td>
            </tr>
            <tr>
              <td colspan="3"></td><td class="label shade">TRANSPORTE</td><td></td>
            </tr>
            <tr>
              <td colspan="3"></td><td class="label shade">I.V.A.</td><td class="right">${quoteTax}</td>
            </tr>
            <tr>
              <td colspan="3"></td><td class="label shade">TOTAL</td><td class="right">${quoteTotal}</td>
            </tr>
          </table>
          <table class="notes"><tr><td class="label shade">OBSERVACIONES:</td><td class="note-content">${observation}</td></tr></table>
          <table class="section">
            <tr><td colspan="4" class="label shade">RECEPCIÓN DE MATERIAL</td></tr>
            <tr>
              <td class="label">DÍA / MES / AÑO</td><td></td>
              <td class="label">HORA DE ENTREGA</td><td></td>
            </tr>
            <tr><td class="label">ENTREGADO POR:</td><td></td><td class="label">RECIBÍ MATERIAL COMPLETO</td><td></td></tr>
          </table>
          <table class="signatures">
            <tr>
              <td class="signature-space">____________________________<br /><span class="label">Sterinova</span></td>
              <td class="signature-space">____________________________<br /><span class="label">Cliente</span></td>
            </tr>
          </table>
        </div>
      ` : `
        <table class="section">
          <tr><td class="label shade" style="width: 18%">CLIENTE:</td><td>${customerName}</td><td class="label shade" style="width: 18%">TIPO DE SERVICIO</td><td style="width: 18%">${serviceType}</td></tr>
          <tr>
            <td class="label shade">DESCRIPCIÓN DEL SERVICIO:</td><td colspan="3"></td>
          </tr>
          <tr>
            <td class="label shade">RECEPCIÓN DE PRODUCTO</td>
            <td><span class="label">FECHA</span></td>
            <td><span class="label">HORA</span></td><td><span class="label">RECIBIDO POR</span></td>
          </tr>
          <tr>
            <td class="label shade">ESTERILIZACIÓN:</td><td class="center">${method ? 'APLICA' : '□ APLICA &nbsp; □ NO APLICA'}</td>
            <td class="label shade">EMPAQUE:</td><td class="center">□ APLICA &nbsp; □ NO APLICA</td>
          </tr>
          <tr><td class="label shade">TRANSPORTE:</td><td class="center">□ APLICA &nbsp; □ NO APLICA</td><td colspan="2"></td></tr>
        </table>
        <table class="items acta-items">
          <thead>
            <tr>
              <th rowspan="2" style="width: 24%">DESCRIPCIÓN DEL PRODUCTO</th>
              <th rowspan="2" style="width: 10%">LOTE</th>
              <th colspan="4" style="width: 34%">CANTIDAD</th>
              <th rowspan="2" style="width: 6%">V.B.</th>
              <th rowspan="2" style="width: 12%">VALOR UNITARIO</th>
              <th rowspan="2" style="width: 14%">VALOR TOTAL</th>
            </tr>
            <tr><th>RECIBIDO</th><th>CAJAS RECIBIDAS</th><th>ENTREGADO</th><th>CAJAS ENTREGADAS</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="closing">
          <table class="totals">
            <tr>
              <td rowspan="2" class="label shade" style="width: 15%">TRANSPORTE</td>
              <td class="label shade" style="width: 20%">RECIBIDO POR</td><td></td>
              <td class="label shade" style="width: 18%">TOTAL CAJAS RECIBIDAS</td><td></td>
              <td class="label shade" style="width: 14%">SUBTOTAL</td><td class="right">${quoteSubtotal}</td>
            </tr>
            <tr>
              <td class="label shade">ENTREGADO POR</td><td></td>
              <td class="label shade">TOTAL CAJAS ENTREGADAS</td><td></td>
              <td class="label shade">TRANSPORTE</td><td></td>
            </tr>
            <tr><td colspan="5"></td><td class="label shade">IVA</td><td class="right">${quoteTax}</td></tr>
            <tr><td colspan="5"></td><td class="label shade">TOTAL</td><td class="right">${quoteTotal}</td></tr>
          </table>
          <table class="notes"><tr><td class="label shade">OBSERVACIONES (RECEPCIÓN):</td><td class="note-content">${observation}</td></tr></table>
          <table class="section">
            <tr>
              <td class="label shade" style="width: 26%">ENTREGA PRODUCTO ESTÉRIL</td>
              <td class="label shade">FECHA</td><td></td>
              <td class="label shade">HORA</td><td></td>
              <td class="label shade">CERTIFICADO No.</td><td></td>
              <td class="label shade">FACTURA No.</td><td></td>
            </tr>
          </table>
          <table class="notes"><tr><td class="label shade">OBSERVACIONES CLIENTE:</td><td class="note-content"></td></tr></table>
        </div>
      `}
      <div class="footer">
        Calle 138 No. 50-55 Administrativo · Calle 137A No. 50-62 Planta · Calle 137A No. 50-76 Almacén<br />
        PBX: 371 4800 · www.sterinova.co · Bogotá, D.C. · Colombia
      </div>
    </body>
  </html>`;
}

export const PDF_RENDERER_VERSION = 'react-playwright-v2';
export function rendererVersionFor(snapshot?: Record<string, unknown> | null) {
  return snapshot?.schema_version === 2
    ? PDF_RENDERER_VERSION
    : 'react-playwright-v1';
}
const PDF_RENDER_TIMEOUT_MS = 15_000;

@Injectable()
export class PdfGeneratorService implements OnModuleDestroy {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private browserPromise?: Promise<Browser>;

  constructor(
    @Inject(StorageService) private readonly storage: StorageService,
    private readonly selloSnapshot: SelloSnapshotService,
  ) {}

  private async getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = chromium
        .launch({ headless: true })
        .catch((error: unknown) => {
          this.browserPromise = undefined;
          throw error;
        });
    }
    return this.browserPromise;
  }

  async healthCheck(): Promise<void> {
    const browser = await this.getBrowser();
    if (!browser.isConnected())
      throw new Error('PDF renderer browser is disconnected');
  }

  async onModuleDestroy(): Promise<void> {
    const browser = await this.browserPromise?.catch(() => undefined);
    await browser?.close();
    this.browserPromise = undefined;
  }

  private renderPage(snapshot: Snapshot): {
    type: PdfRenderDocumentType;
    url: string;
  } {
    const documentType =
      snapshot.documento?.tipo === 'COTIZACION'
        ? 'cotizacion'
        : snapshot.documento?.tipo === 'CERTIFICADO'
          ? 'certificado'
          : snapshot.documento?.tipo === 'ORDEN_SERVICIO'
            ? 'orden_servicio'
            : snapshot.documento?.tipo === 'ACTA_SERVICIO'
              ? 'acta_servicio'
              : null;
    if (!documentType) throw new Error('Tipo de documento PDF inválido');
    const baseUrl =
      process.env.PDF_RENDER_BASE_URL ??
      process.env.FRONTEND_INTERNAL_URL ??
      'http://localhost:3000';
    return {
      type: documentType,
      url: new URL(`/internal/pdf/${documentType}`, baseUrl).toString(),
    };
  }

  async render(snapshot: Snapshot, manager?: EntityManager): Promise<Buffer> {
    const seal = snapshot.sellos?.icontec as FrozenSeal | undefined;
    const sealBytes = seal
      ? await this.selloSnapshot.readFrozen(seal, manager)
      : null;
    const renderPage = this.renderPage(snapshot);
    let page: Page | undefined;
    let timedOut = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const renderPdf = async () => {
      const browser = await this.getBrowser();
      page = await browser.newPage({
        locale: 'es-CO',
        timezoneId: 'America/Bogota',
        viewport: { width: 816, height: 1056 },
      });
      if (seal && sealBytes) {
        const assetUrl = new URL(seal.imagen_src, renderPage.url).toString();
        const expectedPath = `/internal/pdf-assets/sellos/${seal.sha256}.${seal.mime_type === 'image/png' ? 'png' : 'jpg'}`;
        if (seal.imagen_src !== expectedPath)
          throw new Error('Ruta de sello no coincide con el hash');
        await page.route(assetUrl, (route) =>
          route.fulfill({
            status: 200,
            contentType: seal.mime_type,
            body: sealBytes,
          }),
        );
      }
      if (renderPage.type === 'orden_servicio' || renderPage.type === 'acta_servicio') {
        const html = buildLogisticDocumentHtml(snapshot, renderPage.type);
        await page.setContent(html, { waitUntil: 'load' });
      } else {
        const token = createPdfRenderToken(
          snapshot,
          renderPage.type,
          process.env.PDF_RENDER_SECRET ?? '',
        );
        await page.setExtraHTTPHeaders({ 'x-pdf-render-token': token });
        const response = await page.goto(renderPage.url, {
          waitUntil: 'networkidle',
          timeout: PDF_RENDER_TIMEOUT_MS,
        });
        if (!response?.ok())
          throw new Error(`render HTTP ${response?.status() ?? 'sin respuesta'}`);
        const schemaSelector =
          snapshot.schema_version === 2 ? '[data-pdf-schema-version="2"]' : '';
        await page.waitForSelector(
          `[data-pdf-document="${renderPage.type}"]${schemaSelector}`,
          {
            state: 'visible',
            timeout: PDF_RENDER_TIMEOUT_MS,
          },
        );
      }
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images, async (image) => {
            if (!image.complete || image.naturalWidth === 0)
              await image.decode();
            if (image.naturalWidth === 0 || image.naturalHeight === 0)
              throw new Error('Imagen PDF no disponible');
          }),
        );
      });
      await page.emulateMedia({ media: 'print' });
      const pdf = await page.pdf({
        format: 'Letter',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      });
      if (timedOut) throw new Error('PDF render deadline exceeded');
      return pdf;
    };

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        const configuredTimeout = Number(process.env.PDF_RENDER_TIMEOUT_MS);
        const timeoutMs =
          Number.isFinite(configuredTimeout) && configuredTimeout > 0
            ? configuredTimeout
            : PDF_RENDER_TIMEOUT_MS;
        timeout = setTimeout(() => {
          timedOut = true;
          void Promise.resolve(page?.close()).catch(() => undefined);
          reject(new Error('PDF render deadline exceeded'));
        }, timeoutMs);
      });
      return await Promise.race([renderPdf(), timeoutPromise]);
    } catch {
      this.logger.warn(
        timedOut
          ? 'PDF rendering exceeded its deadline'
          : 'PDF rendering failed',
      );
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

  async generate(
    snapshot: Snapshot,
    storageKey: string,
    manager?: EntityManager,
  ): Promise<{ storageKey: string; hash: string }> {
    if (!/^(cotizaciones|certificados|logistica)\/[\w.-]+\.pdf$/.test(storageKey)) {
      throw new Error('Clave de almacenamiento PDF inválida');
    }

    const pdf = await this.render(snapshot, manager);
    try {
      await this.storage.saveFile(pdf, storageKey);
    } catch {
      this.logger.warn('PDF rendering failed');
      throw new ServiceUnavailableException(
        'No fue posible generar el PDF. Intente nuevamente.',
      );
    }

    return {
      storageKey,
      hash: createHash('sha256').update(pdf).digest('hex'),
    };
  }

  async remove(storageKey: string): Promise<void> {
    if (!/^(cotizaciones|certificados|logistica)\/[\w.-]+\.pdf$/.test(storageKey)) return;
    await this.storage.deleteFile(storageKey);
  }

  async getFile(storageKey: string, expectedHash?: string): Promise<Buffer> {
    const file = await this.storage.getFile(storageKey);
    if (expectedHash) {
      const actualHash = createHash('sha256').update(file).digest('hex');
      if (actualHash !== expectedHash) {
        this.logger.error('Stored PDF integrity check failed');
        throw new ServiceUnavailableException(
          'El PDF almacenado no superó la verificación de integridad.',
        );
      }
    }
    return file;
  }
}
