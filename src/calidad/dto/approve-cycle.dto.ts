import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class ApproveCycleDto {
  @IsInt()
  @Min(1)
  ciclo_id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password: string;
}
