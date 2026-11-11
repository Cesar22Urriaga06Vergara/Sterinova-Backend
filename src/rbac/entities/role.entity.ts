import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import type { ResourceAccess } from '../authorization.types.js';

export type RoleKind = 'STANDARD' | 'PLATFORM';

@Entity('rbac_roles')
@Index('UQ_rbac_roles_code', ['code'], { unique: true })
@Index('UQ_rbac_roles_global_eligibility', ['id', 'global_assignable'], {
  unique: true,
})
@Index('UQ_rbac_roles_id_kind', ['id', 'kind'], { unique: true })
export class RbacRole {
  @Column({ type: 'boolean', default: false })
  global_assignable: boolean;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Column({ type: 'enum', enum: ['STANDARD', 'PLATFORM'], default: 'STANDARD' })
  kind: RoleKind;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}

@Entity('rbac_permissions')
export class RbacPermission {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'varchar', length: 160 })
  label: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'is_dynamic', type: 'boolean', default: false })
  isDynamic: boolean;
}

@Entity('rbac_role_permissions')
export class RbacRolePermission {
  @PrimaryColumn({ type: 'int' })
  role_id: number;

  @PrimaryColumn({ type: 'varchar', length: 100 })
  permission_code: string;

  @Column({ type: 'enum', enum: ['OWN', 'SCOPE'], default: 'SCOPE' })
  resource_access: ResourceAccess;

  @Column({ type: 'boolean', default: false })
  include_descendants: boolean;

  @ManyToOne(() => RbacRole, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: Relation<RbacRole>;

  @ManyToOne(() => RbacPermission, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'permission_code', referencedColumnName: 'code' })
  permission: Relation<RbacPermission>;
}
