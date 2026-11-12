import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import {
  CategoriaProducto,
  TipoItemCatalogo,
} from '../entities/producto.entity.js';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ enum: TipoServicioCotizacion })
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio: TipoServicioCotizacion;

  @ApiProperty({ enum: TipoItemCatalogo })
  @IsEnum(TipoItemCatalogo)
  tipo_item: TipoItemCatalogo;

  @ApiPropertyOptional({ enum: CategoriaProducto })
  @ValidateIf(
    (producto: CreateProductoDto, value: unknown) =>
      producto.tipo_servicio === TipoServicioCotizacion.INSUMOS ||
      value !== undefined,
  )
  @IsEnum(CategoriaProducto)
  categoria?: CategoriaProducto;

  @ApiPropertyOptional({ maxLength: 80 })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  codigo?: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  referencia?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  metodo?: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  presentacion?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  marca?: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion: string;

  @ApiProperty({ maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  unidad: string;

  @ApiProperty({ minimum: 0, maximum: 2, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2)
  precision_cantidad: number;
}
