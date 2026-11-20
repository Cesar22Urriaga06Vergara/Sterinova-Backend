import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { FormatoFirmaDto } from './formato-firma.dto.js';

export class UpdateFormatoVersionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  codigo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre?: string;

  @IsOptional()
  @IsDateString()
  fecha_version?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  responsable?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/\S/)
  version_label?: string;

  @IsOptional()
  @IsString()
  introduccion?: string;

  @IsOptional()
  @IsString()
  condiciones_comerciales?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => FormatoFirmaDto)
  firmas?: FormatoFirmaDto[];

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
