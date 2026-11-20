import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import { TipoDocumentoFormato } from '../entities/formatos-documentales.entity.js';
import { FormatoFirmaDto } from './formato-firma.dto.js';

export class CreateFormatoDocumentalDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cliente_id?: number | null;

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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/\S/)
  version_label?: string;

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

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsString({ each: true })
  @MaxLength(120, { each: true })
  columnas?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  condiciones_etiquetas?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  pie_notas?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  subtitulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  titulo_detalle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  nota_precios?: string;
}
