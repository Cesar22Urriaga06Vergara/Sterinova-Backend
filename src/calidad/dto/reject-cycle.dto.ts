import { Type } from 'class-transformer';
import {
  IsOptional,
  IsArray,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { EvaluacionParametroDto } from './evaluacion-parametro.dto.js';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class RejectCycleDto {
  @ApiPropertyOptional({ type: () => [EvaluacionParametroDto], maxItems: 20 })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => EvaluacionParametroDto)
  evaluaciones?: EvaluacionParametroDto[];

  @IsInt()
  @Min(1)
  ciclo_id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  motivo: string;
}
