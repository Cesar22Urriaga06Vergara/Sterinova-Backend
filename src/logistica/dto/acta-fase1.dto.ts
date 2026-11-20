import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
export class ActaRecepcionLineaDto {
  @Type(() => Number) @IsInt() @Min(1) material_id: number;
  @IsOptional() @IsString() @MaxLength(150) lote?: string | null;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 3 }) @Min(0) cantidad_recibida: number;
  @Type(() => Number) @IsInt() @Min(0) cajas_recibidas: number;
}
export class ActaFase1Dto {
  @Type(() => Number) @IsInt() @Min(1) version: number;
  @IsDateString() fecha_hora_recoleccion: string;
  @Type(() => Number) @IsInt() @Min(1) conductor_recoleccion_id: number;
  @IsString() @IsNotEmpty() @MaxLength(150) entregado_por_cliente: string;
  @IsOptional() @IsString() @MaxLength(150) recibido_por_sterinova?: string | null;
  @IsOptional() @IsString() observaciones_recepcion?: string | null;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => ActaRecepcionLineaDto) materiales: ActaRecepcionLineaDto[];
}
