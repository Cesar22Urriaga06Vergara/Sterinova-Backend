import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import type { Request } from 'express';
import { PermissionGuard } from '../rbac/authorization.guard.js';
import { RbacAuthorizationService } from '../rbac/rbac-authorization.service.js';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../test/fixtures/legacy-user-role.js';
import { AuditoriaController } from './auditoria.controller.js';
import { AuditoriaService } from './auditoria.service.js';

describe('AuditoriaController', () => {
  it('requires auditoria.ver even for a legacy Admin', async () => {
    const guard = new PermissionGuard(new Reflector(), {getContext:async()=>{throw new ForbiddenException();}} as never);
    const context = {
      getHandler: () => AuditoriaController.prototype.findAll,
      getClass: () => AuditoriaController,
      switchToHttp: () => ({ getRequest: () => ({ user: { id:7, rol: UserRole.ADMIN } }) }),
    } as never;

    await expect(guard.canActivate(context)).rejects.toMatchObject({status:403});
  });

  it('returns HTTP 403 to a Comercial user requesting GET /auditoria', async () => {
    const module = await Test.createTestingModule({
      controllers: [AuditoriaController],
      providers: [
        { provide: AuditoriaService, useValue: { findAll: vi.fn() } },
        { provide: APP_GUARD, useClass: PermissionGuard },
        { provide: RbacAuthorizationService, useValue: {getContext:async()=>{throw new ForbiddenException();}} },
      ],
    }).compile();
    const app = module.createNestApplication();
    app.use((req: Request & { user?: unknown }, _res: unknown, next: () => void) => {
      req.user = { id:7 };
      next();
    });
    await app.init();

    await request(app.getHttpServer()).get('/auditoria').expect(403);
    await app.close();
  });
});
