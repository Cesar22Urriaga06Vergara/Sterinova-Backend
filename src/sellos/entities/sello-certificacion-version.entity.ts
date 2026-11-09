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
import { SelloCertificacion } from './sello-certificacion.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('sellos_certificacion_versiones')
@Index('UQ_sello_version', ['sello_id', 'version'], { unique: true })
export class SelloCertificacionVersion {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int' }) sello_id: number;
  @ManyToOne(() => SelloCertificacion, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sello_id' })
  sello: Relation<SelloCertificacion>;
  @Column({ type: 'int', unsigned: true }) version: number;
  @Column({ type: 'varchar', length: 1024 }) imagen_key: string;
  @Column({ type: 'char', length: 64 }) imagen_sha256: string;
  @Column({ type: 'varchar', length: 100 }) mime_type: string;
  @Column({ type: 'bigint', unsigned: true }) tamano_bytes: string;
  @Column({ type: 'varchar', length: 120 }) nombre_norma: string;
  @Column({ type: 'varchar', length: 150 }) numero_licencia: string;
  @Column({ type: 'int', nullable: true }) creado_por_id: number | null;
  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: Relation<User> | null;
  @CreateDateColumn({ type: 'datetime', precision: 6 }) created_at: Date;
}
