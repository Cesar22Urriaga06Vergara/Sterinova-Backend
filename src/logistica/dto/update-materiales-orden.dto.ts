import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { MaterialOrdenDto } from './material-orden.dto.js';

export class UpdateMaterialesOrdenDto {
  @ApiProperty({ type: Number, minimum: 1 })
  @IsInt()
  @Min(1)
  version: number;
  @ApiPropertyOptional({ enum: ['ETO', 'VAPOR'] })
  @IsOptional()
  @IsIn(['ETO', 'VAPOR'])
  metodo_esterilizacion?: 'ETO' | 'VAPOR';
  @ApiProperty({ type: () => [MaterialOrdenDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MaterialOrdenDto)
  materiales: MaterialOrdenDto[];
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) conductor_recoleccion_id?: number | null;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) conductor_entrega_id?: number | null;
  @ApiPropertyOptional() @IsOptional() fecha_hora_recoleccion?: Date | null;
  @ApiPropertyOptional() @IsOptional() fecha_hora_entrega?: Date | null;
  @ApiPropertyOptional() @IsOptional() @IsString() lote_recoleccion?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) cajas_recibidas?: number | null;
  @ApiPropertyOptional() @IsOptional() cantidad_recibida?: number | null;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) cajas_entregadas?: number | null;
  @ApiPropertyOptional() @IsOptional() cantidad_entregada?: number | null;
  @ApiPropertyOptional() @IsOptional() @IsString() certificado_asociado?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() entregado_por_cliente?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() recibido_por_sterinova?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() entregado_por_sterinova?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() recibido_por_cliente?: string | null;
}
