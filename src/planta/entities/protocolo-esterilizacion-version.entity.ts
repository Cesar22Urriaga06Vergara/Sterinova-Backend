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

@Entity('protocolos_esterilizacion_versiones')
@Index('UQ_protocolo_metodo_version', ['metodo', 'version'], { unique: true })
export class ProtocoloEsterilizacionVersion {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'enum', enum: ['ETO', 'VAPOR'] }) metodo: 'ETO' | 'VAPOR';
  @Column({ type: 'int', unsigned: true }) version: number;
  @Column({ type: 'json' }) especificaciones_json: Record<string, unknown>;
  @Column({ type: 'varchar', length: 500 }) motivo: string;
  @Column({ type: 'int', nullable: true }) creado_por_id: number | null;
  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: Relation<User> | null;
  @CreateDateColumn({ type: 'datetime', precision: 6 }) created_at: Date;
}
