import { TipoServicioCotizacion } from '../entities/tipo-servicio.enum.js';
import { CreateCotizacionItemDto } from './create-cotizacion-item.dto.js';
import {
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCotizacionDto {
  @ApiPropertyOptional({ enum: ['EtO', 'VAPOR', 'NO_APLICA'] })
  @IsOptional() @IsIn(['EtO', 'VAPOR', 'NO_APLICA'])
  metodo_esterilizacion?: 'EtO' | 'VAPOR' | 'NO_APLICA';

  @ApiPropertyOptional() @IsOptional() @IsBoolean() aplica_esterilizacion?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() aplica_empaque?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() aplica_transporte?: boolean;
  @ApiPropertyOptional({ minimum: 0 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) valor_transporte?: number;
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

}
