/** Six decimal rate applied to a subtotal already rounded to cents; half cents round away from zero. */
export function ivaAmount(subtotal: number, rate: string): number {
  const [whole, fraction = ''] = rate.split('.');
  const scaledRate = BigInt(whole + fraction.padEnd(6, '0'));
  const subtotalCents = BigInt(subtotal.toFixed(2).replace('.', ''));
  const product = subtotalCents * scaledRate;
  const half = product < 0n ? -500000n : 500000n;
  return Number((product + half) / 1000000n) / 100;
}
