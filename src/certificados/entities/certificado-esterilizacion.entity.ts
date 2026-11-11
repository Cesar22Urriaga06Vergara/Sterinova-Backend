import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  type Relation,
} from 'typeorm';
import { OrdenServicio } from '../../ordenes-servicio/entities/orden-servicio.entity.js';
import { CicloEsterilizacion } from '../../planta/entities/ciclo-esterilizacion.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { FormatoVersiones } from '../../formatos-documentales/entities/formato-versiones.entity.js';

@Entity('certificados_esterilizacion')
@Index('IDX_certificados_version_formato', ['version_formato_id'])
@Index('IDX_certificados_esterilizacion_elaborado_por_id', ['elaborado_por_id'])
@Index('IDX_certificados_esterilizacion_verificado_por_id', [
  'verificado_por_id',
])
export class CertificadoEsterilizacion {
  @Column({ type: 'int', nullable: true })
  elaborado_por_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'elaborado_por_id',
    foreignKeyConstraintName: 'FK_certificados_esterilizacion_elaborado_por_id',
  })
  rbac_elaborado_por_id_ref: Relation<User> | null;

  @Column({ type: 'int', nullable: true })
  verificado_por_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'verificado_por_id',
    foreignKeyConstraintName:
      'FK_certificados_esterilizacion_verificado_por_id',
  })
  rbac_verificado_por_id_ref: Relation<User> | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  elaborado_at: Date | null;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  verificado_at: Date | null;

  @Column({ type: 'date', nullable: true })
  fecha_esterilizacion: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: string | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  consecutivo: string;

  @Column({ type: 'char', length: 43, unique: true })
  token_publico: string;

  @Column({ type: 'int' })
  ciclo_id: number;

  @OneToOne(() => CicloEsterilizacion, (ciclo) => ciclo.certificado, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ciclo_id' })
  cicloEsterilizacion: Relation<CicloEsterilizacion>;

  @Column({ type: 'int', nullable: true })
  orden_id: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  equipo: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ciclo: string | null;

  @Column({ type: 'simple-json', nullable: true })
  parametros_tecnicos: object | null;

  @Column({ type: 'text', nullable: true })
  controles_biologicos: string | null;

  @Column({ default: 'Aprobado' })
  estado: string;

  @Column({ type: 'int', nullable: true })
  aprobador_id: number | null;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'aprobador_id' })
  aprobador: Relation<User> | null;

  @Column({ type: 'timestamp', nullable: true })
  aprobado_at: Date | null;

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

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => OrdenServicio, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orden_id' })
  orden: Relation<OrdenServicio> | null;
}
