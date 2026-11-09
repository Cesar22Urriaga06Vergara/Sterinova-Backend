import { BadRequestException } from '@nestjs/common';
import type { CotizacionItem } from '../cotizaciones/entities/cotizacion-item.entity.js';
import type { MaterialOrdenDto } from './dto/material-orden.dto.js';

export function metodoOrden(servicio: string, solicitado?: 'ETO' | 'VAPOR') {
  const derivado = servicio.endsWith('_ETO')
    ? 'ETO'
    : servicio.endsWith('_VAPOR')
      ? 'VAPOR'
      : null;
  if (derivado && solicitado && derivado !== solicitado)
    throw new BadRequestException('El método contradice el servicio cotizado');
  return derivado ?? solicitado ?? null;
}

export function prepararMateriales(
  materiales: MaterialOrdenDto[],
  items: Pick<CotizacionItem, 'id'>[],
) {
  const ids = new Set(items.map((item) => item.id));
  return materiales.map((m, index) => {
    if (m.cotizacion_item_id != null && !ids.has(m.cotizacion_item_id))
      throw new BadRequestException(
        'El ítem no pertenece a la cotización de la orden',
      );
    if (
      !m.descripcion?.trim() ||
      !Number.isInteger(m.cantidad) ||
      m.cantidad < 1 ||
      m.cantidad > 4294967295
    )
      throw new BadRequestException(
        'Material con descripción o cantidad inválida',
      );
    for (const value of [
      m.muestras_retencion,
      m.muestras_cliente,
      m.muestras_laboratorio,
    ]) {
      if (
        value != null &&
        (!Number.isInteger(value) || value < 0 || value > 4294967295)
      )
        throw new BadRequestException(
          'Muestras deben ser enteros no negativos',
        );
    }
    return {
      posicion: index + 1,
      descripcion: m.descripcion.trim(),
      cotizacion_item_id: m.cotizacion_item_id ?? null,
      referencia: m.referencia?.trim() || null,
      lote: m.lote?.trim() || null,
      empaque: m.empaque?.trim() || null,
      cantidad: m.cantidad,
      muestras_retencion: m.muestras_retencion ?? null,
      muestras_cliente: m.muestras_cliente ?? null,
      muestras_laboratorio: m.muestras_laboratorio ?? null,
    };
  });
}
