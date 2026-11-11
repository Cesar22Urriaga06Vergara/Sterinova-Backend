import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetTokens1794413660000 implements MigrationInterface {
  name = 'CreatePasswordResetTokens1794413660000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TABLE password_reset_tokens (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      token_hash CHAR(64) NOT NULL,
      created_by INT NULL,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY UQ_password_reset_tokens_hash (token_hash),
      KEY IDX_password_reset_tokens_user_used (user_id, used_at),
      CONSTRAINT FK_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query('DROP TABLE password_reset_tokens');
  }
}
