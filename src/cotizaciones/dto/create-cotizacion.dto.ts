import { TipoServicioCotizacion } from '../entities/tipo-servicio.enum.js';
import { CreateCotizacionItemDto } from './create-cotizacion-item.dto.js';
import {
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCotizacionDto {
  @Type(() => Number)
  @IsNumber()
  cliente_id: number;

  @IsEnum(TipoServicioCotizacion)
  tipo_servicio: TipoServicioCotizacion;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCotizacionItemDto)
  items: CreateCotizacionItemDto[];

  @IsOptional()
  @IsString()
  condiciones_comerciales?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  estado?: string;
}
