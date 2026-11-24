import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TipoItemCatalogo } from '../entities/producto.entity.js';

export class QueryProductosDto {
  @ApiPropertyOptional({ enum: TipoItemCatalogo, description: 'Omitir para consultar todos los segmentos' })
  @IsOptional()
  @IsEnum(TipoItemCatalogo)
  tipo_item?: TipoItemCatalogo;
}
