import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { OrdenServicio } from './orden-servicio.entity.js';
import { CotizacionItem } from '../../cotizaciones/entities/cotizacion-item.entity.js';

@Entity('ordenes_servicio_materiales')
@Index('UQ_material_orden_posicion', ['orden_id', 'posicion'], { unique: true })
export class OrdenServicioMaterial {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int' }) orden_id: number;
  @ManyToOne(() => OrdenServicio, (orden) => orden.materiales, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'orden_id' })
  orden: Relation<OrdenServicio>;
  @Column({ type: 'int', nullable: true }) cotizacion_item_id: number | null;
  @ManyToOne(() => CotizacionItem, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cotizacion_item_id' })
  cotizacion_item: Relation<CotizacionItem> | null;
  @Column({ type: 'int', unsigned: true }) posicion: number;
  @Column({ type: 'varchar', length: 500 }) descripcion: string;
  @Column({ type: 'varchar', length: 150, nullable: true }) referencia:
    string | null;
  @Column({ type: 'varchar', length: 150, nullable: true }) lote: string | null;
  @Column({ type: 'int', unsigned: true }) cantidad: number;
  @Column({ type: 'varchar', length: 255, nullable: true }) empaque:
    string | null;
  @Column({ type: 'int', unsigned: true, nullable: true }) muestras_retencion:
    number | null;
  @Column({ type: 'int', unsigned: true, nullable: true }) muestras_cliente:
    number | null;
  @Column({ type: 'int', unsigned: true, nullable: true })
  muestras_laboratorio: number | null;
  @CreateDateColumn({ type: 'datetime', precision: 6 }) created_at: Date;
  @UpdateDateColumn({ type: 'datetime', precision: 6 }) updated_at: Date;
}
