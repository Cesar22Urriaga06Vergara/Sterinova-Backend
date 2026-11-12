import { TipoServicioCotizacion } from '../entities/tipo-servicio.enum.js';
import { CreateCotizacionItemDto } from './create-cotizacion-item.dto.js';
import {
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCotizacionDto {
  @ApiPropertyOptional({
    description:
      'Versión vista en el formulario; solo detecta cambios, no selecciona una tasa',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  iva_version_esperada_id?: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  cliente_id: number;

  @ApiProperty({ enum: TipoServicioCotizacion })
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio: TipoServicioCotizacion;

  @ApiProperty({ type: () => [CreateCotizacionItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCotizacionItemDto)
  items: CreateCotizacionItemDto[];

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  estado?: string;
}
