import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CategoriaProducto,
  TipoItemCatalogo,
} from '../../productos/entities/producto.entity.js';

export class CreateCotizacionItemDto {
  @ApiPropertyOptional({ minimum: 1 })
  @ValidateIf((item) => item.producto_id !== undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  producto_id?: number;

  @ApiPropertyOptional({ enum: TipoItemCatalogo })
  @ValidateIf((item) => item.producto_id === undefined)
  @IsEnum(TipoItemCatalogo)
  tipo_item?: TipoItemCatalogo;

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

  @ApiPropertyOptional({ example: 'Esterilización de instrumental' })
  @ValidateIf((item) => item.producto_id === undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Matches(/\S/)
  descripcion?: string;

  @ApiProperty({ example: 1, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  cantidad: number;

  @ApiProperty({ example: 150000, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  valor_unitario: number;

  @ApiPropertyOptional({ example: 'unidad', maxLength: 80 })
  @ValidateIf((item) => item.producto_id === undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  unidad?: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 2 })
  @ValidateIf((item) => item.producto_id === undefined)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2)
  precision_cantidad?: number;
}
