import { IsEmail, IsInt, Min, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  role_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  scope_id?: number;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  apellido?: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(10)
  password: string;


  @IsOptional()
  @IsString()
  @MaxLength(255)
  cargo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  celular?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email_contacto?: string;
}
