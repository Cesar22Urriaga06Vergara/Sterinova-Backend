import { TipoServicioCotizacion } from '../entities/tipo-servicio.enum.js';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateCotizacionDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cliente_id?: number;

  @IsOptional()
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio?: TipoServicioCotizacion;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  estado?: string;

  @IsOptional()
  @IsString()
  condiciones_comerciales?: string;
}
