import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  razon_social: string;

  @Column({ unique: true })
  nit: string;

  @Column()
  contacto: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  direccion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cargo: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  ciudad: string | null;

  @CreateDateColumn()
  created_at: Date;
}
