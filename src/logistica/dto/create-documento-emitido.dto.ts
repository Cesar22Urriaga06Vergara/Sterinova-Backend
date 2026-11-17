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

export class CreateDocumentoEmitidoDto {
  @ApiProperty({ enum: ['ORDEN', 'ACTA'] })
  @IsEnum(['ORDEN', 'ACTA'])
  tipo: 'ORDEN' | 'ACTA';

  @ApiProperty({ type: String, maxLength: 40 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  consecutivo: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  formato_version_id: number;

  @ApiProperty({ type: Object })
  snapshot_json: Record<string, unknown>;

  @ApiPropertyOptional({ type: String, maxLength: 512 })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  pdf_storage_key?: string | null;

  @ApiPropertyOptional({ type: String, maxLength: 64 })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  pdf_hash?: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-17T10:30:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha_emision: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  usuario_id: number;

  @ApiPropertyOptional({
    enum: ['EMITIDO', 'ANULADO', 'CORREGIDO'],
    default: 'EMITIDO',
  })
  @IsOptional()
  @IsEnum(['EMITIDO', 'ANULADO', 'CORREGIDO'])
  estado?: 'EMITIDO' | 'ANULADO' | 'CORREGIDO';

  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orden_id?: number | null;
}
