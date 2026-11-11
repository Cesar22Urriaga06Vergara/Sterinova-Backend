import { User } from '../../users/entities/user.entity.js';
import { RbacScope } from '../../rbac/entities/scope.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { FormatosDocumentales } from './formatos-documentales.entity.js';
import { FormatoAsignacionesCliente } from './formato-asignaciones-cliente.entity.js';

export enum EstadoVersionFormato {
  BORRADOR = 'BORRADOR',
  EN_REVISION = 'EN_REVISION',
  APROBADA = 'APROBADA',
  PUBLICADA = 'PUBLICADA',
  OBSOLETA = 'OBSOLETA',
}

@Entity('formato_versiones')
@Index('UQ_formato_versiones_formato_version', ['formato_id', 'version'], {
  unique: true,
})
@Index('UQ_formato_versiones_id_formato', ['id', 'formato_id'], {
  unique: true,
})
@Index('IDX_formato_versiones_vigencia', ['formato_id', 'estado', 'es_vigente'])
@Index('IDX_formato_versiones_scope_id', ['scope_id'])
@Index('IDX_formato_versiones_creador_id', ['creador_id'])
@Index('IDX_formato_versiones_aprobador_id', ['aprobador_id'])
@Index('IDX_formato_versiones_publicado_por_id', ['publicado_por_id'])
export class FormatoVersiones {
  @Column({ type: 'int', nullable: true })
  scope_id: number | null;

  @ManyToOne(() => RbacScope, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'scope_id',
    foreignKeyConstraintName: 'FK_formato_versiones_scope_id',
  })
  rbac_scope_id_ref: Relation<RbacScope> | null;

  @Column({ type: 'int', nullable: true })
  creador_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'creador_id',
    foreignKeyConstraintName: 'FK_formato_versiones_creador_id',
  })
  rbac_creador_id_ref: Relation<User> | null;

  @Column({ type: 'int', nullable: true })
  aprobador_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'aprobador_id',
    foreignKeyConstraintName: 'FK_formato_versiones_aprobador_id',
  })
  rbac_aprobador_id_ref: Relation<User> | null;

  @Column({ type: 'int', nullable: true })
  publicado_por_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'publicado_por_id',
    foreignKeyConstraintName: 'FK_formato_versiones_publicado_por_id',
  })
  rbac_publicado_por_id_ref: Relation<User> | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  aprobado_at: Date | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  publicado_at: Date | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  formato_id: number;

  @ManyToOne(() => FormatosDocumentales, (formato) => formato.versiones, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'formato_id' })
  formato: Relation<FormatosDocumentales>;

  @Column({ type: 'int' })
  version: number;

  @Column({ type: 'varchar', length: 255 })
  responsable: string;

  @Column({ type: 'varchar', length: 24 })
  estado: EstadoVersionFormato;

  @Column({ type: 'varchar', length: 100 })
  renderer_key: string;

  @Column({ type: 'json' })
  configuracion_json: Record<string, unknown>;

  @Column({ type: 'date', nullable: true })
  fecha_version: string | null;

  @Column({ type: 'boolean', default: false })
  es_vigente: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(
    () => FormatoAsignacionesCliente,
    (asignacion) => asignacion.version_formato,
  )
  asignaciones_cliente: Relation<FormatoAsignacionesCliente[]>;
}
