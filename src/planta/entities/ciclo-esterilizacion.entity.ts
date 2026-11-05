import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column({ type: 'float' })
  humedad: number;

  @Column({ type: 'float' })
  presion: number;

  @Column({ type: 'float' })
  tiempo_exposicion: number;

  @Column({ type: 'float' })
  tiempo_aireacion: number;

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
