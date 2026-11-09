import { fechaVencimiento } from './fecha-vencimiento.js';

it.each([
  ['2026-10-30', '2029-10-30'],
  ['2024-02-29', '2027-02-28'],
  ['2025-02-28', '2028-02-28'],
  ['2026-12-31', '2029-12-31'],
])('vence tres años después de %s', (fecha, esperado) => {
  expect(fechaVencimiento(fecha)).toBe(esperado);
});
it.each(['2026-02-29', '2026-13-01', '', null, '2026-01-01T00:00:00Z'])(
  'rechaza fecha operativa inválida %s sin inventar otra',
  (fecha) => {
    expect(() => fechaVencimiento(fecha as string)).toThrow();
  },
);
