import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../entities/user-role.enum.js';

export class CreateUserDto {
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

  @IsEnum(UserRole)
  rol: UserRole;

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
