import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRecepcionEstadoDto {
  @ApiProperty({
    enum: ['RECIBIDO_PARCIAL', 'RECIBIDO_COMPLETO', 'RECHAZADO'],
  })
  @IsEnum(['RECIBIDO_PARCIAL', 'RECIBIDO_COMPLETO', 'RECHAZADO'])
  estado: 'RECIBIDO_PARCIAL' | 'RECIBIDO_COMPLETO' | 'RECHAZADO';

  @ApiPropertyOptional({ type: String, maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  motivo?: string | null;
}
