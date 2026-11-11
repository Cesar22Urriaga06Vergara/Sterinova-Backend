import { RequireSession } from '../rbac/require-session.decorator.js';
import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RbacAuthorizationService } from '../rbac/rbac-authorization.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { PasswordResetService } from '../users/password-reset.service.js';
import { CompletePasswordResetDto } from '../users/dto/complete-password-reset.dto.js';

type LoginRequest = Request & { ip: string };

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditoriaService: AuditoriaService,
    private readonly authorization: RbacAuthorizationService,
    private readonly passwordReset: PasswordResetService,
  ) {}

  @Get('me')
  @RequireSession()
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-scope-id',
    required: false,
    description:
      'Ámbito autorizado seleccionado; omitir para descubrir ámbitos disponibles.',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiResponse({
    status: 200,
    description:
      'Identidad pública, permisos, capacidades por ámbito y selección actual',
  })
  @ApiResponse({
    status: 401,
    description: 'Sesión inválida o usuario inactivo',
  })
  @ApiResponse({ status: 403, description: 'Ámbito no autorizado' })
  @Header('Cache-Control', 'private, no-store')
  @ApiOperation({
    summary: 'Identidad, capacidades y ámbito de la sesión actual',
  })
  me(@Req() request: Request & { user: { id: number } }) {
    return this.authorization.getSession(
      request.user.id,
      request.headers['x-scope-id'],
    );
  }

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
      await this.recordLogin({
        usuario_id: null,
        entidad: 'auth',
        entidad_id: null,
        accion: AccionAuditoria.LOGIN_FALLIDO,
        detalle: {
          ip: request.ip,
          user_agent: request.get('user-agent') ?? null,
        },
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const result = this.authService.login(user);
    await this.recordLogin({
      usuario_id: user.id,
      entidad: 'auth',
      entidad_id: user.id,
      accion: AccionAuditoria.LOGIN_EXITOSO,
      detalle: {
        ip: request.ip,
        user_agent: request.get('user-agent') ?? null,
      },
    });
    return result;
  }

  @Post('password/reset')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Completar restablecimiento con token de un solo uso' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada' })
  @ApiResponse({ status: 401, description: 'Enlace inválido o expirado' })
  completePasswordReset(@Body() dto: CompletePasswordResetDto) {
    return this.passwordReset.completeReset(dto.token, dto.password);
  }

  private async recordLogin(entry: Parameters<AuditoriaService['create']>[0]) {
    try {
      await this.auditoriaService.create(entry);
    } catch {
      /* Auditoría no cambia el resultado de autenticación. */
    }
  }
}
