import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import type { CotizacionItem } from '../cotizaciones/entities/cotizacion-item.entity.js';
import type { MaterialOrdenDto } from './dto/material-orden.dto.js';

export type DiscrepanciaCantidad = {
  cotizacion_item_id: number;
  descripcion: string;
  cantidad_cotizada: number;
  cantidad_operativa: number;
  diferencia: number;
  tipo: 'exceso' | 'faltante';
};

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

export function detectarDiscrepanciasCantidad(
  items: Pick<CotizacionItem, 'id' | 'cantidad' | 'descripcion'>[],
  materiales: Pick<MaterialOrdenDto, 'cotizacion_item_id' | 'cantidad'>[],
): DiscrepanciaCantidad[] {
  const cantidadesOperativas = new Map<number, number>();
  for (const material of materiales) {
    if (material.cotizacion_item_id == null) continue;
    cantidadesOperativas.set(
      material.cotizacion_item_id,
      (cantidadesOperativas.get(material.cotizacion_item_id) ?? 0) +
        material.cantidad,
    );
  }

  return items.flatMap((item) => {
    const cantidadCotizada = Number(item.cantidad);
    if (!Number.isFinite(cantidadCotizada)) {
      throw new InternalServerErrorException(
        `La cantidad cotizada del ítem #${item.id} no es válida`,
      );
    }
    const cantidadOperativa = cantidadesOperativas.get(item.id) ?? 0;
    const diferencia = cantidadOperativa - cantidadCotizada;
    if (diferencia === 0) return [];
    return [{
      cotizacion_item_id: item.id,
      descripcion: item.descripcion,
      cantidad_cotizada: cantidadCotizada,
      cantidad_operativa: cantidadOperativa,
      diferencia,
      tipo: diferencia > 0 ? 'exceso' : 'faltante',
    }];
  });
}

export function prepararMateriales(
  materiales: MaterialOrdenDto[],
  items: Pick<CotizacionItem, 'id'>[],
) {
  if (!Array.isArray(materiales)) {
    throw new BadRequestException('Debe indicar materiales válidos para la orden');
  }

  const ids = new Set(items.map((item) => item.id));
  const vistos = new Set<string>();

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

    const descripcion = m.descripcion.trim();
    const lote = (m.lote ?? '').trim().toLowerCase();
    const referencia = (m.referencia ?? '').trim().toLowerCase();
    const clave = `${m.cotizacion_item_id ?? 'manual'}|${descripcion.toLowerCase()}|${lote}|${referencia}`;
    if (vistos.has(clave)) {
      throw new BadRequestException(
        'No se permiten materiales duplicados dentro de la misma orden',
      );
    }
    vistos.add(clave);

    return {
      posicion: index + 1,
      descripcion,
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
