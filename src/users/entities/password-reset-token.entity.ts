import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('password_reset_tokens')
@Index('UQ_password_reset_tokens_hash', ['token_hash'], { unique: true })
@Index('IDX_password_reset_tokens_user_used', ['user_id', 'used_at'])
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'char', length: 64 })
  token_hash: string;

  @Column({ type: 'int', nullable: true })
  created_by: number | null;

  @Column({ type: 'datetime' })
  expires_at: Date;

  @Column({ type: 'datetime', nullable: true })
  used_at: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
