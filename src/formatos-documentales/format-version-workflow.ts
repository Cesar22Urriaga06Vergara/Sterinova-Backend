import { EstadoVersionFormato } from './entities/formato-versiones.entity.js';

const transitions: Record<
  EstadoVersionFormato,
  readonly EstadoVersionFormato[]
> = {
  [EstadoVersionFormato.BORRADOR]: [EstadoVersionFormato.EN_REVISION],
  [EstadoVersionFormato.EN_REVISION]: [
    EstadoVersionFormato.BORRADOR,
    EstadoVersionFormato.APROBADA,
  ],
  [EstadoVersionFormato.APROBADA]: [
    EstadoVersionFormato.EN_REVISION,
    EstadoVersionFormato.PUBLICADA,
  ],
  [EstadoVersionFormato.PUBLICADA]: [EstadoVersionFormato.OBSOLETA],
  [EstadoVersionFormato.OBSOLETA]: [],
};

export function canTransitionFormatVersion(
  current: EstadoVersionFormato,
  next: EstadoVersionFormato,
): boolean {
  return transitions[current].includes(next);
}

export function canObsoleteFormatVersion(
  isCurrent: boolean,
  hasActiveAssignments: boolean,
): boolean {
  return !isCurrent && !hasActiveAssignments;
}
