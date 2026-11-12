import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Cotizacion } from './cotizacion.entity.js';
import {
  CategoriaProducto,
  Producto,
  TipoItemCatalogo,
} from '../../productos/entities/producto.entity.js';

@Entity('cotizacion_items')
export class CotizacionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  producto_id: number | null;

  @ManyToOne(() => Producto, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'producto_id',
    foreignKeyConstraintName: 'FK_cotizacion_items_producto_id',
  })
  producto: Relation<Producto> | null;

  @Column({ type: 'enum', enum: TipoItemCatalogo, nullable: true })
  tipo_item: TipoItemCatalogo | null;

  @Column({ type: 'enum', enum: CategoriaProducto, nullable: true })
  categoria: CategoriaProducto | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  codigo: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  referencia: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  metodo: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  presentacion: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  marca: string | null;

  @Column({ type: 'varchar', length: 500 })
  descripcion: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  unidad: string | null;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  precision_cantidad: number | null;

  @Column({ type: 'varchar', length: 48, nullable: true })
  imagen_key: string | null;

  @Column({ type: 'char', length: 64, nullable: true })
  imagen_sha256: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  imagen_mime_type: string | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  imagen_tamano_bytes: number | null;

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
