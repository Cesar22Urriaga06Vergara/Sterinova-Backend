import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class SaveConductorDto {
  @IsString() @IsNotEmpty() @MaxLength(180) nombre_completo: string;
  @IsString() @IsNotEmpty() @MaxLength(40) documento: string;
  @IsOptional() @IsString() @MaxLength(40) telefono?: string | null;
  @IsOptional() @IsString() @MaxLength(20) placa_vehiculo?: string | null;
  @IsOptional() @IsBoolean() activo?: boolean;
}
