import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFormatoDocumentalDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  codigo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre?: string;
}
