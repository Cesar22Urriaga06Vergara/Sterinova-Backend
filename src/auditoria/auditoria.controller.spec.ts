import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import type { Request } from 'express';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { AuditoriaController } from './auditoria.controller.js';
import { AuditoriaService } from './auditoria.service.js';

describe('AuditoriaController', () => {
  it('restricts audit queries to Admin', () => {
    const guard = new RolesGuard(new Reflector());
    const context = {
      getHandler: () => AuditoriaController.prototype.findAll,
      getClass: () => AuditoriaController,
      switchToHttp: () => ({ getRequest: () => ({ user: { rol: UserRole.COMERCIAL } }) }),
    } as never;

    expect(guard.canActivate(context)).toBe(false);
  });

  it('returns HTTP 403 to a Comercial user requesting GET /auditoria', async () => {
    const module = await Test.createTestingModule({
      controllers: [AuditoriaController],
      providers: [
        { provide: AuditoriaService, useValue: { findAll: vi.fn() } },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    const app = module.createNestApplication();
    app.use((req: Request & { user?: unknown }, _res: unknown, next: () => void) => {
      req.user = { rol: UserRole.COMERCIAL };
      next();
    });
    await app.init();

    await request(app.getHttpServer()).get('/auditoria').expect(403);
    await app.close();
  });
});
