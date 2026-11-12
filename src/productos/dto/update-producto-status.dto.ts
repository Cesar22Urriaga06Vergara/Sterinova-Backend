import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateProductoStatusDto {
  @ApiProperty()
  @IsBoolean()
  activo: boolean;
}
