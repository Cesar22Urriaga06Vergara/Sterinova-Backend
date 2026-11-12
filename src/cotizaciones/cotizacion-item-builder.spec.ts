import type { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { TipoServicioCotizacion } from './entities/tipo-servicio.enum.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { Producto } from '../productos/entities/producto.entity.js';
import { buildCotizacionItem } from './cotizacion-item-builder.js';

const insumosProduct = {
  id: 8,
  scope_id: 4,
  tipo_servicio: TipoServicioCotizacion.INSUMOS,
  tipo_item: 'PRODUCTO',
  categoria: 'EMPAQUES',
  codigo: 'EMP-01',
  referencia: 'REF-01',
  metodo: null,
  presentacion: 'Rollo',
  marca: 'Sterinova',
  descripcion: 'Bolsa grado médico',
  unidad: 'unidad',
  precision_cantidad: 0,
  activo: true,
} as Producto;

function repositories(product?: Producto | null) {
  const productosRepository = {
    findOne: vi.fn(async () => product ?? null),
  };
  const itemsRepository = {
    create: vi.fn((value) => value),
  };
  return { productosRepository, itemsRepository };
}

describe('buildCotizacionItem', () => {
  it('copies trusted catalog details and calculates the line total', async () => {
    const { productosRepository, itemsRepository } = repositories(insumosProduct);

    await buildCotizacionItem(
      {
        producto_id: 8,
        descripcion: 'Texto manipulado',
        cantidad: 2,
        valor_unitario: 900,
        unidad: 'caja',
        precision_cantidad: 2,
        tipo_item: 'SERVICIO',
      },
      {
        tipo_servicio: TipoServicioCotizacion.INSUMOS,
        scope_id: 4,
        productos_repository:
          productosRepository as unknown as Repository<Producto>,
        items_repository:
          itemsRepository as unknown as Repository<CotizacionItem>,
      },
    );

    expect(productosRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: 8,
        scope_id: 4,
        tipo_servicio: TipoServicioCotizacion.INSUMOS,
        activo: true,
      },
    });
    expect(itemsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        producto_id: 8,
        tipo_item: 'PRODUCTO',
        categoria: 'EMPAQUES',
        codigo: 'EMP-01',
        referencia: 'REF-01',
        descripcion: 'Bolsa grado médico',
        unidad: 'unidad',
        precision_cantidad: 0,
        cantidad: 2,
        valor_unitario: 900,
        valor_total: 1800,
      }),
    );
  });

  it('rejects a catalog item outside the quote type, scope, or active set', async () => {
    const { productosRepository, itemsRepository } = repositories();

    await expect(
      buildCotizacionItem(
        {
          producto_id: 8,
          cantidad: 2,
          valor_unitario: 900,
        },
        {
          tipo_servicio: TipoServicioCotizacion.INSUMOS,
          scope_id: 4,
          productos_repository:
            productosRepository as unknown as Repository<Producto>,
          items_repository:
            itemsRepository as unknown as Repository<CotizacionItem>,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(itemsRepository.create).not.toHaveBeenCalled();
  });

  it('requires a valid unit and quantity precision for manual lines', async () => {
    const { productosRepository, itemsRepository } = repositories();

    await expect(
      buildCotizacionItem(
        {
          descripcion: 'Servicio especial',
          tipo_item: 'SERVICIO',
          cantidad: 1.5,
          valor_unitario: 100,
          unidad: 'servicio',
          precision_cantidad: 0,
        },
        {
          tipo_servicio: TipoServicioCotizacion.INDUSTRIAL_ETO,
          scope_id: 4,
          productos_repository:
            productosRepository as unknown as Repository<Producto>,
          items_repository:
            itemsRepository as unknown as Repository<CotizacionItem>,
        },
      ),
    ).rejects.toThrow('La cantidad supera la precisión permitida por la unidad');
    expect(itemsRepository.create).not.toHaveBeenCalled();
  });

  it('keeps the existing snapshot of an inactive product in its draft quote', async () => {
    const { productosRepository, itemsRepository } = repositories();
    const previousItem = {
      id: 21,
      producto_id: 8,
      tipo_item: 'PRODUCTO',
      categoria: 'EMPAQUES',
      codigo: 'EMP-01',
      referencia: 'REF-01',
      metodo: null,
      presentacion: 'Rollo',
      marca: 'Sterinova',
      descripcion: 'Nombre vigente al crear el borrador',
      unidad: 'unidad',
      precision_cantidad: 0,
      imagen_key: '9d2227dd-9548-4890-aefd-016a478b7d2f.png',
      imagen_sha256: 'a'.repeat(64),
      imagen_mime_type: 'image/png',
      imagen_tamano_bytes: 256,
    } as CotizacionItem;

    await buildCotizacionItem(
      {
        id: 21,
        producto_id: 8,
        cantidad: 3,
        valor_unitario: 1000,
      },
      {
        tipo_servicio: TipoServicioCotizacion.INSUMOS,
        scope_id: 4,
        productos_repository:
          productosRepository as unknown as Repository<Producto>,
        items_repository:
          itemsRepository as unknown as Repository<CotizacionItem>,
        previous_items: [previousItem],
        previous_tipo_servicio: TipoServicioCotizacion.INSUMOS,
      },
    );

    expect(productosRepository.findOne).not.toHaveBeenCalled();
    expect(itemsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        producto_id: 8,
        descripcion: 'Nombre vigente al crear el borrador',
        imagen_key: '9d2227dd-9548-4890-aefd-016a478b7d2f.png',
        cantidad: 3,
        valor_unitario: 1000,
      }),
    );
  });
});
