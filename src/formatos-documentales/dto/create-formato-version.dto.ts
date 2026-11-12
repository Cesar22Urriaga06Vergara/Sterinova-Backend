import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateFormatoVersionDto {
  @IsDateString()
  fecha_version: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  responsable: string;

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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/\S/)
  version_label?: string;
}
