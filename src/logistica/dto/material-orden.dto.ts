import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class MaterialOrdenDto {
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  cotizacion_item_id?: number | null;
  @ApiProperty({ type: String, maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  referencia?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  lote?: string | null;
  @ApiProperty({ type: Number, minimum: 1, maximum: 4294967295 })
  @IsInt()
  @Min(1)
  @Max(4294967295)
  cantidad: number;
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  empaque?: string | null;
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4294967295)
  muestras_retencion?: number | null;
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4294967295)
  muestras_cliente?: number | null;
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4294967295)
  muestras_laboratorio?: number | null;
}
