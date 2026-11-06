import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCotizacionItemDto {
  @ApiProperty({ example: 'Esterilización de instrumental' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 1, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: 150000, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  valor_unitario: number;
}
