import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ example: 'Clínica Ejemplo S.A.S.' })
  @IsString()
  @IsNotEmpty()
  razon_social: string;

  @ApiProperty({ example: '900123456-1' })
  @IsString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty({ example: 'Ana Pérez' })
  @IsString()
  @IsNotEmpty()
  contacto: string;

  @ApiProperty({ example: '+57 300 000 0000' })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({ example: 'compras@ejemplo.com' })
  @IsString()
  @ValidateIf((_object, value: unknown) => value !== '')
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Calle 10 # 20-30' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ciudad?: string;
}
