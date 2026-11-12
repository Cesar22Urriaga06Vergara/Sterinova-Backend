import { BadRequestException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { CreateCotizacionItemDto } from './dto/create-cotizacion-item.dto.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { TipoServicioCotizacion } from './entities/tipo-servicio.enum.js';
import {
  CategoriaProducto,
  Producto,
  TipoItemCatalogo,
} from '../productos/entities/producto.entity.js';

type CotizacionItemBuilderOptions = {
  tipo_servicio: TipoServicioCotizacion;
  scope_id: number | null;
  productos_repository: Repository<Producto>;
  items_repository: Repository<CotizacionItem>;
  previous_items?: readonly CotizacionItem[];
  previous_tipo_servicio?: TipoServicioCotizacion;
};

function assertQuantityPrecision(cantidad: number, precision: number): void {
  const factor = 10 ** precision;
  if (Math.abs(cantidad * factor - Math.round(cantidad * factor)) > 1e-8)
    throw new BadRequestException(
      'La cantidad supera la precisión permitida por la unidad',
    );
}

function trimmedOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function assertManualCategory(
  tipoServicio: TipoServicioCotizacion,
  category: CategoriaProducto | null | undefined,
): CategoriaProducto | null {
  if (tipoServicio === TipoServicioCotizacion.INSUMOS) {
    if (
      category !== CategoriaProducto.EMPAQUES &&
      category !== CategoriaProducto.MONITOREO &&
      category !== CategoriaProducto.EQUIPOS
    )
      throw new BadRequestException(
        'Seleccione una categoría válida para los insumos',
      );
    return category;
  }
  if (category !== undefined && category !== null)
    throw new BadRequestException(
      'La categoría solo aplica a cotizaciones de Insumos',
    );
  return null;
}

export async function buildCotizacionItem(
  dto: CreateCotizacionItemDto & { id?: number },
  options: CotizacionItemBuilderOptions,
): Promise<CotizacionItem> {
  const cantidad = Number(dto.cantidad);
  const valorUnitario = Number(dto.valor_unitario);
  if (
    !Number.isFinite(cantidad) ||
    cantidad < 0.01 ||
    cantidad > 9999999999.99
  )
    throw new BadRequestException('La cantidad debe ser mayor que cero');
  if (
    !Number.isFinite(valorUnitario) ||
    valorUnitario < 0 ||
    valorUnitario > 9999999999.99
  )
    throw new BadRequestException('El valor unitario no es válido');

  let snapshot:
    | Pick<
        Producto,
        | 'tipo_item'
        | 'categoria'
        | 'codigo'
        | 'referencia'
        | 'metodo'
        | 'presentacion'
        | 'marca'
        | 'descripcion'
        | 'unidad'
        | 'precision_cantidad'
      >
    | Pick<
        CotizacionItem,
        | 'tipo_item'
        | 'categoria'
        | 'codigo'
        | 'referencia'
        | 'metodo'
        | 'presentacion'
        | 'marca'
        | 'descripcion'
        | 'unidad'
        | 'precision_cantidad'
      >;
  let productoId: number | null;
  const previousItem =
    options.previous_tipo_servicio === options.tipo_servicio
      ? options.previous_items?.find((item) => item.id === dto.id)
      : undefined;

  if (dto.producto_id !== undefined) {
    const previousSnapshot =
      previousItem?.producto_id === dto.producto_id &&
      previousItem.descripcion &&
      typeof previousItem.unidad === 'string' &&
      typeof previousItem.precision_cantidad === 'number'
        ? previousItem
        : undefined;
    const product =
      previousSnapshot ??
      (options.scope_id === null
        ? null
        : await options.productos_repository.findOne({
            where: {
              id: dto.producto_id,
              scope_id: options.scope_id,
              tipo_servicio: options.tipo_servicio,
              activo: true,
            },
          }));
    if (!product)
      throw new BadRequestException(
        'El producto no está activo o no pertenece al ámbito y tipo de esta cotización',
      );
    snapshot = product;
    productoId = previousSnapshot ? previousSnapshot.producto_id : product.id;
  } else {
    const descripcion = dto.descripcion?.trim();
    const unidad = dto.unidad?.trim();
    const precision = dto.precision_cantidad;
    if (!descripcion)
      throw new BadRequestException('La descripción es obligatoria');
    if (!unidad)
      throw new BadRequestException('La unidad es obligatoria');
    if (
      typeof precision !== 'number' ||
      !Number.isInteger(precision) ||
      precision < 0 ||
      precision > 2
    )
      throw new BadRequestException(
        'La precisión de cantidad debe estar entre 0 y 2 decimales',
      );
    if (
      dto.tipo_item !== TipoItemCatalogo.PRODUCTO &&
      dto.tipo_item !== TipoItemCatalogo.SERVICIO
    )
      throw new BadRequestException('Seleccione un tipo de ítem válido');
    snapshot = {
      tipo_item: dto.tipo_item,
      categoria: assertManualCategory(options.tipo_servicio, dto.categoria),
      codigo: trimmedOrNull(dto.codigo),
      referencia: trimmedOrNull(dto.referencia),
      metodo: trimmedOrNull(dto.metodo),
      presentacion: trimmedOrNull(dto.presentacion),
      marca: trimmedOrNull(dto.marca),
      descripcion,
      unidad,
      precision_cantidad: precision,
    };
    productoId = null;
  }

  const previousImage =
    productoId === previousItem?.producto_id ? previousItem : undefined;
  assertQuantityPrecision(cantidad, Number(snapshot.precision_cantidad));
  return options.items_repository.create({
    producto_id: productoId,
    tipo_item: snapshot.tipo_item,
    categoria: snapshot.categoria,
    codigo: snapshot.codigo,
    referencia: snapshot.referencia,
    metodo: snapshot.metodo,
    presentacion: snapshot.presentacion,
    marca: snapshot.marca,
    descripcion: snapshot.descripcion,
    unidad: snapshot.unidad,
    precision_cantidad: snapshot.precision_cantidad,
    imagen_key: previousImage?.imagen_key ?? null,
    imagen_sha256: previousImage?.imagen_sha256 ?? null,
    imagen_mime_type: previousImage?.imagen_mime_type ?? null,
    imagen_tamano_bytes: previousImage?.imagen_tamano_bytes ?? null,
    cantidad,
    valor_unitario: valorUnitario,
    valor_total: Number((cantidad * valorUnitario).toFixed(2)),
  });
}
