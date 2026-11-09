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
import type { ScopeKind } from '../authorization.types.js';

@Entity('rbac_scopes')
@Index('UQ_rbac_scopes_code', ['code'], { unique: true })
@Index('UQ_rbac_scopes_id_kind', ['id', 'kind'], { unique: true })
@Index('UQ_rbac_scopes_global_slot', ['global_slot'], { unique: true })
@Index('IDX_rbac_scopes_parent_active', ['parent_id', 'active'])
@Check(
  'CHK_rbac_scopes_root',
  "(kind = 'GLOBAL' AND parent_id IS NULL) OR (kind <> 'GLOBAL' AND parent_id IS NOT NULL)",
)
export class RbacScope {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Column({ type: 'enum', enum: ['GLOBAL', 'DEPARTMENT', 'TEAM', 'PLANT'] })
  kind: ScopeKind;

  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

  @ManyToOne(() => RbacScope, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'parent_id' })
  parent: Relation<RbacScope> | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({
    type: 'tinyint',
    nullable: true,
    asExpression: "CASE WHEN kind = 'GLOBAL' THEN 1 ELSE NULL END",
    generatedType: 'VIRTUAL',
    select: false,
    insert: false,
    update: false,
  })
  global_slot: number | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}

@Entity('rbac_scope_closure')
@Index('IDX_rbac_closure_descendant', ['descendant_id', 'ancestor_id'])
@Check(
  'CHK_rbac_closure_depth',
  '(ancestor_id = descendant_id AND depth = 0) OR (ancestor_id <> descendant_id AND depth > 0)',
)
export class RbacScopeClosure {
  @PrimaryColumn({ type: 'int' })
  ancestor_id: number;

  @PrimaryColumn({ type: 'int' })
  descendant_id: number;

  @Column({ type: 'int', unsigned: true })
  depth: number;

  @ManyToOne(() => RbacScope, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ancestor_id' })
  ancestor: Relation<RbacScope>;

  @ManyToOne(() => RbacScope, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'descendant_id' })
  descendant: Relation<RbacScope>;
}
