import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCicloDto } from './create-ciclo.dto.js';

describe('CreateCicloDto validation', () => {
  it('transforms numeric process parameters and accepts a valid cycle', async () => {
    const dto = plainToInstance(CreateCicloDto, {
      orden_id: '21',
      equipo: 'CICLO 10M68',
      metodo: 'ETO',
      temperatura: '45',
      humedad: '60',
      presion: '1.2',
      tiempo_exposicion: '120',
      tiempo_aireacion: '30',
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
    });

    expect(await validate(dto)).toHaveLength(0);
    expect(dto.orden_id).toBe(21);
    expect(dto.temperatura).toBe(45);
  });

  it('rejects unsupported methods and non-numeric process parameters', async () => {
    const dto = plainToInstance(CreateCicloDto, {
      orden_id: 21,
      equipo: 'CICLO 10M68',
      metodo: 'OZONO',
      temperatura: 'alta',
      humedad: 60,
      presion: 1.2,
      tiempo_exposicion: 120,
      tiempo_aireacion: 30,
      control_biologico: 'Negativo',
      control_quimico: 'Cambio de color',
    });

    const errors = await validate(dto);

    expect(errors.map(({ property }) => property)).toEqual(
      expect.arrayContaining(['metodo', 'temperatura']),
    );
  });
});
