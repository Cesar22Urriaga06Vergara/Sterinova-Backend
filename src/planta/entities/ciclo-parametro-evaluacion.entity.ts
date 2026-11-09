import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { CicloEsterilizacion } from './ciclo-esterilizacion.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('ciclos_parametros_evaluaciones')
@Index('UQ_evaluacion_ciclo_parametro', ['ciclo_id', 'parametro'], {
  unique: true,
})
export class CicloParametroEvaluacion {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int' }) ciclo_id: number;
  @ManyToOne(() => CicloEsterilizacion, (ciclo) => ciclo.evaluaciones, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ciclo_id' })
  ciclo: Relation<CicloEsterilizacion>;
  @Column({ type: 'varchar', length: 80 }) parametro: string;
  @Column({ type: 'enum', enum: ['CUMPLE', 'NO_CUMPLE', 'NO_APLICA'] })
  criterio: 'CUMPLE' | 'NO_CUMPLE' | 'NO_APLICA';
  @Column({ type: 'int' }) evaluador_id: number;
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'evaluador_id' })
  evaluador: Relation<User>;
  @Column({ type: 'datetime', precision: 6 }) evaluado_at: Date;
}
