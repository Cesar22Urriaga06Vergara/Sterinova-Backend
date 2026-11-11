import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

export type PdfRenderDocumentType =
  | 'cotizacion'
  | 'certificado'
  | 'orden_servicio'
  | 'acta_servicio';

type PdfRenderPayload = {
  audience: 'sterinova-pdf-render';
  documentType: PdfRenderDocumentType;
  expiresAt: number;
  snapshot: Record<string, unknown>;
};

const keyFromSecret = (secret: string): Buffer => {
  if (secret.trim().length < 32) {
    throw new Error('PDF render secret must contain at least 32 characters');
  }
  return createHash('sha256').update(secret).digest();
};

export function createPdfRenderToken(
  snapshot: Record<string, unknown>,
  documentType: PdfRenderDocumentType,
  secret: string,
  now = Date.now(),
): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyFromSecret(secret), iv);
  const payload: PdfRenderPayload = {
    audience: 'sterinova-pdf-render',
    documentType,
    expiresAt: now + 90_000,
    snapshot,
  };
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);
  return [
    'v1',
    iv.toString('base64url'),
    cipher.getAuthTag().toString('base64url'),
    ciphertext.toString('base64url'),
  ].join('.');
}

export function readPdfRenderToken(
  token: string,
  expectedType: PdfRenderDocumentType,
  secret: string,
  now = Date.now(),
): Record<string, unknown> {
  const [version, ivText, tagText, ciphertextText, ...extra] = token.split('.');
  if (version !== 'v1' || !ivText || !tagText || !ciphertextText || extra.length) {
    throw new Error('Invalid PDF render token');
  }
  const decipher = createDecipheriv(
    'aes-256-gcm',
    keyFromSecret(secret),
    Buffer.from(ivText, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tagText, 'base64url'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextText, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
  const payload = JSON.parse(plaintext) as PdfRenderPayload;
  if (payload.audience !== 'sterinova-pdf-render' || payload.documentType !== expectedType) {
    throw new Error('PDF render token audience or document type mismatch');
  }
  if (!Number.isFinite(payload.expiresAt) || payload.expiresAt <= now) {
    throw new Error('PDF render token expired');
  }
  const map: Record<PdfRenderDocumentType, string> = {
    cotizacion: 'COTIZACION',
    certificado: 'CERTIFICADO',
    orden_servicio: 'ORDEN_SERVICIO',
    acta_servicio: 'ACTA_SERVICIO',
  };
  const expectedDocumentType = map[expectedType];
  const snapshotType = (payload.snapshot.documento as Record<string, unknown> | undefined)?.tipo;
  if (snapshotType !== expectedDocumentType) {
    throw new Error('PDF render snapshot type mismatch');
  }
  return payload.snapshot;
}
