import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ArrayMaxSize, ValidateNested } from 'class-validator';
import { EvaluacionParametroDto } from './evaluacion-parametro.dto.js';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class ApproveCycleDto {
  @ApiProperty({ type: () => [EvaluacionParametroDto], maxItems: 20 })
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => EvaluacionParametroDto)
  evaluaciones: EvaluacionParametroDto[];

  @ApiProperty({ type: Number, minimum: 1 })
  @IsInt()
  @Min(1)
  ciclo_id: number;

  @ApiProperty({ type: String, format: 'password' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password: string;
}
