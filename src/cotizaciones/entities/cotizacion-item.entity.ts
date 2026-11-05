import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Cotizacion } from './cotizacion.entity.js';

@Entity('cotizacion_items')
export class CotizacionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  descripcion: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cantidad: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  valor_unitario: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  valor_total: number;

  @Column({ type: 'int' })
  cotizacion_id: number;

  @ManyToOne(() => Cotizacion, (cotizacion) => cotizacion.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Relation<Cotizacion>;
}
