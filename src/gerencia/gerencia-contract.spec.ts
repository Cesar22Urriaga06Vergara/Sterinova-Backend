import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GerenciaAdministradoresController } from './gerencia-administradores.controller.js';
import { GerenciaAdministradoresService } from './gerencia-administradores.service.js';
import { CrearAdministradorDto } from './dto/administrador.dto.js';

describe('manager creation contract', () => {
  it('exposes identity and required role/scope fields in runtime OpenAPI without writing a file', async () => {
    const module = await Test.createTestingModule({
      controllers: [GerenciaAdministradoresController],
      providers: [{ provide: GerenciaAdministradoresService, useValue: {} }],
    }).compile();
    const app = module.createNestApplication();
    try {
      const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder().build(),
      );
      const schema = document.components!.schemas!.CrearAdministradorDto as {
        properties: Record<string, unknown>;
        required: string[];
      };
      for (const name of [
        'nombre',
        'email',
        'password',
        'role_id',
        'scope_id',
      ]) {
        expect(schema.properties).toHaveProperty(name);
        expect(schema.required).toContain(name);
      }
    } finally {
      await app.close();
    }
  });
  it('rejects missing membership and injected identity/status fields at the DTO boundary', async () => {
    const dto = plainToInstance(CrearAdministradorDto, {
      nombre: 'Admin',
      email: 'admin@example.test',
      password: 'Testing-only-2026!',
      activo: true,
      password_hash: 'injected',
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining([
        'role_id',
        'scope_id',
        'activo',
        'password_hash',
      ]),
    );
  });
});
