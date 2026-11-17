import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAmbitoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name: string;

  @IsString()
  @IsNotEmpty()
  kind: 'GLOBAL' | 'DEPARTMENT' | 'TEAM' | 'PLANT';

  @IsString()
  @IsNotEmpty()
  parentId?: string;
}

export class UpdateAmbitoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name: string;

  @IsString()
  @IsNotEmpty()
  kind: 'GLOBAL' | 'DEPARTMENT' | 'TEAM' | 'PLANT';
}

export class CerrarAmbitoDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;
}

export class AmbitoResponse {
  id: number;
  code: string;
  name: string;
  kind: 'GLOBAL' | 'DEPARTMENT' | 'TEAM' | 'PLANT';
  parentId: number | null;
  active: boolean;
  createdAt: Date;
}
