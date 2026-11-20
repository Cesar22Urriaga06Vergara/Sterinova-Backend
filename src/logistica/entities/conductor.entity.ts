import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logistica_conductores')
@Index('IDX_logistica_conductores_scope', ['scope_id'])
export class Conductor {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int' }) scope_id: number;
  @Column({ type: 'varchar', length: 180 }) nombre_completo: string;
  @Column({ type: 'varchar', length: 40 }) documento: string;
  @Column({ type: 'varchar', length: 40, nullable: true }) telefono: string | null;
  @Column({ type: 'varchar', length: 20, nullable: true }) placa_vehiculo: string | null;
  @Column({ type: 'boolean', default: true }) activo: boolean;
}
