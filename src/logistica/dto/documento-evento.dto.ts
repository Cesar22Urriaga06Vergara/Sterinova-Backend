import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentoEventoDto {
  @ApiProperty({
    enum: ['EMISION', 'ANULACION', 'CORRECCION'],
  })
  @IsEnum(['EMISION', 'ANULACION', 'CORRECCION'])
  tipo_evento: 'EMISION' | 'ANULACION' | 'CORRECCION';

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  usuario_id: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-17T10:30:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiPropertyOptional({ type: String, maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  motivo?: string | null;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  datos_json?: Record<string, unknown> | null;
}
