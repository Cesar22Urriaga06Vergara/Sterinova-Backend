import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Cotizacion } from './cotizacion.entity.js';

export enum EstadoSolicitudAnulacion {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
}

@Entity('solicitudes_anulacion')
@Index('IDX_solicitud_anulacion_cotizacion_estado', ['cotizacion_id', 'estado'])
export class SolicitudAnulacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  cotizacion_id: number;

  @ManyToOne(() => Cotizacion, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Relation<Cotizacion>;

  @Column({ type: 'int' })
  creador_id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'creador_id' })
  creador: Relation<User>;

  // Usuario que resuelve la solicitud, tanto al aprobar como al rechazar.
  @Column({ type: 'int', nullable: true })
  aprobador_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'aprobador_id' })
  aprobador: Relation<User> | null;

  @Column({ type: 'text' })
  motivo: string;

  @Column({
    type: 'enum',
    enum: EstadoSolicitudAnulacion,
    default: EstadoSolicitudAnulacion.PENDIENTE,
  })
  estado: EstadoSolicitudAnulacion;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  fecha_resolucion: Date | null;

  @Column({ type: 'text', nullable: true })
  observacion_resolucion: string | null;
}
