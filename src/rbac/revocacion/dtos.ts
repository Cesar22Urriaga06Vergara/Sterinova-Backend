import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RevocarAsignacionesDto {
  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsString()
  @IsNotEmpty()
  motivo: string;
}

export class RevocarAsignacionDto {
  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsInt()
  @Min(1)
  asignacionId: number;

  @IsString()
  @IsNotEmpty()
  motivo: string;
}

export class RevocacionResponse {
  usuarioId: number;
  versionAnterior: number;
  versionNueva: number;
  asignacionesRevocadas: number;
  motivo: string;
  fecha: Date;
}
