import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoOrdenServicio } from '../../ordenes-servicio/entities/estado-orden.enum.js';
import { IsDefined, IsEnum, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventoOrdenDto } from './evento-orden.dto.js';

export class UpdateEstadoOrdenDto {
  @ApiProperty({ enum: EstadoOrdenServicio })
  @IsEnum(EstadoOrdenServicio)
  estado: EstadoOrdenServicio;

  @ApiPropertyOptional({
    type: () => EventoOrdenDto,
    description:
      'Requerido al cambiar a RECOGIDO, EN_PLANTA o ENTREGADO; PROCESADO se registra desde Planta al crear un ciclo.',
  })
  @ValidateIf((dto: UpdateEstadoOrdenDto) =>
    [
      EstadoOrdenServicio.RECOGIDO,
      EstadoOrdenServicio.EN_PLANTA,
      EstadoOrdenServicio.ENTREGADO,
    ].includes(dto.estado),
  )
  @IsDefined()
  @ValidateNested()
  @Type(() => EventoOrdenDto)
  evento?: EventoOrdenDto;
}
