import type { CicloEsterilizacion } from '../../src/planta/entities/ciclo-esterilizacion.entity.js';

export const protocolRows = [
  {
    parametro: 'temperatura',
    unidad: '°C',
    opciones: ['Rango 50 - 60'],
    aplicable: true,
  },
  {
    parametro: 'humedad',
    unidad: '%',
    opciones: ['Rango 30 - 80'],
    aplicable: true,
  },
  {
    parametro: 'presion',
    unidad: 'inHg',
    opciones: ['Rango -10 a -4'],
    aplicable: true,
  },
  {
    parametro: 'tiempo_exposicion',
    unidad: 'min',
    opciones: ['180 min'],
    aplicable: true,
  },
  {
    parametro: 'tiempo_aireacion',
    unidad: null,
    opciones: ['Rango 9 -20'],
    aplicable: true,
  },
];
export const qualityEvaluations = protocolRows.map((row) => ({
  parametro: row.parametro,
  criterio: 'CUMPLE' as const,
  opcion: 0,
}));
export const materialFixture = {
  id: 1,
  posicion: 1,
  descripcion: 'Material',
  referencia: 'REF',
  lote: 'L1',
  empaque: 'BOLSA',
  cantidad: 39,
  muestras_retencion: 0,
  muestras_cliente: null,
  muestras_laboratorio: null,
};
export function operationalCycle(
  overrides: Record<string, unknown> = {},
): CicloEsterilizacion {
  return {
    id: 12,
    orden_id: 90,
    metodo: 'ETO',
    equipo: 'E03',
    temperatura: 55,
    humedad: 70,
    presion: -5,
    tiempo_exposicion: 180,
    tiempo_aireacion: 10,
    fecha_esterilizacion: '2024-02-29',
    protocolo_version_id: 1,
    protocolo_version: {
      id: 1,
      version: 1,
      metodo: 'ETO',
      especificaciones_json: { filas: protocolRows },
    },
    orden: { id: 90, materiales: [materialFixture] },
    ...overrides,
  } as unknown as CicloEsterilizacion;
}
