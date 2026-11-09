import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { MaterialOrdenDto } from './material-orden.dto.js';

export class UpdateMaterialesOrdenDto {
  @ApiProperty({ type: Number, minimum: 1 })
  @IsInt()
  @Min(1)
  version: number;
  @ApiPropertyOptional({ enum: ['ETO', 'VAPOR'] })
  @IsOptional()
  @IsIn(['ETO', 'VAPOR'])
  metodo_esterilizacion?: 'ETO' | 'VAPOR';
  @ApiProperty({ type: () => [MaterialOrdenDto], minItems: 1, maxItems: 200 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => MaterialOrdenDto)
  materiales: MaterialOrdenDto[];
}
