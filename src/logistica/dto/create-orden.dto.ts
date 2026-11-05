import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrdenDto {
  @Type(() => Number)
  @IsNumber()
  cotizacion_id: number;

  @IsDateString()
  fecha_programada: string;

  @IsOptional()
  @IsString()
  conductor_asignado?: string;

  @IsOptional()
  @IsString()
  vehiculo_placa?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
