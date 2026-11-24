import { TipoServicioCotizacion } from '../../common/tipo-servicio-cotizacion.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TipoItemCatalogo } from '../entities/producto.entity.js';

export class SearchProductosDto {
  @ApiProperty({ enum: TipoServicioCotizacion })
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio: TipoServicioCotizacion;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ enum: TipoItemCatalogo })
  @IsOptional()
  @IsEnum(TipoItemCatalogo)
  tipo_item?: TipoItemCatalogo;
}
