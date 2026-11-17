import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { RecepcionLogistica } from './recepcion-logistica.entity.js';

@Entity('recepcion_items')
@Index('IDX_recepcion_items_recepcion_id', ['recepcion_id'])
export class RecepcionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  recepcion_id: number;

  @ManyToOne(() => RecepcionLogistica, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'recepcion_id' })
  recepcion: Relation<RecepcionLogistica>;

  @Column({ type: 'int' })
  orden_servicio_material_id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referencia: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lote: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad_recibida: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cantidad_recibida_cajas: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  unidad_medida: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ type: 'datetime', precision: 6 })
  created_at: Date;
}
