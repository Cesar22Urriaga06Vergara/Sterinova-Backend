import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { DataSource, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { User } from './entities/user.entity.js';
import { PasswordResetToken } from './entities/password-reset-token.entity.js';

const TOKEN_TTL_MS = 15 * 60 * 1000;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly auditoria: AuditoriaService,
  ) {}

  async requestReset(
    userId: number,
    actorId: number,
  ): Promise<{ reset_token: string; expires_at: Date }> {
    if (userId === 1) {
      throw new ForbiddenException('Esta cuenta requiere el procedimiento de recuperación protegido');
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
    await this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const user = await users.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) throw new NotFoundException('Usuario inexistente');
      if (!user.activo) {
        throw new ForbiddenException('No se puede restablecer una cuenta inactiva');
      }

      const tokens = manager.getRepository(PasswordResetToken);
      await tokens.update(
        { user_id: userId, used_at: IsNull() },
        { used_at: new Date() },
      );
      await tokens.save(
        tokens.create({
          user_id: userId,
          token_hash: hashToken(token),
          created_by: actorId,
          expires_at: expiresAt,
          used_at: null,
        }),
      );
      await this.auditoria.create(
        {
          usuario_id: actorId,
          entidad: 'usuarios',
          entidad_id: userId,
          accion: AccionAuditoria.RESETEAR_PASSWORD,
          detalle: { motivo: 'restablecimiento_solicitado', target_user_id: userId },
        },
        manager,
      );
    });

    return { reset_token: token, expires_at: expiresAt };
  }

  async completeReset(
    token: string,
    password: string,
  ): Promise<{ actualizado: true }> {
    if (token.length < 32 || token.length > 128) {
      throw new UnauthorizedException('Enlace inválido o expirado');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const tokenHash = hashToken(token);

    await this.dataSource.transaction(async (manager) => {
      const tokens = manager.getRepository(PasswordResetToken);
      const reset = await tokens.findOne({
        where: { token_hash: tokenHash, used_at: IsNull() },
        lock: { mode: 'pessimistic_write' },
      });
      const now = new Date();
      if (!reset || reset.expires_at <= now) {
        throw new UnauthorizedException('Enlace inválido o expirado');
      }

      const users = manager.getRepository(User);
      const user = await users.findOne({
        where: { id: reset.user_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user || !user.activo || user.id === 1) {
        throw new UnauthorizedException('Enlace inválido o expirado');
      }

      user.password_hash = passwordHash;
      user.password_version = (user.password_version ?? 0) + 1;
      await users.save(user);

      reset.used_at = now;
      await tokens.save(reset);
      await tokens.update(
        { user_id: user.id, used_at: IsNull() },
        { used_at: now },
      );
      await this.auditoria.create(
        {
          usuario_id: user.id,
          entidad: 'usuarios',
          entidad_id: user.id,
          accion: AccionAuditoria.RESETEAR_PASSWORD,
          detalle: {
            motivo: 'restablecimiento_completado',
            target_user_id: user.id,
            initiated_by: reset.created_by,
          },
        },
        manager,
      );
    });

    return { actualizado: true };
  }
}
