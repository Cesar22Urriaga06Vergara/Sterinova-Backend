import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnularCertificadoDto {
  @ApiProperty({ description: 'Motivo documentado de la anulación' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  motivo: string;

  @ApiProperty({ description: 'Contraseña actual del usuario que anula', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
