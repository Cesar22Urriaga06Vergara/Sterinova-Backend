import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';

type LoginRequest = Request & { ip: string };

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Post('login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Token de acceso emitido' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 429, description: 'Límite de intentos excedido' })
  async login(@Body() loginDto: LoginDto, @Req() request: LoginRequest) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      await this.recordLogin({ usuario_id: null, entidad: 'auth', entidad_id: null, accion: AccionAuditoria.LOGIN_FALLIDO, detalle: { ip: request.ip, user_agent: request.get('user-agent') ?? null } });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const result = this.authService.login(user);
    await this.recordLogin({ usuario_id: user.id, entidad: 'auth', entidad_id: user.id, accion: AccionAuditoria.LOGIN_EXITOSO, detalle: { ip: request.ip, user_agent: request.get('user-agent') ?? null } });
    return result;
  }

  private async recordLogin(entry: Parameters<AuditoriaService['create']>[0]) {
    try { await this.auditoriaService.create(entry); } catch { /* Auditoría no cambia el resultado de autenticación. */ }
  }

}
