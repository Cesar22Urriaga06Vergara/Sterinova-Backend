import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, Matches } from 'class-validator';
import { MaterialOrdenDto } from './material-orden.dto.js';
import { IsArray, ArrayMaxSize, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateOrdenDto {
  @ApiPropertyOptional({ enum: ['ETO', 'VAPOR'] })
  @IsOptional()
  @IsIn(['ETO', 'VAPOR'])
  metodo_esterilizacion?: 'ETO' | 'VAPOR';

  @IsOptional()
  @ApiPropertyOptional({ type: () => [MaterialOrdenDto], maxItems: 200 })
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => MaterialOrdenDto)
  materiales?: MaterialOrdenDto[];

  @Type(() => Number)
  @ApiProperty({ type: Number, minimum: 1 })
  @IsInt()
  @Min(1)
  cotizacion_id: number;

  @ApiProperty({
    type: String,
    format: 'date',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    example: '2026-11-10',
    description:
      'Fecha civil YYYY-MM-DD, sin hora ni zona horaria; se conserva sin conversiones en la columna DATE.',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
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
