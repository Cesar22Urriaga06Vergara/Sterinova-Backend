import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class RejectCycleDto {
  @IsInt()
  @Min(1)
  ciclo_id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  motivo: string;
}
