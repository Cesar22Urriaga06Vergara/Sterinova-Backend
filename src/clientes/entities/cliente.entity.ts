import { Index } from 'typeorm';
import { ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { RbacScope } from '../../rbac/entities/scope.entity.js';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('clientes')
@Index('IDX_clientes_scope_id', ['scope_id'])
@Index('IDX_clientes_creador_id', ['creador_id'])
export class Cliente {
  @Column({ type: 'int', nullable: true })
  scope_id: number | null;

  @ManyToOne(() => RbacScope, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'scope_id',
    foreignKeyConstraintName: 'FK_clientes_scope_id',
  })
  rbac_scope_id_ref: Relation<RbacScope> | null;

  @Column({ type: 'int', nullable: true })
  creador_id: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'creador_id',
    foreignKeyConstraintName: 'FK_clientes_creador_id',
  })
  rbac_creador_id_ref: Relation<User> | null;

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
