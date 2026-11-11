import { RbacScope } from '../../rbac/entities/scope.entity.js';
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
  LOGIN_EXITOSO = 'login_exitoso',
  LOGIN_FALLIDO = 'login_fallido',
  APROBAR = 'aprobar',
  RECHAZAR = 'rechazar',
  CAMBIAR_ESTADO = 'cambiar_estado',
  RESETEAR_PASSWORD = 'resetear_password',
  DESCARGAR = 'descargar',
}

@Entity('auditoria')
@Index('IDX_auditoria_entidad_registro', ['entidad', 'entidad_id'])
@Index('IDX_auditoria_created_at', ['created_at'])
@Index('IDX_auditoria_scope_id', ['scope_id'])
export class Auditoria {
  @Column({ type: 'int', nullable: true })
  scope_id: number | null;

  @ManyToOne(() => RbacScope, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'scope_id',
    foreignKeyConstraintName: 'FK_auditoria_scope_id',
  })
  rbac_scope_id_ref: Relation<RbacScope> | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  usuario_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Relation<User> | null;

  @Column({ type: 'varchar', length: 100 })
  entidad: string;

  @Column({ type: 'int', nullable: true })
  entidad_id: number | null;

  @Column({ type: 'varchar', length: 30 })
  accion: AccionAuditoria;

  @Column({ type: 'json', nullable: true })
  detalle: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
