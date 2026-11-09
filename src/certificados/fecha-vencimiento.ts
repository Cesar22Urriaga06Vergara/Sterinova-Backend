import { BadRequestException } from '@nestjs/common';

/** Civil dates only: no local/UTC conversion and no rollover to March 1. */
export function fechaVencimiento(fecha: string): string {
  if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new BadRequestException(
      'Se requiere fecha_esterilizacion válida (YYYY-MM-DD)',
    );
  }
  const date = new Date(`${fecha}T00:00:00Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== fecha
  ) {
    throw new BadRequestException('Fecha de esterilización inválida');
  }
  const year = Number(fecha.slice(0, 4)) + 3;
  if (year > 9999)
    throw new BadRequestException('Fecha fuera del rango permitido');
  const month = Number(fecha.slice(5, 7));
  const day = Math.min(
    Number(fecha.slice(8, 10)),
    new Date(Date.UTC(year, month, 0)).getUTCDate(),
  );
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
