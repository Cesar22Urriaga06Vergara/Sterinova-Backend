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

export type TipoDocumentoEmitido = 'ORDEN' | 'ACTA';
export type EstadoDocumentoEmitido = 'EMITIDO' | 'ANULADO' | 'CORREGIDO';

@Entity('documentos_emitidos')
@Index('IDX_documentos_emitidos_orden_id', ['orden_id'])
@Index('IDX_documentos_emitidos_tipo_consecutivo', ['tipo', 'consecutivo'], {
  unique: true,
})
export class DocumentoEmitido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['ORDEN', 'ACTA'] })
  tipo: TipoDocumentoEmitido;

  @Column({ type: 'varchar', length: 40 })
  consecutivo: string;

  @Column({ type: 'int' })
  formato_version_id: number;

  @Column({ type: 'json' })
  snapshot_json: Record<string, unknown>;

  @Column({ type: 'varchar', length: 512, nullable: true })
  pdf_storage_key: string | null;

  @Column({ type: 'char', length: 64, nullable: true })
  pdf_hash: string | null;

  @Column({ type: 'datetime', precision: 6 })
  fecha_emision: Date;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Relation<User>;

  @Column({
    type: 'enum',
    enum: ['EMITIDO', 'ANULADO', 'CORREGIDO'],
    default: 'EMITIDO',
  })
  estado: EstadoDocumentoEmitido;

  @Column({ type: 'int', nullable: true })
  orden_id: number | null;

  @ManyToOne(() => OrdenServicio, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'orden_id' })
  orden: Relation<OrdenServicio> | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
