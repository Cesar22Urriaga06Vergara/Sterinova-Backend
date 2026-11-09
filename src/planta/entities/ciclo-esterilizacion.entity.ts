import { ProtocoloEsterilizacionVersion } from './protocolo-esterilizacion-version.entity.js';
import { CicloParametroEvaluacion } from './ciclo-parametro-evaluacion.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { OrdenServicio } from '../../ordenes-servicio/entities/orden-servicio.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { CertificadoEsterilizacion } from '../../certificados/entities/certificado-esterilizacion.entity.js';

export enum MetodoEsterilizacion {
  ETO = 'ETO',
  VAPOR = 'VAPOR',
}

export enum EstadoCicloEsterilizacion {
  EN_PROCESO = 'EN_PROCESO',
  PENDIENTE_CALIDAD = 'PENDIENTE_CALIDAD',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

@Entity('ciclos_esterilizacion')
export class CicloEsterilizacion {
  @Column({ type: 'date', nullable: true })
  fecha_esterilizacion: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  tiempo_secado: string | null;

  @Column({ type: 'int', nullable: true })
  protocolo_version_id: number | null;

  @ManyToOne(() => ProtocoloEsterilizacionVersion, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'protocolo_version_id' })
  protocolo_version: Relation<ProtocoloEsterilizacionVersion> | null;

  @OneToMany(() => CicloParametroEvaluacion, (evaluacion) => evaluacion.ciclo)
  evaluaciones: Relation<CicloParametroEvaluacion[]>;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orden_id: number;

  @ManyToOne(() => OrdenServicio, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'orden_id' })
  orden: Relation<OrdenServicio>;

  @Column({ type: 'varchar', length: 100 })
  equipo: string;

  @Column({ type: 'enum', enum: MetodoEsterilizacion })
  metodo: MetodoEsterilizacion;

  @Column({ type: 'int' })
  operador_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'operador_id' })
  operador: Relation<User>;

  @Column({ type: 'float' })
  temperatura: number;

  @Column({ type: 'float', nullable: true })
  humedad: number | null;

  @Column({ type: 'float', nullable: true })
  presion: number | null;

  @Column({ type: 'float' })
  tiempo_exposicion: number;

  @Column({ type: 'float', nullable: true })
  tiempo_aireacion: number | null;

  @Column({ type: 'varchar', length: 255 })
  control_biologico: string;

  @Column({ type: 'varchar', length: 255 })
  control_quimico: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_proceso: Date;

  @Column({
    type: 'enum',
    enum: EstadoCicloEsterilizacion,
    default: EstadoCicloEsterilizacion.PENDIENTE_CALIDAD,
  })
  estado: EstadoCicloEsterilizacion;

  @Column({ type: 'int', nullable: true })
  revisado_por: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'revisado_por' })
  revisor: Relation<User> | null;

  @Column({ type: 'timestamp', nullable: true })
  revisado_en: Date | null;

  @Column({ type: 'text', nullable: true })
  motivo_rechazo: string | null;

  @Column({ type: 'int', nullable: true })
  ciclo_correccion_de_id: number | null;

  @ManyToOne(() => CicloEsterilizacion, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ciclo_correccion_de_id' })
  cicloOriginal: Relation<CicloEsterilizacion> | null;

  @OneToOne(() => CertificadoEsterilizacion, 'cicloEsterilizacion')
  certificado: Relation<CertificadoEsterilizacion | null>;
}
