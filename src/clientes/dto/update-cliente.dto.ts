import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateClienteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  razon_social?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nit?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contacto?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telefono?: string;

  @IsOptional()
  @ValidateIf((_object, value: unknown) => value !== '')
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  direccion?: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;
}
