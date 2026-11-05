import { createPdfRenderToken, readPdfRenderToken } from './pdf-render-token.js';

describe('PDF render token', () => {
  const secret = 'test-only-render-secret-with-more-than-32-bytes';

  it('round-trips an encrypted snapshot for the requested document type', () => {
    const snapshot = { documento: { tipo: 'COTIZACION' }, cliente: { razon_social: 'Cliente privado' } };
    const token = createPdfRenderToken(snapshot, 'cotizacion', secret, 1_000_000);

    expect(readPdfRenderToken(token, 'cotizacion', secret, 1_000_000)).toEqual(snapshot);
    expect(token).not.toContain('Cliente privado');
  });

  it('rejects tokens for a different document type or expired timestamp', () => {
    const token = createPdfRenderToken({ documento: { tipo: 'CERTIFICADO' } }, 'certificado', secret, 1_000_000);

    expect(() => readPdfRenderToken(token, 'cotizacion', secret, 1_000_000)).toThrow();
    expect(() => readPdfRenderToken(token, 'certificado', secret, 1_100_001)).toThrow(/expir/i);
  });

  it('rejects tampered tokens and missing secrets', () => {
    const token = createPdfRenderToken({ value: 'original' }, 'cotizacion', secret, 1_000_000);
    const tampered = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;

    expect(() => readPdfRenderToken(tampered, 'cotizacion', secret, 1_000_000)).toThrow();
    expect(() => createPdfRenderToken({}, 'cotizacion', '', 1_000_000)).toThrow(/secret/i);
  });
});
