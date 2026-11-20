import 'reflect-metadata';
import { Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';
import { AmbitoModule } from './ambitos.module.js';
import { AmbitoService } from './ambito.service.js';

describe('AmbitoModule', () => {
  it('resuelve el servicio y sus repositorios sin conectar a la base de datos', async () => {
    const repository = { find: vi.fn().mockResolvedValue([]) };
    const dataSource = {
      entityMetadatas: [],
      options: { type: 'mariadb' },
      getRepository: vi.fn().mockReturnValue(repository),
    };
    @Global()
    @Module({
      providers: [{ provide: DataSource, useValue: dataSource }],
      exports: [DataSource],
    })
    class TestDatabaseModule {}

    const module = await Test.createTestingModule({
      imports: [TestDatabaseModule, AmbitoModule],
    }).compile();
    try {
      expect(module.get(AmbitoService)).toBeInstanceOf(AmbitoService);
      expect(repository.find).not.toHaveBeenCalled();
    } finally {
      await module.close();
    }
  });
});
