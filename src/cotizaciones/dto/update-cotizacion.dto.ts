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
  Max,
  MaxLength,
  Matches,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCotizacionItemDto extends CreateCotizacionItemDto {
  @MaxLength(500)
  @Matches(/\S/)
  declare descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  declare cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  declare valor_unitario: number;
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

  @ApiPropertyOptional({ type: () => [UpdateCotizacionItemDto] })
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateCotizacionItemDto)
  items?: UpdateCotizacionItemDto[];
}
