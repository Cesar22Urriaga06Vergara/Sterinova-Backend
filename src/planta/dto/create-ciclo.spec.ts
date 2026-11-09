import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCicloDto } from './create-ciclo.dto.js';

const base = {
  orden_id: 1,
  equipo: 'E03',
  metodo: 'ETO',
  temperatura: 55,
  humedad: 70,
  presion: -5,
  tiempo_exposicion: 180,
  tiempo_aireacion: 10,
  fecha_esterilizacion: '2024-02-29',
  control_biologico: 'Negativo',
  control_quimico: 'Cambio',
};
it('acepta presión negativa EtO', async () => {
  expect(await validate(plainToInstance(CreateCicloDto, base))).toEqual([]);
});
it('exige fecha y secado de vapor sin exigir aireación', async () => {
  const dto = plainToInstance(CreateCicloDto, {
    ...base,
    metodo: 'VAPOR',
    presion: null,
    humedad: null,
    tiempo_aireacion: null,
    tiempo_secado: 15,
  });
  expect(await validate(dto)).toEqual([]);
  expect(
    (
      await validate(
        plainToInstance(CreateCicloDto, {
          ...base,
          fecha_esterilizacion: undefined,
        }),
      )
    ).length,
  ).toBeGreaterThan(0);
});
