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
import { OrdenServicio } from '../../ordenes-servicio/entities/orden-servicio.entity.js';
import { User } from '../../users/entities/user.entity.js';

export type EstadoRecepcionLogistica =
  | 'RECIBIDO_PARCIAL'
  | 'RECIBIDO_COMPLETO'
  | 'RECHAZADO';

@Entity('recepciones_logistica')
@Index('IDX_recepciones_logistica_orden_id', ['orden_id'], { unique: true })
@Index('IDX_recepciones_logistica_estado', ['estado'])
export class RecepcionLogistica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orden_id: number;

  @ManyToOne(() => OrdenServicio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'orden_id' })
  orden: Relation<OrdenServicio>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  numero_remision_factura: string | null;

  @Column({ type: 'datetime', precision: 6 })
  fecha_hora_recepcion: Date;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Relation<User>;

  @Column({ type: 'varchar', length: 200, nullable: true })
  sede_origen: string | null;

  @Column({ type: 'json', nullable: true })
  evidencias: Record<string, unknown> | null;

  @Column({
    type: 'enum',
    enum: ['RECIBIDO_PARCIAL', 'RECIBIDO_COMPLETO', 'RECHAZADO'],
    default: 'RECIBIDO_PARCIAL',
  })
  estado: EstadoRecepcionLogistica;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
