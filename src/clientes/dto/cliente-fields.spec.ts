import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateClienteDto } from './create-cliente.dto.js';
import { UpdateClienteDto } from './update-cliente.dto.js';

describe('Cliente cargo and ciudad validation', () => {
  it('accepts omitted optional fields on create', async () => {
    const dto = plainToInstance(CreateClienteDto, {
      razon_social: 'Cliente',
      nit: '900123456',
      contacto: 'Ana',
      telefono: '123',
      email: 'ana@example.com',
      direccion: 'Calle 1',
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('accepts cargo and ciudad as optional string fields', async () => {
    const dto = plainToInstance(CreateClienteDto, {
      razon_social: 'Cliente',
      nit: '900123456',
      contacto: 'Ana',
      telefono: '123',
      email: 'ana@example.com',
      direccion: 'Calle 1',
      cargo: 'Compras',
      ciudad: 'Bogotá',
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects non-string optional fields on update', async () => {
    const dto = plainToInstance(UpdateClienteDto, {
      cargo: 123,
      ciudad: false,
    });

    expect((await validate(dto)).map(({ property }) => property)).toEqual([
      'cargo',
      'ciudad',
    ]);
  });
});
