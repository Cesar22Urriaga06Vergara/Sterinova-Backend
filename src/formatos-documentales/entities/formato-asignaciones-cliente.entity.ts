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
import { Cliente } from '../../clientes/entities/cliente.entity.js';
import { FormatosDocumentales } from './formatos-documentales.entity.js';
import { FormatoVersiones } from './formato-versiones.entity.js';

@Entity('formato_asignaciones_cliente')
@Index('UQ_formato_asignaciones_cliente_formato', ['cliente_id', 'formato_id'], {
  unique: true,
})
export class FormatoAsignacionesCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  cliente_id: number;

  @ManyToOne(() => Cliente, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Relation<Cliente>;

  @Column({ type: 'int' })
  formato_id: number;

  @ManyToOne(() => FormatosDocumentales, (formato) => formato.asignaciones_cliente, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'formato_id' })
  formato: Relation<FormatosDocumentales>;

  @Column({ type: 'int' })
  version_formato_id: number;

  @ManyToOne(() => FormatoVersiones, (version) => version.asignaciones_cliente, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'version_formato_id' })
  version_formato: Relation<FormatoVersiones>;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
