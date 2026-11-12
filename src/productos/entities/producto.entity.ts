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
import { TipoServicioCotizacion } from '../../cotizaciones/entities/tipo-servicio.enum.js';
import { RbacScope } from '../../rbac/entities/scope.entity.js';

export enum TipoItemCatalogo {
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO',
}

export enum CategoriaProducto {
  EMPAQUES = 'EMPAQUES',
  MONITOREO = 'MONITOREO',
  EQUIPOS = 'EQUIPOS',
  GENERAL = 'GENERAL',
}

@Entity('productos')
@Index('IDX_productos_scope_id', ['scope_id'])
@Index('IDX_productos_scope_tipo_activo', [
  'scope_id',
  'tipo_servicio',
  'activo',
])
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  scope_id: number;

  @ManyToOne(() => RbacScope, { onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'scope_id',
    foreignKeyConstraintName: 'FK_productos_scope_id',
  })
  scope: Relation<RbacScope>;

  @Column({ type: 'enum', enum: TipoServicioCotizacion })
  tipo_servicio: TipoServicioCotizacion;

  @Column({ type: 'enum', enum: TipoItemCatalogo })
  tipo_item: TipoItemCatalogo;

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

  @Column({ type: 'varchar', length: 80 })
  unidad: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  precision_cantidad: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
