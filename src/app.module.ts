import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ClientesModule } from './clientes/clientes.module.js';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module.js';
import { LogisticaModule } from './logistica/logistica.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { PlantaModule } from './planta/planta.module.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { CalidadModule } from './calidad/calidad.module.js';
import { CertificadosModule } from './certificados/certificados.module.js';
import { STERINOVA_ENTITIES } from './database/entities.js';
import { PdfModule } from './pdf/pdf.module.js';
import { FormatosDocumentalesModule } from './formatos-documentales/formatos-documentales.module.js';
import { AuditoriaModule } from './auditoria/auditoria.module.js';
import { SellosModule } from './sellos/sellos.module.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : { transport: { target: 'pino-pretty', options: { colorize: true, singleLine: true } } }),
        genReqId: (_request, response) => {
          const correlationId = randomUUID();
          response.setHeader('x-correlation-id', correlationId);
          return correlationId;
        },
        customProps: (request) => ({ correlation_id: request.id }),
        serializers: {
          req: (request) => ({
            id: request.id,
            method: request.method,
            url: request.url?.split('?')[0],
          }),
          res: (response) => ({ statusCode: response.statusCode }),
        },
        redact: {
          paths: [
            'password', '*.password', '*.password.*',
            'token', '*.token', '*.token.*',
            'access_token', '*.access_token',
            'refresh_token', '*.refresh_token',
            'authorization', '*.authorization',
            'cookie', '*.cookie',
          ],
          censor: '[REDACTED]',
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: STERINOVA_ENTITIES,
        synchronize: false,
        migrationsRun: false,
        migrationsTableName: 'typeorm_migrations',
      }),
    }),
    // TODO: Cambiar a Redis en producción
    CacheModule.register({ isGlobal: true }),
    UsersModule,
    AuthModule,
    ClientesModule,
    CotizacionesModule,
    LogisticaModule,
    PlantaModule,
    CertificadosModule,
    CalidadModule,
    PdfModule,
    FormatosDocumentalesModule,
    AuditoriaModule,
    SellosModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
