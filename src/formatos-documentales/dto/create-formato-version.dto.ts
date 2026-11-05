import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFormatoVersionDto {
  @IsDateString()
  fecha_version: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  responsable: string;
}
