import { prepararMateriales, metodoOrden } from './materiales-orden.js';
it('mantiene lotes, cero muestras y N/A explícitos', () => {
  const rows = prepararMateriales(
    [
      {
        descripcion: 'Bata',
        cotizacion_item_id: 3,
        cantidad: 5,
        lote: 'L1',
        muestras_retencion: 0,
        muestras_cliente: null,
      },
    ],
    [{ id: 3 }] as never,
  );
  expect(rows[0]).toMatchObject({
    posicion: 1,
    lote: 'L1',
    cantidad: 5,
    muestras_retencion: 0,
    muestras_cliente: null,
  });
});
it('rechaza ítems de otra cotización y cantidades fraccionarias', () => {
  expect(() =>
    prepararMateriales(
      [{ descripcion: 'Bata', cantidad: 1, cotizacion_item_id: 99 }],
      [{ id: 3 }] as never,
    ),
  ).toThrow();
  expect(() =>
    prepararMateriales([{ descripcion: 'Bata', cantidad: 1.5 }], []),
  ).toThrow();
});
it('deriva método institucional y rechaza contradicciones', () => {
  expect(metodoOrden('INSTITUCIONAL_VAPOR')).toBe('VAPOR');
  expect(() => metodoOrden('INDUSTRIAL_ETO', 'VAPOR')).toThrow();
});
