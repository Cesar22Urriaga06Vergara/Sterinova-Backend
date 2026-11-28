import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import express from 'express';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'node:path';
import { AppModule } from './app.module.js';
import { persistOpenApiDocument } from './openapi/persist-openapi-document.js';
import { getAllowedCorsOrigins } from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false, bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const allowedOrigins = getAllowedCorsOrigins(process.env.CORS_ORIGINS);
  const corsOrigin =
    allowedOrigins.length > 0
      ? allowedOrigins
      : process.env.NODE_ENV === 'production'
        ? false
        : ['http://localhost:3004'];
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const shouldExposeSwagger =
    process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true';
  if (shouldExposeSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sterinova API')
      .setDescription('Contrato HTTP del backend Sterinova')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    if (process.env.NODE_ENV !== 'production') {
      persistOpenApiDocument(
        swaggerDocument,
        resolve(process.cwd(), 'docs/arquitectura/openapi.json'),
      );
    }
    SwaggerModule.setup('api/docs', app, swaggerDocument);
  }

  await app.listen(Number(process.env.PORT ?? 3002));
}
await bootstrap();
