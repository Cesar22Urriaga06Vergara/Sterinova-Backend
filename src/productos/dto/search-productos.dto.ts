import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchProductosDto {
  @ApiProperty({ enum: TipoServicioCotizacion })
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio: TipoServicioCotizacion;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
