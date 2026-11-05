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
export class FormatoVersiones {
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

  @OneToMany(() => FormatoAsignacionesCliente, (asignacion) => asignacion.version_formato)
  asignaciones_cliente: Relation<FormatoAsignacionesCliente[]>;
}
