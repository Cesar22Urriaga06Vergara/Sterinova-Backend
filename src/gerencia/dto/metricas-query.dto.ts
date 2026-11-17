import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MetricasQueryDto {
  @ApiPropertyOptional({ example: '2026-11-13' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  desde?: string;

  @ApiPropertyOptional({ example: '2026-11-13' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  hasta?: string;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  scope_id?: number;
}

export const INDICADORES = [
  'cotizaciones_creadas',
  'cotizaciones_emitidas',
  'ordenes_creadas',
  'ciclos_realizados',
  'ciclos_aprobados',
  'ciclos_rechazados',
  'certificados_emitidos',
  'entregas',
] as const;
export type Indicador = (typeof INDICADORES)[number];
export const PENDIENTES = [
  'cotizaciones_borrador',
  'cotizaciones_por_emitir',
  'ordenes_abiertas',
  'calidad_por_revisar',
] as const;
export type Pendiente = (typeof PENDIENTES)[number];
export const DETALLES = [...INDICADORES, ...PENDIENTES] as const;

export class DetalleMetricasQueryDto extends MetricasQueryDto {
  @ApiPropertyOptional({ enum: DETALLES })
  @IsIn(DETALLES)
  indicador: (typeof DETALLES)[number];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 25;
}
