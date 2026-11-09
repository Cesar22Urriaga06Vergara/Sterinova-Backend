import { BadRequestException } from '@nestjs/common';
import type { CicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import type { ProtocoloEsterilizacionVersion } from '../planta/entities/protocolo-esterilizacion-version.entity.js';
import type { EvaluacionParametroDto } from '../calidad/dto/evaluacion-parametro.dto.js';

type FilaProtocolo = {
  parametro: string;
  unidad: string | null;
  opciones: string[];
  aplicable: boolean;
};
const parametros = {
  ETO: [
    'temperatura',
    'humedad',
    'presion',
    'tiempo_exposicion',
    'tiempo_aireacion',
  ],
  VAPOR: [
    'temperatura',
    'tiempo_exposicion',
    'tiempo_secado',
    'humedad_presion',
    'tiempo_aireacion',
  ],
};
const noAplica = (parametro: string) => ({
  parametro,
  unidad: null as string | null,
  especificacion: 'N/A',
  resultado: 'N/A' as number | string,
  criterio: 'N/A',
});

function enRango(value: number, opcion: string) {
  const rango = opcion.match(
    /^Rango\s+(-?\d+(?:\.\d+)?)\s*(?:a\s+|-\s*)(-?\d+(?:\.\d+)?)/i,
  );
  if (rango) return value >= Number(rango[1]) && value <= Number(rango[2]);
  const numbers = opcion.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (opcion.includes('+/-') || opcion.includes('±'))
    return (
      numbers.length === 2 &&
      Math.abs(value - numbers[0]) <= Math.abs(numbers[1])
    );
  if (/^Rango /i.test(opcion))
    return numbers.length === 2 && value >= numbers[0] && value <= numbers[1];
  return numbers.length === 1 && value === numbers[0];
}

export function prepararInformacionTecnica(
  ciclo: CicloEsterilizacion,
  protocolo: ProtocoloEsterilizacionVersion,
  evaluaciones: EvaluacionParametroDto[],
) {
  if (!protocolo || protocolo.metodo !== ciclo.metodo)
    throw new BadRequestException('Protocolo incompatible con el ciclo');
  const filas = protocolo.especificaciones_json.filas as FilaProtocolo[];
  if (
    !Array.isArray(filas) ||
    filas.length !== 5 ||
    new Set(filas.map((f) => f.parametro)).size !== 5 ||
    filas.some(
      (f) =>
        !parametros[ciclo.metodo].includes(f.parametro) ||
        !Array.isArray(f.opciones) ||
        typeof f.aplicable !== 'boolean',
    )
  ) {
    throw new BadRequestException(
      'Protocolo sin las cinco filas válidas del método',
    );
  }
  const inputs = new Map(evaluaciones.map((e) => [e.parametro, e]));
  if (
    inputs.size !== evaluaciones.length ||
    evaluaciones.some(
      (e) => !filas.some((f) => f.parametro === e.parametro && f.aplicable),
    )
  )
    throw new BadRequestException(
      'Evaluaciones duplicadas o ajenas al protocolo',
    );
  const tablas = {
    ETO: parametros.ETO.map(noAplica),
    VAPOR: parametros.VAPOR.map(noAplica),
  };
  tablas[ciclo.metodo] = filas.map((fila) => {
    if (!fila.aplicable) return noAplica(fila.parametro);
    const evaluacion = inputs.get(fila.parametro);
    const especificacion = fila.opciones[evaluacion?.opcion ?? -1];
    const raw = (ciclo as unknown as Record<string, unknown>)[fila.parametro];
    const resultado = raw === null || raw === undefined ? NaN : Number(raw);
    if (
      !evaluacion ||
      evaluacion.criterio !== 'CUMPLE' ||
      !especificacion ||
      !Number.isFinite(resultado) ||
      !enRango(resultado, especificacion)
    ) {
      throw new BadRequestException(
        `Falta evaluación conforme al protocolo: ${fila.parametro}`,
      );
    }
    return {
      parametro: fila.parametro,
      unidad: fila.unidad,
      especificacion,
      resultado,
      criterio: 'CUMPLE',
    };
  });
  return {
    metodo: ciclo.metodo,
    protocolo_version_id: protocolo.id,
    protocolo_version: protocolo.version,
    especificaciones: protocolo.especificaciones_json,
    tablas,
  };
}
