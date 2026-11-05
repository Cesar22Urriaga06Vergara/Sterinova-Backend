import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('secuencias_consecutivos')
export class SecuenciaConsecutivos {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  nombre: string;

  @Column({ type: 'bigint', unsigned: true })
  ultimo_valor: string;
}
