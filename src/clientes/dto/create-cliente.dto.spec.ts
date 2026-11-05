import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateClienteDto } from './create-cliente.dto.js';

describe('CreateClienteDto validation', () => {
  it('accepts a blank email for historical imports with no email column', async () => {
    const dto = plainToInstance(CreateClienteDto, {
      razon_social: 'Cliente histórico',
      nit: '900123456',
      contacto: 'No registra',
      telefono: 'No registra',
      email: '',
      direccion: 'No registra',
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a malformed non-empty email', async () => {
    const dto = plainToInstance(CreateClienteDto, {
      razon_social: 'Cliente histórico',
      nit: '900123456',
      contacto: 'No registra',
      telefono: 'No registra',
      email: 'correo-invalido',
      direccion: 'No registra',
    });

    const errors = await validate(dto);

    expect(errors.map(({ property }) => property)).toContain('email');
  });
});
