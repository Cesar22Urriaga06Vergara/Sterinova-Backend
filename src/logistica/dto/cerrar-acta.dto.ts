import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
export class CerrarActaDto {
  @Type(() => Number) @IsInt() @Min(1) version: number;
  @IsOptional() @IsIn(['ENTREGA_PARCIAL', 'DEVOLUCION_RECHAZO']) novedad_tipo?: 'ENTREGA_PARCIAL' | 'DEVOLUCION_RECHAZO';
  @IsOptional() @IsString() @MaxLength(2000) novedad_motivo?: string;
}
