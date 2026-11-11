import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';

interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
  password_version?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    const secret =
      configService.get<string>('JWT_SECRET') ??
      process.env.JWT_SECRET;

    if (!secret?.trim()) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findActiveById(payload.sub);
    if (!user) throw new UnauthorizedException('Usuario inactivo o inexistente');
    if (
      !Number.isSafeInteger(payload.password_version) ||
      payload.password_version !== user.password_version
    ) {
      throw new UnauthorizedException('Credenciales actualizadas; inicia sesión nuevamente');
    }
    return {
      id: user.id,
      email: user.email,
      rol: user.rol,
      password_version: user.password_version,
    };
  }
}
