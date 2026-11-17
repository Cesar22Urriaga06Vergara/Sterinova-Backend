import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecepcionDto {
  @ApiProperty({ type: Number, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  orden_id: number;

  @ApiPropertyOptional({ type: String, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numero_remision_factura?: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-17T10:30:00.000Z',
    description: 'Fecha y hora real de recepción física del material.',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha_hora_recepcion: string;

  @ApiProperty({ type: String, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  sede_origen: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  evidencias?: Record<string, unknown> | null;

  @ApiProperty({
    enum: ['RECIBIDO_PARCIAL', 'RECIBIDO_COMPLETO', 'RECHAZADO'],
  })
  estado: 'RECIBIDO_PARCIAL' | 'RECIBIDO_COMPLETO' | 'RECHAZADO';
}
