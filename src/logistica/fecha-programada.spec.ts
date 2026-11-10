import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { getMetadataArgsStorage } from 'typeorm';
import { readFileSync } from 'node:fs';
import { CreateOrdenDto } from './dto/create-orden.dto.js';
import { LogisticaService } from './logistica.service.js';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';

@Controller('logistica/ordenes')
class ContractController {
  @Post()
  create(@Body() dto: CreateOrdenDto) {
    return dto;
  }
}

describe('fecha_programada: contrato DATE', () => {
  const pipe = new ValidationPipe({ transform: true, whitelist: true });
  it.each(['2028-02-29', '2026-11-10'])(
    'acepta la fecha civil %s',
    async (fecha) => {
      const dto = await pipe.transform(
        { cotizacion_id: 1, fecha_programada: fecha },
        {
          type: 'body',
          metatype: CreateOrdenDto,
        },
      );
      expect(dto.fecha_programada).toBe(fecha);
    },
  );

  it.each([
    '2026-02-29',
    '2026-04-31',
    '2026-11-10T00:00:00Z',
    '2026-11-10T23:30:00-05:00',
    '2026-11-10 12:00:00',
    '10/11/2026',
    '',
    null,
    undefined,
  ])('rechaza %s en HTTP y antes de abrir una transacción', async (fecha) => {
    await expect(
      pipe.transform(
        { cotizacion_id: 1, fecha_programada: fecha },
        {
          type: 'body',
          metatype: CreateOrdenDto,
        },
      ),
    ).rejects.toMatchObject({ status: 400 });
    const source = { transaction: vi.fn() };
    const service = new LogisticaService(
      {} as never,
      {} as never,
      source as never,
      {} as never,
    );
    await expect(
      service.createOrden({
        cotizacion_id: 1,
        fecha_programada: fecha as string,
      }),
    ).rejects.toMatchObject({ status: 400 });
    expect(source.transaction).not.toHaveBeenCalled();
  });

  it('persiste y devuelve el mismo día sin conversiones horarias', async () => {
    const fecha = '2028-02-29';
    const orders = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce(null)
        .mockImplementation(async () => saved),
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => {
        saved = { id: 7, ...value };
        return saved;
      }),
    };
    let saved: Record<string, unknown>;
    const manager = {
      query: vi.fn(),
      getRepository: (entity: { name: string }) => {
        if (entity.name === 'OrdenServicio') return orders;
        if (entity.name === 'Cotizacion')
          return {
            findOne: async () => ({ estado: 'APROBADA', tipo_servicio: 'ETO' }),
          };
        if (entity.name === 'CotizacionItem') return { find: async () => [] };
        return { findOne: async () => ({ ultimo_valor: '0' }) };
      },
    };
    const service = new LogisticaService(
      orders as never,
      {} as never,
      { transaction: async (work) => work(manager) } as never,
      {} as never,
    );
    const result = await service.createOrden({
      cotizacion_id: 1,
      fecha_programada: fecha,
    });
    expect(orders.save).toHaveBeenCalledWith(
      expect.objectContaining({ fecha_programada: fecha }),
    );
    expect(result.fecha_programada).toBe(fecha);
    expect(
      getMetadataArgsStorage().columns.find(
        (c) =>
          c.target === OrdenServicio && c.propertyName === 'fecha_programada',
      )?.options.type,
    ).toBe('date');
  });

  it('publica el formato y la restricción de fecha en el artefacto OpenAPI', () => {
    const contract = JSON.parse(
      readFileSync('docs/arquitectura/openapi.json', 'utf8'),
    );
    const schema = contract.components.schemas.CreateOrdenDto;
    expect(schema.required).toContain('fecha_programada');
    expect(schema.properties.fecha_programada).toMatchObject({
      type: 'string',
      format: 'date',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    });
  });

  it('mantiene el artefacto alineado con el esquema generado sin base de datos', async () => {
    const module = await Test.createTestingModule({
      controllers: [ContractController],
    }).compile();
    const app = module.createNestApplication();
    try {
      const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder().build(),
      );
      const artifact = JSON.parse(
        readFileSync('docs/arquitectura/openapi.json', 'utf8'),
      );
      expect(document.components?.schemas?.CreateOrdenDto).toEqual(
        artifact.components.schemas.CreateOrdenDto,
      );
    } finally {
      await app.close();
    }
  });
});
