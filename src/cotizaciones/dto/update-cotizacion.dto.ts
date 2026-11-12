import { TipoServicioCotizacion } from '../entities/tipo-servicio.enum.js';
import { CreateCotizacionItemDto } from './create-cotizacion-item.dto.js';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCotizacionItemDto extends CreateCotizacionItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare id?: number;
}

export class QuoteVersionDto {
  @ApiProperty({
    description: 'Versión leída; una versión obsoleta produce 409',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  version: number;
}

export class UpdateCotizacionDto extends QuoteVersionDto {
  @ApiPropertyOptional()
  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(1)
  cliente_id?: number;

  @ApiPropertyOptional({ enum: TipoServicioCotizacion })
  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio?: TipoServicioCotizacion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  condiciones_comerciales?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tiempo_despacho?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transporte?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  forma_pago?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  validez_oferta?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  precio_incluye?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  precio_no_incluye?: string;

  @ApiPropertyOptional({ type: () => [UpdateCotizacionItemDto] })
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateCotizacionItemDto)
  items?: UpdateCotizacionItemDto[];
}
