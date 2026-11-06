import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { ModulesContainer } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import { resolve } from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { persistOpenApiDocument } from '../src/openapi/persist-openapi-document.js';

const requestMethodNames: Record<number, string> = {
  [RequestMethod.GET]: 'get',
  [RequestMethod.POST]: 'post',
  [RequestMethod.PUT]: 'put',
  [RequestMethod.DELETE]: 'delete',
  [RequestMethod.PATCH]: 'patch',
  [RequestMethod.OPTIONS]: 'options',
  [RequestMethod.HEAD]: 'head',
};

function asPaths(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [String(value ?? '')];
}

function normalizePath(path: string): string {
  return (
    `/${path}`
      .replace(/\/+/g, '/')
      .replace(/:([A-Za-z0-9_]+)/g, '{$1}')
      .replace(/\/$/, '') || '/'
  );
}

describe('OpenAPI route contract (e2e)', () => {
  it('matches every registered HTTP route and exposes no undocumented route', async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = moduleFixture.createNestApplication();

    try {
      const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('Sterinova API')
          .setVersion('1.0')
          .addBearerAuth()
          .build(),
      );
      persistOpenApiDocument(
        document,
        resolve(process.cwd(), 'docs/arquitectura/openapi.json'),
      );
      SwaggerModule.setup('api/docs', app, document);
      await app.init();
      const response = await request(app.getHttpServer())
        .get('/api/docs-json')
        .expect(200);
      const contract = response.body as typeof document;
      const documented = new Set<string>();
      for (const [path, operations] of Object.entries(contract.paths)) {
        for (const method of Object.keys(operations ?? {})) {
          documented.add(`${method.toLowerCase()} ${normalizePath(path)}`);
        }
      }

      const registered = new Set<string>();
      const modules = app.get(ModulesContainer);
      for (const moduleRef of modules.values()) {
        for (const wrapper of moduleRef.controllers.values()) {
          const controller = wrapper.metatype;
          if (!controller) continue;
          const controllerPaths = asPaths(
            Reflect.getMetadata(PATH_METADATA, controller),
          );
          for (const propertyName of Object.getOwnPropertyNames(
            controller.prototype,
          )) {
            const handler = controller.prototype[propertyName];
            if (typeof handler !== 'function') continue;
            const method = Reflect.getMetadata(METHOD_METADATA, handler) as
              number | undefined;
            if (method === undefined) continue;
            const verb = requestMethodNames[method];
            if (!verb) continue;
            const handlerPaths = asPaths(
              Reflect.getMetadata(PATH_METADATA, handler),
            );
            for (const controllerPath of controllerPaths) {
              for (const handlerPath of handlerPaths) {
                registered.add(
                  `${verb} ${normalizePath(`${controllerPath}/${handlerPath}`)}`,
                );
              }
            }
          }
        }
      }

      expect([...registered].filter((route) => !documented.has(route))).toEqual(
        [],
      );
      expect([...documented].filter((route) => !registered.has(route))).toEqual(
        [],
      );
    } finally {
      await app.close();
    }
  });
});
