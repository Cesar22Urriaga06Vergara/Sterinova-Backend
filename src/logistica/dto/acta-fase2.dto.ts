import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
export class ActaEntregaLineaDto {
  @Type(() => Number) @IsInt() @Min(1) material_id: number;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 3 }) @Min(0) cantidad_entregada: number;
  @Type(() => Number) @IsInt() @Min(0) cajas_entregadas: number;
  @IsBoolean() visto_bueno: boolean;
  @IsOptional() @IsBoolean() devolucion_registrada?: boolean;
}
export class ActaFase2Dto {
  @Type(() => Number) @IsInt() @Min(1) version: number;
  @IsDateString() fecha_hora_entrega: string;
  @Type(() => Number) @IsInt() @Min(1) conductor_entrega_id: number;
  @IsOptional() @IsString() @MaxLength(150) entregado_por_sterinova?: string | null;
  @IsString() @IsNotEmpty() @MaxLength(150) recibido_por_cliente: string;
  @IsOptional() @IsString() @MaxLength(100) certificado_no?: string | null;
  @IsOptional() @IsString() @MaxLength(100) factura_no?: string | null;
  @IsOptional() @IsString() observaciones_cliente?: string | null;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => ActaEntregaLineaDto) materiales: ActaEntregaLineaDto[];
}
