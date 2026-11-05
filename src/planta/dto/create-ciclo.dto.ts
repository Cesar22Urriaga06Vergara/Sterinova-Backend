import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { MetodoEsterilizacion } from '../entities/ciclo-esterilizacion.entity.js';

export class CreateCicloDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  orden_id: number;

  @IsString()
  @IsNotEmpty()
  equipo: string;

  @IsEnum(MetodoEsterilizacion)
  metodo: MetodoEsterilizacion;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  temperatura: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  humedad: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  presion: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tiempo_exposicion: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tiempo_aireacion: number;

  @IsString()
  @IsNotEmpty()
  control_biologico: string;

  @IsString()
  @IsNotEmpty()
  control_quimico: string;
}
