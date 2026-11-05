import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  type Relation,
} from 'typeorm';
import { Cotizacion } from '../../cotizaciones/entities/cotizacion.entity.js';
import { EstadoOrdenServicio } from './estado-orden.enum.js';

@Entity('ordenes_servicio')
export class OrdenServicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  consecutivo: string;

  @Column({ type: 'int', unique: true })
  cotizacion_id: number;

  @Column({ type: 'date' })
  fecha_programada: string;

  @Column({
    type: 'enum',
    enum: EstadoOrdenServicio,
    default: EstadoOrdenServicio.PENDIENTE,
  })
  estado: EstadoOrdenServicio;

  @Column({ type: 'varchar', length: 255, nullable: true })
  conductor_asignado: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vehiculo_placa: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Cotizacion, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Relation<Cotizacion>;
}
