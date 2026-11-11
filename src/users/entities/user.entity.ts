import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum.js';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellido: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cargo: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  celular: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email_contacto: string | null;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password_hash: string;

  @Column({ type: 'int', default: 1 })
  password_version: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  rol: UserRole;

  @Column({ type: 'int', default: 0, update: false, insert: false })
  rbac_version: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;
}
