import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../src/auth/auth.controller.js';
import { AuthService } from '../src/auth/auth.service.js';
import { AuditoriaService } from '../src/auditoria/auditoria.service.js';

describe('Auth login throttling (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: { validateUser: vi.fn().mockResolvedValue(null) } },
        { provide: AuditoriaService, useValue: { create: vi.fn().mockResolvedValue(undefined) } },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns 429 after five login attempts from the same IP in one minute', async () => {
    const server = request(app.getHttpServer());

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await server.post('/auth/login').send({ email: 'user@example.com', password: 'wrong' }).expect(401);
    }

    await server.post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrong' })
      .expect(429);
  });
});
