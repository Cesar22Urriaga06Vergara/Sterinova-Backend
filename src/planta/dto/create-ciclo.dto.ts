import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  Matches,
  IsOptional,
  ValidateIf,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
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
  @ApiProperty({ type: String, format: 'date' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha_esterilizacion: string;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  protocolo_version_id?: number;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: 'Requerido para Vapor; independiente de aireacion',
  })
  @ValidateIf((o) => o.metodo === 'VAPOR' || o.tiempo_secado != null)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Max(9999999.999)
  tiempo_secado?: number | null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  orden_id: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  equipo: string;

  @ApiProperty({ enum: ['ETO', 'VAPOR'] })
  @IsEnum(MetodoEsterilizacion)
  metodo: MetodoEsterilizacion;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  temperatura: number;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: 'Requerido para EtO; presion admite valores negativos en inHg',
  })
  @ValidateIf((o) => o.metodo === 'ETO' || o.humedad != null)
  @Transform(({ value }) => (value == null ? value : Number(value)))
  @IsNumber()
  @Min(0)
  @Max(100)
  humedad?: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: 'Requerido para EtO; presion admite valores negativos en inHg',
  })
  @ValidateIf((o) => o.metodo === 'ETO' || o.presion != null)
  @Transform(({ value }) => (value == null ? value : Number(value)))
  @IsNumber()
  presion?: number | null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tiempo_exposicion: number;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: 'Requerido para EtO; presion admite valores negativos en inHg',
  })
  @ValidateIf((o) => o.metodo === 'ETO' || o.tiempo_aireacion != null)
  @Transform(({ value }) => (value == null ? value : Number(value)))
  @IsNumber()
  @Min(0)
  tiempo_aireacion?: number | null;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  control_biologico: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  control_quimico: string;
}
