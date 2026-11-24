import { BadRequestException } from '@nestjs/common';

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
