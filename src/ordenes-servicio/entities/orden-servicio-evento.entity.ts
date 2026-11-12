import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { OrdenServicio } from './orden-servicio.entity.js';

export type TipoEventoOrden =
  | 'RECOGIDA'
  | 'RECEPCION_PLANTA'
  | 'PROCESAMIENTO'
  | 'ENTREGA_CLIENTE';

export type EventoOrdenDatos = {
  responsable: string;
  recibido_por?: string | null;
  entregado_por?: string | null;
  transportista?: string | null;
  observaciones?: string | null;
  ciclo_id?: number;
  fecha_esterilizacion?: string;
  materiales: Array<{
    material_id: number;
    cantidad: number;
    cajas?: number;
  }>;
};

@Entity('ordenes_servicio_eventos')
@Index('UQ_ordenes_servicio_evento_tipo', ['orden_id', 'tipo'], {
  unique: true,
})
@Index('IDX_ordenes_servicio_eventos_ocurrido', ['orden_id', 'ocurrido_at'])
export class OrdenServicioEvento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orden_id: number;

  @ManyToOne(() => OrdenServicio, (orden) => orden.eventos, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'orden_id' })
  orden: Relation<OrdenServicio>;

  @Column({ type: 'varchar', length: 32 })
  tipo: TipoEventoOrden;

  @Column({ type: 'datetime', precision: 6 })
  ocurrido_at: Date;

  @Column({ type: 'int' })
  usuario_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Relation<User>;

  @Column({ type: 'json' })
  datos_json: EventoOrdenDatos;
}
