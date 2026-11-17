import { BadRequestException } from '@nestjs/common';
import {
  prepararMateriales,
  detectarDiscrepanciasCantidad,
} from './materiales-orden.js';
import type { CotizacionItem } from '../cotizaciones/entities/cotizacion-item.entity.js';
import type { MaterialOrdenDto } from './dto/material-orden.dto.js';

const items: CotizacionItem[] = [
  { id: 5, descripcion: 'Bata', cantidad: 100 } as unknown as CotizacionItem,
];

describe('Materiales orden — cantidades decimales', () => {
  it('acepta cantidades decimales para peso/volumen (15.5 kg)', () => {
    const materiales: MaterialOrdenDto[] = [
      {
        cotizacion_item_id: 5,
        descripcion: 'Bata',
        cantidad: 15.5,
        lote: 'L1',
      },
    ];
    const resultado = prepararMateriales(materiales, items);
    expect(resultado[0].cantidad).toBe(15.5);
  });

  it('acepta cantidad entera como caso particular', () => {
    const materiales: MaterialOrdenDto[] = [
      { cotizacion_item_id: 5, descripcion: 'Bata', cantidad: 10 },
    ];
    const resultado = prepararMateriales(materiales, items);
    expect(resultado[0].cantidad).toBe(10);
  });

  it('rechaza cantidad cero o negativa', () => {
    for (const cantidad of [0, -1, -0.5]) {
      expect(() =>
        prepararMateriales(
          [{ cotizacion_item_id: 5, descripcion: 'Bata', cantidad } as MaterialOrdenDto],
          items,
        ),
      ).toThrow(BadRequestException);
    }
  });

  it('rechaza cantidad no numérica', () => {
    expect(() =>
      prepararMateriales(
        [{ cotizacion_item_id: 5, descripcion: 'Bata', cantidad: NaN } as unknown as MaterialOrdenDto],
        items,
      ),
    ).toThrow(BadRequestException);
  });

  it('detecta discrepancias con cantidades decimales', () => {
    const materiales: MaterialOrdenDto[] = [
      { cotizacion_item_id: 5, descripcion: 'Bata', cantidad: 15.5 },
    ];
    const discrepancias = detectarDiscrepanciasCantidad(items, materiales);
    expect(discrepancias).toHaveLength(1);
    expect(discrepancias[0].diferencia).toBe(-84.5);
    expect(discrepancias[0].tipo).toBe('faltante');
  });
});
