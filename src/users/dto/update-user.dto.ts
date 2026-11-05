import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from '../entities/user-role.enum.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  apellido?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  rol?: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  cargo?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  celular?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email_contacto?: string | null;
}
