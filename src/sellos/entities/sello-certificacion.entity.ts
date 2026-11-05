import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sellos_certificacion')
export class SelloCertificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  nombre_norma: string;

  @Column({ type: 'varchar', length: 150 })
  numero_licencia: string;

  @Column({ type: 'varchar', length: 1024 })
  imagen_key: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
