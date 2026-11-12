import {
  detectarDiscrepanciasCantidad,
  prepararMateriales,
  metodoOrden,
} from './materiales-orden.js';
import { LogisticaService } from './logistica.service.js';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
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
it('rechaza materiales duplicados dentro de una misma orden', () => {
  expect(() =>
    prepararMateriales(
      [
        { descripcion: 'Bata', cantidad: 3, lote: 'L-01' },
        { descripcion: 'Bata', cantidad: 2, lote: 'L-01' },
      ],
      [],
    ),
  ).toThrow(/duplicados/i);
});

describe('discrepancias de cantidad cotizada y operativa', () => {
  const items = [{ id: 3, descripcion: 'Bata', cantidad: 5 }];

  it.each([
    ['igual', [{ cotizacion_item_id: 3, cantidad: 5 }], []],
    [
      'superior',
      [{ cotizacion_item_id: 3, cantidad: 7 }],
      [{
        cotizacion_item_id: 3,
        descripcion: 'Bata',
        cantidad_cotizada: 5,
        cantidad_operativa: 7,
        diferencia: 2,
        tipo: 'exceso',
      }],
    ],
    [
      'inferior',
      [{ cotizacion_item_id: 3, cantidad: 2 }],
      [{
        cotizacion_item_id: 3,
        descripcion: 'Bata',
        cantidad_cotizada: 5,
        cantidad_operativa: 2,
        diferencia: -3,
        tipo: 'faltante',
      }],
    ],
  ])('registra una cantidad %s sin cambiar los datos cotizados', (_, materials, expected) => {
    expect(detectarDiscrepanciasCantidad(items, materials)).toEqual(expected);
    expect(items[0]).toEqual({ id: 3, descripcion: 'Bata', cantidad: 5 });
  });

  it('suma lotes operativos asociados al mismo ítem antes de comparar', () => {
    expect(
      detectarDiscrepanciasCantidad(items, [
        { cotizacion_item_id: 3, cantidad: 2 },
        { cotizacion_item_id: 3, cantidad: 3 },
      ]),
    ).toEqual([]);
  });

  it('registra ítems cotizados que no fueron incluidos en logística', () => {
    expect(detectarDiscrepanciasCantidad(items, [])).toMatchObject([
      { cantidad_cotizada: 5, cantidad_operativa: 0, tipo: 'faltante' },
    ]);
  });
});

it('rechaza transiciones de estado no permitidas', async () => {
  const orden = { id: 7, estado: EstadoOrdenServicio.PENDIENTE };
  const repo = {
    findOne: vi.fn(async () => orden),
    save: vi.fn(async (value) => value),
  };
  const service = new LogisticaService(
    { findOne: vi.fn(), save: vi.fn() } as never,
    { findOne: vi.fn() } as never,
    {
      transaction: vi.fn(async (work) => work({
        getRepository: () => repo,
      })),
    } as never,
    { create: vi.fn() } as never,
    {} as never,
  );

  await expect(
    service.updateEstado(7, { estado: EstadoOrdenServicio.EN_PLANTA }, 10),
  ).rejects.toThrow(/Transición de estado no permitida/i);
});
