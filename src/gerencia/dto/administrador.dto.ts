import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto.js';

export class AsignarAdministradorDto {
  @ApiProperty({ type: Number, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  role_id: number;

  @ApiProperty({ type: Number, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  scope_id: number;
}

export class CrearAdministradorDto extends OmitType(CreateUserDto, [
  'role_id',
  'scope_id',
] as const) {
  @ApiProperty({ type: String, maxLength: 255 })
  declare nombre: string;

  @ApiProperty({ type: String, format: 'email', maxLength: 255 })
  declare email: string;

  @ApiProperty({ type: String, minLength: 10, writeOnly: true })
  declare password: string;

  @ApiPropertyOptional({ type: String, maxLength: 255 })
  declare apellido?: string;

  @ApiPropertyOptional({ type: String, maxLength: 255 })
  declare cargo?: string;

  @ApiPropertyOptional({ type: String, maxLength: 50 })
  declare celular?: string;

  @ApiPropertyOptional({ type: String, format: 'email', maxLength: 255 })
  declare email_contacto?: string;

  @ApiProperty({ type: Number, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  role_id: number;

  @ApiProperty({ type: Number, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  scope_id: number;
}
