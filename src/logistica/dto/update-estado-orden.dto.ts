import { EstadoOrdenServicio } from '../../ordenes-servicio/entities/estado-orden.enum.js';
import { IsEnum } from 'class-validator';

export class UpdateEstadoOrdenDto {
  @IsEnum(EstadoOrdenServicio)
  estado: EstadoOrdenServicio;
}
