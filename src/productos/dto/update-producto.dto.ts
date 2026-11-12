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
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import {
  CategoriaProducto,
  TipoItemCatalogo,
} from '../entities/producto.entity.js';

export class UpdateProductoDto {
  @ApiPropertyOptional({ enum: TipoServicioCotizacion })
  @IsOptional()
  @IsEnum(TipoServicioCotizacion)
  tipo_servicio?: TipoServicioCotizacion;

  @ApiPropertyOptional({ enum: TipoItemCatalogo })
  @IsOptional()
  @IsEnum(TipoItemCatalogo)
  tipo_item?: TipoItemCatalogo;

  @ApiPropertyOptional({ enum: CategoriaProducto })
  @IsOptional()
  @IsEnum(CategoriaProducto)
  categoria?: CategoriaProducto | null;

  @ApiPropertyOptional({ maxLength: 80 })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  codigo?: string | null;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  referencia?: string | null;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  metodo?: string | null;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  presentacion?: string | null;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  marca?: string | null;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({ maxLength: 80 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  unidad?: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2)
  precision_cantidad?: number;
}
