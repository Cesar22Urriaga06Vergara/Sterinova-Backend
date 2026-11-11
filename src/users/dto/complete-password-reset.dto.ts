import { IsString, MinLength } from 'class-validator';

export class CompletePasswordResetDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(10)
  password: string;
}
