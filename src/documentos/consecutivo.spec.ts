import { siguienteConsecutivo } from './consecutivo.js';

describe('consecutivos documentales', () => {
  it.each([
    ['0', '001'],
    ['998', '999'],
    ['999', '1000'],
    ['9999999', '10000000'],
    ['99999998', '99999999'],
  ])('avanza %s a %s sin renumerar', (last, expected) => {
    expect(siguienteConsecutivo(last)).toEqual({
      valor: BigInt(last) + 1n,
      numero: expected,
    });
  });
  it.each(['99999999', '100000000', '999999999999999999'])(
    'rechaza el contador agotado %s con 409',
    (last) => {
      try {
        siguienteConsecutivo(last);
        expect.fail('Debió rechazar el siguiente consecutivo');
      } catch (error: any) {
        expect(error.getStatus()).toBe(409);
        expect(error.getResponse()).toMatchObject({
          code: 'CONSECUTIVO_AGOTADO',
        });
      }
    },
  );
});
