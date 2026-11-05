import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCotizacionDto } from './create-cotizacion.dto.js';

describe('CreateCotizacionDto validation', () => {
  it('transforms numeric fields and validates nested items', async () => {
    const dto = plainToInstance(CreateCotizacionDto, {
      cliente_id: '12',
      tipo_servicio: 'INDUSTRIAL_ETO',
      items: [
        {
          descripcion: 'Servicio',
          cantidad: '2',
          valor_unitario: '150',
        },
      ],
    });

    expect(await validate(dto)).toHaveLength(0);
    expect(dto.cliente_id).toBe(12);
    expect(dto.items[0]?.cantidad).toBe(2);
  });

  it('rejects invalid nested item values', async () => {
    const dto = plainToInstance(CreateCotizacionDto, {
      cliente_id: 12,
      tipo_servicio: 'INDUSTRIAL_ETO',
      items: [
        {
          descripcion: '',
          cantidad: 'dos',
          valor_unitario: 150,
        },
      ],
    });

    const errors = await validate(dto);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'items' }),
      ]),
    );
  });
});
