import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AutorizarReprocesoDto {
  @ApiProperty({ description: 'Justificación documentada de la autorización' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  motivo: string;
}
