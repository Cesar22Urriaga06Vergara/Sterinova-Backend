import {
  protocolRows,
  qualityEvaluations,
  operationalCycle,
} from '../../test/fixtures/operational-cycle.js';
import { prepararInformacionTecnica } from './informacion-tecnica.js';
const protocol = {
  id: 1,
  metodo: 'ETO',
  version: 1,
  especificaciones_json: { filas: protocolRows },
};
it('congela resultados reales y deja cinco filas N/A para el método inactivo', () => {
  const result = prepararInformacionTecnica(
    operationalCycle(),
    protocol as never,
    qualityEvaluations,
  );
  expect(result.tablas.ETO[0]).toMatchObject({
    resultado: 55,
    criterio: 'CUMPLE',
    especificacion: 'Rango 50 - 60',
  });
  expect(result.tablas.VAPOR).toHaveLength(5);
  expect(result.tablas.VAPOR.every((row) => row.resultado === 'N/A')).toBe(
    true,
  );
});
it('no aprueba resultados fuera de rango ni evaluaciones faltantes o duplicadas', () => {
  const ciclo = { metodo: 'ETO', temperatura: 70 } as never;
  const input = {
    parametro: 'temperatura',
    criterio: 'CUMPLE',
    opcion: 0,
  } as const;
  expect(() =>
    prepararInformacionTecnica(ciclo, protocol as never, [input]),
  ).toThrow();
  expect(() =>
    prepararInformacionTecnica(ciclo, protocol as never, []),
  ).toThrow();
  expect(() =>
    prepararInformacionTecnica(ciclo, protocol as never, [input, input]),
  ).toThrow();
});
