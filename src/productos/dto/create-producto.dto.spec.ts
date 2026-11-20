import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import { CreateProductoDto } from './create-producto.dto.js';

describe('CreateProductoDto', () => {
  it('allows omitted catalog details and limits supplied quantity precision to two decimals', async () => {
    const withoutCategory = plainToInstance(CreateProductoDto, {
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      tipo_item: 'PRODUCTO',
      descripcion: 'Bolsa grado médico',
    });
    const tooPrecise = plainToInstance(CreateProductoDto, {
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      tipo_item: 'PRODUCTO',
      categoria: 'EMPAQUES',
      descripcion: 'Bolsa grado médico',
      unidad: 'unidad',
      precision_cantidad: 3,
    });

    expect(await validate(withoutCategory)).toHaveLength(0);
    expect((await validate(tooPrecise)).map(({ property }) => property))
      .toContain('precision_cantidad');
  });
});
