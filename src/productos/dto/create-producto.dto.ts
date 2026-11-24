import { TipoServicioCotizacion } from '../../common/tipo-servicio-cotizacion.js';
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
  @IsOptional()
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

  @ApiPropertyOptional({ maxLength: 80, default: 'unidad' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  unidad?: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 2, default: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2)
  precision_cantidad?: number;
}
