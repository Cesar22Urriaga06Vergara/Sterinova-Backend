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

export type EstadoEntrega =
  | 'PENDIENTE'
  | 'EN_TRANSITO'
  | 'ENTREGADO'
  | 'RECHAZADO';

@Entity('entregas')
@Index('IDX_entregas_orden_id', ['orden_id'])
@Index('IDX_entregas_estado', ['estado'])
export class Entrega {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orden_id: number;

  @ManyToOne(() => OrdenServicio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'orden_id' })
  orden: Relation<OrdenServicio>;

  @Column({ type: 'datetime', precision: 6 })
  fecha_hora_entrega: Date;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Relation<User>;

  @Column({ type: 'varchar', length: 150, nullable: true })
  transportista: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  conductor: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  placa: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  recibido_por: string | null;

  @Column({ type: 'json', nullable: true })
  evidencias: Record<string, unknown> | null;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'EN_TRANSITO', 'ENTREGADO', 'RECHAZADO'],
    default: 'PENDIENTE',
  })
  estado: EstadoEntrega;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
