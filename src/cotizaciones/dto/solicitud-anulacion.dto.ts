import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches } from 'class-validator';
import { EstadoSolicitudAnulacion } from '../entities/solicitud-anulacion.entity.js';

export class CrearSolicitudAnulacionDto {
  @ApiProperty({ description: 'Motivo de la solicitud de anulación' })
  @IsString()
  @Matches(/\S/, { message: 'El motivo es obligatorio' })
  motivo: string;
}

export class ResolverSolicitudAnulacionDto {
  @ApiProperty({
    enum: [
      EstadoSolicitudAnulacion.APROBADA,
      EstadoSolicitudAnulacion.RECHAZADA,
    ],
  })
  @IsIn([EstadoSolicitudAnulacion.APROBADA, EstadoSolicitudAnulacion.RECHAZADA])
  estado:
    EstadoSolicitudAnulacion.APROBADA | EstadoSolicitudAnulacion.RECHAZADA;

  @ApiProperty({
    description: 'Observación de la resolución; admite texto vacío',
  })
  @IsString()
  observacion: string;
}
