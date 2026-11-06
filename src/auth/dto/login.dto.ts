import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'usuario@sterinova.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ writeOnly: true, minLength: 1 })
  @IsString()
  @IsNotEmpty()
  password: string;
}
