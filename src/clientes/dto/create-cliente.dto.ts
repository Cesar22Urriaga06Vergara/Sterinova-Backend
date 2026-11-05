import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  razon_social: string;

  @IsString()
  @IsNotEmpty()
  nit: string;

  @IsString()
  @IsNotEmpty()
  contacto: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @ValidateIf((_object, value: unknown) => value !== '')
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;
}
