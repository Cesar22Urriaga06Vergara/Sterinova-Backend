import { SelloCertificacionVersion } from '../../sellos/entities/sello-certificacion-version.entity.js';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Index,
  type Relation,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity.js';
import { CotizacionItem } from './cotizacion-item.entity.js';
import { TipoServicioCotizacion } from './tipo-servicio.enum.js';
import { FormatoVersiones } from '../../formatos-documentales/entities/formato-versiones.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { RbacScope } from '../../rbac/entities/scope.entity.js';
import { TasaFiscal } from '../../tasas-fiscales/entities/tasa-fiscal.entity.js';

@Entity('cotizaciones')
@Index('IDX_cotizaciones_version_formato', ['version_formato_id'])
@Index('IDX_cotizaciones_scope_creator', ['scope_id', 'creador_id', 'id'])
@Index('IDX_cotizaciones_aprobador_interno_id', ['aprobador_interno_id'])
@Index('IDX_cotizaciones_aceptacion_registrada_por_id', [
  'aceptacion_registrada_por_id',
])
export class Cotizacion {
  @Column({ type: 'int', nullable: true })
  aprobador_interno_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'aprobador_interno_id',
    foreignKeyConstraintName: 'FK_cotizaciones_aprobador_interno_id',
  })
  rbac_aprobador_interno_id_ref: Relation<User> | null;

  @Column({ type: 'int', nullable: true })
  aceptacion_registrada_por_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'aceptacion_registrada_por_id',
    foreignKeyConstraintName: 'FK_cotizaciones_aceptacion_registrada_por_id',
  })
  rbac_aceptacion_registrada_por_id_ref: Relation<User> | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  aprobado_internamente_at: Date | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  aceptacion_registrada_at: Date | null;

  @Column({ type: 'int', nullable: true })
  sello_icontec_version_id: number | null;

  @ManyToOne(() => SelloCertificacionVersion, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sello_icontec_version_id' })
  sello_icontec_version: Relation<SelloCertificacionVersion> | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  consecutivo: string;

  @CreateDateColumn()
  fecha: Date;

  @Column({
    type: 'enum',
    enum: TipoServicioCotizacion,
  })
  tipo_servicio: TipoServicioCotizacion;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ default: 'Borrador' })
  estado: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  iva: number;

  @Column({ type: 'decimal', precision: 7, scale: 6, nullable: true })
  iva_tasa: string | null;

  @Column({ type: 'int', nullable: true })
  iva_version_id: number | null;

  @ManyToOne(() => TasaFiscal, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'iva_version_id' })
  iva_version: Relation<TasaFiscal> | null;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  condiciones_comerciales: string | null;

  @Column({ type: 'int', nullable: true })
  version_formato_id: number | null;

  @ManyToOne(() => FormatoVersiones, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'version_formato_id' })
  version_formato: Relation<FormatoVersiones> | null;

  @Column({ type: 'json', nullable: true })
  snapshot_datos: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  pdf_url: string | null;

  @Column({ type: 'char', length: 64, nullable: true })
  hash_pdf: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pdf_renderer_version: string | null;

  @Column({ type: 'datetime', nullable: true })
  fecha_emision: Date | null;

  @Column({ type: 'int' })
  cliente_id: number;

  @Column({ type: 'int', nullable: true })
  creador_id: number | null;

  @Column({ type: 'int', nullable: true })
  scope_id: number | null;

  @ManyToOne(() => RbacScope, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'scope_id' })
  scope: Relation<RbacScope> | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creador_id' })
  creador: Relation<User> | null;

  @ManyToOne(() => Cliente, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Relation<Cliente>;

  @OneToMany(() => CotizacionItem, (item) => item.cotizacion, {
    cascade: true,
    eager: true,
  })
  items: CotizacionItem[];
}
