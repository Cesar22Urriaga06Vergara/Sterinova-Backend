import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCotizacionItemDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Type(() => Number)
  @IsNumber()
  cantidad: number;

  @Type(() => Number)
  @IsNumber()
  valor_unitario: number;
}
