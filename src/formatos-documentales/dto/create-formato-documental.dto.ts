import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import { TipoDocumentoFormato } from '../entities/formatos-documentales.entity.js';
import { FormatoFirmaDto } from './formato-firma.dto.js';

export class CreateFormatoDocumentalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clave: string;

  @IsEnum(TipoDocumentoFormato)
  tipo_documento: TipoDocumentoFormato;

  @IsOptional()
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio?: TipoServicioCotizacion | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  version: number;

  @IsDateString()
  fecha_version: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  responsable: string;

  @IsString()
  introduccion: string;

  @IsString()
  condiciones_comerciales: string;

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => FormatoFirmaDto)
  firmas: FormatoFirmaDto[];
}
