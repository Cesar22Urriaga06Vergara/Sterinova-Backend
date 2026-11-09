import {
  Check,
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
import { User } from '../../users/entities/user.entity.js';
import type { ScopeKind } from '../authorization.types.js';
import { RbacRole, type RoleKind } from './role.entity.js';
import { RbacScope } from './scope.entity.js';

@Entity('rbac_user_role_assignments')
@Index(
  'UQ_rbac_assignment_user_role_scope',
  ['user_id', 'role_id', 'scope_id'],
  { unique: true },
)
@Index('IDX_rbac_assignment_user_active', ['user_id', 'active'])
@Index('IDX_rbac_assignment_scope_active_role', [
  'scope_id',
  'active',
  'role_id',
])
@Check('CHK_rbac_assignment_role', "role_kind = 'STANDARD'")
@Check('CHK_rbac_assignment_scope', "scope_kind <> 'GLOBAL'")
export class RbacUserRoleAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'int' })
  role_id: number;

  @Column({ type: 'enum', enum: ['STANDARD', 'PLATFORM'], default: 'STANDARD' })
  role_kind: RoleKind;

  @ManyToOne(() => RbacRole, { onDelete: 'RESTRICT' })
  @JoinColumn([
    { name: 'role_id', referencedColumnName: 'id' },
    { name: 'role_kind', referencedColumnName: 'kind' },
  ])
  role: Relation<RbacRole>;

  @Column({ type: 'int' })
  scope_id: number;

  @Column({ type: 'enum', enum: ['GLOBAL', 'DEPARTMENT', 'TEAM', 'PLANT'] })
  scope_kind: ScopeKind;

  @ManyToOne(() => RbacScope, { onDelete: 'RESTRICT' })
  @JoinColumn([
    { name: 'scope_id', referencedColumnName: 'id' },
    { name: 'scope_kind', referencedColumnName: 'kind' },
  ])
  scope: Relation<RbacScope>;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}

@Entity('rbac_platform_owner')
@Index('UQ_rbac_platform_owner_user', ['user_id'], { unique: true })
@Check('CHK_rbac_platform_owner_singleton', 'id = 1')
@Check('CHK_rbac_platform_owner_role', "role_kind = 'PLATFORM'")
@Check('CHK_rbac_platform_owner_scope', "scope_kind = 'GLOBAL'")
export class RbacPlatformOwner {
  @PrimaryColumn({ type: 'tinyint', default: 1 })
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'int' })
  role_id: number;

  @Column({ type: 'enum', enum: ['STANDARD', 'PLATFORM'], default: 'PLATFORM' })
  role_kind: RoleKind;

  @ManyToOne(() => RbacRole, { onDelete: 'RESTRICT' })
  @JoinColumn([
    { name: 'role_id', referencedColumnName: 'id' },
    { name: 'role_kind', referencedColumnName: 'kind' },
  ])
  role: Relation<RbacRole>;

  @Column({ type: 'int' })
  scope_id: number;

  @Column({
    type: 'enum',
    enum: ['GLOBAL', 'DEPARTMENT', 'TEAM', 'PLANT'],
    default: 'GLOBAL',
  })
  scope_kind: ScopeKind;

  @ManyToOne(() => RbacScope, { onDelete: 'RESTRICT' })
  @JoinColumn([
    { name: 'scope_id', referencedColumnName: 'id' },
    { name: 'scope_kind', referencedColumnName: 'kind' },
  ])
  scope: Relation<RbacScope>;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
