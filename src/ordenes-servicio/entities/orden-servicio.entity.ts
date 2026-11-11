import { Index } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { RbacScope } from '../../rbac/entities/scope.entity.js';
import { OrdenServicioMaterial } from './orden-servicio-material.entity.js';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  VersionColumn,
  JoinColumn,
  CreateDateColumn,
  type Relation,
} from 'typeorm';
import { Cotizacion } from '../../cotizaciones/entities/cotizacion.entity.js';
import { EstadoOrdenServicio } from './estado-orden.enum.js';

@Entity('ordenes_servicio')
@Index('IDX_ordenes_servicio_scope_id', ['scope_id'])
@Index('IDX_ordenes_servicio_creador_id', ['creador_id'])
export class OrdenServicio {
  @Column({ type: 'int', nullable: true })
  scope_id: number | null;

  @ManyToOne(() => RbacScope, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'scope_id',
    foreignKeyConstraintName: 'FK_ordenes_servicio_scope_id',
  })
  rbac_scope_id_ref: Relation<RbacScope> | null;

  @Column({ type: 'int', nullable: true })
  creador_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'creador_id',
    foreignKeyConstraintName: 'FK_ordenes_servicio_creador_id',
  })
  rbac_creador_id_ref: Relation<User> | null;

  @Column({ type: 'enum', enum: ['ETO', 'VAPOR'], nullable: true })
  metodo_esterilizacion: 'ETO' | 'VAPOR' | null;

  @VersionColumn()
  version: number;

  @OneToMany(() => OrdenServicioMaterial, (material) => material.orden)
  materiales: Relation<OrdenServicioMaterial[]>;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  consecutivo: string;

  @Column({ type: 'int', unique: true })
  cotizacion_id: number;

  // Civil date (YYYY-MM-DD), not an instant; keep DATE and string semantics.
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
