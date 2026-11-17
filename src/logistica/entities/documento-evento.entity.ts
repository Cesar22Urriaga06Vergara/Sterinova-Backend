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
import { DocumentoEmitido } from './documento-emitido.entity.js';
import { User } from '../../users/entities/user.entity.js';

export type TipoDocumentoEvento = 'EMISION' | 'ANULACION' | 'CORRECCION';

@Entity('documentos_eventos')
@Index('IDX_documentos_eventos_documento_id', ['documento_emitido_id'])
export class DocumentoEvento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  documento_emitido_id: number;

  @ManyToOne(() => DocumentoEmitido, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'documento_emitido_id' })
  documentoEmitido: Relation<DocumentoEmitido>;

  @Column({ type: 'enum', enum: ['EMISION', 'ANULACION', 'CORRECCION'] })
  tipo_evento: TipoDocumentoEvento;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Relation<User>;

  @Column({ type: 'datetime', precision: 6 })
  fecha: Date;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  motivo: string | null;

  @Column({ type: 'json', nullable: true })
  datos_json: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
