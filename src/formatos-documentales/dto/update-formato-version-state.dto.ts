import { IsEnum } from 'class-validator';
import { EstadoVersionFormato } from '../entities/formato-versiones.entity.js';

export class UpdateFormatoVersionStateDto {
  @IsEnum(EstadoVersionFormato)
  estado: EstadoVersionFormato;
}
