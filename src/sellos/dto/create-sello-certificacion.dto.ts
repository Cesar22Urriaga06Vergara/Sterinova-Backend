import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSelloCertificacionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre_norma: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  numero_licencia: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orden?: number;
}
