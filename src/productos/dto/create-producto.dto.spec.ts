import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import { CreateProductoDto } from './create-producto.dto.js';

describe('CreateProductoDto', () => {
  it('requires an Insumos category and limits quantity precision to two decimals', async () => {
    const withoutCategory = plainToInstance(CreateProductoDto, {
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      tipo_item: 'PRODUCTO',
      descripcion: 'Bolsa grado médico',
      unidad: 'unidad',
      precision_cantidad: 0,
    });
    const tooPrecise = plainToInstance(CreateProductoDto, {
      tipo_servicio: TipoServicioCotizacion.INSUMOS,
      tipo_item: 'PRODUCTO',
      categoria: 'EMPAQUES',
      descripcion: 'Bolsa grado médico',
      unidad: 'unidad',
      precision_cantidad: 3,
    });

    expect((await validate(withoutCategory)).map(({ property }) => property))
      .toContain('categoria');
    expect((await validate(tooPrecise)).map(({ property }) => property))
      .toContain('precision_cantidad');
  });
});
