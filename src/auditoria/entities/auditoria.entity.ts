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

export enum AccionAuditoria {
  CREAR = 'crear',
  EDITAR = 'editar',
  EMITIR = 'emitir',
  PUBLICAR = 'publicar',
  ELIMINAR = 'eliminar',
}

@Entity('auditoria')
@Index('IDX_auditoria_entidad_registro', ['entidad', 'entidad_id'])
@Index('IDX_auditoria_created_at', ['created_at'])
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  usuario_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Relation<User> | null;

  @Column({ type: 'varchar', length: 100 })
  entidad: string;

  @Column({ type: 'int' })
  entidad_id: number;

  @Column({ type: 'enum', enum: AccionAuditoria })
  accion: AccionAuditoria;

  @Column({ type: 'json', nullable: true })
  detalle: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
