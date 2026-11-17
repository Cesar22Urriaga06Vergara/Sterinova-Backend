import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { CicloEsterilizacion } from './ciclo-esterilizacion.entity.js';
import { OrdenServicioMaterial } from '../../ordenes-servicio/entities/orden-servicio-material.entity.js';

/**
 * Cantidad procesada de un material de orden dentro de un ciclo.
 * Permite rastrear el acumulado por material de orden para soportar
 * ciclos parciales: una orden puede distribuirse en varios ciclos mientras
 * quede cantidad pendiente por material (reglas-maestras M5 resp. 62/69).
 */
@Entity('ciclos_materiales_procesados')
@Index('IDX_ciclo_material_procesado_ciclo', ['ciclo_id'])
@Index('IDX_ciclo_material_procesado_material', ['orden_servicio_material_id'])
export class CicloMaterialProcesado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  ciclo_id: number;

  @ManyToOne(() => CicloEsterilizacion, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ciclo_id' })
  ciclo: Relation<CicloEsterilizacion>;

  @Column({ type: 'int' })
  orden_servicio_material_id: number;

  @ManyToOne(() => OrdenServicioMaterial, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'orden_servicio_material_id' })
  ordenServicioMaterial: Relation<OrdenServicioMaterial>;

  @Column({ type: 'int', unsigned: true })
  cantidad_procesada: number;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
