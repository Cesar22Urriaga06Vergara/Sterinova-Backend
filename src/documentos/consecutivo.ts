import { ConflictException } from '@nestjs/common';

export const MAX_CONSECUTIVO = 99999999n;

/** Call while holding the sequence write lock, before persisting any change. */
export function siguienteConsecutivo(ultimo: string, anchoMinimo = 3) {
  const valor = BigInt(ultimo) + 1n;
  if (valor > MAX_CONSECUTIVO) {
    throw new ConflictException({
      statusCode: 409,
      code: 'CONSECUTIVO_AGOTADO',
      message:
        'La secuencia alcanzó el límite de 99999999. No se asignó un número.',
    });
  }
  return { valor, numero: valor.toString().padStart(anchoMinimo, '0') };
}
